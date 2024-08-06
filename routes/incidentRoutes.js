const express = require('express');
const multer = require('multer');
const { addIncident, getIncidents, getIncidentsByCategory, uploadMiddleware } = require('../controllers/incidentController');
const authMiddleware = require('../config/authMiddleware');

const router = express.Router();

// Local Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), addIncident);
router.get('/get', getIncidents);
router.get('/getByCategory', getIncidentsByCategory);

module.exports = router;
