# Task Manager Backend API

A RESTful API for managing tasks and user authentication built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup, login, token verification)
- CRUD operations for tasks
- Task filtering and sorting
- Task statistics
- User profile management
- Password change functionality
- JWT-based authentication
- CORS support for React Native frontend

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
NODE_ENV=development
```

4. Start MongoDB service on your machine

5. Run the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user.
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user and get authentication token.
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

#### GET /api/auth/verify
Verify authentication token.
- Headers: `Authorization: Bearer <token>`

### Tasks

All task endpoints require authentication token in header: `Authorization: Bearer <token>`

#### GET /api/tasks
Get all tasks for authenticated user.
- Query parameters:
  - `status`: Filter by status (Pending, In Progress, Completed)
  - `priority`: Filter by priority (Low, Medium, High)
  - `sortBy`: Sort field (createdAt, updatedAt, title, dueDate)
  - `order`: Sort order (asc, desc)

#### GET /api/tasks/stats
Get task statistics for authenticated user.

#### GET /api/tasks/:id
Get a specific task by ID.

#### POST /api/tasks
Create a new task.
```json
{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "Pending",
  "priority": "High",
  "dueDate": "2024-12-31"
}
```

#### PUT /api/tasks/:id
Update a task.
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress",
  "priority": "Medium"
}
```

#### PATCH /api/tasks/:id/toggle
Toggle task status between Pending and Completed.

#### DELETE /api/tasks/:id
Delete a task.

### User Profile

All user endpoints require authentication token in header: `Authorization: Bearer <token>`

#### GET /api/users/profile
Get user profile information.

#### PUT /api/users/profile
Update user profile.
```json
{
  "username": "newusername"
}
```

#### PUT /api/users/change-password
Change user password.
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Task Model

```javascript
{
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  status: String (Pending, In Progress, Completed),
  priority: String (Low, Medium, High),
  dueDate: Date,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## User Model

```javascript
{
  username: String (required, unique),
  password: String (required, hashed)
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security Features

- Password hashing with bcryptjs
- JWT tokens with expiration
- User-specific data access (users can only access their own tasks)
- Input validation
- CORS configuration for frontend access

## Development

- Use `npm run dev` for development with auto-restart
- Environment variables are loaded from `.env` file
- MongoDB connection with error handling
- Structured error responses
- Request logging middleware

## Deployment Notes

1. Change JWT_SECRET to a secure random string in production
2. Update CORS origins to match your production frontend URLs
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Set NODE_ENV=production
5. Use PM2 or similar for process management
