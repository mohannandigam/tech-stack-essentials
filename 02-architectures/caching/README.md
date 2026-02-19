# Caching Strategies

## What is it?

Caching is a technique for storing copies of data in a temporary, fast-access location so that future requests for that data can be served more quickly. Instead of fetching data from a slow source (like a database or external API) every time it's needed, caching stores frequently accessed data in memory or another fast storage layer, dramatically improving application performance and reducing load on backend systems.

Think of caching as keeping a shortcut to information you use often, rather than looking it up from scratch every time.

## Simple Analogy

Imagine you're cooking and constantly referring to a recipe book on a high shelf. Every time you need to check a measurement, you have to climb a ladder, find the book, flip to the right page, and climb back down. This takes time and energy.

Now imagine you write down the recipe on a piece of paper and keep it on your counter while cooking. You can glance at it instantly whenever needed. That piece of paper is your cache — a quick-access copy of information that's expensive to retrieve from the original source.

Just like the paper might get outdated if someone updates the recipe book, your cache needs strategies to stay fresh and relevant.

## Why does it matter?

**Technical Impact:**
- **Performance**: Reduces response times from seconds to milliseconds
- **Scalability**: Decreases load on databases and backend services by 70-95%
- **Cost**: Reduces compute and database resources needed, lowering infrastructure costs
- **Resilience**: Provides fallback data when primary systems are unavailable

**Business Impact:**
- **User Experience**: Faster page loads lead to higher engagement and conversion rates
- **System Reliability**: Reduces strain on backend systems during traffic spikes
- **Global Reach**: CDN caching enables content delivery close to users worldwide
- **Resource Efficiency**: One database query can serve thousands of cached requests

## How it works

### Basic Caching Flow

```
Request Flow WITHOUT Cache:
User → Application → Database → Process → Application → User
Time: 500ms (database query + processing)

Request Flow WITH Cache:
User → Application → Cache → Application → User
Time: 5ms (memory lookup)

If cache miss:
User → Application → Cache (miss) → Database → Cache (store) → Application → User
Time: 500ms first time, 5ms for subsequent requests
```

### Step-by-Step Process

1. **Request arrives**: Application receives a request for data (e.g., user profile, product details)

2. **Check cache**: Application checks if data exists in cache using a unique key (e.g., "user:12345")

3. **Cache hit**: If data is found, return it immediately (fast path)

4. **Cache miss**: If data is not found:
   - Query the original data source (database, API, etc.)
   - Store the result in cache with an expiration time
   - Return the data to the user

5. **Expiration**: Cached data expires after a set time (TTL - Time To Live) or is removed when storage is full

### Cache Layers in Modern Applications

```
┌─────────────────────────────────────────────────┐
│                    Client                       │
│              (Browser Cache)                    │
│         Cache-Control, ETag, etc.               │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│                    CDN                          │
│         (CloudFront, Cloudflare)                │
│         Cached static assets                    │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            Load Balancer                        │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│           Application Server                    │
│      ┌──────────────────────┐                   │
│      │  Application Cache   │                   │
│      │    (In-Memory)       │                   │
│      └──────────────────────┘                   │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          Distributed Cache                      │
│      (Redis, Memcached)                         │
│      Shared across all servers                  │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│              Database                           │
│      (Query Cache Layer)                        │
└─────────────────────────────────────────────────┘
```

## Key Concepts

### Cache Patterns

- **Cache-Aside (Lazy Loading)**: Application code manages the cache. On read, check cache first; on miss, load from database and populate cache. Most common pattern.

- **Read-Through**: Cache sits between application and database. Cache automatically loads data from database on miss. Simplifies application code.

- **Write-Through**: When data is written, it's written to both cache and database synchronously. Ensures cache is always up-to-date but slower writes.

- **Write-Behind (Write-Back)**: Writes go to cache immediately, then are asynchronously written to database in batches. Fast writes but risk of data loss if cache fails.

- **Refresh-Ahead**: Automatically refreshes frequently accessed cache entries before they expire. Prevents cache misses for hot data.

### Invalidation Strategies

- **Time-To-Live (TTL)**: Each cached item expires after a set time period (e.g., 5 minutes). Simple but data can be stale before expiration.

- **LRU (Least Recently Used)**: When cache is full, remove items that haven't been accessed recently. Good for limited memory.

- **LFU (Least Frequently Used)**: Remove items accessed least often. Better for identifying truly unused data.

- **Manual Invalidation**: Explicitly remove or update cache entries when underlying data changes. Most accurate but requires careful coordination.

- **Event-Based Invalidation**: Listen for data change events and invalidate related cache entries. Keeps cache fresh in real-time.

### Eviction Policies

- **LRU (Least Recently Used)**: Tracks when items were last accessed; removes oldest
- **LFU (Least Frequently Used)**: Tracks access count; removes least popular
- **FIFO (First In First Out)**: Removes oldest items regardless of usage
- **Random**: Removes random items; simple but unpredictable
- **TTL-Based**: Removes expired items regardless of usage patterns

### Cache Storage Locations

- **In-Memory (Application)**: Cache stored in application process memory. Fast but not shared across servers.

- **Distributed Cache**: Separate cache service (Redis, Memcached) shared by all application servers. Centralized and scalable.

- **CDN (Content Delivery Network)**: Global network of servers that cache content close to users. Best for static assets.

- **Database Query Cache**: Database stores results of recent queries. Built-in but limited control.

- **Browser Cache**: Client-side caching controlled by HTTP headers. Reduces server requests entirely.

## Cache Patterns in Detail

### 1. Cache-Aside (Lazy Loading)

**What it is**: The application is responsible for loading data into the cache. The cache doesn't interact with the database directly.

**When to use**:
- You have read-heavy workloads
- You want fine-grained control over what's cached
- Not all data needs to be cached
- You can tolerate cache misses

**How it works**:

```
Read Flow:
1. Application checks cache for data
2. If found (hit): return cached data
3. If not found (miss):
   a. Query database
   b. Store result in cache
   c. Return data to user

Write Flow:
1. Write to database
2. Invalidate cache entry (or update it)
```

**Example**:

```python
import redis
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Connect to Redis
cache = redis.Redis(host='localhost', port=6379, decode_responses=True)

def get_user_profile(user_id):
    """
    Fetch user profile with cache-aside pattern.

    Why we do this:
    - Reduces database queries by caching frequently accessed profiles
    - Only caches data that's actually requested (lazy loading)
    - Simple to implement and understand

    Best Practices:
    - Set appropriate TTL to prevent stale data
    - Log cache hits/misses for monitoring
    - Handle cache failures gracefully
    """
    cache_key = f"user:profile:{user_id}"

    # Step 1: Try to get from cache
    try:
        cached_data = cache.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for user {user_id}")
            return cached_data
    except redis.RedisError as e:
        # If cache is down, continue to database
        logger.error(f"Cache error: {e}")

    # Step 2: Cache miss - get from database
    logger.info(f"Cache miss for user {user_id}")
    user_data = database.query(f"SELECT * FROM users WHERE id = {user_id}")

    if user_data is None:
        logger.warning(f"User {user_id} not found in database")
        return None

    # Step 3: Store in cache with TTL (5 minutes)
    try:
        cache.setex(cache_key, 300, user_data)
        logger.info(f"Cached user {user_id} for 300 seconds")
    except redis.RedisError as e:
        # Log but don't fail if cache write fails
        logger.error(f"Failed to cache user {user_id}: {e}")

    return user_data


def update_user_profile(user_id, new_data):
    """
    Update user profile and invalidate cache.

    Why we do this:
    - Ensures cache doesn't serve stale data after updates
    - Invalidation is safer than updating cache directly
    - Next read will fetch fresh data from database

    Best Practices:
    - Always invalidate before or after database write
    - Use transactions to ensure consistency
    - Log invalidation events for debugging
    """
    # Step 1: Update database
    database.update(f"UPDATE users SET ... WHERE id = {user_id}", new_data)

    # Step 2: Invalidate cache
    cache_key = f"user:profile:{user_id}"
    try:
        cache.delete(cache_key)
        logger.info(f"Invalidated cache for user {user_id}")
    except redis.RedisError as e:
        logger.error(f"Failed to invalidate cache for user {user_id}: {e}")
```

**Pros**:
- Simple to implement and understand
- Only requested data is cached (memory efficient)
- Resilient to cache failures
- Fine control over caching logic

**Cons**:
- Initial requests are slow (cache miss penalty)
- Potential for cache stampede on popular items
- Application code handles all caching logic

### 2. Read-Through Cache

**What it is**: The cache sits between the application and database. On a cache miss, the cache automatically loads data from the database.

**When to use**:
- You want to simplify application code
- Caching logic should be centralized
- You have a consistent data access pattern
- You're using a caching library that supports this pattern

**How it works**:

```
Read Flow:
1. Application requests data from cache
2. Cache checks if it has the data
3. If not, cache loads from database automatically
4. Cache stores the data and returns it
5. Application receives data (doesn't know if it was cached or not)
```

**Example**:

