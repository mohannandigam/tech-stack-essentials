# How Computers Work

## What Is a Computer?

A computer is a programmable electronic device that accepts input, processes data according to stored instructions, stores information, and produces output. At its core, a computer takes data, manipulates it through billions of simple operations per second, and gives you results.

Every computer, whether it's a smartphone, laptop, server, or smartwatch, operates on the same fundamental principles: fetch instructions, decode them, execute them, and store results. The differences between devices are mainly about speed, size, and specialization, but the underlying architecture remains remarkably consistent.

## Simple Analogy

Think of a computer like a highly organized office:

- **CPU (Central Processing Unit)**: The workers who do the actual work. They follow instructions from documents and perform calculations.
- **RAM (Random Access Memory)**: The desk where workers keep documents they're currently using. Fast access, but everything disappears when you leave (power off).
- **Storage (Hard Drive/SSD)**: The filing cabinets where documents are stored long-term. Slower to access than the desk, but nothing gets lost when you leave.
- **Operating System**: The office manager who assigns tasks, manages resources, and ensures everyone can work without interfering with each other.
- **Programs**: The instruction manuals that tell workers what to do.
- **Cache**: A small shelf right next to your desk for the most frequently used documents.

## Why Does This Matter?

Understanding how computers work helps you:

- **Write efficient code**: Know why some operations are fast and others slow
- **Debug performance issues**: Identify whether problems are CPU, memory, or I/O related
- **Make architectural decisions**: Choose appropriate hardware for your applications
- **Optimize applications**: Understand memory management, caching, and parallelism
- **Communicate with teams**: Speak the same language as systems engineers and DevOps
- **Troubleshoot issues**: Diagnose when systems slow down or crash

When you understand that reading from RAM is 100,000x faster than reading from disk, you understand why caching matters. When you know CPUs have multiple cores, you understand why parallel programming exists. This foundational knowledge makes you a better engineer.

## The Central Processing Unit (CPU)

### What Is the CPU?

The CPU is the "brain" of the computer that executes program instructions. It performs arithmetic, logic, control, and input/output operations specified by instructions.

```
CPU Architecture:

┌─────────────────────────────────────────────┐
│              CPU (Die)                      │
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │   Core 0     │      │   Core 1     │   │
│  │              │      │              │   │
│  │  ┌────────┐  │      │  ┌────────┐  │   │
│  │  │  ALU   │  │      │  │  ALU   │  │   │
│  │  │Control │  │      │  │Control │  │   │
│  │  │Registers│ │      │  │Registers│ │   │
│  │  └────────┘  │      │  └────────┘  │   │
│  │              │      │              │   │
│  │  ┌────────┐  │      │  ┌────────┐  │   │
│  │  │ L1     │  │      │  │ L1     │  │   │
│  │  │ Cache  │  │      │  │ Cache  │  │   │
│  │  └────────┘  │      │  └────────┘  │   │
│  └──────────────┘      └──────────────┘   │
│                                             │
│           ┌─────────────────┐              │
│           │   L2 Cache      │              │
│           └─────────────────┘              │
│                                             │
│           ┌─────────────────┐              │
│           │   L3 Cache      │              │
│           │  (Shared)       │              │
│           └─────────────────┘              │
└─────────────────────────────────────────────┘
```

### How the CPU Works: The Fetch-Decode-Execute Cycle

Every CPU continuously performs this cycle billions of times per second:

```
1. FETCH
   - CPU retrieves next instruction from memory
   - Instruction stored at memory address in Program Counter
   - Instruction loaded into Instruction Register

2. DECODE
   - CPU determines what the instruction means
   - Identifies which operation to perform
   - Identifies which data to use

3. EXECUTE
   - CPU performs the operation
   - Uses ALU (Arithmetic Logic Unit) for calculations
   - Stores result in register or memory

4. STORE
   - Write results back to memory or registers
   - Update Program Counter to next instruction
   - Repeat cycle

Example cycle:
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  FETCH  │ ──> │ DECODE  │ ──> │ EXECUTE │ ──> │  STORE  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     ^                                                │
     └────────────────────────────────────────────────┘
```

### Example: Adding Two Numbers

```python
# Python code
result = 5 + 3

# What the CPU does (simplified):
# 1. FETCH: Load instruction "ADD 5, 3"
# 2. DECODE: This is an addition operation
# 3. EXECUTE:
#    - Load value 5 into Register A
#    - Load value 3 into Register B
#    - ALU adds Register A + Register B
#    - Result (8) stored in Register C
# 4. STORE: Write Register C to memory location for 'result'
```

### CPU Components

#### 1. Arithmetic Logic Unit (ALU)

```
The ALU performs mathematical and logical operations:

┌─────────────────────┐
│        ALU          │
│                     │
│  Arithmetic:        │
│  - Addition         │
│  - Subtraction      │
│  - Multiplication   │
│  - Division         │
│                     │
│  Logic:             │
│  - AND, OR, NOT     │
│  - XOR, NAND        │
│  - Comparisons      │
│    (>, <, ==)       │
│                     │
│  Bit operations:    │
│  - Shift left/right │
│  - Rotate           │
└─────────────────────┘
```

#### 2. Registers

Registers are the fastest storage in a computer - tiny memory locations inside the CPU itself.

```python
# Common register types:

# Program Counter (PC)
# - Holds address of next instruction
# - Automatically incremented after each instruction

# Instruction Register (IR)
# - Holds current instruction being executed

# Accumulator
# - Stores intermediate arithmetic results

# General Purpose Registers
# - Temporary storage for calculations
# - Modern CPUs have 16-32 general purpose registers
# - Examples: RAX, RBX, RCX (x86-64 architecture)

# Status Register
# - Flags indicating results of operations
# - Zero flag, Carry flag, Overflow flag, etc.
```

#### 3. Cache Memory

Cache is ultra-fast memory built into the CPU to reduce the time to access data from main memory.

```
Cache Hierarchy:

Level | Size | Speed | Location
------|------|-------|----------
L1    | 32KB | Fastest (1-2 cycles) | On each core
L2    | 256KB| Very fast (10 cycles) | On each core
L3    | 8MB  | Fast (40 cycles) | Shared across cores
RAM   | 16GB | Slow (100+ cycles) | Separate chip
SSD   | 512GB| Very slow (100,000+ cycles) | Storage device

Cache Hit Rate:
- L1: 95% of requests
- L2: 4% of requests
- L3: 0.9% of requests
- RAM: 0.1% of requests (cache miss)
```

**Why caching matters**:

