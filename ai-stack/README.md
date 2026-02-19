# AI Stack Guide

## 📋 Overview
- Practical entry point for building, optimizing, and shipping AI systems with testability in mind.
- Covers model creation, MLOps flows (anomaly detection and chat/RAG), hosting choices, data platform fit (Snowflake/Databricks), and QA strategies for large data.

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
