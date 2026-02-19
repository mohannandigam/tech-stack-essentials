# Uber - Evolution of Real-Time Platform

## Overview
Uber evolved from a simple ride-hailing app to a global platform handling millions of real-time trips daily. This case study covers three major architectural shifts: the database migration from MySQL to Schemaless, the move to microservices with service mesh, and scaling geospatial queries globally.

## Problem & Evolution

### 2010-2012: Early Days (Monolithic PHP + MySQL)
**Scale**: Single city, thousands of trips/day
**Architecture**: Simple LAMP stack
**Database**: Single MySQL instance

**Worked because**:
- Small dataset fit in memory
- Single region
- Simple data model

### 2012-2014: Growth Pains
**Problem**: MySQL couldn't scale horizontally
- Sharding by city required manual work
- Cross-shard queries impossible
- Schema changes blocked deployments

**Business Pressure**:
- Expanding to 100+ cities
- Millions of trips/day
- Real-time matching critical
- Global expansion starting

### Solution: Schemaless (Custom NoSQL on MySQL)
**Innovation**: Built schema-flexible layer on top of MySQL clusters

Why not use MongoDB/Cassandra?
- Operations team knew MySQL well
- Wanted strong consistency
- Needed incremental migration path

## Architecture Evolution

### Phase 1: Schemaless (2014-2016)
```
Schemaless = Application-level sharding + Schema versioning
```

**Key Features**:
- JSON documents stored in MySQL
- Application-side sharding by entity ID
- Schema versioning for backward compatibility
- Strong consistency within shard

**Data Model**:
```python
# Document structure
{
  "entity_id": "uuid",
  "schema_version": 3,
  "data": {
    "trip_id": "uuid",
    "driver_id": "uuid",
    "rider_id": "uuid",
    "status": "completed",
    # ... flexible fields
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Sharding Strategy**:
- Shard key: Entity ID (trip_id, driver_id, rider_id)
- Consistent hashing for distribution
- No cross-shard joins (denormalize data)

### Phase 2: Microservices + Docstore (2016-2019)
**Problem**: Schemaless operational complexity

**Evolution to Docstore**:
- Managed solution built on Schemaless learnings
- Better tooling and automation
- Multi-region support
- Improved backup/restore

### Phase 3: Service Mesh (2018-Present)
**Problem**: Service-to-service communication complexity

**Solution**: Implemented service mesh layer
- Traffic management
- Load balancing
- Circuit breaking
- Observability

## Geospatial Challenges

### The Matching Problem
Match drivers to riders in real-time considering:
- Distance (proximity)
- ETA (traffic conditions)
- Driver preferences
- Rider destination

**Scale**: Millions of location updates per second globally

### Solution: DISCO (Dispatch Optimization)

**Architecture**:
```
┌─────────────────────────────────────────┐
│         Location Updates                 │
│    (Drivers/Riders via mobile app)       │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼───────┐
        │ Geofencing   │ (Filter by city/region)
        │   Service    │
        └──────┬───────┘
               │
        ┌──────▼───────┐
        │  Matching    │
        │  Algorithm   │ (DISCO - Dispatch Optimization)
        └──────┬───────┘
               │
        ┌──────▼───────┐
        │   Trip       │
        │  Creation    │
        └──────────────┘
