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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

exports.uploadMiddleware = upload.single('image');

exports.addIncident = async (req, res) => {
    const { title, description, category } = req.body;
    const user = req.user.id;

    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const incident = new Incident({
            title,
            description,
            category,
            image: imageUrl,
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
