const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();


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

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token, user: { _id: user._id, name: user.name, email: user.email } };
};

module.exports = { register, login };