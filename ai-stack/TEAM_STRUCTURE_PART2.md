# AI/ML Team Structure - Part 2: Anomaly Detection and Unity Catalog

*Continued from [Part 1: Team Structure](./TEAM_STRUCTURE.md)*

## Anomaly Detection Use Case

### Business Context

**Scenario**: A financial services company needs to detect fraudulent transactions in real-time. They have:
- Transaction data stored in Snowflake
- Need to process 10,000+ transactions per second
- Require < 100ms latency for fraud detection
- Must maintain explainability for regulatory compliance

### Complete Implementation

## Step 4: Model Training (Data Scientist)

```python
# Databricks Notebook: Model Training with Unity Catalog
# Data Scientist: Train anomaly detection model

import mlflow
import mlflow.sklearn
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    precision_recall_curve, f1_score, average_precision_score
)
from sklearn.model_selection import train_test_split, cross_val_score
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Set experiment in Unity Catalog
mlflow.set_experiment("/Users/datascience/fraud_detection_v2")

# Enable Unity Catalog for MLflow
mlflow.set_registry_uri("databricks-uc")

# ====================================================================
# Data Loading from Gold Layer
# ====================================================================

print("Loading feature data from Gold layer...")
df_features = spark.read.table("main.gold.transaction_features").toPandas()

print(f"Dataset shape: {df_features.shape}")
print("\nFeatures:")
print(df_features.columns.tolist())

# ====================================================================
# Exploratory Data Analysis
# ====================================================================

# Feature statistics
print("\n=== Feature Statistics ===")
print(df_features.describe())

# Check for missing values
print("\n=== Missing Values ===")
print(df_features.isnull().sum())

# Handle missing values
df_features = df_features.fillna(df_features.median())

# Correlation analysis
plt.figure(figsize=(14, 12))
correlation_matrix = df_features.select_dtypes(include=[np.number]).corr()
sns.heatmap(correlation_matrix, annot=True, fmt='.2f', cmap='coolwarm', center=0)
plt.title('Feature Correlations')
plt.tight_layout()
plt.savefig('/tmp/correlation_matrix.png', dpi=300)
plt.close()

# ====================================================================
# Feature Engineering
# ====================================================================

# Select features for modeling
feature_cols = [
    'total_transactions',
    'total_spend',
    'avg_transaction_amount',
    'stddev_transaction_amount',
    'min_transaction_amount',
    'max_transaction_amount',
    'unique_merchant_categories',
    'unique_merchants',
    'weekend_transactions',
    'high_value_transactions',
    'customer_tenure_days',
    'amount_volatility',
    'max_to_avg_ratio',
    'weekend_transaction_rate',
    'high_value_transaction_rate',
    'avg_transactions_per_day'
]

X = df_features[feature_cols]
customer_ids = df_features['customer_id']

print(f"\n=== Training with {len(feature_cols)} features ===")

# ====================================================================
# Model Training with MLflow
# ====================================================================

with mlflow.start_run(run_name=f"fraud_detection_{datetime.now().strftime('%Y%m%d_%H%M%S')}") as run:

    # Log parameters
    mlflow.log_param("features", feature_cols)
    mlflow.log_param("n_features", len(feature_cols))
    mlflow.log_param("training_samples", len(X))

    # Model hyperparameters
    contamination = 0.01  # Expected fraud rate (1%)
    n_estimators = 200
    max_samples = 'auto'
    random_state = 42

    mlflow.log_param("contamination", contamination)
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_samples", max_samples)
    mlflow.log_param("random_state", random_state)

    # ================================================================
    # Approach 1: Unsupervised - Isolation Forest
    # ================================================================

    print("\n=== Training Isolation Forest (Unsupervised) ===")

    # Feature scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train Isolation Forest
    iso_forest = IsolationForest(
        contamination=contamination,
        n_estimators=n_estimators,
        max_samples=max_samples,
        random_state=random_state,
        n_jobs=-1,
        verbose=1
    )

    iso_forest.fit(X_scaled)

    # Predictions
    predictions = iso_forest.predict(X_scaled)  # -1 for anomaly, 1 for normal
    anomaly_scores = iso_forest.score_samples(X_scaled)

    # Convert to binary labels (1 for anomaly, 0 for normal)
    predictions_binary = (predictions == -1).astype(int)

    # Metrics
    n_anomalies = predictions_binary.sum()
    anomaly_rate = n_anomalies / len(predictions_binary)

    print(f"Detected anomalies: {n_anomalies} ({anomaly_rate*100:.2f}%)")

    mlflow.log_metric("n_anomalies_detected", n_anomalies)
    mlflow.log_metric("anomaly_rate", anomaly_rate)

    # ================================================================
    # Visualizations
    # ================================================================

    # 1. Anomaly Score Distribution
    plt.figure(figsize=(12, 6))
    plt.hist(anomaly_scores, bins=50, alpha=0.7, edgecolor='black')
    plt.axvline(x=np.percentile(anomaly_scores, contamination * 100),
                color='red', linestyle='--', linewidth=2,
                label=f'{contamination*100}th percentile (threshold)')
    plt.xlabel('Anomaly Score', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.title('Distribution of Anomaly Scores', fontsize=14, fontweight='bold')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('/tmp/anomaly_score_distribution.png', dpi=300)
    plt.close()

    # 2. Feature Importance (based on variance explained)
    feature_importance = np.var(X_scaled, axis=0)
    feature_importance_df = pd.DataFrame({
        'feature': feature_cols,
        'importance': feature_importance
    }).sort_values('importance', ascending=False)

    plt.figure(figsize=(12, 8))
    plt.barh(feature_importance_df['feature'], feature_importance_df['importance'])
    plt.xlabel('Variance (Importance)', fontsize=12)
    plt.title('Feature Importance for Anomaly Detection', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig('/tmp/feature_importance.png', dpi=300)
    plt.close()

    # 3. Top Anomalies Analysis
    df_results = df_features.copy()
    df_results['anomaly_score'] = anomaly_scores
    df_results['is_anomaly'] = predictions_binary

    top_anomalies = df_results.nlargest(20, 'is_anomaly')[
        ['customer_id'] + feature_cols + ['anomaly_score', 'is_anomaly']
    ]

    print("\n=== Top 20 Anomalies ===")
    print(top_anomalies)

    # 4. Anomaly vs Normal Comparison
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    fig.suptitle('Anomalous vs Normal Customer Behavior', fontsize=16, fontweight='bold')

    comparison_features = [
        'total_spend',
        'avg_transaction_amount',
        'amount_volatility',
        'max_to_avg_ratio',
        'avg_transactions_per_day',
        'unique_merchant_categories'
    ]

    for idx, feature in enumerate(comparison_features):
        ax = axes[idx // 3, idx % 3]

        normal_data = df_results[df_results['is_anomaly'] == 0][feature]
        anomaly_data = df_results[df_results['is_anomaly'] == 1][feature]

        ax.hist(normal_data, bins=30, alpha=0.6, label='Normal', color='blue')
        ax.hist(anomaly_data, bins=30, alpha=0.6, label='Anomaly', color='red')

        ax.set_xlabel(feature, fontsize=10)
        ax.set_ylabel('Frequency', fontsize=10)
        ax.legend()
        ax.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('/tmp/anomaly_vs_normal_comparison.png', dpi=300)
    plt.close()

    # Log artifacts
    mlflow.log_artifact('/tmp/correlation_matrix.png')
    mlflow.log_artifact('/tmp/anomaly_score_distribution.png')
    mlflow.log_artifact('/tmp/feature_importance.png')
    mlflow.log_artifact('/tmp/anomaly_vs_normal_comparison.png')

    # Save top anomalies for review
    top_anomalies.to_csv('/tmp/top_anomalies_for_review.csv', index=False)
    mlflow.log_artifact('/tmp/top_anomalies_for_review.csv')

    # ================================================================
    # Model Evaluation (if ground truth labels available)
    # ================================================================

    # Load transactions with fraud labels for evaluation
    df_transactions = spark.read.table("main.silver.transactions_cleaned").toPandas()

    # Get ground truth labels
    fraud_customers = df_transactions[df_transactions['is_fraud'] == True]['customer_id'].unique()
    df_results['true_fraud'] = df_results['customer_id'].isin(fraud_customers).astype(int)

    if df_results['true_fraud'].sum() > 0:
        print("\n=== Model Evaluation with Ground Truth ===")

        # Calculate metrics
        from sklearn.metrics import (
            accuracy_score, precision_score, recall_score,
            f1_score, roc_auc_score, classification_report
        )

        accuracy = accuracy_score(df_results['true_fraud'], df_results['is_anomaly'])
        precision = precision_score(df_results['true_fraud'], df_results['is_anomaly'])
        recall = recall_score(df_results['true_fraud'], df_results['is_anomaly'])
        f1 = f1_score(df_results['true_fraud'], df_results['is_anomaly'])
        auc_roc = roc_auc_score(df_results['true_fraud'], -anomaly_scores)  # Negative because lower scores = more anomalous

        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1 Score: {f1:.4f}")
        print(f"AUC-ROC: {auc_roc:.4f}")

        # Log metrics
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall", recall)
        mlflow.log_metric("f1_score", f1)
        mlflow.log_metric("auc_roc", auc_roc)

        # Confusion Matrix
        from sklearn.metrics import confusion_matrix
        import seaborn as sns

        cm = confusion_matrix(df_results['true_fraud'], df_results['is_anomaly'])

        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=['Normal', 'Fraud'],
                   yticklabels=['Normal', 'Fraud'])
        plt.xlabel('Predicted', fontsize=12)
        plt.ylabel('Actual', fontsize=12)
        plt.title('Confusion Matrix', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig('/tmp/confusion_matrix.png', dpi=300)
        mlflow.log_artifact('/tmp/confusion_matrix.png')
        plt.close()

        # Classification Report
        report = classification_report(df_results['true_fraud'], df_results['is_anomaly'])
        print("\n=== Classification Report ===")
        print(report)

        # Save report
        with open('/tmp/classification_report.txt', 'w') as f:
            f.write(report)
        mlflow.log_artifact('/tmp/classification_report.txt')

    # ================================================================
    # Register Model in Unity Catalog
    # ================================================================

    print("\n=== Registering Model in Unity Catalog ===")

    # Log model
    model_info = mlflow.sklearn.log_model(
        iso_forest,
        "model",
        registered_model_name="main.ml_models.fraud_detection_isolation_forest",
        signature=mlflow.models.infer_signature(X, predictions_binary)
    )

    # Log scaler separately
    mlflow.sklearn.log_model(
        scaler,
        "scaler",
        signature=mlflow.models.infer_signature(X, X_scaled)
    )

    print(f"\n=== Training Complete ===")
    print(f"Run ID: {run.info.run_id}")
    print(f"Model URI: {model_info.model_uri}")
    print(f"Model registered in Unity Catalog: main.ml_models.fraud_detection_isolation_forest")

# ====================================================================
# Model Comparison: Supervised Approach (if labels available)
# ====================================================================

if df_results['true_fraud'].sum() > 100:  # Need sufficient fraud examples
    print("\n=== Training Supervised Model (Random Forest) ===")

    with mlflow.start_run(run_name=f"fraud_detection_supervised_{datetime.now().strftime('%Y%m%d_%H%M%S')}") as run:

        # Prepare training data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, df_results['true_fraud'],
            test_size=0.2,
            random_state=42,
            stratify=df_results['true_fraud']
        )

        # Handle class imbalance
        from imblearn.over_sampling import SMOTE
        smote = SMOTE(random_state=42)
        X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

        print(f"Original training set: {len(y_train)} samples")
        print(f"Balanced training set: {len(y_train_balanced)} samples")

        mlflow.log_param("train_samples_original", len(y_train))
        mlflow.log_param("train_samples_balanced", len(y_train_balanced))

        # Train Random Forest
        rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=10,
            min_samples_leaf=5,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1,
            verbose=1
        )

        rf_model.fit(X_train_balanced, y_train_balanced)

        # Predictions
        y_pred = rf_model.predict(X_test)
        y_pred_proba = rf_model.predict_proba(X_test)[:, 1]

        # Metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc_roc = roc_auc_score(y_test, y_pred_proba)
        avg_precision = average_precision_score(y_test, y_pred_proba)

        print(f"\n=== Supervised Model Results ===")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1 Score: {f1:.4f}")
        print(f"AUC-ROC: {auc_roc:.4f}")
        print(f"Average Precision: {avg_precision:.4f}")

        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall", recall)
        mlflow.log_metric("f1_score", f1)
        mlflow.log_metric("auc_roc", auc_roc)
        mlflow.log_metric("avg_precision", avg_precision)

        # Feature importance
        feature_importance_rf = pd.DataFrame({
            'feature': feature_cols,
            'importance': rf_model.feature_importances_
        }).sort_values('importance', ascending=False)

        plt.figure(figsize=(12, 8))
        plt.barh(feature_importance_rf['feature'], feature_importance_rf['importance'])
        plt.xlabel('Importance', fontsize=12)
        plt.title('Random Forest Feature Importance', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig('/tmp/rf_feature_importance.png', dpi=300)
        mlflow.log_artifact('/tmp/rf_feature_importance.png')
        plt.close()

        # Register supervised model
        mlflow.sklearn.log_model(
            rf_model,
            "model",
            registered_model_name="main.ml_models.fraud_detection_random_forest",
            signature=mlflow.models.infer_signature(X_train_balanced, y_train_balanced)
        )

        print(f"Supervised model registered in Unity Catalog: main.ml_models.fraud_detection_random_forest")
```

