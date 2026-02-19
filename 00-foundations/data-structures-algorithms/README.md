# Data Structures and Algorithms

## What Are Data Structures and Algorithms?

**Data structures** are ways of organizing and storing data so programs can use it efficiently. Think of them as different types of containers - just as you'd use a filing cabinet for documents, a spice rack for seasonings, or a bookshelf for books, you choose different data structures based on what you're storing and how you need to access it.

**Algorithms** are step-by-step procedures for solving problems or performing tasks. They're like recipes - a clear set of instructions that, when followed, produce a specific result. Some recipes (algorithms) are faster or use fewer ingredients (resources) than others.

Together, data structures and algorithms form the foundation of efficient programming. Choosing the right data structure and algorithm can mean the difference between a program that responds instantly and one that takes minutes to complete the same task.

## Simple Analogy

Imagine you're organizing a library:

**Data Structures** = Different ways to organize books:
- **Shelves by category** (Arrays): Easy to browse, fixed locations
- **Card catalog with pointers** (Linked Lists): Flexible, can insert anywhere
- **Alphabetical index** (Hash Maps): Find any book instantly by title
- **Dewey Decimal System** (Trees): Hierarchical organization by topic
- **"Related books" connections** (Graphs): Books reference each other

**Algorithms** = Ways to find or organize books:
- **Linear search**: Check each book one by one until you find it
- **Binary search**: Start in the middle, eliminate half each time
- **Sorting**: Arrange books alphabetically or by topic
- **Recommendation**: Find similar books based on what you liked

## Why Does This Matter?

### Real-World Impact

**Example 1: Social Media Feed**
- **Bad approach**: Check every single post every time (millions of posts)
- **Good approach**: Use a priority queue and caching (show top posts instantly)
- **Difference**: 30 seconds vs 0.1 seconds