```python
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

class ReadThroughCache:
    """
    Read-through cache implementation.

    Why we do this:
    - Abstracts caching logic from application code
    - Ensures consistent caching behavior
    - Simplifies usage throughout the application

    Best Practices:
    - Configure appropriate TTL for your use case
    - Monitor cache hit rates
    - Handle database errors gracefully
    """

    def __init__(self, cache_client, database):
        self.cache = cache_client
        self.database = database

    def get(self, key, loader_function):
        """
        Get data with automatic load-through on miss.

        Args:
            key: Cache key
            loader_function: Function to call on cache miss
        """
        # Check cache first
        try:
            data = self.cache.get(key)
            if data:
                logger.info(f"Cache hit: {key}")
                return data
        except Exception as e:
            logger.error(f"Cache read error: {e}")

        # Cache miss - load from source
        logger.info(f"Cache miss: {key}")
        try:
            data = loader_function()

            if data is not None:
                # Store in cache
                self.cache.setex(key, 300, data)
                logger.info(f"Loaded and cached: {key}")

            return data
        except Exception as e:
            logger.error(f"Failed to load data for {key}: {e}")
            raise

# Usage
cache_client = redis.Redis(host='localhost', port=6379)
read_through_cache = ReadThroughCache(cache_client, database)

def get_product_details(product_id):
    """
    Get product details using read-through cache.

    Application code is much simpler - no caching logic needed.
    """
    key = f"product:{product_id}"

    def load_from_database():
        return database.query(f"SELECT * FROM products WHERE id = {product_id}")

    return read_through_cache.get(key, load_from_database)
```

**Pros**:
- Simplifies application code
- Consistent caching behavior
- Single point for cache logic

**Cons**:
- Requires cache library/framework support
- Less flexibility per use case
- Cache becomes critical dependency

### 3. Write-Through Cache

**What it is**: Data is written to cache and database simultaneously. The write operation is only considered successful when both writes complete.

**When to use**:
- Data consistency is critical
- You need cache and database always in sync
- Write performance is acceptable (slower than write-behind)
- You can't tolerate stale cache data

**How it works**:

```
Write Flow:
1. Application writes data
2. Cache and database are updated synchronously
3. Both must succeed before acknowledging success
4. If either fails, the entire operation fails

Read Flow:
1. Read from cache (always up-to-date)
2. Cache hits are guaranteed for recently written data
```

**Example**:

```python
import redis
import logging

logger = logging.getLogger(__name__)

class WriteThroughCache:
    """
    Write-through cache implementation.

    Why we do this:
    - Guarantees cache and database are always in sync
    - Eliminates stale cache data issues
    - Simplifies read logic (cache is always current)

    Best Practices:
    - Use transactions to ensure atomicity
    - Handle partial failures with rollback
    - Monitor write latency
    """

    def __init__(self, cache_client, database):
        self.cache = cache_client
        self.database = database

    def write(self, key, value, ttl=300):
        """
        Write to both cache and database synchronously.

        Args:
            key: Cache key
            value: Data to store
            ttl: Time to live in seconds

        Raises:
            Exception if either write fails
        """
        logger.info(f"Write-through for key: {key}")

        try:
            # Write to database first (source of truth)
            self.database.save(key, value)
            logger.info(f"Database write successful: {key}")

            # Then write to cache
            self.cache.setex(key, ttl, value)
            logger.info(f"Cache write successful: {key}")

        except Exception as e:
            # If cache write fails after database write,
            # you might want to log and continue
            # (depends on your consistency requirements)
            logger.error(f"Write-through failed for {key}: {e}")
            raise

    def read(self, key):
        """
        Read from cache (guaranteed to be fresh).
        """
        try:
            data = self.cache.get(key)
            if data:
                logger.info(f"Cache hit: {key}")
                return data

            # Cache miss means data doesn't exist or expired
            logger.info(f"Cache miss: {key}")
            return None
        except Exception as e:
            logger.error(f"Cache read error: {e}")
            # Fallback to database
            return self.database.load(key)

# Usage
cache_client = redis.Redis(host='localhost', port=6379)
write_through = WriteThroughCache(cache_client, database)

def update_inventory(product_id, quantity):
    """
    Update inventory with strong consistency.

    Critical for e-commerce where inventory must be accurate.
    """
    key = f"inventory:{product_id}"
    value = {"product_id": product_id, "quantity": quantity}

    try:
        write_through.write(key, value)
        logger.info(f"Inventory updated: {product_id} -> {quantity}")
    except Exception as e:
        logger.error(f"Failed to update inventory: {e}")
        raise
```

**Pros**:
- Cache is always consistent with database
- No stale data issues
- Simpler read logic

**Cons**:
- Slower writes (must update both)
- Higher write latency
- Cache becomes critical for writes

### 4. Write-Behind (Write-Back) Cache

**What it is**: Writes go to cache immediately, and the cache asynchronously writes to the database in the background, often in batches.

**When to use**:
- Write performance is critical
- You can tolerate eventual consistency
- You're willing to risk data loss if cache fails
- You have high write volumes that can be batched

**How it works**:

```
Write Flow:
1. Application writes to cache
2. Write returns immediately (fast)
3. Cache queues database write
4. Background process writes to database in batches

Read Flow:
1. Read from cache (may have uncommitted writes)
2. On cache miss, read from database (might be stale)
```

**Example**:

```python
import redis
import logging
import threading
import time
from queue import Queue

logger = logging.getLogger(__name__)

class WriteBehindCache:
    """
    Write-behind cache implementation.

    Why we do this:
    - Dramatically improves write performance
    - Reduces database load by batching writes
    - Good for high-throughput scenarios

    Best Practices:
    - Monitor queue depth to prevent backlog
    - Implement retry logic for failed writes
    - Consider data loss risk vs performance gain
    - Use persistent queue for critical data
    """

    def __init__(self, cache_client, database, batch_size=100, flush_interval=5):
        self.cache = cache_client
        self.database = database
        self.write_queue = Queue()
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.running = True

        # Start background writer thread
        self.writer_thread = threading.Thread(target=self._background_writer)
        self.writer_thread.daemon = True
        self.writer_thread.start()

    def write(self, key, value, ttl=300):
        """
        Write to cache immediately, queue database write.

        Args:
            key: Cache key
            value: Data to store
            ttl: Time to live in seconds

        Returns immediately after cache write.
        """
        try:
            # Write to cache immediately
            self.cache.setex(key, ttl, value)
            logger.info(f"Cache write successful: {key}")

            # Queue database write for later
            self.write_queue.put((key, value))
            logger.debug(f"Queued database write: {key}")

        except Exception as e:
            logger.error(f"Cache write failed for {key}: {e}")
            # Fallback: write directly to database
            self.database.save(key, value)

    def _background_writer(self):
        """
        Background thread that batches and writes to database.

        Why batching helps:
        - Reduces database connection overhead
        - More efficient use of database resources
        - Can deduplicate multiple writes to same key
        """
        batch = []
        last_flush = time.time()

        while self.running:
            try:
                # Collect writes for batch
                while len(batch) < self.batch_size:
                    # Wait briefly for items
                    if not self.write_queue.empty():
                        item = self.write_queue.get(timeout=0.1)
                        batch.append(item)
                    else:
                        break

                # Flush if batch is full or interval elapsed
                current_time = time.time()
                should_flush = (
                    len(batch) >= self.batch_size or
                    (batch and current_time - last_flush >= self.flush_interval)
                )

                if should_flush and batch:
                    self._flush_batch(batch)
                    batch = []
                    last_flush = current_time

                time.sleep(0.1)  # Brief sleep to prevent tight loop

            except Exception as e:
                logger.error(f"Background writer error: {e}")

    def _flush_batch(self, batch):
        """
        Write batch to database.

        Best Practices:
        - Use bulk write operations when possible
        - Implement retry logic for transient failures
        - Log failures for manual review
        """
        try:
            logger.info(f"Flushing batch of {len(batch)} writes")
            self.database.bulk_save(batch)
            logger.info("Batch write successful")
        except Exception as e:
            logger.error(f"Batch write failed: {e}")
            # In production, implement retry logic here
            # Consider dead-letter queue for failed writes

# Usage
cache_client = redis.Redis(host='localhost', port=6379)
write_behind = WriteBehindCache(cache_client, database)

def log_user_activity(user_id, action):
    """
    Log user activity with high throughput.

    Good use case for write-behind:
    - High volume writes
    - Eventual consistency acceptable
    - Performance matters more than immediate durability
    """
    key = f"activity:{user_id}:{time.time()}"
    value = {"user_id": user_id, "action": action, "timestamp": time.time()}

    write_behind.write(key, value)
```

**Pros**:
- Very fast writes
- Reduced database load
- Better handling of write spikes

**Cons**:
- Risk of data loss if cache fails
- Eventual consistency only
- More complex implementation

## Cache Invalidation Strategies

Cache invalidation is one of the hardest problems in computer science. Getting it wrong leads to stale data, incorrect application behavior, and user frustration.

### 1. Time-To-Live (TTL)

**What it is**: Each cache entry automatically expires after a specified time period.

**When to use**:
- Data changes infrequently
- You can tolerate temporary staleness
- You want simple, predictable cache behavior

**Example**:

```python
import redis
import logging

logger = logging.getLogger(__name__)
cache = redis.Redis(host='localhost', port=6379)

def cache_with_ttl(key, value, ttl_seconds):
    """
    Cache data with automatic expiration.

    Why we set TTL:
    - Prevents stale data from living forever
    - Automatically frees memory
    - Simple to implement and reason about

    Best Practices:
    - Set TTL based on data volatility
    - Shorter TTL for frequently changing data
    - Longer TTL for stable data
    - Monitor expiration rates
    """
    try:
        cache.setex(key, ttl_seconds, value)
        logger.info(f"Cached {key} with TTL {ttl_seconds}s")
    except redis.RedisError as e:
        logger.error(f"Failed to cache with TTL: {e}")

# Different TTLs for different data types
cache_with_ttl("user:profile:123", user_data, ttl_seconds=300)      # 5 minutes
cache_with_ttl("product:price:456", price_data, ttl_seconds=60)     # 1 minute
cache_with_ttl("homepage:content", content, ttl_seconds=3600)       # 1 hour
cache_with_ttl("static:config", config, ttl_seconds=86400)          # 24 hours
```

**TTL Selection Guide**:

