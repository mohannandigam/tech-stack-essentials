# Uber - Evolution of a Real-Time Platform

## What Is This Case Study?

Uber is a ride-hailing platform that evolved from a simple monolithic app into one of the world's most complex real-time distributed systems. This case study examines how Uber's architecture changed across four major phases — from a single MySQL database to thousands of microservices handling millions of trips per day across 10,000+ cities.

### Simple Analogy

Imagine running a taxi dispatch center. When you have 10 taxis in one city, a single person with a phone can handle dispatch. When you have millions of drivers across thousands of cities, you need a massive, automated system — with real-time maps, instant pricing, automatic matching, fraud detection, and payment processing all happening in under a second. Uber's engineering story is about building that system, and rebuilding it multiple times as it outgrew each design.

## Why Does This Matter?

Uber's evolution demonstrates universal engineering lessons:
- **No architecture lasts forever**: What works at 1,000 users breaks at 1,000,000
- **Custom solutions have high costs**: Building your own database sounds smart until you maintain it
- **Real-time systems are uniquely hard**: Location tracking, matching, and pricing must all happen in milliseconds
- **Incremental migration beats big-bang rewrites**: Each phase built on the last

## Problem & Evolution

### Phase 0: 2010-2012 (The Beginning)

**Scale**: San Francisco only, thousands of trips/day

```
Architecture (2010):
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Mobile App  │────►│ PHP Monolith │────►│   MySQL      │
│  (iPhone)    │     │  (dispatch,  │     │   (single    │
│              │     │   payments,  │     │    server)   │
│              │     │   matching)  │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

**This worked because:**
- Small dataset fit in one server's memory
- Single city = simple geospatial queries
- Small team could understand entire codebase
- MVP needed speed-to-market, not scale

### Phase 1: 2012-2014 (Growing Pains)

**Scale**: 50+ cities, millions of trips/day

**What broke:**

```
Problem 1: MySQL Can't Scale Horizontally

One MySQL server:
├── All driver locations → reads saturated
├── All trip data → writes saturated
├── Schema changes → locked entire database for hours
├── Sharding by city → manual, error-prone
└── Cross-city queries → impossible with shards

Problem 2: Monolith Can't Scale Teams

One codebase:
├── 200+ engineers working in same repo
├── One deploy could break everything
├── Deploy cycle: 2 weeks (too slow for growth)
├── Testing: One broken test blocks everyone
└── Feature conflicts between teams
```

**Business pressure:**
- Expanding to 100+ cities globally
- Launching UberX (non-luxury rides) — 10x more trips
- Competitors entering every market
- Need to launch fast in new cities

### Phase 2: Schemaless — Custom NoSQL on MySQL (2014-2016)

#### The Problem Schemaless Solved

Uber needed to stop doing schema migrations. In a relational database, adding a column or changing a data type requires altering the table — which locks it and blocks all reads/writes during the migration. At Uber's scale, this meant:

```
Traditional MySQL migration:
1. Developer adds "estimated_arrival" column to trips table
2. ALTER TABLE trips ADD COLUMN estimated_arrival DATETIME
3. Database locks trips table (~45 minutes for 500M rows)
4. All trip creation/updates fail during lock
5. Users see errors → revenue loss → bad press

Schemaless approach:
1. Developer adds "estimated_arrival" to application code
2. New trips include the field, old trips don't
3. Application handles both formats gracefully
4. Zero downtime, zero lock, zero risk
```

#### Why Not Use an Existing NoSQL Database?

| Option | Why Uber Rejected It |
|--------|---------------------|
| MongoDB | Reliability concerns at the time (pre-WiredTiger engine) |
| Cassandra | Eventual consistency wasn't acceptable for trip data |
| DynamoDB | Vendor lock-in, AWS-only |
| Custom on MySQL | Team already had deep MySQL expertise |

**The decision**: Build a schema-flexible layer on top of MySQL. Get NoSQL flexibility while keeping MySQL's strong consistency and operational familiarity.

#### How Schemaless Works

```python
# Traditional MySQL: Fixed schema
# Every row MUST have these exact columns
# CREATE TABLE trips (
#     trip_id BIGINT PRIMARY KEY,
#     driver_id BIGINT NOT NULL,
#     status VARCHAR(20),
#     fare DECIMAL(10,2),
#     pickup_lat DOUBLE,
#     pickup_lng DOUBLE
# );
# Adding a column = ALTER TABLE = downtime

