# AI Stack Guide

## 📋 Overview
This comprehensive guide provides practical knowledge for building, deploying, and operating AI/ML systems across different industries. It covers:
- Model development lifecycle from data preparation to production deployment
- MLOps patterns for different use cases (anomaly detection, NLP, computer vision, recommendation systems)
- Data platform architecture (Snowflake, Databricks, data lakes)
- Domain-specific AI applications across 16 industries
- QA strategies and testing approaches for ML systems
- Full-stack architecture guidance from data ingestion to model serving

## 🎯 Who This Guide Is For
- **QA Engineers**: Testing ML systems, understanding model behavior, data quality validation
- **Data Scientists**: Model development, feature engineering, experiment tracking
- **ML Engineers**: Productionizing models, MLOps pipelines, monitoring
- **Software Engineers**: Integrating ML into applications, API design
- **Architects**: Designing end-to-end ML platforms

## 🚀 NEW: Complete AI/ML Team Structure Guide

**Want to understand how AI/ML teams work together to build production systems?** Check out our comprehensive guides:

### 📖 Main Guides

#### [Part 1: Team Structure and Roles](./TEAM_STRUCTURE.md)
- Detailed breakdown of Data Engineers, Data Scientists, and ML Engineers
- Real code examples from each role's daily work
- Complete ETL pipeline from Snowflake to Databricks
- Data flow from raw data to production models

#### [Part 2: Anomaly Detection Use Case](./TEAM_STRUCTURE_PART2.md)
- End-to-end fraud detection implementation
- Model training with MLflow and Unity Catalog
- Production deployment with FastAPI and Kubernetes
- Team collaboration patterns and workflows

#### [Part 3: Real-World Examples](./TEAM_STRUCTURE_PART3.md)
- E-Commerce product recommendations (collaborative filtering + content-based)
- Complete implementation from data pipeline to production API
- A/B testing and performance monitoring
- Business impact analysis and metrics

### 🧭 Additional Resources

- **[Navigation Guide](./NAVIGATION_GUIDE.md)** - Quick start and reading paths for different roles
- **[Learning Path](./LEARNING_PATH.md)** - Structured path from beginner to expert with exercises, projects, and certifications

**Use Case Covered**: Building anomaly detection models using Databricks Unity Catalog with data from Snowflake, including ETL pipelines, feature engineering, model training, deployment, and monitoring.

---

## 🧠 Model Creation Foundations
- **Data readiness**: labeled set with drift checks, PII scrubbed, stratified train/val/test, and clear acceptance metrics (precision/recall/F1/latency).
- **Feature engineering**: start with baseline statistical features; add embeddings for text (e.g., `text-embedding-3-large`, `sentence-transformers`); keep feature store schemas versioned.
- **Training loop (sketch)**:
  ```python
  import mlflow, numpy as np
  from sklearn.metrics import f1_score
  from sklearn.ensemble import RandomForestClassifier

  mlflow.set_experiment("anomaly-detector")
  with mlflow.start_run():
      model = RandomForestClassifier(
          n_estimators=200,
          max_depth=12,
          class_weight="balanced_subsample",
          n_jobs=-1,
      ).fit(X_train, y_train)
      f1 = f1_score(y_val, model.predict(X_val))
      mlflow.log_metric("f1", f1)
      mlflow.sklearn.log_model(model, "model")
  ```
- **Optimization**: prune features, enable vectorized batching, use quantization (`bitsandbytes`, ONNX Runtime), and distill larger chat models into smaller task-specific ones; profile GPU/CPU utilization before and after changes.

## 🔁 MLOps Paths
### Anomaly Detection Pipeline
- Ingest → validate (Great Expectations) → feature store (Feast/Hopsworks) → train → drift monitor (KS/PSI) → batch + streaming inference.
- CI gates: unit tests on feature code, contract tests on event schemas, regression suite on labeled holdout, and latency ceilings (p50/p95) under k6/Locust load.
- Deployment: containerize scorer + feature server; expose health, readiness, and `/metrics`; use canary or shadow traffic with automatic rollback on metric regression.

