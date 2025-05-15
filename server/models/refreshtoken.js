const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database.js');

const RefreshToken = sequelize.define('RefreshToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: 'refresh_tokens',
  indexes: [
    {
      unique: true,
      fields: ['token']
    }
  ]
})

module.exports = RefreshToken;