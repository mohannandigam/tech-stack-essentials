# Security Guide

## Overview

This guide covers the security best practices implemented in the microservices e-commerce application. Security is implemented at multiple layers to provide defense in depth.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Input Validation](#input-validation)
3. [Data Protection](#data-protection)
4. [Network Security](#network-security)
5. [Monitoring & Auditing](#monitoring--auditing)
6. [Best Practices](#best-practices)

## Authentication & Authorization

### JWT-Based Authentication

The application uses JSON Web Tokens (JWT) for stateless authentication:

**Access Tokens:**

- Short-lived (15 minutes)
- Contains user ID, email, and role
- Used for API authentication
- Signed with HS256 algorithm

**Refresh Tokens:**

- Long-lived (7 days)
- Used to obtain new access tokens
- Stored in database (can be revoked)
- Rotated on each use

### Token Flow

```
1. User logs in with credentials
2. Server validates credentials
3. Server generates access token + refresh token
4. Client stores tokens securely
5. Client includes access token in Authorization header
6. When access token expires, use refresh token to get new one
7. On logout, refresh token is revoked
```

### Password Security

**Hashing:**

- Using bcrypt with cost factor 12
- Salting is automatic with bcrypt
- Never store plaintext passwords

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&\*)

**Example:**

```typescript
import bcrypt from "bcrypt";

// Hash password
const passwordHash = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, passwordHash);
```

### Role-Based Access Control (RBAC)

**Roles:**

- `customer` - Regular users
- `admin` - Administrative users
- `support` - Support staff

**Authorization Middleware:**

```typescript
// Require authentication
app.use("/api/users", authenticate);

// Require specific role
app.use("/api/admin", authorize("admin"));

// Allow multiple roles
app.use("/api/orders", authorize("customer", "admin"));
```

## Input Validation

### Validation Strategy

All user input is validated before processing:

1. **Schema Validation** - Using Joi for request validation
2. **Type Checking** - TypeScript for compile-time safety
3. **Sanitization** - Remove/escape malicious input
4. **Business Logic Validation** - Check business rules

### Example Validation

```typescript
import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

// Validate request
const { error, value } = userSchema.validate(req.body);
if (error) {
  throw new ApiError(400, "Validation failed", error.details);
}
```

### XSS Prevention

Sanitize user input to prevent Cross-Site Scripting:

```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
```

### SQL Injection Prevention

- Use parameterized queries
- Never concatenate user input into SQL
- Use ORM/Query Builder (e.g., TypeORM, Prisma)

```typescript
// ✅ SAFE: Parameterized query
const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// ❌ UNSAFE: String concatenation
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

## Data Protection

### Encryption at Rest

**Database:**

- Use encrypted connections (SSL/TLS)
- Enable transparent data encryption (TDE)
- Encrypt sensitive columns

**File Storage:**

- Encrypt files before storing
- Use cloud provider encryption (S3 encryption, etc.)

### Encryption in Transit

**HTTPS Only:**

- All API communication over HTTPS
- TLS 1.2 or higher
- Valid SSL certificates
- HTTP Strict Transport Security (HSTS)

**Configuration:**

```typescript
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);
```

### Sensitive Data Handling

**Never Log Sensitive Data:**

```typescript
const SENSITIVE_PATTERNS = [
  "password",
  "token",
  "secret",
  "apiKey",
  "creditCard",
  "ssn",
];

// Redact before logging
function redactSensitiveData(obj: any): any {
  // Implementation in shared/logger.ts
}
```

**PII Protection:**

- Collect only necessary data
- Anonymize when possible
- Implement data retention policies
- GDPR/CCPA compliance

## Network Security

### Security Headers

Using Helmet.js to set security headers:

```typescript
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
  }),
);
```

**Headers Set:**

- `Content-Security-Policy` - Prevent XSS
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `Strict-Transport-Security` - Force HTTPS
- `X-XSS-Protection` - Browser XSS protection

### CORS Configuration

```typescript
import cors from "cors";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### Rate Limiting

Prevent brute force and DDoS attacks:

```typescript
// General rate limiting
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  }),
);

// Stricter for auth endpoints
app.use(
  "/api/auth",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  }),
);
```

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
Retry-After: 900
```

## Monitoring & Auditing

### Audit Logging

Log all security-relevant events:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(100),      -- login, logout, password_change, etc.
  resource VARCHAR(100),
  resource_id UUID,
  ip_address VARCHAR(50),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP
);
```

**Events to Log:**

- User authentication (success/failure)
- Password changes
- Role changes
- Data access/modifications
- Failed authorization attempts
- Suspicious activities

### Security Monitoring

**Monitor for:**

- Multiple failed login attempts
- Access from unusual locations
- Unusual API usage patterns
- Privilege escalation attempts
- Data exfiltration patterns

**Alerting:**

- Set up alerts for security events
- Integrate with SIEM tools
- Real-time notifications for critical events

## Best Practices

### Development

1. **Never commit secrets to version control**
   - Use environment variables
   - Use secrets management (AWS Secrets Manager, etc.)
   - Add `.env` to `.gitignore`

2. **Keep dependencies updated**
   - Regularly run `npm audit`
   - Update vulnerable packages
   - Use automated dependency updates (Dependabot)

3. **Code review for security**
   - Review authentication logic
   - Check for SQL injection vulnerabilities
   - Verify input validation

### Deployment

1. **Principle of Least Privilege**
   - Services run as non-root users
   - Minimal IAM/RBAC permissions
   - Separate accounts for different environments

2. **Secrets Management**
   - Rotate secrets regularly
   - Use secrets management services
   - Never hardcode credentials

3. **Network Segmentation**
   - Use private networks for services
   - Expose only necessary ports
   - Use firewalls and security groups

### Operations

1. **Regular Security Audits**
   - Penetration testing
   - Code security scanning
   - Dependency vulnerability scanning

2. **Incident Response Plan**
   - Define incident response procedures
   - Regular drills and updates
   - Contact information for security team

3. **Backup and Recovery**
   - Regular encrypted backups
   - Test recovery procedures
   - Off-site backup storage

## Security Checklist

### Pre-Production

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection (if using cookies)
- [ ] Security headers configured
- [ ] Audit logging enabled
- [ ] Dependencies scanned for vulnerabilities

### Production

- [ ] Monitor security logs
- [ ] Alert on suspicious activity
- [ ] Regular security audits
- [ ] Incident response plan in place
- [ ] Regular backups
- [ ] Disaster recovery tested
- [ ] Access controls reviewed
- [ ] Compliance requirements met

## Common Vulnerabilities to Prevent

### OWASP Top 10

1. **Injection** - Use parameterized queries ✅
2. **Broken Authentication** - JWT with refresh tokens ✅
3. **Sensitive Data Exposure** - Encryption + redaction ✅
4. **XML External Entities** - Don't use XML parsers (use JSON) ✅
5. **Broken Access Control** - RBAC implementation ✅
6. **Security Misconfiguration** - Helmet + proper config ✅
7. **XSS** - Input sanitization ✅
8. **Insecure Deserialization** - Validate all input ✅
9. **Using Components with Known Vulnerabilities** - Regular updates ✅
10. **Insufficient Logging & Monitoring** - Comprehensive logging ✅

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Questions or Concerns?

For security issues, please report privately to the security team rather than opening a public issue.
