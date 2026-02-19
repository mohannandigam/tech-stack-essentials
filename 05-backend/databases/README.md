# Databases

## What is a Database?

A database is an **organized collection of data** that can be easily accessed, managed, and updated. Instead of storing data in files scattered across your system, a database provides a structured way to store information and retrieve it efficiently.

Think of a database as a digital filing cabinet. Just like a physical filing cabinet has drawers, folders, and documents organized in a systematic way, a database organizes data into tables (or collections) with relationships between them, making it easy to find exactly what you need quickly.

Databases handle everything from storing user accounts to tracking orders, managing inventory, recording transactions, and logging events. They're the memory of your application.

## Why Do Databases Matter?

Databases are essential because they:

- **Persist data**: Information survives even when your application restarts or crashes
- **Ensure consistency**: ACID properties guarantee data remains accurate even during failures
- **Enable fast queries**: Indexes and optimizations retrieve data in milliseconds from millions of records
- **Handle concurrency**: Multiple users can read and write simultaneously without conflicts
- **Provide structure**: Schemas enforce data integrity and relationships
- **Scale to demand**: Can grow from kilobytes to petabytes of data

Without a database, you'd lose all data when your server restarts, have no way to efficiently search large datasets, and struggle to keep data consistent across multiple users.

## Simple Analogy

Imagine a library:

**Relational Database (SQL)**:
- Like a well-organized library with a card catalog
- Books (data) are categorized by genre, author, year
- The catalog (indexes) helps you find books instantly
- Relationships: A book can have multiple authors, authors can write multiple books
- Strict rules: Every book must have a title, ISBN, publication date

**Document Database (NoSQL)**:
- Like a digital archive where documents can have different formats
- Some documents have different fields than others
- Flexible: One document might have 5 fields, another might have 20
- Easy to add new information without restructuring everything
- Good for storing varied content (articles, videos, comments)

**Key-Value Store**:
- Like a coat check: You give them your coat (value), they give you a ticket (key)
- Super fast: Show ticket, get coat back instantly
- Simple: No complex searches, just direct lookup

**Graph Database**:
- Like a social network map showing who knows whom
- Focus on relationships rather than the entities themselves
- Easy to answer: "Find friends of friends who like jazz"

## SQL vs NoSQL Decision Tree

```
Start: What kind of data do you have?

├─ Structured, relational data with clear schema?
│  └─ Do you need complex queries with JOINs?
│     ├─ Yes → Use Relational Database (PostgreSQL, MySQL)
│     └─ No → Consider document store if schema might change
│
├─ Hierarchical/nested documents (JSON-like)?
│  └─ Does the schema change frequently?
│     ├─ Yes → Use Document Database (MongoDB)
│     └─ No → Consider relational with JSONB support (PostgreSQL)
│
├─ Simple key-based lookups, caching?
│  └─ Need persistence?
│     ├─ Yes → Use Key-Value Store (Redis with persistence)
│     └─ No → Use In-Memory Cache (Redis, Memcached)
│
├─ Relationship-focused data (social networks, recommendations)?
│  └─ Use Graph Database (Neo4j)
│
└─ Time-series data (metrics, logs, IoT)?
   └─ Use Time-Series Database (InfluxDB, TimescaleDB)
```

**Quick Decision Guide**:

| Your Needs | Choose |
|------------|--------|
| Banking, e-commerce, user accounts | PostgreSQL (relational) |
| Content management, catalogs | MongoDB (document) |
| Session storage, caching | Redis (key-value) |
| Social networks, recommendations | Neo4j (graph) |
| Analytics, logs, metrics | InfluxDB (time-series) |
| Start simple, might change later | PostgreSQL (supports both relational and JSON) |

## Relational Databases (SQL)

### What Are They?

Relational databases organize data into **tables** (relations) with rows (records) and columns (fields). Tables can be linked through **foreign keys**, establishing relationships.

