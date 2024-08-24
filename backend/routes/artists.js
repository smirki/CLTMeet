const express = require('express');
const artistService = require('../services/artistService');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const artists = await artistService.listArtists();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:artistId', async (req, res) => {
    try {
        const artist = await artistService.getArtistById(req.params.artistId);
        res.json(artist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
