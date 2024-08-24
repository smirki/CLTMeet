const express = require('express');
const eventService = require('../services/eventService');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const events = await eventService.listEvents();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:eventId', async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.eventId);
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
