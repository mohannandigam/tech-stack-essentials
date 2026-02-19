# Event-Driven Architecture

## What is Event-Driven Architecture?

**Event-Driven Architecture (EDA)** is a software design pattern where the flow of the program is determined by events — significant changes in state or notable occurrences. Instead of components directly calling each other (request-response), they communicate by producing and consuming events asynchronously. Components don't know about each other directly; they only know about events.

Think of it as a broadcast system: producers announce "something happened" to anyone who wants to listen, and consumers react independently.

## Simple Analogy

Imagine a hospital emergency room:

**Traditional request-response (tightly coupled)**:
When a patient arrives, the receptionist personally walks to find the doctor, waits for the doctor to finish, brings them back, waits for the doctor to see the patient, then goes to find the nurse, waits for the nurse, brings them back, and so on. The receptionist blocks at each step.

**Event-driven (loosely coupled)**:
When a patient arrives, the receptionist announces over the intercom: "New patient in Room 3, possible broken arm." The doctor hears it and comes when ready. The nurse hears it and prepares supplies. The admin hears it and starts paperwork. The radiologist hears it and gets the X-ray machine ready. Everyone acts independently and in parallel. No one waits for anyone else.

If the nurse is out sick, the system still works — the doctor and radiologist continue. Add a new specialist? They just start listening to announcements. No code changes needed.

This is event-driven architecture: one announcement, multiple independent reactions.

## Why Does It Matter?

Modern applications are distributed systems — microservices, cloud functions, mobile apps, third-party integrations. Coordinating these pieces is complex.

**The core problem EDA solves**: How do you build systems that are loosely coupled, scalable, and resilient?

**Traditional approach (direct calls)**:
- Service A calls Service B
- Service A calls Service C
- Service A calls Service D
- If C is down, everything fails
- A needs to know about B, C, D (tight coupling)
- Hard to add new services
- Scaling is complex

**Event-driven approach**:
- Service A publishes an event: "Order placed"
- Services B, C, D subscribe and react independently
- If C is down, B and D still work
- A doesn't know B, C, D exist (loose coupling)
- Add Service E by subscribing (no changes to A)
- Each service scales independently

This matters for:
- **Microservices architectures** — services need to communicate without tight coupling
- **Real-time systems** — react to changes instantly
- **Scalability** — handle traffic spikes gracefully
- **Resilience** — continue operating when parts fail
- **Evolvability** — add features without touching existing code

## How It Works

### The Event Flow

Here's what happens in an event-driven system:

```
1. Something happens (user clicks button, sensor reads data, etc.)
   ↓
2. Producer publishes an event to the event bus
   Event: { type: "OrderPlaced", orderId: "123", amount: 99.99 }
   ↓
3. Event bus stores and routes the event
   ↓
4. All interested consumers receive the event
   ↓
5. Each consumer processes independently:
   - Inventory Service: Reduce stock
   - Shipping Service: Prepare shipment
   - Email Service: Send confirmation
   - Analytics Service: Update reports
   ↓
6. Consumers may publish new events
   Inventory publishes: "StockReduced"
   Shipping publishes: "ShipmentScheduled"
```

### The Components

**1. Event**
The message describing what happened. Contains:
- **Event Type**: What happened (OrderPlaced, UserRegistered)
- **Event Data**: Details (orderId, userId, timestamp)
- **Metadata**: Tracking info (eventId, source, timestamp, traceId)

**2. Event Producer (Publisher)**
The component that detects something happened and publishes an event.

**3. Event Bus / Broker / Stream**
The middleware that receives events and delivers them to consumers. Acts as the central nervous system.

**4. Event Consumer (Subscriber)**
Components that listen for events and react. Can be many consumers for one event.

**5. Event Store (optional)**
Persistent storage for events. Enables replay, audit trails, and event sourcing.

### Basic Architecture

```
              ┌─────────────┐
              │  Producer   │
              │  (Order API)│
              └──────┬──────┘
                     │ publishes
                     ↓
           ┌─────────────────┐
           │   Event Bus     │
           │  (Kafka/SNS)    │
           └─────────┬───────┘
                     │ distributes
        ┌────────────┼────────────┬─────────────┐
        ↓            ↓            ↓             ↓
   ┌────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
   │Inventory│  │Shipping │  │  Email  │  │Analytics│
   │ Service │  │ Service │  │ Service │  │ Service │
   └────────┘  └─────────┘  └─────────┘  └─────────┘
   (Consumers)
```

## Key Concepts

### Event vs Message vs Command

**Event** (past tense, what happened):
- "OrderPlaced", "UserRegistered", "PaymentCompleted"
- Describes a fact that occurred
- Multiple consumers can react
- Producer doesn't care who listens

**Command** (imperative, do this):
- "PlaceOrder", "RegisterUser", "ProcessPayment"
- Instructs someone to do something
- Usually one specific recipient
- Sender expects it to be done