# Schemaless: Flexible JSON documents in MySQL
# CREATE TABLE schemaless_trips (
#     row_key VARCHAR(36) PRIMARY KEY,
#     column_name VARCHAR(255),
#     ref_key INT,
#     body BLOB,
#     created_at TIMESTAMP
# );
# Adding a field = just include it in the JSON
# No ALTER TABLE, no downtime, no risk
```

```python
# Schemaless document structure
trip_document = {
    "row_key": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 3,
    "data": {
        "trip_id": "uuid-123",
        "driver_id": "driver-456",
        "rider_id": "rider-789",
        "status": "completed",
        "fare": {
            "base": 2.50,
            "distance": 12.30,
            "time": 5.40,
            "surge_multiplier": 1.5,
            "total": 30.30
        },
        "route": {
            "pickup": {"lat": 37.7749, "lng": -122.4194},
            "dropoff": {"lat": 37.3861, "lng": -122.0839}
        },
        # New field added in schema_version 3
        # Old documents without this field still work fine
        "estimated_arrival": "2024-01-15T14:35:00Z"
    }
}

# Reading handles missing fields gracefully
def get_estimated_arrival(trip):
    """Get estimated arrival, handling old documents that lack it."""
    return trip["data"].get("estimated_arrival", None)
```

#### Sharding Strategy

```
┌──────────────────────────────────────────────────────────┐
│              Schemaless Sharding                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  row_key: "550e8400-e29b-41d4-a716-446655440000"        │
│     │                                                    │
│     ▼                                                    │
│  hash(row_key) % num_shards = shard_id                  │
│     │                                                    │
│     ▼                                                    │
│  Shard 0    Shard 1    Shard 2    ...    Shard N        │
│  ┌──────┐  ┌──────┐  ┌──────┐         ┌──────┐        │
│  │MySQL │  │MySQL │  │MySQL │         │MySQL │        │
│  │Master│  │Master│  │Master│         │Master│        │
│  │ + 2  │  │ + 2  │  │ + 2  │         │ + 2  │        │
│  │Repli │  │Repli │  │Repli │         │Repli │        │
│  └──────┘  └──────┘  └──────┘         └──────┘        │
│                                                          │
│  Key rule: NO cross-shard queries                        │
│  If you need data from multiple shards,                  │
│  denormalize it (store copies in both shards)            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Phase 3: Microservices + Docstore (2016-2019)

As Uber grew to 2,000+ engineers, the Schemaless system needed better tooling and the monolith needed to be split up.

#### Monolith to Microservices

```
Before (2014):                    After (2018):
┌──────────────────┐             ┌─────────────┐
│   PHP Monolith   │             │  API Gateway │
│                  │             └──────┬──────┘
│ - Dispatch       │                   │
│ - Payments       │        ┌──────────┼──────────┐
│ - Trip mgmt      │        ▼          ▼          ▼
│ - Pricing        │    ┌────────┐ ┌────────┐ ┌────────┐
│ - Maps           │    │ Market │ │  Trip  │ │Payment │
│ - Users          │    │ place  │ │Service │ │Service │
│ - Fraud          │    └────────┘ └────────┘ └────────┘
│ - Analytics      │        ▼          ▼          ▼
└──────────────────┘    ┌────────┐ ┌────────┐ ┌────────┐
                        │Dispatch│ │ Maps   │ │ Fraud  │
                        │Service │ │Service │ │Service │
                        └────────┘ └────────┘ └────────┘

Result: 2,200+ microservices
Language: Migrated from PHP to Go, Java, Python, Node.js
```

