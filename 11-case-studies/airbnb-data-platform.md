# Airbnb - Building a Unified Data Platform

## What Is This Case Study?

Airbnb is a marketplace connecting travelers with hosts offering short-term rentals. This case study examines how Airbnb transformed from hundreds of disconnected data silos into a unified data platform — enabling self-serve analytics, ML experimentation, and data-driven decision making at scale for 7M+ listings across 220+ countries.

### Simple Analogy

Imagine a library where every department keeps its own books in its own building, with its own cataloging system. A researcher needing information from three departments must visit three buildings, learn three systems, and manually combine the results. Airbnb's data transformation was like building a single library with one catalog that gives every researcher instant access to all knowledge — and an AI assistant that helps them find exactly what they need.

## Why Does This Matter?

Every modern company faces the same data challenges Airbnb solved:
- **Data silos**: Teams create isolated databases that can't talk to each other
- **Duplicated work**: Multiple teams build similar pipelines independently
- **Inconsistent metrics**: "Revenue" means different things to different teams
- **Slow insights**: Data scientists spend 80% of time finding and preparing data
- **ML bottleneck**: Training a model requires access to features scattered across systems

Airbnb's solution — a centralized data platform with self-serve tools — has become the blueprint for data-driven organizations.

## The Problem

### Initial State (2014-2016)

As Airbnb grew rapidly, its data infrastructure grew organically — and chaotically:

```
┌──────────────────────────────────────────────────────────────┐
│              Airbnb's Data Chaos (Before)                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Search Team          Payments Team        Trust & Safety    │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐      │
│  │ Own DB   │        │ Own DB   │        │ Own DB   │      │
│  │ Own ETL  │        │ Own ETL  │        │ Own ETL  │      │
│  │ Own      │        │ Own      │        │ Own      │      │
│  │ metrics  │        │ metrics  │        │ metrics  │      │
│  └──────────┘        └──────────┘        └──────────┘      │
│       │                    │                    │            │
│       ▼                    ▼                    ▼            │
│   "Revenue"           "Revenue"            "Revenue"        │
│   = bookings          = net after           = gross          │
│     * price             refunds               amount        │
│                                                              │
│  Three teams. Three definitions of "revenue."                │
│  Which one is right? Nobody knows.                           │
└──────────────────────────────────────────────────────────────┘
```

### Specific Pain Points

1. **100+ isolated databases**: Each team maintained its own data store
2. **No single source of truth**: The same metric had different values depending on who you asked
3. **80% prep, 20% analysis**: Data scientists spent most of their time wrangling data, not building models
4. **Duplicate ETL pipelines**: Multiple teams extracted the same data from production databases, wasting compute
5. **No ML feature reuse**: Each ML model rebuilt the same features from scratch (user history, listing attributes, etc.)
6. **Broken pipelines**: When one team changed their schema, downstream pipelines in other teams would break silently

### Business Impact

- Product decisions delayed by weeks waiting for data
- Conflicting reports created confusion in leadership meetings
- ML models took months to develop due to data access friction
- Engineering resources wasted on maintaining redundant pipelines

## The Solution

