const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const CARDS_PER_BATCH = 10;
const MAX_DISTANCE_KM = 100;

async function findPotentialMatches(userId) {
    const user = await User.findById(userId);
    console.log('User:', user);

    const query = {
        _id: { $ne: userId, $nin: user.seenUsers },
        matches: { $ne: userId },
        age: { $gte: user.preferences.minAge, $lte: user.preferences.maxAge },
        // Temporarily comment out gender and other filters to broaden matches
        // gender: user.preferences.gender
    };

    console.log('Query criteria without location:', query);

    const users = await User.find(query)
        .sort('_id')
        .limit(CARDS_PER_BATCH)
        .select('name age about location');

    console.log('Potential matches found:', users);

    return users;
}


async function swipeRight(userId, targetUserId) {
    const [user, targetUser] = await Promise.all([
        User.findById(userId),
        User.findById(targetUserId)
    ]);

    if (!user || !targetUser) {
        throw new Error('User not found');
    }

    if (!user.seenUsers.includes(targetUserId)) {
        user.seenUsers.push(targetUserId);
    }

    let isMatch = false;
    if (targetUser.notifications.includes(userId)) {
        user.matches.push(targetUserId);
        targetUser.matches.push(userId);
        targetUser.notifications = targetUser.notifications.filter(id => id.toString() !== userId.toString());
        isMatch = true;

        const chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
        });
        await chat.save();
    } else {
        targetUser.notifications.push(userId);
    }

    await Promise.all([user.save(), targetUser.save()]);

    const potentialMatches = await findPotentialMatches(userId);
    return { match: isMatch, potentialMatches };
}

async function swipeLeft(userId, targetUserId) {
    const user = await User.findById(userId);
    
    if (!user.seenUsers.includes(targetUserId)) {
        user.seenUsers.push(targetUserId);
    }

    await user.save();

    const potentialMatches = await findPotentialMatches(userId);
    return { potentialMatches };
}


async function getNotifications(userId) {
    const user = await User.findById(userId).populate('notifications', 'name');
    return user.notifications; // Return a list of users who sent match requests
}

async function acceptMatch(userId, targetUserId) {
    try {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            throw new Error('User not found');
        }

        user.matches.push(targetUserId);
        targetUser.matches.push(userId);

        // Remove notifications related to this match
        user.notifications = user.notifications.filter(id => id.toString() !== targetUserId.toString());
        targetUser.notifications = targetUser.notifications.filter(id => id.toString() !== userId.toString());

        // Create a new chat between the two users
        const chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
        });

        await chat.save();
        await user.save();
        await targetUser.save();

        return chat;
    } catch (error) {
        console.error(`Error accepting match between ${userId} and ${targetUserId}:`, error);
        throw error;
    }
}

async function denyMatch(userId, targetUserId) {
    const user = await User.findById(userId);

    // Remove the match request from notifications
    user.notifications = user.notifications.filter(id => id.toString() !== targetUserId.toString());

    await user.save();
    return user;
}

async function getMatchRequests(userId) {
    const user = await User.findById(userId).populate('notifications', 'name');
    return user.notifications; // This will return an array of incoming match requests
}

async function getMatches(userId) {
    const user = await User.findById(userId).populate('matches', 'name');

    // Outgoing match requests (people to whom the user sent requests)
    const outgoingRequests = await User.find({ notifications: userId }, 'name');

    // Incoming match requests (people who sent requests to the user)
    const incomingRequests = await getNotifications(userId);

    // Ensure no duplicate matches
    const uniqueMatches = Array.from(new Set(user.matches.map(match => match._id.toString())))
        .map(id => user.matches.find(match => match._id.toString() === id));

    return { matches: uniqueMatches, outgoingRequests, incomingRequests };
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
    chat.lastMessage = message;
    await chat.save();

    return message;
}

module.exports = {
    findPotentialMatches,
    swipeRight,
    swipeLeft,
    getNotifications,
    acceptMatch,
    denyMatch,
    getMatchRequests,
    getMatches,
    cancelRequest,
    removeMatch,
    listChats,
    sendMessage
};
