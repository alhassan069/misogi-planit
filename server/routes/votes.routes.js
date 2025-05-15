const express = require('express');
const router = express.Router();
const { Vote, Activity, User, TripParticipant, Trip } = require('../models');
const loggedInMiddleware  = require('../middlewares/auth.middleware.js');
const  sequelize  = require('../config/database.js');

// Toggle vote for an activity
router.post('/activity/:activityId', loggedInMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { activityId } = req.params;

    // Check if user is participant of the trip that contains this activity
    const activity = await Activity.findByPk(activityId, {
      include: [
        {
          model: Trip,
          as: 'trip',
          include: [
            {
              model: User,
              as: 'participants',
              where: { id: req.user.id },
              attributes: ['id', 'name', 'email', 'avatar'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found or access denied' });
    }

    // Check if vote already exists
    const existingVote = await Vote.findOne({
      where: {
        activityId,
        userId: req.user.id
      }
    });

    if (existingVote) {
      // Remove vote
      await existingVote.destroy({ transaction });
      await transaction.commit();
      
      // Return updated activity with votes
      const updatedActivity = await Activity.findByPk(activityId, {
        include: [
          {
            model: Vote,
            as: 'userVotes',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      
      res.json({ voted: false, activity: updatedActivity });
    } else {
      // Add vote
      await Vote.create({
        activityId,
        userId: req.user.id
      }, { transaction });
      
      await transaction.commit();
      
      // Return updated activity with votes
      const updatedActivity = await Activity.findByPk(activityId, {
        include: [
          {
            model: Vote,
            as: 'userVotes',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      
      res.json({ voted: true, activity: updatedActivity });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error toggling vote:', error);
    res.status(500).json({ error: 'Failed to toggle vote' });
  }
});

// Get vote status for an activity
router.get('/activity/:activityId/status', loggedInMiddleware, async (req, res) => {
  try {
    const { activityId } = req.params;

    const vote = await Vote.findOne({
      where: {
        activityId,
        userId: req.user.id
      }
    });

    res.json({ voted: !!vote });
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
});

module.exports = router;