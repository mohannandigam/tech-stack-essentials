# Microservices Architecture

## 📋 What are Microservices?

**Microservices** is an architectural style where an application is built as a collection of small, independent services that communicate with each other. Each service is self-contained, focused on a specific business capability, and can be developed, deployed, and scaled independently.

## 🎯 Key Concepts

### Simple Analogy

Think of a restaurant: Instead of one person doing everything (taking orders, cooking, serving, billing), you have specialists:

- A waiter takes orders
- Chefs cook different types of food
- A cashier handles payments
- A manager coordinates everything

Each person (service) does their job independently but communicates to deliver the complete experience.

### Core Characteristics

- **Independently Deployable** - Each service can be updated without affecting others
- **Business-Focused** - Each service represents a business capability
- **Decentralized** - No central control; services make their own decisions
- **Technology Agnostic** - Each service can use different technologies
- **Failure Isolated** - If one service fails, others continue working

## ✅ Advantages

1. **Independent Deployment**
   - Deploy services separately without system-wide downtime
   - Faster release cycles
   - Lower risk deployments

2. **Technology Flexibility**
   - Use the best tool for each service
   - Easy to experiment with new technologies
   - Different teams can use different languages/frameworks

3. **Scalability**
   - Scale only the services that need it
   - More efficient resource usage
   - Handle varying loads per service

4. **Team Autonomy**
   - Small teams own specific services
   - Faster decision making
   - Clear ownership and responsibility

5. **Fault Isolation**
   - Failure in one service doesn't crash everything
   - Easier to identify and fix issues
   - Better system resilience

## ❌ Challenges

1. **Complexity**
   - More moving parts to manage
   - Distributed system challenges
   - Harder to debug and trace issues

2. **Network Communication**
   - Services must communicate over network (slower than function calls)
   - Network can fail or be slow
   - Need to handle timeouts and retries

3. **Data Management**
   - Each service has its own database
   - No simple transactions across services
   - Data consistency challenges

4. **Testing Complexity**
   - Need to test service interactions
   - Integration testing is more complex
   - Harder to set up complete test environments

5. **Operational Overhead**
   - More services to deploy and monitor
   - Need sophisticated DevOps practices
   - Requires good tooling and automation

## 🏗️ Key Components

### 1. API Gateway

- Entry point for all client requests
- Routes requests to appropriate services
- Handles authentication and rate limiting

### 2. Service Discovery

- Services register themselves
- Other services find them dynamically
- Examples: Consul, Eureka, etcd

### 3. Load Balancer

- Distributes traffic across service instances
- Health checks to route to healthy instances
- Examples: NGINX, HAProxy, AWS ALB

### 4. Message Queue/Event Bus

- Asynchronous communication between services
- Decouples services from each other
- Examples: RabbitMQ, Apache Kafka, AWS SQS

### 5. Configuration Server

- Centralized configuration management
- Services fetch their configuration at startup
- Examples: Spring Cloud Config, Consul

### 6. Monitoring & Logging

- Centralized logging from all services
- Distributed tracing to follow requests
- Examples: ELK Stack, Prometheus, Jaeger

## 🔄 Communication Patterns

### Synchronous (Request/Response)

- **REST APIs** - HTTP-based communication
- **gRPC** - High-performance RPC framework
- **GraphQL** - Query language for APIs

### Asynchronous (Event-Based)

- **Message Queues** - Point-to-point messaging
- **Publish/Subscribe** - One-to-many event distribution
- **Event Streaming** - Continuous flow of events

## 🧪 Testing Considerations for QA

### Testing Pyramid for Microservices

1. **Unit Tests** (70%)
   - Test individual service logic
   - Fast and isolated
   - Mock external dependencies

2. **Integration Tests** (20%)
   - Test service interactions
   - Test with real dependencies
   - Verify contracts between services

3. **End-to-End Tests** (10%)
   - Test complete user flows
   - Test across all services
   - Slowest but most realistic

### Testing Strategies

**Contract Testing**

- Define contracts between services
- Both consumer and provider test against contract
- Prevents breaking changes
- Tools: Pact, Spring Cloud Contract

**Service Virtualization**

