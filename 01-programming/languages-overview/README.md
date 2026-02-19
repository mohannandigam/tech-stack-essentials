# Programming Languages Overview

## What is it?

A **programming language** is a formal set of instructions that tells a computer what to do. Just as human languages (English, Spanish, Mandarin) let people communicate ideas, programming languages let humans communicate instructions to computers. Each programming language has its own syntax (grammar rules), semantics (meaning), and philosophy (way of approaching problems).

Different programming languages are designed for different purposes. Some are great for building websites (JavaScript), others excel at data science (Python), some are built for system programming (Rust, C), and others are designed for enterprise applications (Java). Choosing the right language for your project is like choosing the right tool for a job — you can hammer a nail with a wrench, but a hammer works better.

This guide covers **seven essential languages** you'll encounter in modern software development: Python, JavaScript, TypeScript, Java, Go, Rust, and SQL. We'll explore what makes each unique, when to use them, and how to choose the right one for your needs.

## Simple Analogy

### Programming languages are like vehicles

Different vehicles are designed for different purposes:

- **Python**: Like a comfortable family car — easy to drive, versatile, works for most daily tasks (errands, commuting, road trips)
- **JavaScript**: Like a delivery van — goes everywhere (every website needs it), carries lots of different cargo, adaptable
- **TypeScript**: Like the same delivery van but with GPS and safety features — adds guidance and catches mistakes before they happen
- **Java**: Like a heavy-duty truck — built for serious work, reliable, used by big companies to haul important cargo
- **Go**: Like an efficient hybrid — simple, fast, great fuel economy, perfect for modern city driving (cloud services)
- **Rust**: Like a race car — incredibly fast, precise control, but requires expert driving; won't let you crash
- **SQL**: Like a forklift — specialized tool for one specific job (organizing and finding things in warehouses/databases), essential but not for general transportation

Just as you wouldn't use a race car for grocery shopping or a family car for Formula 1, you choose programming languages based on what you're building.

## Why Does it Matter?

### Real-World Impact

**Choosing the right programming language affects:**

1. **Development speed**: Some languages let you build faster (Python, JavaScript)
2. **Performance**: Some languages run faster (Rust, Go, Java)
3. **Hiring**: Some languages have bigger talent pools (JavaScript, Python, Java)
4. **Ecosystem**: Libraries and tools available (npm for JavaScript, PyPI for Python)
5. **Maintenance**: Long-term cost of maintaining code
6. **Career opportunities**: Some languages are more in-demand

**Industry reality:**
- **Startups** often choose Python or JavaScript (fast development, flexibility)
- **Big tech** uses multiple languages (Google: Go, Java, Python; Facebook: PHP, Python, C++)
- **Finance** often uses Java or C++ (performance, stability)
- **Data science** overwhelmingly uses Python (and R)
- **Mobile** requires platform-specific languages (Swift/Objective-C for iOS, Kotlin/Java for Android)
- **Every company** uses SQL (databases are universal)

**Career impact:**
- Knowing Python + JavaScript covers ~70% of job postings
- Adding Java or Go opens enterprise opportunities
- SQL is essential for almost every role
- Specializing in Rust or Go can command premium salaries

## How It Works

### Language Characteristics

Every programming language has these characteristics:

```
┌──────────────────────────────────────────────────────────────────┐
│                  Programming Language Anatomy                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SYNTAX                                                       │
│     Rules for writing valid code                                │
│     Example: Python uses indentation, JavaScript uses braces    │
│                                                                  │
│  2. SEMANTICS                                                    │
│     Meaning of the code                                          │
│     What happens when you run it                                │
│                                                                  │
│  3. TYPE SYSTEM                                                  │
│     How data types are handled                                   │
│     Static (types checked before running) vs Dynamic             │
│                                                                  │
│  4. PARADIGM                                                     │
│     Programming style supported                                  │
│     OOP, Functional, Procedural, or Multi-paradigm              │
│                                                                  │
│  5. RUNTIME                                                      │
│     How code is executed                                         │
│     Compiled, Interpreted, or Just-In-Time (JIT)                │
│                                                                  │
│  6. MEMORY MANAGEMENT                                            │
│     How memory is handled                                        │
│     Manual, Garbage Collection, or Ownership (Rust)             │
│                                                                  │
│  7. ECOSYSTEM                                                    │
│     Libraries, frameworks, tools, community                      │
│     Package managers, documentation, support                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Compilation vs Interpretation

```
COMPILED LANGUAGE (e.g., Go, Rust, Java to bytecode)
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Source Code │  →   │  Compiler    │  →   │  Executable  │
│  (human)     │      │              │      │  (machine)   │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   ↓
                                            Run directly

INTERPRETED LANGUAGE (e.g., Python, JavaScript)
┌──────────────┐      ┌──────────────┐
│  Source Code │  →   │  Interpreter │  →  Runs line by line
│  (human)     │      │  (runtime)   │
└──────────────┘      └──────────────┘

HYBRID (e.g., Java, Python)
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Source Code │  →   │  Compiler    │  →   │  Bytecode    │
│              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   ↓
                                            ┌──────────────┐
                                            │  VM/Runtime  │
                                            │  interprets  │
                                            └──────────────┘
```

**Compiled languages**: Faster runtime, longer build time, catch errors early
**Interpreted languages**: Faster development, slower runtime, errors found at runtime
**Hybrid**: Balance of both

## Key Concepts

### Type Systems

```
┌──────────────────────────────────────────────────────────────────┐
│                         Type Systems                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STATIC TYPING (Java, Go, Rust, TypeScript)                     │
│  - Types checked at compile time                                │
│  - Must declare types explicitly (or inferred)                  │
│  - Catches type errors before running                           │
│  - Better IDE support (autocomplete, refactoring)               │
│                                                                  │
│  Example (Java):                                                 │
│    String name = "Alice";    // Type declared                   │
│    int age = 25;             // Must be int                     │
│    name = 42;                // ❌ Compile error!               │
│                                                                  │
│  DYNAMIC TYPING (Python, JavaScript)                            │
│  - Types checked at runtime                                     │
│  - No type declarations needed                                  │
│  - Variables can change types                                   │
│  - Faster to write, but more runtime errors                     │
│                                                                  │
│  Example (Python):                                               │
│    name = "Alice"            # Type inferred                    │
│    age = 25                  # Type inferred                    │
│    name = 42                 # ✅ Works! Changed type           │
│                                                                  │
│  GRADUAL TYPING (TypeScript, Python with type hints)            │
│  - Optional type annotations                                    │
│  - Best of both worlds                                          │
│  - Add types where needed                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Memory Management

```
┌──────────────────────────────────────────────────────────────────┐
│                    Memory Management                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MANUAL (C, C++)                                                 │
│  - Programmer allocates and frees memory                        │
│  - Fast, but error-prone                                         │
│  - Memory leaks if you forget to free                           │
│                                                                  │
│  GARBAGE COLLECTION (Python, JavaScript, Java, Go)              │
│  - Runtime automatically frees unused memory                    │
│  - Easier to use, but less control                              │
│  - Pause times (GC can slow down program briefly)              │
│                                                                  │
│  OWNERSHIP (Rust)                                                │
│  - Compile-time memory safety                                   │
│  - No garbage collector needed                                  │
│  - Zero-cost abstractions                                       │
│  - Steep learning curve                                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## The Seven Essential Languages

### 1. Python

**What is it?**

Python is a high-level, dynamically-typed, interpreted language designed for readability and simplicity. Created by Guido van Rossum in 1991, Python's philosophy emphasizes code readability and a syntax that lets programmers express concepts in fewer lines than languages like Java or C++.

**Simple analogy**: Python is like writing in plain English — if you can explain your logic clearly in words, you can probably write it in Python.

**Characteristics**:
- **Type system**: Dynamic, duck typing
- **Paradigm**: Multi-paradigm (OOP, functional, procedural)
- **Execution**: Interpreted (CPython), but also JIT compilers available (PyPy)
- **Memory**: Automatic garbage collection

**Syntax example**:

```python
# Hello World
print("Hello, World!")

# Variables (no type declaration needed)
name = "Alice"
age = 25
is_student = True

# Functions
def calculate_discount(price, discount_percent):
    """
    Calculate discounted price.

    Python philosophy:
    - Explicit is better than implicit
    - Readability counts
    - Simple is better than complex
    """
    discount = price * (discount_percent / 100)
    return price - discount

# Object-Oriented Programming
class BankAccount:
    """Bank account with balance tracking."""

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        """Add money to account."""
        if amount > 0:
            self.balance += amount
            return True
        return False

    def get_balance(self):
        """Get current balance."""
        return self.balance

# List comprehension (Python's elegant feature)
numbers = [1, 2, 3, 4, 5]
squared = [n ** 2 for n in numbers]  # [1, 4, 9, 16, 25]

# Dictionary (Python's hash map)
user = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
}

# Error handling
def divide(a, b):
    """Divide with error handling."""
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Cannot divide by zero")
        return None

