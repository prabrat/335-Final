const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  imdbId: String,
  title: { type: String, required: true },
  rating: Number,
  genres: [String],
  year: Number,
  runtime: Number
}, { _id: false });

const PlaylistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  movies: { type: [MovieSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);