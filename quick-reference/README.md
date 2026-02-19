# Quick Reference Guide

## Overview

This quick reference provides fast lookups for common patterns, code snippets, and decision-making guides across all domains and technologies covered in this repository.

## 📋 Pattern Selection Guide

### When to Use Each Architecture

| Scenario | Recommended Pattern | Why |
|----------|-------------------|-----|
| Starting new project | Monolith → Microservices | Start simple, evolve as needed |
| High-scale web app | Microservices | Independent scaling, team autonomy |
| Event processing | Event-Driven | Decoupled, asynchronous processing |
| Infrequent workloads | Serverless | Cost-effective, auto-scaling |
| Real-time data | Event-Driven + Streaming | Low latency, high throughput |
| Multiple teams | Microservices + Monorepo | Code sharing with service independence |

### Domain-Specific Patterns

| Domain | Primary Pattern | Secondary Pattern | Database |
|--------|----------------|-------------------|----------|
| **Energy** | Event-Driven | CQRS | TimescaleDB, InfluxDB |
| **Finance** | Event Sourcing | CQRS | PostgreSQL, EventStore |
| **Banking** | Microservices | Saga Pattern | PostgreSQL, Oracle |
| **Social Media** | Microservices | Event-Driven | MongoDB, Redis, Cassandra |
| **Dating** | Microservices | Recommendation Engine | Neo4j, MongoDB |
| **Retail** | Event-Driven | CQRS | PostgreSQL, MongoDB |
| **Insurance** | Workflow Engine | Document Storage | PostgreSQL, S3 |
| **Healthcare** | Microservices | Event-Driven | PostgreSQL + Encryption |
| **Logistics** | Event-Driven | Geospatial | PostgreSQL/PostGIS |

## 🔧 Technology Stack Cheat Sheet

### By Use Case

**API Development:**
```
REST: Express.js, FastAPI, Spring Boot, Go Gin
GraphQL: Apollo Server, Hasura, PostGraphile
gRPC: Go, Java, C++
```

**Databases:**
```
Relational: PostgreSQL, MySQL, SQL Server
NoSQL Document: MongoDB, CouchDB
NoSQL Key-Value: Redis, DynamoDB
Time-Series: TimescaleDB, InfluxDB
Graph: Neo4j, Amazon Neptune
```

**Message Queues:**
```
General Purpose: RabbitMQ, Apache Kafka
Cloud: AWS SQS/SNS, Google Pub/Sub, Azure Service Bus
Lightweight: Redis, NATS
```

**Caching:**
```
In-Memory: Redis, Memcached
CDN: CloudFlare, CloudFront, Akamai
Application: Varnish, NGINX
```

## 🧩 Architecture Dependency Checklist

| Architecture | Core runtime deps | Infra services | QA/Observability | Repo reference |
|--------------|-------------------|----------------|------------------|----------------|
| Monorepo | TypeScript toolchain, Nx/Turborepo or pnpm workspaces | Local PostgreSQL/Redis for shared dev data | Jest for units, Playwright/Cypress for app flows | Use across `architectures/monorepo` guidance |
| Microservices | Node.js 18+, Express/Fastify, JWT, Joi/Zod | Docker + Compose, PostgreSQL, Redis, Kafka/RabbitMQ | Jest contract tests, k6/Locust for load, OpenTelemetry tracing | `examples/microservices-ecommerce` |
| Event-Driven | Producer/consumer SDKs (Kafka/Redpanda), Avro/JSON schema libs | Kafka or cloud pub/sub, Schema Registry, object storage | Replay testing, dead-letter queues, consumer lag alerts | `architectures/event-driven` |
| Serverless | Serverless/SAM CLI, esbuild/webpack bundler, AWS/GCP/Azure SDKs | Cloud emulators (LocalStack/Azure Storage Emulator), API Gateway | Canary + integration tests, cold-start profiling, structured logs | `architectures/serverless` |