### Chat/RAG Pipeline
- Curate sources → chunk with semantic splitting → embed + store in vector DB (Pinecone/Weaviate/PGVector) with metadata filters → prompt templates with guardrails (Pydantic/Guardrails.ai) → evaluator set (answer correctness, grounding, toxicity).
- Hosting options: GPU-backed Kubernetes (node selectors + autoscaling), serverless GPU (SageMaker, Vertex, Azure AI), or lightweight CPU for distilled models.
- Load/quality testing: latency SLOs per token, hallucination rate on eval set, context hit-rate for retrieval, jailbreak red-team suite, and cost-per-1K tokens tracking.

### QA Toolkit
- **Data quality**: Great Expectations/Deequ checks baked into pipelines; fail fast on schema drift.
- **Model quality**: offline eval harness + golden conversations; contract tests for prompt/response format.
- **Ops**: chaos drills on vector DB and message bus; synthetic traffic replay; end-to-end traces via OpenTelemetry.

## 🗄️ Data Platform Playbooks
- **Snowflake**: stage raw to external tables → Snowpark for feature creation → Streams & Tasks for incremental updates → secure views for LLM retrieval; use masking policies for PII and row access policies for multi-tenant data.
- **Databricks**: Delta Live Tables for bronze/silver/gold → Unity Catalog for governance → Feature Store for sharing embeddings/numeric features → MLflow for runs and model registry promotion; enable Photon + autoscaling clusters for cost control.

## 🧪 QA at Scale (Large Data)
- Stratified sampling + adversarial cases; synthetic data to cover rare classes; replay production logs with PII redaction.
- Canary/blue-green deploys with automatic rollback on metric drift; shadow mode for new models until stability proven.
- Observability check: request tracing IDs propagated to model responses, structured logs with prompt/response hashes, dashboards for latency, error, and hallucination/ticket rates.

## ✅ Learning To-Do
- Map needs to architecture: pick microservices/event-driven/serverless from `architectures/` and align dependency checklist from `quick-reference`.
- Build a small anomaly detector: use the training sketch above, log to MLflow, add drift check, and wrap with a health-checked container.
- Build a chat/RAG demo: pick a vector DB, create an eval set, add guardrails, and measure latency vs. quality before/after distillation or quantization.
- Run platform drills: prototype Snowflake Task or Databricks DLT job that feeds a feature store table, then hook it to your inference path.
- QA practice: design a red-team/jailbreak suite for chat, and a drift + latency gate for anomaly detection; automate them in CI before deployment.

---

## 🏭 Domain-Specific AI/ML Applications

This section demonstrates how AI/ML applies to each industry domain with specific use cases, algorithms, and implementation guidance.

### 1. Aerospace - Flight & Satellite Systems
**Use Cases**:
- **Predictive Maintenance**: Predict aircraft component failures using sensor telemetry
- **Route Optimization**: Optimize flight paths for fuel efficiency using weather data
- **Anomaly Detection**: Detect unusual flight patterns or equipment behavior

**ML Stack**:
```python
# Predictive maintenance example
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pandas as pd

# Features: engine temp, vibration, oil pressure, flight hours
features = ['engine_temp', 'vibration', 'oil_pressure', 'flight_hours',
            'engine_cycles', 'altitude_variance']

# Time-series windowing for sensor data
def create_windows(df, window_size=50):
    """Create rolling windows of sensor readings"""
    windows = []
    for i in range(len(df) - window_size):
        window = df.iloc[i:i+window_size][features].values
        windows.append(window.flatten())
    return np.array(windows)

# Training
X_train_windowed = create_windows(train_df)
y_train = train_df['failure_next_24h'].values[50:]

model = RandomForestClassifier(n_estimators=200, max_depth=15)
model.fit(X_train_windowed, y_train)

# Real-time scoring
def predict_failure_risk(current_readings: pd.DataFrame) -> float:
    window = create_windows(current_readings, window_size=50)
    proba = model.predict_proba(window[-1].reshape(1, -1))[0][1]
    return proba
```

