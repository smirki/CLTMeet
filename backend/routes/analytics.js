const express = require('express');
const analyticsService = require('../services/analyticsService');
const router = express.Router();

router.post('/track', async (req, res) => {
    try {
        await analyticsService.trackUserActivity(req.body.userId, req.body.activity);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