- Create virtual versions of services for testing
- Test without needing all services running
- Tools: WireMock, Mountebank

**Chaos Testing**

- Intentionally break things to test resilience
- Verify system handles failures gracefully
- Tools: Chaos Monkey, Gremlin

**Performance Testing**

- Test under realistic load
- Find bottlenecks and scaling limits
- Tools: JMeter, Gatling, k6

### Common Issues to Test For

1. **Service Communication Failures**
   - Network timeouts
   - Service unavailability
   - Rate limiting

2. **Data Consistency**
   - Eventual consistency issues
   - Race conditions
   - Duplicate messages

3. **Security**
   - Authentication between services
   - Authorization and access control
   - Data encryption in transit

4. **Performance**
   - Cascading failures
   - Network latency accumulation
   - Resource exhaustion

## 🏢 Real-World Examples

- **Netflix** - Pioneered microservices at scale
- **Amazon** - Uses microservices extensively
- **Uber** - Thousands of microservices
- **Spotify** - Teams own independent services
- **Airbnb** - Migrated from monolith to microservices

## 📊 Monolith vs Microservices

| Aspect            | Monolith              | Microservices           |
| ----------------- | --------------------- | ----------------------- |
| **Structure**     | Single application    | Multiple services       |
| **Deployment**    | All-or-nothing        | Independent             |
| **Scaling**       | Scale entire app      | Scale specific services |
| **Technology**    | Usually one stack     | Can be polyglot         |
| **Development**   | Simpler initially     | More complex            |
| **Team Size**     | Works for small teams | Better for large teams  |
| **Communication** | Function calls        | Network calls           |
| **Data**          | Single database       | Database per service    |

## 📐 Design Principles

### 1. Single Responsibility

- Each service does one thing well
- Clear boundaries and purpose

### 2. Loose Coupling

- Services are independent
- Changes don't ripple across services

### 3. High Cohesion

- Related functionality together in same service
- Minimize cross-service calls

### 4. API First

- Well-defined interfaces
- Versioned APIs
- Backward compatibility

### 5. Design for Failure

- Services will fail
- Use circuit breakers
- Implement retries and timeouts

## 🛠️ Technology Stack Examples

### Container Orchestration

- **Kubernetes** - Industry standard
- **Docker Swarm** - Simpler alternative
- **Amazon ECS** - AWS container service

### Service Mesh

- **Istio** - Advanced traffic management
- **Linkerd** - Lightweight service mesh
- **Consul Connect** - Service mesh from HashiCorp

### API Gateway

- **Kong** - Open source API gateway
- **AWS API Gateway** - Managed service
- **Apigee** - Enterprise API management

## 🎓 Learning Resources

### Concepts to Study Next

1. Domain-Driven Design (DDD)
2. Event-Driven Architecture
3. CQRS and Event Sourcing
4. Circuit Breaker pattern
5. Saga pattern for distributed transactions

### Practice Ideas

1. Break down a monolithic app into services
2. Implement service-to-service communication
3. Set up API gateway and load balancing
4. Implement distributed logging
5. Practice chaos engineering

## 🐛 Debugging and Troubleshooting

### Common Problems and Solutions

#### 1. **Cascading Failures**

**Problem**: One slow/failing service causes downstream services to fail.

**Symptoms:**

- Timeout errors across multiple services
- Thread pool exhaustion
- Memory leaks
- System-wide slowdown

**Debug:**

```bash
# Check service dependencies
kubectl get pods -A | grep -v Running

# Check logs for timeout patterns
kubectl logs -f service-name | grep -i timeout

# Monitor thread pools
# Add to application
GET /actuator/metrics/tomcat.threads.busy
GET /actuator/metrics/tomcat.threads.config.max
```

**Solutions:**

```python
# 1. Circuit Breaker Pattern
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
def call_user_service(user_id):
    response = requests.get(f"{USER_SERVICE_URL}/users/{user_id}", timeout=2)
    return response.json()

# 2. Timeout Configuration
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def get_session():
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.3,
        status_forcelist=[500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

# Usage
response = get_session().get(url, timeout=5)

# 3. Bulkhead Pattern (isolate resources)
from concurrent.futures import ThreadPoolExecutor

# Separate thread pool per service
user_service_pool = ThreadPoolExecutor(max_workers=10)
payment_service_pool = ThreadPoolExecutor(max_workers=5)
```

