# Database Patterns

## What is it?

Database patterns are proven strategies for organizing, accessing, and managing data in software systems. They define how applications store information, retrieve it efficiently, maintain consistency, and scale as data grows. These patterns encompass everything from choosing the right type of database to deciding how data should be split across multiple machines.

Think of database patterns as blueprints for data management — they help engineers make informed decisions about storage technology, data structure, access patterns, and scaling strategies based on specific application needs.

## Simple Analogy

Imagine you're organizing a massive library system across an entire city:

- **SQL databases** are like traditional libraries with strict cataloging systems (Dewey Decimal) — everything has a specific place and relationships between books are carefully tracked
- **NoSQL databases** are like specialty stores — a music store organizes differently than a bookstore, each optimized for their specific type of content
- **Sharding** is like having multiple library branches — fiction in one building, non-fiction in another, distributed by some logical rule
- **Replication** is like having backup copies of popular books in multiple locations so more people can read them simultaneously
- **Connection pooling** is like having a limited number of checkout counters that get reused efficiently rather than building a new counter for every visitor

Each organizational strategy has trade-offs: centralized vs distributed, strict rules vs flexibility, consistency vs availability.

## Why Does it Matter?

Database decisions have profound impacts on:

**Performance**: Poor database patterns can make applications slow, expensive, and frustrating for users. The difference between a 50ms query and a 5-second query is often choosing the right pattern.

**Scalability**: As applications grow from hundreds to millions of users, early database decisions determine whether you can scale smoothly or need expensive rewrites.

**Reliability**: Data loss, inconsistency, or downtime can destroy user trust and business value. Proper patterns prevent these failures.

**Cost**: The wrong database choice can multiply infrastructure costs by 10x or more. A simple pattern change can save millions annually.

**Development Speed**: Good patterns make features easier to build. Bad patterns force developers to work around limitations constantly.

Real-world impact:
- An e-commerce site choosing the right database pattern can handle Black Friday traffic without crashing
- A social media app using proper caching patterns saves millions in database costs
- A financial system using appropriate consistency patterns prevents double-charging customers
- An IoT platform using time-series databases can store sensor data efficiently at massive scale

## How it Works

### The Database Selection Framework

Choosing database patterns follows a decision tree based on your requirements:

```
1. Analyze Your Data
   ├─> Structured and relational? → Consider SQL
   ├─> Document-oriented? → Consider Document Stores
   ├─> Key-based lookups? → Consider Key-Value Stores
   ├─> Complex relationships? → Consider Graph Databases
   └─> Time-stamped events? → Consider Time-Series Databases

2. Analyze Your Access Patterns
   ├─> Complex queries across relations? → SQL
   ├─> Simple lookups by ID? → NoSQL
   ├─> Full-text search needed? → Search Engines
   └─> Real-time aggregations? → Specialized stores

3. Analyze Your Scale
   ├─> Single server sufficient? → Traditional databases
   ├─> Need horizontal scaling? → Sharding + NoSQL
   └─> Need geographic distribution? → Multi-region replication

4. Analyze Your Consistency Needs
   ├─> Strong consistency required? → SQL with ACID
   ├─> Eventual consistency acceptable? → NoSQL with BASE
   └─> Mixed requirements? → Polyglot Persistence
```

### The CAP Theorem

The CAP theorem states that distributed databases can only guarantee two of three properties:

- **Consistency (C)**: Every read receives the most recent write
- **Availability (A)**: Every request gets a response (success or failure)
- **Partition Tolerance (P)**: System continues operating despite network failures

```
Network Partition Occurs
          │
          ├─> Choose Consistency (CP)
          │   ├─> System refuses some requests
          │   ├─> Ensures data accuracy
          │   └─> Example: Banking transactions
          │
          └─> Choose Availability (AP)
              ├─> System responds to all requests
              ├─> May return stale data
              └─> Example: Social media feeds
```

Since network partitions are inevitable in distributed systems, the real choice is between **CP (Consistency + Partition Tolerance)** and **AP (Availability + Partition Tolerance)**.

### BASE vs ACID

**ACID** (SQL databases):
- **Atomicity**: All parts of a transaction succeed or all fail
- **Consistency**: Data moves from one valid state to another
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Completed transactions persist even after crashes

**BASE** (NoSQL databases):
- **Basically Available**: System appears to work most of the time
- **Soft state**: Data may change without input (due to eventual consistency)
- **Eventually consistent**: Data will become consistent given enough time

```
ACID Example (Bank Transfer):
1. Withdraw $100 from Account A
2. Deposit $100 to Account B
→ Both happen or neither happens (atomic)
→ Total money stays same (consistent)
→ Other transactions can't see partial state (isolated)
→ Changes survive server crash (durable)

BASE Example (Social Media Likes):
1. User clicks "like" on post
2. System immediately shows +1 like to user
3. System propagates change to replicas over next few seconds
→ User sees immediate response (available)
→ Different users might see different counts briefly (soft state)
→ All users eventually see same count (eventually consistent)
```

## Key Concepts

### SQL Databases

**What**: Relational databases using structured schemas and SQL query language.

**Strengths**:
- Strong consistency and ACID guarantees
- Complex queries with JOINs across tables
- Well-understood and mature technology
- Excellent for transactional data

**Examples**: PostgreSQL, MySQL, Oracle, SQL Server

**Best For**: Financial systems, inventory management, user accounts, orders

### NoSQL Databases

**What**: Non-relational databases optimized for specific data models and access patterns.

**Types**:

1. **Document Stores** (MongoDB, Couchbase, DynamoDB)
   - Store JSON-like documents
   - Flexible schemas
   - Good for content management, catalogs, user profiles

2. **Key-Value Stores** (Redis, Memcached, DynamoDB)
   - Simple key-based lookups
   - Extremely fast reads/writes
   - Good for caching, sessions, real-time data

3. **Column-Family Stores** (Cassandra, HBase)
   - Store data in columns rather than rows
   - Optimized for analytical queries
   - Good for time-series, analytics, IoT data

4. **Graph Databases** (Neo4j, Amazon Neptune)
   - Store nodes and relationships
   - Optimized for connected data traversal
   - Good for social networks, recommendations, fraud detection

### NewSQL Databases

**What**: Modern databases that provide SQL interface with NoSQL scalability.

**Examples**: CockroachDB, Google Spanner, VoltDB

**Benefits**: ACID guarantees + horizontal scaling + SQL familiarity

**Best For**: Applications needing both consistency and massive scale

### Polyglot Persistence

**What**: Using multiple database types within a single application, each optimized for specific use cases.

**Why**: No single database excels at everything. Different data has different requirements.

**Example E-commerce Architecture**:
```
Product Catalog → MongoDB (flexible schemas for varied products)
User Sessions → Redis (fast key-value for temporary data)
Orders → PostgreSQL (ACID transactions for financial data)
Search → Elasticsearch (full-text search optimization)
Recommendations → Neo4j (graph relationships between products/users)
Metrics → InfluxDB (time-series for performance monitoring)
```

