# Event Sourcing

## What is it?

Event Sourcing is an architectural pattern where you store every change to application state as an ordered sequence of events, rather than storing just the current state. Instead of updating a record in place, you append new events to an immutable log. The current state is derived by replaying all events from the beginning (or from a snapshot).

## Simple Analogy

Think of your bank account statement. The bank doesn't just store your current balance — it stores every transaction (deposit, withdrawal, transfer) that ever happened. If you want to know your current balance, you start from zero and add up all the transactions. This gives you not just "how much money do I have now?" but also "how did I get here?" Event Sourcing works the same way — instead of storing "User's name is John", you store "UserCreated", "UserNameChangedToJohn", etc.

## Why does it matter?

### Business Impact

- **Complete audit trail**: Know exactly what happened, when, and why
- **Time travel**: Reconstruct state at any point in history
- **Debugging**: Reproduce bugs by replaying events
- **Compliance**: Financial and healthcare regulations require audit trails
- **Business insights**: Analyze how data evolved over time

### Technical Benefits

- Never lose data — events are immutable and append-only
- Can build multiple views (projections) from the same events
- Enables temporal queries ("what was the state on March 15th?")
- Natural fit with event-driven architectures and CQRS
- Simplifies distributed systems (events are the source of truth)

## How it works

### Traditional Approach (State-Based)

```
Current State Only:
┌─────────────────┐
│  Users Table    │
│ id | name       │
│ 1  | John Smith │  ← Only current state stored
└─────────────────┘
(Lost: Original name, when it changed, who changed it)
```

### Event Sourcing Approach

```
Event Store (Immutable, Append-Only):
┌───────────────────────────────────────────────────┐
│ Event 1: UserCreated { id: 1, name: "John Doe" } │
│ Event 2: NameChanged { id: 1, name: "John Smith"}│
│ Event 3: EmailUpdated { id: 1, email: "j@ex.com"}│
└───────────────────────────────────────────────────┘
                     ↓
            Replay Events
                     ↓
        Current State (Derived):
        { id: 1, name: "John Smith", email: "j@ex.com" }
```

### Step-by-step Flow

1. **Command Arrives**: User performs action (e.g., "Change my name")
2. **Validate**: Check if the command is valid
3. **Generate Event**: Create event (e.g., "NameChanged")
4. **Append to Event Store**: Save event to immutable log
5. **Update Projections**: Event handlers update read models
6. **Acknowledge**: Confirm action completed

### Visual Representation

```
┌──────────────────────────────────────────────────────────┐
│                   Event Sourcing System                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Command                                               │
│     ┌──────────────┐                                     │
│     │ChangeUserName│                                     │
│     └──────┬───────┘                                     │
│            │                                              │
│            ▼                                              │
│  2. Domain Logic (Aggregate)                             │
│     ┌──────────────┐                                     │
│     │ User         │                                     │
│     │ - validate() │                                     │
│     │ - generate() │──► Event: UserNameChanged          │
│     └──────────────┘                                     │
│            │                                              │
│            ▼                                              │
│  3. Event Store (Append-Only)                            │
│     ┌────────────────────────────────────┐              │
│     │ Stream: user-1                     │              │
│     │ ├─ Event 0: UserCreated            │              │
│     │ ├─ Event 1: EmailVerified          │              │
│     │ ├─ Event 2: PasswordChanged        │              │
│     │ └─ Event 3: UserNameChanged ← NEW  │              │
│     └────────────┬───────────────────────┘              │
│                  │                                        │
│                  ├──► 4. Event Handlers                  │
│                  │    ┌──────────────────┐              │
│                  │    │ Update Read Model│              │
│                  │    │ Send Email       │              │
│                  │    │ Update Analytics │              │
│                  │    └──────────────────┘              │
│                  │                                        │
│                  └──► 5. Projections (Current State)     │
│                       ┌──────────────────┐              │
│                       │ Users View       │              │
│                       │ { name: "John" } │              │
│                       └──────────────────┘              │
└──────────────────────────────────────────────────────────┘
```

## Key Concepts

### Event

An immutable fact that represents something that happened in the past. Events are named in past tense (e.g., "OrderPlaced", "PaymentProcessed").

