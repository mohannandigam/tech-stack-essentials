# JavaScript Fundamentals

## What is JavaScript?

JavaScript is a programming language that brings web pages to life. While HTML defines structure and CSS defines style, JavaScript adds behavior—responding to user actions, fetching data, updating content dynamically, and creating interactive experiences without reloading the page.

### Simple Analogy

Think of a smartphone:

- **HTML** = The physical components (screen, buttons, battery)
- **CSS** = The visual design (colors, layout, icons)
- **JavaScript** = The operating system and apps (the functionality that makes everything work)

Without JavaScript, web pages are like smartphones without an OS—they look nice but can't do anything.

## Why JavaScript Matters

### It's Everywhere

- **Every modern browser** runs JavaScript natively
- **98% of websites** use JavaScript
- **Frontend and backend** (Node.js lets you write JavaScript on servers)
- **Mobile apps** (React Native, Ionic)
- **Desktop apps** (Electron)
- **IoT devices** (Johnny-Five)

### It's Essential for Modern Web Development

- **Single Page Applications** (SPAs) - Gmail, Facebook, Twitter
- **Real-time updates** - Live chat, notifications, collaborative editing
- **Interactive UIs** - Drag-and-drop, infinite scroll, autocomplete
- **Client-side validation** - Immediate feedback without server round-trips
- **Rich media** - Games, animations, audio/video control

### The Language Has Matured

JavaScript has evolved from a simple scripting language to a powerful, modern programming language:

```
1995: Created in 10 days by Brendan Eich
2009: Node.js brings JavaScript to servers
2015: ES6/ES2015 - Modern JavaScript features
2015+: Annual updates with new features
Today: One of the most popular programming languages
```

## JavaScript Basics

### Variables and Data Types

```javascript
// Variable declarations
let age = 25;           // Can be reassigned
const name = "Alice";   // Cannot be reassigned (use this by default)
var old = "avoid";      // Old way, has scope issues

// Primitive types
let string = "Hello";           // Text
let number = 42;                // Integer or float
let boolean = true;             // true or false
let nullValue = null;           // Intentionally empty
let undefinedValue = undefined; // Not yet assigned
let symbol = Symbol("id");      // Unique identifier (rarely used)

// Complex types
let object = { name: "Alice", age: 25 };  // Key-value pairs
let array = [1, 2, 3, 4, 5];              // Ordered list
let func = function() { };                // Function

// Check types
console.log(typeof "hello");  // "string"
console.log(typeof 42);       // "number"
console.log(typeof true);     // "boolean"
console.log(typeof {});       // "object"
console.log(typeof []);       // "object" (arrays are objects)
console.log(typeof null);     // "object" (historical bug)
```

**Best Practice:** Use `const` by default. Only use `let` when you need to reassign.

### Functions

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Arrow function (modern, preferred)
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Arrow function (concise)
const greet = name => `Hello, ${name}!`;

// Multiple parameters
const add = (a, b) => a + b;

// Default parameters
const greet = (name = "Guest") => `Hello, ${name}!`;

// Rest parameters (variable number of arguments)
const sum = (...numbers) => {
  return numbers.reduce((total, num) => total + num, 0);
};

console.log(sum(1, 2, 3, 4)); // 10
```

**When to use each:**
- **Arrow functions** - Most of the time (shorter, cleaner)
- **Function declarations** - When you need hoisting (function available before declaration)
- **Regular functions** - When you need `this` binding (methods in objects)

### Objects

Objects store related data and functionality together.

```javascript
// Object literal
const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  isAdmin: false,

  // Method (function in object)
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// Access properties
console.log(user.name);           // "Alice" (dot notation)
console.log(user["age"]);         // 25 (bracket notation)

// Add/modify properties
user.phone = "555-1234";
user.age = 26;

// Delete property
delete user.phone;

// Check if property exists
console.log("email" in user);     // true
console.log(user.hasOwnProperty("age")); // true

// Object destructuring
const { name, age } = user;
console.log(name);  // "Alice"
console.log(age);   // 25

// Destructuring with rename
const { name: userName, age: userAge } = user;

// Rest in destructuring
const { name, ...rest } = user;
console.log(rest);  // { age: 25, email: "alice@example.com", isAdmin: false }