# Working with files
def read_file(filename):
    """Read file with automatic cleanup."""
    try:
        with open(filename, 'r') as file:
            content = file.read()
            return content
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
```

**Real-world example: Data processing**:

```python
import logging
from typing import List, Dict
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_sales_data(sales: List[Dict]) -> Dict:
    """
    Process sales data and calculate statistics.

    Best Practices:
    - Type hints for clarity
    - Logging for observability
    - Error handling
    - Clear function documentation
    """
    logger.info(f"Processing {len(sales)} sales records")

    # Validation
    if not sales:
        logger.warning("No sales data to process")
        return {"total": 0, "count": 0, "average": 0}

    # Calculate statistics using Python's built-in functions
    total_amount = sum(sale['amount'] for sale in sales)
    count = len(sales)
    average = total_amount / count

    # Filter high-value sales
    high_value_sales = [
        sale for sale in sales
        if sale['amount'] > 1000
    ]

    result = {
        "total": total_amount,
        "count": count,
        "average": average,
        "high_value_count": len(high_value_sales),
        "processed_at": datetime.now().isoformat()
    }

    logger.info(
        f"Processing complete: "
        f"total=${total_amount:.2f}, "
        f"average=${average:.2f}"
    )

    return result

# Usage
sales_data = [
    {"id": 1, "amount": 100.50, "date": "2024-01-01"},
    {"id": 2, "amount": 1500.00, "date": "2024-01-02"},
    {"id": 3, "amount": 75.25, "date": "2024-01-03"},
]

stats = process_sales_data(sales_data)
print(stats)
```

**Strengths**:
- ✅ **Highly readable**: Code looks like pseudocode
- ✅ **Huge ecosystem**: Libraries for everything (web, data science, ML, automation)
- ✅ **Fast development**: Write less code to do more
- ✅ **Great for beginners**: Gentle learning curve
- ✅ **Versatile**: Web, data science, automation, scripting, ML/AI
- ✅ **Strong community**: Abundant resources, tutorials, support

**Weaknesses**:
- ❌ **Slower execution**: Interpreted language, not as fast as compiled languages
- ❌ **GIL (Global Interpreter Lock)**: Limits multi-threading for CPU-bound tasks
- ❌ **Mobile development**: Not ideal for iOS/Android apps
- ❌ **Type safety**: Dynamic typing can lead to runtime errors
- ❌ **Memory consumption**: Higher than compiled languages

**When to use Python**:
- Data science and machine learning
- Web backends (Django, Flask, FastAPI)
- Automation and scripting
- Data processing and ETL
- Prototyping and MVPs
- Scientific computing

**When NOT to use Python**:
- Real-time systems requiring ultra-low latency
- Mobile app development
- System programming (OS, drivers)
- High-performance computing (use C++, Rust instead)

**Popular frameworks/libraries**:
- **Web**: Django, Flask, FastAPI
- **Data Science**: Pandas, NumPy, SciPy
- **Machine Learning**: TensorFlow, PyTorch, scikit-learn
- **Automation**: Selenium, Beautiful Soup, Scrapy

### 2. JavaScript

**What is it?**

JavaScript is a high-level, dynamically-typed language originally created for web browsers in 1995. Now it runs everywhere — browsers, servers (Node.js), mobile apps, desktop apps, and even IoT devices. It's the only language that runs natively in all web browsers, making it essential for web development.

**Simple analogy**: JavaScript is like the duct tape of the internet — it's everywhere, holds everything together, and you can build almost anything with it (even if sometimes it shouldn't be used that way).

**Characteristics**:
- **Type system**: Dynamic, weakly typed
- **Paradigm**: Multi-paradigm (functional, OOP, event-driven)
- **Execution**: Interpreted, JIT compiled (V8 engine)
- **Memory**: Automatic garbage collection

**Syntax example**:

```javascript
// Hello World
console.log("Hello, World!");

// Variables (multiple ways to declare)
const name = "Alice";  // Cannot reassign (immutable binding)
let age = 25;          // Can reassign (mutable binding)
var old = "don't use"; // Old way, avoid in modern JavaScript

// Functions (multiple styles)

// Function declaration
function calculateDiscount(price, discountPercent) {
    /**
     * Calculate discounted price.
     *
     * JavaScript quirks:
     * - Automatic semicolon insertion
     * - Type coercion (automatic type conversion)
     * - Flexible function syntax
     */
    const discount = price * (discountPercent / 100);
    return price - discount;
}

// Arrow function (modern, concise)
const calculateTax = (price, taxRate) => {
    return price * taxRate;
};

// Arrow function (even more concise)
const double = n => n * 2;

// Object-Oriented Programming (prototypes and classes)
class BankAccount {
    /**
     * Bank account with balance tracking.
     *
     * Modern JavaScript uses class syntax (syntactic sugar over prototypes).
     */
    constructor(owner, balance = 0) {
        this.owner = owner;
        this.balance = balance;
    }

    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            return true;
        }
        return false;
    }

    getBalance() {
        return this.balance;
    }
}

// Array methods (functional programming style)
const numbers = [1, 2, 3, 4, 5];

// Map: transform each element
const squared = numbers.map(n => n ** 2);  // [1, 4, 9, 16, 25]

// Filter: keep elements matching condition
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// Reduce: combine elements
const sum = numbers.reduce((total, n) => total + n, 0);  // 15

// Objects (JavaScript's primary data structure)
const user = {
    name: "Alice",
    age: 25,
    email: "alice@example.com",
    // Method shorthand
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// Destructuring (extract values from objects/arrays)
const { name, email } = user;
const [first, second, ...rest] = numbers;

// Spread operator (copy and merge)
const userCopy = { ...user };
const allNumbers = [...numbers, 6, 7, 8];

// Async programming (Promises and async/await)
async function fetchUserData(userId) {
    /**
     * Fetch user data from API.
     *
     * JavaScript excels at asynchronous operations:
     * - Non-blocking I/O
     * - Event loop
     * - Promises and async/await
     */
    try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

// Error handling
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}
```

**Real-world example: API endpoint (Node.js)**:

```javascript
// Express.js server example
const express = require('express');
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Route handler
app.post('/api/orders', async (req, res) => {
    /**
     * Create new order.
     *
     * Best Practices:
     * - Input validation
     * - Error handling
     * - Logging
     * - Consistent response format
     */
    try {
        const { userId, items, total } = req.body;

        // Validation
        if (!userId || !items || !total) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["userId", "items", "total"]
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Items must be non-empty array"
            });
        }

        // Business logic
        const order = {
            id: generateOrderId(),
            userId,
            items,
            total,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        // Save to database (pseudo-code)
        await database.orders.create(order);

        // Log success
        console.log(`Order created: ${order.id} for user ${userId}`);

        // Return success
        res.status(201).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Error creating order:", error);

        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
});

function generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Strengths**:
- ✅ **Universal**: Runs everywhere (browser, server, mobile, desktop)
- ✅ **Huge ecosystem**: npm (largest package registry)
- ✅ **Async-first**: Built for non-blocking I/O
- ✅ **Full-stack**: Same language for frontend and backend
- ✅ **Active community**: Abundant resources and libraries
- ✅ **Fast innovation**: New features and frameworks constantly

**Weaknesses**:
- ❌ **Type safety**: Dynamic typing leads to runtime errors
- ❌ **Inconsistencies**: Historical quirks and "weird" behaviors
- ❌ **Callback hell**: Complex async code can be hard to read
- ❌ **Tooling fatigue**: Too many frameworks, libraries, build tools
- ❌ **Security concerns**: npm packages can have vulnerabilities

