const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;
const port = process.env.DB_PORT;
const db_url = process.env.DB_URL;
let sequelize;


if (!!db_url) {
  sequelize = new Sequelize(db_url);
} else if (!!dialect && dialect !== 'sqlite') {
  // Database configuration
  sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    port: port,
  });
} else {
  // SQLite configuration
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), // Store the database file in the server directory
    logging: console.log, // Set to false to disable SQL query logging
  });
}

module.exports = sequelize;