---

## Unity Catalog: Data Governance

### What is Unity Catalog?

Unity Catalog is Databricks' unified governance solution for data and AI assets. It provides:
- **Centralized Metadata**: Single source of truth for all data assets
- **Fine-grained Access Control**: Row, column, and table-level security
- **Data Lineage**: Track data flow from source to model
- **Model Registry**: Versioning and governance for ML models
- **Audit Logging**: Complete audit trail for compliance

### Unity Catalog Structure

```
Unity Catalog Hierarchy:

Catalog (e.g., "main")
  ↓
Schema/Database (e.g., "bronze", "silver", "gold", "ml_models")
  ↓
Tables/Views/Models (e.g., "transactions_raw", "fraud_detection_model")
```

### Setting Up Unity Catalog

```sql
-- ====================================================================
-- Unity Catalog Setup (Data Engineer / Admin)
-- ====================================================================

-- Create catalog
CREATE CATALOG IF NOT EXISTS main;
USE CATALOG main;

-- Create schemas for medallion architecture
CREATE SCHEMA IF NOT EXISTS bronze
  COMMENT 'Raw data from source systems';

CREATE SCHEMA IF NOT EXISTS silver
  COMMENT 'Cleaned and validated data';

CREATE SCHEMA IF NOT EXISTS gold
  COMMENT 'Business-level aggregated data and ML features';

CREATE SCHEMA IF NOT EXISTS ml_models
  COMMENT 'ML models and artifacts';

CREATE SCHEMA IF NOT EXISTS audit
  COMMENT 'Audit and monitoring tables';

-- ====================================================================
-- Access Control
-- ====================================================================

-- Grant data engineers full access to bronze and silver
GRANT ALL PRIVILEGES ON SCHEMA main.bronze TO `data-engineers`;
GRANT ALL PRIVILEGES ON SCHEMA main.silver TO `data-engineers`;

-- Grant data scientists read access to silver and full access to gold
GRANT SELECT ON SCHEMA main.silver TO `data-scientists`;
GRANT ALL PRIVILEGES ON SCHEMA main.gold TO `data-scientists`;
GRANT ALL PRIVILEGES ON SCHEMA main.ml_models TO `data-scientists`;

-- Grant ML engineers read access to gold and full access to ml_models
GRANT SELECT ON SCHEMA main.gold TO `ml-engineers`;
GRANT ALL PRIVILEGES ON SCHEMA main.ml_models TO `ml-engineers`;

-- ====================================================================
-- Row-level Security Example
-- ====================================================================

-- Restrict data scientists to only see non-PII data
CREATE OR REPLACE VIEW main.silver.transactions_cleaned_no_pii AS
SELECT
    transaction_id,
    customer_id,  -- Hashed
    merchant_id,
    transaction_timestamp,
    amount,
    currency,
    transaction_type,
    merchant_category,
    NULL as device_id,  -- PII removed
    NULL as ip_address,  -- PII removed
    is_fraud
FROM main.silver.transactions_cleaned;

GRANT SELECT ON VIEW main.silver.transactions_cleaned_no_pii TO `data-scientists`;

-- ====================================================================
-- Column-level Security with Masking
-- ====================================================================

-- Create masking function for PII
CREATE FUNCTION main.silver.mask_email(email STRING)
  RETURNS STRING
  RETURN regexp_replace(email, '(.{2}).*(@.*)', '$1***$2');

-- Apply masking in view
CREATE OR REPLACE VIEW main.silver.customers_masked AS
SELECT
    customer_id,
    main.silver.mask_email(email) as email,
    city,
    state,
    country,
    created_date
FROM main.silver.customers;

-- ====================================================================
-- Data Lineage Tracking
-- ====================================================================

-- Unity Catalog automatically tracks lineage
-- View lineage in Databricks UI or query via API

-- Example: Query table metadata
DESCRIBE EXTENDED main.gold.transaction_features;

-- Show table history (Delta Lake time travel)
DESCRIBE HISTORY main.gold.transaction_features;

-- ====================================================================
-- Model Registration in Unity Catalog
-- ====================================================================

-- Models are registered via MLflow with UC integration
-- See Python code examples above

-- Query registered models
SELECT * FROM system.ml.models
WHERE catalog_name = 'main'
  AND schema_name = 'ml_models';

-- View model versions
SELECT * FROM system.ml.model_versions
WHERE model_name = 'main.ml_models.fraud_detection_isolation_forest';
```

