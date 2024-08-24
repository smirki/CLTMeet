const Artist = require('../models/Artist');

async function listArtists() {
    return await Artist.find({});
}

async function getArtistById(artistId) {
    return await Artist.findById(artistId);
}

module.exports = { listArtists, getArtistById };