**Why Go for many services:**
- Fast compilation
- Built-in concurrency (goroutines)
- Simple deployment (single binary)
- Low memory footprint
- Strong standard library for networking

#### Docstore: Managed Schemaless

Docstore replaced Schemaless with a managed service that automated:
- Shard management (automatic rebalancing)
- Backup and restore (point-in-time recovery)
- Multi-region replication
- Schema evolution validation
- Monitoring and alerting

### Phase 4: Service Mesh + Platform (2018-Present)

#### The Service Mesh Problem

With 2,200+ microservices, every service needed to handle:
- Service discovery (where is the trip service?)
- Load balancing (which instance should I call?)
- Circuit breaking (what if the payment service is down?)
- Retry logic (what if a call fails transiently?)
- Authentication (is this caller allowed to call me?)
- Observability (tracing, metrics, logging)

Without a service mesh, every team implemented these independently — differently, with different bugs.

```
Before Service Mesh:
┌──────────┐    Custom retry logic    ┌──────────┐
│ Service A├─────────────────────────►│ Service B│
│          │    Custom circuit break  │          │
│  (Go)    │    Custom auth           │  (Java)  │
│          │    Custom tracing        │          │
└──────────┘    Custom load balance   └──────────┘

After Service Mesh:
┌──────────┐  ┌─────────┐         ┌─────────┐  ┌──────────┐
│ Service A│─►│  Proxy  │────────►│  Proxy  │─►│ Service B│
│          │  │(sidecar)│         │(sidecar)│  │          │
│  (Go)    │  │         │         │         │  │  (Java)  │
└──────────┘  └─────────┘         └─────────┘  └──────────┘
                   │                   │
                   └───────┬───────────┘
                           ▼
                    ┌─────────────┐
                    │ Control     │  Centralized config:
                    │ Plane       │  - Routing rules
                    │             │  - Retry policies
                    │             │  - Circuit breakers
                    └─────────────┘  - Auth policies
```

## Geospatial System: Matching Riders and Drivers

### The Core Problem

Every second, Uber must:
1. Track millions of driver locations
2. When a rider requests a ride, find nearby available drivers
3. Estimate arrival time for each candidate
4. Pick the best match considering distance, ETA, driver preferences, and fairness
5. Do all of this in **under 1 second**

### DISCO (Dispatch Optimization)

```
┌──────────────────────────────────────────────────────────┐
│              DISCO Architecture                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. LOCATION INGESTION                                   │
│  ┌──────────────┐                                       │
│  │ Driver apps  │  Location updates every 4 seconds      │
│  │ (millions)   │  via mobile → gateway → Kafka          │
│  └──────────────┘                                       │
│         │                                                │
│         ▼                                                │
│  2. GEOSPATIAL INDEX                                     │
│  ┌──────────────────────────────────────────┐           │
│  │           Google S2 Cell Index            │           │
│  │                                          │           │
│  │  Level 12 cell (~3.3 km²)               │           │
│  │  ┌─────┬─────┬─────┐                   │           │
│  │  │ D1  │ D2  │     │ Each cell holds   │           │
│  │  │ D3  │     │ D5  │ a list of drivers │           │
│  │  │     │ D4  │     │ currently inside  │           │
│  │  └─────┴─────┴─────┘                   │           │
│  └──────────────────────────────────────────┘           │
│         │                                                │
│         ▼                                                │
│  3. RIDE REQUEST                                         │
│  ┌──────────────────────────────────────────┐           │
│  │ Rider requests ride at (lat, lng)         │           │
│  │   → Find S2 cell for this location        │           │
│  │   → Get drivers in this cell + neighbors  │           │
│  │   → Filter: available, correct vehicle    │           │
│  │   → Rank by ETA (not just distance!)      │           │
│  └──────────────────────────────────────────┘           │
│         │                                                │
│         ▼                                                │
│  4. MATCHING ALGORITHM                                   │
│  ┌──────────────────────────────────────────┐           │
│  │ For each candidate driver:                │           │
│  │   score = f(ETA, distance, acceptance_   │           │
│  │            rate, time_since_last_trip,    │           │
│  │            driver_destination_match,      │           │
│  │            surge_zone)                    │           │
│  │                                          │           │
│  │ Assign to highest-scoring driver          │           │
│  │ If driver declines → try next best        │           │
│  └──────────────────────────────────────────┘           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Google S2 Geometry

**What is S2?** A library (created by Google) that divides the Earth's surface into hierarchical cells. Each cell has a unique ID, and you can quickly find which cell contains a given latitude/longitude — and which cells are adjacent.

```python
# Why S2 beats simple latitude/longitude grids:
#
# Problem with lat/lng grids:
# - Grid cells at the equator are ~111 km wide
# - Grid cells near the poles are much smaller
# - You can't do consistent "nearby" searches
#
# S2 cells are roughly equal-area everywhere on Earth

