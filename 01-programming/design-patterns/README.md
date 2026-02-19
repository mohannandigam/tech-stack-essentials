# Design Patterns

## What is it?

**Design patterns** are proven, reusable solutions to common problems that occur repeatedly in software design. They are not finished code you can copy-paste, but rather templates or blueprints that show you how to solve a problem in a way that has been tested and refined by thousands of developers.

Think of design patterns as architectural blueprints for building software. Just as an architect doesn't reinvent how to build a door or a window for every building, software engineers don't reinvent solutions to common problems — they use established patterns that are known to work well.

Design patterns help you communicate with other developers more effectively (saying "let's use a Singleton" immediately conveys your intent), make your code more flexible and maintainable, and avoid common pitfalls that others have already encountered and solved.

## Simple Analogy

### Design patterns are like cooking recipes

When you want to make bread, you don't invent the process from scratch. You follow a proven recipe:
- **Mix** flour, water, yeast (ingredients)
- **Knead** for 10 minutes (process)
- **Let rise** for 1 hour (timing)
- **Bake** at 375°F for 30 minutes (execution)

This recipe is a "pattern" for making bread. You can customize it (add herbs, use different flour), but the core pattern remains the same. Everyone who follows this pattern gets bread, even if the exact result varies slightly.

Similarly, design patterns are recipes for solving software problems:
- **Factory Pattern**: Recipe for "creating objects without specifying their exact class"
- **Observer Pattern**: Recipe for "notifying multiple objects when something changes"
- **Strategy Pattern**: Recipe for "switching between different algorithms at runtime"

```
Problem: "I need to create different types of objects"
    ↓
Pattern: Factory Pattern
    ↓
Solution: Use a factory method to create objects based on input
    ↓
Result: Flexible object creation without tight coupling
```

## Why Does it Matter?

### Real-World Impact

**Design patterns matter because:**

1. **Avoid reinventing the wheel**: Common problems have been solved — use those solutions
2. **Communication**: "Use Observer pattern" instantly conveys your design to other developers
3. **Proven solutions**: These patterns have been battle-tested in thousands of applications
4. **Maintainability**: Code following known patterns is easier to understand and modify
5. **Flexibility**: Patterns make code more adaptable to changing requirements
6. **Interview success**: Understanding patterns is crucial for technical interviews

**Industry reality:**
- **Enterprise applications** heavily use patterns (Singleton, Factory, Repository)
- **Web frameworks** are built on patterns (MVC is a pattern, Middleware is a pattern)
- **Game development** relies on patterns (Entity-Component, State, Observer)
- **Mobile apps** use patterns (Delegate, Singleton, MVVM)

**Career impact:**
- Pattern knowledge separates junior from senior developers
- System design interviews test pattern understanding
- Code reviews often reference patterns ("This should be a Factory")

## How It Works

### Pattern Structure

Every design pattern has:

```
┌─────────────────────────────────────────────────────────────┐
│                    Pattern Anatomy                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. NAME                                                    │
│     What we call it (e.g., "Singleton", "Factory")          │
│                                                             │
│  2. PROBLEM                                                 │
│     What problem does it solve?                             │
│                                                             │
│  3. SOLUTION                                                │
│     How does it solve the problem?                          │
│                                                             │
│  4. CONSEQUENCES                                            │
│     What are the trade-offs? (pros and cons)                │
│                                                             │
│  5. IMPLEMENTATION                                          │
│     How do you code it?                                     │
│                                                             │
│  6. USE CASES                                               │
│     When should you use it?                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pattern Categories

Design patterns are typically grouped into three categories:

```
┌────────────────────────────────────────────────────────────────┐
│                  Pattern Categories                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  CREATIONAL PATTERNS                                           │
│  How to create objects                                         │
│  ├── Singleton: Ensure only one instance exists               │
│  ├── Factory: Create objects without specifying exact class   │
│  └── Builder: Construct complex objects step by step          │
│                                                                │
│  STRUCTURAL PATTERNS                                           │
│  How to compose objects into larger structures                │
│  ├── Decorator: Add behavior to objects dynamically           │
│  ├── Adapter: Make incompatible interfaces work together      │
│  └── Facade: Simplified interface to complex system           │
│                                                                │
│  BEHAVIORAL PATTERNS                                           │
│  How objects communicate and interact                          │
│  ├── Observer: Notify objects when state changes              │
│  ├── Strategy: Switch algorithms at runtime                   │
│  └── Command: Encapsulate actions as objects                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

In this guide, we'll cover **6 essential patterns** that you'll encounter most frequently:

1. **Singleton** (Creational)
2. **Factory** (Creational)
3. **Observer** (Behavioral)
4. **Strategy** (Behavioral)
5. **Decorator** (Structural)
6. **Repository** (Architectural — special mention)

## Key Concepts

### 1. Singleton Pattern

**What**: Ensure a class has only one instance and provide a global access point to it.

**Analogy**: Like a country having only one president at a time. There can't be two presidents simultaneously — there's always exactly one, and everyone knows how to contact them (global access).

**Problem it solves**:
- You need exactly one instance of a class (database connection, configuration, logger)
- Multiple instances would cause problems (conflicts, waste resources)
- You need global access to that instance

**Structure**:

```
┌──────────────────────────────┐
│       Singleton              │
├──────────────────────────────┤
│ - _instance (private)        │
│                              │
│ + get_instance() → Singleton │
│ + business_method()          │
└──────────────────────────────┘
        ↑
        │
    All clients access same instance
```

**Implementation (Python)**:

```python
import logging
from threading import Lock

logger = logging.getLogger(__name__)

class DatabaseConnection:
    """
    Singleton database connection.

    Why Singleton:
    - Only one connection pool needed
    - Expensive to create (want to reuse)
    - Global access required
    - Thread-safe implementation
    """

    _instance = None
    _lock = Lock()

    def __new__(cls, *args, **kwargs):
        """
        Override __new__ to control instance creation.

        Thread-safe implementation:
        - Use double-checked locking
        - Prevents multiple instances in multi-threaded environment
        """
        if cls._instance is None:
            with cls._lock:
                # Double-check inside lock
                if cls._instance is None:
                    logger.info("Creating new DatabaseConnection instance")
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self, connection_string: str = "default"):
        """
        Initialize only once.

        Important: __init__ is called every time, so we track initialization.
        """
        if self._initialized:
            return

        logger.info(f"Initializing DatabaseConnection with {connection_string}")
        self.connection_string = connection_string
        self.connection_pool = self._create_connection_pool()
        self._initialized = True

    def _create_connection_pool(self):
        """Create connection pool (expensive operation)."""
        logger.info("Creating connection pool")
        # In real code: create actual database connection pool
        return {"pool": "active", "connections": 10}

    def execute_query(self, query: str):
        """
        Execute database query.

        Best Practices:
        - Log all queries for monitoring
        - Validate query before execution
        - Handle errors gracefully
        """
        logger.info(f"Executing query: {query}")

        # Validation
        if not query or not isinstance(query, str):
            logger.error("Invalid query")
            raise ValueError("Query must be non-empty string")

        # Execute (simplified)
        return f"Results for: {query}"

# Usage
def singleton_example():
    """Demonstrate Singleton pattern."""

    # First call creates instance
    db1 = DatabaseConnection("postgres://localhost/mydb")

    # Second call returns same instance
    db2 = DatabaseConnection("different_connection")  # Ignored!

    # Both are the same instance
    assert db1 is db2  # True - same object in memory

    print(f"db1 id: {id(db1)}")
    print(f"db2 id: {id(db2)}")  # Same ID

    # Global access
    result = DatabaseConnection().execute_query("SELECT * FROM users")
```

**JavaScript Implementation**:

```javascript
// Singleton in JavaScript using module pattern
class DatabaseConnection {
  constructor(connectionString = 'default') {
    // Check if instance already exists
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    // Initialize
    console.log('Creating new DatabaseConnection instance');
    this.connectionString = connectionString;
    this.connectionPool = this._createConnectionPool();

    // Store instance
    DatabaseConnection.instance = this;
  }

  _createConnectionPool() {
    console.log('Creating connection pool');
    return { pool: 'active', connections: 10 };
  }

  executeQuery(query) {
    console.log(`Executing query: ${query}`);
    if (!query) {
      throw new Error('Query must be non-empty');
    }
    return `Results for: ${query}`;
  }
}

// Usage
const db1 = new DatabaseConnection('postgres://localhost/mydb');
const db2 = new DatabaseConnection('different'); // Returns db1

console.log(db1 === db2); // true - same instance
```

**When to use Singleton**:
- ✅ Database connection pools
- ✅ Configuration managers
- ✅ Logging services
- ✅ Cache managers
- ✅ Thread pools

**When NOT to use Singleton**:
- ❌ When you might need multiple instances later
- ❌ When it makes testing difficult (global state)
- ❌ Just to avoid passing parameters (lazy solution)
- ❌ When dependency injection is more appropriate

**Common pitfall**:

```python
# ❌ BAD: Not thread-safe
class BadSingleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # Problem: Two threads can both see _instance as None
            # and create two instances!
        return cls._instance

# ✅ GOOD: Thread-safe with lock
class GoodSingleton:
    _instance = None
    _lock = Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:  # Only one thread at a time
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```

### 2. Factory Pattern

**What**: Provide an interface for creating objects without specifying their exact class.

**Analogy**: Like ordering food at a restaurant. You say "I'll have the chicken," and the kitchen (factory) decides exactly how to prepare it. You don't need to know the recipe, ingredients, or cooking method — the factory handles all that complexity.

