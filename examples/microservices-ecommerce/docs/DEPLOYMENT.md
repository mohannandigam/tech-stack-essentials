# Deployment Guide

## Overview

This guide walks through deploying the microservices e-commerce application to various environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Cloud Deployment (AWS)](#cloud-deployment-aws)
5. [Monitoring Setup](#monitoring-setup)
6. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd examples/microservices-ecommerce

# 2. Install dependencies for shared package
cd shared
npm install
npm run build
cd ..

# 3. Install dependencies for user service
cd services/user-service
npm install
cd ../..

# 4. Set up environment variables
cp services/user-service/.env.example services/user-service/.env
# Edit .env with your configuration

# 5. Start infrastructure services
docker-compose up -d postgres redis rabbitmq

# 6. Wait for databases to be ready
docker-compose logs -f postgres
# Wait for "database system is ready to accept connections"

# 7. Start the user service
cd services/user-service
npm run dev

# 8. Service is running on http://localhost:3001
```

### Testing Locally

```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

## Docker Deployment

### Build and Run All Services

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop all services
docker-compose down
```

### Individual Service Management

```bash
# Rebuild specific service
docker-compose build user-service

# Restart specific service
docker-compose restart user-service

# View logs for specific service
docker-compose logs -f user-service

# Execute command in running container
docker-compose exec user-service sh
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  user-service:
    image: your-registry/user-service:latest
    environment:
      NODE_ENV: production
      LOG_LEVEL: info
      # Use secrets for sensitive values
    secrets:
      - jwt_secret
      - db_password
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        max_attempts: 3

secrets:
  jwt_secret:
    external: true
  db_password:
    external: true
```

Deploy:
```bash
docker stack deploy -c docker-compose.prod.yml ecommerce
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (minikube, EKS, GKE, AKS)
- kubectl configured
- Docker images pushed to container registry

### Kubernetes Manifests

Create `infrastructure/k8s/user-service.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce

---
apiVersion: v1
kind: Secret
metadata:
  name: user-service-secrets
  namespace: ecommerce
type: Opaque
stringData:
  jwt-secret: your-jwt-secret
  jwt-refresh-secret: your-refresh-secret

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: user-service-config
  namespace: ecommerce
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  PORT: "3001"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: your-registry/user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: user-service-config
              key: NODE_ENV
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: user-service-config
              key: LOG_LEVEL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: ecommerce
spec:
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 3001
    targetPort: 3001
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
  namespace: ecommerce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace ecommerce

# Apply configurations
kubectl apply -f infrastructure/k8s/

# Check deployment
kubectl get pods -n ecommerce
kubectl get services -n ecommerce

# View logs
kubectl logs -f deployment/user-service -n ecommerce

# Scale deployment
kubectl scale deployment user-service --replicas=5 -n ecommerce

# Port forward for testing
kubectl port-forward service/user-service 3001:3001 -n ecommerce
```

## Cloud Deployment (AWS)

### AWS ECS with Fargate

#### 1. Create ECR Repository

```bash
aws ecr create-repository --repository-name ecommerce/user-service

# Get login command
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com
```

#### 2. Build and Push Image

```bash
# Build image
docker build -t user-service services/user-service/

# Tag image
docker tag user-service:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce/user-service:latest

# Push image
docker push \
  123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce/user-service:latest
```

#### 3. Create ECS Task Definition

```json
{
  "family": "user-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "user-service",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/ecommerce/user-service:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3001"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/user-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### 4. Create ECS Service

```bash
aws ecs create-service \
  --cluster ecommerce-cluster \
  --service-name user-service \
  --task-definition user-service:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=user-service,containerPort=3001"
```

### AWS RDS for PostgreSQL

```bash
# Create database
aws rds create-db-instance \
  --db-instance-identifier ecommerce-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name ecommerce-subnet-group
```

### Infrastructure as Code (Terraform)

Create `infrastructure/terraform/main.tf`:

```hcl
provider "aws" {
  region = "us-east-1"
}

# VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "ecommerce-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "ecommerce-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "ecommerce-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
}

# Target Group
resource "aws_lb_target_group" "user_service" {
  name        = "user-service-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 30
    interval            = 60
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier           = "ecommerce-db"
  engine               = "postgres"
  engine_version       = "14.7"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_encrypted    = true
  
  db_name  = "ecommerce"
  username = "admin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  skip_final_snapshot     = false
  final_snapshot_identifier = "ecommerce-db-final-snapshot"
}
```

Deploy:
```bash
terraform init
terraform plan
terraform apply
```

## Monitoring Setup

### Prometheus + Grafana

Already included in `docker-compose.yml`:

```bash
# Access Prometheus
http://localhost:9090

# Access Grafana
http://localhost:3005
# Login: admin/admin

# Add Prometheus data source in Grafana
# URL: http://prometheus:9090
```

### CloudWatch (AWS)

```bash
# Install CloudWatch agent
aws configure set region us-east-1

# Create log group
aws logs create-log-group --log-group-name /ecs/user-service

# Metrics are automatically sent from ECS
```

### Setting Up Alerts

**Prometheus Alert Rules:**

Create `infrastructure/monitoring/alert-rules.yml`:

```yaml
groups:
  - name: service_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Service {{ $labels.service }} has error rate > 5%"
      
      - alert: ServiceDown
        expr: up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Service {{ $labels.service }} is not responding"
```

## Troubleshooting

### Common Issues

#### Service Won't Start

```bash
# Check logs
docker-compose logs user-service

# Check if port is in use
lsof -i :3001

# Check environment variables
docker-compose exec user-service env
```

#### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d ecommerce_user
```

#### Health Check Failing

```bash
# Test health endpoint
curl http://localhost:3001/health
curl http://localhost:3001/health/ready

# Check service logs
docker-compose logs -f user-service

# Exec into container
docker-compose exec user-service sh
```

### Debugging Tips

**View detailed logs:**
```bash
# Set LOG_LEVEL to debug
export LOG_LEVEL=debug
npm run dev
```

**Check network connectivity:**
```bash
# From inside container
docker-compose exec user-service ping postgres
docker-compose exec user-service wget -O- http://user-service:3001/health
```

**Database queries:**
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d ecommerce_user

# List tables
\dt

# Query users
SELECT * FROM users;
```

## Rollback Strategy

### Docker Compose

```bash
# Tag current version before deploying
docker tag user-service:latest user-service:v1.0

# If new version fails, rollback
docker-compose down
docker tag user-service:v1.0 user-service:latest
docker-compose up -d
```

### Kubernetes

```bash
# View rollout history
kubectl rollout history deployment/user-service -n ecommerce

# Rollback to previous version
kubectl rollout undo deployment/user-service -n ecommerce

# Rollback to specific revision
kubectl rollout undo deployment/user-service --to-revision=2 -n ecommerce
```

### ECS

```bash
# Update service to previous task definition
aws ecs update-service \
  --cluster ecommerce-cluster \
  --service user-service \
  --task-definition user-service:1
```

## Performance Optimization

### Database Connection Pooling

```typescript
// In database configuration
const pool = new Pool({
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Caching with Redis

```typescript
// Cache frequently accessed data
const cachedData = await redis.get(`user:${userId}`);
if (cachedData) {
  return JSON.parse(cachedData);
}

// If not cached, fetch and cache
const data = await db.query(...);
await redis.setex(`user:${userId}`, 3600, JSON.stringify(data));
```

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3001/api/auth/login

# Using K6
k6 run --vus 10 --duration 30s load-test.js
```

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable database encryption
- [ ] Set up VPN for database access
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Disaster recovery plan tested

## Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [12-Factor App](https://12factor.net/)

---

For questions or issues, refer to the main [README](../README.md) or open an issue.