```python
# Without cache awareness
def sum_matrix_bad(matrix):
    """Sum matrix by columns (cache-unfriendly)."""
    total = 0
    rows = len(matrix)
    cols = len(matrix[0])

    # Accessing by column jumps around in memory
    for col in range(cols):
        for row in range(rows):
            total += matrix[row][col]  # Cache miss!

    return total

# With cache awareness
def sum_matrix_good(matrix):
    """Sum matrix by rows (cache-friendly)."""
    total = 0

    # Accessing by row uses sequential memory
    for row in matrix:
        for value in row:
            total += value  # Cache hit!

    return total

# For a 1000x1000 matrix:
# Bad: ~500ms (cache misses)
# Good: ~50ms (cache hits)
```

### CPU Cores and Threads

Modern CPUs have multiple cores, allowing them to execute multiple instructions simultaneously.

```
Single Core CPU:        Multi-Core CPU:
┌─────────┐            ┌─────────┬─────────┬─────────┬─────────┐
│ Core 0  │            │ Core 0  │ Core 1  │ Core 2  │ Core 3  │
│         │            │         │         │         │         │
│ Task A  │            │ Task A  │ Task B  │ Task C  │ Task D  │
│  ↓      │            │  ↓      │  ↓      │  ↓      │  ↓      │
│ Task B  │            │ (all    │ (run    │ (run    │ (run    │
│  ↓      │            │ running │ at the  │ at the  │ at the  │
│ Task C  │            │ simul-  │ same    │ same    │ same    │
│  ↓      │            │ tane-   │ time)   │ time)   │ time)   │
│ Task D  │            │ ously)  │         │         │         │
└─────────┘            └─────────┴─────────┴─────────┴─────────┘

Sequential              Parallel
(takes 4x time)         (takes 1x time)
```

**Hyper-Threading / Simultaneous Multithreading (SMT)**:

Each physical core can run 2 threads simultaneously, appearing as 2 logical cores to the OS.

```
Physical Core with Hyper-Threading:

┌───────────────────────────┐
│     Physical Core 0       │
│                           │
│  ┌──────────────────┐     │
│  │ Logical Core 0A  │     │  } Share execution units
│  │ (Thread 1)       │     │  } but have separate
│  └──────────────────┘     │  } registers
│                           │
│  ┌──────────────────┐     │
│  │ Logical Core 0B  │     │
│  │ (Thread 2)       │     │
│  └──────────────────┘     │
│                           │
│  Shared: ALU, Cache       │
└───────────────────────────┘

Example:
4 physical cores + Hyper-Threading = 8 logical cores
```

### CPU Performance Factors

#### Clock Speed (GHz)

```
1 GHz = 1 billion cycles per second

Modern CPUs:
- Base clock: 2.5-3.5 GHz
- Boost clock: 4.0-5.0 GHz (when needed)
- Throttles down when idle to save power

Example:
3.0 GHz CPU = 3,000,000,000 cycles per second
            = 3 billion opportunities to execute instructions per second
```

#### Instructions Per Cycle (IPC)

Modern CPUs can execute multiple instructions per cycle through pipelining and superscalar execution.

```
Simple Pipeline (5 stages):

Cycle:  1    2    3    4    5    6    7    8    9
        ┌────┬────┬────┬────┬────┐
Inst 1: │ F  │ D  │ E  │ M  │ W  │
        └────┴────┴────┴────┴────┘
             ┌────┬────┬────┬────┬────┐
Inst 2:      │ F  │ D  │ E  │ M  │ W  │
             └────┴────┴────┴────┴────┘
                  ┌────┬────┬────┬────┬────┐
Inst 3:           │ F  │ D  │ E  │ M  │ W  │
                  └────┴────┴────┴────┴────┘

F = Fetch, D = Decode, E = Execute, M = Memory, W = Write

Result: 3 instructions completed in 7 cycles (not 15)
Average: ~0.43 instructions per cycle
```

## Memory Hierarchy

### RAM (Random Access Memory)

RAM is the computer's short-term memory where data is stored while programs are running.

```
RAM Characteristics:
- Volatile: Data lost when power off
- Fast: ~100x faster than SSD
- Expensive: ~$5-10 per GB
- Limited: Typical 8-32 GB in consumer devices

RAM Structure:
┌─────────────────────────────┐
│     RAM Module (16GB)       │
│                             │
│  Address  │  Data           │
│  ────────────────────       │
│  0x0000   │  [data...]      │
│  0x0001   │  [data...]      │
│  0x0002   │  [data...]      │
│  ...      │  ...            │
│  0xFFFF   │  [data...]      │
│                             │
│  Each address = 1 byte      │
│  16GB = 16 billion bytes    │
└─────────────────────────────┘
```

### How Programs Use Memory

```python
# What happens in memory when you run code:

def calculate_sum(numbers):
    total = 0  # Memory allocated for 'total'
    for num in numbers:  # Memory for loop variable
        total += num
    return total

# Memory layout:
#
# Stack (function calls and local variables):
# ┌─────────────────────────┐
# │ calculate_sum frame     │
# │  - total: 0 (4 bytes)   │
# │  - num: varies (4 bytes)│
# │  - return address       │
# └─────────────────────────┘
#
# Heap (dynamically allocated objects):
# ┌─────────────────────────┐
# │ numbers list object     │
# │  - size: 5              │
# │  - items: [1,2,3,4,5]   │
# └─────────────────────────┘
```

### Virtual Memory

Virtual memory allows programs to use more memory than physically available by using disk space as an extension of RAM.

```
Virtual Memory System:

Program sees:        OS manages:         Physical reality:
┌──────────┐        ┌──────────┐        ┌──────────┐
│ Virtual  │        │ Page     │        │   RAM    │
│ Address  │   ─>   │ Table    │   ─>   │   8GB    │
│ Space    │        │ Mapping  │        └──────────┘
│ 16GB     │        └──────────┘               │
└──────────┘              │                     │
                          │                     ▼
                          │              ┌──────────┐
                          └──────────>   │   Disk   │
                                        │  (Swap)  │
                                        │  500GB   │
                                        └──────────┘

Page Table Entry:
Virtual Page → Physical Page (in RAM or Disk)
If in RAM: Fast access
If on Disk: Page fault → Load page → Slow!
```

**Page Fault Example**:

```python
import time

def demonstrate_page_fault():
    """
    Access pattern that causes page faults.

    When memory is tight, OS swaps unused pages to disk.
    Accessing them causes page faults (very slow).
    """
    # Create large array (may exceed RAM)
    large_array = [0] * (1024 * 1024 * 1024)  # 1 billion integers

    # Sequential access (cache-friendly, no page faults)
    start = time.time()
    for i in range(len(large_array)):
        large_array[i] = i
    sequential_time = time.time() - start

    # Random access (cache-unfriendly, may cause page faults)
    import random
    indices = random.sample(range(len(large_array)), 1000000)

    start = time.time()
    for i in indices:
        _ = large_array[i]
    random_time = time.time() - start

    print(f"Sequential: {sequential_time:.2f}s")
    print(f"Random: {random_time:.2f}s")
    # Random is much slower due to page faults and cache misses
```