**Example**:
```json
{
  "eventId": "evt-12345",
  "eventType": "OrderPlaced",
  "aggregateId": "order-789",
  "timestamp": "2026-02-19T10:30:00Z",
  "version": 1,
  "data": {
    "orderId": "order-789",
    "customerId": "cust-123",
    "items": [
      { "productId": "prod-1", "quantity": 2, "price": 29.99 }
    ],
    "totalAmount": 59.98
  },
  "metadata": {
    "userId": "user-456",
    "correlationId": "corr-abc",
    "causationId": "cmd-xyz"
  }
}
```

### Event Store

A specialized database that stores events in an append-only log. Each event is immutable once written.

### Aggregate

A cluster of domain objects treated as a single unit. Aggregates produce events in response to commands. In Event Sourcing, aggregates are reconstructed by replaying their events.

### Stream

A sequence of events for a particular aggregate. Each aggregate has its own stream (e.g., "order-789" stream contains all events for that order).

### Projection (Read Model)

A view of the data built by processing events. You can have multiple projections for different purposes (e.g., summary view, detailed view, analytics).

### Snapshot

A saved state at a specific point in time to avoid replaying thousands of events. After loading a snapshot, you only replay events that occurred after it.

### Event Version

A version number in each event to track the aggregate's evolution and handle concurrency.

### Replay

The process of reprocessing events to rebuild state, either from scratch or from a snapshot.

### Temporal Query

A query that asks "what was the state at time T?" by replaying events up to that time.

## Use Cases

### Financial Systems (Banking, Trading)

**Why**: Regulations require complete audit trails. Every transaction must be traceable.

**Example**: Account balance is sum of all deposits and withdrawals. Can prove balance was correct at any point in time.

**Events**: AccountOpened, MoneyDeposited, MoneyWithdrawn, InterestAccrued

### E-Commerce Orders

**Why**: Track order lifecycle, handle disputes, analyze customer behavior.

**Example**: Order goes through multiple states — placed, paid, shipped, delivered. Events capture each transition.

**Events**: OrderPlaced, PaymentReceived, OrderShipped, OrderDelivered, OrderCancelled

### Healthcare Systems

**Why**: Patient history is critical. Need complete medical record with timestamps.

**Example**: Track all changes to patient records, prescriptions, test results.

**Events**: PatientAdmitted, DiagnosisRecorded, MedicationPrescribed, LabTestOrdered, LabResultsReceived

### Inventory Management

**Why**: Need to track stock movements, prevent overselling, handle returns.

**Example**: Track every item movement — received, sold, returned, transferred.

**Events**: StockReceived, ItemSold, ItemReturned, StockTransferred, InventoryAdjusted

### Gaming / Sports Betting

**Why**: Need to reconstruct game state, handle disputes, analyze player behavior.

**Example**: Every action in a game is an event. Can replay game from any point.

**Events**: GameStarted, PlayerMoved, ScoreUpdated, GameEnded

## Best Practices

### Safety

- **Immutable events**: Never modify or delete events (only append)
- **Event versioning**: Include version in events to handle schema evolution
- **Idempotent handlers**: Event handlers must be safe to run multiple times
- **Validate before storing**: Ensure events are valid before appending
- **Encrypt sensitive data**: PII in events should be encrypted

### Quality

- **Small events**: Keep events focused on single facts
- **Meaningful names**: Use past tense, business language (OrderPlaced, not OrderCreated)
- **Complete metadata**: Include correlation IDs, timestamps, user IDs
- **Schema registry**: Version and document event schemas
- **Test event handlers**: Ensure projections are updated correctly

### Logging

```python
# Event appended
logger.info('Event appended to store', {
    'event_id': event.id,
    'event_type': event.type,
    'aggregate_id': event.aggregate_id,
    'version': event.version,
    'correlation_id': event.correlation_id,
    'timestamp': event.timestamp
})

# Event replay
logger.info('Replaying events for aggregate', {
    'aggregate_id': aggregate_id,
    'event_count': len(events),
    'from_version': start_version,
    'to_version': end_version
})

# Projection updated
logger.info('Projection updated from event', {
    'projection_type': 'OrderSummary',
    'event_id': event.id,
    'aggregate_id': event.aggregate_id,
    'processing_time_ms': duration
})
```