**Core Concepts**:
- **Table**: Collection of related data (e.g., `users`, `orders`)
- **Row**: A single record (e.g., one user)
- **Column**: A field/attribute (e.g., `email`, `created_at`)
- **Primary Key**: Unique identifier for each row (e.g., `user_id`)
- **Foreign Key**: Reference to another table's primary key (e.g., `order.user_id` → `user.id`)

### PostgreSQL

**Why PostgreSQL?**
- Most feature-rich open-source relational database
- ACID compliant (data integrity guaranteed)
- Supports JSON (flexible for semi-structured data)
- Advanced features: full-text search, geospatial data, arrays
- Strong community and ecosystem

**Basic Usage** (Python with SQLAlchemy):

```python
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime

# Connect to database
engine = create_engine('postgresql://user:password@localhost/mydb')
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

# Define models
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: one user has many orders
    orders = relationship('Order', back_populates='user')

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    total = Column(Integer)  # in cents
    status = Column(String(20), default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: each order belongs to one user
    user = relationship('User', back_populates='orders')

# Create tables
Base.metadata.create_all(engine)

# Create user
user = User(username='johndoe', email='john@example.com')
session.add(user)
session.commit()

# Create order for user
order = Order(user_id=user.id, total=9999, status='pending')
session.add(order)
session.commit()

# Query: Get user with their orders
user = session.query(User).filter_by(username='johndoe').first()
print(f"User: {user.username}")
for order in user.orders:
    print(f"  Order {order.id}: ${order.total/100:.2f}")

# Query: Get all pending orders with user info (JOIN)
pending_orders = session.query(Order).join(User).filter(
    Order.status == 'pending'
).all()

for order in pending_orders:
    print(f"Order {order.id} by {order.user.username}")

# Update order status
order = session.query(Order).filter_by(id=1).first()
order.status = 'completed'
session.commit()

# Delete order
session.delete(order)
session.commit()
```

**Raw SQL Queries**:

```python
from sqlalchemy import text

# Raw query with parameters (prevents SQL injection)
result = session.execute(
    text("SELECT * FROM users WHERE username = :username"),
    {"username": "johndoe"}
)
users = result.fetchall()

# Complex query
result = session.execute(text("""
    SELECT u.username, COUNT(o.id) as order_count, SUM(o.total) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.username
    HAVING COUNT(o.id) > 0
    ORDER BY total_spent DESC
"""))

for row in result:
    print(f"{row.username}: {row.order_count} orders, ${row.total_spent/100:.2f}")
```

### Key SQL Concepts

**ACID Properties** (Why relational databases are reliable):

- **Atomicity**: Transactions are all-or-nothing (if one step fails, all steps are rolled back)
- **Consistency**: Data always follows defined rules (constraints, foreign keys)
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Once committed, data persists even if server crashes

**Example Transaction**:

```python
from sqlalchemy import exc

try:
    # Start transaction (automatic with session)
    # Transfer money from user A to user B
    user_a = session.query(User).filter_by(id=1).first()
    user_b = session.query(User).filter_by(id=2).first()

    amount = 50

    if user_a.balance < amount:
        raise ValueError("Insufficient funds")

    # Deduct from A
    user_a.balance -= amount

    # Add to B
    user_b.balance += amount

    # Commit transaction (both updates succeed together)
    session.commit()

except Exception as e:
    # If anything fails, rollback (neither update happens)
    session.rollback()
    print(f"Transaction failed: {e}")
```

**Indexes** (Make queries fast):

```python
from sqlalchemy import Index

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

# Composite index (for queries filtering by multiple columns)
Index('idx_user_created_status', User.created_at, User.status)

# Raw SQL to create index
session.execute(text("""
    CREATE INDEX idx_orders_user_status ON orders (user_id, status);
"""))
```

**When to add indexes**:
- Columns frequently used in WHERE clauses
- Columns used in JOINs
- Columns used in ORDER BY
- Foreign keys