### Storage (Persistent Memory)

Storage devices keep data permanently, even when power is off.

```
Storage Types:

┌─────────────────────────────────────────────────────┐
│                                                     │
│  HDD (Hard Disk Drive)                             │
│  - Mechanical spinning disk                        │
│  - Speed: 80-160 MB/s                              │
│  - Latency: 5-10ms                                 │
│  - Capacity: 1-10 TB                               │
│  - Cost: $0.02 per GB                              │
│  - Lifespan: 3-5 years                             │
│                                                     │
│  ┌──────────────┐                                  │
│  │   ╱╲         │ Spinning platter                 │
│  │  ╱──╲        │ Read/write head                  │
│  │ ╱────╲       │ (mechanical - slow!)             │
│  └──────────────┘                                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SSD (Solid State Drive)                           │
│  - Electronic memory (NAND flash)                  │
│  - Speed: 500-3,500 MB/s                           │
│  - Latency: 0.1ms                                  │
│  - Capacity: 128GB-4TB                             │
│  - Cost: $0.10 per GB                              │
│  - Lifespan: 5-10 years                            │
│                                                     │
│  ┌────────────────────┐                            │
│  │  ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪  │ Memory chips               │
│  │  ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪  │ (no moving parts!)         │
│  └────────────────────┘                            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  NVMe SSD (M.2)                                    │
│  - Direct PCIe connection                          │
│  - Speed: 3,000-7,000 MB/s                         │
│  - Latency: 0.025ms                                │
│  - Capacity: 256GB-2TB                             │
│  - Cost: $0.15 per GB                              │
│  - Lifespan: 5-10 years                            │
│                                                     │
└─────────────────────────────────────────────────────┘

Speed Comparison (reading 1GB file):
- HDD: ~8 seconds
- SATA SSD: ~2 seconds
- NVMe SSD: ~0.3 seconds
- RAM: ~0.01 seconds
```

## Operating System (OS)

### What Is an Operating System?

The OS is software that manages computer hardware and software resources and provides services for programs.

```
OS as a Bridge:

Applications (user space)
┌────────┬────────┬────────┬────────┐
│ Chrome │ VSCode │ Spotify│  Game  │
└────────┴────────┴────────┴────────┘
            ↕
    System Calls (API)
            ↕
┌─────────────────────────────────────┐
│      Operating System (kernel)      │
│                                     │
│  - Process Management               │
│  - Memory Management                │
│  - File System                      │
│  - Device Drivers                   │
│  - Security                         │
└─────────────────────────────────────┘
            ↕
┌────────┬────────┬────────┬────────┐
│  CPU   │  RAM   │  Disk  │  GPU   │
└────────┴────────┴────────┴────────┘
Hardware
```

### Key OS Responsibilities

#### 1. Process Management

A **process** is a running program. The OS manages multiple processes simultaneously.

```
Process States:

┌─────────┐
│   NEW   │ Process is being created
└────┬────┘
     │
     ↓
┌─────────┐     ┌────────────┐
│  READY  │ <── │  WAITING   │ Waiting for I/O
└────┬────┘     └─────▲──────┘
     │                │
     │ Scheduler      │ I/O complete
     │ assigns CPU    │
     ↓                │
┌─────────┐           │
│ RUNNING │───────────┘ Blocks for I/O
└────┬────┘
     │
     ↓
┌─────────┐
│TERMINATED│ Process finished
└─────────┘
```

**Process Table Example**:

```
PID   | Name      | State   | CPU% | Memory  | Priority
------|-----------|---------|------|---------|----------
1     | systemd   | Running | 0.1% | 5 MB    | High
1234  | chrome    | Running | 15%  | 2 GB    | Normal
5678  | vscode    | Ready   | 5%   | 500 MB  | Normal
9012  | backup    | Waiting | 0%   | 100 MB  | Low
```

#### 2. CPU Scheduling

The OS decides which process runs on the CPU and for how long.

```
Round-Robin Scheduling (time slice = 10ms):

Time:  0ms   10ms  20ms  30ms  40ms  50ms  60ms
       ┌────┬────┬────┬────┬────┬────┐
CPU:   │ A  │ B  │ C  │ A  │ B  │ C  │
       └────┴────┴────┴────┴────┴────┘

Each process gets fair share of CPU time
```

**Common Scheduling Algorithms**:

```python
# Priority Scheduling
processes = [
    {'name': 'System', 'priority': 10},
    {'name': 'Browser', 'priority': 5},
    {'name': 'Background', 'priority': 1}
]

# OS runs highest priority first
# System → Browser → Background

# First-Come, First-Served (FCFS)
# Processes run in order they arrive
# Simple but can cause "convoy effect" (long process blocks short ones)

# Shortest Job First (SJF)
# Run process with shortest expected runtime first
# Minimizes average wait time

# Round Robin
# Each process gets fixed time slice
# Fair but may have overhead from context switching
```

#### 3. Memory Management

The OS allocates memory to processes and ensures they don't interfere with each other.

```
Memory Protection:

Process A memory space:        Process B memory space:
┌────────────────────┐        ┌────────────────────┐
│ 0x1000 - 0x2000   │        │ 0x3000 - 0x4000   │
│                    │        │                    │
│ ✓ Can access       │        │ ✗ Cannot access   │
│ ✓ Can modify       │        │   Process A's     │
│                    │        │   memory          │
└────────────────────┘        └────────────────────┘

OS enforces boundaries
Prevents one process from corrupting another
```

**Memory Allocation**:

```python
# Python example showing memory concepts

def demonstrate_memory():
    """
    Show how OS manages memory for program.

    Memory regions:
    - Stack: Local variables, function calls
    - Heap: Dynamic allocations (lists, objects)
    - Data: Global/static variables
    - Code: Program instructions
    """

    # Stack allocation (automatic)
    x = 10  # Allocated on stack
    y = 20  # Stack grows

    # When function returns, stack memory freed automatically

    # Heap allocation (manual via language runtime)
    large_list = [0] * 1000000  # Allocated on heap

    # OS manages:
    # - Allocating pages of memory
    # - Tracking which pages belong to this process
    # - Reclaiming memory when process ends

    import sys
    print(f"Size of list: {sys.getsizeof(large_list)} bytes")

    # Python's garbage collector will free heap memory
    # when no longer referenced
```

### Threads vs Processes

