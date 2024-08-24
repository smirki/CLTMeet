const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    reviews: [String],
    promotions: [String],
});

module.exports = mongoose.model('Business', BusinessSchema);