**Data Platform**: InfluxDB for time-series sensor data → Spark for feature engineering → MLflow for model registry

**Metrics**: Precision (minimize false alarms), Recall (catch failures), Lead time (hours before failure)

---

### 2. Mortgage - Loan Risk & Valuation
**Use Cases**:
- **Automated Valuation Model (AVM)**: Property valuation using comparable sales
- **Default Risk Prediction**: Likelihood of loan default
- **Document Classification**: Auto-classify uploaded documents (W-2, pay stubs, bank statements)

**ML Stack**:
```python
# AVM Example using XGBoost
import xgboost as xgb
from sklearn.model_selection import train_test_split

# Features for property valuation
features = [
    'square_feet', 'bedrooms', 'bathrooms', 'lot_size', 'year_built',
    'zip_code_median_price', 'school_rating', 'crime_rate',
    'days_on_market', 'comparable_sale_1_price', 'comparable_sale_2_price'
]

# Target: sale_price
X_train, X_val, y_train, y_val = train_test_split(
    df[features], df['sale_price'], test_size=0.2
)

# XGBoost for regression
model = xgb.XGBRegressor(
    n_estimators=500,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8
)

model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=50,
    verbose=False
)

# Prediction with confidence intervals
def predict_with_confidence(property_features):
    predictions = []
    for tree in model.get_booster():
        pred = tree.predict(property_features)
        predictions.append(pred)

    mean_price = np.mean(predictions)
    std_price = np.std(predictions)

    return {
        'estimated_value': mean_price,
        'confidence_interval_95': (mean_price - 1.96*std_price,
                                    mean_price + 1.96*std_price)
    }
```

**Data Platform**: Snowflake for structured loan data → Feature store for aggregations → SageMaker/Databricks for training

**Metrics**: Mean Absolute Percentage Error (MAPE) < 5%, Coverage (% within confidence interval)

---

### 3. Manufacturing - Quality & Maintenance
**Use Cases**:
- **Defect Detection**: Computer vision for visual inspection
- **Predictive Maintenance**: Equipment failure prediction
- **Process Optimization**: Optimal parameter tuning

**ML Stack**:
```python
# Computer Vision Defect Detection
import tensorflow as tf
from tensorflow.keras import layers, models

def create_defect_detector():
    """CNN for binary defect classification"""
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')  # Binary: defect / no defect
    ])

    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )

    return model

# Data augmentation for limited training data
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Training with class imbalance handling
model = create_defect_detector()
model.fit(
    datagen.flow(X_train, y_train, batch_size=32),
    epochs=50,
    validation_data=(X_val, y_val),
    class_weight={0: 1, 1: 10}  # Weight defects 10x more
)

# Edge deployment for real-time inference
import tensorflow_lite as tflite

converter = tflite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tflite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Deploy to edge device
with open('defect_detector.tflite', 'wb') as f:
    f.write(tflite_model)
```

**Data Platform**: Edge gateways → Kafka → S3 for image storage → EMR for batch processing

**Metrics**: Precision > 95% (minimize false positives), Recall > 99% (catch all defects), Latency < 100ms

---

### 4. Telecommunications - Network & Fraud
**Use Cases**:
- **Network Anomaly Detection**: Identify network issues before customer impact
- **Churn Prediction**: Predict customer churn risk
- **Fraud Detection**: SIM box fraud, subscription fraud