**Message** (generic term):
- Any data sent between systems
- Can be event, command, or query

### Event Types

**1. Domain Events**
Business-level events that domain experts understand:
- `OrderPlaced`, `ShipmentDelivered`, `UserSubscribed`

**2. Integration Events**
Cross-system events for integration:
- `CustomerCreatedInCRM`, `PaymentReceivedFromStripe`

**3. System Events**
Infrastructure-level events:
- `ServerStarted`, `DatabaseConnectionLost`, `MemoryThresholdExceeded`

### Pub/Sub vs Event Streaming

**Pub/Sub (Publish/Subscribe)**:
- Events consumed and deleted
- Good for notifications and reactions
- Examples: SNS, Pub/Sub, RabbitMQ
- Think: radio broadcast (hear it once, it's gone)

**Event Streaming**:
- Events stored in an append-only log
- Can replay events from history
- Good for data pipelines and event sourcing
- Examples: Kafka, Kinesis, Event Hubs
- Think: DVR (record everything, replay anytime)

### Event Sourcing

**Event Sourcing** means storing all changes as a sequence of events instead of just the current state.

**Traditional (state-based)**:
```javascript
// Database stores current state
{ userId: 123, balance: 500 }

// Update replaces the state
UPDATE users SET balance = 400 WHERE id = 123
```

**Event Sourcing**:
```javascript
// Store every event that changed the state
Events:
1. { type: "AccountCreated", userId: 123, initialBalance: 1000 }
2. { type: "MoneyWithdrawn", userId: 123, amount: 200 }
3. { type: "MoneyWithdrawn", userId: 123, amount: 300 }

// Current state = replay all events
balance = 1000 - 200 - 300 = 500
```

**Benefits**:
- Complete audit trail
- Time travel (what was the balance yesterday?)
- Replay events to rebuild state
- Debug by replaying production events

**Trade-offs**:
- More complex to implement
- More storage needed
- Requires careful event schema design

### CQRS (Command Query Responsibility Segregation)

**CQRS** separates read operations (queries) from write operations (commands).

**Traditional (same model for reads and writes)**:
```javascript
// One model handles everything
class User {
  create() { /* write to DB */ }
  update() { /* write to DB */ }
  findById() { /* read from DB */ }
  search() { /* read from DB */ }
}
```

**CQRS (separate models)**:
```javascript
// Write model (commands)
class UserCommandHandler {
  createUser(command) {
    // Validate, apply business rules
    // Publish "UserCreated" event
  }
}

// Read model (queries)
class UserQueryHandler {
  getUserById(id) {
    // Read from optimized read database
  }
  searchUsers(criteria) {
    // Read from search index (Elasticsearch)
  }
}
```

**Benefits**:
- Optimize writes and reads independently
- Scale reads and writes separately
- Different data models for different needs
- Simpler code (single responsibility)

**Trade-offs**:
- More complex architecture
- Eventual consistency (reads lag slightly behind writes)
- More moving parts to manage

### Eventual Consistency

In event-driven systems, **eventual consistency** means changes propagate over time, not instantly.

**Scenario**: User places an order.

**What happens**:
1. Order service immediately returns: "Order placed successfully!"
2. Order service publishes "OrderPlaced" event
3. Inventory service receives event (maybe 100ms later)
4. Inventory service reduces stock
5. Email service receives event (maybe 200ms later)
6. Email service sends confirmation

For a brief moment (milliseconds to seconds), the system is inconsistent:
- Order exists but inventory not yet updated
- Order exists but email not yet sent

**Eventually** (usually very quickly), everything catches up and the system is consistent.

**Why accept this**:
- Enables loose coupling
- Allows independent scaling
- Continues operating when parts fail
- Provides better performance (no waiting for synchronous calls)

### Idempotency

**Idempotency** means processing the same event multiple times produces the same result as processing it once.

**Why it matters**: Events may be delivered more than once (network retries, failures).

**Non-idempotent (bad)**:
```javascript
function handleOrderPlaced(event) {
  const balance = getBalance();
  setBalance(balance - event.amount); // Processes twice = deducted twice!
}
```

**Idempotent (good)**:
```javascript
function handleOrderPlaced(event) {
  if (alreadyProcessed(event.eventId)) {
    return; // Skip duplicate
  }

  const balance = getBalance();
  setBalance(balance - event.amount);

  markAsProcessed(event.eventId);
}
```

## Event Schema Design and Versioning

### Designing Good Event Schemas

**Bad event** (too little information):
```json
{
  "type": "OrderChanged",
  "orderId": "123"
}
```
What changed? Who cares? Consumers must query the order service for details (tight coupling).

**Good event** (complete information):
```json
{
  "eventId": "a1b2c3d4",
  "eventType": "OrderPlaced",
  "eventVersion": "v1",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "order-service",
  "traceId": "trace-xyz-789",
  "data": {
    "orderId": "123",
    "customerId": "customer-456",
    "items": [
      { "productId": "prod-001", "quantity": 2, "price": 29.99 }
    ],
    "totalAmount": 59.98,
    "currency": "USD",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zip": "62701"
    }
  }
}
```

### Schema Design Principles

**1. Self-contained**
Include all data consumers need. Avoid forcing them to call back for more info.

**2. Immutable**
Events describe the past. Once published, never change them.

**3. Minimal**
Include necessary data, not everything. Balance completeness with size.

**4. Schema versioning**
Include a version field so you can evolve the schema over time.

**5. Include metadata**
- `eventId`: Unique identifier (for deduplication)
- `eventType`: What happened
- `timestamp`: When it happened
- `source`: Which service published it
- `traceId`: For distributed tracing
- `causationId`: What caused this event (for debugging chains)

### Schema Evolution Strategies

**Strategy 1: Versioned Event Types**

Publish new event types for breaking changes:
```json
// Old consumers continue using v1
{ "eventType": "OrderPlaced.v1", ... }

// New consumers use v2
{ "eventType": "OrderPlaced.v2", ... }
```

**Strategy 2: Additive Changes Only**

Only add new fields, never remove or rename:
```json
// v1
{ "eventType": "OrderPlaced", "orderId": "123" }

// v2 adds new field (v1 consumers ignore it)
{ "eventType": "OrderPlaced", "orderId": "123", "priority": "high" }
```

**Strategy 3: Schema Registry**

Use a centralized schema registry (like Confluent Schema Registry):
- Store all event schemas
- Enforce compatibility rules
- Validate events before publishing
- Generate client code from schemas

### Example: Evolving an Event

**Version 1**:
```json
{
  "eventType": "UserRegistered",
  "eventVersion": "1.0",
  "data": {
    "userId": "user-123",
    "email": "alice@example.com",
    "name": "Alice"
  }
}
```

**Version 2** (added phone):
```json
{
  "eventType": "UserRegistered",
  "eventVersion": "2.0",
  "data": {
    "userId": "user-123",
    "email": "alice@example.com",
    "name": "Alice",
    "phone": "+1-555-0100"  // New field (optional, old consumers ignore it)
  }
}
```

**Version 3** (split name into first/last):
```json
{
  "eventType": "UserRegistered",
  "eventVersion": "3.0",
  "data": {
    "userId": "user-123",
    "email": "alice@example.com",
    "name": "Alice",             // Keep for backward compatibility
    "firstName": "Alice",         // New
    "lastName": "Johnson",        // New
    "phone": "+1-555-0100"
  }
}
```

Consumers handle versions:
```javascript
function handleUserRegistered(event) {
  switch (event.eventVersion) {
    case "1.0":
    case "2.0":
      processName(event.data.name);
      break;
    case "3.0":
      processName(event.data.firstName, event.data.lastName);
      break;
  }
}
```

## Event Broker Comparison

### Apache Kafka

**What it is**: Distributed event streaming platform with persistent, ordered, partitioned logs.

**Strengths**:
- Very high throughput (millions of messages/second)
- Horizontal scalability (add brokers)
- Persistent storage (replay events from history)
- Ordering guarantees within partitions
- Rich ecosystem (Kafka Connect, Kafka Streams, ksqlDB)

**Limitations**:
- Complex to operate (ZooKeeper, replication, partitioning)
- Steeper learning curve
- Not ideal for simple pub/sub needs
- Requires infrastructure management

**Best for**:
- Event streaming and data pipelines
- High-volume event processing
- Event sourcing (need event replay)
- Real-time analytics

**Ordering guarantee**: Per-partition ordering (messages in same partition are ordered)

**Delivery semantics**:
- At-least-once (default)
- Exactly-once (with transactions and idempotent producers)

**Example use cases**:
- LinkedIn uses Kafka for activity tracking (billions of events)
- Uber uses Kafka for real-time pricing and matching
- Netflix uses Kafka for real-time monitoring

### RabbitMQ

**What it is**: Traditional message broker with flexible routing and multiple messaging patterns.

**Strengths**:
- Easy to set up and use
- Flexible routing (exchanges, queues, bindings)
- Multiple messaging patterns (pub/sub, request/reply, work queues)
- Good management UI
- Mature and stable

**Limitations**:
- Lower throughput than Kafka
- Messages deleted after consumption (no replay)
- Vertical scaling (limited horizontal scaling)
- Can become bottleneck at very high scale

**Best for**:
- Task queues and work distribution
- Request/reply patterns
- Simple pub/sub
- Traditional messaging needs

**Ordering guarantee**: Per-queue ordering (FIFO within a queue)

**Delivery semantics**:
- At-least-once (default)
- At-most-once (with auto-ack)

**Example use cases**:
- Task processing (send email, process image)
- Microservices communication
- Background jobs

### AWS SNS/SQS

**What it is**: Fully managed pub/sub (SNS) and message queue (SQS) services.

**Strengths**:
- Fully managed (no infrastructure)
- Highly available and scalable
- Integrated with AWS ecosystem
- Pay-per-use pricing
- Dead letter queues for failed messages

**Limitations**:
- AWS-specific (vendor lock-in)
- Limited message size (256 KB)
- No message replay (SQS messages deleted after consumption)
- Basic feature set compared to Kafka

**Best for**:
- AWS-based architectures
- Simple pub/sub needs
- Serverless event-driven systems
- Applications needing zero operational overhead

**Ordering guarantee**:
- SQS Standard: No ordering guarantee
- SQS FIFO: Strict ordering within message group

**Delivery semantics**:
- At-least-once (standard)
- Exactly-once processing (FIFO queues)

**Example use cases**:
- Serverless workflows (Lambda triggered by SNS/SQS)
- Decoupling microservices
- Fan-out notifications

### Azure Event Hubs

**What it is**: Fully managed event streaming service (similar to Kafka).

**Strengths**:
- Fully managed (no infrastructure)
- High throughput (millions of events/second)
- Persistent storage (event replay)
- Integrated with Azure ecosystem
- Kafka-compatible (can use Kafka clients)

**Limitations**:
- Azure-specific (vendor lock-in)
- Less mature ecosystem than Kafka
- More expensive than self-hosted Kafka

**Best for**:
- Azure-based architectures
- Event streaming without Kafka operational overhead
- Real-time analytics and monitoring
- IoT telemetry ingestion

**Ordering guarantee**: Per-partition ordering

**Delivery semantics**: At-least-once

**Example use cases**:
- IoT telemetry processing
- Application logging and monitoring
- Real-time data analytics

### Google Cloud Pub/Sub

**What it is**: Fully managed pub/sub service.

**Strengths**:
- Fully managed (no infrastructure)
- Global distribution (across regions)
- Automatic scaling
- At-least-once delivery guaranteed
- Push and pull subscription models

**Limitations**:
- GCP-specific (vendor lock-in)
- No message ordering guarantee (unless you use ordering keys)
- Not designed for event replay (messages expire after 7 days)

**Best for**:
- GCP-based architectures
- Simple pub/sub needs
- Real-time event distribution
- Serverless event-driven systems

**Ordering guarantee**: Optional (use ordering keys)

**Delivery semantics**: At-least-once

**Example use cases**:
- Event-driven microservices
- Streaming data ingestion
- Asynchronous workflows

### Comparison Table

| Feature | Kafka | RabbitMQ | AWS SNS/SQS | Azure Event Hubs | GCP Pub/Sub |
|---------|-------|----------|-------------|------------------|-------------|
| **Type** | Event Streaming | Message Broker | Pub/Sub + Queue | Event Streaming | Pub/Sub |
| **Throughput** | Very High | Medium | High | Very High | High |
| **Persistence** | Yes (replay) | No | No | Yes (replay) | Limited (7 days) |
| **Ordering** | Per-partition | Per-queue | FIFO option | Per-partition | Optional |
| **Managed** | No (or MSK) | No (or Cloud) | Yes | Yes | Yes |
| **Complexity** | High | Medium | Low | Medium | Low |
| **Best For** | Streaming | Messaging | AWS serverless | Azure streaming | GCP serverless |
| **Cost** | Infrastructure | Infrastructure | Pay-per-use | Pay-per-use | Pay-per-use |

## Ordering Guarantees and Exactly-Once Semantics

### Message Ordering

**The problem**: In distributed systems, messages can arrive out of order.

**Scenario**:
1. User updates email: "alice@example.com"
2. User updates email again: "alice@newdomain.com"

If events arrive out of order, the final email might be wrong.

### Ordering Strategies

**Strategy 1: Partition/Key-Based Ordering**

Route related messages to the same partition using a key:
```javascript
// Kafka: use userId as partition key
producer.send({
  topic: 'user-updates',
  key: userId,        // Same userId → same partition → ordered
  value: event
});
```

**Guarantee**: Messages with the same key are ordered.

**Trade-off**: Limits parallelism (all messages for one key go to one partition).

**Strategy 2: Sequence Numbers**

Include a sequence number in each event:
```json
{
  "eventType": "UserUpdated",
  "userId": "user-123",
  "sequenceNumber": 42,
  "data": { "email": "alice@newdomain.com" }
}
```

Consumer checks sequence:
```javascript
function handleUserUpdated(event) {
  const lastSeq = getLastSequenceNumber(event.userId);

  if (event.sequenceNumber <= lastSeq) {
    // Old event, ignore
    return;
  }

  if (event.sequenceNumber !== lastSeq + 1) {
    // Missing events, buffer and wait
    bufferOutOfOrderEvent(event);
    return;
  }

  // Process in order
  processEvent(event);
  setLastSequenceNumber(event.userId, event.sequenceNumber);
}
```

**Strategy 3: Timestamps (Use Carefully)**

Use timestamps to order events:
```json
{
  "timestamp": "2024-01-15T10:30:00.123Z",
  "data": { ... }
}
```

**Caveat**: Clock skew between servers can cause issues. Not reliable for strict ordering.

### Exactly-Once Semantics

**The problem**: Failures can cause messages to be processed multiple times.

**Delivery guarantees**:

**1. At-most-once**
- Message delivered zero or one time
- May be lost (not delivered at all)
- No retries on failure
- **Use when**: Losing messages is acceptable (e.g., metrics)

**2. At-least-once** (most common)
- Message delivered one or more times
- May be duplicated
- Retries on failure
- **Use when**: Duplicates are acceptable or you handle them

**3. Exactly-once** (hard to achieve)
- Message delivered exactly one time
- No duplicates, no losses
- Requires idempotent consumers or transactions
- **Use when**: Correctness is critical (e.g., financial transactions)

### Achieving Exactly-Once Processing

**Approach 1: Idempotent Consumers**

Make processing idempotent so duplicates don't matter:
```javascript
function handlePayment(event) {
  // Check if already processed
  if (paymentExists(event.paymentId)) {
    return; // Already processed, safe to skip
  }

  // Process payment
  processPayment(event);

  // Record as processed
  markPaymentProcessed(event.paymentId);
}
```

**Approach 2: Transactional Outbox**

Atomically write to database and publish event:
```javascript
// Within a database transaction
db.transaction(async () => {
  // Save to database
  await db.insert('orders', order);

  // Save event to outbox table (same transaction)
  await db.insert('outbox', {
    eventType: 'OrderPlaced',
    payload: JSON.stringify(order)
  });
});

// Separate process reads outbox and publishes to event bus
```

**Approach 3: Kafka Transactions** (Kafka-specific)

Use Kafka's transactional API:
```javascript
producer.initTransactions();
producer.beginTransaction();
producer.send(message1);
producer.send(message2);
producer.commitTransaction(); // Both sent atomically
```

## Design Patterns

### 1. Event Notification

**What it is**: Notify consumers that something happened. Include minimal data.

**Example**:
```json
{
  "eventType": "OrderPlaced",
  "orderId": "order-123"
}
```

Consumers fetch full details if needed:
```javascript
function handleOrderPlaced(event) {
  const order = await orderService.getOrder(event.orderId);
  // Process order
}
```

**Pros**: Small events, flexible (consumers fetch what they need)
**Cons**: Requires consumers to call back (coupling), slower

### 2. Event-Carried State Transfer

**What it is**: Include all necessary data in the event. Consumers don't need to fetch more.

**Example**:
```json
{
  "eventType": "OrderPlaced",
  "data": {
    "orderId": "order-123",
    "customerId": "customer-456",
    "items": [ ... ],
    "totalAmount": 99.99,
    "shippingAddress": { ... }
  }
}
```

**Pros**: No additional calls (loose coupling), faster
**Cons**: Larger events, data duplication

### 3. Event Sourcing

**What it is**: Store all changes as events. Current state = replaying all events.

**Example**:
```javascript
// Events
const events = [
  { type: "AccountCreated", userId: 123, balance: 0 },
  { type: "MoneyDeposited", userId: 123, amount: 1000 },
  { type: "MoneyWithdrawn", userId: 123, amount: 200 },
  { type: "MoneyWithdrawn", userId: 123, amount: 300 }
];

// Rebuild state by replaying
let balance = 0;
for (const event of events) {
  if (event.type === "AccountCreated") balance = event.balance;
  if (event.type === "MoneyDeposited") balance += event.amount;
  if (event.type === "MoneyWithdrawn") balance -= event.amount;
}
// Final balance: 500
```

**Pros**: Complete audit trail, time travel, debugging
**Cons**: More complex, requires careful schema design

### 4. CQRS (Command Query Responsibility Segregation)

**What it is**: Separate read model from write model.

**Architecture**:
```
Write Side:
  Command → Validate → Update DB → Publish Event

Read Side:
  Event → Update Read Model (denormalized, optimized for queries)

Queries:
  Client → Query Read Model (fast, optimized)
```

**Pros**: Optimize reads and writes independently, better performance
**Cons**: Eventual consistency, more complexity

### 5. Saga Pattern (Distributed Transactions)

**What it is**: Manage transactions across multiple services using events.

**Scenario**: Place an order (involves inventory, payment, shipping)

**Choreography-based Saga**:
```
1. Order Service: Publish "OrderPlaced"
   ↓
2. Inventory Service: Reserve stock
   → Success: Publish "StockReserved"
   → Failure: Publish "StockReservationFailed"
   ↓
3. Payment Service: Charge payment
   → Success: Publish "PaymentCompleted"
   → Failure: Publish "PaymentFailed"
   ↓
4. Shipping Service: Schedule shipment
   → Success: Publish "ShipmentScheduled"
   → Failure: Publish "ShipmentSchedulingFailed"

If any step fails:
   → Publish compensation events (undo previous steps)
   → "StockReleased", "PaymentRefunded"
```

**Orchestration-based Saga**:
```
Saga Orchestrator coordinates:
1. Tell Inventory: Reserve stock
2. Wait for response
3. Tell Payment: Charge
4. Wait for response
5. Tell Shipping: Schedule
6. If anything fails: Tell services to undo
```

**Pros**: Handles failures gracefully, maintains consistency
**Cons**: Complex to implement, requires careful design

### 6. Outbox Pattern

**What it is**: Atomically update database and publish event using outbox table.

**Problem**: Can't update DB and publish event atomically.

**Bad**:
```javascript
// Update DB
await db.update('orders', order);

// Publish event (what if this fails?)
await eventBus.publish('OrderPlaced', order);
// Database updated but event not published = inconsistency
```

**Outbox Pattern**:
```javascript
// Within database transaction
await db.transaction(async (tx) => {
  // Update main table
  await tx.update('orders', order);

  // Write event to outbox table (same transaction = atomic)
  await tx.insert('outbox_events', {
    eventType: 'OrderPlaced',
    payload: JSON.stringify(order),
    published: false
  });
});

// Separate process polls outbox and publishes
setInterval(async () => {
  const unpublished = await db.query('SELECT * FROM outbox_events WHERE published = false');

  for (const event of unpublished) {
    await eventBus.publish(event.eventType, JSON.parse(event.payload));
    await db.update('outbox_events', { published: true }, { id: event.id });
  }
}, 1000);
```

**Pros**: Guarantees event published if DB updated
**Cons**: Requires polling or change data capture

## Debugging Distributed Events

### Challenge: Tracing Events Across Services

**Scenario**: User reports order failed. Where did it fail?

The order flowed through:
1. Order Service (received request)
2. Inventory Service (checked stock)
3. Payment Service (charged card)
4. Shipping Service (scheduled shipment)

One of these failed, but which one?

### Solution: Distributed Tracing

**Step 1: Add Trace ID**

Generate a unique trace ID and pass it through all events:

```javascript
// Order Service: Generate trace ID
const traceId = generateTraceId(); // e.g., "trace-abc-123"

// Publish event with trace ID
await eventBus.publish('OrderPlaced', {
  traceId: traceId,
  orderId: order.id,
  ...order
});

// Log with trace ID
logger.info('Order placed', { traceId, orderId: order.id });
```

```javascript
// Inventory Service: Receive event, use same trace ID
async function handleOrderPlaced(event) {
  const traceId = event.traceId;

  logger.info('Processing order', { traceId, orderId: event.orderId });

  // Process...

  // Publish new event with same trace ID
  await eventBus.publish('StockReserved', {
    traceId: traceId,
    orderId: event.orderId,
    ...
  });
}
```

**Step 2: Search Logs by Trace ID**

```bash
# Find all logs for this trace
grep "trace-abc-123" logs/*

# Or use log aggregation tool (e.g., CloudWatch Logs Insights)
fields @timestamp, message, service
| filter traceId = "trace-abc-123"
| sort @timestamp asc
```

You see the complete flow:
```
10:30:00 [OrderService] Order placed (traceId: trace-abc-123)
10:30:01 [InventoryService] Processing order (traceId: trace-abc-123)
10:30:02 [InventoryService] Stock reserved (traceId: trace-abc-123)
10:30:03 [PaymentService] Processing payment (traceId: trace-abc-123)
10:30:04 [PaymentService] Payment failed: Card declined (traceId: trace-abc-123) ← Found it!
```

### Advanced Tracing Tools

**AWS X-Ray / Azure Application Insights / Google Cloud Trace**:
- Automatic instrumentation
- Visual trace maps showing service calls
- Latency analysis

**Jaeger / Zipkin** (open-source):
- Distributed tracing for microservices
- Trace visualization
- Performance analysis

### Debugging Strategies

**Strategy 1: Event Replay**

Save events in Kafka or Event Store, replay them to reproduce bugs:
```javascript
// Replay events from Kafka starting at offset 1000
const events = await kafka.consume('orders', { fromOffset: 1000, toOffset: 1100 });

for (const event of events) {
  await handleEvent(event); // Reproduce the bug
}
```

**Strategy 2: Dead Letter Queue**

Route failed events to a dead letter queue for inspection:
```javascript
async function handleEvent(event) {
  try {
    await processEvent(event);
  } catch (error) {
    logger.error('Event processing failed', { event, error });

    // Send to DLQ for manual inspection
    await deadLetterQueue.publish(event);
  }
}
```

**Strategy 3: Event Validation**

Validate events against schemas to catch issues early:
```javascript
import { z } from 'zod';

const OrderPlacedSchema = z.object({
  eventType: z.literal('OrderPlaced'),
  traceId: z.string(),
  orderId: z.string(),
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive()
  }))
});

function handleOrderPlaced(event) {
  try {
    const validated = OrderPlacedSchema.parse(event);
    // Process validated event
  } catch (error) {
    logger.error('Invalid event schema', { event, error });
    // Send to DLQ or alert
  }
}
```

## Best Practices

### Safety: Error Handling and Retries

Handle failures gracefully:

```javascript
async function handleEvent(event) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await processEvent(event);
      return; // Success
    } catch (error) {
      attempt++;

      if (attempt >= maxRetries) {
        logger.error('Event processing failed after retries', { event, error, attempt });

        // Send to dead letter queue
        await deadLetterQueue.publish(event);
      } else {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn('Retrying event processing', { event, attempt, delay });
        await sleep(delay);
      }
    }
  }
}
```

### Quality: Testing Event-Driven Systems

**Unit Tests**: Test event handlers in isolation:
```javascript
describe('handleOrderPlaced', () => {
  it('should reserve stock when order placed', async () => {
    const event = {
      eventType: 'OrderPlaced',
      orderId: 'order-123',
      items: [{ productId: 'prod-1', quantity: 2 }]
    };

    await handleOrderPlaced(event);

    const stock = await getStock('prod-1');
    expect(stock.reserved).toBe(2);
  });
});
```

**Integration Tests**: Test with real event brokers:
```javascript
describe('Order flow integration', () => {
  it('should complete order flow end-to-end', async () => {
    // Publish OrderPlaced event to real Kafka
    await eventBus.publish('OrderPlaced', {
      orderId: 'order-123',
      items: [...]
    });

    // Wait for processing
    await sleep(2000);

    // Verify side effects
    expect(await getStock('prod-1')).toHaveProperty('reserved', 2);
    expect(await getPayment('order-123')).toHaveProperty('status', 'completed');
    expect(await getShipment('order-123')).toHaveProperty('scheduled', true);
  });
});
```

**Contract Tests**: Ensure events match expected schemas:
```javascript
describe('Event contracts', () => {
  it('OrderPlaced event should match schema', () => {
    const event = {
      eventType: 'OrderPlaced',
      orderId: 'order-123',
      ...
    };

    expect(() => OrderPlacedSchema.parse(event)).not.toThrow();
  });
});
```

### Logging: Structured with Trace IDs

Log everything needed for debugging:

```javascript
async function handleEvent(event, context) {
  const traceId = event.traceId || generateTraceId();
  const startTime = Date.now();

  logger.info('Event received', {
    traceId,
    eventType: event.eventType,
    eventId: event.eventId,
    source: event.source
  });

  try {
    await processEvent(event);

    logger.info('Event processed successfully', {
      traceId,
      eventType: event.eventType,
      duration: Date.now() - startTime
    });
  } catch (error) {
    logger.error('Event processing failed', {
      traceId,
      eventType: event.eventType,
      error: error.message,
      stack: error.stack,
      duration: Date.now() - startTime
    });

    throw error;
  }
}
```

## Use Cases Across Industries

### Healthcare: Patient Care Coordination

**Challenge**: Coordinate care across doctors, labs, pharmacies, insurance

**Event-driven solution**:
```
Doctor orders lab test
  → "LabTestOrdered" event
  → Lab receives and processes
  → "LabResultsReady" event
  → Doctor notified
  → EHR updated
  → Patient notified
  → Insurance notified for billing
```

**Why EDA works**:
- Loose coupling (add new systems without changing existing ones)
- Real-time coordination
- Complete audit trail (HIPAA compliance)
- Resilience (if insurance system down, care continues)

### Finance: Trading Platform

**Challenge**: Process trades, update portfolios, check risk, report to regulators

**Event-driven solution**:
```
Trade executed
  → "TradeExecuted" event
  → Portfolio Service: Update holdings
  → Risk Service: Recalculate risk metrics
  → Compliance Service: Check regulations
  → Reporting Service: Generate reports
  → Notification Service: Alert trader
```

**Why EDA works**:
- Real-time updates (portfolio always current)
- Independent scaling (risk calculations scale separately)
- Audit trail (every trade recorded)
- Extensibility (add new services without changes)

### E-commerce: Order Processing

**Challenge**: Process orders across inventory, payment, shipping, notifications

**Event-driven solution**:
```
Customer places order
  → "OrderPlaced" event
  → Inventory: Reserve stock → "StockReserved"
  → Payment: Charge card → "PaymentCompleted"
  → Shipping: Create label → "ShipmentScheduled"
  → Email: Send confirmation → "ConfirmationSent"
  → Analytics: Update dashboard → "OrderRecorded"
```

**Why EDA works**:
- Handles high order volume
- Graceful degradation (if email fails, order still processes)
- Extensibility (add loyalty points service by subscribing)
- Real-time inventory

### Social Media: Activity Feeds

**Challenge**: Update feeds when users post, like, comment, share

**Event-driven solution**:
```
User creates post
  → "PostCreated" event
  → Feed Service: Add to followers' feeds
  → Notification Service: Notify followers
  → Analytics Service: Track engagement
  → Search Service: Index post
  → Moderation Service: Check content
```

**Why EDA works**:
- Scales to millions of users
- Real-time updates
- Easy to add features (new services just subscribe)
- Resilient (if search indexing fails, posting still works)

## Common Pitfalls

### Pitfall 1: Publishing Too Much Data

**Problem**: Including unnecessary data makes events huge and slow.

**Solution**: Include only what consumers need. Balance completeness and size.

### Pitfall 2: Not Handling Duplicates

**Problem**: Events processed twice, causing bugs (double charge, double email).

**Solution**: Make consumers idempotent using event IDs.

### Pitfall 3: No Distributed Tracing

**Problem**: Can't debug issues that span multiple services.

**Solution**: Add trace IDs to all events and logs.

### Pitfall 4: Ignoring Eventual Consistency

**Problem**: Expecting immediate consistency, confusing users.

**Solution**: Design UX for eventual consistency (show "Processing..." states).

### Pitfall 5: Tight Coupling via Events

**Problem**: Consumers query producers for more data (defeats the purpose).

**Solution**: Use event-carried state transfer (include all needed data).

### Pitfall 6: No Schema Versioning

**Problem**: Breaking changes break consumers.

**Solution**: Version event schemas, support multiple versions.

### Pitfall 7: No Dead Letter Queue

**Problem**: Failed events disappear, no way to recover.

**Solution**: Route failed events to DLQ for inspection and retry.

## Quick Reference

### When to Use Event-Driven Architecture

| Scenario | EDA | Traditional |
|----------|-----|-------------|
| Microservices communication | ✅ Excellent (loose coupling) | ⚠️ Tight coupling |
| Real-time updates | ✅ Perfect fit | ❌ Polling required |
| High scalability needs | ✅ Independent scaling | ⚠️ All scales together |
| Multiple consumers for one event | ✅ Easy (pub/sub) | ❌ Complex fanout |
| Need audit trail | ✅ Built-in (event store) | ⚠️ Must build separately |
| Simple CRUD app | ⚠️ Overkill | ✅ Simpler |
| Immediate consistency required | ❌ Eventual consistency | ✅ Immediate |
| Team unfamiliar with async patterns | ⚠️ Steep learning curve | ✅ Easier |

### Event Design Checklist

```
✅ Include eventId (for deduplication)
✅ Include eventType (what happened)
✅ Include timestamp (when it happened)
✅ Include traceId (for distributed tracing)
✅ Include source (which service published it)
✅ Include version (for schema evolution)
✅ Make event self-contained (all needed data)
✅ Make event immutable (describe the past, never change)
✅ Use past tense for event names (OrderPlaced, not PlaceOrder)
✅ Keep events focused (one thing happened)
```

### Choosing an Event Broker

```
Need high throughput + event replay?
  → Kafka or Azure Event Hubs

Need simple pub/sub, managed service?
  → AWS SNS/SQS or GCP Pub/Sub

Need flexible routing, traditional messaging?
  → RabbitMQ

Need to avoid operational overhead entirely?
  → Fully managed cloud services (SNS/SQS, Pub/Sub, Event Hubs)

Already heavily invested in one cloud?
  → Use that cloud's native service
```

## Related Topics

### Within Architecture

- **[Microservices Architecture](../microservices/README.md)** — Often use EDA for communication
- **[Serverless Architecture](../serverless/README.md)** — Naturally event-driven
- **[System Design Concepts](../system-design-concepts/README.md)** — Scalability and consistency principles
- **[CQRS Pattern](../cqrs/README.md)** — Often combined with EDA

### Infrastructure and Tools

- **[Message Queues](../../06-infrastructure/README.md)** — RabbitMQ, Kafka setup and operation
- **[Monitoring and Observability](../../06-infrastructure/README.md)** — Distributed tracing
- **[Data Streaming](../../09-ai-ml/README.md)** — Real-time data processing

### Development Practices

- **[Testing Distributed Systems](../../03-methodologies/README.md)** — Testing async workflows
- **[Distributed Systems Patterns](../../03-methodologies/README.md)** — Sagas, outbox pattern
- **[Resilience Patterns](../../03-methodologies/README.md)** — Circuit breakers, retries

## Next Steps

1. **Build a simple event system**: Create publisher and subscriber with SNS/SQS or Pub/Sub
2. **Add distributed tracing**: Implement trace IDs across services
3. **Practice event schema design**: Create well-structured events with versioning
4. **Experiment with Kafka**: Set up Kafka locally, publish and consume messages
5. **Implement a saga**: Build a multi-step workflow with compensating transactions
6. **Study real-world patterns**: Read about how companies like Netflix, Uber, and LinkedIn use EDA

**Ready to go deeper?** Explore [System Design Concepts](../system-design-concepts/README.md) to understand the architectural principles that make event-driven systems scalable and resilient, or check out [Microservices Architecture](../microservices/README.md) to see how EDA enables loosely coupled service communication.
