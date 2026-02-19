# Domain-Driven Design (DDD)

## What is it?

Domain-Driven Design is an approach to building software where the structure and language of your code match the real-world business domain it represents. Instead of organizing your application around technical concerns (databases, APIs, UI), you organize it around business concepts and rules. The goal is to create software that business experts can understand and that accurately models how the business actually works.

Think of it as building software by first deeply understanding the business problem you're solving, speaking the same language as domain experts (salespeople, doctors, bankers), and structuring your code to reflect their mental models. When business people say "order" or "patient" or "policy," your code has those same concepts with the same meanings and rules.

## Simple Analogy

Imagine you're building a house. A traditional approach might be: "Let's start with the foundation (database), then add walls (API layer), then the roof (UI)." Domain-Driven Design is more like: "Let's first understand how people actually live in this house. The kitchen needs to be near the dining room. The bedroom needs privacy. The living room is for gathering." You design based on how the house will be used, not just its construction materials.

Another way to think about it: if you're building software for a hospital, you don't start with "we need tables and APIs." You start with "we have patients, doctors, appointments, and medical records" and model those concepts the way doctors and nurses think about them.

## Why does it matter?

### Business Alignment

When your code structure matches business concepts, several powerful things happen:

1. **Shared understanding**: Developers and business experts can have meaningful conversations using the same vocabulary. When a doctor says "a patient's medical history," everyone knows what that means.

2. **Faster changes**: Business rules live in one clear place. When regulations change or business processes evolve, you know exactly where to update the code.

3. **Reduced bugs**: When your code models reality accurately, there's less translation error. The business rule "a prescription requires a licensed doctor" becomes code that's equally clear.

4. **Knowledge retention**: New developers can understand the system by talking to domain experts. The domain knowledge isn't locked in one person's head.

### Technical Benefits

1. **Maintainability**: Clear boundaries between different parts of the business mean changes in one area don't ripple everywhere.

2. **Testability**: Business rules are isolated and can be tested independently of databases or UI.

3. **Scalability**: Different business domains can be scaled independently or even split into separate services.

4. **Quality**: When the domain model is explicit, you can validate it against real business scenarios.

## How it works

Domain-Driven Design works in two complementary layers: Strategic DDD (how to organize large systems) and Tactical DDD (how to write the code).

### Strategic DDD: The Big Picture

Strategic DDD helps you understand and organize complex business domains.

#### Step 1: Understand the Domain

You start by learning the business deeply:

```
Example: E-commerce company
┌────────────────────────────────────────────────────────────┐
│                                                              │
│  Domain Expert: "When a customer places an order..."       │
│  Developer: "What makes an order valid?"                   │
│  Domain Expert: "Items must be in stock, payment must      │
│                  be approved, shipping address verified"    │
│                                                              │
│  This conversation uncovers BUSINESS RULES                 │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

#### Step 2: Identify Bounded Contexts

A bounded context is a boundary where a specific business model applies. The word "customer" might mean different things in different parts of your company:

```
E-commerce Bounded Contexts:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   SALES         │  │   SHIPPING      │  │   SUPPORT       │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ Customer:       │  │ Customer:       │  │ Customer:       │
│  - Cart         │  │  - Address      │  │  - Tickets      │
│  - Wishlist     │  │  - Delivery     │  │  - History      │
│  - Orders       │  │  - Tracking     │  │  - Contact      │
│                 │  │                 │  │                 │
│ "Customer" =    │  │ "Customer" =    │  │ "Customer" =    │
│ Buyer           │  │ Recipient       │  │ User needing    │
│                 │  │                 │  │ help            │
└─────────────────┘  └─────────────────┘  └─────────────────┘

Same word, different meanings in each context!
```

#### Step 3: Define Ubiquitous Language

Create a shared vocabulary that everyone uses - developers, domain experts, documentation, and code:

```
Bad: Technical language
┌────────────────────────────────────┐
│ Developer: "The user entity has a  │
│ foreign key to the transaction     │
│ table with status enum"            │
│                                     │
│ Business Expert: "What??"          │
└────────────────────────────────────┘

Good: Ubiquitous language
┌────────────────────────────────────┐
│ Both: "A customer places an order. │
│ The order status can be pending,   │
│ confirmed, or cancelled."          │
│                                     │
│ Code uses same words!              │
└────────────────────────────────────┘
```

#### Step 4: Map Context Relationships

Different bounded contexts need to interact. Context mapping defines how:

```
Context Mapping Patterns:

1. Partnership (mutual dependency)
   [Sales] ←──────→ [Inventory]
   Both teams coordinate releases

2. Customer/Supplier (upstream/downstream)
   [Warehouse] ─────→ [Shipping]
   Warehouse defines contract, Shipping consumes

3. Conformist (downstream accepts upstream)
   [Our Store] ─────→ [Payment Processor]
   We use their model as-is

4. Anti-Corruption Layer (translate external models)
   [Our System] ─[ACL]─→ [Legacy System]
   ACL translates their old model to our new model
```

### Tactical DDD: The Code Level

Tactical DDD provides patterns for implementing your domain model.

#### Building Blocks

```
Layered Architecture:
┌───────────────────────────────────────┐
│         User Interface Layer          │ ← Presentation (Web, Mobile, API)
├───────────────────────────────────────┤
│        Application Layer              │ ← Orchestrates use cases
├───────────────────────────────────────┤
│          Domain Layer                 │ ← Business logic lives here!
│  ┌─────────────────────────────────┐ │
│  │ Entities, Value Objects,        │ │
│  │ Aggregates, Domain Services     │ │
│  └─────────────────────────────────┘ │
├───────────────────────────────────────┤
│       Infrastructure Layer            │ ← Technical stuff (DB, APIs)
└───────────────────────────────────────┘
```

**Domain Layer**: This is the heart of your application. It contains:

1. **Entities**: Objects with unique identity that changes over time
2. **Value Objects**: Objects defined by their attributes, not identity
3. **Aggregates**: Clusters of related entities treated as a unit
4. **Domain Events**: Things that happened that domain experts care about
5. **Repositories**: Interfaces for retrieving and storing aggregates
6. **Domain Services**: Operations that don't belong to a single entity

**Application Layer**: Coordinates workflows using the domain layer. It doesn't contain business logic, just orchestrates it.

**Infrastructure Layer**: Technical implementations - database, external APIs, message queues, etc.

## Key Concepts

### Entities

**What**: Objects with a unique identity that persists over time. Two entities with the same data but different IDs are different objects.

**Example**: A Customer with ID 12345 is the same customer whether their name is "John Smith" or they change it to "John Doe."

```python
class Customer:
    """
    An Entity - has unique identity (ID).

    Why Entity:
    - The same customer exists over time despite attribute changes
    - Identity matters: Customer #123 ≠ Customer #456 even if names match
    - Has lifecycle: created, modified, potentially deleted
    """

    def __init__(self, customer_id, name, email):
        # Identity - never changes
        self._id = customer_id

        # Attributes - can change
        self._name = name
        self._email = email
        self._created_at = datetime.utcnow()

    @property
    def id(self):
        """Identity is immutable"""
        return self._id

    def change_email(self, new_email):
        """
        Business operation that validates rules.

        Best Practice:
        - Named after business operation (not setEmail)
        - Validates business rules
        - Logs important changes
        """
        if not self._is_valid_email(new_email):
            logger.warning(f"Invalid email change attempt for customer {self._id}")
            raise ValueError("Email format invalid")

        old_email = self._email
        self._email = new_email
        logger.info(f"Customer {self._id} email changed from {old_email} to {new_email}")

    def _is_valid_email(self, email):
        """Business rule: email format validation"""
        return "@" in email and "." in email.split("@")[1]

    def __eq__(self, other):
        """Entities are equal if IDs match"""
        if not isinstance(other, Customer):
            return False
        return self._id == other._id

    def __hash__(self):
        """Hash based on identity"""
        return hash(self._id)
