const axios = require('axios');

const BASE_URL = 'http://10.0.0.4:3009';

async function createUser(name, email, password, age, gender, about) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
            name,
            email,
            password,
            age,
            gender,
            about,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error.response?.data?.error || error.message);
        throw error;
    }
}

async function swipeRight(userId, targetUserId, token) {
    try {
        const response = await axios.post(`${BASE_URL}/social/swipe-right`, {
            userId,
            targetUserId,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error swiping right:', error.response?.data?.error || error.message);
        throw error;
    }
}

async function getNotifications(userId, token) {
    try {
        const response = await axios.get(`${BASE_URL}/social/chats/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.notifications || [];
    } catch (error) {
        console.error('Error getting notifications:', error.response?.data?.error || error.message);
        throw error;
    }
}

async function listChats(userId, token) {
    try {
        const response = await axios.get(`${BASE_URL}/social/chats/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error listing chats:', error.response?.data?.error || error.message);
        throw error;
    }
}

(async () => {
    try {
        // Create two users
        const user1 = await createUser('Alice', 'alice@example.com', 'password123', 25, 'female', 'About Alice');
        const user2 = await createUser('Bob', 'bob@example.com', 'password123', 30, 'male', 'About Bob');

        // Alice swipes right on Bob
        const aliceSwipe = await swipeRight(user1.user._id, user2.user._id, user1.token);
        console.log('Alice swiped right on Bob:', aliceSwipe.match ? 'It\'s a match!' : 'No match yet.');

        // Bob checks notifications to see if Alice swiped right on him
        const bobNotifications = await getNotifications(user2.user._id, user2.token);
        console.log('Bob notifications:', bobNotifications);

        // Bob swipes right on Alice
        const bobSwipe = await swipeRight(user2.user._id, user1.user._id, user2.token);
        console.log('Bob swiped right on Alice:', bobSwipe.match ? 'It\'s a match!' : 'No match yet.');

        // Alice checks notifications to see if Bob swiped right on her
        const aliceNotifications = await getNotifications(user1.user._id, user1.token);
        console.log('Alice notifications:', aliceNotifications);

        // If they matched, let's try to have them chat
        if (bobSwipe.match && aliceSwipe.match) {
            const aliceChats = await listChats(user1.user._id, user1.token);
            if (aliceChats.length > 0) {
                const chatId = aliceChats[0]._id;
                await sendMessage(chatId, user1.user._id, 'Hello Bob!', user1.token);
                await sendMessage(chatId, user2.user._id, 'Hello Alice!', user2.token);
                console.log('Messages sent between Alice and Bob.');
            } else {
                console.log('No chats found for Alice.');
            }
        } else {
            console.log('No match found between Alice and Bob.');
        }
    } catch (error) {
        console.error('An error occurred during the test:', error.message);
    }
})();