| Data Type | Typical TTL | Reasoning |
|-----------|-------------|-----------|
| User sessions | 30 min - 1 hour | Balance convenience vs security |
| Product prices | 1-5 minutes | Must reflect inventory changes |
| User profiles | 5-15 minutes | Updated infrequently |
| Static content | 1-24 hours | Rarely changes |
| Configuration | 5-15 minutes | Changes need to propagate |
| API rate limits | 1 second - 1 minute | Short window for counting |

### 2. Least Recently Used (LRU)

**What it is**: When the cache is full, remove the items that haven't been accessed in the longest time.

**When to use**:
- Cache has size limits
- You want to keep popular items
- Access patterns are relatively stable

**Example**:

```python
from collections import OrderedDict
import logging

logger = logging.getLogger(__name__)

class LRUCache:
    """
    Least Recently Used cache implementation.

    Why LRU works well:
    - Keeps frequently accessed data in cache
    - Automatically removes stale items
    - Simple to understand and implement

    Best Practices:
    - Size cache based on available memory
    - Monitor hit/miss rates
    - Consider access patterns when sizing
    """

    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
        logger.info(f"LRU cache initialized with capacity {capacity}")

    def get(self, key):
        """
        Get item and mark as recently used.
        """
        if key not in self.cache:
            logger.debug(f"Cache miss: {key}")
            return None

        # Move to end (most recently used)
        self.cache.move_to_end(key)
        logger.debug(f"Cache hit: {key}")
        return self.cache[key]

    def put(self, key, value):
        """
        Add item to cache, evicting LRU if necessary.
        """
        if key in self.cache:
            # Update existing key
            self.cache.move_to_end(key)
        else:
            # Add new key
            self.cache[key] = value

            # Evict least recently used if over capacity
            if len(self.cache) > self.capacity:
                oldest_key = next(iter(self.cache))
                self.cache.pop(oldest_key)
                logger.info(f"Evicted LRU item: {oldest_key}")

        self.cache[key] = value

# Usage with Redis (Redis supports LRU natively)
def configure_redis_lru():
    """
    Configure Redis to use LRU eviction.

    Redis eviction policies:
    - allkeys-lru: Evict any key using LRU
    - volatile-lru: Evict only keys with TTL using LRU
    - allkeys-random: Evict random keys
    - volatile-random: Evict random keys with TTL
    - volatile-ttl: Evict keys with shortest TTL
    - noeviction: Return errors when memory full
    """
    # In redis.conf or via command:
    # maxmemory 2gb
    # maxmemory-policy allkeys-lru
    logger.info("Redis configured for LRU eviction")
```

### 3. Event-Based Invalidation

**What it is**: Listen for events indicating data changes, then invalidate or update related cache entries immediately.

**When to use**:
- You need real-time consistency
- You have an event-driven architecture
- You can identify all dependent cache entries

**Example**:

```python
import redis
import logging
import json

logger = logging.getLogger(__name__)

class EventBasedInvalidator:
    """
    Invalidate cache based on data change events.

    Why this pattern:
    - Cache stays consistent with database
    - No stale data serving
    - Works well with event-driven architectures

    Best Practices:
    - Ensure all write paths emit events
    - Handle event processing failures
    - Consider cascading invalidations
    """

    def __init__(self, cache_client, event_subscriber):
        self.cache = cache_client
        self.subscriber = event_subscriber
        self.register_handlers()

    def register_handlers(self):
        """
        Register event handlers for different data types.
        """
        self.subscriber.on('user.updated', self.handle_user_update)
        self.subscriber.on('product.updated', self.handle_product_update)
        self.subscriber.on('order.created', self.handle_order_created)

    def handle_user_update(self, event):
        """
        Invalidate user-related cache entries.

        Cascading invalidation:
        - User profile
        - User's orders
        - User's cart
        - User's recommendations
        """
        user_id = event['user_id']

        keys_to_invalidate = [
            f"user:profile:{user_id}",
            f"user:orders:{user_id}",
            f"user:cart:{user_id}",
            f"user:recommendations:{user_id}",
        ]

        for key in keys_to_invalidate:
            try:
                self.cache.delete(key)
                logger.info(f"Invalidated: {key}")
            except redis.RedisError as e:
                logger.error(f"Failed to invalidate {key}: {e}")

    def handle_product_update(self, event):
        """
        Invalidate product-related cache entries.
        """
        product_id = event['product_id']

        keys_to_invalidate = [
            f"product:{product_id}",
            f"product:inventory:{product_id}",
            "homepage:featured",  # Might include this product
            "category:*",  # All category pages might include this product
        ]

        for key_pattern in keys_to_invalidate:
            try:
                if '*' in key_pattern:
                    # Pattern matching invalidation
                    keys = self.cache.keys(key_pattern)
                    if keys:
                        self.cache.delete(*keys)
                        logger.info(f"Invalidated {len(keys)} keys matching {key_pattern}")
                else:
                    self.cache.delete(key_pattern)
                    logger.info(f"Invalidated: {key_pattern}")
            except redis.RedisError as e:
                logger.error(f"Failed to invalidate {key_pattern}: {e}")

    def handle_order_created(self, event):
        """
        Invalidate inventory and user caches.
        """
        order_data = event['order']
        user_id = order_data['user_id']
        product_ids = [item['product_id'] for item in order_data['items']]

        # Invalidate user's order history
        self.cache.delete(f"user:orders:{user_id}")

        # Invalidate product inventory
        for product_id in product_ids:
            self.cache.delete(f"product:inventory:{product_id}")

        logger.info(f"Invalidated caches for order: {order_data['order_id']}")
```

## Redis Caching Features

Redis is an in-memory data store commonly used for caching. It provides data structures beyond simple key-value pairs.

### Redis Data Structures

**1. Strings**: Simple key-value pairs

```python
# Basic string operations
cache.set("user:name:123", "John Doe")
name = cache.get("user:name:123")

# With TTL
cache.setex("session:abc", 3600, "session_data")

# Atomic increment (great for counters)
cache.incr("page:views:home")
cache.incrby("api:calls:user:123", 1)
```

**2. Hashes**: Store objects with multiple fields

```python
# Store user object
cache.hset("user:123", mapping={
    "name": "John Doe",
    "email": "john@example.com",
    "age": "30"
})

# Get specific field
email = cache.hget("user:123", "email")

# Get entire object
user = cache.hgetall("user:123")

# Update single field
cache.hset("user:123", "age", "31")
```

**Why use hashes**: More memory efficient than storing separate keys. Allows updating individual fields without fetching entire object.

**3. Lists**: Ordered collections (queues, timelines)

```python
# Add to list (left/right push)
cache.lpush("notifications:user:123", "New message")
cache.rpush("activity:feed", "User logged in")

# Get range
recent_notifications = cache.lrange("notifications:user:123", 0, 9)  # First 10

# List length
count = cache.llen("notifications:user:123")

# Use case: Activity feed with max size
cache.lpush("feed:user:123", new_activity)
cache.ltrim("feed:user:123", 0, 99)  # Keep only latest 100
```

**Why use lists**: Perfect for feeds, queues, recent activity logs. Maintains order and supports efficient range queries.

**4. Sets**: Unordered unique collections

```python
# Add members
cache.sadd("tags:product:123", "electronics", "sale", "featured")

# Check membership
is_on_sale = cache.sismember("tags:product:123", "sale")

# Get all members
tags = cache.smembers("tags:product:123")

# Set operations
cache.sinter("users:online", "users:premium")  # Intersection
cache.sunion("tags:product:1", "tags:product:2")  # Union
```

**Why use sets**: Fast membership checks. Great for tags, permissions, unique visitors, online users.

**5. Sorted Sets**: Ordered by score

```python
# Leaderboard: username with score
cache.zadd("leaderboard:global", {
    "player1": 1000,
    "player2": 950,
    "player3": 900
})

# Get top 10
top_players = cache.zrevrange("leaderboard:global", 0, 9, withscores=True)

# Get rank
rank = cache.zrevrank("leaderboard:global", "player1")

# Increment score
cache.zincrby("leaderboard:global", 10, "player1")

# Use case: Trending posts by score
cache.zadd("trending:posts", {
    "post:123": trend_score,
    "post:456": trend_score
})
```

**Why use sorted sets**: Perfect for leaderboards, trending items, time-based data, priority queues.

### Redis Pub/Sub

**What it is**: Redis can act as a message broker, allowing applications to publish messages to channels and subscribe to channels to receive messages.

**When to use**:
- Real-time notifications
- Cache invalidation across multiple servers
- Event broadcasting
- Chat applications

**Example**:

```python
import redis
import logging
import threading

logger = logging.getLogger(__name__)

# Publisher
class CacheInvalidationPublisher:
    """
    Publish cache invalidation events.

    Why pub/sub for invalidation:
    - Invalidate cache across all application servers
    - Real-time updates
    - Decoupled architecture
    """

    def __init__(self):
        self.redis = redis.Redis(host='localhost', port=6379)

    def invalidate(self, key):
        """
        Publish invalidation event.
        """
        message = json.dumps({"action": "invalidate", "key": key})
        self.redis.publish("cache:invalidation", message)
        logger.info(f"Published invalidation for: {key}")

# Subscriber
class CacheInvalidationSubscriber:
    """
    Subscribe to cache invalidation events.

    Best Practices:
    - Run subscriber in separate thread
    - Handle connection failures
    - Process messages quickly (don't block)
    """

    def __init__(self, cache_client):
        self.redis = redis.Redis(host='localhost', port=6379)
        self.cache = cache_client
        self.pubsub = self.redis.pubsub()
        self.pubsub.subscribe("cache:invalidation")

    def listen(self):
        """
        Listen for invalidation messages.
        """
        logger.info("Starting cache invalidation listener")

        for message in self.pubsub.listen():
            if message['type'] == 'message':
                try:
                    data = json.loads(message['data'])
                    if data['action'] == 'invalidate':
                        key = data['key']
                        self.cache.delete(key)
                        logger.info(f"Invalidated cache: {key}")
                except Exception as e:
                    logger.error(f"Error processing invalidation: {e}")

# Start listener in background
subscriber = CacheInvalidationSubscriber(cache)
listener_thread = threading.Thread(target=subscriber.listen)
listener_thread.daemon = True
listener_thread.start()
```

