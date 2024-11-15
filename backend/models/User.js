const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "visitor"},
    })

const signupModel = mongoose.model("members", signupSchema);
module.exports = signupModel;