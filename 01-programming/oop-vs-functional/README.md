# Object-Oriented Programming vs Functional Programming

## What is it?

**Object-Oriented Programming (OOP)** is a programming approach where you organize code around "objects" — bundles of data and the functions that work with that data. **Functional Programming (FP)** is a programming approach where you organize code around pure functions that transform data without changing it.

Think of it this way: OOP says "here's a thing (object) that knows how to do stuff with its own data," while FP says "here's a function that takes data in, produces new data out, and doesn't change anything along the way."

Both are valid ways to structure programs, and many modern languages (like Python and JavaScript) let you use both approaches. The choice between them affects how you think about problems, how you organize code, and how you handle complexity.

## Simple Analogy

### OOP is like a smart appliance

Imagine a washing machine. It has:
- **State** (water level, temperature, cycle position)
- **Behaviors** (fill, wash, spin, drain)
- The machine **manages its own state** — you press "start" and it handles everything internally

```
┌─────────────────────┐
│  Washing Machine    │
│  ─────────────────  │
│  State:             │
│  - waterLevel: 0    │
│  - temperature: 0   │
│  - isRunning: false │
│  ─────────────────  │
│  Behaviors:         │
│  - start()          │
│  - stop()           │
│  - fill()           │
│  - spin()           │
└─────────────────────┘
```

### FP is like a recipe

