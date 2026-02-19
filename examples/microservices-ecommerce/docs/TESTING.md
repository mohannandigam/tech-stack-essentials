# Testing Strategy Guide

## Overview

This guide explains testing strategies for the microservices e-commerce application, with a focus on how testers can validate the system at different levels.

## Table of Contents

1. [Testing Pyramid](#testing-pyramid)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [API Testing](#api-testing)
6. [Security Testing](#security-testing)
7. [Performance Testing](#performance-testing)
8. [Testing in Production](#testing-in-production)

## Testing Pyramid

```
          /\
         /  \        E2E Tests (10%)
        /────\       - Full user workflows
       /      \      - Expensive, slow
      /────────\     Integration Tests (20%)
     /          \    - Service interactions
    /────────────\   - Database, external APIs
   /              \  Unit Tests (70%)
  /________________\ - Fast, isolated
                     - Test individual functions
```

### Test Distribution

- **70% Unit Tests** - Fast, focused, run frequently
- **20% Integration Tests** - Verify components work together
- **10% E2E Tests** - Validate complete user journeys

## Unit Testing

### What to Test

```typescript
// Test business logic
describe('validatePassword', () => {
  it('should reject passwords shorter than 8 characters', () => {
    const result = validatePassword('Pass1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('should accept valid password', () => {
    const result = validatePassword('Password123!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// Test data transformations
describe('sanitizeInput', () => {
  it('should escape HTML special characters', () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeInput(input);
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });
});

// Test error handling
describe('ApiError', () => {
  it('should create error with correct properties', () => {
    const error = new ApiError(400, 'Validation failed', { field: 'email' });
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Validation failed');
    expect(error.details).toEqual({ field: 'email' });
  });
});
```

### Running Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (re-run on changes)
npm run test:watch

# Run specific test file
npm test -- auth.controller.test.ts
```

### Mocking Dependencies

```typescript
// Mock database
jest.mock('../repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
}));

describe('AuthService', () => {
  it('should register new user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    userRepository.create.mockResolvedValue(mockUser);

    const result = await authService.register({
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result).toEqual(mockUser);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});
```

## Integration Testing

### Database Integration Tests

```typescript
describe('UserRepository Integration Tests', () => {
  let db: Database;

  beforeAll(async () => {
    // Connect to test database
    db = await connectToTestDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await db.query('TRUNCATE TABLE users CASCADE');
  });

  it('should create and retrieve user', async () => {
    // Create user
    const user = await userRepository.create({
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(user.id).toBeDefined();

    // Retrieve user
    const retrieved = await userRepository.findById(user.id);
    expect(retrieved).toMatchObject({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
  });
});
```

### API Integration Tests

```typescript
import request from 'supertest';
import app from '../src/index';

describe('Auth API Integration Tests', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      message: 'User registered successfully',
      user: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
  });

  it('should login with valid credentials', async () => {
    // First register
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      });

    // Then login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      })
      .expect(200);

    expect(response.body.tokens.accessToken).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword!',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid email or password');
  });
});
```

### Service-to-Service Testing

```typescript
describe('Order Service Integration with Product Service', () => {
  it('should create order with product validation', async () => {
    // Mock product service response
    nock('http://product-service:3002')
      .get('/api/products/123')
      .reply(200, {
        id: '123',
        name: 'Test Product',
        price: 29.99,
        stock: 10,
      });

    const order = await orderService.createOrder({
      userId: 'user-123',
      items: [
        {
          productId: '123',
          quantity: 2,
        },
      ],
    });

    expect(order).toBeDefined();
    expect(order.totalAmount).toBe(59.98);
  });
});
```

## End-to-End Testing

### User Journey Tests

```typescript
describe('Complete User Journey', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should complete checkout flow', async () => {
    // 1. Register
    await page.goto('http://localhost:3000/register');
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // 2. Browse products
    await page.goto('http://localhost:3000/products');
    await page.click('.product-card:first-child .add-to-cart');

    // 3. View cart
    await page.click('.cart-icon');
    expect(await page.$eval('.cart-items', el => el.children.length)).toBe(1);

    // 4. Checkout
    await page.click('.checkout-button');
    await page.type('#shipping-address', '123 Main St');
    await page.type('#credit-card', '4111111111111111');
    await page.click('button[type="submit"]');

    // 5. Verify order confirmation
    await page.waitForSelector('.order-confirmation');
    const confirmationText = await page.$eval(
      '.order-confirmation',
      el => el.textContent
    );
    expect(confirmationText).toContain('Order placed successfully');
  });
});
```

## API Testing

### Using Postman

Create a Postman collection with environment variables:

```json
{
  "name": "E-Commerce API",
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"{{userEmail}}\",\n  \"password\": \"{{userPassword}}\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\"\n}"
        },
        "url": "{{baseUrl}}/api/auth/register"
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 201\", () => {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test(\"Response has access token\", () => {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.tokens.accessToken).to.exist;",
              "    pm.environment.set(\"accessToken\", jsonData.tokens.accessToken);",
              "});"
            ]
          }
        }
      ]
    }
  ]
}
```

### Using cURL

```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login and save token
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }' | jq -r '.tokens.accessToken')

# Use token for authenticated request
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Security Testing

### Authentication Tests

