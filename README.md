# Planit

A modern task management and planning application built with React and Express.js.

## Live Demo

Visit the deployed application at: [https://misogi-planit-1.onrender.com/dashboard](https://misogi-planit-1.onrender.com/dashboard)

## Project Overview

Planit is a full-stack web application that helps users manage their tasks and plan their activities effectively. The project consists of two main parts:

### Frontend (Client)
- Built with React 19 and Vite
- Modern UI using Radix UI and shadcn components
- Responsive design with Tailwind CSS
- Interactive features including drag-and-drop functionality
- Real-time updates and notifications

### Backend (Server)
- Express.js RESTful API
- Sequelize ORM for database management
- JWT authentication
- SQLite for development, MySQL for production
- Secure and scalable architecture

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/alhassan069/misogi-planit.git
cd misogi
```

2. Set up the backend:
```bash
cd server
npm install
# Create .env file with required variables
npm run dev
```

3. Set up the frontend:
```bash
cd client
npm install
npm run dev
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Documentation

For detailed documentation, please refer to:
- [Client Documentation](./client/README.md)
- [Server Documentation](./server/README.md)

## Features

- Task management and organization
- Drag-and-drop interface
- Real-time updates
- User authentication
- Responsive design
- Data visualization
- Form validation
- Toast notifications

## Tech Stack

### Frontend
- React 19
- Vite
- Radix UI + shadcn
- Tailwind CSS
- React Router DOM
- React Hook Form
- Zod
- dnd-kit
- Recharts

### Backend
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- SQLite/MySQL
- CORS
- Cookie Parser

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
