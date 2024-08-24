const mongoose = require('mongoose');

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
    seenUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Seen users list
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    lastActive: { type: Date, default: Date.now },
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
