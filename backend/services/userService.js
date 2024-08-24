const User = require('../models/User');

async function getUserById(userId) {
    return await User.findById(userId);
}

async function updateUserPreferences(userId, preferences) {
    const user = await User.findById(userId);
    user.preferences = preferences;
    await user.save();
    return user;
}

module.exports = { getUserById, updateUserPreferences };
