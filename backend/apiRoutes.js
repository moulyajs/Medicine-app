// /backend/apiRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const verifyUser = require('./verifyUser');
const jwt = require('jsonwebtoken');
const HealthTip = require('./models/HealthTips');
const InformationalVideo = require('./models/InfoVideos');
const FeaturedMed = require('./models/Products');
const FAQ = require('./models/tempfaqs');
const Medication = require('./models/Medication');
const Newsletter = require("./models/Newsletters");
const User = require("./models/User");

router.get('/medications', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'dose_meds.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Unable to load dosage information.");
        }
        const medications = JSON.parse(data);
        res.json(medications);
    });
});

router.get('/check-auth', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        res.status(200).json({ message: 'Authenticated' });
    });
});

router.get('/featured-meds', async (req, res) => {
    try {
        const meds = await FeaturedMed.find();
        const randomMeds = [];
        const randomIndexes = [];

        while (randomMeds.length < 2) {
            const randomIndex = Math.floor(Math.random() * meds.length);
            if (!randomIndexes.includes(randomIndex)) {
                randomMeds.push(meds[randomIndex]);
                randomIndexes.push(randomIndex);
            }
        }
        res.json(randomMeds);
    } catch (error) { res.status(500).json({ error: 'Unable to fetch featured medications' }); }
});

router.get('/health-tips', async (req, res) => {
    try {
        const tips = await HealthTip.find();
        const randomTips = [];
        const randomIndexes = [];

        while (randomTips.length < 2) {
            const randomIndex = Math.floor(Math.random() * tips.length);
            if (!randomIndexes.includes(randomIndex)) {
                randomTips.push(tips[randomIndex]);
                randomIndexes.push(randomIndex);
            }
        }

        res.json(randomTips);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch health tips' });
    }
});

router.get('/informational-videos', async (req, res) => {
    try {
        const videos = await InformationalVideo.find();
        const randomIndex = Math.floor(Math.random() * videos.length);
        res.json(videos[randomIndex]);
    } catch (error) { res.status(500).json({ error: 'Unable to fetch videos' }); }
});

router.get('/newsletters', async (req, res) => {
    try 
    {
        const newsletters = await Newsletter.find();
        res.json(newsletters);
    } catch (error) { res.status(500).json({ error: 'Unable to fetch newsletters' }); }
});

router.post('/medicine-safety', async (req, res) => {
    const { name, age, allergies, healthConditions } = req.body;

    try {
        // Look up the medicine in MongoDB by name (case-insensitive)
        const medication = await Medication.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        // Age restrictions check
        const [minAge, maxAge] = medication.ageRestrictions;
        const isAgeRestricted = age < minAge || age > maxAge;

        // Allergy warnings check (case-insensitive)
        const hasAllergyWarning = allergies.some(allergy =>
            medication.allergyWarnings.some(dbAllergy => dbAllergy.toLowerCase() === allergy.toLowerCase())
        );

        // Health condition warnings check (case-insensitive)
        const hasHealthConditionWarning = healthConditions.some(condition =>
            medication.healthConditionWarnings.some(dbCondition => dbCondition.toLowerCase() === condition.toLowerCase())
        );

        // Compile user-friendly results
        const warnings = {
            ageRestricted: isAgeRestricted,
            allergyWarning: hasAllergyWarning,
            healthConditionWarning: hasHealthConditionWarning,
            commonSideEffects: medication.sideEffects.common,
            seriousSideEffects: medication.sideEffects.serious,
            dosageInformation: medication.dosageInformation.map(dosage => ({
                ageRange: dosage.ageRange,
                dosage: dosage.dosage
            })),
            interactionWarnings: medication.interactionWarnings,
            storageInstructions: medication.storageInstructions,
            pregnancyWarning: medication.pregnancyWarning,
            breastfeedingWarning: medication.breastfeedingWarning
        };

        res.json({
            message: 'Medication safety information retrieved successfully',
            warnings
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking medication safety' });
    }
});

// add a new FAQ
router.post('/faqs', async (req, res) => {
    try {
        const newFAQ = new FAQ({
            question: req.body.question,
            answer: req.body.answer,
        });
        const savedFAQ = await newFAQ.save();
        res.status(201).json(savedFAQ);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// retrieve all FAQs
router.get('/faqs', async (req, res) => {
    try {
        const faqs = await FAQ.find({});
        res.status(200).send(faqs);
    } catch (error) {
        res.status(500).send({ message: "Error fetching FAQs", error });
    }
});

// handle feedback on an FAQ
router.post('/faqs/:id/feedback', async (req, res) => {
    try {
        const { id } = req.params;
        const { helpful } = req.body;

        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).send({ message: "FAQ not found" });
        }

        // Update the helpful or notHelpful count based on the vote
        if (helpful) {
            faq.helpfulCount += 1;
        } else {
            faq.notHelpfulCount += 1;
        }

        await faq.save();
        res.status(200).send(faq);
    } catch (error) {
        res.status(400).send({ message: "Error submitting feedback", error });
    }
});

// fetch user profile
router.get("/account", verifyUser, async (req, res) => {
    try 
    {
        if (!req.user || !req.user.id) 
            return res.status(400).json({ message: "User is not authenticated or user ID is missing" });

        const user = await User.findById(req.user.id, "-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } 
    catch (err) 
    {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/account", verifyUser, async (req, res) => {
    const { fullName, email, username, age, gender } = req.body;

    try 
    {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update the fields with new values
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        
        // Explicitly replace age and gender with what the user provides
        user.age = age !== undefined ? age : user.age;
        user.gender = gender !== undefined ? gender : user.gender;

        // Save updated user to the database
        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/account", verifyUser, async (req, res) => {
    try 
    {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) 
        {
            console.error("User not found for deletion");
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Account deleted successfully" });
    } 
    catch (err) 
    {
        console.error("Error deleting account:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;