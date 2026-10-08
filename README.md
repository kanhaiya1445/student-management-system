<<<<<<< HEAD
# Student Management System — Full Stack

## What is included
A complete student management system with:
- User registration and login
- JWT authentication
- Per-user student data isolation
- Add / view / search / edit / delete students
- Marks validation and grade calculation
- Dashboard statistics
- MySQL database
- HTML/CSS/JavaScript frontend
- Node.js + Express backend
- bcrypt password hashing

## Folder structure
frontend/
backend/
  src/
  db/schema.sql
  .env.example

## Backend setup
1. Open `backend` in VS Code terminal.
2. Run:
   npm install
3. Create `backend/.env` from `.env.example`.
4. Put your MySQL credentials and a strong JWT_SECRET in `.env`.
5. Run `backend/db/schema.sql` in MySQL Workbench.
6. Start:
   npm run dev

Expected:
Student Management backend running on http://localhost:5000
MySQL connected successfully

## Frontend setup
Open `frontend/index.html` with VS Code Live Server.
Default backend URL is:
http://localhost:5000/api

If needed, change it in browser console:
localStorage.setItem("sms-api-base","http://localhost:5000/api")

## Important
- Never upload `.env` to GitHub.
- Passwords are hashed with bcrypt.
- JWT protects student API routes.
- Each logged-in user can access only their own students.
- This is suitable for learning/local development. Production deployment should add stricter CORS, HTTPS, rate limiting, refresh-token strategy, stronger validation, and secure secret management.
=======
# student-management-system
this is my  git repository
>>>>>>> 5d711ff4205579375c13df8a88377be36f9e1331
