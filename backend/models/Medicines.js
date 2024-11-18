// backend/models/Medicines.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: String,
    role: String,
    description: String,
    warnings: String,
    precautions: String,
    image: String,
    reviews: [
      {
        user: String,
        comment: String,
        rating: Number
      }
    ],
    quantity: Number,
    price: Number
  });
  
module.exports = mongoose.model('Medicine', medicineSchema);