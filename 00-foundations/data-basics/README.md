# Data Basics

## What is it?

Data is information stored and processed by computers in a structured format. At the most fundamental level, computers only understand binary—zeros and ones, electrical signals that are either off (0) or on (1). Everything you see on a computer—text, images, videos, programs—is ultimately represented as sequences of these binary digits called bits.

Data basics covers how computers represent, store, organize, and transmit information. This includes understanding different data types (numbers, text, images), data structures (how data is organized), data formats (how data is encoded), and data storage (where and how data persists).

Understanding data is essential because every software application manipulates data in some way: reading it, processing it, storing it, or transmitting it. How you structure and handle data fundamentally impacts your application's performance, reliability, and maintainability.

## Simple Analogy

Think of data like a library system:

- **Raw data** = Individual books (unorganized information)
- **Data types** = Categories (fiction, non-fiction, reference)
- **Data structures** = Shelving systems (how books are organized)
- **Databases** = The entire library (organized collection)
- **Binary** = Letters of the alphabet (basic building blocks)
- **Encoding** = Language (how we represent meaning)
- **Metadata** = Library catalog cards (data about data)

Just like a library needs a system to organize books (by category, author, subject), computers need ways to organize data so it can be found, used, and updated efficiently. Without organization, finding information would be impossible.

## Why Does It Matter?

Understanding data is critical for every aspect of software development:

**Business Impact:**
- **Decision making**: Business intelligence relies on data analysis
- **User experience**: Fast data access means responsive applications
- **Cost efficiency**: Proper data storage reduces infrastructure costs
- **Compliance**: Regulations require proper data handling (GDPR, HIPAA)
- **Competitive advantage**: Better data usage leads to better insights

**Technical Impact:**
- **Performance**: How you structure data affects speed (milliseconds vs seconds)
- **Scalability**: Proper data design allows growth (thousands to millions of records)
- **Reliability**: Data integrity prevents corruption and loss
- **Maintainability**: Well-organized data is easier to update and extend
- **Security**: Proper data handling protects sensitive information

Poor data management leads to slow applications, data loss, security breaches, and systems that can't scale. Good data management is the foundation of every successful application.

## How It Works

### Binary and Bits

At the hardware level, computers use electricity. A transistor is either on (1) or off (0). This is called a **bit** (binary digit).

```
Bit: The smallest unit of data
- Can be 0 or 1
- Represents off or on, false or true

8 bits = 1 byte

Example byte: 01001000
              ↑      ↑
           High    Low
            bit     bit

This byte represents the letter 'H' in ASCII
```

**Data Size Units:**
```
Bit (b)        = 1 binary digit (0 or 1)
Byte (B)       = 8 bits
Kilobyte (KB)  = 1,024 bytes        ≈ 1 thousand bytes
Megabyte (MB)  = 1,024 KB           ≈ 1 million bytes
Gigabyte (GB)  = 1,024 MB           ≈ 1 billion bytes
Terabyte (TB)  = 1,024 GB           ≈ 1 trillion bytes
Petabyte (PB)  = 1,024 TB           ≈ 1 quadrillion bytes

Note: Sometimes decimal (1000) used instead of binary (1024)
      Binary: kibibyte (KiB), mebibyte (MiB), gibibyte (GiB)
      Decimal: kilobyte (KB), megabyte (MB), gigabyte (GB)

Real-world sizes:
Text character:   1 byte
Email:            ~75 KB
Photo:            ~3 MB
Song (MP3):       ~5 MB
Movie (1080p):    ~4 GB
Database backup:  ~100 GB
Data center:      ~1 PB
```

### Number Systems

Computers use different number systems for different purposes:

**Decimal (Base 10):**
```
What humans use naturally
Digits: 0-9

Example: 12510
= 1×100 + 2×10 + 5×1
= 100 + 20 + 5
```

**Binary (Base 2):**
```
What computers use internally
Digits: 0-1

Example: 11111012 = 12510
= 1×64 + 1×32 + 1×16 + 1×8 + 1×4 + 0×2 + 1×1
= 64 + 32 + 16 + 8 + 4 + 0 + 1
= 125

Reading binary:
Position: 7  6  5  4  3  2  1  0
Value:   128 64 32 16  8  4  2  1
Binary:   0  1  1  1  1  1  0  1
          ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓
         0+64+32+16+8+4+0+1 = 125
```

**Hexadecimal (Base 16):**
```
Shorthand for binary (common in programming)
Digits: 0-9, A-F (A=10, B=11, C=12, D=13, E=14, F=15)

Example: 7D16 = 12510
= 7×16 + 13×1
= 112 + 13
= 125

Why useful: Each hex digit = 4 binary bits
7    D
0111 1101 (in binary)

Common uses:
- Color codes: #FF5733 (red, green, blue components)
- Memory addresses: 0x7FFF5A3C
- Error codes: 0x80004005
```

**Conversion table:**
```
Decimal  Binary   Hex
0        0000     0
1        0001     1
2        0010     2
3        0011     3
4        0100     4
5        0101     5
6        0110     6
7        0111     7
8        1000     8
9        1001     9
10       1010     A
11       1011     B
12       1100     C
13       1101     D
14       1110     E
15       1111     F
```

### Data Types

Programming languages classify data into types:

**Primitive Types (basic building blocks):**

```
Integer (whole numbers):
  int: -2,147,483,648 to 2,147,483,647 (4 bytes, 32-bit)
  long: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 (8 bytes, 64-bit)
  short: -32,768 to 32,767 (2 bytes, 16-bit)
  byte: -128 to 127 (1 byte, 8-bit)

  Examples: 42, -17, 0, 1000000

Floating-point (decimal numbers):
  float: ~7 decimal digits precision (4 bytes, 32-bit)
  double: ~15 decimal digits precision (8 bytes, 64-bit)

  Examples: 3.14, -0.001, 2.5e10 (scientific notation: 2.5 × 10^10)

  Warning: Floating-point is not exact!
  0.1 + 0.2 = 0.30000000000000004 (not exactly 0.3)
  Use decimal/BigDecimal for money!

Boolean (true/false):
  bool: true or false (1 bit logically, usually 1 byte in memory)

  Examples: true, false
  Used for: Conditions, flags, yes/no decisions

Character (single letter/symbol):
  char: Single character (2 bytes for Unicode)

  Examples: 'A', 'z', '5', '@', '文' (Chinese character)

String (text):
  String: Sequence of characters
  Size: Variable (each character typically 1-4 bytes)

  Examples: "Hello, World!", "", "user@example.com"

Null/None:
  Represents absence of value
  Different from zero or empty string!

  Examples: null, None, nil (depending on language)
```

**Composite Types (combinations):**

```
Arrays: Ordered collection of same type
  [1, 2, 3, 4, 5]
  ["apple", "banana", "cherry"]

Objects/Structures: Group related data
  {
    name: "John Doe",
    age: 30,
    email: "john@example.com"
  }

Lists: Dynamic arrays (can grow/shrink)
  Similar to arrays but resizable
```

### Character Encoding

How do computers represent text?

