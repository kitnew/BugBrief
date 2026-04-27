// src/index.ts
import express from 'express';
import cors from 'cors';
import { initSchema } from './db.js';
import bugRoutes from './routes/bugRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://main.d8h80raj6aco8.amplifyapp.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'bugbrief-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', bugRoutes);

initSchema()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database schema:', error);
    process.exit(1);
  });