**ML Stack**:
```python
# Network Anomaly Detection with Isolation Forest
from sklearn.ensemble import IsolationForest
import pandas as pd

# Features: network metrics over time
features = [
    'avg_latency_ms', 'packet_loss_pct', 'throughput_mbps',
    'active_sessions', 'error_rate', 'cpu_usage', 'memory_usage'
]

# Train on normal network behavior
normal_data = historical_df[historical_df['is_anomaly'] == False][features]

iso_forest = IsolationForest(
    contamination=0.01,  # Expect 1% anomalies
    random_state=42,
    n_estimators=100
)
iso_forest.fit(normal_data)

# Real-time anomaly scoring
def score_network_metrics(current_metrics: pd.DataFrame) -> dict:
    # Score: -1 for anomalies, 1 for normal
    scores = iso_forest.score_samples(current_metrics[features])

    # Convert to probability
    anomaly_probs = 1 - (scores + 0.5)  # Normalize to 0-1

    is_anomaly = anomaly_probs > 0.8  # Threshold

    return {
        'is_anomaly': bool(is_anomaly[0]),
        'anomaly_score': float(anomaly_probs[0]),
        'affected_metrics': current_metrics[features].iloc[0].to_dict()
    }
```

**Data Platform**: Kafka streaming → Flink for real-time aggregation → ClickHouse for fast queries

**Metrics**: False positive rate < 1%, Detection latency < 30 seconds, Precision/Recall balance

---

### 5. Healthcare - Diagnosis & Treatment
**Use Cases**:
- **Medical Image Analysis**: X-ray/MRI analysis for diagnosis
- **Patient Risk Stratification**: Identify high-risk patients
- **Drug Interaction Detection**: Flag dangerous drug combinations

**ML Stack**:
```python
# Medical Image Classification (Transfer Learning)
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras import layers, models

def create_medical_image_classifier(num_classes=5):
    """
    Transfer learning for medical image classification
    Classes: Normal, Pneumonia, COVID-19, Tuberculosis, Lung Cancer
    """
    # Load pre-trained ResNet50
    base_model = ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )

    # Freeze base model layers
    base_model.trainable = False

    # Add custom classification head
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_k_categorical_accuracy']
    )

    return model

# HIPAA-compliant data handling
def load_medical_images(image_paths, encrypt=True):
    """Load and optionally encrypt medical images"""
    images = []
    for path in image_paths:
        img = tf.keras.preprocessing.image.load_img(
            path,
            target_size=(224, 224)
        )
        img_array = tf.keras.preprocessing.image.img_to_array(img)

        if encrypt:
            # Encrypt before storing
            img_array = encrypt_image(img_array)

        images.append(img_array)

    return np.array(images)

# Explainability with Grad-CAM
import cv2

def generate_gradcam(model, image, class_idx):
    """Generate heatmap showing which regions influenced prediction"""
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer('conv5_block3_out').output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(image)
        loss = predictions[:, class_idx]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # Normalize
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)

    return heatmap.numpy()
```

**Data Platform**: HIPAA-compliant S3 (encryption at rest) → SageMaker (VPC) → Secure model endpoints

**Metrics**: Sensitivity/Specificity, AUC-ROC, Clinical validation required

**Compliance**: HIPAA, FDA clearance for clinical use, explainability for doctors

---

### 6. Finance - Trading & Risk
**Use Cases**:
- **Algorithmic Trading**: Price prediction and signal generation
- **Credit Risk Modeling**: Default probability
- **Fraud Detection**: Transaction fraud

