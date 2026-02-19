# CQRS (Command Query Responsibility Segregation)

## What is it?

CQRS (Command Query Responsibility Segregation) is an architectural pattern that separates read operations (queries) from write operations (commands) into different models. Instead of using one data model for both reading and writing, CQRS uses two separate models optimized for their specific purposes — one for updates and one for reads.

## Simple Analogy

Think of a restaurant kitchen. When you place an order (write operation), it goes to the kitchen staff who prepare the food — they need to know ingredients, cooking steps, and timing. When you look at the menu (read operation), you only see the dish names, prices, and descriptions — a much simpler view. The kitchen doesn't use the same information format as the menu, even though they represent the same dishes. CQRS is like having separate systems for "taking orders" versus "showing the menu" — each optimized for its own job.

## Why does it matter?

### Business Impact

- **Performance**: Read and write operations can be optimized independently
- **Scalability**: You can scale reads and writes separately based on actual load
- **Flexibility**: Different teams can work on read and write models independently
- **Complex domains**: Makes it easier to handle complex business rules

### Technical Benefits

- Queries don't impact command processing performance
- Read models can be denormalized for optimal query performance
- Write models can enforce business rules without query complexity
- Can use different databases for reads and writes (polyglot persistence)

## How it works

### Traditional Approach (No CQRS)

```
Request → Single Model → Single Database
         (handles both reads & writes)
```

### CQRS Approach

```
Commands (Writes) → Command Model → Write Database
                         ↓
                    Events/Updates
                         ↓
Queries (Reads) ← Query Model ← Read Database
```

### Step-by-step Flow

1. **Command Processing**:
   - User sends a command (e.g., "CreateOrder")
   - Command handler validates and processes business logic
   - Changes are written to the write database
   - Events are published to notify other parts of the system

2. **Synchronization**:
   - Event handlers listen for change events
   - Events update the read model(s)
   - Read models are optimized for queries

3. **Query Processing**:
   - User requests data (e.g., "GetOrderDetails")
   - Query handler fetches from read database
   - No business logic, just data retrieval

### Visual Representation

```
┌─────────────────────────────────────────────────────────────┐
│                        CQRS System                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WRITE SIDE                        READ SIDE                │
│  ┌──────────────┐                 ┌──────────────┐         │
│  │   Commands   │                 │   Queries    │         │
│  │  - Create    │                 │  - GetById   │         │
│  │  - Update    │                 │  - Search    │         │
│  │  - Delete    │                 │  - List      │         │
│  └──────┬───────┘                 └──────▲───────┘         │
│         │                                 │                 │
│         ▼                                 │                 │
│  ┌──────────────┐                 ┌──────────────┐         │
│  │Command Model │                 │ Query Model  │         │
│  │ (Normalized) │                 │(Denormalized)│         │
│  └──────┬───────┘                 └──────▲───────┘         │
│         │                                 │                 │
│         ▼                                 │                 │
│  ┌──────────────┐    Events      ┌──────────────┐         │
│  │Write Database│────────────────▶│Read Database │         │
│  │(PostgreSQL)  │                 │(MongoDB, ES) │         │
│  └──────────────┘                 └──────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Command

A request to change the system state. Commands are named in the imperative (e.g., "CreateUser", "UpdateOrder"). They contain all information needed to perform the action.

**Example**:
```json
{
  "commandType": "CreateOrder",
  "orderId": "12345",
  "customerId": "customer-1",
  "items": [
    { "productId": "prod-1", "quantity": 2 }
  ]
}
```

### Query

A request to retrieve data. Queries never modify state. They're named descriptively (e.g., "GetUserById", "SearchOrders").

**Example**:
```json
{
  "queryType": "GetOrderById",
  "orderId": "12345"
}
```

### Command Handler

Processes commands, enforces business rules, and updates the write model.

### Query Handler

Retrieves data from the read model. No business logic — just data access.

### Write Model (Command Model)

The model used for processing commands. It's typically normalized and enforces business invariants.

### Read Model (Query Model)

The model used for queries. It's often denormalized and optimized for specific query patterns.

### Event

A notification that something happened in the system (e.g., "OrderCreated"). Events are used to synchronize the read model with the write model.

### Eventual Consistency

The read model may not be immediately updated after a command. There's a small delay while events propagate. This is acceptable in most systems.

## Use Cases

### E-Commerce Platform

**Write Side**: Handle order creation with complex validation (inventory checks, payment processing, fraud detection)

**Read Side**: Product catalog optimized for search and filtering, order history views denormalized with customer and product details

**Why CQRS**: Orders have complex business rules, but product browsing needs to be fast and handle high traffic

### Banking System

**Write Side**: Process transactions with ACID guarantees, enforce account balance rules, compliance checks

**Read Side**: Account statements, transaction history, reporting dashboards

**Why CQRS**: Transactions need strict consistency, but reporting can tolerate slight delays and needs different data formats

### Social Media Feed

**Write Side**: Post creation, likes, comments with moderation and spam checks

**Read Side**: Personalized feeds, trending topics, user timelines — all pre-computed and cached

**Why CQRS**: Writes are relatively rare per user, but reads are constant and need to be extremely fast

### Healthcare System

**Write Side**: Patient admission, prescription orders, lab test requests with validation

**Read Side**: Patient history dashboards, doctor schedules, reporting

**Why CQRS**: Medical records need audit trails and validation, but doctors need instant access to patient information

### Inventory Management

**Write Side**: Stock updates, purchase orders, warehouse transfers

**Read Side**: Inventory levels, reorder alerts, availability by location

**Why CQRS**: Stock updates need to prevent overselling, but inventory queries happen much more frequently

## Best Practices

### Safety

- **Validate commands thoroughly**: Check all business rules before accepting a command
- **Use idempotent commands**: Commands should be safely retryable
- **Implement command versioning**: Support evolving command structures
- **Secure command endpoints**: Authenticate and authorize before processing
- **Audit all commands**: Log who did what and when

### Quality

- **Test command handlers separately**: Unit test business logic in isolation
- **Test query handlers**: Ensure queries return correct data
- **Integration testing**: Verify command-to-query synchronization
- **Performance testing**: Test read and write loads independently
- **Monitor synchronization lag**: Alert if read model falls too far behind

### Logging

```javascript
// Command processing
logger.info('Processing command', {
  commandId: cmd.id,
  commandType: cmd.type,
  userId: cmd.userId,
  correlationId: cmd.correlationId,
  timestamp: Date.now()
});

