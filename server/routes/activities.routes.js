const express = require('express');
const router = express.Router();
const { Activity, Vote, User, TripParticipant, Trip } = require('../models');
const loggedInMiddleware  = require('../middlewares/auth.middleware');
const  sequelize  = require('../config/database');


// Create activity
router.post('/', loggedInMiddleware, async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { tripId, name, description, date, time, category, estimatedCost, notes } = req.body;

        // Check if user is participant of the trip
        const participant = await TripParticipant.findOne({
            where: {
                tripId,
                userId: req.user.id
            }
        });

        if (!participant) {
            return res.status(403).json({ error: 'You must be a trip participant to add activities' });
        }

        const activity = await Activity.create({
            tripId,
            name,
            description,
            date,
            time,
            category,
            estimatedCost,
            notes,
            creatorId: req.user.id
        }, { transaction });

        await transaction.commit();

        // Fetch the created activity with all associations
        const newActivity = await Activity.findByPk(activity.id, {
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
            ]
        });

        res.status(201).json(newActivity);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Update activity
router.put('/:id', loggedInMiddleware, async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id, {
            include: [
                {
                    model: Trip,
                    as: 'trip',
                    include: [
                        {
                            model: User,
                            as: 'creator',
                            attributes: ['id', 'name']
                        },
                        {
                            model: User,
                            as: 'participants',
                            where: { id: req.user.id },
                            attributes: ['id', 'name', 'email', 'avatar'],
                            through: { attributes: [] }
                        },
                    ]
                }
            ]
        });

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found or access denied' });
        }

        const { name, description, date, time, category, estimatedCost, notes } = req.body;

        await activity.update({
            name,
            description,
            date,
            time,
            category,
            estimatedCost,
            notes
        });

        // Fetch updated activity with all associations
        const updatedActivity = await Activity.findByPk(activity.id, {
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
            ]
        });

        res.status(200).json(updatedActivity);
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'Failed to update activity' });
    }
});

// Delete activity
router.delete('/:id', loggedInMiddleware, async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const activity = await Activity.findByPk(req.params.id, {
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
                        },
                    ]
                }
            ]
        });

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found or access denied' });
        }

        await activity.destroy({ transaction });
        await transaction.commit();

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

module.exports = router;