**Example 2: Route Finding (Google Maps)**
- **Bad approach**: Try every possible route
- **Good approach**: Use graph algorithms (Dijkstra's, A*)
- **Difference**: Hours of computation vs instant results

**Example 3: E-commerce Search**
- **Bad approach**: Compare search term to every product
- **Good approach**: Use indexed hash maps and tries
- **Difference**: Seconds vs milliseconds, works with millions of products

### Interview Importance

Data structures and algorithms are core to technical interviews because they:
- Demonstrate problem-solving ability
- Show understanding of trade-offs
- Prove you can write efficient code
- Indicate you can scale solutions

### Career Impact

Understanding these concepts helps you:
- Write code that scales from 10 to 10 million users
- Debug performance issues
- Make informed design decisions
- Communicate with other engineers

## Big O Notation: Measuring Efficiency

### What is Big O?

Big O notation describes how an algorithm's runtime or space requirements grow as the input size increases. It answers: "If I double my input, what happens to my runtime?"

Think of it like fuel efficiency in a car:
- **O(1)**: Electric motor - same energy regardless of distance
- **O(n)**: Hybrid - energy grows linearly with distance
- **O(n²)**: Gas guzzler - energy grows quadratically with distance

### Common Big O Complexities

```
Best to Worst Performance:

O(1)        Constant      ━━━━━━━━━━━━━━━━ (flat line)
O(log n)    Logarithmic   ━━━━━━━━━━━━━╱  (gentle curve)
O(n)        Linear        ━━━━━━━━━━╱╱╱╱  (straight slope)
O(n log n)  Linearithmic  ━━━━━━━╱╱╱╱╱╱╱╱ (steeper curve)
O(n²)       Quadratic     ━━━━╱╱╱╱╱╱╱╱╱╱╱╱╱ (steep curve)
O(2ⁿ)       Exponential   ━━╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱ (vertical!)
O(n!)       Factorial     ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱ (practically vertical)
```

### Visual Comparison

For input size n = 100:

| Big O | Operations | Example |
|-------|-----------|---------|
| O(1) | 1 | Accessing array index |
| O(log n) | 7 | Binary search |
| O(n) | 100 | Linear search |
| O(n log n) | 700 | Efficient sorting |
| O(n²) | 10,000 | Nested loops |
| O(2ⁿ) | 1,267,650,600,228,229,401,496,703,205,376 | Recursive Fibonacci (naive) |

### Examples in Code

#### O(1) - Constant Time

```python
def get_first_element(arr):
    """
    Always takes the same time, regardless of array size.
    """
    return arr[0]  # One operation

# 10 items: 1 operation
# 1,000 items: 1 operation
# 1,000,000 items: 1 operation
```

#### O(log n) - Logarithmic Time

```python
def binary_search(sorted_arr, target):
    """
    Eliminates half the remaining items each step.

    Example with 1,000 items:
    - Step 1: Check middle (index 500) - 500 items remain
    - Step 2: Check middle (index 250) - 250 items remain
    - Step 3: Check middle (index 125) - 125 items remain
    ...
    - Step 10: Found! (log₂(1000) ≈ 10 steps)
    """
    left, right = 0, len(sorted_arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if sorted_arr[mid] == target:
            return mid
        elif sorted_arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # Not found

# 10 items: ~3-4 comparisons
# 1,000 items: ~10 comparisons
# 1,000,000 items: ~20 comparisons
```

#### O(n) - Linear Time

```python
def find_max(arr):
    """
    Must check every element once.
    """
    max_val = arr[0]

    for num in arr:
        if num > max_val:
            max_val = num

    return max_val

# 10 items: 10 comparisons
# 1,000 items: 1,000 comparisons
# 1,000,000 items: 1,000,000 comparisons
```

#### O(n log n) - Linearithmic Time

```python
def merge_sort(arr):
    """
    Efficient sorting algorithm.

    Why n log n:
    - Divide array into halves: log n levels
    - Merge at each level: n operations
    - Total: n * log n
    """
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

# 10 items: ~33 operations
# 1,000 items: ~10,000 operations
# 1,000,000 items: ~20,000,000 operations
```

#### O(n²) - Quadratic Time

```python
def bubble_sort(arr):
    """
    Nested loops - for each element, check all elements.

    Why n²:
    - Outer loop: n iterations
    - Inner loop: n iterations
    - Total: n * n = n²
    """
    n = len(arr)

    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr

# 10 items: ~100 comparisons
# 1,000 items: ~1,000,000 comparisons (slow!)
# 1,000,000 items: ~1,000,000,000,000 comparisons (unusable!)
```

#### O(2ⁿ) - Exponential Time

```python
def fibonacci_recursive(n):
    """
    Naive recursive approach - recalculates same values many times.

    Why 2ⁿ:
    - Each call makes 2 more calls
    - Depth of n levels
    - Total: 2^n calls

    This is VERY slow!
    """
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

# fibonacci(10): 177 calls
# fibonacci(20): 21,891 calls
# fibonacci(40): 331,160,281 calls (several seconds!)
# fibonacci(50): Would take days!
```

**Better approach** (Dynamic Programming):
```python
def fibonacci_dynamic(n):
    """
    Store results - O(n) time instead of O(2ⁿ).
    """
    if n <= 1:
        return n

    fib = [0] * (n + 1)
    fib[1] = 1

    for i in range(2, n + 1):
        fib[i] = fib[i - 1] + fib[i - 2]

    return fib[n]

# fibonacci(10): 10 operations
# fibonacci(50): 50 operations
# fibonacci(1000): 1000 operations
```

### Space Complexity

Big O also describes memory usage:

```python
# O(1) space - constant memory
def sum_array(arr):
    total = 0  # One variable
    for num in arr:
        total += num
    return total

# O(n) space - scales with input
def duplicate_array(arr):
    return arr.copy()  # New array of size n

# O(n²) space - grows quadratically
def create_2d_array(n):
    return [[0] * n for _ in range(n)]  # n * n grid
```

## Arrays

### What Are Arrays?

An array is a collection of items stored in contiguous memory locations. Each item has an index (position number) starting from 0.

```
Array: [10, 20, 30, 40, 50]
Index:  0   1   2   3   4

Memory visualization:
┌────┬────┬────┬────┬────┐
│ 10 │ 20 │ 30 │ 40 │ 50 │
└────┴────┴────┴────┴────┘
 [0]  [1]  [2]  [3]  [4]
```

### Array Operations

```python
# Creation - O(1)
arr = [1, 2, 3, 4, 5]

# Access by index - O(1)
first = arr[0]      # 1
third = arr[2]      # 3
last = arr[-1]      # 5

# Update - O(1)
arr[2] = 30         # [1, 2, 30, 4, 5]

# Append to end - O(1) amortized
arr.append(6)       # [1, 2, 30, 4, 5, 6]

# Insert at position - O(n)
arr.insert(0, 0)    # [0, 1, 2, 30, 4, 5, 6]
# Why O(n)? Must shift all elements after insertion point

# Remove by value - O(n)
arr.remove(30)      # [0, 1, 2, 4, 5, 6]
# Why O(n)? Must search for value, then shift elements

# Remove by index - O(n)
del arr[0]          # [1, 2, 4, 5, 6]
# Why O(n)? Must shift elements after removal

# Pop from end - O(1)
last = arr.pop()    # Returns 6, arr is [1, 2, 4, 5]

# Search - O(n)
if 4 in arr:        # Must check each element
    print("Found!")

# Length - O(1)
size = len(arr)     # 4
```

### Array Time Complexity Summary

| Operation | Average Case | Worst Case |
|-----------|-------------|------------|
| Access | O(1) | O(1) |
| Search | O(n) | O(n) |
| Insert (end) | O(1) | O(n)* |
| Insert (middle) | O(n) | O(n) |
| Delete (end) | O(1) | O(1) |
| Delete (middle) | O(n) | O(n) |

*Amortized O(1) - occasionally O(n) when array needs to resize

### When to Use Arrays

**Use arrays when**:
- You need fast random access by index
- You know the size ahead of time (or it doesn't change much)
- Order matters
- You're iterating through all elements

**Examples**:
- Storing sensor readings over time
- Representing a fixed game board (8x8 chess board)
- Collecting items in a shopping cart
- Storing RGB color values [255, 128, 0]

### Array Example: Student Grades

```python
def calculate_grade_statistics(grades):
    """
    Calculate statistics for student grades.

    Why arrays work well:
    - Fixed number of students
    - Need to iterate through all grades
    - Fast access to any grade
    - Order represents student ID
    """
    if not grades:
        return None

    # O(n) - must check all grades
    total = sum(grades)
    average = total / len(grades)

    # O(n) - find min and max
    min_grade = min(grades)
    max_grade = max(grades)

    # O(n log n) - sorting
    sorted_grades = sorted(grades)
    median = sorted_grades[len(grades) // 2]

    return {
        'average': average,
        'min': min_grade,
        'max': max_grade,
        'median': median
    }

# Usage
grades = [85, 92, 78, 90, 88, 76, 95]
stats = calculate_grade_statistics(grades)
# {'average': 86.29, 'min': 76, 'max': 95, 'median': 88}
```

## Linked Lists

### What Are Linked Lists?

A linked list is a sequence of nodes where each node contains data and a reference (pointer) to the next node. Unlike arrays, elements aren't in contiguous memory.

```
Array:
┌────┬────┬────┬────┐
│ 10 │ 20 │ 30 │ 40 │  (contiguous memory)
└────┴────┴────┴────┘

Linked List:
┌─────┬────┐    ┌─────┬────┐    ┌─────┬────┐    ┌─────┬──────┐
│ 10  │  ──┼───>│ 20  │  ──┼───>│ 30  │  ──┼───>│ 40  │ None │
└─────┴────┘    └─────┴────┘    └─────┴────┘    └─────┴──────┘
 data  next      data  next      data  next      data    next
```

### Linked List Implementation

```python
class Node:
    """A single node in a linked list."""
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    """A singly linked list implementation."""

    def __init__(self):
        self.head = None

    def append(self, data):
        """Add node to end - O(n)."""
        new_node = Node(data)

        if not self.head:
            self.head = new_node
            return

        # Traverse to end
        current = self.head
        while current.next:
            current = current.next

        current.next = new_node

    def prepend(self, data):
        """Add node to beginning - O(1)."""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_after(self, target_data, new_data):
        """Insert after a specific value - O(n)."""
        current = self.head

        while current:
            if current.data == target_data:
                new_node = Node(new_data)
                new_node.next = current.next
                current.next = new_node
                return True
            current = current.next

        return False  # Target not found

    def delete(self, data):
        """Remove first node with data - O(n)."""
        if not self.head:
            return False

        # Special case: head node
        if self.head.data == data:
            self.head = self.head.next
            return True

        # Search for node
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return True
            current = current.next

        return False  # Not found

    def search(self, data):
        """Find node with data - O(n)."""
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False

    def display(self):
        """Print all nodes - O(n)."""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements))

# Usage
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
ll.prepend(5)
ll.display()  # 5 -> 10 -> 20 -> 30
```

### Linked List vs Array

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1) | O(n)* |
| Insert in middle | O(n) | O(1)** |
| Delete beginning | O(n) | O(1) |
| Delete end | O(1) | O(n) |
| Delete middle | O(n) | O(1)** |
| Memory | Contiguous | Scattered |
| Extra memory | None | Pointers |

*O(1) if you keep a tail pointer
**O(1) if you already have reference to that position

### When to Use Linked Lists

**Use linked lists when**:
- You insert/delete from the beginning frequently
- You don't need random access by index
- Size changes frequently
- You're implementing stacks or queues

**Examples**:
- Browser history (back/forward buttons)
- Music playlist
- Undo/redo functionality
- Memory management in operating systems

## Stacks

### What Is a Stack?

A stack is a Last-In-First-Out (LIFO) data structure. Think of a stack of plates - you can only add or remove from the top.

```
Push (add):          Pop (remove):

    ┌───┐                ┌───┐
    │ 4 │ <- add         │ 4 │ <- remove
    └───┘                └───┘
    ┌───┐                ┌───┐
    │ 3 │                │ 3 │
    └───┘                └───┘
    ┌───┐                ┌───┐
    │ 2 │                │ 2 │
    └───┘                └───┘
    ┌───┐                ┌───┐
    │ 1 │                │ 1 │
    └───┘                └───┘
```

### Stack Implementation

```python
class Stack:
    """Stack using Python list."""

    def __init__(self):
        self.items = []

    def push(self, item):
        """Add item to top - O(1)."""
        self.items.append(item)

    def pop(self):
        """Remove and return top item - O(1)."""
        if self.is_empty():
            raise IndexError("Pop from empty stack")
        return self.items.pop()

    def peek(self):
        """View top item without removing - O(1)."""
        if self.is_empty():
            raise IndexError("Peek at empty stack")
        return self.items[-1]

    def is_empty(self):
        """Check if stack is empty - O(1)."""
        return len(self.items) == 0

    def size(self):
        """Get number of items - O(1)."""
        return len(self.items)

# Usage
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(stack.pop())   # 3 (last in, first out)
print(stack.peek())  # 2 (still on stack)
```

### Stack Operations

| Operation | Time Complexity |
|-----------|----------------|
| Push | O(1) |
| Pop | O(1) |
| Peek | O(1) |
| Is Empty | O(1) |

### Stack Use Cases

#### 1. Function Call Stack

```python
def function_a():
    print("A start")
    function_b()
    print("A end")

def function_b():
    print("B start")
    function_c()
    print("B end")

def function_c():
    print("C start")
    print("C end")

function_a()

# Call stack visualization:
#
# function_a() called
# ┌─────────────┐
# │ function_a  │
# └─────────────┘
#
# function_b() called
# ┌─────────────┐
# │ function_b  │
# ├─────────────┤
# │ function_a  │
# └─────────────┘
#
# function_c() called
# ┌─────────────┐
# │ function_c  │
# ├─────────────┤
# │ function_b  │
# ├─────────────┤
# │ function_a  │
# └─────────────┘
#
# function_c() returns
# ┌─────────────┐
# │ function_b  │
# ├─────────────┤
# │ function_a  │
# └─────────────┘
# (and so on...)
```

#### 2. Undo/Redo Functionality

```python
class TextEditor:
    """Simple text editor with undo/redo."""

    def __init__(self):
        self.text = ""
        self.undo_stack = []
        self.redo_stack = []

    def type(self, text):
        """Add text and save state for undo."""
        self.undo_stack.append(self.text)
        self.text += text
        self.redo_stack.clear()  # Clear redo when new action

    def undo(self):
        """Undo last action."""
        if self.undo_stack:
            self.redo_stack.append(self.text)
            self.text = self.undo_stack.pop()

    def redo(self):
        """Redo last undone action."""
        if self.redo_stack:
            self.undo_stack.append(self.text)
            self.text = self.redo_stack.pop()

# Usage
editor = TextEditor()
editor.type("Hello")      # text: "Hello"
editor.type(" World")     # text: "Hello World"
editor.undo()             # text: "Hello"
editor.undo()             # text: ""
editor.redo()             # text: "Hello"
```

#### 3. Balanced Parentheses Checker

```python
def is_balanced(expression):
    """
    Check if parentheses are balanced.

    Example:
    - "((()))" → True
    - "(()" → False
    - "()())" → False
    """
    stack = Stack()
    matching = {'(': ')', '[': ']', '{': '}'}

    for char in expression:
        if char in matching:
            # Opening bracket - push to stack
            stack.push(char)
        elif char in matching.values():
            # Closing bracket - check if matches
            if stack.is_empty():
                return False
            if matching[stack.pop()] != char:
                return False

    # All brackets should be closed
    return stack.is_empty()

# Usage
print(is_balanced("((()))"))        # True
print(is_balanced("({[]})"))        # True
print(is_balanced("((()"))          # False
print(is_balanced("({[})"))         # False
```

## Queues

### What Is a Queue?

A queue is a First-In-First-Out (FIFO) data structure. Think of a line at a store - first person in line is first to be served.

```
Enqueue (add to back):

  Front                       Rear
    ↓                          ↓
┌───┬───┬───┬───┐          ┌───┐
│ 1 │ 2 │ 3 │ 4 │  <---    │ 5 │
└───┴───┴───┴───┘          └───┘

Dequeue (remove from front):

  ┌───┐   Front              Rear
  │ 1 │     ↓                 ↓
  └───┘   ┌───┬───┬───┬───┐
   out    │ 2 │ 3 │ 4 │ 5 │
          └───┴───┴───┴───┘
```

### Queue Implementation

```python
from collections import deque

class Queue:
    """Queue using deque for O(1) operations."""

    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        """Add item to rear - O(1)."""
        self.items.append(item)

    def dequeue(self):
        """Remove and return front item - O(1)."""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")
        return self.items.popleft()

    def front(self):
        """View front item - O(1)."""
        if self.is_empty():
            raise IndexError("Front of empty queue")
        return self.items[0]

    def is_empty(self):
        """Check if empty - O(1)."""
        return len(self.items) == 0

    def size(self):
        """Get size - O(1)."""
        return len(self.items)

# Usage
queue = Queue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)
print(queue.dequeue())  # 1 (first in, first out)
print(queue.front())    # 2 (next to be removed)
```

### Queue Use Cases

#### 1. Task Processing

```python
class TaskQueue:
    """Process tasks in order received."""

    def __init__(self):
        self.queue = Queue()

    def add_task(self, task):
        """Add task to queue."""
        print(f"Adding task: {task}")
        self.queue.enqueue(task)

    def process_tasks(self):
        """Process all tasks in order."""
        while not self.queue.is_empty():
            task = self.queue.dequeue()
            print(f"Processing: {task}")
            # Do the actual work...

# Usage
tasks = TaskQueue()
tasks.add_task("Send email")
tasks.add_task("Generate report")
tasks.add_task("Update database")
tasks.process_tasks()

# Output:
# Adding task: Send email
# Adding task: Generate report
# Adding task: Update database
# Processing: Send email
# Processing: Generate report
# Processing: Update database
```

#### 2. Breadth-First Search (BFS)

```python
def bfs_tree_traversal(root):
    """
    Visit tree nodes level by level.

    Tree:
          1
        /   \
       2     3
      / \   / \
     4   5 6   7

    BFS order: 1, 2, 3, 4, 5, 6, 7
    """
    if not root:
        return []

    result = []
    queue = Queue()
    queue.enqueue(root)

    while not queue.is_empty():
        node = queue.dequeue()
        result.append(node.value)

        # Add children to queue
        if node.left:
            queue.enqueue(node.left)
        if node.right:
            queue.enqueue(node.right)

    return result
```

#### 3. Print Queue

```python
class PrintQueue:
    """Manage print jobs."""

    def __init__(self):
        self.queue = Queue()

    def add_print_job(self, document, pages):
        """Add document to print queue."""
        job = {'document': document, 'pages': pages}
        self.queue.enqueue(job)
        print(f"Added to queue: {document} ({pages} pages)")

    def print_next(self):
        """Print next document in queue."""
        if self.queue.is_empty():
            print("No documents in queue")
            return

        job = self.queue.dequeue()
        print(f"Printing: {job['document']} ({job['pages']} pages)")
        # Simulate printing...

    def show_queue(self):
        """Display current queue."""
        if self.queue.is_empty():
            print("Queue is empty")
            return

        print(f"Documents in queue: {self.queue.size()}")

# Usage
printer = PrintQueue()
printer.add_print_job("Report.pdf", 10)
printer.add_print_job("Invoice.pdf", 2)
printer.add_print_job("Contract.pdf", 25)
printer.print_next()  # Prints Report.pdf first
```

## Hash Maps (Dictionaries)

### What Is a Hash Map?

A hash map (also called dictionary, hash table, or associative array) stores key-value pairs with very fast lookups. Think of it like a real dictionary - you look up a word (key) to find its definition (value).

```
Hash Map:

Key          Value
───          ─────
"name"    →  "Alice"
"age"     →  25
"city"    →  "Seattle"
"email"   →  "alice@example.com"

Internal structure:
┌─────────────────────────┐
│ Index 0:  []            │
│ Index 1:  []            │
│ Index 2:  [age→25]      │
│ Index 3:  []            │
│ Index 4:  [name→Alice]  │
│ Index 5:  [city→Seattle]│
│ ...                     │
└─────────────────────────┘
```

### How Hash Maps Work

1. **Hash function** converts key to an integer
2. **Modulo operation** maps integer to array index
3. **Store** value at that index
4. **Retrieve** by repeating steps 1-2 to find index

```python
# Simplified example
def simple_hash(key, size=10):
    """Convert string key to array index."""
    return sum(ord(char) for char in key) % size

# "name" → (110+97+109+101) % 10 = 417 % 10 = 7
# "age"  → (97+103+101) % 10 = 301 % 10 = 1
# "city" → (99+105+116+121) % 10 = 441 % 10 = 1 (collision!)
```

### Hash Map Operations

```python
# Creation
person = {
    "name": "Alice",
    "age": 25,
    "city": "Seattle"
}

# Access - O(1) average
name = person["name"]              # "Alice"
age = person.get("age")            # 25
missing = person.get("phone", "")  # "" (default)

# Insert/Update - O(1) average
person["email"] = "alice@example.com"  # Add
person["age"] = 26                     # Update

# Delete - O(1) average
del person["city"]
person.pop("email", None)  # Safe deletion

# Check existence - O(1) average
if "name" in person:
    print("Name exists")

# Iterate
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

# Get all keys/values
keys = list(person.keys())      # ["name", "age"]
values = list(person.values())  # ["Alice", 26]
```

### Hash Map Time Complexity

| Operation | Average Case | Worst Case |
|-----------|-------------|------------|
| Access | O(1) | O(n) |
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Search | O(1) | O(n) |

**Worst case** occurs with many hash collisions (rare with good hash functions).

### When to Use Hash Maps

**Use hash maps when**:
- You need fast lookups by key
- Keys are unique
- Order doesn't matter (use OrderedDict if it does)
- You're counting occurrences
- You're caching results

### Hash Map Examples

#### 1. Counting Occurrences

```python
def count_words(text):
    """
    Count frequency of each word.

    Why hash map:
    - Fast lookup to check if word seen before
    - O(1) increment of count
    - Overall O(n) time where n = number of words
    """
    words = text.lower().split()
    counts = {}

    for word in words:
        # Get current count (0 if not seen), add 1
        counts[word] = counts.get(word, 0) + 1

    return counts

# Usage
text = "the quick brown fox jumps over the lazy dog"
counts = count_words(text)
# {'the': 2, 'quick': 1, 'brown': 1, ...}
```

#### 2. Caching/Memoization

```python
def fibonacci_memoized():
    """
    Fibonacci with caching.

    Without cache: O(2ⁿ) - exponential
    With cache: O(n) - linear
    """
    cache = {}

    def fib(n):
        # Check cache first
        if n in cache:
            return cache[n]

        # Base cases
        if n <= 1:
            return n

        # Calculate and cache
        result = fib(n - 1) + fib(n - 2)
        cache[n] = result
        return result

    return fib

fib = fibonacci_memoized()
print(fib(100))  # Instant! (without cache, this would take forever)
```

#### 3. Two Sum Problem

```python
def two_sum(nums, target):
    """
    Find two numbers that add up to target.

    Brute force: O(n²) - check all pairs
    Hash map: O(n) - single pass

    Example:
    nums = [2, 7, 11, 15], target = 9
    Return: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)
    """
    seen = {}  # Maps value → index

    for i, num in enumerate(nums):
        complement = target - num

        # Check if complement was seen before
        if complement in seen:
            return [seen[complement], i]

        # Store this number
        seen[num] = i

    return None  # No solution

# Usage
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
```

#### 4. Group Anagrams

```python
def group_anagrams(words):
    """
    Group words that are anagrams.

    Example:
    ["eat", "tea", "tan", "ate", "nat", "bat"]
    →
    [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]

    Why hash map:
    - Sorted word as key (anagrams have same sorted form)
    - O(n * k log k) where n=words, k=avg word length
    """
    groups = {}

    for word in words:
        # Sorted word is the key
        key = ''.join(sorted(word))

        # Add to group
        if key not in groups:
            groups[key] = []
        groups[key].append(word)

    return list(groups.values())

# Usage
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(words))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

## Trees

### What Are Trees?

A tree is a hierarchical data structure with a root node and child nodes, forming parent-child relationships. Each node can have multiple children, but only one parent.

```
        1         ← Root
       / \
      2   3       ← Level 1
     / \   \
    4   5   6     ← Level 2 (Leaves)

Terminology:
- Root: Top node (1)
- Parent: Node with children (1, 2, 3)
- Child: Node below parent (2, 3, 4, 5, 6)
- Leaf: Node with no children (4, 5, 6)
- Height: Longest path from root to leaf (2)
- Depth of node: Distance from root
```

### Binary Tree

A binary tree is a tree where each node has at most two children (left and right).

```python
class TreeNode:
    """A node in a binary tree."""
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

# Creating a tree
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

#       1
#      / \
#     2   3
#    / \
#   4   5
```

### Tree Traversals

```python
def inorder(node):
    """
    Inorder: Left → Root → Right
    Result for above tree: [4, 2, 5, 1, 3]
    """
    if not node:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)

