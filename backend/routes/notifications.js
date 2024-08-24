const express = require('express');
const notificationService = require('../services/notificationService');
const router = express.Router();

router.post('/:userId', async (req, res) => {
    try {
        await notificationService.sendNotification(req.params.userId, req.body.message);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