```

### Value Objects

**What**: Objects defined entirely by their attributes. Two value objects with the same data are considered identical and interchangeable.

**Example**: An Address with "123 Main St" is the same regardless of which customer has it. If anything changes, it's a new address.

```python
from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class Money:
    """
    A Value Object - no identity, compared by value.

    Why Value Object:
    - $50 USD is $50 USD, doesn't matter which $50
    - No lifecycle - you don't "change" $50, you create new amount
    - Immutable - frozen=True
    - Domain concept, not a primitive

    Best Practice:
    - Use dataclass with frozen=True for immutability
    - Put business logic in value objects
    - Make them self-validating
    """

    amount: float
    currency: str

    def __post_init__(self):
        """
        Validate on creation - value objects are always valid.

        Why validate here:
        - Impossible to create invalid Money
        - Validation happens once at creation
        - Rest of code can trust Money objects
        """
        if self.amount < 0:
            raise ValueError("Money amount cannot be negative")
        if not self.currency or len(self.currency) != 3:
            raise ValueError("Currency must be 3-letter code (USD, EUR, etc.)")

    def add(self, other):
        """
        Business operation: adding money.

        Why return new object:
        - Immutability maintained
        - Original values unchanged
        - Thread-safe
        """
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} and {other.currency}")
        return Money(self.amount + other.amount, self.currency)

    def multiply(self, factor: float):
        """Business operation: calculate total"""
        return Money(self.amount * factor, self.currency)

    def __str__(self):
        """Human-readable format"""
        return f"{self.currency} {self.amount:.2f}"


@dataclass(frozen=True)
class Address:
    """
    Another Value Object example.

    Why Value Object:
    - An address is defined by its components
    - No need to track "which" 123 Main St
    - Immutable - if address changes, create new one
    """

    street: str
    city: str
    state: str
    postal_code: str
    country: str

    def __post_init__(self):
        """Self-validating"""
        if not self.street or not self.city:
            raise ValueError("Street and city are required")
        if len(self.postal_code) < 5:
            raise ValueError("Invalid postal code")

    def format_single_line(self):
        """Business operation: format for shipping label"""
        return f"{self.street}, {self.city}, {self.state} {self.postal_code}, {self.country}"
```

### Aggregates

**What**: A cluster of entities and value objects treated as a single unit for data changes. One entity is the aggregate root - the only entry point for modifications.

**Why**: Enforces consistency boundaries. All business rules for the aggregate are enforced by the root.

```python
from typing import List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class OrderLine:
    """
    An entity within the Order aggregate.
    Can only be accessed through the Order (aggregate root).
    """

    def __init__(self, product_id, product_name, quantity, unit_price):
        self.product_id = product_id
        self.product_name = product_name
        self.quantity = quantity
        self.unit_price = unit_price  # Money value object

    def total(self):
        """Calculate line total"""
        return self.unit_price.multiply(self.quantity)


class Order:
    """
    Aggregate Root for the Order aggregate.

    What makes it an aggregate:
    - Enforces consistency for all order lines
    - Only way to modify order lines is through Order methods
    - Ensures business rules (min order, valid status changes)
    - Has clear lifecycle (pending → confirmed → shipped)

    Best Practices:
    - Keep aggregates small (just what needs to be consistent)
    - Only aggregate root is accessed from outside
    - Use IDs to reference other aggregates, not object references
    - Emit domain events for changes others care about
    """

    def __init__(self, order_id, customer_id):
        # Identity
        self._id = order_id

        # Reference to Customer aggregate by ID, not object
        self._customer_id = customer_id

        # State
        self._lines = []
        self._status = "PENDING"
        self._created_at = datetime.utcnow()
        self._events = []  # Domain events

    def add_line(self, product_id, product_name, quantity, unit_price):
        """
        Business operation: add item to order.

        Why through Order:
        - Order controls what lines are valid
        - Can enforce rules like "max 10 items"
        - Maintains consistency
        """
        # Business rule: cannot modify confirmed orders
        if self._status != "PENDING":
            logger.warning(f"Attempt to modify order {self._id} in status {self._status}")
            raise ValueError(f"Cannot modify order in {self._status} status")

        # Business rule: valid quantity
        if quantity <= 0:
            raise ValueError("Quantity must be positive")

        line = OrderLine(product_id, product_name, quantity, unit_price)
        self._lines.append(line)

        logger.info(f"Added {quantity}x {product_name} to order {self._id}")

    def confirm(self):
        """
        Business operation: confirm order.

        Why important:
        - Validates business rules before state change
        - Emits domain event so other parts of system know
        - Logs for audit trail
        """
        # Business rule: must have items
        if not self._lines:
            raise ValueError("Cannot confirm empty order")

        # Business rule: must meet minimum
        if self.total().amount < 10:
            raise ValueError("Order must be at least $10")

        old_status = self._status
        self._status = "CONFIRMED"

        # Emit domain event
        event = OrderConfirmedEvent(self._id, self._customer_id, self.total())
        self._events.append(event)

        logger.info(f"Order {self._id} confirmed. Status: {old_status} → {self._status}")

    def total(self):
        """Calculate order total"""
        if not self._lines:
            return Money(0, "USD")

        total = self._lines[0].total()
        for line in self._lines[1:]:
            total = total.add(line.total())
        return total

    def collect_events(self):
        """
        Collect domain events that occurred.

        Why:
        - Other parts of system need to know about changes
        - Events processed after aggregate is saved
        - Enables eventual consistency across aggregates
        """
        events = self._events[:]
        self._events = []
        return events

    @property
    def id(self):
        return self._id

    @property
    def customer_id(self):
        """Reference to Customer aggregate by ID"""
        return self._customer_id

    @property
    def status(self):
        return self._status