def preorder(node):
    """
    Preorder: Root → Left → Right
    Result: [1, 2, 4, 5, 3]
    """
    if not node:
        return []
    return [node.value] + preorder(node.left) + preorder(node.right)

def postorder(node):
    """
    Postorder: Left → Right → Root
    Result: [4, 5, 2, 3, 1]
    """
    if not node:
        return []
    return postorder(node.left) + postorder(node.right) + [node.value]

def level_order(root):
    """
    Level order (BFS): Level by level
    Result: [1, 2, 3, 4, 5]
    """
    if not root:
        return []

    result = []
    queue = Queue()
    queue.enqueue(root)

    while not queue.is_empty():
        node = queue.dequeue()
        result.append(node.value)

        if node.left:
            queue.enqueue(node.left)
        if node.right:
            queue.enqueue(node.right)

    return result
```

### Binary Search Tree (BST)

A BST is a binary tree where:
- Left child < Parent
- Right child > Parent
- This applies recursively to all subtrees

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13

Properties:
- All values in left subtree < 8
- All values in right subtree > 8
- Inorder traversal gives sorted order: [1,3,4,6,7,8,10,13,14]
```

### BST Operations

```python
class BST:
    """Binary Search Tree implementation."""

    def __init__(self):
        self.root = None

    def insert(self, value):
        """Insert value - O(log n) average, O(n) worst."""
        if not self.root:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)

    def search(self, value):
        """Search for value - O(log n) average, O(n) worst."""
        return self._search_recursive(self.root, value)

    def _search_recursive(self, node, value):
        if node is None:
            return False
        if node.value == value:
            return True
        elif value < node.value:
            return self._search_recursive(node.left, value)
        else:
            return self._search_recursive(node.right, value)

    def find_min(self):
        """Find minimum value - O(h) where h is height."""
        if not self.root:
            return None
        node = self.root
        while node.left:
            node = node.left
        return node.value

    def find_max(self):
        """Find maximum value - O(h)."""
        if not self.root:
            return None
        node = self.root
        while node.right:
            node = node.right
        return node.value

# Usage
bst = BST()
for value in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
    bst.insert(value)

print(bst.search(6))    # True
print(bst.search(15))   # False
print(bst.find_min())   # 1
print(bst.find_max())   # 14
```

