const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const process = require('process');


const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;
const port = process.env.DB_PORT;


// const db_url = `mysql://${username}:${password}@${host}:${port}/${database}`;

// const sequelize = new Sequelize(db_url);
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
  port: port,
});

module.exports = sequelize;


