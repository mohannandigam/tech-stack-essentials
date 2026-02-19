/**
 * Health Check Controller
 * 
 * Provides health check endpoints for monitoring and orchestration
 * - /health - Basic health check
 * - /health/ready - Readiness probe (checks dependencies)
 * - /health/live - Liveness probe
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Track service start time
const startTime = new Date();

/**
 * GET /health
 * Basic health check endpoint
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'user-service',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime.getTime()) / 1000),
  });
});

/**
 * GET /health/ready
 * Readiness probe - checks if service can handle requests
 * Checks database connections, external dependencies, etc.
 */
router.get('/ready', async (req: Request, res: Response) => {
  const checks = {
    service: true,
    database: false,
    cache: false,
  };

  try {
    // TODO: Check database connection
    // Example: await db.query('SELECT 1');
    checks.database = true;

    // TODO: Check Redis connection
    // Example: await redis.ping();
    checks.cache = true;

    const allHealthy = Object.values(checks).every(check => check === true);

    if (allHealthy) {
      res.status(200).json({
        status: 'ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      checks,
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /health/live
 * Liveness probe - checks if service is alive
 * Should return 200 if the application is running
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRouter };
