# Planit Server

A robust Express.js backend server with Sequelize ORM, providing a RESTful API for the Planit application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: SQLite (Development) / MySQL (Production)
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: RESTful endpoints
- **Development**: Nodemon for hot reloading

## Project Structure

```
server/
├── config/         # Configuration files
├── middlewares/    # Custom middleware functions
├── models/         # Sequelize models
├── routes/         # API route definitions
├── utils/          # Utility functions
├── migrations/     # Database migrations
└── index.js        # Application entry point
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret
```

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## API Endpoints

The server provides RESTful API endpoints under the `/api` prefix. Detailed endpoint documentation can be found in the respective route files.

## Database

The application uses Sequelize ORM with SQLite for development and MySQL for production. Database migrations are managed through Sequelize CLI.

### Running Migrations

```bash
npx sequelize-cli db:migrate
```

### Undoing Migrations

```bash
npx sequelize-cli db:migrate:undo
```

## Features

- RESTful API architecture
- JWT-based authentication
- CORS enabled with configurable origins
- Cookie-based session management
- Request logging middleware
- Database connection pooling
- Graceful server shutdown
- Environment-based configuration

## Security

- CORS protection
- JWT authentication
- Cookie security
- Environment variable management
- SQL injection prevention through Sequelize

## Development

The server uses Nodemon for development, providing automatic server restart on file changes. ESLint is configured for code quality and consistency.

## Dependencies

Key dependencies include:
- express: Web framework
- sequelize: ORM for database operations
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- cookie-parser: Cookie parsing middleware
- dotenv: Environment variable management
- sqlite3/mysql2: Database drivers

## Error Handling

The server implements comprehensive error handling with:
- Global error middleware
- Database connection error handling
- Graceful shutdown procedures
- Request validation

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed 