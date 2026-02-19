/**
 * Structured Logger with Correlation ID Support
 * 
 * This logger provides:
 * - Structured JSON logging
 * - Correlation ID tracking across services
 * - Security-aware logging (never logs sensitive data)
 * - Multiple log levels
 * - Contextual information
 */

import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Define log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  trace: 5,
};

// Sensitive field patterns to redact
const SENSITIVE_PATTERNS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'creditCard',
  'ssn',
  'authorization',
];

/**
 * Redact sensitive information from logs
 */
function redactSensitiveData(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const redacted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => 
      lowerKey.includes(pattern.toLowerCase())
    );

    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

/**
 * Custom Winston format for structured logging
 */
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const {
      timestamp,
      level,
      message,
      correlationId,
      service,
      userId,
      ...metadata
    } = info;

    const logEntry: any = {
      timestamp,
      level,
      service,
      correlationId,
      message,
    };

    if (userId) {
      logEntry.userId = userId;
    }

    // Redact sensitive data from metadata
    const safeMetadata = redactSensitiveData(metadata);

    if (Object.keys(safeMetadata).length > 0) {
      logEntry.metadata = safeMetadata;
    }

    return JSON.stringify(logEntry);
  })
);

/**
 * Create a logger instance for a service
 */
export function createLogger(serviceName: string) {
  const logger = winston.createLogger({
    levels: LOG_LEVELS,
    level: process.env.LOG_LEVEL || 'info',
    format: structuredFormat,
    transports: [
      // Console transport for development
      new winston.transports.Console({
        format: process.env.NODE_ENV === 'production'
          ? structuredFormat
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
      }),
      // File transports for production
      ...(process.env.NODE_ENV === 'production'
        ? [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
            }),
          ]
        : []),
    ],
  });

  return {
    /**
     * Log with correlation ID and service context
     */
    log(level: string, message: string, metadata: any = {}) {
      logger.log(level, message, {
        service: serviceName,
        ...metadata,
      });
    },

    error(message: string, error?: Error, metadata: any = {}) {
      logger.error(message, {
        service: serviceName,
        error: error?.message,
        stack: error?.stack,
        ...metadata,
      });
    },

    warn(message: string, metadata: any = {}) {
      logger.warn(message, {
        service: serviceName,
        ...metadata,
      });
    },

    info(message: string, metadata: any = {}) {
      logger.info(message, {
        service: serviceName,
        ...metadata,
      });
    },

    debug(message: string, metadata: any = {}) {
      logger.debug(message, {
        service: serviceName,
        ...metadata,
      });
    },

    trace(message: string, metadata: any = {}) {
      logger.log('trace', message, {
        service: serviceName,
        ...metadata,
      });
    },
  };
}

/**
 * Generate a new correlation ID
 */
export function generateCorrelationId(): string {
  return uuidv4();
}

/**
 * Express middleware to add correlation ID to requests
 */
export function correlationIdMiddleware(req: any, res: any, next: any) {
  // Use existing correlation ID or generate new one
  req.correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
  
  // Add correlation ID to response headers
  res.setHeader('X-Correlation-Id', req.correlationId);
  
  next();
}

/**
 * Express middleware for request logging
 */
export function requestLoggingMiddleware(logger: ReturnType<typeof createLogger>) {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    // Log request
    logger.info('Incoming request', {
      correlationId: req.correlationId,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Log response
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const level = res.statusCode >= 400 ? 'error' : 'info';

      logger.log(level, 'Request completed', {
        correlationId: req.correlationId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
      });
    });

    next();
  };
}

export default createLogger;
