const express = require('express');
const router = express.Router();
const { Trip, Activity, Vote, TripParticipant, User } = require('../models');
const { generateTripCode } = require('../utils/utils.js');
const loggedInMiddleware  = require('../middlewares/auth.middleware.js');
const { Op } = require('sequelize');
const sequelize  = require('../config/database.js');

// Get all trips for a user
router.get('/', loggedInMiddleware, async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        {
          model: User,
          as: 'participants',
          where: { id: req.user.id },
          attributes: ['id', 'name', 'email', 'avatar'],
          through: { attributes: ['role'] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Activity,
          as: 'activities',
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
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Create a new trip
router.post('/', loggedInMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { name, description, startDate, endDate, budget } = req.body;
    
    // Generate unique trip code
    let tripCode;
    let isUnique = false;
    while (!isUnique) {
      tripCode = generateTripCode();
      const existingTrip = await Trip.findOne({ where: { tripCode } });
      if (!existingTrip) {
        isUnique = true;
      }
    }

    // Create trip
    const trip = await Trip.create({
      name,
      description,
      startDate,
      endDate,
      budget,
      tripCode,
      creatorId: req.user.id
    }, { transaction });

    // Add creator as participant
    await TripParticipant.create({
      tripId: trip.id,
      userId: req.user.id,
      role: 'creator'
    }, { transaction });

    await transaction.commit();

    // Fetch the created trip with all associations
    const newTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'email'],
          through: { attributes: ['role'] }
        },
        {
          model: Activity,
          as: 'activities',
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
        }
      ]
    });

    res.status(201).json(newTrip);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Get trip by code
router.get('/code/:tripCode', loggedInMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { tripCode: req.params.tripCode } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip by code:', error);
    res.status(500).json({ error: 'Failed to fetch trip by code' });
  }
});

// Get a specific trip
router.get('/:id', loggedInMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'participants',
          where: { id: req.user.id },
          attributes: ['id', 'name', 'email', 'avatar'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Activity,
          as: 'activities',
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
            },
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name']
            }
          ],
          order: [['date', 'ASC'], ['time', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Join trip by code
router.post('/join/:tripCode', loggedInMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const trip = await Trip.findOne({ 
      where: { tripCode: req.params.tripCode } 
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is already a participant
    const existingParticipant = await TripParticipant.findOne({
      where: {
        tripId: trip.id,
        userId: req.user.id
      }
    });

    if (existingParticipant) {
      return res.status(400).json({ error: 'You are already part of this trip' });
    }

    // Add user as participant
    await TripParticipant.create({
      tripId: trip.id,
      userId: req.user.id,
      role: 'collaborator'
    }, { transaction });

    await transaction.commit();

    // Return the trip with all participants
    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'email', 'avatar'],
          through: { attributes: ['role'] }
        }
      ]
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    await transaction.rollback();
    console.error('Error joining trip:', error);
    res.status(500).json({ error: 'Failed to join trip' });
  }
});

// Update trip
router.put('/:id', loggedInMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is the creator
    if (trip.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Only the trip creator can update the trip' });
    }

    const { name, description, startDate, endDate, budget } = req.body;
    
    await trip.update({
      name,
      description,
      startDate,
      endDate,
      budget
    });

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip
router.delete('/:id', loggedInMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is the creator
    if (trip.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Only the trip creator can delete the trip' });
    }

    await trip.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Leave trip
router.post('/:id/leave', loggedInMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is the creator (creators can't leave their own trip)
    if (trip.creatorId === req.user.id) {
      return res.status(400).json({ error: 'Trip creators cannot leave their own trip. Delete the trip instead.' });
    }

    // Remove user from participants
    await TripParticipant.destroy({
      where: {
        tripId: trip.id,
        userId: req.user.id
      },
      transaction
    });

    await transaction.commit();

    res.status(200).json({ message: 'Left trip successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error leaving trip:', error);
    res.status(500).json({ error: 'Failed to leave trip' });
  }
});

module.exports = router;