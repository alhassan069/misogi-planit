const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  underscored: true,
  timestamps: true,
  tableName: 'votes',
  hooks: {
    afterCreate: async (vote, options) => {
      const Activity = require('./activity.js');
      await Activity.increment('votes', { 
        by: 1, 
        where: { id: vote.activityId },
        transaction: options.transaction
      });
    },
    afterDestroy: async (vote, options) => {
      const Activity = require('./activity.js');
      await Activity.increment('votes', { 
        by: -1, 
        where: { id: vote.activityId },
        transaction: options.transaction
      });
    },
  },
  indexes: [
    {
      unique: true,
      fields: ['activity_id', 'user_id']
    }
  ]
});

module.exports = Vote;
