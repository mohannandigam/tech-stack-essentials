# Snowflake and Databricks: Complete Guide for QA Engineers and ML Teams

## What is This Guide?

Your team uses Snowflake and Databricks together to store, process, and build machine learning models on data. This guide explains both platforms from first principles, how they fit together, how ML pipelines work inside them, how anomaly detection works, and — with special focus — **how QA engineers test every stage**.

By the end you will understand:
- What Snowflake stores and how to query it
- What Databricks does and how ML models are built inside it
- How data flows from Snowflake → Databricks → ML Model → Predictions
- How to generate anomalies from predictions and detect data quality issues
- How to test every stage as a QA engineer, step by step

---

## Table of Contents

1. [The Big Picture: How They Work Together](#1-the-big-picture-how-they-work-together)
2. [Snowflake — The Data Warehouse](#2-snowflake--the-data-warehouse)
3. [Databricks — The Lakehouse Platform](#3-databricks--the-lakehouse-platform)
4. [The Medallion Architecture: Bronze, Silver, Gold](#4-the-medallion-architecture-bronze-silver-gold)
5. [ML Pipelines End-to-End](#5-ml-pipelines-end-to-end)
6. [ML Models in Databricks with MLflow](#6-ml-models-in-databricks-with-mlflow)
7. [Anomaly Detection — Predictions as the Source of Truth](#7-anomaly-detection--predictions-as-the-source-of-truth)
8. [Anomaly Generation from Model Predictions](#8-anomaly-generation-from-model-predictions)
9. [Data Testing — QA at Every Stage](#9-data-testing--qa-at-every-stage)
10. [QA Step-by-Step Testing Guide](#10-qa-step-by-step-testing-guide)
11. [Common QA Failure Scenarios and How to Catch Them](#11-common-qa-failure-scenarios-and-how-to-catch-them)
12. [Quick Reference Cheat Sheet](#12-quick-reference-cheat-sheet)
13. [Related Guides](#13-related-guides)

---

## 1. The Big Picture: How They Work Together

### Simple Analogy

Think of your data platform like a restaurant kitchen:

- **Snowflake** is the **walk-in refrigerator** — it stores all the organized, labeled ingredients (data tables). Chefs (analysts) can open it and take exactly what they need. It's organized, reliable, and SQL-based.

- **Databricks** is the **main kitchen** — where the cooking happens. Chefs (data engineers, data scientists) take ingredients from Snowflake, combine them, transform them, and produce finished dishes (ML models, feature tables, predictions).

- **Delta Lake** (inside Databricks) is the **prep table** — where ingredients are cleaned and organized into stages (bronze/silver/gold) before they become the final dish.

- **MLflow** (inside Databricks) is the **recipe book** — it tracks every experiment, every ingredient combination, and saves the winning recipes (models) so they can be repeated exactly.

### The Complete Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                      YOUR DATA PLATFORM                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  EXTERNAL SOURCES                                                    │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │ App DBs   │  │ APIs      │  │ Kafka     │  │ CSV/Files │       │
│  │(Postgres) │  │(Stripe,   │  │ (Events)  │  │(uploads)  │       │
│  └─────┬─────┘  │ Twilio)   │  └─────┬─────┘  └─────┬─────┘      │
│        │        └─────┬─────┘        │               │             │
│        └──────────────┼──────────────┘               │             │
│                       ▼                               ▼             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    SNOWFLAKE                                │    │
│  │  ┌─────────────────────────────────────────────────────┐   │    │
│  │  │ RAW TABLES (source of truth for structured data)    │   │    │
│  │  │  transactions, customers, products, events          │   │    │
│  │  └─────────────────────────────────────────────────────┘   │    │
│  │  Snowflake Streams → detect new/changed rows                │    │
│  └─────────────────────────────┬──────────────────────────────┘    │
│                                 │                                    │
│                         Connector / JDBC                             │
│                                 │                                    │
│  ┌──────────────────────────────▼──────────────────────────────┐   │
│  │                    DATABRICKS LAKEHOUSE                      │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │   BRONZE     │  │   SILVER     │  │    GOLD      │      │   │
│  │  │  Raw copy    │→ │  Cleaned &   │→ │  Features &  │      │   │
│  │  │  from Snow.  │  │  Validated   │  │  ML-ready    │      │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │   │
│  │                                              │                │   │
│  │  ┌──────────────────────────────────────────▼────────────┐  │   │
│  │  │              ML TRAINING (MLflow)                      │  │   │
│  │  │  Experiments → Best Model → Model Registry            │  │   │
│  │  └──────────────────────────────────────────┬────────────┘  │   │
│  │                                             │                │   │
│  │  ┌──────────────────────────────────────────▼────────────┐  │   │
│  │  │              PREDICTIONS & SCORING                     │  │   │
│  │  │  Batch scores → Anomaly flags → Alerts → Dashboard    │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  QA engineers test every arrow (→) and every box in this diagram   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Snowflake — The Data Warehouse

### What is it?

Snowflake is a **cloud data warehouse** — a place to store and query large amounts of structured data using SQL. "Cloud" means it runs on AWS, Azure, or GCP and you pay for what you use. "Data warehouse" means it's optimized for analytical queries (aggregations, joins across millions of rows) rather than transactional use (updating one row at a time).

### Key Architecture: Separate Storage and Compute

Most databases couple storage and compute together. Snowflake separates them:

```
STORAGE (what you pay for even when idle):
  Your data lives in Snowflake-managed S3 buckets
  Stored in columnar, compressed format (micro-partitions)
  Data never leaves — you just query it

COMPUTE (virtual warehouses — what runs your queries):
  Small:  2 credits/hour  → good for simple queries
  Medium: 4 credits/hour  → good for dashboard queries
  Large:  8 credits/hour  → good for complex joins
  XL:    16 credits/hour  → good for large data loads

KEY INSIGHT: You can have 10 warehouses all reading the same data
simultaneously. No data copying, no contention.
```

### Core Snowflake Concepts

#### Databases, Schemas, Tables

```sql
-- Snowflake organizes data in a 3-level hierarchy:
-- DATABASE → SCHEMA → TABLE

-- Think of it like:
-- DATABASE = a filing cabinet
-- SCHEMA   = a drawer in the cabinet
-- TABLE    = a folder of records in the drawer

-- Our typical structure for ML:
CREATE DATABASE PROD_DB;
CREATE DATABASE DEV_DB;    -- QA and development work here
CREATE DATABASE STAGING_DB; -- Pre-production validation

-- Within PROD_DB:
CREATE SCHEMA RAW;         -- Raw data from external systems
CREATE SCHEMA CURATED;     -- Cleaned, validated data
CREATE SCHEMA FEATURES;    -- ML feature tables
CREATE SCHEMA PREDICTIONS; -- Model output scores
CREATE SCHEMA AUDIT;       -- QA and data quality logs
```

#### Columnar Storage — Why Queries Are Fast

```
ROW-BASED storage (traditional databases):
  Row 1: [TXN001, CUST001, 45.99, 2024-01-15, Grocery]
  Row 2: [TXN002, CUST001, 89.50, 2024-01-15, Electronics]
  Row 3: [TXN003, CUST002, 1250.00, 2024-01-16, Jewelry]

  Query: SELECT AVG(amount) FROM transactions WHERE date = '2024-01-15'
  → Must read ENTIRE rows (including columns we don't need)

COLUMNAR storage (Snowflake):
  amount column:    [45.99, 89.50, 1250.00, ...]  ← stored together
  customer column:  [CUST001, CUST001, CUST002, ...]
  date column:      [2024-01-15, 2024-01-15, 2024-01-16, ...]

  Query: SELECT AVG(amount) FROM transactions WHERE date = '2024-01-15'
  → Only reads the 'amount' and 'date' columns — much less data!
  → Compression is much better when similar values are together

This makes Snowflake 10-100x faster than row-based databases for analytics.
```

#### Key SQL Patterns for ML Teams

```sql
-- ────────────────────────────────────────
-- PATTERN 1: Data Quality Summary View
-- Run this first to understand your data
-- ────────────────────────────────────────
SELECT
    COUNT(*)                                    AS total_rows,
    COUNT(DISTINCT customer_id)                 AS unique_customers,
    COUNT(CASE WHEN amount IS NULL THEN 1 END)  AS null_amounts,
    COUNT(CASE WHEN amount < 0 THEN 1 END)      AS negative_amounts,
    COUNT(CASE WHEN amount > 10000 THEN 1 END)  AS suspiciously_large,
    MIN(transaction_date)                        AS earliest_date,
    MAX(transaction_date)                        AS latest_date,
    DATEDIFF('day', MIN(transaction_date),
             MAX(transaction_date))              AS date_span_days,
    AVG(amount)                                  AS avg_amount,
    STDDEV(amount)                               AS stddev_amount,
    -- Flag days with low transaction count (could mean data gap)
    COUNT(DISTINCT DATE_TRUNC('day', transaction_date)) AS days_with_data
FROM PROD_DB.RAW.TRANSACTIONS
WHERE transaction_date >= DATEADD('day', -90, CURRENT_DATE());

-- ────────────────────────────────────────
-- PATTERN 2: Detecting Data Gaps (QA use case)
-- If transactions suddenly stop, there's a pipeline issue
-- ────────────────────────────────────────
WITH daily_counts AS (
    SELECT
        DATE_TRUNC('day', transaction_date) AS txn_date,
        COUNT(*) AS txn_count
    FROM PROD_DB.RAW.TRANSACTIONS
    WHERE transaction_date >= DATEADD('day', -30, CURRENT_DATE())
    GROUP BY 1
),
date_spine AS (
    -- Generate every day in the last 30 days
    SELECT DATEADD('day', seq4(), DATEADD('day', -30, CURRENT_DATE())) AS date
    FROM TABLE(GENERATOR(ROWCOUNT => 30))
)
SELECT
    d.date,
    COALESCE(c.txn_count, 0) AS txn_count,
    CASE WHEN c.txn_count IS NULL THEN 'MISSING DATA' ELSE 'OK' END AS status
FROM date_spine d
LEFT JOIN daily_counts c ON d.date = c.txn_date
ORDER BY d.date;

-- ────────────────────────────────────────
-- PATTERN 3: Customer Behavior Baseline (Feature Engineering)
-- Used as input features for ML models
-- ────────────────────────────────────────
CREATE OR REPLACE VIEW PROD_DB.FEATURES.CUSTOMER_TRANSACTION_FEATURES AS
SELECT
    customer_id,
    -- Volume features
    COUNT(*) OVER w AS total_txn_count_90d,
    SUM(amount) OVER w AS total_spend_90d,
    AVG(amount) OVER w AS avg_txn_amount_90d,
    STDDEV(amount) OVER w AS stddev_txn_amount_90d,
    MAX(amount) OVER w AS max_txn_amount_90d,
    -- Time features
    COUNT(DISTINCT DATE_TRUNC('day', transaction_date)) OVER w AS active_days_90d,
    -- Recency
    DATEDIFF('day', MAX(transaction_date) OVER w, CURRENT_DATE()) AS days_since_last_txn,
    -- Velocity (transactions in last 24h compared to normal)
    COUNT(CASE WHEN transaction_date >= DATEADD('hour', -24, CURRENT_TIMESTAMP())
               THEN 1 END) OVER (PARTITION BY customer_id) AS txn_count_24h,
    -- Category diversity
    COUNT(DISTINCT merchant_category) OVER w AS unique_categories_90d
FROM PROD_DB.RAW.TRANSACTIONS
WINDOW w AS (
    PARTITION BY customer_id
    ORDER BY transaction_date
    RANGE BETWEEN INTERVAL '90 days' PRECEDING AND CURRENT ROW
);

-- ────────────────────────────────────────
-- PATTERN 4: Incremental Load with Streams (QA: check stream offsets)
-- Streams track what changed since last read
-- ────────────────────────────────────────
-- Create a stream on the raw table
CREATE OR REPLACE STREAM PROD_DB.RAW.TRANSACTIONS_STREAM
ON TABLE PROD_DB.RAW.TRANSACTIONS
SHOW_INITIAL_ROWS = FALSE;  -- Only new rows after stream creation

-- Query the stream (shows only NEW/CHANGED/DELETED rows)
SELECT
    *,
    METADATA$ACTION,      -- 'INSERT', 'UPDATE', 'DELETE'
    METADATA$ISUPDATE,    -- TRUE if this is an update
    METADATA$ROW_ID       -- Unique identifier for the change
FROM PROD_DB.RAW.TRANSACTIONS_STREAM
WHERE METADATA$ACTION = 'INSERT';  -- Only new records

-- ────────────────────────────────────────
-- PATTERN 5: Writing ML predictions back to Snowflake
-- After Databricks scores, results come back here
-- ────────────────────────────────────────
CREATE OR REPLACE TABLE PROD_DB.PREDICTIONS.FRAUD_SCORES (
    score_id          VARCHAR(50) DEFAULT UUID_STRING(),
    transaction_id    VARCHAR(50) NOT NULL,
    customer_id       VARCHAR(50) NOT NULL,
    scored_at         TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    model_version     VARCHAR(50) NOT NULL,     -- e.g., "v2.3.1"
    anomaly_score     DECIMAL(6, 5) NOT NULL,   -- 0.0 to 1.0
    is_anomaly_flag   BOOLEAN GENERATED ALWAYS AS (anomaly_score > 0.85),
    prediction_label  VARCHAR(20),              -- 'fraud', 'legitimate', 'review'
    feature_vector    VARIANT,                  -- JSON of features used
    execution_time_ms INTEGER                   -- How long scoring took
);
```

#### Snowflake Streams and Tasks — Automated Pipelines

```sql
-- ────────────────────────────────────────
-- TASKS: Scheduled SQL jobs in Snowflake
-- Think of these as cron jobs for SQL
-- ────────────────────────────────────────

-- Task that runs every hour, processes new transactions from stream
CREATE OR REPLACE TASK PROD_DB.RAW.PROCESS_NEW_TRANSACTIONS
    WAREHOUSE = 'COMPUTE_WH'     -- Which warehouse to use
    SCHEDULE = '60 MINUTE'       -- How often to run
    WHEN SYSTEM$STREAM_HAS_DATA('PROD_DB.RAW.TRANSACTIONS_STREAM')
AS
    -- When new data arrives, write to staging table
    INSERT INTO PROD_DB.CURATED.TRANSACTIONS_STAGING
    SELECT
        transaction_id,
        customer_id,
        amount,
        -- Clean data during staging
        CASE WHEN amount < 0 THEN ABS(amount) ELSE amount END AS cleaned_amount,
        transaction_date,
        CURRENT_TIMESTAMP() AS processed_at
    FROM PROD_DB.RAW.TRANSACTIONS_STREAM
    WHERE METADATA$ACTION = 'INSERT';

-- Resume the task (tasks start in SUSPENDED state)
ALTER TASK PROD_DB.RAW.PROCESS_NEW_TRANSACTIONS RESUME;

-- QA: Check task run history
SELECT *
FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY(
    TASK_NAME => 'PROCESS_NEW_TRANSACTIONS',
    SCHEDULED_TIME_RANGE_START => DATEADD('day', -1, CURRENT_TIMESTAMP())
))
ORDER BY SCHEDULED_TIME DESC;
-- Look for: STATE = 'SUCCEEDED' vs 'FAILED'
```

---

## 3. Databricks — The Lakehouse Platform

### What is it?

Databricks is a **unified data engineering and ML platform** built on top of Apache Spark. The term "Lakehouse" means it combines the cheap, flexible storage of a **data lake** (raw files in S3/ADLS/GCS) with the reliability and governance of a **data warehouse** (ACID transactions, schema enforcement).

### Key Databricks Concepts

#### Clusters — Where Computation Runs

```
A cluster is a group of computers (nodes) that Databricks manages for you.
You write Python/Scala/SQL and Databricks distributes it across the cluster.

DRIVER NODE: Your laptop equivalent — coordinates the work
WORKER NODES: The workforce — actually process the data in parallel

Small cluster:   1 driver + 2 workers  → cheap, good for development
Medium cluster:  1 driver + 8 workers  → good for daily pipelines
Large cluster:   1 driver + 32 workers → good for training large models

Cluster types:
  All-Purpose: Stays running, good for interactive notebooks
  Job cluster: Spins up → runs job → shuts down (cheaper for production)
  GPU cluster: Has GPUs, used for deep learning / LLM training
```

#### Notebooks — Interactive Development

```python
# Databricks notebooks are like Jupyter notebooks but in the cloud
# They run on the cluster — so 1 line of code runs across all workers

# You can write Python:
df = spark.read.format("delta").load("/mnt/bronze/transactions")
display(df)

# Or SQL (using %sql magic command):
# %sql
# SELECT COUNT(*) FROM bronze.transactions WHERE amount > 1000

# Or Scala, R, or bash (%sh)

# Key Databricks utility: dbutils
# Used to access secrets, files, widgets
secret = dbutils.secrets.get(scope="snowflake", key="password")
files = dbutils.fs.ls("/mnt/bronze/")
```

#### Delta Lake — The Foundation

Delta Lake is an **open-source storage layer** that sits on top of regular files (Parquet) in S3/ADLS and adds database-like features:

```
REGULAR PARQUET FILES (without Delta Lake):
  ❌ No transactions — half-written files corrupt data
  ❌ No history — can't see what data looked like yesterday
  ❌ No schema enforcement — wrong data type? No error.
  ❌ No deletes — you have to rewrite entire files

DELTA LAKE (adds on top of Parquet):
  ✅ ACID transactions — writes are all-or-nothing
  ✅ Time travel — query data as it was 30 days ago
  ✅ Schema enforcement — wrong type causes an error
  ✅ Schema evolution — can safely add new columns
  ✅ Efficient deletes — GDPR compliance (delete one user's data)
  ✅ Optimized layouts — ZORDER for faster queries
```

```python
# Delta Lake examples

from delta.tables import DeltaTable
from pyspark.sql.functions import *

# ── Reading Delta Tables ──────────────────────────────
# Current version
df = spark.read.format("delta").load("/mnt/silver/transactions")

# Time travel: read data as it was 7 days ago
df_week_ago = spark.read \
    .format("delta") \
    .option("timestampAsOf", "2026-02-24") \
    .load("/mnt/silver/transactions")

# Or by version number
df_v5 = spark.read \
    .format("delta") \
    .option("versionAsOf", 5) \
    .load("/mnt/silver/transactions")

# ── Writing Delta Tables ──────────────────────────────
# Simple write (append mode)
df.write.format("delta").mode("append").save("/mnt/silver/transactions")

# Upsert (MERGE) — update if exists, insert if new
delta_table = DeltaTable.forPath(spark, "/mnt/silver/transactions")

delta_table.alias("target").merge(
    source=new_data.alias("source"),
    condition="target.transaction_id = source.transaction_id"
).whenMatchedUpdateAll(
).whenNotMatchedInsertAll(
).execute()

# ── Table History ──────────────────────────────────────
# Great for QA — see every change to the table
delta_table = DeltaTable.forPath(spark, "/mnt/silver/transactions")
history_df = delta_table.history()
display(history_df)
# Shows: version, timestamp, operation, operationParameters, numFiles, ...
```

#### Unity Catalog — Governance

Unity Catalog is Databricks' central metadata store. It manages:
- Who can access which tables (access control)
- Data lineage (where did this data come from?)
- Table discovery (find tables by name or tag)
- ML model governance (model versions, who deployed what)

```
Unity Catalog Hierarchy:
  CATALOG
    └── SCHEMA (also called a database)
          └── TABLE (or VIEW or FUNCTION)

For your ML platform:
  main                    (catalog)
  ├── bronze              (schema)
  │   ├── transactions    (raw from Snowflake)
  │   └── customers       (raw from Snowflake)
  ├── silver              (schema)
  │   ├── transactions    (cleaned, validated)
  │   └── customers       (cleaned, deduplicated)
  ├── gold                (schema)
  │   ├── customer_features (ML-ready features)
  │   └── daily_aggregates  (for reporting)
  └── ml_models           (schema)
      └── fraud_detector  (registered model)
```

---

## 4. The Medallion Architecture: Bronze, Silver, Gold

### What is it?

The Medallion Architecture is a pattern for organizing data in layers. Each layer transforms the data from raw and messy (Bronze) to clean and validated (Silver) to ML-ready and aggregated (Gold).

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MEDALLION ARCHITECTURE                           │
├────────────────────┬────────────────────┬───────────────────────────┤
│      BRONZE        │       SILVER        │          GOLD             │
│   (Raw / Landing)  │  (Cleaned / Valid.) │  (Features / Analytics)  │
├────────────────────┼────────────────────┼───────────────────────────┤
│                    │                    │                           │
│ Exact copy of      │ Data is:           │ Data is:                  │
│ source data        │ - Deduplicated     │ - Aggregated              │
│                    │ - Null-handled     │ - Feature-engineered      │
│ Never modified     │ - Type-corrected   │ - Joined across domains   │
│ after write        │ - Schema-enforced  │ - Ready for ML training   │
│                    │ - PII-masked       │ - Ready for dashboards    │
│                    │                    │                           │
│ QA: Verify row     │ QA: Verify all     │ QA: Verify business       │
│ counts match       │ quality rules pass │ logic is correct          │
│ source             │                    │                           │
└────────────────────┴────────────────────┴───────────────────────────┘
```

### Complete Bronze → Silver → Gold Pipeline

```python
# =============================================================================
# BRONZE LAYER: Raw ingestion from Snowflake
# Rule: Never transform. Just copy. If source has garbage, Bronze has garbage.
# =============================================================================

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
from delta.tables import DeltaTable
import logging

logger = logging.getLogger(__name__)

def ingest_bronze(spark, snowflake_options, target_path):
    """
    Read from Snowflake, write to Bronze Delta table.

    Why we do this:
    - Creates a stable, auditable copy of source data
    - If Snowflake changes, we have a record of what it was
    - Bronze is the single source of truth for all downstream layers
    """
    logger.info("Starting Bronze ingestion from Snowflake")

    # Read from Snowflake
    df = spark.read \
        .format("snowflake") \
        .options(**snowflake_options) \
        .option("dbtable", "PROD_DB.RAW.TRANSACTIONS") \
        .load()

    record_count = df.count()
    logger.info(f"Loaded {record_count} records from Snowflake")

    # Add ingestion metadata (do NOT transform the data itself)
    df_with_meta = df \
        .withColumn("_ingested_at", current_timestamp()) \
        .withColumn("_source_system", lit("snowflake")) \
        .withColumn("_pipeline_run_id", lit(dbutils.notebook.entry_point.getDbutils().notebook().getContext().currentRunId().get()))

    # Write to Bronze Delta table (append mode — never overwrite)
    df_with_meta.write \
        .format("delta") \
        .mode("append") \
        .option("mergeSchema", "true") \
        .save(target_path)

    logger.info(f"Bronze write complete: {record_count} rows to {target_path}")
    return record_count


# =============================================================================
# SILVER LAYER: Clean, validate, deduplicate
# Rule: Fix data quality issues. Reject truly bad records to a quarantine table.
# =============================================================================

def process_silver(spark, bronze_path, silver_path, quarantine_path):
    """
    Transform Bronze to Silver quality data.

    Quality rules applied:
    1. Deduplication by transaction_id
    2. Remove records with null transaction_id or customer_id
    3. Fix negative amounts (ABS value, flag for review)
    4. Standardize timestamp format
    5. Validate merchant_category against known list
    6. Quarantine records that fail critical checks
    """

    df_bronze = spark.read.format("delta").load(bronze_path)

    # ── Step 1: Separate valid from invalid ──────────────────────────────
    valid_categories = {"Grocery", "Electronics", "Jewelry", "Clothing",
                        "Restaurant", "Travel", "Gas", "Healthcare", "ATM"}

    # Tag each record with quality flags
    df_tagged = df_bronze \
        .withColumn("qf_null_id",
                    col("transaction_id").isNull() | col("customer_id").isNull()) \
        .withColumn("qf_invalid_amount",
                    col("amount").isNull()) \
        .withColumn("qf_negative_amount", col("amount") < 0) \
        .withColumn("qf_future_date",
                    col("transaction_date") > current_timestamp()) \
        .withColumn("qf_unknown_category",
                    ~col("merchant_category").isin(list(valid_categories))) \
        .withColumn("_has_critical_error",
                    col("qf_null_id") | col("qf_invalid_amount"))

    # Route critical failures to quarantine (never lose data)
    df_quarantine = df_tagged.filter(col("_has_critical_error") == True)
    df_valid = df_tagged.filter(col("_has_critical_error") == False)

    quarantine_count = df_quarantine.count()
    valid_count = df_valid.count()

    if quarantine_count > 0:
        # Quarantine records for QA investigation
        df_quarantine.write \
            .format("delta") \
            .mode("append") \
            .save(quarantine_path)
        logger.warning(f"Quarantined {quarantine_count} records to {quarantine_path}")

    # ── Step 2: Deduplicate ──────────────────────────────────────────────
    # Keep the latest version of each transaction (in case of source duplicates)
    from pyspark.sql.window import Window

    window = Window.partitionBy("transaction_id").orderBy(desc("_ingested_at"))

    df_deduped = df_valid \
        .withColumn("_row_num", row_number().over(window)) \
        .filter(col("_row_num") == 1) \
        .drop("_row_num")

    deduped_count = df_deduped.count()
    duplicates_removed = valid_count - deduped_count
    logger.info(f"Deduplication: removed {duplicates_removed} duplicates")

    # ── Step 3: Clean and standardize ────────────────────────────────────
    df_silver = df_deduped \
        .withColumn("amount",
            # Fix negatives: use absolute value, flag for review
            when(col("qf_negative_amount"), abs_(col("amount")))
            .otherwise(col("amount"))) \
        .withColumn("transaction_date",
            # Ensure UTC timezone
            to_utc_timestamp(col("transaction_date"), "America/New_York")) \
        .withColumn("merchant_category",
            # Standardize unknown categories
            when(col("qf_unknown_category"), lit("Other"))
            .otherwise(col("merchant_category"))) \
        .withColumn("_silver_processed_at", current_timestamp()) \
        .drop("_has_critical_error")  # Don't carry error flags to silver

    # ── Step 4: Upsert to Silver (handle late-arriving data) ─────────────
    if DeltaTable.isDeltaTable(spark, silver_path):
        delta_table = DeltaTable.forPath(spark, silver_path)
        delta_table.alias("target").merge(
            source=df_silver.alias("source"),
            condition="target.transaction_id = source.transaction_id"
        ).whenMatchedUpdateAll(
        ).whenNotMatchedInsertAll(
        ).execute()
    else:
        df_silver.write.format("delta").mode("overwrite").save(silver_path)

    return {
        "bronze_records": df_bronze.count(),
        "quarantined": quarantine_count,
        "valid": valid_count,
        "after_dedup": deduped_count,
        "silver_records": df_silver.count()
    }


# =============================================================================
# GOLD LAYER: ML-ready features
# Rule: Business logic lives here. Each feature has a documented definition.
# =============================================================================

def build_gold_features(spark, silver_path, gold_path):
    """
    Build customer-level features for ML model training.

    Features created (all computed over 90-day lookback):
    - Behavioral: spend patterns, frequency, recency
    - Velocity: rate-of-change over 1h, 24h, 7d windows
    - Network: unique merchants, categories
    - Risk indicators: unusual time-of-day, large transactions
    """

    df_silver = spark.read.format("delta").load(silver_path)

    from pyspark.sql.window import Window

    # 90-day window per customer
    w90 = Window.partitionBy("customer_id") \
                .orderBy(col("transaction_date").cast("long")) \
                .rangeBetween(-90 * 86400, 0)  # 90 days in seconds

    # 24-hour window
    w24h = Window.partitionBy("customer_id") \
                 .orderBy(col("transaction_date").cast("long")) \
                 .rangeBetween(-86400, 0)

    # 1-hour window
    w1h = Window.partitionBy("customer_id") \
                .orderBy(col("transaction_date").cast("long")) \
                .rangeBetween(-3600, 0)

    df_features = df_silver \
        .withColumn("txn_count_90d",         count("transaction_id").over(w90)) \
        .withColumn("total_spend_90d",        sum("amount").over(w90)) \
        .withColumn("avg_spend_90d",          avg("amount").over(w90)) \
        .withColumn("stddev_spend_90d",       stddev("amount").over(w90)) \
        .withColumn("max_single_txn_90d",     max("amount").over(w90)) \
        .withColumn("unique_merchants_90d",   countDistinct("merchant_id").over(w90)) \
        .withColumn("unique_categories_90d",  countDistinct("merchant_category").over(w90)) \
        .withColumn("txn_count_24h",          count("transaction_id").over(w24h)) \
        .withColumn("spend_24h",              sum("amount").over(w24h)) \
        .withColumn("txn_count_1h",           count("transaction_id").over(w1h)) \
        .withColumn("spend_1h",               sum("amount").over(w1h)) \
        .withColumn("hour_of_day",            hour("transaction_date")) \
        .withColumn("day_of_week",            dayofweek("transaction_date")) \
        .withColumn("is_weekend",             (dayofweek("transaction_date").isin([1, 7])).cast("integer")) \
        .withColumn("is_late_night",          ((hour("transaction_date") >= 23) | (hour("transaction_date") <= 4)).cast("integer")) \
        .withColumn("amount_vs_avg_ratio",
            # How much bigger is this transaction vs. customer's average?
            when(col("avg_spend_90d") > 0,
                 col("amount") / col("avg_spend_90d"))
            .otherwise(lit(1.0))) \
        .withColumn("velocity_ratio_24h_vs_90d",
            # Is today's spending rate higher than the 90-day average daily rate?
            when(col("txn_count_90d") > 0,
                 col("txn_count_24h") / (col("txn_count_90d") / 90.0))
            .otherwise(lit(1.0))) \
        .withColumn("_feature_created_at", current_timestamp())

    df_features.write \
        .format("delta") \
        .mode("overwrite") \
        .option("overwriteSchema", "true") \
        .save(gold_path)

    return df_features.count()
```

---

## 5. ML Pipelines End-to-End

### What is an ML Pipeline?

An ML pipeline is the automated sequence of steps that takes raw data and produces model predictions, repeatedly and reliably. Unlike running a notebook manually, a pipeline runs on a schedule, handles errors, alerts on failures, and maintains data quality gates.

```
┌──────────────────────────────────────────────────────────────────────┐
│                     ML PIPELINE FLOW                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  TRIGGER (time or event)                                             │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────────┐                                                 │
│  │  1. DATA INGEST  │ ← Pull from Snowflake to Bronze               │
│  │     & VALIDATE   │   QA Gate: row count, schema check            │
│  └────────┬─────────┘                                               │
│           │ PASS                                                     │
│           ▼                                                          │
│  ┌─────────────────┐                                                 │
│  │  2. SILVER      │ ← Deduplicate, clean, type-correct             │
│  │     PROCESSING  │   QA Gate: null rates, value ranges            │
│  └────────┬─────────┘                                               │
│           │ PASS                                                     │
│           ▼                                                          │
│  ┌─────────────────┐                                                 │
│  │  3. GOLD        │ ← Feature engineering                          │
│  │     FEATURES    │   QA Gate: feature stats, distribution checks  │
│  └────────┬─────────┘                                               │
│           │ PASS                                                     │
│           ▼                                                          │
│  ┌─────────────────┐                                                 │
│  │  4. MODEL       │ ← Load from MLflow registry                    │
│  │     SCORING     │   QA Gate: score distribution check            │
│  └────────┬─────────┘                                               │
│           │ PASS                                                     │
│           ▼                                                          │
│  ┌─────────────────┐                                                 │
│  │  5. WRITE       │ ← Write scores to Snowflake predictions table  │
│  │     PREDICTIONS │   QA Gate: record count matches input          │
│  └────────┬─────────┘                                               │
│           │ PASS                                                     │
│           ▼                                                          │
│  ┌─────────────────┐                                                 │
│  │  6. ANOMALY     │ ← Flag high-score records as anomalies         │
│  │     GENERATION  │   QA Gate: anomaly rate within expected range  │
│  └────────┬─────────┘                                               │
│           ▼                                                          │
│  ALERTS & DASHBOARD UPDATES                                          │
└──────────────────────────────────────────────────────────────────────┘

If any QA Gate FAILS → pipeline stops → alert fires → QA investigates
```

### Databricks Jobs — Scheduling Pipelines

```python
# This is how you define a pipeline job in Databricks
# (via the Jobs UI or Databricks CLI / Terraform)

# Job structure for the ML scoring pipeline:
job_config = {
    "name": "fraud_detection_daily_scoring",
    "schedule": {
        "quartz_cron_expression": "0 0 2 * * ?",  # 2 AM daily
        "timezone_id": "UTC"
    },
    "tasks": [
        {
            "task_key": "ingest_bronze",
            "notebook_task": {
                "notebook_path": "/pipelines/01_bronze_ingest",
                "base_parameters": {
                    "run_date": "{{ds}}"  # Injection of run date
                }
            },
            "new_cluster": {
                "spark_version": "14.3.x-scala2.12",
                "node_type_id": "Standard_DS3_v2",
                "num_workers": 4
            }
        },
        {
            "task_key": "process_silver",
            "depends_on": [{"task_key": "ingest_bronze"}],  # Runs AFTER bronze
            "notebook_task": {
                "notebook_path": "/pipelines/02_silver_process"
            }
        },
        {
            "task_key": "build_gold_features",
            "depends_on": [{"task_key": "process_silver"}],
            "notebook_task": {
                "notebook_path": "/pipelines/03_gold_features"
            }
        },
        {
            "task_key": "score_model",
            "depends_on": [{"task_key": "build_gold_features"}],
            "notebook_task": {
                "notebook_path": "/pipelines/04_score_model"
            }
        },
        {
            "task_key": "qa_validation",
            "depends_on": [{"task_key": "score_model"}],
            "notebook_task": {
                "notebook_path": "/pipelines/05_qa_validation"
            }
        }
    ],
    "email_notifications": {
        "on_failure": ["your-team@company.com"],
        "on_success": [],   # Don't email on success (noise)
        "on_start": []
    },
    "max_retries": 2,
    "retry_on_timeout": True,
    "timeout_seconds": 7200  # 2 hour timeout
}
```

---

## 6. ML Models in Databricks with MLflow

### What is MLflow?

MLflow is the experiment tracking and model management system built into Databricks. Think of it as a lab notebook for ML experiments — every run, every metric, every model artifact is recorded.

```
Without MLflow (chaotic):
  model_v1.pkl
  model_v2.pkl
  model_FINAL.pkl
  model_FINAL_v2.pkl
  model_ACTUALLY_FINAL.pkl
  ← Which one is in production? Who trained it? What data was used?

With MLflow (organized):
  Experiment: fraud_detection
  ├── Run 001: accuracy=0.91, recall=0.85, params={max_depth: 8}
  ├── Run 002: accuracy=0.93, recall=0.87, params={max_depth: 12}  ← winner
  └── Run 003: accuracy=0.90, recall=0.89, params={max_depth: 6}

  Model Registry: fraud_detector
  ├── Version 1 (Staging): from Run 002, deployed 2026-01-15
  └── Version 2 (Production): from Run 002, promoted 2026-01-20
```

### Training a Model with Full MLflow Tracking

```python
# Complete model training notebook
# This is what your ML engineers run in Databricks

import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, roc_auc_score,
    precision_score, recall_score, f1_score,
    confusion_matrix
)
import pandas as pd
import numpy as np

# ── Configuration ──────────────────────────────────────────────────
EXPERIMENT_NAME = "/experiments/fraud_detection"
MODEL_NAME = "main.ml_models.fraud_detector"  # Unity Catalog path
FEATURE_TABLE = "main.gold.customer_features"

# ── Load Features from Gold Layer ─────────────────────────────────
mlflow.set_experiment(EXPERIMENT_NAME)
mlflow.set_registry_uri("databricks-uc")  # Use Unity Catalog for model registry

# Load features
df_features = spark.table(FEATURE_TABLE).toPandas()

# Define feature columns and target
feature_cols = [
    "txn_count_90d", "total_spend_90d", "avg_spend_90d", "stddev_spend_90d",
    "max_single_txn_90d", "unique_merchants_90d", "unique_categories_90d",
    "txn_count_24h", "spend_24h", "txn_count_1h", "spend_1h",
    "hour_of_day", "day_of_week", "is_weekend", "is_late_night",
    "amount_vs_avg_ratio", "velocity_ratio_24h_vs_90d"
]
target_col = "is_fraud"  # 0 or 1

X = df_features[feature_cols].fillna(0)
y = df_features[target_col]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training: {len(X_train)} rows, Test: {len(X_test)} rows")
print(f"Fraud rate in training: {y_train.mean():.4%}")
print(f"Fraud rate in test: {y_test.mean():.4%}")

# ── Train Model with MLflow Tracking ──────────────────────────────
with mlflow.start_run(run_name="random_forest_v1") as run:
    # Log parameters (hyperparameters used)
    params = {
        "n_estimators": 200,
        "max_depth": 12,
        "min_samples_leaf": 10,
        "class_weight": "balanced",  # Handles class imbalance
        "random_state": 42
    }
    mlflow.log_params(params)

    # Log dataset info
    mlflow.log_param("training_rows", len(X_train))
    mlflow.log_param("fraud_rate", float(y_train.mean()))
    mlflow.log_param("feature_count", len(feature_cols))
    mlflow.log_param("features", ", ".join(feature_cols))

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train
    model = RandomForestClassifier(**params)
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]

    # Log metrics (these appear in MLflow UI)
    metrics = {
        "accuracy":  float((y_pred == y_test).mean()),
        "precision": float(precision_score(y_test, y_pred)),
        "recall":    float(recall_score(y_test, y_pred)),
        "f1_score":  float(f1_score(y_test, y_pred)),
        "roc_auc":   float(roc_auc_score(y_test, y_proba))
    }
    mlflow.log_metrics(metrics)

    print("\n=== Model Performance ===")
    for metric, value in metrics.items():
        print(f"  {metric}: {value:.4f}")

    # Log confusion matrix as an artifact
    cm = confusion_matrix(y_test, y_pred)
    cm_df = pd.DataFrame(cm,
        index=["Actual: Legitimate", "Actual: Fraud"],
        columns=["Predicted: Legitimate", "Predicted: Fraud"]
    )
    cm_df.to_csv("/tmp/confusion_matrix.csv")
    mlflow.log_artifact("/tmp/confusion_matrix.csv")

    # Log feature importance
    fi_df = pd.DataFrame({
        "feature": feature_cols,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    fi_df.to_csv("/tmp/feature_importance.csv", index=False)
    mlflow.log_artifact("/tmp/feature_importance.csv")

    # Save the model to MLflow Model Registry
    mlflow.sklearn.log_model(
        sk_model={"scaler": scaler, "model": model},  # Save as pipeline
        artifact_path="fraud_detector",
        registered_model_name=MODEL_NAME,
        input_example=X_test.iloc[:5],
        signature=mlflow.models.infer_signature(X_test, y_pred)
    )

    print(f"\nRun ID: {run.info.run_id}")
    print(f"Model saved to: {MODEL_NAME}")


# ── Promote Model to Production ────────────────────────────────────
client = MlflowClient()

# Get the latest model version
latest_version = client.get_latest_versions(MODEL_NAME)[0].version
print(f"Latest model version: {latest_version}")

# Set alias for production (Unity Catalog uses aliases, not stages)
client.set_registered_model_alias(
    name=MODEL_NAME,
    alias="production",
    version=latest_version
)
print(f"Version {latest_version} promoted to 'production' alias")
```

### Batch Scoring — Running Predictions on New Data

```python
# Notebook: 04_score_model
# Loads the production model and scores today's transactions

import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient

# ── Load Production Model ──────────────────────────────────────────
mlflow.set_registry_uri("databricks-uc")

MODEL_NAME = "main.ml_models.fraud_detector"
model_uri = f"models:/{MODEL_NAME}@production"  # Load by alias

# Load model (handles version management automatically)
loaded_model = mlflow.sklearn.load_model(model_uri)
scaler = loaded_model["scaler"]
model = loaded_model["model"]

# Get which version is production (for logging)
client = MlflowClient()
prod_version = client.get_model_version_by_alias(MODEL_NAME, "production")
model_version = prod_version.version

print(f"Loaded {MODEL_NAME} version {model_version}")

# ── Load Today's Features ──────────────────────────────────────────
df_gold = spark.table("main.gold.customer_features") \
               .filter(col("_feature_created_at") >= date_trunc("day", current_timestamp()))

feature_cols = [
    "txn_count_90d", "total_spend_90d", "avg_spend_90d", "stddev_spend_90d",
    "max_single_txn_90d", "unique_merchants_90d", "unique_categories_90d",
    "txn_count_24h", "spend_24h", "txn_count_1h", "spend_1h",
    "hour_of_day", "day_of_week", "is_weekend", "is_late_night",
    "amount_vs_avg_ratio", "velocity_ratio_24h_vs_90d"
]

df_pandas = df_gold.select(["transaction_id", "customer_id"] + feature_cols).toPandas()
X = df_pandas[feature_cols].fillna(0)

# ── Score ──────────────────────────────────────────────────────────
X_scaled = scaler.transform(X)
probabilities = model.predict_proba(X_scaled)[:, 1]  # Fraud probability

df_pandas["anomaly_score"] = probabilities
df_pandas["prediction_label"] = df_pandas["anomaly_score"].apply(
    lambda s: "fraud" if s > 0.85 else ("review" if s > 0.6 else "legitimate")
)
df_pandas["model_version"] = model_version
df_pandas["scored_at"] = pd.Timestamp.utcnow()

print(f"Scored {len(df_pandas)} transactions")
print(df_pandas["prediction_label"].value_counts())

# ── Write Predictions to Snowflake ────────────────────────────────
df_scores = spark.createDataFrame(df_pandas)

df_scores.write \
    .format("snowflake") \
    .options(**snowflake_options) \
    .option("dbtable", "PROD_DB.PREDICTIONS.FRAUD_SCORES") \
    .mode("append") \
    .save()

print("Predictions written to Snowflake")
```

---

## 7. Anomaly Detection — Predictions as the Source of Truth

### What is Anomaly Detection?

Anomaly detection answers: "Is this event unusual compared to what we normally see?" It's used for:

- **Fraud detection**: Is this transaction unusual for this customer?
- **System monitoring**: Is this server response time unusually slow?
- **Quality control**: Is this manufactured part's measurement outside normal range?
- **Data quality**: Is today's data volume unusually low (pipeline broken)?

### Two Approaches: Supervised vs Unsupervised

```
SUPERVISED ANOMALY DETECTION (need labeled fraud examples):
  Training: Show model 10,000 examples of fraud and 990,000 legitimate transactions
  Output: P(fraud) — a probability between 0 and 1
  Advantage: Very accurate when labels are good
  Disadvantage: Need labeled data, can't catch NEW types of fraud

UNSUPERVISED ANOMALY DETECTION (no labels needed):
  Training: Show model 1,000,000 legitimate transactions
  Idea: Anything that doesn't look like these is an anomaly
  Output: An anomaly score — how unusual is this point?
  Advantage: Can catch novel/unknown fraud patterns
  Disadvantage: Many false positives, harder to tune
```

### Isolation Forest — The Core Unsupervised Algorithm

```python
# Isolation Forest: anomalies are easier to "isolate" than normal points
# Think of it like this:
#
# Normal data point: needs many cuts to isolate it (it has neighbors)
# Anomaly: can be isolated with very few random cuts (it's alone)

from sklearn.ensemble import IsolationForest
import numpy as np
import pandas as pd

def train_isolation_forest(df_normal_transactions):
    """
    Train on NORMAL data only (unsupervised).
    No fraud labels needed.
    """
    feature_cols = [
        "txn_count_24h", "spend_24h", "amount_vs_avg_ratio",
        "velocity_ratio_24h_vs_90d", "is_late_night", "amount"
    ]

    X = df_normal_transactions[feature_cols].fillna(0)

    # contamination: expected fraction of anomalies in training data
    # (set low since training is supposed to be "mostly normal")
    model = IsolationForest(
        n_estimators=100,      # Number of trees
        max_samples=256,       # Samples per tree (smaller = more diverse trees)
        contamination=0.01,    # Expect 1% anomalies even in "clean" training
        random_state=42
    )
    model.fit(X)

    return model, feature_cols

def score_transactions(model, feature_cols, df_new_transactions):
    """
    Score new transactions.
    Returns: anomaly_score (0-1, higher = more anomalous)
    """
    X = df_new_transactions[feature_cols].fillna(0)

    # Raw score: negative = anomaly (sklearn convention)
    # score_samples returns: lower (more negative) = more anomalous
    raw_scores = model.score_samples(X)

    # Convert to 0-1 scale: 0 = normal, 1 = highly anomalous
    # Using min-max normalization over the score distribution
    score_min = raw_scores.min()
    score_max = raw_scores.max()
    anomaly_scores = 1 - (raw_scores - score_min) / (score_max - score_min + 1e-8)

    df_new_transactions["anomaly_score"] = anomaly_scores
    df_new_transactions["is_anomaly"] = anomaly_scores > 0.85  # Threshold

    return df_new_transactions
```

---

## 8. Anomaly Generation from Model Predictions

### What is "Anomaly Generation from Predictions"?

This is a powerful technique: instead of only detecting anomalies in your input data, you **use the model's own predictions over time to detect when the model's behavior has become anomalous**. This answers:

- "Is the model suddenly flagging a lot more fraud than usual?" → Model may have a bug, or real fraud spike
- "Is the model's confidence distribution shifting?" → Data drift
- "Are certain customer segments now getting more/fewer flags?" → Bias emerging

### Monitoring Prediction Distributions

```python
# Notebook: 05_prediction_anomaly_monitoring
# Runs AFTER scoring — checks if the scoring output looks normal

import pandas as pd
import numpy as np
from scipy import stats
import mlflow

def compute_prediction_stats(df_predictions):
    """
    Compute statistics on model output distribution.
    These become the signal for detecting anomalies IN the predictions.
    """
    scores = df_predictions["anomaly_score"]
    labels = df_predictions["prediction_label"]

    return {
        # Score distribution stats
        "score_mean":   float(scores.mean()),
        "score_std":    float(scores.std()),
        "score_p50":    float(scores.quantile(0.50)),
        "score_p90":    float(scores.quantile(0.90)),
        "score_p95":    float(scores.quantile(0.95)),
        "score_p99":    float(scores.quantile(0.99)),
        "score_max":    float(scores.max()),

        # Flagging rates
        "fraud_flag_rate":    float((labels == "fraud").mean()),
        "review_flag_rate":   float((labels == "review").mean()),
        "legit_flag_rate":    float((labels == "legitimate").mean()),
        "total_scored":       len(df_predictions),

        # Score distribution shape
        "score_skewness":     float(stats.skew(scores)),
        "score_kurtosis":     float(stats.kurtosis(scores)),
    }

def detect_prediction_anomalies(current_stats, baseline_stats, thresholds=None):
    """
    Compare today's prediction distribution to a 30-day baseline.
    If today looks very different → something is wrong.

    Possible root causes when anomaly detected:
    - Fraud spike: real-world increase in fraud activity
    - Data quality issue: input data has errors, corrupting features
    - Feature drift: feature distributions shifted (seasonal change?)
    - Model issue: model was updated incorrectly
    - Pipeline bug: wrong data was loaded for scoring
    """
    if thresholds is None:
        thresholds = {
            "fraud_flag_rate_max_change_pct": 0.50,  # 50% change in fraud flag rate
            "score_mean_max_change_pct": 0.20,        # 20% change in mean score
            "score_std_max_change_pct": 0.30,         # 30% change in score std dev
        }

    alerts = []

    for metric, max_change_pct in thresholds.items():
        baseline_val = baseline_stats.get(metric)
        current_val = current_stats.get(metric)

        if baseline_val is None or current_val is None:
            continue

        if baseline_val == 0:
            continue  # Avoid division by zero

        change_pct = abs(current_val - baseline_val) / abs(baseline_val)

        if change_pct > max_change_pct:
            direction = "INCREASED" if current_val > baseline_val else "DECREASED"
            alerts.append({
                "metric": metric,
                "direction": direction,
                "baseline_value": baseline_val,
                "current_value": current_val,
                "change_pct": change_pct * 100,
                "severity": "CRITICAL" if change_pct > max_change_pct * 2 else "WARNING"
            })

    return alerts


# Complete prediction monitoring pipeline
def run_prediction_monitoring(run_date: str):
    """
    Compare today's model output against 30-day rolling baseline.
    Writes results to Snowflake for dashboarding.
    Called as the last step in the daily scoring pipeline.
    """

    # Load today's predictions
    df_today = spark.read \
        .format("snowflake") \
        .options(**snowflake_options) \
        .option("query", f"""
            SELECT *
            FROM PROD_DB.PREDICTIONS.FRAUD_SCORES
            WHERE DATE(scored_at) = '{run_date}'
        """) \
        .load() \
        .toPandas()

    # Load 30-day baseline (rolling average of stats)
    df_baseline = spark.read \
        .format("snowflake") \
        .options(**snowflake_options) \
        .option("query", f"""
            SELECT *
            FROM PROD_DB.AUDIT.PREDICTION_STATS
            WHERE stat_date BETWEEN DATEADD('day', -30, '{run_date}') AND '{run_date}'
        """) \
        .load() \
        .toPandas()

    # Compute today's stats
    today_stats = compute_prediction_stats(df_today)
    today_stats["stat_date"] = run_date

    # Compute baseline (mean of last 30 days)
    numeric_cols = [c for c in df_baseline.columns if df_baseline[c].dtype in ['float64', 'int64']]
    baseline_stats = df_baseline[numeric_cols].mean().to_dict()

    # Detect anomalies in predictions
    alerts = detect_prediction_anomalies(today_stats, baseline_stats)

    if alerts:
        print(f"\n{'='*60}")
        print(f"PREDICTION ANOMALIES DETECTED for {run_date}")
        print(f"{'='*60}")
        for alert in alerts:
            print(f"  [{alert['severity']}] {alert['metric']}")
            print(f"    Baseline: {alert['baseline_value']:.4f}")
            print(f"    Today:    {alert['current_value']:.4f}")
            print(f"    Change:   {alert['change_pct']:.1f}% {alert['direction']}")

        # In production: send Slack/PagerDuty alert here
        # send_alert(alerts)
    else:
        print(f"Prediction distribution normal for {run_date}")

    # Save today's stats to Snowflake for future baseline
    df_stats = spark.createDataFrame([today_stats])
    df_stats.write \
        .format("snowflake") \
        .options(**snowflake_options) \
        .option("dbtable", "PROD_DB.AUDIT.PREDICTION_STATS") \
        .mode("append") \
        .save()

    return today_stats, alerts
```

### Population Stability Index (PSI) — Detecting Distribution Drift

PSI is a standard industry metric for comparing two distributions. Your QA team should run it on:
- Input features (did the customer data change?)
- Model output scores (did the score distribution change?)

```python
def compute_psi(expected: np.ndarray, actual: np.ndarray, bins: int = 10) -> float:
    """
    Population Stability Index:
    - PSI < 0.1:  No significant change — model is stable
    - PSI 0.1-0.25: Minor change — monitor closely
    - PSI > 0.25: Major shift — investigate and likely retrain

    Used by QA and ML teams to detect when the model has drifted
    and needs retraining.
    """
    # Create bins based on expected distribution
    breakpoints = np.linspace(0, 1, bins + 1)

    # Calculate bucket fractions
    expected_fractions, _ = np.histogram(expected, bins=breakpoints)
    actual_fractions, _ = np.histogram(actual, bins=breakpoints)

    # Normalize to proportions
    expected_fractions = expected_fractions / len(expected)
    actual_fractions = actual_fractions / len(actual)

    # Replace zeros to avoid log(0)
    expected_fractions = np.where(expected_fractions == 0, 1e-4, expected_fractions)
    actual_fractions = np.where(actual_fractions == 0, 1e-4, actual_fractions)

    # PSI formula
    psi = np.sum(
        (actual_fractions - expected_fractions) *
        np.log(actual_fractions / expected_fractions)
    )

    return float(psi)

def run_psi_checks(baseline_scores, today_scores, feature_data_baseline, feature_data_today, feature_cols):
    """
    Run PSI on both the model output (scores) and all input features.
    Creates a full drift report for QA review.
    """
    results = {}

    # Check output distribution
    score_psi = compute_psi(baseline_scores, today_scores)
    results["anomaly_score"] = {
        "psi": score_psi,
        "status": "OK" if score_psi < 0.1 else ("WARN" if score_psi < 0.25 else "CRITICAL")
    }

    # Check each input feature
    for col in feature_cols:
        col_psi = compute_psi(
            feature_data_baseline[col].fillna(0).values,
            feature_data_today[col].fillna(0).values
        )
        results[col] = {
            "psi": col_psi,
            "status": "OK" if col_psi < 0.1 else ("WARN" if col_psi < 0.25 else "CRITICAL")
        }

    # Summary
    critical_features = [k for k, v in results.items() if v["status"] == "CRITICAL"]
    warn_features = [k for k, v in results.items() if v["status"] == "WARN"]

    print(f"\n=== PSI Drift Report ===")
    print(f"  CRITICAL ({len(critical_features)}): {critical_features}")
    print(f"  WARNING  ({len(warn_features)}): {warn_features}")
    print(f"  OK: {len(results) - len(critical_features) - len(warn_features)} features")

    return results
```

---

## 9. Data Testing — QA at Every Stage

### The QA Mindset for Data Pipelines

In software testing, you test functions. In data pipeline testing, you test **invariants** — properties that must always be true about your data. Instead of "does this function return the right value?", you ask:

- Does this table have the right number of rows?
- Are there any null values where there shouldn't be?
- Is the distribution of values within the expected range?
- Does this table join cleanly to that table?
- Did all records from the source make it through to the target?

### Stage-by-Stage QA Tests

#### Stage 1: Source Data QA (Testing Snowflake Raw Tables)

```sql
-- ────────────────────────────────────────────────────────────
-- QA TEST SUITE: Snowflake Raw Data Quality
-- Run these after every data load into Snowflake
-- ────────────────────────────────────────────────────────────

-- TEST 1: Row count is within expected range
-- Expected: 50,000-200,000 new transactions per day
-- FAIL if: 0 rows (pipeline broken) or 10M rows (duplication bug)
WITH daily_counts AS (
    SELECT
        DATE_TRUNC('day', transaction_date) AS dt,
        COUNT(*) AS row_count
    FROM PROD_DB.RAW.TRANSACTIONS
    WHERE transaction_date >= DATEADD('day', -7, CURRENT_DATE())
    GROUP BY 1
)
SELECT
    dt,
    row_count,
    CASE
        WHEN row_count < 50000  THEN 'FAIL: Too few rows (pipeline issue?)'
        WHEN row_count > 200000 THEN 'FAIL: Too many rows (duplication?)'
        ELSE 'PASS'
    END AS qa_result
FROM daily_counts
ORDER BY dt DESC;


-- TEST 2: No duplicate transaction IDs
-- Primary key violation = upstream bug or double-ingestion
SELECT
    transaction_id,
    COUNT(*) AS occurrences
FROM PROD_DB.RAW.TRANSACTIONS
WHERE transaction_date >= CURRENT_DATE()
GROUP BY transaction_id
HAVING COUNT(*) > 1
ORDER BY occurrences DESC
LIMIT 100;
-- PASS: 0 rows returned
-- FAIL: Any rows returned → investigate source system or ETL


-- TEST 3: Null rate check for critical columns
SELECT
    'transaction_id'   AS column_name,
    COUNT(*) AS total,
    SUM(CASE WHEN transaction_id IS NULL THEN 1 ELSE 0 END) AS null_count,
    ROUND(SUM(CASE WHEN transaction_id IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 4) AS null_pct,
    CASE WHEN SUM(CASE WHEN transaction_id IS NULL THEN 1 ELSE 0 END) > 0 THEN 'FAIL' ELSE 'PASS' END AS result
FROM PROD_DB.RAW.TRANSACTIONS WHERE transaction_date >= CURRENT_DATE()
UNION ALL
SELECT 'customer_id', COUNT(*),
    SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END),
    ROUND(SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 4),
    CASE WHEN SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) > 0 THEN 'FAIL' ELSE 'PASS' END
FROM PROD_DB.RAW.TRANSACTIONS WHERE transaction_date >= CURRENT_DATE()
UNION ALL
SELECT 'amount', COUNT(*),
    SUM(CASE WHEN amount IS NULL THEN 1 ELSE 0 END),
    ROUND(SUM(CASE WHEN amount IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 4),
    CASE WHEN SUM(CASE WHEN amount IS NULL THEN 1 ELSE 0 END) / COUNT(*) > 0.01
         THEN 'FAIL: >1% nulls' ELSE 'PASS' END
FROM PROD_DB.RAW.TRANSACTIONS WHERE transaction_date >= CURRENT_DATE();


-- TEST 4: Amount distribution check (detect data corruption)
-- Compare today's stats to 30-day rolling average
WITH baseline AS (
    SELECT
        AVG(amount) AS baseline_avg,
        STDDEV(amount) AS baseline_std
    FROM PROD_DB.RAW.TRANSACTIONS
    WHERE transaction_date BETWEEN DATEADD('day', -30, CURRENT_DATE()) AND CURRENT_DATE()
),
today AS (
    SELECT
        AVG(amount) AS today_avg,
        STDDEV(amount) AS today_std
    FROM PROD_DB.RAW.TRANSACTIONS
    WHERE DATE_TRUNC('day', transaction_date) = CURRENT_DATE()
)
SELECT
    b.baseline_avg,
    t.today_avg,
    ABS(t.today_avg - b.baseline_avg) / b.baseline_avg * 100 AS pct_change,
    CASE
        WHEN ABS(t.today_avg - b.baseline_avg) / b.baseline_avg > 0.5
        THEN 'FAIL: Average amount changed >50%'
        ELSE 'PASS'
    END AS qa_result
FROM baseline b, today t;


-- TEST 5: Referential integrity (every transaction has a valid customer)
SELECT COUNT(*) AS orphaned_transactions
FROM PROD_DB.RAW.TRANSACTIONS t
LEFT JOIN PROD_DB.RAW.CUSTOMERS c ON t.customer_id = c.customer_id
WHERE c.customer_id IS NULL
  AND t.transaction_date >= CURRENT_DATE();
-- PASS: 0 orphaned transactions
-- FAIL: Any orphaned records → check customer load job
```

#### Stage 2: Bronze → Silver QA (Testing Transformation in Databricks)

```python
# QA notebook for Bronze → Silver validation
# Run after the Silver processing step

def validate_silver_layer(spark, bronze_path, silver_path, quarantine_path, run_date):
    """
    Tests that run after the Silver processing step.
    Compares Bronze (raw) to Silver (cleaned) to ensure transformation worked.
    """
    df_bronze = spark.read.format("delta").load(bronze_path) \
                     .filter(col("_ingested_at").cast("date") == run_date)

    df_silver = spark.read.format("delta").load(silver_path) \
                     .filter(col("_silver_processed_at").cast("date") == run_date)

    df_quarantine = spark.read.format("delta").load(quarantine_path) \
                         .filter(col("_ingested_at").cast("date") == run_date) \
                         if DeltaTable.isDeltaTable(spark, quarantine_path) \
                         else spark.createDataFrame([], df_bronze.schema)

    bronze_count = df_bronze.count()
    silver_count = df_silver.count()
    quarantine_count = df_quarantine.count()

    results = []

    # TEST 1: Row count reconciliation
    # Bronze = Silver + Quarantine (no records should be lost)
    expected = bronze_count
    actual = silver_count + quarantine_count
    results.append({
        "test": "row_count_reconciliation",
        "expected": expected,
        "actual": actual,
        "passed": expected == actual,
        "detail": f"Bronze: {bronze_count}, Silver: {silver_count}, Quarantine: {quarantine_count}"
    })

    # TEST 2: No nulls in critical Silver columns
    null_count = df_silver.filter(
        col("transaction_id").isNull() |
        col("customer_id").isNull() |
        col("amount").isNull()
    ).count()
    results.append({
        "test": "no_nulls_in_critical_columns",
        "expected": 0,
        "actual": null_count,
        "passed": null_count == 0,
        "detail": f"Null records found: {null_count}"
    })

    # TEST 3: No negative amounts in Silver (should have been fixed)
    neg_count = df_silver.filter(col("amount") < 0).count()
    results.append({
        "test": "no_negative_amounts_in_silver",
        "expected": 0,
        "actual": neg_count,
        "passed": neg_count == 0,
        "detail": f"Negative amounts still present: {neg_count}"
    })

    # TEST 4: No duplicates in Silver
    dup_count = df_silver.groupBy("transaction_id").count().filter(col("count") > 1).count()
    results.append({
        "test": "no_duplicate_transaction_ids",
        "expected": 0,
        "actual": dup_count,
        "passed": dup_count == 0,
        "detail": f"Duplicate transaction IDs: {dup_count}"
    })

    # TEST 5: All merchant_category values are known
    valid_categories = {"Grocery", "Electronics", "Jewelry", "Clothing",
                        "Restaurant", "Travel", "Gas", "Healthcare", "ATM", "Other"}
    unknown_cats = df_silver.filter(
        ~col("merchant_category").isin(list(valid_categories))
    ).count()
    results.append({
        "test": "all_categories_are_valid",
        "expected": 0,
        "actual": unknown_cats,
        "passed": unknown_cats == 0,
        "detail": f"Unknown categories: {unknown_cats}"
    })

    # TEST 6: Quarantine rate is acceptable (< 1%)
    quarantine_rate = quarantine_count / bronze_count if bronze_count > 0 else 0
    results.append({
        "test": "quarantine_rate_under_1pct",
        "expected": "< 1%",
        "actual": f"{quarantine_rate:.2%}",
        "passed": quarantine_rate < 0.01,
        "detail": f"Quarantine rate: {quarantine_rate:.2%}"
    })

    # Print summary
    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed
    print(f"\n{'='*60}")
    print(f"SILVER QA RESULTS: {passed}/{len(results)} PASSED, {failed} FAILED")
    print(f"{'='*60}")
    for r in results:
        status = "✅ PASS" if r["passed"] else "❌ FAIL"
        print(f"  {status}: {r['test']}")
        if not r["passed"]:
            print(f"         Expected: {r['expected']}, Got: {r['actual']}")
            print(f"         Detail: {r['detail']}")

    # If any test failed, raise an exception to stop the pipeline
    if failed > 0:
        raise Exception(f"Silver QA failed: {failed} tests failed. Pipeline stopped.")

    return results


#### Stage 3: Gold Features QA

def validate_gold_features(spark, gold_path, run_date):
    """
    Validate that Gold features look statistically reasonable.
    These tests catch bugs in feature engineering logic.
    """
    df_gold = spark.read.format("delta").load(gold_path).toPandas()

    tests = []

    # TEST 1: Feature coverage — all transactions have features
    null_features = df_gold[feature_cols].isnull().sum()
    high_null_features = null_features[null_features > len(df_gold) * 0.05]
    tests.append({
        "test": "feature_null_rate_under_5pct",
        "passed": len(high_null_features) == 0,
        "detail": f"Features with >5% nulls: {list(high_null_features.index)}"
    })

    # TEST 2: Feature value ranges are sensible
    range_tests = {
        "txn_count_90d": (0, 10000),        # 0 to 10K transactions
        "amount_vs_avg_ratio": (0, 1000),   # 0 to 1000x average
        "is_weekend": (0, 1),               # Binary
        "is_late_night": (0, 1),            # Binary
        "hour_of_day": (0, 23),             # Hour of day
    }

    for col, (min_val, max_val) in range_tests.items():
        if col in df_gold.columns:
            out_of_range = ((df_gold[col] < min_val) | (df_gold[col] > max_val)).sum()
            tests.append({
                "test": f"{col}_in_range_{min_val}_to_{max_val}",
                "passed": out_of_range == 0,
                "detail": f"{out_of_range} values outside [{min_val}, {max_val}]"
            })

    # TEST 3: Velocity ratio is not NaN or Inf
    velocity_col = "velocity_ratio_24h_vs_90d"
    if velocity_col in df_gold.columns:
        bad_values = (df_gold[velocity_col].isna() |
                      df_gold[velocity_col].apply(lambda x: np.isinf(x) if not pd.isna(x) else False)).sum()
        tests.append({
            "test": "velocity_ratio_no_nan_or_inf",
            "passed": bad_values == 0,
            "detail": f"{bad_values} NaN/Inf values in {velocity_col}"
        })

    passed = sum(1 for t in tests if t["passed"])
    failed = len(tests) - passed
    print(f"\nGold Features QA: {passed}/{len(tests)} passed")

    if failed > 0:
        raise Exception(f"Gold QA failed: {failed} tests failed")

    return tests
```

#### Stage 4: Prediction Output QA

```python
def validate_predictions(df_predictions: pd.DataFrame, expected_input_count: int):
    """
    Tests that run on model output before writing to Snowflake.
    Critical: catch bad predictions before they reach production.
    """
    tests = []

    # TEST 1: All input records were scored (no silent drops)
    tests.append({
        "test": "all_records_scored",
        "passed": len(df_predictions) == expected_input_count,
        "detail": f"Expected: {expected_input_count}, Got: {len(df_predictions)}"
    })

    # TEST 2: Scores are in valid range [0, 1]
    invalid_scores = ((df_predictions["anomaly_score"] < 0) |
                      (df_predictions["anomaly_score"] > 1) |
                      df_predictions["anomaly_score"].isna()).sum()
    tests.append({
        "test": "scores_in_valid_range_0_to_1",
        "passed": invalid_scores == 0,
        "detail": f"{invalid_scores} invalid scores found"
    })

    # TEST 3: Fraud flag rate is within expected range
    fraud_rate = (df_predictions["prediction_label"] == "fraud").mean()
    tests.append({
        "test": "fraud_rate_0.1pct_to_5pct",
        "passed": 0.001 <= fraud_rate <= 0.05,
        "detail": f"Fraud flag rate: {fraud_rate:.2%} (expected 0.1%-5%)"
    })

    # TEST 4: Score distribution is not degenerate
    # (all 0s or all 1s means the model broke)
    score_std = df_predictions["anomaly_score"].std()
    tests.append({
        "test": "score_distribution_has_variance",
        "passed": score_std > 0.01,
        "detail": f"Score standard deviation: {score_std:.4f}"
    })

    # TEST 5: No all-same scores (model not returning constant)
    unique_scores = df_predictions["anomaly_score"].nunique()
    tests.append({
        "test": "scores_are_not_constant",
        "passed": unique_scores > 100,
        "detail": f"Unique score values: {unique_scores}"
    })

    # TEST 6: Model version is recorded
    missing_version = df_predictions["model_version"].isna().sum()
    tests.append({
        "test": "all_records_have_model_version",
        "passed": missing_version == 0,
        "detail": f"Records missing model_version: {missing_version}"
    })

    passed = sum(1 for t in tests if t["passed"])
    failed = len(tests) - passed
    print(f"\nPrediction QA: {passed}/{len(tests)} passed")

    if failed > 0:
        failing_tests = [t["test"] for t in tests if not t["passed"]]
        raise Exception(f"Prediction QA failed: {failing_tests}")

    return tests
```

---

## 10. QA Step-by-Step Testing Guide

### The QA Engineer's Daily Workflow

As a QA engineer on an ML team using Snowflake and Databricks, here is your day-by-day and task-by-task workflow:

### Step 1: Understand What Was Built

Before you can test, understand the pipeline:

```
QUESTIONS TO ASK YOUR DATA ENGINEER:
─────────────────────────────────────────────────────────────────────
1. What is the source data?
   "Data comes from Snowflake table PROD_DB.RAW.TRANSACTIONS,
    loaded from our payments database every hour"

2. What transformations happen?
   "We clean nulls, deduplicate, fix negative amounts, and build
    customer behavior features"

3. What is the expected output?
   "Fraud probability score (0-1) for every transaction in the last 24h"

4. What business rules apply?
   "Any score > 0.85 = flagged as fraud, triggers a case in the fraud UI"
   "Fraud rate should be 0.1%-5% of transactions"
   "Scoring must complete within 3 hours of data landing"

5. What does a failure look like?
   "Pipeline fails → no scores written → fraud UI shows 0 cases"
   "This is a SEV-1 incident affecting the fraud team's work"
```

### Step 2: Map Out All Test Cases

Use this template for every pipeline stage:

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE: Bronze Ingestion from Snowflake                             │
├────────────────┬──────────────────────────────┬────────────────────┤
│ Test ID        │ Test Description             │ Expected Result    │
├────────────────┼──────────────────────────────┼────────────────────┤
│ B001           │ Row count matches source     │ ≤ 0.01% difference │
│ B002           │ No PK duplicates             │ 0 duplicates       │
│ B003           │ All mandatory columns present│ Schema matches DDL │
│ B004           │ Date range is today          │ Max date = today   │
│ B005           │ No future-dated records      │ 0 future records   │
│ B006           │ Job completed within SLA     │ < 30 minutes       │
└────────────────┴──────────────────────────────┴────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  STAGE: Silver Processing                                           │
├────────────────┬──────────────────────────────┬────────────────────┤
│ S001           │ Bronze = Silver + Quarantine │ 100% reconciliation│
│ S002           │ No nulls in PK columns       │ 0 null PKs         │
│ S003           │ No negative amounts          │ 0 negative amounts │
│ S004           │ No duplicates                │ 0 duplicates       │
│ S005           │ All categories valid         │ 0 unknown values   │
│ S006           │ Quarantine rate < 1%         │ < 1.0%             │
└────────────────┴──────────────────────────────┴────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  STAGE: Gold Feature Engineering                                    │
├────────────────┬──────────────────────────────┬────────────────────┤
│ G001           │ Feature null rate < 5%       │ < 5% nulls/feature │
│ G002           │ Binary features are 0 or 1   │ No other values    │
│ G003           │ No NaN/Inf in ratio features │ 0 NaN/Inf values   │
│ G004           │ 90d counts ≤ 90d data        │ Counts reasonable  │
│ G005           │ Features increase monoton.   │ count_90d ≥ count_24h│
└────────────────┴──────────────────────────────┴────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  STAGE: Model Scoring                                               │
├────────────────┬──────────────────────────────┬────────────────────┤
│ M001           │ 100% of inputs scored        │ 0 dropped records  │
│ M002           │ Scores in range [0,1]        │ No out-of-range    │
│ M003           │ Score distribution has var.  │ std > 0.01         │
│ M004           │ Fraud rate in range          │ 0.1% - 5.0%        │
│ M005           │ Correct model version used   │ Production alias   │
│ M006           │ Scoring completed on time    │ < 3 hours          │
└────────────────┴──────────────────────────────┴────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  STAGE: Prediction Anomaly Monitoring                               │
├────────────────┬──────────────────────────────┬────────────────────┤
│ A001           │ Fraud rate vs. 30d baseline  │ < 50% change       │
│ A002           │ Score mean vs. 30d baseline  │ < 20% change       │
│ A003           │ Score std vs. 30d baseline   │ < 30% change       │
│ A004           │ PSI for key features         │ < 0.25 (no CRITICAL│
│ A005           │ Stats logged to audit table  │ Row written to DB  │
└────────────────┴──────────────────────────────┴────────────────────┘
```

### Step 3: Write the Tests (Great Expectations)

Great Expectations is the industry standard for automated data quality testing:

```python
# Install: pip install great_expectations
# This is what your data quality test suite looks like

import great_expectations as gx
from great_expectations.core.batch import BatchRequest

def create_bronze_expectation_suite(context):
    """
    Define what 'good' looks like for Bronze data.
    These tests run automatically after every ingestion.
    """
    suite = context.add_or_update_expectation_suite("bronze_transactions")

    # Add a batch of data to validate
    validator = context.get_validator(
        batch_request=BatchRequest(
            datasource_name="bronze_delta",
            data_asset_name="transactions",
            batch_spec_passthrough={"path": "/mnt/bronze/transactions/"}
        ),
        expectation_suite_name="bronze_transactions"
    )

    # TEST: No null transaction IDs
    validator.expect_column_values_to_not_be_null("transaction_id")

    # TEST: No null customer IDs
    validator.expect_column_values_to_not_be_null("customer_id")

    # TEST: Amount must be present
    validator.expect_column_values_to_not_be_null("amount")

    # TEST: Amount distribution (detects major data corruption)
    validator.expect_column_mean_to_be_between("amount", min_value=30, max_value=300)

    # TEST: Merchant category values
    validator.expect_column_values_to_be_in_set(
        "merchant_category",
        value_set={"Grocery", "Electronics", "Jewelry", "Clothing",
                   "Restaurant", "Travel", "Gas", "Healthcare", "ATM", "Other"}
    )

    # TEST: Dates are not in the future
    validator.expect_column_values_to_be_between(
        "transaction_date",
        min_value="2020-01-01",  # Data shouldn't be from before the product launched
        max_value=datetime.utcnow().strftime("%Y-%m-%d"),
        parse_strings_as_datetimes=True
    )

    # TEST: Row count is within daily expected range
    validator.expect_table_row_count_to_be_between(min_value=50000, max_value=500000)

    # TEST: No duplicate transaction IDs
    validator.expect_column_values_to_be_unique("transaction_id")

    # Save the suite
    validator.save_expectation_suite()

    return suite


def run_bronze_validation(context, date_partition):
    """
    Execute the validation suite and get results.
    This runs as part of the daily pipeline.
    """
    results = context.run_checkpoint(
        checkpoint_name="bronze_daily_checkpoint",
        batch_request=BatchRequest(
            datasource_name="bronze_delta",
            data_asset_name="transactions",
            batch_spec_passthrough={
                "path": f"/mnt/bronze/transactions/date={date_partition}/"
            }
        )
    )

    if not results["success"]:
        failed_expectations = [
            k for k, v in results["run_results"].items()
            if not v["validation_result"]["success"]
        ]
        raise Exception(
            f"Bronze validation FAILED for {date_partition}. "
            f"Failed: {failed_expectations}"
        )

    print(f"Bronze validation PASSED for {date_partition}")
    return results
```

### Step 4: Regression Testing — Does the New Model Still Work?

When ML engineers deploy a new model version, QA must verify it doesn't regress on known cases:

```python
# Regression test suite for model updates
# Maintained by QA, run before every model promotion

class ModelRegressionTestSuite:
    """
    A fixed set of test cases with known expected outputs.
    Written by QA engineers based on past incidents and edge cases.
    Runs every time a new model version is candidate for production.
    """

    def __init__(self):
        # Golden test cases: (features, expected_label)
        # These were verified by fraud investigators as ground truth
        self.test_cases = [
            {
                "description": "Normal grocery purchase — should be LEGITIMATE",
                "features": {
                    "txn_count_90d": 120,
                    "avg_spend_90d": 55.0,
                    "amount": 48.0,                  # Within normal range
                    "amount_vs_avg_ratio": 0.87,
                    "txn_count_24h": 1,
                    "velocity_ratio_24h_vs_90d": 0.8, # Normal velocity
                    "is_late_night": 0,               # Normal time of day
                    "hour_of_day": 14,
                },
                "expected_label": "legitimate",
                "max_score": 0.30  # Should not score above 0.30
            },
            {
                "description": "Jewelry purchase 50x normal — should be FRAUD",
                "features": {
                    "txn_count_90d": 120,
                    "avg_spend_90d": 55.0,
                    "amount": 2800.0,               # 50x average
                    "amount_vs_avg_ratio": 50.9,
                    "txn_count_24h": 8,              # High velocity
                    "velocity_ratio_24h_vs_90d": 5.8,
                    "is_late_night": 1,              # 3 AM purchase
                    "hour_of_day": 3,
                },
                "expected_label": "fraud",
                "min_score": 0.80  # Must score above 0.80
            },
            {
                "description": "New customer first purchase — should be REVIEW",
                "features": {
                    "txn_count_90d": 1,
                    "avg_spend_90d": 120.0,
                    "amount": 120.0,
                    "amount_vs_avg_ratio": 1.0,
                    "txn_count_24h": 1,
                    "velocity_ratio_24h_vs_90d": 1.0,
                    "is_late_night": 0,
                    "hour_of_day": 11,
                },
                "expected_label": "review",
                "min_score": 0.50,
                "max_score": 0.85
            },
        ]

    def run(self, model, scaler, feature_cols):
        """Run all regression tests against a candidate model."""
        results = []

        for tc in self.test_cases:
            features = pd.DataFrame([{col: tc["features"].get(col, 0)
                                      for col in feature_cols}])
            features_scaled = scaler.transform(features)

            score = model.predict_proba(features_scaled)[0][1]
            label = "fraud" if score > 0.85 else ("review" if score > 0.60 else "legitimate")

            passed = True
            failure_reasons = []

            if label != tc["expected_label"]:
                passed = False
                failure_reasons.append(f"Expected label '{tc['expected_label']}', got '{label}'")

            if "min_score" in tc and score < tc["min_score"]:
                passed = False
                failure_reasons.append(f"Score {score:.3f} below minimum {tc['min_score']}")

            if "max_score" in tc and score > tc["max_score"]:
                passed = False
                failure_reasons.append(f"Score {score:.3f} above maximum {tc['max_score']}")

            results.append({
                "description": tc["description"],
                "score": score,
                "label": label,
                "expected_label": tc["expected_label"],
                "passed": passed,
                "failure_reasons": failure_reasons
            })

        passed_count = sum(1 for r in results if r["passed"])
        print(f"\n=== Regression Test Results ===")
        print(f"Passed: {passed_count}/{len(results)}")
        for r in results:
            status = "✅" if r["passed"] else "❌"
            print(f"  {status} {r['description']}")
            if not r["passed"]:
                for reason in r["failure_reasons"]:
                    print(f"      → {reason}")

        if passed_count < len(results):
            raise Exception(f"Regression tests failed: {len(results) - passed_count} failures")

        return results
```

### Step 5: Performance and SLA Testing

```python
# Load testing: verify pipeline completes within SLA
import time

def measure_pipeline_performance(spark, config):
    """
    Measure end-to-end pipeline execution time.
    Alert if any stage exceeds its SLA.
    """
    slas = {
        "bronze_ingestion": 30 * 60,   # 30 minutes
        "silver_processing": 45 * 60,  # 45 minutes
        "gold_features": 60 * 60,      # 60 minutes
        "model_scoring": 30 * 60,      # 30 minutes
        "total": 3 * 60 * 60           # 3 hours total
    }

    timings = {}
    total_start = time.time()

    # Bronze
    start = time.time()
    ingest_bronze(spark, config["snowflake_options"], config["bronze_path"])
    timings["bronze_ingestion"] = time.time() - start

    # Silver
    start = time.time()
    process_silver(spark, config["bronze_path"], config["silver_path"], config["quarantine_path"])
    timings["silver_processing"] = time.time() - start

    # Gold
    start = time.time()
    build_gold_features(spark, config["silver_path"], config["gold_path"])
    timings["gold_features"] = time.time() - start

    # Scoring
    start = time.time()
    # ... run scoring ...
    timings["model_scoring"] = time.time() - start

    timings["total"] = time.time() - total_start

    # Check SLAs
    print("\n=== Pipeline Performance Report ===")
    for stage, elapsed in timings.items():
        sla = slas.get(stage, float("inf"))
        pct_of_sla = elapsed / sla * 100
        status = "✅" if elapsed <= sla else "❌ SLA BREACH"
        print(f"  {status} {stage}: {elapsed/60:.1f}m ({pct_of_sla:.0f}% of {sla/60:.0f}m SLA)")

    return timings
```

---

## 11. Common QA Failure Scenarios and How to Catch Them

### The Failure Mode Catalog

Every QA engineer should know these common failures and their signatures:

```
┌─────────────────────────────────────────────────────────────────────┐
│              FAILURE MODE CATALOG                                   │
├───────────────────┬─────────────────────────┬───────────────────────┤
│ Failure           │ Symptom                 │ How QA Catches It     │
├───────────────────┼─────────────────────────┼───────────────────────┤
│ PIPELINE OUTAGE   │ Bronze row count = 0    │ Row count check (B001)│
│                   │ No new scores in UI     │ Score count check (M001│
├───────────────────┼─────────────────────────┼───────────────────────┤
│ DOUBLE INGESTION  │ Bronze row count 2x     │ Dedup check (B002)    │
│                   │ historical average      │ + row reconciliation  │
├───────────────────┼─────────────────────────┼───────────────────────┤
│ DATA CORRUPTION   │ Avg amount suddenly     │ Distribution check    │
│ IN SOURCE         │ 10x higher              │ (compare to baseline) │
├───────────────────┼─────────────────────────┼───────────────────────┤
│ WRONG MODEL       │ Fraud rate suddenly 10x │ Fraud rate check (M004│
│ DEPLOYED          │ or 0.001x of baseline   │ + model version log   │
├───────────────────┼─────────────────────────┼───────────────────────┤
│ FEATURE DRIFT     │ PSI > 0.25 on key       │ PSI monitoring        │
│                   │ features                │ (daily)               │
├───────────────────┼─────────────────────────┼───────────────────────┤
│ SCHEMA CHANGE     │ Silver job fails with   │ Schema check (B003)   │
│ IN SOURCE         │ "column not found"      │ + alerting on job fail│
├───────────────────┼─────────────────────────┼───────────────────────┤
│ TIMEZONE BUG      │ Late-night transactions │ Hour distribution     │
│                   │ all shifted 5h          │ check on Gold features│
├───────────────────┼─────────────────────────┼───────────────────────┤
│ TRAINING-SERVING  │ Model was trained on    │ Feature consistency   │
│ SKEW              │ different feature calc  │ test: compare train   │
│                   │ than inference          │ vs. inference features│
├───────────────────┼─────────────────────────┼───────────────────────┤
│ DATA LEAKAGE      │ Model accuracy is       │ Temporal validation:  │
│ IN TRAINING       │ suspiciously perfect    │ train on past, test   │
│                   │                         │ on future only        │
├───────────────────┼─────────────────────────┼───────────────────────┤
│ QUARANTINE SPIKE  │ Quarantine rate > 1%    │ Quarantine rate check │
│                   │ suddenly                │ (S006) + investigation│
└───────────────────┴─────────────────────────┴───────────────────────┘
```

### Debugging Playbook: When a Test Fails

```
STEP 1: Identify which stage failed
  → Look at the pipeline job in Databricks Jobs UI
  → Check which task has a red X

STEP 2: Check the logs
  In Databricks:  Click the failed task → Driver Logs → stderr
  In Snowflake:   SELECT * FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())

STEP 3: Quantify the impact
  → How many records are affected?
  → Which customers/transactions?
  → Which downstream systems are affected?

STEP 4: Find the root cause
  → Compare today's data to yesterday's using Delta Lake time travel:
    df_today = spark.read.format("delta").option("timestampAsOf", "today").load(path)
    df_yesterday = spark.read.format("delta").option("timestampAsOf", "yesterday").load(path)

STEP 5: Fix and verify
  → Fix the root cause
  → Rerun the failed stage
  → Run all QA tests again
  → Verify output in Snowflake

STEP 6: Write a test for it
  → If this failure wasn't caught by an existing test, write one
  → Add it to the test suite so it catches this failure next time
```

---

## 12. Quick Reference Cheat Sheet

### Snowflake Key Commands

```sql
-- See all databases
SHOW DATABASES;

-- See table structure
DESCRIBE TABLE PROD_DB.RAW.TRANSACTIONS;

-- Check table row count and size
SELECT COUNT(*) FROM PROD_DB.RAW.TRANSACTIONS;
SELECT ROW_COUNT, BYTES/1024/1024 AS SIZE_MB
FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TRANSACTIONS';

-- Query history (what queries ran recently?)
SELECT QUERY_TEXT, EXECUTION_STATUS, TOTAL_ELAPSED_TIME/1000 AS SEC
FROM TABLE(INFORMATION_SCHEMA.QUERY_HISTORY())
WHERE EXECUTION_STATUS != 'SUCCESS'
ORDER BY START_TIME DESC
LIMIT 20;

-- Task history (did my scheduled job succeed?)
SELECT NAME, STATE, SCHEDULED_TIME, COMPLETED_TIME, ERROR_MESSAGE
FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())
ORDER BY SCHEDULED_TIME DESC LIMIT 10;

-- Stream status (how far behind is my stream?)
SHOW STREAMS IN DATABASE PROD_DB;
SELECT SYSTEM$STREAM_GET_TABLE_TIMESTAMP('PROD_DB.RAW.TRANSACTIONS_STREAM');
```

### Databricks Key Commands

```python
# List files in a path
display(dbutils.fs.ls("/mnt/bronze/"))

# Read a Delta table quickly
df = spark.read.format("delta").load("/mnt/silver/transactions")
df.printSchema()
df.count()
display(df.limit(10))

# Delta table history (what changed?)
from delta.tables import DeltaTable
dt = DeltaTable.forPath(spark, "/mnt/silver/transactions")
display(dt.history())

# Time travel — see data as it was yesterday
df_old = spark.read.format("delta") \
    .option("timestampAsOf", "2026-03-01") \
    .load("/mnt/silver/transactions")

# Check table metrics
display(spark.sql("DESCRIBE DETAIL main.silver.transactions"))

# List all experiments in MLflow
import mlflow
experiments = mlflow.search_experiments()
for exp in experiments:
    print(exp.name, exp.experiment_id)

# Get production model details
from mlflow.tracking import MlflowClient
client = MlflowClient()
model = client.get_model_version_by_alias("main.ml_models.fraud_detector", "production")
print(f"Version: {model.version}, Run ID: {model.run_id}")
```

### QA Metric Thresholds (Copy-Paste Reference)

| What You're Testing          | PASS Threshold        | FAIL Action               |
|-----------------------------|-----------------------|---------------------------|
| Bronze row count (vs. yesterday) | Within ±30%       | Alert data eng + investigate |
| Silver quarantine rate       | < 1%                  | Block pipeline + alert    |
| Bronze → Silver reconciliation| 100% (no data loss)  | Block pipeline + alert    |
| Feature null rate            | < 5% per feature      | Investigate ETL logic     |
| Prediction fraud flag rate   | 0.1% – 5.0%           | Block + check model/data  |
| Anomaly score std dev        | > 0.01                | Block + check model       |
| PSI on model output          | < 0.10 (stable)       | WARN at 0.10, BLOCK at 0.25 |
| PSI on input features        | < 0.10 (stable)       | WARN at 0.10, BLOCK at 0.25 |
| Pipeline SLA (total)         | < 3 hours             | Alert + escalate          |
| Snowflake Task status        | STATE = SUCCEEDED     | Alert + investigate       |

---

## 13. Related Guides

- [Team Structure](./TEAM_STRUCTURE.md) — How Data Engineers, Data Scientists, and ML Engineers collaborate on this pipeline (with full Snowflake → Databricks code)
- [Anomaly Detection Guide](./ANOMALY_DETECTION.md) — Deep dive on Isolation Forest, statistical methods, and advanced anomaly detection algorithms
- [MLOps Guide](./MLOPS_GUIDE.md) — CI/CD for ML, model versioning strategies, deployment patterns
- [AI Company Stack](./AI_COMPANY_STACK.md) — How AI companies (Anthropic, OpenAI) build end-to-end AI infrastructure
- [Domain Examples](../10-domain-examples/) — See how these pipelines apply in finance, healthcare, retail

---

_Last Updated: 2026-03-03_
