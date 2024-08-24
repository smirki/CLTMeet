const express = require('express');
const userService = require('../services/userService');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:userId/preferences', async (req, res) => {
    try {
        const user = await userService.updateUserPreferences(req.params.userId, req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