```

### Domain Events

**What**: Something that happened in the domain that domain experts care about. "OrderConfirmed," "PaymentReceived," "PatientAdmitted."

**Why**: Decouples different parts of your system. When an order is confirmed, inventory, shipping, and notifications all need to react - but the Order aggregate doesn't need to know about them.

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class DomainEvent:
    """
    Base class for domain events.

    Why domain events:
    - Capture that something happened
    - Enable loose coupling between aggregates
    - Create audit trail
    - Enable event sourcing and CQRS patterns

    Best Practices:
    - Name in past tense (OrderConfirmed, not ConfirmOrder)
    - Immutable (frozen=True)
    - Include timestamp and ID for tracing
    - Include data needed by listeners
    """
    event_id: str
    occurred_at: datetime

    def __post_init__(self):
        """Validate event is well-formed"""
        if not self.event_id:
            raise ValueError("Event must have ID")


@dataclass(frozen=True)
class OrderConfirmedEvent(DomainEvent):
    """
    Domain event: An order was confirmed.

    What it means:
    - Order passed validation and moved to CONFIRMED status
    - Other systems can react (charge payment, reserve inventory, notify customer)

    Who cares:
    - Inventory: Reserve items
    - Payment: Process charge
    - Shipping: Prepare shipment
    - Notifications: Email customer
    """
    order_id: str
    customer_id: str
    total: Money


@dataclass(frozen=True)
class PaymentProcessedEvent(DomainEvent):
    """
    Domain event: Payment was successfully processed.
    """
    payment_id: str
    order_id: str
    amount: Money
    payment_method: str


# Example: Event Handler (in application layer)
class InventoryEventHandler:
    """
    Listens to domain events and updates inventory.

    Why separate:
    - Order aggregate doesn't know about inventory
    - Inventory can react to order events
    - Can add new reactions without changing Order

    Best Practices:
    - Handlers should be idempotent (safe to run twice)
    - Log all event processing
    - Handle failures gracefully
    """

    def __init__(self, inventory_service, logger):
        self.inventory_service = inventory_service
        self.logger = logger

    def handle(self, event: OrderConfirmedEvent):
        """
        React to order confirmation.

        Safety:
        - Validate event before processing
        - Log all actions
        - Handle errors without crashing
        """
        try:
            self.logger.info(
                f"Processing OrderConfirmed event",
                extra={
                    "event_id": event.event_id,
                    "order_id": event.order_id,
                    "customer_id": event.customer_id
                }
            )

            # Reserve inventory for order
            self.inventory_service.reserve_for_order(event.order_id)

            self.logger.info(
                f"Inventory reserved for order {event.order_id}",
                extra={"event_id": event.event_id}
            )

        except Exception as e:
            self.logger.error(
                f"Failed to reserve inventory for order {event.order_id}",
                extra={
                    "event_id": event.event_id,
                    "error": str(e)
                },
                exc_info=True
            )
            raise
```

### Repositories

**What**: Abstraction for retrieving and storing aggregates. Hides database details from domain layer.

**Why**: Domain layer focuses on business logic, not SQL or database structure. Allows switching databases without changing business logic.

```python
from abc import ABC, abstractmethod
from typing import Optional


class OrderRepository(ABC):
    """
    Repository interface for Order aggregate.

    Why interface in domain layer:
    - Domain defines what it needs
    - Infrastructure provides implementation
    - Easy to test with fake repository
    - Can swap database without changing domain

    Best Practices:
    - Only repositories can access database
    - Repository deals with whole aggregates, not pieces
    - Name methods after domain concepts, not technical operations
    """

    @abstractmethod
    def save(self, order: Order) -> None:
        """
        Save aggregate and publish events.

        Why:
        - Persists aggregate state
        - Should publish collected domain events
        - Atomic operation (save + events in transaction)
        """
        pass

    @abstractmethod
    def find_by_id(self, order_id: str) -> Optional[Order]:
        """
        Retrieve aggregate by ID.

        Returns None if not found.
        """
        pass

    @abstractmethod
    def find_by_customer(self, customer_id: str) -> List[Order]:
        """
        Find orders for a customer.

        Note: This is a query method.
        In complex systems, consider CQRS for queries.
        """
        pass


# Implementation (in infrastructure layer)
class SQLOrderRepository(OrderRepository):
    """
    Concrete implementation using SQL database.

    Best Practices:
    - Maps between domain objects and database schema
    - Handles transactions
    - Publishes domain events after save
    - Logs database operations
    """

    def __init__(self, db_connection, event_bus, logger):
        self.db = db_connection
        self.event_bus = event_bus
        self.logger = logger

    def save(self, order: Order) -> None:
        """
        Save order aggregate to database.

        Steps:
        1. Start transaction
        2. Save aggregate
        3. Collect events
        4. Commit transaction
        5. Publish events

        Why this order:
        - Events only published if save succeeds
        - Transaction ensures consistency
        - Events published outside transaction for safety
        """
        try:
            # Start transaction
            with self.db.transaction() as tx:
                # Save aggregate root
                tx.execute(
                    "INSERT INTO orders (id, customer_id, status, created_at) "
                    "VALUES (?, ?, ?, ?) "
                    "ON CONFLICT(id) DO UPDATE SET status = ?, updated_at = NOW()",
                    (order.id, order.customer_id, order.status, order._created_at,
                     order.status)
                )

                # Save order lines (part of aggregate)
                tx.execute("DELETE FROM order_lines WHERE order_id = ?", (order.id,))
                for line in order._lines:
                    tx.execute(
                        "INSERT INTO order_lines (order_id, product_id, product_name, "
                        "quantity, unit_price_amount, unit_price_currency) "
                        "VALUES (?, ?, ?, ?, ?, ?)",
                        (order.id, line.product_id, line.product_name,
                         line.quantity, line.unit_price.amount, line.unit_price.currency)
                    )

                # Collect events before commit
                events = order.collect_events()

                # Commit transaction
                tx.commit()

                self.logger.info(f"Saved order {order.id} to database")

            # Publish events after successful commit
            for event in events:
                self.event_bus.publish(event)
                self.logger.info(
                    f"Published {event.__class__.__name__}",
                    extra={"event_id": event.event_id, "order_id": order.id}
                )

        except Exception as e:
            self.logger.error(
                f"Failed to save order {order.id}",
                extra={"error": str(e)},
                exc_info=True
            )
            raise

    def find_by_id(self, order_id: str) -> Optional[Order]:
        """
        Load aggregate from database.

        Why important:
        - Reconstitutes full aggregate with all invariants
        - Returns None if not found (not exception)
        - Loads all parts of aggregate (root + lines)
        """
        try:
            # Load aggregate root
            row = self.db.query_one(
                "SELECT id, customer_id, status, created_at FROM orders WHERE id = ?",
                (order_id,)
            )

            if not row:
                return None

            # Reconstitute aggregate
            order = Order.__new__(Order)
            order._id = row['id']
            order._customer_id = row['customer_id']
            order._status = row['status']
            order._created_at = row['created_at']
            order._events = []

            # Load order lines
            lines = self.db.query_all(
                "SELECT product_id, product_name, quantity, "
                "unit_price_amount, unit_price_currency "
                "FROM order_lines WHERE order_id = ?",
                (order_id,)
            )

            order._lines = [
                OrderLine(
                    line['product_id'],
                    line['product_name'],
                    line['quantity'],
                    Money(line['unit_price_amount'], line['unit_price_currency'])
                )
                for line in lines
            ]

            self.logger.debug(f"Loaded order {order_id} from database")
            return order

        except Exception as e:
            self.logger.error(
                f"Failed to load order {order_id}",
                extra={"error": str(e)},
                exc_info=True
            )
            raise

    def find_by_customer(self, customer_id: str) -> List[Order]:
        """Load all orders for a customer"""
        # Implementation similar to find_by_id
        pass
```

