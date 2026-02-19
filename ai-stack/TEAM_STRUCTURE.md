# AI/ML Team Structure and Collaboration

## 📋 Overview

This guide provides a comprehensive understanding of how modern AI/ML teams are structured, how different roles collaborate, and how data flows through the organization to build production AI models. We'll explore a real-world use case: building anomaly detection models using Databricks Unity Catalog with data from Snowflake.

## 🎯 Table of Contents

1. [Team Structure and Roles](#team-structure-and-roles)
2. [Data Flow: From Raw Data to Production Models](#data-flow-from-raw-data-to-production-models)
3. [Snowflake to Databricks: Complete Pipeline](#snowflake-to-databricks-complete-pipeline)
4. [Anomaly Detection Use Case](#anomaly-detection-use-case)
5. [Unity Catalog: Data Governance](#unity-catalog-data-governance)
6. [Team Collaboration Patterns](#team-collaboration-patterns)
7. [Real-World Examples](#real-world-examples)

---

## Team Structure and Roles

### The Three Pillars of AI/ML Teams

Modern AI/ML teams consist of three core roles that work together in a continuous cycle:

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI/ML Team Structure                         │
└─────────────────────────────────────────────────────────────────┘

    Data Engineers          Data Scientists         ML Engineers
         │                       │                       │
         │                       │                       │
    ┌────▼─────┐          ┌─────▼──────┐         ┌─────▼──────┐
    │  Build   │          │  Research  │         │ Productionize│
    │   Data   │ ────────▶│   Train    │────────▶│   Deploy    │
    │ Pipelines│          │   Models   │         │   Monitor   │
    └──────────┘          └────────────┘         └──────┬──────┘
         ▲                                               │
         │                                               │
         └───────────────────────────────────────────────┘
              Feedback Loop: Monitoring → Pipeline Improvements
```

### 1. Data Engineers

**Primary Responsibility**: Build and maintain the data infrastructure that feeds ML models.

**Key Activities**:

- Design and build ETL/ELT pipelines
- Ensure data quality, consistency, and availability
- Optimize data storage and query performance
- Implement data governance and security policies
- Create reusable data assets for data scientists

**Technology Stack**:

- **Data Warehouses**: Snowflake, BigQuery, Redshift
- **Data Lakes**: S3, ADLS, GCS
- **Processing**: Spark, Airflow, dbt, Fivetran
- **Streaming**: Kafka, Kinesis, Pub/Sub
- **Languages**: SQL, Python, Scala, Java

**Example Daily Tasks**:

```python
# Data Engineer: Building ETL pipeline in Databricks
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, window, avg, stddev, current_timestamp

# Initialize Spark session
spark = SparkSession.builder \
    .appName("Transaction ETL") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

# Read from Snowflake
snowflake_options = {
    "sfURL": "account.snowflakecomputing.com",
    "sfUser": "etl_user",
    "sfPassword": "***",
    "sfDatabase": "PROD_DB",
    "sfSchema": "TRANSACTIONS",
    "sfWarehouse": "ETL_WH"
}

df_raw = spark.read \
    .format("snowflake") \
    .options(**snowflake_options) \
    .option("dbtable", "raw_transactions") \
    .load()

# Data Quality Checks
def validate_data_quality(df):
    """
    Implement data quality checks
    """
    from pyspark.sql.functions import col, isnan, when, count

    # Check for nulls in critical columns
    null_counts = df.select([
        count(when(col(c).isNull(), c)).alias(c)
        for c in df.columns
    ]).collect()[0].asDict()

    # Check for duplicates
    duplicate_count = df.count() - df.dropDuplicates(['transaction_id']).count()

    # Validate ranges
    invalid_amounts = df.filter(col('amount') < 0).count()

    # Log quality metrics
    quality_report = {
        'null_counts': null_counts,
        'duplicates': duplicate_count,
        'invalid_amounts': invalid_amounts,
        'total_records': df.count()
    }

    if duplicate_count > 0 or invalid_amounts > 0:
        raise ValueError(f"Data quality issues detected: {quality_report}")

    return quality_report

# Validate data
validate_data_quality(df_raw)

# Transform data - Create features
df_transformed = df_raw \
    .withColumn("transaction_hour", hour(col("transaction_timestamp"))) \
    .withColumn("transaction_day", dayofweek(col("transaction_timestamp"))) \
    .withColumn("is_weekend", when(col("transaction_day").isin([1, 7]), 1).otherwise(0))

# Aggregate features by customer
df_customer_features = df_transformed.groupBy("customer_id") \
    .agg(
        count("transaction_id").alias("transaction_count"),
        avg("amount").alias("avg_transaction_amount"),
        stddev("amount").alias("stddev_transaction_amount"),
        max("amount").alias("max_transaction_amount"),
        sum("amount").alias("total_spend")
    )

# Write to Delta Lake (Bronze layer)
df_transformed.write \
    .format("delta") \
    .mode("append") \
    .option("mergeSchema", "true") \
    .save("s3://datalake/bronze/transactions")

# Write to Delta Lake (Silver layer - aggregated features)
df_customer_features.write \
    .format("delta") \
    .mode("overwrite") \
    .save("s3://datalake/silver/customer_features")

print("ETL pipeline completed successfully")
```

### 2. Data Scientists

**Primary Responsibility**: Research, experiment, and train ML models to solve business problems.

**Key Activities**:

- Exploratory data analysis (EDA)
- Feature engineering and selection
- Model training and evaluation
- Hyperparameter tuning
- Model experimentation and A/B testing
- Communicate insights to stakeholders

**Technology Stack**:

- **Languages**: Python, R
- **ML Libraries**: scikit-learn, XGBoost, LightGBM, PyTorch, TensorFlow
- **Experiment Tracking**: MLflow, Weights & Biases, Neptune
- **Notebooks**: Jupyter, Databricks Notebooks
- **Visualization**: Matplotlib, Seaborn, Plotly, Tableau

**Example Daily Tasks**:

```python
# Data Scientist: Training anomaly detection model in Databricks
import mlflow
import mlflow.sklearn
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, precision_recall_curve
import pandas as pd
import numpy as np

# Set MLflow experiment
mlflow.set_experiment("/Users/datascience/fraud_detection")

# Load feature data from Delta Lake
df_features = spark.read \
    .format("delta") \
    .load("s3://datalake/silver/customer_features") \
    .toPandas()

# Exploratory Data Analysis
print("Dataset shape:", df_features.shape)
print("\nFeature statistics:")
print(df_features.describe())

# Check for correlations
import seaborn as sns
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 8))
sns.heatmap(df_features.corr(), annot=True, cmap='coolwarm')
plt.title('Feature Correlations')
plt.savefig('/tmp/correlation_matrix.png')
plt.close()

# Feature Engineering - Create derived features
df_features['amount_volatility'] = df_features['stddev_transaction_amount'] / (df_features['avg_transaction_amount'] + 1e-6)
df_features['max_to_avg_ratio'] = df_features['max_transaction_amount'] / (df_features['avg_transaction_amount'] + 1e-6)

# Select features for training
feature_cols = [
    'transaction_count',
    'avg_transaction_amount',
    'stddev_transaction_amount',
    'max_transaction_amount',
    'total_spend',
    'amount_volatility',
    'max_to_avg_ratio'
]

X = df_features[feature_cols]

# Handle missing values
X = X.fillna(X.median())

# Start MLflow run
with mlflow.start_run(run_name="isolation_forest_v1") as run:

    # Log parameters
    contamination = 0.01
    n_estimators = 200
    max_samples = 'auto'

    mlflow.log_param("contamination", contamination)
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_samples", max_samples)
    mlflow.log_param("features", feature_cols)

    # Feature scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train Isolation Forest
    model = IsolationForest(
        contamination=contamination,
        n_estimators=n_estimators,
        max_samples=max_samples,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_scaled)

    # Predict anomaly scores
    anomaly_scores = model.score_samples(X_scaled)
    predictions = model.predict(X_scaled)  # -1 for anomalies, 1 for normal

    # Convert predictions to binary (1 for anomaly, 0 for normal)
    predictions_binary = (predictions == -1).astype(int)

    # Calculate metrics
    n_anomalies = predictions_binary.sum()
    anomaly_rate = n_anomalies / len(predictions_binary)

    mlflow.log_metric("n_anomalies", n_anomalies)
    mlflow.log_metric("anomaly_rate", anomaly_rate)

    # Log artifacts
    mlflow.log_artifact('/tmp/correlation_matrix.png')

    # Create anomaly score distribution plot
    plt.figure(figsize=(10, 6))
    plt.hist(anomaly_scores, bins=50, alpha=0.7, edgecolor='black')
    plt.axvline(x=np.percentile(anomaly_scores, contamination * 100),
                color='red', linestyle='--', label=f'{contamination*100}th percentile')
    plt.xlabel('Anomaly Score')
    plt.ylabel('Frequency')
    plt.title('Distribution of Anomaly Scores')
    plt.legend()
    plt.savefig('/tmp/anomaly_distribution.png')
    mlflow.log_artifact('/tmp/anomaly_distribution.png')
    plt.close()

    # Log model
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="fraud_detection_isolation_forest"
    )

    # Log scaler
    mlflow.sklearn.log_model(scaler, "scaler")

    print(f"Model trained successfully!")
    print(f"Run ID: {run.info.run_id}")
    print(f"Detected {n_anomalies} anomalies ({anomaly_rate*100:.2f}%)")

# Analyze anomalies
df_features['anomaly_score'] = anomaly_scores
df_features['is_anomaly'] = predictions_binary

# Get top anomalies for investigation
top_anomalies = df_features.nlargest(10, 'is_anomaly')[
    ['customer_id'] + feature_cols + ['anomaly_score', 'is_anomaly']
]

print("\nTop 10 Anomalies for Review:")
print(top_anomalies)

# Save results for stakeholder review
top_anomalies.to_csv('/tmp/top_anomalies_for_review.csv', index=False)
```

### 3. ML Engineers

**Primary Responsibility**: Deploy, monitor, and maintain ML models in production.

**Key Activities**:

- Productionize research code from data scientists
- Build model serving infrastructure
- Implement CI/CD pipelines for models
- Monitor model performance and data drift
- Optimize models for latency and throughput
- Handle model retraining and versioning

**Technology Stack**:

- **Serving**: FastAPI, Flask, TorchServe, TensorFlow Serving
- **Orchestration**: Kubernetes, Docker, Airflow
- **Monitoring**: Prometheus, Grafana, Evidently AI
- **CI/CD**: Jenkins, GitHub Actions, GitLab CI
- **Languages**: Python, Go, Java
- **Model Stores**: MLflow, DVC, SageMaker Model Registry

**Example Daily Tasks**:

```python
# ML Engineer: Deploying model with monitoring in production
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
import mlflow
import mlflow.sklearn
import numpy as np
from prometheus_client import Counter, Histogram, generate_latest
import logging
from datetime import datetime
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
PREDICTION_COUNTER = Counter(
    'model_predictions_total',
    'Total number of predictions made',
    ['model_version', 'prediction_result']
)

PREDICTION_LATENCY = Histogram(
    'model_prediction_latency_seconds',
    'Time spent processing prediction',
    ['model_version']
)

ANOMALY_SCORE_HISTOGRAM = Histogram(
    'anomaly_scores',
    'Distribution of anomaly scores',
    buckets=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
)

# Load model from MLflow
MODEL_VERSION = "1"
MODEL_NAME = "fraud_detection_isolation_forest"

mlflow.set_tracking_uri("databricks://workspace")

# Load model and scaler
model_uri = f"models:/{MODEL_NAME}/{MODEL_VERSION}"
model = mlflow.sklearn.load_model(model_uri)
scaler = mlflow.sklearn.load_model(f"{model_uri}/scaler")

logger.info(f"Loaded model: {MODEL_NAME} version {MODEL_VERSION}")

# FastAPI app
app = FastAPI(
    title="Anomaly Detection API",
    description="Production API for real-time anomaly detection",
    version="1.0.0"
)

# Request model
class TransactionFeatures(BaseModel):
    customer_id: str
    transaction_count: int
    avg_transaction_amount: float
    stddev_transaction_amount: float
    max_transaction_amount: float
    total_spend: float

    @validator('transaction_count')
    def validate_transaction_count(cls, v):
        if v < 0:
            raise ValueError('transaction_count must be non-negative')
        return v

    @validator('avg_transaction_amount', 'max_transaction_amount', 'total_spend')
    def validate_amounts(cls, v):
        if v < 0:
            raise ValueError('Amount values must be non-negative')
        return v

# Response model
class AnomalyPrediction(BaseModel):
    customer_id: str
    is_anomaly: bool
    anomaly_score: float
    confidence: float
    timestamp: str
    model_version: str

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "version": MODEL_VERSION,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return generate_latest()

@app.post("/predict", response_model=AnomalyPrediction)
async def predict_anomaly(features: TransactionFeatures):
    """
    Predict if customer behavior is anomalous
    """
    import time
    start_time = time.time()

    try:
        # Create derived features
        amount_volatility = features.stddev_transaction_amount / (features.avg_transaction_amount + 1e-6)
        max_to_avg_ratio = features.max_transaction_amount / (features.avg_transaction_amount + 1e-6)

        # Prepare feature vector
        X = np.array([[
            features.transaction_count,
            features.avg_transaction_amount,
            features.stddev_transaction_amount,
            features.max_transaction_amount,
            features.total_spend,
            amount_volatility,
            max_to_avg_ratio
        ]])

        # Scale features
        X_scaled = scaler.transform(X)

        # Predict
        anomaly_score = model.score_samples(X_scaled)[0]
        prediction = model.predict(X_scaled)[0]
        is_anomaly = (prediction == -1)

        # Convert anomaly score to confidence (0 to 1)
        # More negative scores = more anomalous
        confidence = 1.0 / (1.0 + np.exp(anomaly_score))

        # Record metrics
        prediction_result = "anomaly" if is_anomaly else "normal"
        PREDICTION_COUNTER.labels(
            model_version=MODEL_VERSION,
            prediction_result=prediction_result
        ).inc()

        ANOMALY_SCORE_HISTOGRAM.observe(confidence)

        # Log prediction
        logger.info(
            f"Prediction: customer_id={features.customer_id}, "
            f"is_anomaly={is_anomaly}, confidence={confidence:.3f}"
        )

        # Measure latency
        latency = time.time() - start_time
        PREDICTION_LATENCY.labels(model_version=MODEL_VERSION).observe(latency)

        return AnomalyPrediction(
            customer_id=features.customer_id,
            is_anomaly=is_anomaly,
            anomaly_score=float(anomaly_score),
            confidence=float(confidence),
            timestamp=datetime.utcnow().isoformat(),
            model_version=MODEL_VERSION
        )

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch_predict")
async def batch_predict(features_list: list[TransactionFeatures]):
    """
    Batch prediction endpoint for multiple customers
    """
    results = []
    for features in features_list:
        result = await predict_anomaly(features)
        results.append(result)

    return {"predictions": results, "count": len(results)}

if __name__ == "__main__":
    # Run server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
```

**Kubernetes Deployment Configuration**:

```yaml
# ml-engineer: k8s/anomaly-detection-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: anomaly-detection-api
  namespace: ml-services
spec:
  replicas: 3
  selector:
    matchLabels:
      app: anomaly-detection-api
  template:
    metadata:
      labels:
        app: anomaly-detection-api
        version: v1
    spec:
      containers:
        - name: api
          image: myregistry/anomaly-detection-api:v1.0.0
          ports:
            - containerPort: 8000
              name: http
            - containerPort: 9090
              name: metrics
          env:
            - name: MLFLOW_TRACKING_URI
              valueFrom:
                secretKeyRef:
                  name: mlflow-credentials
                  key: tracking_uri
            - name: MODEL_NAME
              value: "fraud_detection_isolation_forest"
            - name: MODEL_VERSION
              value: "1"
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
            limits:
              cpu: "2000m"
              memory: "4Gi"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: anomaly-detection-service
  namespace: ml-services
spec:
  selector:
    app: anomaly-detection-api
  ports:
    - name: http
      port: 80
      targetPort: 8000
    - name: metrics
      port: 9090
      targetPort: 9090
  type: LoadBalancer
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: anomaly-detection-metrics
  namespace: ml-services
spec:
  selector:
    matchLabels:
      app: anomaly-detection-api
  endpoints:
    - port: metrics
      interval: 30s
```

---

## Data Flow: From Raw Data to Production Models

### Complete End-to-End Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Data Sources                                   │
│         (Application DBs, APIs, Streams, Files)                     │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Snowflake (Data Warehouse)                       │
│  - Raw Data Ingestion                                               │
│  - Data Quality Checks                                              │
│  - Historical Storage                                               │
│  - Business Intelligence                                            │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ ETL Pipeline (Fivetran/Airflow)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Databricks Lakehouse                                    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               Bronze Layer (Raw Data)                         │  │
│  │  - Raw data from Snowflake                                   │  │
│  │  - No transformations                                         │  │
│  │  - Append-only Delta tables                                  │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Silver Layer (Cleaned Data)                      │  │
│  │  - Data quality validation                                   │  │
│  │  - Deduplication                                             │  │
│  │  - Type casting                                              │  │
│  │  - Business logic applied                                    │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               Gold Layer (Feature Tables)                     │  │
│  │  - Aggregated features                                       │  │
│  │  - ML-ready datasets                                         │  │
│  │  - Governed by Unity Catalog                                 │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ML Training & Experiments                         │
│  - Databricks Notebooks                                             │
│  - MLflow Experiment Tracking                                       │
│  - Hyperparameter Tuning                                            │
│  - Model Validation                                                 │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  Unity Catalog Model Registry                        │
│  - Model Versioning                                                 │
│  - Lineage Tracking                                                 │
│  - Access Control                                                   │
│  - Staging → Production Promotion                                   │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Production Serving                                │
│  - REST API (FastAPI/Flask)                                         │
│  - Batch Inference                                                  │
│  - Real-time Streaming                                              │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Monitoring & Feedback Loop                              │
│  - Performance Metrics                                              │
│  - Data Drift Detection                                             │
│  - Model Retraining Triggers                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Roles in Each Stage

| Stage                  | Data Engineer            | Data Scientist                      | ML Engineer         |
| ---------------------- | ------------------------ | ----------------------------------- | ------------------- |
| **Data Ingestion**     | ✅ Primary Owner         | ❌                                  | ❌                  |
| **Bronze Layer**       | ✅ Primary Owner         | ❌                                  | ❌                  |
| **Silver Layer**       | ✅ Primary Owner         | 🤝 Collaborates on business logic   | ❌                  |
| **Gold Layer**         | 🤝 Builds infrastructure | ✅ Primary Owner (defines features) | ❌                  |
| **Model Training**     | ❌                       | ✅ Primary Owner                    | 🤝 Provides tooling |
| **Model Registry**     | ❌                       | 🤝 Registers models                 | ✅ Primary Owner    |
| **Production Serving** | ❌                       | ❌                                  | ✅ Primary Owner    |
| **Monitoring**         | 🤝 Data pipeline health  | 🤝 Model metrics                    | ✅ Primary Owner    |

---

## Snowflake to Databricks: Complete Pipeline

### Architecture Overview

This section demonstrates a complete real-world pipeline for building anomaly detection models:

**Data Source**: Customer transactions in Snowflake
**Processing**: Databricks with Delta Lake
**ML**: Anomaly detection for fraud
**Governance**: Unity Catalog

### Step 1: Data in Snowflake

```sql
-- Snowflake: Raw transaction data
-- Database: PROD_DB
-- Schema: TRANSACTIONS
-- Table: RAW_TRANSACTIONS

CREATE OR REPLACE TABLE PROD_DB.TRANSACTIONS.RAW_TRANSACTIONS (
    transaction_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    merchant_id VARCHAR(50),
    transaction_timestamp TIMESTAMP_NTZ NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(20),
    merchant_category VARCHAR(50),
    location_lat DECIMAL(10, 6),
    location_lon DECIMAL(10, 6),
    device_id VARCHAR(100),
    ip_address VARCHAR(45),
    is_fraud BOOLEAN,  -- Ground truth for training
    ingestion_timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Create indexes for performance
CREATE INDEX idx_customer_id ON RAW_TRANSACTIONS(customer_id);
CREATE INDEX idx_timestamp ON RAW_TRANSACTIONS(transaction_timestamp);

-- Sample data
INSERT INTO PROD_DB.TRANSACTIONS.RAW_TRANSACTIONS
    (transaction_id, customer_id, merchant_id, transaction_timestamp,
     amount, transaction_type, merchant_category, is_fraud)
VALUES
    ('TXN001', 'CUST001', 'MERCH001', '2024-01-15 10:30:00', 45.99, 'PURCHASE', 'Grocery', FALSE),
    ('TXN002', 'CUST001', 'MERCH002', '2024-01-15 14:20:00', 89.50, 'PURCHASE', 'Electronics', FALSE),
    ('TXN003', 'CUST002', 'MERCH003', '2024-01-16 09:15:00', 1250.00, 'PURCHASE', 'Jewelry', TRUE),
    ('TXN004', 'CUST001', 'MERCH001', '2024-01-16 18:45:00', 52.30, 'PURCHASE', 'Grocery', FALSE);

-- Data quality view
CREATE OR REPLACE VIEW PROD_DB.TRANSACTIONS.VW_DATA_QUALITY AS
SELECT
    COUNT(*) as total_transactions,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(CASE WHEN is_fraud = TRUE THEN 1 ELSE 0 END) as fraud_count,
    ROUND(SUM(CASE WHEN is_fraud = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as fraud_rate_pct,
    MIN(transaction_timestamp) as earliest_transaction,
    MAX(transaction_timestamp) as latest_transaction,
    ROUND(AVG(amount), 2) as avg_transaction_amount,
    ROUND(STDDEV(amount), 2) as stddev_transaction_amount
FROM RAW_TRANSACTIONS;

-- Query the view
SELECT * FROM PROD_DB.TRANSACTIONS.VW_DATA_QUALITY;
```

### Step 2: ETL Pipeline (Data Engineer)

```python
# Databricks Notebook: ETL Pipeline from Snowflake to Delta Lake
# This runs as a scheduled job in Databricks

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.window import Window
from delta.tables import DeltaTable
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Spark with Delta Lake support
spark = SparkSession.builder \
    .appName("Snowflake to Databricks ETL") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

# Snowflake connection parameters
SNOWFLAKE_OPTIONS = {
    "sfURL": dbutils.secrets.get(scope="snowflake", key="url"),
    "sfUser": dbutils.secrets.get(scope="snowflake", key="user"),
    "sfPassword": dbutils.secrets.get(scope="snowflake", key="password"),
    "sfDatabase": "PROD_DB",
    "sfSchema": "TRANSACTIONS",
    "sfWarehouse": "ETL_WH",
    "sfRole": "ETL_ROLE"
}

# Delta Lake paths (using Unity Catalog)
BRONZE_PATH = "main.bronze.transactions_raw"
SILVER_PATH = "main.silver.transactions_cleaned"
GOLD_PATH = "main.gold.transaction_features"

# ====================================================================
# BRONZE LAYER: Raw data ingestion from Snowflake
# ====================================================================

def ingest_from_snowflake():
    """
    Ingest data from Snowflake to Bronze layer
    Strategy: Incremental load based on timestamp
    """
    logger.info("Starting Snowflake ingestion...")

    # Get last ingestion timestamp
    try:
        last_ingestion = spark.sql(
            f"SELECT MAX(ingestion_timestamp) as max_ts FROM {BRONZE_PATH}"
        ).collect()[0]['max_ts']

        if last_ingestion is None:
            # First run - load all data
            query = "SELECT * FROM RAW_TRANSACTIONS"
        else:
            # Incremental load
            query = f"""
                SELECT * FROM RAW_TRANSACTIONS
                WHERE ingestion_timestamp > '{last_ingestion}'
            """
    except:
        # Table doesn't exist - first run
        query = "SELECT * FROM RAW_TRANSACTIONS"

    logger.info(f"Executing query: {query}")

    # Read from Snowflake
    df_raw = spark.read \
        .format("snowflake") \
        .options(**SNOWFLAKE_OPTIONS) \
        .option("query", query) \
        .load()

    record_count = df_raw.count()
    logger.info(f"Retrieved {record_count} records from Snowflake")

    if record_count > 0:
        # Add metadata columns
        df_bronze = df_raw \
            .withColumn("bronze_ingestion_timestamp", current_timestamp()) \
            .withColumn("source_system", lit("snowflake")) \
            .withColumn("pipeline_run_id", lit(spark.sparkContext.applicationId))

        # Write to Bronze layer (append mode)
        df_bronze.write \
            .format("delta") \
            .mode("append") \
            .option("mergeSchema", "true") \
            .saveAsTable(BRONZE_PATH)

        logger.info(f"Successfully wrote {record_count} records to Bronze layer")

    return df_bronze if record_count > 0 else None

# ====================================================================
# SILVER LAYER: Data cleaning and validation
# ====================================================================

def create_silver_layer():
    """
    Clean and validate data in Silver layer
    - Remove duplicates
    - Validate data types
    - Apply business rules
    - Add derived columns
    """
    logger.info("Creating Silver layer...")

    # Read from Bronze
    df_bronze = spark.read.table(BRONZE_PATH)

    # Data cleaning and validation
    df_silver = df_bronze \
        .filter(col("amount") > 0) \
        .filter(col("transaction_timestamp").isNotNull()) \
        .filter(col("customer_id").isNotNull()) \
        .dropDuplicates(["transaction_id"])

    # Add derived columns
    df_silver = df_silver \
        .withColumn("transaction_date", to_date(col("transaction_timestamp"))) \
        .withColumn("transaction_hour", hour(col("transaction_timestamp"))) \
        .withColumn("transaction_day_of_week", dayofweek(col("transaction_timestamp"))) \
        .withColumn("is_weekend",
                   when(col("transaction_day_of_week").isin([1, 7]), True).otherwise(False)) \
        .withColumn("is_high_value",
                   when(col("amount") > 500, True).otherwise(False)) \
        .withColumn("amount_category",
                   when(col("amount") < 50, "low")
                   .when(col("amount") < 200, "medium")
                   .when(col("amount") < 500, "high")
                   .otherwise("very_high"))

    # Data quality metrics
    total_bronze = df_bronze.count()
    total_silver = df_silver.count()
    rejected_records = total_bronze - total_silver

    logger.info(f"Bronze records: {total_bronze}")
    logger.info(f"Silver records: {total_silver}")
    logger.info(f"Rejected records: {rejected_records} ({rejected_records/total_bronze*100:.2f}%)")

    # Write to Silver layer
    df_silver.write \
        .format("delta") \
        .mode("overwrite") \
        .option("overwriteSchema", "true") \
        .saveAsTable(SILVER_PATH)

    logger.info("Successfully created Silver layer")

    return df_silver

# ====================================================================
# GOLD LAYER: Feature engineering for ML
# ====================================================================

def create_gold_layer():
    """
    Create ML features in Gold layer
    - Customer-level aggregations
    - Time-based features
    - Behavioral patterns
    """
    logger.info("Creating Gold layer with ML features...")

    # Read from Silver
    df_silver = spark.read.table(SILVER_PATH)

    # Define time windows for feature calculation
    window_7d = 7 * 24 * 60 * 60  # 7 days in seconds
    window_30d = 30 * 24 * 60 * 60  # 30 days in seconds

    # Window specification for customer-level features
    window_spec = Window.partitionBy("customer_id").orderBy(col("transaction_timestamp").cast("long"))

    # Calculate rolling features
    df_features = df_silver \
        .withColumn("transactions_last_7d",
                   count("*").over(
                       Window.partitionBy("customer_id")
                       .orderBy(col("transaction_timestamp").cast("long"))
                       .rangeBetween(-window_7d, 0)
                   )) \
        .withColumn("avg_amount_last_7d",
                   avg("amount").over(
                       Window.partitionBy("customer_id")
                       .orderBy(col("transaction_timestamp").cast("long"))
                       .rangeBetween(-window_7d, 0)
                   )) \
        .withColumn("max_amount_last_7d",
                   max("amount").over(
                       Window.partitionBy("customer_id")
                       .orderBy(col("transaction_timestamp").cast("long"))
                       .rangeBetween(-window_7d, 0)
                   )) \
        .withColumn("transactions_last_30d",
                   count("*").over(
                       Window.partitionBy("customer_id")
                       .orderBy(col("transaction_timestamp").cast("long"))
                       .rangeBetween(-window_30d, 0)
                   ))

    # Customer lifetime features
    customer_features = df_silver.groupBy("customer_id").agg(
        count("transaction_id").alias("total_transactions"),
        sum("amount").alias("total_spend"),
        avg("amount").alias("avg_transaction_amount"),
        stddev("amount").alias("stddev_transaction_amount"),
        min("amount").alias("min_transaction_amount"),
        max("amount").alias("max_transaction_amount"),
        countDistinct("merchant_category").alias("unique_merchant_categories"),
        countDistinct("merchant_id").alias("unique_merchants"),
        sum(when(col("is_weekend"), 1).otherwise(0)).alias("weekend_transactions"),
        sum(when(col("is_high_value"), 1).otherwise(0)).alias("high_value_transactions"),
        min("transaction_timestamp").alias("first_transaction_date"),
        max("transaction_timestamp").alias("last_transaction_date"),
        datediff(max("transaction_timestamp"), min("transaction_timestamp")).alias("customer_tenure_days")
    )

    # Calculate additional derived features
    customer_features = customer_features \
        .withColumn("amount_volatility",
                   col("stddev_transaction_amount") / (col("avg_transaction_amount") + 0.000001)) \
        .withColumn("max_to_avg_ratio",
                   col("max_transaction_amount") / (col("avg_transaction_amount") + 0.000001)) \
        .withColumn("weekend_transaction_rate",
                   col("weekend_transactions") / (col("total_transactions") + 0.000001)) \
        .withColumn("high_value_transaction_rate",
                   col("high_value_transactions") / (col("total_transactions") + 0.000001)) \
        .withColumn("avg_transactions_per_day",
                   col("total_transactions") / (col("customer_tenure_days") + 1)) \
        .withColumn("feature_timestamp", current_timestamp())

    # Write to Gold layer
    customer_features.write \
        .format("delta") \
        .mode("overwrite") \
        .option("overwriteSchema", "true") \
        .saveAsTable(GOLD_PATH)

    logger.info(f"Successfully created Gold layer with {customer_features.count()} customer feature records")

    # Feature statistics
    logger.info("Feature Statistics:")
    customer_features.select(
        "total_transactions",
        "total_spend",
        "amount_volatility",
        "max_to_avg_ratio"
    ).describe().show()

    return customer_features

# ====================================================================
# Main execution
# ====================================================================

def main():
    """
    Main ETL pipeline execution
    """
    start_time = datetime.now()
    logger.info(f"Starting ETL pipeline at {start_time}")

    try:
        # Step 1: Ingest from Snowflake to Bronze
        df_bronze = ingest_from_snowflake()

        if df_bronze is not None:
            # Step 2: Create Silver layer
            df_silver = create_silver_layer()

            # Step 3: Create Gold layer with ML features
            df_gold = create_gold_layer()

            # Log pipeline metrics
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()

            logger.info(f"ETL pipeline completed successfully in {duration:.2f} seconds")

            # Create pipeline metrics table
            metrics = spark.createDataFrame([{
                "pipeline_run_id": spark.sparkContext.applicationId,
                "start_time": start_time,
                "end_time": end_time,
                "duration_seconds": duration,
                "bronze_records": df_bronze.count() if df_bronze else 0,
                "silver_records": df_silver.count() if df_silver else 0,
                "gold_records": df_gold.count() if df_gold else 0,
                "status": "SUCCESS"
            }])

            metrics.write \
                .format("delta") \
                .mode("append") \
                .saveAsTable("main.audit.pipeline_metrics")

        else:
            logger.info("No new data to process")

    except Exception as e:
        logger.error(f"ETL pipeline failed: {str(e)}")

        # Log failure
        metrics = spark.createDataFrame([{
            "pipeline_run_id": spark.sparkContext.applicationId,
            "start_time": start_time,
            "end_time": datetime.now(),
            "duration_seconds": (datetime.now() - start_time).total_seconds(),
            "bronze_records": 0,
            "silver_records": 0,
            "gold_records": 0,
            "status": "FAILED",
            "error_message": str(e)
        }])

        metrics.write \
            .format("delta") \
            .mode("append") \
            .saveAsTable("main.audit.pipeline_metrics")

        raise e

# Execute pipeline
if __name__ == "__main__":
    main()
```

### Step 3: Schedule ETL Job in Databricks

```python
# Create Databricks Job via API or UI
# This would typically be done via Databricks UI or REST API

job_config = {
    "name": "Snowflake to Databricks ETL - Transactions",
    "tasks": [
        {
            "task_key": "etl_pipeline",
            "description": "ETL pipeline from Snowflake to Delta Lake",
            "notebook_task": {
                "notebook_path": "/Workspace/ETL/snowflake_to_databricks",
                "base_parameters": {}
            },
            "job_cluster_key": "etl_cluster",
            "timeout_seconds": 3600,
            "max_retries": 2,
            "min_retry_interval_millis": 60000
        }
    ],
    "job_clusters": [
        {
            "job_cluster_key": "etl_cluster",
            "new_cluster": {
                "spark_version": "13.3.x-scala2.12",
                "node_type_id": "i3.xlarge",
                "num_workers": 4,
                "spark_conf": {
                    "spark.databricks.delta.preview.enabled": "true"
                },
                "spark_env_vars": {
                    "PYSPARK_PYTHON": "/databricks/python3/bin/python3"
                }
            }
        }
    ],
    "schedule": {
        "quartz_cron_expression": "0 0 * * * ?",  # Every hour
        "timezone_id": "America/New_York",
        "pause_status": "UNPAUSED"
    },
    "email_notifications": {
        "on_failure": ["data-eng@company.com"],
        "on_success": []
    },
    "timeout_seconds": 7200,
    "max_concurrent_runs": 1
}
```

---

_Continue reading in [Part 2: Anomaly Detection Use Case](./TEAM_STRUCTURE_PART2.md)_