### Model Lifecycle Management with Unity Catalog

```python
# Databricks Notebook: Model Lifecycle Management

import mlflow
from mlflow.tracking import MlflowClient

# Initialize MLflow client with Unity Catalog
mlflow.set_registry_uri("databricks-uc")
client = MlflowClient()

# ====================================================================
# Model Versioning and Promotion
# ====================================================================

model_name = "main.ml_models.fraud_detection_isolation_forest"

# Get all versions of the model
versions = client.search_model_versions(f"name='{model_name}'")

print(f"Found {len(versions)} versions of {model_name}")
for version in versions:
    print(f"\nVersion: {version.version}")
    print(f"Stage: {version.current_stage}")
    print(f"Run ID: {version.run_id}")
    print(f"Creation Time: {version.creation_timestamp}")

# ====================================================================
# Promote Model to Production
# ====================================================================

def promote_model_to_production(model_name, version, require_approval=True):
    """
    Promote model version to production
    """

    # Get model version details
    model_version = client.get_model_version(model_name, version)

    print(f"Promoting {model_name} version {version} to Production...")

    # Run validation checks before promotion
    print("Running pre-production validation...")

    # 1. Check model metrics
    run = client.get_run(model_version.run_id)
    metrics = run.data.metrics

    # Define thresholds
    required_metrics = {
        'precision': 0.85,
        'recall': 0.80,
        'f1_score': 0.82
    }

    validation_passed = True
    for metric_name, threshold in required_metrics.items():
        metric_value = metrics.get(metric_name, 0)
        passed = metric_value >= threshold

        print(f"  {metric_name}: {metric_value:.4f} (threshold: {threshold}) - {'✓ PASS' if passed else '✗ FAIL'}")

        if not passed:
            validation_passed = False

    if not validation_passed:
        print("\n❌ Validation failed. Model not promoted.")
        return False

    # 2. Check for required artifacts
    artifacts = client.list_artifacts(model_version.run_id)
    required_artifacts = ['model', 'scaler', 'classification_report.txt']

    for artifact in required_artifacts:
        if not any(a.path == artifact for a in artifacts):
            print(f"  ❌ Missing required artifact: {artifact}")
            validation_passed = False

    if not validation_passed:
        print("\n❌ Validation failed. Model not promoted.")
        return False

    # 3. Archive current production model (if exists)
    production_versions = [v for v in versions if v.current_stage == "Production"]
    for prod_version in production_versions:
        print(f"Archiving current production version {prod_version.version}...")
        client.transition_model_version_stage(
            name=model_name,
            version=prod_version.version,
            stage="Archived",
            archive_existing_versions=False
        )

    # 4. Promote new version to production
    client.transition_model_version_stage(
        name=model_name,
        version=version,
        stage="Production",
        archive_existing_versions=False
    )

    # 5. Add description
    client.update_model_version(
        name=model_name,
        version=version,
        description=f"Promoted to production on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )

    print(f"\n✅ Model version {version} successfully promoted to Production!")

    return True

# Example: Promote version 3 to production
promote_model_to_production(model_name, version="3")

# ====================================================================
# Model Serving Configuration
# ====================================================================

# Load model from Unity Catalog
model_uri = f"models:/{model_name}/Production"
model = mlflow.sklearn.load_model(model_uri)

print(f"Loaded model from: {model_uri}")

# ====================================================================
# Monitor Model Performance
# ====================================================================

def monitor_model_performance(model_name, days=7):
    """
    Monitor model performance over time
    """
    from datetime import datetime, timedelta

    # Get production model version
    production_versions = [v for v in client.search_model_versions(f"name='{model_name}'")
                          if v.current_stage == "Production"]

    if not production_versions:
        print(f"No production version found for {model_name}")
        return

    prod_version = production_versions[0]
    print(f"Monitoring model: {model_name} (version {prod_version.version})")

    # Query predictions from production
    predictions_df = spark.sql(f"""
        SELECT
            prediction_timestamp,
            is_anomaly,
            confidence,
            COUNT(*) as prediction_count
        FROM main.audit.model_predictions
        WHERE model_name = '{model_name}'
          AND model_version = '{prod_version.version}'
          AND prediction_timestamp >= date_sub(current_date(), {days})
        GROUP BY prediction_timestamp, is_anomaly, confidence
        ORDER BY prediction_timestamp DESC
    """).toPandas()

    # Calculate metrics
    total_predictions = predictions_df['prediction_count'].sum()
    anomaly_rate = predictions_df[predictions_df['is_anomaly'] == True]['prediction_count'].sum() / total_predictions

    print(f"\n=== Performance Summary (Last {days} days) ===")
    print(f"Total Predictions: {total_predictions:,}")
    print(f"Anomaly Rate: {anomaly_rate*100:.2f}%")
    print(f"Avg Confidence: {predictions_df['confidence'].mean():.4f}")

    # Plot prediction volume over time
    import matplotlib.pyplot as plt

    plt.figure(figsize=(12, 6))
    plt.plot(predictions_df['prediction_timestamp'], predictions_df['prediction_count'])
    plt.xlabel('Date')
    plt.ylabel('Prediction Count')
    plt.title(f'{model_name} - Prediction Volume (Last {days} days)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'/tmp/model_prediction_volume_{days}d.png')
    plt.close()

    return predictions_df

# Monitor performance
performance_df = monitor_model_performance(model_name, days=7)
```

