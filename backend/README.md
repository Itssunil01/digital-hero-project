# Digital Heroes Backend

This is the backend API for the Digital Heroes application, built with Node.js, Express, and TypeScript.

## Features

- User authentication (signup/login) with JWT
- Charity management (CRUD operations)
- SQLite database

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   DATABASE_PATH=./database.db
   ```

3. Build and run:
   ```bash
   npm run build
   npm start
   ```

   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Charities
- `GET /api/charities` - Get all charities
- `GET /api/charities/:id` - Get charity by ID
- `POST /api/charities` - Create new charity (requires auth)
- `PUT /api/charities/:id` - Update charity (requires auth, owner only)
- `DELETE /api/charities/:id` - Delete charity (requires auth, owner only)

### Health Check
- `GET /api/health` - Check server status

## Authentication

Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```