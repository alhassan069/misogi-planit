const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { User, connectDatabase, disconnectDatabase} = require('./models');
const routes = require('./routes');
const loggerMiddleware = require('./middlewares/logger.middleware');
dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use(loggerMiddleware);
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api', routes);


let server;
async function startServer() {
  try {
    await connectDatabase();
    server = app.listen(PORT, () => console.log(`Server running on port ${PORT} successfully.`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log(' SIGINT signal received: closing Database connection and HTTP server');
  try {
    await disconnectDatabase();
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();