```
Process:                        Thread:
┌─────────────────────────┐    ┌────────────────┐
│ Process 1               │    │ Thread 1       │
│                         │    │ - Own stack    │
│ ┌───────────────────┐   │    │ - Own registers│
│ │ Memory Space      │   │    └────────────────┘
│ │ (Isolated)        │   │    ┌────────────────┐
│ │                   │   │    │ Thread 2       │
│ │ ┌──────┐ ┌──────┐│   │    │ - Own stack    │
│ │ │Thread│ │Thread││   │    │ - Own registers│
│ │ │  1   │ │  2   ││   │    └────────────────┘
│ │ └──────┘ └──────┘│   │          │
│ │                   │   │          │
│ │ Shared Memory:    │   │    Shared:
│ │ - Heap            │   │    - Memory
│ │ - Code            │   │    - File handles
│ │ - File handles    │   │    - Resources
│ └───────────────────┘   │
└─────────────────────────┘

Processes:                    Threads:
- Heavy (more memory)         - Lightweight
- Isolated (safe)             - Shared memory (careful!)
- Slow to create/switch       - Fast to create/switch
- Communication: IPC          - Communication: shared memory
```

**Example: Threads vs Processes**:

```python
import threading
import multiprocessing
import time

# Using Threads (shared memory)
def worker_thread(data):
    """Thread can modify shared data."""
    data.append(threading.current_thread().name)

shared_list = []
threads = []
for i in range(5):
    t = threading.Thread(target=worker_thread, args=(shared_list,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(f"Threads shared data: {shared_list}")
# Output: All threads added to same list

# Using Processes (isolated memory)
def worker_process(data):
    """Process has its own copy of data."""
    data.append(multiprocessing.current_process().name)
    print(f"Process sees: {data}")

shared_list = []
processes = []
for i in range(5):
    p = multiprocessing.Process(target=worker_process, args=(shared_list,))
    processes.append(p)
    p.start()

for p in processes:
    p.join()

print(f"Processes didn't modify original: {shared_list}")
# Output: Original list still empty (each process had copy)
```

### Context Switching

When the OS switches from one process/thread to another:

```
Context Switch Steps:

1. Save current process state:
   ┌─────────────────────────┐
   │ Process A               │
   │ - Program counter: 0x42 │
   │ - Registers: [saved]    │
   │ - Stack pointer: 0x100  │
   └─────────────────────────┘
            ↓
   [Saved to Process Control Block]

2. Load next process state:
   [Load from Process Control Block]
            ↓
   ┌─────────────────────────┐
   │ Process B               │
   │ - Program counter: 0x89 │
   │ - Registers: [loaded]   │
   │ - Stack pointer: 0x200  │
   └─────────────────────────┘

3. Resume execution

Cost: ~1-10 microseconds
But happens millions of times per day!
```

## How Programs Execute

### From Code to Execution

```
Source Code → Compilation/Interpretation → Execution

1. Source Code (what you write):
   ┌─────────────────────┐
   │ def add(a, b):      │
   │     return a + b    │
   │                     │
   │ result = add(5, 3)  │
   └─────────────────────┘

2. Compilation (C/C++/Go/Rust):
   ┌─────────────────────┐
   │ Compiler            │
   │ ┌─────────────────┐ │
   │ │ Lexer           │ │ Tokenize
   │ │ Parser          │ │ Build syntax tree
   │ │ Optimizer       │ │ Improve efficiency
   │ │ Code Generator  │ │ Create machine code
   │ └─────────────────┘ │
   └─────────────────────┘
            ↓
   Machine Code (binary)
   ┌─────────────────────┐
   │ 10110011 00101111  │
   │ 01010101 11001100  │
   └─────────────────────┘

3. Execution:
   CPU directly executes machine code

OR

2. Interpretation (Python/JavaScript/Ruby):
   ┌─────────────────────┐
   │ Interpreter         │
   │ - Reads one line    │
   │ - Converts to       │
   │   instructions      │
   │ - Executes          │
   │ - Repeat            │
   └─────────────────────┘

OR

2. Hybrid (Java/C#):
   ┌─────────────────────┐
   │ Compile to bytecode │
   └──────────┬──────────┘
              ↓
   ┌─────────────────────┐
   │ Virtual Machine     │
   │ (JVM/.NET)          │
   │ - JIT compilation   │
   │ - Executes          │
   └─────────────────────┘
```

### Execution Example: Simple Program

```python
# Python code
x = 10
y = 20
z = x + y
print(z)

# What the computer does:

# 1. Load interpreter into memory
#    - Python interpreter is a program itself
#    - OS loads it, allocates memory

# 2. Parse source code
#    - Read each line
#    - Build internal representation

# 3. Execute instructions:
#
#    x = 10
#    ┌──────────────────────────────────┐
#    │ 1. Allocate memory for variable  │
#    │ 2. Store value 10 at that address│
#    │ 3. Associate name 'x' with address│
#    └──────────────────────────────────┘
#
#    y = 20
#    [Same process]
#
#    z = x + y
#    ┌──────────────────────────────────┐
#    │ 1. Load value from 'x' address   │
#    │    → Load into CPU register: 10  │
#    │ 2. Load value from 'y' address   │
#    │    → Load into CPU register: 20  │
#    │ 3. ALU adds registers: 10 + 20   │
#    │    → Result: 30                  │
#    │ 4. Allocate memory for 'z'       │
#    │ 5. Store 30 at that address      │
#    └──────────────────────────────────┘
#
#    print(z)
#    ┌──────────────────────────────────┐
#    │ 1. Load value from 'z': 30       │
#    │ 2. Convert to string: "30"       │
#    │ 3. System call: write to stdout  │
#    │ 4. OS handles I/O to terminal    │
#    └──────────────────────────────────┘
```

## Performance Concepts

### CPU-Bound vs I/O-Bound

```
CPU-Bound Task (compute heavy):
┌─────────────────────────────────┐
│ CPU: ████████████████████ 95%  │ Waiting on calculations
│ I/O: █░░░░░░░░░░░░░░░░  5%     │
└─────────────────────────────────┘
Example: Video encoding, scientific calculations

I/O-Bound Task (waiting for data):
┌─────────────────────────────────┐
│ CPU: ██░░░░░░░░░░░░░░░░ 10%    │ Waiting on network/disk
│ I/O: ████████████████████ 90%  │
└─────────────────────────────────┘
Example: Database queries, API calls, file operations
```

**Optimization strategies**:

```python
# CPU-Bound: Use multiprocessing
import multiprocessing

def calculate_intensive(data):
    """CPU-heavy calculation."""
    result = 0
    for item in data:
        result += item ** 2  # Expensive operation
    return result

# Split work across CPU cores
if __name__ == '__main__':
    data = range(1000000)
    chunk_size = len(data) // multiprocessing.cpu_count()

    with multiprocessing.Pool() as pool:
        chunks = [data[i:i+chunk_size]
                  for i in range(0, len(data), chunk_size)]
        results = pool.map(calculate_intensive, chunks)

# I/O-Bound: Use async/await
import asyncio
import aiohttp

async def fetch_data(url):
    """I/O-heavy operation."""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    # All requests run concurrently (while waiting for I/O)
    urls = ['http://api1.com', 'http://api2.com', 'http://api3.com']
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks)

# Result:
# Multiprocessing: 4x speedup on 4-core CPU (CPU-bound)
# Async: 10x+ speedup (I/O-bound, limited by network)
```

