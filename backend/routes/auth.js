const express = require('express');
const authService = require('../services/authService');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, gender, about, location } = req.body;
        const user = await authService.register(name, email, password, age, gender, about, location);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { token, user } = await authService.login(req.body.email, req.body.password);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;