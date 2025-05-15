const User = require('./user.js');
const RefreshToken = require('./refreshtoken.js');
const Trip = require('./trip.js');
const Activity = require('./activity.js');
const Vote = require('./vote.js');
const TripParticipant = require('./tripparticipant.js');

// Define associations

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId',onDelete: 'CASCADE' });

User.hasMany(Trip, { foreignKey: 'creatorId', as: 'createdTrips' });
Trip.belongsTo(User, { foreignKey: 'creatorId', as: 'creator', onDelete: 'CASCADE' });

Trip.hasMany(Activity, { foreignKey: 'tripId', as: 'activities' });
Activity.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip', onDelete: 'CASCADE' });

User.hasMany(Activity, { foreignKey: 'creatorId', as: 'createdActivities' });
Activity.belongsTo(User, { foreignKey: 'creatorId', as: 'creator', onDelete: 'CASCADE' });

Activity.hasMany(Vote, { foreignKey: 'activityId', as: 'userVotes' });
Vote.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity', onDelete: 'CASCADE' });

User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

// Many-to-many relationship between trips and users through TripParticipant
Trip.belongsToMany(User, { 
  through: TripParticipant, 
  foreignKey: 'tripId',
  otherKey: 'userId',
  as: 'participants'
});

User.belongsToMany(Trip, { 
  through: TripParticipant, 
  foreignKey: 'userId',
  otherKey: 'tripId',
  as: 'trips'
});

// Direct associations for TripParticipant
TripParticipant.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
TripParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  RefreshToken,
  Trip,
  Activity,
  Vote,
  TripParticipant,
};