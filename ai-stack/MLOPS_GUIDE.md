# MLOps Deep Dive: From Development to Production

> **Repository Philosophy**: This guide follows the principle of **simple code with detailed explanations**. Code examples are reference implementations, not production-ready. Focus on understanding concepts, best practices for safety, quality, and logging.

## 📋 Table of Contents

1. [Introduction to MLOps](#introduction-to-mlops)
2. [Best Practices: Safety, Quality & Logging](#best-practices-safety-quality--logging)
3. [CI/CD for ML Pipelines](#cicd-for-ml-pipelines)
4. [Model Versioning Strategies](#model-versioning-strategies)
5. [Feature Store Patterns](#feature-store-patterns)
6. [Model Monitoring and Observability](#model-monitoring-and-observability)
7. [A/B Testing for ML Models](#ab-testing-for-ml-models)
8. [Model Deployment Strategies](#model-deployment-strategies)
9. [Cost Optimization](#cost-optimization)

---

## Introduction to MLOps

### What is MLOps?

**MLOps** (Machine Learning Operations) is a set of practices that combines Machine Learning, DevOps, and Data Engineering to deploy and maintain ML systems in production reliably and efficiently.

```
┌─────────────────────────────────────────────────────────────┐
│                    MLOps Lifecycle                           │
└─────────────────────────────────────────────────────────────┘

1. DATA              2. DEVELOPMENT      3. DEPLOYMENT
┌──────────┐        ┌──────────┐        ┌──────────┐
│ Collect  │───────▶│  Train   │───────▶│  Deploy  │
│ Validate │        │ Evaluate │        │  Serve   │
│  Store   │        │ Version  │        │ Monitor  │
└──────────┘        └──────────┘        └──────────┘
     │                    │                    │
     └────────────────────┴────────────────────┘
                         │
                    ┌────▼─────┐
                    │ Retrain  │
                    │  Loop    │
                    └──────────┘
```

### MLOps Maturity Model

```python
# Level 0: Manual process
# - Manual data analysis
# - Manual model training
# - Manual deployment

# Level 1: ML pipeline automation
# - Automated training pipeline
# - Experiment tracking
# - Model registry

# Level 2: CI/CD pipeline automation
# - Automated testing
# - Automated deployment
# - Version control

# Level 3: Full MLOps automation
# - Automated monitoring
# - Automated retraining
# - Feature store
# - A/B testing
```

---

## Best Practices: Safety, Quality & Logging

### 🛡️ MLOps Safety & Security

#### 1. **Model Governance**
- **Model Registry Access Control**: Restrict who can promote models to production
- **Approval Gates**: Require human approval before production deployment
- **Model Lineage**: Track data, code, and config used to create each model
- **Audit Trails**: Log all model deployments, rollbacks, and changes

```python
# Simple model registry with approval workflow
import mlflow

# Register model with metadata
mlflow.register_model(
    model_uri="runs:/abc123/model",
    name="fraud_detector",
    tags={
        "data_version": "v2.1",
        "approver": "data-science-lead",
        "compliance_check": "passed"
    }
)
```

**Use Cases**:
- Financial services: SOX compliance for model changes
- Healthcare: FDA-regulated medical device software
- Insurance: Model risk management (SR 11-7)
- Government: NIST AI Risk Management Framework

#### 2. **Secure ML Pipeline**
- **Secrets Management**: Never hardcode credentials in code
- **Encrypted Communication**: TLS for all API calls
- **Container Security**: Scan images for vulnerabilities
- **Network Isolation**: VPC/private subnets for training jobs

```python
# Simple secrets management
import os
from azure.keyvault.secrets import SecretClient

# Never hardcode - use environment variables or secret managers
db_password = os.environ.get('DB_PASSWORD')
api_key = secret_client.get_secret("openai-api-key").value
```

**Use Cases**:
- Multi-tenant SaaS: Isolate customer data during training
- Banking: PCI DSS compliance for payment data
- Healthcare: PHI protection in ML pipelines
- E-commerce: Customer PII in recommendation systems

#### 3. **Model Safety & Validation**
- **Input Validation**: Sanitize inputs before inference
- **Output Constraints**: Ensure predictions are within valid ranges
- **Failover Mechanisms**: Fallback to previous model version on errors
- **Rate Limiting**: Prevent abuse and model extraction

```python
# Simple input validation
def validate_input(features):
    assert all(isinstance(v, (int, float)) for v in features.values())
    assert all(v >= 0 for v in features.values())
    assert len(features) == expected_feature_count
    return True

def predict_with_fallback(features, primary_model, fallback_model):
    try:
        if validate_input(features):
            return primary_model.predict(features)
    except Exception as e:
        logger.error(f"Primary model failed: {e}")
        return fallback_model.predict(features)
```

**Use Cases**:
- Autonomous vehicles: Safety-critical prediction validation
- Medical diagnosis: Confidence thresholds for clinical use
- Trading systems: Prevent erroneous orders
- Content moderation: Fallback for edge cases

### ✅ MLOps Quality Assurance

#### 1. **Automated Testing in CI/CD**
- **Unit Tests**: Test feature transformations, preprocessing
- **Integration Tests**: Test entire pipeline end-to-end
- **Model Tests**: Validate model behavior on test sets
- **Performance Tests**: Ensure inference latency SLAs

```python
# Simple model validation in CI/CD
def test_model_accuracy():
    model = load_model_from_registry("fraud_detector", version="latest")
    test_data = load_test_data()

    predictions = model.predict(test_data.features)
    accuracy = (predictions == test_data.labels).mean()

    assert accuracy > 0.85, f"Model accuracy {accuracy} below threshold"

def test_model_latency():
    model = load_model()
    sample = generate_sample_input()

    import time
    start = time.time()
    model.predict(sample)
    latency = time.time() - start

    assert latency < 0.1, f"Latency {latency}s exceeds 100ms SLA"
```

**Use Cases**:
- Real-time serving: Validate p95 latency < 100ms
- Batch inference: Ensure throughput meets SLA
- Model updates: Regression testing on golden dataset
- A/B testing: Statistical significance validation

#### 2. **Model Validation Gates**
- **Minimum Performance**: Require accuracy/F1 thresholds before deployment
- **Fairness Checks**: Validate performance across demographic groups
- **Drift Detection**: Compare training vs validation distributions
- **Business Metrics**: Ensure model improves KPIs

```python
# Simple validation gate
def validate_model_for_production(model, validation_data):
    checks = {
        'accuracy': model.score(validation_data.X, validation_data.y) > 0.85,
        'fairness': check_fairness_across_groups(model, validation_data),
        'drift': check_data_drift(training_data, validation_data) < 0.1,
        'latency': measure_latency(model) < 0.1
    }

    if all(checks.values()):
        promote_to_production(model)
    else:
        raise ValueError(f"Validation failed: {checks}")
```

**Use Cases**:
- Credit scoring: Fair lending compliance checks
- Hiring tools: Bias detection across demographics
- Healthcare: Clinical validation requirements
- Advertising: Brand safety validation

#### 3. **Data Quality in MLOps**
- **Schema Validation**: Detect unexpected data changes
- **Distribution Monitoring**: Track feature distributions over time
- **Outlier Detection**: Flag anomalous training data
- **Completeness Checks**: Ensure no missing required features

```python
# Simple data quality monitoring
from great_expectations.dataset import PandasDataset

def validate_training_data(df):
    ge_df = PandasDataset(df)

    # Schema checks
    ge_df.expect_table_columns_to_match_ordered_list(expected_columns)

    # Distribution checks
    for col in numeric_columns:
        ge_df.expect_column_mean_to_be_between(col, min_value=stats[col]['min'], max_value=stats[col]['max'])

    # Completeness
    ge_df.expect_column_values_to_not_be_null('customer_id')

    results = ge_df.validate()
    if not results.success:
        alert_data_quality_team(results)
```

**Use Cases**:
- Feature stores: Validate features before materialization
- Training pipelines: Prevent bad data from reaching models
- Streaming inference: Real-time data quality monitoring
- Data warehouses: Schema evolution detection

### 📊 MLOps Logging & Observability

#### 1. **Experiment Tracking**
- **Hyperparameters**: Log all config used for each experiment
- **Metrics**: Track training/validation metrics over time
- **Artifacts**: Store models, plots, feature importance
- **Reproducibility**: Capture environment, dependencies, data versions

```python
# Simple experiment tracking with MLflow
import mlflow

mlflow.set_experiment("fraud-detection")

with mlflow.start_run():
    # Log hyperparameters
    mlflow.log_params({
        "n_estimators": 100,
        "max_depth": 10,
        "learning_rate": 0.01
    })

    # Train model
    model = train_model(X_train, y_train, **params)

    # Log metrics
    mlflow.log_metrics({
        "train_accuracy": train_acc,
        "val_accuracy": val_acc,
        "val_f1": val_f1
    })

    # Log model
    mlflow.sklearn.log_model(model, "model")

    # Log artifacts
    mlflow.log_artifact("feature_importance.png")
```

**Use Cases**:
- Research teams: Compare hundreds of experiments
- Model selection: Track performance across algorithms
- Hyperparameter tuning: Log all trial configurations
- Compliance: Audit trail for model decisions

#### 2. **Production Monitoring**
- **Prediction Logging**: Store inputs, outputs, and metadata
- **Performance Metrics**: Track accuracy, latency, throughput
- **Error Tracking**: Monitor and alert on prediction failures
- **Resource Usage**: CPU, memory, GPU utilization

```python
# Simple production monitoring
from prometheus_client import Counter, Histogram, Gauge
import logging

prediction_count = Counter('ml_predictions_total', 'Total predictions', ['model_version'])
prediction_latency = Histogram('ml_prediction_latency_seconds', 'Prediction latency')
model_accuracy = Gauge('ml_model_accuracy', 'Current model accuracy')

logger = logging.getLogger(__name__)

@prediction_latency.time()
def predict_with_monitoring(features, model_version):
    try:
        prediction = model.predict(features)
        prediction_count.labels(model_version=model_version).inc()

        # Structured logging
        logger.info({
            'model_version': model_version,
            'features': features,
            'prediction': prediction,
            'timestamp': time.time()
        })

        return prediction
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        alert_on_call_team(e)
        raise
```

**Use Cases**:
- SLA monitoring: Track p50, p95, p99 latencies
- Cost optimization: Monitor inference costs
- Debugging: Trace failed predictions
- Capacity planning: Resource utilization trends

#### 3. **Model Drift Detection**
- **Data Drift**: Monitor input feature distributions
- **Concept Drift**: Track model performance over time
- **Prediction Drift**: Detect unusual prediction patterns
- **Automated Alerts**: Trigger retraining when drift detected

```python
# Simple drift detection
from scipy.stats import ks_2samp

def monitor_data_drift(reference_data, current_data, features):
    drift_detected = {}

    for feature in features:
        # Kolmogorov-Smirnov test
        statistic, p_value = ks_2samp(
            reference_data[feature],
            current_data[feature]
        )

        drift_detected[feature] = p_value < 0.05

    if any(drift_detected.values()):
        logger.warning(f"Data drift detected: {drift_detected}")
        trigger_retraining_pipeline()

    return drift_detected
```

**Use Cases**:
- Seasonal models: Detect distribution changes over time
- Fraud detection: Adapt to evolving fraud patterns
- Recommendation systems: Capture user behavior shifts
- NLP models: Detect language/vocabulary changes

### 🎯 MLOps Use Cases Summary

**Safety & Security**:
- Banking: Model risk management and SOX compliance
- Healthcare: FDA software validation and PHI protection
- Insurance: Actuarial model governance (SR 11-7)
- Government: NIST AI RMF compliance
- Fintech: PCI DSS for payment ML systems
- Autonomous systems: Safety-critical validation
- Defense: Secure ML for classified data
- Telecommunications: Customer data protection

**Quality Assurance**:
- E-commerce: A/B testing for recommendation quality
- Advertising: Click-through rate validation
- Search engines: Relevance metric validation
- Social media: Content quality gates
- Gaming: Player experience validation
- Streaming: Content recommendation quality
- Ride-sharing: ETA prediction accuracy
- Food delivery: Delivery time prediction accuracy

**Logging & Observability**:
- Multi-tenant SaaS: Per-customer model performance
- IoT: Edge device model monitoring at scale
- Mobile apps: Device-specific model behavior
- Web applications: User-facing model latency
- Microservices: Distributed tracing for ML pipelines
- Serverless: Cold start impact on inference
- Kubernetes: Pod-level resource monitoring
- Cloud platforms: Multi-region model performance

---

## CI/CD for ML Pipelines

### Complete CI/CD Pipeline

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Data Validation
  data-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          pip install great-expectations pandas

      - name: Validate data quality
        run: |
          python scripts/validate_data.py

      - name: Upload validation report
        uses: actions/upload-artifact@v3
        with:
          name: data-validation-report
          path: reports/data_validation.html

  # Job 2: Model Training
  model-training:
    needs: data-validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Train model
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}
        run: |
          python src/train.py

      - name: Evaluate model
        run: |
          python src/evaluate.py

      - name: Check model metrics
        run: |
          python scripts/check_metrics.py --min-f1 0.85

  # Job 3: Model Testing
  model-testing:
    needs: model-training
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt pytest

      - name: Run unit tests
        run: |
          pytest tests/unit/ -v

      - name: Run integration tests
        run: |
          pytest tests/integration/ -v

      - name: Run model behavior tests
        run: |
          pytest tests/model_behavior/ -v

  # Job 4: Build and Push Docker Image
  build-docker:
    needs: model-testing
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.REGISTRY_URL }}/ml-model:latest
            ${{ secrets.REGISTRY_URL }}/ml-model:${{ github.sha }}

  # Job 5: Deploy to Staging
  deploy-staging:
    needs: build-docker
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/ml-model \
            ml-model=${{ secrets.REGISTRY_URL }}/ml-model:${{ github.sha }} \
            -n staging

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/ml-model -n staging

      - name: Run smoke tests
        run: |
          python tests/smoke_tests.py --env staging

  # Job 6: Deploy to Production (with approval)
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/ml-model \
            ml-model=${{ secrets.REGISTRY_URL }}/ml-model:${{ github.sha }} \
            -n production

      - name: Monitor deployment
        run: |
          python scripts/monitor_deployment.py --duration 300
```

### Data Validation Script

```python
# scripts/validate_data.py
import great_expectations as ge
import pandas as pd
import sys

def validate_training_data():
    """
    Validate data quality before training
    """
    # Load data
    df = pd.read_csv('data/training_data.csv')

    # Create Great Expectations dataset
    gx_df = ge.from_pandas(df)

    # Define expectations
    expectations = {
        'columns_exist': ['feature1', 'feature2', 'target'],
        'no_nulls': ['target'],
        'value_ranges': {
            'feature1': (0, 100),
            'feature2': (-10, 10)
        },
        'unique_values': {
            'target': [0, 1]
        }
    }

    # Validate schema
    for col in expectations['columns_exist']:
        gx_df.expect_column_to_exist(col)

    # Validate no nulls
    for col in expectations['no_nulls']:
        gx_df.expect_column_values_to_not_be_null(col)

    # Validate ranges
    for col, (min_val, max_val) in expectations['value_ranges'].items():
        gx_df.expect_column_values_to_be_between(col, min_val, max_val)

    # Validate categorical values
    for col, valid_values in expectations['unique_values'].items():
        gx_df.expect_column_values_to_be_in_set(col, valid_values)

    # Run validation
    results = gx_df.validate()

    # Generate report
    results.save_html('reports/data_validation.html')

    # Check if validation passed
    if not results['success']:
        print("❌ Data validation failed!")
        print(results)
        sys.exit(1)
    else:
        print("✅ Data validation passed!")

if __name__ == '__main__':
    validate_training_data()
```

### Model Metrics Validation

```python
# scripts/check_metrics.py
import mlflow
import argparse
import sys

def check_model_metrics(min_f1, min_precision, min_recall):
    """
    Validate that model meets minimum performance thresholds
    """
    # Get latest run
    client = mlflow.tracking.MlflowClient()
    experiment = client.get_experiment_by_name("fraud_detection")

    runs = client.search_runs(
        experiment_ids=[experiment.experiment_id],
        order_by=["start_time DESC"],
        max_results=1
    )

    if not runs:
        print("❌ No runs found!")
        sys.exit(1)

    latest_run = runs[0]
    metrics = latest_run.data.metrics

    # Check thresholds
    checks = {
        'f1_score': (metrics.get('f1_score', 0), min_f1),
        'precision': (metrics.get('precision', 0), min_precision),
        'recall': (metrics.get('recall', 0), min_recall)
    }

    passed = True
    for metric_name, (actual, threshold) in checks.items():
        status = "✅" if actual >= threshold else "❌"
        print(f"{status} {metric_name}: {actual:.4f} (threshold: {threshold:.4f})")

        if actual < threshold:
            passed = False

    if not passed:
        print("\n❌ Model does not meet minimum performance requirements!")
        sys.exit(1)
    else:
        print("\n✅ All metrics passed!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--min-f1', type=float, default=0.85)
    parser.add_argument('--min-precision', type=float, default=0.80)
    parser.add_argument('--min-recall', type=float, default=0.75)

    args = parser.parse_args()
    check_model_metrics(args.min_f1, args.min_precision, args.min_recall)
```

---

## Model Versioning Strategies

### Semantic Versioning for Models

```
Model Version Format: MAJOR.MINOR.PATCH

MAJOR: Breaking changes (input/output schema changes)
MINOR: New features (additional features, better accuracy)
PATCH: Bug fixes (no functional changes)

Examples:
- 1.0.0: Initial production model
- 1.1.0: Added 5 new features, improved F1 by 3%
- 1.1.1: Fixed data preprocessing bug
- 2.0.0: Changed output format (breaking change)
```

### MLflow Model Registry

```python
import mlflow
from mlflow.tracking import MlflowClient

class ModelVersionManager:
    def __init__(self, model_name):
        self.model_name = model_name
        self.client = MlflowClient()

    def register_model(self, run_id, tags=None):
        """
        Register a new model version
        """
        # Register model
        model_uri = f"runs:/{run_id}/model"
        model_version = mlflow.register_model(model_uri, self.model_name)

        # Add tags
        if tags:
            for key, value in tags.items():
                self.client.set_model_version_tag(
                    self.model_name,
                    model_version.version,
                    key,
                    value
                )

        print(f"Registered {self.model_name} version {model_version.version}")
        return model_version

    def promote_to_staging(self, version):
        """
        Promote model to staging
        """
        self.client.transition_model_version_stage(
            name=self.model_name,
            version=version,
            stage="Staging"
        )
        print(f"Promoted version {version} to Staging")

    def promote_to_production(self, version, archive_existing=True):
        """
        Promote model to production
        """
        if archive_existing:
            # Archive current production models
            prod_versions = self.client.get_latest_versions(
                self.model_name,
                stages=["Production"]
            )

            for prod_version in prod_versions:
                self.client.transition_model_version_stage(
                    name=self.model_name,
                    version=prod_version.version,
                    stage="Archived"
                )

        # Promote new version
        self.client.transition_model_version_stage(
            name=self.model_name,
            version=version,
            stage="Production"
        )

        print(f"Promoted version {version} to Production")

    def compare_versions(self, version1, version2):
        """
        Compare two model versions
        """
        v1 = self.client.get_model_version(self.model_name, version1)
        v2 = self.client.get_model_version(self.model_name, version2)

        # Get runs
        run1 = self.client.get_run(v1.run_id)
        run2 = self.client.get_run(v2.run_id)

        # Compare metrics
        print(f"\n=== Comparing Version {version1} vs {version2} ===")

        metrics1 = run1.data.metrics
        metrics2 = run2.data.metrics

        for metric in metrics1.keys():
            if metric in metrics2:
                diff = metrics2[metric] - metrics1[metric]
                print(f"{metric}:")
                print(f"  v{version1}: {metrics1[metric]:.4f}")
                print(f"  v{version2}: {metrics2[metric]:.4f}")
                print(f"  Difference: {diff:+.4f}")

    def rollback_production(self, to_version=None):
        """
        Rollback production to previous version
        """
        if to_version is None:
            # Get previous production version
            archived = self.client.get_latest_versions(
                self.model_name,
                stages=["Archived"]
            )

            if not archived:
                print("No archived versions to rollback to!")
                return

            to_version = archived[0].version

        self.promote_to_production(to_version, archive_existing=True)
        print(f"Rolled back production to version {to_version}")

# Example usage
manager = ModelVersionManager("fraud_detection_model")

# Register new model
model_version = manager.register_model(
    run_id="abc123",
    tags={
        'team': 'ml-team',
        'git_commit': 'def456',
        'dataset_version': '2024-01-15'
    }
)

# Promote through stages
manager.promote_to_staging(model_version.version)
# ... test in staging ...
manager.promote_to_production(model_version.version)
```

### Git-based Model Versioning with DVC

```bash
# Initialize DVC
dvc init

# Track model files
dvc add models/fraud_model.pkl

# Commit to git
git add models/fraud_model.pkl.dvc .gitignore
git commit -m "Add fraud detection model v1.0.0"
git tag -a v1.0.0 -m "Production model v1.0.0"

# Push model to remote storage (S3, GCS, etc.)
dvc push

# Later, to retrieve specific version
git checkout v1.0.0
dvc pull
```

---

## Feature Store Patterns

### Why Feature Stores?

```
Problems Feature Stores Solve:

1. Feature Reusability
   - Avoid reimplementing features in different projects
   - Share features across teams

2. Training-Serving Skew
   - Same feature computation code for training and inference
   - Eliminates inconsistencies

3. Feature Freshness
   - Control over feature staleness
   - Batch vs real-time features

4. Point-in-Time Correctness
   - Prevent data leakage in training
   - Historical feature values
```

### Feast Feature Store Implementation

```python
# feature_repo/features.py
from feast import Entity, Feature, FeatureView, ValueType
from feast.data_source import FileSource
from datetime import timedelta

# Define entity (customer)
customer = Entity(
    name="customer_id",
    value_type=ValueType.STRING,
    description="Customer identifier"
)

# Define data source
customer_features_source = FileSource(
    path="data/customer_features.parquet",
    event_timestamp_column="timestamp"
)

# Define feature view
customer_features_view = FeatureView(
    name="customer_transaction_features",
    entities=["customer_id"],
    ttl=timedelta(days=7),
    features=[
        Feature(name="total_transactions", dtype=ValueType.INT64),
        Feature(name="avg_transaction_amount", dtype=ValueType.DOUBLE),
        Feature(name="max_transaction_amount", dtype=ValueType.DOUBLE),
        Feature(name="transaction_count_7d", dtype=ValueType.INT64),
        Feature(name="amount_volatility", dtype=ValueType.DOUBLE)
    ],
    online=True,
    source=customer_features_source,
    tags={"team": "ml-team", "version": "v1"}
)
```

### Feature Store Integration

```python
# Training: Get historical features
from feast import FeatureStore
import pandas as pd

store = FeatureStore(repo_path="feature_repo/")

# Entity dataframe (customers and timestamps)
entity_df = pd.DataFrame({
    'customer_id': ['C001', 'C002', 'C003'],
    'event_timestamp': [
        pd.Timestamp('2024-01-01'),
        pd.Timestamp('2024-01-01'),
        pd.Timestamp('2024-01-01')
    ]
})

# Get historical features (point-in-time correct)
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=[
        "customer_transaction_features:total_transactions",
        "customer_transaction_features:avg_transaction_amount",
        "customer_transaction_features:amount_volatility"
    ]
).to_df()

print("Training features:")
print(training_df.head())

# Inference: Get online features (real-time)
online_features = store.get_online_features(
    features=[
        "customer_transaction_features:total_transactions",
        "customer_transaction_features:avg_transaction_amount"
    ],
    entity_rows=[
        {"customer_id": "C001"}
    ]
).to_dict()

print("\nOnline features:")
print(online_features)
```

### Feature Transformation Pipeline

```python
# src/features/transformers.py
from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
import numpy as np

class FeatureEngineering(BaseEstimator, TransformerMixin):
    """
    Custom feature engineering transformer
    """

    def __init__(self, lookback_days=30):
        self.lookback_days = lookback_days

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        """
        Create derived features
        """
        X = X.copy()

        # Time-based features
        X['transaction_date'] = pd.to_datetime(X['transaction_timestamp'])
        X['hour_of_day'] = X['transaction_date'].dt.hour
        X['day_of_week'] = X['transaction_date'].dt.dayofweek
        X['is_weekend'] = X['day_of_week'].isin([5, 6]).astype(int)

        # Aggregation features (if multiple rows per customer)
        if 'customer_id' in X.columns:
            customer_stats = X.groupby('customer_id').agg({
                'transaction_amount': ['mean', 'std', 'max', 'count'],
                'merchant_id': 'nunique'
            })

            customer_stats.columns = [
                'avg_amount', 'std_amount', 'max_amount',
                'transaction_count', 'unique_merchants'
            ]

            X = X.merge(customer_stats, on='customer_id', how='left')

        # Ratio features
        X['amount_to_avg_ratio'] = X['transaction_amount'] / (X['avg_amount'] + 1e-6)

        # Drop temporary columns
        X = X.drop(['transaction_date'], axis=1)

        return X

# Save transformer for consistent train/serve
import joblib

transformer = FeatureEngineering(lookback_days=30)
transformer.fit(train_data)

# Save for inference
joblib.dump(transformer, 'models/feature_transformer.pkl')

# Use in training
X_train_transformed = transformer.transform(train_data)

# Use in inference (same transformation)
transformer_loaded = joblib.load('models/feature_transformer.pkl')
X_inference = transformer_loaded.transform(new_data)
```

---

*Continue to [Model Monitoring and Observability](#model-monitoring-and-observability)*

## Model Monitoring and Observability

### Comprehensive Monitoring Stack

```python
# monitoring/metrics.py
from prometheus_client import Counter, Histogram, Gauge, Summary
import time

# Request metrics
PREDICTION_COUNTER = Counter(
    'model_predictions_total',
    'Total number of predictions',
    ['model_name', 'model_version', 'prediction_type']
)

PREDICTION_LATENCY = Histogram(
    'model_prediction_latency_seconds',
    'Prediction latency in seconds',
    ['model_name', 'model_version'],
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0]
)

# Model performance metrics
MODEL_ACCURACY = Gauge(
    'model_accuracy',
    'Current model accuracy',
    ['model_name', 'model_version']
)

PREDICTION_CONFIDENCE = Summary(
    'prediction_confidence',
    'Distribution of prediction confidence scores',
    ['model_name', 'model_version']
)

# Data drift metrics
FEATURE_DRIFT_SCORE = Gauge(
    'feature_drift_score',
    'Data drift score for features',
    ['feature_name', 'model_name']
)

# Error tracking
PREDICTION_ERRORS = Counter(
    'prediction_errors_total',
    'Total number of prediction errors',
    ['model_name', 'error_type']
)

class ModelMonitor:
    def __init__(self, model_name, model_version):
        self.model_name = model_name
        self.model_version = model_version

    def track_prediction(self, prediction_type, confidence=None):
        """Track a prediction"""
        PREDICTION_COUNTER.labels(
            model_name=self.model_name,
            model_version=self.model_version,
            prediction_type=prediction_type
        ).inc()

        if confidence is not None:
            PREDICTION_CONFIDENCE.labels(
                model_name=self.model_name,
                model_version=self.model_version
            ).observe(confidence)

    def track_latency(self, duration):
        """Track prediction latency"""
        PREDICTION_LATENCY.labels(
            model_name=self.model_name,
            model_version=self.model_version
        ).observe(duration)

    def update_accuracy(self, accuracy):
        """Update model accuracy metric"""
        MODEL_ACCURACY.labels(
            model_name=self.model_name,
            model_version=self.model_version
        ).set(accuracy)

    def track_error(self, error_type):
        """Track prediction error"""
        PREDICTION_ERRORS.labels(
            model_name=self.model_name,
            error_type=error_type
        ).inc()

# Usage in API
from fastapi import FastAPI

app = FastAPI()
monitor = ModelMonitor("fraud_detection", "v1.0.0")

@app.post("/predict")
async def predict(request: PredictionRequest):
    start_time = time.time()

    try:
        # Make prediction
        result = model.predict(request.features)

        # Track metrics
        monitor.track_prediction(
            prediction_type="fraud" if result.is_fraud else "normal",
            confidence=result.confidence
        )

        duration = time.time() - start_time
        monitor.track_latency(duration)

        return result

    except Exception as e:
        monitor.track_error(str(type(e).__name__))
        raise
```

### Data Drift Detection

```python
# monitoring/drift_detection.py
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, DataQualityPreset
from evidently.metrics import ColumnDriftMetric
import pandas as pd
import schedule
import time

class DriftMonitor:
    def __init__(self, reference_data, alert_threshold=0.5):
        self.reference_data = reference_data
        self.alert_threshold = alert_threshold

    def check_drift(self, current_data):
        """
        Check for data drift
        """
        report = Report(metrics=[
            DataDriftPreset(),
            DataQualityPreset()
        ])

        report.run(
            reference_data=self.reference_data,
            current_data=current_data
        )

        # Get drift results
        drift_results = report.as_dict()

        # Check if dataset drift detected
        dataset_drift = drift_results['metrics'][0]['result']['dataset_drift']

        if dataset_drift:
            # Get drifted features
            drifted_features = []
            for metric in drift_results['metrics']:
                if 'column_name' in metric['result']:
                    if metric['result'].get('drift_detected', False):
                        column = metric['result']['column_name']
                        drift_score = metric['result'].get('drift_score', 0)
                        drifted_features.append((column, drift_score))

            return {
                'drift_detected': True,
                'drifted_features': drifted_features,
                'report': drift_results
            }

        return {
            'drift_detected': False,
            'report': drift_results
        }

    def monitor_continuously(self, data_loader, check_interval_hours=24):
        """
        Continuously monitor for drift
        """
        def check():
            current_data = data_loader()
            result = self.check_drift(current_data)

            if result['drift_detected']:
                self.alert_drift(result)

                # Update Prometheus metrics
                for feature, score in result['drifted_features']:
                    FEATURE_DRIFT_SCORE.labels(
                        feature_name=feature,
                        model_name="fraud_detection"
                    ).set(score)

        # Schedule regular checks
        schedule.every(check_interval_hours).hours.do(check)

        while True:
            schedule.run_pending()
            time.sleep(60)

    def alert_drift(self, drift_result):
        """
        Send alert when drift detected
        """
        message = f"⚠️  Data Drift Detected!\n\n"
        message += f"Drifted Features:\n"

        for feature, score in drift_result['drifted_features']:
            message += f"  - {feature}: {score:.4f}\n"

        # Send to Slack, PagerDuty, etc.
        print(message)
        # send_slack_alert(message)
```

### Model Performance Tracking

```python
# monitoring/performance_tracker.py
import pandas as pd
from datetime import datetime, timedelta
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

class PerformanceTracker:
    def __init__(self, model_name, db_connection):
        self.model_name = model_name
        self.db = db_connection

    def log_prediction(self, prediction_id, features, prediction, confidence):
        """
        Log prediction for later evaluation
        """
        record = {
            'prediction_id': prediction_id,
            'timestamp': datetime.utcnow(),
            'features': features,
            'prediction': prediction,
            'confidence': confidence,
            'actual': None  # Will be updated when ground truth available
        }

        # Store in database
        self.db.insert('predictions', record)

    def update_ground_truth(self, prediction_id, actual_value):
        """
        Update with ground truth label
        """
        self.db.update(
            'predictions',
            {'prediction_id': prediction_id},
            {'actual': actual_value, 'updated_at': datetime.utcnow()}
        )

    def calculate_metrics(self, time_window_hours=24):
        """
        Calculate model metrics for recent predictions
        """
        cutoff_time = datetime.utcnow() - timedelta(hours=time_window_hours)

        # Get predictions with ground truth
        query = f"""
        SELECT prediction, actual
        FROM predictions
        WHERE timestamp >= '{cutoff_time}'
          AND actual IS NOT NULL
        """

        df = pd.read_sql(query, self.db.connection)

        if len(df) < 10:  # Need minimum samples
            return None

        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(df['actual'], df['prediction']),
            'precision': precision_score(df['actual'], df['prediction'], average='weighted', zero_division=0),
            'recall': recall_score(df['actual'], df['prediction'], average='weighted', zero_division=0),
            'f1_score': f1_score(df['actual'], df['prediction'], average='weighted', zero_division=0),
            'sample_count': len(df),
            'timestamp': datetime.utcnow()
        }

        # Update Prometheus metric
        MODEL_ACCURACY.labels(
            model_name=self.model_name,
            model_version="current"
        ).set(metrics['accuracy'])

        # Store metrics history
        self.db.insert('model_metrics', metrics)

        return metrics

    def detect_performance_degradation(self, baseline_metrics, current_metrics, threshold=0.05):
        """
        Detect if model performance has degraded
        """
        degraded_metrics = []

        for metric in ['accuracy', 'precision', 'recall', 'f1_score']:
            baseline = baseline_metrics[metric]
            current = current_metrics[metric]
            degradation = baseline - current

            if degradation > threshold:
                degraded_metrics.append({
                    'metric': metric,
                    'baseline': baseline,
                    'current': current,
                    'degradation': degradation
                })

        if degraded_metrics:
            return {
                'degraded': True,
                'metrics': degraded_metrics
            }

        return {'degraded': False}
```

---

## Summary

**Key Takeaways**:

1. **CI/CD for ML**:
   - Automate data validation, model training, testing, and deployment
   - Use GitHub Actions or similar for pipeline automation
   - Validate metrics before deployment

2. **Model Versioning**:
   - Use semantic versioning for models
   - Leverage MLflow Model Registry or Unity Catalog
   - Track model lineage and metadata

3. **Feature Stores**:
   - Eliminate training-serving skew
   - Enable feature reuse across projects
   - Ensure point-in-time correctness

4. **Monitoring**:
   - Track predictions, latency, and errors
   - Monitor data drift and model performance
   - Alert on degradation

---

**Related Resources**:
- [Anomaly Detection Guide](./ANOMALY_DETECTION.md)
- [Data Science Fundamentals](./DATA_SCIENCE_FUNDAMENTALS.md)
- [Team Structure Guide](./TEAM_STRUCTURE.md)

*Last Updated: 2026-02-19*
