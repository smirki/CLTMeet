const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const businessRoutes = require('./routes/businesses');
const eventRoutes = require('./routes/events');
const artistRoutes = require('./routes/artists');
const socialRoutes = require('./routes/social');
const searchRoutes = require('./routes/search');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
    origin: '*', // or specify your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cltmeet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/businesses', businessRoutes);
app.use('/events', eventRoutes);
app.use('/artists', artistRoutes);
app.use('/social', socialRoutes);
app.use('/search', searchRoutes);
app.use('/notifications', notificationRoutes);
app.use('/analytics', analyticsRoutes);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('sendMessage', async ({ chatId, senderId, content }) => {
        const message = await socialService.sendMessage(chatId, senderId, content);
        io.to(chatId).emit('newMessage', message);
    });
});

const PORT = process.env.PORT || 3009;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
