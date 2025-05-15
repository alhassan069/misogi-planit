const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database.js');

const Activity = sequelize.define('Activity', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('Adventure', 'Food', 'Sightseeing', 'Other'),
    allowNull: false,
    defaultValue: 'Other',
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  votes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  creatorId: {
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
  tableName: 'activities',
  indexes: [
    {
      unique: true,
      fields: ['id']
    },
    {
      fields: ['trip_id']
    },
    {
      fields: ['date']
    }
  ]
});

module.exports = Activity;
