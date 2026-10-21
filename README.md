# ShopEase 🛍️

A simple, beginner-friendly full-stack e-commerce project built with React (Vite), Express.js, and MongoDB with Mongoose.

---

## 📁 Project Structure

```text
CodeAlpha_ShopEase/
├── frontend/                     # React application created with Vite
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── App.css               # Main component styling
│   │   ├── index.css             # Design tokens and base styles
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML entry point with fonts & meta
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration with API proxy
│
└── backend/                      # Node.js + Express REST API
    ├── config/
    │   └── db.js                 # MongoDB connection using Mongoose
    ├── controllers/
    │   └── healthController.js   # Health check controller
    ├── models/
    │   └── Product.js            # Sample Mongoose Product schema
    ├── routes/
    │   └── healthRoutes.js       # Health check route definitions
    ├── .env                      # Environment variables
    ├── .env.example              # Example environment configuration
    ├── package.json              # Backend dependencies and scripts
    └── server.js                 # Express server entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ installed (tested with v24)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or remote MongoDB Atlas URI in `.env`)

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will start at:
- **Server URL**: [http://localhost:5000](http://localhost:5000)
- **Health Check API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

Response:
```json
{
  "status": "success",
  "message": "ShopEase API is running",
  "timestamp": "2026-10-21T16:39:30.268Z"
}
```

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to:
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite |
| **Styling** | Vanilla CSS (CSS3 variables, Flexbox & Grid) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Utilities** | CORS, Dotenv |

---

## 📝 Roadmap
- [x] Initial setup for `frontend` and `backend`
- [x] Express health check route (`GET /api/health`)
- [x] MongoDB database connection configuration
- [x] Basic folder structure: `routes/`, `controllers/`, `models/`
- [ ] Product catalog and listing
- [ ] Shopping cart functionality
- [ ] User authentication and login
- [ ] Order placement and checkout
