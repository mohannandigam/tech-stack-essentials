# Microservices E-Commerce Application

## 📋 Overview

This is a production-ready microservices-based e-commerce application demonstrating **best practices** in:
- **Architecture Design** - Microservices with clear boundaries
- **Security** - JWT authentication, input validation, rate limiting
- **Logging** - Structured logging with correlation IDs
- **Monitoring** - Health checks, metrics, distributed tracing
- **Testing** - Unit, integration, and end-to-end tests
- **DevOps** - Docker, CI/CD, infrastructure as code

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Applications                     │
│                    (Web Browser, Mobile Apps)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│  - Request Routing      - Rate Limiting    - CORS               │
│  - Authentication       - Logging          - Load Balancing      │
└─────┬──────────┬──────────┬─────────┬──────────────────────────┘
      │          │          │         │
      │          │          │         │
      ▼          ▼          ▼         ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
│   User   │ │ Product  │ │  Order   │ │  Notification    │
│ Service  │ │ Service  │ │ Service  │ │    Service       │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────────────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
│PostgreSQL│ │PostgreSQL│ │PostgreSQL│ │   Redis Queue    │
│   DB     │ │   DB     │ │   DB     │ │                  │
└──────────┘ └──────────┘ └──────────┘ └──────────────────┘
      │            │            │            │
      └────────────┴────────────┴────────────┘
                       │
                       ▼
            ┌────────────────────┐
            │  Message Bus       │
            │  (RabbitMQ/Kafka)  │
            └────────────────────┘
                       │
                       ▼
            ┌────────────────────┐
            │  Monitoring Stack  │
            │  - Prometheus      │
            │  - Grafana         │
            │  - ELK Stack       │
            └────────────────────┘
```

### Service Boundaries

Each service is responsible for a specific business capability:

1. **API Gateway** (Port 3000)
   - Entry point for all client requests
   - Routes requests to appropriate services
   - Handles authentication and authorization
   - Implements rate limiting and CORS

2. **User Service** (Port 3001)
   - User registration and authentication
   - Profile management
   - JWT token generation and validation
   - Password hashing and security

3. **Product Service** (Port 3002)
   - Product catalog management
   - Category management
   - Search and filtering
   - Inventory tracking

4. **Order Service** (Port 3003)
   - Order creation and management
   - Order status tracking
   - Payment processing integration
   - Order history

5. **Notification Service** (Port 3004)
   - Email notifications
   - SMS notifications (optional)
   - Push notifications
   - Event-driven notification processing

## 🔒 Security Best Practices

### 1. Authentication & Authorization
```javascript
// JWT-based authentication
- Access tokens with short expiry (15 minutes)
- Refresh tokens with longer expiry (7 days)
- Token rotation on refresh
- Secure token storage (httpOnly cookies)
```

### 2. Input Validation
```javascript
// Every endpoint validates input using Joi/Zod
{
  email: string().email().required(),
  password: string().min(8).required(),
  // Sanitize to prevent XSS
}
```

### 3. Security Headers
```javascript
// Helmet.js implementation
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
```

### 4. Rate Limiting
```javascript
// Prevent DDoS and brute force attacks
- 100 requests per 15 minutes per IP
- Stricter limits for authentication endpoints
- Redis-based distributed rate limiting
```

### 5. Data Protection
```javascript
// Database security
- Encrypted connections (SSL/TLS)
- Parameterized queries (prevent SQL injection)
- Password hashing with bcrypt (cost factor 12)
- Sensitive data encryption at rest
```

### 6. API Security
```javascript
// Additional protections
- CORS with whitelist
- API versioning
- Request/Response validation
- No sensitive data in logs
```

## 📊 Logging Strategy

### Structured Logging Format

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "service": "user-service",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "method": "POST",
  "path": "/api/users/login",
  "statusCode": 200,
  "duration": 45,
  "message": "User logged in successfully",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Log Levels

- **ERROR** - Application errors, exceptions
- **WARN** - Warning conditions, deprecated API usage
- **INFO** - Important business events (login, order placed)
- **DEBUG** - Detailed diagnostic information
- **TRACE** - Very detailed debugging (not in production)

### Correlation IDs

Every request gets a unique correlation ID that flows through all services:

```
Client Request
  → API Gateway (generates correlationId)
    → User Service (receives correlationId)
      → Database (logs with correlationId)
    → Order Service (receives correlationId)
