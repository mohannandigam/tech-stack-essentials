/**
 * Security Utilities
 * 
 * Provides security-related utilities:
 * - Input validation
 * - JWT token management
 * - Password hashing
 * - Rate limiting
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Standard API error response format
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Input validation helper
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Rate limiting store interface
 */
interface RateLimitStore {
  increment(key: string): Promise<number>;
  reset(key: string): Promise<void>;
}

/**
 * In-memory rate limit store (use Redis in production)
 */
class MemoryRateLimitStore implements RateLimitStore {
  private store: Map<string, { count: number; resetAt: number }> = new Map();

  async increment(key: string): Promise<number> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt < now) {
      // Create new entry or reset expired one
      this.store.set(key, {
        count: 1,
        resetAt: now + 15 * 60 * 1000, // 15 minutes
      });
      return 1;
    }

    entry.count++;
    return entry.count;
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  // Cleanup expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Rate limiting middleware
 */
export function rateLimiter(options: {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests, please try again later',
  } = options;

  const store = new MemoryRateLimitStore();

  // Cleanup every 5 minutes
  setInterval(() => store.cleanup(), 5 * 60 * 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate-limit:${req.ip}`;

    try {
      const count = await store.increment(key);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count));

      if (count > maxRequests) {
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
        return res.status(429).json({
          error: 'Too Many Requests',
          message,
        });
      }

      next();
    } catch (error) {
      // If rate limiting fails, allow request but log error
      console.error('Rate limiting error:', error);
      next();
    }
  };
}

/**
 * Authentication middleware placeholder
 * (Implementation would use JWT verification)
 */
export function authenticate(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No authentication token provided',
    });
  }

  // TODO: Verify JWT token
  // For now, pass through
  next();
}

/**
 * Authorization middleware
 */
export function authorize(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      details: error.details,
      correlationId: (req as any).correlationId,
    });
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    correlationId: (req as any).correlationId,
  });
}

export default {
  ApiError,
  validateEmail,
  validatePassword,
  sanitizeInput,
  rateLimiter,
  authenticate,
  authorize,
  errorHandler,
};