**When to use JavaScript**:
- Frontend web development (no choice — it's the only option)
- Backend APIs (Node.js)
- Full-stack applications
- Real-time applications (WebSockets, chat, collaboration)
- Cross-platform mobile apps (React Native)
- Desktop apps (Electron)

**When NOT to use JavaScript**:
- CPU-intensive computations
- System-level programming
- When type safety is critical (use TypeScript instead)

**Popular frameworks/libraries**:
- **Frontend**: React, Vue, Angular, Svelte
- **Backend**: Node.js, Express, NestJS, Fastify
- **Mobile**: React Native, Ionic
- **Desktop**: Electron
- **Testing**: Jest, Mocha, Cypress

### 3. TypeScript

**What is it?**

TypeScript is a statically-typed superset of JavaScript created by Microsoft in 2012. It adds optional type annotations, interfaces, and advanced tooling to JavaScript. TypeScript code compiles to plain JavaScript, so it runs anywhere JavaScript runs.

**Simple analogy**: TypeScript is like JavaScript with training wheels and a GPS — it guides you, prevents common mistakes, and helps you navigate large codebases safely.

**Characteristics**:
- **Type system**: Static, gradual (optional types)
- **Paradigm**: Same as JavaScript (multi-paradigm)
- **Execution**: Compiles to JavaScript, then runs as JavaScript
- **Memory**: Same as JavaScript (garbage collected)

**Syntax example**:

```typescript
// TypeScript adds type annotations to JavaScript

// Variables with types
const name: string = "Alice";
const age: number = 25;
const isStudent: boolean = true;

// Type inference (TypeScript infers types automatically)
const inferredName = "Bob";  // TypeScript knows this is string

// Functions with typed parameters and return
function calculateDiscount(price: number, discountPercent: number): number {
    /**
     * Calculate discounted price with type safety.
     *
     * Benefits:
     * - Catches errors at compile time
     * - Better IDE autocomplete
     * - Self-documenting code
     * - Refactoring support
     */
    const discount = price * (discountPercent / 100);
    return price - discount;
}

// Type errors caught at compile time
// calculateDiscount("100", 10);  // ❌ Error: string not assignable to number
// calculateDiscount(100);         // ❌ Error: Expected 2 arguments

// Interfaces (define structure of objects)
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;  // Optional property
    readonly createdAt: Date;  // Read-only property
}

// Using interfaces
function createUser(name: string, email: string): User {
    return {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        createdAt: new Date()
    };
}

const user: User = createUser("Alice", "alice@example.com");
// user.createdAt = new Date();  // ❌ Error: Cannot assign to readonly property

// Type aliases (alternative to interfaces)
type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

interface Order {
    id: string;
    userId: number;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
}

interface OrderItem {
    productId: number;
    name: string;
    quantity: number;
    price: number;
}

// Classes with type annotations
class BankAccount {
    private balance: number;  // Private property (compile-time only)
    readonly owner: string;   // Read-only

    constructor(owner: string, initialBalance: number = 0) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    deposit(amount: number): boolean {
        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }
        this.balance += amount;
        return true;
    }

    getBalance(): number {
        return this.balance;
    }
}

// Generics (reusable code with type safety)
function wrapInArray<T>(value: T): T[] {
    return [value];
}

const stringArray = wrapInArray("hello");  // string[]
const numberArray = wrapInArray(42);       // number[]

// Generic interfaces
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Using generic interface
async function fetchUser(userId: number): Promise<ApiResponse<User>> {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

// Union types (value can be one of several types)
type Result = Success | Error;

interface Success {
    type: "success";
    value: number;
}

interface Error {
    type: "error";
    message: string;
}

function handleResult(result: Result): void {
    // Type narrowing with discriminated unions
    if (result.type === "success") {
        console.log(`Success: ${result.value}`);
    } else {
        console.log(`Error: ${result.message}`);
    }
}

// Utility types (TypeScript built-in helpers)
type PartialUser = Partial<User>;      // All properties optional
type ReadonlyUser = Readonly<User>;    // All properties readonly
type UserKeys = keyof User;            // "id" | "name" | "email" | ...

// Pick specific properties
type UserBasicInfo = Pick<User, "id" | "name">;

// Omit specific properties
type UserWithoutEmail = Omit<User, "email">;
```

**Real-world example: Type-safe API client**:

```typescript
// API types
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    inStock: boolean;
    category: string;
}

interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    category: string;
}

interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: number;
}

// API response wrapper
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

// Type-safe API client
class ProductApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getProduct(id: number): Promise<ApiResponse<Product>> {
        /**
         * Get product by ID with full type safety.
         *
         * Benefits:
         * - TypeScript ensures correct return type
         * - IDE autocomplete for response.data properties
         * - Compile-time checks for API changes
         * - Self-documenting API contract
         */
        try {
            const response = await fetch(`${this.baseUrl}/products/${id}`);

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        code: `HTTP_${response.status}`,
                        message: `HTTP error: ${response.statusText}`
                    }
                };
            }

            const data = await response.json();

            // Type assertion (we know this is a Product)
            return {
                success: true,
                data: data as Product
            };

        } catch (error) {
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            };
        }
    }

    async createProduct(
        product: CreateProductRequest
    ): Promise<ApiResponse<Product>> {
        try {
            const response = await fetch(`${this.baseUrl}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        code: `HTTP_${response.status}`,
                        message: await response.text()
                    }
                };
            }

            const data = await response.json();

            return {
                success: true,
                data: data as Product
            };

        } catch (error) {
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            };
        }
    }

    async updateProduct(
        update: UpdateProductRequest
    ): Promise<ApiResponse<Product>> {
        // Implementation similar to createProduct
        return { success: false };  // Placeholder
    }
}

// Usage with full type safety
async function example() {
    const client = new ProductApiClient("https://api.example.com");

    // Get product
    const result = await client.getProduct(123);

    if (result.success && result.data) {
        // TypeScript knows result.data is Product
        console.log(`Product: ${result.data.name}`);
        console.log(`Price: $${result.data.price}`);

        // IDE autocomplete works here
        if (result.data.inStock) {
            console.log("In stock");
        }
    } else if (result.error) {
        console.error(`Error: ${result.error.message}`);
    }

    // Create product
    const newProduct: CreateProductRequest = {
        name: "New Product",
        description: "Description",
        price: 99.99,
        category: "Electronics"
    };

    const createResult = await client.createProduct(newProduct);

    // TypeScript catches errors at compile time
    // const invalid: CreateProductRequest = {
    //     name: "Invalid",
    //     price: "not a number"  // ❌ Error: Type 'string' not assignable to 'number'
    // };
}
```

**Strengths**:
- ✅ **Type safety**: Catch errors at compile time
- ✅ **Better IDE support**: Excellent autocomplete and refactoring
- ✅ **Self-documenting**: Types serve as documentation
- ✅ **Scales well**: Essential for large codebases
- ✅ **Gradual adoption**: Add types incrementally to JavaScript projects
- ✅ **Growing ecosystem**: Most JavaScript libraries have TypeScript definitions

**Weaknesses**:
- ❌ **Compilation step**: Adds build complexity
- ❌ **Learning curve**: Need to learn type system
- ❌ **Verbosity**: More code to write (type annotations)
- ❌ **Setup overhead**: Configuration required
- ❌ **Not true static typing**: Types erased at runtime

**When to use TypeScript**:
- Large applications and teams
- Long-term maintained projects
- When type safety is important
- Refactoring-heavy codebases
- API clients and SDKs
- Libraries meant for others to use

**When NOT to use TypeScript**:
- Small scripts or prototypes
- Learning JavaScript for the first time
- When team isn't comfortable with types
- Quick one-off projects

**TypeScript is now the default choice for:**
- React applications (Create React App supports it out of the box)
- Angular (written in TypeScript)
- Node.js backend services
- Modern web frameworks (Next.js, etc.)

### 4. Java

**What is it?**

Java is a statically-typed, object-oriented language created by Sun Microsystems (now Oracle) in 1995. It's designed around the principle "write once, run anywhere" (WORA) — Java code compiles to bytecode that runs on the Java Virtual Machine (JVM), which exists for all major platforms.

**Simple analogy**: Java is like a standardized shipping container — it works the same way on trucks, trains, ships, and planes. Your code (the container) runs identically on Windows, Mac, Linux, and more.

**Characteristics**:
- **Type system**: Static, strong typing
- **Paradigm**: Primarily object-oriented (with functional features)
- **Execution**: Compiled to bytecode, runs on JVM
- **Memory**: Automatic garbage collection

**Syntax example**:

```java
// Java requires everything to be in a class
public class HelloWorld {
    // Main method - entry point
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Variables with explicit types
public class VariablesExample {
    public static void main(String[] args) {
        // Primitive types
        int age = 25;
        double price = 99.99;
        boolean isActive = true;
        char grade = 'A';

        // Reference types
        String name = "Alice";
        String[] colors = {"red", "green", "blue"};

        // Final (constant)
        final double TAX_RATE = 0.08;
        // TAX_RATE = 0.10;  // ❌ Compile error: Cannot assign to final variable
    }
}

// Functions (methods in Java)
public class Calculator {
    /**
     * Calculate discount.
     *
     * Java conventions:
     * - CamelCase for methods
     * - Javadoc comments for documentation
     * - Explicit return types
     * - Access modifiers (public, private, protected)
     */
    public static double calculateDiscount(double price, double discountPercent) {
        if (price < 0 || discountPercent < 0) {
            throw new IllegalArgumentException("Price and discount must be positive");
        }

        double discount = price * (discountPercent / 100);
        return price - discount;
    }
}

// Object-Oriented Programming
public class BankAccount {
    // Instance variables (private by default in good practice)
    private String owner;
    private double balance;

    // Constructor
    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    // Overloaded constructor
    public BankAccount(String owner) {
        this(owner, 0.0);  // Call other constructor
    }

    // Public methods (getters/setters)
    public String getOwner() {
        return owner;
    }

    public double getBalance() {
        return balance;
    }

    public boolean deposit(double amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }

    public boolean withdraw(double amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    // Override toString for better printing
    @Override
    public String toString() {
        return String.format("BankAccount[owner=%s, balance=%.2f]", owner, balance);
    }
}

// Interfaces (contracts)
public interface PaymentMethod {
    boolean processPayment(double amount);
    String getPaymentType();
}

// Implementing interface
public class CreditCardPayment implements PaymentMethod {
    private String cardNumber;

    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public boolean processPayment(double amount) {
        // Implementation
        System.out.println("Processing $" + amount + " via credit card");
        return true;
    }

    @Override
    public String getPaymentType() {
        return "Credit Card";
    }
}

// Inheritance
public class SavingsAccount extends BankAccount {
    private double interestRate;

    public SavingsAccount(String owner, double initialBalance, double interestRate) {
        super(owner, initialBalance);  // Call parent constructor
        this.interestRate = interestRate;
    }

    public void applyInterest() {
        double interest = getBalance() * interestRate;
        deposit(interest);
    }

