const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

async function getMatches(userId) {
    const user = await User.findById(userId).populate('matches', 'name');
    const requests = await User.find({ notifications: userId }, 'name');

    // Ensure no duplicate matches
    const uniqueMatches = Array.from(new Set(user.matches.map(match => match._id.toString())))
        .map(id => user.matches.find(match => match._id.toString() === id));

    return { matches: uniqueMatches, requests };
}


async function cancelRequest(userId, targetUserId) {
    const targetUser = await User.findById(targetUserId);
    targetUser.notifications = targetUser.notifications.filter(id => id.toString() !== userId.toString());
    await targetUser.save();
    return targetUser;
}

async function removeMatch(userId, targetUserId) {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    user.matches = user.matches.filter(id => id.toString() !== targetUserId.toString());
    targetUser.matches = targetUser.matches.filter(id => id.toString() !== userId.toString());
    await user.save();
    await targetUser.save();
    return user;
}

async function listChats(userId) {
    return await Chat.find({ participants: userId })
        .populate('messages')
        .populate('participants', 'name') // Populate participants with names only
        .populate('lastMessage'); // Populate the last message
}


async function sendMessage(chatId, senderId, content) {
    const message = new Message({ chat: chatId, sender: senderId, content, timestamp: new Date() });
    await message.save();

    const chat = await Chat.findById(chatId);
    chat.messages.push(message);
    await chat.save();

    return message;
}

module.exports = { listChats, sendMessage, getMatches, cancelRequest, removeMatch };
