const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const tripRoutes = require('./trip.routes.js');
const activityRoutes = require('./activities.routes.js');
const voteRoutes = require('./votes.routes.js');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/trips', tripRoutes);
router.use('/activities', activityRoutes);
router.use('/votes', voteRoutes);

module.exports = router;
