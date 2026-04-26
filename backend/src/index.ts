import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Other routes here...

// app.get('/health', (req, res) => {
//   // Check database connection
//   const dbConnected = true; // Replace with actual db check
  
//   res.status(dbConnected ? 200 : 503).json({
//     status: dbConnected ? 'ok' : 'degraded',
//     database: dbConnected ? 'connected' : 'disconnected',
//     timestamp: new Date().toISOString()
//   });
// });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

