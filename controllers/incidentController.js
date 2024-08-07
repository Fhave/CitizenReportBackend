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
    // Set user to null if not authenticated
    const user = req.user ? req.user.id : null;
    const { image } = req.files.image;

    try {
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            folder: 'incident',
        });

        const incident = new Incident({
            title,
            description,
            category,
            latitude,
            longitude,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
            user
        });

        await incident.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
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

exports.getUserIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({ user: req.user.id }).populate('user', ['username']);
        res.json({ incidents });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
