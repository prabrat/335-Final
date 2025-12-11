// routes/playlist.js
const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');

// Get all playlists
router.get('/', async (req, res) => {
  try {
    const list = await Playlist.find().sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    console.error('Get playlists error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a playlist
router.post('/', async (req, res) => {
  try {
    const { title, movies = [] } = req.body;
    if (!title) return res.status(400).json({ error: 'Playlist title required' });

    const playlist = new Playlist({ title, movies });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error('Create playlist error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Optional: get single playlist
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).lean();
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    console.error('Get playlist error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
