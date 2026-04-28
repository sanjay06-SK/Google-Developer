import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { initDb } from './data/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Smart Resource Allocation API' });
});

// Initialize DB then start Server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server running smoothly on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  - GET  /api/stats`);
    console.log(`  - GET  /api/volunteers`);
    console.log(`  - GET  /api/allocations`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});
