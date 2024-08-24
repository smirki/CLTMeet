const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: String,
    bio: String,
    portfolio: [String],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

module.exports = mongoose.model('Artist', ArtistSchema);
