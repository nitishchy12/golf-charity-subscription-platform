# Golf Charity Subscription Platform

Production-grade full-stack system with real-world business logic, admin workflows, and scalable architecture.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Project-Production--Ready-success)

## Project Overview

A full-stack production-ready web application that enables users to track golf scores, participate in monthly prize draws, and contribute to charitable causes. The platform includes a complete admin system for managing users, draws, and payouts.

Key Highlights:
- Role-based authentication (User and Admin)
- Real-time score tracking with last-5 logic
- Monthly draw system with prize distribution
- Charity contribution integration
- End-to-end user and admin workflows

## Live Demo

- Frontend: https://your-vercel-link
- Backend: https://your-backend-link

## Source Code

- GitHub: https://github.com/nitishchy12/golf-charity-subscription-platform

## Tech Stack

Frontend:
- React.js
- Vite
- Tailwind CSS

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)

Other:
- JWT Authentication
- REST APIs
- Vercel (Frontend Deployment)
- Render or Railway (Backend Deployment)

## Core Features

- Secure authentication using JWT
- Role-based access control (Admin and User)
- Last-5 score tracking system with auto-replacement logic
- Monthly draw generation with random number algorithm
- Prize distribution based on match count (3, 4, 5 matches)
- Charity contribution system with minimum percentage validation
- Winner verification and admin payout workflow

## Why This Project Stands Out

- Implements real-world business logic beyond basic CRUD
- Demonstrates role-based system design (Admin and User workflows)
- Includes complete end-to-end flow: authentication to action to admin control to result
- Focused on scalability and clean architecture with a modular backend and structured frontend
- Built with production mindset, not just a demo project

## Quick Setup

1. Clone the repository.
2. Create `backend/.env` from `backend/.env.example`.
3. Create `frontend/.env` from `frontend/.env.example`.
4. Run `npm install` from the project root.
5. Start backend with `npm run dev --workspace backend`.
6. Start frontend with `npm run dev --workspace frontend`.

## Important Routes

- User signup and login
- Admin dashboard and draw execution
- User dashboard with scores, winnings, and charity selection

## Screenshots

### User Dashboard
![Dashboard](./screenshots/dashboard.png)

### Admin Panel
![Admin](./screenshots/admin.png)

## Deployment

Frontend:
- Deploy the `frontend` app to Vercel
- Set `VITE_API_URL` to your backend API URL

Backend:
- Deploy the `backend` app to Render or Railway
- Add environment variables from `backend/.env.example`
- Use MongoDB Atlas for production deployment

## Project Status

- Authentication system implemented
- Score tracking logic working
- Admin panel functional
- Draw system implemented
- End-to-end flow tested
- Deployment ready