def find_nearby_drivers(rider_lat, rider_lng, radius_meters=2000):
    """Find available drivers near a rider's location."""

    # Convert rider location to S2 cell ID at level 12
    # Level 12 cells are ~3.3 km² — good for urban areas
    rider_cell = s2_cell_from_lat_lng(rider_lat, rider_lng, level=12)

    # Get this cell + all neighboring cells
    # (driver might be just across a cell boundary)
    cells_to_search = get_cell_and_neighbors(rider_cell)

    # Look up drivers in each cell from the in-memory index
    candidates = []
    for cell_id in cells_to_search:
        drivers_in_cell = driver_index.get(cell_id, [])
        for driver in drivers_in_cell:
            if driver.is_available and driver.vehicle_matches:
                distance = haversine(rider_lat, rider_lng,
                                     driver.lat, driver.lng)
                if distance <= radius_meters:
                    candidates.append(driver)

    return candidates
```

### ETA Estimation

Distance alone isn't enough — a driver 500 meters away might have a 10-minute ETA due to traffic, one-way streets, or a highway exit.

```
ETA = f(distance, traffic, road_type, time_of_day, weather)

Input sources:
├── Maps provider (road network, real-time traffic)
├── Historical trip data (average speeds by time/location)
├── Current driver GPS trajectory (speed + direction)
└── ML model (learned from billions of past trips)

The ML model improves accuracy by learning patterns like:
├── "Airport pickups take 5 min extra due to terminal navigation"
├── "Downtown at 5pm has 2x the usual drive time"
├── "This intersection has a long light cycle"
└── "Rain adds ~20% to trip duration in this city"
```

## Surge Pricing: Dynamic Supply and Demand

### How Surge Pricing Works

**What is surge pricing?** When demand for rides exceeds the supply of drivers, prices increase. This serves two purposes: it encourages more drivers to come online (increasing supply) and causes some riders to wait or choose alternatives (reducing demand).

```
Normal: Supply ≈ Demand
├── Plenty of drivers, short wait times
├── Standard pricing (1.0x multiplier)
└── Everyone's happy