**ASCII (American Standard Code for Information Interchange):**
```
7-bit encoding (128 characters)
0-31:   Control characters (not printable)
32-126: Printable characters
127:    Delete

Common ASCII codes:
32  = Space
48  = '0'
65  = 'A'
90  = 'Z'
97  = 'a'
122 = 'z'

Example: "Hi" in ASCII
H = 72  = 01001000
i = 105 = 01101001

Limitations:
✗ Only English characters
✗ No accented letters (é, ñ, ü)
✗ No symbols from other languages (中, العربية, हिन्दी)
```

**Unicode (Universal Character Set):**
```
Modern standard supporting all languages
Over 143,000 characters from 154 scripts

Code points: U+0000 to U+10FFFF
Written as: U+0041 (letter 'A')

Examples:
U+0041 = A (Latin letter)
U+00E9 = é (Latin letter with accent)
U+4E2D = 中 (Chinese character)
U+0623 = أ (Arabic letter)
U+1F600 = 😀 (emoji)

Unicode doesn't specify how to store characters in bytes—that's encoding!
```

**UTF-8 (Unicode Transformation Format - 8-bit):**
```
Most common Unicode encoding
Variable-length: 1-4 bytes per character

Backward compatible with ASCII!
ASCII characters (0-127) = 1 byte in UTF-8

Encoding rules:
ASCII range (U+0000 to U+007F):   1 byte
U+0080 to U+07FF:                 2 bytes
U+0800 to U+FFFF:                 3 bytes
U+10000 to U+10FFFF:              4 bytes

Examples:
'A' (U+0041):
  UTF-8: 01000001 (1 byte)

'é' (U+00E9):
  UTF-8: 11000011 10101001 (2 bytes)

'中' (U+4E2D):
  UTF-8: 11100100 10111000 10101101 (3 bytes)

'😀' (U+1F600):
  UTF-8: 11110000 10011111 10011000 10000000 (4 bytes)

Why UTF-8 is popular:
✓ Backward compatible with ASCII
✓ Space-efficient for English text
✓ Supports all languages
✓ Self-synchronizing (can find character boundaries)
✓ No byte-order issues
```

**Other encodings:**
```
UTF-16: 2 or 4 bytes per character
  - Used internally by Windows, Java, JavaScript
  - Less space-efficient for English

UTF-32: Always 4 bytes per character
  - Simpler (fixed width)
  - Wasteful for most text

Latin-1 (ISO-8859-1): 1 byte per character
  - Covers Western European languages
  - Legacy encoding, use UTF-8 instead
```

### Data Structures

How data is organized in memory:

**Array:**
```
Fixed-size, ordered collection
Elements stored contiguously in memory

[10, 20, 30, 40, 50]
 ↑   ↑   ↑   ↑   ↑
 0   1   2   3   4  (indices)

Memory layout:
Address  | Value
---------|------
0x1000   | 10
0x1004   | 20
0x1008   | 30
0x100C   | 40
0x1010   | 50

Operations:
Access by index:  O(1) - Instant (arr[2] = 30)
Search:           O(n) - Must check each element
Insert/Delete:    O(n) - Must shift elements

Use when:
✓ Size known in advance
✓ Need fast random access
✓ Accessing by position
```

**Linked List:**
```
Elements linked by pointers/references
Each node contains data + reference to next node

[10] → [20] → [30] → [40] → [50] → null

Node structure:
{
  data: 10,
  next: → {data: 20, next: → {data: 30, ...}}
}

Operations:
Access by index:  O(n) - Must traverse from start
Search:           O(n) - Must check each node
Insert at start:  O(1) - Just update references
Delete:           O(1) - If you have reference to node

Use when:
✓ Size varies frequently
✓ Frequent insertions/deletions
✓ Don't need random access
```

**Hash Table (Dictionary/Map):**
```
Key-value pairs with fast lookup
Uses hash function to compute index

{
  "john": "john@example.com",
  "jane": "jane@example.com",
  "bob": "bob@example.com"
}

How it works:
Key "john" → Hash function → Index 5 → Value "john@example.com"

Hash function example:
hash("john") = 5
hash("jane") = 12
hash("bob") = 3

Array (internal):
Index | Key    | Value
------|--------|------------------
3     | "bob"  | "bob@example.com"
5     | "john" | "john@example.com"
12    | "jane" | "jane@example.com"

Operations:
Access by key:  O(1) average - Direct lookup
Search by key:  O(1) average - Direct lookup
Insert:         O(1) average - Compute hash, store
Delete:         O(1) average - Compute hash, remove

Use when:
✓ Need fast lookups by key
✓ Keys are unique
✓ Don't care about order
```

**Tree:**
```
Hierarchical structure with nodes and children

        50
       /  \
     30    70
    /  \   /  \
  20  40 60  80

Binary Search Tree properties:
- Left child < Parent
- Right child > Parent
- Enables fast search

Operations:
Search:  O(log n) average - Binary search
Insert:  O(log n) average - Find position, insert
Delete:  O(log n) average - Find, remove, rebalance

Use when:
✓ Need sorted data
✓ Need fast search, insert, delete
✓ Hierarchical relationships
```

**Stack:**
```
Last In, First Out (LIFO)
Like a stack of plates

Push 10 → [10]
Push 20 → [10, 20]
Push 30 → [10, 20, 30]
Pop()   → 30 (returns and removes top)
        → [10, 20]

Operations:
Push (add to top):    O(1)
Pop (remove from top): O(1)
Peek (view top):      O(1)

Use cases:
- Function call stack
- Undo functionality
- Expression evaluation
- Backtracking algorithms
```

**Queue:**
```
First In, First Out (FIFO)
Like a line at a store

Enqueue 10 → [10]
Enqueue 20 → [10, 20]
Enqueue 30 → [10, 20, 30]
Dequeue()  → 10 (returns and removes front)
           → [20, 30]

Operations:
Enqueue (add to back):      O(1)
Dequeue (remove from front): O(1)
Peek (view front):          O(1)

Use cases:
- Task scheduling
- Message queues
- Breadth-first search
- Print queue
```

### Data Formats

Common ways to structure and exchange data:

**JSON (JavaScript Object Notation):**
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "roles": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  }
}

Characteristics:
✓ Human-readable
✓ Language-independent
✓ Lightweight
✓ Native JavaScript support
✓ Supports nested structures
✗ No comments
✗ No date type (use ISO 8601 strings)
✗ Larger than binary formats

Use cases:
- REST APIs
- Configuration files
- Data exchange between services
- Web applications
```

**XML (eXtensible Markup Language):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>John Doe</name>
  <age>30</age>
  <email>john@example.com</email>
  <active>true</active>
  <roles>
    <role>admin</role>
    <role>user</role>
  </roles>
  <address>
    <street>123 Main St</street>
    <city>Springfield</city>
    <zip>12345</zip>
  </address>
</user>

Characteristics:
✓ Human-readable
✓ Self-documenting (tag names describe content)
✓ Schema validation (XSD)
✓ Supports attributes
✓ Comments allowed
✗ Verbose (more data overhead)
✗ More complex to parse

Use cases:
- Enterprise systems (SOAP)
- Configuration files
- Document formats (DOCX, SVG)
- Data interchange in legacy systems
```