## Common Pitfalls

### Storing Too Much in Events

**Problem**: Including entire objects or redundant data makes events large and hard to evolve.

**Solution**:
- Store only what changed (delta, not full state)
- Reference IDs instead of embedding objects
- Keep events focused on business facts

```python
# ❌ Bad: Too much data
{
  "eventType": "OrderPlaced",
  "order": { /* entire order object */ },
  "customer": { /* entire customer object */ },
  "products": [ /* all product details */ ]
}

# ✅ Good: Just the facts
{
  "eventType": "OrderPlaced",
  "orderId": "order-123",
  "customerId": "cust-456",
  "items": [
    { "productId": "prod-1", "quantity": 2, "price": 29.99 }
  ],
  "totalAmount": 59.98
}
```

### Not Using Snapshots

**Problem**: Replaying 100,000 events every time you load an aggregate is slow.

**Solution**:
- Create snapshots every N events (e.g., every 100 events)
- Load snapshot first, then replay events after snapshot
- Store snapshots alongside events

### Ignoring Event Versioning

**Problem**: Event schema changes break old events and projections.

**Solution**:
- Version events (e.g., OrderPlaced_v1, OrderPlaced_v2)
- Use upcasters to convert old events to new format during replay
- Never change existing event structures

### Modeling Events as CRUD Operations

**Problem**: Events like "UserUpdated" don't capture business intent.

**Solution**:
- Use business-meaningful events (UserEmailChanged, UserPromoted)
- Events should reflect domain language
- Multiple events better than one generic event

```python
# ❌ Bad: Generic CRUD
{ "eventType": "UserUpdated", "field": "email", "newValue": "new@email.com" }

# ✅ Good: Business intent
{ "eventType": "UserEmailChanged", "oldEmail": "old@email.com", "newEmail": "new@email.com" }
```

### Forgetting Correlation IDs

**Problem**: Can't trace related events across aggregates or services.

**Solution**:
- Include correlationId in all events
- Include causationId (ID of event/command that caused this event)
- Makes distributed tracing possible

### Synchronous Projections

**Problem**: Updating projections synchronously slows down writes.

**Solution**:
- Update projections asynchronously via event handlers
- Accept eventual consistency in read models
- Use optimistic UI updates

## Simple Example

### Domain Aggregate (Python)

```python
from dataclasses import dataclass
from typing import List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@dataclass
class Event:
    event_id: str
    event_type: str
    aggregate_id: str
    version: int
    timestamp: datetime
    data: dict

class Order:
    """
    Order aggregate using Event Sourcing.

    Why Event Sourcing:
    - Complete order history
    - Can reconstruct state at any point
    - Support disputes and refunds
    """

    def __init__(self, order_id: str):
        self.order_id = order_id
        self.version = 0
        self.status = None
        self.items = []
        self.total_amount = 0.0
        self.uncommitted_events = []

    @staticmethod
    def create(order_id: str, customer_id: str, items: List[dict]) -> 'Order':
        """Create a new order and generate OrderPlaced event"""
        order = Order(order_id)

        # Calculate total
        total = sum(item['quantity'] * item['price'] for item in items)

        # Generate event (don't modify state directly)
        event = Event(
            event_id=f"evt-{order_id}-1",
            event_type="OrderPlaced",
            aggregate_id=order_id,
            version=1,
            timestamp=datetime.now(),
            data={
                'orderId': order_id,
                'customerId': customer_id,
                'items': items,
                'totalAmount': total
            }
        )

        # Apply event to self
        order._apply_event(event)
        order.uncommitted_events.append(event)

        return order

    def ship(self, tracking_number: str):
        """Ship the order and generate OrderShipped event"""
        if self.status != 'PLACED':
            raise ValueError(f"Cannot ship order in status {self.status}")

        event = Event(
            event_id=f"evt-{self.order_id}-{self.version + 1}",
            event_type="OrderShipped",
            aggregate_id=self.order_id,
            version=self.version + 1,
            timestamp=datetime.now(),
            data={
                'orderId': self.order_id,
                'trackingNumber': tracking_number
            }
        )

        self._apply_event(event)
        self.uncommitted_events.append(event)

    def _apply_event(self, event: Event):
        """
        Apply event to update internal state.

        This is where state transitions happen.
        Same logic used for new events and replay.
        """
        if event.event_type == "OrderPlaced":
            self.status = "PLACED"
            self.items = event.data['items']
            self.total_amount = event.data['totalAmount']
            self.version = event.version

        elif event.event_type == "OrderShipped":
            self.status = "SHIPPED"
            self.version = event.version

        logger.debug(f"Applied {event.event_type} to {self.order_id}", extra={
            'aggregate_id': self.order_id,
            'version': self.version,
            'event_type': event.event_type
        })

    @staticmethod
    def from_events(order_id: str, events: List[Event]) -> 'Order':
        """
        Reconstruct order from event history.

        This is the core of Event Sourcing — rebuild state by replaying events.
        """
        order = Order(order_id)

        for event in events:
            order._apply_event(event)

        return order
```