Imagine making bread. You:
- **Start with ingredients** (input)
- **Apply transformations** (mix → knead → rise → bake)
- **Get new result** at each step (the original ingredients aren't "modified" — you create something new)
- Each step is **predictable** — same inputs always give same outputs

```
Flour + Water + Yeast  →  [mix]  →  Dough
                                      ↓
                              Result  →  [knead]  →  Smooth Dough
                                                        ↓
                                                  Result  →  [rise]  →  Risen Dough
                                                                            ↓
                                                                      Result  →  [bake]  →  Bread
```

## Why Does it Matter?

### Real-World Impact

**OOP matters because:**
- **Industry standard**: Most enterprise codebases use OOP (Java, C#, Python classes)
- **Natural modeling**: Represents real-world entities (User, Order, Payment) intuitively
- **Team collaboration**: Objects provide clear boundaries and contracts for large teams
- **Encapsulation**: Hides complexity — you use objects without knowing internal details

**FP matters because:**
- **Concurrent/parallel safety**: No shared mutable state means easier parallelization
- **Testability**: Pure functions are trivial to test — same input always gives same output
- **Debugging**: No hidden state changes make bugs easier to find
- **Modern trends**: React, Redux, data pipelines, cloud functions favor FP patterns

**In practice**, most developers use **both**:
- Use OOP for domain models (User, Product, Invoice)
- Use FP for data transformations (parsing, filtering, aggregating)
- Use FP for business logic (calculations, validations, rules)

## How It Works

### Object-Oriented Programming (OOP)

#### Core Idea: Objects with State and Behavior

An **object** combines:
1. **Data** (attributes/properties) — what it knows
2. **Methods** (functions) — what it can do
3. **Identity** — each object is unique, even if data is the same

```
┌────────────────────────────────────────┐
│         Object Instance                │
│  ────────────────────────────────────  │
│  Data (State):                         │
│  - Stored inside the object            │
│  - Can change over time                │
│  - Private or public access            │
│  ────────────────────────────────────  │
│  Behavior (Methods):                   │
│  - Functions that operate on the data  │
│  - Can modify the object's state       │
│  - Define what the object can do       │
└────────────────────────────────────────┘
```

#### Four Pillars of OOP

```
┌─────────────────────────────────────────────────────┐
│                  Four Pillars of OOP                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. ENCAPSULATION                                   │
│     Bundle data + methods together                  │
│     Hide internal details                           │
│                                                     │
│  2. ABSTRACTION                                     │
│     Show only essential features                    │
│     Hide complex implementation                     │
│                                                     │
│  3. INHERITANCE                                     │
│     Create specialized classes from general ones    │
│     Reuse code through parent-child relationships   │
│                                                     │
│  4. POLYMORPHISM                                    │
│     Same interface, different implementations       │
│     "Many forms" of the same operation              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Functional Programming (FP)

#### Core Idea: Pure Functions and Immutable Data

A **pure function**:
1. **Same input → same output** (deterministic)
2. **No side effects** (doesn't change anything outside itself)
3. **Treats data as immutable** (never modifies, always creates new)

```
┌─────────────────────────────────────────┐
│          Pure Function                  │
│  ─────────────────────────────────────  │
│  Input:                                 │
│  - Takes parameters                     │
│  - Never modifies them                  │
│  ─────────────────────────────────────  │
│  Processing:                            │
│  - Performs computation                 │
│  - No external state access             │
│  - No side effects                      │
│  ─────────────────────────────────────  │
│  Output:                                │
│  - Returns new value                    │
│  - Original data unchanged              │
│  - Predictable and testable             │
└─────────────────────────────────────────┘
```

#### Core Principles of FP

```
┌──────────────────────────────────────────────────────┐
│              Core Principles of FP                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. IMMUTABILITY                                     │
│     Data never changes                               │
│     Create new data instead of modifying             │
│                                                      │
│  2. PURE FUNCTIONS                                   │
│     No side effects                                  │
│     Deterministic (same in = same out)               │
│                                                      │
│  3. FIRST-CLASS FUNCTIONS                            │
│     Functions are values                             │
│     Pass functions as arguments                      │
│                                                      │
│  4. COMPOSITION                                      │
│     Build complex functions from simple ones         │
│     Chain transformations together                   │
│                                                      │
│  5. DECLARATIVE STYLE                                │
│     Say "what" not "how"                             │
│     Express logic without explicit control flow      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Key Concepts

### Object-Oriented Programming Concepts

#### 1. Classes and Objects

**Class**: A blueprint/template for creating objects
**Object**: An instance of a class (the actual thing)

```python
# Class = Blueprint
class BankAccount:
    """A bank account with balance tracking."""

    def __init__(self, owner, balance=0):
        # State/Data
        self.owner = owner
        self.balance = balance

    # Behavior/Methods
    def deposit(self, amount):
        """Add money to the account."""
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        """Remove money from the account."""
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance

# Object = Instance created from the blueprint
account1 = BankAccount("Alice", 1000)
account2 = BankAccount("Bob", 500)

# Each object has its own state
account1.deposit(200)   # Alice now has 1200
account2.withdraw(100)  # Bob now has 400
```

**Why this works:**
- The class defines what a bank account **is** and what it can **do**
- Each object maintains its own state independently
- Methods operate on the object's internal data

#### 2. Encapsulation

**Definition**: Hide internal details and expose only what's necessary.

```python
class SecureBankAccount:
    """Bank account with private balance."""

    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self.__balance = initial_balance  # Private (name mangling with __)
        self.__transaction_log = []       # Private

    # Public interface
    def deposit(self, amount):
        """
        Public method to add funds.

        Why we validate:
        - Prevent negative deposits
        - Protect data integrity
        - Log for audit trail
        """
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")

        self.__balance += amount
        self.__log_transaction("deposit", amount)
        return self.__balance

    def get_balance(self):
        """Read-only access to balance."""
        return self.__balance

    # Private helper method
    def __log_transaction(self, type, amount):
        """Internal logging - not meant to be called externally."""
        self.__transaction_log.append({
            "type": type,
            "amount": amount,
            "timestamp": datetime.now()
        })

# Usage
account = SecureBankAccount("Alice", 1000)
account.deposit(500)            # ✅ Works - public interface
balance = account.get_balance() # ✅ Works - controlled access
# account.__balance += 1000     # ❌ Can't access private attribute
```

**Benefits:**
- Internal implementation can change without breaking external code
- Prevents accidental corruption of data
- Clear contract of what's public vs internal

#### 3. Inheritance

**Definition**: Create new classes based on existing ones, inheriting their attributes and methods.

```python
# Base class (parent)
class Animal:
    """Base class for all animals."""

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def make_sound(self):
        """Generic sound - to be overridden by subclasses."""
        return "Some generic sound"

    def describe(self):
        """Common behavior for all animals."""
        return f"{self.name} is {self.age} years old"

# Derived class (child) - inherits from Animal
class Dog(Animal):
    """A dog is a type of animal."""

    def __init__(self, name, age, breed):
        # Call parent constructor
        super().__init__(name, age)
        # Add dog-specific attribute
        self.breed = breed

    # Override parent method
    def make_sound(self):
        """Dogs bark."""
        return "Woof!"

    # Add dog-specific method
    def fetch(self):
        """Behavior unique to dogs."""
        return f"{self.name} is fetching the ball!"

class Cat(Animal):
    """A cat is a type of animal."""

    def make_sound(self):
        """Cats meow."""
        return "Meow!"

    def climb(self):
        """Behavior unique to cats."""
        return f"{self.name} is climbing a tree!"

# Usage
dog = Dog("Buddy", 3, "Golden Retriever")
cat = Cat("Whiskers", 5)

print(dog.describe())      # ✅ Inherited from Animal
print(dog.make_sound())    # ✅ Overridden in Dog - "Woof!"
print(dog.fetch())         # ✅ Dog-specific method

print(cat.describe())      # ✅ Inherited from Animal
print(cat.make_sound())    # ✅ Overridden in Cat - "Meow!"
```

**Why inheritance is useful:**
- **Code reuse**: Common behavior defined once
- **Hierarchy**: Models real-world relationships (is-a relationship)
- **Extensibility**: Add specialized behavior without changing parent

#### 4. Polymorphism

**Definition**: Same interface, different implementations. "Many forms" of the same operation.

```python
def exercise_animal(animal):
    """
    Works with any Animal type.

    This is polymorphism - we don't need to know the specific type,
    just that it's an Animal and has make_sound() method.
    """
    print(f"{animal.name} says: {animal.make_sound()}")

# All these work with the same function
animals = [
    Dog("Buddy", 3, "Golden Retriever"),
    Cat("Whiskers", 5),
    Animal("Generic", 2)
]

for animal in animals:
    exercise_animal(animal)  # Each calls their own make_sound()

# Output:
# Buddy says: Woof!
# Whiskers says: Meow!
# Generic says: Some generic sound
```

**Real-world polymorphism example:**

```python
class PaymentProcessor:
    """Base interface for payment processing."""

    def process_payment(self, amount):
        """Process a payment - must be implemented by subclasses."""
        raise NotImplementedError("Subclass must implement process_payment")

class CreditCardProcessor(PaymentProcessor):
    def process_payment(self, amount):
        """Process via credit card gateway."""
        # Credit card specific logic
        return f"Processing ${amount} via Credit Card"

class PayPalProcessor(PaymentProcessor):
    def process_payment(self, amount):
        """Process via PayPal API."""
        # PayPal specific logic
        return f"Processing ${amount} via PayPal"

class CryptoProcessor(PaymentProcessor):
    def process_payment(self, amount):
        """Process via blockchain."""
        # Crypto specific logic
        return f"Processing ${amount} via Cryptocurrency"

def checkout(cart_total, payment_processor):
    """
    Checkout function works with ANY payment processor.

    Why this is powerful:
    - Add new payment methods without changing checkout code
    - Each processor handles its own complexity
    - Easy to test (mock different processors)
    """
    print(payment_processor.process_payment(cart_total))

# All work with the same checkout function
checkout(100.00, CreditCardProcessor())
checkout(50.00, PayPalProcessor())
checkout(200.00, CryptoProcessor())
```

### Functional Programming Concepts

#### 1. Pure Functions

**Definition**: Functions with no side effects that always return the same output for the same input.

```python
# ✅ PURE FUNCTION
def calculate_tax(price, tax_rate):
    """
    Calculate tax on a price.

    Why this is pure:
    - Same inputs (price=100, rate=0.1) always give same output (10.0)
    - Doesn't modify inputs
    - Doesn't access external state
    - No side effects (no logging, no DB writes, no global changes)
    """
    return price * tax_rate

# Call it 1000 times with same inputs = same result every time
result1 = calculate_tax(100, 0.1)  # 10.0
result2 = calculate_tax(100, 0.1)  # 10.0 - guaranteed same

# ❌ IMPURE FUNCTION
total_sales = 0  # External state

def add_sale_impure(amount):
    """
    Updates global state - IMPURE.

    Why this is impure:
    - Modifies external variable (side effect)
    - Same input can give different output (depends on total_sales)
    - Hard to test (need to reset global state)
    - Not thread-safe (race conditions)
    """
    global total_sales
    total_sales += amount  # Side effect!
    return total_sales

# Same input, different output each time - unpredictable
result1 = add_sale_impure(100)  # 100
result2 = add_sale_impure(100)  # 200 - different!

# ✅ PURE VERSION
def add_sale_pure(current_total, amount):
    """
    Returns new total without modifying anything.

    Why this is better:
    - Predictable
    - Testable
    - Thread-safe
    - Can be parallelized
    """
    return current_total + amount

# Same inputs always give same output
result1 = add_sale_pure(1000, 100)  # 1100
result2 = add_sale_pure(1000, 100)  # 1100 - same!
```

#### 2. Immutability

**Definition**: Data that never changes. Instead of modifying, create new versions.

```python
# ❌ MUTABLE APPROACH (OOP style)
class MutableCart:
    """Shopping cart with mutable state."""

    def __init__(self):
        self.items = []
        self.total = 0

    def add_item(self, item, price):
        """Modifies the cart in place."""
        self.items.append(item)
        self.total += price

# Problem: Hard to track changes
cart = MutableCart()
cart.add_item("Book", 20)
# What was the cart before this? Can't tell - history is lost
cart.add_item("Pen", 5)

# ✅ IMMUTABLE APPROACH (FP style)
def add_item_to_cart(cart, item, price):
    """
    Returns NEW cart without modifying original.

    Why immutability helps:
    - Keep history of all states
    - Easier to undo/redo
    - No unexpected changes
    - Safe for concurrent access
    """
    return {
        "items": cart["items"] + [item],
        "total": cart["total"] + price
    }

# Each operation creates a new version
cart_v1 = {"items": [], "total": 0}
cart_v2 = add_item_to_cart(cart_v1, "Book", 20)
cart_v3 = add_item_to_cart(cart_v2, "Pen", 5)

# All versions still exist
print(cart_v1)  # {"items": [], "total": 0}
print(cart_v2)  # {"items": ["Book"], "total": 20}
print(cart_v3)  # {"items": ["Book", "Pen"], "total": 25}
```

**Real-world immutability example:**

```python
# Immutable user update (common in React/Redux)
def update_user_email(user, new_email):
    """
    Returns new user object with updated email.

    Why we do this:
    - Keep audit trail (old user object still exists)
    - Undo is trivial (keep previous versions)
    - No surprising mutations
    - Easy to test (compare input vs output)
    """
    return {
        **user,  # Copy all fields from original user
        "email": new_email,  # Override just the email
        "updated_at": datetime.now()
    }

original_user = {
    "id": 123,
    "name": "Alice",
    "email": "alice@old.com",
    "created_at": "2024-01-01"
}

updated_user = update_user_email(original_user, "alice@new.com")

# Original unchanged - we can still access old version
print(original_user["email"])  # "alice@old.com"
print(updated_user["email"])   # "alice@new.com"
```

#### 3. First-Class Functions

**Definition**: Functions are values. They can be assigned, passed around, and returned like any other data.

```python
# Functions as values
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

# Assign function to variable
operation = add
result = operation(5, 3)  # 8

# Pass function as argument
def apply_operation(x, y, operation_func):
    """
    Takes a function as an argument.

    Why this is powerful:
    - Reuse the same logic with different operations
    - Implement strategy pattern without classes
    - Highly flexible and composable
    """
    return operation_func(x, y)

result1 = apply_operation(10, 5, add)       # 15
result2 = apply_operation(10, 5, multiply)  # 50

# Return function from function
def create_multiplier(factor):
    """
    Returns a new function that multiplies by factor.

    This is called a "higher-order function".
    """
    def multiplier(x):
        return x * factor
    return multiplier

times_two = create_multiplier(2)
times_ten = create_multiplier(10)

print(times_two(5))   # 10
print(times_ten(5))   # 50
```

**Real-world example: Middleware in web frameworks**

```python
def create_logger_middleware(log_level):
    """
    Returns a middleware function based on log level.

    Real-world use: Express.js, Flask, Django middleware
    """
    def middleware(request, next_handler):
        if log_level == "verbose":
            print(f"Request: {request['method']} {request['path']}")

        response = next_handler(request)

        if log_level == "verbose":
            print(f"Response: {response['status']}")

        return response

    return middleware

# Create different middleware functions
verbose_logger = create_logger_middleware("verbose")
silent_logger = create_logger_middleware("silent")

# Use them in request pipeline
def handle_request(request, middleware):
    """Process request through middleware."""
    def handler(req):
        return {"status": 200, "body": "OK"}

    return middleware(request, handler)
```

#### 4. Higher-Order Functions

**Definition**: Functions that take other functions as arguments or return functions.

Common higher-order functions: `map`, `filter`, `reduce`

```python
# MAP - transform each element
prices = [10, 20, 30, 40]

# Apply tax to each price
def apply_tax(price):
    return price * 1.1

prices_with_tax = list(map(apply_tax, prices))
# [11.0, 22.0, 33.0, 44.0]

# FILTER - keep only elements that match condition
def is_expensive(price):
    return price > 25

expensive_items = list(filter(is_expensive, prices))
# [30, 40]

# REDUCE - combine all elements into single value
from functools import reduce

def sum_prices(total, price):
    return total + price

total = reduce(sum_prices, prices, 0)
# 100

# Using lambda functions (anonymous functions)
prices_with_tax = list(map(lambda p: p * 1.1, prices))
expensive_items = list(filter(lambda p: p > 25, prices))
total = reduce(lambda total, p: total + p, prices, 0)
```

**Real-world example: Data processing pipeline**

```python
def process_sales_data(sales):
    """
    Process sales data using functional pipeline.

    Why this approach:
    - Each step is independent and testable
    - Easy to add/remove steps
    - Clear data flow
    - No intermediate state
    """
    # Filter out invalid sales
    valid_sales = filter(lambda s: s['amount'] > 0, sales)

    # Calculate tax for each
    with_tax = map(lambda s: {
        **s,
        'tax': s['amount'] * 0.1,
        'total': s['amount'] * 1.1
    }, valid_sales)

    # Calculate grand total
    grand_total = reduce(
        lambda acc, s: acc + s['total'],
        with_tax,
        0
    )

    return grand_total

sales = [
    {'id': 1, 'amount': 100},
    {'id': 2, 'amount': -50},  # Invalid
    {'id': 3, 'amount': 200},
]

total = process_sales_data(sales)  # 330.0
```

#### 5. Function Composition

**Definition**: Combine simple functions to build complex ones.

```python
# Simple functions
def add_tax(price):
    """Add 10% tax."""
    return price * 1.1

def apply_discount(price):
    """Apply 20% discount."""
    return price * 0.8

def round_price(price):
    """Round to 2 decimal places."""
    return round(price, 2)

# Compose them together
def compose(*functions):
    """
    Create a new function by composing multiple functions.

    Functions are applied right-to-left (like math).
    """
    def composed(value):
        for func in reversed(functions):
            value = func(value)
        return value
    return composed

# Create a pipeline
process_price = compose(round_price, add_tax, apply_discount)

# Use it
original_price = 100
final_price = process_price(original_price)
# 100 → apply_discount → 80 → add_tax → 88 → round → 88.0

# Alternative: pipe (left-to-right, more readable)
def pipe(*functions):
    """
    Create a new function by piping through multiple functions.

    Functions are applied left-to-right (more intuitive).
    """
    def piped(value):
        for func in functions:
            value = func(value)
        return value
    return piped

# More readable order
process_price = pipe(apply_discount, add_tax, round_price)
final_price = process_price(100)  # Same result
```

## OOP vs FP: Side-by-Side Comparison

### Same Problem, Two Approaches

**Problem**: Build a system to process customer orders with validation, tax calculation, and discounts.

#### Object-Oriented Approach

```python
import logging
from datetime import datetime
from typing import List, Dict

logger = logging.getLogger(__name__)

class Product:
    """Represents a product with price and tax rate."""

    def __init__(self, name: str, price: float, tax_rate: float = 0.1):
        self.name = name
        self.price = price
        self.tax_rate = tax_rate

    def get_price_with_tax(self) -> float:
        """Calculate price including tax."""
        return self.price * (1 + self.tax_rate)

class Customer:
    """Represents a customer with loyalty discount."""

    def __init__(self, name: str, email: str, loyalty_level: str = "standard"):
        self.name = name
        self.email = email
        self.loyalty_level = loyalty_level
        self.__order_history = []

    def get_discount_rate(self) -> float:
        """Get discount based on loyalty level."""
        discounts = {
            "standard": 0.0,
            "silver": 0.05,
            "gold": 0.10,
            "platinum": 0.15
        }
        return discounts.get(self.loyalty_level, 0.0)

    def add_to_history(self, order):
        """Track order history."""
        self.__order_history.append(order)

class Order:
    """Manages an order with validation and calculations."""

    def __init__(self, customer: Customer, order_id: str = None):
        self.order_id = order_id or self.__generate_id()
        self.customer = customer
        self.items: List[Dict] = []
        self.status = "pending"
        self.created_at = datetime.now()

    def add_item(self, product: Product, quantity: int):
        """
        Add item to order with validation.

        Best Practices:
        - Validate inputs before modifying state
        - Log business events
        - Raise clear errors
        """
        # Validation
        if quantity <= 0:
            logger.error(f"Invalid quantity for order {self.order_id}: {quantity}")
            raise ValueError("Quantity must be positive")

        if product.price <= 0:
            logger.error(f"Invalid price for product {product.name}: {product.price}")
            raise ValueError("Price must be positive")

        # Add to order
        self.items.append({
            "product": product,
            "quantity": quantity,
            "price_per_unit": product.price
        })

        logger.info(
            f"Added to order {self.order_id}: "
            f"{quantity}x {product.name} @ ${product.price}"
        )

    def calculate_subtotal(self) -> float:
        """Calculate total before tax and discounts."""
        subtotal = sum(
            item["price_per_unit"] * item["quantity"]
            for item in self.items
        )
        return subtotal

    def calculate_total(self) -> float:
        """
        Calculate final total with tax and discounts.

        Calculation order:
        1. Subtotal (price × quantity)
        2. Apply discount
        3. Add tax
        """
        subtotal = self.calculate_subtotal()
        discount_rate = self.customer.get_discount_rate()

        # Apply discount
        discounted = subtotal * (1 - discount_rate)

        # Add tax (weighted average across all items)
        total_tax = sum(
            item["product"].price * item["quantity"] * item["product"].tax_rate
            for item in self.items
        )

        final_total = discounted + total_tax

        logger.info(
            f"Order {self.order_id} total calculated: "
            f"subtotal=${subtotal:.2f}, "
            f"discount={discount_rate*100}%, "
            f"tax=${total_tax:.2f}, "
            f"final=${final_total:.2f}"
        )

        return round(final_total, 2)

    def process(self) -> Dict:
        """
        Process the order and return receipt.

        Best Practices:
        - Validate before processing
        - Update state atomically
        - Log state changes
        - Return summary
        """
        # Validation
        if not self.items:
            logger.error(f"Cannot process empty order {self.order_id}")
            raise ValueError("Cannot process empty order")

        if self.status != "pending":
            logger.error(
                f"Order {self.order_id} already processed with status {self.status}"
            )
            raise ValueError(f"Order already {self.status}")

        # Calculate
        total = self.calculate_total()

        # Update state
        self.status = "processed"
        self.customer.add_to_history(self)

        logger.info(f"Order {self.order_id} processed successfully")

        # Return receipt
        return {
            "order_id": self.order_id,
            "customer": self.customer.name,
            "items": len(self.items),
            "total": total,
            "status": self.status
        }

    @staticmethod
    def __generate_id() -> str:
        """Generate unique order ID."""
        return f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"

# Usage Example
def oop_example():
    """Complete OOP example."""
    # Create objects
    customer = Customer("Alice Smith", "alice@email.com", "gold")
    order = Order(customer)

    # Create products
    laptop = Product("Laptop", 1000.00, tax_rate=0.08)
    mouse = Product("Mouse", 25.00, tax_rate=0.10)

    # Build order
    order.add_item(laptop, 1)
    order.add_item(mouse, 2)

    # Process
    receipt = order.process()
    print(f"Order {receipt['order_id']}: ${receipt['total']}")

```

**OOP Characteristics:**
- **State management**: Objects hold and mutate state (order.items, order.status)
- **Encapsulation**: Internal details hidden (private methods, controlled access)
- **Identity**: Each object is unique (customer, order have identity)
- **Behaviors**: Objects know how to operate on themselves (order.calculate_total())

#### Functional Approach

```python
import logging
from datetime import datetime
from typing import List, Dict, Callable
from functools import reduce

logger = logging.getLogger(__name__)

# Types (using dictionaries instead of classes)
# Product: {"name": str, "price": float, "tax_rate": float}
# Customer: {"name": str, "email": str, "loyalty_level": str}
# OrderItem: {"product": Product, "quantity": int}
# Order: {"id": str, "customer": Customer, "items": List[OrderItem], "status": str}

# Pure functions for validation
def validate_quantity(quantity: int) -> int:
    """
    Validate quantity is positive.

    Why pure function:
    - No side effects
    - Same input always gives same result
    - Easy to test
    """
    if quantity <= 0:
        raise ValueError("Quantity must be positive")
    return quantity

def validate_price(price: float) -> float:
    """Validate price is positive."""
    if price <= 0:
        raise ValueError("Price must be positive")
    return price

# Pure functions for calculations
def calculate_item_price(product: Dict, quantity: int) -> float:
    """
    Calculate price for a single item.

    Pure function:
    - Takes input, returns output
    - No modifications
    - Deterministic
    """
    return product["price"] * quantity

def calculate_item_tax(product: Dict, quantity: int) -> float:
    """Calculate tax for a single item."""
    return product["price"] * quantity * product["tax_rate"]

def get_discount_rate(loyalty_level: str) -> float:
    """
    Get discount rate for loyalty level.

    Pure function - no state access, just calculation.
    """
    discounts = {
        "standard": 0.0,
        "silver": 0.05,
        "gold": 0.10,
        "platinum": 0.15
    }
    return discounts.get(loyalty_level, 0.0)

def apply_discount(amount: float, discount_rate: float) -> float:
    """Apply discount to amount."""
    return amount * (1 - discount_rate)

# Pure functions for creating/updating data
def create_product(name: str, price: float, tax_rate: float = 0.1) -> Dict:
    """
    Create a product (immutable data structure).

    Returns new dictionary - doesn't modify anything.
    """
    return {
        "name": name,
        "price": validate_price(price),
        "tax_rate": tax_rate
    }

def create_customer(name: str, email: str, loyalty_level: str = "standard") -> Dict:
    """Create a customer."""
    return {
        "name": name,
        "email": email,
        "loyalty_level": loyalty_level,
        "order_history": []
    }

def create_order(customer: Dict, order_id: str = None) -> Dict:
    """Create a new order."""
    return {
        "id": order_id or f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "customer": customer,
        "items": [],
        "status": "pending",
        "created_at": datetime.now()
    }

def add_item_to_order(order: Dict, product: Dict, quantity: int) -> Dict:
    """
    Add item to order - returns NEW order.

    Immutability in action:
    - Original order unchanged
    - Returns new order with added item
    - No side effects

    Best Practices:
    - Validate inputs
    - Log business events
    - Return new data structure
    """
    # Validate
    validated_quantity = validate_quantity(quantity)
    validated_product = {**product, "price": validate_price(product["price"])}

    # Log
    logger.info(
        f"Adding to order {order['id']}: "
        f"{validated_quantity}x {validated_product['name']} "
        f"@ ${validated_product['price']}"
    )

    # Create new item
    new_item = {
        "product": validated_product,
        "quantity": validated_quantity
    }

    # Return new order (original unchanged)
    return {
        **order,
        "items": order["items"] + [new_item]
    }

def calculate_subtotal(order: Dict) -> float:
    """
    Calculate order subtotal.

    Functional approach using reduce:
    - No loops, declarative
    - Pure calculation
    """
    return reduce(
        lambda total, item: total + calculate_item_price(item["product"], item["quantity"]),
        order["items"],
        0.0
    )

def calculate_order_total(order: Dict) -> float:
    """
    Calculate final order total with tax and discounts.

    Functional pipeline:
    1. Calculate subtotal
    2. Apply discount
    3. Add tax

    Each step is a pure function.
    """
    # Calculate subtotal
    subtotal = calculate_subtotal(order)

    # Apply discount
    discount_rate = get_discount_rate(order["customer"]["loyalty_level"])
    discounted = apply_discount(subtotal, discount_rate)

    # Calculate tax
    total_tax = reduce(
        lambda tax, item: tax + calculate_item_tax(item["product"], item["quantity"]),
        order["items"],
        0.0
    )

    # Final total
    final_total = discounted + total_tax

    # Log
    logger.info(
        f"Order {order['id']} total calculated: "
        f"subtotal=${subtotal:.2f}, "
        f"discount={discount_rate*100}%, "
        f"tax=${total_tax:.2f}, "
        f"final=${final_total:.2f}"
    )

    return round(final_total, 2)

def process_order(order: Dict) -> tuple[Dict, Dict]:
    """
    Process order - returns NEW order and receipt.

    Immutable approach:
    - Original order unchanged
    - Returns tuple of (new_order, receipt)
    - All state changes explicit in return value

    Best Practices:
    - Validate before processing
    - Log state changes
    - Return new data structures
    """
    # Validation
    if not order["items"]:
        logger.error(f"Cannot process empty order {order['id']}")
        raise ValueError("Cannot process empty order")

    if order["status"] != "pending":
        logger.error(
            f"Order {order['id']} already processed with status {order['status']}"
        )
        raise ValueError(f"Order already {order['status']}")

    # Calculate total
    total = calculate_order_total(order)

    # Create new processed order
    processed_order = {
        **order,
        "status": "processed"
    }

    # Create receipt
    receipt = {
        "order_id": order["id"],
        "customer": order["customer"]["name"],
        "items": len(order["items"]),
        "total": total,
        "status": "processed"
    }

    logger.info(f"Order {order['id']} processed successfully")

    return processed_order, receipt

# Composition: Build complex operations from simple ones
def pipe(*functions: Callable) -> Callable:
    """
    Compose functions left-to-right.

    Functional composition pattern.
    """
    def piped(value):
        for func in functions:
            value = func(value)
        return value
    return piped

# Usage Example
def fp_example():
    """Complete functional example."""
    # Create data (immutable)
    customer = create_customer("Alice Smith", "alice@email.com", "gold")
    order = create_order(customer)

    # Create products
    laptop = create_product("Laptop", 1000.00, tax_rate=0.08)
    mouse = create_product("Mouse", 25.00, tax_rate=0.10)

    # Build order (each step returns new order)
    order = add_item_to_order(order, laptop, 1)
    order = add_item_to_order(order, mouse, 2)

    # Process (returns new order + receipt)
    processed_order, receipt = process_order(order)

    # Original order still exists unchanged
    print(f"Original status: {order['status']}")      # "pending"
    print(f"Processed status: {processed_order['status']}")  # "processed"
    print(f"Order {receipt['order_id']}: ${receipt['total']}")
```

**FP Characteristics:**
- **Immutability**: Data never changes (create_product, add_item_to_order return new data)
- **Pure functions**: No side effects (calculate_subtotal, apply_discount)
- **Function composition**: Build complex from simple (pipe, reduce)
- **Explicit state**: All state changes visible in return values

### Comparison Table

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                         OOP vs FP: Key Differences                                │
├─────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ Aspect              │ Object-Oriented (OOP)    │ Functional (FP)                  │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Primary Building    │ Objects (classes)        │ Functions                        │
│ Block               │                          │                                  │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ State Management    │ Objects hold mutable     │ Immutable data structures        │
│                     │ state                    │ New versions created             │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Data & Behavior     │ Bundled together in      │ Separated - data is data,        │
│                     │ objects                  │ functions transform it           │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Code Reuse          │ Inheritance              │ Composition                      │
│                     │ (is-a relationship)      │ (combining functions)            │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Side Effects        │ Common and expected      │ Avoided, isolated                │
│                     │ (methods modify state)   │ (pure functions preferred)       │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Testing             │ Need to setup object     │ Simple - pass input, check       │
│                     │ state, mock dependencies │ output                           │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Debugging           │ Can be complex (state    │ Easier (no hidden state)         │
│                     │ spread across objects)   │                                  │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ Concurrency         │ Challenging (shared      │ Easier (no shared mutable        │
│                     │ mutable state)           │ state)                           │
├─────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ When to Use         │ Domain modeling          │ Data transformations             │
│                     │ Complex state            │ Parallel processing              │
│                     │ Identity matters         │ Calculations                     │
├─────────────────────┴──────────────────────────┴──────────────────────────────────┤
│ BEST APPROACH: Use both! OOP for structure, FP for logic.                        │
└───────────────────────────────────────────────────────────────────────────────────┘
```

## Best Practices

### OOP Best Practices

#### 1. Safety: Input Validation and Error Handling

```python
class UserAccount:
    """Safe user account with comprehensive validation."""

    def __init__(self, username: str, email: str):
        # Validate on construction
        self.username = self.__validate_username(username)
        self.email = self.__validate_email(email)
        self.__balance = 0.0

        logger.info(f"Created account for {username}")

    def __validate_username(self, username: str) -> str:
        """
        Validate username with clear rules.

        Best Practice:
        - Private validation methods
        - Clear error messages
        - Log validation failures
        """
        if not username or not isinstance(username, str):
            logger.error("Invalid username: must be non-empty string")
            raise ValueError("Username must be a non-empty string")

        if len(username) < 3:
            logger.error(f"Username too short: {username}")
            raise ValueError("Username must be at least 3 characters")

        return username.strip()

    def __validate_email(self, email: str) -> str:
        """Validate email format."""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        if not re.match(pattern, email):
            logger.error(f"Invalid email format: {email}")
            raise ValueError("Invalid email format")

        return email.lower()

    def deposit(self, amount: float) -> float:
        """
        Deposit money with validation.

        Best Practices:
        - Validate inputs
        - Check business rules
        - Use atomic operations
        - Return new state
        - Log all transactions
        """
        # Input validation
        if not isinstance(amount, (int, float)):
            raise TypeError("Amount must be a number")

        if amount <= 0:
            logger.warning(
                f"Rejected deposit for {self.username}: "
                f"amount ${amount} not positive"
            )
            raise ValueError("Deposit amount must be positive")

        # Business rule
        if amount > 10000:
            logger.warning(
                f"Large deposit flagged for {self.username}: ${amount}"
            )
            # In real system: trigger fraud check

        # Atomic update
        self.__balance += amount

        # Audit log
        logger.info(
            f"Deposit successful - User: {self.username}, "
            f"Amount: ${amount:.2f}, "
            f"New balance: ${self.__balance:.2f}"
        )

        return self.__balance
```

#### 2. Quality: Single Responsibility and Testing

```python
class EmailValidator:
    """
    Single Responsibility: Only validates emails.

    Why separate:
    - Easier to test
    - Reusable
    - Changes isolated
    """

    @staticmethod
    def validate(email: str) -> bool:
        """Validate email format."""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

class PasswordHasher:
    """Single Responsibility: Hash passwords securely."""

    @staticmethod
    def hash(password: str) -> str:
        """Hash password using bcrypt."""
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

    @staticmethod
    def verify(password: str, hash: str) -> bool:
        """Verify password against hash."""
        return PasswordHasher.hash(password) == hash

class User:
    """
    User class with injected dependencies.

    Quality Practices:
    - Dependency injection (pass validators)
    - Single responsibility (User just manages user data)
    - Easy to test (mock dependencies)
    """

    def __init__(self, username: str, email: str, password: str,
                 email_validator=EmailValidator,
                 password_hasher=PasswordHasher):
        # Dependency injection allows testing with mocks
        self.email_validator = email_validator
        self.password_hasher = password_hasher

        # Validation
        if not self.email_validator.validate(email):
            raise ValueError("Invalid email")

        # Store
        self.username = username
        self.email = email
        self.__password_hash = self.password_hasher.hash(password)

    def check_password(self, password: str) -> bool:
        """Verify password."""
        return self.password_hasher.verify(password, self.__password_hash)

# Testing is easy with dependency injection
def test_user_creation():
    """Test user creation with mock validator."""

    # Mock validator that always returns True
    class MockValidator:
        @staticmethod
        def validate(email):
            return True

    # Mock hasher
    class MockHasher:
        @staticmethod
        def hash(password):
            return f"hashed_{password}"

        @staticmethod
        def verify(password, hash):
            return f"hashed_{password}" == hash

    # Create user with mocks
    user = User(
        "testuser",
        "test@test.com",
        "password123",
        email_validator=MockValidator,
        password_hasher=MockHasher
    )

    # Test
    assert user.username == "testuser"
    assert user.check_password("password123")
    assert not user.check_password("wrong")
```

#### 3. Logging: Comprehensive Observability

```python
import logging
import time
from functools import wraps

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def log_method_calls(cls):
    """
    Decorator to log all method calls in a class.

    Best Practice: Automatic logging for observability.
    """
    class Wrapped(cls):
        def __getattribute__(self, name):
            attr = super().__getattribute__(name)

            if callable(attr) and not name.startswith('__'):
                @wraps(attr)
                def logged(*args, **kwargs):
                    logger = logging.getLogger(cls.__name__)

                    # Log entry
                    logger.debug(
                        f"Calling {name} with args={args}, kwargs={kwargs}"
                    )

                    # Time execution
                    start = time.time()

                    try:
                        result = attr(*args, **kwargs)

                        # Log success
                        duration = time.time() - start
                        logger.info(
                            f"{name} completed successfully in {duration:.3f}s"
                        )

                        return result

                    except Exception as e:
                        # Log failure
                        duration = time.time() - start
                        logger.error(
                            f"{name} failed after {duration:.3f}s: {str(e)}",
                            exc_info=True
                        )
                        raise

                return logged

            return attr

    return Wrapped

@log_method_calls
class PaymentProcessor:
    """
    Payment processor with comprehensive logging.

    Logging Best Practices:
    - Log business events
    - Log performance metrics
    - Log errors with context
    - Use structured logging
    - Include trace IDs for correlation
    """

    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)

    def process_payment(self, order_id: str, amount: float,
                       payment_method: str) -> dict:
        """
        Process payment with full observability.

        Logs:
        - Input parameters
        - Validation results
        - External API calls
        - Performance metrics
        - Success/failure
        """
        trace_id = f"TRACE-{int(time.time() * 1000)}"

        self.logger.info(
            f"[{trace_id}] Processing payment - "
            f"Order: {order_id}, "
            f"Amount: ${amount:.2f}, "
            f"Method: {payment_method}"
        )

        # Validation with logging
        if amount <= 0:
            self.logger.error(
                f"[{trace_id}] Validation failed: "
                f"Invalid amount ${amount}"
            )
            raise ValueError("Amount must be positive")

        # Simulate external API call
        self.logger.debug(
            f"[{trace_id}] Calling payment gateway for {payment_method}"
        )

        # Log metrics
        self.logger.info(
            f"[{trace_id}] Payment gateway response time: 250ms"
        )

        # Success
        result = {
            "trace_id": trace_id,
            "order_id": order_id,
            "amount": amount,
            "status": "success",
            "transaction_id": f"TXN-{trace_id}"
        }

        self.logger.info(
            f"[{trace_id}] Payment successful - "
            f"Transaction: {result['transaction_id']}"
        )

        return result

# Usage
processor = PaymentProcessor()
result = processor.process_payment("ORD-123", 99.99, "credit_card")
# Logs automatically include timing, trace ID, and context
```

### Functional Programming Best Practices

#### 1. Safety: Pure Functions with Validation

```python
from typing import Dict, List, Union
import logging

logger = logging.getLogger(__name__)

def validate_positive(value: float, field_name: str) -> float:
    """
    Validate numeric value is positive.

    Pure function with clear error handling.
    """
    if not isinstance(value, (int, float)):
        raise TypeError(f"{field_name} must be a number")

    if value <= 0:
        raise ValueError(f"{field_name} must be positive, got {value}")

    return value

def safe_divide(numerator: float, denominator: float,
                default: float = 0.0) -> float:
    """
    Divide with protection against division by zero.

    FP Best Practice:
    - Handle errors gracefully
    - Provide sensible defaults
    - Never raise exceptions for expected edge cases
    """
    if denominator == 0:
        logger.warning(
            f"Division by zero: {numerator}/{denominator}, "
            f"returning default {default}"
        )
        return default

    return numerator / denominator

def calculate_average(numbers: List[float]) -> Union[float, None]:
    """
    Calculate average with safety checks.

    Pure function:
    - No modifications
    - Handles edge cases
    - Returns None for invalid input (not exception)
    """
    if not numbers:
        logger.info("Cannot calculate average of empty list")
        return None

    # Validate all numbers
    try:
        validated = [validate_positive(n, "number") for n in numbers]
    except (TypeError, ValueError) as e:
        logger.error(f"Validation failed: {e}")
        return None

    total = sum(validated)
    return safe_divide(total, len(validated))

# Usage - safe, predictable, testable
result1 = calculate_average([10, 20, 30])  # 20.0
result2 = calculate_average([])            # None (not an error)
result3 = calculate_average([10, -5])      # None (invalid input)
```

#### 2. Quality: Composable and Testable Functions

```python
from typing import Callable, List, Dict
from functools import reduce

# Small, focused functions (easy to test)
def is_adult(age: int) -> bool:
    """Check if age is adult (18+)."""
    return age >= 18

def is_active(last_login_days: int) -> bool:
    """Check if user is active (logged in within 30 days)."""
    return last_login_days <= 30

def has_premium(subscription: str) -> bool:
    """Check if user has premium subscription."""
    return subscription == "premium"

# Compose small functions into larger ones
def create_user_filter(
    min_age: int = None,
    max_inactive_days: int = None,
    require_premium: bool = False
) -> Callable[[Dict], bool]:
    """
    Create a user filter function based on criteria.

    FP Best Practice:
    - Higher-order function (returns a function)
    - Composable (build complex filters from simple ones)
    - Reusable (create different filters for different needs)
    - Testable (each criteria is separate)
    """
    def filter_user(user: Dict) -> bool:
        # Apply each filter
        if min_age and user["age"] < min_age:
            return False

        if max_inactive_days and user["last_login_days"] > max_inactive_days:
            return False

        if require_premium and user["subscription"] != "premium":
            return False

        return True

    return filter_user

# Create different filters by composition
adult_filter = create_user_filter(min_age=18)
active_premium_filter = create_user_filter(
    max_inactive_days=30,
    require_premium=True
)

# Use filters
users = [
    {"name": "Alice", "age": 25, "last_login_days": 5, "subscription": "premium"},
    {"name": "Bob", "age": 17, "last_login_days": 2, "subscription": "free"},
    {"name": "Carol", "age": 30, "last_login_days": 45, "subscription": "premium"},
]

adults = list(filter(adult_filter, users))
active_premium = list(filter(active_premium_filter, users))

# Testing is trivial
def test_filters():
    """Test individual filter functions."""
    # Test age filter
    assert is_adult(18) == True
    assert is_adult(17) == False

    # Test active filter
    assert is_active(30) == True
    assert is_active(31) == False

    # Test premium filter
    assert has_premium("premium") == True
    assert has_premium("free") == False

    # Test composed filter
    filter_func = create_user_filter(min_age=18, require_premium=True)
    assert filter_func({"age": 25, "subscription": "premium"}) == True
    assert filter_func({"age": 17, "subscription": "premium"}) == False
```

#### 3. Logging: Pure Functions with Side-Effect Logging

```python
from typing import Dict, Any, Callable
import logging
import time
from functools import wraps

logger = logging.getLogger(__name__)

def log_function_call(func: Callable) -> Callable:
    """
    Decorator to log function calls without affecting purity.

    FP Best Practice:
    - Logging is acceptable side effect
    - Doesn't change function behavior
    - Adds observability
    """
    @wraps(func)
    def logged(*args, **kwargs):
        # Generate trace ID
        trace_id = f"TRACE-{int(time.time() * 1000)}"

        # Log input
        logger.debug(
            f"[{trace_id}] Calling {func.__name__} "
            f"with args={args}, kwargs={kwargs}"
        )

        # Time execution
        start = time.time()

        try:
            result = func(*args, **kwargs)

            # Log success
            duration = time.time() - start
            logger.info(
                f"[{trace_id}] {func.__name__} completed "
                f"in {duration:.3f}s"
            )

            return result

        except Exception as e:
            # Log failure
            duration = time.time() - start
            logger.error(
                f"[{trace_id}] {func.__name__} failed "
                f"after {duration:.3f}s: {str(e)}",
                exc_info=True
            )
            raise

    return logged

@log_function_call
def calculate_discount(price: float, customer_tier: str) -> float:
    """
    Calculate discount - pure function with logging.

    Function is still pure:
    - Same input → same output
    - No state modification
    - Logging is observability side effect
    """
    tier_discounts = {
        "bronze": 0.05,
        "silver": 0.10,
        "gold": 0.15,
        "platinum": 0.20
    }

    discount_rate = tier_discounts.get(customer_tier, 0.0)
    discount = price * discount_rate

    # Log business metrics
    logger.info(
        f"Discount calculation: "
        f"price=${price:.2f}, "
        f"tier={customer_tier}, "
        f"rate={discount_rate*100}%, "
        f"discount=${discount:.2f}"
    )

    return discount

@log_function_call
def process_transaction(transaction: Dict) -> Dict:
    """
    Process transaction with comprehensive logging.

    Pure function:
    - Takes transaction dict
    - Returns new result dict
    - Original transaction unchanged
    - All logging is side effect for observability
    """
    # Validate
    if transaction["amount"] <= 0:
        logger.error(
            f"Invalid transaction: "
            f"amount ${transaction['amount']} must be positive"
        )
        raise ValueError("Amount must be positive")

    # Calculate
    discount = calculate_discount(
        transaction["amount"],
        transaction["customer_tier"]
    )

    final_amount = transaction["amount"] - discount

    # Log business event
    logger.info(
        f"Transaction processed: "
        f"ID={transaction['id']}, "
        f"original=${transaction['amount']:.2f}, "
        f"discount=${discount:.2f}, "
        f"final=${final_amount:.2f}"
    )

    # Return new result (immutable)
    return {
        **transaction,
        "discount": discount,
        "final_amount": final_amount,
        "status": "processed"
    }

# Usage - pure functions with full observability
transaction = {
    "id": "TXN-123",
    "amount": 100.00,
    "customer_tier": "gold"
}

result = process_transaction(transaction)

# Original unchanged
print(transaction["status"])  # KeyError - original unchanged
print(result["status"])       # "processed"
```

## Use Cases

### When to Use OOP

#### 1. Healthcare: Patient Management System

```python
class Patient:
    """
    Patient with medical history.

    Why OOP:
    - Patient has identity (not just data)
    - Complex state (medical records, appointments)
    - Encapsulation (privacy for sensitive data)
    - Natural modeling (real-world entity)
    """

    def __init__(self, patient_id: str, name: str, date_of_birth: str):
        self.patient_id = patient_id
        self.name = name
        self.date_of_birth = date_of_birth
        self.__medical_records = []  # Private - HIPAA compliance
        self.__prescriptions = []    # Private - sensitive data

    def add_medical_record(self, record: dict, authorized_by: str):
        """
        Add medical record with authorization check.

        Why OOP shines here:
        - Encapsulation protects sensitive data
        - Object manages its own security
        - State changes are controlled
        """
        # Audit log for HIPAA
        logger.info(
            f"Medical record added for patient {self.patient_id} "
            f"by {authorized_by}"
        )

        self.__medical_records.append({
            **record,
            "added_by": authorized_by,
            "added_at": datetime.now()
        })

    def get_medical_history(self, requested_by: str,
                           authorization_level: str) -> list:
        """
        Get medical history with access control.

        OOP benefit: Object enforces its own access rules.
        """
        # Access control
        if authorization_level not in ["doctor", "admin"]:
            logger.warning(
                f"Unauthorized access attempt to patient {self.patient_id} "
                f"by {requested_by}"
            )
            raise PermissionError("Insufficient authorization")

        # Audit log
        logger.info(
            f"Medical records accessed for patient {self.patient_id} "
            f"by {requested_by}"
        )

        return self.__medical_records.copy()

# Usage
patient = Patient("P-12345", "John Doe", "1980-01-01")
patient.add_medical_record(
    {"diagnosis": "Hypertension", "date": "2024-01-15"},
    authorized_by="Dr. Smith"
)

# Access control enforced by object
try:
    records = patient.get_medical_history("Nurse Jane", "nurse")
except PermissionError:
    print("Access denied")  # Object protects itself
```

#### 2. Finance: Trading System

```python
class TradingAccount:
    """
    Trading account with position management.

    Why OOP:
    - Complex state (positions, orders, cash)
    - Identity critical (each account is unique)
    - Encapsulation (protect financial data)
    - Transactions must be atomic
    """

    def __init__(self, account_id: str, initial_balance: float):
        self.account_id = account_id
        self.__cash = initial_balance
        self.__positions = {}  # symbol → quantity
        self.__pending_orders = []
        self.__transaction_log = []

    def place_order(self, symbol: str, quantity: int,
                   price: float, order_type: str) -> str:
        """
        Place trading order with validation.

        OOP strength: All validation and state management in one place.
        """
        order_id = f"ORD-{len(self.__pending_orders) + 1}"

        # Validation
        total_cost = quantity * price

        if order_type == "buy" and total_cost > self.__cash:
            logger.error(
                f"Order rejected for {self.account_id}: "
                f"Insufficient funds (need ${total_cost}, have ${self.__cash})"
            )
            raise ValueError("Insufficient funds")

        if order_type == "sell":
            current_position = self.__positions.get(symbol, 0)
            if quantity > current_position:
                logger.error(
                    f"Order rejected for {self.account_id}: "
                    f"Insufficient position (need {quantity}, have {current_position})"
                )
                raise ValueError("Insufficient position")

        # Create order
        order = {
            "order_id": order_id,
            "symbol": symbol,
            "quantity": quantity,
            "price": price,
            "type": order_type,
            "status": "pending"
        }

        self.__pending_orders.append(order)

        logger.info(
            f"Order placed for {self.account_id}: "
            f"{order_type} {quantity} {symbol} @ ${price}"
        )

        return order_id

    def execute_order(self, order_id: str):
        """
        Execute pending order atomically.

        OOP benefit: Atomic state updates, impossible to have inconsistent state.
        """
        # Find order
        order = next(
            (o for o in self.__pending_orders if o["order_id"] == order_id),
            None
        )

        if not order:
            raise ValueError(f"Order {order_id} not found")

        # Execute atomically
        if order["type"] == "buy":
            cost = order["quantity"] * order["price"]
            self.__cash -= cost
            self.__positions[order["symbol"]] = (
                self.__positions.get(order["symbol"], 0) + order["quantity"]
            )
        else:  # sell
            proceeds = order["quantity"] * order["price"]
            self.__cash += proceeds
            self.__positions[order["symbol"]] -= order["quantity"]

        # Update order status
        order["status"] = "executed"
        self.__pending_orders.remove(order)
        self.__transaction_log.append(order)

        logger.info(
            f"Order executed for {self.account_id}: {order_id}"
        )
```

#### 3. E-commerce: Shopping Cart

```python
class ShoppingCart:
    """
    Shopping cart with session management.

    Why OOP:
    - Stateful (items persist during session)
    - Identity (each cart belongs to a user)
    - Behavior (add, remove, calculate)
    - Lifecycle (created, modified, checked out)
    """

    def __init__(self, user_id: str, session_id: str):
        self.user_id = user_id
        self.session_id = session_id
        self.items = []
        self.created_at = datetime.now()
        self.last_modified = datetime.now()

    def add_item(self, product_id: str, name: str,
                price: float, quantity: int):
        """
        Add item to cart.

        OOP: Cart manages its own state and business rules.
        """
        # Check if item already in cart
        existing = next(
            (item for item in self.items if item["product_id"] == product_id),
            None
        )

        if existing:
            # Update quantity
            existing["quantity"] += quantity
            logger.info(
                f"Updated quantity in cart {self.session_id}: "
                f"{name} now {existing['quantity']}"
            )
        else:
            # Add new item
            self.items.append({
                "product_id": product_id,
                "name": name,
                "price": price,
                "quantity": quantity
            })
            logger.info(
                f"Added to cart {self.session_id}: "
                f"{quantity}x {name} @ ${price}"
            )

        self.last_modified = datetime.now()

    def get_total(self) -> float:
        """Calculate cart total."""
        return sum(item["price"] * item["quantity"] for item in self.items)

    def checkout(self) -> dict:
        """
        Checkout cart.

        OOP: Cart transitions through states (active → checked out).
        """
        if not self.items:
            raise ValueError("Cannot checkout empty cart")

        total = self.get_total()

        order = {
            "order_id": f"ORD-{self.session_id}",
            "user_id": self.user_id,
            "items": self.items.copy(),
            "total": total,
            "timestamp": datetime.now()
        }

        # Clear cart after checkout
        self.items = []

        logger.info(
            f"Cart {self.session_id} checked out: "
            f"${total:.2f}, {len(order['items'])} items"
        )

        return order
```

### When to Use Functional Programming

#### 1. Healthcare: Clinical Data Analysis

```python
from typing import List, Dict
from functools import reduce

# Pure functions for clinical calculations
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """
    Calculate Body Mass Index.

    Why FP:
    - Pure calculation (no state)
    - Easy to test
    - Reusable
    - No side effects
    """
    if height_m <= 0:
        raise ValueError("Height must be positive")
    return weight_kg / (height_m ** 2)

def classify_bmi(bmi: float) -> str:
    """Classify BMI category."""
    if bmi < 18.5:
        return "underweight"
    elif bmi < 25:
        return "normal"
    elif bmi < 30:
        return "overweight"
    else:
        return "obese"

def calculate_cardiovascular_risk(age: int, cholesterol: float,
                                 blood_pressure: int, smoker: bool) -> float:
    """
    Calculate cardiovascular risk score.

    Pure function - deterministic, testable.
    """
    risk = 0.0

    # Age factor
    if age > 40:
        risk += (age - 40) * 0.5

    # Cholesterol factor
    if cholesterol > 200:
        risk += (cholesterol - 200) * 0.1

    # Blood pressure factor
    if blood_pressure > 120:
        risk += (blood_pressure - 120) * 0.2

    # Smoking factor
    if smoker:
        risk += 10.0

    return min(risk, 100.0)  # Cap at 100

# Process patient data using functional pipeline
def analyze_patient_cohort(patients: List[Dict]) -> Dict:
    """
    Analyze patient cohort using functional transformations.

    Why FP:
    - Data transformation pipeline
    - No mutations
    - Easy to parallelize
    - Clear data flow
    """
    # Add BMI to each patient (map)
    with_bmi = list(map(
        lambda p: {
            **p,
            "bmi": calculate_bmi(p["weight_kg"], p["height_m"]),
        },
        patients
    ))

    # Add BMI classification (map)
    with_classification = list(map(
        lambda p: {
            **p,
            "bmi_category": classify_bmi(p["bmi"])
        },
        with_bmi
    ))

    # Add risk score (map)
    with_risk = list(map(
        lambda p: {
            **p,
            "cv_risk": calculate_cardiovascular_risk(
                p["age"],
                p["cholesterol"],
                p["blood_pressure"],
                p["smoker"]
            )
        },
        with_classification
    ))

    # Calculate statistics (reduce)
    stats = {
        "total_patients": len(with_risk),
        "average_bmi": sum(p["bmi"] for p in with_risk) / len(with_risk),
        "high_risk_count": len([p for p in with_risk if p["cv_risk"] > 50]),
        "bmi_distribution": reduce(
            lambda acc, p: {
                **acc,
                p["bmi_category"]: acc.get(p["bmi_category"], 0) + 1
            },
            with_risk,
            {}
        )
    }

    return {
        "patients": with_risk,
        "statistics": stats
    }

# Usage - pure, testable, parallelizable
patients = [
    {"id": 1, "age": 45, "weight_kg": 80, "height_m": 1.75,
     "cholesterol": 220, "blood_pressure": 130, "smoker": True},
    {"id": 2, "age": 30, "weight_kg": 65, "height_m": 1.68,
     "cholesterol": 180, "blood_pressure": 115, "smoker": False},
]

results = analyze_patient_cohort(patients)
```

#### 2. Finance: Portfolio Analytics

```python
from typing import List, Dict, Callable
from functools import reduce

# Pure functions for financial calculations
def calculate_return(initial_price: float, final_price: float) -> float:
    """Calculate return percentage."""
    return ((final_price - initial_price) / initial_price) * 100

def calculate_volatility(returns: List[float]) -> float:
    """Calculate standard deviation of returns."""
    import math

    if not returns:
        return 0.0

    mean = sum(returns) / len(returns)
    variance = sum((r - mean) ** 2 for r in returns) / len(returns)
    return math.sqrt(variance)

def calculate_sharpe_ratio(returns: List[float], risk_free_rate: float = 0.02) -> float:
    """
    Calculate Sharpe ratio (risk-adjusted return).

    Pure function - perfect for financial calculations:
    - Deterministic
    - Easy to test
    - Auditable
    """
    if not returns:
        return 0.0

    avg_return = sum(returns) / len(returns)
    volatility = calculate_volatility(returns)

    if volatility == 0:
        return 0.0

    return (avg_return - risk_free_rate) / volatility

# Functional pipeline for portfolio analysis
def analyze_portfolio(holdings: List[Dict],
                     price_history: Dict[str, List[float]]) -> Dict:
    """
    Analyze portfolio using functional approach.

    Why FP:
    - Complex calculations
    - No state mutations
    - Easy to audit (financial compliance)
    - Testable components
    """
    # Calculate returns for each holding (map)
    with_returns = list(map(
        lambda h: {
            **h,
            "returns": [
                calculate_return(price_history[h["symbol"]][i],
                               price_history[h["symbol"]][i+1])
                for i in range(len(price_history[h["symbol"]]) - 1)
            ]
        },
        holdings
    ))

    # Calculate metrics for each holding (map)
    with_metrics = list(map(
        lambda h: {
            **h,
            "avg_return": sum(h["returns"]) / len(h["returns"]) if h["returns"] else 0,
            "volatility": calculate_volatility(h["returns"]),
            "sharpe": calculate_sharpe_ratio(h["returns"])
        },
        with_returns
    ))

    # Calculate portfolio-level metrics (reduce)
    total_value = sum(h["value"] for h in with_metrics)

    weighted_return = sum(
        (h["value"] / total_value) * h["avg_return"]
        for h in with_metrics
    )

    # Filter high-risk positions (filter)
    high_risk = list(filter(
        lambda h: h["volatility"] > 20,
        with_metrics
    ))

    return {
        "holdings": with_metrics,
        "portfolio_return": weighted_return,
        "total_value": total_value,
        "high_risk_positions": high_risk,
        "diversification_score": len(with_metrics)  # Simplified
    }

# Usage - pure, auditable, testable
holdings = [
    {"symbol": "AAPL", "value": 10000},
    {"symbol": "GOOGL", "value": 15000},
]

price_history = {
    "AAPL": [150, 155, 152, 160, 158],
    "GOOGL": [2800, 2850, 2820, 2900, 2880],
}

analysis = analyze_portfolio(holdings, price_history)
```

#### 3. E-commerce: Product Recommendation Engine

```python
from typing import List, Dict, Callable
from functools import reduce

# Pure functions for recommendation logic
def calculate_similarity(user_a_purchases: set, user_b_purchases: set) -> float:
    """
    Calculate Jaccard similarity between two users.

    Pure function - same users always give same similarity.
    """
    if not user_a_purchases or not user_b_purchases:
        return 0.0

    intersection = len(user_a_purchases & user_b_purchases)
    union = len(user_a_purchases | user_b_purchases)

    return intersection / union if union > 0 else 0.0

def score_product(product: Dict, user_profile: Dict) -> float:
    """
    Score product for user based on preferences.

    Pure calculation - testable, predictable.
    """
    score = 0.0

    # Category match
    if product["category"] in user_profile["preferred_categories"]:
        score += 10.0

    # Price range match
    if user_profile["min_price"] <= product["price"] <= user_profile["max_price"]:
        score += 5.0

    # Rating
    score += product["rating"] * 2.0

    # Popularity
    score += min(product["sales_count"] / 1000, 10.0)

    return score

def filter_products(products: List[Dict],
                   min_rating: float = 4.0,
                   max_price: float = None,
                   categories: List[str] = None) -> List[Dict]:
    """
    Filter products using functional composition.

    Why FP:
    - No mutations
    - Composable filters
    - Easy to test each filter
    """
    filtered = products

    # Apply filters functionally
    if min_rating:
        filtered = list(filter(lambda p: p["rating"] >= min_rating, filtered))

    if max_price:
        filtered = list(filter(lambda p: p["price"] <= max_price, filtered))

    if categories:
        filtered = list(filter(lambda p: p["category"] in categories, filtered))

    return filtered

def generate_recommendations(user: Dict,
                            all_products: List[Dict],
                            purchase_history: List[str],
                            top_n: int = 10) -> List[Dict]:
    """
    Generate product recommendations using functional pipeline.

    Why FP shines here:
    - Clear transformation steps
    - No side effects
    - Easy to modify algorithm
    - Testable components
    - Can run in parallel for multiple users
    """
    purchased_ids = set(purchase_history)

    # Filter out already purchased (filter)
    not_purchased = list(filter(
        lambda p: p["id"] not in purchased_ids,
        all_products
    ))

    # Score each product (map)
    with_scores = list(map(
        lambda p: {
            **p,
            "recommendation_score": score_product(p, user["profile"])
        },
        not_purchased
    ))

    # Sort by score
    sorted_products = sorted(
        with_scores,
        key=lambda p: p["recommendation_score"],
        reverse=True
    )

    # Take top N
    top_recommendations = sorted_products[:top_n]

    # Add explanation (map)
    with_explanation = list(map(
        lambda p: {
            **p,
            "reason": _generate_reason(p, user["profile"])
        },
        top_recommendations
    ))

    return with_explanation

def _generate_reason(product: Dict, profile: Dict) -> str:
    """Generate explanation for recommendation."""
    reasons = []

    if product["category"] in profile["preferred_categories"]:
        reasons.append(f"Matches your interest in {product['category']}")

    if product["rating"] >= 4.5:
        reasons.append("Highly rated")

    if product["sales_count"] > 1000:
        reasons.append("Popular choice")

    return " • ".join(reasons)

# Usage - pure, parallelizable, testable
user = {
    "id": "user123",
    "profile": {
        "preferred_categories": ["electronics", "books"],
        "min_price": 0,
        "max_price": 500
    }
}

products = [
    {"id": "p1", "name": "Laptop", "category": "electronics",
     "price": 999, "rating": 4.5, "sales_count": 5000},
    {"id": "p2", "name": "Mouse", "category": "electronics",
     "price": 25, "rating": 4.2, "sales_count": 10000},
    {"id": "p3", "name": "Python Book", "category": "books",
     "price": 45, "rating": 4.8, "sales_count": 3000},
]

purchase_history = ["p1"]

recommendations = generate_recommendations(user, products, purchase_history, top_n=5)
```

### Hybrid Approach: Best of Both Worlds

Most real-world applications use **both** OOP and FP:

```python
# OOP for domain models and state management
class OrderProcessor:
    """
    Order processor using hybrid OOP + FP approach.

    OOP for:
    - State management (connection pools, configuration)
    - Identity (each processor instance)
    - Lifecycle (initialization, cleanup)

    FP for:
    - Business logic (calculations, transformations)
    - Data validation
    - Transformations
    """

    def __init__(self, config: Dict):
        # OOP: Manage state and resources
        self.config = config
        self.processed_count = 0
        self.error_count = 0

    def process_order(self, order_data: Dict) -> Dict:
        """
        Process order using FP for business logic.

        Hybrid approach:
        - OOP manages lifecycle and state
        - FP handles transformations
        """
        try:
            # Use pure functions for business logic
            validated = validate_order(order_data)
            with_totals = calculate_order_totals(validated)
            with_tax = apply_tax(with_totals, self.config["tax_rate"])
            final = apply_discounts(with_tax)

            # OOP: Update state
            self.processed_count += 1

            return final

        except Exception as e:
            # OOP: Track errors
            self.error_count += 1
            logger.error(f"Order processing failed: {e}")
            raise

# Pure functions for business logic (FP)
def validate_order(order: Dict) -> Dict:
    """Validate order data - pure function."""
    if not order.get("items"):
        raise ValueError("Order must have items")
    return order

def calculate_order_totals(order: Dict) -> Dict:
    """Calculate totals - pure function."""
    subtotal = sum(item["price"] * item["quantity"] for item in order["items"])
    return {**order, "subtotal": subtotal}

def apply_tax(order: Dict, tax_rate: float) -> Dict:
    """Apply tax - pure function."""
    tax = order["subtotal"] * tax_rate
    return {**order, "tax": tax, "total": order["subtotal"] + tax}

def apply_discounts(order: Dict) -> Dict:
    """Apply discounts - pure function."""
    # Discount logic here
    return order
```

## Common Pitfalls

### OOP Pitfalls

#### 1. Over-Engineering with Deep Inheritance

```python
# ❌ BAD: Deep inheritance hierarchy
class Entity:
    pass

class LivingEntity(Entity):
    pass

class MovableEntity(LivingEntity):
    pass

class IntelligentEntity(MovableEntity):
    pass

class Player(IntelligentEntity):
    pass

# Problems:
# - Hard to understand
# - Fragile (changes at top affect everything)
# - Difficult to test
# - Tight coupling

# ✅ GOOD: Prefer composition over inheritance
class Entity:
    def __init__(self):
        self.components = {}

    def add_component(self, name: str, component):
        """Add component to entity."""
        self.components[name] = component

    def get_component(self, name: str):
        """Get component from entity."""
        return self.components.get(name)

class MovementComponent:
    """Handles movement."""
    def move(self, x, y):
        pass

class HealthComponent:
    """Handles health."""
    def take_damage(self, amount):
        pass

class AIComponent:
    """Handles AI behavior."""
    def think(self):
        pass

# Compose behavior
player = Entity()
player.add_component("movement", MovementComponent())
player.add_component("health", HealthComponent())
player.add_component("ai", AIComponent())

# Flexible, testable, maintainable
```

#### 2. God Objects (Too Much Responsibility)

```python
# ❌ BAD: God object that does everything
class UserManager:
    """Handles EVERYTHING related to users."""

    def create_user(self, data):
        pass

    def delete_user(self, user_id):
        pass

    def send_email(self, user_id, message):
        pass

    def generate_report(self, user_id):
        pass

    def process_payment(self, user_id, amount):
        pass

    def analyze_behavior(self, user_id):
        pass

# Problems:
# - Violates Single Responsibility Principle
# - Hard to test (too many dependencies)
# - Hard to maintain (changes affect everything)
# - Hard to understand (what does this class do?)

# ✅ GOOD: Separate responsibilities
class UserRepository:
    """Handles user data persistence."""
    def create(self, user_data):
        pass

    def delete(self, user_id):
        pass

    def find(self, user_id):
        pass

class EmailService:
    """Handles email sending."""
    def send(self, to_email, message):
        pass

class ReportGenerator:
    """Handles report generation."""
    def generate(self, user_id):
        pass

class PaymentProcessor:
    """Handles payment processing."""
    def process(self, user_id, amount):
        pass

# Each class has one clear responsibility
# Easy to test, maintain, and understand
```

#### 3. Mutable State Causing Bugs

```python
# ❌ BAD: Shared mutable state
class Cart:
    items = []  # Class variable - shared across ALL instances!

    def add_item(self, item):
        self.items.append(item)

# This causes a bug
cart1 = Cart()
cart2 = Cart()

cart1.add_item("Book")
cart2.add_item("Pen")

print(cart1.items)  # ["Book", "Pen"] - UNEXPECTED!
print(cart2.items)  # ["Book", "Pen"] - SHARED STATE!

# ✅ GOOD: Instance variables
class Cart:
    def __init__(self):
        self.items = []  # Instance variable - unique per instance

    def add_item(self, item):
        self.items.append(item)

# Now it works correctly
cart1 = Cart()
cart2 = Cart()

cart1.add_item("Book")
cart2.add_item("Pen")

print(cart1.items)  # ["Book"]
print(cart2.items)  # ["Pen"]
```

### Functional Programming Pitfalls

#### 1. Hidden Side Effects

```python
# ❌ BAD: Hidden side effect in "pure" function
total_processed = 0

def process_item(item):
    """
    Looks pure but has hidden side effect.

    Problems:
    - Not truly pure (modifies global)
    - Hard to test
    - Race conditions in parallel execution
    """
    global total_processed
    total_processed += 1  # Hidden side effect!
    return item["value"] * 2

# ✅ GOOD: Truly pure function
def process_item_pure(item):
    """Pure function with no side effects."""
    return item["value"] * 2

def process_all_items(items):
    """
    Handle state explicitly.

    Returns tuple of (results, count) instead of hidden global.
    """
    results = [process_item_pure(item) for item in items]
    return results, len(results)

# Usage
items = [{"value": 10}, {"value": 20}]
results, count = process_all_items(items)
```

#### 2. Overuse of Immutability (Performance Issues)

```python
# ❌ BAD: Inefficient immutable operations
def add_items_slowly(items_list, new_items):
    """
    Creating new list every iteration is slow.

    Problem: O(n²) complexity due to list copying.
    """
    result = items_list
    for item in new_items:
        result = result + [item]  # Creates new list every time!
    return result

# For 1000 items, creates 1000 intermediate lists

# ✅ GOOD: Use efficient data structures
def add_items_efficiently(items_tuple, new_items):
    """
    Use appropriate data structure.

    Options:
    - Use list comprehension
    - Use itertools for lazy evaluation
    - Use functional libraries (toolz, pyrsistent)
    """
    # Efficient: single list creation
    return items_tuple + tuple(new_items)

# Or for truly functional approach with persistent data structures
from pyrsistent import pvector

def add_items_persistent(items_pvector, new_items):
    """
    Use persistent data structure (efficient immutability).

    pvector uses structural sharing - O(log n) instead of O(n).
    """
    result = items_pvector
    for item in new_items:
        result = result.append(item)  # Structural sharing, not copying!
    return result
```

#### 3. Obscure One-Liners

```python
# ❌ BAD: Unreadable functional code
process = lambda data: reduce(lambda a, b: {**a, **{b['id']: list(map(lambda x: {**x, 'processed': True}, filter(lambda y: y['active'], b['items'])))}} if b['items'] else a, data, {})

# What does this do? Nobody knows without debugging.

# ✅ GOOD: Clear, readable functional code
def process_items(data):
    """
    Process active items in each record.

    Clear steps:
    1. Filter for active items
    2. Mark as processed
    3. Group by ID
    """
    def process_record(record):
        # Filter active items
        active_items = filter(lambda item: item['active'], record['items'])

        # Mark as processed
        processed_items = map(
            lambda item: {**item, 'processed': True},
            active_items
        )

        return {record['id']: list(processed_items)}

    # Process all records
    processed_records = map(process_record, data)

    # Merge into single dict
    return reduce(
        lambda acc, record: {**acc, **record},
        processed_records,
        {}
    )

# Much clearer! Break complex operations into named steps.
```

## Quick Reference

### When to Choose OOP vs FP

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    OOP vs FP Decision Guide                                  │
├────────────────────────────────────┬─────────────────────────────────────────┤
│ Use OOP When...                    │ Use FP When...                          │
├────────────────────────────────────┼─────────────────────────────────────────┤
│ • Identity matters                 │ • Transforming data                     │
│   (users, accounts, entities)      │   (parsing, filtering, mapping)         │
│                                    │                                         │
│ • Complex state management         │ • Stateless calculations                │
│   (workflows, sessions)            │   (math, algorithms, validations)       │
│                                    │                                         │
│ • Encapsulation needed             │ • Parallel/concurrent processing        │
│   (security, privacy)              │   (data pipelines, analytics)           │
│                                    │                                         │
│ • Natural domain modeling          │ • Composing operations                  │
│   (real-world entities)            │   (building complex from simple)        │
│                                    │                                         │
│ • Framework expects it             │ • Testing is priority                   │
│   (Django, Rails, Spring)          │   (pure functions trivial to test)      │
│                                    │                                         │
│ • Team prefers OOP                 │ • Debugging is critical                 │
│   (existing codebase)              │   (no hidden state)                     │
├────────────────────────────────────┴─────────────────────────────────────────┤
│ HYBRID APPROACH (Recommended):                                               │
│ • Use OOP for structure (models, services, repositories)                     │
│ • Use FP for logic (calculations, transformations, validations)              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### OOP Quick Reference

```python
# Class definition
class ClassName:
    # Class variable (shared across instances)
    class_var = "shared"

    def __init__(self, param):
        # Instance variable (unique per instance)
        self.instance_var = param
        self.__private_var = "hidden"  # Private (name mangling)

    def public_method(self):
        """Public method."""
        pass

    def __private_method(self):
        """Private method."""
        pass

    @staticmethod
    def static_method():
        """No access to instance or class."""
        pass

    @classmethod
    def class_method(cls):
        """Access to class, not instance."""
        pass

# Inheritance
class Child(Parent):
    def __init__(self):
        super().__init__()  # Call parent constructor

    def method(self):
        """Override parent method."""
        pass

# Multiple inheritance
class Child(Parent1, Parent2):
    pass

# Polymorphism
def use_animal(animal):
    """Works with any animal type."""
    animal.make_sound()
```

### FP Quick Reference

```python
# Pure function
def pure(x, y):
    """Same input → same output, no side effects."""
    return x + y

# Higher-order function
def higher_order(func, value):
    """Takes function as argument."""
    return func(value)

# Return function
def create_multiplier(n):
    """Returns function."""
    return lambda x: x * n

# Map: transform each element
result = list(map(lambda x: x * 2, [1, 2, 3]))
# [2, 4, 6]

# Filter: keep elements matching condition
result = list(filter(lambda x: x > 2, [1, 2, 3, 4]))
# [3, 4]

# Reduce: combine elements
from functools import reduce
result = reduce(lambda acc, x: acc + x, [1, 2, 3, 4], 0)
# 10

# Immutable update
original = {"a": 1, "b": 2}
updated = {**original, "b": 3}
# original unchanged: {"a": 1, "b": 2}
# updated: {"a": 1, "b": 3}

# Function composition
def compose(f, g):
    """Compose two functions."""
    return lambda x: f(g(x))

add_one = lambda x: x + 1
times_two = lambda x: x * 2
add_then_multiply = compose(times_two, add_one)
result = add_then_multiply(5)  # (5 + 1) * 2 = 12
```

### Best Practices Summary

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Best Practices Checklist                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ SAFETY:                                                                      │
│ ☐ Validate all inputs                                                       │
│ ☐ Handle errors explicitly                                                  │
│ ☐ Protect sensitive data (private attributes, encapsulation)                │
│ ☐ Use type hints                                                            │
│ ☐ Avoid global state                                                        │
│                                                                              │
│ QUALITY:                                                                     │
│ ☐ Single Responsibility Principle (one class/function = one job)            │
│ ☐ Write testable code (pure functions, dependency injection)                │
│ ☐ Keep functions small (<50 lines)                                          │
│ ☐ Meaningful names (not x, y, temp)                                         │
│ ☐ Document complex logic                                                    │
│                                                                              │
│ LOGGING:                                                                     │
│ ☐ Log business events                                                       │
│ ☐ Log errors with context                                                   │
│ ☐ Use trace IDs for request correlation                                     │
│ ☐ Log performance metrics                                                   │
│ ☐ Structured logging (JSON format)                                          │
│                                                                              │
│ OOP SPECIFIC:                                                                │
│ ☐ Prefer composition over inheritance                                       │
│ ☐ Keep inheritance hierarchies shallow (<3 levels)                          │
│ ☐ Use private attributes for internal state                                 │
│ ☐ Provide clear public interfaces                                           │
│                                                                              │
│ FP SPECIFIC:                                                                 │
│ ☐ Write pure functions when possible                                        │
│ ☐ Avoid mutations                                                           │
│ ☐ Handle side effects explicitly                                            │
│ ☐ Break complex pipelines into named steps                                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Related Topics

### Within This Repository

- **[Data Structures](../data-structures/README.md)**: Understanding how to organize data regardless of paradigm
- **[Design Patterns](../design-patterns/README.md)**: Common patterns in OOP and FP
- **[Testing Strategies](../../03-methodologies/testing/README.md)**: How to test OOP vs FP code
- **[Code Quality](../../03-methodologies/code-quality/README.md)**: Writing maintainable code in any paradigm

### Core Concepts to Learn Next

1. **SOLID Principles** (OOP): Five principles for good object-oriented design
2. **Composition vs Inheritance**: Detailed exploration of code reuse strategies
3. **Monads and Functors** (FP): Advanced functional patterns
4. **Reactive Programming**: FP-inspired approach to async/event-driven systems

### Languages to Explore

- **Python**: Supports both OOP and FP (great for learning both)
- **JavaScript**: Multi-paradigm (functions are first-class citizens)
- **Java**: Classic OOP with some FP features (streams, lambdas)
- **Haskell**: Pure functional language
- **Scala**: Combines OOP and FP
- **Rust**: Multi-paradigm with strong FP influence

### Industry Resources

- **Books**:
  - "Design Patterns" (Gang of Four) — OOP patterns
  - "Functional Programming in JavaScript" (Luis Atencio)
  - "Clean Code" (Robert Martin) — Applies to both paradigms

- **Practice**:
  - Refactor OOP code to FP and vice versa
  - Implement same problem in both styles
  - Contribute to open source (see different styles in practice)

---

**Remember**: OOP and FP are tools, not religions. The best programmers know both and choose based on the problem, not ideology. Most modern applications use a hybrid approach — OOP for structure, FP for logic.

**Key Takeaway**: Start with simple examples, understand the principles, practice both styles, and let the problem guide your choice.