// Event publishing
logger.info('Event published', {
  eventId: event.id,
  eventType: event.type,
  aggregateId: event.aggregateId,
  correlationId: event.correlationId,
  timestamp: Date.now()
});

// Read model update
logger.info('Read model updated', {
  modelType: 'OrderView',
  recordId: event.orderId,
  eventId: event.id,
  lag: Date.now() - event.timestamp
});
```

## Common Pitfalls

### Over-engineering Simple Systems

**Problem**: Applying CQRS to a simple CRUD application adds unnecessary complexity.

**Solution**: Use CQRS only when you have:
- Different scalability needs for reads vs writes
- Complex business logic in write operations
- Multiple read models with different needs
- High read-to-write ratios

### Ignoring Eventual Consistency

**Problem**: Users expect immediate consistency but read model updates are delayed.

**Solution**:
- Set clear expectations in the UI ("Your changes are being processed")
- Return command result immediately, not query result
- Implement optimistic UI updates
- Monitor and minimize synchronization lag

### Not Handling Failed Events

**Problem**: Events fail to process, leaving read model out of sync.

**Solution**:
- Implement retry logic with exponential backoff
- Use dead letter queues for failed events
- Monitor event processing success rates
- Implement event replay capabilities

### Too Many Read Models

**Problem**: Creating a separate read model for every screen leads to maintenance nightmares.

**Solution**:
- Start with one or two read models
- Combine similar queries into shared models
- Only add new models when there's clear performance benefit

### Synchronous Event Processing

**Problem**: Updating read models synchronously slows down command processing.

**Solution**:
- Use asynchronous event processing (message queues)
- Accept eventual consistency
- Return command acknowledgment immediately

### No Command Validation

**Problem**: Invalid commands reach the domain, causing errors or inconsistent state.

**Solution**:
- Validate at command API layer (format, required fields)
- Validate in command handler (business rules)
- Use command validators as a separate component

## Simple Example

### Command Side (Python)

```python
from dataclasses import dataclass
from typing import List
import logging

logger = logging.getLogger(__name__)

@dataclass
class CreateOrderCommand:
    order_id: str
    customer_id: str
    items: List[dict]
    correlation_id: str