**Node.js Solution:**

```javascript
const CircuitBreaker = require("opossum");

const options = {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000, // 30 seconds
};

const breaker = new CircuitBreaker(callUserService, options);

breaker.fallback(() => ({ error: "Service unavailable" }));

async function callUserService(userId) {
  const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
  return response.data;
}

// Usage
const result = await breaker.fire(userId);
```

#### 2. **Distributed Tracing Issues**

**Problem**: Can't track requests across multiple services.

**Solution - OpenTelemetry Implementation:**

```python
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource

# Configure tracer
resource = Resource(attributes={SERVICE_NAME: "order-service"})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# Auto-instrument Flask and requests
FlaskInstrumentor().instrument()
RequestsInstrumentor().instrument()

# Manual instrumentation
tracer = trace.get_tracer(__name__)

@app.route('/orders/<order_id>')
def get_order(order_id):
    with tracer.start_as_current_span("get_order") as span:
        span.set_attribute("order.id", order_id)

        # Get user info
        with tracer.start_as_current_span("fetch_user"):
            user = requests.get(f"{USER_SERVICE}/users/{user_id}").json()

        # Get payment info
        with tracer.start_as_current_span("fetch_payment"):
            payment = requests.get(f"{PAYMENT_SERVICE}/payments/{payment_id}").json()

        return jsonify({"order": order, "user": user, "payment": payment})
```

**Debug Traces:**

```bash
# Access Jaeger UI
http://localhost:16686

# Search for traces by:
- Service name
- Operation name
- Tags (user_id, order_id)
- Duration (find slow requests)

# Analyze trace to find:
- Which service is slow
- Where time is spent
- Error locations
```

#### 3. **Data Consistency Issues**

**Problem**: Data out of sync across services.

**Example Scenario**: Order service creates order, but inventory service fails to update.

**Solution - Saga Pattern:**

```python
# Orchestration-based Saga
class OrderSaga:
    def __init__(self):
        self.completed_steps = []

    async def create_order(self, order_data):
        try:
            # Step 1: Reserve inventory
            inventory_id = await self.reserve_inventory(order_data['items'])
            self.completed_steps.append(('inventory', inventory_id))

            # Step 2: Process payment
            payment_id = await self.process_payment(order_data['payment'])
            self.completed_steps.append(('payment', payment_id))

            # Step 3: Create order
            order_id = await self.create_order_record(order_data)
            self.completed_steps.append(('order', order_id))

            # Step 4: Send notification
            await self.send_notification(order_id)

            return {'status': 'success', 'order_id': order_id}

        except Exception as e:
            # Compensate for completed steps
            await self.compensate()
            raise

    async def compensate(self):
        """Undo completed steps in reverse order"""
        for step_type, step_id in reversed(self.completed_steps):
            try:
                if step_type == 'inventory':
                    await self.release_inventory(step_id)
                elif step_type == 'payment':
                    await self.refund_payment(step_id)
                elif step_type == 'order':
                    await self.cancel_order(step_id)
            except Exception as e:
                # Log compensation failure
                logger.error(f"Compensation failed for {step_type}: {step_id}", exc_info=e)
```

**Event-Driven Saga:**

```python
# Using message queue for choreography
import pika

class OrderService:
    def create_order(self, order_data):
        # Create order in pending state
        order = self.db.create_order(order_data, status='PENDING')

        # Publish event
        self.publish_event('order.created', {
            'order_id': order.id,
            'items': order.items,
            'user_id': order.user_id
        })

        return order

    def handle_inventory_reserved(self, event):
        """React to inventory reservation"""
        order_id = event['order_id']
        self.db.update_order(order_id, inventory_status='RESERVED')

        # Trigger next step
        self.publish_event('payment.request', {
            'order_id': order_id,
            'amount': event['amount']
        })

    def handle_payment_failed(self, event):
        """Compensate on payment failure"""
        order_id = event['order_id']

        # Cancel order
        self.db.update_order(order_id, status='CANCELLED')

        # Trigger inventory release
        self.publish_event('inventory.release', {
            'order_id': order_id,
            'reservation_id': event['reservation_id']
        })
```