### BST Time Complexity

| Operation | Average Case | Worst Case |
|-----------|-------------|------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

**Worst case**: Unbalanced tree (essentially a linked list)

```
Balanced:         Unbalanced:
    4                 1
   / \                 \
  2   6                 2
 / \ / \                 \
1  3 5  7                 3
                           \
Height: 2                   4
O(log n)                     \
                              5

                          Height: 4
                          O(n)
```

**Solution**: Use self-balancing trees (AVL, Red-Black) to guarantee O(log n).

### Tree Use Cases

#### 1. File System

```python
class FileNode:
    """Represents a file or directory."""
    def __init__(self, name, is_directory=False):
        self.name = name
        self.is_directory = is_directory
        self.children = [] if is_directory else None
        self.size = 0

    def add_child(self, child):
        if self.is_directory:
            self.children.append(child)

# Create file system
root = FileNode("/", is_directory=True)
home = FileNode("home", is_directory=True)
user = FileNode("user", is_directory=True)
documents = FileNode("documents", is_directory=True)
file1 = FileNode("readme.txt")
file2 = FileNode("report.pdf")

root.add_child(home)
home.add_child(user)
user.add_child(documents)
documents.add_child(file1)
documents.add_child(file2)

# Tree structure:
# /
#  home/
#    user/
#      documents/
#        readme.txt
#        report.pdf
```