**Don't over-index**:
- Indexes slow down writes (INSERT, UPDATE, DELETE)
- Take up storage space
- Only add if queries are slow

## Document Databases (NoSQL)

### What Are They?

Document databases store data as **documents** (usually JSON-like) in **collections**. Each document can have a different structure—no rigid schema required.

**Core Concepts**:
- **Collection**: Group of documents (similar to table)
- **Document**: A single record in JSON format (similar to row)
- **Field**: Key-value pair in document (similar to column, but flexible)
- **Embedded Documents**: Nested data within a document
- **References**: Link between documents (similar to foreign key, but managed by app)

### MongoDB

**Why MongoDB?**
- Flexible schema (add fields without migrations)
- Handles nested/hierarchical data naturally
- Horizontal scaling (sharding built-in)
- Great for rapid development (schema evolves with app)
- Rich query language

**Basic Usage** (Python with PyMongo):

```python
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['myapp']

# Collections (like tables)
users_collection = db['users']
posts_collection = db['posts']

# Insert document
user = {
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
        "first_name": "John",
        "last_name": "Doe",
        "bio": "Software developer"
    },
    "tags": ["developer", "python", "mongodb"],
    "created_at": datetime.utcnow()
}

result = users_collection.insert_one(user)
user_id = result.inserted_id
print(f"Inserted user with ID: {user_id}")

# Insert post with embedded comments
post = {
    "user_id": user_id,
    "title": "Getting Started with MongoDB",
    "content": "MongoDB is a document database...",
    "comments": [
        {
            "user": "janedoe",
            "text": "Great post!",
            "created_at": datetime.utcnow()
        },
        {
            "user": "bobsmith",
            "text": "Very helpful, thanks!",
            "created_at": datetime.utcnow()
        }
    ],
    "tags": ["mongodb", "nosql", "tutorial"],
    "views": 0,
    "created_at": datetime.utcnow()
}

posts_collection.insert_one(post)

# Find one document
user = users_collection.find_one({"username": "johndoe"})
print(user)

# Find multiple documents with filter
python_posts = posts_collection.find({"tags": "python"})
for post in python_posts:
    print(post["title"])

# Find with multiple conditions
recent_posts = posts_collection.find({
    "created_at": {"$gte": datetime(2024, 1, 1)},
    "tags": {"$in": ["python", "mongodb"]},
    "views": {"$gt": 100}
})

# Update document
users_collection.update_one(
    {"_id": user_id},
    {"$set": {"profile.bio": "Senior Software Developer"}}
)

# Update nested array (add comment to post)
posts_collection.update_one(
    {"_id": post["_id"]},
    {
        "$push": {
            "comments": {
                "user": "alice",
                "text": "Bookmarked for later!",
                "created_at": datetime.utcnow()
            }
        },
        "$inc": {"views": 1}  # Increment views by 1
    }
)

# Delete document
users_collection.delete_one({"username": "johndoe"})

# Delete many documents
posts_collection.delete_many({"views": {"$lt": 10}})
```

**Complex Queries**:

```python
# Aggregation pipeline (like SQL GROUP BY)
pipeline = [
    # Match stage (WHERE)
    {"$match": {"tags": "python"}},

    # Lookup stage (JOIN)
    {
        "$lookup": {
            "from": "users",
            "localField": "user_id",
            "foreignField": "_id",
            "as": "author"
        }
    },

    # Unwind (flatten array)
    {"$unwind": "$author"},

    # Group stage (GROUP BY)
    {
        "$group": {
            "_id": "$author.username",
            "post_count": {"$sum": 1},
            "total_views": {"$sum": "$views"},
            "avg_views": {"$avg": "$views"}
        }
    },

    # Sort stage (ORDER BY)
    {"$sort": {"post_count": -1}},

    # Limit stage (LIMIT)
    {"$limit": 10}
]

results = posts_collection.aggregate(pipeline)
for result in results:
    print(f"{result['_id']}: {result['post_count']} posts, {result['total_views']} total views")
```

