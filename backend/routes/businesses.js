const express = require('express');
const businessService = require('../services/businessService');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const businesses = await businessService.listBusinesses();
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:businessId', async (req, res) => {
    try {
        const business = await businessService.getBusinessById(req.params.businessId);
        res.json(business);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