#### 2. Expression Evaluation

```python
# Expression: (3 + 5) * (2 + 4)
#
# Tree representation:
#        *
#       / \
#      +   +
#     / \ / \
#    3  5 2  4

def evaluate_expression_tree(node):
    """Evaluate arithmetic expression tree."""
    # Leaf node (number)
    if node.left is None and node.right is None:
        return node.value

    # Evaluate left and right subtrees
    left_val = evaluate_expression_tree(node.left)
    right_val = evaluate_expression_tree(node.right)

    # Apply operator
    if node.value == '+':
        return left_val + right_val
    elif node.value == '-':
        return left_val - right_val
    elif node.value == '*':
        return left_val * right_val
    elif node.value == '/':
        return left_val / right_val

# Result: (3+5) * (2+4) = 8 * 6 = 48
```

#### 3. Priority Task Management

```python
class TaskBST:
    """Manage tasks by priority using BST."""

    def __init__(self):
        self.bst = BST()

    def add_task(self, priority, description):
        """Add task with priority."""
        self.bst.insert((priority, description))

    def get_highest_priority(self):
        """Get task with highest priority (lowest number)."""
        return self.bst.find_min()

    def get_lowest_priority(self):
        """Get task with lowest priority (highest number)."""
        return self.bst.find_max()

# Usage
tasks = TaskBST()
tasks.add_task(2, "Write report")
tasks.add_task(1, "Fix critical bug")
tasks.add_task(3, "Update documentation")

print(tasks.get_highest_priority())  # (1, "Fix critical bug")
```

## Graphs

### What Are Graphs?

A graph is a collection of nodes (vertices) connected by edges. Unlike trees, graphs can have cycles and nodes can connect to any other node.

```
Tree (no cycles):        Graph (with cycle):
      A                       A
     / \                     /|\
    B   C                   B | C
   /                         \|/
  D                           D

Directed Graph:          Undirected Graph:
A → B                    A — B
↓   ↓                    |   |
C → D                    C — D
```

### Graph Representations

#### 1. Adjacency List (Most Common)

```python
# Graph:
#   A — B
#   |   |
#   C — D

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}
```

#### 2. Adjacency Matrix

