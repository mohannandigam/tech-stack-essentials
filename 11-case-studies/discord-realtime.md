# Discord - Real-Time Messaging at Scale

## Overview
Discord handles 4B+ messages/day across 200M+ users with sub-100ms latency. Their architecture evolved from MongoDB to Cassandra to handle hot partitions and message ordering.

## The Problem
**MongoDB Bottleneck (2015)**:
- Single channel = hot document
- Read latency spikes during raids
- Write lock contention
- Sharding by guild ID didn't help

## Solution Evolution

### Phase 1: Move to Cassandra (2017)
**Why Cassandra**:
- No hot partitions
- Linear scalability
- Multi-region replication
- Tunable consistency

**Data Model**:
```sql
-- Messages partitioned by (channel_id, bucket)
CREATE TABLE messages (
    channel_id bigint,
    bucket int,          -- Time-based bucket (10 days)
    message_id bigint,
    author_id bigint,
    content text,
    PRIMARY KEY ((channel_id, bucket), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
```

### Phase 2: Elixir for WebSocket (2017-Present)
**Why Elixir**:
- Lightweight processes (millions per server)
- Built for distributed systems
- Fault tolerance (supervisors)
- Hot code reloading

**Connection Management**:
```elixir
# Each WebSocket = separate process
defmodule Discord.Gateway.Connection do
  use GenServer

  def handle_frame({:text, message}) do
    # Process message
    # Send to appropriate channels
  end
end
```

## Architecture
```
Client → Gateway (Elixir) → State Service → Cassandra
            ↓                      ↓
         Redis Pub/Sub        Redis Cache
```

## Key Optimizations

### 1. Smart Caching
- Last 50 messages per channel in Redis
- Read-through cache
- Invalidate on new message

### 2. Message Batching
- Batch WebSocket sends
- Reduces syscalls
- Improves throughput

### 3. Connection Distribution
- Consistent hashing for routing
- Graceful reconnection
- Session resumption

## Results
- 200M+ monthly users
- 19M+ active servers
- 4B+ messages/day
- <100ms message delivery
- 99.99% uptime

## Lessons
- Database choice matters for access patterns
- Elixir excellent for soft real-time
- Caching critical for read-heavy workloads
- Observability enables debugging at scale
