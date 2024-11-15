const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
    text: { type: String, required: true }
});

module.exports = mongoose.model('HealthTips', healthTipSchema);
