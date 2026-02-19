# Airbnb - Building a Unified Data Platform

## Overview
Airbnb transformed from data silos to a unified platform enabling self-serve analytics, ML experimentation, and data-driven decision making. This powers search ranking, pricing recommendations, fraud detection, and personalization for 7M+ listings.

## The Problem
- Data scattered across 100+ databases
- No single source of truth
- Data scientists spending 80% time on data prep
- Duplicate ETL pipelines
- No ML feature reuse
- Inconsistent metrics definitions

## Solution: Minerva + Zipline
**Minerva**: Data lake + warehouse
**Zipline**: Feature store for ML

### Architecture
```
Sources → Kafka → Spark → Data Lake (S3) → Warehouse (Hive/Presto) → Analytics
                      ↓
                Feature Store (Zipline) → ML Models
```

## Key Decisions
1. **Hive + Presto** for SQL on S3
2. **Airflow** for workflow orchestration
3. **Zipline** for feature management
4. **Superset** for visualization

## Results
- 5000+ data users
- 100K+ queries/day
- 10+ PB of data
- 80% reduction in ML feature time

## Lessons
- Centralized data enables innovation
- Feature stores reduce duplication
- Self-serve reduces bottlenecks