#### 4. **Service Discovery Issues**

**Problem**: Services can't find each other.

**Debug:**

```bash
# Kubernetes DNS
kubectl exec -it service-pod -- nslookup user-service
kubectl exec -it service-pod -- curl http://user-service:8080/health

# Check service endpoints
kubectl get endpoints user-service

# Check service configuration
kubectl describe service user-service

# Test from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://user-service:8080/health
```

**Solutions:**

```yaml
# Kubernetes Service
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: ClusterIP

---
# Headless service for direct pod access
apiVersion: v1
kind: Service
metadata:
  name: user-service-headless
spec:
  clusterIP: None
  selector:
    app: user-service
  ports:
    - port: 8080
```

**Application Code:**

```python
import os

# Use environment variables for service URLs
USER_SERVICE_URL = os.getenv(
    'USER_SERVICE_URL',
    'http://user-service:8080'  # Default for K8s
)

# Or use Kubernetes DNS directly
USER_SERVICE_URL = 'http://user-service.default.svc.cluster.local:8080'

# For external services, use ConfigMap
# kubectl create configmap service-urls --from-literal=user-service=http://user-service:8080
```

#### 5. **API Gateway Bottleneck**

**Problem**: API Gateway becomes single point of failure/bottleneck.

**Debug:**

```bash
# Check gateway metrics
curl http://api-gateway:8080/actuator/metrics/http.server.requests

# Monitor connection pool
curl http://api-gateway:8080/actuator/metrics/hikaricp.connections

# Check rate limiting
curl -i http://api-gateway:8080/api/users/1
# Look for: X-RateLimit-Remaining, X-RateLimit-Limit
```

**Solutions:**

```yaml
# 1. Horizontal scaling
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3 # Multiple instances
  template:
    spec:
      containers:
        - name: gateway
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi

---
# 2. Autoscaling
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
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

**Gateway Configuration:**

```yaml
# Spring Cloud Gateway with circuit breaker
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service # Load balanced
          predicates:
            - Path=/api/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: userServiceCircuitBreaker
                fallbackUri: forward:/fallback/users
            - name: RequestRateLimiter
              args:
                redis-rate-limiter:
                  replenishRate: 10 # tokens per second
                  burstCapacity: 20
            - name: Retry
              args:
                retries: 3
                statuses: SERVICE_UNAVAILABLE
                methods: GET
                backoff:
                  firstBackoff: 50ms
                  maxBackoff: 500ms
```

### Debugging Tools

**1. Distributed Tracing:**

```bash
# Jaeger
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 6831:6831/udp \
  jaegertracing/all-in-one:latest

# Access UI: http://localhost:16686
```

**2. Service Mesh (Istio):**

```bash
# Install Istio
istioctl install --set profile=demo

# Enable sidecar injection
kubectl label namespace default istio-injection=enabled

# View service graph
istioctl dashboard kiali

# View traces
istioctl dashboard jaeger

# View metrics
istioctl dashboard prometheus
istioctl dashboard grafana
```

**3. Log Aggregation:**

```bash
# Centralized logging with ELK
# See infrastructure/monitoring/README.md for full setup

# Query logs across services
curl -X POST "localhost:9200/logs-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        {"match": {"service": "order-service"}},
        {"match": {"level": "ERROR"}},
        {"range": {"@timestamp": {"gte": "now-1h"}}}
      ]
    }
  },
  "sort": [{"@timestamp": "desc"}]
}'
```

**4. API Testing:**

```bash
# Test service endpoints
# Install: npm install -g newman

# Run Postman collection
newman run microservices-tests.json -e production.json

# Contract testing with Pact
pact-broker can-i-deploy \
  --pacticipant order-service \
  --version 1.2.3 \
  --to production
