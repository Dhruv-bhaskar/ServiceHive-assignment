# GigFlow - Mini Freelance Marketplace Platform

A full-stack freelance marketplace where clients can post gigs and freelancers can bid on them. Built with MERN stack, Redux Toolkit, and Socket.io for real-time notifications.

## 🚀 Features

### Core Features

- ✅ **User Authentication** - Secure JWT-based auth with HttpOnly cookies
- ✅ **Dual Role System** - Users can be both clients and freelancers
- ✅ **Gig Management** - CRUD operations for job postings
- ✅ **Search & Filter** - Search gigs by title
- ✅ **Bidding System** - Freelancers can submit bids with price and proposal
- ✅ **Atomic Hiring Logic** - MongoDB transactions ensure race-condition-safe hiring

### Bonus Features (Implemented)

- ✅ **MongoDB Transactions** - Prevents race conditions during hiring
- ✅ **Real-time Notifications** - Socket.io powered instant notifications when hired

## 🛠️ Tech Stack

### Frontend

- React.js 18 (Vite)
- Redux Toolkit (State Management)
- React Router v6
- Tailwind CSS
- Axios
- Socket.io Client

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io
- Bcrypt.js

## 📦 Project Structure

```
gigflow/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── gigs.js
│   │   └── bids.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Notifications.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreateGig.jsx
    │   │   ├── GigDetails.jsx
    │   │   ├── MyGigs.jsx
    │   │   └── MyBids.jsx
    │   ├── store/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── gigSlice.js
    │   │       ├── bidSlice.js
    │   │       └── notificationSlice.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── .env
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Dhruv-bhaskar/ServiceHive-assignment.git
cd gigflow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
FRONTEND_URL=http://localhost:5173
```

**Important:** Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
POST /api/auth/logout   - Logout user
GET  /api/auth/me       - Get current user
```

### Gigs

```
GET    /api/gigs           - Get all open gigs (supports ?search=query)
POST   /api/gigs           - Create new gig (Protected)
GET    /api/gigs/:id       - Get single gig
GET    /api/gigs/my-gigs   - Get user's posted gigs (Protected)
PUT    /api/gigs/:id       - Update gig (Owner only)
DELETE /api/gigs/:id       - Delete gig (Owner only)
```

### Bids

```
POST  /api/bids              - Submit a bid (Protected)
GET   /api/bids/:gigId       - Get all bids for a gig (Owner only)
GET   /api/bids/my-bids/all  - Get user's submitted bids (Protected)
PATCH /api/bids/:bidId/hire  - Hire freelancer (Owner only, uses MongoDB Transactions)
```

## 🎯 Key Features Explained

### 1. Atomic Hiring Logic (MongoDB Transactions)

The hiring process uses MongoDB transactions to ensure data consistency:

```javascript
// When a client clicks "Hire" on a bid:
1. Gig status changes from 'open' to 'assigned'
2. Selected bid status changes to 'hired'
3. All other bids automatically become 'rejected'
4. All operations execute atomically (all or nothing)
```

This prevents race conditions where two clients might try to hire different freelancers simultaneously.

### 2. Real-time Notifications (Socket.io)

When a freelancer is hired:

- Backend emits a Socket.io event to the freelancer's room
- Frontend receives instant notification without page refresh
- Notification shows: "You have been hired for [Project Name]!"
- Auto-dismisses after 5 seconds

### 3. Dual Role System

Users have a fluid role system:

- Any logged-in user can post gigs (act as client)
- Any logged-in user can bid on gigs (act as freelancer)
- Users cannot bid on their own gigs

## 🧪 Testing the Hiring Workflow

### Scenario 1: Normal Hiring

1. Login as User A (Client)
2. Post a gig
3. Logout, Register/Login as User B (Freelancer)
4. Submit a bid
5. Login as User C (another Freelancer)
6. Submit another bid
7. Logout, Login as User A
8. Go to gig details
9. Click "Hire" on User B's bid
10. ✅ Verify: User B's bid = "hired", User C's bid = "rejected", Gig = "assigned"

### Scenario 2: Real-time Notification

1. Open two browser windows (normal + incognito)
2. Window 1: Login as Client
3. Window 2: Login as Freelancer (submit bid)
4. Window 1: Hire the freelancer
5. Window 2: ✅ Instant notification appears without refresh

## 🎓 Learning Resources

- [MongoDB Transactions](https://www.mongodb.com/docs/manual/core/transactions/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [JWT Best Practices](https://jwt.io/introduction)
