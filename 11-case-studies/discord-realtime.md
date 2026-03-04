# Discord - Real-Time Messaging at Scale

## What Is This Case Study?

Discord is a communication platform originally built for gamers that grew into a mainstream messaging service. This case study explores how Discord evolved its architecture to handle **billions of messages per day** with sub-100ms delivery — and the engineering decisions that made it possible.

### Simple Analogy

Imagine a post office that delivers letters instantly to millions of mailboxes simultaneously. As more people move to town, the post office must keep delivering just as fast, without losing a single letter, even during rush hour. Discord's engineering challenge is exactly this — instant delivery at massive scale.

## Why Does This Matter?

Real-time messaging is one of the hardest distributed systems problems because it requires:
- **Low latency**: Messages must arrive in under 100ms
- **High availability**: Users expect 24/7 uptime
- **Ordered delivery**: Messages must appear in the right sequence
- **Presence awareness**: Knowing who's online in real-time
- **Scale**: Handling millions of concurrent connections

Discord's journey teaches fundamental lessons about database selection, language choice for concurrency, and caching strategies that apply to any real-time system.

## The Problem

### Initial State (2015)

Discord launched with a standard setup:
- **MongoDB** as the primary database
- **Node.js** for WebSocket connections
- Single-server architecture

This worked fine for early users, but cracks appeared quickly.

### MongoDB Bottleneck

MongoDB stores data as documents. Discord stored each channel's messages in a single document. This created **hot partitions** — a fundamental database problem where one piece of data gets disproportionate traffic.

```
Problem: One popular channel = one hot document

Channel "general" (10,000 members)
├── All reads hit this ONE document
├── All writes lock this ONE document
├── Read latency spikes during "raids" (sudden user floods)
└── Sharding by guild_id didn't help (problem is within a guild)
```

**What is a hot partition?** When many users read and write to the same piece of data simultaneously, that data becomes a bottleneck. It's like having one checkout lane at a grocery store during rush hour — no matter how big the store is, everyone is stuck at the same lane.

### Specific Failures

1. **Read latency**: When a server got "raided" (thousands of users joining at once), loading message history could take 5+ seconds
2. **Write lock contention**: MongoDB's document-level locking meant new messages would queue up waiting for the lock
3. **Memory pressure**: Hot documents stayed in MongoDB's working set, evicting other data from cache
4. **Cascading failures**: One popular channel could degrade an entire database shard

## Solution Evolution

### Phase 1: Move to Cassandra (2017)

#### Why Cassandra?

**Cassandra** is a distributed database designed for high write throughput with no single point of failure. Discord chose it because:

| Feature | MongoDB (Before) | Cassandra (After) |
|---------|-----------------|-------------------|
| Write model | Document locking | Append-only (no locks) |
| Scaling | Vertical + manual sharding | Linear horizontal scaling |
| Hot partitions | Major problem | Eliminated by design |
| Replication | Primary-secondary | Multi-master, tunable |
| Consistency | Strong (with locks) | Tunable (eventual by default) |

#### Data Model Design

The key insight was **time-bucketed partitioning**. Instead of storing all messages for a channel in one place, Discord splits them into 10-day buckets:

```sql
-- Messages partitioned by (channel_id, bucket)
-- Each bucket covers ~10 days of messages
CREATE TABLE messages (
    channel_id bigint,
    bucket int,          -- Time-based bucket (10-day windows)
    message_id bigint,   -- Snowflake ID (contains timestamp)
    author_id bigint,
    content text,
    PRIMARY KEY ((channel_id, bucket), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
```

**Why this works:**
- **Partition key** `(channel_id, bucket)` distributes data evenly across nodes
- **Clustering key** `message_id DESC` means newest messages are read first (most common access pattern)
- **10-day buckets** keep partitions small — even the busiest channel creates manageable partitions
- **No locks needed** — Cassandra uses an append-only storage model

```
Before (MongoDB):
Channel "general" → ONE document (millions of messages)
    → Hot partition, lock contention, slow reads

After (Cassandra):
Channel "general" → Bucket 2024-01 → ~50K messages (fast reads)
                   → Bucket 2024-02 → ~50K messages (fast reads)
                   → Bucket 2024-03 → ~50K messages (fast reads)
    → No hot partitions, no locks, linear scaling
```

#### Handling Eventual Consistency

