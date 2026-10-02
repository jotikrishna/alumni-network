# AlumniConnect - MERN Stack Alumni Networking Platform

> **"Connect. Network. Grow."**

AlumniConnect is a clean, modern, and simple full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables university graduates, current students, and faculty members to connect, share job postings, organize events, and manage alumni profiles.

---

## 🚀 Key Features

- **🔐 Authentication & Security**: JWT-based login and registration with hashed passwords (`bcryptjs`) and route protection.
- **📊 Interactive Dashboard**: Metrics overview showing total registered alumni, active jobs, and upcoming events.
- **👨‍🎓 Alumni Directory**: Filter alumni cards by department or graduation year, and search by name or job title.
- **👤 Alumnus Profile**: Detailed public profiles highlighting bio, company, position, skills, and direct email contact.
- **💼 Job Portal**: Post, edit, delete, search, and apply for career opportunities listed by alumni.
- **📅 Events Module**: Schedule, update, delete, and view upcoming reunions, technical webinars, and networking meetups.
- **✉️ Contact Portal**: Direct inquiry submission stored securely in MongoDB (`ContactMessage`).
- **📱 Responsive UI**: Tailored layouts for Desktop (1920px/1366px), Tablet (1024px/768px), and Mobile (390px).

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (v18)
- **Vite** (Build tool)
- **React Router** (v6)
- **Axios** (API requests with JWT Interceptors)
- **Lucide React** (Modern iconography)
- **Vanilla CSS** (Custom responsive design system)

### Backend
- **Node.js** (Runtime)
- **Express.js** (Web framework)
- **Mongoose** (MongoDB ODM)
- **JSONWebToken (JWT)** (Authentication)
- **Bcryptjs** (Password hashing)
- **MongoMemoryServer** (Automatic fallback for local dev execution)

---

## 📁 Project Structure

```
alumni-network/
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT & state management)
│   │   ├── pages/              # Home, About, Register, Login, Dashboard,
│   │   │                       # AlumniDirectory, AlumniProfile, Jobs, Events, Profile, Contact
│   │   ├── services/           # Axios API configuration (api.js)
│   │   ├── App.jsx             # React Router routing
│   │   ├── index.css           # Global custom CSS design system
│   │   └── main.jsx            # Entry point
│   ├── .env                    # Frontend environment variables
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # auth, user, job, event, contact controllers
│   ├── middleware/             # authMiddleware (JWT verification)
│   ├── models/                 # User, Job, Event, ContactMessage schemas
│   ├── routes/                 # Express API routes
│   ├── .env                    # Backend environment variables
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                 # Database seeding script (5 users, 5 jobs, 5 events)
│   └── server.js               # Express application entry
│
├── .gitignore
└── README.md
```

---

## 🔑 Demo Login Credentials

For testing and demonstration, run `npm run seed` in the `server` directory to populate the database with sample data:

| Role / Title | Email | Password | Department | Company |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@alumniconnect.com` | `password123` | Administration | AlumniConnect |
| **Senior Engineer** | `sarah.j@example.com` | `password123` | Computer Science | Google |
| **Embedded Lead** | `alex.rivera@example.com` | `password123` | Electrical Engg | Tesla |
| **Product Manager** | `priya.s@example.com` | `password123` | Information Tech | Microsoft |
| **Financial Analyst** | `michael.c@example.com` | `password123` | Business Admin | Goldman Sachs |
| **Aerospace Lead** | `emily.w@example.com` | `password123` | Mechanical Engg | SpaceX |

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/alumni_connect
JWT_SECRET=alumniconnect_super_secret_jwt_key_2026
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (Local service or MongoDB Atlas URI)

### 2. Backend Installation & Seeding
```bash
cd server
npm install
npm run seed      # Seeds 5 sample users, jobs, and events
npm run dev       # Starts Express server on http://localhost:5000
```

### 3. Frontend Installation & Execution
```bash
cd client
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new alumnus user |
| **POST** | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| **GET** | `/api/auth/me` | Protected | Fetch currently authenticated user |
| **GET** | `/api/users` | Public | Fetch all alumni (supports `search`, `department`, `graduationYear`) |
| **GET** | `/api/users/:id` | Public | Fetch single alumnus profile by ID |
| **PUT** | `/api/users/profile` | Protected | Update profile information |
| **GET** | `/api/jobs` | Public | Fetch all job postings |
| **POST** | `/api/jobs` | Protected | Post a new job opportunity |
| **PUT** | `/api/jobs/:id` | Protected | Update job posting (owner only) |
| **DELETE** | `/api/jobs/:id` | Protected | Delete job posting (owner only) |
| **GET** | `/api/events` | Public | Fetch upcoming events |
| **POST** | `/api/events` | Protected | Create a new alumni event |
| **PUT** | `/api/events/:id` | Protected | Update event details (creator only) |
| **DELETE** | `/api/events/:id` | Protected | Delete event (creator only) |
| **POST** | `/api/contact` | Public | Submit contact form message |
| **GET** | `/api/messages/conversations` | Protected | Fetch logged-in user's active conversation list |
| **GET** | `/api/messages/:userId` | Protected | Fetch private message history with alumnus |
| **POST** | `/api/messages/:userId` | Protected | Send private message to alumnus |
| **DELETE** | `/api/messages/:messageId` | Protected | Delete message sent by logged-in user |
| **GET** | `/api/admin/stats` | Admin | Fetch system-wide metrics and stats overview |
| **GET** | `/api/admin/users` | Admin | List all registered users with full details |
| **PUT** | `/api/admin/users/:id/role` | Admin | Update user role (`user` / `admin`) |
| **DELETE** | `/api/admin/users/:id` | Admin | Delete user account and associated content |
| **GET** | `/api/admin/messages` | Admin | Fetch all contact form submissions |
| **DELETE** | `/api/admin/messages/:id` | Admin | Delete a contact form submission |

---

## 🚀 Deployment Instructions

1. **Backend Deployment (Render / Railway / Heroku)**:
   - Set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
   - Command: `npm start` (runs `node server.js`).

2. **Frontend Deployment (Vercel / Netlify)**:
   - Set environment variable `VITE_API_URL` pointing to deployed backend URL (e.g., `https://your-backend.onrender.com/api`).
   - Build command: `npm run build`.

---

## 📜 License

This project is open-source and created for university/student educational demonstrations.
