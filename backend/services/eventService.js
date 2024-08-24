const Event = require('../models/Event');

async function listEvents() {
    return await Event.find({});
}

async function getEventById(eventId) {
    return await Event.findById(eventId);
}

async function createEvent(data) {
    const event = new Event(data);
    await event.save();
    return event;
}

module.exports = { listEvents, getEventById, createEvent };
