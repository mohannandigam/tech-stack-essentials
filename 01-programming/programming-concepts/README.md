# Programming Concepts

## What is it?

Programming concepts are the fundamental building blocks that work across all programming languages. These are the ideas, patterns, and techniques you use to instruct computers to perform tasks. Just as all languages share common concepts (nouns, verbs, sentences), all programming languages share core concepts (variables, loops, functions) even if the syntax differs.

Think of programming concepts as the grammar and vocabulary of giving instructions to a computer. You need to tell the computer what data to work with (variables), how to make decisions (control flow), how to repeat tasks (loops), and how to organize reusable code (functions). These concepts are universal—once you learn them in one language, you can apply them in any other language.

Programming is about problem-solving using these building blocks. You break down complex problems into smaller steps that a computer can execute sequentially, conditionally, or repeatedly until the task is complete.

## Simple Analogy

Programming is like writing a recipe:

- **Variables** = Ingredients (store values you'll use)
- **Data types** = Types of ingredients (flour, water, eggs have different properties)
- **Functions** = Recipe steps you can reuse ("chop onions", "boil water")
- **Control flow (if/else)** = Conditional instructions ("if mixture is too thick, add water")
- **Loops** = Repetitive actions ("stir for 5 minutes", "repeat until golden brown")
- **Data structures** = Organization ("keep dry ingredients together", "refrigerate perishables")
- **Comments** = Recipe notes ("why we do this step", "alternative ingredients")

Just as a recipe tells a chef step-by-step how to prepare a dish, a program tells a computer step-by-step how to process data and produce results. The clearer and more precise your instructions, the better the outcome.

## Why Does It Matter?

Programming concepts are the foundation of all software development:

**Universal Knowledge:**
- Learn once, apply everywhere (concepts transcend languages)
- Interviews test concepts more than syntax
- Reading any code becomes possible

**Problem-Solving:**
- Break complex problems into manageable pieces
- Translate real-world requirements into working code
- Debug issues by understanding what code does

**Career Impact:**
- Every programming job requires these fundamentals
- Senior roles require deep understanding to design systems
- Teaching others requires explaining concepts clearly

**Efficiency:**
- Choosing the right concept for the task saves time and resources
- Understanding performance implications (O(n) vs O(1))
- Writing maintainable code that others can understand

Without solid fundamentals, you'll struggle to write code, debug problems, learn new languages, or advance your career. Master these concepts, and programming becomes intuitive rather than mystifying.

## How It Works

We'll cover concepts using three popular languages: Python (beginner-friendly), JavaScript (web development), and Java (enterprise/Android). Seeing concepts in multiple languages reinforces understanding and shows they're universal.

### Variables and Data Types

Variables store data for later use. Think of them as labeled boxes holding values.

**Declaration and Assignment:**

```python
# Python - dynamic typing (type inferred)
name = "Alice"           # string
age = 30                 # integer
height = 5.6             # float (decimal number)
is_employee = True       # boolean
```

```javascript
// JavaScript - dynamic typing with let/const
let name = "Alice";         // let: can be reassigned
const age = 30;             // const: cannot be reassigned
var height = 5.6;           // var: older style, avoid in modern code
let is_employee = true;     // boolean
```

```java
// Java - static typing (must declare type)
String name = "Alice";      // String type
int age = 30;               // int type
double height = 5.6;        // double type (decimal)
boolean isEmployee = true;  // boolean type

// Java requires semicolons and types
```

**Primitive Data Types:**

```python
# Python types
integer_num = 42                    # int
float_num = 3.14159                 # float
string_text = "Hello, World!"       # str
boolean_flag = True                 # bool (True/False)
none_value = None                   # None (absence of value)

# Type checking
print(type(integer_num))            # <class 'int'>
```

```javascript
// JavaScript types
let integerNum = 42;                // number
let floatNum = 3.14159;             // number (no separate float type)
let stringText = "Hello, World!";   // string
let booleanFlag = true;             // boolean
let noneValue = null;               // null
let undefinedValue = undefined;     // undefined (variable declared but not assigned)

// Type checking
console.log(typeof integerNum);     // "number"
```

```java
// Java types
byte smallNum = 127;                // 8-bit integer (-128 to 127)
short mediumNum = 32000;            // 16-bit integer (-32,768 to 32,767)
int standardNum = 42;               // 32-bit integer
long bigNum = 9223372036854775807L; // 64-bit integer (note L suffix)

float floatNum = 3.14f;             // 32-bit decimal (note f suffix)
double doubleNum = 3.14159;         // 64-bit decimal

char letter = 'A';                  // 16-bit Unicode character
boolean flag = true;                // boolean (true/false)

String text = "Hello";              // String (not primitive, but common)
```

**Strings:**

```python
# Python strings
name = "Alice"
greeting = 'Hello'                  # Single or double quotes
multiline = """This is
a multiline
string"""

# String operations
full_name = "Alice" + " " + "Smith" # Concatenation
repeat = "Ha" * 3                   # "HaHaHa"
length = len(full_name)             # 11
upper = full_name.upper()           # "ALICE SMITH"
lower = full_name.lower()           # "alice smith"

# String formatting
age = 30
message = f"My name is {name} and I am {age} years old"  # f-string (Python 3.6+)
```

```javascript
// JavaScript strings
let name = "Alice";
let greeting = 'Hello';             // Single or double quotes
let multiline = `This is
a multiline
string`;                            // Template literal (backticks)

// String operations
let fullName = "Alice" + " " + "Smith";  // Concatenation
let length = fullName.length;            // 11 (property, not method)
let upper = fullName.toUpperCase();      // "ALICE SMITH"
let lower = fullName.toLowerCase();      // "alice smith"

// String formatting
let age = 30;
let message = `My name is ${name} and I am ${age} years old`;  // Template literal
```

```java
// Java strings
String name = "Alice";
String greeting = "Hello";

// String operations (strings are immutable in Java)
String fullName = "Alice" + " " + "Smith";  // Concatenation
int length = fullName.length();             // 11 (method call)
String upper = fullName.toUpperCase();      // "ALICE SMITH"
String lower = fullName.toLowerCase();      // "alice smith"

// String formatting
int age = 30;
String message = String.format("My name is %s and I am %d years old", name, age);

// Or with Java 15+ text blocks
String multiline = """
    This is
    a multiline
    string
    """;
```

**Type Conversion:**

```python
# Python type conversion
age_string = "30"
age_int = int(age_string)           # String to int
age_float = float(age_string)       # String to float
back_to_string = str(age_int)       # Int to string

# Automatic conversion in operations
result = 5 + 3.0                    # int + float = float (5.0 + 3.0 = 8.0)
```

```javascript
// JavaScript type conversion
let ageString = "30";
let ageInt = parseInt(ageString);      // String to int
let ageFloat = parseFloat(ageString);  // String to float
let backToString = ageInt.toString();  // Number to string

// Automatic (sometimes surprising) conversion
let result = 5 + "3";                  // "53" (number + string = string)
let result2 = 5 - "3";                 // 2 (subtraction converts to numbers)
```

```java
// Java type conversion
String ageString = "30";
int ageInt = Integer.parseInt(ageString);      // String to int
double ageDouble = Double.parseDouble(ageString); // String to double
String backToString = String.valueOf(ageInt);  // int to String

// Explicit casting
double pi = 3.14159;
int piInt = (int) pi;                          // 3 (truncates decimal)
```

### Control Flow

Control flow determines the order in which code executes. Instead of always running top-to-bottom, we can make decisions and branch.

**If-Else Statements:**

```python
# Python
age = 18

if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")

# Python uses indentation (no braces)
# elif = "else if"

# One-line conditional (ternary)
status = "adult" if age >= 18 else "minor"
```

```javascript
// JavaScript
let age = 18;

if (age >= 18) {
    console.log("You are an adult");
} else if (age >= 13) {
    console.log("You are a teenager");
} else {
    console.log("You are a child");
}

// JavaScript uses braces and parentheses

// One-line conditional (ternary)
let status = age >= 18 ? "adult" : "minor";
```

```java
// Java
int age = 18;

if (age >= 18) {
    System.out.println("You are an adult");
} else if (age >= 13) {
    System.out.println("You are a teenager");
} else {
    System.out.println("You are a child");
}

// Java is similar to JavaScript but uses System.out.println

// One-line conditional (ternary)
String status = age >= 18 ? "adult" : "minor";
```

**Comparison Operators:**

```python
# Python
x = 10
y = 20

x == y    # Equal to (False)
x != y    # Not equal to (True)
x > y     # Greater than (False)
x < y     # Less than (True)
x >= y    # Greater than or equal to (False)
x <= y    # Less than or equal to (True)

# Python uses "is" for identity comparison
x is y    # Same object? (False, different objects)
```

```javascript
// JavaScript
let x = 10;
let y = 20;

x == y     // Equal (loose, with type coercion) - avoid
x === y    // Equal (strict, no type coercion) - prefer this
x != y     // Not equal (loose) - avoid
x !== y    // Not equal (strict) - prefer this
x > y      // Greater than
x < y      // Less than
x >= y     // Greater than or equal
x <= y     // Less than or equal

// Loose vs strict equality
5 == "5"   // true (type coercion)
5 === "5"  // false (different types)
```

```java
// Java
int x = 10;
int y = 20;

x == y     // Equal to
x != y     // Not equal to
x > y      // Greater than
x < y      // Less than
x >= y     // Greater than or equal
x <= y     // Less than or equal

// For objects (strings), use .equals()
String name1 = "Alice";
String name2 = "Alice";
name1.equals(name2);  // true (content equal)
name1 == name2;       // May be false (reference comparison)
```

**Logical Operators:**

```python
# Python
age = 25
has_license = True

# and, or, not (Python uses words)
if age >= 18 and has_license:
    print("Can drive")

if age < 16 or not has_license:
    print("Cannot drive")
```

```javascript
// JavaScript
let age = 25;
let hasLicense = true;

// &&, ||, ! (JavaScript uses symbols)
if (age >= 18 && hasLicense) {
    console.log("Can drive");
}

if (age < 16 || !hasLicense) {
    console.log("Cannot drive");
}
```

```java
// Java
int age = 25;
boolean hasLicense = true;

// &&, ||, ! (Java uses symbols like JavaScript)
if (age >= 18 && hasLicense) {
    System.out.println("Can drive");
}

if (age < 16 || !hasLicense) {
    System.out.println("Cannot drive");
}
```

**Switch Statements:**

```python
# Python (3.10+) - match/case
day = "Monday"

match day:
    case "Monday":
        print("Start of work week")
    case "Friday":
        print("End of work week")
    case "Saturday" | "Sunday":
        print("Weekend!")
    case _:
        print("Regular day")

# Older Python: use if/elif/else or dictionaries
```

```javascript
// JavaScript
let day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of work week");
        break;  // Must break or it falls through
    case "Friday":
        console.log("End of work week");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Regular day");
}
```

```java
// Java
String day = "Monday";

switch (day) {
    case "Monday":
        System.out.println("Start of work week");
        break;  // Must break or falls through
    case "Friday":
        System.out.println("End of work week");
        break;
    case "Saturday":
    case "Sunday":
        System.out.println("Weekend!");
        break;
    default:
        System.out.println("Regular day");
}

// Java 14+ enhanced switch (expression)
String message = switch (day) {
    case "Monday" -> "Start of work week";
    case "Friday" -> "End of work week";
    case "Saturday", "Sunday" -> "Weekend!";
    default -> "Regular day";
};
```

### Loops

Loops repeat code multiple times. Essential for processing collections and repeated tasks.

**For Loops:**

```python
# Python - range-based for loop
for i in range(5):              # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):           # 1, 2, 3, 4, 5 (start, stop)
    print(i)

for i in range(0, 10, 2):       # 0, 2, 4, 6, 8 (start, stop, step)
    print(i)

# Iterating over collection
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# With index and value
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
```

```javascript
// JavaScript - multiple for loop styles

// Traditional for loop
for (let i = 0; i < 5; i++) {
    console.log(i);             // 0, 1, 2, 3, 4
}

// For...of (iterates over values)
let fruits = ["apple", "banana", "cherry"];
for (let fruit of fruits) {
    console.log(fruit);
}

// For...in (iterates over indices/keys) - avoid for arrays
for (let index in fruits) {
    console.log(index);         // "0", "1", "2" (strings!)
}

// forEach method (functional approach)
fruits.forEach((fruit, index) => {
    console.log(`${index}: ${fruit}`);
});
```

```java
// Java - traditional and enhanced for loops

// Traditional for loop
for (int i = 0; i < 5; i++) {
    System.out.println(i);      // 0, 1, 2, 3, 4
}

// Enhanced for loop (for-each)
String[] fruits = {"apple", "banana", "cherry"};
for (String fruit : fruits) {
    System.out.println(fruit);
}

// With index requires traditional loop or counter
for (int i = 0; i < fruits.length; i++) {
    System.out.println(i + ": " + fruits[i]);
}
```

**While Loops:**

```python
# Python
count = 0
while count < 5:
    print(count)
    count += 1                  # count = count + 1

# Infinite loop (must break manually)
while True:
    user_input = input("Enter 'quit' to exit: ")
    if user_input == "quit":
        break                   # Exit loop
```

```javascript
// JavaScript
let count = 0;
while (count < 5) {
    console.log(count);
    count++;                    // Increment
}

// Infinite loop
while (true) {
    let userInput = prompt("Enter 'quit' to exit:");
    if (userInput === "quit") {
        break;                  // Exit loop
    }
}
```

```java
// Java
int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}

// Infinite loop (use Scanner for real input)
while (true) {
    // Imagine user input here
    String userInput = getUserInput();
    if (userInput.equals("quit")) {
        break;
    }
}
```

**Do-While Loops:**

```python
# Python doesn't have do-while, but can simulate
count = 0
while True:
    print(count)
    count += 1
    if count >= 5:
        break
```

```javascript
// JavaScript - executes at least once
let count = 0;
do {
    console.log(count);
    count++;
} while (count < 5);

// Runs even if condition is initially false
let x = 10;
do {
    console.log(x);             // Prints 10 once
    x++;
} while (x < 5);                // Condition false, but already executed once
```

```java
// Java - identical to JavaScript syntax
int count = 0;
do {
    System.out.println(count);
    count++;
} while (count < 5);
```

**Loop Control:**

```python
# Python
for i in range(10):
    if i == 3:
        continue                # Skip this iteration
    if i == 7:
        break                   # Exit loop entirely
    print(i)                    # Prints: 0, 1, 2, 4, 5, 6
```

```javascript
// JavaScript
for (let i = 0; i < 10; i++) {
    if (i === 3) {
        continue;               // Skip this iteration
    }
    if (i === 7) {
        break;                  // Exit loop
    }
    console.log(i);             // Prints: 0, 1, 2, 4, 5, 6
}
```

```java
// Java
for (int i = 0; i < 10; i++) {
    if (i == 3) {
        continue;               // Skip this iteration
    }
    if (i == 7) {
        break;                  // Exit loop
    }
    System.out.println(i);      // Prints: 0, 1, 2, 4, 5, 6
}
```

### Functions

Functions are reusable blocks of code that perform specific tasks. They're the building blocks of organized, maintainable code.

**Function Definition and Calling:**

```python
# Python
def greet(name):
    """Returns a greeting message."""
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")        # "Hello, Alice!"
print(message)

# Function with multiple parameters
def add(a, b):
    return a + b

result = add(5, 3)              # 8

# Default parameters
def greet_with_title(name, title="Mr."):
    return f"Hello, {title} {name}!"

greet_with_title("Smith")       # "Hello, Mr. Smith!"
greet_with_title("Smith", "Dr.")  # "Hello, Dr. Smith!"
```

```javascript
// JavaScript

// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Calling the function
let message = greet("Alice");   // "Hello, Alice!"
console.log(message);

// Function with multiple parameters
function add(a, b) {
    return a + b;
}

let result = add(5, 3);         // 8

// Default parameters (ES6+)
function greetWithTitle(name, title = "Mr.") {
    return `Hello, ${title} ${name}!`;
}

greetWithTitle("Smith");        // "Hello, Mr. Smith!"
greetWithTitle("Smith", "Dr."); // "Hello, Dr. Smith!"

// Arrow functions (ES6+)
const greetArrow = (name) => `Hello, ${name}!`;
const addArrow = (a, b) => a + b;
```

```java
// Java

public class Example {
    // Method (Java's term for function in a class)
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }

    // Method with multiple parameters
    public static int add(int a, int b) {
        return a + b;
    }

    // Method overloading (same name, different parameters)
    public static String greet(String name, String title) {
        return "Hello, " + title + " " + name + "!";
    }

    public static void main(String[] args) {
        String message = greet("Alice");    // "Hello, Alice!"
        System.out.println(message);

        int result = add(5, 3);             // 8
        System.out.println(result);

        String formal = greet("Smith", "Dr."); // "Hello, Dr. Smith!"
        System.out.println(formal);
    }
}
```

**Return Values:**

```python
# Python
def divide(a, b):
    if b == 0:
        return None             # Explicit return on error
    return a / b

result = divide(10, 2)          # 5.0
error_result = divide(10, 0)    # None

# Multiple return values (actually returns a tuple)
def get_min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([1, 5, 3, 9, 2])  # minimum=1, maximum=9
```

```javascript
// JavaScript
function divide(a, b) {
    if (b === 0) {
        return null;            // Explicit return on error
    }
    return a / b;
}

let result = divide(10, 2);     // 5
let errorResult = divide(10, 0); // null

// Multiple return values (return object or array)
function getMinMax(numbers) {
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers)
    };
}

let {min, max} = getMinMax([1, 5, 3, 9, 2]);  // min=1, max=9
```

```java
// Java
public static Double divide(int a, int b) {
    if (b == 0) {
        return null;            // Or throw exception
    }
    return (double) a / b;
}

Double result = divide(10, 2);  // 5.0
Double errorResult = divide(10, 0); // null

// Multiple return values (create class or use arrays)
public static class MinMax {
    public int min;
    public int max;

    public MinMax(int min, int max) {
        this.min = min;
        this.max = max;
    }
}

public static MinMax getMinMax(int[] numbers) {
    int min = Arrays.stream(numbers).min().getAsInt();
    int max = Arrays.stream(numbers).max().getAsInt();
    return new MinMax(min, max);
}
```

**Scope:**

```python
# Python
global_var = "I'm global"

def my_function():
    local_var = "I'm local"
    print(global_var)           # Can access global
    print(local_var)            # Can access local

my_function()
print(global_var)               # Works
# print(local_var)              # Error: local_var not defined

# Modifying global variable
count = 0
def increment():
    global count                # Must declare global to modify
    count += 1

increment()
print(count)                    # 1
```

```javascript
// JavaScript
let globalVar = "I'm global";

function myFunction() {
    let localVar = "I'm local";
    console.log(globalVar);     // Can access global
    console.log(localVar);      // Can access local
}

myFunction();
console.log(globalVar);         // Works
// console.log(localVar);       // Error: localVar not defined

// Block scope (let/const)
if (true) {
    let blockVar = "Block scoped";
    var functionVar = "Function scoped";
}
// console.log(blockVar);       // Error: blockVar not defined
console.log(functionVar);       // Works (var is function-scoped, not block-scoped)
```

```java
// Java
public class Example {
    static String globalVar = "I'm global (class variable)";

    public static void myFunction() {
        String localVar = "I'm local";
        System.out.println(globalVar);  // Can access class variable
        System.out.println(localVar);   // Can access local
    }

    public static void main(String[] args) {
        myFunction();
        System.out.println(globalVar);  // Works
        // System.out.println(localVar); // Error: localVar not defined
    }
}
```

### Data Structures

Data structures organize and store data efficiently for specific use cases.

**Arrays/Lists:**

```python
# Python lists (dynamic arrays)
fruits = ["apple", "banana", "cherry"]

# Access by index (0-based)
first = fruits[0]               # "apple"
last = fruits[-1]               # "cherry" (negative index from end)

# Modify
fruits[1] = "blueberry"         # ["apple", "blueberry", "cherry"]

# Add elements
fruits.append("date")           # Add to end
fruits.insert(1, "avocado")     # Insert at index 1

# Remove elements
fruits.remove("cherry")         # Remove by value
popped = fruits.pop()           # Remove and return last element
del fruits[0]                   # Delete by index

# Length
length = len(fruits)

# Slicing
first_two = fruits[0:2]         # Elements 0 and 1
last_two = fruits[-2:]          # Last two elements

# List comprehension (create list from expression)
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
```

```javascript
// JavaScript arrays
let fruits = ["apple", "banana", "cherry"];

// Access by index
let first = fruits[0];          // "apple"
let last = fruits[fruits.length - 1];  // "cherry"

// Modify
fruits[1] = "blueberry";        // ["apple", "blueberry", "cherry"]

// Add elements
fruits.push("date");            // Add to end
fruits.unshift("avocado");      // Add to beginning
fruits.splice(1, 0, "apricot"); // Insert at index 1

// Remove elements
fruits.pop();                   // Remove and return last
fruits.shift();                 // Remove and return first
fruits.splice(1, 1);            // Remove 1 element at index 1

// Length
let length = fruits.length;

// Slicing
let firstTwo = fruits.slice(0, 2);    // Elements 0 and 1
let lastTwo = fruits.slice(-2);       // Last two elements

// Array methods (functional style)
let squares = [0, 1, 2, 3, 4].map(x => x ** 2);  // [0, 1, 4, 9, 16]
let evens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x % 2 === 0);  // [0, 2, 4, 6, 8]
```

```java
// Java arrays (fixed size)
String[] fruits = {"apple", "banana", "cherry"};

// Access by index
String first = fruits[0];       // "apple"
String last = fruits[fruits.length - 1];  // "cherry"

// Modify
fruits[1] = "blueberry";        // ["apple", "blueberry", "cherry"]

// Arrays are fixed size - use ArrayList for dynamic size
import java.util.ArrayList;

ArrayList<String> fruitList = new ArrayList<>();
fruitList.add("apple");         // Add element
fruitList.add("banana");
fruitList.add(1, "avocado");    // Insert at index 1
fruitList.remove("banana");     // Remove by value
fruitList.remove(0);            // Remove by index
int size = fruitList.size();    // Get size

// Get sublist
List<String> firstTwo = fruitList.subList(0, 2);
```

**Dictionaries/Maps:**

```python
# Python dictionaries (hash maps)
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Access values
name = person["name"]           # "Alice"
age = person.get("age")         # 30 (safe access)
default = person.get("country", "USA")  # Returns "USA" if key doesn't exist

# Modify
person["age"] = 31              # Update value
person["email"] = "alice@example.com"  # Add new key-value

# Remove
del person["city"]              # Remove key
popped = person.pop("email")    # Remove and return value

# Check if key exists
if "name" in person:
    print(f"Name is {person['name']}")

# Iterate
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

# Get keys and values
keys = person.keys()            # dict_keys(['name', 'age'])
values = person.values()        # dict_values(['Alice', 31])
```

```javascript
// JavaScript objects (similar to dictionaries)
let person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

// Access values
let name = person.name;         // Dot notation
let age = person["age"];        // Bracket notation (like Python)

// Modify
person.age = 31;                // Update value
person.email = "alice@example.com";  // Add new property

// Remove
delete person.city;             // Remove property

// Check if property exists
if ("name" in person) {
    console.log(`Name is ${person.name}`);
}
// Or
if (person.name !== undefined) {
    console.log(`Name is ${person.name}`);
}

// Iterate
for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}

// Get keys and values
let keys = Object.keys(person);      // ["name", "age", "email"]
let values = Object.values(person);  // ["Alice", 31, "alice@example.com"]
let entries = Object.entries(person); // [["name", "Alice"], ["age", 31], ...]

// Map (similar but different from objects)
let personMap = new Map();
personMap.set("name", "Alice");
personMap.set("age", 30);
let nameFromMap = personMap.get("name");  // "Alice"
```

```java
// Java HashMap
import java.util.HashMap;

HashMap<String, Object> person = new HashMap<>();
person.put("name", "Alice");
person.put("age", 30);
person.put("city", "New York");

// Access values
String name = (String) person.get("name");  // Type casting needed
int age = (int) person.get("age");

// Modify
person.put("age", 31);          // Update value
person.put("email", "alice@example.com");  // Add new entry

// Remove
person.remove("city");

// Check if key exists
if (person.containsKey("name")) {
    System.out.println("Name is " + person.get("name"));
}

// Iterate
for (String key : person.keySet()) {
    System.out.println(key + ": " + person.get(key));
}

for (Map.Entry<String, Object> entry : person.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Get keys and values
Set<String> keys = person.keySet();
Collection<Object> values = person.values();
```

**Sets:**

```python
# Python sets (unordered, unique elements)
numbers = {1, 2, 3, 4, 5}
numbers_with_duplicates = {1, 2, 2, 3, 3, 3}  # Becomes {1, 2, 3}

# Add and remove
numbers.add(6)                  # {1, 2, 3, 4, 5, 6}
numbers.remove(3)               # {1, 2, 4, 5, 6} (error if not found)
numbers.discard(10)             # No error if not found

# Check membership (very fast, O(1))
if 5 in numbers:
    print("5 is in the set")

# Set operations
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

union = set_a | set_b           # {1, 2, 3, 4, 5, 6}
intersection = set_a & set_b    # {3, 4}
difference = set_a - set_b      # {1, 2}
symmetric_diff = set_a ^ set_b  # {1, 2, 5, 6}
```

```javascript
// JavaScript Set (ES6+)
let numbers = new Set([1, 2, 3, 4, 5]);
let numbersWithDuplicates = new Set([1, 2, 2, 3, 3, 3]);  // Becomes Set(3) {1, 2, 3}

// Add and remove
numbers.add(6);                 // Set(6) {1, 2, 3, 4, 5, 6}
numbers.delete(3);              // Set(5) {1, 2, 4, 5, 6}

// Check membership
if (numbers.has(5)) {
    console.log("5 is in the set");
}

// Set operations (manual implementation)
let setA = new Set([1, 2, 3, 4]);
let setB = new Set([3, 4, 5, 6]);

// Union
let union = new Set([...setA, ...setB]);  // Set(6) {1, 2, 3, 4, 5, 6}

// Intersection
let intersection = new Set([...setA].filter(x => setB.has(x)));  // Set(2) {3, 4}

// Difference
let difference = new Set([...setA].filter(x => !setB.has(x)));  // Set(2) {1, 2}
```

```java
// Java HashSet
import java.util.HashSet;
import java.util.Set;

Set<Integer> numbers = new HashSet<>();
numbers.add(1);
numbers.add(2);
numbers.add(3);
numbers.add(2);                 // Duplicate ignored

// Add and remove
numbers.add(6);
numbers.remove(3);

// Check membership
if (numbers.contains(5)) {
    System.out.println("5 is in the set");
}

// Set operations
Set<Integer> setA = new HashSet<>(Arrays.asList(1, 2, 3, 4));
Set<Integer> setB = new HashSet<>(Arrays.asList(3, 4, 5, 6));

// Union
Set<Integer> union = new HashSet<>(setA);
union.addAll(setB);             // {1, 2, 3, 4, 5, 6}

// Intersection
Set<Integer> intersection = new HashSet<>(setA);
intersection.retainAll(setB);   // {3, 4}

// Difference
Set<Integer> difference = new HashSet<>(setA);
difference.removeAll(setB);     // {1, 2}
```

### Error Handling

Handling errors gracefully prevents crashes and provides better user experience.

```python
# Python - try/except
def divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    except TypeError:
        print("Error: Invalid types")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
    finally:
        print("This always executes")

# Multiple except blocks for different errors
result = divide(10, 0)          # Catches ZeroDivisionError

# Raising exceptions
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age
```

```javascript
// JavaScript - try/catch
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return null;
    } finally {
        console.log("This always executes");
    }
}

// Custom error classes
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateAge(age) {
    if (age < 0) {
        throw new ValidationError("Age cannot be negative");
    }
    return age;
}

try {
    validateAge(-5);
} catch (error) {
    if (error instanceof ValidationError) {
        console.log("Validation failed:", error.message);
    } else {
        console.log("Other error:", error.message);
    }
}
```

```java
// Java - try/catch
public static Double divide(int a, int b) {
    try {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return (double) a / b;
    } catch (ArithmeticException e) {
        System.out.println("Error: " + e.getMessage());
        return null;
    } catch (Exception e) {
        System.out.println("Unexpected error: " + e.getMessage());
        return null;
    } finally {
        System.out.println("This always executes");
    }
}

// Custom exception classes
class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}

public static int validateAge(int age) throws ValidationException {
    if (age < 0) {
        throw new ValidationException("Age cannot be negative");
    }
    return age;
}

// Handling checked exceptions
try {
    validateAge(-5);
} catch (ValidationException e) {
    System.out.println("Validation failed: " + e.getMessage());
}
```

### File I/O

Reading and writing files is essential for persisting data.

```python
# Python

# Writing to a file
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("This is a new line\n")
# File automatically closed after 'with' block

# Reading from a file
with open("output.txt", "r") as file:
    content = file.read()       # Read entire file
    print(content)

# Reading line by line
with open("output.txt", "r") as file:
    for line in file:
        print(line.strip())     # strip() removes newline

# Appending to a file
with open("output.txt", "a") as file:
    file.write("Appended line\n")

# Working with JSON
import json

data = {"name": "Alice", "age": 30}

# Write JSON
with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Read JSON
with open("data.json", "r") as file:
    loaded_data = json.load(file)
    print(loaded_data["name"])  # "Alice"
```

```javascript
// JavaScript (Node.js) - fs module

const fs = require('fs');

// Writing to a file (synchronous)
fs.writeFileSync("output.txt", "Hello, World!\n");

// Appending to a file
fs.appendFileSync("output.txt", "Appended line\n");

// Reading from a file (synchronous)
let content = fs.readFileSync("output.txt", "utf-8");
console.log(content);

// Asynchronous (non-blocking)
fs.writeFile("output.txt", "Hello, World!\n", (err) => {
    if (err) {
        console.error("Error writing file:", err);
    } else {
        console.log("File written successfully");
    }
});

fs.readFile("output.txt", "utf-8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
    } else {
        console.log(data);
    }
});

// Working with JSON
let data = {name: "Alice", age: 30};

// Write JSON
fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

// Read JSON
let jsonContent = fs.readFileSync("data.json", "utf-8");
let loadedData = JSON.parse(jsonContent);
console.log(loadedData.name);   // "Alice"
```

```java
// Java - Files and BufferedReader/Writer

import java.io.*;
import java.nio.file.*;

// Writing to a file
try {
    Files.writeString(Paths.get("output.txt"), "Hello, World!\n");
} catch (IOException e) {
    System.err.println("Error writing file: " + e.getMessage());
}

// Appending to a file
try {
    Files.writeString(
        Paths.get("output.txt"),
        "Appended line\n",
        StandardOpenOption.APPEND
    );
} catch (IOException e) {
    System.err.println("Error appending to file: " + e.getMessage());
}

// Reading from a file
try {
    String content = Files.readString(Paths.get("output.txt"));
    System.out.println(content);
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}

// Reading line by line
try (BufferedReader reader = new BufferedReader(new FileReader("output.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}
```

## Best Practices

### Safety

**Input Validation:**

```python
def get_positive_number():
    """
    Get validated positive number from user.

    Why this matters:
    - Prevents crashes from invalid input
    - Provides clear error messages
    - Ensures data integrity

    Best Practices:
    - Validate all user input
    - Check types and ranges
    - Handle errors gracefully
    - Provide helpful error messages
    """
    while True:
        try:
            user_input = input("Enter a positive number: ")

            # Convert to number
            number = float(user_input)

            # Validate range
            if number <= 0:
                print("Error: Number must be positive")
                continue

            return number

        except ValueError:
            print("Error: Please enter a valid number")
        except KeyboardInterrupt:
            print("\nOperation cancelled")
            return None
```

**Avoid Mutable Default Arguments (Python):**

```python
# ❌ Bad: Mutable default argument
def add_item(item, items=[]):
    items.append(item)
    return items

list1 = add_item("apple")       # ["apple"]
list2 = add_item("banana")      # ["apple", "banana"] - unexpected!
# Same list used for both calls!

# ✓ Good: Use None and create new list
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

list1 = add_item("apple")       # ["apple"]
list2 = add_item("banana")      # ["banana"] - correct!
```

**Prevent Integer Overflow (Java/JavaScript):**

```java
// Java - check for overflow
public static int addSafely(int a, int b) {
    // Check if addition would overflow
    if (a > 0 && b > Integer.MAX_VALUE - a) {
        throw new ArithmeticException("Integer overflow");
    }
    if (a < 0 && b < Integer.MIN_VALUE - a) {
        throw new ArithmeticException("Integer underflow");
    }
    return a + b;
}
```

```javascript
// JavaScript - numbers can lose precision
let bigNumber = 9007199254740992;  // 2^53
console.log(bigNumber + 1 === bigNumber);  // true! Precision lost

// Use BigInt for large integers (ES2020+)
let bigInt = 9007199254740992n;
console.log(bigInt + 1n === bigInt);  // false (correct)
```

### Quality

**Write Readable Code:**

```python
# ❌ Bad: Unclear variable names, no comments
def f(x, y):
    r = []
    for i in x:
        if i > y:
            r.append(i)
    return r

# ✓ Good: Clear names, helpful comments
def filter_values_above_threshold(values, threshold):
    """
    Return values exceeding threshold.

    Args:
        values: List of numbers to filter
        threshold: Minimum value to include

    Returns:
        List of values greater than threshold
    """
    filtered_values = []
    for value in values:
        if value > threshold:
            filtered_values.append(value)
    return filtered_values

# Even better: Use list comprehension
def filter_values_above_threshold(values, threshold):
    """Return values exceeding threshold."""
    return [value for value in values if value > threshold]
```

**DRY (Don't Repeat Yourself):**

```javascript
// ❌ Bad: Repeated code
function processUser(user) {
    console.log(`Processing ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Age: ${user.age}`);
    // ... processing logic
}

function processAdmin(admin) {
    console.log(`Processing ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Age: ${admin.age}`);
    // ... slightly different processing logic
}

// ✓ Good: Extract common logic
function logPersonInfo(person) {
    console.log(`Processing ${person.name}`);
    console.log(`Email: ${person.email}`);
    console.log(`Age: ${person.age}`);
}

function processUser(user) {
    logPersonInfo(user);
    // ... processing logic
}

function processAdmin(admin) {
    logPersonInfo(admin);
    // ... admin-specific processing
}
```

**Test Edge Cases:**

```python
def get_first_element(items):
    """
    Get first element from list.

    Why test edge cases:
    - Empty lists cause errors
    - None input causes errors
    - Different types behave differently

    Best Practices:
    - Test with empty inputs
    - Test with None
    - Test with unexpected types
    - Test boundary values
    """
    # Handle edge cases
    if items is None:
        raise ValueError("Items cannot be None")

    if len(items) == 0:
        raise ValueError("Items cannot be empty")

    return items[0]

# Test cases
assert get_first_element([1, 2, 3]) == 1  # Normal case
try:
    get_first_element([])  # Empty list
    assert False, "Should have raised ValueError"
except ValueError:
    pass  # Expected

try:
    get_first_element(None)  # None input
    assert False, "Should have raised ValueError"
except ValueError:
    pass  # Expected
```

### Logging

**Comprehensive Logging:**

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def process_data(data):
    """
    Process data with comprehensive logging.

    Why log:
    - Debugging issues in production
    - Monitoring application health
    - Audit trail of operations
    - Performance tracking

    Best Practices:
    - Log at appropriate levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    - Include context (IDs, timestamps, user)
    - Don't log sensitive data (passwords, PII)
    - Use structured logging
    """

    logger.info(f"Starting data processing, {len(data)} records")

    try:
        processed = 0
        for item in data:
            # Log progress for long operations
            if processed % 100 == 0:
                logger.info(f"Processed {processed}/{len(data)} records")

            # Process item
            result = transform_item(item)

            if result is None:
                logger.warning(f"Failed to process item: {item['id']}")
            else:
                processed += 1

        logger.info(f"Completed processing: {processed}/{len(data)} successful")
        return processed

    except Exception as e:
        logger.error(f"Error during processing: {e}", exc_info=True)
        raise
```

## Use Cases

### E-commerce: Shopping Cart

```python
class ShoppingCart:
    """
    Shopping cart demonstrating programming concepts.

    Concepts used:
    - Classes and methods (OOP)
    - Data structures (dictionary for items)
    - Control flow (validation)
    - Error handling
    - Type annotations (Python 3.5+)
    """

    def __init__(self):
        self.items = {}  # product_id -> quantity

    def add_item(self, product_id: str, quantity: int = 1) -> None:
        """Add item to cart with validation."""
        # Input validation
        if not product_id:
            raise ValueError("Product ID cannot be empty")
        if quantity <= 0:
            raise ValueError("Quantity must be positive")

        # Update cart
        if product_id in self.items:
            self.items[product_id] += quantity
        else:
            self.items[product_id] = quantity

        logger.info(f"Added {quantity}x {product_id} to cart")

    def remove_item(self, product_id: str) -> None:
        """Remove item from cart."""
        if product_id not in self.items:
            raise KeyError(f"Product {product_id} not in cart")

        del self.items[product_id]
        logger.info(f"Removed {product_id} from cart")

    def get_total_items(self) -> int:
        """Get total number of items in cart."""
        return sum(self.items.values())

    def is_empty(self) -> bool:
        """Check if cart is empty."""
        return len(self.items) == 0

# Usage
cart = ShoppingCart()
cart.add_item("PROD-123", 2)
cart.add_item("PROD-456", 1)
print(f"Cart has {cart.get_total_items()} items")  # 3 items
```

### Data Processing: CSV Analysis

```python
import csv
from collections import defaultdict

def analyze_sales_data(filename):
    """
    Analyze sales data from CSV file.

    Demonstrates:
    - File I/O
    - Data structures (defaultdict)
    - Loops and aggregation
    - Error handling
    - String formatting
    """

    # Initialize data structures
    sales_by_region = defaultdict(float)
    total_sales = 0.0
    record_count = 0

    try:
        with open(filename, 'r') as file:
            reader = csv.DictReader(file)

            for row in reader:
                try:
                    # Extract data
                    region = row['region']
                    amount = float(row['amount'])

                    # Aggregate
                    sales_by_region[region] += amount
                    total_sales += amount
                    record_count += 1

                except (KeyError, ValueError) as e:
                    logger.warning(f"Skipping invalid row: {e}")
                    continue

        # Calculate statistics
        average_sale = total_sales / record_count if record_count > 0 else 0

        # Generate report
        print(f"Total Sales: ${total_sales:,.2f}")
        print(f"Average Sale: ${average_sale:,.2f}")
        print(f"Records Processed: {record_count}")
        print("\nSales by Region:")

        # Sort regions by sales (descending)
        sorted_regions = sorted(
            sales_by_region.items(),
            key=lambda x: x[1],
            reverse=True
        )

        for region, amount in sorted_regions:
            percentage = (amount / total_sales * 100) if total_sales > 0 else 0
            print(f"  {region}: ${amount:,.2f} ({percentage:.1f}%)")

    except FileNotFoundError:
        logger.error(f"File not found: {filename}")
        raise
    except Exception as e:
        logger.error(f"Error analyzing data: {e}")
        raise

# Usage
analyze_sales_data("sales_data.csv")
```

## Common Pitfalls

### Off-by-One Errors

```python
# ❌ Common mistake in loops
numbers = [1, 2, 3, 4, 5]

# Trying to access index 5 (doesn't exist - indices 0-4 only)
for i in range(len(numbers) + 1):  # Bug! Goes 0, 1, 2, 3, 4, 5
    print(numbers[i])  # IndexError on last iteration

# ✓ Correct
for i in range(len(numbers)):  # Goes 0, 1, 2, 3, 4
    print(numbers[i])

# Better: Don't use indices when not needed
for number in numbers:
    print(number)
```

### Comparing References vs Values

```javascript
// JavaScript
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];

console.log(arr1 == arr2);   // false (different objects)
console.log(arr1 === arr2);  // false (different objects)

// ✓ Compare values
console.log(JSON.stringify(arr1) === JSON.stringify(arr2));  // true

// Or use libraries like Lodash
// _.isEqual(arr1, arr2)  // true
```

```java
// Java
String str1 = new String("hello");
String str2 = new String("hello");

System.out.println(str1 == str2);       // false (different objects)
System.out.println(str1.equals(str2));  // true (same content)

// ✓ Always use .equals() for objects
```

### Modifying Collection While Iterating

```python
# ❌ Bad: Modifying list while iterating
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    if num % 2 == 0:
        numbers.remove(num)  # Modifies list during iteration!
# Result: [1, 3, 5] but unpredictable behavior

# ✓ Good: Create new list
numbers = [1, 2, 3, 4, 5]
odd_numbers = [num for num in numbers if num % 2 != 0]

# Or iterate over copy
for num in numbers[:]:  # numbers[:] creates a copy
    if num % 2 == 0:
        numbers.remove(num)
```

### Integer Division Surprise

```python
# Python 2 vs Python 3
# Python 2:
# 5 / 2 = 2 (integer division)

# Python 3:
5 / 2   # 2.5 (float division)
5 // 2  # 2 (integer division)

# Be explicit about what you want
result = 5 // 2  # Integer division
result = 5 / 2   # Float division
```

## Quick Reference

### Comparison Operators

| Operator | Python | JavaScript | Java | Meaning |
|----------|--------|------------|------|---------|
| Equal | `==` | `===` (strict) | `==` | Values equal |
| Not Equal | `!=` | `!==` (strict) | `!=` | Values not equal |
| Greater | `>` | `>` | `>` | Left greater than right |
| Less | `<` | `<` | `<` | Left less than right |
| Greater/Equal | `>=` | `>=` | `>=` | Left ≥ right |
| Less/Equal | `<=` | `<=` | `<=` | Left ≤ right |
| Logical AND | `and` | `&&` | `&&` | Both true |
| Logical OR | `or` | `\|\|` | `\|\|` | Either true |
| Logical NOT | `not` | `!` | `!` | Invert boolean |

### Common String Methods

| Operation | Python | JavaScript | Java |
|-----------|--------|------------|------|
| Length | `len(s)` | `s.length` | `s.length()` |
| Uppercase | `s.upper()` | `s.toUpperCase()` | `s.toUpperCase()` |
| Lowercase | `s.lower()` | `s.toLowerCase()` | `s.toLowerCase()` |
| Trim | `s.strip()` | `s.trim()` | `s.trim()` |
| Split | `s.split(',')` | `s.split(',')` | `s.split(",")` |
| Join | `','.join(list)` | `list.join(',')` | `String.join(",", list)` |
| Replace | `s.replace('a', 'b')` | `s.replace('a', 'b')` | `s.replace("a", "b")` |
| Substring | `s[1:4]` | `s.substring(1, 4)` | `s.substring(1, 4)` |
| Contains | `'abc' in s` | `s.includes('abc')` | `s.contains("abc")` |

### Time Complexity

| Operation | Array/List | Dictionary/Map | Set |
|-----------|-----------|----------------|-----|
| Access by index | O(1) | N/A | N/A |
| Search by value | O(n) | N/A | N/A |
| Access by key | N/A | O(1) avg | N/A |
| Check membership | O(n) | O(1) avg | O(1) avg |
| Insert at end | O(1) amortized | O(1) avg | O(1) avg |
| Insert at beginning | O(n) | N/A | N/A |
| Delete | O(n) | O(1) avg | O(1) avg |

## Related Topics

### In This Repository

- **01-programming/oop-vs-functional**: Programming paradigms
- **01-programming/design-patterns**: Reusable solutions
- **01-programming/languages-overview**: Deep dive into specific languages
- **05-backend/databases**: Data persistence
- **09-ai-ml/data-engineering**: Large-scale data processing

### External Resources

**Interactive Practice:**
- LeetCode (algorithm problems)
- HackerRank (coding challenges)
- Exercism (mentored exercises)
- Codewars (kata challenges)

**Books:**
- "Python Crash Course" (beginner Python)
- "Eloquent JavaScript" (beginner JavaScript)
- "Head First Java" (beginner Java)
- "Think Like a Programmer" (problem-solving)

**Documentation:**
- Python: python.org/docs
- JavaScript: developer.mozilla.org (MDN)
- Java: docs.oracle.com/javase

---

Programming concepts are the foundation of all software development. Master these fundamentals across multiple languages, and you'll be able to learn any new language quickly and solve problems effectively. Practice is key—write code every day, even if just for 30 minutes.
