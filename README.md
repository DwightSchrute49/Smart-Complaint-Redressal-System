# LeafNode - Complaint Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing customer complaints.

## Features

- User Authentication (Login/Register)
- Create and manage complaints
- Priority-based complaint system
- Status tracking for complaints
- Secure API endpoints with JWT authentication

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/LeafNode.git
cd LeafNode
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Environment Setup
- Create `.env` file in backend directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

4. Run the application
```bash
# Start backend (from root directory)
npm run dev

# Start frontend (in a new terminal)
npm run client

# Or run both concurrently
npm run start-all
```

## Available Scripts

- `npm run dev` - Run backend in development mode
- `npm run client` - Run frontend development server
- `npm run start-all` - Run both frontend and backend concurrently

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