// Spread operator (copy/merge objects)
const userCopy = { ...user };
const userWithPhone = { ...user, phone: "555-1234" };
const merged = { ...user, ...additionalInfo };
```

### Arrays

Arrays store ordered lists of values.

```javascript
// Create arrays
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "two", true, { name: "Alice" }];
const empty = [];

// Access elements (zero-indexed)
console.log(numbers[0]);  // 1
console.log(numbers[4]);  // 5

// Modify arrays
numbers.push(6);          // Add to end: [1,2,3,4,5,6]
numbers.pop();            // Remove from end: [1,2,3,4,5]
numbers.unshift(0);       // Add to start: [0,1,2,3,4,5]
numbers.shift();          // Remove from start: [1,2,3,4,5]

// Array properties
console.log(numbers.length);  // 5

// Array methods (functional programming style)

// map - transform each element
const doubled = numbers.map(num => num * 2);
// [2, 4, 6, 8, 10]

// filter - keep elements that pass test
const evens = numbers.filter(num => num % 2 === 0);
// [2, 4]

// find - get first element that passes test
const firstEven = numbers.find(num => num % 2 === 0);
// 2

// reduce - combine all elements into single value
const sum = numbers.reduce((total, num) => total + num, 0);
// 15

// forEach - execute function for each element
numbers.forEach(num => console.log(num));

// some - check if any element passes test
const hasEven = numbers.some(num => num % 2 === 0);
// true

// every - check if all elements pass test
const allPositive = numbers.every(num => num > 0);
// true

// includes - check if array contains value
console.log(numbers.includes(3));  // true

// Array destructuring
const [first, second, ...rest] = numbers;
console.log(first);   // 1
console.log(second);  // 2
console.log(rest);    // [3, 4, 5]

// Spread operator
const morNumbers = [...numbers, 6, 7, 8];
const combined = [...numbers, ...otherNumbers];
```

**Key Concept:** Most array methods return a new array—they don't modify the original (immutability).

### Control Flow

```javascript
// If statements
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}

// Ternary operator (shorthand if-else)
const status = age >= 18 ? "Adult" : "Minor";

// Switch statement
switch (day) {
  case "Monday":
    console.log("Start of week");
    break;
  case "Friday":
    console.log("End of week");
    break;
  default:
    console.log("Midweek");
}

// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// For...of loop (iterate over values)
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}

// For...in loop (iterate over keys/indices)
for (const index in fruits) {
  console.log(index);  // "0", "1", "2"
}

// While loop
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// Do-while loop (executes at least once)
do {
  console.log(count);
  count++;
} while (count < 5);
```

## DOM Manipulation

The **DOM (Document Object Model)** is JavaScript's interface to HTML. It represents the page as a tree of objects that you can read and modify.

### Selecting Elements

```javascript
// By ID
const header = document.getElementById("header");

// By class name (returns HTMLCollection)
const buttons = document.getElementsByClassName("btn");

// By tag name
const paragraphs = document.getElementsByTagName("p");

// Query selector (CSS selector, returns first match)
const firstButton = document.querySelector(".btn");
const headerTitle = document.querySelector("#header h1");

// Query selector all (returns NodeList)
const allButtons = document.querySelectorAll(".btn");

// Modern approach: use querySelector/querySelectorAll
```

**Best Practice:** Use `querySelector` and `querySelectorAll` - they're more flexible and consistent.

### Modifying Elements

```javascript
// Text content
const title = document.querySelector("h1");
title.textContent = "New Title";  // Safe, escapes HTML
title.innerText = "New Title";    // Similar, but considers CSS styling
title.innerHTML = "<em>Title</em>"; // ⚠️ Dangerous: can introduce XSS

// Attributes
const link = document.querySelector("a");
link.getAttribute("href");          // Get attribute
link.setAttribute("href", "/new");  // Set attribute
link.removeAttribute("target");     // Remove attribute

// Modern approach: direct property access
link.href = "/new";
link.id = "myLink";

// Classes
const element = document.querySelector(".box");
element.classList.add("active");       // Add class
element.classList.remove("hidden");    // Remove class
element.classList.toggle("visible");   // Toggle class
element.classList.contains("active"); // Check if class exists

// Styles (inline styles only)
element.style.color = "red";
element.style.backgroundColor = "blue"; // camelCase for multi-word properties
element.style.fontSize = "20px";