**Indexes in MongoDB**:

```python
# Create single field index
users_collection.create_index("username", unique=True)
users_collection.create_index("email", unique=True)

# Compound index
posts_collection.create_index([("user_id", 1), ("created_at", -1)])

# Text index (full-text search)
posts_collection.create_index([("title", "text"), ("content", "text")])

# Use text search
results = posts_collection.find({"$text": {"$search": "mongodb tutorial"}})
```

**Schema Validation** (Optional but recommended):

```python
# Add schema validation to ensure data quality
db.create_collection("users", validator={
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["username", "email", "created_at"],
        "properties": {
            "username": {
                "bsonType": "string",
                "minLength": 3,
                "maxLength": 30
            },
            "email": {
                "bsonType": "string",
                "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            "age": {
                "bsonType": "int",
                "minimum": 0,
                "maximum": 150
            }
        }
    }
})
```

### When to Use MongoDB

**Good for**:
- Rapidly changing schemas
- Hierarchical/nested data (comments on posts on users)
- Catalogs with varying attributes (products with different specs)
- Content management systems
- Real-time analytics
- Logging and event data

**Not ideal for**:
- Complex multi-table JOINs (relational data)
- Transactions across multiple documents (use relational DB)
- Financial data requiring strict ACID (use PostgreSQL)

## Key-Value Stores (Redis)

### What is Redis?

Redis (Remote Dictionary Server) is an **in-memory key-value store** that's extremely fast. It stores data in RAM, making lookups nearly instantaneous.

**Core Concepts**:
- **Key**: Unique identifier (string)
- **Value**: Data associated with key (string, list, set, hash, etc.)
- **Expiration**: Keys can automatically delete after timeout
- **Persistence**: Optional—can save to disk periodically

### Redis Use Cases

**1. Caching** (Most common use):

```python
import redis
import json
from datetime import timedelta

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_user(user_id):
    """Get user with caching"""
    cache_key = f"user:{user_id}"

    # Try cache first
    cached = r.get(cache_key)
    if cached:
        print("Cache hit!")
        return json.loads(cached)

    # Cache miss - fetch from database
    print("Cache miss - querying database")
    user = db.query(User).filter_by(id=user_id).first()

    if user:
        # Store in cache for 1 hour
        r.setex(
            cache_key,
            timedelta(hours=1),
            json.dumps(user.to_dict())
        )

    return user.to_dict() if user else None

# Invalidate cache on update
def update_user(user_id, data):
    """Update user and invalidate cache"""
    user = db.query(User).filter_by(id=user_id).first()

    # Update database
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()

    # Invalidate cache
    r.delete(f"user:{user_id}")

    return user
```

**2. Session Storage**:

```python
import secrets

def create_session(user_id, user_data):
    """Create session in Redis"""
    session_id = secrets.token_urlsafe(32)
    session_key = f"session:{session_id}"

    # Store session data
    r.hset(session_key, mapping={
        "user_id": user_id,
        "username": user_data["username"],
        "role": user_data["role"]
    })

    # Set expiration (30 minutes)
    r.expire(session_key, timedelta(minutes=30))

    return session_id

def get_session(session_id):
    """Retrieve session from Redis"""
    session_key = f"session:{session_id}"

    # Get all fields
    session_data = r.hgetall(session_key)

    if not session_data:
        return None

    # Refresh expiration on access
    r.expire(session_key, timedelta(minutes=30))

    return session_data

def destroy_session(session_id):
    """Delete session"""
    r.delete(f"session:{session_id}")
```

**3. Rate Limiting**:

```python
def check_rate_limit(user_id, max_requests=100, window_seconds=3600):
    """Rate limit: max_requests per window_seconds"""
    key = f"rate_limit:{user_id}"

    # Increment counter
    current = r.incr(key)

    # Set expiration on first request
    if current == 1:
        r.expire(key, window_seconds)

    # Check if over limit
    if current > max_requests:
        ttl = r.ttl(key)  # Time until reset
        return False, ttl
    else:
        return True, max_requests - current

# Usage
allowed, remaining = check_rate_limit("user123")
if not allowed:
    return {"error": f"Rate limit exceeded. Try again in {remaining}s"}, 429
```