class OrderCommandHandler:
    def __init__(self, repository, event_bus):
        self.repository = repository
        self.event_bus = event_bus

    def handle_create_order(self, command: CreateOrderCommand):
        """
        Process the CreateOrder command.

        Why separate from queries:
        - Complex validation logic
        - Business rule enforcement
        - Event publishing
        """
        logger.info('Processing CreateOrder command', extra={
            'order_id': command.order_id,
            'customer_id': command.customer_id,
            'correlation_id': command.correlation_id
        })

        # Validate business rules
        if not command.items:
            raise ValueError("Order must have at least one item")

        # Create order in write database
        order = {
            'id': command.order_id,
            'customer_id': command.customer_id,
            'items': command.items,
            'status': 'PENDING',
            'created_at': datetime.now()
        }
        self.repository.save(order)

        # Publish event for read model update
        event = {
            'type': 'OrderCreated',
            'order_id': command.order_id,
            'customer_id': command.customer_id,
            'item_count': len(command.items),
            'correlation_id': command.correlation_id
        }
        self.event_bus.publish(event)

        logger.info('Order created successfully', extra={
            'order_id': command.order_id,
            'correlation_id': command.correlation_id
        })

        return {'success': True, 'order_id': command.order_id}
```

### Query Side (Python)

```python
class OrderQueryHandler:
    def __init__(self, read_repository):
        self.read_repository = read_repository

    def get_order_summary(self, order_id: str):
        """
        Retrieve order from read model.

        Why separate from commands:
        - No business logic
        - Optimized for fast reads
        - Denormalized data structure
        """
        logger.info('Fetching order summary', extra={
            'order_id': order_id
        })

        # Query denormalized read model
        # This could include customer name, product details, etc.
        # all pre-joined for fast retrieval
        order_view = self.read_repository.find_order_view(order_id)

        return order_view
```

### Event Handler (Read Model Update)

```python
class OrderEventHandler:
    def __init__(self, read_repository):
        self.read_repository = read_repository

    def handle_order_created(self, event):
        """
        Update read model when order is created.

        Best Practices:
        - Idempotent (safe to process same event twice)
        - Fast processing
        - Error handling with retry
        """
        try:
            logger.info('Updating read model for OrderCreated', extra={
                'order_id': event['order_id'],
                'correlation_id': event['correlation_id']
            })

            # Create denormalized view for queries
            order_view = {
                'order_id': event['order_id'],
                'customer_id': event['customer_id'],
                'item_count': event['item_count'],
                'status': 'PENDING',
                'created_at': datetime.now()
            }

            # Save to read database (could be different database type)
            self.read_repository.save_order_view(order_view)

            logger.info('Read model updated successfully', extra={
                'order_id': event['order_id']
            })

        except Exception as e:
            logger.error('Failed to update read model', extra={
                'order_id': event['order_id'],
                'error': str(e)
            })
            # Re-raise to trigger retry mechanism
            raise
```

## Integration with Other Patterns

### CQRS + Event Sourcing

Event Sourcing is a natural fit with CQRS. Instead of storing current state in the write model, you store all events. The read model is built by replaying events.

**Benefits**:
- Complete audit trail
- Time travel (replay to any point)
- Multiple read models from same events

**See**: [Event Sourcing guide](../event-sourcing/README.md)

### CQRS + Domain-Driven Design

CQRS works well with DDD's concept of aggregates. Commands operate on aggregates, while queries read from denormalized views.

**See**: [Domain-Driven Design guide](../../03-methodologies/domain-driven-design/README.md)

### CQRS + Saga Pattern

Sagas use commands to coordinate distributed transactions. Each step in a saga issues commands, and compensating commands are used for rollback.

**See**: [Saga Pattern guide](../saga-pattern/README.md)

### CQRS + Microservices

Each microservice can use CQRS internally. Commands and queries can also be distributed across services.

**See**: [Microservices guide](../microservices/README.md)

## Technology Stack

### Message Brokers (for events)

- **RabbitMQ**: Good for guaranteed delivery, supports various patterns
- **Apache Kafka**: Best for high-throughput event streams
- **AWS SQS/SNS**: Managed service, good for AWS environments
- **Azure Service Bus**: Managed service for Azure

### Databases

**Write Side**:
- PostgreSQL: ACID transactions, referential integrity
- MySQL: Traditional relational database
- MongoDB: Document store with good write performance

**Read Side**:
- MongoDB: Flexible schemas, good for denormalized data
- Elasticsearch: Optimized for search and analytics
- Redis: Ultra-fast for frequently accessed data
- Cassandra: High availability, good for time-series data

### Frameworks

- **Axon Framework** (Java): Built specifically for CQRS and Event Sourcing
- **MediatR** (.NET): Simple command/query handling
- **Commanded** (Elixir): CQRS/ES framework
- **NestJS CQRS** (Node.js): CQRS module for NestJS
- **Eventuate** (Multiple): Platform for event-driven microservices

## Monitoring and Observability

### Key Metrics

```javascript
// Command processing metrics
metrics.increment('commands.processed', {
  command_type: 'CreateOrder',
  success: true
});