### Event Store (Simplified)

```python
class EventStore:
    """
    Simple in-memory event store.

    In production, use:
    - EventStoreDB
    - Kafka
    - PostgreSQL with append-only table
    """

    def __init__(self):
        self.streams = {}  # aggregate_id -> list of events

    def append(self, aggregate_id: str, events: List[Event], expected_version: int):
        """
        Append events to a stream.

        Best Practices:
        - Check expected version for optimistic concurrency
        - Events are immutable once written
        - Each aggregate has its own stream
        """
        if aggregate_id not in self.streams:
            self.streams[aggregate_id] = []

        stream = self.streams[aggregate_id]

        # Optimistic concurrency check
        current_version = len(stream)
        if current_version != expected_version:
            raise ValueError(
                f"Concurrency conflict: expected version {expected_version}, "
                f"but stream is at version {current_version}"
            )

        # Append events
        stream.extend(events)

        logger.info(f"Appended {len(events)} events to stream", extra={
            'aggregate_id': aggregate_id,
            'event_count': len(events),
            'new_version': len(stream)
        })

    def get_events(self, aggregate_id: str, from_version: int = 0) -> List[Event]:
        """Get all events for an aggregate (optionally from a version)"""
        stream = self.streams.get(aggregate_id, [])
        return stream[from_version:]
```

### Repository (Loads/Saves Aggregates)

```python
class OrderRepository:
    """
    Repository that loads and saves Orders using Event Store.

    Why this pattern:
    - Encapsulates event store access
    - Provides aggregate-centric API
    - Handles snapshots (future enhancement)
    """

    def __init__(self, event_store: EventStore):
        self.event_store = event_store

    def get(self, order_id: str) -> Order:
        """Load order by replaying events"""
        events = self.event_store.get_events(order_id)

        if not events:
            raise ValueError(f"Order {order_id} not found")

        order = Order.from_events(order_id, events)

        logger.info(f"Loaded order from {len(events)} events", extra={
            'order_id': order_id,
            'version': order.version
        })

        return order

    def save(self, order: Order):
        """Save new events to event store"""
        if not order.uncommitted_events:
            return

        self.event_store.append(
            aggregate_id=order.order_id,
            events=order.uncommitted_events,
            expected_version=order.version - len(order.uncommitted_events)
        )

        logger.info(f"Saved {len(order.uncommitted_events)} events", extra={
            'order_id': order.order_id,
            'version': order.version
        })

        # Clear uncommitted events after saving
        order.uncommitted_events.clear()
```

### Usage Example

```python
# Create and save a new order
order = Order.create(
    order_id='order-123',
    customer_id='cust-456',
    items=[
        {'productId': 'prod-1', 'quantity': 2, 'price': 29.99},
        {'productId': 'prod-2', 'quantity': 1, 'price': 49.99}
    ]
)
repository.save(order)

# Later... load and update the order
order = repository.get('order-123')
order.ship(tracking_number='TRACK-789')
repository.save(order)

# Even later... load again (will replay all events)
order = repository.get('order-123')
print(order.status)  # "SHIPPED"
print(order.version)  # 2
```

## Integration with Other Patterns

### Event Sourcing + CQRS

