const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  tripCode: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
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
  tableName: 'trips',
  indexes: [
    {
      unique: true,
      fields: ['id']
    },
    {
      unique: true,
      fields: ['trip_code']
    },
    {
      unique: true,
      fields: ['start_date', 'end_date']
    }
  ]
});

module.exports = Trip;
