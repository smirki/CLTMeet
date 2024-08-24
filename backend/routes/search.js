const express = require('express');
const searchService = require('../services/searchService');
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await searchService.searchUsers(req.query.q);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/recommendations/:userId', async (req, res) => {
    try {
        const users = await searchService.recommendUsers(req.params.userId);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
