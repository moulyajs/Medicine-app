const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
//app.use(express.static('backend/public'));
app.use('/images', express.static('public/images'));
// Load the medicine data
let medicineData = require(path.join(__dirname, 'data', 'medicines.json'));


// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Medicine API');
});

// Endpoint to get all medicines (for initial loading in the frontend)
app.get("/api/medicines", (req, res) => {
    res.status(200).json({
        success: true,
        data: medicineData.medicines
    });
});

// Endpoint to search for a specific medicine by name
app.get("/api/medicines/:name", (req, res) => {
    const { name } = req.params;

    // Search for medicines that match the query
    const medicines = medicineData.medicines.filter(med =>
        med.name.toLowerCase().includes(name.toLowerCase())
    );

    if (medicines.length > 0) {
        res.status(200).json({
            success: true,
            data: medicines
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Medicine not found'
        });
    }
});

// Endpoint to update reviews for a specific medicine
app.post('/api/medicines/:name/reviews', (req, res) => {
    const medicineName = req.params.name.toLowerCase();
    const { review } = req.body;

    // Find the specific medicine by name
    const medicine = medicineData.medicines.find(m =>
        m.name.toLowerCase() === medicineName
    );

    if (medicine) {
        // Add review if provided
        if (review) {
            medicine.reviews = medicine.reviews || [];
            medicine.reviews.push(review);

            // Save updated data to JSON file
            fs.writeFile(
                path.join(__dirname, 'data', 'medicines.json'),
                JSON.stringify(medicineData, null, 2),
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving review' });
                    }
                    res.status(200).json({
                        success: true,
                        message: 'Review added successfully',
                        reviews: medicine.reviews
                    });
                }
            );
        } else {
            res.status(400).json({ message: 'No review provided' });
        }
    } else {
        res.status(404).json({ message: 'Medicine not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});