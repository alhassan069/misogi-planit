const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const tripRoutes = require('./trip.routes');
const activityRoutes = require('./activities.routes');
const voteRoutes = require('./votes.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/trips', tripRoutes);
router.use('/activities', activityRoutes);
router.use('/votes', voteRoutes);

module.exports = router;