```python
# Same graph as matrix:
#     A  B  C  D
# A [ 0  1  1  0 ]
# B [ 1  0  0  1 ]
# C [ 1  0  0  1 ]
# D [ 0  1  1  0 ]

graph = [
    [0, 1, 1, 0],  # A
    [1, 0, 0, 1],  # B
    [1, 0, 0, 1],  # C
    [0, 1, 1, 0]   # D
]
```

### Graph Class Implementation

```python
class Graph:
    """Undirected graph using adjacency list."""

    def __init__(self):
        self.graph = {}

    def add_vertex(self, vertex):
        """Add a vertex."""
        if vertex not in self.graph:
            self.graph[vertex] = []

    def add_edge(self, vertex1, vertex2):
        """Add an edge between two vertices."""
        # Add vertices if they don't exist
        self.add_vertex(vertex1)
        self.add_vertex(vertex2)

        # Add edges (undirected, so add both directions)
        if vertex2 not in self.graph[vertex1]:
            self.graph[vertex1].append(vertex2)
        if vertex1 not in self.graph[vertex2]:
            self.graph[vertex2].append(vertex1)

    def get_neighbors(self, vertex):
        """Get all neighbors of a vertex."""
        return self.graph.get(vertex, [])

    def display(self):
        """Display the graph."""
        for vertex in self.graph:
            print(f"{vertex}: {self.graph[vertex]}")

# Usage
g = Graph()
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('C', 'D')
g.display()
# A: ['B', 'C']
# B: ['A', 'D']
# C: ['A', 'D']
# D: ['B', 'C']
```

### Graph Traversals

#### Depth-First Search (DFS)

```python
def dfs(graph, start, visited=None):
    """
    Depth-First Search - explore as far as possible before backtracking.

    Uses stack (recursion stack here).

    Example path: A → B → D → C
    """
    if visited is None:
        visited = set()

    visited.add(start)
    print(start, end=' ')

    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}
dfs(graph, 'A')  # Output: A B D C
```

#### Breadth-First Search (BFS)

```python
def bfs(graph, start):
    """
    Breadth-First Search - explore all neighbors before going deeper.

    Uses queue.

    Example path: A → B → C → D
    """
    visited = set()
    queue = Queue()

    visited.add(start)
    queue.enqueue(start)

    while not queue.is_empty():
        vertex = queue.dequeue()
        print(vertex, end=' ')

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)

# Usage
bfs(graph, 'A')  # Output: A B C D
```

### Graph Algorithms

#### Finding Shortest Path (BFS-based)

```python
def shortest_path(graph, start, end):
    """
    Find shortest path between two vertices.

    BFS guarantees shortest path in unweighted graphs.
    """
    if start == end:
        return [start]

    visited = {start}
    queue = Queue()
    queue.enqueue([start])  # Path as list

    while not queue.is_empty():
        path = queue.dequeue()
        vertex = path[-1]

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                new_path = path + [neighbor]

                if neighbor == end:
                    return new_path

                visited.add(neighbor)
                queue.enqueue(new_path)

    return None  # No path found

# Usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

path = shortest_path(graph, 'A', 'F')
print(' → '.join(path))  # A → C → F
```

#### Cycle Detection

```python
def has_cycle(graph):
    """
    Detect if graph has a cycle.

    Uses DFS with recursion stack tracking.
    """
    visited = set()
    rec_stack = set()

    def dfs_cycle(vertex):
        visited.add(vertex)
        rec_stack.add(vertex)

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                if dfs_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True  # Back edge found = cycle

        rec_stack.remove(vertex)
        return False

    for vertex in graph:
        if vertex not in visited:
            if dfs_cycle(vertex):
                return True

    return False

# Usage (directed graph with cycle)
graph_with_cycle = {
    'A': ['B'],
    'B': ['C'],
    'C': ['A']  # Cycle: A → B → C → A
}
print(has_cycle(graph_with_cycle))  # True

graph_no_cycle = {
    'A': ['B'],
    'B': ['C'],
    'C': []
}
print(has_cycle(graph_no_cycle))  # False
```

### Graph Use Cases

#### 1. Social Network

```python
class SocialNetwork:
    """Represent social connections as a graph."""

    def __init__(self):
        self.network = Graph()

    def add_user(self, user):
        """Add a user to the network."""
        self.network.add_vertex(user)

    def add_friendship(self, user1, user2):
        """Connect two users as friends."""
        self.network.add_edge(user1, user2)

    def get_friends(self, user):
        """Get all friends of a user."""
        return self.network.get_neighbors(user)

    def find_connection_path(self, user1, user2):
        """Find how two users are connected."""
        return shortest_path(self.network.graph, user1, user2)

    def mutual_friends(self, user1, user2):
        """Find mutual friends between two users."""
        friends1 = set(self.get_friends(user1))
        friends2 = set(self.get_friends(user2))
        return list(friends1 & friends2)

# Usage
social = SocialNetwork()
social.add_friendship("Alice", "Bob")
social.add_friendship("Bob", "Charlie")
social.add_friendship("Alice", "David")
social.add_friendship("David", "Charlie")

path = social.find_connection_path("Alice", "Charlie")
print(" → ".join(path))  # Alice → Bob → Charlie
```

#### 2. City Road Network

```python
class CityMap:
    """Represent city roads as weighted graph."""

    def __init__(self):
        self.roads = {}  # vertex → [(neighbor, distance), ...]

    def add_road(self, city1, city2, distance):
        """Add a road between two cities."""
        if city1 not in self.roads:
            self.roads[city1] = []
        if city2 not in self.roads:
            self.roads[city2] = []

        self.roads[city1].append((city2, distance))
        self.roads[city2].append((city1, distance))

    def find_nearest_city(self, start):
        """Find the nearest connected city."""
        if start not in self.roads or not self.roads[start]:
            return None

        nearest = min(self.roads[start], key=lambda x: x[1])
        return nearest[0]  # Return city name

# Usage
city_map = CityMap()
city_map.add_road("Seattle", "Portland", 173)
city_map.add_road("Seattle", "Vancouver", 141)
city_map.add_road("Portland", "San Francisco", 635)

nearest = city_map.find_nearest_city("Seattle")
print(f"Nearest city to Seattle: {nearest}")  # Vancouver
```

#### 3. Course Prerequisites