**Problem it solves**:
- You need to create objects but don't know the exact class until runtime
- Object creation is complex (multiple steps, dependencies)
- You want to centralize object creation logic
- You want to decouple client code from concrete classes

**Structure**:

```
┌─────────────────────┐
│   Creator           │
│  (Factory)          │
├─────────────────────┤
│ + create() → Product│
└─────────────────────┘
         │ creates
         ↓
┌─────────────────────┐
│   Product           │
│  (Interface)        │
├─────────────────────┤
│ + operation()       │
└─────────────────────┘
         △
         │ implements
    ┌────┴────┐
    │         │
┌───┴───┐ ┌──┴────┐
│Product│ │Product│
│   A   │ │   B   │
└───────┘ └───────┘
```

**Implementation (Python)**:

```python
from abc import ABC, abstractmethod
from enum import Enum
import logging

logger = logging.getLogger(__name__)

# Step 1: Define product interface
class PaymentMethod(ABC):
    """
    Abstract base class for all payment methods.

    Why ABC:
    - Enforces contract (all payments must implement process)
    - Provides common interface
    - Enables polymorphism
    """

    @abstractmethod
    def process_payment(self, amount: float) -> dict:
        """Process payment - must be implemented by subclasses."""
        pass

    @abstractmethod
    def validate(self, payment_details: dict) -> bool:
        """Validate payment details - must be implemented by subclasses."""
        pass

# Step 2: Create concrete products
class CreditCardPayment(PaymentMethod):
    """Credit card payment implementation."""

    def validate(self, payment_details: dict) -> bool:
        """Validate credit card details."""
        required_fields = ["card_number", "cvv", "expiry"]

        for field in required_fields:
            if field not in payment_details:
                logger.error(f"Missing required field: {field}")
                return False

        # In real code: validate card number format, expiry date, etc.
        return True

    def process_payment(self, amount: float, payment_details: dict = None) -> dict:
        """
        Process credit card payment.

        Best Practices:
        - Validate before processing
        - Log transactions
        - Return clear results
        - Handle errors gracefully
        """
        logger.info(f"Processing credit card payment: ${amount}")

        # Validation
        if payment_details and not self.validate(payment_details):
            raise ValueError("Invalid credit card details")

        # Process (in real code: call payment gateway API)
        result = {
            "method": "credit_card",
            "amount": amount,
            "status": "success",
            "transaction_id": f"CC-{int(amount * 1000)}"
        }

        logger.info(f"Credit card payment successful: {result['transaction_id']}")
        return result

class PayPalPayment(PaymentMethod):
    """PayPal payment implementation."""

    def validate(self, payment_details: dict) -> bool:
        """Validate PayPal details."""
        if "email" not in payment_details:
            logger.error("Missing PayPal email")
            return False

        # In real code: validate email format, check PayPal account
        return True

    def process_payment(self, amount: float, payment_details: dict = None) -> dict:
        """Process PayPal payment."""
        logger.info(f"Processing PayPal payment: ${amount}")

        if payment_details and not self.validate(payment_details):
            raise ValueError("Invalid PayPal details")

        result = {
            "method": "paypal",
            "amount": amount,
            "status": "success",
            "transaction_id": f"PP-{int(amount * 1000)}"
        }

        logger.info(f"PayPal payment successful: {result['transaction_id']}")
        return result

class CryptocurrencyPayment(PaymentMethod):
    """Cryptocurrency payment implementation."""

    def validate(self, payment_details: dict) -> bool:
        """Validate cryptocurrency wallet."""
        if "wallet_address" not in payment_details:
            logger.error("Missing wallet address")
            return False
        return True

    def process_payment(self, amount: float, payment_details: dict = None) -> dict:
        """Process cryptocurrency payment."""
        logger.info(f"Processing crypto payment: ${amount}")

        if payment_details and not self.validate(payment_details):
            raise ValueError("Invalid crypto wallet")

        result = {
            "method": "cryptocurrency",
            "amount": amount,
            "status": "pending",  # Crypto takes time to confirm
            "transaction_id": f"CRYPTO-{int(amount * 1000)}"
        }

        logger.info(f"Crypto payment initiated: {result['transaction_id']}")
        return result

# Step 3: Create factory
class PaymentMethodType(Enum):
    """Enum for payment method types."""
    CREDIT_CARD = "credit_card"
    PAYPAL = "paypal"
    CRYPTOCURRENCY = "cryptocurrency"

class PaymentFactory:
    """
    Factory for creating payment method objects.

    Why Factory:
    - Centralizes creation logic
    - Client doesn't need to know concrete classes
    - Easy to add new payment methods
    - Validation before creation
    """

    @staticmethod
    def create_payment_method(payment_type: PaymentMethodType) -> PaymentMethod:
        """
        Create payment method based on type.

        Best Practices:
        - Validate input
        - Log creation
        - Raise clear errors for invalid types
        - Return interface type (PaymentMethod)
        """
        logger.info(f"Creating payment method: {payment_type.value}")

        # Factory decision logic
        if payment_type == PaymentMethodType.CREDIT_CARD:
            return CreditCardPayment()

        elif payment_type == PaymentMethodType.PAYPAL:
            return PayPalPayment()

        elif payment_type == PaymentMethodType.CRYPTOCURRENCY:
            return CryptocurrencyPayment()

        else:
            logger.error(f"Unknown payment type: {payment_type}")
            raise ValueError(f"Unsupported payment type: {payment_type}")

    @staticmethod
    def create_payment_method_from_string(payment_type_str: str) -> PaymentMethod:
        """
        Create payment method from string (convenience method).

        Useful for web APIs where type comes as string.
        """
        try:
            payment_type = PaymentMethodType(payment_type_str)
            return PaymentFactory.create_payment_method(payment_type)
        except ValueError:
            logger.error(f"Invalid payment type string: {payment_type_str}")
            raise ValueError(f"Invalid payment type: {payment_type_str}")

# Usage
def factory_example():
    """Demonstrate Factory pattern."""

    # Client code doesn't know about concrete classes
    # Just asks factory for what it needs

    # Create credit card payment
    payment1 = PaymentFactory.create_payment_method(
        PaymentMethodType.CREDIT_CARD
    )
    result1 = payment1.process_payment(100.00)
    print(f"Payment 1: {result1}")

    # Create PayPal payment
    payment2 = PaymentFactory.create_payment_method(
        PaymentMethodType.PAYPAL
    )
    result2 = payment2.process_payment(50.00)
    print(f"Payment 2: {result2}")

    # Create from string (useful for web APIs)
    payment3 = PaymentFactory.create_payment_method_from_string("cryptocurrency")
    result3 = payment3.process_payment(200.00)
    print(f"Payment 3: {result3}")

    # All payments share same interface
    payments = [payment1, payment2, payment3]
    for payment in payments:
        # Polymorphism - same method, different implementations
        result = payment.process_payment(10.00)
        print(result)

    # Easy to add new payment method:
    # 1. Create new class implementing PaymentMethod
    # 2. Add to PaymentMethodType enum
    # 3. Update factory create method
    # Client code doesn't need to change!
```

**JavaScript Implementation**:

```javascript
// Abstract payment method (interface)
class PaymentMethod {
  processPayment(amount) {
    throw new Error('Must implement processPayment');
  }

  validate(paymentDetails) {
    throw new Error('Must implement validate');
  }
}

// Concrete implementations
class CreditCardPayment extends PaymentMethod {
  validate(paymentDetails) {
    return paymentDetails.cardNumber && paymentDetails.cvv;
  }

  processPayment(amount, paymentDetails) {
    console.log(`Processing credit card payment: $${amount}`);
    if (paymentDetails && !this.validate(paymentDetails)) {
      throw new Error('Invalid credit card details');
    }
    return {
      method: 'credit_card',
      amount,
      status: 'success',
      transactionId: `CC-${Math.floor(amount * 1000)}`
    };
  }
}

class PayPalPayment extends PaymentMethod {
  validate(paymentDetails) {
    return paymentDetails.email;
  }

  processPayment(amount, paymentDetails) {
    console.log(`Processing PayPal payment: $${amount}`);
    if (paymentDetails && !this.validate(paymentDetails)) {
      throw new Error('Invalid PayPal details');
    }
    return {
      method: 'paypal',
      amount,
      status: 'success',
      transactionId: `PP-${Math.floor(amount * 1000)}`
    };
  }
}

// Factory
class PaymentFactory {
  static createPaymentMethod(paymentType) {
    console.log(`Creating payment method: ${paymentType}`);

    switch (paymentType) {
      case 'credit_card':
        return new CreditCardPayment();
      case 'paypal':
        return new PayPalPayment();
      default:
        throw new Error(`Unsupported payment type: ${paymentType}`);
    }
  }
}

// Usage
const payment1 = PaymentFactory.createPaymentMethod('credit_card');
const result1 = payment1.processPayment(100);
console.log(result1);

const payment2 = PaymentFactory.createPaymentMethod('paypal');
const result2 = payment2.processPayment(50);
console.log(result2);
```

**When to use Factory**:
- ✅ Creating different types of objects based on input
- ✅ Complex object creation with many dependencies
- ✅ Want to hide concrete classes from client
- ✅ Need to add new types without changing client code
- ✅ Database connections (MySQL, PostgreSQL, MongoDB)
- ✅ Document parsers (PDF, Word, Excel)
- ✅ Logger implementations (file, console, remote)

**When NOT to use Factory**:
- ❌ Simple object creation (just use constructor)
- ❌ Only one type of object
- ❌ No variation in creation logic

