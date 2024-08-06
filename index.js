const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/incidents', incidentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Study Buddy Api');
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