---

## Team Collaboration Patterns

### Daily Workflow Example

#### Morning Standup

**Data Engineer**:
- "I completed the ETL pipeline from Snowflake yesterday. Bronze and Silver layers are updated hourly."
- "Today I'll add data quality checks for the new merchant_category field."

**Data Scientist**:
- "I trained the new anomaly detection model with 95% precision. Will work on improving recall today."
- "Blocked: Need access to customer demographic data for feature engineering."

**ML Engineer**:
- "Deployed model v2 to staging environment. Latency is 45ms (below 50ms target)."
- "Today I'll set up A/B testing framework to compare v1 vs v2 in production."

#### Weekly Sprint Planning

**Objective**: Improve fraud detection recall from 80% to 90%

**Data Engineer Tasks**:
1. Add streaming pipeline for real-time transaction features
2. Implement feature store for reusable features
3. Set up data quality monitoring with Great Expectations

**Data Scientist Tasks**:
1. Research and experiment with ensemble methods
2. Feature engineering: add time-series patterns
3. Perform error analysis on false negatives

**ML Engineer Tasks**:
1. Implement online learning pipeline for model updates
2. Set up canary deployment for model v3
3. Build drift detection monitoring

### Communication Patterns

```
┌────────────────────────────────────────────────────────────────┐
│                    Communication Channels                       │
└────────────────────────────────────────────────────────────────┘

Daily:
- Slack #ml-team channel for quick questions
- Stand-up meetings (15 min)

Weekly:
- Sprint planning (1 hour)
- Model review sessions (30 min)
- Technical deep-dive (1 hour)

Monthly:
- Architecture review
- Retrospective
- Stakeholder demos

Documentation:
- Confluence for design docs
- Databricks notebooks for experiments
- GitHub for code reviews
- JIRA for task tracking
```