Surge: Demand >> Supply
├── Not enough drivers, long wait times
├── Price multiplied (1.5x, 2.0x, 3.0x, etc.)
├── Effect 1: Some riders wait or take transit → demand drops
├── Effect 2: More drivers come online for higher earnings → supply rises
└── Eventually: supply meets demand again
```

```python
# Simplified surge pricing calculation
def calculate_surge(zone_id):
    """
    Calculate surge multiplier for a geographic zone.

    The real implementation is much more complex, but this
    shows the core concept: price based on supply/demand ratio.
    """
    demand = count_open_requests(zone_id)
    supply = count_available_drivers(zone_id)

    if supply == 0:
        return MAX_SURGE  # Cap the multiplier (e.g., 8.0x)

    ratio = demand / supply

    # No surge if supply meets demand
    if ratio <= 1.2:
        return 1.0

    # Graduated surge based on supply/demand ratio
    surge = min(
        1.0 + (ratio - 1.0) * SURGE_SENSITIVITY,
        MAX_SURGE
    )

    # Smooth with previous value to prevent rapid oscillation
    previous = get_previous_surge(zone_id)
    smoothed = 0.7 * surge + 0.3 * previous

    return round(smoothed, 1)
```

### Surge Pricing Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Surge Pricing Pipeline                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Inputs (real-time):                                     │
│  ├── Ride requests per zone (from request service)       │
│  ├── Driver locations per zone (from location service)   │
│  ├── Historical demand patterns (ML model)               │
│  ├── Events calendar (concerts, sports, holidays)        │
│  └── Weather data (rain = higher demand)                 │
│                                                          │
│  Processing:                                             │
│  ├── Apache Kafka → real-time event stream               │
│  ├── Apache Flink → stream processing (sub-second)       │
│  ├── ML model → demand prediction (next 15 minutes)      │
│  └── Surge calculator → per-zone multiplier              │
│                                                          │
│  Output:                                                 │
│  ├── Surge map (updated every 1-2 minutes)               │
│  ├── Price shown to rider before confirming              │
│  └── Driver heatmap (shows where demand is high)         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Event-Driven Architecture with Kafka

Uber is one of the largest Apache Kafka deployments in the world, processing **trillions of messages per day**.

### What Uber Uses Kafka For

```
1. LOCATION UPDATES
   Driver app → Kafka → Location index
   Rate: millions of events/second

2. TRIP STATE CHANGES
   Trip created → Trip matched → Trip started → Trip completed
   Each state change published as an event

3. PAYMENT EVENTS
   Ride completed → Calculate fare → Charge rider → Pay driver
   Async processing via event queue

4. ANALYTICS PIPELINE
   Every user action → Kafka → Data warehouse (Hive/Presto)
   Used for business metrics, ML training data

5. SURGE PRICING
   Supply/demand signals → Kafka → Surge calculator
   Real-time pricing updates

6. FRAUD DETECTION
   User behavior events → Kafka → ML fraud model
   Flag suspicious patterns in real-time
```

## Multi-Region Active-Active

### Why Active-Active

Most companies run active-passive: one primary data center handles traffic, a backup waits idle. Uber runs **active-active**: multiple data centers handle real traffic simultaneously.

```
Active-Passive (typical):
┌────────────┐           ┌────────────┐
│  US-East   │           │  US-West   │
│  (active)  │ ─backup─► │  (passive) │
│  100% load │           │  0% load   │
└────────────┘           └────────────┘

Active-Active (Uber):
┌────────────┐           ┌────────────┐
│  US-East   │ ◄─sync──► │  US-West   │
│  (active)  │           │  (active)  │
│  ~50% load │           │  ~50% load │
└────────────┘           └────────────┘
         ↑                      ↑
         └──── If one fails, ───┘
               the other handles
               100% (automatic)