### Caching and Locality

**Principle of Locality**: Programs tend to reuse data and instructions they've recently used.

```
Temporal Locality:
If data is accessed once, it's likely to be accessed again soon
Example: Loop counter variable

Spatial Locality:
If data is accessed, nearby data is likely to be accessed soon
Example: Array elements
```

**Cache-Friendly Code**:

```python
import numpy as np
import time

# Cache-unfriendly (column-major access)
def sum_columns_bad(matrix):
    """Access pattern jumps around in memory."""
    total = 0
    rows, cols = matrix.shape

    for col in range(cols):
        for row in range(rows):
            total += matrix[row, col]  # Jumping between rows

    return total

# Cache-friendly (row-major access)
def sum_columns_good(matrix):
    """Access pattern follows memory layout."""
    total = 0
    rows, cols = matrix.shape

    for row in range(rows):
        for col in range(cols):
            total += matrix[row, col]  # Sequential access

    return total

# Benchmark
matrix = np.random.rand(5000, 5000)

start = time.time()
sum_columns_bad(matrix)
bad_time = time.time() - start

start = time.time()
sum_columns_good(matrix)
good_time = time.time() - start

print(f"Cache-unfriendly: {bad_time:.2f}s")
print(f"Cache-friendly: {good_time:.2f}s")
# Cache-friendly is 3-10x faster!
```

## Best Practices

### Safety

**Resource Limits**:

```python
import resource
import sys

def limit_memory(max_mb):
    """
    Limit program memory usage.

    Why:
    - Prevent out-of-memory crashes
    - Ensure fair resource sharing
    - Detect memory leaks early
    """
    max_bytes = max_mb * 1024 * 1024

    resource.setrlimit(
        resource.RLIMIT_AS,
        (max_bytes, max_bytes)
    )

    print(f"Memory limited to {max_mb} MB")

def limit_cpu_time(max_seconds):
    """
    Limit CPU time for process.

    Why:
    - Prevent infinite loops
    - Enforce timeout policies
    - Protect against runaway processes
    """
    resource.setrlimit(
        resource.RLIMIT_CPU,
        (max_seconds, max_seconds)
    )

    print(f"CPU time limited to {max_seconds} seconds")

# Usage
try:
    limit_memory(512)  # 512 MB limit
    limit_cpu_time(60)  # 60 second limit

    # Your code here

except MemoryError:
    print("Memory limit exceeded")
except Exception as e:
    print(f"CPU time limit exceeded: {e}")
```

**Thread Safety**:

```python
import threading

class Counter:
    """Thread-safe counter."""

    def __init__(self):
        self.value = 0
        self.lock = threading.Lock()

    def increment(self):
        """
        Safely increment counter.

        Why locking:
        Without lock, two threads could:
        1. Both read value = 0
        2. Both compute new value = 1
        3. Both write value = 1
        Result: Lost one increment!

        With lock:
        1. Thread A acquires lock
        2. Thread A reads, increments, writes
        3. Thread A releases lock
        4. Thread B acquires lock
        5. Thread B reads, increments, writes
        6. Thread B releases lock
        Result: Correct count
        """
        with self.lock:
            # Only one thread executes this at a time
            self.value += 1

    def get_value(self):
        """Safely read value."""
        with self.lock:
            return self.value

# Without lock (unsafe)
class UnsafeCounter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1  # Not atomic! Race condition!

# Demo
def test_counter(counter, name):
    """Increment counter 10000 times."""
    for _ in range(10000):
        counter.increment()

# Safe counter
safe = Counter()
threads = [threading.Thread(target=test_counter, args=(safe, 'safe'))
           for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Safe counter: {safe.get_value()}")  # Always 100000

# Unsafe counter
unsafe = UnsafeCounter()
threads = [threading.Thread(target=test_counter, args=(unsafe, 'unsafe'))
           for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Unsafe counter: {unsafe.value}")  # Often < 100000 (race condition)
```

### Quality

**Monitor Resource Usage**:

```python
import psutil
import logging

logger = logging.getLogger(__name__)

def monitor_resources():
    """
    Track system resource usage.

    Best practice:
    - Log periodically
    - Alert on thresholds
    - Help diagnose performance issues
    """
    # CPU usage
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()

    # Memory usage
    memory = psutil.virtual_memory()
    memory_used_gb = memory.used / (1024 ** 3)
    memory_total_gb = memory.total / (1024 ** 3)
    memory_percent = memory.percent

    # Disk usage
    disk = psutil.disk_usage('/')
    disk_used_gb = disk.used / (1024 ** 3)
    disk_total_gb = disk.total / (1024 ** 3)
    disk_percent = disk.percent

    # Log metrics
    logger.info(
        "Resource usage",
        extra={
            'cpu_percent': cpu_percent,
            'cpu_cores': cpu_count,
            'memory_used_gb': memory_used_gb,
            'memory_total_gb': memory_total_gb,
            'memory_percent': memory_percent,
            'disk_used_gb': disk_used_gb,
            'disk_total_gb': disk_total_gb,
            'disk_percent': disk_percent
        }
    )

    # Alert on high usage
    if cpu_percent > 80:
        logger.warning(f"High CPU usage: {cpu_percent}%")

    if memory_percent > 85:
        logger.warning(f"High memory usage: {memory_percent}%")

    if disk_percent > 90:
        logger.error(f"Critical disk usage: {disk_percent}%")

# Run periodically
import time
while True:
    monitor_resources()
    time.sleep(60)  # Every minute
```

**Optimize for Target Architecture**:

```python
import platform
import multiprocessing

def get_optimal_config():
    """
    Determine optimal configuration for this system.

    Why:
    - Different CPUs have different capabilities
    - RAM varies across systems
    - Optimize based on available resources
    """
    config = {
        'platform': platform.system(),
        'cpu_cores': multiprocessing.cpu_count(),
        'ram_gb': psutil.virtual_memory().total / (1024 ** 3),
    }

    # Determine optimal worker count
    if config['cpu_cores'] <= 2:
        config['workers'] = 2
    elif config['cpu_cores'] <= 8:
        config['workers'] = config['cpu_cores'] - 1
    else:
        config['workers'] = config['cpu_cores'] - 2  # Leave cores for OS

    # Determine optimal batch size based on RAM
    if config['ram_gb'] < 4:
        config['batch_size'] = 100
    elif config['ram_gb'] < 16:
        config['batch_size'] = 1000
    else:
        config['batch_size'] = 10000

    logger.info(f"Optimal configuration: {config}")
    return config

# Usage
config = get_optimal_config()
pool = multiprocessing.Pool(processes=config['workers'])
```

### Logging

