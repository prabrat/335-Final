const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, 'credentialsDontPost/x.env') });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// connect to MongoDB
const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playlistsDB';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// mount playlist routes
const playlistRoutes = require('./routes/playlist');
app.use('/api/playlists', playlistRoutes);

// search API
const RAPID_KEY = process.env.RAPID_KEY;
const RAPID_HOST = "imdb236.p.rapidapi.com";
function connect() {
  return {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPID_HOST,
      "x-rapidapi-key": RAPID_KEY,
    }
  };
}

app.get('/api/search', async (req, res) => {
  const { title, genre, minRating } = req.query;
  try {
    const url = `https://${RAPID_HOST}/api/imdb/top250-movies`;
    const resp = await fetch(url, connect());
    const allMovies = await resp.json();
    const filtered = allMovies.filter(m => {
      let add = true;
      if (title) add = add && m.primaryTitle.toLowerCase().includes(title.toLowerCase());
      if (genre) add = add && m.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()));
      if (minRating) add = add && (m.averageRating >= Number(minRating));
      return add;
    });
    res.json(filtered);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.portNumber || 5002;
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
