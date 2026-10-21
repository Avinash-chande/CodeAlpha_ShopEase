import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ShopEase Backend API' });
});

// API Routes
app.use('/api', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ShopEase server running on http://localhost:${PORT}`);
  console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
});