### Redis Lua Scripting

**What it is**: Execute Lua scripts atomically on Redis server. The script runs as a single atomic operation.

**When to use**:
- Complex atomic operations
- Rate limiting
- Preventing race conditions
- Cache stampede prevention

**Example**:

```python
import redis
import logging

logger = logging.getLogger(__name__)
cache = redis.Redis(host='localhost', port=6379)

# Lua script for atomic rate limiting
rate_limit_script = """
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call('GET', key)
if current == false then
    redis.call('SETEX', key, window, 1)
    return 1
end

current = tonumber(current)
if current < limit then
    redis.call('INCR', key)
    return current + 1
else
    return -1
end
"""

def check_rate_limit(user_id, limit=100, window=60):
    """
    Check if user is within rate limit.

    Why Lua scripting:
    - Atomic operation (no race conditions)
    - Reduces round trips to Redis
    - Ensures consistent behavior under load

    Args:
        user_id: User identifier
        limit: Maximum requests per window
        window: Time window in seconds

    Returns:
        Current request count, or -1 if limit exceeded
    """
    key = f"rate_limit:{user_id}"

    try:
        result = cache.eval(rate_limit_script, 1, key, limit, window)

        if result == -1:
            logger.warning(f"Rate limit exceeded for user {user_id}")
            return False
        else:
            logger.debug(f"Rate limit check passed: {result}/{limit}")
            return True
    except redis.RedisError as e:
        logger.error(f"Rate limit check failed: {e}")
        # Fail open or closed based on your requirements
        return True  # Fail open

# Lua script for cache stampede prevention
cache_stampede_script = """
local key = KEYS[1]
local lock_key = KEYS[2]
local ttl = tonumber(ARGV[1])

local value = redis.call('GET', key)
if value then
    return {1, value}  -- Cache hit
end

-- Try to acquire lock
local lock = redis.call('SET', lock_key, '1', 'NX', 'EX', 10)
if lock then
    return {2, nil}  -- Got lock, should fetch from DB
else
    return {3, nil}  -- Another process is fetching, wait and retry
end
"""

def get_with_stampede_protection(key, loader_function, ttl=300):
    """
    Get from cache with stampede protection.

    Why this matters:
    - Prevents multiple processes from querying DB simultaneously
    - Only one process fetches on cache miss
    - Others wait briefly and retry
    """
    lock_key = f"{key}:lock"

    try:
        result = cache.eval(
            cache_stampede_script,
            2,
            key,
            lock_key,
            ttl
        )

        status, value = result

        if status == 1:
            # Cache hit
            return value
        elif status == 2:
            # Got lock - fetch from database
            try:
                value = loader_function()
                cache.setex(key, ttl, value)
                cache.delete(lock_key)  # Release lock
                return value
            except Exception as e:
                cache.delete(lock_key)  # Release lock on error
                raise
        else:
            # Another process is fetching - wait and retry
            time.sleep(0.1)
            return get_with_stampede_protection(key, loader_function, ttl)

    except redis.RedisError as e:
        logger.error(f"Stampede protection failed: {e}")
        # Fallback to direct DB query
        return loader_function()
```

## CDN Caching

Content Delivery Networks (CDNs) cache content on servers distributed globally, serving users from the nearest location.

### What is a CDN?

A CDN is a network of servers spread across different geographic locations. When a user requests content, the CDN serves it from the nearest server, reducing latency and improving load times.

**How it works**:

```
Without CDN:
User in Tokyo → Request → Your server in US → Response → User in Tokyo
Time: 200ms+ (round trip across Pacific)

With CDN:
User in Tokyo → Request → CDN server in Tokyo → Response → User in Tokyo
Time: 10-20ms (local server)

If CDN doesn't have content:
User in Tokyo → CDN Tokyo → Origin server in US → CDN caches → User in Tokyo
Time: 200ms+ first time, 10-20ms thereafter
```

### HTTP Caching Headers

These headers control how browsers and CDNs cache content:

**Cache-Control**: Primary header for caching directives

```
Cache-Control: public, max-age=3600
- public: Can be cached by any cache (CDN, browser)
- private: Only browser can cache (not CDN)
- max-age=3600: Cache for 1 hour
- no-cache: Must revalidate with server before using
- no-store: Don't cache at all (sensitive data)
- must-revalidate: Must check with server when stale

Examples:
Cache-Control: public, max-age=31536000, immutable  # Static assets with hash in URL
Cache-Control: private, max-age=0, must-revalidate  # User-specific content
Cache-Control: public, max-age=3600, s-maxage=86400  # Different TTL for CDN vs browser
Cache-Control: no-store  # Sensitive data (credit cards, personal info)
```

**ETag**: Fingerprint of content for validation

```
Server sends:
ETag: "abc123"

Browser caches and later sends:
If-None-Match: "abc123"

If content unchanged, server responds:
304 Not Modified (no body, saves bandwidth)

If content changed, server responds:
200 OK with new ETag and content
```

**Last-Modified**: Timestamp of last modification

```
Server sends:
Last-Modified: Wed, 15 Jan 2025 12:00:00 GMT

Browser later sends:
If-Modified-Since: Wed, 15 Jan 2025 12:00:00 GMT

If unchanged:
304 Not Modified

If changed:
200 OK with new Last-Modified and content
```

**Example Implementation**:

```python
from flask import Flask, make_response, request
import hashlib
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)
app = Flask(__name__)

@app.route('/api/product/<product_id>')
def get_product(product_id):
    """
    Serve product data with appropriate caching headers.

    Why we set these headers:
    - Reduces server load
    - Improves user experience
    - Enables CDN caching
    """

    # Fetch product data
    product = database.get_product(product_id)

    if not product:
        return {"error": "Product not found"}, 404

    # Generate ETag from content
    content = json.dumps(product)
    etag = hashlib.md5(content.encode()).hexdigest()

    # Check if client has current version
    client_etag = request.headers.get('If-None-Match')
    if client_etag == etag:
        logger.info(f"ETag match for product {product_id}, returning 304")
        return '', 304

    # Create response with caching headers
    response = make_response(content)
    response.headers['Content-Type'] = 'application/json'

    # ETag for validation
    response.headers['ETag'] = etag

    # Last-Modified
    last_modified = product.get('updated_at', datetime.utcnow())
    response.headers['Last-Modified'] = last_modified.strftime('%a, %d %b %Y %H:%M:%S GMT')

    # Cache-Control
    # Product data can be cached for 5 minutes by CDN, 1 minute by browser
    response.headers['Cache-Control'] = 'public, max-age=60, s-maxage=300'

    # Vary header (cache separately based on these headers)
    response.headers['Vary'] = 'Accept-Encoding, Accept-Language'

    logger.info(f"Serving product {product_id} with caching headers")
    return response


@app.route('/static/<path:filename>')
def serve_static(filename):
    """
    Serve static assets with long-term caching.

    Assumption: Filenames include content hash (e.g., app.abc123.js)
    When file changes, hash changes, new URL, no stale cache issues.
    """
    response = make_response(send_file(f'static/{filename}'))

    # Long-term caching for static assets with hash in filename
    response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'

    logger.info(f"Serving static file {filename} with 1-year cache")
    return response


@app.route('/api/user/profile')
def get_user_profile():
    """
    Serve user-specific data (should not be cached by CDN).
    """
    user_id = get_current_user_id()
    profile = database.get_user_profile(user_id)

    response = make_response(json.dumps(profile))
    response.headers['Content-Type'] = 'application/json'

    # Private caching only (browser can cache, CDN cannot)
    response.headers['Cache-Control'] = 'private, max-age=300'

    logger.info(f"Serving private profile for user {user_id}")
    return response


@app.route('/api/checkout')
def checkout():
    """
    Sensitive operation - no caching.
    """
    # Process checkout
    result = process_checkout()

    response = make_response(json.dumps(result))
    response.headers['Content-Type'] = 'application/json'

    # No caching for sensitive operations
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    response.headers['Pragma'] = 'no-cache'  # HTTP 1.0 compatibility

    return response
```

### CDN Configuration Examples

**CloudFront (AWS)**:

```python
# Configure CloudFront with boto3
import boto3

cloudfront = boto3.client('cloudfront')

# Create distribution
distribution_config = {
    'Origins': [{
        'Id': 'my-api',
        'DomainName': 'api.example.com',
        'CustomOriginConfig': {
            'HTTPPort': 80,
            'HTTPSPort': 443,
            'OriginProtocolPolicy': 'https-only'
        }
    }],
    'DefaultCacheBehavior': {
        'TargetOriginId': 'my-api',
        'ViewerProtocolPolicy': 'redirect-to-https',
        'AllowedMethods': ['GET', 'HEAD', 'OPTIONS'],
        'CachedMethods': ['GET', 'HEAD'],
        'ForwardedValues': {
            'QueryString': True,
            'Headers': ['Accept', 'Accept-Language'],
            'Cookies': {'Forward': 'none'}
        },
        'MinTTL': 0,
        'DefaultTTL': 3600,  # 1 hour
        'MaxTTL': 86400  # 24 hours
    },
    'CacheBehaviors': [
        {
            # Special caching for static assets
            'PathPattern': '/static/*',
            'TargetOriginId': 'my-api',
            'ViewerProtocolPolicy': 'https-only',
            'MinTTL': 31536000,  # 1 year
            'DefaultTTL': 31536000,
            'MaxTTL': 31536000,
            'Compress': True
        }
    ]
}
```