**4. Pub/Sub (Real-time messaging)**:

```python
import threading

# Publisher
def publish_notification(channel, message):
    """Publish message to channel"""
    r.publish(channel, json.dumps(message))

# Subscriber
def listen_to_notifications(channel):
    """Listen for messages on channel"""
    pubsub = r.pubsub()
    pubsub.subscribe(channel)

    print(f"Listening to {channel}...")
    for message in pubsub.listen():
        if message['type'] == 'message':
            data = json.loads(message['data'])
            print(f"Received: {data}")
            # Process notification

# Example: Real-time notifications
def send_notification(user_id, notification):
    """Send notification to user"""
    publish_notification(f"user:{user_id}:notifications", {
        "type": "notification",
        "message": notification,
        "timestamp": datetime.utcnow().isoformat()
    })

# In separate thread or process
listener_thread = threading.Thread(
    target=listen_to_notifications,
    args=("user:123:notifications",)
)
listener_thread.start()
```

**5. Leaderboards (Sorted Sets)**:

```python
def add_score(user_id, score):
    """Add or update user score"""
    r.zadd("leaderboard", {user_id: score})

def get_leaderboard(limit=10):
    """Get top players"""
    # Get top scores (descending)
    top_players = r.zrevrange("leaderboard", 0, limit-1, withscores=True)

    return [
        {"user_id": user_id, "score": int(score)}
        for user_id, score in top_players
    ]

def get_rank(user_id):
    """Get user's rank"""
    rank = r.zrevrank("leaderboard", user_id)
    return rank + 1 if rank is not None else None

def get_user_score(user_id):
    """Get user's score"""
    score = r.zscore("leaderboard", user_id)
    return int(score) if score else 0

# Usage
add_score("user123", 1500)
add_score("user456", 2000)
add_score("user789", 1800)

print(get_leaderboard(10))
# [{'user_id': 'user456', 'score': 2000}, {'user_id': 'user789', 'score': 1800}, ...]

print(f"user123 rank: {get_rank('user123')}")
# user123 rank: 3
```

**6. Distributed Locks**:

```python
from redis.lock import Lock

def process_payment(order_id):
    """Process payment with distributed lock"""
    lock = r.lock(f"lock:payment:{order_id}", timeout=10)

    # Try to acquire lock
    if lock.acquire(blocking=False):
        try:
            # Critical section - only one process can execute
            order = db.query(Order).filter_by(id=order_id).first()

            if order.status == 'paid':
                return {"error": "Already paid"}, 400

            # Process payment
            charge_credit_card(order)

            order.status = 'paid'
            db.session.commit()

            return {"message": "Payment processed"}

        finally:
            # Always release lock
            lock.release()
    else:
        return {"error": "Payment already being processed"}, 409
```

### When to Use Redis

**Good for**:
- Caching frequently accessed data
- Session storage
- Real-time leaderboards
- Rate limiting
- Pub/sub messaging
- Queue management
- Temporary data

**Not ideal for**:
- Primary data storage (use with persistence cautiously)
- Complex queries
- Large datasets that don't fit in RAM
- Data requiring strict ACID guarantees

## ORMs (Object-Relational Mappers)

### What is an ORM?

An ORM translates between **objects** in your programming language and **tables** in your database. Instead of writing SQL, you work with Python/JavaScript objects.

**Benefits**:
- Write code in your programming language (not SQL)
- Prevent SQL injection (automatic parameterization)
- Database-agnostic (switch databases without rewriting queries)
- Relationships handled automatically (lazy loading, eager loading)

**Drawbacks**:
- Performance overhead
- Complex queries can be inefficient
- Abstracts away database details (good and bad)