**ML Stack**:
```python
# Time-Series Forecasting with LSTM
import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense, Dropout

def create_price_predictor(sequence_length=60, n_features=5):
    """
    LSTM for stock price prediction
    Features: Open, High, Low, Close, Volume
    """
    model = tf.keras.Sequential([
        LSTM(128, return_sequences=True, input_shape=(sequence_length, n_features)),
        Dropout(0.2),
        LSTM(64, return_sequences=True),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1)  # Predict next day closing price
    ])

    model.compile(
        optimizer='adam',
        loss='mse',
        metrics=['mae']
    )

    return model

# Feature engineering for trading signals
def create_technical_indicators(df):
    """Calculate technical indicators"""
    from ta import add_all_ta_features

    # Add all technical indicators
    df = add_all_ta_features(
        df, open="open", high="high", low="low",
        close="close", volume="volume"
    )

    # Custom features
    df['price_change'] = df['close'].pct_change()
    df['volatility'] = df['close'].rolling(20).std()
    df['volume_change'] = df['volume'].pct_change()

    return df

# Backtesting framework
class TradingBacktest:
    def __init__(self, initial_capital=100000):
        self.capital = initial_capital
        self.positions = []
        self.trades = []

    def execute_signal(self, signal, price, timestamp):
        """Execute buy/sell based on model signal"""
        if signal > 0.6 and self.capital > price:
            # Buy signal
            shares = self.capital // price
            self.positions.append({
                'shares': shares,
                'entry_price': price,
                'entry_time': timestamp
            })
            self.capital -= shares * price

        elif signal < 0.4 and self.positions:
            # Sell signal
            for position in self.positions:
                profit = (price - position['entry_price']) * position['shares']
                self.capital += position['shares'] * price
                self.trades.append({
                    'profit': profit,
                    'hold_time': timestamp - position['entry_time']
                })
            self.positions = []

    def get_performance_metrics(self):
        total_profit = sum(t['profit'] for t in self.trades)
        win_rate = len([t for t in self.trades if t['profit'] > 0]) / len(self.trades)
        sharpe_ratio = np.mean([t['profit'] for t in self.trades]) / np.std([t['profit'] for t in self.trades])

        return {
            'total_profit': total_profit,
            'win_rate': win_rate,
            'sharpe_ratio': sharpe_ratio,
            'num_trades': len(self.trades)
        }
```

**Data Platform**: Real-time market data → Kafka → Redis for low-latency features → Model serving with <50ms latency

**Metrics**: Sharpe ratio, Win rate, Maximum drawdown, Latency p99 < 50ms

---

### 7. Education - Learning Analytics
**Use Cases**:
- **Student Performance Prediction**: Identify at-risk students
- **Automated Essay Grading**: NLP-based essay scoring
- **Content Recommendation**: Personalized learning paths

**ML Stack**:
```python
# Automated Essay Grading with Transformers
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

def create_essay_grader():
    """Fine-tune BERT for essay scoring"""
    model_name = "bert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=6  # Scores: 0-5
    )

    return tokenizer, model

# Training with essay dataset
from transformers import Trainer, TrainingArguments

def train_essay_grader(essays, scores):
    tokenizer, model = create_essay_grader()

    # Tokenize essays
    encodings = tokenizer(
        essays,
        truncation=True,
        padding=True,
        max_length=512
    )

    # Create dataset
    class EssayDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item['labels'] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    dataset = EssayDataset(encodings, scores)

    # Training arguments
    training_args = TrainingArguments(
        output_dir='./essay_grader',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset
    )

    trainer.train()
    return model, tokenizer

# Inference with explanation
def grade_essay_with_explanation(essay_text, model, tokenizer):
    """Grade essay and highlight key phrases"""
    inputs = tokenizer(essay_text, return_tensors="pt", truncation=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)
        score = torch.argmax(outputs.logits, dim=1).item()

    # Get attention weights for explanation
    attention = outputs.attentions[-1]  # Last layer attention

    return {
        'score': score,
        'confidence': torch.softmax(outputs.logits, dim=1)[0][score].item(),
        'feedback': generate_feedback(score, essay_text)
    }
```

**Data Platform**: MongoDB for unstructured data → Spark for ETL → SageMaker for training

**Metrics**: Correlation with human graders > 0.85, Quadratic weighted kappa

---

## 📊 Domain-Specific ML Patterns Summary

