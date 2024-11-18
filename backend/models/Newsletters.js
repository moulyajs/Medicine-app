const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
    link: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('newsletters', letterSchema);