**Log System Events**:

```python
import logging
import time

logger = logging.getLogger(__name__)

def process_data_with_logging(data):
    """
    Process data with comprehensive logging.

    Logs:
    - Start/end times
    - Resource usage
    - Errors and warnings
    - Performance metrics
    """
    start_time = time.time()
    start_memory = psutil.Process().memory_info().rss / (1024 ** 2)

    logger.info(
        f"Starting data processing",
        extra={
            'data_size': len(data),
            'start_memory_mb': start_memory
        }
    )

    try:
        # Process data
        result = []
        for i, item in enumerate(data):
            if i % 1000 == 0:
                # Log progress
                logger.debug(f"Processed {i}/{len(data)} items")

            result.append(process_item(item))

        # Success
        end_time = time.time()
        end_memory = psutil.Process().memory_info().rss / (1024 ** 2)
        duration = end_time - start_time
        memory_delta = end_memory - start_memory

        logger.info(
            f"Data processing completed",
            extra={
                'duration_seconds': duration,
                'items_processed': len(data),
                'items_per_second': len(data) / duration,
                'memory_delta_mb': memory_delta,
                'final_memory_mb': end_memory
            }
        )

        # Alert if slow
        if duration > 60:
            logger.warning(f"Slow processing: {duration:.1f}s for {len(data)} items")

        # Alert if memory leak suspected
        if memory_delta > 1000:  # 1 GB increase
            logger.warning(f"Large memory increase: {memory_delta:.1f} MB")

        return result

    except Exception as e:
        logger.error(
            f"Data processing failed: {e}",
            extra={
                'error_type': type(e).__name__,
                'items_processed_before_error': i if 'i' in locals() else 0
            },
            exc_info=True
        )
        raise
```

## Use Cases

### Web Server

**Challenge**: Handle thousands of simultaneous connections.

**How computers handle this**:

```python
import asyncio
import logging

logger = logging.getLogger(__name__)

async def handle_request(request_id, client_address):
    """
    Handle a single web request.

    Uses:
    - Async I/O: Don't block on network operations
    - Event loop: OS efficiently manages many connections
    - Memory: Each connection uses ~4KB

    OS level:
    - epoll/kqueue: Efficient I/O multiplexing
    - Non-blocking sockets: Return immediately if no data
    - Kernel handles actual I/O asynchronously
    """
    logger.info(
        f"Request {request_id} started",
        extra={'client': client_address}
    )

    # Simulate database query (I/O-bound)
    await asyncio.sleep(0.1)  # OS gives CPU to other tasks

    # Simulate processing (CPU-bound, but brief)
    result = process_request()

    logger.info(f"Request {request_id} completed")
    return result

async def web_server():
    """
    Handle 10,000 concurrent connections.

    With threads: 10,000 threads × 8MB stack = 80GB RAM (impossible!)
    With async: 10,000 connections × 4KB = 40MB RAM (easy!)

    OS provides:
    - Single thread handles all connections
    - Switches between them when waiting for I/O
    - Efficient use of CPU and memory
    """
    tasks = []
    for i in range(10000):
        task = asyncio.create_task(
            handle_request(i, f"client_{i}")
        )
        tasks.append(task)

    await asyncio.gather(*tasks)
    logger.info("All requests completed")

# Run server
asyncio.run(web_server())
```

### Video Game

**Challenge**: Render 60 frames per second while handling physics, AI, audio.

**How computers handle this**:

```python
import time

class GameEngine:
    """
    Game engine leveraging computer architecture.

    Uses:
    - Multi-core CPU: Parallel processing
    - GPU: Graphics rendering
    - Cache: Fast access to game state
    - RAM: Hold entire game world
    """

    def __init__(self):
        self.target_fps = 60
        self.frame_time = 1.0 / self.target_fps  # 16.67ms per frame
        self.game_state = {}

    def update_physics(self):
        """
        Physics calculations on CPU Core 1.

        CPU-intensive:
        - Collision detection
        - Rigid body dynamics
        - Particle systems
        """
        # Calculate object positions
        pass

    def update_ai(self):
        """
        AI decisions on CPU Core 2.

        CPU-intensive:
        - Pathfinding
        - Decision trees
        - Behavior logic
        """
        # Make NPC decisions
        pass

    def render_frame(self):
        """
        Graphics rendering on GPU.

        Highly parallel:
        - Transform vertices (millions)
        - Calculate lighting
        - Apply textures
        - Shader effects

        GPU has 1000+ cores for parallel work
        """
        # Send draw commands to GPU
        pass

    def play_audio(self):
        """
        Audio mixing on CPU Core 3.

        Real-time:
        - Mix multiple audio tracks
        - Apply effects
        - Output to sound card
        """
        pass

    def game_loop(self):
        """
        Main game loop targeting 60 FPS.

        CPU scheduler:
        - Distributes tasks across cores
        - Ensures frame time met
        - Throttles if too fast
        """
        while True:
            frame_start = time.time()

            # Update game (uses multiple CPU cores)
            self.update_physics()   # Core 1
            self.update_ai()        # Core 2
            self.play_audio()       # Core 3

            # Render (uses GPU)
            self.render_frame()     # GPU (1000+ cores)

            # Frame timing
            frame_time = time.time() - frame_start

            # If frame rendered too fast, wait
            if frame_time < self.frame_time:
                time.sleep(self.frame_time - frame_time)

            # If frame took too long, we're dropping frames
            if frame_time > self.frame_time:
                logger.warning(f"Frame drop: {frame_time*1000:.1f}ms")
```

### Machine Learning Training

**Challenge**: Train model on millions of examples efficiently.

**How computers handle this**:

```python
import numpy as np

def train_model_optimized():
    """
    ML training leveraging computer architecture.

    Uses:
    - GPU: Matrix operations (1000x faster than CPU)
    - RAM: Hold training data
    - Multi-core CPU: Data preprocessing
    - Cache: Frequently accessed model weights
    - NVMe SSD: Fast data loading
    """

    # Data loading (I/O-bound)
    # Use multiple processes to load data in parallel
    # while GPU is computing
    from concurrent.futures import ProcessPoolExecutor

    def load_batch(batch_id):
        # Load from SSD in parallel
        # Preprocess on CPU
        return batch_data

    with ProcessPoolExecutor() as executor:
        batches = executor.map(load_batch, range(1000))

    # Training loop
    for epoch in range(100):
        for batch in batches:
            # Move data from RAM to GPU memory
            gpu_batch = move_to_gpu(batch)

            # Forward pass (GPU)
            # GPU performs millions of multiplications in parallel
            predictions = model(gpu_batch)

            # Compute loss (GPU)
            loss = loss_function(predictions, labels)

            # Backward pass (GPU)
            # Calculate gradients using GPU parallel processing
            gradients = compute_gradients(loss)

            # Update weights (GPU)
            # Apply gradients to model parameters
            optimizer.step(gradients)

    # Result:
    # GPU: 100x faster than CPU for matrix math
    # Parallel data loading: Keep GPU busy
    # Efficient memory usage: Stream data, don't load all at once
```