```python
def can_finish_courses(num_courses, prerequisites):
    """
    Determine if all courses can be completed.

    Example:
    4 courses: [0, 1, 2, 3]
    Prerequisites: [[1,0], [2,1], [3,2]]
    Meaning: To take 1, must finish 0. To take 2, must finish 1, etc.

    This is cycle detection - if there's a cycle, impossible to finish.
    """
    # Build graph
    graph = {i: [] for i in range(num_courses)}
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    # Check for cycle
    visited = set()
    rec_stack = set()

    def has_cycle_dfs(course):
        visited.add(course)
        rec_stack.add(course)

        for next_course in graph[course]:
            if next_course not in visited:
                if has_cycle_dfs(next_course):
                    return True
            elif next_course in rec_stack:
                return True

        rec_stack.remove(course)
        return False

    for course in range(num_courses):
        if course not in visited:
            if has_cycle_dfs(course):
                return False

    return True

# Usage
print(can_finish_courses(4, [[1,0], [2,1], [3,2]]))  # True
print(can_finish_courses(2, [[1,0], [0,1]]))  # False (cycle!)
```

## Best Practices

### Safety

**Validate input sizes**:
```python
def process_large_array(arr):
    """
    Process array with size limits.

    Why:
    - Prevent memory exhaustion
    - Avoid long-running operations
    - Protect against malicious input
    """
    MAX_SIZE = 1_000_000

    if len(arr) > MAX_SIZE:
        raise ValueError(f"Array too large: {len(arr)} > {MAX_SIZE}")

    # Proceed with processing
    return sorted(arr)
```

**Handle empty inputs**:
```python
def binary_search_safe(arr, target):
    """Binary search with input validation."""
    # Check for empty array
    if not arr:
        return -1

    # Check if sorted
    if arr != sorted(arr):
        raise ValueError("Array must be sorted for binary search")

    # Proceed with search
    return binary_search(arr, target)
```

**Prevent infinite loops**:
```python
def dfs_with_limit(graph, start, max_depth=100):
    """
    DFS with depth limit to prevent infinite recursion.

    Why:
    - Cyclic graphs can cause infinite recursion
    - Stack overflow protection
    - Detect potential bugs
    """
    def dfs_recursive(vertex, depth):
        if depth > max_depth:
            raise RecursionError(f"Max depth {max_depth} exceeded")

        visited.add(vertex)

        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                dfs_recursive(neighbor, depth + 1)

    visited = set()
    dfs_recursive(start, 0)
    return visited
```

### Quality

**Choose the right data structure**:
```python
# Bad: Using list for frequent lookups
def has_duplicate_bad(arr):
    """O(n²) - checks entire list for each element."""
    for i, val in enumerate(arr):
        if val in arr[i+1:]:  # Linear search
            return True
    return False

# Good: Using set for O(1) lookups
def has_duplicate_good(arr):
    """O(n) - single pass with set."""
    seen = set()
    for val in arr:
        if val in seen:  # O(1) lookup
            return True
        seen.add(val)
    return False

# Time for 10,000 items:
# Bad: ~50 seconds
# Good: ~0.001 seconds
```

**Test edge cases**:
```python
import unittest

class TestBinarySearch(unittest.TestCase):
    """Comprehensive tests for binary search."""

    def test_empty_array(self):
        self.assertEqual(binary_search([], 5), -1)

    def test_single_element_found(self):
        self.assertEqual(binary_search([5], 5), 0)

    def test_single_element_not_found(self):
        self.assertEqual(binary_search([5], 3), -1)

    def test_target_at_beginning(self):
        self.assertEqual(binary_search([1,2,3,4,5], 1), 0)

    def test_target_at_end(self):
        self.assertEqual(binary_search([1,2,3,4,5], 5), 4)

    def test_target_in_middle(self):
        self.assertEqual(binary_search([1,2,3,4,5], 3), 2)

    def test_large_array(self):
        arr = list(range(1_000_000))
        self.assertEqual(binary_search(arr, 999_999), 999_999)
```

### Logging

**Log performance metrics**:
```python
import logging
import time

logger = logging.getLogger(__name__)

def timed_sort(arr, algorithm="merge"):
    """
    Sort with timing and logging.

    Logs:
    - Input size
    - Algorithm used
    - Time taken
    - Memory usage
    """
    start_time = time.time()
    start_size = len(arr)

    logger.info(
        f"Starting sort: algorithm={algorithm}, size={start_size}",
        extra={'algorithm': algorithm, 'size': start_size}
    )

    if algorithm == "merge":
        result = merge_sort(arr)
    elif algorithm == "quick":
        result = quick_sort(arr)
    else:
        result = sorted(arr)

    duration = time.time() - start_time

    logger.info(
        f"Sort completed: duration={duration:.4f}s",
        extra={
            'algorithm': algorithm,
            'size': start_size,
            'duration_seconds': duration
        }
    )

    # Alert if slow
    if duration > 1.0:
        logger.warning(f"Slow sort detected: {duration:.2f}s for {start_size} items")

    return result
```

**Log data structure operations**:
```python
class LoggedHashMap:
    """Hash map with operation logging."""

    def __init__(self):
        self.data = {}
        self.operation_count = 0

    def get(self, key):
        self.operation_count += 1

        if key in self.data:
            logger.debug(
                f"Hash map hit: key={key}",
                extra={'operation': 'get', 'hit': True}
            )
            return self.data[key]
        else:
            logger.debug(
                f"Hash map miss: key={key}",
                extra={'operation': 'get', 'hit': False}
            )
            return None

    def put(self, key, value):
        self.operation_count += 1
        is_update = key in self.data

        self.data[key] = value

        logger.debug(
            f"Hash map put: key={key}, is_update={is_update}",
            extra={
                'operation': 'put',
                'is_update': is_update,
                'size': len(self.data)
            }
        )

    def get_stats(self):
        """Return usage statistics."""
        return {
            'size': len(self.data),
            'operations': self.operation_count
        }
```

## Use Cases

### E-commerce Product Catalog

**Challenge**: Search millions of products efficiently.

**Data structures applied**:

1. **Hash map for product lookup by ID**:
```python
products = {
    "PROD001": {"name": "Laptop", "price": 999},
    "PROD002": {"name": "Mouse", "price": 25},
    # ... millions more
}

# O(1) lookup
product = products["PROD001"]
```

2. **Trie for product name search**:
```python
# User types "lap" → suggests "laptop", "lap desk", etc.
# Efficient prefix matching
```

3. **BST for price range queries**:
```python
# Find all products between $100-$500
# In-order traversal gives sorted results
```

4. **Graph for recommendations**:
```python
# Users who bought X also bought Y
# Find related products via graph traversal
```

### Social Media Feed

**Challenge**: Show relevant posts from thousands of connections.

**Data structures applied**:

1. **Priority queue (heap) for feed ranking**:
```python
# Posts ranked by engagement score
# Always show top posts first
# O(log n) to add new post
```

2. **Hash map for user data**:
```python
users = {
    "user123": {
        "name": "Alice",
        "friends": [...],
        "posts": [...]
    }
}
```