```typescript
describe('Security Tests', () => {
  it('should reject request without token', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .expect(401);

    expect(response.body.message).toBe('No authentication token provided');
  });

  it('should reject invalid token', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.message).toContain('Invalid');
  });

  it('should accept valid token', async () => {
    // Get valid token
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      });

    const token = authResponse.body.tokens.accessToken;

    // Use token
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.user).toBeDefined();
  });
});
```

### Input Validation Tests

```typescript
describe('Input Validation', () => {
  it('should reject SQL injection attempts', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "admin' OR '1'='1",
        password: 'any',
      })
      .expect(400);
  });

  it('should reject XSS attempts', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: '<script>alert("xss")</script>',
        lastName: 'Doe',
      })
      .expect(400);
  });

  it('should enforce password requirements', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(400);

    expect(response.body.details.errors).toBeDefined();
  });
});
```

### Rate Limiting Tests

```typescript
describe('Rate Limiting', () => {
  it('should enforce rate limits', async () => {
    // Make 10 requests quickly
    const promises = Array(10).fill(null).map(() =>
      request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'any',
      })
    );

    const responses = await Promise.all(promises);
    
    // Some should be rate limited
    const rateLimitedResponses = responses.filter(
      r => r.status === 429
    );
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
```

## Performance Testing

### Load Testing with K6

Create `load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.05'],   // Error rate < 5%
  },
};

export default function () {
  // Register user
  let registerRes = http.post('http://localhost:3001/api/auth/register', JSON.stringify({
    email: `user${__VU}-${Date.now()}@example.com`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'registration successful': (r) => r.status === 201,
    'has access token': (r) => r.json('tokens.accessToken') !== undefined,
  });

  sleep(1);

  // Login
  let loginRes = http.post('http://localhost:3001/api/auth/login', JSON.stringify({
    email: registerRes.json('user.email'),
    password: 'Password123!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  sleep(1);
}
```

Run:
```bash
k6 run load-test.js
```

### Stress Testing

```javascript
export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Spike to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};
```

## Testing in Production

### Smoke Tests

Run basic tests after deployment:

```bash
#!/bin/bash
# smoke-test.sh

BASE_URL="https://api.production.com"

# Health check
echo "Testing health endpoint..."
curl -f $BASE_URL/health || exit 1

# API availability
echo "Testing API availability..."
curl -f $BASE_URL/api/products || exit 1

echo "Smoke tests passed!"
```

### Synthetic Monitoring

Set up synthetic monitors that run continuously:

```typescript
// Datadog Synthetic Test
const test = {
  name: "User Login Flow",
  type: "api",
  subtype: "http",
  config: {
    assertions: [
      {
        type: "statusCode",
        operator: "is",
        target: 200
      },
      {
        type: "responseTime",
        operator: "lessThan",
        target: 2000
      }
    ]
  }
};
```

### Canary Testing

Deploy to subset of traffic first:

```yaml
# Kubernetes canary deployment
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  # Traffic split
  sessionAffinity: ClientIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-v1
spec:
  replicas: 9  # 90% traffic
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-v2
spec:
  replicas: 1  # 10% traffic (canary)
```

## Testing Best Practices

### 1. Test Independence

```typescript
// ✅ Good - Each test is independent
describe('UserService', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('test 1', async () => {
    // Create data for this test
    const user = await createTestUser();
    // Test logic
  });

  it('test 2', async () => {
    // Create data for this test
    const user = await createTestUser();
    // Test logic
  });
});

// ❌ Bad - Tests depend on each other
describe('UserService', () => {
  let user;

  it('creates user', async () => {
    user = await createUser();
  });

  it('updates user', async () => {
    // Depends on previous test
    await updateUser(user.id);
  });
});
```

### 2. Clear Test Names

```typescript
// ✅ Good - Descriptive names
it('should reject registration with invalid email format', () => {});
it('should hash password before storing', () => {});
it('should return 401 when token is expired', () => {});

// ❌ Bad - Vague names
it('test 1', () => {});
it('works', () => {});
it('email', () => {});
```

### 3. AAA Pattern

```typescript
it('should create order', async () => {
  // Arrange
  const user = await createTestUser();
  const products = await createTestProducts();

  // Act
  const order = await orderService.createOrder({
    userId: user.id,
    items: [{ productId: products[0].id, quantity: 2 }],
  });

  // Assert
  expect(order.id).toBeDefined();
  expect(order.totalAmount).toBe(59.98);
});
```

### 4. Test Data Builders

```typescript
// Test data builder pattern
class UserBuilder {
  private data = {
    email: 'test@example.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
  };

  withEmail(email: string) {
    this.data.email = email;
    return this;
  }

  withPassword(password: string) {
    this.data.password = password;
    return this;
  }

  build() {
    return this.data;
  }
}

// Usage
const user = new UserBuilder()
  .withEmail('custom@example.com')
  .build();
```

## Test Metrics

### Code Coverage

Aim for:
- **80%+ overall coverage**
- **90%+ coverage for business logic**
- **100% coverage for security-critical code**

```bash
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Test Execution Time

Monitor test duration:
- Unit tests: < 10 seconds
- Integration tests: < 2 minutes
- E2E tests: < 10 minutes

## Continuous Testing

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm test
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest for API Testing](https://github.com/visionmedia/supertest)
- [K6 Load Testing](https://k6.io/docs/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

Remember: **Good tests give you confidence to make changes.**
