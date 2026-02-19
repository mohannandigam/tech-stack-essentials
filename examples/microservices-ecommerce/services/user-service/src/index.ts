/**
 * User Service Entry Point
 * 
 * Demonstrates best practices:
 * - Structured logging with correlation IDs
 * - Security middleware (helmet, cors, rate limiting)
 * - Health check endpoints
 * - Graceful shutdown
 * - Error handling
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';
import { createLogger, correlationIdMiddleware, requestLoggingMiddleware } from '../../../shared/src/logger';
import { rateLimiter, errorHandler } from '../../../shared/src/security';
import { authRouter } from './controllers/auth.controller';
import { userRouter } from './controllers/user.controller';
import { healthRouter } from './controllers/health.controller';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = createLogger('user-service');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet - Sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS - Configure cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ============================================================
// REQUEST PARSING
// ============================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// LOGGING & CORRELATION
// ============================================================

// Add correlation ID to all requests
app.use(correlationIdMiddleware);

// Log all requests
app.use(requestLoggingMiddleware(logger));

// ============================================================
// RATE LIMITING
// ============================================================

// Apply rate limiting to all routes
app.use(rateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
}));

// Stricter rate limiting for auth endpoints
app.use('/api/auth', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts
  message: 'Too many authentication attempts, please try again later',
}));

// ============================================================
// ROUTES
// ============================================================

// Health check endpoints (no rate limiting)
app.use('/health', healthRouter);

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'user-service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    correlationId: (req as any).correlationId,
  });
});

// Global error handler
app.use(errorHandler);

// ============================================================
// SERVER STARTUP & SHUTDOWN
// ============================================================

const server = app.listen(PORT, () => {
  logger.info(`User service started`, {
    port: PORT,
    env: process.env.NODE_ENV,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    // Close database connections, etc.
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', new Error(String(reason)), {
    promise: promise,
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

export default app;
