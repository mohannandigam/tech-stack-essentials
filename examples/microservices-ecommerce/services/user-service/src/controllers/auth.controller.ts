/**
 * Authentication Controller
 * 
 * Handles user registration and authentication
 * Demonstrates:
 * - Input validation
 * - Password hashing
 * - JWT token generation
 * - Secure error responses
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { createLogger } from '../../../../shared/src/logger';
import { ApiError, validateEmail, validatePassword } from '../../../../shared/src/security';

const router = Router();
const logger = createLogger('user-service:auth');

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate JWT access token
 */
function generateAccessToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

/**
 * Generate JWT refresh token
 */
function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
}

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  const correlationId = (req as any).correlationId;

  // Validate request body
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    logger.warn('Registration validation failed', {
      correlationId,
      errors: error.details.map(d => d.message),
    });
    throw new ApiError(400, 'Validation failed', error.details);
  }

  const { email, password, firstName, lastName } = value;

  // Additional password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    logger.warn('Password validation failed', {
      correlationId,
      errors: passwordValidation.errors,
    });
    throw new ApiError(400, 'Password does not meet requirements', {
      errors: passwordValidation.errors,
    });
  }

  // TODO: Check if user already exists in database
  // For this example, we'll simulate success

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // TODO: Save user to database
  const mockUserId = 'user-' + Date.now();

  logger.info('User registered successfully', {
    correlationId,
    userId: mockUserId,
    email,
  });

  // Generate tokens
  const accessToken = generateAccessToken(mockUserId, email, 'customer');
  const refreshToken = generateRefreshToken(mockUserId);

  // Return tokens (in production, set refresh token in httpOnly cookie)
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: mockUserId,
      email,
      firstName,
      lastName,
      role: 'customer',
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', async (req: Request, res: Response) => {
  const correlationId = (req as any).correlationId;

  // Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    logger.warn('Login validation failed', {
      correlationId,
      errors: error.details.map(d => d.message),
    });
    throw new ApiError(400, 'Validation failed', error.details);
  }

  const { email, password } = value;

  // TODO: Fetch user from database
  // For this example, we'll simulate a user
  const mockUser = {
    id: 'user-123',
    email: email,
    passwordHash: await bcrypt.hash('Password123!', 12), // Mock hash
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
  };

  // Verify password
  const isValidPassword = await bcrypt.compare(password, mockUser.passwordHash);
  
  if (!isValidPassword) {
    logger.warn('Invalid login attempt', {
      correlationId,
      email,
    });
    // Use generic message to prevent user enumeration
    throw new ApiError(401, 'Invalid email or password');
  }

  logger.info('User logged in successfully', {
    correlationId,
    userId: mockUser.id,
    email,
  });

  // Generate tokens
  const accessToken = generateAccessToken(mockUser.id, mockUser.email, mockUser.role);
  const refreshToken = generateRefreshToken(mockUser.id);

  res.json({
    message: 'Login successful',
    user: {
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      role: mockUser.role,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  const correlationId = (req as any).correlationId;
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'refresh-secret'
    ) as { userId: string };

    // TODO: Verify token is not revoked (check database)

    // TODO: Fetch user from database
    const mockUser = {
      id: decoded.userId,
      email: 'user@example.com',
      role: 'customer',
    };

    // Generate new access token
    const newAccessToken = generateAccessToken(
      mockUser.id,
      mockUser.email,
      mockUser.role
    );

    logger.info('Token refreshed', {
      correlationId,
      userId: mockUser.id,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    logger.warn('Invalid refresh token', {
      correlationId,
      error: (error as Error).message,
    });
    throw new ApiError(401, 'Invalid refresh token');
  }
});

/**
 * POST /api/auth/logout
 * Logout user (revoke refresh token)
 */
router.post('/logout', async (req: Request, res: Response) => {
  const correlationId = (req as any).correlationId;
  const { refreshToken } = req.body;

  if (refreshToken) {
    // TODO: Revoke refresh token in database
    logger.info('User logged out', {
      correlationId,
    });
  }

  res.json({
    message: 'Logout successful',
  });
});

export { router as authRouter };