```

**Geospatial Indexing**:
- Geohash for initial filtering
- S2 cells for precise proximity
- In-memory grid for real-time lookups

**Algorithm Considerations**:
1. **Distance**: Haversine distance (great circle)
2. **ETA**: Real-time traffic from HERE/Google Maps
3. **Capacity**: Driver acceptance rate, time since last trip
4. **Fairness**: Prevent always matching same drivers

## Key Technical Decisions

### 1. Build Schemaless vs Buy NoSQL
**Decision**: Build custom solution on MySQL

**Reasoning**:
- Team expertise in MySQL operations
- Needed strong consistency
- Wanted gradual migration
- Control over sharding logic

**Trade-offs**:
- Engineering investment required
- Operational burden
- Eventually moved to managed (Docstore)

### 2. Event-Driven Architecture
**Decision**: Kafka for real-time data streaming

**Use Cases**:
- Location updates (drivers moving)
- Trip state changes
- Surge pricing calculations
- Analytics pipeline

**Why Kafka**:
- High throughput (millions msg/sec)
- Replay capability
- Multiple consumers
- Exactly-once semantics

### 3. Microservices by Domain
**Decision**: Organize services around business domains

**Service Examples**:
- **Marketplace Service**: Matching, pricing
- **Trip Service**: Trip lifecycle
- **Payment Service**: Billing, payouts
- **Dispatch Service**: Real-time optimization

**Trade-offs**:
- Distributed transactions required
- Complex orchestration
- Network latency overhead

### 4. Multi-Region Active-Active
**Decision**: Run active data centers in multiple regions

**Why**:
- Reduce latency globally
- Disaster recovery
- Regulatory compliance (data residency)

**Challenges**:
- Data replication lag
- Conflict resolution
- Network partitions

## Scaling Patterns Used

### 1. Geospatial Sharding
Shard by geographic region (city):
- New York data in US East
- London data in EU West
- Reduces cross-region queries

### 2. Read Replicas
- Write to master
- Read from replicas
- Eventually consistent reads OK for most features

### 3. Caching Strategy
**L1 Cache**: Application memory (driver locations)
**L2 Cache**: Redis cluster (trip data)
**L3 Cache**: CDN (static assets, maps)

### 4. Rate Limiting
Protect services from overload:
- Per-user limits (prevent abuse)
- Per-service limits (prevent cascades)
- Adaptive rate limiting (based on system load)

## Results

### Scale Achieved
- **Users**: 131M+ monthly active
- **Cities**: 10K+ cities globally
- **Trips**: 6M+ trips per day
- **Databases**: 2,000+ MySQL instances
- **Services**: 2,200+ microservices
- **Deploys**: 10K+ per week

### Performance
- **Matching Latency**: < 1 second
- **API Response Time**: < 200ms p95
- **Location Update Processing**: 1M+ updates/sec
- **Availability**: 99.99%

### Business Impact
- Global expansion enabled
- Real-time surge pricing
- Advanced matching algorithms
- Multiple product lines (Eats, Freight)

## Lessons Learned

### What Worked
1. **Incremental Migration**: Gradual move from monolith prevented big-bang rewrites
2. **Custom Solutions**: Schemaless bridged gap when needed
3. **Domain-Driven Services**: Clear ownership and boundaries
4. **Chaos Testing**: Validated resilience before incidents

### Challenges
1. **Operational Complexity**: 2000+ databases require automation
2. **Data Consistency**: Eventual consistency increased app complexity
3. **Debugging Distributed Systems**: Tracing across services hard
4. **Migration Fatigue**: Multiple database migrations exhausting
5. **Network Overhead**: Service calls add latency

### What They'd Do Differently
1. **Earlier Observability**: Built tracing infrastructure too late
2. **Standardized Tooling**: Too much tech diversity initially
3. **Better Abstractions**: Reduce boilerplate in services
4. **Data Governance**: Establish earlier for compliance

## Related Concepts
- [Microservices Architecture](../02-architectures/microservices/README.md)
- [Database Sharding](../02-architectures/database-patterns/README.md#sharding)
- [Event-Driven Architecture](../02-architectures/event-driven/README.md)
- [Service Mesh](../06-infrastructure/kubernetes/README.md#service-mesh)
- [Geospatial Indexing](../10-domain-examples/dating/README.md#geospatial-search-optimization)
- [Real-Time Systems](../10-domain-examples/social-media/README.md#real-time-features)

---

**Key Takeaway**: Don't over-engineer early. Uber evolved through multiple architectural shifts as scale demanded. Each phase solved current problems while enabling future growth.
