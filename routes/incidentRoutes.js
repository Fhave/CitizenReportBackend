const express = require('express');
const { addIncident, getIncidents, getIncidentsByCategory, uploadMiddleware } = require('../controllers/incidentController');
const authMiddleware = require('../config/authMiddleware');

const router = express.Router();

router.post('/add', uploadMiddleware, addIncident);
router.get('/get', getIncidents);
router.get('/getByCategory', getIncidentsByCategory);

module.exports = router;