```

This allows tracking a single request across all services.

### Logging Best Practices

1. **Never log sensitive data** (passwords, tokens, credit cards)
2. **Include context** (userId, orderId, etc.)
3. **Use structured format** (JSON for easy parsing)
4. **Implement log rotation** (prevent disk space issues)
5. **Centralize logs** (ELK stack, CloudWatch, etc.)
6. **Set appropriate levels** (INFO in prod, DEBUG in dev)
7. **Log business events** (order placed, payment processed)
8. **Include error details** (stack traces for errors)

## 🔍 Monitoring & Observability

### Health Checks

Each service exposes health check endpoints:

```
GET /health - Basic health check
GET /health/ready - Readiness check (DB connections, etc.)
GET /health/live - Liveness check
```

### Metrics

Exposed via `/metrics` endpoint (Prometheus format):

```
# Application metrics
http_requests_total{service="user-service",method="POST",status="200"} 1234
http_request_duration_seconds{service="user-service"} 0.045
db_connections_active{service="user-service"} 5

# Business metrics
orders_total{status="completed"} 456
orders_value_total{currency="USD"} 12345.67
users_registered_total 789
```

### Distributed Tracing

Using OpenTelemetry for distributed tracing:
- Track request flow across services
- Identify bottlenecks and latency issues
- Visualize service dependencies

### Alerting

Set up alerts for:
- High error rates (> 5%)
- High latency (> 1000ms p95)
- Service unavailability
- High memory/CPU usage
- Database connection issues

## 🗄️ Database Design

### User Service Database

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
```

### Product Service Database

```sql
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  sku VARCHAR(100) UNIQUE NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);
```

### Order Service Database

```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID NOT NULL,
  product_name VARCHAR(255),
  price DECIMAL(10, 2),
  quantity INTEGER,
  subtotal DECIMAL(10, 2)
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd examples/microservices-ecommerce

# Install dependencies for all services
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start infrastructure (databases, message queue)
docker-compose up -d postgres redis rabbitmq

# Run database migrations
npm run migrate

# Start all services in development mode
npm run dev

# Or start services individually
npm run dev:gateway
npm run dev:user-service
npm run dev:product-service
npm run dev:order-service
npm run dev:notification-service
```

### Using Docker Compose (Recommended)

```bash
# Start entire application stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### User Endpoints

```
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/account
```

### Product Endpoints

```
GET    /api/products
GET    /api/products/:id
POST   /api/products (admin only)
PUT    /api/products/:id (admin only)
DELETE /api/products/:id (admin only)
```

### Order Endpoints

```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/cancel
```

See [API Documentation](./docs/API.md) for detailed specifications.

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests for specific service
npm test:user-service

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
services/user-service/
├── src/
│   └── __tests__/
│       ├── unit/          # Unit tests
│       ├── integration/   # Integration tests
│       └── e2e/          # End-to-end tests
```

## 📦 Deployment

### Docker Deployment

```bash
# Build all service images
docker-compose build

# Push to registry
docker-compose push

# Deploy to production
docker stack deploy -c docker-compose.prod.yml ecommerce
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/k8s/

# Check deployment status
kubectl get pods -n ecommerce

# View logs
kubectl logs -f deployment/user-service -n ecommerce
```

## 🔧 Configuration

### Environment Variables

```env
# API Gateway
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://yourdomain.com

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ecommerce_user
DB_USER=postgres
DB_PASSWORD=secure-password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Message Queue
RABBITMQ_URL=amqp://rabbitmq:5672

# Monitoring
ENABLE_METRICS=true
ENABLE_TRACING=true
```

## 📚 Additional Documentation

- [Architecture Decision Records](./docs/ADR.md)
- [API Documentation](./docs/API.md)
- [Security Guide](./docs/SECURITY.md)
- [Logging Guide](./docs/LOGGING.md)
- [Monitoring Guide](./docs/MONITORING.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🤝 Best Practices Demonstrated

### 1. **Clean Architecture**
- Separation of concerns
- Dependency injection
- Repository pattern
- Service layer pattern

### 2. **Error Handling**
- Standardized error responses
- Error middleware
- Proper HTTP status codes
- Detailed error logging

### 3. **Code Quality**
- ESLint configuration
- Prettier formatting
- TypeScript for type safety
- Unit test coverage > 80%

### 4. **DevOps**
- Containerization
- CI/CD pipelines
- Infrastructure as code
- Automated testing

### 5. **Performance**
- Database indexing
- Caching strategies
- Connection pooling
- Async/await patterns

### 6. **Scalability**
- Stateless services
- Horizontal scaling
- Load balancing
- Message queues for async processing

## 🔗 Related Topics

- [Microservices Architecture](../../architectures/microservices/README.md)
- [Event-Driven Architecture](../../architectures/event-driven/README.md)
- [Test-Driven Development](../../methodologies/test-driven-development/README.md)
- [AWS Deployment](../../cloud-stacks/aws/README.md)

## 📄 License

This is a learning example and is provided as-is for educational purposes.