### Database Server

**Challenge**: Handle concurrent queries while maintaining data integrity.

**How computers handle this**:

```python
import threading
import time

class DatabaseServer:
    """
    Database server leveraging OS and hardware.

    Uses:
    - Multiple threads: Handle concurrent connections
    - Locks: Ensure data consistency
    - Page cache: Keep frequently accessed data in RAM
    - Write-ahead log: Durability via sequential disk writes
    """

    def __init__(self):
        self.data = {}
        self.lock = threading.RLock()  # Reentrant lock
        self.cache = {}  # In-memory cache

    def execute_query(self, query):
        """
        Execute database query efficiently.

        OS provides:
        - Thread per connection
        - Scheduler distributes across CPU cores
        - Page cache keeps hot data in RAM
        - I/O scheduler optimizes disk access
        """

        if query['type'] == 'SELECT':
            # Read operations can run concurrently
            # Check cache first (RAM access: fast)
            cache_key = query['key']
            if cache_key in self.cache:
                logger.debug("Cache hit")
                return self.cache[cache_key]

            # Cache miss: Read from disk
            logger.debug("Cache miss, reading from disk")
            with self.lock:  # Shared lock for reads
                result = self.data.get(query['key'])

            # Update cache
            self.cache[cache_key] = result
            return result

        elif query['type'] == 'UPDATE':
            # Write operations need exclusive lock
            with self.lock:  # Exclusive lock for writes
                # Write-ahead log (sequential write: fast)
                self.write_to_log(query)

                # Update data
                self.data[query['key']] = query['value']

                # Invalidate cache
                self.cache.pop(query['key'], None)

                # Sync to disk (fsync: ensure durability)
                self.sync_to_disk()

    def write_to_log(self, query):
        """
        Append to log file.

        Sequential writes are fast:
        - OS can optimize
        - Disk head doesn't seek
        - SSD parallelism helps
        """
        pass

    def sync_to_disk(self):
        """
        Force write to physical disk.

        Ensures durability:
        - Data survives power loss
        - But slow (disk I/O)
        - Use group commit to amortize cost
        """
        pass

# Handle concurrent clients
def client_thread(db, client_id):
    """Each client runs in its own thread."""
    for i in range(100):
        query = {'type': 'SELECT', 'key': f'user_{i % 10}'}
        result = db.execute_query(query)
        time.sleep(0.001)  # Simulate work

db = DatabaseServer()
threads = [
    threading.Thread(target=client_thread, args=(db, i))
    for i in range(100)
]

for t in threads:
    t.start()

for t in threads:
    t.join()

# OS scheduler ensures:
# - All threads make progress
# - CPU cores utilized
# - I/O overlapped with computation
```

## Common Pitfalls

### Pitfall 1: Not Considering CPU Cache

**Problem**: Random memory access patterns cause cache misses.

```python
import numpy as np
import time

# Bad: Column-major access (cache-unfriendly)
def sum_columns_bad(matrix):
    total = 0
    rows, cols = matrix.shape
    for col in range(cols):
        for row in range(rows):
            total += matrix[row, col]  # Jumps around memory
    return total

# Good: Row-major access (cache-friendly)
def sum_columns_good(matrix):
    total = 0
    rows, cols = matrix.shape
    for row in range(rows):
        for col in range(cols):
            total += matrix[row, col]  # Sequential access
    return total

matrix = np.random.rand(10000, 10000)

start = time.time()
sum_columns_bad(matrix)
print(f"Bad: {time.time() - start:.2f}s")

start = time.time()
sum_columns_good(matrix)
print(f"Good: {time.time() - start:.2f}s")

# Bad: 8.5s (cache misses)
# Good: 1.2s (cache hits)
# 7x speedup just from memory access pattern!
```

### Pitfall 2: Creating Too Many Threads

**Problem**: Thread creation overhead and context switching cost.

```python
import threading
import time

# Bad: Create thread per task
def bad_approach(tasks):
    threads = []
    for task in tasks:  # 10,000 tasks
        t = threading.Thread(target=task)
        threads.append(t)
        t.start()  # Creating 10,000 threads!

    for t in threads:
        t.join()

    # Problems:
    # - Thread creation overhead: ~1ms per thread = 10 seconds
    # - Context switching: OS switches between 10,000 threads
    # - Memory: Each thread needs stack (1-8MB) = 10-80 GB!

# Good: Use thread pool
from concurrent.futures import ThreadPoolExecutor

def good_approach(tasks):
    # Use fixed pool of threads
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(lambda t: t(), tasks)

    # Benefits:
    # - Threads created once
    # - Reused for all tasks
    # - Memory: 10 threads × 8MB = 80MB (manageable)
    # - Less context switching

# Benchmark
tasks = [lambda: time.sleep(0.001) for _ in range(10000)]

start = time.time()
# bad_approach(tasks)  # Don't run - will crash!
print(f"Bad approach would take: ~60 seconds and crash")

start = time.time()
good_approach(tasks)
print(f"Good approach: {time.time() - start:.2f}s")
# Good: ~10 seconds (100x better!)
```

### Pitfall 3: Ignoring Memory Leaks

**Problem**: Not freeing memory causes program to grow until crash.

```python
# Bad: Memory leak
class LeakyCache:
    def __init__(self):
        self.cache = {}

    def add(self, key, value):
        self.cache[key] = value
        # Never removes old entries!
        # Cache grows forever

# After 1 million inserts:
# Memory: 1 million entries × 1KB = 1 GB
# Keeps growing until out of memory!

# Good: Bounded cache with LRU eviction
from collections import OrderedDict

class BoundedCache:
    def __init__(self, max_size=1000):
        self.cache = OrderedDict()
        self.max_size = max_size

    def add(self, key, value):
        # Remove oldest if at capacity
        if len(self.cache) >= self.max_size:
            self.cache.popitem(last=False)  # Remove oldest

        self.cache[key] = value
        self.cache.move_to_end(key)  # Mark as recently used

    def get(self, key):
        if key in self.cache:
            self.cache.move_to_end(key)  # Mark as recently used
            return self.cache[key]
        return None

# Memory: Max 1000 entries × 1KB = 1 MB (bounded)

# Better: Use weakref for automatic cleanup
import weakref

class AutoCleanupCache:
    def __init__(self):
        self.cache = weakref.WeakValueDictionary()
        # Automatically removes entries when no other references

    def add(self, key, value):
        self.cache[key] = value
        # When value is no longer used elsewhere, it's auto-removed
```

### Pitfall 4: Blocking I/O in Critical Path

**Problem**: Waiting for I/O blocks execution.