A natural pairing. Event Sourcing handles the write side, projections handle the read side.

**Benefits**:
- Event store is the single source of truth
- Multiple read models from same events
- Clear separation of concerns

**See**: [CQRS guide](../cqrs/README.md)

### Event Sourcing + Domain-Driven Design

Events in Event Sourcing map directly to Domain Events in DDD. Aggregates produce events.

**See**: [Domain-Driven Design guide](../../03-methodologies/domain-driven-design/README.md)

### Event Sourcing + Microservices

Each microservice has its own event store. Services communicate via domain events.

**See**: [Microservices guide](../microservices/README.md)

## Technology Stack

### Event Stores

- **EventStoreDB**: Purpose-built for event sourcing, supports projections
- **Apache Kafka**: High-throughput event streaming platform
- **PostgreSQL**: Can be used with append-only tables (jsonb column)
- **MongoDB**: Document store, good for event storage
- **AWS DynamoDB**: NoSQL with streams, good for AWS environments
- **Azure Cosmos DB**: Multi-model database with change feed

### Frameworks

- **Axon Framework** (Java): CQRS and Event Sourcing framework
- **EventFlow** (.NET): CQRS and Event Sourcing for .NET
- **Commanded** (Elixir): CQRS/ES with Phoenix
- **Akka Persistence** (Scala/Java): Actor model + event sourcing
- **Lagom** (Scala/Java): Microservices framework with ES built-in
- **Rails Event Store** (Ruby): Event sourcing for Ruby on Rails

### Serialization

- **JSON**: Human-readable, widely supported
- **Avro**: Compact, includes schema
- **Protocol Buffers**: Fast, efficient
- **MessagePack**: Compact JSON alternative

## Snapshots

### Why Snapshots?

Replaying 10,000+ events is slow. Snapshots save the aggregate state at a point in time.

### How They Work

```python
class Snapshot:
    def __init__(self, aggregate_id: str, version: int, state: dict):
        self.aggregate_id = aggregate_id
        self.version = version
        self.state = state
        self.timestamp = datetime.now()

# Load with snapshot
def get_with_snapshot(self, order_id: str) -> Order:
    # Load latest snapshot
    snapshot = self.snapshot_store.get_latest(order_id)

    if snapshot:
        # Reconstruct from snapshot
        order = Order(order_id)
        order.__dict__.update(snapshot.state)

        # Replay only events after snapshot
        events = self.event_store.get_events(order_id, from_version=snapshot.version)
    else:
        # No snapshot, replay all events
        events = self.event_store.get_events(order_id)
        order = Order(order_id)

    for event in events:
        order._apply_event(event)

    return order
```

### Snapshot Strategy

- Snapshot every N events (e.g., every 100)
- Snapshot at midnight daily
- Snapshot on-demand for important aggregates
- Keep multiple snapshots for rollback

## Handling Schema Evolution

### Problem

Events are immutable, but business requirements change. How do you handle old events with old schemas?

### Solutions

#### 1. Upcasting (Recommended)

Convert old events to new format during replay.

```python
class EventUpcaster:
    def upcast(self, event: Event) -> Event:
        if event.event_type == "OrderPlaced_v1":
            # Convert v1 to v2 format
            new_data = {
                **event.data,
                'currency': 'USD'  # v2 added currency field
            }
            return Event(
                event_id=event.event_id,
                event_type="OrderPlaced_v2",
                aggregate_id=event.aggregate_id,
                version=event.version,
                timestamp=event.timestamp,
                data=new_data
            )
        return event
```

#### 2. Event Versioning

Store version in event, handle multiple versions in code.

```python
def _apply_event(self, event: Event):
    if event.event_type == "OrderPlaced_v1":
        self._apply_order_placed_v1(event)
    elif event.event_type == "OrderPlaced_v2":
        self._apply_order_placed_v2(event)
```

#### 3. Weak Schema

Use flexible formats (JSON) and make fields optional. Handle missing fields gracefully.

## Temporal Queries

One of Event Sourcing's superpowers — query state at any point in time.