```

**Why Uber needs this:**
- Riders and drivers can't wait for failover
- A single region outage would shut down transportation for millions
- Data residency requirements (EU data must stay in EU)
- Lower latency by routing to the nearest data center

**Challenges:**
- Data conflicts when the same entity is modified in both regions
- Solution: Geographic sharding (each city is "owned" by one data center)
- Cross-region replication for disaster recovery
- Conflict resolution using last-write-wins with vector clocks

## Results

| Metric | Value |
|--------|-------|
| Monthly active users | 131M+ |
| Cities | 10,000+ globally |
| Trips per day | 6M+ |
| MySQL instances | 2,000+ |
| Microservices | 2,200+ |
| Deploys per week | 10,000+ |
| Kafka messages per day | Trillions |
| Matching latency | < 1 second |
| API response time (p95) | < 200ms |
| Location updates processed | 1M+/second |
| Availability | 99.99% |

## Best Practices Demonstrated

### Safety
- **Graceful degradation**: Core ride functionality works even if non-essential services fail
- **Rate limiting at every layer**: Per-user, per-service, adaptive based on system load
- **Fraud detection**: ML models analyze behavior in real-time to prevent abuse
- **Data residency**: User data stored in compliance with local regulations

### Quality
- **Canary deployments**: New code rolls out to 1% of traffic, then 5%, then 25%, then 100%
- **Automated rollback**: If error rate spikes after deploy, automatic rollback triggers
- **Chaos testing**: Regularly inject failures to validate resilience
- **Load testing**: Simulate peak events (New Year's Eve, Super Bowl) before they happen

### Logging & Observability
- **Distributed tracing**: Every request gets a trace ID across all services
- **Real-time dashboards**: Per-city, per-service health monitoring
- **Anomaly detection**: ML models detect unusual patterns before they become outages
- **Blameless post-incident reviews**: Focused on system improvements, not blame

## Lessons Learned

### 1. Don't Over-Engineer Early
Uber started with a PHP monolith and MySQL. That was the right choice — it let them validate the business quickly. They evolved architecture only when they outgrew it.

### 2. Custom Solutions Have Hidden Costs
Schemaless was brilliant but expensive to maintain. When Uber eventually moved to Docstore (a managed version), they realized they should have invested in managed solutions earlier.

### 3. Incremental Migration Prevents Catastrophe
Uber never did a "big-bang" migration. Each phase ran in parallel with the previous system, with traffic gradually shifted. Any failure only affected a small percentage of trips.

### 4. Observability Must Come First, Not Last
Uber's biggest regret was building tracing infrastructure too late. When you can't see what's happening across 2,200 services, debugging becomes guesswork.

### 5. Standardize Tooling Across Teams
Early Uber let every team choose their own stack. This created an operational nightmare — different logging formats, different deployment pipelines, different monitoring. Eventually they standardized on a common platform.

### 6. Real-Time Systems Need Special Care
Location tracking, matching, and pricing all have hard latency requirements. If the matching system takes 10 seconds instead of 1, riders leave. These systems need dedicated performance engineering.

## Common Pitfalls

| Pitfall | How Uber Encountered It | How They Fixed It |
|---------|------------------------|-------------------|
| Schema migration downtime | MySQL ALTER TABLE locked tables | Built Schemaless (schema-free layer) |
| Cross-shard queries | Sharded by city, needed global analytics | Denormalized data + analytics pipeline |
| Too much tech diversity | Each team chose different tools | Standardized platform for all teams |
| Late observability | Couldn't debug across 2,200 services | Built comprehensive tracing (Jaeger) |
| Surge pricing backlash | Users angry about high prices in emergencies | Added price caps, transparent pricing |

## Related Topics

- [Microservices Architecture](../02-architectures/microservices/README.md) — Service decomposition patterns
- [Database Patterns](../02-architectures/database-patterns/README.md) — Sharding and replication strategies
- [Event-Driven Architecture](../02-architectures/event-driven/README.md) — Kafka and event streaming
- [Kubernetes](../06-infrastructure/kubernetes/README.md) — Container orchestration and service mesh
- [System Design Concepts](../02-architectures/system-design-concepts/README.md) — CAP theorem, scalability patterns
- [Netflix Case Study](./netflix-microservices.md) — Another microservices migration
- [Discord Case Study](./discord-realtime.md) — Another real-time system

---

**Key Takeaway**: Don't over-engineer early. Uber evolved through multiple architectural shifts as scale demanded. Each phase solved current problems while enabling future growth. The architecture that works for 1,000 trips/day is not the architecture that works for 6,000,000.
