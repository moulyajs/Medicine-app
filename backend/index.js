const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

// MongoDB Connection URI
const mongoURI = 'mongodb://localhost:27017/project';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a Medicine schema and model
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

const Medicine = mongoose.model('Medicine', medicineSchema);

// Define a Specialist schema and model
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

const Specialist = mongoose.model('Specialist', specialistSchema);



// API endpoint to get all medicines (for initial data fetch)
app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// API endpoint to search medicines by name
app.get('/api/medicines/search', async (req, res) => {
  try {
    const { name } = req.query;
    const medicines = await Medicine.find({
      name: { $regex: name, $options: 'i' }  // Case-insensitive search
    });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// API endpoint to get all specialists (for initial data fetch)
app.get('/api/specialists', async (req, res) => {
  try {
    const specialists = await Specialist.find();
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specialists' });
  }
});

// API endpoint to search specialists by specialty
app.get('/api/specialists/search', async (req, res) => {
  try {
    const { specialty } = req.query;
    const specialists = await Specialist.find({
      specialty: { $regex: specialty, $options: 'i' }  // Case-insensitive search
    });
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specialists' });
  }
});

// API endpoint to get a single specialist by ID
app.get('/api/specialists/:id', async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }
    res.json(specialist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specialist' });
  }
});

app.get('/api/specialists/:specialistId/doctors', async (req, res) => {
  try {
    // Fetch the specialist by ID, including their embedded doctors array
    const specialist = await Specialist.findById(req.params.specialistId);
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }
    // Send back the doctors array embedded in the specialist document
    res.json(specialist.doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// API endpoint to add a review to a specific medicine
app.post('/api/medicines/:name/reviews', async (req, res) => {
  try {
    const { name } = req.params;
    const { user, comment, rating } = req.body;
    const medicine = await Medicine.findOne({ name });
    if (medicine) {
      medicine.reviews.push({ user, comment, rating });
      await medicine.save(); // Save the updated medicine document
      res.json(medicine);
    } else {
      res.status(404).json({ error: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});
// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