### Domain Services

**What**: Operations that don't naturally belong to a single entity or value object. Usually involves coordination between multiple aggregates.

**Why**: Keeps entities focused. Some business operations span multiple objects.

```python
class PricingService:
    """
    Domain Service: Calculate prices with business rules.

    Why domain service:
    - Pricing logic spans multiple concepts (products, customers, promotions)
    - Doesn't naturally belong to Order or Product
    - Stateless - pure business logic
    - Named after domain concept, not technical operation

    Best Practices:
    - Keep domain services in domain layer
    - No infrastructure dependencies
    - Pure business logic
    - Testable without database
    """

    def __init__(self, logger):
        self.logger = logger

    def calculate_order_total(self, order: Order, customer_tier: str) -> Money:
        """
        Calculate final order total with discounts.

        Business rules:
        - Gold customers get 10% off
        - Silver customers get 5% off
        - Orders over $100 get free shipping

        Why domain service:
        - Order doesn't know about customer tiers
        - Customer doesn't know about order totals
        - This service coordinates both
        """
        subtotal = order.total()

        # Apply tier discount
        discount = self._get_tier_discount(customer_tier)
        discounted = Money(
            subtotal.amount * (1 - discount),
            subtotal.currency
        )

        # Add shipping if needed
        shipping = Money(0, subtotal.currency)
        if discounted.amount < 100:
            shipping = Money(10, subtotal.currency)

        total = discounted.add(shipping)

        self.logger.info(
            f"Calculated order total: {subtotal} → {total}",
            extra={
                "order_id": order.id,
                "customer_tier": customer_tier,
                "discount": discount,
                "shipping": shipping.amount
            }
        )

        return total

    def _get_tier_discount(self, tier: str) -> float:
        """Business rule: tier discounts"""
        discounts = {
            "GOLD": 0.10,
            "SILVER": 0.05,
            "BRONZE": 0.00
        }
        return discounts.get(tier, 0.00)


class TransferService:
    """
    Domain Service: Transfer money between accounts.

    Why domain service:
    - Involves two Account aggregates
    - Business rule: transfer is atomic
    - Doesn't belong to either account
    """

    def __init__(self, account_repository, logger):
        self.account_repository = account_repository
        self.logger = logger

    def transfer(self, from_account_id: str, to_account_id: str, amount: Money):
        """
        Transfer money between accounts.

        Business rules:
        - From account must have sufficient funds
        - Both accounts must exist
        - Transfer must be atomic
        - Currency must match

        Best Practice:
        - Load both aggregates
        - Validate rules
        - Modify both
        - Save both in transaction
        - Log operation
        """
        # Load both aggregates
        from_account = self.account_repository.find_by_id(from_account_id)
        to_account = self.account_repository.find_by_id(to_account_id)

        if not from_account or not to_account:
            raise ValueError("Account not found")

        # Use domain methods to modify
        from_account.withdraw(amount)  # Validates sufficient funds
        to_account.deposit(amount)

        # Save both (in transaction)
        self.account_repository.save_both(from_account, to_account)

        self.logger.info(
            f"Transferred {amount} from {from_account_id} to {to_account_id}",
            extra={
                "from_account": from_account_id,
                "to_account": to_account_id,
                "amount": amount.amount,
                "currency": amount.currency
            }
        )
```

### Layered Architecture in Practice

Here's how the layers work together:

```python
# ============================================
# DOMAIN LAYER - Business Logic
# ============================================

# Already defined above: Order, Money, Customer, etc.


# ============================================
# APPLICATION LAYER - Use Cases
# ============================================

class PlaceOrderUseCase:
    """
    Application service: orchestrates a use case.

    What it does:
    - Coordinates domain objects
    - Manages transactions
    - Doesn't contain business logic (delegates to domain)

    Best Practices:
    - One use case per class
    - Thin layer - just orchestration
    - All business logic in domain layer
    - Handle technical concerns (transactions, logging)
    """

    def __init__(self, order_repository, customer_repository,
                 pricing_service, logger):
        self.order_repository = order_repository
        self.customer_repository = customer_repository
        self.pricing_service = pricing_service
        self.logger = logger

    def execute(self, customer_id: str, items: List[dict]) -> str:
        """
        Place an order.

        Steps:
        1. Validate customer exists
        2. Create order
        3. Add items
        4. Confirm order
        5. Save
        6. Return order ID

        Why use case:
        - Defines business workflow
        - Coordinates multiple aggregates
        - Handles transaction boundary
        """
        try:
            self.logger.info(
                f"Placing order for customer {customer_id}",
                extra={
                    "customer_id": customer_id,
                    "item_count": len(items)
                }
            )

            # Load customer aggregate
            customer = self.customer_repository.find_by_id(customer_id)
            if not customer:
                raise ValueError("Customer not found")

            # Create new order aggregate
            order = Order(
                order_id=self._generate_id(),
                customer_id=customer_id
            )

            # Add items (domain validation)
            for item in items:
                order.add_line(
                    product_id=item['product_id'],
                    product_name=item['product_name'],
                    quantity=item['quantity'],
                    unit_price=Money(item['price'], "USD")
                )

            # Confirm order (domain validation + event)
            order.confirm()

            # Save (repository handles transaction + events)
            self.order_repository.save(order)

            self.logger.info(
                f"Order placed successfully: {order.id}",
                extra={
                    "order_id": order.id,
                    "customer_id": customer_id,
                    "total": order.total().amount
                }
            )

            return order.id

        except Exception as e:
            self.logger.error(
                f"Failed to place order for customer {customer_id}",
                extra={"error": str(e)},
                exc_info=True
            )
            raise

    def _generate_id(self) -> str:
        """Generate unique order ID"""
        import uuid
        return str(uuid.uuid4())


# ============================================
# INFRASTRUCTURE LAYER - Technical Concerns
# ============================================

# Database implementation (already shown in SQLOrderRepository)

# Event bus implementation
class EventBus:
    """
    Infrastructure: publishes domain events.

    Why:
    - Domain events need to reach handlers
    - Could be in-memory, message queue, or event stream
    - Domain layer doesn't care about implementation
    """

    def __init__(self, logger):
        self.logger = logger
        self.handlers = {}

    def subscribe(self, event_type, handler):
        """Register event handler"""
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)

    def publish(self, event: DomainEvent):
        """
        Publish event to all subscribers.

        Best Practices:
        - Async if possible
        - Handle failures gracefully
        - Log all event processing
        - Consider retry logic
        """
        event_type = type(event)
        handlers = self.handlers.get(event_type, [])

        for handler in handlers:
            try:
                self.logger.debug(
                    f"Dispatching {event_type.__name__} to {handler.__class__.__name__}",
                    extra={"event_id": event.event_id}
                )
                handler.handle(event)
            except Exception as e:
                self.logger.error(
                    f"Handler {handler.__class__.__name__} failed for {event_type.__name__}",
                    extra={
                        "event_id": event.event_id,
                        "error": str(e)
                    },
                    exc_info=True
                )
                # Don't let one handler failure stop others


# ============================================
# USER INTERFACE LAYER - API/Web/etc
# ============================================

# Example: REST API endpoint
class OrderAPI:
    """
    API layer: exposes use cases via HTTP.

    Responsibilities:
    - Parse HTTP requests
    - Call application use cases
    - Format responses
    - Handle HTTP-specific concerns (auth, rate limiting)

    Does NOT contain business logic!
    """

    def __init__(self, place_order_use_case, logger):
        self.place_order_use_case = place_order_use_case
        self.logger = logger

    def post_order(self, request):
        """
        POST /orders endpoint

        Request:
        {
            "customer_id": "12345",
            "items": [
                {"product_id": "P1", "product_name": "Widget",
                 "quantity": 2, "price": 10.00}
            ]
        }
        """
        try:
            # Parse request (input validation)
            data = request.json()

            if not data.get('customer_id'):
                return {"error": "customer_id required"}, 400
            if not data.get('items'):
                return {"error": "items required"}, 400

            # Call use case (business logic)
            order_id = self.place_order_use_case.execute(
                customer_id=data['customer_id'],
                items=data['items']
            )

            # Format response
            return {
                "order_id": order_id,
                "status": "confirmed"
            }, 201

        except ValueError as e:
            # Business rule violation
            self.logger.warning(f"Order validation failed: {e}")
            return {"error": str(e)}, 400

        except Exception as e:
            # Technical failure
            self.logger.error(f"Order creation failed: {e}", exc_info=True)
            return {"error": "Internal server error"}, 500
```

