# Docker Examples

## Overview

Docker allows you to package applications with all their dependencies into standardized containers. This guide provides practical Docker examples across multiple domains to help you learn containerization quickly.

## 📚 Table of Contents

1. [Docker Basics](#docker-basics)
2. [Domain-Specific Examples](#domain-specific-examples)
3. [Multi-Stage Builds](#multi-stage-builds)
4. [Docker Compose](#docker-compose)
5. [Best Practices](#best-practices)

## Docker Basics

### What is Docker?

Docker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, portable, and isolated environments.

**Key Concepts:**
- **Image**: Template for creating containers
- **Container**: Running instance of an image
- **Dockerfile**: Instructions to build an image
- **Registry**: Storage for Docker images (Docker Hub, ECR, etc.)

### Quick Start

```bash
# Check Docker installation
docker --version

# Run your first container
docker run hello-world

# List running containers
docker ps

# List all containers
docker ps -a

# Remove a container
docker rm <container-id>
```

## Domain-Specific Examples

### 1. Energy Sector - Smart Grid Monitor

**Use Case**: Containerized application for monitoring solar panel performance

```dockerfile
# Dockerfile.energy-monitor
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "src/grid_monitor.py"]
```

**docker-compose.yml for Energy System:**
```yaml
version: '3.8'

services:
  grid-monitor:
    build:
      context: .
      dockerfile: Dockerfile.energy-monitor
    ports:
      - "8000:8000"
    environment:
      - PANEL_COUNT=100
      - CHECK_INTERVAL=60
    volumes:
      - ./data:/app/data
    networks:
      - energy-net

  time-series-db:
    image: timescale/timescaledb:latest-pg14
    environment:
      - POSTGRES_PASSWORD=energy123
    volumes:
      - energy-data:/var/lib/postgresql/data
    networks:
      - energy-net

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - energy-net

networks:
  energy-net:
    driver: bridge

volumes:
  energy-data:
  grafana-data:
```

### 2. Finance - Trading Platform API

**Use Case**: Secure containerized REST API for stock trading

```dockerfile
# Dockerfile.trading-api
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

**docker-compose.yml for Trading Platform:**
```yaml
version: '3.8'

services:
  trading-api:
    build:
      context: .
      dockerfile: Dockerfile.trading-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    networks:
      - trading-net
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=trading
      - POSTGRES_USER=trader
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - trading-data:/var/lib/postgresql/data
    networks:
      - trading-net

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - trading-net

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - trading-api
    networks:
      - trading-net

networks:
  trading-net:
    driver: bridge

volumes:
  trading-data:
  redis-data:
```

### 3. Social Media - Content Moderation Service

**Use Case**: AI-powered content moderation microservice

```dockerfile
# Dockerfile.moderation
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for ML libraries
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY models/ ./models/

# Create non-root user
RUN useradd -m -u 1001 moderator && \
    chown -R moderator:moderator /app
USER moderator

EXPOSE 8080

# Health check
HEALTHCHECK CMD python -c "import requests; requests.get('http://localhost:8080/health')" || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

**docker-compose.yml for Social Media:**
```yaml
version: '3.8'

services:
  moderation-service:
    build:
      context: .
      dockerfile: Dockerfile.moderation
    ports:
      - "8080:8080"
    environment:
      - MODEL_PATH=/app/models/content-classifier
      - CONFIDENCE_THRESHOLD=0.85
    volumes:
      - ./models:/app/models:ro
    networks:
      - social-net
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G

  message-queue:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=social
      - RABBITMQ_DEFAULT_PASS=${RABBITMQ_PASSWORD}
    networks:
      - social-net

  mongodb:
    image: mongo:6
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongo-data:/data/db
    networks:
      - social-net

networks:
  social-net:
    driver: bridge

volumes:
  mongo-data:
```

### 4. Healthcare - Patient Record System

**Use Case**: HIPAA-compliant patient data service

```dockerfile
# Dockerfile.patient-service
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build with optimizations
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o patient-service .

# Production stage - minimal image
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/patient-service .

# Add health check script
COPY --from=builder /app/healthcheck.sh .
RUN chmod +x healthcheck.sh

EXPOSE 8443

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD ./healthcheck.sh || exit 1

CMD ["./patient-service"]
```

**docker-compose.yml for Healthcare:**
```yaml
version: '3.8'

services:
  patient-service:
    build:
      context: .
      dockerfile: Dockerfile.patient-service
    ports:
      - "8443:8443"
    environment:
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - DB_CONNECTION_STRING=${DB_CONNECTION}
      - ENABLE_AUDIT_LOG=true
    volumes:
      - ./tls:/app/tls:ro
    networks:
      - healthcare-net
    secrets:
      - db-password
      - encryption-key

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=patient_records
      - POSTGRES_USER=healthcare
      - POSTGRES_PASSWORD_FILE=/run/secrets/db-password
    volumes:
      - patient-data:/var/lib/postgresql/data
    networks:
      - healthcare-net
    secrets:
      - db-password

  vault:
    image: vault:latest
    ports:
      - "8200:8200"
    environment:
      - VAULT_DEV_ROOT_TOKEN_ID=${VAULT_TOKEN}
    cap_add:
      - IPC_LOCK
    networks:
      - healthcare-net

secrets:
  db-password:
    file: ./secrets/db-password.txt
  encryption-key:
    file: ./secrets/encryption-key.txt

networks:
  healthcare-net:
    driver: bridge

volumes:
  patient-data:
```

### 5. Retail - Inventory Management

**Use Case**: Real-time inventory tracking system

```dockerfile
# Dockerfile.inventory
FROM ruby:3.2-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    nodejs \
    yarn

# Copy Gemfile
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 --retry 3

# Copy application
COPY . .

# Precompile assets
RUN bundle exec rake assets:precompile

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
```

**docker-compose.yml for Retail:**
```yaml
version: '3.8'

services:
  inventory-api:
    build:
      context: .
      dockerfile: Dockerfile.inventory
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://retail:${DB_PASSWORD}@postgres/inventory
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - retail-net

  barcode-scanner:
    image: custom/barcode-scanner:latest
    ports:
      - "8001:8001"
    environment:
      - API_ENDPOINT=http://inventory-api:3000
    networks:
      - retail-net

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=inventory
      - POSTGRES_USER=retail
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - inventory-data:/var/lib/postgresql/data
    networks:
      - retail-net

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - retail-net

networks:
  retail-net:
    driver: bridge

volumes:
  inventory-data:
  redis-data:
```

## Multi-Stage Builds

Multi-stage builds create optimized production images:

```dockerfile
# Example: Multi-stage build for any compiled language
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

FROM alpine:latest
COPY --from=builder /app/myapp /usr/local/bin/
CMD ["myapp"]
```

**Benefits:**
- Smaller final images
- No build tools in production
- Better security (minimal attack surface)

## Best Practices

### 1. Security
```dockerfile
# ✅ DO: Run as non-root user
RUN adduser -D myuser
USER myuser

# ✅ DO: Use specific image tags
FROM node:18-alpine

# ❌ DON'T: Use latest tag
FROM node:latest

# ✅ DO: Minimize layers
RUN apk add --no-cache curl && \
    curl -o app.tar.gz https://example.com/app.tar.gz && \
    tar -xzf app.tar.gz && \
    rm app.tar.gz
```

### 2. Optimize Image Size
```dockerfile
# ✅ DO: Use .dockerignore
# Create .dockerignore file:
node_modules
.git
*.md
tests
```

### 3. Use Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

### 4. Handle Signals Properly
```dockerfile
# Use exec form to properly handle SIGTERM
CMD ["node", "app.js"]

# Not shell form
CMD node app.js
```

## Common Commands

```bash
# Build image
docker build -t myapp:v1.0 .

# Run container
docker run -d -p 8080:8080 --name myapp myapp:v1.0

# View logs
docker logs myapp
docker logs -f myapp  # Follow logs

# Execute command in container
docker exec -it myapp /bin/sh

# Stop and remove
docker stop myapp
docker rm myapp

# Cleanup
docker system prune -a  # Remove unused images
docker volume prune     # Remove unused volumes
```

## Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Scale a service
docker-compose up -d --scale api=3
```

## Testing Containers

```bash
# Test Dockerfile
docker build -t test:latest .
docker run --rm test:latest

# Test docker-compose
docker-compose config  # Validate syntax
docker-compose up --no-start  # Create but don't start
docker-compose ps  # Check status
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs <container-name>

# Inspect container
docker inspect <container-name>

# Check events
docker events
```

### Network Issues
```bash
# List networks
docker network ls

# Inspect network
docker network inspect <network-name>

# Test connectivity
docker exec container1 ping container2
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Limit resources
docker run --memory="512m" --cpus="1.0" myapp
```

## Domain-Specific Considerations

### Energy
- Time-series databases (InfluxDB, TimescaleDB)
- Real-time data processing
- IoT device communication protocols

### Finance/Banking
- Encryption at rest and in transit
- Secret management (Vault, AWS Secrets Manager)
- Audit logging
- PCI-DSS compliance

### Healthcare
- HIPAA compliance
- Data encryption
- Access controls
- Audit trails

### Social Media/Dating
- High throughput messaging
- Content caching (Redis, Memcached)
- Media processing (images, videos)
- Real-time features (WebSocket)

### Retail
- Point-of-sale integration
- Inventory synchronization
- Payment processing
- Barcode/QR scanning

## Next Steps

1. **Practice**: Deploy a domain example that interests you
2. **Learn**: Understand [Kubernetes](../kubernetes/README.md) for orchestration
3. **Automate**: Set up [CI/CD](../cicd/README.md) for your containers
4. **Monitor**: Add [monitoring](../monitoring/README.md) to your containers

## Additional Resources

- [Official Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)

---

**Ready to scale?** Move on to [Kubernetes](../kubernetes/README.md) to orchestrate your containers across multiple hosts.