metrics.timing('commands.duration', duration, {
  command_type: 'CreateOrder'
});

// Read model synchronization lag
metrics.gauge('read_model.lag', lag_milliseconds, {
  model_type: 'OrderView'
});

// Event processing metrics
metrics.increment('events.processed', {
  event_type: 'OrderCreated',
  success: true
});
```

### Health Checks

- Command processing success rate
- Query response times
- Event processing lag
- Failed event count
- Read model staleness

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Best for** | Systems with different read/write scaling needs, complex business logic in writes, multiple query patterns |
| **Avoid when** | Simple CRUD apps, when consistency is critical and eventual consistency won't work, small teams without infrastructure experience |
| **Key benefit** | Independent optimization and scaling of reads vs writes |
| **Key challenge** | Eventual consistency, increased complexity, synchronization overhead |
| **Common use cases** | E-commerce, banking, event ticketing, inventory management |
| **Database types** | Write: SQL (PostgreSQL, MySQL), Read: NoSQL (MongoDB, Elasticsearch, Redis) |
| **Typical read/write ratio** | 10:1 or higher reads to writes |

## Decision Guide

### When to use CQRS

✅ Use CQRS when:
- Read and write workloads have different scaling requirements
- Complex business logic in write operations
- Need multiple denormalized views of same data
- High read-to-write ratio (10:1 or more)
- Can tolerate eventual consistency
- Have infrastructure for async messaging

❌ Avoid CQRS when:
- Simple CRUD application
- Reads and writes have similar complexity
- Team lacks experience with distributed systems
- Immediate consistency is required
- Limited infrastructure (can't run message brokers)
- Small dataset that fits in memory

## Testing Strategies

### Unit Testing Commands

```python
def test_create_order_command_validation():
    """Test command validation logic"""
    command = CreateOrderCommand(
        order_id='123',
        customer_id='customer-1',
        items=[],  # Empty items should fail
        correlation_id='corr-1'
    )

    handler = OrderCommandHandler(mock_repo, mock_bus)

    with pytest.raises(ValueError, match='at least one item'):
        handler.handle_create_order(command)
```

### Integration Testing Event Flow

```python
def test_order_created_event_updates_read_model():
    """Test that events properly update read model"""
    # Arrange
    command = CreateOrderCommand(
        order_id='123',
        customer_id='customer-1',
        items=[{'product_id': 'p1', 'quantity': 2}],
        correlation_id='corr-1'
    )

    # Act
    command_handler.handle_create_order(command)

    # Wait for event processing (async)
    time.sleep(0.1)

    # Assert - check read model updated
    order_view = query_handler.get_order_summary('123')
    assert order_view['order_id'] == '123'
    assert order_view['item_count'] == 1
```

### Testing Query Performance

```python
def test_query_performance():
    """Ensure queries meet performance requirements"""
    start = time.time()

    results = query_handler.search_orders(filters={
        'customer_id': 'customer-1',
        'status': 'COMPLETED'
    })

    duration = time.time() - start

    assert duration < 0.1  # Should complete in < 100ms
    assert len(results) > 0
```

## Related Topics

- [Event Sourcing](../event-sourcing/README.md) - Often used together with CQRS
- [Event-Driven Architecture](../event-driven/README.md) - Foundation for CQRS
- [Saga Pattern](../saga-pattern/README.md) - Distributed transactions with CQRS
- [Domain-Driven Design](../../03-methodologies/domain-driven-design/README.md) - Works well with CQRS
- [Microservices](../microservices/README.md) - CQRS in distributed systems
- [API Design](../api-design/README.md) - Designing command and query APIs

## Further Reading

- Martin Fowler's CQRS article: https://martinfowler.com/bliki/CQRS.html
- Greg Young's CQRS documents: https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf
- Microsoft CQRS pattern guide: https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs

---

**Last Updated**: 2026-02-19