## Best Practices

### Safety

**1. Always validate at aggregate boundaries**

```python
class Account:
    def withdraw(self, amount: Money):
        """Validate business rules before state change"""
        # Safety: check preconditions
        if amount.amount <= 0:
            raise ValueError("Withdrawal amount must be positive")

        if amount.amount > self._balance.amount:
            raise ValueError("Insufficient funds")

        if self._status != "ACTIVE":
            raise ValueError("Cannot withdraw from inactive account")

        # Safe to proceed
        self._balance = Money(
            self._balance.amount - amount.amount,
            self._balance.currency
        )

        logger.info(f"Withdrew {amount} from account {self._id}")
```

**2. Make value objects immutable and self-validating**

```python
@dataclass(frozen=True)
class Email:
    """Self-validating value object"""
    address: str

    def __post_init__(self):
        """Validate on creation - impossible to create invalid Email"""
        if not self.address or "@" not in self.address:
            raise ValueError("Invalid email address")

        if len(self.address) > 255:
            raise ValueError("Email too long")

    # Cannot be modified after creation (frozen=True)
```

**3. Use domain events for cross-aggregate consistency**

```python
# DON'T: Modify multiple aggregates directly
order.confirm()
inventory.reserve(order.id)  # Don't do this!

# DO: Use domain events
order.confirm()  # Emits OrderConfirmedEvent
# InventoryEventHandler reacts to event
```

**4. Keep aggregate sizes small**

```python
# DON'T: Include everything related
class Order:
    def __init__(self):
        self.customer = Customer(...)  # Full customer object
        self.inventory = Inventory(...)  # Full inventory
        self.shipping = Shipment(...)  # Full shipment

# DO: Reference by ID, keep aggregate focused
class Order:
    def __init__(self):
        self.customer_id = "C123"  # Just ID
        self.lines = []  # Only what must be consistent
```

### Quality

**1. Test domain logic independently**

```python
def test_order_confirmation_validates_minimum():
    """
    Test business rule without database.

    Why this works:
    - Domain logic is pure (no infrastructure dependencies)
    - Easy to test
    - Fast tests
    - Clear business rules
    """
    # Arrange
    order = Order("O1", "C1")
    order.add_line("P1", "Widget", 1, Money(5, "USD"))

    # Act & Assert
    with pytest.raises(ValueError, match="at least \\$10"):
        order.confirm()  # Violates business rule


def test_order_confirmation_emits_event():
    """Test domain event emission"""
    # Arrange
    order = Order("O1", "C1")
    order.add_line("P1", "Widget", 2, Money(10, "USD"))

    # Act
    order.confirm()
    events = order.collect_events()

    # Assert
    assert len(events) == 1
    assert isinstance(events[0], OrderConfirmedEvent)
    assert events[0].order_id == "O1"
```

**2. Use repository interfaces for testing**

```python
class FakeOrderRepository(OrderRepository):
    """
    In-memory repository for testing.

    Why:
    - Tests don't need database
    - Fast
    - Predictable
    - Easy to set up test scenarios
    """

    def __init__(self):
        self.orders = {}
        self.events = []

    def save(self, order: Order):
        self.orders[order.id] = order
        self.events.extend(order.collect_events())

    def find_by_id(self, order_id: str):
        return self.orders.get(order_id)


def test_place_order_use_case():
    """Test use case with fake repository"""
    # Arrange
    order_repo = FakeOrderRepository()
    customer_repo = FakeCustomerRepository()
    customer_repo.save(Customer("C1", "John", "john@example.com"))

    use_case = PlaceOrderUseCase(order_repo, customer_repo,
                                   PricingService(logger), logger)

    # Act
    order_id = use_case.execute(
        customer_id="C1",
        items=[{"product_id": "P1", "product_name": "Widget",
                "quantity": 2, "price": 10.00}]
    )

    # Assert
    assert order_id is not None
    order = order_repo.find_by_id(order_id)
    assert order.status == "CONFIRMED"
    assert len(order_repo.events) == 1
```

**3. Integration tests for repositories**

```python
def test_order_repository_roundtrip(db_connection):
    """
    Test repository saves and loads correctly.

    Why important:
    - Verifies mapping between domain and database
    - Catches serialization issues
    - Tests transaction handling
    """
    # Arrange
    repo = SQLOrderRepository(db_connection, EventBus(logger), logger)
    order = Order("O1", "C1")
    order.add_line("P1", "Widget", 2, Money(10, "USD"))
    order.confirm()

    # Act - save
    repo.save(order)

    # Act - load
    loaded = repo.find_by_id("O1")

    # Assert
    assert loaded.id == order.id
    assert loaded.status == "CONFIRMED"
    assert len(loaded._lines) == 2
    assert loaded.total() == Money(20, "USD")
```

