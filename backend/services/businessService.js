const Business = require('../models/Business');

async function listBusinesses() {
    return await Business.find({});
}

async function getBusinessById(businessId) {
    return await Business.findById(businessId);
}

module.exports = { listBusinesses, getBusinessById };
