GigFlow - Mini Freelance Marketplace Platform
A full-stack freelance marketplace where clients can post gigs and freelancers can bid on them. Built with MERN stack, Redux Toolkit, and Socket.io for real-time notifications.
Features
Core Features

✅ User Authentication - Secure JWT-based auth with HttpOnly cookies
✅ Dual Role System - Users can be both clients and freelancers
✅ Gig Management - CRUD operations for job postings
✅ Search & Filter - Search gigs by title
✅ Bidding System - Freelancers can submit bids with price and proposal
✅ Atomic Hiring Logic - MongoDB transactions ensure race-condition-safe hiring

Bonus Features (Implemented)

✅ MongoDB Transactions - Prevents race conditions during hiring
✅ Real-time Notifications - Socket.io powered instant notifications when hired

Tech Stack
Frontend

React.js 18 (Vite)
Redux Toolkit (State Management)
React Router v6
Tailwind CSS
Axios
Socket.io Client

Backend

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Socket.io
Bcrypt.js

Project Structure

gigflow/
├── backend/
│ ├── models/
│ │ ├── User.js
│ │ ├── Gig.js
│ │ └── Bid.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── gigs.js
│ │ └── bids.js
│ ├── middleware/
│ │ └── auth.js
│ ├── server.js
│ ├── package.json
│ └── .env
│
└── frontend/
├── src/
│ ├── components/
│ │ ├── Navbar.jsx
│ │ └── Notifications.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── CreateGig.jsx
│ │ ├── GigDetails.jsx
│ │ ├── MyGigs.jsx
│ │ └── MyBids.jsx
│ ├── store/
│ │ ├── store.js
│ │ └── slices/
│ │ ├── authSlice.js
│ │ ├── gigSlice.js
│ │ ├── bidSlice.js
│ │ └── notificationSlice.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── package.json
└── .env

🔧 Installation & Setup
Prerequisites

Node.js (v16 or higher)
MongoDB Atlas account
Git

1. Clone the Repository
   git clone <your-repo-url>
   cd gigflow

2. Backend Setup
   cd backend
   npm install

Create .env file in backend directory:
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
FRONTEND_URL=http://localhost:5173

Important: Generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

3. Frontend Setup
   cd ../frontend
   npm install

Create .env file in frontend directory:
VITE_API_URL=http://localhost:5000

4. Run the Application
   Terminal 1 - Backend:
   cd backend
   npm run dev

   Terminal 2 - Frontend:
   cd frontend
   npm run dev

Key Features Explained

1. Atomic Hiring Logic (MongoDB Transactions)
   The hiring process uses MongoDB transactions to ensure data consistency:

- Gig status changes from 'open' to 'assigned'
- Selected bid status changes to 'hired'
- All other bids automatically become 'rejected'
- All operations execute atomically (all or nothing)

This prevents race conditions where two clients might try to hire different freelancers simultaneously.

2. Real-time Notifications (Socket.io)
   When a freelancer is hired:

- Backend emits a Socket.io event to the freelancer's room
- Frontend receives instant notification without page refresh
- Notification shows: "You have been hired for [Project Name]!"
- Auto-dismisses after 5 seconds

3. Dual Role System
   Users have a fluid role system:

- Any logged-in user can post gigs (act as client)
- Any logged-in user can bid on gigs (act as freelancer)
- Users cannot bid on their own gigs

4. How to test application

- Open to windows(normal + incognito) and make 2 accounts and create gig and submit bid
