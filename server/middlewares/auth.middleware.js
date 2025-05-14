// middlewares/verifyAccessToken.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const loggedInMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: 'No token provided' }); // No token provided

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' }); // Invalid or expired token
        req.user = payload; // payload contains decoded user info (e.g., id)
        next();
    });
};

module.exports = loggedInMiddleware;
