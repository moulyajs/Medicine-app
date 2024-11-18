// models/faq.js
const mongoose = require('mongoose');

// Define the FAQ schema
const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  helpfulCount: { type: Number, default: 0 }, // Count of helpful votes
  notHelpfulCount: { type: Number, default: 0 } // Count of unhelpful votes
});

// Export the model
module.exports = mongoose.model('faq', faqSchema); // Model name remains 'FAQ'
