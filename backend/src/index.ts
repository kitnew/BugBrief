// src/index.ts
import express from 'express';
import cors from 'cors';
import { initSchema } from './db.js';
import bugRoutes from './routes/bugRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Підключаємо наші маршрути
app.use('/', bugRoutes); 

initSchema().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});