**Cloudflare Configuration**:

```javascript
// Cloudflare Worker for custom caching logic
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Check cache
  const cache = caches.default
  let response = await cache.match(request)

  if (response) {
    console.log('Cache hit:', url.pathname)
    return response
  }

  // Fetch from origin
  response = await fetch(request)

  // Clone response before caching
  const clonedResponse = response.clone()

  // Custom caching logic
  if (shouldCache(url, response)) {
    // Modify response headers
    const headers = new Headers(clonedResponse.headers)
    headers.set('Cache-Control', getCacheControl(url))

    const cachedResponse = new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers
    })

    // Store in cache
    event.waitUntil(cache.put(request, cachedResponse))
  }

  return response
}

function shouldCache(url, response) {
  // Don't cache errors
  if (!response.ok) return false

  // Don't cache user-specific content
  if (url.pathname.startsWith('/api/user/')) return false

  // Cache static assets
  if (url.pathname.startsWith('/static/')) return true

  // Cache successful API responses
  if (url.pathname.startsWith('/api/')) return true

  return false
}

function getCacheControl(url) {
  // Long-term for static assets
  if (url.pathname.startsWith('/static/')) {
    return 'public, max-age=31536000, immutable'
  }

  // Short-term for API
  if (url.pathname.startsWith('/api/')) {
    return 'public, max-age=300'  // 5 minutes
  }

  return 'public, max-age=3600'  // 1 hour default
}
```

## Distributed Cache Challenges

When caching in distributed systems, several challenges arise that don't exist in single-server scenarios.

### 1. Cache Stampede (Thundering Herd)

**What it is**: When a popular cache entry expires, many concurrent requests try to regenerate it simultaneously, overwhelming the database.

**Scenario**:
```
1. Popular item's cache expires
2. 1000 simultaneous requests arrive
3. All 1000 requests see cache miss
4. All 1000 query the database simultaneously
5. Database gets overwhelmed
```

**Solution: Lock-based approach**:

```python
import redis
import logging
import time

logger = logging.getLogger(__name__)
cache = redis.Redis(host='localhost', port=6379)

def get_with_stampede_protection(key, loader_function, ttl=300, lock_timeout=10):
    """
    Prevent cache stampede using distributed locks.

    How it works:
    1. Check cache
    2. On miss, try to acquire lock
    3. If lock acquired, fetch from DB and cache
    4. If lock not acquired, wait briefly and retry

    Why this prevents stampede:
    - Only one process fetches from DB
    - Others wait and read from cache
    - Database load stays manageable
    """
    # Try cache first
    try:
        value = cache.get(key)
        if value:
            logger.debug(f"Cache hit: {key}")
            return value
    except redis.RedisError as e:
        logger.error(f"Cache read error: {e}")

    # Cache miss - try to acquire lock
    lock_key = f"{key}:lock"
    lock_acquired = False

    try:
        # Try to set lock with NX (only if not exists) and EX (expiration)
        lock_acquired = cache.set(lock_key, "1", nx=True, ex=lock_timeout)

        if lock_acquired:
            logger.info(f"Lock acquired for {key}, fetching from DB")

            # We got the lock - fetch from database
            try:
                value = loader_function()

                if value is not None:
                    # Cache the result
                    cache.setex(key, ttl, value)
                    logger.info(f"Cached {key} for {ttl}s")

                return value
            finally:
                # Always release lock
                cache.delete(lock_key)
                logger.debug(f"Released lock for {key}")
        else:
            # Someone else is fetching - wait and retry
            logger.debug(f"Lock held by another process for {key}, waiting")
            time.sleep(0.05)  # 50ms

            # Retry a few times
            for attempt in range(5):
                value = cache.get(key)
                if value:
                    logger.debug(f"Cache populated by another process: {key}")
                    return value
                time.sleep(0.05)

            # If still no cache, fetch from DB
            logger.warning(f"Timeout waiting for cache population: {key}")
            return loader_function()

    except redis.RedisError as e:
        logger.error(f"Stampede protection failed: {e}")
        # Fallback to direct DB query
        return loader_function()
```

**Solution: Probabilistic early expiration**:

```python
import random
import time

def get_with_early_expiration(key, loader_function, ttl=300, beta=1.0):
    """
    Probabilistically refresh cache before expiration.

    Based on "Optimal Probabilistic Cache Stampede Prevention" algorithm.

    How it works:
    - As TTL approaches expiration, probability of refresh increases
    - Spreads cache refreshes over time
    - Prevents simultaneous expirations

    Args:
        beta: Controls refresh probability (higher = more eager)
    """
    current_time = time.time()

    # Get value and its metadata
    cache_data = cache.get(key)

    if cache_data:
        value, expiry, last_refresh = parse_cache_data(cache_data)

        # Calculate time until expiration
        delta = expiry - current_time

        # Probabilistic early refresh
        # Probability increases as expiration approaches
        threshold = current_time - delta * beta * math.log(random.random())

        if threshold >= last_refresh:
            # Refresh cache in background
            logger.info(f"Probabilistic early refresh for {key}")
            background_refresh(key, loader_function, ttl)

        return value

    # Cache miss - fetch and cache
    return get_with_stampede_protection(key, loader_function, ttl)
```

### 2. Cache Poisoning

**What it is**: Malicious or erroneous data gets cached, causing widespread issues until the cache expires or is manually cleared.

**Scenarios**:
- User inputs malicious data that gets cached
- Bug causes corrupt data to be cached
- Failed database query results are cached as "not found"
- Partial failure during cache write

**Prevention**:

```python
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

def safe_cache_write(key, value, ttl=300):
    """
    Write to cache with validation and integrity checks.

    Why we validate:
    - Prevents caching corrupt data
    - Detects data tampering
    - Ensures data structure integrity

    Best Practices:
    - Validate before caching
    - Add checksum for integrity
    - Version cache entries
    - Monitor cache errors
    """
    # Validation
    if value is None:
        logger.warning(f"Attempted to cache None for {key}")
        return False

    # Validate data structure
    if not validate_data_structure(value):
        logger.error(f"Invalid data structure for {key}")
        return False

    # Add metadata
    cache_entry = {
        "version": "1.0",
        "timestamp": time.time(),
        "data": value,
        "checksum": compute_checksum(value)
    }

    try:
        serialized = json.dumps(cache_entry)
        cache.setex(key, ttl, serialized)
        logger.info(f"Safely cached {key}")
        return True
    except Exception as e:
        logger.error(f"Failed to cache {key}: {e}")
        return False


def safe_cache_read(key):
    """
    Read from cache with validation.

    Checks:
    - Data integrity (checksum)
    - Version compatibility
    - Data structure validity
    """
    try:
        data = cache.get(key)
        if not data:
            return None

        cache_entry = json.loads(data)

        # Verify checksum
        stored_checksum = cache_entry.get("checksum")
        computed_checksum = compute_checksum(cache_entry["data"])

        if stored_checksum != computed_checksum:
            logger.error(f"Checksum mismatch for {key}, possible corruption")
            cache.delete(key)  # Remove corrupted data
            return None

        # Check version
        version = cache_entry.get("version")
        if version != "1.0":
            logger.warning(f"Version mismatch for {key}: {version}")
            cache.delete(key)  # Remove incompatible version
            return None

        return cache_entry["data"]

    except Exception as e:
        logger.error(f"Error reading cache for {key}: {e}")
        return None


def compute_checksum(data):
    """
    Compute checksum for data integrity verification.
    """
    serialized = json.dumps(data, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()


def validate_data_structure(data):
    """
    Validate data structure before caching.

    Customize based on your data types.
    """
    if isinstance(data, dict):
        # Check for required fields
        required_fields = ["id", "type"]
        if not all(field in data for field in required_fields):
            return False

        # Check for suspicious content
        data_str = json.dumps(data)
        if "<script>" in data_str or "javascript:" in data_str:
            logger.warning("Suspicious content detected in cache data")
            return False

    return True


# Security: Rate limit cache writes per key
def rate_limited_cache_write(key, value, ttl=300, max_writes_per_minute=10):
    """
    Prevent cache poisoning via write flooding.

    Limits how often a specific key can be updated.
    """
    rate_limit_key = f"cache_write_rate:{key}"

    # Check current write count
    write_count = cache.get(rate_limit_key)
    if write_count and int(write_count) >= max_writes_per_minute:
        logger.warning(f"Rate limit exceeded for cache writes to {key}")
        return False

    # Increment write count
    if write_count:
        cache.incr(rate_limit_key)
    else:
        cache.setex(rate_limit_key, 60, 1)

    # Write to cache
    return safe_cache_write(key, value, ttl)
```

### 3. Hot Keys

**What it is**: A small number of cache keys receive a disproportionately large number of requests, creating bottlenecks.

**Scenarios**:
- Celebrity's profile on social media
- Viral content or trending items
- Homepage or landing page data
- Global configuration

**Problem**: Even Redis can struggle with 100,000+ requests/second for a single key.

**Solutions**:

```python
import random
import logging

logger = logging.getLogger(__name__)

# Solution 1: Client-side caching for hot keys
class LocalCacheWrapper:
    """
    Add local in-memory cache in front of Redis.

    Why this helps:
    - Reduces Redis load for hot keys
    - Sub-microsecond access times
    - Automatic per-server caching

    Trade-offs:
    - Short TTL to prevent too much staleness
    - Memory usage in each application server
    """

    def __init__(self, redis_client, local_cache_ttl=5):
        self.redis = redis_client
        self.local_cache = {}
        self.local_cache_ttl = local_cache_ttl

    def get(self, key):
        """
        Check local cache before Redis.
        """
        # Check local cache
        if key in self.local_cache:
            value, expiry = self.local_cache[key]
            if time.time() < expiry:
                logger.debug(f"Local cache hit: {key}")
                return value
            else:
                del self.local_cache[key]

        # Check Redis
        value = self.redis.get(key)

        if value:
            # Store in local cache with short TTL
            expiry = time.time() + self.local_cache_ttl
            self.local_cache[key] = (value, expiry)
            logger.debug(f"Redis hit, cached locally: {key}")

        return value


# Solution 2: Key sharding
def shard_hot_key(base_key, num_shards=10):
    """
    Split hot key across multiple cache keys.

    How it works:
    - Write to all shards
    - Read from random shard
    - Distributes read load across multiple keys

    Example:
    - user:profile:celebrity -> user:profile:celebrity:0 through :9
    - Each shard handles ~10% of traffic
    """
    shard_id = random.randint(0, num_shards - 1)
    return f"{base_key}:shard:{shard_id}"


def write_sharded_key(base_key, value, ttl=300, num_shards=10):
    """
    Write to all shards.
    """
    for i in range(num_shards):
        shard_key = f"{base_key}:shard:{i}"
        cache.setex(shard_key, ttl, value)

    logger.info(f"Wrote to {num_shards} shards for {base_key}")


def read_sharded_key(base_key, num_shards=10):
    """
    Read from random shard.
    """
    shard_key = shard_hot_key(base_key, num_shards)
    value = cache.get(shard_key)

    if value:
        logger.debug(f"Read from shard: {shard_key}")

    return value


# Solution 3: Replication
def read_from_replica(key, replica_nodes):
    """
    Read from Redis replica for hot keys.

    Reduces load on primary Redis server.
    """
    # Try replicas first
    for replica in replica_nodes:
        try:
            value = replica.get(key)
            if value:
                logger.debug(f"Read from replica for {key}")
                return value
        except redis.RedisError:
            continue

    # Fallback to primary
    return cache.get(key)
```

### 4. Cache Coherence

**What it is**: Keeping multiple cache layers consistent when data changes.

**Challenge**: You might have:
- Application in-memory cache
- Redis distributed cache
- CDN cache
- Browser cache

When data changes, all layers need to be updated or invalidated.

**Solution**:

```python
class MultiLayerCacheManager:
    """
    Manage invalidation across multiple cache layers.

    Why this matters:
    - Prevents serving stale data from any layer
    - Coordinates updates across distributed systems
    - Maintains consistency guarantees
    """

    def __init__(self, local_cache, redis_cache, cdn_invalidator):
        self.local = local_cache
        self.redis = redis_cache
        self.cdn = cdn_invalidator

    def invalidate(self, key):
        """
        Invalidate key across all cache layers.

        Order matters:
        1. Invalidate closest caches first (local, Redis)
        2. Then CDN (async, takes longer)
        """
        logger.info(f"Multi-layer invalidation for {key}")

        # Layer 1: Local cache (immediate)
        try:
            if key in self.local:
                del self.local[key]
                logger.debug(f"Invalidated local cache: {key}")
        except Exception as e:
            logger.error(f"Local cache invalidation failed: {e}")

        # Layer 2: Redis (fast)
        try:
            self.redis.delete(key)
            logger.debug(f"Invalidated Redis cache: {key}")
        except redis.RedisError as e:
            logger.error(f"Redis invalidation failed: {e}")

        # Layer 3: CDN (async, can take minutes to propagate)
        try:
            self.cdn.invalidate_async(key)
            logger.debug(f"Initiated CDN invalidation: {key}")
        except Exception as e:
            logger.error(f"CDN invalidation failed: {e}")

    def update(self, key, value, ttl=300):
        """
        Update value across cache layers.

        Alternative to invalidation: push new value.
        """
        # Update Redis first
        try:
            self.redis.setex(key, ttl, value)
        except redis.RedisError as e:
            logger.error(f"Redis update failed: {e}")

        # Update local cache
        expiry = time.time() + min(ttl, 60)  # Short TTL for local
        self.local[key] = (value, expiry)

        # CDN will pull new value on next request after invalidation
        self.cdn.invalidate_async(key)
```

## Application-Level Caching Patterns

### Cache Warming

**What it is**: Proactively loading data into cache before it's requested, preventing initial cache misses.

**When to use**:
- Application startup
- After cache flush
- Before predictable traffic spikes
- For critical frequently-accessed data

**Example**:

```python
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

logger = logging.getLogger(__name__)

class CacheWarmer:
    """
    Warm cache with frequently accessed data.

    Why we do this:
    - Prevents cold start cache misses
    - Ensures good performance from first request
    - Can be scheduled during low-traffic periods

    Best Practices:
    - Warm only frequently accessed data
    - Use background threads to not block startup
    - Monitor warming time and success rate
    - Schedule regular warming for critical data
    """

    def __init__(self, cache_client, database):
        self.cache = cache_client
        self.db = database

    def warm_cache_on_startup(self):
        """
        Warm cache with critical data on application startup.
        """
        logger.info("Starting cache warming")
        start_time = time.time()

        # Data to warm
        warming_tasks = [
            ("homepage:featured", self.load_featured_products),
            ("config:global", self.load_global_config),
            ("categories:top", self.load_top_categories),
        ]

        # Warm in parallel
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {
                executor.submit(self.warm_key, key, loader): key
                for key, loader in warming_tasks
            }

            success_count = 0
            for future in as_completed(futures):
                key = futures[future]
                try:
                    future.result()
                    success_count += 1
                except Exception as e:
                    logger.error(f"Failed to warm {key}: {e}")

        elapsed = time.time() - start_time
        logger.info(f"Cache warming completed: {success_count}/{len(warming_tasks)} in {elapsed:.2f}s")

    def warm_key(self, key, loader_function, ttl=300):
        """
        Load single key into cache.
        """
        try:
            data = loader_function()
            if data:
                self.cache.setex(key, ttl, data)
                logger.debug(f"Warmed cache key: {key}")
        except Exception as e:
            logger.error(f"Error warming {key}: {e}")
            raise

    def warm_user_specific_data(self, user_id):
        """
        Warm cache for specific user (e.g., on login).
        """
        keys_to_warm = [
            (f"user:profile:{user_id}", lambda: self.db.get_user_profile(user_id)),
            (f"user:preferences:{user_id}", lambda: self.db.get_user_preferences(user_id)),
            (f"user:recent_orders:{user_id}", lambda: self.db.get_recent_orders(user_id)),
        ]

        for key, loader in keys_to_warm:
            try:
                self.warm_key(key, loader)
            except Exception as e:
                logger.error(f"Failed to warm user data {key}: {e}")

# Schedule regular cache warming
def schedule_cache_warming(warmer):
    """
    Periodically warm cache for critical data.
    """
    import schedule

    # Warm featured products every hour
    schedule.every(1).hours.do(
        lambda: warmer.warm_key("homepage:featured", warmer.load_featured_products)
    )

    # Warm global config every 30 minutes
    schedule.every(30).minutes.do(
        lambda: warmer.warm_key("config:global", warmer.load_global_config)
    )

    logger.info("Cache warming schedule configured")
```

### Multi-Level Caching

**What it is**: Using multiple cache layers with different characteristics (speed, capacity, scope).

**Typical setup**:
1. **L1**: In-memory cache (fastest, smallest, per-server)
2. **L2**: Distributed cache like Redis (fast, larger, shared)
3. **L3**: CDN (global, largest, for static content)

**Example**:

```python
class MultiLevelCache:
    """
    Multi-level cache with automatic promotion/demotion.

    Cache hierarchy:
    L1 (local) -> L2 (Redis) -> Database

    Benefits:
    - Fastest possible access for hot data
    - Reduced network calls
    - Graceful degradation
    """

    def __init__(self, redis_client, l1_size=1000, l1_ttl=60):
        self.l1 = LRUCache(capacity=l1_size)  # Local in-memory
        self.l2 = redis_client  # Distributed Redis
        self.l1_ttl = l1_ttl

    def get(self, key):
        """
        Get with automatic cache promotion.

        Flow:
        1. Check L1 (local) - fastest
        2. Check L2 (Redis) - fast
        3. Promote from L2 to L1 on hit
        4. Return None on complete miss
        """
        # L1 check
        value = self.l1.get(key)
        if value:
            logger.debug(f"L1 hit: {key}")
            return value

        # L2 check
        try:
            value = self.l2.get(key)
            if value:
                logger.debug(f"L2 hit, promoting to L1: {key}")
                # Promote to L1
                self.l1.put(key, value)
                return value
        except redis.RedisError as e:
            logger.error(f"L2 cache error: {e}")

        logger.debug(f"Complete cache miss: {key}")
        return None

    def set(self, key, value, ttl=300):
        """
        Set in all cache levels.

        Write strategy: write-through to both levels.
        """
        # Write to L2 (persistent distributed cache)
        try:
            self.l2.setex(key, ttl, value)
        except redis.RedisError as e:
            logger.error(f"L2 cache write failed: {e}")

        # Write to L1 (local cache with shorter TTL)
        self.l1.put(key, value)
        logger.debug(f"Cached in L1 and L2: {key}")

    def delete(self, key):
        """
        Invalidate from all levels.
        """
        # Remove from L1
        self.l1.delete(key)

        # Remove from L2
        try:
            self.l2.delete(key)
        except redis.RedisError as e:
            logger.error(f"L2 cache deletion failed: {e}")

        logger.debug(f"Deleted from all levels: {key}")
```

## Use Cases Across Domains

### E-Commerce: Product Catalog

**Challenge**: Millions of products, frequent price changes, high read volume, real-time inventory.