    @Override
    public String toString() {
        return String.format("SavingsAccount[owner=%s, balance=%.2f, rate=%.2f%%]",
            getOwner(), getBalance(), interestRate * 100);
    }
}

// Collections (Java's data structures)
import java.util.*;

public class CollectionsExample {
    public static void main(String[] args) {
        // List (ArrayList - dynamic array)
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Carol");

        // Map (HashMap - dictionary)
        Map<String, Integer> ages = new HashMap<>();
        ages.put("Alice", 25);
        ages.put("Bob", 30);
        ages.put("Carol", 28);

        // Set (HashSet - unique elements)
        Set<String> uniqueItems = new HashSet<>();
        uniqueItems.add("apple");
        uniqueItems.add("banana");
        uniqueItems.add("apple");  // Duplicate ignored

        // Iterating
        for (String name : names) {
            System.out.println(name);
        }

        // Streams (functional programming in Java 8+)
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        int sum = numbers.stream()
            .filter(n -> n % 2 == 0)  // Filter even numbers
            .map(n -> n * 2)           // Double them
            .reduce(0, Integer::sum);  // Sum them up

        System.out.println("Sum: " + sum);  // 12
    }
}

// Exception handling
public class ErrorHandlingExample {
    public static double divide(double a, double b) throws ArithmeticException {
        /**
         * Divide with exception handling.
         *
         * Java distinguishes:
         * - Checked exceptions (must handle or declare)
         * - Unchecked exceptions (runtime exceptions)
         */
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }

    public static void main(String[] args) {
        try {
            double result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            // Always executes (cleanup code)
            System.out.println("Cleanup complete");
        }
    }
}
```

**Real-world example: REST API endpoint (Spring Boot)**:

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Order controller with best practices.
 *
 * Spring Boot annotations:
 * - @RestController: Marks this as a REST API controller
 * - @RequestMapping: Base path for all endpoints
 * - @PostMapping, @GetMapping: HTTP method mapping
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    // Constructor injection (dependency injection)
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Create new order.
     *
     * Best Practices:
     * - Input validation
     * - Logging
     * - Error handling
     * - Consistent response format
     * - Status codes
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
        @RequestBody CreateOrderRequest request
    ) {
        logger.info("Creating order for user: {}", request.getUserId());

        try {
            // Validation
            if (request.getUserId() == null || request.getUserId() <= 0) {
                logger.error("Invalid user ID: {}", request.getUserId());

                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Invalid user ID"));
            }

            if (request.getItems() == null || request.getItems().isEmpty()) {
                logger.error("Empty items list");

                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Items cannot be empty"));
            }

            // Business logic (delegated to service layer)
            Order order = orderService.createOrder(
                request.getUserId(),
                request.getItems(),
                request.getTotal()
            );

            logger.info("Order created successfully: {}", order.getId());

            // Success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (InsufficientInventoryException e) {
            logger.error("Insufficient inventory: {}", e.getMessage());

            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(createErrorResponse(e.getMessage()));

        } catch (Exception e) {
            logger.error("Error creating order", e);

            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Internal server error"));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrder(
        @PathVariable Long orderId
    ) {
        logger.info("Fetching order: {}", orderId);

        try {
            Order order = orderService.getOrder(orderId);

            if (order == null) {
                logger.warn("Order not found: {}", orderId);

                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Order not found"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error fetching order: {}", orderId, e);

            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Internal server error"));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}

// Request DTO (Data Transfer Object)
public class CreateOrderRequest {
    private Long userId;
    private List<OrderItem> items;
    private Double total;

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}

// Entity class
public class Order {
    private Long id;
    private Long userId;
    private List<OrderItem> items;
    private Double total;
    private String status;
    private LocalDateTime createdAt;

    // Constructor, getters, setters omitted for brevity
}
```

**Strengths**:
- ✅ **Platform independent**: Runs on any JVM
- ✅ **Mature ecosystem**: Decades of libraries and frameworks
- ✅ **Enterprise-ready**: Battle-tested in large organizations
- ✅ **Strong typing**: Catches errors at compile time
- ✅ **Performance**: JVM is highly optimized, JIT compilation
- ✅ **Tooling**: Excellent IDEs (IntelliJ, Eclipse), debugging, profiling
- ✅ **Backward compatibility**: Old code still works

**Weaknesses**:
- ❌ **Verbose**: More boilerplate code than modern languages
- ❌ **Slower development**: More code to write
- ❌ **Memory usage**: Higher than native compiled languages
- ❌ **Startup time**: JVM takes time to start
- ❌ **Less trendy**: Perceived as "old" by some developers

**When to use Java**:
- Enterprise applications
- Large-scale systems
- Android app development
- Backend microservices
- Financial systems
- Big data processing (Hadoop, Spark)
- When you need stability and long-term support

**When NOT to use Java**:
- Quick scripts or prototypes
- Serverless functions (cold start issues)
- Frontend web development
- When startup time is critical

**Popular frameworks/libraries**:
- **Web**: Spring Boot, Jakarta EE, Micronaut, Quarkus
- **Testing**: JUnit, Mockito, TestNG
- **Big Data**: Apache Hadoop, Apache Spark
- **Build Tools**: Maven, Gradle

### 5. Go (Golang)

**What is it?**

Go is a statically-typed, compiled language created by Google in 2009. It's designed for simplicity, efficiency, and excellent concurrency support. Go compiles to native machine code, making it fast, and it has a built-in garbage collector for memory management.

**Simple analogy**: Go is like a modern, fuel-efficient car with excellent handling — it's simple to drive (easy syntax), fast (compiled), and great in traffic (concurrency built-in).

**Characteristics**:
- **Type system**: Static, strong typing
- **Paradigm**: Procedural with some OOP concepts (no classes, uses structs)
- **Execution**: Compiled to machine code
- **Memory**: Garbage collected (efficient, low-latency)

**Syntax example**:

```go
package main

import "fmt"

// Hello World
func main() {
    fmt.Println("Hello, World!")
}

// Variables (multiple declaration styles)
func variablesExample() {
    // Explicit type
    var name string = "Alice"
    var age int = 25

    // Type inference
    var price = 99.99  // Go infers float64

    // Short declaration (most common)
    email := "alice@example.com"
    isActive := true

    // Constants
    const TaxRate = 0.08
    // TaxRate = 0.10  // ❌ Compile error: Cannot assign to constant
}

// Functions with multiple return values
func calculateDiscount(price float64, discountPercent float64) (float64, error) {
    /**
     * Calculate discounted price.
     *
     * Go conventions:
     * - Multiple return values (often value + error)
     * - Explicit error handling
     * - CamelCase for exported functions
     * - camelCase for private functions
     */
    if price < 0 || discountPercent < 0 {
        return 0, fmt.Errorf("price and discount must be positive")
    }

    discount := price * (discountPercent / 100)
    return price - discount, nil
}

// Named return values
func divide(a, b float64) (result float64, err error) {
    if b == 0 {
        err = fmt.Errorf("cannot divide by zero")
        return  // Returns named values (0.0, error)
    }
    result = a / b
    return
}

// Structs (Go's way of creating types)
type BankAccount struct {
    Owner   string  // Exported (public) - uppercase first letter
    balance float64 // Unexported (private) - lowercase first letter
}

// Constructor function (Go idiom)
func NewBankAccount(owner string, initialBalance float64) *BankAccount {
    return &BankAccount{
        Owner:   owner,
        balance: initialBalance,
    }
}

// Methods (functions with receivers)
func (a *BankAccount) Deposit(amount float64) error {
    /**
     * Deposit money to account.
     *
     * Receiver: (a *BankAccount) means this method belongs to BankAccount
     * Pointer receiver (*) allows modification
     */
    if amount <= 0 {
        return fmt.Errorf("amount must be positive")
    }
    a.balance += amount
    return nil
}

func (a *BankAccount) GetBalance() float64 {
    return a.balance
}

func (a *BankAccount) Withdraw(amount float64) error {
    if amount <= 0 {
        return fmt.Errorf("amount must be positive")
    }
    if amount > a.balance {
        return fmt.Errorf("insufficient funds")
    }
    a.balance -= amount
    return nil
}

// Interfaces (define behavior)
type PaymentMethod interface {
    ProcessPayment(amount float64) error
    GetPaymentType() string
}

// Implementing interface (implicit - no "implements" keyword)
type CreditCardPayment struct {
    CardNumber string
}

func (c *CreditCardPayment) ProcessPayment(amount float64) error {
    fmt.Printf("Processing $%.2f via credit card\n", amount)
    return nil
}

func (c *CreditCardPayment) GetPaymentType() string {
    return "Credit Card"
}

// Any type that has these methods automatically implements PaymentMethod

// Slices (Go's dynamic arrays)
func slicesExample() {
    // Create slice
    numbers := []int{1, 2, 3, 4, 5}

    // Append
    numbers = append(numbers, 6, 7, 8)

    // Slicing
    subset := numbers[1:4]  // [2, 3, 4]

    // Iterate
    for index, value := range numbers {
        fmt.Printf("Index: %d, Value: %d\n", index, value)
    }

    // Iterate (ignore index)
    for _, value := range numbers {
        fmt.Println(value)
    }
}

// Maps (Go's hash maps)
func mapsExample() {
    // Create map
    ages := make(map[string]int)
    ages["Alice"] = 25
    ages["Bob"] = 30

    // Map literal
    scores := map[string]int{
        "Alice": 95,
        "Bob":   87,
    }

    // Check if key exists
    age, exists := ages["Alice"]
    if exists {
        fmt.Printf("Alice is %d years old\n", age)
    }

    // Delete
    delete(ages, "Bob")

    // Iterate
    for name, score := range scores {
        fmt.Printf("%s: %d\n", name, score)
    }
}

// Error handling (Go's explicit approach)
func errorHandlingExample() {
    // Go uses explicit error returns, not exceptions
    result, err := divide(10, 2)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    fmt.Printf("Result: %.2f\n", result)

    // Multiple error checks (common pattern)
    account := NewBankAccount("Alice", 1000)

    if err := account.Deposit(500); err != nil {
        fmt.Printf("Deposit failed: %v\n", err)
        return
    }

    if err := account.Withdraw(200); err != nil {
        fmt.Printf("Withdrawal failed: %v\n", err)
        return
    }

    fmt.Printf("Balance: $%.2f\n", account.GetBalance())
}

// Goroutines (Go's concurrency primitive)
func concurrencyExample() {
    // Start goroutine (lightweight thread)
    go func() {
        fmt.Println("Running in goroutine")
    }()

    // Channels (communication between goroutines)
    ch := make(chan int)

    // Send to channel (in goroutine)
    go func() {
        ch <- 42  // Send value
    }()

    // Receive from channel
    value := <-ch  // Receive value
    fmt.Printf("Received: %d\n", value)
}
```

**Real-world example: HTTP server with concurrency**:

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "sync"
    "time"
)

// Order represents an order
type Order struct {
    ID        string    `json:"id"`
    UserID    int       `json:"userId"`
    Items     []string  `json:"items"`
    Total     float64   `json:"total"`
    Status    string    `json:"status"`
    CreatedAt time.Time `json:"createdAt"`
}

// CreateOrderRequest represents the request body
type CreateOrderRequest struct {
    UserID int      `json:"userId"`
    Items  []string `json:"items"`
    Total  float64  `json:"total"`
}

// Response represents API response
type Response struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Error   string      `json:"error,omitempty"`
}

