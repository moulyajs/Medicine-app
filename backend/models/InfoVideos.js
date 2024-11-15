const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true }
});

module.exports = mongoose.model('informationalvideos', videoSchema);