**Caching Strategy**:

```python
class EcommerceProductCache:
    """
    Product caching for e-commerce.

    Requirements:
    - Fast product lookups
    - Real-time inventory accuracy
    - Frequent price updates
    - Category/search result caching
    """

    def get_product(self, product_id):
        """
        Get product with appropriate caching.

        Cache separately:
        - Product details (changes rarely) - 1 hour TTL
        - Pricing (changes frequently) - 5 minute TTL
        - Inventory (real-time) - 30 second TTL
        """
        # Product details
        details_key = f"product:details:{product_id}"
        details = cache.get(details_key)
        if not details:
            details = database.get_product_details(product_id)
            cache.setex(details_key, 3600, details)  # 1 hour

        # Pricing
        price_key = f"product:price:{product_id}"
        price = cache.get(price_key)
        if not price:
            price = database.get_product_price(product_id)
            cache.setex(price_key, 300, price)  # 5 minutes

        # Inventory (short TTL for accuracy)
        inventory_key = f"product:inventory:{product_id}"
        inventory = cache.get(inventory_key)
        if not inventory:
            inventory = database.get_product_inventory(product_id)
            cache.setex(inventory_key, 30, inventory)  # 30 seconds

        return {
            "details": details,
            "price": price,
            "inventory": inventory
        }

    def update_product_price(self, product_id, new_price):
        """
        Update price with immediate cache invalidation.
        """
        # Update database
        database.update_price(product_id, new_price)

        # Invalidate price cache
        cache.delete(f"product:price:{product_id}")

        # Invalidate category pages that might show this product
        self.invalidate_category_caches(product_id)

        # Invalidate search results
        cache.delete("search:*")  # Clear all search caches

    def get_category_products(self, category_id, page=1):
        """
        Cache category product lists.
        """
        key = f"category:{category_id}:page:{page}"

        products = cache.get(key)
        if not products:
            products = database.get_category_products(category_id, page)
            cache.setex(key, 600, products)  # 10 minutes

        return products
```

### Social Media: User Feeds

**Challenge**: Personalized feeds, real-time updates, high write volume, millions of users.

**Caching Strategy**:

```python
class SocialMediaFeedCache:
    """
    Feed caching for social media.

    Challenges:
    - Personalized per user
    - Real-time posts
    - Viral content (hot keys)
    - High write volume
    """

    def get_user_feed(self, user_id, limit=50):
        """
        Get personalized user feed.

        Strategy:
        - Cache recent feed in Redis list
        - Rebuild periodically or on invalidation
        - Use sorted set for ranked feeds
        """
        feed_key = f"feed:{user_id}"

        # Try cache
        cached_feed = cache.lrange(feed_key, 0, limit - 1)
        if cached_feed and len(cached_feed) >= limit:
            logger.debug(f"Feed cache hit for user {user_id}")
            return cached_feed

        # Build feed
        logger.info(f"Building feed for user {user_id}")
        feed = self.build_feed(user_id, limit)

        # Cache as Redis list
        if feed:
            cache.delete(feed_key)
            cache.rpush(feed_key, *feed)
            cache.expire(feed_key, 1800)  # 30 minutes

        return feed

    def add_post_to_followers_feeds(self, post_id, author_id):
        """
        Fan-out post to followers' feeds.

        Write strategy:
        - For users with < 10k followers: write to all feeds (write fanout)
        - For celebrities: readers fetch on demand (read fanout)
        """
        followers = database.get_followers(author_id)

        if len(followers) < 10000:
            # Write fanout - add to each follower's feed
            for follower_id in followers:
                feed_key = f"feed:{follower_id}"
                cache.lpush(feed_key, post_id)
                cache.ltrim(feed_key, 0, 999)  # Keep latest 1000
        else:
            # Celebrity - invalidate feeds, will rebuild on read
            logger.info(f"Celebrity post from {author_id}, invalidating followers' feeds")
            # Mark feeds as stale or use hybrid approach
            cache.set(f"user:{author_id}:new_post", post_id, ex=300)

    def get_trending_posts(self, limit=100):
        """
        Cache trending posts using sorted set.

        Sorted by engagement score.
        """
        trending_key = "trending:posts"

        # Get from cache
        trending = cache.zrevrange(trending_key, 0, limit - 1, withscores=True)

        if trending:
            return trending

        # Rebuild trending
        posts = database.get_trending_posts(limit)
        if posts:
            cache.zadd(trending_key, {
                f"post:{p['id']}": p['engagement_score']
                for p in posts
            })
            cache.expire(trending_key, 300)  # 5 minutes

        return posts
```

### API Rate Limiting

**Challenge**: Enforce request limits per user/IP, high-performance, distributed enforcement.

**Caching Strategy**:

```python
class RateLimiter:
    """
    Redis-based rate limiting.

    Patterns:
    - Fixed window
    - Sliding window log
    - Token bucket
    """

    def check_rate_limit_fixed_window(self, user_id, limit=100, window=60):
        """
        Fixed window rate limiting.

        Simple but has edge case: can exceed limit at window boundaries.

        Example with 100/minute limit:
        - 100 requests at 00:59
        - 100 requests at 01:01
        - Total: 200 requests in 2 seconds
        """
        key = f"rate_limit:{user_id}:{int(time.time() / window)}"

        try:
            count = cache.incr(key)

            if count == 1:
                cache.expire(key, window)

            if count > limit:
                logger.warning(f"Rate limit exceeded for {user_id}: {count}/{limit}")
                return False

            return True
        except redis.RedisError as e:
            logger.error(f"Rate limit check failed: {e}")
            # Fail open (allow) or fail closed (deny)?
            return True

    def check_rate_limit_sliding_window(self, user_id, limit=100, window=60):
        """
        Sliding window log rate limiting.

        More accurate but more memory intensive.

        Uses sorted set with timestamps as scores.
        """
        key = f"rate_limit:sliding:{user_id}"
        now = time.time()
        window_start = now - window

        try:
            # Remove old entries
            cache.zremrangebyscore(key, 0, window_start)

            # Count requests in window
            count = cache.zcard(key)

            if count < limit:
                # Add current request
                cache.zadd(key, {str(now): now})
                cache.expire(key, window)
                return True
            else:
                logger.warning(f"Sliding window rate limit exceeded for {user_id}")
                return False
        except redis.RedisError as e:
            logger.error(f"Sliding window rate limit failed: {e}")
            return True

    def check_rate_limit_token_bucket(self, user_id, capacity=100, refill_rate=10):
        """
        Token bucket rate limiting.

        Most flexible: allows bursts but controls average rate.

        Args:
            capacity: Maximum tokens (burst size)
            refill_rate: Tokens added per second
        """
        key = f"rate_limit:bucket:{user_id}"
        now = time.time()

        # Lua script for atomic token bucket operation
        script = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])

        local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
        local tokens = tonumber(bucket[1])
        local last_refill = tonumber(bucket[2])

        if not tokens then
            tokens = capacity
            last_refill = now
        else
            -- Calculate tokens to add based on time elapsed
            local elapsed = now - last_refill
            local tokens_to_add = elapsed * refill_rate
            tokens = math.min(capacity, tokens + tokens_to_add)
            last_refill = now
        end

        if tokens >= 1 then
            tokens = tokens - 1
            redis.call('HMSET', key, 'tokens', tokens, 'last_refill', last_refill)
            redis.call('EXPIRE', key, 300)
            return 1  -- Allowed
        else
            return 0  -- Rate limited
        end
        """

        try:
            result = cache.eval(script, 1, key, capacity, refill_rate, now)

            if result == 1:
                return True
            else:
                logger.warning(f"Token bucket rate limit exceeded for {user_id}")
                return False
        except redis.RedisError as e:
            logger.error(f"Token bucket rate limit failed: {e}")
            return True
```

### Session Storage

**Challenge**: Fast session lookups, distributed access, automatic expiration, security.

**Caching Strategy**:

```python
class SessionStore:
    """
    Redis-based session storage.

    Requirements:
    - Fast read/write
    - Automatic expiration
    - Shared across servers
    - Secure
    """

    def create_session(self, user_id, session_data, ttl=3600):
        """
        Create new session.
        """
        import secrets

        # Generate secure session ID
        session_id = secrets.token_urlsafe(32)
        key = f"session:{session_id}"

        # Store session data
        session = {
            "user_id": user_id,
            "created_at": time.time(),
            "data": session_data
        }

        cache.hmset(key, session)
        cache.expire(key, ttl)

        logger.info(f"Created session for user {user_id}")
        return session_id

    def get_session(self, session_id):
        """
        Get session data.
        """
        key = f"session:{session_id}"

        session = cache.hgetall(key)
        if not session:
            logger.debug(f"Session not found: {session_id}")
            return None

        # Refresh TTL on access
        cache.expire(key, 3600)

        return session

    def delete_session(self, session_id):
        """
        Delete session (logout).
        """
        key = f"session:{session_id}"
        cache.delete(key)
        logger.info(f"Deleted session: {session_id}")
```

## Best Practices

### Safety

**1. Input Validation**
- Validate all data before caching
- Sanitize user input to prevent cache poisoning
- Check data structure integrity

**2. Security Considerations**
- Never cache sensitive data (passwords, credit cards) without encryption
- Use secure connection to cache (TLS for Redis)
- Implement access controls for cache
- Set appropriate TTL for sensitive data (shorter is safer)
- Consider cache key enumeration attacks

**3. Error Handling**
- Always handle cache failures gracefully
- Implement fallback to database
- Don't expose cache errors to users
- Use circuit breakers for cache dependencies

**4. Data Privacy**
- Don't cache PII without encryption
- Respect user privacy settings
- Implement right to be forgotten (cache invalidation)
- Consider regional data residency requirements