**Missing deps to install for shipped examples**
- `examples/microservices-ecommerce/shared`: add `jest`, `@types/jest`, `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` to run provided `test`/`lint` scripts.
- `examples/microservices-ecommerce/services/user-service`: add `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` alongside the existing Jest setup used by `lint`.

**Install snippets**
```bash
# Shared package test/lint support
cd examples/microservices-ecommerce/shared
npm install -D jest @types/jest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# User service lint support
cd ../services/user-service
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## 📝 Code Snippet Library

### Authentication (JWT)

**Node.js/TypeScript:**
```typescript
import jwt from 'jsonwebtoken';

// Generate token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Python:**
```python
import jwt
from datetime import datetime, timedelta

# Generate token
token = jwt.encode({
    'user_id': user.id,
    'role': user.role,
    'exp': datetime.utcnow() + timedelta(minutes=15)
}, os.environ['JWT_SECRET'], algorithm='HS256')

# Verify token
decoded = jwt.decode(token, os.environ['JWT_SECRET'], algorithms=['HS256'])
```

### Database Connection Pooling

**Node.js (PostgreSQL):**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Python:**
```python
import asyncpg

pool = await asyncpg.create_pool(
    host=os.environ['DB_HOST'],
    port=5432,
    database=os.environ['DB_NAME'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD'],
    min_size=10,
    max_size=20,
    command_timeout=60
)
```

### Rate Limiting

**Express.js:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests',
});

app.use('/api/', limiter);
```

**FastAPI:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/endpoint")
@limiter.limit("100/15minutes")
async def endpoint(request: Request):
    return {"message": "success"}
```

### Message Queue Publishing

**Kafka (Python):**
```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

producer.send('topic-name', {
    'event': 'user.created',
    'data': {'userId': '123'}
})
```

**RabbitMQ (Node.js):**
```typescript
import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

await channel.assertQueue('task-queue', { durable: true });
channel.sendToQueue('task-queue', Buffer.from(JSON.stringify(task)));
```

### Structured Logging

**Node.js (Winston):**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

logger.info('User logged in', {
  userId: '123',
  ip: req.ip,
  correlationId: req.correlationId
});
```

## 🎯 Decision Trees

### Choosing a Database

```
Need ACID transactions?
├─ Yes → Relational (PostgreSQL, MySQL)
└─ No
   ├─ Need flexible schema?
   │  └─ Yes → Document DB (MongoDB)
   └─ Need graph relationships?
      ├─ Yes → Graph DB (Neo4j)
      └─ No
         ├─ Time-series data?
         │  └─ Yes → TimescaleDB, InfluxDB
         └─ Key-value only?
            └─ Yes → Redis, DynamoDB
```

### Choosing Communication Pattern

```
Need response immediately?
├─ Yes → Synchronous (REST, gRPC)
└─ No
   ├─ Need guaranteed delivery?
   │  └─ Yes → Message Queue (Kafka, RabbitMQ)
   └─ Need real-time push?
      └─ Yes → WebSocket, Server-Sent Events
```

### Choosing Deployment Strategy

```
Team size?
├─ < 5 developers → Monolith + simple deployment
├─ 5-20 developers → Modular monolith or microservices
└─ > 20 developers → Microservices + container orchestration