// ⚠️ Better: Add/remove classes and style with CSS
```

### Creating and Removing Elements

```javascript
// Create element
const newDiv = document.createElement("div");
newDiv.textContent = "Hello, World!";
newDiv.classList.add("message");

// Append to parent
const container = document.querySelector(".container");
container.appendChild(newDiv);         // Add as last child
container.prepend(newDiv);            // Add as first child
container.append(newDiv, "Some text"); // Can append multiple items

// Insert adjacent
const reference = document.querySelector(".reference");
reference.before(newDiv);              // Before reference
reference.after(newDiv);               // After reference
reference.insertAdjacentElement("beforebegin", newDiv);

// Remove element
newDiv.remove();                       // Modern way
container.removeChild(newDiv);         // Old way

// Replace element
const oldElement = document.querySelector(".old");
const newElement = document.createElement("div");
oldElement.replaceWith(newElement);
```

### Event Handling

Events let you respond to user interactions.

```javascript
// Add event listener
const button = document.querySelector("button");

button.addEventListener("click", (event) => {
  console.log("Button clicked!");
  console.log(event.target); // Element that triggered event
});

// Common events
element.addEventListener("click", handler);      // Mouse click
element.addEventListener("dblclick", handler);   // Double click
element.addEventListener("mouseenter", handler); // Mouse enters element
element.addEventListener("mouseleave", handler); // Mouse leaves element
element.addEventListener("mousemove", handler);  // Mouse moves over element

input.addEventListener("input", handler);        // Input value changes
input.addEventListener("change", handler);       // Input loses focus after change
input.addEventListener("focus", handler);        // Element gains focus
input.addEventListener("blur", handler);         // Element loses focus

form.addEventListener("submit", handler);        // Form submitted
element.addEventListener("keydown", handler);    // Key pressed down
element.addEventListener("keyup", handler);      // Key released

// Event object
element.addEventListener("click", (event) => {
  event.preventDefault();  // Prevent default behavior (e.g., form submit)
  event.stopPropagation(); // Stop event from bubbling to parent

  console.log(event.type);    // Event type ("click")
  console.log(event.target);  // Element that triggered event
  console.log(event.currentTarget); // Element listener is attached to
});

// Remove event listener
const handler = () => console.log("Clicked");
element.addEventListener("click", handler);
element.removeEventListener("click", handler);

// Event delegation (handle events on parent)
document.querySelector(".list").addEventListener("click", (event) => {
  if (event.target.matches(".list-item")) {
    console.log("List item clicked:", event.target.textContent);
  }
});
```

**Event Delegation Benefits:**
- Single listener instead of many
- Works for dynamically added elements
- Better performance

### Form Handling

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Don't reload page

  // Get form data
  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");

  // Or use input references
  const emailInput = form.querySelector("#email");
  const email = emailInput.value;

  // Validate
  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  // Submit data (see Async section)
  submitForm({ email, password });
});

// Input validation
const emailInput = document.querySelector("#email");

emailInput.addEventListener("input", () => {
  const isValid = emailInput.checkValidity();

  if (isValid) {
    emailInput.classList.remove("error");
    emailInput.classList.add("valid");
  } else {
    emailInput.classList.remove("valid");
    emailInput.classList.add("error");
  }
});
```

## Asynchronous JavaScript

JavaScript is single-threaded—it can only do one thing at a time. Asynchronous programming lets you handle long-running operations (API calls, file reads) without blocking the main thread.

### Callbacks (Old Way)

```javascript
// Callback pattern
function fetchUser(id, callback) {
  setTimeout(() => {
    const user = { id, name: "Alice" };
    callback(user);
  }, 1000);
}

fetchUser(1, (user) => {
  console.log(user);
});

// ❌ Callback hell (avoid)
fetchUser(1, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      // Deeply nested, hard to read
    });
  });
});
```

### Promises (Better)

A Promise represents a value that will be available in the future (or an error).

```javascript
// Create a promise
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = true;

    if (success) {
      resolve({ data: "Success!" }); // Success
    } else {
      reject(new Error("Failed"));   // Failure
    }
  }, 1000);
});

// Use promise
promise
  .then((result) => {
    console.log(result.data); // "Success!"
    return "Next step";
  })
  .then((result) => {
    console.log(result); // "Next step"
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Cleanup or final actions");
  });

// Promise states
// - Pending: Initial state
// - Fulfilled: Operation succeeded (resolve called)
// - Rejected: Operation failed (reject called)
```

