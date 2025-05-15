const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database.js');

const TripParticipant = sequelize.define('TripParticipant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
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
  role: {
    type: DataTypes.ENUM('creator', 'collaborator'),
    defaultValue: 'collaborator',
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'trip_participants',
  indexes: [
    {
      unique: true,
      fields: ['trip_id', 'user_id']
    }
  ]
});

module.exports = TripParticipant;