```

## ⚠️ Anti-Patterns and Common Pitfalls

### 1. **Distributed Monolith**

**Problem**: Microservices that are tightly coupled, requiring coordinated deployments.

**Signs:**

- Services call each other synchronously in chains
- Shared database across services
- Changes require updates to multiple services
- Can't deploy services independently

**Solution:**

- Use async communication (events, message queues)
- Each service owns its data
- Define clear service boundaries (Domain-Driven Design)
- Implement API versioning

### 2. **Chatty Services**

**Problem**: Too many network calls between services.

**Example:**

```python
# BAD: Multiple calls to get user details
user = get_user(user_id)          # Call 1
profile = get_profile(user_id)     # Call 2
preferences = get_preferences(user_id)  # Call 3
orders = get_orders(user_id)       # Call 4
```

**Solution:**

```python
# GOOD: Aggregate data in backend-for-frontend (BFF)
user_data = get_user_aggregate(user_id)  # Single call returns all data

# Or use GraphQL
query {
  user(id: "123") {
    name
    profile { bio, avatar }
    preferences { theme, language }
    orders { id, status, total }
  }
}
```

### 3. **Lack of Ownership**

**Problem**: No clear team ownership of services.

**Consequences:**

- Bug fixing delays (who should fix it?)
- No one monitors service health
- Code quality degradation

**Solution:**

- Each team owns specific services end-to-end
- Teams handle development, deployment, monitoring, and support
- Clear documentation of ownership (RACI matrix)

### 4. **Death by a Thousand Cuts (Nano-services)**

**Problem**: Services too small, creating excessive overhead.

**Example**: Separate services for:

- UserName Service
- UserEmail Service
- UserAddress Service

**Solution:**

- Combine into UserService
- Services should align with business capabilities
- Consider team size (two-pizza team rule)

### 5. **Ignoring the Fallacies of Distributed Computing**

**Fallacies:**

1. The network is reliable
2. Latency is zero
3. Bandwidth is infinite
4. The network is secure
5. Topology doesn't change
6. There is one administrator
7. Transport cost is zero
8. The network is homogeneous

**Solution:**

- Implement retries, timeouts, circuit breakers
- Design for failure
- Encrypt data in transit
- Monitor network performance

### 6. **Shared Database**

**Problem**: Multiple services accessing same database.

**Issues:**

- Tight coupling
- Schema changes affect multiple services
- Can't scale services independently
- Database becomes bottleneck

**Solution:**

```
BAD:  Service A ──┐
                  ├──> Shared DB
      Service B ──┘

GOOD: Service A ──> DB A
      Service B ──> DB B

      Sync via events/APIs
```

### 7. **Treating Network Calls Like Local Calls**

**Problem**: Not handling network failures gracefully.

**Bad Example:**

```python
def get_order_details(order_id):
    user = user_service.get_user(order.user_id)  # What if this fails?
    return {"order": order, "user": user}
```

**Good Example:**

```python
def get_order_details(order_id):
    try:
        user = user_service.get_user(
            order.user_id,
            timeout=2,
            retry=3
        )
    except ServiceUnavailable:
        user = {"id": order.user_id, "name": "Unknown"}  # Graceful degradation
    except Timeout:
        logger.error("User service timeout")
        user = None

    return {"order": order, "user": user}
```

## 💡 Common Questions

### Basic Level

**Q1: What are microservices?**
**A:** Microservices is an architectural style where an application is composed of small, independent services that:

- Focus on specific business capabilities
- Can be deployed independently
- Communicate via APIs (REST, gRPC, events)
- Own their data
- Can use different technologies

**Q2: What are the main differences between monolith and microservices?**
**A:**

- **Deployment**: Monolith = all-or-nothing; Microservices = independent
- **Scaling**: Monolith = scale entire app; Microservices = scale specific services
- **Technology**: Monolith = single stack; Microservices = polyglot
- **Complexity**: Monolith = simpler initially; Microservices = more complex
- **Failure**: Monolith = single point of failure; Microservices = isolated failures

**Q3: What is an API Gateway?**
**A:** An API Gateway is the single entry point for all client requests. It:

- Routes requests to appropriate services
- Handles authentication and authorization
- Implements rate limiting
- Provides request/response transformation
- Aggregates responses from multiple services
- Examples: Kong, AWS API Gateway, Spring Cloud Gateway

**Q4: What is service discovery?**
**A:** Service discovery is the mechanism for services to find each other dynamically:

- Services register themselves on startup
- Other services query registry to find instances
- Handles dynamic scaling (instances come and go)
- Examples: Consul, Eureka, etcd, Kubernetes DNS

**Q5: What communication patterns exist in microservices?**
**A:**

1. **Synchronous**: REST, gRPC, GraphQL (request-response)
2. **Asynchronous**: Message queues, Pub/Sub, Event streaming
3. **Hybrid**: Combination based on use case

### Intermediate Level

**Q6: Explain the Circuit Breaker pattern.**
**A:** Circuit Breaker prevents cascading failures by monitoring service calls:

**States:**

- **Closed**: Normal operation, calls pass through
- **Open**: Too many failures, reject calls immediately (fail fast)
- **Half-Open**: After timeout, allow test calls to check recovery

**Implementation:**

```python
States: Closed → Open (on failures) → Half-Open (after timeout) → Closed (if successful)

