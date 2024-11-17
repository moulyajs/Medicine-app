const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [String],
    ageRestrictions: [Number],
    allergyWarnings: [String],
    healthConditionWarnings: [String],
    sideEffects: {
        common: [String],
        serious: [String],
    },
    dosageInformation: [
        {
            ageRange: String,
            dosage: String,
        },
    ],
    interactionWarnings: [String],
    storageInstructions: String,
    pregnancyWarning: String,
    breastfeedingWarning: String,
});

module.exports = mongoose.model('Medication', medicationSchema);