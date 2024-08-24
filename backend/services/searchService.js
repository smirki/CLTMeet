const User = require('../models/User');
const Business = require('../models/Business');
const Artist = require('../models/Artist');

async function searchUsers(query) {
    return await User.find({ name: new RegExp(query, 'i') });
}

async function recommendUsers(userId) {
    // Implement a recommendation logic
    return await User.find({ _id: { $ne: userId } }).limit(10); 
}

module.exports = { searchUsers, recommendUsers };
