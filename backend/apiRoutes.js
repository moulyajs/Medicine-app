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

router.get('/medications', verifyUser, (req, res) => {
    const filePath = path.join(__dirname, 'public', 'dose_meds.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) 
        {
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
    try 
    {
        const meds = await FeaturedMed.find();
        const randomMeds = [];
        const randomIndexes = [];

        while (randomMeds.length < 2) 
        {
            const randomIndex = Math.floor(Math.random() * meds.length);
            if (!randomIndexes.includes(randomIndex)) 
            {
                randomMeds.push(meds[randomIndex]);
                randomIndexes.push(randomIndex);
            }
        }
        res.json(randomMeds);
    } catch (error) { res.status(500).json({ error: 'Unable to fetch featured medications' }); }
});

router.get('/health-tips', async (req, res) => {
    try 
    {
        const tips = await HealthTip.find();
        const randomTips = [];
        const randomIndexes = [];

        while (randomTips.length < 2) 
            {
            const randomIndex = Math.floor(Math.random() * tips.length);
            if (!randomIndexes.includes(randomIndex)) 
            {
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
    try 
    {
        const videos = await InformationalVideo.find();
        const randomIndex = Math.floor(Math.random() * videos.length);
        res.json(videos[randomIndex]);
    } catch (error) { res.status(500).json({ error: 'Unable to fetch videos' }); }
});

module.exports = router;