Cassandra trades strong consistency for availability (it's an "AP" system in CAP theorem terms). Discord handles this by:

1. **Read repair**: If replicas disagree, pick the most recent value
2. **Last-write-wins (LWW)**: For message edits, the latest timestamp wins
3. **Quorum reads for critical paths**: Read from a majority of replicas for important operations
4. **Client-side ordering**: Use Snowflake IDs (which embed timestamps) to sort messages correctly even if they arrive out of order

```python
# Snowflake ID structure (64 bits)
# Discord's variant of Twitter's Snowflake
#
# 42 bits: millisecond timestamp (gives ~139 years)
# 10 bits: worker ID (identifies which server generated the ID)
# 12 bits: sequence number (4096 IDs per millisecond per worker)
#
# Key benefit: IDs are sortable by time, so messages
# always display in the correct order

def snowflake_to_timestamp(snowflake_id):
    """Extract the timestamp from a Discord Snowflake ID."""
    DISCORD_EPOCH = 1420070400000  # Jan 1, 2015
    timestamp_ms = (snowflake_id >> 22) + DISCORD_EPOCH
    return timestamp_ms
```

### Phase 2: ScyllaDB Migration (2022)

After 5 years on Cassandra, Discord hit new scaling challenges:
- **Garbage collection pauses**: Cassandra runs on the JVM, and GC pauses caused latency spikes
- **Compaction overhead**: Background maintenance tasks competed with read/write operations
- **Tail latency**: p99 latency was unpredictable

Discord migrated to **ScyllaDB** — a Cassandra-compatible database written in C++ instead of Java:

| Metric | Cassandra | ScyllaDB |
|--------|-----------|----------|
| p99 read latency | 40-125ms | 15ms |
| p99 write latency | 5-70ms | 5ms |
| GC pauses | Regular | None (no JVM) |
| Nodes needed | 177 | 72 |

**Key takeaway**: The same data model and query patterns worked — they just needed a runtime without garbage collection pauses. This illustrates that sometimes the right optimization is at the infrastructure level, not the application level.

### Phase 3: Elixir for WebSocket Connections (2017-Present)

#### Why Elixir?

Discord needed to manage millions of simultaneous WebSocket connections. They chose **Elixir** (built on the Erlang VM / BEAM) because:

**What is Elixir?** A programming language built for massive concurrency. It runs on the same virtual machine as Erlang, which was designed for telephone switches that needed to handle millions of simultaneous calls without ever going down.

- **Lightweight processes**: The BEAM VM can run millions of processes on a single machine (each uses ~2KB of memory vs ~1MB for OS threads)
- **Fault tolerance**: Supervisor trees automatically restart crashed processes
- **Hot code reloading**: Update code without disconnecting users
- **Built-in distribution**: Nodes can communicate across a cluster natively

```elixir
# Each WebSocket connection is its own lightweight process
# If one crashes, it doesn't affect others
defmodule Discord.Gateway.Session do
  use GenServer

  # Called when a user connects via WebSocket
  def init(user_id) do
    # Subscribe to relevant guild/channel events
    guilds = UserStore.get_guilds(user_id)
    Enum.each(guilds, fn guild_id ->
      PubSub.subscribe("guild:#{guild_id}")
    end)

    {:ok, %{user_id: user_id, guilds: guilds, sequence: 0}}
  end

  # Handle incoming messages from the user
  def handle_info({:new_message, channel_id, message}, state) do
    # Send the message to this user's WebSocket
    frame = encode_message(channel_id, message)
    WebSocket.send(self(), frame)

    {:noreply, %{state | sequence: state.sequence + 1}}
  end

  # Graceful handling when a process crashes
  def terminate(_reason, state) do
    # Clean up presence, unsubscribe from events
    PresenceTracker.remove(state.user_id)
    :ok
  end
end
```

#### Connection Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Discord Architecture                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Users (millions)                                                │
│     │                                                            │
│     ▼                                                            │
│  ┌─────────────┐   Load balanced across                         │
│  │   Gateway    │   multiple gateway servers                     │
│  │  (Elixir)   │   Each handles ~1M connections                 │
│  └──────┬──────┘                                                │
│         │                                                        │
│    ┌────┴────┐                                                  │
│    ▼         ▼                                                  │
│  ┌─────┐  ┌──────────┐                                         │
│  │Redis│  │  Guild    │  Each guild = set of Elixir processes   │
│  │PubSub│  │ Processes│  handling state for that community      │
│  └──┬──┘  └────┬─────┘                                         │
│     │          │                                                 │
│     ▼          ▼                                                 │
│  ┌──────────────────┐                                           │
│  │   ScyllaDB        │  Message persistence                     │
│  │   (Cassandra-     │  Distributed across                      │
│  │    compatible)    │  multiple data centers                    │
│  └──────────────────┘                                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Key Optimizations

### 1. Smart Caching Strategy

Discord uses a **multi-layer cache** to minimize database reads:

```
Layer 1: Client-side cache (in-app)
    → User's device stores recent messages
    → Reduces server requests for scrollback

Layer 2: Redis (per-channel)
    → Last 50 messages per active channel
    → Read-through cache: check Redis first, fall back to DB
    → Invalidation: new message pushes oldest out

Layer 3: ScyllaDB row cache
    → Frequently accessed partitions cached in memory
    → Automatic eviction based on access patterns
```

```python
# Simplified caching logic
class MessageCache:
    """
    Read-through cache for channel messages.

    Why cache the last 50? Because 95% of message reads
    are for the most recent messages (users scrolling up
    to catch up). Only 5% go deeper into history.
    """

    def get_messages(self, channel_id, limit=50):
        # Try Redis first (sub-millisecond)
        cached = redis.get(f"messages:{channel_id}")
        if cached:
            return cached[:limit]

        # Cache miss: query ScyllaDB
        messages = scylla.query(
            "SELECT * FROM messages WHERE channel_id = ? "
            "AND bucket = ? ORDER BY message_id DESC LIMIT ?",
            [channel_id, current_bucket(), limit]
        )

        # Populate cache for next read
        redis.setex(
            f"messages:{channel_id}",
            ttl=3600,  # 1 hour expiry
            value=messages
        )

        return messages

    def on_new_message(self, channel_id, message):
        """Invalidate and update cache when new message arrives."""
        # Push new message to front, trim to 50
        redis.lpush(f"messages:{channel_id}", message)
        redis.ltrim(f"messages:{channel_id}", 0, 49)
```

### 2. Message Fan-Out with Pub/Sub

When a user sends a message, it needs to reach every connected member of that channel. Discord uses **Redis Pub/Sub** for this:

```
User sends message
    │
    ▼
Gateway receives message
    │
    ├── Write to ScyllaDB (async, fire-and-forget)
    │
    ├── Update Redis cache
    │
    └── Publish to Redis Pub/Sub topic "channel:{id}"
            │
            ▼
    All Gateway nodes subscribed to that channel
    receive the message and forward to connected users
```

**Why Redis Pub/Sub over direct messaging?**
- Gateway servers don't need to know about each other
- Adding/removing servers is seamless
- Redis handles the routing
- One publish reaches all subscribers

### 3. Lazy Guild Loading

Discord doesn't load all data for all of a user's servers at connect time. Instead:

```python
# Lazy loading strategy
#
# Problem: A user in 100 guilds connecting would need to load
# member lists, channel states, permissions for ALL 100 guilds
# at once — that's too slow.
#
# Solution: Only load the guild the user is actively viewing.

class LazyGuildLoader:
    def on_user_connect(self, user_id):
        # Only send: guild names, unread counts, notification settings
        # DON'T send: member lists, full channel data, message history
        guilds = self.get_guild_summaries(user_id)
        return {"guilds": guilds, "type": "READY"}

    def on_guild_select(self, user_id, guild_id):
        # NOW load the full data for just this one guild
        members = self.get_member_list(guild_id)
        channels = self.get_channels(guild_id)
        return {"members": members, "channels": channels}
```

### 4. Message Batching

Instead of sending each message as an individual WebSocket frame, Discord batches messages that arrive close together:

```elixir
# Batch WebSocket sends to reduce syscalls
defmodule Discord.Gateway.MessageBatcher do
  @batch_interval_ms 50  # Flush every 50ms

  def init(state) do
    # Start a periodic flush timer
    Process.send_after(self(), :flush, @batch_interval_ms)
    {:ok, %{state | pending: []}}
  end

  def handle_info({:new_message, msg}, state) do
    # Add to pending batch instead of sending immediately
    {:noreply, %{state | pending: [msg | state.pending]}}
  end

  def handle_info(:flush, state) do
    # Send all pending messages as one WebSocket frame
    if state.pending != [] do
      batch = Enum.reverse(state.pending)
      WebSocket.send(state.socket, encode_batch(batch))
    end

    # Schedule next flush
    Process.send_after(self(), :flush, @batch_interval_ms)
    {:noreply, %{state | pending: []}}
  end
end
```

**Why batching helps:**
- Reduces system calls (each `send()` is a kernel call)
- Fewer WebSocket frames means less overhead from frame headers
- Client can process multiple messages at once
- 50ms batching window is imperceptible to users

## Presence System

**Presence** = knowing who's online, idle, or offline. This is surprisingly hard at scale.

### The Challenge

- 200M+ users who can be in multiple guilds
- Status changes must propagate in real-time
- Must handle mass connect/disconnect (e.g., server restarts)

### How Discord Solves It

```
┌───────────────────────────────────┐
│        Presence Architecture       │
├───────────────────────────────────┤
│                                   │
│  User Status Change               │
│       │                           │
│       ▼                           │
│  Gateway Process                  │
│       │                           │
│       ├── Update local state      │
│       │                           │
│       ├── Publish to Redis        │
│       │   Pub/Sub                 │
│       │                           │
│       └── Gossip protocol to      │
│           other gateway nodes     │
│                                   │
│  Optimization: Only broadcast     │
│  presence to guilds with <1000    │
│  online members. For larger       │
│  guilds, use "lazy" presence.     │
│                                   │
└───────────────────────────────────┘
```

**Lazy presence for large guilds**: In a server with 100K members, sending every status change to every member would create a storm of updates. Instead, Discord only sends presence updates for users visible in the member sidebar — typically the top ~100 online members.

## Results

| Metric | Value |
|--------|-------|
| Monthly active users | 200M+ |
| Active servers (guilds) | 19M+ |
| Messages per day | 4B+ |
| Message delivery latency | <100ms (p95) |
| Uptime | 99.99% |
| Concurrent WebSocket connections | Millions |
| Gateway servers | Hundreds |
| Database nodes (ScyllaDB) | 72 (down from 177 Cassandra) |

## Best Practices Demonstrated

### Safety
- **Graceful degradation**: If presence updates slow down, messaging still works
- **Rate limiting**: Users can't spam messages beyond set thresholds
- **Connection limits**: Maximum connections per IP to prevent abuse

### Quality
- **Canary deployments**: New code rolls out to 1% of users first
- **Automated testing**: Integration tests simulate real message patterns
- **Chaos engineering**: Regular failure injection to verify resilience

### Logging & Observability
- **Distributed tracing**: Every message gets a trace ID through the pipeline
- **Custom metrics**: p50/p95/p99 latency tracked per gateway, per region
- **Anomaly detection**: Automatic alerts when message delivery times spike

## Lessons Learned

### 1. Database Choice Matters for Access Patterns
MongoDB wasn't "bad" — it was wrong for Discord's access pattern. The lesson isn't "avoid MongoDB" but "match your database to your read/write patterns." Append-heavy, partition-sensitive workloads need databases designed for that.

### 2. Language Runtime Affects Tail Latency
The Cassandra-to-ScyllaDB migration proved that garbage collection pauses in JVM-based systems can dominate tail latency. For latency-sensitive workloads, consider runtimes without GC pauses.

### 3. Elixir/BEAM Excels at Concurrent Connections
For workloads with millions of simultaneous connections where each connection needs its own state, the BEAM VM's lightweight process model is hard to beat.

### 4. Cache What Users Actually Access
Discord's insight that 95% of reads are for the most recent 50 messages means caching just those 50 messages eliminates 95% of database reads. Understanding access patterns drives caching strategy.

### 5. Observability Enables Scale
You can't optimize what you can't measure. Discord's investment in distributed tracing and custom metrics enables them to identify and fix issues before users notice.

## Related Topics

- [Microservices Architecture](../02-architectures/microservices/README.md) — Discord's service decomposition
- [Event-Driven Architecture](../02-architectures/event-driven/README.md) — Pub/Sub patterns used throughout
- [Caching Patterns](../02-architectures/caching/README.md) — Multi-layer caching strategy
- [Message Queues](../05-backend/message-queues/README.md) — Async processing patterns
- [Databases](../05-backend/databases/README.md) — Database selection criteria
- [Netflix Case Study](./netflix-microservices.md) — Another large-scale distributed system
