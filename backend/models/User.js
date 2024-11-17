const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { 
        type: String, 
        enum: ["Male", "Female", "Other", "Not specified"], 
        default: "Not specified" 
    },
    age: { type: Number, min: 0, default: null }, // Age must be non-negative
});

module.exports = mongoose.model("members", signupSchema);
