// /backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const signupModel = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
const Medicine = require("./models/Medicines");
const Specialist = require("./models/Specialist");

app.use(cors({
    origin: "http://localhost:3000",
    methods: 'GET,POST',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/images', express.static('public/images'));

const mongoURI = 'mongodb://localhost:27017/project'; 

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = 9000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/signup', (req, res) => { 
    const { fullName, email, username, password } = req.body;

    signupModel.findOne({ $or: [{ email }, { username }] })
        .then(existingUser => {
            if (existingUser) {
                if (existingUser.email === email) return res.status(400).json({ message: 'Email already in use.' });
                if (existingUser.username === username) return res.status(400).json({ message: 'Username already taken.' });
            }
            return bcrypt.hash(password, 10)
                .then((hash) => signupModel.create({ fullName, email, username, password: hash }))
                .then((newUser) => res.json(newUser))
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ message: 'An error occurred. Please try again.' });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred. Please try again.' });
        });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    signupModel.findOne({ $or: [{ username: username }, { email: username }] })
        .then((foundUser) => {
            if (!foundUser) return res.json("Username Failure");

            bcrypt.compare(password, foundUser.password, (err, response) => {
                if (err) return res.json("Password Failure");
                if (response) {
                    const logintoken = jwt.sign(
                        { id: foundUser._id, username: foundUser.username, email: foundUser.email, role: foundUser.role },
                        "jwt_secret_key", { expiresIn: '12h' }
                    );
                    res.cookie('token', logintoken);
                    return res.json("Success");
                } else {
                    return res.json("Incorrect Password!!");
                }
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Login failed. Please try again.' });
        });
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    signupModel.findOne({ email: email })
        .then((user) => {
            if (!user) return res.send({ Status: "User does not exist!!" });

            const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "10m" });
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: 'nrn061005@gmail.com', pass: 'mjwv zkan vxji ahem' }
            });

            const mailOptions = {
                from: 'nrn061005@gmail.com',
                to: email,
                subject: 'Dr.PillPilot - Reset your Password',
                html: `
                    <h1>Password Reset Request</h1>
                    <p> Thank you for working with Dr.PillPilot!! </p>
                    <p>Click the link below to reset your password. This link will expire in 10 minutes:</p>
                    <a href="http://localhost:3000/reset-password/${user._id}/${token}">
                        Reset Password
                    </a>
                    <p>If you did not request a password reset, you can ignore this email.</p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ Status: "Error sending email" });
                } else {
                    return res.send({ Status: "Success" });
                }
            });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
            return res.status(500).send({ Status: "Internal Server Error" });
        });
});

app.post('/reset-password/:id/:token', (req, res) => {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) return res.json({Status: "Error with token!!"});
        else
        {
            bcrypt.hash(newPassword, 10)
                .then((hash) => {
                    signupModel.findByIdAndUpdate({_id: id}, {password: hash})
                        .then((u) => {if (u) res.send({Status: "Success"}); else console.error("Error updating password:", err); })
                        .catch(err => res.send({Status: err}))
                })
        }
    })
})

app.get('/api/medicines', async (req, res) => {
    try 
    {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch medicines' }); }
});
  
// API endpoint to search medicines by name
app.get('/api/medicines/search', async (req, res) => {
    try 
    {
        const { name } = req.query;
        const medicines = await Medicine.find({
            name: { $regex: name, $options: 'i' }  // Case-insensitive search
        });
        res.json(medicines);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch medicines' }); }
});
  
// API endpoint to get all specialists (for initial data fetch)
app.get('/api/specialists', async (req, res) => {
    try 
    {
        const specialists = await Specialist.find();
        res.json(specialists);
    } 
    catch (error) { res.status(500).json({ error: 'Failed to fetch specialists' }); }
});
  
// API endpoint to search specialists by specialty
app.get('/api/specialists/search', async (req, res) => {
    try 
    {
        const { specialty } = req.query;
        const specialists = await Specialist.find({
            specialty: { $regex: specialty, $options: 'i' }  // Case-insensitive search
        });
        res.json(specialists);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch specialists' }); }
});
  
// API endpoint to get a single specialist by ID
app.get('/api/specialists/:id', async (req, res) => {
    try 
    {
        const specialist = await Specialist.findById(req.params.id);
        if (!specialist) return res.status(404).json({ error: 'Specialist not found' });
        res.json(specialist);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch specialist' }); }
});
  
app.get('/api/specialists/:specialistId/doctors', async (req, res) => {
    try 
    {
        // Fetch the specialist by ID, including their embedded doctors array
        const specialist = await Specialist.findById(req.params.specialistId);
        if (!specialist) { return res.status(404).json({ error: 'Specialist not found' }); }
        // Send back the doctors array embedded in the specialist document
        res.json(specialist.doctors);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch doctors' }); }
});
  
// API endpoint to add a review to a specific medicine
app.post('/api/medicines/:name/reviews', async (req, res) => {
    try 
    {
        const { name } = req.params;
        const { user, comment, rating } = req.body;
        const medicine = await Medicine.findOne({ name });
        if (medicine) 
        {
            medicine.reviews.push({ user, comment, rating });
            await medicine.save(); // Save the updated medicine document
            res.json(medicine);
        } else { res.status(404).json({ error: 'Medicine not found' }); }
        } catch (error) { res.status(500).json({ error: 'Failed to add review' }); }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');  // Clear the JWT token cookie
    res.status(200).json({ message: "Logged out successfully" });
});
app.use('/api', require('./apiRoutes'));
