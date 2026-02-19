# System Design Concepts

## What is System Design?

**System Design** is the process of defining the architecture, components, interfaces, and data flow of a system to satisfy specific requirements. It's about making informed trade-offs to build systems that are scalable, reliable, maintainable, and meet business needs.

Think of it as architectural blueprints for software. Just as building architects must consider structure, materials, climate, and budget, system designers must consider traffic patterns, failure modes, consistency requirements, and cost.

System design is both an art and a science — there's rarely one "correct" answer, only solutions that are more or less appropriate for specific contexts.

## Simple Analogy

Imagine designing a restaurant:

**Small neighborhood café**:
- One cook, one waiter, one cash register
- 20 seats
- Simple menu
- Everyone knows everyone
- Works great... until it doesn't

**Scaling to a chain**:
- Multiple locations (horizontal scaling)
- Standardized processes (consistency)
- Supply chain management (distributed systems)
- Backup staff (redundancy)
- Menu optimization (caching frequently ordered items)
- Reservation system (load balancing)

System design asks: What happens when your "café" needs to serve millions instead of dozens? How do you maintain quality, speed, and reliability at scale?

## Why Does It Matter?

Most software starts small and simple. But as it succeeds:
- Traffic grows 100x, 1000x, or more
- More users means more data, more requests, more complexity
- Downtime starts costing real money
- Data loss becomes unacceptable
- Performance expectations increase

**Good system design**:
- Scales gracefully as traffic grows
- Survives failures without data loss
- Remains fast under load
- Can be understood and modified by teams
- Balances cost with performance

**Poor system design**:
- Collapses under unexpected traffic
- Loses data when things fail
- Becomes impossibly slow
- Impossible to change without breaking everything
- Costs far more than necessary

This matters whether you're building a startup MVP or a system serving billions. The principles are the same; only the scale changes.

## Core Principles

Every system design decision involves trade-offs. These fundamental principles help you make informed choices.

### 1. Scalability

**Definition**: A system's ability to handle growing amounts of work by adding resources.

**Two dimensions**:

**Vertical Scaling (Scale Up)**:
Add more power to existing machines — bigger CPU, more RAM, faster storage.

```
Before: 4 CPU cores, 16 GB RAM
After:  32 CPU cores, 256 GB RAM
```

**Pros**:
- Simpler (no distributed system complexity)
- No code changes needed
- Better for single-threaded workloads