### SQLAlchemy (Python)

```python
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True)

    posts = relationship('Post', back_populates='author')

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    user_id = Column(Integer, ForeignKey('users.id'))

    author = relationship('User', back_populates='posts')

# Create, read, update, delete (CRUD)
engine = create_engine('postgresql://localhost/mydb')
Session = sessionmaker(bind=engine)
session = Session()

# Create
user = User(username='johndoe')
session.add(user)
session.commit()

# Read
user = session.query(User).filter_by(username='johndoe').first()

# Update
user.username = 'john_doe'
session.commit()

# Delete
session.delete(user)
session.commit()
```

### When to Use Raw SQL vs ORM

**Use ORM for**:
- CRUD operations
- Simple queries
- Rapid development
- Prototyping

**Use Raw SQL for**:
- Complex queries with multiple JOINs
- Performance-critical operations
- Database-specific features
- Bulk operations

```python
# ORM (easy but potentially slow)
users = session.query(User).join(Post).filter(Post.created_at > '2024-01-01').all()

# Raw SQL (more control)
users = session.execute(text("""
    SELECT u.* FROM users u
    INNER JOIN posts p ON u.id = p.user_id
    WHERE p.created_at > :date
"""), {"date": "2024-01-01"}).fetchall()
```

## Query Optimization

### N+1 Query Problem

**Problem**: Making separate queries for each related record.

```python
# BAD - N+1 queries
users = session.query(User).all()  # 1 query
for user in users:
    print(user.posts)  # N queries (one per user)

# GOOD - 1 query with JOIN
from sqlalchemy.orm import joinedload

users = session.query(User).options(joinedload(User.posts)).all()  # 1 query
for user in users:
    print(user.posts)  # No additional queries
```

### Use Indexes

```python
# Slow query (full table scan)
user = session.query(User).filter_by(email='john@example.com').first()

# Fast query (index on email column)
class User(Base):
    email = Column(String(120), unique=True, index=True)

# Now the query uses index
```

### Select Only What You Need

```python
# BAD - fetches all columns
users = session.query(User).all()

# GOOD - fetch only needed columns
usernames = session.query(User.username).all()

# Even better with load_only
from sqlalchemy.orm import load_only

users = session.query(User).options(load_only(User.username, User.email)).all()
```

### Use Pagination

```python
# BAD - fetch millions of rows
all_users = session.query(User).all()

# GOOD - paginate
page = 1
per_page = 20
users = session.query(User).offset((page-1) * per_page).limit(per_page).all()
```

### Explain Query Plans

```python
# PostgreSQL - see query execution plan
from sqlalchemy import text

result = session.execute(text("EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com'"))
print(result.fetchall())
```

## Best Practices

### Safety and Security

**1. Prevent SQL Injection**

```python
# NEVER do this (SQL injection vulnerability)
username = request.args.get('username')
query = f"SELECT * FROM users WHERE username = '{username}'"
result = session.execute(text(query))  # DANGER!

# ALWAYS use parameterized queries
username = request.args.get('username')
result = session.execute(
    text("SELECT * FROM users WHERE username = :username"),
    {"username": username}
)

# Or use ORM (automatic parameterization)
user = session.query(User).filter_by(username=username).first()
```

**2. Hash Sensitive Data**

```python
from werkzeug.security import generate_password_hash

# Hash passwords before storing
user = User(
    username='johndoe',
    password_hash=generate_password_hash('password123')
)
session.add(user)
session.commit()
```

**3. Encrypt Data at Rest**

```python
from cryptography.fernet import Fernet

# Generate key (store securely, not in code)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt before storing
user.ssn_encrypted = cipher.encrypt(ssn.encode())

# Decrypt when retrieving
ssn = cipher.decrypt(user.ssn_encrypted).decode()
```

**4. Connection Pooling**