Airbnb built a three-layer data platform:

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                   Airbnb Data Platform                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Data Sources                                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                          │
│  │MySQL │ │Dynamo│ │Events│ │ Logs │                          │
│  │(prod)│ │  DB  │ │(user │ │(app) │                          │
│  └──┬───┘ └──┬───┘ │clicks│ └──┬───┘                          │
│     │        │     └──┬───┘    │                               │
│     ▼        ▼        ▼        ▼                               │
│  ┌────────────────────────────────────┐                         │
│  │         Apache Kafka               │  Real-time streaming    │
│  │   (Change Data Capture + Events)   │                         │
│  └────────────────┬───────────────────┘                         │
│                   │                                              │
│     ┌─────────────┼─────────────┐                               │
│     ▼             ▼             ▼                               │
│  ┌──────┐   ┌──────────┐  ┌──────────┐                        │
│  │Spark │   │ Spark    │  │ Flink    │                        │
│  │Batch │   │Streaming │  │Real-time │                        │
│  └──┬───┘   └────┬─────┘  └────┬─────┘                        │
│     │            │              │                               │
│     ▼            ▼              ▼                               │
│  ┌────────────────────────────────────┐                         │
│  │       Data Lake (Amazon S3)        │  Petabytes of raw data  │
│  │    Organized by Minerva schemas    │                         │
│  └────────────────┬───────────────────┘                         │
│                   │                                              │
│     ┌─────────────┼─────────────┐                               │
│     ▼             ▼             ▼                               │
│  ┌──────┐   ┌──────────┐  ┌──────────┐                        │
│  │Hive  │   │ Presto/  │  │ Zipline  │                        │
│  │(SQL) │   │ Trino    │  │(Feature  │                        │
│  │      │   │(fast SQL)│  │  Store)  │                        │
│  └──┬───┘   └────┬─────┘  └────┬─────┘                        │
│     │            │              │                               │
│     ▼            ▼              ▼                               │
│  ┌────────┐ ┌─────────┐  ┌──────────┐                         │
│  │Superset│ │Minerva  │  │ML Models │                         │
│  │(viz)   │ │(metrics)│  │(ranking, │                         │
│  │        │ │         │  │ pricing) │                         │
│  └────────┘ └─────────┘  └──────────┘                         │
│                                                                  │
│  Orchestration: Apache Airflow (created by Airbnb!)              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Layer 1: Data Ingestion (Kafka + Spark)

**What is Kafka?** A distributed messaging system that acts like a conveyor belt for data. Producers put data onto the belt, and any number of consumers can read from it independently, at their own pace.

**What is Change Data Capture (CDC)?** A technique that watches a database for changes (inserts, updates, deletes) and streams those changes to another system. Instead of periodically copying the entire database, you only send what changed.

```python
# Simplified: How Airbnb captures changes from production databases
# (Real implementation uses Debezium + Kafka Connect)

# Before CDC: Nightly full-table dump
# Problem: 6-hour delay, misses intra-day changes, expensive

# After CDC: Stream every change in real-time
# Benefit: Data lake is always within seconds of production

# Example CDC event from production MySQL
cdc_event = {
    "table": "listings",
    "operation": "UPDATE",
    "timestamp": "2024-01-15T14:32:00Z",
    "before": {
        "id": 12345,
        "price_per_night": 150,
        "status": "active"
    },
    "after": {
        "id": 12345,
        "price_per_night": 175,  # Host raised the price
        "status": "active"
    }
}

# This event flows through Kafka to the data lake
# Every downstream system gets the update within seconds
```

**Why Kafka is central:**
- **Decoupling**: Producers don't need to know about consumers
- **Replay**: New consumers can read historical data from any point
- **Ordering**: Events within a partition arrive in order
- **Durability**: Data is replicated across multiple brokers

### Layer 2: Minerva (Metrics Layer)

**The core problem Minerva solves**: When different teams calculate "revenue" differently, which number do you trust?

Minerva is Airbnb's **metrics layer** — a centralized system where metrics are defined once and used everywhere:

```python
# Before Minerva: Every team writes their own SQL
# Team A: SELECT SUM(price) FROM bookings WHERE status = 'confirmed'
# Team B: SELECT SUM(price - refund) FROM bookings WHERE status IN ('confirmed', 'completed')
# Team C: SELECT SUM(price * 0.97) FROM bookings  -- accounts for processing fees
# Three teams, three different "revenue" numbers.

# After Minerva: One definition, used everywhere
# Minerva metric definition (simplified)
metric_definition = {
    "name": "gross_booking_value",
    "description": "Total value of confirmed bookings before fees and refunds",
    "formula": "SUM(reservation.total_price)",
    "filters": {
        "reservation_status": ["confirmed", "completed"],
        "is_test_booking": False
    },
    "dimensions": [
        "country", "listing_type", "booking_channel",
        "check_in_date", "host_segment"
    ],
    "owner": "data-platform-team",
    "certified": True,  # Reviewed and approved
    "sla": {
        "freshness": "daily by 6am UTC",
        "accuracy": "99.9%"
    }
}

# Now ANY team queries the same metric:
# Superset dashboard → uses "gross_booking_value"
# Data scientist notebook → uses "gross_booking_value"
# Executive report → uses "gross_booking_value"
# All get the SAME number.
```

**How Minerva organizes data:**

```
Data Quality Tiers:

Tier 1: "Certified" Metrics
├── Reviewed by data team
├── Tested automatically
├── SLA-backed (guaranteed freshness)
├── Used for executive reporting
└── Example: gross_booking_value, active_listings

Tier 2: "Validated" Datasets
├── Schema documented
├── Owner identified
├── Basic quality checks
└── Example: search_clicks, listing_views

Tier 3: "Raw" Data
├── As-is from source systems
├── No guarantees
├── For exploration only
└── Example: raw_events, debug_logs
```

### Layer 3: Zipline (Feature Store for ML)

**What is a feature store?** A central repository that stores, serves, and manages the input variables (features) used by machine learning models. Without one, every ML team builds features independently — duplicating work and creating inconsistencies.

**Why Airbnb needed Zipline:**

```
Before Zipline:

ML Engineer A (Search Ranking):
  "I need user's booking history"
  → Writes custom SQL (3 days)
  → Writes custom pipeline (2 days)
  → Result: user_booking_count feature

ML Engineer B (Pricing):
  "I need user's booking history"
  → Writes DIFFERENT SQL (3 days)
  → Writes DIFFERENT pipeline (2 days)
  → Result: user_num_bookings feature (slightly different!)

ML Engineer C (Fraud Detection):
  "I need user's booking history"
  → Same thing again...

After Zipline:

Feature defined ONCE:
  "user_booking_count"
  → Computed by Zipline daily
  → Available via API for any model
  → Consistent across all use cases
  → Time: 0 days (already exists)
```

```python
# Zipline feature definition (simplified)
class UserBookingFeatures:
    """
    Features about a user's booking history.
    Used by: search ranking, pricing, fraud detection, recommendations.
    """

    # Define the feature group
    entity = "user"
    entity_key = "user_id"

    # Features computed from booking data
    features = {
        "total_bookings": {
            "description": "Total number of completed bookings",
            "sql": "COUNT(*) FROM bookings WHERE user_id = ? AND status = 'completed'",
            "type": "integer",
            "backfill_days": 365 * 3  # 3 years of history
        },
        "avg_booking_value": {
            "description": "Average booking value in USD",
            "sql": "AVG(total_price_usd) FROM bookings WHERE user_id = ?",
            "type": "float",
            "backfill_days": 365
        },
        "days_since_last_booking": {
            "description": "Days since the user's most recent checkout",
            "sql": "DATEDIFF(CURRENT_DATE, MAX(checkout_date)) FROM bookings WHERE user_id = ?",
            "type": "integer",
            "backfill_days": 365
        },
        "preferred_listing_type": {
            "description": "Most frequently booked listing type",
            "sql": "MODE(listing_type) FROM bookings WHERE user_id = ?",
            "type": "string",
            "backfill_days": 365 * 2
        }
    }

    # Schedule: Recompute daily at 4am UTC
    schedule = "0 4 * * *"


# Using features in an ML model (at serving time):
def predict_search_ranking(user_id, listing_ids):
    """Rank listings for a user's search results."""
    # Get pre-computed user features from Zipline (milliseconds)
    user_features = zipline.get_features(
        entity="user",
        entity_key=user_id,
        feature_names=[
            "total_bookings",
            "avg_booking_value",
            "preferred_listing_type"
        ]
    )

    # Get listing features from Zipline
    listing_features = zipline.get_features_batch(
        entity="listing",
        entity_keys=listing_ids,
        feature_names=[
            "avg_rating", "response_rate",
            "price_percentile", "booking_rate"
        ]
    )

    # Combine and score
    scores = model.predict(user_features, listing_features)
    return sorted(zip(listing_ids, scores), key=lambda x: -x[1])
```

**Zipline's architecture:**

```
Feature Computation:
┌──────────┐    ┌──────┐    ┌───────────┐    ┌──────────┐
│ Raw Data ├───►│Spark ├───►│ Feature   ├───►│ Feature  │
│ (S3)     │    │ Jobs │    │ Tables    │    │ Serving  │
└──────────┘    └──────┘    │ (offline) │    │ (online) │
                            └───────────┘    └────┬─────┘
                                                  │
                            ML Training ◄─────────┤
                            (batch)               │
                                                  │
                            ML Serving ◄──────────┘
                            (real-time, <10ms)
```

### Apache Airflow (Created by Airbnb)

**What is Airflow?** A workflow orchestration platform that schedules and monitors data pipelines. Airbnb created it internally and then open-sourced it — it's now the industry standard.

**The problem Airflow solves**: When you have thousands of data pipelines with complex dependencies, you need a system to:
- Schedule them to run at the right times
- Handle dependencies (pipeline B needs pipeline A's output)
- Retry on failure
- Alert on problems
- Provide visibility into what's running

```python
# Airflow DAG (Directed Acyclic Graph) — a pipeline definition
# This is simplified; real Airbnb DAGs are much more complex

from airflow import DAG
from airflow.operators.spark_submit_operator import SparkSubmitOperator
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta

# Define the pipeline
dag = DAG(
    'daily_booking_metrics',
    description='Compute daily booking metrics for Minerva',
    schedule_interval='0 6 * * *',  # Run at 6am UTC daily
    start_date=datetime(2024, 1, 1),
    default_args={
        'retries': 3,
        'retry_delay': timedelta(minutes=10),
        'on_failure_callback': alert_oncall_engineer
    }
)

# Step 1: Extract new bookings from CDC stream
extract_bookings = SparkSubmitOperator(
    task_id='extract_bookings',
    application='s3://airbnb-etl/extract_bookings.py',
    dag=dag
)

# Step 2: Transform and compute metrics
compute_metrics = SparkSubmitOperator(
    task_id='compute_metrics',
    application='s3://airbnb-etl/compute_booking_metrics.py',
    dag=dag
)

# Step 3: Validate data quality
validate_quality = PythonOperator(
    task_id='validate_quality',
    python_callable=run_quality_checks,
    dag=dag
)

# Step 4: Publish to Minerva
publish_metrics = PythonOperator(
    task_id='publish_to_minerva',
    python_callable=publish_certified_metrics,
    dag=dag
)

# Define the execution order
extract_bookings >> compute_metrics >> validate_quality >> publish_metrics
```

### Apache Superset (Also Created by Airbnb)

**What is Superset?** An open-source data visualization platform. Airbnb created it so that non-engineers (product managers, analysts, executives) could explore data without writing SQL.

**Key features:**
- Drag-and-drop dashboard builder
- SQL editor for power users
- 40+ visualization types
- Role-based access control
- Caching for fast dashboard loads

## Key Decisions and Trade-offs

### Decision 1: Build vs. Buy

| Component | Decision | Reasoning |
|-----------|----------|-----------|
| Workflow orchestration | **Build** (Airflow) | Nothing existed that met their needs |
| Visualization | **Build** (Superset) | Existing tools couldn't handle their scale |
| Feature store | **Build** (Zipline) | Domain-specific requirements |
| Storage | **Buy** (S3) | Commodity, no need to reinvent |
| Compute | **Buy** (Spark) | Industry standard, large community |
| Streaming | **Buy** (Kafka) | Proven at scale, well-supported |

**Lesson**: Build when the problem is core to your business and no existing tool fits. Buy when the problem is well-solved and your implementation won't be meaningfully better.

### Decision 2: SQL as the Interface

Airbnb chose SQL as the universal query language for their data platform:

```sql
-- Anyone at Airbnb can run this query
-- No need to know Python, Spark, or internal APIs
SELECT
    country,
    listing_type,
    COUNT(*) as total_bookings,
    AVG(total_price_usd) as avg_price,
    SUM(total_price_usd) as total_revenue
FROM minerva.certified.bookings
WHERE
    check_in_date >= '2024-01-01'
    AND reservation_status = 'completed'
GROUP BY country, listing_type
ORDER BY total_revenue DESC
LIMIT 20;
```

**Why SQL:** Most business analysts already know SQL. By making SQL the primary interface, Airbnb enabled 5,000+ employees to access data directly — not just the 200 data engineers.

### Decision 3: Data Quality as a Gate

```python
# Data quality checks run BEFORE metrics are published
# If checks fail, the pipeline stops and alerts the on-call

class BookingMetricsQualityChecks:
    """
    Quality gates for booking metrics.
    These must ALL pass before data is published to Minerva.
    """

    def check_completeness(self, data):
        """Ensure no missing data."""
        null_rate = data.filter(col("total_price").isNull()).count() / data.count()
        assert null_rate < 0.001, f"Null rate {null_rate:.4f} exceeds 0.1% threshold"

    def check_freshness(self, data):
        """Ensure data is from today."""
        max_date = data.agg({"event_date": "max"}).collect()[0][0]
        assert max_date == date.today(), f"Latest data is from {max_date}, expected today"

    def check_volume(self, data, historical_avg):
        """Ensure volume is within expected range."""
        count = data.count()
        lower_bound = historical_avg * 0.7  # 30% drop threshold
        upper_bound = historical_avg * 1.5  # 50% spike threshold
        assert lower_bound <= count <= upper_bound, (
            f"Row count {count} outside expected range "
            f"[{lower_bound:.0f}, {upper_bound:.0f}]"
        )

    def check_metric_consistency(self, data):
        """Ensure metrics make sense (e.g., revenue > 0)."""
        negative_prices = data.filter(col("total_price") < 0).count()
        assert negative_prices == 0, f"Found {negative_prices} negative prices"
```

## ML Applications Powered by the Platform

The unified data platform enables Airbnb's most impactful ML systems:

### Search Ranking
- **Problem**: Show the most relevant listings for each search
- **Features used**: User preferences, listing quality, price sensitivity, location
- **Impact**: 5%+ increase in booking conversion

### Smart Pricing
- **Problem**: Help hosts set competitive prices
- **Features used**: Local demand, seasonality, listing attributes, competitor pricing
- **Impact**: 13% increase in bookings for hosts using Smart Pricing

### Fraud Detection
- **Problem**: Identify fake listings, stolen credit cards, fraudulent reviews
- **Features used**: User behavior patterns, booking velocity, device fingerprints
- **Impact**: Prevented millions in fraudulent transactions

### Personalized Recommendations
- **Problem**: Suggest destinations and listings based on user preferences
- **Features used**: Browsing history, booking history, wishlists, similar user behavior
- **Impact**: Significant increase in exploration and bookings

## Results

| Metric | Before | After |
|--------|--------|-------|
| Data users | ~200 (engineers only) | 5,000+ (company-wide) |
| Time to answer a data question | Days to weeks | Minutes to hours |
| ML feature development time | Weeks per feature | Hours (reuse from Zipline) |
| Data sources integrated | Fragmented silos | Unified in S3/Hive |
| Queries per day | ~10K | 100K+ |
| Data managed | Scattered | 10+ PB centralized |
| Certified metrics | None (every team had their own) | 1,000+ single-source-of-truth |
| Pipeline reliability | ~85% daily success | 99%+ daily success |

## Best Practices Demonstrated

### Safety
- **Data access controls**: Role-based access to sensitive data (PII, financial)
- **PII masking**: Personally identifiable information automatically masked in non-production environments
- **Audit logging**: Every query recorded for compliance
- **Data retention policies**: Automated deletion of expired data

### Quality
- **Quality gates**: Data must pass checks before publication
- **Schema evolution**: Backward-compatible schema changes only
- **Data lineage**: Track where every metric comes from (which tables, which transformations)
- **SLA monitoring**: Alert when data freshness or accuracy drops below thresholds

### Logging & Observability
- **Pipeline monitoring**: Airflow dashboards show pipeline health in real-time
- **Data freshness alerts**: Automatic notification when data is stale
- **Query performance tracking**: Slow queries flagged for optimization
- **Cost attribution**: Track compute costs per team and pipeline

## Lessons Learned

### 1. Centralized Data Enables Innovation
When data is accessible, teams can combine datasets in unexpected ways. Airbnb's fraud team used search ranking features to detect suspicious behavior — a combination nobody planned for but that was possible because all features lived in one place.

### 2. Feature Stores Eliminate Duplication
Zipline reduced ML feature development time by 80% by making features reusable. The upfront investment in building the feature store paid for itself within months.

### 3. Self-Serve Reduces Bottlenecks
Before the platform, every data request went through the data engineering team — a bottleneck. Self-serve tools (Superset, SQL access) let 5,000 employees answer their own questions, freeing data engineers to build infrastructure instead of running ad-hoc queries.

### 4. Open Source Creates Leverage
By open-sourcing Airflow and Superset, Airbnb got thousands of external contributors improving their tools for free. Both projects are now Apache Foundation top-level projects used by thousands of companies.

### 5. Data Quality Is Not Optional
The switch from "any data is good data" to "only certified metrics are trusted" eliminated the conflicting-numbers problem. Quality gates caught issues before they reached decision makers.

## Common Pitfalls

| Pitfall | How Airbnb Avoided It |
|---------|----------------------|
| Building everything from scratch | Used existing tools (Kafka, Spark, S3) where possible |
| Ignoring data quality | Built quality gates into every pipeline |
| Making data accessible only to engineers | SQL interface + Superset for non-technical users |
| No metric governance | Minerva's certification tiers and single definitions |
| Feature duplication in ML | Zipline feature store for reuse |
| No visibility into pipelines | Airflow dashboards and alerting |

## Related Topics

- [Databases](../05-backend/databases/README.md) — Understanding database types and selection
- [Event-Driven Architecture](../02-architectures/event-driven/README.md) — Kafka and streaming patterns
- [AI/ML Guide](../09-ai-ml/README.md) — Machine learning fundamentals
- [MLOps](../09-ai-ml/MLOPS_GUIDE.md) — ML operations and feature stores
- [Monitoring](../06-infrastructure/monitoring/README.md) — Observability patterns
- [Netflix Case Study](./netflix-microservices.md) — Another data-heavy platform
