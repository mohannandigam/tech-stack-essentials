# Saga Pattern

## What is it?

The Saga Pattern is a way to manage distributed transactions across multiple services without using traditional two-phase commit. Instead of locking resources across services, a saga breaks a transaction into a series of local transactions. Each step completes independently, and if any step fails, compensating transactions undo the previous steps to maintain consistency.

## Simple Analogy

Think of booking a vacation package. You need to reserve a flight, hotel, and rental car — three separate companies. Without sagas, you'd have to hold reservations at all three while payment processes (two-phase commit) — but they won't wait. The Saga Pattern works like this: book the flight → book the hotel → book the car. If the car rental fails, you cancel the hotel booking, then cancel the flight booking. Each step happens independently, and you have a plan to undo previous steps if needed.

## Why does it matter?

### Business Impact

- **Reliability**: Handle partial failures in distributed systems
- **Better UX**: Don't make users wait for slow services
- **Avoid lost revenue**: Process as much as possible, compensate failures
- **Reduce locking**: Services don't need to lock resources waiting for others

### Technical Benefits

- No distributed locks or two-phase commit (which don't scale)
- Services remain loosely coupled
- Each service manages its own transactions
- System can continue processing even if one service is slow
- Clear pattern for handling failures in microservices

## How it works

### Traditional Distributed Transaction (Two-Phase Commit)

```
Coordinator: "Everyone prepare to commit"
Service A: "Ready" (locks resources)
Service B: "Ready" (locks resources)
Service C: "Failed"
Coordinator: "Everyone rollback"

Problems:
- Services must wait (blocking)
- Holding locks reduces throughput
- If coordinator fails, locks held indefinitely
```

### Saga Pattern Approach

```
Step 1: Service A commits → success
Step 2: Service B commits → success
Step 3: Service C commits → failure

Compensate:
Step 2 Undo: Service B compensates
Step 1 Undo: Service A compensates

Result: All rolled back, no locks held
```

## Key Concepts

### Local Transaction

Each service executes its own local transaction with ACID properties. The transaction is committed immediately.

### Compensating Transaction

A transaction that semantically undoes the effect of a previous transaction. Not always a perfect rollback — may be approximate.

**Example**:
- Original: Reserve seat on flight
- Compensate: Cancel reservation (but might charge cancellation fee)

### Saga Execution Coordinator

The component responsible for sequencing saga steps and handling failures. Can be centralized (orchestration) or distributed (choreography).

### Forward Recovery

Continue with alternative steps when a failure occurs (e.g., try a different payment processor).

### Backward Recovery

Undo completed steps through compensating transactions to restore the system to a consistent state.

## Saga Types

### 1. Choreography (Event-Driven)

Services publish events, and other services react. No central coordinator.

```
Order Service: OrderCreated event →
  ↓
Payment Service: listens → ProcessPayment → PaymentCompleted event →
  ↓
Inventory Service: listens → ReserveItems → ItemsReserved event →
  ↓
Shipping Service: listens → ScheduleShipment
```

**Pros**:
- Simple to implement for linear sagas
- No single point of failure
- Services loosely coupled

**Cons**:
- Hard to understand flow (logic is distributed)
- Difficult to monitor and debug
- Complex for sagas with many steps or conditions

### 2. Orchestration (Command-Driven)

A central orchestrator tells services what to do.

```
Saga Orchestrator
  ↓ CreateOrder command
Order Service → OrderCreated
  ↓ ProcessPayment command
Payment Service → PaymentCompleted
  ↓ ReserveItems command
Inventory Service → ItemsReserved
  ↓ ScheduleShipment command
Shipping Service → ShipmentScheduled
```

**Pros**:
- Easy to understand (logic in one place)
- Easy to monitor and debug
- Better for complex workflows with conditionals

**Cons**:
- Orchestrator is a single point of failure (mitigate with HA)
- Services more coupled to orchestrator
- Orchestrator can become complex

### Visual Representation

```
┌──────────────────────────────────────────────────────────┐
│                 Saga Pattern (Orchestration)              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  User Request                                             │
│      ↓                                                    │
│  ┌─────────────────┐                                     │
│  │ Saga Orchestrator│                                     │
│  └─────────┬────────┘                                     │
│            │                                              │
│    ┌───────┼───────┬───────────┬──────────┐            │
│    │       │       │           │          │            │
│    ▼       ▼       ▼           ▼          ▼            │
│  ┌────┐ ┌────┐ ┌────┐     ┌────┐    ┌────┐           │
│  │Srv │ │Srv │ │Srv │     │Srv │    │Srv │           │
│  │ A  │ │ B  │ │ C  │ ... │ N-1│    │ N  │           │
│  └─┬──┘ └─┬──┘ └─┬──┘     └─┬──┘    └─┬──┘           │
│    │      │      │           │         │              │
│    │      │      │ FAILURE   │         │              │
│    │      │      ✗           │         │              │
│    │      │                  │         │              │
│    ▼      ▼                  ▼         ▼              │
│  Compensate (undo in reverse order)                    │
│    ▲      ▲                                            │
│    │      │                                            │
│  ┌────┐ ┌────┐                                        │
│  │Undo│ │Undo│                                        │
│  │ B  │ │ A  │                                        │
│  └────┘ └────┘                                        │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

## Use Cases

### E-Commerce Order Processing

**Saga Steps**:
1. Create order
2. Process payment
3. Reserve inventory
4. Schedule shipping
5. Send confirmation

**Compensation**:
- Shipping fails → Unreserve inventory → Refund payment → Cancel order

**Why Saga**: Each service (payment, inventory, shipping) is independent and may be slow or fail

### Travel Booking

**Saga Steps**:
1. Reserve flight
2. Reserve hotel
3. Reserve rental car
4. Process payment

**Compensation**:
- Payment fails → Cancel car → Cancel hotel → Cancel flight

**Why Saga**: Three separate external systems, can't use distributed transaction

### Banking Funds Transfer

**Saga Steps**:
1. Debit account A
2. Credit account B
3. Update ledger
4. Send notifications

**Compensation**:
- Ledger update fails → Debit account B → Credit account A

**Why Saga**: Multiple banking services, need eventual consistency

### Insurance Claim Processing

**Saga Steps**:
1. Validate claim
2. Assess damage
3. Approve payout
4. Schedule payment
5. Update claim status

**Compensation**:
- Payment scheduling fails → Revoke approval → Mark claim pending

**Why Saga**: Multiple departments/services involved, long-running process

### Restaurant Order (Food Delivery)

**Saga Steps**:
1. Create order
2. Check restaurant availability
3. Charge customer
4. Notify restaurant
5. Assign driver

**Compensation**:
- No drivers available → Notify restaurant cancellation → Refund customer → Cancel order

**Why Saga**: Multiple services (payment, restaurant, driver assignment), need to handle failures gracefully

## Best Practices

### Safety

- **Idempotent operations**: Services must handle duplicate messages
- **Compensating transactions must be idempotent**: Safe to retry compensation
- **Timeout handling**: Set timeouts for each step
- **Dead letter queues**: Capture failed messages for manual review
- **Saga state persistence**: Store saga state to recover from failures

### Quality

- **Test failure scenarios**: Test each compensation path
- **Monitor saga progress**: Track which step each saga is on
- **Use correlation IDs**: Track requests across services
- **Set reasonable timeouts**: Don't wait forever for slow services
- **Circuit breakers**: Fail fast if a service is down

### Logging

```python
# Saga started
logger.info('Saga started', {
    'saga_id': saga.id,
    'saga_type': 'OrderProcessing',
    'correlation_id': saga.correlation_id,
    'timestamp': datetime.now()
})

# Step completed
logger.info('Saga step completed', {
    'saga_id': saga.id,
    'step': 'ProcessPayment',
    'step_number': 2,
    'status': 'SUCCESS',
    'duration_ms': duration
})

# Compensation triggered
logger.warning('Saga compensation started', {
    'saga_id': saga.id,
    'failed_step': 'ReserveInventory',
    'compensating_steps': ['RefundPayment', 'CancelOrder']
})

# Saga completed
logger.info('Saga completed', {
    'saga_id': saga.id,
    'status': 'COMPENSATED',  # or 'COMPLETED'
    'total_duration_ms': total_duration,
    'steps_executed': 3,
    'steps_compensated': 2
})
```

## Common Pitfalls

### Not Making Operations Idempotent

**Problem**: Retrying a failed step causes duplicate charges, double reservations, etc.

**Solution**:
- Use unique operation IDs
- Check if operation already completed before executing
- Design compensations to be retryable

```python
# ❌ Bad: Not idempotent
def charge_customer(customer_id, amount):
    balance -= amount  # Retry will double-charge!

# ✅ Good: Idempotent
def charge_customer(customer_id, amount, transaction_id):
    if transaction_exists(transaction_id):
        return  # Already processed
    balance -= amount
    save_transaction(transaction_id)
```

### Incomplete Compensations

**Problem**: Compensation doesn't fully undo the original transaction.

**Solution**:
- Document compensation logic clearly
- Test compensation paths thoroughly
- Accept that some compensations are "semantic" (e.g., refund with fee)
- Log compensation actions for audit trail

### Not Handling Compensation Failures

**Problem**: What if a compensating transaction fails?

**Solution**:
- Retry with exponential backoff
- Use dead letter queue for manual intervention
- Implement eventual consistency (try again later)
- Monitor failed compensations closely

```python
def compensate_with_retry(compensation_fn, max_retries=3):
    for attempt in range(max_retries):
        try:
            compensation_fn()
            return
        except Exception as e:
            logger.error(f'Compensation failed, attempt {attempt + 1}', {
                'error': str(e)
            })
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                # Send to dead letter queue
                dead_letter_queue.add(compensation_fn)
```

### Long-Running Sagas Without Timeouts

**Problem**: Saga waits indefinitely for a slow service.

**Solution**:
- Set timeouts for each step
- Implement overall saga timeout
- Trigger compensation if timeout exceeded

### Not Versioning Saga Definitions

**Problem**: Changing saga steps breaks in-flight sagas.

**Solution**:
- Version saga definitions
- Support multiple versions simultaneously
- Migrate old sagas gracefully

### Ignoring Ordering Constraints

**Problem**: Steps execute out of order, causing inconsistencies.

**Solution**:
- Use orchestration for complex workflows
- Ensure event ordering in choreography
- Use sequence numbers in events

## Simple Example

### Orchestration Example (Python)

```python
from dataclasses import dataclass
from enum import Enum
from typing import List, Callable
import logging

logger = logging.getLogger(__name__)

class SagaStatus(Enum):
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"
    COMPENSATING = "COMPENSATING"
    COMPENSATED = "COMPENSATED"
    FAILED = "FAILED"

@dataclass
class SagaStep:
    name: str
    action: Callable
    compensation: Callable

class SagaOrchestrator:
    """
    Orchestrates a saga by executing steps sequentially.
    If a step fails, compensates previous steps in reverse order.

    Why Orchestration:
    - Clear workflow logic
    - Easy to understand and debug
    - Centralized monitoring
    """

    def __init__(self, saga_id: str, steps: List[SagaStep]):
        self.saga_id = saga_id
        self.steps = steps
        self.completed_steps = []
        self.status = SagaStatus.STARTED

    def execute(self):
        """Execute saga steps, compensate on failure"""
        logger.info('Starting saga', {
            'saga_id': self.saga_id,
            'step_count': len(self.steps)
        })

        try:
            # Execute forward steps
            for step in self.steps:
                logger.info(f'Executing step: {step.name}', {
                    'saga_id': self.saga_id,
                    'step': step.name
                })

                # Execute the step
                step.action()

                # Track completed step for potential compensation
                self.completed_steps.append(step)

                logger.info(f'Step completed: {step.name}', {
                    'saga_id': self.saga_id,
                    'step': step.name
                })

            # All steps succeeded
            self.status = SagaStatus.COMPLETED
            logger.info('Saga completed successfully', {
                'saga_id': self.saga_id
            })

        except Exception as e:
            # A step failed, trigger compensation
            logger.error(f'Saga failed: {str(e)}', {
                'saga_id': self.saga_id,
                'error': str(e)
            })

            self._compensate()

    def _compensate(self):
        """Compensate completed steps in reverse order"""
        self.status = SagaStatus.COMPENSATING

        logger.warning('Starting compensation', {
            'saga_id': self.saga_id,
            'steps_to_compensate': len(self.completed_steps)
        })

        # Compensate in reverse order
        for step in reversed(self.completed_steps):
            try:
                logger.info(f'Compensating step: {step.name}', {
                    'saga_id': self.saga_id,
                    'step': step.name
                })

                step.compensation()

                logger.info(f'Compensation completed: {step.name}', {
                    'saga_id': self.saga_id,
                    'step': step.name
                })

            except Exception as e:
                logger.error(f'Compensation failed for {step.name}: {str(e)}', {
                    'saga_id': self.saga_id,
                    'step': step.name,
                    'error': str(e)
                })
                # Continue compensating other steps
                # In production, send to dead letter queue

        self.status = SagaStatus.COMPENSATED
        logger.info('Compensation completed', {
            'saga_id': self.saga_id
        })
```

### Order Processing Saga Example

```python
class OrderProcessingSaga:
    """
    Saga for processing an e-commerce order.

    Steps:
    1. Create order
    2. Process payment
    3. Reserve inventory
    4. Schedule shipping
    """

    def __init__(self, order_service, payment_service, inventory_service, shipping_service):
        self.order_service = order_service
        self.payment_service = payment_service
        self.inventory_service = inventory_service
        self.shipping_service = shipping_service
        self.order_id = None
        self.payment_id = None
        self.reservation_id = None

    def execute_saga(self, customer_id: str, items: List[dict]):
        """Execute the order processing saga"""

        # Define saga steps with actions and compensations
        steps = [
            SagaStep(
                name="CreateOrder",
                action=lambda: self._create_order(customer_id, items),
                compensation=lambda: self._cancel_order()
            ),
            SagaStep(
                name="ProcessPayment",
                action=lambda: self._process_payment(),
                compensation=lambda: self._refund_payment()
            ),
            SagaStep(
                name="ReserveInventory",
                action=lambda: self._reserve_inventory(),
                compensation=lambda: self._unreserve_inventory()
            ),
            SagaStep(
                name="ScheduleShipping",
                action=lambda: self._schedule_shipping(),
                compensation=lambda: self._cancel_shipping()
            )
        ]

        # Execute saga
        orchestrator = SagaOrchestrator(
            saga_id=f"order-saga-{customer_id}",
            steps=steps
        )
        orchestrator.execute()

        return orchestrator.status == SagaStatus.COMPLETED

    # Step implementations
    def _create_order(self, customer_id, items):
        """Create order in order service"""
        self.order_id = self.order_service.create({
            'customer_id': customer_id,
            'items': items,
            'status': 'PENDING'
        })
        logger.info(f'Order created: {self.order_id}')

    def _cancel_order(self):
        """Compensate: Cancel order"""
        if self.order_id:
            self.order_service.update(self.order_id, {'status': 'CANCELLED'})
            logger.info(f'Order cancelled: {self.order_id}')

    def _process_payment(self):
        """Process payment"""
        order = self.order_service.get(self.order_id)
        self.payment_id = self.payment_service.charge({
            'order_id': self.order_id,
            'amount': order['total_amount']
        })
        logger.info(f'Payment processed: {self.payment_id}')

    def _refund_payment(self):
        """Compensate: Refund payment"""
        if self.payment_id:
            self.payment_service.refund(self.payment_id)
            logger.info(f'Payment refunded: {self.payment_id}')

    def _reserve_inventory(self):
        """Reserve inventory"""
        order = self.order_service.get(self.order_id)
        self.reservation_id = self.inventory_service.reserve({
            'order_id': self.order_id,
            'items': order['items']
        })
        logger.info(f'Inventory reserved: {self.reservation_id}')

    def _unreserve_inventory(self):
        """Compensate: Release inventory"""
        if self.reservation_id:
            self.inventory_service.release(self.reservation_id)
            logger.info(f'Inventory released: {self.reservation_id}')

    def _schedule_shipping(self):
        """Schedule shipping"""
        order = self.order_service.get(self.order_id)
        shipping_id = self.shipping_service.schedule({
            'order_id': self.order_id,
            'address': order['shipping_address']
        })
        logger.info(f'Shipping scheduled: {shipping_id}')

    def _cancel_shipping(self):
        """Compensate: Cancel shipping (if scheduled)"""
        # Shipping is last step, usually won't need compensation
        logger.info('Shipping compensation (no-op)')
```

### Usage

```python
# Create saga
saga = OrderProcessingSaga(
    order_service=OrderService(),
    payment_service=PaymentService(),
    inventory_service=InventoryService(),
    shipping_service=ShippingService()
)

# Execute
success = saga.execute_saga(
    customer_id='cust-123',
    items=[
        {'product_id': 'prod-1', 'quantity': 2, 'price': 29.99}
    ]
)

if success:
    print("Order processed successfully")
else:
    print("Order failed, compensations applied")
```

## Choreography vs Orchestration

| Aspect | Choreography | Orchestration |
|--------|--------------|---------------|
| **Coordination** | Distributed (via events) | Centralized (orchestrator) |
| **Coupling** | Loose | Tighter (to orchestrator) |
| **Complexity** | Hard to understand flow | Easy to understand flow |
| **Best for** | Simple, linear sagas | Complex workflows with conditions |
| **Failure handling** | Distributed logic | Centralized logic |
| **Monitoring** | Harder | Easier |
| **Single point of failure** | No | Yes (mitigate with HA) |

## Integration with Other Patterns

### Saga + CQRS

Sagas issue commands and listen for events. CQRS separates write operations (commands) from reads.

**See**: [CQRS guide](../cqrs/README.md)

### Saga + Event Sourcing

Saga state can be stored as events. Saga steps produce events that update the event store.

**See**: [Event Sourcing guide](../event-sourcing/README.md)

### Saga + Microservices

Each microservice participates in sagas. Services remain independent while coordinating complex workflows.

**See**: [Microservices guide](../microservices/README.md)

## Technology Stack

### Message Brokers

- **RabbitMQ**: Good for orchestration and choreography
- **Apache Kafka**: Event streaming, good for choreography
- **AWS SQS/SNS**: Managed queues, good for AWS
- **Azure Service Bus**: Managed messaging for Azure

### Orchestration Frameworks

- **Camunda**: BPMN-based workflow engine (Java)
- **Temporal**: Workflow orchestration platform
- **Netflix Conductor**: Microservices orchestration
- **Apache Airflow**: DAG-based orchestration (originally for data pipelines)
- **Uber Cadence**: Workflow engine

### State Management

- **PostgreSQL**: Store saga state in a database
- **Redis**: Fast state storage
- **DynamoDB**: NoSQL state storage

## Monitoring and Observability

### Key Metrics

```javascript
// Saga execution metrics
metrics.increment('saga.started', {
  saga_type: 'OrderProcessing'
});

metrics.increment('saga.completed', {
  saga_type: 'OrderProcessing',
  status: 'SUCCESS'  // or 'COMPENSATED'
});

// Step duration
metrics.timing('saga.step.duration', duration_ms, {
  saga_type: 'OrderProcessing',
  step: 'ProcessPayment'
});

// Compensation metrics
metrics.increment('saga.compensated', {
  saga_type: 'OrderProcessing',
  failed_step: 'ReserveInventory'
});
```

### Dashboards

- Sagas in progress
- Success rate by saga type
- Average saga duration
- Compensation rate
- Failed step breakdown
- Saga state distribution

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Best for** | Distributed transactions across microservices, long-running workflows, systems that can't use 2PC |
| **Avoid when** | Single service (use local transactions), system needs strong consistency (use 2PC if possible) |
| **Key benefit** | Maintain consistency without distributed locks, handle failures gracefully |
| **Key challenge** | Complexity, eventual consistency, compensating transaction design |
| **Orchestration** | Use for complex workflows, conditionals, easier debugging |
| **Choreography** | Use for simple linear flows, loose coupling |
| **Common use cases** | E-commerce orders, travel booking, payment processing, multi-step approvals |

## Testing Strategies

### Test Happy Path

```python
def test_saga_happy_path():
    """Test saga completes all steps successfully"""
    saga = OrderProcessingSaga(...)

    success = saga.execute_saga(
        customer_id='cust-1',
        items=[{'product_id': 'p1', 'quantity': 1, 'price': 10.0}]
    )

    assert success is True
    assert saga.order_id is not None
    assert saga.payment_id is not None
```

### Test Compensation

```python
def test_saga_compensates_on_failure(mock_inventory_service):
    """Test saga compensates when a step fails"""
    # Make inventory reservation fail
    mock_inventory_service.reserve.side_effect = Exception("Out of stock")

    saga = OrderProcessingSaga(
        order_service=OrderService(),
        payment_service=PaymentService(),
        inventory_service=mock_inventory_service,
        shipping_service=ShippingService()
    )

    success = saga.execute_saga(...)

    assert success is False
    # Verify compensation happened
    assert payment_service.refund.called
    assert order_service.cancel.called
```

### Test Idempotency

```python
def test_step_idempotency():
    """Test that steps can be safely retried"""
    saga = OrderProcessingSaga(...)

    # Execute step twice with same inputs
    saga._create_order('cust-1', items)
    order_id_1 = saga.order_id

    saga._create_order('cust-1', items)
    order_id_2 = saga.order_id

    # Should return same order, not create duplicate
    assert order_id_1 == order_id_2
```

## Related Topics

- [CQRS](../cqrs/README.md) - Commands and events in sagas
- [Event Sourcing](../event-sourcing/README.md) - Store saga state as events
- [Event-Driven Architecture](../event-driven/README.md) - Foundation for choreography
- [Microservices](../microservices/README.md) - Distributed transactions in microservices
- [Domain-Driven Design](../../03-methodologies/domain-driven-design/README.md) - Saga design in bounded contexts

## Further Reading

- Martin Fowler on Sagas: https://martinfowler.com/articles/patterns-of-distributed-systems/saga.html
- Chris Richardson's Saga Pattern: https://microservices.io/patterns/data/saga.html
- Microsoft Saga Pattern Guide: https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga

---

**Last Updated**: 2026-02-19