```python
# Configure connection pool
engine = create_engine(
    'postgresql://localhost/mydb',
    pool_size=10,        # Number of connections to maintain
    max_overflow=20,     # Additional connections if needed
    pool_timeout=30,     # Wait 30 seconds for connection
    pool_recycle=3600    # Recycle connections after 1 hour
)
```

### Quality Assurance

**Testing Strategies**

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db_session():
    """Create test database session"""
    # Use in-memory SQLite for tests
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    yield session

    session.close()

def test_create_user(db_session):
    """Test user creation"""
    user = User(username='testuser', email='test@example.com')
    db_session.add(user)
    db_session.commit()

    # Verify user was created
    retrieved_user = db_session.query(User).filter_by(username='testuser').first()
    assert retrieved_user is not None
    assert retrieved_user.email == 'test@example.com'

def test_user_posts_relationship(db_session):
    """Test user-post relationship"""
    user = User(username='testuser')
    db_session.add(user)
    db_session.commit()

    post = Post(title='Test Post', user_id=user.id)
    db_session.add(post)
    db_session.commit()

    # Verify relationship
    assert len(user.posts) == 1
    assert user.posts[0].title == 'Test Post'

def test_unique_constraint(db_session):
    """Test unique constraint on email"""
    user1 = User(username='user1', email='test@example.com')
    db_session.add(user1)
    db_session.commit()

    # Try to create another user with same email
    user2 = User(username='user2', email='test@example.com')
    db_session.add(user2)

    with pytest.raises(Exception):  # Should raise IntegrityError
        db_session.commit()
```

### Logging and Observability

```python
import logging
import time

# Enable SQLAlchemy query logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Log slow queries
def log_slow_queries(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = f(*args, **kwargs)
        duration = (time.time() - start) * 1000

        if duration > 1000:  # Log queries slower than 1 second
            logger.warning(f"Slow query detected: {f.__name__}", extra={
                "duration_ms": duration,
                "function": f.__name__
            })

        return result
    return wrapper

@log_slow_queries
def get_user_with_posts(user_id):
    return session.query(User).options(joinedload(User.posts)).filter_by(id=user_id).first()
```

## Common Pitfalls

### 1. Not Using Connection Pooling

**Problem**: Creating new connection for every request (slow).

**Solution**: Use connection pool (reuse connections).

```python
# Bad - creates new connection each time
engine = create_engine('postgresql://localhost/mydb')

# Good - connection pool
engine = create_engine(
    'postgresql://localhost/mydb',
    pool_size=10,
    max_overflow=20
)
```

### 2. Not Closing Database Connections

**Problem**: Exhausting available connections.

**Solution**: Use context managers.

```python
# Bad - might not close
session = Session()
user = session.query(User).first()

# Good - always closes
with Session() as session:
    user = session.query(User).first()
```

### 3. Storing Passwords in Plaintext

**Problem**: Database breach exposes all passwords.

**Solution**: Always hash passwords.

```python
# Never do this
user.password = "password123"

# Always do this
user.password_hash = generate_password_hash("password123")
```

### 4. Not Using Transactions

**Problem**: Partial updates leave data inconsistent.

**Solution**: Use transactions for multi-step operations.

```python
# Bad - if second update fails, first is already committed
user.balance -= 100
session.commit()
recipient.balance += 100
session.commit()

# Good - both succeed or both fail
try:
    user.balance -= 100
    recipient.balance += 100
    session.commit()  # Atomic
except:
    session.rollback()
```

### 5. Ignoring Database Constraints

**Problem**: Application assumes data is valid, but database has bad data.

**Solution**: Use database constraints.

```python
class User(Base):
    email = Column(String(120), unique=True, nullable=False)  # Enforced by database
    age = Column(Integer, CheckConstraint('age >= 0'))  # Can't be negative
```

## Real-World Use Cases

### E-Commerce Platform

**Database Choice**: PostgreSQL (relational) + Redis (caching)

**Why**:
- Complex relationships (users, orders, products, inventory)
- ACID critical (payments, inventory updates)
- Need for transactions

**Schema**:
```python
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    orders = relationship('Order')

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)  # in cents
    stock = Column(Integer, default=0)

