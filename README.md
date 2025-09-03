# Task Manager Backend

A Node.js, Express, and MongoDB backend for a full-stack Task Manager app.

## Features
- User authentication (JWT, email & password)
- Task CRUD (create, read, update, delete)
- Task status and priority
- RESTful API endpoints
- Environment variable support
- CORS for frontend integration

## Setup
1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```
4. Start MongoDB locally or use MongoDB Atlas for production
5. Run the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Add task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle status

## Deployment
- Set `NODE_ENV=production` in your Render/production environment
- Use a production MongoDB URI
- Set a strong JWT secret
- Do not commit `.env` to git

## License
MIT