// OrderStore manages orders (thread-safe)
type OrderStore struct {
    mu     sync.RWMutex  // Read-write mutex for thread safety
    orders map[string]Order
    nextID int
}

func NewOrderStore() *OrderStore {
    return &OrderStore{
        orders: make(map[string]Order),
        nextID: 1,
    }
}

func (store *OrderStore) CreateOrder(req CreateOrderRequest) (Order, error) {
    /**
     * Create order with thread safety.
     *
     * Best Practices:
     * - Use mutex for concurrent access
     * - Validate inputs
     * - Log operations
     * - Return clear errors
     */
    // Validation
    if req.UserID <= 0 {
        return Order{}, fmt.Errorf("invalid user ID")
    }

    if len(req.Items) == 0 {
        return Order{}, fmt.Errorf("items cannot be empty")
    }

    if req.Total <= 0 {
        return Order{}, fmt.Errorf("total must be positive")
    }

    // Lock for writing
    store.mu.Lock()
    defer store.mu.Unlock()

    // Create order
    order := Order{
        ID:        fmt.Sprintf("ORD-%d", store.nextID),
        UserID:    req.UserID,
        Items:     req.Items,
        Total:     req.Total,
        Status:    "pending",
        CreatedAt: time.Now(),
    }

    store.orders[order.ID] = order
    store.nextID++

    log.Printf("Order created: %s for user %d", order.ID, order.UserID)

    return order, nil
}

func (store *OrderStore) GetOrder(id string) (Order, bool) {
    // Lock for reading
    store.mu.RLock()
    defer store.mu.RUnlock()

    order, exists := store.orders[id]
    return order, exists
}

// HTTP handlers
func (store *OrderStore) CreateOrderHandler(w http.ResponseWriter, r *http.Request) {
    /**
     * Handle order creation.
     *
     * Best Practices:
     * - Decode JSON request
     * - Validate input
     * - Log operations
     * - Return consistent responses
     * - Set appropriate status codes
     */
    log.Printf("%s %s", r.Method, r.URL.Path)

    // Decode request
    var req CreateOrderRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        log.Printf("Invalid request body: %v", err)
        respondWithError(w, http.StatusBadRequest, "Invalid request body")
        return
    }

    // Create order
    order, err := store.CreateOrder(req)
    if err != nil {
        log.Printf("Failed to create order: %v", err)
        respondWithError(w, http.StatusBadRequest, err.Error())
        return
    }

    // Success
    respondWithJSON(w, http.StatusCreated, Response{
        Success: true,
        Data:    order,
    })
}

func (store *OrderStore) GetOrderHandler(w http.ResponseWriter, r *http.Request) {
    log.Printf("%s %s", r.Method, r.URL.Path)

    // Extract order ID from URL
    orderID := r.URL.Path[len("/api/orders/"):]

    if orderID == "" {
        respondWithError(w, http.StatusBadRequest, "Order ID is required")
        return
    }

    // Get order
    order, exists := store.GetOrder(orderID)
    if !exists {
        respondWithError(w, http.StatusNotFound, "Order not found")
        return
    }

    // Success
    respondWithJSON(w, http.StatusOK, Response{
        Success: true,
        Data:    order,
    })
}

// Helper functions
func respondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
    response, err := json.Marshal(payload)
    if err != nil {
        log.Printf("Failed to marshal response: %v", err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    w.Write(response)
}

func respondWithError(w http.ResponseWriter, statusCode int, message string) {
    respondWithJSON(w, statusCode, Response{
        Success: false,
        Error:   message,
    })
}

// Middleware for logging
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        next(w, r)

        duration := time.Since(start)
        log.Printf("%s %s completed in %v", r.Method, r.URL.Path, duration)
    }
}

func main() {
    /**
     * Start HTTP server.
     *
     * Go's HTTP server is:
     * - Concurrent by default (each request in goroutine)
     * - Production-ready
     * - No external dependencies needed
     */
    store := NewOrderStore()

    // Register routes
    http.HandleFunc("/api/orders", loggingMiddleware(store.CreateOrderHandler))
    http.HandleFunc("/api/orders/", loggingMiddleware(store.GetOrderHandler))

    // Start server
    port := "8080"
    log.Printf("Server starting on port %s", port)

    if err := http.ListenAndServe(":"+port, nil); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}
```

**Strengths**:
- ✅ **Simple**: Easy to learn, minimal syntax
- ✅ **Fast**: Compiles to native code, excellent performance
- ✅ **Built-in concurrency**: Goroutines and channels make concurrent programming easy
- ✅ **Fast compilation**: Compiles large projects in seconds
- ✅ **Single binary**: Easy deployment (no dependencies)
- ✅ **Great tooling**: Built-in formatter (gofmt), testing, profiling
- ✅ **Production-ready standard library**: HTTP server, JSON, crypto, etc.

**Weaknesses**:
- ❌ **No generics (until Go 1.18)**: Limited code reuse
- ❌ **Verbose error handling**: `if err != nil` everywhere
- ❌ **No exceptions**: Must check errors explicitly
- ❌ **Limited OOP**: No inheritance, different style than Java/C#
- ❌ **Smaller ecosystem**: Fewer libraries than Java/Python

**When to use Go**:
- Microservices and APIs
- Cloud-native applications
- Command-line tools
- Network programming
- DevOps tools (Docker, Kubernetes written in Go)
- When you need fast compilation and deployment
- Systems programming (but not as low-level as Rust/C)

**When NOT to use Go**:
- Desktop GUI applications
- Machine learning (use Python)
- When you need a rich OOP framework
- Complex generics required (pre-1.18)

**Popular frameworks/libraries**:
- **Web**: Gin, Echo, Fiber
- **gRPC**: Built-in support
- **Testing**: Built-in testing package
- **Databases**: database/sql, GORM

### 6. Rust

**What is it?**

Rust is a systems programming language created by Mozilla in 2010 (stable in 2015). It focuses on safety, speed, and concurrency without garbage collection. Rust's unique "ownership" system prevents memory errors and data races at compile time, making it incredibly safe while still being as fast as C/C++.

**Simple analogy**: Rust is like a Formula 1 race car with an expert co-driver who won't let you crash. You get maximum performance, but the car (compiler) stops you from making dangerous moves before you make them.

**Characteristics**:
- **Type system**: Static, strong typing with type inference
- **Paradigm**: Multi-paradigm (functional, imperative, concurrent)
- **Execution**: Compiled to native machine code (via LLVM)
- **Memory**: Ownership system (no garbage collector, no manual management)

**Syntax example**:

```rust
// Hello World
fn main() {
    println!("Hello, World!");
}

// Variables (immutable by default)
fn variables_example() {
    // Immutable binding
    let name = "Alice";
    // name = "Bob";  // ❌ Compile error: Cannot assign twice to immutable variable

    // Mutable binding
    let mut age = 25;
    age = 26;  // ✅ OK

    // Type annotations (optional with inference)
    let price: f64 = 99.99;
    let is_active: bool = true;

    // Constants (must have type, compile-time evaluated)
    const TAX_RATE: f64 = 0.08;
}

// Functions
fn calculate_discount(price: f64, discount_percent: f64) -> f64 {
    /**
     * Calculate discounted price.
     *
     * Rust conventions:
     * - snake_case for functions and variables
     * - Explicit return types (after ->)
     * - Last expression is return value (no return keyword needed)
     * - Compiler catches all edge cases
     */
    let discount = price * (discount_percent / 100.0);
    price - discount  // Last expression is returned
}

// Function with explicit return
fn divide(a: f64, b: f64) -> Result<f64, String> {
    /**
     * Divide with error handling.
     *
     * Rust's Result type forces error handling:
     * - Ok(value) for success
     * - Err(error) for failure
     * - Must handle both cases
     */
    if b == 0.0 {
        return Err(String::from("Cannot divide by zero"));
    }
    Ok(a / b)
}

// Structs (Rust's way of creating types)
struct BankAccount {
    owner: String,
    balance: f64,
}

