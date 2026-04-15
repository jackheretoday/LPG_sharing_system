# Backend Structure and Auth Flow (Current State)

## 1. Backend Overview
The backend is a Node.js + Express server with middleware and route-based modules.

Current entry point:
- backend/server.js

Key middleware:
- helmet (security headers)
- cors (cross-origin support)
- morgan (request logs)
- express.json and express.urlencoded (body parsing)

Error handling:
- backend/middleware/notFound.js (404 handler)
- backend/middleware/errorHandler.js (centralized error response)

## 2. Current Backend Folder Structure
- backend/config
  - supabaseClient.js (future-ready Supabase client setup)
- backend/controllers
  - authController.js
  - systemController.js
- backend/middleware
  - authMiddleware.js
  - notFound.js
  - errorHandler.js
- backend/models
  - tempUserStore.js (temporary in-memory user storage)
- backend/routes
  - authRoutes.js
  - systemRoutes.js
- backend/utilis
  - token.js (JWT generate/verify helpers)
- backend/server.js

## 3. Active Routes
Base routes:
- GET / (server info)
- GET /api (API status)
- GET /api/health (health check)

Auth routes:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me (protected, Bearer token required)

## 4. Login/Signup Credentials (Current)
At this stage there is no database table yet.
Users are stored temporarily in memory while server is running.

### Signup credentials required
Request body (JSON):
- name (string, required)
- email (string, required)
- password (string, required, min 6 chars)

Example:
{
  "name": "John Bright",
  "email": "john@example.com",
  "password": "pass1234"
}

### Login credentials required
Request body (JSON):
- email (string, required)
- password (string, required)

Example:
{
  "email": "john@example.com",
  "password": "pass1234"
}

## 5. How Signup Works
Implemented in backend/controllers/authController.js.

Step-by-step:
1. Validate required fields: name, email, password.
2. Validate password length >= 6.
3. Check existing user by email from tempUserStore.
4. Hash password using bcryptjs.
5. Store user object in tempUserStore.
6. Generate JWT token using token.js.
7. Return success response with:
   - token
   - user object (id, name, email)

## 6. How Login Works
Implemented in backend/controllers/authController.js.

Step-by-step:
1. Validate email and password are present.
2. Find user by email from tempUserStore.
3. Compare plain password with stored hash using bcrypt.compare.
4. If valid, generate JWT token.
5. Return success response with:
   - token
   - user object (id, name, email)

## 7. How Protected Route Works (/api/auth/me)
- Route uses protect middleware from backend/middleware/authMiddleware.js.
- protect expects Authorization header in this format:
  Bearer <jwt-token>
- Middleware verifies token using token.js.
- On success, decoded payload is attached to req.user.
- Controller returns current user data by user id.

## 8. JWT and Secret Handling
Token helpers are in backend/utilis/token.js.

Current JWT behavior:
- Token expiry: 7 days
- Secret source:
  - process.env.JWT_SECRET if provided
  - fallback: dev-temporary-secret (for development only)

Recommendation:
- Always set JWT_SECRET in production.
- Do not keep fallback secret for production deployments.

## 9. Environment Variables
Template exists in backend/.env.example:
- PORT=5000
- JWT_SECRET=your-super-secret-jwt-key
- SUPABASE_URL=your-supabase-url
- SUPABASE_ANON_KEY=your-supabase-anon-key
- SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

## 10. Important Current Limitation
Because tempUserStore is in memory:
- all users are lost when server restarts,
- this is only for temporary development/testing,
- once Supabase schema is ready, replace tempUserStore calls with Supabase queries.

## 11. Quick Test Sequence
1. Start server:
- npm run dev

2. Signup:
- POST /api/auth/signup with name/email/password

3. Login:
- POST /api/auth/login with same email/password

4. Use token from signup/login response:
- GET /api/auth/me with Authorization: Bearer <token>

This confirms complete auth flow is working in current backend state.
