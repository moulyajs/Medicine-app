// backend/models/Specialist.js
const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema({
  specialty: String,
  description: String,
  conditions: [String],
  image: String,
  doctors: [
    {
      name: String,
      qualification: String,
      available_time: String,
      experience: Number,
      image: String
    }
  ]
});
  
module.exports = mongoose.model('Specialist', specialistSchema);