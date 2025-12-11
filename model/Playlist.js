const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  movieId: String,       // e.g., imdb id
  title: String,
  genres: [String],
  rating: Number
}, { _id: false }); // small subdocs, optional

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  movies: { type: [MovieSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);