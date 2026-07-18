import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import apiRoutes from './routes/index.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // strips $/. keys from req.body/query to prevent NoSQL injection

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Bonus: basic rate limiting, applied globally to the API to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// --- Routes ---
app.use('/api', apiRoutes);

// --- 404 + global error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
