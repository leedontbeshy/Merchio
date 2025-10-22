# Authentication API Documentation

## Overview
This authentication system implements JWT-based authentication with bcrypt password hashing following the MVC pattern.

## Setup

### 1. Environment Variables
Create a `.env` file in the server directory (see `.env.example`):

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/merchio
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
```

### 2. Database Setup
Run the schema file to create the users table:

```bash
psql -d merchio -f src/database/merchio.schema.sql
```

Or connect to your PostgreSQL database and run the SQL commands in `merchio.schema.sql`.

### 3. Start the Server
```bash
npm run dev
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/auth
```

### 1. Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "created_at": "2025-10-18T10:30:00.000Z",
      "updated_at": "2025-10-18T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Email: Valid email format required
- Password: Minimum 6 characters
- Name: Required

### 2. Login User
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "created_at": "2025-10-18T10:30:00.000Z",
      "updated_at": "2025-10-18T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile
**GET** `/api/auth/me`

Get the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "created_at": "2025-10-18T10:30:00.000Z",
    "updated_at": "2025-10-18T10:30:00.000Z"
  }
}
```

## Authentication Middleware

### Usage in Routes
Protect routes by adding the `authenticate` middleware:

```typescript
import { authenticate, authorize } from '../middlewares/auth.middleware';

// Protect a route (requires authentication)
router.get('/protected', authenticate, yourController);

// Protect a route with role-based authorization
router.get('/admin-only', authenticate, authorize('admin'), yourController);
```

### Access User Data in Controllers
```typescript
const userId = req.user?.id;
const userEmail = req.user?.email;
const userRole = req.user?.role;
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiration**: Configurable token expiration (default: 7 days)
4. **Role-Based Access**: Support for role-based authorization
5. **Input Validation**: Email format and password strength validation
6. **Error Handling**: Comprehensive error handling for all endpoints

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## File Structure

```
server/src/
├── config/
│   └── database.ts          # PostgreSQL connection pool
├── controllers/
│   └── auth.controller.ts   # Authentication controller
├── middlewares/
│   └── auth.middleware.ts   # JWT authentication & authorization
├── models/
│   └── user.model.ts        # User model with bcrypt
├── routes/
│   └── auth.routes.ts       # Authentication routes
├── types/
│   └── user.types.ts        # TypeScript interfaces
└── server.ts                # Express app setup
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

1. Create a `.env` file with your database credentials and JWT secret
2. Run the database schema to create the users table
3. Start the server with `npm run dev`
4. Test the endpoints using the examples above