**Cons**:
- Physical limits (can't scale infinitely)
- Single point of failure
- Expensive (powerful machines cost exponentially more)
- Downtime during upgrades

**Horizontal Scaling (Scale Out)**:
Add more machines to distribute the work.

```
Before: 1 server handling 1000 requests/second
After:  10 servers handling 10,000 requests/second
```

**Pros**:
- Nearly infinite scalability
- Resilient (losing one machine doesn't kill system)
- Cost-effective (use commodity hardware)
- No downtime (rolling deployments)

**Cons**:
- Architectural complexity (distributed systems are hard)
- Data consistency challenges
- Network latency between machines
- More operational overhead

**When to use which**:
- **Vertical**: Start here for simplicity, databases (until you hit limits)
- **Horizontal**: Web servers, stateless services, eventually everything at scale

**Example: E-commerce site**:
- **Web servers**: Horizontal (add servers behind load balancer)
- **Database**: Vertical initially, then sharding for horizontal scaling
- **Cache**: Horizontal (distributed Redis cluster)
- **File storage**: Horizontal (object storage like S3)

### 2. Availability

**Definition**: The percentage of time a system is operational and accessible.

**Measured in "nines"**:
- 99% ("two nines") = ~3.65 days downtime/year
- 99.9% ("three nines") = ~8.76 hours downtime/year
- 99.99% ("four nines") = ~52.6 minutes downtime/year
- 99.999% ("five nines") = ~5.26 minutes downtime/year

**Formula**: `Availability = (Total Time - Downtime) / Total Time × 100%`

**How to achieve high availability**:

**1. Redundancy**:
Eliminate single points of failure by having backups.

```
Single Server:
   Client → Server (if this fails, everything fails)

Redundant Servers:
   Client → Load Balancer → Server 1
                        |→ Server 2
                        |→ Server 3
```

If Server 1 fails, traffic routes to Server 2 and 3.

**2. Replication**:
Keep multiple copies of data so if one copy is lost, others remain.

```
Database Replication:
   Write → Primary DB
           ↓ (replicates)
           ↓
   Read ← Secondary DB 1
   Read ← Secondary DB 2
```

If Primary fails, promote Secondary 1 to Primary.

**3. Failover**:
Automatically switch to backup when primary fails.

**Active-Passive Failover**:
- Primary handles traffic
- Standby ready but idle
- If Primary fails, Standby takes over

**Active-Active Failover**:
- Both handle traffic simultaneously
- If one fails, the other continues
- Better utilization, more complex

**4. Health Checks**:
Monitor system health and remove unhealthy instances.

```
Load Balancer continuously checks:
   GET /health → Server 1 (200 OK) ✅
   GET /health → Server 2 (200 OK) ✅
   GET /health → Server 3 (timeout) ❌ Remove from pool
```

**Example: Payment processing system**:
- Multiple payment servers (redundancy)
- Database replicas in different data centers (replication)
- Automatic failover to backup data center (failover)
- Health checks every 10 seconds (monitoring)
- Target: 99.99% availability (4 nines)

**Trade-offs**:
- **Cost**: More redundancy = higher cost
- **Complexity**: More components to manage and monitor
- **Consistency**: Multiple copies can drift out of sync

### 3. Reliability

**Definition**: The probability that a system performs correctly over time, even when things fail.

**Key aspects**:

**Fault Tolerance**:
Continue operating despite component failures.

**Example**: If one microservice fails, the rest of the system continues functioning (degraded mode).

**Data Durability**:
Guarantee data isn't lost even with hardware failure.

**Example**: Database writes data to multiple disks (RAID) and replicates to other servers.

**Graceful Degradation**:
Reduce functionality rather than failing completely.

**Example**: If recommendation engine fails, show static content instead of crashing.

**Techniques**:

**1. Retries with Exponential Backoff**:
```javascript
async function callExternalAPI(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await sleep(delay);
    }
  }
}
```

**2. Circuit Breaker**:
Stop calling a failing service to prevent cascading failures.

```
States:
  Closed: Normal operation, requests pass through
  Open: Service failing, reject requests immediately
  Half-Open: Test if service recovered

Closed → [too many failures] → Open
Open → [after timeout] → Half-Open
Half-Open → [success] → Closed
Half-Open → [failure] → Open
```

**3. Bulkheads**:
Isolate components so failure in one doesn't affect others.

**Example**: Separate thread pools for different services. If Service A hangs, it only consumes its thread pool, not affecting Service B.

**4. Timeouts**:
Never wait forever for a response.

```javascript
const result = await Promise.race([
  fetchData(),
  timeout(5000) // Fail if takes > 5 seconds
]);
```

### 4. Consistency

**Definition**: All clients see the same data at the same time.

**Spectrum of consistency**:

**Strong Consistency**:
After a write, all reads immediately see the new value.

**Example**: Traditional RDBMS (PostgreSQL, MySQL)
```
Write: balance = 100
Read (anywhere): balance = 100 (immediately)
```

**Pros**: Simple to reason about, no stale data
**Cons**: Slower (requires coordination), less available

**Eventual Consistency**:
After a write, reads will eventually see the new value (not immediately).

**Example**: DynamoDB, Cassandra, DNS
```
Write: balance = 100
Read (immediately): balance = 50 (old value) ❌
Read (after delay): balance = 100 ✅
```

**Pros**: Fast, highly available
**Cons**: Temporarily stale data, complex to reason about

**Read-Your-Own-Writes Consistency**:
After you write something, you always see your write. Others may see it later.

**Example**: Social media — you see your post immediately, followers see it shortly after.

**CAP Theorem** (fundamental constraint):
In a distributed system, you can have at most two of three:
- **C**onsistency: All nodes see the same data
- **A**vailability: Every request gets a response
- **P**artition Tolerance: System continues despite network failures

**In practice, partition tolerance is required** (networks fail), so you choose:
- **CP**: Sacrifice availability for consistency (banking systems)
- **AP**: Sacrifice consistency for availability (social media feeds)

**Example: Bank account balance**:
- **Strong consistency** required (can't show wrong balance)
- Sacrifice some availability (may reject requests during partitions)
- Use RDBMS with ACID transactions

**Example: Social media feed**:
- **Eventual consistency** acceptable (seeing a post 1 second late is fine)
- Maximize availability (system always responsive)
- Use NoSQL with eventual consistency

### 5. Latency vs Throughput

**Latency**: Time to process a single request (milliseconds)
**Throughput**: Number of requests processed per unit time (requests/second)

**Analogy**: 
- **Latency** = How long for one car to drive from A to B
- **Throughput** = How many cars can travel from A to B per hour

**Trade-offs**:

**Optimizing for latency**:
- Use caching (faster individual requests)
- Minimize network hops
- Co-locate services geographically
- Use faster hardware

**Example**: Gaming — need low latency (< 50ms) for responsiveness

**Optimizing for throughput**:
- Batch processing (process many at once)
- Parallelize work
- Optimize resource usage
- Accept higher individual latency for more total volume

**Example**: Data pipeline — process millions of records, OK if each takes longer

**You can improve one at the cost of the other**:

**Higher throughput, higher latency**:
```
Batch API: Accept 1000 requests, process together
Individual latency: 5 seconds
Throughput: 1000 requests / 5 seconds = 200 req/s
```

**Lower latency, lower throughput**:
```
Real-time API: Process each request immediately
Individual latency: 50ms
Throughput: 1 request / 0.05 seconds = 20 req/s
```

**Best case**: Improve both by increasing parallelism:
```
Use 10 servers in parallel:
Individual latency: 50ms (unchanged)
Throughput: 200 req/s (10x improvement)
```

### 6. Partitioning / Sharding

**Definition**: Split data across multiple databases to scale horizontally.

**Why partition?**
- Single database can't hold all data (TB to PB scale)
- Single database can't handle all traffic
- Need horizontal scalability

**How to partition**:

**Horizontal Partitioning (Sharding)**:
Split rows across databases.

```
Users table (100M users):

Shard 1: users 1-25M
Shard 2: users 25M-50M
Shard 3: users 50M-75M
Shard 4: users 75M-100M
```

**Vertical Partitioning**:
Split columns across databases.

```
Users table:

DB 1: userId, email, name (frequently accessed)
DB 2: userId, profile, preferences (rarely accessed)
```

**Partitioning strategies**:

**1. Range-Based**:
Partition by value ranges.

```
Users by ID:
  Shard 1: 1 - 1M
  Shard 2: 1M - 2M
  Shard 3: 2M - 3M
```

**Pros**: Simple, range queries work
**Cons**: Uneven distribution (older users more active)

**2. Hash-Based**:
Use hash function to determine partition.

```
shard = hash(userId) % numShards

userId 12345 → hash → 8273645 % 4 = 1 → Shard 1
userId 67890 → hash → 1823746 % 4 = 2 → Shard 2
```

**Pros**: Even distribution
**Cons**: Range queries impossible, re-sharding is hard

**3. Geographic**:
Partition by location.

```
Shard 1: US users
Shard 2: EU users
Shard 3: Asia users
```

**Pros**: Data locality (low latency), compliance (data residency)
**Cons**: Uneven distribution

**Challenges**:

**1. Cross-Shard Queries**:
Joining data across shards is expensive.

```
Bad: SELECT * FROM users JOIN orders
  (users and orders on different shards = slow)

Good: Denormalize or query shards separately
```

**2. Re-Sharding**:
Adding/removing shards requires moving data.

**Solution**: Consistent hashing to minimize moves.

**3. Hotspots**:
One shard gets disproportionate traffic.

**Solution**: Choose partition key carefully, monitor, re-partition if needed.

## Common Patterns

### Load Balancing

**Definition**: Distribute incoming traffic across multiple servers.

**Why?**
- Single server can only handle limited traffic
- Avoid overloading any one server
- Provide redundancy (failover)

**Load balancer types**:

**Layer 4 (Transport Layer)**:
Routes based on IP and port (fast, simple).

```
Client → Load Balancer (checks IP/port)
           ↓
       [Server 1, Server 2, Server 3]
```

**Layer 7 (Application Layer)**:
Routes based on content (URL, headers, cookies).

```
Client → Load Balancer
           ↓
   /api/users → Server 1
   /api/orders → Server 2
   /api/payments → Server 3
```

**Load balancing algorithms**:

**1. Round Robin**:
Send each request to next server in rotation.

```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1 (wraps around)
```

**Pros**: Simple, even distribution
**Cons**: Doesn't account for server load or capacity

**2. Least Connections**:
Send to server with fewest active connections.

```
Server 1: 10 connections
Server 2: 5 connections ← Send here
Server 3: 15 connections
```

**Pros**: Adapts to load
**Cons**: Requires tracking connections

**3. Weighted Round Robin**:
Send more traffic to more powerful servers.

```
Server 1 (weight 1): Gets 1/6 of traffic
Server 2 (weight 2): Gets 2/6 of traffic
Server 3 (weight 3): Gets 3/6 of traffic
```

**4. IP Hash**:
Route based on client IP (same client → same server).

```
hash(clientIP) % numServers = targetServer
```

**Pros**: Session affinity (useful for stateful apps)
**Cons**: Uneven distribution if few clients

**5. Least Response Time**:
Send to server with fastest response time.

**Pros**: Optimizes latency
**Cons**: Requires monitoring response times

### Caching

**Definition**: Store frequently accessed data in fast storage to reduce latency and load.

**Cache hierarchy** (fastest to slowest):

```
CPU Cache:       1 ns
RAM:            100 ns
SSD:        100,000 ns (100 microseconds)
Network:  1,000,000 ns (1 millisecond)
Disk:    10,000,000 ns (10 milliseconds)
```

**Where to cache**:

**1. Client-Side Cache** (Browser):
```
Browser caches images, CSS, JavaScript
Reduce server load, fastest for user
```

**2. CDN (Content Delivery Network)**:
```
User → CDN (cached HTML, images, videos) → Origin Server
Serve static content from edge locations globally
```

**3. Application Cache** (Redis, Memcached):
```
App → Cache (user sessions, query results) → Database
Reduce database load, improve response time
```

**4. Database Cache** (Query cache):
```
Query → Database Cache → Database
Repeated queries served from cache
```

**Caching strategies**:

**Cache-Aside (Lazy Loading)**:
```
1. Check cache
2. If miss, fetch from DB
3. Store in cache
4. Return result

function getUser(id) {
  let user = cache.get(`user:${id}`);
  if (!user) {
    user = db.query(`SELECT * FROM users WHERE id = ${id}`);
    cache.set(`user:${id}`, user, 3600); // TTL 1 hour
  }
  return user;
}
```

**Pros**: Only cache what's requested
**Cons**: Cache miss penalty, stale data possible

**Write-Through**:
```
1. Write to cache
2. Write to database
3. Return success

function updateUser(id, data) {
  db.update(`UPDATE users SET ... WHERE id = ${id}`, data);
  cache.set(`user:${id}`, data, 3600);
}
```

**Pros**: Cache always consistent
**Cons**: Write latency (two writes), wasted cache space

**Write-Behind (Write-Back)**:
```
1. Write to cache
2. Asynchronously write to database
3. Return success immediately

function updateUser(id, data) {
  cache.set(`user:${id}`, data, 3600);
  queue.enqueue(() => db.update(...)); // Async
}
```

**Pros**: Fast writes
**Cons**: Data loss risk if cache fails before DB write

**Read-Through**:
```
Cache sits in front of database, transparently loads data.

function getUser(id) {
  return cache.get(`user:${id}`); // Cache fetches from DB if needed
}
```

**Pros**: Simpler app code
**Cons**: Tight coupling with cache

**Cache eviction policies**:

**LRU (Least Recently Used)**:
Remove least recently accessed items when full.

**LFU (Least Frequently Used)**:
Remove least frequently accessed items.

**FIFO (First In, First Out)**:
Remove oldest items.

**TTL (Time To Live)**:
Remove items after expiration time.

**Cache challenges**:

**1. Cache Invalidation**:
*"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton*

**Problem**: Keeping cache in sync with database.

**Solutions**:
- TTL (accept stale data for short time)
- Active invalidation (delete cache on update)
- Event-driven invalidation (listen for DB changes)

**2. Cache Stampede**:
Many requests for same expired cache key hit database simultaneously.

**Solution**: Use locks to ensure only one request fetches from DB.

**3. Cold Start**:
Empty cache after restart leads to database overload.

**Solution**: Pre-warm cache with popular data.

### Rate Limiting

**Definition**: Restrict the number of requests a client can make in a time window.

**Why?**
- Prevent abuse (DoS attacks)
- Ensure fair usage
- Protect backend from overload
- Monetization (free tier vs paid)

**Rate limiting algorithms**:

**1. Token Bucket**:
```
Bucket has tokens, each request consumes one token.
Tokens refill at fixed rate.

Bucket capacity: 100 tokens
Refill rate: 10 tokens/second

Request comes in:
  if (bucket.tokens > 0) {
    bucket.tokens--;
    allow();
  } else {
    reject();
  }
```

**Pros**: Handles bursts, smooth over time
**Cons**: Complex implementation

**2. Leaky Bucket**:
```
Requests enter bucket, leak out at constant rate.
If bucket full, reject requests.

Bucket capacity: 100 requests
Leak rate: 10 requests/second
```

**Pros**: Smooth traffic, prevents bursts
**Cons**: Less flexible

**3. Fixed Window**:
```
Allow N requests per time window.

Window: 1 minute
Limit: 100 requests

1:00:00 - 1:00:59: 100 requests allowed
1:01:00 - 1:01:59: 100 requests allowed (resets)
```

**Pros**: Simple
**Cons**: Burst at window edges (200 requests in 1 second at boundary)

**4. Sliding Window Log**:
```
Track timestamp of each request.
Count requests in last N seconds.

Limit: 100 requests/minute

New request at 1:00:30
Count requests between 0:59:30 and 1:00:30
If < 100, allow; else reject.
```

**Pros**: Accurate
**Cons**: Memory-intensive (store all timestamps)

**5. Sliding Window Counter**:
```
Hybrid of fixed window and sliding window log.

Estimate requests in sliding window using two fixed windows.
```

**Pros**: Good balance of accuracy and efficiency
**Cons**: Approximate

**Where to rate limit**:

**Client-Side**: Give immediate feedback (but can be bypassed).
**API Gateway**: Centralized, before reaching backend.
**Service-Level**: Protect specific services.

**Example: API rate limiting**:
```
Response Headers:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 950
  X-RateLimit-Reset: 1623456789

HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

## Design a URL Shortener (Worked Example)

Let's apply all these concepts to design a complete system.

**Requirements**:

**Functional**:
- Shorten URLs: Given a long URL, return a short URL
- Redirect: Given a short URL, redirect to original URL
- Optional: Custom short URLs, expiration, analytics

**Non-functional**:
- High availability (99.9%)
- Low latency (< 100ms)
- Scalable (billions of URLs)
- Durable (no data loss)

**Step 1: Back-of-Envelope Estimation**

**Traffic**:
- 100M new URLs/month
- 1B redirects/month
- Read:Write ratio = 10:1

**Storage**:
- 100M URLs/month × 12 months × 5 years = 6B URLs
- Average URL size: 500 bytes
- Total: 6B × 500 bytes = 3 TB

**Bandwidth**:
- Write: 100M/month = 40 writes/second
- Read: 1B/month = 400 reads/second

**Step 2: API Design**

**Shorten URL**:
```
POST /api/shorten
Request: { "longUrl": "https://example.com/very/long/url" }
Response: { "shortUrl": "https://short.ly/abc123" }
```

**Redirect**:
```
GET /abc123
Response: 302 Redirect to https://example.com/very/long/url
```

**Step 3: Generate Short URL**

**Requirements**:
- Unique for each long URL
- Short (6-8 characters)
- Random (hard to guess)

**Approach 1: Hash + Collision Handling**:
```
hash(longUrl) → base62 encode → take first 7 characters

Example:
longUrl: https://example.com/page
MD5 hash: 5d41402abc4b2a76b9719d911017c592
Base62: a3Km9Lx
Short URL: https://short.ly/a3Km9Lx
```

**Pros**: Deterministic (same URL → same short)
**Cons**: Collisions possible, must check database

**Approach 2: Auto-incrementing ID + Base62**:
```
ID counter: 1, 2, 3, ...
Base62 encode: 1 → b, 2 → c, 3 → d, ...

Example:
ID: 12345678
Base62: dnh5
Short URL: https://short.ly/dnh5
```

**Pros**: No collisions, sequential IDs
**Cons**: Predictable, reveals scale

**Approach 3: Random String + Check**:
```
Generate random 7-character string
Check if exists in database
If not, use it; else retry

Example:
Generate: a3Km9Lx
Check DB: Not exists ✅
Short URL: https://short.ly/a3Km9Lx
```

**Pros**: Random, simple
**Cons**: Potential retries, not deterministic

**Best choice**: Approach 2 (Auto-incrementing ID + Base62) for simplicity and no collisions.

**Step 4: High-Level Design**

```
Client → Load Balancer → Web Servers → Cache → Database
                                          ↓
                                     App Servers
```

**Step 5: Detailed Component Design**

**Database Schema**:
```sql
CREATE TABLE urls (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  short_code VARCHAR(10) UNIQUE,
  long_url TEXT,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX(short_code)
);
```

**Shorten Flow**:
```
1. Client sends long URL
2. Web server checks cache (has this URL been shortened before?)
3. If miss, generate new ID from database
4. Base62 encode ID → short code
5. Store in database: (id, short_code, long_url)
6. Store in cache: (long_url → short_code)
7. Return short URL
```

**Redirect Flow**:
```
1. Client requests short URL (GET /abc123)
2. Web server checks cache (short_code → long_url)
3. If miss, query database
4. Store in cache (for next time)
5. Return 302 redirect to long URL
```

**Step 6: Scale the Design**

**Problem 1: Database is bottleneck**

**Solution 1: Cache heavily** (Redis)
```
Cache hit ratio: 80% (most URLs accessed repeatedly)
Cache only redirects (read-heavy)
TTL: 24 hours
Eviction: LRU
```

**Solution 2: Database replication**
```
Primary (writes): Shorten URLs
Replicas (reads): Redirects

Write → Primary
Read → Load balance across replicas
```

**Solution 3: Database sharding** (for billions of URLs)
```
Shard by short_code range:
  Shard 1: a000000 - k999999
  Shard 2: l000000 - z999999
```

**Problem 2: ID generation bottleneck**

**Solution: Distributed ID generation**

**Approach 1: Range allocation**:
```
Server 1 gets IDs: 1 - 1,000,000
Server 2 gets IDs: 1,000,001 - 2,000,000
Server 3 gets IDs: 2,000,001 - 3,000,000
```

**Approach 2: Twitter Snowflake**:
```
64-bit ID:
- 41 bits: timestamp
- 10 bits: machine ID
- 12 bits: sequence number

Generates unique IDs across all servers.
```

**Problem 3: High read traffic**

**Solution 1: CDN for redirects**
```
Client → CDN (cached redirects) → Origin servers
```

**Problem 4: Analytics (track clicks)**

**Solution: Asynchronous logging**
```
Redirect request → Return 302 immediately
                 → Log to queue (Kafka)
                 → Analytics service processes queue
```

Don't block redirect on analytics write.

**Step 7: Final Architecture**

```
Client
  ↓
CDN (cache redirects)
  ↓
Load Balancer
  ↓
Web Servers (stateless)
  ↓
Cache (Redis)
  ↓
Database (Primary + Replicas)
  ↓
Analytics Queue (Kafka)
  ↓
Analytics Service → Analytics DB
```

**Characteristics**:
- **Scalable**: Add more web servers, cache servers, DB replicas
- **Highly available**: Redundancy at every layer
- **Low latency**: Caching reduces DB load, CDN for global distribution
- **Durable**: Database replication, no data loss

**Step 8: Optimizations**

**Custom short URLs**:
```
POST /api/shorten
{ 
  "longUrl": "https://example.com/page",
  "customCode": "mypage"
}

Check if "mypage" available, else return error.
```

**Expiration**:
```
Store expires_at in database.
Periodically clean expired URLs.
Return 404 for expired short URLs.
```

**Rate limiting**:
```
Limit: 100 URLs/day per user
Prevent abuse and spam.
```

This example demonstrates:
- Scalability (sharding, caching, replication)
- Availability (redundancy, load balancing)
- Reliability (database replication)
- Latency (caching, CDN)
- Trade-offs (eventual consistency for analytics)

## Common Interview Questions

### Q: How would you design Twitter?

**Key requirements**:
- Post tweets (140 characters)
- Follow users
- Timeline (see tweets from followed users)
- Scale: 300M users, 600 tweets/second

**High-level design**:
- **Tweet service**: Store and retrieve tweets
- **Timeline service**: Generate user timelines
- **Follow service**: Manage follower relationships
- **Media service**: Handle images/videos

**Challenges**:
- **Fanout on write vs read**: When user tweets, push to all follower timelines (fanout on write) or compute timeline on request (fanout on read)?
- **Hot users**: Celebrities with millions of followers cause fanout issues
- **Solution**: Hybrid — fanout for normal users, compute on-demand for celebrities

### Q: How would you design Netflix?

**Key requirements**:
- Stream videos
- Recommendation engine
- 200M users, 1B hours watched/month

**High-level design**:
- **CDN**: Distribute video content globally (use Netflix Open Connect)
- **Encoding service**: Transcode videos to multiple formats/bitrates
- **Recommendation service**: ML-based recommendations
- **Playback service**: Adaptive bitrate streaming

**Challenges**:
- **Bandwidth**: Distribute petabytes of video data globally
- **Solution**: CDN with servers in ISPs, cache popular content closer to users

### Q: How would you design Uber?

**Key requirements**:
- Match riders with drivers
- Real-time location tracking
- ETA calculation
- 10M rides/day

**High-level design**:
- **Location service**: Track driver locations (geospatial index)
- **Matching service**: Find nearby drivers, match with riders
- **Trip service**: Manage ride lifecycle
- **Payment service**: Process payments

**Challenges**:
- **Geospatial queries**: Find drivers within 1 mile of rider
- **Solution**: Use geohashing or QuadTree for efficient location queries

### Q: How do you design for high availability?

**Good answer**:
- **Redundancy**: Eliminate single points of failure (multiple servers, databases, data centers)
- **Replication**: Keep multiple copies of data
- **Failover**: Automatic switchover to backup when primary fails
- **Health checks**: Continuously monitor and remove unhealthy instances
- **Graceful degradation**: Reduce functionality rather than complete failure
- **Chaos engineering**: Intentionally inject failures to test resilience

### Q: SQL vs NoSQL — when to use each?

**Use SQL when**:
- ACID transactions required (banking, e-commerce)
- Complex queries, joins, aggregations
- Structured, relational data
- Strong consistency needed
- Examples: Banking systems, e-commerce transactions

**Use NoSQL when**:
- Massive scale (billions of records)
- High write throughput
- Flexible schema (data structure changes frequently)
- Eventual consistency acceptable
- Examples: Social media feeds, IoT data, session stores

### Q: How would you handle a sudden 10x traffic spike?

**Immediate actions**:
- **Auto-scaling**: Automatically add more servers
- **Cache aggressively**: Reduce database load
- **Rate limiting**: Throttle non-essential requests
- **Graceful degradation**: Turn off non-critical features

**Architectural strategies**:
- **Horizontal scaling**: Design for easy server addition
- **Stateless services**: No session affinity, any server can handle any request
- **Queue-based processing**: Buffer requests, process asynchronously
- **CDN**: Offload static content

## Quick Reference

### System Design Checklist

```
✅ Clarify requirements (functional and non-functional)
✅ Estimate scale (traffic, storage, bandwidth)
✅ Define API (endpoints, request/response formats)
✅ High-level design (components and data flow)
✅ Database schema (tables, indexes, relationships)
✅ Identify bottlenecks (database, network, CPU)
✅ Scale components (caching, replication, sharding)
✅ Consider failures (redundancy, failover, retries)
✅ Monitoring and alerts (metrics, logs, traces)
✅ Security (authentication, authorization, encryption)
```

### CAP Theorem Quick Guide

```
Network Partition (inevitable):
  ↓
Choose:
  CP (Consistency + Partition Tolerance):
    - Sacrifice availability during partitions
    - Use for: Banking, inventory systems
    - Examples: HBase, MongoDB (strong consistency)
  
  AP (Availability + Partition Tolerance):
    - Sacrifice consistency (eventual consistency)
    - Use for: Social media, caching, session stores
    - Examples: Cassandra, DynamoDB, Riak
```

### Scalability Patterns

| Problem | Solution | Example |
|---------|----------|---------|
| Database overload | Read replicas, caching | MySQL replicas + Redis |
| Single point of failure | Redundancy, failover | Multiple servers + load balancer |
| Slow queries | Indexing, denormalization | Add indexes, cache query results |
| High write load | Sharding, queue-based writes | Partition by user ID, Kafka buffer |
| Global latency | CDN, geo-distribution | CloudFront, multi-region deployment |
| Stateful sessions | Stateless design, sticky sessions | JWT tokens, session store in Redis |

## Related Topics

### Architecture Patterns

- **[Microservices Architecture](../microservices/README.md)** — Decompose systems into small services
- **[Event-Driven Architecture](../event-driven/README.md)** — Asynchronous communication patterns
- **[Serverless Architecture](../serverless/README.md)** — Build without managing servers
- **[Monorepo Architecture](../monorepo/README.md)** — Manage multiple projects in one repository

### Infrastructure

- **[Databases](../../06-infrastructure/README.md)** — SQL vs NoSQL, replication, sharding
- **[Caching Strategies](../../06-infrastructure/README.md)** — Redis, Memcached, CDN
- **[Load Balancers](../../06-infrastructure/README.md)** — Nginx, HAProxy, cloud load balancers
- **[Message Queues](../../06-infrastructure/README.md)** — Kafka, RabbitMQ, SQS

### Cloud Services

- **[AWS](../../07-cloud/aws/README.md)** — EC2, RDS, S3, Lambda, DynamoDB
- **[Azure](../../07-cloud/azure/README.md)** — VMs, Cosmos DB, Blob Storage
- **[Google Cloud](../../07-cloud/gcp/README.md)** — Compute Engine, Cloud SQL, Cloud Storage

### Best Practices

- **[Testing](../../03-methodologies/README.md)** — Unit, integration, load testing
- **[Monitoring](../../06-infrastructure/README.md)** — Metrics, logs, traces, alerts
- **[Security](../../08-security/README.md)** — Authentication, authorization, encryption

## Next Steps

1. **Practice whiteboard system design**: Sketch architectures for common systems (Twitter, Uber, Netflix)
2. **Study real-world architectures**: Read engineering blogs from Google, Netflix, Uber, Airbnb
3. **Build a scaled system**: Create a project that requires caching, load balancing, and database replication
4. **Learn distributed systems**: Study consensus algorithms (Raft, Paxos), distributed transactions
5. **Understand trade-offs**: For each decision, identify what you're optimizing for and what you're sacrificing
6. **Read "Designing Data-Intensive Applications"** by Martin Kleppmann — the definitive book on system design

**Ready to apply these concepts?** Explore specific architecture patterns like [Microservices](../microservices/README.md) or [Event-Driven Architecture](../event-driven/README.md) to see how these principles manifest in real systems.