### Collaboration Tools

#### 1. Shared Notebooks

```python
# Databricks Notebook: Shared Experimentation
# This notebook is accessible to all team members

# ====================================================================
# SECTION 1: Data Validation (Data Engineer)
# ====================================================================

# Data Engineer maintains this section
def validate_data_quality():
    """
    Run data quality checks before training
    """
    # Implementation
    pass

# ====================================================================
# SECTION 2: Feature Engineering (Data Scientist)
# ====================================================================

# Data Scientist experiments with features here
def create_features():
    """
    Feature engineering logic
    """
    # Implementation
    pass

# ====================================================================
# SECTION 3: Model Training (Data Scientist)
# ====================================================================

# Data Scientist trains models here
def train_model():
    """
    Model training logic
    """
    # Implementation
    pass

# ====================================================================
# SECTION 4: Production Code (ML Engineer)
# ====================================================================

# ML Engineer converts notebook to production code
# See: /Repos/production/fraud_detection/train.py
```

#### 2. Feature Store

```python
# Shared Feature Store (All teams collaborate)

from databricks import feature_store
from databricks.feature_store import FeatureStoreClient

fs = FeatureStoreClient()

# Data Engineer: Create feature table
fs.create_table(
    name="main.gold.customer_transaction_features",
    primary_keys=["customer_id"],
    df=customer_features_df,
    schema=customer_features_df.schema,
    description="Customer transaction features for fraud detection"
)

# Data Scientist: Use features for training
training_set = fs.create_training_set(
    df=labels_df,
    feature_lookups=[
        FeatureLookup(
            table_name="main.gold.customer_transaction_features",
            feature_names=["avg_transaction_amount", "amount_volatility"],
            lookup_key="customer_id"
        )
    ],
    label="is_fraud"
)

training_df = training_set.load_df()

# ML Engineer: Use features for inference
features = fs.read_table(name="main.gold.customer_transaction_features")
```

---

*Continue reading in [Part 3: Real-World Examples](./TEAM_STRUCTURE_PART3.md)*