### Logging

**1. Log at aggregate boundaries**

```python
class Order:
    def confirm(self):
        """Log state transitions"""
        logger.info(
            "Confirming order",
            extra={
                "order_id": self._id,
                "customer_id": self._customer_id,
                "line_count": len(self._lines),
                "total": self.total().amount,
                "old_status": self._status,
                "new_status": "CONFIRMED"
            }
        )

        self._status = "CONFIRMED"
        # ...
```

**2. Log domain events with trace IDs**

```python
@dataclass(frozen=True)
class DomainEvent:
    event_id: str
    occurred_at: datetime
    trace_id: str  # For distributed tracing

    def log_published(self, logger):
        """Structured logging for events"""
        logger.info(
            f"{self.__class__.__name__} published",
            extra={
                "event_type": self.__class__.__name__,
                "event_id": self.event_id,
                "trace_id": self.trace_id,
                "occurred_at": self.occurred_at.isoformat()
            }
        )
```

**3. Log use case execution**

```python
class PlaceOrderUseCase:
    def execute(self, customer_id: str, items: List[dict]) -> str:
        """Log use case start, success, and failure"""
        trace_id = str(uuid.uuid4())

        logger.info(
            "PlaceOrderUseCase starting",
            extra={
                "use_case": "PlaceOrder",
                "trace_id": trace_id,
                "customer_id": customer_id,
                "item_count": len(items)
            }
        )

        try:
            # ... execution ...

            logger.info(
                "PlaceOrderUseCase completed",
                extra={
                    "use_case": "PlaceOrder",
                    "trace_id": trace_id,
                    "order_id": order_id,
                    "duration_ms": duration
                }
            )

            return order_id

        except Exception as e:
            logger.error(
                "PlaceOrderUseCase failed",
                extra={
                    "use_case": "PlaceOrder",
                    "trace_id": trace_id,
                    "error_type": type(e).__name__,
                    "error_message": str(e)
                },
                exc_info=True
            )
            raise
```

**4. Monitor domain event flow**

```python
class EventBus:
    def publish(self, event: DomainEvent):
        """Log event publication and handling"""
        logger.info(
            "Publishing domain event",
            extra={
                "event_type": type(event).__name__,
                "event_id": event.event_id,
                "handler_count": len(self.handlers.get(type(event), []))
            }
        )

        for handler in self.handlers.get(type(event), []):
            start = time.time()
            try:
                handler.handle(event)
                duration = (time.time() - start) * 1000

                logger.info(
                    "Event handler completed",
                    extra={
                        "event_id": event.event_id,
                        "handler": handler.__class__.__name__,
                        "duration_ms": duration
                    }
                )
            except Exception as e:
                logger.error(
                    "Event handler failed",
                    extra={
                        "event_id": event.event_id,
                        "handler": handler.__class__.__name__,
                        "error": str(e)
                    },
                    exc_info=True
                )
```

## Use Cases Across Domains

### E-commerce: Product Catalog and Orders

**Bounded Contexts:**
- **Catalog Context**: Products, categories, search, inventory
- **Shopping Context**: Cart, wishlist, browsing
- **Order Context**: Orders, payments, order history
- **Shipping Context**: Shipments, tracking, delivery

**Key Aggregates:**

```
Catalog Context:
- Product (root): SKU, name, description, price, inventory
  - Variants: Size, color options
  - Images: Product photos

Order Context:
- Order (root): Order lines, total, status
  - OrderLine: Product reference (by ID), quantity, price snapshot

Shipping Context:
- Shipment (root): Delivery address, tracking, status
  - Package: Items included, weight, dimensions
```

**Why separate contexts:**
- Product price changes shouldn't affect past orders (Order has price snapshot)
- Catalog can scale independently for browsing
- Shipping can use different model (packages vs items)

**Domain Events:**
- `ProductAddedToCatalog` → Update search index
- `OrderPlaced` → Reserve inventory, create shipment
- `PaymentCompleted` → Confirm order, notify warehouse
- `ShipmentDispatched` → Update order status, notify customer

### Banking: Accounts and Transactions

**Bounded Contexts:**
- **Account Context**: Accounts, balances, ownership
- **Transaction Context**: Transfers, deposits, withdrawals
- **Fraud Detection Context**: Transaction monitoring, risk scoring
- **Compliance Context**: Reporting, audit trails, KYC

**Key Aggregates:**

```
Account Context:
- Account (root): Balance, owner, status, type
  - No transaction history in aggregate (separate context)
  - Business rule: Balance cannot go negative

Transaction Context:
- Transaction (root): From/to accounts (by ID), amount, timestamp
  - Immutable once created
  - Business rule: Atomic (both sides succeed or fail)
```

**Ubiquitous Language:**
- "Account holder" not "user"
- "Transfer" not "transaction" (transaction has specific meaning)
- "Available balance" vs "ledger balance"
- "Posting" means recording transaction

**Domain Services:**
- `TransferService`: Coordinates two Account aggregates
- `FraudDetectionService`: Scores transactions (different context)

**Domain Events:**
- `MoneyDeposited` → Update balance, log for audit
- `TransferCompleted` → Notify both account holders
- `SuspiciousActivityDetected` → Freeze account, alert compliance

### Healthcare: Patient Records and Appointments

**Bounded Contexts:**
- **Patient Context**: Patient demographics, insurance, medical history
- **Scheduling Context**: Appointments, provider availability
- **Clinical Context**: Diagnoses, treatments, prescriptions
- **Billing Context**: Claims, payments, insurance processing

**Key Aggregates:**

```
Patient Context:
- Patient (root): Name, DOB, contact, insurance
  - EmergencyContact: Name, relationship, phone
  - Insurance: Policy number, provider, coverage

Scheduling Context:
- Appointment (root): Patient ID, provider ID, time, status
  - Cannot include full Patient object (different aggregate)
  - Business rule: No double-booking

Clinical Context:
- Encounter (root): Appointment ID, diagnosis, treatment, notes
  - Prescription: Medication, dosage, duration
  - Vital Signs: BP, temperature, weight
  - Business rule: Only licensed provider can prescribe
```

**Ubiquitous Language:**
- "Encounter" not "visit" or "session"
- "Provider" not "doctor" (includes nurses, specialists)
- "Chief complaint" not "reason for visit"
- "Admit" vs "Discharge" (specific meanings)

**Domain Events:**
- `AppointmentScheduled` → Send reminder, block time slot
- `PatientAdmitted` → Create encounter, notify staff
- `PrescriptionIssued` → Send to pharmacy, update med list
- `EncounterCompleted` → Generate claim, update patient record

