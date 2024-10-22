const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Load medicine data from JSON file
let medicineData = require('./data/medicines.json'); // Update the path to medicines.json

// Endpoint to search for a medicine
app.get('/api/medicines/:name', (req, res) => {
    const medicineName = req.params.name.toLowerCase();
    const medicine = medicineData.find(m => m.name.toLowerCase() === medicineName);
    
    if (medicine) {
        res.json(medicine);
    } else {
        res.status(404).json({ message: 'Medicine not found' });
    }
});

// Endpoint to update reviews for a medicine
app.post('/api/medicines/:name/reviews', (req, res) => {
    const medicineName = req.params.name.toLowerCase();
    const review = req.body.review;

    const medicine = medicineData.find(m => m.name.toLowerCase() === medicineName);

    if (medicine) {
        // If a review is provided, add it to the reviews array
        if (review) {
            if (!medicine.reviews) {
                medicine.reviews = []; // Initialize reviews if not present
            }
            medicine.reviews.push(review);

            // Save updated data back to the JSON file
            fs.writeFile('./data/medicines.json', JSON.stringify(medicineData, null, 2), (err) => { // Update the path to save
                if (err) {
                    return res.status(500).json({ message: 'Error saving review' });
                }
                res.status(200).json({ message: 'Review added successfully', reviews: medicine.reviews });
            });
        } else {
            // If no review is provided, just respond positively without saving
            res.status(200).json({ message: 'No review submitted. Medicine details retrieved.', reviews: medicine.reviews || [] });
        }
    } else {
        res.status(404).json({ message: 'Medicine not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});