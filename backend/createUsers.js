const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    about: String,
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    preferences: {
        minAge: { type: Number, default: 18 },
        maxAge: { type: Number, default: 100 },
        gender: String,
    },
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    seenUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    lastActive: { type: Date, default: Date.now },
});

UserSchema.index({ location: '2dsphere' });
const User = mongoose.model('User', UserSchema);

const register = async (name, email, password, age, gender, about, location) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        about,
        location: {
            type: 'Point',
            coordinates: location
        },
        preferences: {
            minAge: 18,
            maxAge: 100,
            gender: gender === 'male' ? 'female' : 'male'
        }
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token, user: { _id: user._id, name: user.name, email: user.email } };
};

const createUser = async (username, retries = 3) => {
    try {
        const location = [0, 0]; // Placeholder for coordinates, update with actual data if available

        const { user } = await register(
            username,
            `${username}@example.com`,
            username, // Using the username as the password for simplicity
            25, // Age
            'not specified', // Gender
            `User ${username} created for testing purposes.`,
            location // Coordinates
        );

        console.log(`User ${user.name} created successfully.`);
    } catch (error) {
        if (error.message === 'Email already in use') {
            console.log(`User ${username} already exists. Skipping creation.`);
        } else if (retries > 0) {
            console.log(`Failed to create user ${username}, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            await createUser(username, retries - 1);
        } else {
            console.error(`Failed to create user ${username}:`, error.message);
        }
    }
};

const createUsers = async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const users = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    for (const username of users) {
        await createUser(username);
    }

    await mongoose.disconnect();
};

createUsers().catch(error => console.error('Error in createUsers:', error));