### 3. Observer Pattern

**What**: Define a one-to-many relationship between objects so that when one object changes state, all its dependents are notified automatically.

**Analogy**: Like subscribing to a YouTube channel. When the channel (subject) uploads a new video (state change), all subscribers (observers) get notified automatically. Subscribers can join or leave anytime, and the channel doesn't need to know who they are — it just sends notifications to whoever is subscribed.

**Problem it solves**:
- You need to notify multiple objects when something changes
- You don't know ahead of time who needs to be notified
- You want loose coupling (objects don't need to know about each other)
- You need real-time updates across system

**Structure**:

```
┌──────────────────────┐        ┌──────────────────────┐
│      Subject         │        │      Observer        │
├──────────────────────┤        ├──────────────────────┤
│ - observers: List    │        │                      │
│                      │        │ + update(data)       │
│ + attach(observer)   │        │                      │
│ + detach(observer)   │        └──────────────────────┘
│ + notify()           │                  △
└──────────────────────┘                  │
         │                           implements
         │ notifies                       │
         └─────────────────┬──────────────┤
                           │              │
                    ┌──────┴─────┐ ┌─────┴──────┐
                    │ Concrete   │ │ Concrete   │
                    │ Observer A │ │ Observer B │
                    └────────────┘ └────────────┘
```

**Implementation (Python)**:

```python
from abc import ABC, abstractmethod
from typing import List, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Step 1: Define Observer interface
class Observer(ABC):
    """
    Observer interface.

    All observers must implement update method.
    """

    @abstractmethod
    def update(self, subject: Any, data: dict) -> None:
        """
        Called when subject changes.

        Args:
            subject: The subject that changed
            data: Information about the change
        """
        pass

# Step 2: Define Subject (Observable)
class Subject:
    """
    Subject that observers can subscribe to.

    Why this works:
    - Maintains list of observers
    - Notifies all observers when state changes
    - Observers can attach/detach dynamically
    """

    def __init__(self):
        self._observers: List[Observer] = []

    def attach(self, observer: Observer) -> None:
        """
        Add observer to list.

        Best Practice: Check for duplicates.
        """
        if observer not in self._observers:
            self._observers.append(observer)
            logger.info(f"Observer attached: {observer.__class__.__name__}")
        else:
            logger.warning(f"Observer already attached: {observer.__class__.__name__}")

    def detach(self, observer: Observer) -> None:
        """Remove observer from list."""
        try:
            self._observers.remove(observer)
            logger.info(f"Observer detached: {observer.__class__.__name__}")
        except ValueError:
            logger.warning(f"Observer not found: {observer.__class__.__name__}")

    def notify(self, data: dict = None) -> None:
        """
        Notify all observers of change.

        Best Practices:
        - Log notifications
        - Handle observer errors gracefully (don't let one break others)
        - Pass relevant data to observers
        """
        logger.info(f"Notifying {len(self._observers)} observers")

        for observer in self._observers:
            try:
                observer.update(self, data or {})
            except Exception as e:
                # Don't let one observer's error break notification chain
                logger.error(
                    f"Error notifying {observer.__class__.__name__}: {e}",
                    exc_info=True
                )

# Step 3: Create concrete subject (e.g., Stock price)
class StockPrice(Subject):
    """
    Stock price that observers can watch.

    Real-world use case: Trading application.
    """

    def __init__(self, symbol: str, initial_price: float):
        super().__init__()
        self._symbol = symbol
        self._price = initial_price
        self._last_updated = datetime.now()

    @property
    def symbol(self) -> str:
        """Get stock symbol."""
        return self._symbol

    @property
    def price(self) -> float:
        """Get current price."""
        return self._price

    @price.setter
    def price(self, new_price: float) -> None:
        """
        Set new price and notify observers.

        Best Practices:
        - Validate input
        - Calculate change
        - Include context in notification
        - Log business event
        """
        if new_price <= 0:
            logger.error(f"Invalid price: {new_price}")
            raise ValueError("Price must be positive")

        old_price = self._price
        self._price = new_price
        self._last_updated = datetime.now()

        # Calculate change
        change = new_price - old_price
        change_percent = (change / old_price) * 100

        logger.info(
            f"{self._symbol} price changed: "
            f"${old_price:.2f} → ${new_price:.2f} "
            f"({change_percent:+.2f}%)"
        )

        # Notify with context
        self.notify({
            "symbol": self._symbol,
            "old_price": old_price,
            "new_price": new_price,
            "change": change,
            "change_percent": change_percent,
            "timestamp": self._last_updated
        })

# Step 4: Create concrete observers
class EmailAlert(Observer):
    """
    Email alert observer.

    Sends email when stock price changes significantly.
    """

    def __init__(self, email: str, threshold_percent: float = 5.0):
        self.email = email
        self.threshold_percent = threshold_percent

    def update(self, subject: StockPrice, data: dict) -> None:
        """
        Send email if change exceeds threshold.

        Best Practices:
        - Check conditions before acting
        - Log actions
        - Handle errors
        """
        change_percent = abs(data.get("change_percent", 0))

        if change_percent >= self.threshold_percent:
            self._send_email(subject, data)

    def _send_email(self, subject: StockPrice, data: dict) -> None:
        """Send email alert."""
        logger.info(
            f"📧 Sending email to {self.email}: "
            f"{subject.symbol} changed by {data['change_percent']:+.2f}%"
        )
        # In real code: actually send email using SMTP or service

class MobilePushNotification(Observer):
    """
    Mobile push notification observer.

    Sends push notification to mobile app.
    """

    def __init__(self, device_id: str):
        self.device_id = device_id

    def update(self, subject: StockPrice, data: dict) -> None:
        """Send push notification for any change."""
        self._send_push(subject, data)

    def _send_push(self, subject: StockPrice, data: dict) -> None:
        """Send push notification."""
        logger.info(
            f"📱 Sending push to device {self.device_id}: "
            f"{subject.symbol} now ${data['new_price']:.2f}"
        )
        # In real code: use push notification service (Firebase, etc.)

class DatabaseLogger(Observer):
    """
    Database logger observer.

    Records all price changes to database.
    """

    def __init__(self, db_connection):
        self.db = db_connection

    def update(self, subject: StockPrice, data: dict) -> None:
        """Log price change to database."""
        logger.info(
            f"💾 Logging to database: {subject.symbol} price change"
        )

        # In real code: INSERT INTO price_history...
        record = {
            "symbol": data["symbol"],
            "old_price": data["old_price"],
            "new_price": data["new_price"],
            "change_percent": data["change_percent"],
            "timestamp": data["timestamp"]
        }

        logger.debug(f"Database record: {record}")

class TradingBot(Observer):
    """
    Trading bot observer.

    Automatically trades based on price changes.
    """

    def __init__(self, strategy: str):
        self.strategy = strategy

    def update(self, subject: StockPrice, data: dict) -> None:
        """
        Execute trading strategy.

        Best Practice: Add safety checks before trading.
        """
        change_percent = data["change_percent"]

        if self.strategy == "buy_dip" and change_percent < -5:
            self._buy(subject, data)
        elif self.strategy == "sell_peak" and change_percent > 5:
            self._sell(subject, data)

    def _buy(self, subject: StockPrice, data: dict) -> None:
        """Execute buy order."""
        logger.info(
            f"🤖 Bot buying {subject.symbol} at ${data['new_price']:.2f} "
            f"(down {abs(data['change_percent']):.2f}%)"
        )

    def _sell(self, subject: StockPrice, data: dict) -> None:
        """Execute sell order."""
        logger.info(
            f"🤖 Bot selling {subject.symbol} at ${data['new_price']:.2f} "
            f"(up {data['change_percent']:.2f}%)"
        )

# Usage
def observer_example():
    """Demonstrate Observer pattern."""

    # Create subject (stock)
    aapl = StockPrice("AAPL", 150.00)

    # Create observers
    email_alert = EmailAlert("trader@example.com", threshold_percent=5.0)
    push_notification = MobilePushNotification("device123")
    db_logger = DatabaseLogger("fake_db_connection")
    trading_bot = TradingBot("buy_dip")

    # Attach observers
    aapl.attach(email_alert)
    aapl.attach(push_notification)
    aapl.attach(db_logger)
    aapl.attach(trading_bot)

    print("=== Initial price: $150.00 ===\n")

    # Change price (all observers notified automatically)
    print("=== Small change: +2% ===")
    aapl.price = 153.00  # +2% - only push and db logger react

    print("\n=== Large drop: -7% ===")
    aapl.price = 139.50  # -7% - all observers react

    print("\n=== Large increase: +10% ===")
    aapl.price = 165.00  # +10% - email, push, db, trading bot react

    # Observers can unsubscribe
    print("\n=== Detaching trading bot ===")
    aapl.detach(trading_bot)

    print("\n=== After detaching bot ===")
    aapl.price = 130.00  # Bot no longer receives updates

    # Benefits demonstrated:
    # - Loose coupling (observers don't know about each other)
    # - Dynamic subscriptions (can add/remove at runtime)
    # - Single responsibility (each observer has one job)
    # - Open/closed principle (add new observers without changing stock class)
```

**When to use Observer**:
- ✅ Event handling systems
- ✅ Pub/sub messaging
- ✅ UI updates (model changes → view updates)
- ✅ Stock/price monitoring
- ✅ Notification systems
- ✅ Real-time dashboards
- ✅ Chat applications

**When NOT to use Observer**:
- ❌ Simple, direct relationships (just call method directly)
- ❌ Guaranteed delivery needed (Observer can't ensure delivery)
- ❌ Order of notifications matters (Observer order is undefined)

**Common pitfall**:

```python
# ❌ BAD: Memory leak - observers not detached
class LeakyObserver(Observer):
    def update(self, subject, data):
        pass

# Create many observers but never detach
stock = StockPrice("AAPL", 150)
for i in range(1000):
    observer = LeakyObserver()
    stock.attach(observer)
    # observer goes out of scope but still referenced by stock!
    # Memory leak!

# ✅ GOOD: Detach when done
for i in range(1000):
    observer = LeakyObserver()
    stock.attach(observer)
    # ... use observer ...
    stock.detach(observer)  # Clean up!

# Or use weak references
import weakref

class Subject:
    def __init__(self):
        self._observers = weakref.WeakSet()  # Auto-removes when deleted

    def attach(self, observer):
        self._observers.add(observer)

    def notify(self, data=None):
        for observer in self._observers:
            observer.update(self, data)
```

### 4. Strategy Pattern

**What**: Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.

**Analogy**: Like choosing how to travel to work. You have multiple strategies (walk, bike, drive, train), and you choose based on conditions (weather, distance, traffic). The destination is the same, but the strategy (algorithm) for getting there changes. You can switch strategies dynamically — walk on nice days, drive when raining.

**Problem it solves**:
- Multiple ways to do the same thing (different algorithms)
- Avoid lots of if/else or switch statements
- Algorithm needs to change at runtime
- Want to add new algorithms without changing existing code

**Structure**:

```
┌────────────────────────┐
│       Context          │
├────────────────────────┤
│ - strategy: Strategy   │
│                        │
│ + set_strategy()       │
│ + execute_strategy()   │
└────────────────────────┘
         │ uses
         ↓
┌────────────────────────┐
│      Strategy          │
│     (Interface)        │
├────────────────────────┤
│ + execute()            │
└────────────────────────┘
         △
         │ implements
    ┌────┴────┬────────┐
    │         │        │
┌───┴────┐ ┌─┴────┐ ┌─┴────┐
│Strategy│ │Strategy│ │Strategy│
│   A    │ │   B    │ │   C    │
└────────┘ └────────┘ └────────┘
```

**Implementation (Python)**:

```python
from abc import ABC, abstractmethod
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# Step 1: Define Strategy interface
class DiscountStrategy(ABC):
    """
    Abstract discount strategy.

    All discount strategies must implement calculate_discount.
    """

    @abstractmethod
    def calculate_discount(self, order_total: float,
                          customer_data: dict) -> float:
        """
        Calculate discount amount.

        Args:
            order_total: Total order amount
            customer_data: Customer information (for personalization)

        Returns:
            Discount amount
        """
        pass

# Step 2: Create concrete strategies
class NoDiscountStrategy(DiscountStrategy):
    """No discount - regular price."""

    def calculate_discount(self, order_total: float,
                          customer_data: dict) -> float:
        """No discount applied."""
        logger.info("No discount strategy: $0.00 discount")
        return 0.0

class PercentageDiscountStrategy(DiscountStrategy):
    """Fixed percentage discount."""

    def __init__(self, percentage: float):
        """
        Initialize with discount percentage.

        Args:
            percentage: Discount percentage (0-100)
        """
        if not 0 <= percentage <= 100:
            raise ValueError("Percentage must be between 0 and 100")

        self.percentage = percentage

    def calculate_discount(self, order_total: float,
                          customer_data: dict) -> float:
        """Calculate percentage discount."""
        discount = order_total * (self.percentage / 100)

        logger.info(
            f"Percentage discount ({self.percentage}%): ${discount:.2f}"
        )

        return discount

class LoyaltyDiscountStrategy(DiscountStrategy):
    """Discount based on customer loyalty tier."""

    TIER_DISCOUNTS = {
        "bronze": 5.0,   # 5%
        "silver": 10.0,  # 10%
        "gold": 15.0,    # 15%
        "platinum": 20.0 # 20%
    }

    def calculate_discount(self, order_total: float,
                          customer_data: dict) -> float:
        """
        Calculate loyalty discount based on customer tier.

        Best Practice: Handle missing data gracefully.
        """
        tier = customer_data.get("loyalty_tier", "bronze")
        percentage = self.TIER_DISCOUNTS.get(tier, 0.0)

        discount = order_total * (percentage / 100)

        logger.info(
            f"Loyalty discount ({tier} tier, {percentage}%): ${discount:.2f}"
        )

        return discount

class BulkDiscountStrategy(DiscountStrategy):
    """Discount based on order size (bulk discount)."""

    def __init__(self, thresholds: List[tuple]):
        """
        Initialize with discount thresholds.

        Args:
            thresholds: List of (min_amount, discount_percent) tuples
                       Example: [(100, 5), (500, 10), (1000, 15)]
        """
        # Sort by amount descending (check largest first)
        self.thresholds = sorted(thresholds, key=lambda x: x[0], reverse=True)

    def calculate_discount(self, order_total: float,
                          customer_data: dict) -> float:
        """
        Calculate bulk discount based on order total.

        Logic: Find highest threshold that applies.
        """
        for min_amount, discount_percent in self.thresholds:
            if order_total >= min_amount:
                discount = order_total * (discount_percent / 100)

                logger.info(
                    f"Bulk discount (${min_amount}+ tier, {discount_percent}%): "
                    f"${discount:.2f}"
                )

                return discount

        # No threshold met
        logger.info("Bulk discount: No threshold met, $0.00 discount")
        return 0.0

class SeasonalDiscountStrategy(DiscountStrategy):
    """Discount for seasonal promotions."""

    def __init__(self, base_percentage: float, multiplier: float = 1.0):
        """
        Initialize seasonal discount.

        Args:
            base_percentage: Base discount percentage
            multiplier: Seasonal multiplier (e.g., 2.0 for double discount)
        """
        self.base_percentage = base_percentage
        self.multiplier = multiplier

    def calculate_discount(self, order_total: float,
                          customer_data: dict) -> float:
        """Calculate seasonal discount."""
        effective_percentage = self.base_percentage * self.multiplier
        discount = order_total * (effective_percentage / 100)

        logger.info(
            f"Seasonal discount ({effective_percentage:.1f}%): ${discount:.2f}"
        )

        return discount

# Step 3: Create Context that uses strategies
class ShoppingCart:
    """
    Shopping cart that can use different discount strategies.

    Why Strategy Pattern:
    - Can change discount algorithm at runtime
    - Easy to add new discount strategies
    - Discount logic separated from cart logic
    """

    def __init__(self, discount_strategy: DiscountStrategy = None):
        self.items: List[Dict] = []
        self._discount_strategy = discount_strategy or NoDiscountStrategy()

    def add_item(self, name: str, price: float, quantity: int = 1):
        """Add item to cart."""
        if price <= 0:
            raise ValueError("Price must be positive")
        if quantity <= 0:
            raise ValueError("Quantity must be positive")

        self.items.append({
            "name": name,
            "price": price,
            "quantity": quantity
        })

        logger.info(f"Added to cart: {quantity}x {name} @ ${price}")

    def set_discount_strategy(self, strategy: DiscountStrategy):
        """
        Change discount strategy at runtime.

        This is the key to Strategy pattern - switchable algorithms!
        """
        self._discount_strategy = strategy
        logger.info(f"Discount strategy changed to: {strategy.__class__.__name__}")

    def calculate_subtotal(self) -> float:
        """Calculate subtotal (before discount)."""
        return sum(item["price"] * item["quantity"] for item in self.items)

    def calculate_discount(self, customer_data: dict = None) -> float:
        """
        Calculate discount using current strategy.

        Delegates to strategy object.
        """
        subtotal = self.calculate_subtotal()
        return self._discount_strategy.calculate_discount(
            subtotal,
            customer_data or {}
        )

    def calculate_total(self, customer_data: dict = None) -> float:
        """
        Calculate final total (subtotal - discount).

        Best Practices:
        - Log calculations
        - Return rounded values
        - Pass customer data for personalization
        """
        subtotal = self.calculate_subtotal()
        discount = self.calculate_discount(customer_data)
        total = subtotal - discount

        logger.info(
            f"Order summary: "
            f"Subtotal=${subtotal:.2f}, "
            f"Discount=${discount:.2f}, "
            f"Total=${total:.2f}"
        )

        return round(total, 2)

    def checkout(self, customer_data: dict = None) -> dict:
        """
        Checkout and return order summary.

        Returns complete order details.
        """
        subtotal = self.calculate_subtotal()
        discount = self.calculate_discount(customer_data)
        total = subtotal - discount

        order = {
            "items": self.items.copy(),
            "subtotal": subtotal,
            "discount": discount,
            "total": total,
            "discount_strategy": self._discount_strategy.__class__.__name__
        }

        logger.info(
            f"Checkout complete: {len(self.items)} items, "
            f"Total: ${total:.2f}"
        )

        return order

# Usage
def strategy_example():
    """Demonstrate Strategy pattern."""

    # Create cart
    cart = ShoppingCart()

    # Add items
    cart.add_item("Laptop", 1000.00, 1)
    cart.add_item("Mouse", 25.00, 2)
    cart.add_item("Keyboard", 75.00, 1)

    subtotal = cart.calculate_subtotal()
    print(f"Subtotal: ${subtotal:.2f}\n")

    # Strategy 1: No discount
    print("=== No Discount ===")
    cart.set_discount_strategy(NoDiscountStrategy())
    total1 = cart.calculate_total()
    print(f"Total: ${total1:.2f}\n")

    # Strategy 2: 10% off everything
    print("=== 10% Percentage Discount ===")
    cart.set_discount_strategy(PercentageDiscountStrategy(10.0))
    total2 = cart.calculate_total()
    print(f"Total: ${total2:.2f}\n")

    # Strategy 3: Loyalty discount (customer-specific)
    print("=== Loyalty Discount ===")
    cart.set_discount_strategy(LoyaltyDiscountStrategy())

    gold_customer = {"loyalty_tier": "gold", "name": "Alice"}
    total3 = cart.calculate_total(gold_customer)
    print(f"Total (Gold member): ${total3:.2f}\n")

    bronze_customer = {"loyalty_tier": "bronze", "name": "Bob"}
    total4 = cart.calculate_total(bronze_customer)
    print(f"Total (Bronze member): ${total4:.2f}\n")

    # Strategy 4: Bulk discount
    print("=== Bulk Discount ===")
    bulk_thresholds = [
        (1000, 10),  # $1000+: 10% off
        (500, 5),    # $500+: 5% off
        (100, 2)     # $100+: 2% off
    ]
    cart.set_discount_strategy(BulkDiscountStrategy(bulk_thresholds))
    total5 = cart.calculate_total()
    print(f"Total: ${total5:.2f}\n")

    # Strategy 5: Seasonal (Black Friday - double discount)
    print("=== Black Friday - Double Discount ===")
    cart.set_discount_strategy(SeasonalDiscountStrategy(10.0, multiplier=2.0))
    total6 = cart.calculate_total()
    print(f"Total: ${total6:.2f}\n")

    # Benefits demonstrated:
    # - Easy to switch algorithms at runtime
    # - Each strategy is independent and testable
    # - Adding new strategies doesn't change cart code
    # - Eliminates complex if/else chains

# Real-world example: Shipping calculation
class ShippingStrategy(ABC):
    """Abstract shipping strategy."""

    @abstractmethod
    def calculate_cost(self, weight_kg: float, distance_km: float) -> float:
        """Calculate shipping cost."""
        pass

    @abstractmethod
    def estimated_days(self) -> int:
        """Estimated delivery days."""
        pass

class StandardShippingStrategy(ShippingStrategy):
    """Standard shipping - slow and cheap."""

    def calculate_cost(self, weight_kg: float, distance_km: float) -> float:
        """$0.50 per kg + $0.01 per km."""
        return (weight_kg * 0.50) + (distance_km * 0.01)

    def estimated_days(self) -> int:
        """5-7 business days."""
        return 7

class ExpressShippingStrategy(ShippingStrategy):
    """Express shipping - fast and expensive."""

    def calculate_cost(self, weight_kg: float, distance_km: float) -> float:
        """$2.00 per kg + $0.05 per km."""
        return (weight_kg * 2.00) + (distance_km * 0.05)

    def estimated_days(self) -> int:
        """1-2 business days."""
        return 2

class OvernightShippingStrategy(ShippingStrategy):
    """Overnight shipping - fastest and most expensive."""

    def calculate_cost(self, weight_kg: float, distance_km: float) -> float:
        """$5.00 per kg + $0.10 per km + $20 flat fee."""
        return (weight_kg * 5.00) + (distance_km * 0.10) + 20.00

    def estimated_days(self) -> int:
        """Next day."""
        return 1

# Usage - easily switch shipping methods
def shipping_example():
    """Demonstrate shipping strategies."""

    weight = 5.0  # kg
    distance = 500.0  # km

    strategies = [
        StandardShippingStrategy(),
        ExpressShippingStrategy(),
        OvernightShippingStrategy()
    ]

    for strategy in strategies:
        cost = strategy.calculate_cost(weight, distance)
        days = strategy.estimated_days()
        print(
            f"{strategy.__class__.__name__}: "
            f"${cost:.2f}, {days} days"
        )
```

**When to use Strategy**:
- ✅ Multiple algorithms for same task
- ✅ Need to switch algorithms at runtime
- ✅ Avoid complex conditional statements
- ✅ Payment processing (different payment methods)
- ✅ Sorting (different algorithms)
- ✅ Compression (different algorithms)
- ✅ Validation (different rules)
- ✅ Pricing/discounts (different strategies)

**When NOT to use Strategy**:
- ❌ Only one algorithm
- ❌ Algorithm never changes
- ❌ Simple if/else is clearer

### 5. Decorator Pattern

**What**: Attach additional responsibilities to an object dynamically without changing its structure.

**Analogy**: Like customizing a coffee order. You start with plain coffee (base object), then add decorations: milk, sugar, whipped cream, caramel. Each addition wraps the previous one, adding behavior (flavor) and cost. You can add decorations in any order and combination, and the base coffee object never changes — it's just wrapped.

**Problem it solves**:
- Add functionality to objects without modifying their class
- Add features dynamically at runtime
- Avoid explosion of subclasses (avoid creating CoffeeWithMilk, CoffeeWithMilkAndSugar, etc.)
- Follow Open/Closed Principle (open for extension, closed for modification)

**Structure**:

```
┌─────────────────────┐
│    Component        │
│   (Interface)       │
├─────────────────────┤
│ + operation()       │
└─────────────────────┘
         △
         │
    ┌────┴────────────────┐
    │                     │
┌───┴────────┐   ┌────────┴────────┐
│  Concrete  │   │    Decorator    │
│ Component  │   │   (Abstract)    │
└────────────┘   ├─────────────────┤
                 │ - component     │
                 │                 │
                 │ + operation()   │
                 └─────────────────┘
                          △
                          │
                   ┌──────┴──────┐
                   │             │
            ┌──────┴──────┐ ┌───┴────────┐
            │  Concrete   │ │  Concrete  │
            │ Decorator A │ │ Decorator B│
            └─────────────┘ └────────────┘
```

**Implementation (Python)**:

```python
from abc import ABC, abstractmethod
import logging
import time
from functools import wraps
from typing import Callable

logger = logging.getLogger(__name__)

# Example 1: Coffee shop (classic decorator example)

# Step 1: Define component interface
class Coffee(ABC):
    """Abstract coffee component."""

    @abstractmethod
    def get_description(self) -> str:
        """Get coffee description."""
        pass

    @abstractmethod
    def get_cost(self) -> float:
        """Get coffee cost."""
        pass

# Step 2: Create concrete component
class SimpleCoffee(Coffee):
    """Basic coffee - no additions."""

    def get_description(self) -> str:
        """Plain coffee."""
        return "Simple Coffee"

    def get_cost(self) -> float:
        """Base price."""
        return 2.00

# Step 3: Create abstract decorator
class CoffeeDecorator(Coffee):
    """
    Base decorator for coffee add-ons.

    Wraps a Coffee object and delegates to it.
    """

    def __init__(self, coffee: Coffee):
        self._coffee = coffee

    def get_description(self) -> str:
        """Delegate to wrapped coffee."""
        return self._coffee.get_description()

    def get_cost(self) -> float:
        """Delegate to wrapped coffee."""
        return self._coffee.get_cost()

# Step 4: Create concrete decorators
class MilkDecorator(CoffeeDecorator):
    """Add milk to coffee."""

    def get_description(self) -> str:
        """Add milk to description."""
        return self._coffee.get_description() + ", Milk"

    def get_cost(self) -> float:
        """Add milk cost."""
        return self._coffee.get_cost() + 0.50

class SugarDecorator(CoffeeDecorator):
    """Add sugar to coffee."""

    def get_description(self) -> str:
        """Add sugar to description."""
        return self._coffee.get_description() + ", Sugar"

    def get_cost(self) -> float:
        """Add sugar cost."""
        return self._coffee.get_cost() + 0.25

class WhippedCreamDecorator(CoffeeDecorator):
    """Add whipped cream to coffee."""

    def get_description(self) -> str:
        """Add whipped cream to description."""
        return self._coffee.get_description() + ", Whipped Cream"

    def get_cost(self) -> float:
        """Add whipped cream cost."""
        return self._coffee.get_cost() + 0.75

class CaramelDecorator(CoffeeDecorator):
    """Add caramel to coffee."""

    def get_description(self) -> str:
        """Add caramel to description."""
        return self._coffee.get_description() + ", Caramel"

    def get_cost(self) -> float:
        """Add caramel cost."""
        return self._coffee.get_cost() + 1.00

# Usage
def coffee_decorator_example():
    """Demonstrate coffee decorators."""

    # Start with simple coffee
    coffee = SimpleCoffee()
    print(f"{coffee.get_description()}: ${coffee.get_cost():.2f}")

    # Add milk
    coffee_with_milk = MilkDecorator(coffee)
    print(f"{coffee_with_milk.get_description()}: ${coffee_with_milk.get_cost():.2f}")

    # Add sugar to milk coffee
    coffee_with_milk_and_sugar = SugarDecorator(coffee_with_milk)
    print(f"{coffee_with_milk_and_sugar.get_description()}: "
          f"${coffee_with_milk_and_sugar.get_cost():.2f}")

    # Complex order: milk + sugar + whipped cream + caramel
    fancy_coffee = CaramelDecorator(
        WhippedCreamDecorator(
            SugarDecorator(
                MilkDecorator(
                    SimpleCoffee()
                )
            )
        )
    )
    print(f"{fancy_coffee.get_description()}: ${fancy_coffee.get_cost():.2f}")

    # Benefits:
    # - Can combine decorators in any order
    # - Can add multiple of same decorator
    # - Don't need separate class for each combination
    # - Base coffee class unchanged

# Example 2: Function decorators (Python-specific, but similar concept)

def log_execution(func: Callable) -> Callable:
    """
    Decorator to log function execution.

    Why decorator:
    - Adds logging without modifying function
    - Reusable across many functions
    - Clean syntax with @decorator
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")

        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start

        logger.info(f"{func.__name__} completed in {duration:.3f}s")

        return result

    return wrapper

def validate_inputs(func: Callable) -> Callable:
    """
    Decorator to validate function inputs.

    Adds input validation without modifying function.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Validate args are positive numbers
        for arg in args:
            if not isinstance(arg, (int, float)) or arg <= 0:
                raise ValueError(f"Invalid input: {arg}. Must be positive number.")

        return func(*args, **kwargs)

    return wrapper

def cache_result(func: Callable) -> Callable:
    """
    Decorator to cache function results.

    Adds caching without modifying function.
    """
    cache = {}

    @wraps(func)
    def wrapper(*args):
        if args in cache:
            logger.info(f"Cache hit for {func.__name__}{args}")
            return cache[args]

        logger.info(f"Cache miss for {func.__name__}{args}")
        result = func(*args)
        cache[args] = result

        return result

    return wrapper

# Stack multiple decorators
@log_execution
@validate_inputs
@cache_result
def calculate_price(quantity: int, unit_price: float) -> float:
    """
    Calculate total price.

    This function is decorated with:
    - Logging
    - Input validation
    - Result caching

    All without modifying the function itself!
    """
    logger.info(f"Computing price: {quantity} × ${unit_price}")
    return quantity * unit_price

# Usage
def function_decorator_example():
    """Demonstrate function decorators."""

    # First call: logs, validates, caches
    result1 = calculate_price(10, 5.0)
    print(f"Result 1: ${result1:.2f}\n")

    # Second call with same args: uses cache
    result2 = calculate_price(10, 5.0)
    print(f"Result 2: ${result2:.2f}\n")

    # Different args: new calculation
    result3 = calculate_price(20, 3.0)
    print(f"Result 3: ${result3:.2f}\n")

    # Invalid input: caught by validator
    try:
        result4 = calculate_price(-5, 10.0)
    except ValueError as e:
        print(f"Validation error: {e}")

# Example 3: Text formatting decorators
class Text:
    """Text component."""

    def __init__(self, content: str):
        self._content = content

    def render(self) -> str:
        """Render text."""
        return self._content

class TextDecorator(Text):
    """Base text decorator."""

    def __init__(self, text: Text):
        self._text = text

    def render(self) -> str:
        """Delegate to wrapped text."""
        return self._text.render()

class BoldDecorator(TextDecorator):
    """Make text bold."""

    def render(self) -> str:
        """Wrap in bold tags."""
        return f"<b>{self._text.render()}</b>"

class ItalicDecorator(TextDecorator):
    """Make text italic."""

    def render(self) -> str:
        """Wrap in italic tags."""
        return f"<i>{self._text.render()}</i>"

class UnderlineDecorator(TextDecorator):
    """Underline text."""

    def render(self) -> str:
        """Wrap in underline tags."""
        return f"<u>{self._text.render()}</u>"

class ColorDecorator(TextDecorator):
    """Add color to text."""

    def __init__(self, text: Text, color: str):
        super().__init__(text)
        self.color = color

    def render(self) -> str:
        """Wrap in color tags."""
        return f'<span style="color:{self.color}">{self._text.render()}</span>'

# Usage
def text_decorator_example():
    """Demonstrate text decorators."""

    # Plain text
    text = Text("Hello World")
    print(text.render())

    # Bold
    bold_text = BoldDecorator(text)
    print(bold_text.render())

    # Bold + Italic
    bold_italic_text = ItalicDecorator(BoldDecorator(text))
    print(bold_italic_text.render())

    # Bold + Italic + Underline + Red
    fancy_text = ColorDecorator(
        UnderlineDecorator(
            ItalicDecorator(
                BoldDecorator(text)
            )
        ),
        "red"
    )
    print(fancy_text.render())
    # Output: <span style="color:red"><u><i><b>Hello World</b></i></u></span>
```

**When to use Decorator**:
- ✅ Add behavior to objects dynamically
- ✅ Avoid subclass explosion
- ✅ Combine behaviors flexibly
- ✅ Logging, caching, validation
- ✅ UI components (borders, scroll bars)
- ✅ Data streams (compression, encryption)
- ✅ Authentication/authorization

**When NOT to use Decorator**:
- ❌ Simple enhancement (just add method)
- ❌ Many decorators make code hard to follow
- ❌ Performance critical (wrapping has overhead)

### 6. Repository Pattern

**What**: Provide an abstraction layer between business logic and data access, treating data sources as collections.

**Analogy**: Like a library. You don't go into the warehouse and search through boxes of books yourself. Instead, you ask the librarian (repository), "I need books about Python." The librarian knows whether books are in the warehouse, on shelves, or in digital format — you just get the books you asked for. The librarian is an abstraction over the storage details.

**Problem it solves**:
- Separate business logic from data access
- Hide database details from business code
- Make testing easier (mock repository)
- Switch data sources easily (SQL → NoSQL → API)
- Centralize data access logic

**Structure**:

```
┌─────────────────────────┐
│   Business Logic        │
│     (Service)           │
└────────────┬────────────┘
             │ uses
             ↓
┌─────────────────────────┐
│   Repository Interface  │
├─────────────────────────┤
│ + find_by_id(id)        │
│ + find_all()            │
│ + save(entity)          │
│ + delete(id)            │
└────────────┬────────────┘
             △
             │ implements
    ┌────────┴────────┬──────────────┐
    │                 │              │
┌───┴───────┐  ┌──────┴─────┐  ┌────┴──────┐
│  SQL      │  │  NoSQL     │  │  In-Memory│
│Repository │  │ Repository │  │ Repository│
└───────────┘  └────────────┘  └───────────┘
```

**Implementation (Python)**:

```python
from abc import ABC, abstractmethod
from typing import List, Optional, Dict
import logging
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)

# Step 1: Define entity (domain model)
@dataclass
class User:
    """
    User entity.

    Why dataclass:
    - Clean syntax
    - Automatic __init__, __repr__, __eq__
    - Focus on data, not methods
    """
    id: Optional[int]
    username: str
    email: str
    created_at: datetime
    is_active: bool = True

    def validate(self) -> bool:
        """
        Validate user data.

        Best Practice: Domain validation in entity.
        """
        if not self.username or len(self.username) < 3:
            raise ValueError("Username must be at least 3 characters")

        if not self.email or "@" not in self.email:
            raise ValueError("Invalid email format")

        return True

# Step 2: Define repository interface
class UserRepository(ABC):
    """
    Abstract repository for User entity.

    Why abstract:
    - Defines contract for all implementations
    - Business logic depends on interface, not implementation
    - Easy to swap implementations
    - Easy to mock for testing
    """

    @abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]:
        """Find user by ID."""
        pass

    @abstractmethod
    def find_by_username(self, username: str) -> Optional[User]:
        """Find user by username."""
        pass

    @abstractmethod
    def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email."""
        pass

    @abstractmethod
    def find_all(self) -> List[User]:
        """Get all users."""
        pass

    @abstractmethod
    def find_active_users(self) -> List[User]:
        """Get all active users."""
        pass

    @abstractmethod
    def save(self, user: User) -> User:
        """Save user (create or update)."""
        pass

    @abstractmethod
    def delete(self, user_id: int) -> bool:
        """Delete user."""
        pass

    @abstractmethod
    def count(self) -> int:
        """Count total users."""
        pass

# Step 3: Create concrete repository implementations

class InMemoryUserRepository(UserRepository):
    """
    In-memory implementation (for testing, prototyping).

    Why useful:
    - No database needed
    - Fast for tests
    - Simple implementation
    """

    def __init__(self):
        self._users: Dict[int, User] = {}
        self._next_id = 1

    def find_by_id(self, user_id: int) -> Optional[User]:
        """Find user by ID."""
        logger.debug(f"Finding user by ID: {user_id}")
        return self._users.get(user_id)

    def find_by_username(self, username: str) -> Optional[User]:
        """Find user by username."""
        logger.debug(f"Finding user by username: {username}")
        for user in self._users.values():
            if user.username == username:
                return user
        return None

    def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email."""
        logger.debug(f"Finding user by email: {email}")
        for user in self._users.values():
            if user.email == email:
                return user
        return None

    def find_all(self) -> List[User]:
        """Get all users."""
        logger.debug("Finding all users")
        return list(self._users.values())

    def find_active_users(self) -> List[User]:
        """Get active users."""
        logger.debug("Finding active users")
        return [user for user in self._users.values() if user.is_active]

    def save(self, user: User) -> User:
        """
        Save user.

        Best Practices:
        - Validate before saving
        - Auto-generate ID if new
        - Log operations
        - Return saved entity
        """
        user.validate()

        if user.id is None:
            # New user - assign ID
            user.id = self._next_id
            self._next_id += 1
            logger.info(f"Creating new user: {user.username} (ID: {user.id})")
        else:
            # Update existing user
            logger.info(f"Updating user: {user.username} (ID: {user.id})")

        self._users[user.id] = user
        return user

    def delete(self, user_id: int) -> bool:
        """Delete user."""
        if user_id in self._users:
            user = self._users[user_id]
            del self._users[user_id]
            logger.info(f"Deleted user: {user.username} (ID: {user_id})")
            return True

        logger.warning(f"User not found for deletion: {user_id}")
        return False

    def count(self) -> int:
        """Count users."""
        return len(self._users)

class SQLUserRepository(UserRepository):
    """
    SQL database implementation (pseudo-code).

    In real code:
    - Use SQLAlchemy, Django ORM, or raw SQL
    - Handle transactions
    - Use connection pooling
    """

    def __init__(self, db_connection):
        self._db = db_connection

    def find_by_id(self, user_id: int) -> Optional[User]:
        """Find user by ID in database."""
        logger.debug(f"SQL: Finding user by ID: {user_id}")

        # Pseudo SQL query
        # result = self._db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        # if result:
        #     return self._map_to_user(result)

        # For demonstration:
        logger.info("Would execute: SELECT * FROM users WHERE id = ?")
        return None

    def find_by_username(self, username: str) -> Optional[User]:
        """Find user by username in database."""
        logger.debug(f"SQL: Finding user by username: {username}")
        logger.info("Would execute: SELECT * FROM users WHERE username = ?")
        return None

    def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email in database."""
        logger.debug(f"SQL: Finding user by email: {email}")
        logger.info("Would execute: SELECT * FROM users WHERE email = ?")
        return None

    def find_all(self) -> List[User]:
        """Get all users from database."""
        logger.debug("SQL: Finding all users")
        logger.info("Would execute: SELECT * FROM users")
        return []

    def find_active_users(self) -> List[User]:
        """Get active users from database."""
        logger.debug("SQL: Finding active users")
        logger.info("Would execute: SELECT * FROM users WHERE is_active = TRUE")
        return []

    def save(self, user: User) -> User:
        """Save user to database."""
        user.validate()

        if user.id is None:
            logger.info(f"SQL: Creating user: {user.username}")
            logger.info("Would execute: INSERT INTO users (...) VALUES (...)")
        else:
            logger.info(f"SQL: Updating user: {user.username}")
            logger.info("Would execute: UPDATE users SET ... WHERE id = ?")

        return user

    def delete(self, user_id: int) -> bool:
        """Delete user from database."""
        logger.info(f"SQL: Deleting user: {user_id}")
        logger.info("Would execute: DELETE FROM users WHERE id = ?")
        return True

    def count(self) -> int:
        """Count users in database."""
        logger.info("Would execute: SELECT COUNT(*) FROM users")
        return 0

# Step 4: Use repository in business logic
class UserService:
    """
    Business logic layer that uses repository.

    Why separation:
    - Business logic doesn't know about database
    - Easy to test (inject mock repository)
    - Can switch database without changing business logic
    """

    def __init__(self, user_repository: UserRepository):
        """
        Initialize with repository.

        Dependency injection - repository is passed in, not created here.
        """
        self._repository = user_repository

    def register_user(self, username: str, email: str) -> User:
        """
        Register new user.

        Business logic:
        - Check if username/email already exists
        - Create user
        - Save user
        """
        logger.info(f"Registering user: {username}")

        # Business rule: username must be unique
        existing_user = self._repository.find_by_username(username)
        if existing_user:
            logger.error(f"Username already exists: {username}")
            raise ValueError(f"Username '{username}' is already taken")

        # Business rule: email must be unique
        existing_email = self._repository.find_by_email(email)
        if existing_email:
            logger.error(f"Email already exists: {email}")
            raise ValueError(f"Email '{email}' is already registered")

        # Create user
        user = User(
            id=None,
            username=username,
            email=email,
            created_at=datetime.now(),
            is_active=True
        )

        # Save through repository
        saved_user = self._repository.save(user)

        logger.info(f"User registered successfully: {username} (ID: {saved_user.id})")
        return saved_user

    def deactivate_user(self, user_id: int) -> bool:
        """
        Deactivate user (soft delete).

        Business logic handles soft delete policy.
        """
        logger.info(f"Deactivating user: {user_id}")

        user = self._repository.find_by_id(user_id)
        if not user:
            logger.error(f"User not found: {user_id}")
            raise ValueError(f"User with ID {user_id} not found")

        # Business rule: already inactive
        if not user.is_active:
            logger.warning(f"User already inactive: {user_id}")
            return False

        # Deactivate
        user.is_active = False
        self._repository.save(user)

        logger.info(f"User deactivated: {user_id}")
        return True

    def get_active_users_count(self) -> int:
        """Get count of active users."""
        active_users = self._repository.find_active_users()
        count = len(active_users)

        logger.info(f"Active users count: {count}")
        return count

    def change_email(self, user_id: int, new_email: str) -> User:
        """
        Change user email.

        Business logic handles validation and uniqueness.
        """
        logger.info(f"Changing email for user: {user_id}")

        # Find user
        user = self._repository.find_by_id(user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} not found")

        # Business rule: email must be unique
        existing = self._repository.find_by_email(new_email)
        if existing and existing.id != user_id:
            raise ValueError(f"Email '{new_email}' is already in use")

        # Update email
        user.email = new_email
        updated_user = self._repository.save(user)

        logger.info(f"Email changed successfully for user: {user_id}")
        return updated_user

# Usage
def repository_example():
    """Demonstrate Repository pattern."""

    # Create repository (can swap implementations)
    repository = InMemoryUserRepository()

    # Create service with repository
    service = UserService(repository)

    # Business operations (service doesn't know about database)
    print("=== Registering Users ===")
    user1 = service.register_user("alice", "alice@example.com")
    print(f"Registered: {user1}\n")

    user2 = service.register_user("bob", "bob@example.com")
    print(f"Registered: {user2}\n")

    # Try duplicate username
    print("=== Duplicate Username ===")
    try:
        user3 = service.register_user("alice", "alice2@example.com")
    except ValueError as e:
        print(f"Error: {e}\n")

    # Get active users
    print("=== Active Users ===")
    count = service.get_active_users_count()
    print(f"Active users: {count}\n")

    # Deactivate user
    print("=== Deactivating User ===")
    service.deactivate_user(user1.id)
    count = service.get_active_users_count()
    print(f"Active users after deactivation: {count}\n")

    # Change email
    print("=== Changing Email ===")
    updated_user = service.change_email(user2.id, "bob_new@example.com")
    print(f"Updated user: {updated_user}\n")

    # Switch to SQL repository (business logic unchanged!)
    print("=== Switching to SQL Repository ===")
    sql_repository = SQLUserRepository("fake_db_connection")
    sql_service = UserService(sql_repository)

    # Same business operations work with different repository
    try:
        sql_service.register_user("charlie", "charlie@example.com")
    except:
        pass  # Pseudo-implementation doesn't actually save

# Testing with mock repository
class MockUserRepository(UserRepository):
    """
    Mock repository for testing.

    Returns pre-defined data, doesn't actually save anything.
    """

    def __init__(self):
        self.users = []
        self.save_called = False
        self.delete_called = False

    def find_by_id(self, user_id: int) -> Optional[User]:
        return User(1, "testuser", "test@test.com", datetime.now())

    def find_by_username(self, username: str) -> Optional[User]:
        return None  # Simulate user doesn't exist

    def find_by_email(self, email: str) -> Optional[User]:
        return None

    def find_all(self) -> List[User]:
        return self.users

    def find_active_users(self) -> List[User]:
        return [u for u in self.users if u.is_active]

    def save(self, user: User) -> User:
        self.save_called = True
        user.id = 999
        return user

    def delete(self, user_id: int) -> bool:
        self.delete_called = True
        return True

    def count(self) -> int:
        return len(self.users)

def test_user_service():
    """Test UserService with mock repository."""
    # Create mock repository
    mock_repo = MockUserRepository()

    # Create service
    service = UserService(mock_repo)

    # Test registration
    user = service.register_user("newuser", "new@test.com")

    # Assert
    assert mock_repo.save_called
    assert user.id == 999
    print("✅ Test passed: User registration works")
```

**When to use Repository**:
- ✅ Separate business logic from data access
- ✅ Need to support multiple data sources
- ✅ Want testable business logic
- ✅ Complex queries need centralization
- ✅ Domain-driven design
- ✅ Microservices (each service has repository)

**When NOT to use Repository**:
- ❌ Simple CRUD with no business logic
- ❌ Using ORM that already provides abstraction
- ❌ Very small application
- ❌ Over-engineering simple data access

## Best Practices

### Safety: Validation and Error Handling

```python
# Pattern implementations should validate inputs

class PaymentFactory:
    """Factory with comprehensive validation."""

    @staticmethod
    def create_payment_method(payment_type: str,
                            payment_details: dict) -> PaymentMethod:
        """
        Create payment method with validation.

        Best Practices:
        - Validate all inputs
        - Clear error messages
        - Log validation failures
        - Type checking
        """
        # Validate payment type
        if not payment_type:
            logger.error("Payment type is required")
            raise ValueError("Payment type cannot be empty")

        # Validate payment details
        if not payment_details or not isinstance(payment_details, dict):
            logger.error("Invalid payment details")
            raise ValueError("Payment details must be a non-empty dictionary")

        # Create based on type
        payment_type = payment_type.lower().strip()

        if payment_type == "credit_card":
            # Validate credit card specific fields
            required = ["card_number", "cvv", "expiry"]
            missing = [f for f in required if f not in payment_details]

            if missing:
                logger.error(f"Missing required fields: {missing}")
                raise ValueError(f"Missing required fields: {', '.join(missing)}")

            return CreditCardPayment()

        else:
            logger.error(f"Unknown payment type: {payment_type}")
            raise ValueError(f"Unsupported payment type: {payment_type}")
```

### Quality: Testability

```python
import unittest

class TestUserService(unittest.TestCase):
    """Test UserService using Repository pattern."""

    def setUp(self):
        """Set up test fixtures."""
        # Use in-memory repository for tests
        self.repository = InMemoryUserRepository()
        self.service = UserService(self.repository)

    def test_register_user_success(self):
        """Test successful user registration."""
        user = self.service.register_user("testuser", "test@example.com")

        self.assertIsNotNone(user.id)
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.is_active)

    def test_register_duplicate_username(self):
        """Test registration with duplicate username fails."""
        # First registration succeeds
        self.service.register_user("testuser", "test1@example.com")

        # Second registration with same username fails
        with self.assertRaises(ValueError) as context:
            self.service.register_user("testuser", "test2@example.com")

        self.assertIn("already taken", str(context.exception))

    def test_deactivate_user(self):
        """Test user deactivation."""
        # Register user
        user = self.service.register_user("testuser", "test@example.com")

        # Deactivate
        result = self.service.deactivate_user(user.id)

        self.assertTrue(result)

        # Verify user is inactive
        inactive_user = self.repository.find_by_id(user.id)
        self.assertFalse(inactive_user.is_active)

    def test_deactivate_nonexistent_user(self):
        """Test deactivating non-existent user fails."""
        with self.assertRaises(ValueError):
            self.service.deactivate_user(999)

# Benefits:
# - Fast tests (no real database)
# - Isolated tests (each test independent)
# - Easy to mock edge cases
# - Clear test setup
```

### Logging: Comprehensive Observability

```python
import logging
from functools import wraps
import time

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def log_pattern_usage(pattern_name: str):
    """
    Decorator to log design pattern usage.

    Best Practice: Track which patterns are being used.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger = logging.getLogger(func.__module__)

            logger.info(
                f"[{pattern_name}] Executing {func.__name__}"
            )

            start = time.time()

            try:
                result = func(*args, **kwargs)

                duration = time.time() - start
                logger.info(
                    f"[{pattern_name}] {func.__name__} completed "
                    f"in {duration:.3f}s"
                )

                return result

            except Exception as e:
                duration = time.time() - start
                logger.error(
                    f"[{pattern_name}] {func.__name__} failed "
                    f"after {duration:.3f}s: {str(e)}",
                    exc_info=True
                )
                raise

        return wrapper
    return decorator

class ObservableFactory:
    """Factory with comprehensive logging."""

    @staticmethod
    @log_pattern_usage("Factory")
    def create_payment_method(payment_type: str) -> PaymentMethod:
        """Create payment method with full observability."""

        # Log business metrics
        logger.info(
            f"Payment method creation requested: type={payment_type}"
        )

        # Track creation time
        start = time.time()

        # Create object
        payment_method = PaymentFactory.create_payment_method(payment_type)

        # Log performance
        duration = time.time() - start
        logger.info(
            f"Payment method created: "
            f"type={payment_type}, "
            f"class={payment_method.__class__.__name__}, "
            f"duration={duration:.3f}s"
        )

        return payment_method
```

## Common Pitfalls

### 1. Overusing Patterns

```python
# ❌ BAD: Using patterns unnecessarily

# Don't need Factory for simple object creation
class UserFactory:
    @staticmethod
    def create_user(name, email):
        return User(name, email)

# Just do this:
user = User(name, email)

# Don't need Strategy for simple conditional
class DiscountStrategy:
    def calculate(self, amount):
        if self.discount_type == "percent":
            return amount * self.percentage
        else:
            return self.fixed_amount

# Just do this:
def calculate_discount(amount, discount_type, value):
    if discount_type == "percent":
        return amount * value
    else:
        return value

# ✅ GOOD: Use patterns when they add value
# - Multiple implementations needed
# - Need to switch at runtime
# - Complex creation logic
# - Need testability/flexibility
```

### 2. Breaking Single Responsibility

```python
# ❌ BAD: Repository doing too much
class UserRepository:
    def find_by_id(self, user_id):
        pass

    def save(self, user):
        pass

    def send_welcome_email(self, user):  # ❌ Not repository responsibility!
        pass

    def calculate_user_score(self, user):  # ❌ Business logic, not data access!
        pass

# ✅ GOOD: Repository only handles data access
class UserRepository:
    def find_by_id(self, user_id):
        pass

    def save(self, user):
        pass

# Business logic in service
class UserService:
    def __init__(self, repository, email_service):
        self.repository = repository
        self.email_service = email_service

    def register_user(self, user):
        saved_user = self.repository.save(user)
        self.email_service.send_welcome_email(saved_user)
        return saved_user
```

### 3. Not Understanding Pattern Intent

```python
# ❌ BAD: Misusing Singleton (anti-pattern)
class DataManager(Singleton):
    """Don't make everything a Singleton!"""
    def __init__(self):
        self.user_data = {}
        self.order_data = {}
        self.product_data = {}
        # Global state is bad!

# ✅ GOOD: Use dependency injection instead
class UserService:
    def __init__(self, user_repository):
        self.repository = user_repository

class OrderService:
    def __init__(self, order_repository):
        self.repository = order_repository

# Each service gets what it needs, no global state
```

## Quick Reference

### Pattern Selection Guide

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    When to Use Which Pattern                                 │
├────────────────────────────────────┬─────────────────────────────────────────┤
│ Need                               │ Use Pattern                             │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ Only one instance                  │ Singleton                               │
│ Multiple instances would cause bugs│                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ Create objects without knowing     │ Factory                                 │
│ exact class at compile time        │                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ Notify multiple objects when       │ Observer                                │
│ something changes                  │                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ Switch algorithms at runtime       │ Strategy                                │
│ Avoid complex conditionals         │                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ Add behavior dynamically           │ Decorator                               │
│ Avoid subclass explosion           │                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ Separate business logic from       │ Repository                              │
│ data access                        │                                         │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

### Pattern Summary Table

```
┌────────────────┬─────────────┬──────────────────────┬────────────────────────┐
│ Pattern        │ Category    │ Problem              │ Solution               │
├────────────────┼─────────────┼──────────────────────┼────────────────────────┤
│ Singleton      │ Creational  │ Need exactly one     │ Private constructor,   │
│                │             │ instance             │ static instance        │
├────────────────┼─────────────┼──────────────────────┼────────────────────────┤
│ Factory        │ Creational  │ Create objects       │ Creation method that   │
│                │             │ without knowing type │ returns interface      │
├────────────────┼─────────────┼──────────────────────┼────────────────────────┤
│ Observer       │ Behavioral  │ Notify many objects  │ Subject maintains list │
│                │             │ of changes           │ of observers           │
├────────────────┼─────────────┼──────────────────────┼────────────────────────┤
│ Strategy       │ Behavioral  │ Switch algorithms    │ Encapsulate algorithms │
│                │             │ at runtime           │ in separate classes    │
├────────────────┼─────────────┼──────────────────────┼────────────────────────┤
│ Decorator      │ Structural  │ Add behavior         │ Wrap objects to add    │
│                │             │ dynamically          │ functionality          │
├────────────────┼─────────────┼──────────────────────┼────────────────────────┤
│ Repository     │ Architectural│ Separate data access │ Interface for data     │
│                │             │ from business logic  │ operations             │
└────────────────┴─────────────┴──────────────────────┴────────────────────────┘
```

## Use Cases by Industry

### Healthcare

- **Repository**: Patient data access (HIPAA compliant)
- **Observer**: Real-time patient monitoring alerts
- **Factory**: Create different types of medical reports
- **Strategy**: Different billing strategies per insurance
- **Singleton**: Central appointment scheduler

### Finance

- **Strategy**: Different trading algorithms
- **Observer**: Stock price change notifications
- **Decorator**: Add logging/audit trail to transactions
- **Repository**: Transaction data access
- **Factory**: Create different account types

### E-commerce

- **Factory**: Create payment methods
- **Strategy**: Pricing/discount strategies
- **Observer**: Inventory change notifications
- **Decorator**: Add gift wrapping, insurance to orders
- **Repository**: Product data access

### Social Media

- **Observer**: Newsfeed updates, notifications
- **Strategy**: Different content ranking algorithms
- **Decorator**: Add filters, effects to posts
- **Repository**: User data, post data access
- **Singleton**: Cache manager

## Related Topics

### Within This Repository

- **[OOP vs Functional](../oop-vs-functional/README.md)**: Understanding programming paradigms that patterns use
- **[SOLID Principles](../../03-methodologies/solid-principles/README.md)**: Principles that guide pattern usage
- **[Testing Strategies](../../03-methodologies/testing/README.md)**: How to test code using patterns
- **[Refactoring](../../03-methodologies/refactoring/README.md)**: When to introduce patterns

### Advanced Patterns to Learn

- **Builder**: Construct complex objects step by step
- **Adapter**: Make incompatible interfaces work together
- **Facade**: Simplify complex subsystems
- **Command**: Encapsulate requests as objects
- **State**: Change behavior when state changes
- **Template Method**: Define algorithm skeleton, let subclasses fill in steps

### Resources

- **Book**: "Design Patterns" by Gang of Four (classic reference)
- **Book**: "Head First Design Patterns" (beginner-friendly)
- **Website**: [Refactoring Guru](https://refactoring.guru/design-patterns) (excellent visual explanations)
- **Practice**: [SourceMaking](https://sourcemaking.com/design_patterns) (examples in multiple languages)

---

**Remember**: Patterns are tools, not rules. Use them when they solve a real problem, not because they're fashionable. The best code is simple code that solves the problem clearly — sometimes that means using a pattern, sometimes it doesn't.

**Key Takeaway**: Learn the patterns, understand their trade-offs, and apply them judiciously. Over-engineering with unnecessary patterns is worse than not using patterns at all.