```python
import time
import asyncio

# Bad: Synchronous I/O blocks everything
def fetch_data_sync(urls):
    """Blocks on each request."""
    results = []
    for url in urls:
        # This blocks for ~100ms per request
        result = requests.get(url)
        results.append(result)
    return results

# 10 URLs × 100ms = 1000ms total
# CPU idle while waiting for network!

# Good: Async I/O overlaps requests
async def fetch_data_async(urls):
    """All requests run concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# 10 URLs, all requested simultaneously = ~100ms total
# 10x faster!

# When to use async:
# - I/O-bound: Network, disk, database
# - Many operations: 100+ concurrent requests
# - Response time matters: User-facing applications

# When to use sync:
# - CPU-bound: Calculations
# - Few operations: 1-10 requests
# - Simplicity matters: Easier to debug
```

### Pitfall 5: Not Understanding GIL (Python)

**Problem**: Python's Global Interpreter Lock prevents true parallelism for CPU-bound tasks.

```python
import threading
import multiprocessing
import time

def cpu_intensive_work():
    """Pure computation - no I/O."""
    total = 0
    for i in range(10_000_000):
        total += i ** 2
    return total

# Bad: Threads for CPU-bound work (Python)
def use_threads():
    """
    Threads don't help for CPU-bound in Python!

    GIL (Global Interpreter Lock):
    - Only one thread executes Python bytecode at a time
    - Threads take turns
    - No parallel CPU usage
    """
    threads = []
    for _ in range(4):
        t = threading.Thread(target=cpu_intensive_work)
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

# Good: Processes for CPU-bound work
def use_processes():
    """
    Processes bypass GIL.

    Each process:
    - Has its own Python interpreter
    - Has its own GIL
    - Can use different CPU core
    - True parallelism
    """
    with multiprocessing.Pool(processes=4) as pool:
        pool.map(lambda _: cpu_intensive_work(), range(4))

# Benchmark
start = time.time()
use_threads()
thread_time = time.time() - start

start = time.time()
use_processes()
process_time = time.time() - start

print(f"Threads: {thread_time:.2f}s")     # ~20s (no speedup)
print(f"Processes: {process_time:.2f}s")  # ~5s (4x speedup)

# When to use threads vs processes in Python:
# Threads: I/O-bound work (GIL released during I/O)
# Processes: CPU-bound work (bypass GIL)
```

## Quick Reference

### CPU Performance Factors

| Factor | Impact | Example |
|--------|--------|---------|
| Clock Speed | Higher = faster | 3 GHz vs 5 GHz: 1.67x faster |
| Core Count | More = more parallel work | 4 vs 8 cores: 2x throughput |
| Cache Size | Larger = fewer RAM accesses | 8MB vs 16MB: 10-20% faster |
| Architecture | Modern = more efficient | Skylake vs Haswell: 15% faster |

### Memory Hierarchy

| Level | Size | Speed | Latency |
|-------|------|-------|---------|
| CPU Registers | 1 KB | Fastest | 0.25 ns |
| L1 Cache | 32-64 KB | Very fast | 1 ns |
| L2 Cache | 256-512 KB | Fast | 3 ns |
| L3 Cache | 8-16 MB | Medium | 12 ns |
| RAM | 8-32 GB | Slow | 100 ns |
| SSD | 256 GB-2 TB | Very slow | 25,000 ns |
| HDD | 1-10 TB | Extremely slow | 5,000,000 ns |

### Thread vs Process

| Aspect | Thread | Process |
|--------|--------|---------|
| Memory | Shared | Isolated |
| Creation | Fast (~1ms) | Slow (~100ms) |
| Context Switch | Fast (~1μs) | Slow (~10μs) |
| Communication | Direct (shared memory) | IPC (slower) |
| Safety | Need locks | Isolated (safer) |
| Use Case | I/O-bound | CPU-bound |

### Storage Comparison

| Type | Speed (MB/s) | Latency | Use Case |
|------|-------------|---------|----------|
| HDD | 80-160 | 5-10ms | Archive, bulk storage |
| SATA SSD | 500-550 | 0.1ms | OS, applications |
| NVMe SSD | 3000-7000 | 0.025ms | Databases, high-performance |
| RAM | 25,000+ | 0.0001ms | Active data |

### Performance Checklist

- [ ] Use appropriate data structures (cache-friendly layouts)
- [ ] Minimize memory allocations
- [ ] Use async/await for I/O-bound tasks
- [ ] Use multiprocessing for CPU-bound tasks
- [ ] Monitor resource usage (CPU, memory, disk)
- [ ] Profile before optimizing
- [ ] Set resource limits
- [ ] Handle errors gracefully
- [ ] Log performance metrics

## Related Topics

### In This Section (Foundations)
- **[How Internet Works](../how-internet-works/README.md)**: Understand how networked computers communicate
- **[Networking Basics](../networking-basics/README.md)**: Learn how computers connect over networks
- **[Data Structures & Algorithms](../data-structures-algorithms/README.md)**: Understand how software organizes data in memory

### Next Steps
- **[Programming Concepts](../../01-programming/programming-concepts/README.md)**: Write code that leverages computer architecture
- **[Backend Development](../../05-backend/README.md)**: Build server applications
- **[Infrastructure](../../06-infrastructure/README.md)**: Deploy and manage computer systems

### Advanced Topics
- **[System Architecture](../../02-architectures/README.md)**: Design systems that scale across many computers
- **[Cloud Computing](../../07-cloud/README.md)**: Use distributed computing resources

## Summary

Computers process information through a hierarchy of components working together:

- **CPU**: Executes billions of instructions per second through fetch-decode-execute cycles
- **Memory Hierarchy**: Registers → Cache → RAM → Storage (faster to slower)
- **Operating System**: Manages resources, schedules processes, provides abstractions
- **Processes & Threads**: Enable multiple programs to run simultaneously
- **I/O Systems**: Handle input/output devices efficiently

Key principles:
- **Locality**: Programs reuse data (temporal and spatial locality enable caching)
- **Parallelism**: Modern CPUs have multiple cores for simultaneous execution
- **Abstraction**: OS provides clean interface hiding hardware complexity
- **Trade-offs**: Speed vs capacity, simplicity vs efficiency

Understanding these concepts helps you:
- Write efficient code that uses resources well
- Debug performance issues systematically
- Make informed architectural decisions
- Optimize based on bottlenecks (CPU vs memory vs I/O)

The computer is a remarkably complex machine, but it follows simple, deterministic rules. Every program, no matter how sophisticated, breaks down to billions of simple operations executed very quickly.

---

**Last Updated**: 2026-02-19
**Complexity**: Beginner to Intermediate
**Prerequisites**: None
**Time to Learn**: 2-3 hours
**Next**: [Networking Basics](../networking-basics/README.md)
