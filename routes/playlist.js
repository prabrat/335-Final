// routes/playlist.js
const express = require('express');
const router = express.Router();
const Playlist = require('../model/Playlist');

// Create a playlist
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Playlist name required' });

    const playlist = new Playlist({ name, movies: [] });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error('Create playlist error:', err);
    res.status(500).json({ error: 'Error creating playlist' });
  }
});

// Get all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    console.error('Get playlists error:', err);
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

// Get one playlist
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    console.error('Get playlist error:', err);
    res.status(500).json({ error: 'Error fetching playlist' });
  }
});

// Add movie to playlist
router.post('/:id/add', async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, title, genres = [], rating } = req.body;
    if (!movieId || !title) return res.status(400).json({ error: 'movieId and title required' });

    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    // avoid duplicate movieId (optional)
    const exists = playlist.movies.some(m => m.movieId === movieId);
    if (exists) return res.status(400).json({ error: 'Movie already in playlist' });

    playlist.movies.push({ movieId, title, genres, rating });
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    console.error('Add movie error:', err);
    res.status(500).json({ error: 'Could not add movie' });
  }
});

// Remove movie from playlist (optional)
router.delete('/:id/movie/:movieId', async (req, res) => {
  try {
    const { id, movieId } = req.params;
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    playlist.movies = playlist.movies.filter(m => m.movieId !== movieId);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    console.error('Remove movie error:', err);
    res.status(500).json({ error: 'Could not remove movie' });
  }
});

module.exports = router;