| Domain | Primary ML Tasks | Key Algorithms | Data Scale | Latency Req |
|--------|-----------------|----------------|------------|-------------|
| **Aerospace** | Anomaly detection, Predictive maintenance | Random Forest, LSTM, Isolation Forest | TB/day | < 1s |
| **Mortgage** | Risk scoring, AVM, Document classification | XGBoost, CNN, Random Forest | GB/day | < 5s |
| **Manufacturing** | Defect detection, Process optimization | CNN, Reinforcement Learning | TB/day | < 100ms |
| **Telecom** | Network anomaly, Churn, Fraud | Isolation Forest, XGBoost, GNN | PB/day | < 1s |
| **Healthcare** | Medical imaging, Risk stratification | CNN (ResNet, EfficientNet), XGBoost | GB/day | < 2s |
| **Finance** | Price prediction, Fraud detection | LSTM, XGBoost, GBM | TB/day | < 50ms |
| **Education** | Essay grading, Student prediction | BERT, XGBoost, Collaborative Filtering | GB/day | < 3s |
| **Retail** | Demand forecasting, Recommendation | Time-series, Matrix Factorization | TB/day | < 200ms |
| **Government** | Fraud detection, Document classification | Random Forest, CNN, NLP | GB/day | < 5s |

## 🔄 End-to-End ML Architecture

### High-Level Architecture
```
┌──────────────────────────────────────────────────────────────────┐
│                        Data Sources                               │
│   (Databases, APIs, Streams, Files, Sensors)                     │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Data Ingestion & Validation                          │
│   - ETL/ELT Pipelines (Airflow, Prefect)                        │
│   - Data Quality Checks (Great Expectations, Deequ)             │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Data Storage                                    │
│   - Data Lake (S3, ADLS)                                         │
│   - Data Warehouse (Snowflake, BigQuery)                         │
│   - Feature Store (Feast, Tecton)                                │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Feature Engineering                                  │
│   - Spark/Dask for distributed processing                        │
│   - dbt for transformation                                        │
│   - Feature versioning and lineage                               │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Model Training                                       │
│   - Experiment Tracking (MLflow, Weights & Biases)              │
│   - Hyperparameter Tuning (Optuna, Ray Tune)                    │
│   - Distributed Training (Horovod, PyTorch DDP)                 │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Model Registry & Validation                          │
│   - Model versioning (MLflow, DVC)                              │
│   - A/B testing framework                                        │
│   - Model validation gates                                       │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Model Serving                                        │
│   - REST API (FastAPI, Flask)                                    │
│   - Batch inference (Spark)                                      │
│   - Streaming (Kafka + Flink)                                    │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Monitoring & Observability                           │
│   - Metrics (Prometheus, Grafana)                                │
│   - Drift detection (Evidently, NannyML)                         │
│   - Alerting (PagerDuty, Opsgenie)                              │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Stack Recommendations

#### Small Scale (< 1TB data, < 1M predictions/day)
- **Data**: PostgreSQL + S3
- **Processing**: Pandas, Scikit-learn
- **Training**: Local GPU or SageMaker/Vertex AI
- **Serving**: FastAPI on EC2/Cloud Run
- **Monitoring**: CloudWatch/Stackdriver

#### Medium Scale (1-100TB data, 1M-1B predictions/day)
- **Data**: Snowflake + S3 Data Lake
- **Processing**: Spark on EMR/Dataproc
- **Training**: SageMaker/Vertex AI with distributed training
- **Serving**: Kubernetes with autoscaling
- **Monitoring**: Prometheus + Grafana + custom drift detection

#### Large Scale (> 100TB data, > 1B predictions/day)
- **Data**: Databricks lakehouse
- **Processing**: Spark + Flink for streaming
- **Training**: Distributed training on GPU clusters
- **Serving**: Kubernetes + service mesh (Istio)
- **Monitoring**: Full observability stack (Prometheus, Jaeger, ELK)

## 🧪 Testing ML Systems

### Data Quality Tests
```python
# Great Expectations example
import great_expectations as ge

def validate_training_data(df):
    """Validate data quality before training"""
    gx_df = ge.from_pandas(df)

    # Schema validation
    gx_df.expect_table_columns_to_match_ordered_list([
        'feature1', 'feature2', 'feature3', 'target'
    ])

    # Data quality checks
    gx_df.expect_column_values_to_not_be_null('target')
    gx_df.expect_column_values_to_be_between('feature1', min_value=0, max_value=100)
    gx_df.expect_column_values_to_be_in_set('category', ['A', 'B', 'C'])

    # Statistical checks
    gx_df.expect_column_mean_to_be_between('feature2', min_value=45, max_value=55)

    results = gx_df.validate()

    if not results['success']:
        raise ValueError(f"Data validation failed: {results}")

    return results