### Async/Await (Modern, Preferred)

Async/await makes async code look synchronous—easier to read and write.

```javascript
// Async function (always returns a promise)
async function fetchUser(id) {
  // Simulate API call
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
}

// Using async/await
async function main() {
  try {
    const user = await fetchUser(1);
    console.log(user);

    const posts = await fetchPosts(user.id);
    console.log(posts);

    // Parallel requests (faster)
    const [user, posts, comments] = await Promise.all([
      fetchUser(1),
      fetchPosts(1),
      fetchComments(1)
    ]);

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

**Key Rules:**
1. Use `async` keyword before function
2. Use `await` keyword before promises
3. Always wrap in `try/catch` for error handling
4. Use `Promise.all()` for parallel operations

### Fetch API

The Fetch API is the modern way to make HTTP requests.

```javascript
// GET request
async function getUsers() {
  try {
    const response = await fetch("/api/users");

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const users = await response.json();
    return users;

  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

// POST request
async function createUser(userData) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const newUser = await response.json();
    return newUser;

  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

// PUT request (update)
async function updateUser(id, updates) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return response.json();
}

// DELETE request
async function deleteUser(id) {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  return response.ok;
}

// With authentication
async function fetchProtectedData() {
  const response = await fetch("/api/protected", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.json();
}
```

**Best Practices:**
1. Always check `response.ok` before parsing
2. Handle errors with try/catch
3. Set appropriate headers
4. Include loading and error states in UI

## ES6+ Modern Features

### Template Literals

```javascript
// Old way
const name = "Alice";
const greeting = "Hello, " + name + "!";

// New way (template literals)
const greeting = `Hello, ${name}!`;

// Multi-line strings
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;

// Expression evaluation
const total = `Total: ${price * quantity}`;
```

### Destructuring

```javascript
// Array destructuring
const [first, second, third] = [1, 2, 3];
const [head, ...tail] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age } = { name: "Alice", age: 25 };
const { name: userName, age: userAge } = user; // Rename
const { name = "Guest" } = user; // Default value

// Function parameters
function greet({ name, age }) {
  return `${name} is ${age} years old`;
}

greet({ name: "Alice", age: 25 });

// Nested destructuring
const { user: { name, address: { city } } } = data;
```

### Default Parameters

```javascript
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

greet();                    // "Hello, Guest!"
greet("Alice");             // "Hello, Alice!"
greet("Alice", "Hi");       // "Hi, Alice!"
```

### Rest and Spread

```javascript
// Rest parameters (gather remaining arguments)
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4, 5); // 15

// Spread operator (expand array/object)
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1,2,3,4,5,6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // {a:1, b:2, c:3, d:4}

// Copy with modifications
const updated = { ...user, age: 26 };
```

### Optional Chaining

```javascript
// Without optional chaining
const city = user && user.address && user.address.city;

// With optional chaining (modern)
const city = user?.address?.city;

// With arrays
const firstPost = user?.posts?.[0];

// With functions
const result = obj.method?.();

// Nullish coalescing (use with optional chaining)
const port = config?.port ?? 3000; // Use 3000 if null or undefined
```

### Modules

```javascript
// Export (in math.js)
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

export default function subtract(a, b) {
  return a - b;
}

// Import (in main.js)
import subtract, { add, PI } from "./math.js";
import * as math from "./math.js";

// Dynamic import (code splitting)
const module = await import("./heavy-module.js");
```

### Classes

```javascript
// Class definition
class User {
  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Method
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Getter
  get info() {
    return `${this.name}, ${this.age}`;
  }

  // Setter
  set age(value) {
    if (value < 0) {
      throw new Error("Age must be positive");
    }
    this._age = value;
  }

  // Static method
  static create(name, age) {
    return new User(name, age);
  }

  // Private field (modern)
  #privateField = "secret";
}

// Usage
const user = new User("Alice", 25);
console.log(user.greet());

// Inheritance
class Admin extends User {
  constructor(name, age, role) {
    super(name, age); // Call parent constructor
    this.role = role;
  }