### Quality

**1. Testing Strategies**
- Test cache hit/miss scenarios
- Test cache invalidation logic
- Test with cache failures (resiliency)
- Load test with realistic traffic patterns
- Test cache stampede scenarios

**2. Code Review Checklist**
- Are cache keys unique and predictable?
- Is TTL appropriate for data volatility?
- Is invalidation logic correct and complete?
- Are cache failures handled gracefully?
- Is sensitive data properly protected?
- Are race conditions prevented?

**3. Performance Considerations**
- Monitor cache hit rates (target > 80%)
- Track cache response times (P50, P95, P99)
- Measure memory usage and eviction rates
- Profile cache key distributions
- Monitor cache stampede events

**4. Monitoring & Observability**
```python
import logging
import time
from functools import wraps

logger = logging.getLogger(__name__)

def monitor_cache_operation(operation_name):
    """
    Decorator to monitor cache operations.

    Tracks:
    - Operation latency
    - Success/failure rates
    - Cache hit/miss rates
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()

            try:
                result = func(*args, **kwargs)
                latency = time.time() - start_time

                # Log metrics
                logger.info(f"Cache operation: {operation_name}", extra={
                    "operation": operation_name,
                    "latency_ms": latency * 1000,
                    "status": "success"
                })

                # Send to metrics system (Prometheus, DataDog, etc.)
                metrics.increment(f"cache.{operation_name}.success")
                metrics.histogram(f"cache.{operation_name}.latency", latency)

                return result
            except Exception as e:
                latency = time.time() - start_time

                logger.error(f"Cache operation failed: {operation_name}", extra={
                    "operation": operation_name,
                    "latency_ms": latency * 1000,
                    "status": "error",
                    "error": str(e)
                })

                metrics.increment(f"cache.{operation_name}.error")
                raise

        return wrapper
    return decorator

# Usage
@monitor_cache_operation("get_user_profile")
def get_user_profile(user_id):
    return cache.get(f"user:profile:{user_id}")
```

**5. Alert Thresholds**
- Cache hit rate < 70% (might need better caching strategy)
- Cache latency P95 > 10ms (performance degradation)
- Error rate > 1% (cache instability)
- Eviction rate > 10% (cache too small)
- Memory usage > 80% (risk of evictions)

### Logging

**Structured Logging Example**:

```python
import logging
import json
import uuid

class CacheLogger:
    """
    Structured logging for cache operations.

    Why structured logging:
    - Easy to search and analyze
    - Consistent format across services
    - Enables log aggregation and alerting
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def log_cache_operation(self, operation, key, result, latency, trace_id=None):
        """
        Log cache operation with context.
        """
        log_data = {
            "timestamp": time.time(),
            "operation": operation,
            "cache_key": key,
            "result": result,  # "hit", "miss", "error"
            "latency_ms": latency * 1000,
            "trace_id": trace_id or str(uuid.uuid4())
        }

        if result == "error":
            self.logger.error("Cache operation failed", extra=log_data)
        else:
            self.logger.info("Cache operation", extra=log_data)

    def log_invalidation(self, key, reason, trace_id=None):
        """
        Log cache invalidation.
        """
        log_data = {
            "timestamp": time.time(),
            "operation": "invalidation",
            "cache_key": key,
            "reason": reason,
            "trace_id": trace_id
        }

        self.logger.info("Cache invalidated", extra=log_data)

# Usage with trace ID propagation
def get_product_with_logging(product_id, trace_id):
    """
    Get product with full logging and tracing.
    """
    cache_logger = CacheLogger()
    key = f"product:{product_id}"

    start_time = time.time()

    try:
        value = cache.get(key)
        latency = time.time() - start_time

        if value:
            cache_logger.log_cache_operation("get", key, "hit", latency, trace_id)
            return value
        else:
            cache_logger.log_cache_operation("get", key, "miss", latency, trace_id)

            # Load from database
            value = database.get_product(product_id)

            # Cache for next time
            cache.setex(key, 300, value)
            cache_logger.log_cache_operation("set", key, "success", latency, trace_id)

            return value
    except Exception as e:
        latency = time.time() - start_time
        cache_logger.log_cache_operation("get", key, "error", latency, trace_id)
        raise
```

## Common Pitfalls

### 1. Caching Without TTL
**Problem**: Cache entries live forever, consuming memory and serving stale data.

**Solution**: Always set appropriate TTL. If data never changes, use a long TTL (24 hours) but not infinite.

### 2. Not Handling Cache Failures
**Problem**: Application crashes when cache is unavailable.

**Solution**: Always implement fallback to database. Cache should enhance performance, not be a single point of failure.

### 3. Cache Key Collisions
**Problem**: Different data types share keys, causing incorrect data returns.

**Solution**: Use namespaced keys with clear patterns:
- `user:profile:123`
- `product:details:456`
- `cache_version:v1:user:123`

### 4. Ignoring Cache Stampede
**Problem**: Popular item expires, 1000 requests hit database simultaneously.

**Solution**: Implement stampede protection with locks or probabilistic early expiration.

### 5. Caching Too Much
**Problem**: Caching everything wastes memory and doesn't improve performance.

**Solution**: Cache selectively:
- High-read, low-write data
- Expensive computations
- External API results
- Don't cache what's already fast

### 6. Not Monitoring Cache Performance
**Problem**: Cache issues go unnoticed until users complain.

**Solution**: Monitor hit rates, latency, errors, and memory usage. Set up alerts.

### 7. Inconsistent Invalidation
**Problem**: Forgetting to invalidate cache leads to stale data bugs.

**Solution**:
- Invalidate close to database writes
- Use event-based invalidation
- Document what needs invalidation
- Test invalidation logic

### 8. Serialization Overhead
**Problem**: Serializing large objects takes longer than database query.

**Solution**:
- Cache smaller chunks
- Use efficient serialization (msgpack vs JSON)
- Consider caching results, not raw data

### 9. Security Oversights
**Problem**: Caching sensitive data exposes security risks.

**Solution**:
- Never cache passwords or payment info
- Encrypt sensitive cached data
- Use appropriate TTL for sensitive data
- Implement access controls

### 10. Over-Complicated Caching Logic
**Problem**: Complex caching code is hard to maintain and debug.

**Solution**: Keep it simple. Start with basic patterns and add complexity only when needed.

## Quick Reference

### Cache Pattern Selection

| Pattern | Best For | Avoid When |
|---------|----------|------------|
| Cache-Aside | General purpose, read-heavy | Need guaranteed consistency |
| Read-Through | Simplifying code | Need fine control |
| Write-Through | Strong consistency needs | Write performance critical |
| Write-Behind | High write volume | Can't tolerate data loss |
| Refresh-Ahead | Predictable access patterns | Random access patterns |

### TTL Guidelines

| Data Type | Typical TTL | Reasoning |
|-----------|-------------|-----------|
| Static content | 24 hours - 1 year | Rarely changes |
| Product catalog | 15-60 minutes | Moderate change rate |
| User profiles | 5-15 minutes | Balance freshness & load |
| Prices/Inventory | 30 sec - 5 min | Needs high accuracy |
| API responses | 5-60 minutes | Based on API rate limits |
| Session data | 30-60 minutes | Security vs convenience |
| Rate limit counters | 1 second - 1 minute | Short time windows |

### Redis Data Structure Selection

| Use Case | Data Structure | Why |
|----------|----------------|-----|
| Simple key-value | String | Simplest, fastest |
| Objects with fields | Hash | Memory efficient |
| Lists/Queues | List | Ordered, range queries |
| Unique collections | Set | Fast membership check |
| Leaderboards | Sorted Set | Ordered by score |
| Rate limiting | String (counter) | Atomic increment |
| Real-time events | Pub/Sub | Broadcasting |

### Monitoring Checklist

- [ ] Cache hit rate (target: > 80%)
- [ ] Cache miss rate
- [ ] Cache latency (P50, P95, P99)
- [ ] Error rate
- [ ] Memory usage
- [ ] Eviction rate
- [ ] Key count
- [ ] Connection count
- [ ] Network bandwidth
- [ ] Cache stampede events

### Decision Tree: Should I Cache This?

```
Is it read frequently?
├─ No → Don't cache
└─ Yes → Is it expensive to fetch/compute?
    ├─ No → Don't cache
    └─ Yes → Does it change frequently?
        ├─ Yes → Short TTL or event-based invalidation
        └─ No → Long TTL, cache it!

Is it user-specific?
├─ No → Can cache at CDN/shared cache
└─ Yes → Cache per user, consider privacy

Is it sensitive data?
├─ Yes → Don't cache OR encrypt
└─ No → Safe to cache
```

## Related Topics

- **Load Balancing**: Distributing requests across servers; caching reduces need for complex load balancing
- **Database Optimization**: Proper indexing and query optimization; caching complements but doesn't replace good database design
- **Content Delivery Networks (CDN)**: Global content caching; works in conjunction with application caching
- **Message Queues**: Asynchronous processing; can be used with cache for write-behind patterns
- **API Design**: RESTful APIs and GraphQL; proper HTTP caching headers are part of API design
- **System Design**: Overall architecture; caching is crucial component of scalable system design
- **Monitoring & Observability**: Tracking system health; cache metrics are essential for performance monitoring
- **Security**: Data protection; caching introduces security considerations for sensitive data
- **Microservices**: Distributed architecture; caching becomes more complex but more important
- **Database Replication**: Read replicas; alternative or complement to caching for read scalability

---

**Key Takeaway**: Caching is one of the most effective ways to improve application performance, but it requires careful consideration of consistency, invalidation, and failure handling. Start simple with cache-aside and TTL-based expiration, then add complexity only as your specific use case demands. Always monitor your cache and have fallbacks for when it fails.