3. **Graph for social connections**:
```python
# Find friends of friends
# Suggest new connections
# Calculate degrees of separation
```

4. **LRU cache for recent posts**:
```python
# Keep most recently viewed posts in memory
# Evict least recently used when full
```

### Navigation App

**Challenge**: Find fastest route between two points.

**Data structures applied**:

1. **Graph for road network**:
```python
# Cities as vertices
# Roads as edges with weight (distance/time)
```

2. **Priority queue for Dijkstra's algorithm**:
```python
# Always explore shortest known path first
# Find optimal route efficiently
```

3. **Hash map for location lookup**:
```python
locations = {
    "123 Main St": (47.6062, -122.3321),  # (lat, lon)
    # ...
}
```

4. **Spatial index (quadtree) for nearby places**:
```python
# Find all restaurants within 1 mile
# Efficient geographical queries
```

## Common Pitfalls

### Pitfall 1: Using Wrong Data Structure

**Problem**: Using a list when you need fast lookups.

```python
# Bad: O(n) lookup for each check
def has_duplicates_bad(arr):
    seen = []  # List!
    for item in arr:
        if item in seen:  # O(n) operation
            return True
        seen.append(item)
    return False

# Good: O(1) lookup
def has_duplicates_good(arr):
    seen = set()  # Set!
    for item in arr:
        if item in seen:  # O(1) operation
            return True
        seen.add(item)
    return False

# For 10,000 items:
# Bad: ~5 seconds
# Good: ~0.001 seconds
```

### Pitfall 2: Not Considering Space Complexity

**Problem**: Creating unnecessary copies of data.

```python
# Bad: O(n²) space
def flatten_bad(matrix):
    result = []
    for row in matrix:
        result.append(row.copy())  # Unnecessary copy!
    return result

# Good: O(n) space
def flatten_good(matrix):
    result = []
    for row in matrix:
        for item in row:
            result.append(item)
    return result
```

### Pitfall 3: Ignoring Edge Cases

**Problem**: Code breaks on empty inputs, single elements, etc.

```python
# Bad: Crashes on empty array
def find_max_bad(arr):
    max_val = arr[0]  # IndexError if arr is empty!
    for val in arr[1:]:
        if val > max_val:
            max_val = val
    return max_val

# Good: Handles edge cases
def find_max_good(arr):
    if not arr:
        return None  # Or raise ValueError

    max_val = arr[0]
    for val in arr[1:]:
        if val > max_val:
            max_val = val
    return max_val
```

### Pitfall 4: Modifying Structure During Iteration

**Problem**: Changing a collection while looping through it.

```python
# Bad: Unpredictable behavior
def remove_evens_bad(arr):
    for num in arr:
        if num % 2 == 0:
            arr.remove(num)  # Modifying during iteration!
    return arr

# Good: Create new list or iterate over copy
def remove_evens_good(arr):
    return [num for num in arr if num % 2 != 0]

# Or modify a copy:
def remove_evens_inplace(arr):
    for num in arr[:]:  # Iterate over copy
        if num % 2 == 0:
            arr.remove(num)
    return arr
```

### Pitfall 5: Not Handling Null/None

**Problem**: Null pointer exceptions.

```python
# Bad: Crashes if node is None
def tree_height_bad(node):
    return 1 + max(
        tree_height_bad(node.left),
        tree_height_bad(node.right)
    )  # AttributeError if node is None!

# Good: Check for None
def tree_height_good(node):
    if node is None:
        return 0
    return 1 + max(
        tree_height_good(node.left),
        tree_height_good(node.right)
    )
```

### Pitfall 6: Inefficient String Concatenation

**Problem**: String concatenation in loop is O(n²).

```python
# Bad: O(n²) - creates new string each time
def join_bad(words):
    result = ""
    for word in words:
        result += word + " "  # New string created each time!
    return result.strip()

# Good: O(n) - join is optimized
def join_good(words):
    return " ".join(words)

# Or use list (mutable) then join:
def join_also_good(words):
    parts = []
    for word in words:
        parts.append(word)
    return " ".join(parts)
```

## Quick Reference

### Data Structure Comparison

| Data Structure | Access | Search | Insert | Delete | Space |
|---------------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash Map | O(1) | O(1) | O(1) | O(1) | O(n) |
| BST | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Heap | O(1)** | O(n) | O(log n) | O(log n) | O(n) |

*If you have reference to position
**Min/max only

### Algorithm Complexity Cheat Sheet

| Sorting Algorithm | Best | Average | Worst | Space | Stable |
|------------------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

### When to Use What

| Need | Use |
|------|-----|
| Fast random access | Array |
| Frequent insertions at beginning | Linked List |
| Last-in-first-out | Stack |
| First-in-first-out | Queue |
| Fast key-value lookup | Hash Map |
| Sorted data | BST |
| Always get min/max | Heap |
| Relationships/connections | Graph |
| Hierarchical data | Tree |

## Related Topics

### In This Section (Foundations)
- **[How Computers Work](../how-computers-work/README.md)**: Understand how computers execute algorithms and store data structures in memory
- **[How Internet Works](../how-internet-works/README.md)**: See how data structures enable efficient network protocols

### Next Steps
- **[Programming Concepts](../../01-programming/programming-concepts/README.md)**: Apply data structures in real code
- **[Design Patterns](../../01-programming/design-patterns/README.md)**: Use data structures to implement common patterns
- **[System Architecture](../../02-architectures/README.md)**: Scale data structures to distributed systems

### Advanced Topics
- **[Backend Development](../../05-backend/README.md)**: Use data structures for APIs and databases
- **[Databases](../../05-backend/databases/README.md)**: Understand how databases use trees and hash maps internally

## Summary

Data structures and algorithms are the foundation of efficient programming:

- **Big O notation** measures efficiency as input grows
- **Arrays** provide fast random access
- **Linked lists** allow efficient insertions
- **Stacks** implement LIFO (undo, function calls)
- **Queues** implement FIFO (task processing, BFS)
- **Hash maps** provide O(1) lookup by key
- **Trees** organize hierarchical data
- **Graphs** represent relationships and networks

Choose the right data structure for your needs:
- Need fast lookup? Hash map
- Need sorted data? BST
- Need order of operations? Stack or Queue
- Need relationships? Graph

Understanding these fundamentals helps you:
- Write faster code
- Pass technical interviews
- Design scalable systems
- Debug performance issues

Practice is key - implement these structures, solve problems, and analyze complexity. The more you use them, the more natural they become.

---

**Last Updated**: 2026-02-19
**Complexity**: Intermediate
**Prerequisites**: Basic programming knowledge
**Time to Learn**: 4-5 hours
**Next**: [How Computers Work](../how-computers-work/README.md)