**Safety considerations:**
- HIPAA compliance: Log all access to patient records
- Audit trail: Track all changes with who/when/why
- Data validation: Ensure medical codes are valid
- Authorization: Strict role-based access control

### Insurance: Policies and Claims

**Bounded Contexts:**
- **Policy Context**: Policies, coverage, premiums
- **Claims Context**: Claims, assessments, approvals
- **Underwriting Context**: Risk assessment, pricing
- **Customer Context**: Policyholders, agents, communications

**Key Aggregates:**

```
Policy Context:
- Policy (root): Number, holder, coverage, premium, status
  - Coverage: Type, limits, deductibles
  - Beneficiary: Name, relationship, percentage
  - Business rule: Premium must be current for coverage

Claims Context:
- Claim (root): Policy ID (reference), incident, amount, status
  - Document: Type, file reference, upload date
  - Assessment: Adjuster notes, approved amount
  - Business rule: Claim amount cannot exceed coverage limit
  - Business rule: Cannot pay claim if policy lapsed
```

**Ubiquitous Language:**
- "Policyholder" not "customer" or "user"
- "Peril" not "risk" (specific insurance term)
- "Adjudicate" not "process" (claims are adjudicated)
- "Endorsement" means policy modification
- "Lapse" means coverage ended due to non-payment

**Domain Services:**
- `ClaimAdjudicationService`: Validates claim against policy rules
- `PremiumCalculationService`: Computes premium based on risk factors

**Domain Events:**
- `PolicyIssued` → Send documents, schedule renewal
- `ClaimFiled` → Assign adjuster, request documents
- `ClaimApproved` → Process payment, update statistics
- `PolicyRenewed` → Recalculate premium, generate new term

**Context Mapping:**
```
[Policy Context] ──(Supplier)──> [Claims Context]
Claims context conforms to Policy's definition of coverage

[Underwriting] ──(Partnership)──> [Policy Context]
Both coordinate on pricing and risk assessment

[External Agents] ──(Anti-Corruption Layer)──> [Policy Context]
ACL translates external agent systems to our model
```

## Common Pitfalls

### 1. Anemic Domain Model

**Problem**: Domain objects are just data containers with no behavior. All logic lives in services.

```python
# BAD: Anemic domain model
class Order:
    def __init__(self):
        self.id = None
        self.status = None
        self.total = 0
        self.lines = []

    # Just getters and setters, no behavior!


class OrderService:
    def confirm_order(self, order):
        """All logic in service layer"""
        if not order.lines:
            raise ValueError("Empty order")

        if order.total < 10:
            raise ValueError("Minimum not met")

        order.status = "CONFIRMED"  # Direct field access


# GOOD: Rich domain model
class Order:
    def confirm(self):
        """Business logic in the aggregate"""
        if not self._lines:
            raise ValueError("Cannot confirm empty order")

        if self.total().amount < 10:
            raise ValueError("Order must be at least $10")

        self._status = "CONFIRMED"
        self._events.append(OrderConfirmedEvent(...))
```

**Why bad**: Business rules are scattered, hard to test, easy to violate.

**Fix**: Put behavior in domain objects. Services should coordinate, not contain logic.

### 2. Aggregate Size Too Large

**Problem**: Including too much in one aggregate makes it slow and creates contention.

```python
# BAD: Huge aggregate
class Order:
    def __init__(self):
        self.customer = Customer(...)  # Full customer with orders
        self.products = [Product(...)]  # Full product objects
        self.shipment = Shipment(...)  # Full shipment details
        self.payments = [Payment(...)]  # All payment attempts

# Loading an order loads half the database!


# GOOD: Small, focused aggregate
class Order:
    def __init__(self):
        self.customer_id = "C123"  # Just reference
        self.lines = []  # Only order lines
        # That's it! Other info in other aggregates
```

**Why bad**: Slow to load, locks too much, hard to scale.

**Fix**: Keep only what must be consistent together. Reference other aggregates by ID.

### 3. Modifying Multiple Aggregates in One Transaction

**Problem**: Trying to keep multiple aggregates consistent in one transaction creates coupling and reduces scalability.

```python
# BAD: Modify multiple aggregates
def place_order(order, inventory, customer):
    order.confirm()
    inventory.reserve(order.id)  # Different aggregate!
    customer.add_order(order.id)  # Another aggregate!
    # All in one transaction - tightly coupled


# GOOD: Use eventual consistency via events
def place_order(order):
    order.confirm()  # Emits OrderConfirmedEvent
    order_repository.save(order)  # Publishes event

# Separate event handlers react:
# - InventoryHandler reserves items
# - CustomerHandler updates order history
# Each in their own transaction
```

**Why bad**: Tight coupling, can't scale aggregates independently, distributed transaction problems.

**Fix**: Use domain events for cross-aggregate consistency. Accept eventual consistency.

### 4. Exposing Aggregate Internals

**Problem**: Allowing direct access to aggregate internals breaks encapsulation.

```python
# BAD: Direct access
order = order_repository.find_by_id(order_id)
order.lines.append(new_line)  # Direct list manipulation!
order.status = "CONFIRMED"  # Direct field access!


# GOOD: Use methods
order = order_repository.find_by_id(order_id)
order.add_line(...)  # Method validates business rules
order.confirm()  # Method validates and emits events
```

**Why bad**: Business rules can be bypassed, invariants violated.

**Fix**: Make fields private, provide methods that enforce rules.

### 5. Leaking Domain Logic to Application Layer

**Problem**: Business rules spread across application and domain layers.

```python
# BAD: Business logic in application layer
class PlaceOrderUseCase:
    def execute(self, customer_id, items):
        order = Order(...)

        # Business rule in wrong layer!
        if sum(item['price'] * item['qty'] for item in items) < 10:
            raise ValueError("Minimum $10")

        for item in items:
            order.add_line(...)


# GOOD: Business logic in domain layer
class PlaceOrderUseCase:
    def execute(self, customer_id, items):
        order = Order(...)

        for item in items:
            order.add_line(...)

        order.confirm()  # Business rules enforced here!
```

**Why bad**: Business rules duplicated, can't test domain independently.

**Fix**: Application layer orchestrates only. All business rules in domain layer.

### 6. Not Using Ubiquitous Language

**Problem**: Code uses different terms than domain experts.

```python
# BAD: Technical language
class UserEntity:
    def __init__(self):
        self.id = None
        self.order_fk_list = []  # What?


# GOOD: Domain language
class Customer:
    def __init__(self):
        self.customer_id = None
        self.order_history = []  # Clear!
```

**Why bad**: Developers and domain experts can't communicate effectively.

**Fix**: Use the same terms in code that domain experts use in conversation.

### 7. Treating DDD as All-or-Nothing

**Problem**: Applying DDD patterns everywhere, even in simple CRUD areas.