Benefits:
- Prevents resource exhaustion
- Fails fast instead of waiting
- Allows service to recover
```

**Q7: What is the difference between orchestration and choreography?**
**A:**

**Orchestration** (Centralized):

- Central coordinator controls flow
- Services called in sequence
- Example: Order service orchestrates inventory → payment → shipping

**Choreography** (Decentralized):

- Services react to events independently
- No central controller
- Example: Order created event → Inventory service reserves → Payment service charges

**When to use:**

- Orchestration: Complex workflows, need transaction control
- Choreography: Loose coupling, scalability, flexibility

**Q8: How do you handle distributed transactions?**
**A:** Use **Saga Pattern**:

**Two approaches:**

1. **Orchestration-based**: Central coordinator manages steps and compensations
2. **Choreography-based**: Services emit events, others react

**Example:**

```
Order Saga:
1. Reserve inventory
2. Process payment
3. Create order
4. Send notification

If step 2 fails:
- Compensate: Release inventory (undo step 1)
```

**Q9: What is eventual consistency?**
**A:** In microservices, data across services becomes consistent eventually, not immediately:

- Services have their own databases
- Updates propagate via events/messages
- Temporary inconsistency is acceptable
- Trade-off for availability and partition tolerance (CAP theorem)

**Example**: Order placed → Inventory updated (few seconds later)

**Q10: How do you test microservices?**
**A:**

1. **Unit Tests**: Test individual service logic with mocks
2. **Integration Tests**: Test service with real dependencies (DB, message queue)
3. **Contract Tests**: Verify API contracts between services (Pact)
4. **E2E Tests**: Test complete user flows across all services
5. **Performance Tests**: Load testing with realistic traffic (k6, Gatling)
6. **Chaos Tests**: Intentionally break services to test resilience

### Advanced Level

**Q11: Design a microservices architecture for an e-commerce platform.**
**A:**

**Services:**

1. **User Service**: Authentication, profiles, preferences
2. **Product Service**: Catalog, search, inventory
3. **Order Service**: Order creation, status tracking
4. **Payment Service**: Payment processing, refunds
5. **Shipping Service**: Delivery tracking, address validation
6. **Notification Service**: Emails, SMS, push notifications
7. **Recommendation Service**: Product recommendations (ML)

**Infrastructure:**

```
Clients → API Gateway → Load Balancer → Services
                              ↓
                         Service Mesh (Istio)
                              ↓
                    Message Queue (Kafka)
                              ↓
                    Service Discovery (Consul)
                              ↓
                    Monitoring (Prometheus + Grafana)
                              ↓
                    Logging (ELK Stack)
                              ↓
                    Tracing (Jaeger)
```

**Data Flow:**

- Synchronous: API Gateway → Services (REST/gRPC)
- Asynchronous: Services → Kafka → Services (events)

**Q12: How do you handle API versioning in microservices?**
**A:**

**Strategies:**

1. **URL Versioning**:

```
/api/v1/users
/api/v2/users
```

2. **Header Versioning**:

```
GET /api/users
Accept: application/vnd.company.v1+json
```

3. **Query Parameter**:

```
/api/users?version=1
```

**Best Practices:**

- Support multiple versions simultaneously
- Deprecate old versions gradually (6-12 months)
- Document breaking changes
- Use API Gateway for routing to correct version
- Consider semantic versioning

**Q13: Explain the strangler pattern for migrating to microservices.**
**A:** Strangler pattern gradually replaces a monolith with microservices:

**Steps:**

1. Identify bounded context/feature to extract
2. Build new microservice
3. Route new requests to microservice
4. Keep old functionality in monolith (for existing requests)
5. Gradually migrate traffic
6. Remove code from monolith when fully migrated
7. Repeat for next feature

**Implementation:**

```
        ┌─────────────┐