  // Override method
  greet() {
    return `Hello, I'm ${this.name}, an admin`;
  }
}
```

**Note:** Many developers prefer functional programming with plain objects over classes.

## TypeScript Introduction

TypeScript is JavaScript with static type checking—it catches errors before runtime.

### Basic Types

```typescript
// Type annotations
let name: string = "Alice";
let age: number = 25;
let isAdmin: boolean = false;
let values: number[] = [1, 2, 3];
let tuple: [string, number] = ["Alice", 25];

// Type inference (TypeScript guesses type)
let name = "Alice"; // TypeScript knows it's a string

// Union types (multiple possible types)
let id: string | number = "123";
id = 123; // Also valid

// Type aliases
type User = {
  name: string;
  age: number;
  email?: string; // Optional property
};

const user: User = {
  name: "Alice",
  age: 25
};

// Interfaces (similar to type aliases)
interface Product {
  id: number;
  name: string;
  price: number;
}

// Function types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// Generic types
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);
const str = identity<string>("hello");
```

### Why Use TypeScript?

**Benefits:**
- Catch errors at compile time, not runtime
- Better IDE support (autocomplete, refactoring)
- Self-documenting code
- Safer refactoring
- Better tooling

**Trade-offs:**
- Learning curve
- Compilation step required
- More verbose code

**When to use:**
- Large codebases
- Team projects
- Long-lived applications
- When you want maximum type safety

**When to skip:**
- Small scripts
- Rapid prototyping
- Personal projects
- When team prefers JavaScript

## Best Practices

### Code Quality

```javascript
// ✅ Use const and let, never var
const API_URL = "https://api.example.com";
let counter = 0;

// ✅ Use meaningful variable names
const userList = getUsers(); // Good
const x = getUsers();        // Bad

// ✅ Use arrow functions for callbacks
items.map(item => item.name);

// ✅ Use template literals
const message = `Welcome, ${user.name}!`;

// ✅ Use destructuring
const { name, email } = user;

// ✅ Use async/await instead of promises chains
async function fetchData() {
  try {
    const result = await fetch(url);
    return result.json();
  } catch (error) {
    console.error(error);
  }
}

// ✅ Use optional chaining
const city = user?.address?.city;

// ✅ Use default parameters
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
```

### Error Handling

```javascript
// Always handle errors in async functions
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to fetch user:", error);
    // Show user-friendly error message
    showErrorMessage("Unable to load user data");
    throw error; // Re-throw if caller needs to handle
  }
}

// Validate input
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

// Use try/catch for parsing
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
}
```

### Performance

```javascript
// ✅ Debounce expensive operations
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", debounce((e) => {
  performSearch(e.target.value);
}, 300));

// ✅ Use event delegation for dynamic lists
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.matches(".list-item")) {
    handleItemClick(e.target);
  }
});

// ✅ Batch DOM updates
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement("li");
  li.textContent = item.name;
  fragment.appendChild(li);
});
list.appendChild(fragment); // Single DOM update

// ❌ Avoid multiple DOM updates in loop
items.forEach(item => {
  const li = document.createElement("li");
  li.textContent = item.name;
  list.appendChild(li); // Updates DOM each iteration
});
```

### Security

```javascript
// ❌ Never use innerHTML with user input (XSS vulnerability)
element.innerHTML = userInput;

// ✅ Use textContent instead
element.textContent = userInput;

// ✅ Or sanitize HTML
import DOMPurify from "dompurify";
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ Validate and sanitize all user input
function sanitizeEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
}

// ✅ Use Content Security Policy (CSP) headers
// Set on server: Content-Security-Policy: default-src 'self'

// ❌ Avoid eval() - executes arbitrary code
eval(userCode); // Dangerous!

// ✅ Store sensitive tokens securely
// Use httpOnly cookies, not localStorage for auth tokens
```

## Common Pitfalls

### 1. Not Understanding `this`

```javascript
// ❌ Problem: this is undefined or wrong
const user = {
  name: "Alice",
  greet: function() {
    setTimeout(function() {
      console.log(this.name); // this is undefined!
    }, 1000);
  }
};

// ✅ Solution 1: Arrow function (inherits this)
const user = {
  name: "Alice",
  greet: function() {
    setTimeout(() => {
      console.log(this.name); // Works!
    }, 1000);
  }
};