// Implementation block (methods)
impl BankAccount {
    // Associated function (constructor)
    fn new(owner: String, initial_balance: f64) -> Self {
        BankAccount {
            owner,
            balance: initial_balance,
        }
    }

    // Method with &self (borrows self immutably)
    fn get_balance(&self) -> f64 {
        self.balance
    }

    // Method with &mut self (borrows self mutably)
    fn deposit(&mut self, amount: f64) -> Result<(), String> {
        if amount <= 0.0 {
            return Err(String::from("Amount must be positive"));
        }
        self.balance += amount;
        Ok(())
    }

    fn withdraw(&mut self, amount: f64) -> Result<(), String> {
        if amount <= 0.0 {
            return Err(String::from("Amount must be positive"));
        }
        if amount > self.balance {
            return Err(String::from("Insufficient funds"));
        }
        self.balance -= amount;
        Ok(())
    }
}

// Ownership example
fn ownership_example() {
    /**
     * Rust's ownership system.
     *
     * Rules:
     * 1. Each value has an owner
     * 2. Only one owner at a time
     * 3. When owner goes out of scope, value is dropped
     */

    // s1 owns the String
    let s1 = String::from("hello");

    // s1 is moved to s2 (s1 no longer valid)
    let s2 = s1;

    // println!("{}", s1);  // ❌ Compile error: s1 was moved

    println!("{}", s2);  // ✅ OK

    // Borrowing (reference without ownership transfer)
    let s3 = String::from("world");
    let len = calculate_length(&s3);  // Borrow s3
    println!("{} has length {}", s3, len);  // ✅ s3 still valid
}

fn calculate_length(s: &String) -> usize {
    // s is a reference, doesn't own the String
    s.len()
}  // s goes out of scope, but doesn't drop the String (doesn't own it)

// Traits (Rust's interfaces)
trait PaymentMethod {
    fn process_payment(&self, amount: f64) -> Result<(), String>;
    fn get_payment_type(&self) -> &str;
}

struct CreditCardPayment {
    card_number: String,
}

impl PaymentMethod for CreditCardPayment {
    fn process_payment(&self, amount: f64) -> Result<(), String> {
        println!("Processing ${:.2} via credit card", amount);
        Ok(())
    }

    fn get_payment_type(&self) -> &str {
        "Credit Card"
    }
}

// Enums (powerful in Rust)
enum OrderStatus {
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
}

// Enums with data (algebraic data types)
enum PaymentResult {
    Success { transaction_id: String, amount: f64 },
    Failed { error_code: String, message: String },
}

// Pattern matching (exhaustive)
fn handle_payment_result(result: PaymentResult) {
    match result {
        PaymentResult::Success { transaction_id, amount } => {
            println!("Payment successful: {} for ${:.2}", transaction_id, amount);
        }
        PaymentResult::Failed { error_code, message } => {
            println!("Payment failed: {} - {}", error_code, message);
        }
    }
    // Compiler ensures all cases are handled
}

// Error handling with Result and Option
fn error_handling_example() {
    // Result type forces explicit error handling
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {:.2}", result),
        Err(error) => println!("Error: {}", error),
    }

    // ? operator propagates errors
    fn calculate_total() -> Result<f64, String> {
        let a = divide(100.0, 4.0)?;  // Returns error if division fails
        let b = divide(50.0, 2.0)?;
        Ok(a + b)
    }

    // Option type for nullable values (no null pointers in Rust!)
    let numbers = vec![1, 2, 3];
    match numbers.get(5) {  // Returns Option<&i32>
        Some(value) => println!("Value: {}", value),
        None => println!("Index out of bounds"),
    }
}

// Collections
fn collections_example() {
    // Vector (dynamic array)
    let mut numbers = vec![1, 2, 3, 4, 5];
    numbers.push(6);

    // Iterate
    for number in &numbers {
        println!("{}", number);
    }

    // Functional style
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();

    // HashMap
    use std::collections::HashMap;

    let mut scores = HashMap::new();
    scores.insert(String::from("Alice"), 95);
    scores.insert(String::from("Bob"), 87);

    // Get value
    match scores.get("Alice") {
        Some(score) => println!("Alice's score: {}", score),
        None => println!("No score found"),
    }
}

// Concurrency (safe by default)
use std::thread;

fn concurrency_example() {
    // Spawn thread
    let handle = thread::spawn(|| {
        println!("Running in thread");
    });

    // Wait for thread to finish
    handle.join().unwrap();

    // Channels (message passing)
    use std::sync::mpsc;

    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        tx.send(42).unwrap();
    });

    let value = rx.recv().unwrap();
    println!("Received: {}", value);
}
```

**Real-world example: HTTP server (using Actix-web)**:

```rust
use actix_web::{web, App, HttpResponse, HttpServer, Result};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

/**
 * Order struct with serialization.
 *
 * Derive macros:
 * - Debug: Automatic debug printing
 * - Clone: Copy semantics
 * - Serialize/Deserialize: JSON conversion
 */
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Order {
    id: String,
    user_id: u32,
    items: Vec<String>,
    total: f64,
    status: String,
}

#[derive(Debug, Deserialize)]
struct CreateOrderRequest {
    user_id: u32,
    items: Vec<String>,
    total: f64,
}