Client →│ API Gateway │→ Routing Logic:
        └─────────────┘   If feature X → Microservice
                          Else → Monolith
                     ↓              ↓
              Microservice      Monolith
```

**Benefits:**

- Low risk (incremental migration)
- Can test in production
- Easy rollback

**Q14: How do you implement security in microservices?**
**A:**

**Layers:**

1. **API Gateway Level**:

```
- Client authentication (OAuth 2.0, JWT)
- Rate limiting
- IP whitelisting
- API key validation
```

2. **Service-to-Service**:

```
- mTLS (mutual TLS) for encrypted communication
- Service mesh (Istio) for automatic mTLS
- JWT propagation with service claims
```

3. **Application Level**:

```python
# JWT validation
from flask import request
import jwt

def require_auth(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        try:
            payload = jwt.decode(token, PUBLIC_KEY, algorithms=['RS256'])
            request.user_id = payload['sub']
            return f(*args, **kwargs)
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}, 401
    return wrapper

@app.route('/orders')
@require_auth
def get_orders():
    return orders_for_user(request.user_id)
```

4. **Data Level**:

```
- Encrypt sensitive data at rest
- Use secrets management (Vault, AWS Secrets Manager)
- Implement RBAC (Role-Based Access Control)
```

**Q15: How do you monitor and debug microservices in production?**
**A:**

**Four Golden Signals (SRE):**

1. **Latency**: Response time (p50, p95, p99)
2. **Traffic**: Requests per second
3. **Errors**: Error rate
4. **Saturation**: Resource utilization

**Tools Setup:**

```yaml
Metrics:
  - Prometheus: Collect metrics from all services
  - Grafana: Visualize metrics, create dashboards
  - Alertmanager: Send alerts on threshold breaches

Logs:
  - Filebeat: Collect logs from containers
  - Logstash: Parse and enrich logs
  - Elasticsearch: Store logs
  - Kibana: Search and analyze logs

Traces:
  - Jaeger/Zipkin: Distributed tracing
  - Track requests across services
  - Identify bottlenecks

APM:
  - New Relic, Datadog, or Elastic APM
  - End-to-end monitoring
  - Performance insights
```

**Debug Workflow:**

```
1. Alert fires (high error rate)
2. Check Grafana dashboard (which service?)
3. View traces in Jaeger (slow requests?)
4. Search logs in Kibana (error messages?)
5. Identify root cause
6. Fix and deploy
7. Monitor recovery
```

**Q16: What is a service mesh and when should you use it?**
**A:** Service mesh is infrastructure layer for service-to-service communication:

**Features:**

- Traffic management (load balancing, retries, circuit breakers)
- Security (mTLS, authentication)
- Observability (metrics, traces, logs)
- Policy enforcement

**Popular Options:**

- **Istio**: Feature-rich, complex
- **Linkerd**: Lightweight, simpler
- **Consul Connect**: HashiCorp ecosystem

**When to use:**

- Many services (>10-20)
- Need consistent security/observability
- Complex traffic management requirements
- Multiple teams managing services

**When NOT to use:**

- Small number of services (<10)
- Simple architecture
- Limited resources (service mesh adds overhead)

## 🔗 Related Topics

- [Event-Driven Architecture](../event-driven/README.md)
- [Serverless Architecture](../serverless/README.md)
- [Monorepo](../monorepo/README.md) - Managing microservices code
- [Kubernetes](../../06-infrastructure/kubernetes/README.md)
- [Monitoring](../../06-infrastructure/monitoring/README.md)
- [CI/CD](../../06-infrastructure/cicd/README.md)

---

**Next Steps**: Learn about [Event-Driven Architecture](../event-driven/README.md) to see how to build reactive, loosely-coupled microservices!
