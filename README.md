# 🌿 Gossip — Full Stack (Phase 2: Auth + User Accounts)

React + Node.js + MongoDB + Firebase Auth

---

## 📁 Project Structure

```
Gossip-fullstack/
├── client/                  ← React frontend
│   ├── src/
│   │   ├── App.js           ← Router + AOS init
│   │   ├── context/
│   │   │   └── AuthContext.jsx   ← Global Firebase auth state
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx         ← Auth-aware navbar with dropdown
│   │   │       └── ProtectedRoute.jsx ← Redirect if not logged in
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      ← Landing page
│   │   │   ├── LoginPage.jsx     ← Login form
│   │   │   ├── RegisterPage.jsx  ← Register form + password strength
│   │   │   └── DashboardPage.jsx ← Profile / Favourites / Orders / Meal Plan
│   │   └── utils/
│   │       ├── firebase.js  ← Firebase client config
│   │       └── api.js       ← Axios + auto token injection
│   └── .env.example
│
└── server/                  ← Node.js + Express backend
    ├── index.js             ← Express entry point
    ├── config/
    │   ├── db.js            ← MongoDB connection
    │   └── firebase.js      ← Firebase Admin SDK
    ├── middleware/
    │   └── auth.js          ← Firebase token verification
    ├── models/
    │   └── User.js          ← MongoDB user schema
    ├── controllers/
    │   └── userController.js ← All user logic
    └── routes/
        └── users.js         ← API routes
```

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it `Gossip`
3. Go to **Authentication** → **Sign-in method** → Enable **Email/Password**
4. Go to **Project Settings** → **Your apps** → Add a **Web app**
   - Copy the config values for `client/.env`
5. Go to **Project Settings** → **Service accounts** → **Generate new private key**
   - Download the JSON file — copy values for `server/.env`

---

### Step 2 — Set Up MongoDB

**Option A — Local MongoDB:**

```bash
# Install MongoDB: https://www.mongodb.com/try/download/community
# Start MongoDB:
mongod --dbpath /data/db
# Connection string:
MONGODB_URI=mongodb://localhost:27017/businh
```

**Option B — MongoDB Atlas (free cloud):**

1. Sign up at https://cloud.mongodb.com
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string (replace `<password>`)

---

### Step 3 — Configure Environment Variables

```bash
# Server
cd server
cp .env.example .env
# Fill in: MONGODB_URI, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

# Client
cd ../client
cp .env.example .env
# Fill in all REACT_APP_FIREBASE_* values from Step 1
```

---

### Step 4 — Install & Run

**Terminal 1 — Backend:**

```bash
cd server
npm install
npm run dev
# ✅ Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
cd client
npm install
npm start
# ✅ App running on http://localhost:3000
```

---

## 🔌 API Endpoints

All routes require `Authorization: Bearer <firebase_id_token>` header.

| Method | Endpoint                          | Description                   |
| ------ | --------------------------------- | ----------------------------- |
| POST   | `/api/users/sync`                 | Sync Firebase user to MongoDB |
| GET    | `/api/users/profile`              | Get full profile              |
| PUT    | `/api/users/profile`              | Update name, bio, avatar      |
| GET    | `/api/users/favourites`           | Get saved recipe IDs          |
| POST   | `/api/users/favourites/:recipeId` | Toggle recipe favourite       |
| GET    | `/api/users/orders`               | Get order history             |
| GET    | `/api/users/mealplan`             | Get weekly meal plan          |
| PUT    | `/api/users/mealplan`             | Update a meal slot            |
| GET    | `/api/health`                     | Health check                  |

---

## ✨ Features (Phase 2)

- ✅ Firebase Email/Password auth
- ✅ Register with name, email, password + strength meter
- ✅ Login with forgot password (email reset)
- ✅ JWT token auto-attached to every API request
- ✅ MongoDB user profile (name, bio, avatar)
- ✅ Saved/favourite recipes with toggle
- ✅ Order history display
- ✅ Weekly meal plan builder (save per day)
- ✅ Protected routes (redirect to login)
- ✅ Auth-aware navbar with dropdown menu
- ✅ Rate limiting, CORS, Helmet security headers

---

## 🗺️ What's Coming Next

- **Phase 1** — Menu/Shop Page + Cart
- **Phase 3** — Recipe Pages + Search + Filters
- **Phase 4** — Dark Mode + Framer Motion animations
- **Phase 5** — PWA + Reviews + Blog