#[derive(Serialize)]
struct ApiResponse<T> {
    success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

// Application state (thread-safe)
struct AppState {
    orders: Mutex<Vec<Order>>,
    next_id: Mutex<u32>,
}

/**
 * Create order handler.
 *
 * Best Practices:
 * - Validation
 * - Thread-safe state access
 * - Error handling
 * - Logging
 */
async fn create_order(
    req: web::Json<CreateOrderRequest>,
    data: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Validation
    if req.user_id == 0 {
        return Ok(HttpResponse::BadRequest().json(ApiResponse::<()> {
            success: false,
            data: None,
            error: Some(String::from("Invalid user ID")),
        }));
    }

    if req.items.is_empty() {
        return Ok(HttpResponse::BadRequest().json(ApiResponse::<()> {
            success: false,
            data: None,
            error: Some(String::from("Items cannot be empty")),
        }));
    }

    if req.total <= 0.0 {
        return Ok(HttpResponse::BadRequest().json(ApiResponse::<()> {
            success: false,
            data: None,
            error: Some(String::from("Total must be positive")),
        }));
    }

    // Create order (thread-safe access)
    let mut next_id = data.next_id.lock().unwrap();
    let order_id = format!("ORD-{}", *next_id);
    *next_id += 1;
    drop(next_id);  // Release lock early

    let order = Order {
        id: order_id.clone(),
        user_id: req.user_id,
        items: req.items.clone(),
        total: req.total,
        status: String::from("pending"),
    };

    // Save order
    let mut orders = data.orders.lock().unwrap();
    orders.push(order.clone());
    drop(orders);

    println!("Order created: {} for user {}", order_id, req.user_id);

    // Success response
    Ok(HttpResponse::Created().json(ApiResponse {
        success: true,
        data: Some(order),
        error: None,
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize state
    let app_state = web::Data::new(AppState {
        orders: Mutex::new(Vec::new()),
        next_id: Mutex::new(1),
    });

    println!("Server starting on port 8080");

    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/api/orders", web::post().to(create_order))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

**Strengths**:
- ✅ **Memory safety**: No segfaults, no data races (guaranteed at compile time)
- ✅ **Performance**: As fast as C/C++, zero-cost abstractions
- ✅ **Concurrency**: Safe concurrent programming built-in
- ✅ **No garbage collector**: Predictable performance
- ✅ **Modern tooling**: Cargo (package manager), great compiler errors
- ✅ **Growing ecosystem**: Async/await, web frameworks, embedded support

**Weaknesses**:
- ❌ **Steep learning curve**: Ownership, lifetimes, borrowing are complex
- ❌ **Slow compilation**: Large projects take time to compile
- ❌ **Smaller ecosystem**: Fewer libraries than mature languages
- ❌ **Verbose**: More code than high-level languages
- ❌ **Fighting the borrow checker**: Can be frustrating initially

**When to use Rust**:
- Systems programming (OS, drivers, embedded)
- Performance-critical applications
- WebAssembly (excellent support)
- Networking and infrastructure (proxies, load balancers)
- CLI tools
- When memory safety is critical
- Replacing C/C++ code

**When NOT to use Rust**:
- Rapid prototyping
- Business logic applications
- When team isn't ready for learning curve
- Simple scripts
- GUI applications (ecosystem still maturing)

**Popular frameworks/libraries**:
- **Web**: Actix-web, Rocket, Axum
- **Async**: Tokio, async-std
- **CLI**: Clap
- **Serialization**: Serde

### 7. SQL

**What is it?**

SQL (Structured Query Language) is a domain-specific language designed for managing and querying relational databases. Created in the 1970s, SQL is standardized (ANSI SQL), though different database systems have their own extensions and variations.

**Simple analogy**: SQL is like asking a librarian very specific questions about the library's catalog. You say "Show me all books by this author, published after 2020, sorted by title," and the librarian (database) finds exactly what you asked for.

**Characteristics**:
- **Type system**: Static typing (columns have types)
- **Paradigm**: Declarative (you say "what" you want, not "how" to get it)
- **Execution**: Interpreted by database engine, optimized automatically
- **Purpose**: Data manipulation and querying only

**SQL is NOT a general-purpose programming language** — it's specifically for databases.

**Syntax example**:

```sql
-- Create table (define structure)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Insert data (CREATE)
INSERT INTO users (username, email, age)
VALUES ('alice', 'alice@example.com', 25);

INSERT INTO users (username, email, age)
VALUES
    ('bob', 'bob@example.com', 30),
    ('carol', 'carol@example.com', 28);

-- Select data (READ)

-- Get all users
SELECT * FROM users;

-- Get specific columns
SELECT username, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age > 25;

-- Order results
SELECT * FROM users ORDER BY age DESC;

-- Limit results
SELECT * FROM users LIMIT 10;

-- Count rows
SELECT COUNT(*) FROM users;

-- Aggregate functions
SELECT AVG(age) AS average_age FROM users;
SELECT MAX(age) AS oldest FROM users;
SELECT MIN(age) AS youngest FROM users;
SELECT SUM(total) AS total_revenue FROM orders;

-- Group by
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status;

-- Group by with filter
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status
HAVING count > 5;  -- HAVING filters groups, WHERE filters rows

-- Update data (UPDATE)
UPDATE users
SET age = 26
WHERE username = 'alice';

-- Delete data (DELETE)
DELETE FROM users WHERE username = 'bob';

-- Joins (combine tables)

-- Inner join (matching rows from both tables)
SELECT
    users.username,
    orders.id AS order_id,
    orders.total,
    orders.status
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- Left join (all rows from left table, matching from right)
SELECT
    users.username,
    COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.username;

-- Multiple joins
SELECT
    users.username,
    orders.id AS order_id,
    order_items.product_name,
    order_items.quantity,
    order_items.price
FROM users
INNER JOIN orders ON users.id = orders.user_id
INNER JOIN order_items ON orders.id = order_items.order_id
WHERE users.username = 'alice';

-- Subqueries (query within query)
SELECT username
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
    WHERE total > 100
);

-- Common Table Expressions (CTE) - more readable
WITH high_value_orders AS (
    SELECT user_id, COUNT(*) AS order_count
    FROM orders
    WHERE total > 100
    GROUP BY user_id
)
SELECT
    users.username,
    high_value_orders.order_count
FROM users
INNER JOIN high_value_orders ON users.id = high_value_orders.user_id;

-- Window functions (advanced)
SELECT
    username,
    age,
    ROW_NUMBER() OVER (ORDER BY age DESC) AS age_rank
FROM users;

-- Indexes (improve query performance)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Transactions (ACID properties)
BEGIN TRANSACTION;

INSERT INTO orders (user_id, total, status)
VALUES (1, 150.00, 'pending');

INSERT INTO order_items (order_id, product_name, quantity, price)
VALUES (LAST_INSERT_ID(), 'Laptop', 1, 150.00);

COMMIT;  -- Save changes

-- Or rollback if error
-- ROLLBACK;  -- Undo changes
```

**Real-world example: E-commerce queries**:

```sql
-- Complex analytics query
/**
 * Get user purchase statistics with best practices.
 *
 * Best Practices:
 * - Use CTEs for readability
 * - Add indexes for performance
 * - Comment complex logic
 * - Test with EXPLAIN to check query plan
 */

-- User purchase statistics
WITH user_stats AS (
    SELECT
        u.id,
        u.username,
        u.email,
        COUNT(o.id) AS total_orders,
        SUM(o.total) AS total_spent,
        AVG(o.total) AS avg_order_value,
        MAX(o.created_at) AS last_order_date
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.username, u.email
),
high_value_users AS (
    SELECT id
    FROM user_stats
    WHERE total_spent > 1000
)
SELECT
    us.*,
    CASE
        WHEN us.total_spent > 5000 THEN 'VIP'
        WHEN us.total_spent > 1000 THEN 'Premium'
        ELSE 'Standard'
    END AS customer_tier
FROM user_stats us
WHERE us.total_orders > 0
ORDER BY us.total_spent DESC
LIMIT 100;

-- Product popularity analysis
SELECT
    oi.product_name,
    COUNT(DISTINCT oi.order_id) AS times_ordered,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.quantity * oi.price) AS total_revenue,
    AVG(oi.price) AS avg_price
FROM order_items oi
INNER JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'delivered'
    AND o.created_at >= DATE('now', '-30 days')
GROUP BY oi.product_name
HAVING times_ordered > 5
ORDER BY total_revenue DESC
LIMIT 20;

-- Cohort analysis (users by registration month)
SELECT
    strftime('%Y-%m', u.created_at) AS cohort_month,
    COUNT(*) AS users_registered,
    COUNT(CASE WHEN o.id IS NOT NULL THEN 1 END) AS users_with_orders,
    ROUND(
        100.0 * COUNT(CASE WHEN o.id IS NOT NULL THEN 1 END) / COUNT(*),
        2
    ) AS conversion_rate
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY cohort_month
ORDER BY cohort_month DESC;

-- Performance optimization
-- Before running complex queries, check execution plan
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE user_id = 123;

-- Create appropriate indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at
ON orders(user_id, created_at);

-- Best practices for production queries
/**
 * Production SQL Best Practices:
 *
 * Safety:
 * - Use parameterized queries (prevent SQL injection)
 * - Validate inputs in application code
 * - Use transactions for multi-step operations
 * - Backup before destructive operations
 *
 * Performance:
 * - Add indexes on foreign keys
 * - Add indexes on commonly queried columns
 * - Use LIMIT to prevent huge result sets
 * - Use EXPLAIN to understand query performance
 *
 * Quality:
 * - Comment complex queries
 * - Use CTEs for readability
 * - Use meaningful aliases
 * - Format SQL consistently
 *
 * Logging:
 * - Log slow queries (>1 second)
 * - Monitor query patterns
 * - Track failed transactions
 */

-- Stored procedure example (PostgreSQL syntax)
CREATE OR REPLACE FUNCTION create_order(
    p_user_id INTEGER,
    p_items JSONB,
    p_total DECIMAL
) RETURNS INTEGER AS $$
DECLARE
    v_order_id INTEGER;
    v_item JSONB;
BEGIN
    -- Validate user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User % does not exist', p_user_id;
    END IF;

    -- Create order
    INSERT INTO orders (user_id, total, status)
    VALUES (p_user_id, p_total, 'pending')
    RETURNING id INTO v_order_id;

    -- Create order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO order_items (order_id, product_name, quantity, price)
        VALUES (
            v_order_id,
            v_item->>'product_name',
            (v_item->>'quantity')::INTEGER,
            (v_item->>'price')::DECIMAL
        );
    END LOOP;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;
```

**Different SQL Dialects**:

```sql
-- PostgreSQL (most standards-compliant)
SELECT * FROM users LIMIT 10 OFFSET 20;

-- MySQL
SELECT * FROM users LIMIT 20, 10;

-- SQL Server
SELECT TOP 10 * FROM users;

-- SQLite (lightweight, embedded)
SELECT * FROM users LIMIT 10 OFFSET 20;
```

**Strengths**:
- ✅ **Declarative**: Say what you want, not how to get it
- ✅ **Optimized automatically**: Database engine optimizes queries
- ✅ **Standard**: Works across different databases (mostly)
- ✅ **Powerful**: Complex queries in few lines
- ✅ **Mature**: Decades of optimization and tooling
- ✅ **Essential**: Every developer needs to know SQL

**Weaknesses**:
- ❌ **Not a general language**: Only for databases
- ❌ **Dialect differences**: Each database has quirks
- ❌ **Complex queries get unreadable**: Without CTEs/proper formatting
- ❌ **Performance tuning required**: Bad queries can be very slow
- ❌ **Limited procedural logic**: Stored procedures vary by database

**When to use SQL**:
- Storing and querying structured data
- Reporting and analytics
- Data warehousing
- Transaction processing
- Wherever you have a relational database (which is almost everywhere)

**When NOT to use SQL**:
- Unstructured data (documents, logs) — consider NoSQL
- Application logic — use a general-purpose language
- Real-time streaming — consider specialized tools

**Popular databases**:
- **PostgreSQL**: Most feature-rich, standards-compliant
- **MySQL/MariaDB**: Popular for web applications
- **SQLite**: Embedded, serverless, great for mobile/desktop
- **SQL Server**: Microsoft's enterprise database
- **Oracle**: Enterprise, feature-rich, expensive

## Comparison and Decision Framework

### Language Comparison Table

```
┌─────────────┬──────────┬────────────┬─────────────┬────────────┬────────────┬───────────┐
│ Language    │ Type     │ Execution  │ Difficulty  │ Performance│ Use Case   │ Ecosystem │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ Python      │ Dynamic  │ Interpreted│ ⭐          │ ⭐⭐       │ General    │ ⭐⭐⭐⭐⭐ │
│             │          │            │ Easy        │ Moderate   │ Data/Web   │ Huge      │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ JavaScript  │ Dynamic  │ JIT        │ ⭐⭐        │ ⭐⭐⭐     │ Web        │ ⭐⭐⭐⭐⭐ │
│             │          │            │ Easy        │ Good       │ Full-stack │ Huge      │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ TypeScript  │ Static   │ Compiles   │ ⭐⭐⭐      │ ⭐⭐⭐     │ Web        │ ⭐⭐⭐⭐⭐ │
│             │          │ to JS      │ Moderate    │ Good       │ Large apps │ Huge      │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ Java        │ Static   │ Bytecode   │ ⭐⭐⭐      │ ⭐⭐⭐⭐   │ Enterprise │ ⭐⭐⭐⭐  │
│             │          │ JVM        │ Moderate    │ Very good  │ Backend    │ Mature    │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ Go          │ Static   │ Compiled   │ ⭐⭐        │ ⭐⭐⭐⭐   │ Cloud      │ ⭐⭐⭐    │
│             │          │            │ Easy        │ Very good  │ Services   │ Growing   │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ Rust        │ Static   │ Compiled   │ ⭐⭐⭐⭐⭐   │ ⭐⭐⭐⭐⭐ │ Systems    │ ⭐⭐⭐    │
│             │          │            │ Hard        │ Excellent  │ Performance│ Growing   │
├─────────────┼──────────┼────────────┼─────────────┼────────────┼────────────┼───────────┤
│ SQL         │ Static   │ Declarative│ ⭐⭐        │ ⭐⭐⭐⭐   │ Databases  │ ⭐⭐⭐⭐⭐ │
│             │          │            │ Easy        │ Very good  │ Data       │ Essential │
└─────────────┴──────────┴────────────┴─────────────┴────────────┴────────────┴───────────┘
```

### Decision Tree

```
START: What are you building?

┌─ Web Frontend?
│  └─ JavaScript (required) + TypeScript (recommended for large projects)
│
├─ Web Backend API?
│  ├─ Fast development? → Python (Flask/FastAPI) or JavaScript (Node.js)
│  ├─ Enterprise scale? → Java (Spring Boot)
│  ├─ Cloud-native/microservices? → Go
│  └─ Ultra-high performance? → Rust
│
├─ Mobile App?
│  ├─ iOS → Swift (or React Native with JavaScript)
│  ├─ Android → Kotlin/Java (or React Native with JavaScript)
│  └─ Cross-platform → React Native (JavaScript) or Flutter (Dart)
│
├─ Data Science / Machine Learning?
│  └─ Python (only realistic choice)
│
├─ Systems Programming?
│  ├─ Learning / Less critical → Go
│  └─ Performance critical / Memory safety → Rust
│
├─ Automation / Scripting?
│  └─ Python
│
├─ Database Work?
│  └─ SQL (always)
│
└─ First Language to Learn?
   └─ Python (easiest, most versatile)
```

### Recommendation by Goal

**For Beginners:**
1. **Start with Python** — easiest to learn, most versatile
2. **Learn JavaScript** — essential for web development
3. **Add SQL** — required for any real application
4. **Then specialize** based on career goals

**For Career Opportunities:**
- **Highest demand**: JavaScript, Python, Java
- **Best salaries**: Rust, Go, TypeScript
- **Safest bet**: Python + JavaScript (covers most jobs)
- **Enterprise**: Java + SQL
- **Startups**: Python/JavaScript/TypeScript + SQL

**For Specific Industries:**
- **Web development**: JavaScript/TypeScript, Python
- **Finance**: Java, Python, C++
- **Data science**: Python (overwhelming favorite)
- **Gaming**: C++, C#, Rust
- **Cloud/DevOps**: Go, Python, Shell
- **Embedded systems**: C, C++, Rust

## Best Practices

### Cross-Language Best Practices

**1. Safety (All Languages)**:

```python
# Python
def process_payment(amount: float) -> bool:
    """
    Cross-language safety principles:
    - Validate inputs
    - Handle errors explicitly
    - Log operations
    - Return clear results
    """
    if amount <= 0:
        raise ValueError("Amount must be positive")

    try:
        # Process payment
        return True
    except Exception as e:
        logger.error(f"Payment failed: {e}")
        raise
```

```javascript
// JavaScript
function processPayment(amount) {
    // Validation
    if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Amount must be positive number');
    }

    try {
        // Process payment
        return true;
    } catch (error) {
        console.error('Payment failed:', error);
        throw error;
    }
}
```

```java
// Java
public boolean processPayment(double amount) {
    // Validation
    if (amount <= 0) {
        throw new IllegalArgumentException("Amount must be positive");
    }

    try {
        // Process payment
        return true;
    } catch (Exception e) {
        logger.error("Payment failed", e);
        throw e;
    }
}
```

**2. Quality (Testing)**:

```python
# Python (pytest)
def test_calculate_discount():
    """Test discount calculation."""
    result = calculate_discount(100, 10)
    assert result == 90.0

    with pytest.raises(ValueError):
        calculate_discount(-100, 10)
```

```javascript
// JavaScript (Jest)
test('calculate discount', () => {
    const result = calculateDiscount(100, 10);
    expect(result).toBe(90.0);

    expect(() => calculateDiscount(-100, 10))
        .toThrow('Price and discount must be positive');
});
```

```java
// Java (JUnit)
@Test
public void testCalculateDiscount() {
    double result = Calculator.calculateDiscount(100, 10);
    assertEquals(90.0, result, 0.001);

    assertThrows(IllegalArgumentException.class, () -> {
        Calculator.calculateDiscount(-100, 10);
    });
}
```

**3. Logging**:

```python
# Python
import logging

logger = logging.getLogger(__name__)

def process_order(order_id):
    logger.info(f"Processing order: {order_id}")
    try:
        # Process
        logger.info(f"Order processed successfully: {order_id}")
    except Exception as e:
        logger.error(f"Failed to process order {order_id}: {e}", exc_info=True)
        raise
```

```javascript
// JavaScript
function processOrder(orderId) {
    console.log(`Processing order: ${orderId}`);
    try {
        // Process
        console.log(`Order processed successfully: ${orderId}`);
    } catch (error) {
        console.error(`Failed to process order ${orderId}:`, error);
        throw error;
    }
}
```

```go
// Go
import "log"

func processOrder(orderID string) error {
    log.Printf("Processing order: %s", orderID)

    // Process
    if err := doSomething(); err != nil {
        log.Printf("Failed to process order %s: %v", orderID, err)
        return err
    }

    log.Printf("Order processed successfully: %s", orderID)
    return nil
}
```

## Common Pitfalls

### 1. Using Wrong Language for the Job

```
❌ BAD:
- Python for ultra-low-latency trading systems
- JavaScript for CPU-intensive data processing
- SQL for application logic

✅ GOOD:
- Match language to requirements
- Consider performance needs
- Think about team expertise
- Evaluate ecosystem fit
```

### 2. Not Learning Fundamentals

```
❌ BAD:
- Jump straight to frameworks without understanding the language
- Copy-paste code without understanding it
- Ignore error messages

✅ GOOD:
- Learn language basics first
- Understand error messages
- Read official documentation
- Practice core concepts before frameworks
```

### 3. Language Wars

```
❌ BAD:
- "Language X is trash, Language Y is the best"
- Refusing to learn new languages
- Judging developers by language choice

✅ GOOD:
- Each language has strengths and weaknesses
- Learn multiple languages
- Choose based on project needs, not ego
- Respect different choices
```

## Quick Reference

### Hello World in Each Language

```python
# Python
print("Hello, World!")
```

```javascript
// JavaScript
console.log("Hello, World!");
```

```typescript
// TypeScript
console.log("Hello, World!");
```

```java
// Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```go
// Go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

```rust
// Rust
fn main() {
    println!("Hello, World!");
}
```

```sql
-- SQL
SELECT 'Hello, World!' AS message;
```

## Related Topics

### Within This Repository

- **[OOP vs Functional](../oop-vs-functional/README.md)**: Programming paradigms supported by these languages
- **[Design Patterns](../design-patterns/README.md)**: Patterns applicable across languages
- **[Data Structures](../data-structures/README.md)**: Core structures in every language
- **[Testing Strategies](../../03-methodologies/testing/README.md)**: Testing in different languages

### Next Steps

1. **Pick a language** based on your goals
2. **Learn basics**: Variables, functions, control flow
3. **Build projects**: Practice with real applications
4. **Learn ecosystem**: Frameworks, libraries, tools
5. **Join community**: Forums, Discord, meetups
6. **Read code**: Study open-source projects
7. **Keep learning**: Languages evolve, stay current

### Resources

**Multi-language**:
- [Exercism](https://exercism.org/) — Learn programming through exercises
- [LeetCode](https://leetcode.com/) — Practice problems in multiple languages
- [GitHub](https://github.com/) — Read real code

**Python**:
- [Official Docs](https://docs.python.org/)
- [Real Python](https://realpython.com/)
- "Python Crash Course" book

**JavaScript**:
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- "Eloquent JavaScript" book

**TypeScript**:
- [Official Docs](https://www.typescriptlang.org/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

**Java**:
- [Official Docs](https://docs.oracle.com/en/java/)
- [Baeldung](https://www.baeldung.com/)
- "Effective Java" book

**Go**:
- [Tour of Go](https://tour.golang.org/)
- [Go by Example](https://gobyexample.com/)
- "The Go Programming Language" book

**Rust**:
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings/)

**SQL**:
- [SQLZoo](https://sqlzoo.net/)
- [Mode SQL Tutorial](https://mode.com/sql-tutorial/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Remember**: The "best" programming language doesn't exist. The best language is the one that:
1. Solves your problem effectively
2. Your team knows (or can learn quickly)
3. Has good ecosystem support
4. Fits your project's constraints (performance, deployment, etc.)

**Key Takeaway**: Learn multiple languages. Each teaches you different ways of thinking. Start with Python (easy, versatile) or JavaScript (web essential), add SQL (databases essential), then specialize based on your goals.

Happy coding! 🚀