### Database-per-Service Pattern

**What**: In microservices, each service owns its database — no shared databases.

**Benefits**:
- Services are loosely coupled
- Teams can choose optimal database for their service
- Schema changes don't affect other services
- Services can scale independently

**Challenges**:
- Data duplication across services
- Distributed transactions become complex
- Must use event-driven patterns for consistency

**When to Use**: Microservices architectures, team autonomy needed

**When to Avoid**: Small applications, strong transactional requirements

### Shared Database Anti-Pattern

**What**: Multiple services accessing the same database directly.

**Why it's Problematic**:
- Tight coupling between services
- Schema changes break multiple services
- Cannot scale services independently
- Database becomes a single point of failure
- Performance bottleneck

**Exception**: May be acceptable for read-only access via views

### Sharding Strategies

**What**: Splitting data across multiple database instances horizontally.

**Why**: Single database has limits — sharding enables linear scaling.

#### Hash-Based Sharding

**How it Works**: Apply hash function to a key (like user_id), result determines shard.

```
user_id: 12345
hash(12345) % 4 = 1
→ Store in Shard 1

user_id: 67890
hash(67890) % 4 = 3
→ Store in Shard 3
```

**Pros**:
- Even data distribution
- Simple implementation
- Predictable shard location

**Cons**:
- Difficult to add/remove shards (requires rehashing)
- Range queries span all shards
- Related data may be on different shards

**Best For**: Even distribution needed, point queries dominant

#### Range-Based Sharding

**How it Works**: Divide data into ranges, each shard handles specific range.

```
Shard 1: user_id 1-250,000
Shard 2: user_id 250,001-500,000
Shard 3: user_id 500,001-750,000
Shard 4: user_id 750,001-1,000,000
```

**Pros**:
- Range queries efficient
- Easy to add new shards
- Related data often co-located

**Cons**:
- Uneven distribution (hot spots)
- Requires monitoring and rebalancing
- Key selection critical

**Best For**: Range queries common, time-series data, sequential IDs

#### Geographic (Geo-Based) Sharding

**How it Works**: Data distributed by geographic location.

```
US-East Shard: Users in East Coast states
US-West Shard: Users in West Coast states
EU Shard: Users in European countries
Asia Shard: Users in Asian countries
```

**Pros**:
- Low latency (data close to users)
- Regulatory compliance (data residency)
- Natural isolation

**Cons**:
- Uneven distribution
- Cross-region queries expensive
- Complex routing logic

**Best For**: Global applications, compliance requirements, latency-sensitive

#### Directory-Based Sharding

**How it Works**: Lookup table maps keys to shards dynamically.

```
Lookup Service:
user_id: 12345 → Shard 2
user_id: 67890 → Shard 1
user_id: 11111 → Shard 3
```

**Pros**:
- Flexible — easily rebalance data
- Support complex routing logic
- Can group related data

**Cons**:
- Lookup service is single point of failure
- Extra network hop
- Lookup table can become large

**Best For**: Complex sharding rules, need for rebalancing

### Replication Patterns

**What**: Creating copies of data across multiple database instances.

**Why**: Increase availability, fault tolerance, read performance, and geographic distribution.

#### Master-Slave (Primary-Replica) Replication

**How it Works**:
```
Write → Master (primary)
         ├─> Replica 1 (read-only)
         ├─> Replica 2 (read-only)
         └─> Replica 3 (read-only)

Reads → Any replica
```

**Characteristics**:
- All writes go to master
- Changes replicate to slaves asynchronously or synchronously
- Reads distributed across replicas
- Master failure requires promotion of a slave

**Pros**:
- Simple to implement
- Scales read operations
- Clear consistency model

**Cons**:
- Master is single point of failure for writes
- Replication lag can cause stale reads
- Cannot scale writes

**Best For**: Read-heavy workloads, reporting, analytics

#### Multi-Master (Active-Active) Replication

**How it Works**:
```
Master 1 ←→ Master 2
   ↕           ↕
Master 3 ←→ Master 4

Writes → Any master
Reads → Any master
Changes sync bidirectionally
```

**Characteristics**:
- All nodes accept writes
- Changes propagate to other masters
- Conflict resolution needed
- High availability for writes

**Pros**:
- No single point of failure
- Scales both reads and writes
- Low latency (write to nearest master)

**Cons**:
- Complex conflict resolution
- Potential for data conflicts
- Eventual consistency

**Best For**: Global applications, high availability requirements

#### Read Replicas

**What**: Special case of master-slave optimized for read scaling.