class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    total = Column(Integer, nullable=False)
    status = Column(String, default='pending')
    items = relationship('OrderItem')

class OrderItem(Base):
    __tablename__ = 'order_items'
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Integer)  # Store price at time of purchase
```

### Content Management System

**Database Choice**: MongoDB (document)

**Why**:
- Flexible schema (different content types have different fields)
- Hierarchical data (articles with nested comments)
- Rapidly changing requirements

**Schema**:
```python
# Articles collection
{
    "_id": ObjectId("..."),
    "title": "Introduction to MongoDB",
    "slug": "intro-to-mongodb",
    "author_id": ObjectId("..."),
    "content": "MongoDB is a document database...",
    "type": "article",  # Could be "article", "video", "podcast"
    "metadata": {
        "reading_time": 5,
        "difficulty": "beginner"
    },
    "tags": ["mongodb", "database", "tutorial"],
    "comments": [
        {
            "user_id": ObjectId("..."),
            "text": "Great article!",
            "created_at": ISODate("2024-01-15")
        }
    ],
    "published_at": ISODate("2024-01-10"),
    "updated_at": ISODate("2024-01-12")
}

# Video content (different schema, same collection)
{
    "_id": ObjectId("..."),
    "title": "MongoDB Tutorial Video",
    "slug": "mongodb-tutorial-video",
    "type": "video",
    "video_url": "https://example.com/video.mp4",
    "duration_seconds": 600,
    "transcript": "In this video...",
    # No "content" field - videos don't need it
    "tags": ["mongodb", "video"]
}
```

### Real-Time Analytics Dashboard

**Database Choice**: InfluxDB (time-series) + Redis (real-time)

**Why**:
- Time-stamped metrics
- High write throughput
- Automatic retention policies

### Social Network

**Database Choice**: Neo4j (graph) + PostgreSQL (user data)

**Why**:
- Relationship-focused (friends, followers, recommendations)
- Complex graph queries ("friends of friends who like X")
- PostgreSQL for structured user profiles

## Quick Reference

| Database Type | Use Case | Example |
|---------------|----------|---------|
| **PostgreSQL** | Structured data, relationships, ACID | User accounts, orders, inventory |
| **MongoDB** | Flexible schema, nested data | Content management, catalogs |
| **Redis** | Caching, sessions, real-time | Session storage, leaderboards, rate limiting |
| **Neo4j** | Graph data, relationships | Social networks, recommendations |
| **InfluxDB** | Time-series data | Metrics, logs, IoT sensor data |

| Operation | Optimization |
|-----------|-------------|
| **Slow reads** | Add indexes on filtered columns |
| **Slow JOINs** | Add indexes on foreign keys |
| **N+1 queries** | Use eager loading (joinedload) |
| **Large result sets** | Use pagination |
| **Repeated queries** | Cache results in Redis |
| **Slow writes** | Remove unnecessary indexes |
| **Locking issues** | Use appropriate isolation level |

## Next Steps

Now that you understand databases, continue to:

- **[Message Queues](../message-queues/README.md)**: Learn how to handle asynchronous operations and decouple services
- **[REST APIs](../rest-apis/README.md)**: See how databases power API endpoints
- **[Authentication & Authorization](../authentication-authorization/README.md)**: Understand how to store user credentials and sessions securely

## Related Topics

- **02-architectures/microservices**: Database per service pattern
- **06-infrastructure/docker**: Running databases in containers
- **07-cloud**: Managed database services (RDS, DynamoDB, Cloud SQL)
- **08-security**: Database security, encryption, access control
- **09-ai-ml**: Databases for ML (feature stores, vector databases)

---

**Remember**: Your database is the heart of your application. Choose wisely based on your data structure and access patterns. Start simple (PostgreSQL is a great default), and only add complexity (multiple databases, caching layers) when you have clear performance or scalability needs.
