# Golf Charity Subscription Platform

Production-grade full-stack system with real-world business logic, admin workflows, and scalable architecture.

A full-stack MERN application that combines golf scoring, subscription-based rewards, and charitable contributions into a unified platform.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Project-Production--Ready-success)

## Live Demo

- Frontend (Vercel): https://golf-charity-subscription-platform-nu.vercel.app
- Backend API (Render): https://golf-charity-backend-pmy5.onrender.com

## Why This Project Stands Out

- Implements real-world business logic beyond basic CRUD
- Demonstrates role-based workflows across user and admin experiences
- Covers the full product loop from authentication to action to payout control
- Built with production deployment concerns in mind, including CORS, SPA routing, and API normalization
- Designed as a scalable portfolio project, not just a demo screen set

## Core Features

Authentication
- User signup and login
- JWT-based authentication
- Secure protected routes and session flow

Membership System
- Monthly subscription model
- Mock billing activation
- Plan selection and subscription management

Charity Integration
- Select a charity during signup
- Contribution percentage tracking
- Real-time charity data from backend

Golf Score Tracking
- Add scores from 1 to 45
- Stores only the last 5 scores
- Auto-replaces the oldest score when a new one is added

Dashboard Experience
- Subscription status overview
- Tracked score history
- Wins and earnings snapshot
- Charity contribution summary

## Tech Stack

Frontend
- React.js with Vite
- Tailwind CSS
- Axios

Backend
- Node.js
- Express.js
- MongoDB with Mongoose

Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Environment Variables

Frontend (`.env`)
```env
VITE_API_URL=https://golf-charity-backend-pmy5.onrender.com
```

Backend (`.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://golf-charity-subscription-platform-nu.vercel.app
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Key Challenges Solved

- Fixed CORS issues between Vercel and Render
- Resolved API route mismatches between `/charities` and `/api/charities`
- Handled SPA routing and refresh 404 issues on deployment
- Implemented robust API client URL normalization
- Prevented infinite loading states with timeout handling

## Screenshots

### User Dashboard
![Dashboard](./screenshots/dashboard.png)

### Admin Panel
![Admin](./screenshots/admin.png)

## Future Improvements

- Payment gateway integration with Stripe
- Real-time leaderboard
- Admin analytics dashboard
- Email notifications