**CSV (Comma-Separated Values):**
```csv
name,age,email,active
John Doe,30,john@example.com,true
Jane Smith,25,jane@example.com,true
Bob Johnson,35,bob@example.com,false

Characteristics:
✓ Simple
✓ Compact
✓ Easy to read in spreadsheets
✓ Universal support
✗ No data types (everything is text)
✗ Limited structure (only tabular)
✗ Escaping issues (commas in data)

Use cases:
- Spreadsheet data
- Data exports
- Bulk data imports
- Simple tabular data
```

**YAML (YAML Ain't Markup Language):**
```yaml
name: John Doe
age: 30
email: john@example.com
active: true
roles:
  - admin
  - user
address:
  street: 123 Main St
  city: Springfield
  zip: "12345"

Characteristics:
✓ Human-readable
✓ Less verbose than JSON/XML
✓ Supports comments
✓ Multi-line strings
✗ Whitespace-sensitive (indentation matters)
✗ Can be ambiguous

Use cases:
- Configuration files (Docker, Kubernetes)
- CI/CD pipelines
- Documentation
```

**Protocol Buffers (Protobuf):**
```protobuf
// Schema definition
message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
  bool active = 4;
  repeated string roles = 5;
}

// Compiled to binary format

Characteristics:
✓ Very compact (binary)
✓ Fast to parse
✓ Backward/forward compatible
✓ Strongly typed (schema required)
✗ Not human-readable
✗ Requires code generation

Use cases:
- gRPC APIs
- High-performance services
- Mobile apps (saves bandwidth)
- Internal microservices
```

### Data Storage

Where and how data persists:

**In-Memory (RAM):**
```
Characteristics:
- Extremely fast (nanoseconds)
- Volatile (lost when power off)
- Limited capacity (typically GB)
- Expensive per GB

Use cases:
- Variables during program execution
- Caching frequently accessed data
- Session data
- Real-time processing

Example: Redis cache
Key: "user:123"
Value: {name: "John", email: "john@example.com"}
Expiration: 1 hour
```

**Disk Storage:**
```
HDD (Hard Disk Drive):
- Mechanical (spinning platters)
- Slower (milliseconds)
- Cheaper per GB
- Large capacity (TB)
- Good for: Archives, backups, large files

SSD (Solid State Drive):
- No moving parts (flash memory)
- Faster (microseconds)
- More expensive than HDD
- Good for: Operating system, databases, applications

NVMe SSD:
- Connected via PCIe (faster interface)
- Fastest disk storage
- Most expensive
- Good for: High-performance databases, real-time analytics
```

**File Systems:**
```
How operating systems organize data on disk

Hierarchical structure:
/
├── home/
│   ├── john/
│   │   ├── documents/
│   │   │   └── report.pdf
│   │   └── photos/
│   │       └── vacation.jpg
│   └── jane/
├── var/
│   ├── log/
│   └── www/
└── etc/
    └── config.json

File metadata:
- Name: report.pdf
- Size: 2,458,624 bytes (2.3 MB)
- Type: PDF document
- Created: 2025-01-15 10:30:00
- Modified: 2025-01-15 14:45:00
- Permissions: rw-r--r-- (owner can read/write, others can read)
- Owner: john
```

**Databases:**
```
Organized collections of structured data

Relational databases (SQL):
- Structured tables with rows and columns
- Relationships between tables
- ACID transactions
- Examples: PostgreSQL, MySQL, SQL Server

NoSQL databases:
- Flexible schemas
- Various models (document, key-value, graph)
- Horizontal scaling
- Examples: MongoDB, Redis, Cassandra, Neo4j

We'll cover databases in depth in other sections
```

### Data Compression

Reducing data size for storage and transmission:

**Lossless Compression:**
```
Original data can be perfectly reconstructed
No information lost

Algorithms:
- ZIP/GZIP: General-purpose
- PNG: Images (web graphics)
- FLAC: Audio

Example: Text compression
Original:  "aaaabbbccd"  (10 bytes)
Compressed: "4a3b2c1d"   (8 bytes)
Decompressed: "aaaabbbccd" (exact original)

Use cases:
- Text files
- Program files
- Medical images (X-rays)
- Legal documents
- Anything where accuracy is critical
```

**Lossy Compression:**
```
Approximate original data
Some information lost (usually imperceptible)
Much higher compression ratios

Algorithms:
- JPEG: Images (photos)
- MP3/AAC: Audio
- H.264/H.265: Video

Example: Image compression
Original:  10 MB photo
JPEG:      1 MB (looks nearly identical)
Difference: Subtle color variations removed

Use cases:
- Photos and images
- Music and audio
- Video content
- Streaming media
```

**Compression Ratios:**
```
Text file (1 MB):
GZIP: 200 KB (5:1 ratio)

Photo (10 MB):
PNG (lossless): 8 MB (1.25:1)
JPEG (lossy):   1 MB (10:1)

Video (1 GB):
H.264: 100 MB (10:1)
H.265: 50 MB (20:1, newer codec)
```

## Key Concepts

### Data Integrity

Ensuring data is accurate and uncorrupted:

**Checksums:**
```
Simple error detection
Add up all bytes, store result

Example:
Data: [10, 20, 30, 40]
Checksum: 10 + 20 + 30 + 40 = 100

When receiving:
Received: [10, 20, 30, 40], Checksum: 100
Calculate: 10 + 20 + 30 + 40 = 100
Match! Data is intact.

If corrupted:
Received: [10, 20, 31, 40], Checksum: 100
Calculate: 10 + 20 + 31 + 40 = 101
Mismatch! Data corrupted.

Limitation: Can't detect all errors (e.g., two errors that cancel out)
```

**Hash Functions:**
```
One-way function that produces fixed-size output
Same input always produces same output
Small change in input drastically changes output

MD5 (128-bit):
"Hello" → 8b1a9953c4611296a827abf8c47804d7
"hello" → 5d41402abc4b2a76b9719d911017c592
         ↑ Completely different!

SHA-256 (256-bit, more secure):
"Hello" → 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969

Properties:
- Deterministic (same input → same output)
- Fast to compute
- Infeasible to reverse (can't get input from hash)
- Collision-resistant (hard to find two inputs with same hash)

Use cases:
- Password storage (store hash, not password)
- File integrity verification
- Digital signatures
- Blockchain
```

**Error Correction Codes:**
```
Not only detect errors, but correct them

Example: Hamming code
Can correct single-bit errors, detect two-bit errors

Used in:
- RAM (ECC memory)
- Hard drives
- Network transmission
- QR codes (why they work even when damaged)
```

### Data Serialization

Converting data to a format suitable for storage or transmission:

```python
# Python object (in memory)
user = {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
}

# Serialize to JSON (string/bytes)
import json
json_string = json.dumps(user)
# Result: '{"name": "John Doe", "age": 30, "email": "john@example.com"}'

# Can now:
# - Save to file
# - Send over network
# - Store in database

# Deserialize (convert back to object)
restored_user = json.loads(json_string)
# Result: {'name': 'John Doe', 'age': 30, 'email': 'john@example.com'}
```

**Why serialize:**
```
- Persistence: Save data to disk
- Transmission: Send data over network
- Inter-process communication: Share data between programs
- Caching: Store processed data for reuse
```

### Endianness

Byte order in multi-byte values:

```
Number: 0x12345678 (4 bytes)

Big-Endian (most significant byte first):
Address | Value
--------|------
0x1000  | 0x12 ← Most significant byte
0x1001  | 0x34
0x1002  | 0x56
0x1003  | 0x78 ← Least significant byte

Little-Endian (least significant byte first):
Address | Value
--------|------
0x1000  | 0x78 ← Least significant byte
0x1001  | 0x56
0x1002  | 0x34
0x1003  | 0x12 ← Most significant byte

Network Byte Order:
Always big-endian (standardized for network protocols)

Why it matters:
- Files created on one system might be unreadable on another
- Network protocols specify byte order
- Binary file formats must define endianness

Modern relevance:
- Most CPUs are little-endian (x86, ARM)
- Network protocols use big-endian
- Must convert when sending/receiving data
```

### Data Validation

Ensuring data meets expected criteria:

**Type Validation:**
```python
# Check data type
if isinstance(age, int):
    print("Age is an integer")
else:
    raise TypeError("Age must be an integer")

# Check range
if not (0 <= age <= 120):
    raise ValueError("Age must be between 0 and 120")
```

**Format Validation:**
```python
import re

# Email format
email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
if not re.match(email_pattern, email):
    raise ValueError("Invalid email format")

# Phone number format
phone_pattern = r'^\d{3}-\d{3}-\d{4}$'
if not re.match(phone_pattern, phone):
    raise ValueError("Phone must be in format: 123-456-7890")
```

**Business Rule Validation:**
```python
# Check relationships
if order_date < account_creation_date:
    raise ValueError("Order date cannot be before account creation")

# Check constraints
if withdrawal_amount > account_balance:
    raise ValueError("Insufficient funds")
```

### Data Normalization

Organizing data to reduce redundancy:

**Denormalized (redundant):**
```
Orders table:
OrderID | CustomerName | CustomerEmail       | Product | Price
--------|--------------|---------------------|---------|------
1       | John Doe     | john@example.com    | Widget  | 10.00
2       | John Doe     | john@example.com    | Gadget  | 20.00
3       | Jane Smith   | jane@example.com    | Widget  | 10.00

Problems:
- Customer info duplicated
- If John changes email, must update multiple rows
- Wastes storage space
```

**Normalized (no redundancy):**
```
Customers table:
CustomerID | Name       | Email
-----------|------------|------------------
1          | John Doe   | john@example.com
2          | Jane Smith | jane@example.com

Orders table:
OrderID | CustomerID | Product | Price
--------|------------|---------|------
1       | 1          | Widget  | 10.00
2       | 1          | Gadget  | 20.00
3       | 2          | Widget  | 10.00

Benefits:
✓ Customer info stored once
✓ Update email in one place
✓ Less storage space
✓ Data consistency
```

### Data Indexing

Creating auxiliary structures for faster data retrieval:

```
Without index (sequential scan):
Finding user with ID 12345 in 1 million users
Must check all rows: O(n) = slow

With index:
Index on user_id (like a book's index)
Direct lookup: O(log n) or O(1) = fast

Trade-offs:
✓ Faster reads
✗ Slower writes (must update index)
✗ More storage (index takes space)

When to index:
✓ Frequently searched columns
✓ Foreign keys
✓ Columns used in WHERE clauses
✓ Columns used in JOINs

When NOT to index:
✗ Small tables (index overhead not worth it)
✗ Columns with low cardinality (e.g., boolean)
✗ Rarely queried columns
✗ Columns that change frequently
```

## Best Practices

### Safety

**Input Validation:**
```python
def create_user(name: str, age: int, email: str):
    """
    Create user with comprehensive input validation.

    Why this matters:
    - Prevents data corruption
    - Protects against injection attacks
    - Ensures data integrity
    - Provides clear error messages

    Best Practices:
    - Validate all inputs
    - Check types, ranges, formats
    - Sanitize before storing
    - Log validation failures
    - Fail fast with clear errors
    """
    import re
    import logging

    logger = logging.getLogger(__name__)

    # Type validation
    if not isinstance(name, str):
        logger.error(f"Invalid name type: {type(name)}")
        raise TypeError("Name must be a string")

    if not isinstance(age, int):
        logger.error(f"Invalid age type: {type(age)}")
        raise TypeError("Age must be an integer")

    if not isinstance(email, str):
        logger.error(f"Invalid email type: {type(email)}")
        raise TypeError("Email must be a string")

    # Value validation
    if not name or not name.strip():
        logger.error("Empty name provided")
        raise ValueError("Name cannot be empty")

    if len(name) > 100:
        logger.error(f"Name too long: {len(name)} characters")
        raise ValueError("Name must be 100 characters or less")

    if not (0 <= age <= 120):
        logger.error(f"Age out of range: {age}")
        raise ValueError("Age must be between 0 and 120")

    # Format validation
    email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    if not re.match(email_pattern, email):
        logger.error(f"Invalid email format: {email}")
        raise ValueError("Invalid email format")

    # Sanitization
    name = name.strip()  # Remove leading/trailing whitespace
    email = email.lower().strip()  # Normalize email

    logger.info(f"User validated successfully: {name}, {age}, {email}")

    # Proceed with user creation...
    return {"name": name, "age": age, "email": email}
```

**SQL Injection Prevention:**
```python
import psycopg2
import logging

logger = logging.getLogger(__name__)

def get_user_by_email(email: str):
    """
    Retrieve user by email with SQL injection prevention.

    Why this matters:
    - SQL injection is a top security vulnerability
    - Attackers can steal, modify, or delete data
    - Can compromise entire database

    Best Practices:
    - ALWAYS use parameterized queries
    - NEVER concatenate user input into SQL
    - Validate and sanitize inputs
    - Use ORM when possible
    - Apply principle of least privilege (limit DB permissions)
    """

    # ❌ NEVER DO THIS (vulnerable to SQL injection)
    # query = f"SELECT * FROM users WHERE email = '{email}'"
    # Attacker input: "'; DROP TABLE users; --"
    # Result: SELECT * FROM users WHERE email = ''; DROP TABLE users; --'
    # Your users table is now deleted!

    # ✓ CORRECT: Use parameterized query
    query = "SELECT * FROM users WHERE email = %s"

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Parameters passed separately (safely escaped)
        cursor.execute(query, (email,))

        user = cursor.fetchone()

        if user:
            logger.info(f"User found: {email}")
        else:
            logger.info(f"User not found: {email}")

        return user

    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
        raise
    finally:
        cursor.close()
        conn.close()
```

**Sensitive Data Handling:**
```python
import hashlib
import secrets
import logging
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    """
    Hash password securely.

    Why this matters:
    - Never store passwords in plain text
    - If database breached, passwords still protected
    - Compliance requirements (PCI-DSS, GDPR)

    Best Practices:
    - Use strong hashing algorithms (bcrypt, Argon2, PBKDF2)
    - Add salt (prevents rainbow table attacks)
    - Use multiple iterations (slows brute force)
    - Never log passwords
    """
    # Generate random salt
    salt = secrets.token_bytes(32)

    # Hash password with salt (100,000 iterations)
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000  # Iterations (higher = more secure but slower)
    )

    # Store both salt and hash (both needed for verification)
    # In production, use bcrypt or Argon2 library
    logger.info("Password hashed successfully")
    # DO NOT log the actual password or hash!

    return salt.hex() + password_hash.hex()

def encrypt_sensitive_data(data: str, key: bytes) -> bytes:
    """
    Encrypt sensitive data (PII, credit cards, etc.).

    Why this matters:
    - Protects data at rest
    - Required by regulations (GDPR, HIPAA, PCI-DSS)
    - Defense in depth (even if DB compromised)

    Best Practices:
    - Encrypt sensitive fields (SSN, credit cards, medical data)
    - Use strong encryption (AES-256)
    - Secure key management (use KMS, not hardcoded keys)
    - Rotate keys periodically
    - Log encryption operations (not data itself)
    """
    cipher = Fernet(key)
    encrypted = cipher.encrypt(data.encode('utf-8'))

    logger.info("Data encrypted successfully")
    # DO NOT log the actual data or key!

    return encrypted

def decrypt_sensitive_data(encrypted_data: bytes, key: bytes) -> str:
    """Decrypt sensitive data."""
    cipher = Fernet(key)
    decrypted = cipher.decrypt(encrypted_data)

    logger.info("Data decrypted successfully")

    return decrypted.decode('utf-8')
```

### Quality

**Data Quality Checks:**
```python
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DataQualityChecker:
    """
    Validate data quality before processing.

    Why this matters:
    - Poor data quality leads to incorrect results
    - "Garbage in, garbage out"
    - Early detection prevents downstream issues
    - Builds trust in data

    Best Practices:
    - Check completeness (no missing required fields)
    - Check accuracy (values within expected ranges)
    - Check consistency (relationships valid)
    - Check timeliness (data is current)
    - Check uniqueness (no duplicates)
    - Log all quality issues
    """

    def validate_user_data(self, users: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Validate and clean user data.

        Returns only valid records, logs issues.
        """
        valid_users = []
        total = len(users)

        for i, user in enumerate(users):
            try:
                # Completeness check
                required_fields = ['id', 'name', 'email', 'age']
                missing = [f for f in required_fields if f not in user]
                if missing:
                    logger.warning(f"Record {i}: Missing fields: {missing}")
                    continue

                # Check for null values
                null_fields = [f for f in required_fields if user[f] is None]
                if null_fields:
                    logger.warning(f"Record {i}: Null fields: {null_fields}")
                    continue

                # Accuracy check - age range
                age = user['age']
                if not isinstance(age, int) or not (0 <= age <= 120):
                    logger.warning(f"Record {i}: Invalid age: {age}")
                    continue

                # Format check - email
                import re
                if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', user['email']):
                    logger.warning(f"Record {i}: Invalid email: {user['email']}")
                    continue

                # Uniqueness check (simplified - in production, check against DB)
                if any(u['id'] == user['id'] for u in valid_users):
                    logger.warning(f"Record {i}: Duplicate ID: {user['id']}")
                    continue

                # Consistency check - name not empty
                if not user['name'].strip():
                    logger.warning(f"Record {i}: Empty name")
                    continue

                # Valid record
                valid_users.append(user)

            except Exception as e:
                logger.error(f"Record {i}: Validation error: {e}")
                continue

        # Log summary
        valid = len(valid_users)
        invalid = total - valid
        logger.info(f"Data quality check: {valid}/{total} valid ({invalid} invalid)")

        if invalid > total * 0.1:  # More than 10% invalid
            logger.warning(f"High invalid rate: {invalid/total*100:.1f}%")

        return valid_users
```

**Schema Validation:**
```python
from jsonschema import validate, ValidationError
import logging

logger = logging.getLogger(__name__)

def validate_api_request(data: dict):
    """
    Validate API request against schema.

    Why this matters:
    - Ensures data structure is correct
    - Catches errors early
    - Provides clear error messages
    - Documents expected structure

    Best Practices:
    - Define schemas for all data structures
    - Validate at system boundaries (API endpoints)
    - Return clear error messages
    - Version your schemas
    - Use schema validation libraries
    """

    # Define expected schema
    schema = {
        "type": "object",
        "properties": {
            "name": {"type": "string", "minLength": 1, "maxLength": 100},
            "age": {"type": "integer", "minimum": 0, "maximum": 120},
            "email": {"type": "string", "format": "email"},
            "roles": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1
            }
        },
        "required": ["name", "age", "email"],
        "additionalProperties": False  # Reject unexpected fields
    }

    try:
        validate(instance=data, schema=schema)
        logger.info("Request validated successfully")
        return True

    except ValidationError as e:
        logger.error(f"Schema validation failed: {e.message}")
        logger.error(f"Failed at path: {' -> '.join(str(p) for p in e.path)}")
        raise ValueError(f"Invalid request: {e.message}")
```

**Data Testing:**
```python
import unittest
import json

class TestDataProcessing(unittest.TestCase):
    """
    Test data processing functions.

    Why this matters:
    - Data processing bugs can corrupt data
    - Tests document expected behavior
    - Prevents regressions
    - Ensures edge cases handled

    Best Practices:
    - Test normal cases
    - Test edge cases (empty, null, boundary values)
    - Test error cases (invalid input)
    - Test data transformations
    - Use property-based testing for complex logic
    """

    def test_parse_user_json_valid(self):
        """Test parsing valid user JSON."""
        json_data = '{"name": "John", "age": 30, "email": "john@example.com"}'
        user = json.loads(json_data)

        self.assertEqual(user['name'], "John")
        self.assertEqual(user['age'], 30)
        self.assertEqual(user['email'], "john@example.com")

    def test_parse_user_json_missing_field(self):
        """Test parsing JSON with missing required field."""
        json_data = '{"name": "John", "age": 30}'  # Missing email

        with self.assertRaises(ValueError):
            user = json.loads(json_data)
            validate_user(user)  # Should raise ValueError

    def test_age_boundary_values(self):
        """Test age validation at boundaries."""
        self.assertTrue(validate_age(0))    # Minimum valid
        self.assertTrue(validate_age(120))  # Maximum valid
        self.assertFalse(validate_age(-1))  # Below minimum
        self.assertFalse(validate_age(121)) # Above maximum

    def test_empty_string_handling(self):
        """Test handling of empty strings."""
        with self.assertRaises(ValueError):
            validate_name("")
        with self.assertRaises(ValueError):
            validate_name("   ")  # Only whitespace

    def test_unicode_handling(self):
        """Test handling of Unicode characters."""
        # Should handle international characters
        self.assertTrue(validate_name("José García"))
        self.assertTrue(validate_name("李明"))
        self.assertTrue(validate_name("محمد"))
```

### Logging

**Data Operation Logging:**
```python
import logging
import json
from datetime import datetime
from typing import Any, Dict

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataLogger:
    """
    Comprehensive data operation logging.

    Why this matters:
    - Debugging data issues
    - Audit trail (who changed what when)
    - Performance monitoring
    - Compliance requirements

    Best Practices:
    - Log all data operations (CRUD)
    - Include context (user, timestamp, correlation ID)
    - Don't log sensitive data (passwords, PII)
    - Use structured logging (easy to parse)
    - Set appropriate log levels
    - Include data quality metrics
    """

    @staticmethod
    def log_data_read(
        table: str,
        record_id: Any,
        user: str,
        duration_ms: float,
        correlation_id: str
    ):
        """Log data read operation."""
        logger.info(
            "Data read",
            extra={
                'operation': 'READ',
                'table': table,
                'record_id': record_id,
                'user': user,
                'duration_ms': duration_ms,
                'correlation_id': correlation_id,
                'timestamp': datetime.utcnow().isoformat()
            }
        )

    @staticmethod
    def log_data_write(
        table: str,
        operation: str,  # INSERT, UPDATE, DELETE
        record_id: Any,
        user: str,
        changes: Dict[str, Any],  # Fields changed
        duration_ms: float,
        correlation_id: str
    ):
        """
        Log data write operation.

        Never log actual sensitive values!
        Log field names, not values.
        """
        # Sanitize changes (remove sensitive fields)
        sanitized_changes = {
            k: '***REDACTED***' if k in ['password', 'ssn', 'credit_card'] else v
            for k, v in changes.items()
        }

        logger.info(
            f"Data {operation.lower()}",
            extra={
                'operation': operation,
                'table': table,
                'record_id': record_id,
                'user': user,
                'fields_changed': list(changes.keys()),
                'changes': sanitized_changes,
                'duration_ms': duration_ms,
                'correlation_id': correlation_id,
                'timestamp': datetime.utcnow().isoformat()
            }
        )

    @staticmethod
    def log_data_quality_issue(
        table: str,
        issue_type: str,
        record_id: Any,
        details: str,
        severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    ):
        """Log data quality issues."""
        log_func = {
            'LOW': logger.info,
            'MEDIUM': logger.warning,
            'HIGH': logger.error,
            'CRITICAL': logger.critical
        }.get(severity, logger.warning)

        log_func(
            "Data quality issue",
            extra={
                'issue_type': issue_type,
                'table': table,
                'record_id': record_id,
                'details': details,
                'severity': severity,
                'timestamp': datetime.utcnow().isoformat()
            }
        )

    @staticmethod
    def log_data_migration(
        migration_name: str,
        records_processed: int,
        records_success: int,
        records_failed: int,
        duration_ms: float
    ):
        """Log data migration results."""
        success_rate = records_success / records_processed * 100 if records_processed > 0 else 0

        logger.info(
            "Data migration completed",
            extra={
                'migration': migration_name,
                'total_records': records_processed,
                'successful': records_success,
                'failed': records_failed,
                'success_rate_pct': round(success_rate, 2),
                'duration_ms': duration_ms,
                'timestamp': datetime.utcnow().isoformat()
            }
        )

        if records_failed > 0:
            logger.warning(f"Migration had {records_failed} failures")

# Usage example
import time

def fetch_user(user_id: int, requesting_user: str, correlation_id: str):
    """Fetch user with comprehensive logging."""

    start = time.time()

    try:
        # Fetch user from database
        user = database.get_user(user_id)

        duration = (time.time() - start) * 1000

        # Log successful read
        DataLogger.log_data_read(
            table='users',
            record_id=user_id,
            user=requesting_user,
            duration_ms=duration,
            correlation_id=correlation_id
        )

        # Check for data quality issues
        if not user.get('email'):
            DataLogger.log_data_quality_issue(
                table='users',
                issue_type='MISSING_FIELD',
                record_id=user_id,
                details='Email field is null',
                severity='HIGH'
            )

        return user

    except Exception as e:
        duration = (time.time() - start) * 1000

        logger.error(
            "Failed to fetch user",
            extra={
                'user_id': user_id,
                'requesting_user': requesting_user,
                'error': str(e),
                'duration_ms': duration,
                'correlation_id': correlation_id
            }
        )
        raise
```

## Use Cases

### Healthcare: Electronic Health Records

```
Challenge: Store and retrieve patient medical data reliably and securely

Data Requirements:
- Structured: Demographics, vitals, diagnoses (relational database)
- Unstructured: Doctor's notes, images, PDFs (document storage)
- High integrity: No data loss or corruption (lives at stake)
- Audit trail: Track all access and changes (compliance)
- Fast retrieval: Emergency situations need instant access

Implementation:
1. Data Structure:
   Patients table: ID, name, DOB, MRN (medical record number)
   Visits table: ID, patient_ID, date, provider
   Diagnoses table: ID, visit_ID, ICD10_code, notes
   Lab_Results table: ID, patient_ID, test_type, value, date

2. Data Types:
   - Name: VARCHAR(100)
   - DOB: DATE
   - Blood_Pressure: VARCHAR(20) format "120/80"
   - Lab_Values: DECIMAL(10,2) for precision
   - Notes: TEXT for variable length

3. Data Integrity:
   - Foreign keys (enforce relationships)
   - Check constraints (age > 0, BP in valid range)
   - NOT NULL for required fields
   - Unique constraints (SSN, MRN)

4. Security:
   - Encrypt sensitive fields (SSN, insurance number)
   - Hash passwords
   - Row-level security (doctors see only their patients)
   - Audit log every data access

5. Performance:
   - Index on patient_ID, MRN, DOB (common searches)
   - Partition by date (separate old records)
   - Cache frequently accessed patient data

Benefits:
✓ HIPAA compliant
✓ Fast access in emergencies
✓ Complete medical history in one place
✓ Audit trail for accountability
✓ Interoperability (HL7/FHIR standards)
```

### E-commerce: Product Catalog

```
Challenge: Store millions of products with varying attributes efficiently

Data Requirements:
- Flexible schema: Products have different attributes
  (Shirt: size, color; Laptop: RAM, storage, screen)
- Fast search: Find products by any attribute
- Real-time updates: Inventory changes constantly
- Images and videos: Rich media content
- Scale: Millions of products, billions of views

Implementation:
1. Hybrid Approach:
   Relational database (PostgreSQL):
   - Core product info (ID, name, price, inventory)
   - Categories and brands
   - Orders and customers

   NoSQL database (MongoDB):
   - Flexible attributes per product
   - Product reviews
   - User behavior data

   Search engine (Elasticsearch):
   - Full-text search
   - Faceted search (filter by attributes)
   - Autocomplete suggestions

   Object storage (S3):
   - Product images
   - Videos
   - User-uploaded photos

2. Data Structure:
   ```json
   {
     "product_id": "PROD-12345",
     "name": "Laptop Model X",
     "category": "electronics/computers/laptops",
     "price": 999.99,
     "currency": "USD",
     "inventory": 45,
     "attributes": {
       "brand": "TechCorp",
       "ram": "16GB",
       "storage": "512GB SSD",
       "screen": "15.6 inch",
       "weight": "4.2 lbs"
     },
     "images": [
       "https://cdn.example.com/prod-12345-1.jpg",
       "https://cdn.example.com/prod-12345-2.jpg"
     ],
     "reviews_count": 127,
     "average_rating": 4.5,
     "created_at": "2025-01-15T10:00:00Z",
     "updated_at": "2025-02-19T14:30:00Z"
   }
   ```

3. Caching Strategy:
   - Redis cache for hot products
   - CDN for images
   - Cache search results for common queries
   - Invalidate on price/inventory change

4. Data Consistency:
   - Inventory updates are critical (no overselling)
   - Use transactions for order placement
   - Eventually consistent for reviews (OK if delayed)

Benefits:
✓ Fast product search
✓ Flexible product attributes
✓ Scales to millions of products
✓ Real-time inventory
✓ Rich product information
```

### Finance: Transaction Processing

```
Challenge: Process millions of financial transactions with perfect accuracy

Data Requirements:
- ACID compliance: Transactions are atomic (all or nothing)
- Perfect accuracy: No rounding errors
- Immutable: Once written, never changed (audit trail)
- High throughput: Process thousands per second
- Regulatory compliance: SOX, PCI-DSS requirements

Implementation:
1. Data Types:
   - Use DECIMAL, not FLOAT (no rounding errors)
   - Amount: DECIMAL(19,4) - 15 digits + 4 decimal places
   - Currency: CHAR(3) - ISO 4217 code (USD, EUR, JPY)
   - Timestamp: TIMESTAMP WITH TIME ZONE (UTC)

2. Transaction Structure:
   ```sql
   CREATE TABLE transactions (
       transaction_id UUID PRIMARY KEY,
       from_account VARCHAR(20) NOT NULL,
       to_account VARCHAR(20) NOT NULL,
       amount DECIMAL(19,4) NOT NULL CHECK (amount > 0),
       currency CHAR(3) NOT NULL,
       transaction_type VARCHAR(50) NOT NULL,
       status VARCHAR(20) NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       completed_at TIMESTAMP WITH TIME ZONE,
       metadata JSONB,
       CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
   );
   ```

3. Data Integrity:
   - Two-phase commit (both accounts updated or neither)
   - Balance checks before transaction
   - Idempotency (retrying doesn't duplicate transaction)
   - Checksum validation

4. Audit Trail:
   - Append-only ledger (never delete/update)
   - Log every operation
   - Store who, what, when, why
   - Periodic reconciliation

5. Performance:
   - Partition by date
   - Index on account, date, status
   - Read replicas for queries
   - Hot-cold storage (recent transactions on SSD, old on cheaper storage)

Example Transaction:
```json
{
  "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "from_account": "12345678901234567890",
  "to_account": "09876543210987654321",
  "amount": "1250.5000",
  "currency": "USD",
  "transaction_type": "transfer",
  "status": "completed",
  "created_at": "2025-02-19T10:00:00.000Z",
  "completed_at": "2025-02-19T10:00:00.123Z",
  "metadata": {
    "description": "Payment for invoice #INV-2025-001",
    "initiated_by": "user:john@example.com",
    "ip_address": "203.0.113.45",
    "device": "mobile-app-v2.3"
  }
}
```

Benefits:
✓ Zero financial discrepancies
✓ Complete audit trail
✓ Regulatory compliant
✓ High performance
✓ Fraud detection (analyze transaction patterns)
```

## Common Pitfalls

### Using Wrong Data Types

```
❌ Problem:
Using FLOAT/DOUBLE for money

amount = 0.1 + 0.2
# Result: 0.30000000000000004 (not 0.3!)

Why this fails:
- Floating-point arithmetic is not exact
- Rounding errors accumulate
- Financial calculations become incorrect

✓ Solution:
Use DECIMAL or integer (store cents)

# Using DECIMAL
from decimal import Decimal
amount = Decimal('0.1') + Decimal('0.2')
# Result: Decimal('0.3') - exact!

# Or store as integer (cents)
amount_cents = 10 + 20  # 30 cents = $0.30
```

### Not Handling Character Encoding

```
❌ Problem:
Assuming all text is ASCII

name = "José"
name_bytes = name.encode('ascii')
# UnicodeEncodeError: 'ascii' codec can't encode character '\xe9'

Why this fails:
- Non-English characters exist
- Users have international names
- Data gets corrupted

✓ Solution:
Always use UTF-8

name = "José"
name_bytes = name.encode('utf-8')  # Works!
# Also handles: 中文, العربية, हिन्दी, emoji 😀
```

### Ignoring Data Validation

```
❌ Problem:
Trusting input data without validation

def transfer_money(amount):
    account.balance -= amount
    # What if amount is negative?
    # account.balance would increase!

Why this fails:
- Users make mistakes
- Malicious actors exploit vulnerabilities
- Bad data corrupts database

✓ Solution:
Always validate input

def transfer_money(amount):
    if not isinstance(amount, (int, float, Decimal)):
        raise TypeError("Amount must be numeric")

    if amount <= 0:
        raise ValueError("Amount must be positive")

    if amount > account.balance:
        raise ValueError("Insufficient funds")

    account.balance -= amount
```

### Not Considering Null Values

```
❌ Problem:
Not handling null/None values

total = sum([10, 20, None, 30])
# TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'

Why this fails:
- Databases allow NULL values
- Missing data is common
- Operations fail unexpectedly

✓ Solution:
Handle nulls explicitly

values = [10, 20, None, 30]
total = sum(v for v in values if v is not None)
# Result: 60

# Or use default
def get_age(user):
    return user.get('age') if user.get('age') is not None else 0
```

### Inefficient Data Structures

```
❌ Problem:
Using wrong data structure for the task

# Finding if user exists (using list)
users = ['john', 'jane', 'bob', ...]  # 1 million users
if 'alice' in users:  # O(n) - checks every element!
    print("User exists")

Why this fails:
- Slow for large datasets
- Linear time complexity O(n)
- Wastes CPU

✓ Solution:
Use appropriate data structure

# Use set for membership testing
users = {'john', 'jane', 'bob', ...}  # 1 million users
if 'alice' in users:  # O(1) - instant!
    print("User exists")

# Or use database with index
SELECT EXISTS(SELECT 1 FROM users WHERE username = 'alice')
```

### Not Considering Data Growth

```
❌ Problem:
Designing for current data size only

# Column definition
user_id INT  # Max value: 2,147,483,647

Why this fails:
- What happens at 2.1 billion users?
- Database migration is painful
- Application breaks

✓ Solution:
Plan for growth

user_id BIGINT  # Max: 9,223,372,036,854,775,807
# Or use UUID (practically unlimited)

# Also consider:
- Partitioning (split large tables)
- Archiving (move old data)
- Sharding (distribute across servers)
```

### Storing Redundant Data

```
❌ Problem:
Duplicating data unnecessarily

Orders table:
order_id | customer_name | customer_email | customer_phone | product | price
---------|---------------|----------------|----------------|---------|------
1        | John Doe      | john@email.com | 555-1234       | Widget  | 10.00
2        | John Doe      | john@email.com | 555-1234       | Gadget  | 20.00

Why this fails:
- Wastes storage
- Update anomalies (update in one place, miss others)
- Data inconsistencies

✓ Solution:
Normalize (separate entities)

Customers table:
customer_id | name     | email          | phone
------------|----------|----------------|----------
1           | John Doe | john@email.com | 555-1234

Orders table:
order_id | customer_id | product | price
---------|-------------|---------|------
1        | 1           | Widget  | 10.00
2        | 1           | Gadget  | 20.00
```

### Not Backing Up Data

```
❌ Problem:
No backup strategy

Why this fails:
- Hardware failures
- Software bugs
- Human errors
- Ransomware attacks
- Result: Permanent data loss

✓ Solution:
Implement 3-2-1 backup rule

3: Three copies of data
2: Two different storage types
1: One off-site backup

Example:
- Primary: Production database (SSD)
- Backup 1: Daily snapshots (cloud storage)
- Backup 2: Weekly backups (tape/different region)

Also:
- Test restores regularly
- Automate backups
- Monitor backup success
- Encrypt backups
```

## Quick Reference

### Data Type Selection Guide

| Data                    | SQL Type              | Python Type | Java Type       | Notes                      |
| ----------------------- | --------------------- | ----------- | --------------- | -------------------------- |
| Small integer           | SMALLINT              | int         | short           | -32,768 to 32,767          |
| Integer                 | INTEGER               | int         | int             | -2.1B to 2.1B              |
| Large integer           | BIGINT                | int         | long            | -9.2 quintillion to 9.2 quintillion |
| Money                   | DECIMAL(19,4)         | Decimal     | BigDecimal      | Never use float!           |
| Percentage              | DECIMAL(5,2)          | Decimal     | BigDecimal      | e.g., 99.99%               |
| True/False              | BOOLEAN               | bool        | boolean         |                            |
| Text (short)            | VARCHAR(n)            | str         | String          | Specify max length         |
| Text (long)             | TEXT                  | str         | String          | No max length              |
| Date                    | DATE                  | date        | LocalDate       | No time component          |
| Date and time           | TIMESTAMP             | datetime    | LocalDateTime   | With time                  |
| Date/time with timezone | TIMESTAMP WITH TIME ZONE | datetime | ZonedDateTime  | Always use UTC             |
| Binary data             | BYTEA / BLOB          | bytes       | byte[]          | Images, files              |
| JSON                    | JSON / JSONB          | dict        | JsonNode        | Flexible structure         |
| UUID                    | UUID                  | UUID        | UUID            | Globally unique IDs        |

### Common Data Formats

| Format   | Human-Readable | Size    | Speed  | Use Case                           |
| -------- | -------------- | ------- | ------ | ---------------------------------- |
| JSON     | Yes            | Medium  | Medium | APIs, config files, web apps       |
| XML      | Yes            | Large   | Slow   | Enterprise systems, SOAP           |
| CSV      | Yes            | Small   | Fast   | Tabular data, spreadsheets         |
| YAML     | Yes            | Medium  | Medium | Config files (Docker, K8s)         |
| Protobuf | No             | Smallest| Fastest| gRPC, microservices, mobile        |
| MessagePack | No          | Small   | Fast   | Alternative to JSON (binary)       |
| Avro     | No             | Small   | Fast   | Big data, Hadoop, Kafka            |

### Character Encoding

| Encoding | Bytes/Char | Characters               | Use Case             |
| -------- | ---------- | ------------------------ | -------------------- |
| ASCII    | 1          | 128 (English only)       | Legacy systems       |
| Latin-1  | 1          | 256 (Western European)   | Legacy systems       |
| UTF-8    | 1-4        | All (1.1 million+)       | **Use this!**        |
| UTF-16   | 2-4        | All                      | Windows, Java internals |
| UTF-32   | 4          | All                      | Internal processing  |

### Data Validation Checklist

```
□ Type validation
  - Correct data type (int, string, etc.)
  - Not null (unless allowed)

□ Range validation
  - Minimum value
  - Maximum value
  - Allowed values (enum)

□ Format validation
  - Email format
  - Phone number format
  - Date format
  - URL format

□ Length validation
  - Minimum length
  - Maximum length

□ Business rule validation
  - Relationships valid
  - Constraints satisfied
  - Logical consistency

□ Sanitization
  - Trim whitespace
  - Normalize case
  - Remove special characters (if needed)

□ Security validation
  - No SQL injection
  - No XSS
  - No path traversal
```

### Data Size Estimations

```
Text:
- English character: ~1 byte (UTF-8)
- Chinese character: ~3 bytes (UTF-8)
- Emoji: ~4 bytes (UTF-8)
- Short tweet (280 chars): ~300 bytes
- Page of text: ~2 KB
- Novel: ~1 MB

Images:
- Icon (32x32): ~1 KB
- Thumbnail (150x150): ~10 KB
- Web image (800x600): ~100 KB
- Photo (4000x3000): ~3 MB
- RAW photo: ~25 MB

Audio:
- 1 minute MP3 (128 kbps): ~1 MB
- 1 minute CD quality: ~10 MB
- 3-minute song: ~3 MB (MP3)
- 1 hour podcast: ~50 MB

Video:
- 1 minute 480p: ~10 MB
- 1 minute 1080p: ~50 MB
- 1 minute 4K: ~200 MB
- 2-hour movie (1080p): ~4 GB

Databases:
- Table row (typical): ~1 KB
- 1 million rows: ~1 GB
- User profile: ~1-5 KB
- Transaction record: ~500 bytes
```

## Related Topics

### In This Repository

- **00-foundations/networking-basics/README.md**: How data travels across networks
- **05-backend/databases/README.md**: Storing and querying data
- **05-backend/apis/README.md**: Exchanging data between systems
- **08-security/data-protection/README.md**: Securing sensitive data
- **09-ai-ml/data-engineering/README.md**: Processing large-scale data

### External Resources

**Beginner:**
- "How Computers Work" by Ron White
- "Code: The Hidden Language of Computer Hardware and Software" by Charles Petzold
- Khan Academy: Information Theory

**Intermediate:**
- "Designing Data-Intensive Applications" by Martin Kleppmann
- Database internals: How storage engines work
- Character encoding deep dive

**Advanced:**
- "Database Design for Mere Mortals" by Michael J. Hernandez
- Data modeling best practices
- Distributed data systems

**Tools to Explore:**
- DB Browser for SQLite: Visualize database structure
- JSON formatters/validators: Online tools
- Hex editors: View binary data
- Character encoding converters

---

Understanding data is fundamental to all software development. Every application you build will read, process, store, and transmit data. Master these basics, and you'll make better decisions about how to structure, validate, and protect the information your applications handle.