```
# NOT EVERY PART OF YOUR SYSTEM NEEDS DDD!

Complex domain with business rules:
✅ Use DDD - Order, Payment, Pricing

Simple CRUD with no rules:
❌ Don't use DDD - User preferences, configuration
✓ Simple CRUD is fine
```

**Why bad**: Overengineering simple areas adds unnecessary complexity.

**Fix**: Use DDD for complex business logic. Use simpler patterns for CRUD.

## Quick Reference

### When to Use DDD

| Use DDD when...                             | Skip DDD when...                    |
| ------------------------------------------- | ----------------------------------- |
| Complex business rules                      | Simple CRUD                         |
| Domain experts are available                | Purely technical problem            |
| Business logic changes frequently           | Logic is trivial and stable         |
| Multiple teams/contexts                     | Small single-purpose app            |
| Long-term project (years)                   | Quick prototype or experiment       |
| Domain knowledge is key competitive advantage | Generic business logic            |

### Strategic DDD Checklist

- [ ] Identified bounded contexts (separate business areas)
- [ ] Defined ubiquitous language (shared vocabulary)
- [ ] Mapped context relationships (how contexts interact)
- [ ] Documented core domain vs supporting domains
- [ ] Planned anti-corruption layers for external systems

### Tactical DDD Checklist

- [ ] Aggregates have clear boundaries (what must be consistent)
- [ ] Aggregate roots control access (single entry point)
- [ ] Entities have identity, value objects don't
- [ ] Domain events capture what happened
- [ ] Repositories handle persistence, not domain objects
- [ ] Domain services for operations spanning entities
- [ ] Application layer orchestrates, doesn't contain business logic
- [ ] Business rules validated in domain layer

### Code Review Checklist

**Domain Layer:**
- [ ] All business rules in domain layer, not application/infrastructure
- [ ] Entities validate invariants on every change
- [ ] Value objects are immutable and self-validating
- [ ] Aggregates are small (only what must be consistent)
- [ ] Domain events emitted for important changes
- [ ] Ubiquitous language used in code

**Application Layer:**
- [ ] Use cases orchestrate only, no business logic
- [ ] Transaction boundaries clear
- [ ] Domain events published after save

**Infrastructure Layer:**
- [ ] Repositories save/load whole aggregates
- [ ] No domain logic in repositories
- [ ] Database schema separate from domain model

**Testing:**
- [ ] Domain logic tested without infrastructure
- [ ] Use cases tested with fake repositories
- [ ] Integration tests for repository implementations

### DDD Patterns Quick Reference

| Pattern              | Purpose                               | Example                             |
| -------------------- | ------------------------------------- | ----------------------------------- |
| Entity               | Object with identity and lifecycle    | Customer, Order, Account            |
| Value Object         | Object defined by attributes          | Money, Address, Email               |
| Aggregate            | Consistency boundary                  | Order (root) + OrderLines           |
| Aggregate Root       | Entry point to aggregate              | Order (controls OrderLines)         |
| Domain Event         | Something that happened               | OrderConfirmed, PaymentProcessed    |
| Repository           | Persistence abstraction               | OrderRepository, CustomerRepository |
| Domain Service       | Operation spanning entities           | TransferService, PricingService     |
| Application Service  | Use case orchestration                | PlaceOrderUseCase                   |
| Factory              | Complex object creation               | OrderFactory.create_from_cart()     |
| Specification        | Business rule that can be checked     | CustomerIsEligibleForDiscount       |

### Event Storming Quick Guide

Event Storming is a collaborative workshop technique for discovering domain events, aggregates, and bounded contexts.

**Steps:**
1. **Discover Events**: Write all domain events on orange sticky notes (past tense: OrderPlaced, PaymentReceived)
2. **Arrange Timeline**: Order events left to right as they occur
3. **Find Commands**: What triggers each event? (blue notes: PlaceOrder)
4. **Identify Aggregates**: What handles commands? (yellow notes: Order, Payment)
5. **Spot Issues**: Red notes for questions or problems
6. **Define Boundaries**: Group related events/aggregates into bounded contexts

**Output:** Visual map of your domain with events, aggregates, and contexts.

## Related Topics

### Within This Repository

**03-methodologies/**
- **[CQRS](/home/runner/work/tech-stack-essentials/tech-stack-essentials/03-methodologies/cqrs/README.md)**: Command Query Responsibility Segregation - often used with DDD
- **[Event Sourcing](/home/runner/work/tech-stack-essentials/tech-stack-essentials/03-methodologies/event-sourcing/README.md)**: Store state as sequence of events - complements DDD events
- **[Microservices](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/microservices/README.md)**: Bounded contexts often become microservices
- **[Hexagonal Architecture](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/hexagonal/README.md)**: Ports and adapters pattern aligns with DDD layers

**02-architectures/**
- **[Clean Architecture](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/clean-architecture/README.md)**: Similar layering concepts
- **[Saga Pattern](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/saga-pattern/README.md)**: Managing transactions across aggregates

**05-backend/**
- **[API Design](/home/runner/work/tech-stack-essentials/tech-stack-essentials/05-backend/api-design/README.md)**: Exposing domain models via APIs
- **[Database Patterns](/home/runner/work/tech-stack-essentials/tech-stack-essentials/05-backend/database-patterns/README.md)**: Persistence strategies for aggregates

### Learning Path

**If you're new to DDD:**
1. Start here - understand strategic DDD (bounded contexts, ubiquitous language)
2. Read **Clean Architecture** for layering concepts
3. Practice with tactical patterns (entities, value objects, aggregates)
4. Explore **CQRS** for read/write separation
5. Learn **Event Sourcing** for advanced scenarios

**If you're building distributed systems:**
1. Use bounded contexts to identify service boundaries
2. Read **Microservices** architecture guide
3. Learn **Saga Pattern** for cross-service transactions
4. Study **Event-Driven Architecture** for integration
5. Apply **API Design** principles for service contracts

**If you're working with legacy systems:**
1. Use **Anti-Corruption Layer** to isolate legacy code
2. Apply **Strangler Fig Pattern** to gradually replace
3. Start with one bounded context for new features
4. Gradually extract more contexts as you learn

### Further Reading

**Books:**
- "Domain-Driven Design" by Eric Evans (the original)
- "Implementing Domain-Driven Design" by Vaughn Vernon
- "Domain-Driven Design Distilled" by Vaughn Vernon (quick overview)
- "Patterns, Principles, and Practices of Domain-Driven Design" by Scott Millett

**Online Resources:**
- Martin Fowler's articles on DDD patterns
- DDD Community website (dddcommunity.org)
- Event Storming resources by Alberto Brandolini

---

**Remember**: Domain-Driven Design is not about code patterns - it's about understanding your business domain deeply and expressing that understanding in your code. Start with conversations, not code. Learn the business first, then model it. The tactical patterns (entities, aggregates) are just tools to express what you learned.

Start small. Pick one complex area of your application. Talk to domain experts. Model that one area well. Learn. Then expand. DDD is a journey, not a destination.