**Common Uses**:
- Analytics queries (don't impact production)
- Reporting dashboards
- Search indexes
- Geographic read distribution

**Configuration**:
```
Production Master (transactional writes)
    ├─> Analytics Replica (complex queries)
    ├─> EU Replica (European users)
    └─> ASIA Replica (Asian users)
```

### Connection Pooling

**What**: Reusing database connections instead of creating new ones for each request.

**Why it Matters**:
- Creating connections is expensive (authentication, SSL handshake, memory allocation)
- Each connection consumes server resources
- Connection limits can cause denial of service

**How it Works**:
```
Application Thread 1 ──┐
Application Thread 2 ──┼──> Connection Pool (10 connections) ──> Database
Application Thread 3 ──┘         [Conn1][Conn2]...[Conn10]

1. Thread requests connection from pool
2. If available: reuse existing connection
3. If none available: wait or create new (up to max)
4. Thread returns connection to pool when done
```

**Key Settings**:
- **Min Pool Size**: Connections kept alive even when idle
- **Max Pool Size**: Maximum concurrent connections
- **Connection Timeout**: How long to wait for available connection
- **Idle Timeout**: When to close unused connections

### Schema Migrations and Versioning

**What**: Managing database schema changes over time in a controlled, versioned way.

**Why it Matters**:
- Enables safe schema evolution
- Tracks history of changes
- Supports rollback if needed
- Coordinates changes across environments

**Common Patterns**:

1. **Expand-Contract Pattern** (Zero-Downtime Migrations)
```
Phase 1 (Expand): Add new column, keep old column
  → Deploy application code that writes to both columns
  → Backfill data to new column

Phase 2 (Contract): Remove old column
  → Deploy application code that uses only new column
  → Drop old column in database
```

2. **Blue-Green Database Migration**
```
Blue (old schema) ← Active traffic
Green (new schema) ← Replicate and transform data
→ Test green thoroughly
→ Switch traffic to green
→ Keep blue as backup for rollback
```

### Query Optimization

**What**: Techniques to make database queries faster and more efficient.

**Common Techniques**:

1. **Indexing**: Create indexes on frequently queried columns
2. **Query Rewriting**: Optimize SQL for better execution plans
3. **Denormalization**: Duplicate data to avoid joins
4. **Caching**: Store query results in memory
5. **Partitioning**: Split large tables for parallel access
6. **Connection Pooling**: Reduce connection overhead

## Database Types Deep Dive

### Time-Series Databases

**What**: Databases optimized for time-stamped data points.

**Examples**: InfluxDB, TimescaleDB (PostgreSQL extension), Prometheus

**Characteristics**:
- Write-optimized for continuous data ingestion
- Automatic downsampling and retention policies
- Time-based queries and aggregations
- Compression for historical data

**Best For**:
- IoT sensor data
- Application metrics and monitoring
- Financial tick data
- Server and infrastructure metrics

**When to Avoid**:
- Data not primarily time-based
- Need complex transactions
- Frequent updates to historical data

### Graph Databases

**What**: Databases that store nodes (entities) and edges (relationships).

**Examples**: Neo4j, Amazon Neptune, ArangoDB

**Characteristics**:
- Traverse relationships efficiently
- Query language focused on patterns (Cypher, Gremlin)
- Indexes on nodes and relationships
- Visual query builders

**Best For**:
- Social networks (friends, followers, connections)
- Recommendation engines (people who bought X also bought Y)
- Fraud detection (unusual patterns in relationships)
- Knowledge graphs (entities and their connections)

**When to Avoid**:
- Data doesn't have complex relationships
- Simple aggregations and reports
- Need for complex transactions

### Search Engines

**What**: Specialized databases for full-text search and analytics.

**Examples**: Elasticsearch, Apache Solr, Algolia

**Characteristics**:
- Inverted indexes for fast text search
- Fuzzy matching and relevance scoring
- Faceted search and filtering
- Real-time indexing

**Best For**:
- Product search (e-commerce)
- Log analysis and monitoring
- Content search (documents, articles)
- Typeahead and autocomplete

**When to Avoid**:
- Primary data store (not durable)
- Complex transactions needed
- Strong consistency required

### Document Stores

**What**: Databases that store semi-structured documents (usually JSON).

**Examples**: MongoDB, Couchbase, Amazon DynamoDB

**Characteristics**:
- Flexible schemas (documents can vary)
- Nested data structures
- Horizontal scaling
- Document-level operations

**Best For**:
- Content management systems
- Product catalogs (varied attributes)
- User profiles (different fields per user)
- Mobile app backends

**When to Avoid**:
- Complex joins needed frequently
- Strong transactional guarantees required
- Data highly relational

### Key-Value Stores

**What**: Simplest NoSQL model — store and retrieve values by unique keys.

**Examples**: Redis, Memcached, Amazon DynamoDB, Riak

**Characteristics**:
- Extremely fast (often in-memory)
- Simple operations (GET, SET, DELETE)
- Horizontal scaling
- Optional persistence

**Best For**:
- Caching (session data, API responses)
- Rate limiting counters
- Real-time leaderboards
- Temporary data storage

**When to Avoid**:
- Complex queries needed
- Range scans frequent
- Strong consistency across multiple keys

## Use Cases Across Domains

### E-commerce Platform

**Challenge**: Handle product catalog, inventory, orders, user sessions, and search.

**Pattern Solution**:
```
Product Catalog
  → MongoDB (flexible schemas for varied products)
  → Why: Different product types have different attributes

Shopping Cart & Sessions
  → Redis (fast, temporary data)
  → Why: High-speed access, data expires automatically

Orders & Payments
  → PostgreSQL (ACID transactions)
  → Why: Financial data requires consistency

Product Search
  → Elasticsearch (full-text search)
  → Why: Complex search queries, relevance ranking

Inventory Management
  → PostgreSQL with read replicas
  → Why: Strong consistency, reporting doesn't impact production

Product Recommendations
  → Neo4j (relationship traversal)
  → Why: "Customers who bought X also bought Y"
```

**Sharding Strategy**: Shard MongoDB by product category, PostgreSQL by user region

**Replication**: Multi-region read replicas for global performance

### Social Media Application

**Challenge**: Store user profiles, posts, relationships, feeds, and real-time interactions.

**Pattern Solution**:
```
User Profiles
  → PostgreSQL (structured user data)
  → Why: ACID for sensitive user information

User Posts & Comments
  → MongoDB (flexible content types)
  → Why: Varied post formats (text, images, videos)

Social Graph (friendships)
  → Neo4j (relationship queries)
  → Why: "Friends of friends", connection suggestions

News Feeds (cached)
  → Redis (fast access to recent posts)
  → Why: Pre-computed feeds for instant loading

User Sessions
  → Redis (ephemeral data)
  → Why: Temporary, high-frequency access

Post Search
  → Elasticsearch (content discovery)
  → Why: Search posts by keywords, hashtags
```

**Sharding Strategy**: Hash-based sharding by user_id for even distribution

**Replication**: Multi-master for posts (eventual consistency acceptable)

### IoT Sensor Platform

**Challenge**: Ingest millions of sensor readings per second, store historical data, enable real-time queries.

**Pattern Solution**:
```
Real-Time Sensor Data
  → InfluxDB (time-series optimized)
  → Why: Efficient storage and queries for time-stamped data

Sensor Metadata (device info)
  → PostgreSQL (relational data)
  → Why: Structured device configuration

Real-Time Aggregations
  → Redis (in-memory processing)
  → Why: Fast calculations for dashboards

Historical Analytics
  → InfluxDB with downsampling
  → Why: Compress old data, maintain useful aggregates

Alerting Rules
  → PostgreSQL (configuration)
  → Why: Transactional updates to alert conditions
```

**Sharding Strategy**: Range-based sharding by timestamp (recent data on fast storage)

**Replication**: Master-slave with analytics replicas

### Financial Trading Platform

**Challenge**: Process high-frequency trades, maintain account balances, ensure zero data loss.

**Pattern Solution**:
```
Account Balances & Transactions
  → PostgreSQL or CockroachDB (ACID critical)
  → Why: Strong consistency, no lost transactions

Real-Time Market Data
  → InfluxDB (time-series)
  → Why: Store tick data efficiently

Trade Execution Cache
  → Redis (millisecond latency)
  → Why: Fast order book access

Fraud Detection
  → Neo4j (pattern recognition)
  → Why: Detect unusual trading patterns

Historical Analytics
  → PostgreSQL read replicas
  → Why: Complex reports without impacting production
```

**Sharding Strategy**: Geographic sharding by trading region (regulatory compliance)

**Replication**: Synchronous replication for zero data loss

### Healthcare Records System

**Challenge**: Store patient records, ensure HIPAA compliance, enable fast retrieval during emergencies.

**Pattern Solution**:
```
Patient Records
  → PostgreSQL (ACID, compliance)
  → Why: Strong consistency, audit logging

Medical Images (DICOM)
  → Object Storage (S3) + Metadata in PostgreSQL
  → Why: Large files separate from structured data

Patient Search
  → Elasticsearch with encryption
  → Why: Fast lookup across multiple fields

Appointment Scheduling
  → PostgreSQL (transactional)
  → Why: Prevent double-booking

Real-Time Monitoring (ICU)
  → InfluxDB (time-series)
  → Why: Store vital signs efficiently
```

**Sharding Strategy**: Range-based by patient_id with geographic preference

**Replication**: Synchronous replication for disaster recovery

## Best Practices

### Safety & Security

**Input Validation**:
```python
# ✅ Good: Validate before database operations
def get_user_by_id(user_id: str):
    """
    Retrieve user with input validation.

    Why: Prevent SQL injection and invalid queries
    """
    # Validate input type and format
    if not isinstance(user_id, (str, int)):
        logger.error(f"Invalid user_id type: {type(user_id)}")
        raise ValueError("user_id must be string or integer")

    # Use parameterized queries (NEVER string concatenation)
    query = "SELECT * FROM users WHERE id = %s"
    return db.execute(query, (user_id,))

# ❌ Bad: String concatenation opens SQL injection
def get_user_by_id_bad(user_id: str):
    query = f"SELECT * FROM users WHERE id = {user_id}"  # DANGEROUS!
    return db.execute(query)
```

**Connection Security**:
```python
# Database connection with security best practices
import ssl

db_config = {
    'host': 'db.example.com',
    'port': 5432,
    'database': 'production',
    'user': os.environ['DB_USER'],        # Never hardcode credentials
    'password': os.environ['DB_PASSWORD'],  # Use environment variables
    'sslmode': 'require',                   # Force SSL/TLS
    'sslrootcert': '/path/to/ca-cert.pem', # Verify server certificate
    'connect_timeout': 10,                  # Prevent hanging connections
    'options': '-c statement_timeout=30000' # Query timeout (30s)
}
```

**Data Protection**:
- **Encryption at Rest**: Enable database encryption for sensitive data
- **Encryption in Transit**: Use SSL/TLS for all connections
- **Column-Level Encryption**: Encrypt sensitive fields (SSN, credit cards)
- **Access Control**: Principle of least privilege — grant minimal permissions
- **Audit Logging**: Track all data access for compliance

### Quality Assurance

**Testing Strategy**:

1. **Unit Tests**: Test database access layer
```python
def test_user_creation():
    """Test user creation with proper cleanup."""
    # Arrange
    user_data = {'username': 'test_user', 'email': 'test@example.com'}

    # Act
    user = create_user(user_data)

    # Assert
    assert user.id is not None
    assert user.username == 'test_user'

    # Cleanup (important for test isolation)
    delete_user(user.id)
```

2. **Integration Tests**: Test with real database (or Docker container)
3. **Load Tests**: Verify performance under expected traffic
4. **Chaos Tests**: Test failover and recovery scenarios

**Performance Monitoring**:
```python
import time
from contextlib import contextmanager

@contextmanager
def monitor_query(query_name: str):
    """
    Monitor query performance and log slow queries.

    Why: Identify performance issues in production
    """
    start_time = time.time()
    try:
        yield
    finally:
        duration = time.time() - start_time

        # Log slow queries for investigation
        if duration > 1.0:  # Threshold: 1 second
            logger.warning(
                f"Slow query detected",
                extra={
                    'query_name': query_name,
                    'duration_seconds': duration,
                    'alert': True
                }
            )
        else:
            logger.info(
                f"Query completed",
                extra={
                    'query_name': query_name,
                    'duration_seconds': duration
                }
            )

# Usage
with monitor_query('get_user_orders'):
    orders = db.execute("SELECT * FROM orders WHERE user_id = %s", (user_id,))
```

**Data Quality Validation**:
```python
def validate_order_data(order: dict) -> bool:
    """
    Validate order data before insertion.

    Why: Prevent invalid data from entering database
    """
    validations = [
        ('user_id', lambda: order.get('user_id') is not None),
        ('total_amount', lambda: order.get('total_amount', 0) >= 0),
        ('items', lambda: len(order.get('items', [])) > 0),
        ('status', lambda: order.get('status') in ['pending', 'paid', 'shipped'])
    ]

    for field, check in validations:
        if not check():
            logger.error(f"Validation failed for field: {field}", extra={'order': order})
            return False

    return True
```

### Logging & Observability

**Structured Logging**:
```python
import logging
import json
from datetime import datetime

# Configure structured logging
logging.basicConfig(
    format='%(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

def log_database_operation(operation: str, table: str, **kwargs):
    """
    Log database operations with structured context.

    What to log:
    - Operation type (SELECT, INSERT, UPDATE, DELETE)
    - Table name
    - Duration
    - Row count
    - Errors
    - Trace ID (for distributed tracing)
    """
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'operation': operation,
        'table': table,
        'trace_id': kwargs.get('trace_id'),
        'user_id': kwargs.get('user_id'),
        'duration_ms': kwargs.get('duration_ms'),
        'rows_affected': kwargs.get('rows_affected'),
        'success': kwargs.get('success', True),
        'error': kwargs.get('error')
    }

    if log_entry['success']:
        logger.info(json.dumps(log_entry))
    else:
        logger.error(json.dumps(log_entry))

# Usage
start = time.time()
try:
    result = db.execute("INSERT INTO orders (...) VALUES (...)")
    log_database_operation(
        operation='INSERT',
        table='orders',
        trace_id='abc-123',
        duration_ms=(time.time() - start) * 1000,
        rows_affected=result.rowcount,
        success=True
    )
except Exception as e:
    log_database_operation(
        operation='INSERT',
        table='orders',
        trace_id='abc-123',
        duration_ms=(time.time() - start) * 1000,
        success=False,
        error=str(e)
    )
    raise
```

**Key Metrics to Track**:
- **Query Latency**: P50, P95, P99 response times
- **Query Rate**: Queries per second
- **Error Rate**: Failed queries / total queries
- **Connection Pool Usage**: Active vs available connections
- **Slow Query Count**: Queries exceeding threshold
- **Replication Lag**: Delay between master and replicas
- **Cache Hit Rate**: Cached responses / total requests
- **Deadlock Count**: Concurrent transaction conflicts

**Alerting Thresholds**:
```yaml
# Example alert configuration
alerts:
  - name: high_query_latency
    condition: p95_latency > 1000ms
    severity: warning

  - name: connection_pool_exhausted
    condition: available_connections < 10%
    severity: critical

  - name: high_replication_lag
    condition: replication_lag > 60s
    severity: critical

  - name: increased_error_rate
    condition: error_rate > 5%
    severity: warning
```

## Code Examples

### Sharding Implementation

```python
import hashlib
from typing import Any, Dict

class ShardManager:
    """
    Manage sharded database connections.

    Why: Distribute data across multiple databases for horizontal scaling

    Best Practices:
    - Use consistent hashing for even distribution
    - Cache shard lookups to reduce overhead
    - Handle shard failures gracefully
    - Log shard routing decisions
    """

    def __init__(self, shard_configs: list[Dict[str, Any]]):
        """
        Initialize with list of shard configurations.

        Args:
            shard_configs: List of dicts with connection details
            Example: [
                {'id': 0, 'host': 'db1.example.com', 'port': 5432},
                {'id': 1, 'host': 'db2.example.com', 'port': 5432}
            ]
        """
        self.shards = shard_configs
        self.num_shards = len(shard_configs)
        self.connections = {}

        # Initialize connections to each shard
        for shard in self.shards:
            self.connections[shard['id']] = self._create_connection(shard)

    def _create_connection(self, shard_config: Dict[str, Any]):
        """Create database connection for a shard."""
        # Implementation would use actual database driver
        # This is a placeholder showing the concept
        return DatabaseConnection(
            host=shard_config['host'],
            port=shard_config['port']
        )

    def get_shard_id(self, key: str, strategy: str = 'hash') -> int:
        """
        Determine which shard a key belongs to.

        Args:
            key: The sharding key (e.g., user_id, order_id)
            strategy: Sharding strategy ('hash', 'range', 'geo')

        Returns:
            Shard ID (0 to num_shards-1)
        """
        if strategy == 'hash':
            return self._hash_based_shard(key)
        elif strategy == 'range':
            return self._range_based_shard(key)
        elif strategy == 'geo':
            return self._geo_based_shard(key)
        else:
            raise ValueError(f"Unknown sharding strategy: {strategy}")

    def _hash_based_shard(self, key: str) -> int:
        """
        Hash-based sharding for even distribution.

        How it works:
        1. Hash the key using consistent algorithm (MD5)
        2. Convert hash to integer
        3. Modulo by number of shards
        """
        # Convert key to bytes and hash
        key_bytes = str(key).encode('utf-8')
        hash_value = hashlib.md5(key_bytes).hexdigest()

        # Convert hex hash to integer and mod by shard count
        hash_int = int(hash_value, 16)
        shard_id = hash_int % self.num_shards

        logger.info(
            f"Routed to shard via hash",
            extra={
                'key': key,
                'shard_id': shard_id,
                'strategy': 'hash'
            }
        )

        return shard_id

    def _range_based_shard(self, key: str) -> int:
        """
        Range-based sharding for sequential data.

        How it works:
        1. Convert key to integer
        2. Determine which range it falls into
        3. Return corresponding shard

        Example ranges for 4 shards:
        Shard 0: 1-250,000
        Shard 1: 250,001-500,000
        Shard 2: 500,001-750,000
        Shard 3: 750,001-1,000,000
        """
        try:
            key_int = int(key)
        except ValueError:
            logger.error(f"Cannot use range sharding with non-integer key: {key}")
            raise

        # Define ranges (this would typically come from configuration)
        range_size = 250000
        shard_id = min(key_int // range_size, self.num_shards - 1)

        logger.info(
            f"Routed to shard via range",
            extra={
                'key': key,
                'shard_id': shard_id,
                'strategy': 'range'
            }
        )

        return shard_id

    def _geo_based_shard(self, key: str) -> int:
        """
        Geographic sharding for low latency.

        How it works:
        1. Extract region from key (e.g., 'US-EAST-12345')
        2. Map region to closest shard
        3. Return shard ID
        """
        # Extract region prefix (assumes format like 'US-EAST-12345')
        if '-' in key:
            region = key.split('-')[0]
        else:
            region = 'DEFAULT'

        # Map regions to shards (would come from configuration)
        region_map = {
            'US': 0,
            'EU': 1,
            'ASIA': 2,
            'DEFAULT': 0
        }

        shard_id = region_map.get(region, 0)

        logger.info(
            f"Routed to shard via geography",
            extra={
                'key': key,
                'region': region,
                'shard_id': shard_id,
                'strategy': 'geo'
            }
        )

        return shard_id

    def execute_on_shard(self, key: str, query: str, params: tuple = None):
        """
        Execute query on appropriate shard.

        Args:
            key: Sharding key to determine shard
            query: SQL query to execute
            params: Query parameters

        Returns:
            Query result
        """
        shard_id = self.get_shard_id(key)
        connection = self.connections[shard_id]

        logger.info(
            f"Executing query on shard",
            extra={
                'shard_id': shard_id,
                'query': query[:100]  # Log first 100 chars
            }
        )

        return connection.execute(query, params)

    def execute_on_all_shards(self, query: str, params: tuple = None):
        """
        Execute query on all shards (for operations like aggregations).

        Why needed: Some queries need data from all shards
        (e.g., COUNT(*), global search)

        Warning: This can be expensive — use judiciously
        """
        results = []

        for shard_id, connection in self.connections.items():
            logger.info(f"Executing query on shard {shard_id}")
            result = connection.execute(query, params)
            results.append(result)

        return results

# Usage example
shard_configs = [
    {'id': 0, 'host': 'db1.example.com', 'port': 5432},
    {'id': 1, 'host': 'db2.example.com', 'port': 5432},
    {'id': 2, 'host': 'db3.example.com', 'port': 5432},
    {'id': 3, 'host': 'db4.example.com', 'port': 5432}
]

shard_manager = ShardManager(shard_configs)

# Insert user (routed to appropriate shard by user_id)
user_id = '12345'
shard_manager.execute_on_shard(
    key=user_id,
    query="INSERT INTO users (id, name, email) VALUES (%s, %s, %s)",
    params=(user_id, 'John Doe', 'john@example.com')
)

# Get user (routed to same shard)
user = shard_manager.execute_on_shard(
    key=user_id,
    query="SELECT * FROM users WHERE id = %s",
    params=(user_id,)
)
```

### Connection Pooling

```python
from queue import Queue, Empty
import time
import threading
from contextlib import contextmanager

class ConnectionPool:
    """
    Connection pool implementation for database connections.

    Why: Creating connections is expensive (100-300ms each).
    Reusing connections improves performance by 10-100x.

    Best Practices:
    - Set min_size to handle baseline traffic
    - Set max_size based on database connection limits
    - Monitor pool utilization
    - Set appropriate timeouts
    - Validate connections before use
    """

    def __init__(
        self,
        host: str,
        port: int,
        database: str,
        user: str,
        password: str,
        min_size: int = 5,
        max_size: int = 20,
        connection_timeout: int = 30,
        idle_timeout: int = 600
    ):
        """
        Initialize connection pool.

        Args:
            host: Database host
            port: Database port
            database: Database name
            user: Database user
            password: Database password
            min_size: Minimum connections to maintain (default: 5)
            max_size: Maximum connections allowed (default: 20)
            connection_timeout: Seconds to wait for available connection (default: 30)
            idle_timeout: Seconds before closing idle connection (default: 600)
        """
        self.config = {
            'host': host,
            'port': port,
            'database': database,
            'user': user,
            'password': password
        }

        self.min_size = min_size
        self.max_size = max_size
        self.connection_timeout = connection_timeout
        self.idle_timeout = idle_timeout

        # Thread-safe queue for available connections
        self.available = Queue(maxsize=max_size)

        # Track all connections (available + in-use)
        self.all_connections = []
        self.lock = threading.Lock()

        # Statistics
        self.stats = {
            'created': 0,
            'reused': 0,
            'closed': 0,
            'timeouts': 0
        }

        # Initialize minimum connections
        self._initialize_pool()

        logger.info(
            f"Connection pool initialized",
            extra={
                'min_size': min_size,
                'max_size': max_size,
                'host': host,
                'database': database
            }
        )

    def _initialize_pool(self):
        """Create initial connections up to min_size."""
        for _ in range(self.min_size):
            conn = self._create_connection()
            self.available.put(conn)
            self.all_connections.append(conn)

    def _create_connection(self):
        """
        Create new database connection.

        In production, this would use actual database driver.
        """
        logger.info("Creating new database connection")

        # Placeholder for actual connection creation
        # In production: import psycopg2; return psycopg2.connect(**self.config)
        connection = DatabaseConnection(**self.config)

        with self.lock:
            self.stats['created'] += 1

        return connection

    def _validate_connection(self, conn) -> bool:
        """
        Check if connection is still valid.

        Why: Connections can be closed by database or timeout.
        Always validate before reusing.
        """
        try:
            # Send simple query to test connection
            conn.execute("SELECT 1")
            return True
        except Exception as e:
            logger.warning(
                f"Connection validation failed: {e}",
                extra={'error': str(e)}
            )
            return False

    @contextmanager
    def get_connection(self):
        """
        Get connection from pool (context manager for automatic return).

        Usage:
            with pool.get_connection() as conn:
                conn.execute("SELECT * FROM users")

        Why context manager:
        - Ensures connection is always returned to pool
        - Works correctly even if exception occurs
        - Clean, readable syntax
        """
        connection = None
        start_time = time.time()

        try:
            # Try to get available connection
            try:
                connection = self.available.get(timeout=self.connection_timeout)

                # Validate connection before use
                if not self._validate_connection(connection):
                    logger.warning("Reused connection invalid, creating new one")
                    connection = self._create_connection()
                else:
                    with self.lock:
                        self.stats['reused'] += 1

            except Empty:
                # No available connections
                with self.lock:
                    # Can we create more?
                    if len(self.all_connections) < self.max_size:
                        logger.info("Creating new connection (pool not at max)")
                        connection = self._create_connection()
                        self.all_connections.append(connection)
                    else:
                        # Pool exhausted
                        self.stats['timeouts'] += 1
                        logger.error(
                            "Connection pool exhausted",
                            extra={
                                'max_size': self.max_size,
                                'wait_time': self.connection_timeout
                            }
                        )
                        raise Exception("Connection pool exhausted")

            wait_time = time.time() - start_time
            if wait_time > 1.0:
                logger.warning(
                    f"Long wait for connection",
                    extra={'wait_seconds': wait_time}
                )

            yield connection

        finally:
            # Always return connection to pool
            if connection:
                self.available.put(connection)
                logger.debug("Connection returned to pool")

    def close_all(self):
        """
        Close all connections in pool.

        When to use: Application shutdown, testing cleanup
        """
        logger.info("Closing all connections in pool")

        # Close connections in queue
        while not self.available.empty():
            try:
                conn = self.available.get_nowait()
                conn.close()
                with self.lock:
                    self.stats['closed'] += 1
            except Empty:
                break

        logger.info(
            f"Connection pool closed",
            extra={'stats': self.stats}
        )

    def get_stats(self) -> dict:
        """
        Get pool statistics for monitoring.

        Use this for dashboards and alerting.
        """
        with self.lock:
            return {
                **self.stats,
                'available': self.available.qsize(),
                'total': len(self.all_connections),
                'in_use': len(self.all_connections) - self.available.qsize(),
                'utilization': (len(self.all_connections) - self.available.qsize()) / self.max_size
            }

# Usage example
pool = ConnectionPool(
    host='db.example.com',
    port=5432,
    database='production',
    user='app_user',
    password='secure_password',
    min_size=10,      # Keep 10 connections always ready
    max_size=50,      # Allow up to 50 concurrent connections
    connection_timeout=30  # Wait up to 30s for connection
)

# Use connection
with pool.get_connection() as conn:
    result = conn.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Monitor pool health
stats = pool.get_stats()
if stats['utilization'] > 0.8:
    logger.warning("Connection pool utilization high", extra={'stats': stats})
```

### Schema Migration Strategy

```python
from typing import List, Callable
from datetime import datetime
import hashlib

class Migration:
    """
    Single database migration.

    Best Practices:
    - Each migration is idempotent (safe to run multiple times)
    - Include both up (apply) and down (rollback) logic
    - Test migrations on copy of production data
    - Make migrations reversible when possible
    """

    def __init__(
        self,
        version: str,
        description: str,
        up: Callable,
        down: Callable
    ):
        self.version = version
        self.description = description
        self.up = up
        self.down = down
        self.checksum = self._calculate_checksum()

    def _calculate_checksum(self) -> str:
        """Generate checksum to detect accidental changes."""
        content = f"{self.version}{self.description}".encode('utf-8')
        return hashlib.sha256(content).hexdigest()

class MigrationManager:
    """
    Manage database schema migrations.

    Why: Schema changes must be versioned, tested, and reversible.

    Features:
    - Track which migrations have run
    - Apply migrations in order
    - Rollback migrations if needed
    - Validate migration integrity
    """

    def __init__(self, db_connection):
        self.db = db_connection
        self._ensure_migrations_table()

    def _ensure_migrations_table(self):
        """
        Create migrations tracking table if not exists.

        This table stores:
        - Which migrations have been applied
        - When they were applied
        - Checksums to detect changes
        """
        self.db.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                description TEXT,
                checksum VARCHAR(64),
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        logger.info("Migrations tracking table ready")

    def get_applied_migrations(self) -> List[str]:
        """Get list of already-applied migration versions."""
        result = self.db.execute(
            "SELECT version FROM schema_migrations ORDER BY version"
        )
        return [row['version'] for row in result]

    def apply_migration(self, migration: Migration):
        """
        Apply a single migration.

        Process:
        1. Check if already applied
        2. Execute up() function
        3. Record in migrations table
        4. Log success
        """
        applied = self.get_applied_migrations()

        if migration.version in applied:
            logger.info(
                f"Migration {migration.version} already applied, skipping",
                extra={'version': migration.version}
            )
            return

        logger.info(
            f"Applying migration {migration.version}: {migration.description}",
            extra={
                'version': migration.version,
                'description': migration.description
            }
        )

        try:
            # Begin transaction
            self.db.begin()

            # Apply migration
            start_time = time.time()
            migration.up(self.db)
            duration = time.time() - start_time

            # Record in migrations table
            self.db.execute(
                """
                INSERT INTO schema_migrations (version, description, checksum)
                VALUES (%s, %s, %s)
                """,
                (migration.version, migration.description, migration.checksum)
            )

            # Commit transaction
            self.db.commit()

            logger.info(
                f"Migration {migration.version} applied successfully",
                extra={
                    'version': migration.version,
                    'duration_seconds': duration
                }
            )

        except Exception as e:
            # Rollback on error
            self.db.rollback()
            logger.error(
                f"Migration {migration.version} failed: {e}",
                extra={
                    'version': migration.version,
                    'error': str(e)
                }
            )
            raise

    def rollback_migration(self, migration: Migration):
        """
        Rollback a migration.

        Warning: Only use for recent migrations.
        Rolling back old migrations can be dangerous.
        """
        logger.warning(
            f"Rolling back migration {migration.version}",
            extra={'version': migration.version}
        )

        try:
            self.db.begin()

            # Execute down() function
            migration.down(self.db)

            # Remove from migrations table
            self.db.execute(
                "DELETE FROM schema_migrations WHERE version = %s",
                (migration.version,)
            )

            self.db.commit()

            logger.info(f"Migration {migration.version} rolled back successfully")

        except Exception as e:
            self.db.rollback()
            logger.error(f"Rollback failed: {e}")
            raise

# Example migrations using expand-contract pattern

def migration_001_up(db):
    """
    Add 'email_verified' column (expand phase).

    Why expand first: Allows old code to keep running.
    Old code ignores new column.
    """
    db.execute("""
        ALTER TABLE users
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE
    """)
    logger.info("Added email_verified column")

def migration_001_down(db):
    """Remove email_verified column."""
    db.execute("ALTER TABLE users DROP COLUMN email_verified")

# Register migration
migration_001 = Migration(
    version='001',
    description='Add email verification column',
    up=migration_001_up,
    down=migration_001_down
)

def migration_002_up(db):
    """
    Backfill email_verified for existing users.

    Strategy: Set to TRUE for users who logged in recently.
    """
    db.execute("""
        UPDATE users
        SET email_verified = TRUE
        WHERE last_login > NOW() - INTERVAL '30 days'
    """)
    logger.info("Backfilled email_verified column")

def migration_002_down(db):
    """Reset email_verified to default."""
    db.execute("UPDATE users SET email_verified = FALSE")

migration_002 = Migration(
    version='002',
    description='Backfill email verification status',
    up=migration_002_up,
    down=migration_002_down
)

# Usage
db = DatabaseConnection(...)
manager = MigrationManager(db)

# Apply all migrations
for migration in [migration_001, migration_002]:
    manager.apply_migration(migration)
```

### Query Optimization

```python
class QueryOptimizer:
    """
    Helper class for query optimization techniques.

    Why: Slow queries impact user experience and increase costs.

    Techniques:
    - Indexing
    - Query analysis
    - Caching
    - Connection reuse
    """

    def __init__(self, db_connection):
        self.db = db_connection
        self.query_cache = {}
        self.cache_ttl = 300  # 5 minutes

    def analyze_query(self, query: str):
        """
        Analyze query execution plan.

        Why: Understanding how database executes query
        helps identify optimization opportunities.

        Look for:
        - Sequential scans (should use indexes)
        - High cost operations
        - Large row estimates
        """
        explain_query = f"EXPLAIN ANALYZE {query}"
        result = self.db.execute(explain_query)

        logger.info(
            f"Query execution plan",
            extra={
                'query': query[:100],
                'plan': result
            }
        )

        return result

    def create_index(
        self,
        table: str,
        columns: List[str],
        index_type: str = 'btree'
    ):
        """
        Create database index.

        Why: Indexes dramatically speed up queries on indexed columns.

        Trade-offs:
        - Pros: Fast lookups, efficient filtering and sorting
        - Cons: Slower writes, extra storage space

        When to index:
        - Columns in WHERE clauses
        - Columns in JOIN conditions
        - Columns in ORDER BY
        - Columns in GROUP BY

        When NOT to index:
        - Small tables (sequential scan is fast enough)
        - Columns with low cardinality (few unique values)
        - Tables with heavy write traffic
        """
        index_name = f"idx_{table}_{'_'.join(columns)}"
        columns_str = ', '.join(columns)

        query = f"""
            CREATE INDEX IF NOT EXISTS {index_name}
            ON {table} USING {index_type} ({columns_str})
        """

        logger.info(
            f"Creating index",
            extra={
                'table': table,
                'columns': columns,
                'index_type': index_type
            }
        )

        start_time = time.time()
        self.db.execute(query)
        duration = time.time() - start_time

        logger.info(
            f"Index created successfully",
            extra={
                'index_name': index_name,
                'duration_seconds': duration
            }
        )

    def get_with_cache(
        self,
        cache_key: str,
        query: str,
        params: tuple = None
    ):
        """
        Execute query with caching.

        Why: Repeated queries for same data waste resources.

        Best Practices:
        - Cache read-heavy, infrequently changing data
        - Set appropriate TTL (time-to-live)
        - Invalidate cache on updates
        - Monitor cache hit rate
        """
        # Check cache first
        if cache_key in self.query_cache:
            cached_value, cached_time = self.query_cache[cache_key]
            age = time.time() - cached_time

            # Return if not expired
            if age < self.cache_ttl:
                logger.info(
                    f"Cache hit",
                    extra={
                        'cache_key': cache_key,
                        'age_seconds': age
                    }
                )
                return cached_value
            else:
                logger.info(f"Cache expired for key: {cache_key}")

        # Cache miss — execute query
        logger.info(f"Cache miss for key: {cache_key}")
        result = self.db.execute(query, params)

        # Store in cache
        self.query_cache[cache_key] = (result, time.time())

        return result

    def invalidate_cache(self, cache_key: str):
        """
        Remove entry from cache.

        When to use: After UPDATE/INSERT/DELETE operations
        that affect cached data.
        """
        if cache_key in self.query_cache:
            del self.query_cache[cache_key]
            logger.info(f"Cache invalidated for key: {cache_key}")

    def batch_insert(
        self,
        table: str,
        columns: List[str],
        rows: List[tuple]
    ):
        """
        Insert multiple rows in single query.

        Why: Much faster than individual INSERTs.
        Single INSERT: 1000 rows = 1000 queries = ~1 second
        Batch INSERT: 1000 rows = 1 query = ~10ms

        Best Practices:
        - Batch size: 100-1000 rows per query
        - Use transactions for consistency
        - Log batch size and duration
        """
        if not rows:
            return

        columns_str = ', '.join(columns)
        placeholders = ', '.join(['%s'] * len(columns))
        values_str = ', '.join([f"({placeholders})" for _ in rows])

        query = f"""
            INSERT INTO {table} ({columns_str})
            VALUES {values_str}
        """

        # Flatten rows for query parameters
        flat_params = [value for row in rows for value in row]

        logger.info(
            f"Batch inserting rows",
            extra={
                'table': table,
                'row_count': len(rows)
            }
        )

        start_time = time.time()
        self.db.execute(query, tuple(flat_params))
        duration = time.time() - start_time

        logger.info(
            f"Batch insert completed",
            extra={
                'table': table,
                'row_count': len(rows),
                'duration_seconds': duration,
                'rows_per_second': len(rows) / duration if duration > 0 else 0
            }
        )

# Usage examples
optimizer = QueryOptimizer(db)

# Analyze slow query
optimizer.analyze_query("""
    SELECT u.name, COUNT(o.id) as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.created_at > '2024-01-01'
    GROUP BY u.name
""")

# Create indexes for common queries
optimizer.create_index('users', ['email'], 'btree')  # Fast lookups
optimizer.create_index('orders', ['user_id', 'created_at'], 'btree')  # Composite index

# Use caching for frequently accessed data
user = optimizer.get_with_cache(
    cache_key=f"user_{user_id}",
    query="SELECT * FROM users WHERE id = %s",
    params=(user_id,)
)

# After updating user, invalidate cache
optimizer.invalidate_cache(f"user_{user_id}")

# Batch insert for efficiency
users_to_insert = [
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    # ... 1000 more rows
]

optimizer.batch_insert(
    table='users',
    columns=['name', 'email'],
    rows=users_to_insert
)
```

## Common Pitfalls

### N+1 Query Problem

**What**: Executing one query followed by N additional queries in a loop.

**Example** (Bad):
```python
# Get all users
users = db.execute("SELECT * FROM users")

# Get orders for each user (N queries!)
for user in users:
    orders = db.execute("SELECT * FROM orders WHERE user_id = %s", (user.id,))
    user.orders = orders
```

**Why Problematic**: 1001 queries instead of 1 — incredibly slow.

**Solution**: Use JOIN or batch loading:
```python
# Single query with JOIN
result = db.execute("""
    SELECT u.*, o.id as order_id, o.total
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
""")
```

### Missing Indexes on Foreign Keys

**What**: Forgetting to index columns used in JOINs.

**Impact**: JOINs become sequential scans — extremely slow on large tables.

**Solution**: Always index foreign key columns:
```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Ignoring Connection Limits

**What**: Opening connections without closing them or limiting concurrency.

**Impact**: Database refuses new connections, application crashes.

**Solution**: Use connection pooling with max limits.

### Over-Sharding

**What**: Creating too many shards prematurely.

**Problems**:
- Complex routing logic
- Difficult to manage
- Increased operational overhead
- Cross-shard queries expensive

**Guideline**: Don't shard until necessary (>10M rows or clear performance issues).

### Synchronous Replication in Wrong Context

**What**: Using synchronous replication for all replicas.

**Impact**: Write latency increases dramatically (must wait for all replicas).

**Solution**: Use synchronous for critical replicas, asynchronous for others.

### Ignoring Replication Lag

**What**: Reading from replica immediately after writing to master.

**Problem**: Data not yet replicated — user sees stale data.

**Solutions**:
- Read from master for critical reads after writes
- Wait for replication to catch up
- Use eventual consistency where acceptable

### Schema Changes Without Backwards Compatibility

**What**: Deploying schema changes that break old application code.

**Example**: Renaming column while old code still uses old name.

**Solution**: Use expand-contract pattern:
1. Add new column (old code ignores it)
2. Deploy code using new column
3. Remove old column

### Not Planning for Rollback

**What**: Migrations that cannot be reversed.

**Impact**: Stuck with problematic schema changes.

**Solution**: Always implement down() migration when possible.

## Quick Reference

### Database Selection Guide

| Use Case | Recommended Database | Why |
|----------|---------------------|-----|
| Financial transactions | PostgreSQL, CockroachDB | ACID guarantees, strong consistency |
| Product catalog | MongoDB, DynamoDB | Flexible schemas, varied attributes |
| User sessions | Redis, Memcached | Fast access, automatic expiration |
| Time-series data | InfluxDB, TimescaleDB | Optimized for time-stamped data |
| Social graph | Neo4j, Neptune | Efficient relationship traversal |
| Full-text search | Elasticsearch, Algolia | Inverted indexes, relevance ranking |
| Analytics | BigQuery, Redshift | Columnar storage, aggregations |
| Real-time data | Redis, Kafka | In-memory, streaming support |

### Sharding Decision Tree

```
Should you shard?
├─> Single server handles load? → NO, don't shard yet
├─> Data > 10M rows? → Consider sharding
├─> Write-heavy workload? → Consider sharding
└─> Need global distribution? → Yes, use geo-sharding

Which sharding strategy?
├─> Need even distribution? → Hash-based
├─> Range queries common? → Range-based
├─> Global application? → Geo-based
└─> Complex routing? → Directory-based
```

### Replication Decision Tree

```
Why replicate?
├─> Increase availability? → Multi-master or master-slave with failover
├─> Scale reads? → Master-slave with read replicas
├─> Geographic distribution? → Multi-master across regions
└─> Disaster recovery? → Master-slave in different data center

Consistency needs?
├─> Strong consistency? → Synchronous replication
├─> Eventual consistency acceptable? → Asynchronous replication
└─> Mixed? → Synchronous for critical, async for others
```

### Performance Optimization Checklist

- [ ] Create indexes on frequently queried columns
- [ ] Use connection pooling
- [ ] Implement query result caching
- [ ] Batch INSERT/UPDATE operations
- [ ] Avoid N+1 query problems
- [ ] Monitor slow queries
- [ ] Set up read replicas for analytics
- [ ] Use appropriate shard keys
- [ ] Implement circuit breakers for failover
- [ ] Set query timeouts
- [ ] Monitor connection pool utilization
- [ ] Track replication lag

### Migration Best Practices Checklist

- [ ] Test migrations on production-like data
- [ ] Use transactions for atomic changes
- [ ] Implement rollback (down) functions
- [ ] Version all migrations
- [ ] Generate checksums to detect changes
- [ ] Use expand-contract for zero-downtime
- [ ] Document breaking changes
- [ ] Coordinate with deployment process
- [ ] Monitor migration execution time
- [ ] Keep migrations small and focused

## Related Topics

### Within Architectures

- **[Microservices](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/microservices/README.md)**: Database-per-service pattern, distributed transactions
- **[Event-Driven Architecture](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/event-driven/README.md)**: Event sourcing as alternative to traditional databases
- **[CQRS](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/cqrs/README.md)**: Separate databases for read and write operations
- **[System Design Concepts](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/system-design-concepts/README.md)**: CAP theorem, consistency patterns, scaling strategies

### Infrastructure & Cloud

- **06-infrastructure**: Database deployment, monitoring, backup strategies
- **07-cloud**: Managed database services (RDS, DynamoDB, Cloud SQL, CosmosDB)

### Backend Development

- **05-backend**: ORM patterns, database access layers, connection management

### Security

- **08-security**: Database encryption, access control, SQL injection prevention, compliance

---

**Remember**: Database patterns are about trade-offs. No single solution fits all use cases. Understand your requirements (consistency, availability, scale, latency), then choose patterns that align with those priorities. Start simple, measure performance, and add complexity only when needed.

**Last Updated**: 2026-02-19
