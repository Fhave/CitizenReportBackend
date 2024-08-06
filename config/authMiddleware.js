const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Use req.headers to access headers in Express
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

    // Extract token from 'Authorization' header
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
