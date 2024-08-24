const express = require('express');
const peopleService = require('../services/peopleService');
const socialService = require('../services/socialService');
const router = express.Router();

router.get('/potential-matches/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { lastSeenUserId } = req.query;
        const potentialMatches = await peopleService.findPotentialMatches(userId, lastSeenUserId);
        res.json(potentialMatches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/swipe-right', async (req, res) => {
    const { userId, targetUserId } = req.body;
    try {
        const result = await peopleService.swipeRight(userId, targetUserId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/swipe-left', async (req, res) => {
    const { userId, targetUserId } = req.body;
    try {
        const result = await peopleService.swipeLeft(userId, targetUserId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/match-requests/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const matchRequests = await peopleService.getMatchRequests(userId);
        res.json(matchRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch all chats for a specific user
router.get('/chats/:userId', async (req, res) => {
    try {
        const chats = await socialService.listChats(req.params.userId);
        res.json(chats);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to load chats' }); // Return a more informative error message
    }
});

router.post('/accept-match', async (req, res) => {
    const { userId, targetUserId } = req.body;

    try {
        const chat = await peopleService.acceptMatch(userId, targetUserId);
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/deny-match', async (req, res) => {
    const { userId, targetUserId } = req.body;

    try {
        await peopleService.denyMatch(userId, targetUserId);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/matches/:userId', async (req, res) => {
    try {
        const { matches, requests } = await socialService.getMatches(req.params.userId);
        res.json({ matches, requests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load matches and requests' });
    }
});

router.post('/cancel-request', async (req, res) => {
    try {
        const { userId, targetUserId } = req.body;
        await socialService.cancelRequest(userId, targetUserId);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to cancel request' });
    }
});

router.post('/remove-match', async (req, res) => {
    try {
        const { userId, targetUserId } = req.body;
        await socialService.removeMatch(userId, targetUserId);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove match' });
    }
});



module.exports = router;
