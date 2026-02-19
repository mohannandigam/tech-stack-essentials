# Logging Best Practices Guide

## Overview

This guide explains the logging strategy implemented in the microservices e-commerce application. Effective logging is crucial for debugging, monitoring, and understanding system behavior in production.

## Table of Contents

1. [Logging Architecture](#logging-architecture)
2. [Structured Logging](#structured-logging)
3. [Correlation IDs](#correlation-ids)
4. [Log Levels](#log-levels)
5. [What to Log](#what-to-log)
6. [What NOT to Log](#what-not-to-log)
7. [Centralized Logging](#centralized-logging)
8. [Best Practices](#best-practices)

## Logging Architecture

### Components

```
Application → Logger → Output (Console/File/Service)
                ↓
          Correlation ID Tracking
                ↓
          Sensitive Data Redaction
                ↓
          Structured Format (JSON)
```

### Logger Implementation

Located in `shared/src/logger.ts`:

```typescript
import { createLogger } from "@ecommerce/shared";

const logger = createLogger("user-service");

logger.info("User logged in", {
  correlationId: req.correlationId,
  userId: user.id,
  email: user.email,
});
```

## Structured Logging

### Why Structured Logging?

- Easy to parse and search
- Consistent format across services
- Machine-readable for log aggregation tools
- Better for analytics and monitoring

### Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "service": "user-service",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "message": "User logged in successfully",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "duration": 45
  }
}
```

### Fields Explanation

- **timestamp**: ISO 8601 format for consistent time tracking
- **level**: Log severity (error, warn, info, debug, trace)
- **service**: Which microservice generated the log
- **correlationId**: Unique ID to track requests across services
- **userId**: User who triggered the action (if applicable)
- **message**: Human-readable description
- **metadata**: Additional context-specific information

## Correlation IDs

### What is a Correlation ID?

A unique identifier that follows a request through all services, making it possible to trace a single user action across the entire system.

### How It Works

```
1. API Gateway receives request
   → Generates correlationId: "abc-123"
   → Logs: [abc-123] Request received

2. User Service processes request
   → Receives correlationId: "abc-123"
   → Logs: [abc-123] Validating user

3. Order Service processes order
   → Receives correlationId: "abc-123"
   → Logs: [abc-123] Creating order

4. All logs share the same correlationId
   → Easy to trace the entire flow
```

### Implementation

**Middleware:**

```typescript
export function correlationIdMiddleware(req, res, next) {
  // Use existing or generate new
  req.correlationId =
    req.headers["x-correlation-id"] || generateCorrelationId();

  // Add to response headers
  res.setHeader("X-Correlation-Id", req.correlationId);

  next();
}
```

**Logging with Correlation ID:**

```typescript
logger.info("Processing order", {
  correlationId: req.correlationId,
  orderId: order.id,
  amount: order.total,
});
```

**Service-to-Service Communication:**

```typescript
// Pass correlation ID to other services
const response = await fetch("http://product-service/api/products", {
  headers: {
    "X-Correlation-Id": req.correlationId,
    Authorization: `Bearer ${token}`,
  },
});
```

## Log Levels

### Available Levels

| Level     | When to Use                          | Examples                                         |
| --------- | ------------------------------------ | ------------------------------------------------ |
| **ERROR** | Application errors, exceptions       | Database connection failed, unhandled errors     |
| **WARN**  | Warning conditions, deprecated usage | High memory usage, slow queries, API deprecation |
| **INFO**  | Important business events            | User login, order placed, payment processed      |
| **DEBUG** | Detailed diagnostic information      | Function parameters, intermediate values         |
| **TRACE** | Very detailed debugging              | Step-by-step execution, variable states          |

### Level Guidelines

**Production:**

- Set to `INFO` or `WARN`
- Captures business events and problems
- Doesn't flood logs with details

**Staging:**

- Set to `DEBUG`
- More detailed for testing
- Helps identify issues before production

**Development:**

- Set to `DEBUG` or `TRACE`
- Maximum verbosity
- Understand code execution

### Setting Log Level

```bash
# Environment variable
LOG_LEVEL=info

# In code
const logger = createLogger('service-name');
// Respects LOG_LEVEL from environment
```

## What to Log

### Business Events

```typescript
// ✅ User registration
logger.info("User registered", {
  correlationId,
  userId: user.id,
  email: user.email,
});

// ✅ Order placed
logger.info("Order placed", {
  correlationId,
  userId: user.id,
  orderId: order.id,
  totalAmount: order.total,
});

// ✅ Payment processed
logger.info("Payment processed", {
  correlationId,
  orderId: order.id,
  paymentMethod: "credit_card",
  amount: payment.amount,
});
```

### Technical Events

```typescript
// ✅ Service startup
logger.info("Service started", {
  port: PORT,
  env: NODE_ENV,
  version: "1.0.0",
});

// ✅ Database connection
logger.info("Database connected", {
  host: DB_HOST,
  database: DB_NAME,
});

// ✅ External API call
logger.debug("Calling external API", {
  correlationId,
  url: "https://api.example.com",
  method: "POST",
});
```

### Errors and Exceptions

```typescript
// ✅ Application errors
logger.error("Failed to create order", error, {
  correlationId,
  userId: user.id,
  orderData: sanitizedOrderData,
});

// ✅ Validation errors
logger.warn("Validation failed", {
  correlationId,
  endpoint: req.path,
  errors: validationErrors,
});

// ✅ Database errors
logger.error("Database query failed", error, {
  correlationId,
  query: "SELECT * FROM users",
  error: error.message,
});
```

### Performance Metrics

```typescript
// ✅ Request duration
logger.info("Request completed", {
  correlationId,
  method: req.method,
  path: req.path,
  statusCode: res.statusCode,
  duration: Date.now() - startTime,
});

// ✅ Slow queries
if (duration > 1000) {
  logger.warn("Slow database query", {
    correlationId,
    query: "complex query",
    duration,
  });
}
```

## What NOT to Log

### Sensitive Information

```typescript
// ❌ NEVER log passwords
logger.info("User login", {
  email: user.email,
  password: user.password, // NEVER DO THIS
});

// ❌ NEVER log tokens
logger.debug("API call", {
  token: authToken, // NEVER DO THIS
});

// ❌ NEVER log credit card numbers
logger.info("Payment", {
  creditCard: "4111-1111-1111-1111", // NEVER DO THIS
});

// ❌ NEVER log API keys
logger.debug("External service", {
  apiKey: process.env.API_KEY, // NEVER DO THIS
});
```

### Automatic Redaction

Our logger automatically redacts sensitive fields:

```typescript
const SENSITIVE_PATTERNS = [
  "password",
  "token",
  "secret",
  "apiKey",
  "creditCard",
  "ssn",
  "authorization",
];

// Automatically redacted
logger.info("User data", {
  email: "user@example.com",
  password: "secret123", // → '[REDACTED]'
  token: "abc123", // → '[REDACTED]'
});
```

### Personal Identifiable Information (PII)

Be careful with PII under GDPR/CCPA:

```typescript
// ⚠️ Be cautious
logger.info("User action", {
  email: user.email, // Might be PII
  name: user.fullName, // Might be PII
  ipAddress: req.ip, // Might be PII
  phoneNumber: user.phone, // Might be PII
});

// ✅ Better: Use IDs instead
logger.info("User action", {
  userId: user.id, // Not PII
  action: "profile_update",
});
```

## Centralized Logging

### ELK Stack (Elasticsearch, Logstash, Kibana)

```
Services → Logstash → Elasticsearch → Kibana (Visualization)
```

**Benefits:**

- Search across all services
- Create dashboards
- Set up alerts
- Analyze patterns

### Cloud Solutions

**AWS:**

- CloudWatch Logs
- CloudWatch Insights for querying

**GCP:**

- Cloud Logging (formerly Stackdriver)
- Log Explorer

**Azure:**

- Azure Monitor Logs
- Log Analytics

### Configuration Example

```typescript
// Winston transport for CloudWatch
import CloudWatchTransport from "winston-cloudwatch";

logger.add(
  new CloudWatchTransport({
    logGroupName: "ecommerce-services",
    logStreamName: `user-service-${process.env.NODE_ENV}`,
    awsRegion: "us-east-1",
  }),
);
```

## Best Practices

### 1. Use Correlation IDs

```typescript
// ✅ Always include correlation ID
logger.info("Event occurred", {
  correlationId: req.correlationId,
  // ... other data
});
```

### 2. Log at Boundaries

Log at system boundaries:

- Incoming requests
- Outgoing requests to other services
- Database queries
- External API calls

```typescript
// ✅ Log at entry point
app.use((req, res, next) => {
  logger.info("Request received", {
    correlationId: req.correlationId,
    method: req.method,
    path: req.path,
  });
  next();
});

// ✅ Log at exit point
res.on("finish", () => {
  logger.info("Response sent", {
    correlationId: req.correlationId,
    statusCode: res.statusCode,
  });
});
```

### 3. Include Context

```typescript
// ❌ Not enough context
logger.error("Error occurred");

// ✅ Good context
logger.error("Failed to create user", error, {
  correlationId,
  email: userData.email,
  error: error.message,
  stack: error.stack,
});
```

### 4. Use Appropriate Levels

```typescript
// ❌ Wrong level
logger.error("User logged in"); // Not an error

// ✅ Correct level
logger.info("User logged in", {
  correlationId,
  userId: user.id,
});
```

### 5. Don't Log in Loops

```typescript
// ❌ Logs thousands of messages
for (const item of items) {
  logger.debug("Processing item", { item });
}

// ✅ Log summary
logger.debug("Processing items", {
  count: items.length,
  startTime: Date.now(),
});
// ... process items ...
logger.debug("Items processed", {
  count: items.length,
  duration: Date.now() - startTime,
});
```

### 6. Log Sampling for High Volume

```typescript
// For very high volume endpoints
if (Math.random() < 0.1) { // Log 10% of requests
  logger.debug('High volume endpoint', { ... });
}
```

### 7. Rotate Log Files

```typescript
new winston.transports.File({
  filename: "logs/app.log",
  maxsize: 10485760, // 10MB
  maxFiles: 5,
  tailable: true,
});
```

## Querying Logs

### Example Queries

**Find all logs for a correlation ID:**

```json
{
  "query": {
    "match": {
      "correlationId": "abc-123"
    }
  }
}
```

**Find errors in last hour:**

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "error" } },
        {
          "range": {
            "timestamp": {
              "gte": "now-1h"
            }
          }
        }
      ]
    }
  }
}
```

**Find slow requests:**

```json
{
  "query": {
    "range": {
      "metadata.duration": {
        "gte": 1000
      }
    }
  }
}
```

## Monitoring and Alerting

### Set Up Alerts For:

1. **High Error Rate**
   - More than 5% of requests fail
   - Alert: Send to on-call engineer

2. **Service Down**
   - No logs received in 5 minutes
   - Alert: Critical - page on-call

3. **Slow Performance**
   - P95 latency > 1000ms
   - Alert: Warning - investigate

4. **Security Events**
   - Multiple failed login attempts
   - Alert: Security team

## Additional Resources

- [Twelve-Factor App - Logs](https://12factor.net/logs)
- [Structured Logging Best Practices](https://www.honeybadger.io/blog/structured-logging/)
- [Winston Documentation](https://github.com/winstonjs/winston)

## Summary

Good logging practices:

- ✅ Use structured JSON format
- ✅ Include correlation IDs
- ✅ Log at appropriate levels
- ✅ Redact sensitive data
- ✅ Centralize logs
- ✅ Set up monitoring and alerts
- ❌ Never log passwords, tokens, or secrets
- ❌ Don't log excessive detail in production