// ✅ Solution 2: bind()
const user = {
  name: "Alice",
  greet: function() {
    setTimeout(function() {
      console.log(this.name);
    }.bind(this), 1000);
  }
};
```

### 2. Mutating Data

```javascript
// ❌ Mutating original array
const numbers = [1, 2, 3];
numbers.push(4);        // Modifies original
numbers.sort();         // Modifies original
numbers.reverse();      // Modifies original

// ✅ Create new arrays (immutable)
const newNumbers = [...numbers, 4];
const sorted = [...numbers].sort();
const reversed = [...numbers].reverse();

// ❌ Mutating object
user.age = 26;

// ✅ Create new object
const updatedUser = { ...user, age: 26 };
```

### 3. Not Handling Async Errors

```javascript
// ❌ Silent failure
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// ✅ Proper error handling
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
```

### 4. Comparing with == Instead of ===

```javascript
// ❌ Type coercion (unexpected results)
"5" == 5;     // true (coerces string to number)
0 == false;   // true
null == undefined; // true

// ✅ Strict equality (no coercion)
"5" === 5;    // false
0 === false;  // false
null === undefined; // false
```

Always use `===` and `!==` unless you specifically need type coercion.

### 5. Not Removing Event Listeners

```javascript
// ❌ Memory leak
function addListener() {
  element.addEventListener("click", () => {
    // This listener is never removed
  });
}

// ✅ Clean up
function addListener() {
  const handler = () => {
    // Handler logic
  };
  element.addEventListener("click", handler);

  // Later, remove it
  return () => element.removeEventListener("click", handler);
}
```

## Quick Reference

### Common Patterns

```javascript
// Conditional rendering
const message = isLoggedIn ? "Welcome back!" : "Please log in";

// Nullish coalescing
const port = config.port ?? 3000;

// Array filtering and mapping
const adults = users.filter(u => u.age >= 18).map(u => u.name);

// Find item
const user = users.find(u => u.id === 1);

// Check existence
const hasAdmin = users.some(u => u.isAdmin);

// Object shorthand
const name = "Alice";
const age = 25;
const user = { name, age }; // Same as { name: name, age: age }

// Dynamic keys
const key = "email";
const user = { [key]: "alice@example.com" };

// Array deduplication
const unique = [...new Set([1, 2, 2, 3, 3, 4])]; // [1, 2, 3, 4]
```

### Debugging

```javascript
// Console methods
console.log("Normal log");
console.error("Error message");
console.warn("Warning message");
console.info("Info message");
console.table([{name: "Alice", age: 25}, {name: "Bob", age: 30}]);
console.group("Group title");
console.groupEnd();
console.time("timer");
console.timeEnd("timer");

// Debugger statement (pauses execution)
debugger;

// Inspect values
console.log({ user, posts, comments }); // Object shorthand for logging
```

## Next Steps

### Build Projects

1. **Interactive To-Do List**
   - Add/remove items
   - Mark as complete
   - Filter (all/active/completed)
   - Save to localStorage

2. **Weather App**
   - Fetch data from API
   - Display current weather
   - 5-day forecast
   - Search by city

3. **Quiz Application**
   - Multiple choice questions
   - Score tracking
   - Timer
   - Results page

4. **Shopping Cart**
   - Add/remove products
   - Update quantities
   - Calculate total
   - Persist with localStorage

### Learn More

- **Frameworks**: React, Vue, or Angular
- **Testing**: Jest, Vitest for unit tests
- **Build Tools**: Vite, Webpack
- **Package Managers**: npm, yarn, pnpm
- **Type Safety**: TypeScript
- **Advanced Async**: Web Workers, Service Workers
- **Patterns**: Module pattern, Observer, Pub/Sub

## Related Topics

- [HTML & CSS](../html-css/README.md) - Structure and style
- [React](../react/README.md) - Popular UI library
- [Vue](../vue/README.md) - Progressive framework
- [Frontend Overview](../README.md) - Complete roadmap

---

**Remember:** JavaScript is a powerful, flexible language. Master the fundamentals—variables, functions, async, DOM—before jumping into frameworks. Practice by building real projects, not just following tutorials. Read other people's code, and most importantly, write lots of code yourself.