```python
def get_at_timestamp(self, aggregate_id: str, timestamp: datetime) -> Order:
    """Reconstruct aggregate as it was at a specific time"""
    all_events = self.event_store.get_events(aggregate_id)

    # Filter events up to the timestamp
    events_until = [e for e in all_events if e.timestamp <= timestamp]

    # Replay filtered events
    order = Order.from_events(aggregate_id, events_until)

    logger.info(f"Reconstructed order at {timestamp}", extra={
        'aggregate_id': aggregate_id,
        'version': order.version,
        'timestamp': timestamp
    })

    return order
```

## Monitoring and Observability

### Key Metrics

```javascript
// Event append metrics
metrics.increment('events.appended', {
  event_type: 'OrderPlaced',
  aggregate_type: 'Order'
});

// Replay performance
metrics.timing('aggregate.replay_duration', duration_ms, {
  aggregate_id: 'order-123',
  event_count: 150
});

// Stream length
metrics.gauge('stream.length', event_count, {
  aggregate_id: 'order-123'
});

// Projection lag
metrics.gauge('projection.lag', lag_seconds, {
  projection_type: 'OrderSummary'
});
```

### Health Checks

- Event store availability
- Write latency
- Replay performance
- Projection synchronization lag
- Storage growth rate

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Best for** | Audit-heavy systems, financial applications, complex domains with state transitions, systems needing time travel |
| **Avoid when** | Simple CRUD apps, systems with no audit requirements, low data volume, when immediate consistency across reads is critical |
| **Key benefit** | Complete audit trail, time travel, multiple projections, never lose data |
| **Key challenge** | Complexity, eventual consistency, storage growth, schema evolution |
| **Storage growth** | Events accumulate forever (mitigate with snapshots, archiving) |
| **Typical use cases** | Banking, healthcare, e-commerce orders, inventory, gaming |
| **Event store options** | EventStoreDB, Kafka, PostgreSQL, MongoDB, DynamoDB |

## Testing Strategies

### Test Event Application

```python
def test_order_placed_event():
    """Test that OrderPlaced event updates state correctly"""
    order = Order('order-123')

    event = Event(
        event_id='evt-1',
        event_type='OrderPlaced',
        aggregate_id='order-123',
        version=1,
        timestamp=datetime.now(),
        data={
            'orderId': 'order-123',
            'customerId': 'cust-1',
            'items': [{'productId': 'p1', 'quantity': 2, 'price': 10.0}],
            'totalAmount': 20.0
        }
    )

    order._apply_event(event)

    assert order.status == 'PLACED'
    assert order.total_amount == 20.0
    assert order.version == 1
```

### Test Event Replay

```python
def test_order_reconstructed_from_events():
    """Test that order can be rebuilt from events"""
    events = [
        Event(..., event_type='OrderPlaced', ...),
        Event(..., event_type='OrderShipped', ...)
    ]

    order = Order.from_events('order-123', events)

    assert order.status == 'SHIPPED'
    assert order.version == 2
```

### Test Concurrency

```python
def test_concurrent_writes_fail():
    """Test optimistic concurrency control"""
    # Two processes load same version
    order1 = repository.get('order-123')
    order2 = repository.get('order-123')

    # First one saves successfully
    order1.ship('TRACK-1')
    repository.save(order1)

    # Second one should fail (version conflict)
    order2.ship('TRACK-2')
    with pytest.raises(ValueError, match='Concurrency conflict'):
        repository.save(order2)
```

## Related Topics

- [CQRS](../cqrs/README.md) - Often used together with Event Sourcing
- [Event-Driven Architecture](../event-driven/README.md) - Foundation for Event Sourcing
- [Domain-Driven Design](../../03-methodologies/domain-driven-design/README.md) - Aggregates and domain events
- [Saga Pattern](../saga-pattern/README.md) - Distributed transactions with events
- [Microservices](../microservices/README.md) - Event Sourcing in distributed systems

## Further Reading

- Martin Fowler's Event Sourcing article: https://martinfowler.com/eaaDev/EventSourcing.html
- Greg Young's Event Sourcing resources: https://goodenoughsoftware.net/
- EventStoreDB documentation: https://www.eventstore.com/
- Microsoft Event Sourcing guide: https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing

---

**Last Updated**: 2026-02-19