```

### Model Quality Tests
```python
# Unit tests for model behavior
import pytest

def test_model_predictions_shape():
    """Test model output shape"""
    model = load_model('my_model.pkl')
    X_test = np.random.rand(10, 5)
    predictions = model.predict(X_test)

    assert predictions.shape == (10,), "Unexpected prediction shape"

def test_model_prediction_range():
    """Test predictions are in valid range"""
    model = load_model('my_model.pkl')
    X_test = create_test_data()
    predictions = model.predict(X_test)

    assert all(0 <= p <= 1 for p in predictions), "Predictions outside [0,1]"

def test_model_invariance():
    """Test model is invariant to irrelevant features"""
    model = load_model('my_model.pkl')
    X_test = create_test_data()

    predictions1 = model.predict(X_test)

    # Shuffle irrelevant feature
    X_test_shuffled = X_test.copy()
    X_test_shuffled[:, 4] = np.random.permutation(X_test_shuffled[:, 4])

    predictions2 = model.predict(X_test_shuffled)

    np.testing.assert_array_almost_equal(predictions1, predictions2)

def test_model_monotonicity():
    """Test expected monotonic relationships"""
    model = load_model('credit_risk_model.pkl')

    # Higher income should decrease default probability
    low_income = create_sample_with_income(30000)
    high_income = create_sample_with_income(100000)

    assert model.predict_proba(low_income)[0][1] > model.predict_proba(high_income)[0][1]
```

### Integration Tests
```python
def test_end_to_end_prediction():
    """Test complete prediction pipeline"""
    # 1. Load data
    raw_data = load_raw_data('test_sample.csv')

    # 2. Feature engineering
    features = engineer_features(raw_data)

    # 3. Model prediction
    model = load_model('production_model.pkl')
    predictions = model.predict(features)

    # 4. Postprocessing
    results = postprocess_predictions(predictions)

    # 5. Validate output format
    assert 'prediction' in results
    assert 'confidence' in results
    assert 0 <= results['confidence'] <= 1
```

## 📈 Monitoring & Drift Detection

### Data Drift Detection
```python
from evidently.metric_preset import DataDriftPreset
from evidently.report import Report

def detect_data_drift(reference_data, current_data):
    """Detect if input data distribution has changed"""
    report = Report(metrics=[DataDriftPreset()])

    report.run(reference_data=reference_data, current_data=current_data)

    result = report.as_dict()

    if result['metrics'][0]['result']['dataset_drift']:
        alert('Data drift detected!')

    return result

# Continuous monitoring
def monitor_predictions():
    """Monitor model performance in production"""
    # Get recent predictions and actuals
    predictions = get_recent_predictions(days=7)
    actuals = get_recent_actuals(days=7)

    # Calculate metrics
    from sklearn.metrics import accuracy_score, f1_score

    accuracy = accuracy_score(actuals, predictions)
    f1 = f1_score(actuals, predictions, average='weighted')

    # Alert if below threshold
    if accuracy < 0.85:
        alert(f'Model accuracy dropped to {accuracy}')

    # Log metrics
    log_metric('model_accuracy', accuracy)
    log_metric('model_f1', f1)
```

## 🔗 Related Resources

- **Domain Examples**: See specific ML applications in each [domain example](../domain-examples/)
- **Architecture**: [Event-Driven](../architectures/event-driven/) and [Microservices](../architectures/microservices/) patterns
- **Infrastructure**: [Kubernetes](../infrastructure/kubernetes/), [CI/CD](../infrastructure/cicd/) for MLOps
- **Quick Reference**: [Technology Stack Guide](../quick-reference/) for tool selection