Traffic pattern?
├─ Steady → Fixed infrastructure
├─ Spiky → Auto-scaling (K8s, serverless)
└─ Unpredictable → Serverless
```

## 📊 Performance Benchmarks

### Request Latency Targets

| Operation Type | Target Latency | Acceptable |
|---------------|----------------|------------|
| Database query | < 10ms | < 50ms |
| API call (internal) | < 50ms | < 200ms |
| API call (external) | < 500ms | < 2s |
| Page load | < 1s | < 3s |
| Search query | < 100ms | < 500ms |

### Scalability Guidelines

| Scale Level | Users | Requests/sec | Infrastructure |
|-------------|-------|--------------|----------------|
| Small | < 1K | < 10 | Single server |
| Medium | 1K-100K | 10-1K | Load-balanced VMs |
| Large | 100K-1M | 1K-10K | Microservices + K8s |
| Very Large | > 1M | > 10K | Distributed + CDN |

## 🔒 Security Checklist

### Essential Security Measures

- [ ] **Authentication**
  - [ ] Use JWT or OAuth 2.0
  - [ ] Implement refresh tokens
  - [ ] Set appropriate token expiry

- [ ] **Authorization**
  - [ ] Implement RBAC or ABAC
  - [ ] Validate permissions on every request
  - [ ] Principle of least privilege

- [ ] **Data Protection**
  - [ ] Encrypt sensitive data at rest
  - [ ] Use HTTPS/TLS for all traffic
  - [ ] Hash passwords with bcrypt (cost 12+)
  - [ ] Never log sensitive data

- [ ] **Input Validation**
  - [ ] Validate all user input
  - [ ] Prevent SQL injection (parameterized queries)
  - [ ] Prevent XSS (sanitize output)
  - [ ] Rate limit API endpoints

- [ ] **Infrastructure**
  - [ ] Keep dependencies updated
  - [ ] Use environment variables for secrets
  - [ ] Implement proper CORS policies
  - [ ] Set security headers (Helmet.js, etc.)

## 🧪 Testing Pyramid

```
        /\
       /E2E\        10% - End-to-End Tests
      /────\        - Full user flows
     /      \       - Slow, expensive
    /────────\      
   /Integration\    20% - Integration Tests
  /────────────\   - API tests, service interactions
 /              \  - Moderate speed
/────────────────\ 
|   Unit Tests    | 70% - Unit Tests
|________________| - Fast, isolated, many
```

### Test Coverage Goals

| Code Type | Coverage Target |
|-----------|----------------|
| Business Logic | 90-100% |
| API Endpoints | 80-90% |
| Utilities | 80-100% |
| UI Components | 60-80% |
| Configuration | 50-70% |

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security scan completed
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Database migrations ready
- [ ] Rollback plan documented

### Deployment

- [ ] Blue-green or canary deployment
- [ ] Monitor metrics during rollout
- [ ] Smoke tests after deployment
- [ ] Check logs for errors
- [ ] Verify key endpoints
- [ ] Confirm database connections

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user-facing features
- [ ] Update status page
- [ ] Communicate to stakeholders

## 📈 Monitoring Essentials

### Key Metrics to Track

**Application Metrics:**
- Request rate (requests/second)
- Error rate (%)
- Response time (p50, p95, p99)
- Active users

**Infrastructure Metrics:**
- CPU usage (%)
- Memory usage (%)
- Disk usage (%)
- Network I/O

**Business Metrics:**
- Transactions completed
- Revenue generated
- User signups
- Feature usage

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error rate | > 1% | > 5% |
| Response time (p95) | > 500ms | > 2s |
| CPU usage | > 70% | > 90% |
| Memory usage | > 80% | > 95% |
| Disk usage | > 80% | > 95% |

## 🔗 Quick Links

- [Architecture Patterns](../architectures/)
- [Infrastructure Setup](../infrastructure/)
- [Domain Examples](../domain-examples/)
- [Cloud Deployment](../cloud-stacks/)
- [Methodologies](../methodologies/)

## 💡 Common Pitfalls to Avoid

1. **Premature Optimization** - Profile before optimizing
2. **Over-Engineering** - Start simple, evolve as needed
3. **Ignoring Security** - Security from day one
4. **No Monitoring** - Can't fix what you can't see
5. **Tight Coupling** - Services should be independent
6. **No Testing** - Tests are documentation and safety net
7. **Hardcoded Config** - Use environment variables
8. **No Error Handling** - Always handle errors gracefully
9. **Ignoring Documentation** - Code is read more than written
10. **No Rollback Plan** - Always have a way back

---

**Pro Tip**: Bookmark this page for quick reference during development!
