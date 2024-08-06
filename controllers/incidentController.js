const Incident = require('../models/Incident');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.addIncident = async (req, res) => {
    const { title, description, category, latitude, longitude } = req.body;
    const user = req.user ? req.user.id : null;

    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'incident',
            });
            imageUrl = result.secure_url;
        }

        const incident = new Incident({
            title,
            description,
            category,
            latitude,
            longitude,
            image: imageUrl,
            user
        });

        await incident.save();
        res.json({ success: true });
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate('user', ['username']);
        res.json({ incidents });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getIncidentsByCategory = async (req, res) => {
    const category = req.query.category;
    try {
        const incidents = await Incident.find({ category }).populate('user', ['username']);
        res.json({ incidents });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// exports.getIncidentsByCategory = async (req, res) => {
//     const category = req.query.category;
//     try {
//         const incidents = await Incident.find({ category }).populate('user', ['username'])
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
