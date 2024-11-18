// backend/models/Products.js
const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    usedFor: { type: String, required: true }
});

module.exports = mongoose.model('featuredMeds', productsSchema);
