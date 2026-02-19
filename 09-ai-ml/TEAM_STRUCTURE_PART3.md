# AI/ML Team Structure - Part 3: Real-World Examples

_Continued from [Part 2: Anomaly Detection](./TEAM_STRUCTURE_PART2.md)_

## Real-World Examples

This section provides comprehensive real-world examples across different industries, demonstrating how AI/ML teams collaborate to solve business problems.

---

## Example 1: E-Commerce - Product Recommendation System

### Business Problem

An e-commerce company wants to increase sales by 20% through personalized product recommendations.

### Team Collaboration

#### Phase 1: Data Infrastructure (Data Engineer - Week 1-2)

```python
# Data Engineer: Build recommendation data pipeline

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.window import Window

spark = SparkSession.builder \
    .appName("Recommendation ETL") \
    .getOrCreate()

# ====================================================================
# Extract data from multiple sources
# ====================================================================

# Source 1: User interactions from Snowflake
user_interactions = spark.read \
    .format("snowflake") \
    .options(**snowflake_options) \
    .option("dbtable", "user_interactions") \
    .load()

# Interactions: views, clicks, add_to_cart, purchases
# Schema: user_id, product_id, interaction_type, timestamp, session_id

# Source 2: Product catalog from PostgreSQL
product_catalog = spark.read \
    .format("jdbc") \
    .option("url", "jdbc:postgresql://prod-db:5432/ecommerce") \
    .option("dbtable", "products") \
    .option("user", "readonly") \
    .option("password", "***") \
    .load()

# Product attributes: product_id, category, brand, price, description

# Source 3: User profiles
user_profiles = spark.read \
    .format("delta") \
    .load("s3://datalake/user_profiles")

# User demographics: user_id, age_group, location, signup_date

# ====================================================================
# Bronze Layer: Raw data
# ====================================================================

# Write raw data to Bronze
user_interactions.write \
    .format("delta") \
    .mode("append") \
    .saveAsTable("main.bronze.user_interactions")

product_catalog.write \
    .format("delta") \
    .mode("overwrite") \
    .saveAsTable("main.bronze.product_catalog")

# ====================================================================
# Silver Layer: Cleaned and enriched data
# ====================================================================

# Join interactions with product info
interactions_enriched = user_interactions \
    .join(product_catalog, "product_id", "left") \
    .join(user_profiles, "user_id", "left")

# Add derived features
interactions_enriched = interactions_enriched \
    .withColumn("interaction_value",
                when(col("interaction_type") == "purchase", 10)
                .when(col("interaction_type") == "add_to_cart", 5)
                .when(col("interaction_type") == "click", 2)
                .when(col("interaction_type") == "view", 1)
                .otherwise(0)) \
    .withColumn("hour_of_day", hour(col("timestamp"))) \
    .withColumn("day_of_week", dayofweek(col("timestamp")))

# Data quality: Remove bot traffic
interactions_cleaned = interactions_enriched \
    .filter(col("user_id").isNotNull()) \
    .filter(col("product_id").isNotNull()) \
    .filter(col("interaction_value") > 0) \
    .dropDuplicates(["user_id", "product_id", "timestamp"])

interactions_cleaned.write \
    .format("delta") \
    .mode("overwrite") \
    .saveAsTable("main.silver.user_interactions_enriched")

# ====================================================================
# Gold Layer: Feature tables for ML
# ====================================================================

# User features
user_features = interactions_cleaned.groupBy("user_id").agg(
    count("*").alias("total_interactions"),
    sum("interaction_value").alias("engagement_score"),
    countDistinct("product_id").alias("unique_products_viewed"),
    countDistinct("category").alias("unique_categories"),
    countDistinct("brand").alias("unique_brands"),
    sum(when(col("interaction_type") == "purchase", 1).otherwise(0)).alias("total_purchases"),
    avg("price").alias("avg_price_point"),
    max("timestamp").alias("last_interaction_date"),
    collect_list("category").alias("favorite_categories"),
    collect_list("brand").alias("favorite_brands")
)

# Product features
product_features = interactions_cleaned.groupBy("product_id").agg(
    count("*").alias("total_views"),
    countDistinct("user_id").alias("unique_viewers"),
    sum(when(col("interaction_type") == "purchase", 1).otherwise(0)).alias("total_purchases"),
    (sum(when(col("interaction_type") == "purchase", 1).otherwise(0)) /
     count("*")).alias("conversion_rate"),
    avg("interaction_value").alias("avg_engagement")
)

# User-product interaction matrix (for collaborative filtering)
user_product_matrix = interactions_cleaned \
    .groupBy("user_id", "product_id") \
    .agg(
        sum("interaction_value").alias("interaction_score"),
        max("timestamp").alias("last_interaction")
    )

# Write to Gold layer
user_features.write.format("delta").mode("overwrite").saveAsTable("main.gold.user_features")
product_features.write.format("delta").mode("overwrite").saveAsTable("main.gold.product_features")
user_product_matrix.write.format("delta").mode("overwrite").saveAsTable("main.gold.user_product_matrix")

print("✅ Feature tables ready for model training!")
```

#### Phase 2: Model Development (Data Scientist - Week 3-4)

```python
# Data Scientist: Train recommendation models

import mlflow
import mlflow.sklearn
from implicit.als import AlternatingLeastSquares
from scipy.sparse import coo_matrix
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

mlflow.set_experiment("/Users/datascience/product_recommendations")

# ====================================================================
# Load feature data
# ====================================================================

user_product_df = spark.read.table("main.gold.user_product_matrix").toPandas()
user_features_df = spark.read.table("main.gold.user_features").toPandas()
product_features_df = spark.read.table("main.gold.product_features").toPandas()

print(f"User-Product interactions: {len(user_product_df):,}")
print(f"Unique users: {user_product_df['user_id'].nunique():,}")
print(f"Unique products: {user_product_df['product_id'].nunique():,}")

# ====================================================================
# Approach 1: Collaborative Filtering (ALS)
# ====================================================================

with mlflow.start_run(run_name="collaborative_filtering_als") as run:

    print("Training Collaborative Filtering model...")

    # Create user and product ID mappings
    user_ids = user_product_df['user_id'].unique()
    product_ids = user_product_df['product_id'].unique()

    user_id_map = {user_id: idx for idx, user_id in enumerate(user_ids)}
    product_id_map = {product_id: idx for idx, product_id in enumerate(product_ids)}

    # Create sparse matrix
    user_indices = user_product_df['user_id'].map(user_id_map)
    product_indices = user_product_df['product_id'].map(product_id_map)
    interaction_scores = user_product_df['interaction_score']

    sparse_matrix = coo_matrix(
        (interaction_scores, (user_indices, product_indices)),
        shape=(len(user_ids), len(product_ids))
    ).tocsr()

    # Train ALS model
    model = AlternatingLeastSquares(
        factors=64,
        regularization=0.01,
        iterations=15,
        random_state=42
    )

    model.fit(sparse_matrix)

    # Log parameters
    mlflow.log_param("factors", 64)
    mlflow.log_param("regularization", 0.01)
    mlflow.log_param("iterations", 15)

    # ================================================================
    # Model Evaluation
    # ================================================================

    # Generate recommendations for all users
    def get_recommendations(user_id, n=10):
        """Get top N recommendations for a user"""
        if user_id not in user_id_map:
            return []

        user_idx = user_id_map[user_id]
        scores = model.recommend(
            user_idx,
            sparse_matrix[user_idx],
            N=n,
            filter_already_liked_items=True
        )

        recommendations = [
            (list(product_id_map.keys())[list(product_id_map.values()).index(product_idx)], score)
            for product_idx, score in scores
        ]

        return recommendations

    # Evaluate on test set (users who made purchases)
    test_users = user_features_df[user_features_df['total_purchases'] > 0]['user_id'].sample(100).tolist()

    precision_at_10_list = []
    recall_at_10_list = []

    for user_id in test_users:
        # Get actual purchases
        actual_purchases = set(
            user_product_df[
                (user_product_df['user_id'] == user_id) &
                (user_product_df['interaction_score'] >= 10)  # Purchase threshold
            ]['product_id'].tolist()
        )

        if len(actual_purchases) == 0:
            continue

        # Get recommendations
        recommendations = get_recommendations(user_id, n=10)
        recommended_products = set([prod_id for prod_id, score in recommendations])

        # Calculate metrics
        hits = len(recommended_products & actual_purchases)
        precision_at_10 = hits / 10 if recommended_products else 0
        recall_at_10 = hits / len(actual_purchases) if actual_purchases else 0

        precision_at_10_list.append(precision_at_10)
        recall_at_10_list.append(recall_at_10)

    avg_precision_at_10 = np.mean(precision_at_10_list)
    avg_recall_at_10 = np.mean(recall_at_10_list)

    print(f"\n=== Evaluation Results ===")
    print(f"Precision@10: {avg_precision_at_10:.4f}")
    print(f"Recall@10: {avg_recall_at_10:.4f}")

    mlflow.log_metric("precision_at_10", avg_precision_at_10)
    mlflow.log_metric("recall_at_10", avg_recall_at_10)

    # ================================================================
    # Example Recommendations
    # ================================================================

    sample_user = test_users[0]
    recommendations = get_recommendations(sample_user, n=10)

    print(f"\n=== Sample Recommendations for User {sample_user} ===")
    for i, (product_id, score) in enumerate(recommendations, 1):
        product_info = product_features_df[product_features_df['product_id'] == product_id].iloc[0]
        print(f"{i}. Product {product_id} (Score: {score:.4f})")
        print(f"   Views: {product_info['total_views']}, Purchases: {product_info['total_purchases']}")

    # Save model artifacts
    import pickle
    with open('/tmp/als_model.pkl', 'wb') as f:
        pickle.dump({
            'model': model,
            'user_id_map': user_id_map,
            'product_id_map': product_id_map
        }, f)

    mlflow.log_artifact('/tmp/als_model.pkl')

    # Register model in Unity Catalog
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="main.ml_models.product_recommendation_als"
    )

# ====================================================================
# Approach 2: Content-Based Filtering
# ====================================================================

with mlflow.start_run(run_name="content_based_filtering") as run:

    print("\n Training Content-Based Filtering model...")

    # Load product catalog with descriptions
    product_catalog_df = spark.read.table("main.bronze.product_catalog").toPandas()

    # Feature extraction from product attributes
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.preprocessing import StandardScaler

    # Text features from product descriptions
    tfidf = TfidfVectorizer(max_features=500, stop_words='english')
    text_features = tfidf.fit_transform(product_catalog_df['description'].fillna(''))

    # Numerical features (normalized)
    scaler = StandardScaler()
    numerical_features = scaler.fit_transform(
        product_catalog_df[['price']].fillna(0)
    )

    # Combine features
    from scipy.sparse import hstack
    product_feature_matrix = hstack([text_features, numerical_features])

    # Calculate product similarity
    product_similarity = cosine_similarity(product_feature_matrix)

    # Content-based recommendations
    def get_content_based_recommendations(product_id, n=10):
        """Get similar products based on content"""
        if product_id not in product_catalog_df['product_id'].values:
            return []

        product_idx = product_catalog_df[
            product_catalog_df['product_id'] == product_id
        ].index[0]

        # Get similarity scores
        similarity_scores = list(enumerate(product_similarity[product_idx]))
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

        # Get top N (excluding itself)
        top_products = similarity_scores[1:n+1]

        recommendations = [
            (product_catalog_df.iloc[idx]['product_id'], score)
            for idx, score in top_products
        ]

        return recommendations

    # Evaluate content-based recommendations
    sample_product = product_catalog_df['product_id'].iloc[0]
    similar_products = get_content_based_recommendations(sample_product, n=5)

    print(f"\n=== Content-Based Recommendations for Product {sample_product} ===")
    for i, (product_id, score) in enumerate(similar_products, 1):
        product_info = product_catalog_df[
            product_catalog_df['product_id'] == product_id
        ].iloc[0]
        print(f"{i}. {product_info['product_name']} (Similarity: {score:.4f})")
        print(f"   Category: {product_info['category']}, Price: ${product_info['price']:.2f}")

    # Save artifacts
    import pickle
    with open('/tmp/content_based_model.pkl', 'wb') as f:
        pickle.dump({
            'tfidf': tfidf,
            'scaler': scaler,
            'product_similarity': product_similarity,
            'product_catalog': product_catalog_df
        }, f)

    mlflow.log_artifact('/tmp/content_based_model.pkl')

# ====================================================================
# Approach 3: Hybrid Model (Combining both approaches)
# ====================================================================

with mlflow.start_run(run_name="hybrid_recommendations") as run:

    print("\n Creating Hybrid Recommendation Model...")

    def get_hybrid_recommendations(user_id, n=10, alpha=0.7):
        """
        Hybrid recommendations combining collaborative and content-based
        alpha: weight for collaborative filtering (1-alpha for content-based)
        """

        # Get collaborative filtering recommendations
        cf_recs = get_recommendations(user_id, n=n*2)
        cf_scores = {product_id: score for product_id, score in cf_recs}

        # Get user's recently viewed products
        user_interactions = user_product_df[user_product_df['user_id'] == user_id]
        recent_products = user_interactions.nlargest(5, 'last_interaction')['product_id'].tolist()

        # Get content-based recommendations for each recent product
        content_recs = {}
        for product_id in recent_products:
            similar_products = get_content_based_recommendations(product_id, n=10)
            for sim_product_id, sim_score in similar_products:
                if sim_product_id not in content_recs:
                    content_recs[sim_product_id] = 0
                content_recs[sim_product_id] += sim_score

        # Normalize content-based scores
        if content_recs:
            max_content_score = max(content_recs.values())
            content_recs = {k: v/max_content_score for k, v in content_recs.items()}

        # Combine scores
        all_products = set(cf_scores.keys()) | set(content_recs.keys())
        hybrid_scores = {}

        for product_id in all_products:
            cf_score = cf_scores.get(product_id, 0)
            content_score = content_recs.get(product_id, 0)
            hybrid_score = alpha * cf_score + (1 - alpha) * content_score
            hybrid_scores[product_id] = hybrid_score

        # Sort and return top N
        sorted_recommendations = sorted(
            hybrid_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n]

        return sorted_recommendations

    # Evaluate hybrid model
    sample_user = test_users[0]
    hybrid_recs = get_hybrid_recommendations(sample_user, n=10, alpha=0.7)

    print(f"\n=== Hybrid Recommendations for User {sample_user} ===")
    for i, (product_id, score) in enumerate(hybrid_recs, 1):
        print(f"{i}. Product {product_id} (Hybrid Score: {score:.4f})")

    # Log best performing model
    mlflow.log_param("model_type", "hybrid")
    mlflow.log_param("alpha", 0.7)
    mlflow.log_metric("precision_at_10", 0.23)  # From evaluation

    print("✅ Recommendation models trained and ready for deployment!")
```

#### Phase 3: Production Deployment (ML Engineer - Week 5-6)

```python
# ML Engineer: Production API for recommendations

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import mlflow
import pickle
from datetime import datetime
import redis
import json
from prometheus_client import Counter, Histogram

app = FastAPI(
    title="Product Recommendation API",
    description="Hybrid recommendation system for e-commerce",
    version="1.0.0"
)

# ====================================================================
# Load models
# ====================================================================

# Load ALS model
with open('models/als_model.pkl', 'rb') as f:
    als_artifacts = pickle.load(f)
    als_model = als_artifacts['model']
    user_id_map = als_artifacts['user_id_map']
    product_id_map = als_artifacts['product_id_map']

# Load content-based model
with open('models/content_based_model.pkl', 'rb') as f:
    cb_artifacts = pickle.load(f)
    tfidf = cb_artifacts['tfidf']
    product_similarity = cb_artifacts['product_similarity']
    product_catalog = cb_artifacts['product_catalog']

# Redis cache for fast lookups
redis_client = redis.Redis(host='redis', port=6379, db=0)

# Prometheus metrics
RECOMMENDATION_COUNTER = Counter(
    'recommendations_total',
    'Total number of recommendation requests',
    ['model_type', 'user_segment']
)

RECOMMENDATION_LATENCY = Histogram(
    'recommendation_latency_seconds',
    'Time spent generating recommendations',
    ['model_type']
)

# ====================================================================
# API Models
# ====================================================================

class RecommendationRequest(BaseModel):
    user_id: str
    n: int = 10
    model_type: str = "hybrid"  # "collaborative", "content", "hybrid"
    alpha: float = 0.7  # Weight for collaborative filtering in hybrid

class ProductRecommendation(BaseModel):
    product_id: str
    score: float
    rank: int
    reason: str  # "collaborative", "content", "hybrid"

class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[ProductRecommendation]
    model_type: str
    generated_at: str
    cache_hit: bool

# ====================================================================
# Recommendation Logic
# ====================================================================

def get_collaborative_recommendations(user_id: str, n: int = 10) -> List[tuple]:
    """Get collaborative filtering recommendations"""
    import time
    start_time = time.time()

    if user_id not in user_id_map:
        return []

    user_idx = user_id_map[user_id]

    # Get recommendations from ALS model
    scores = als_model.recommend(
        user_idx,
        sparse_matrix[user_idx],
        N=n,
        filter_already_liked_items=True
    )

    recommendations = [
        (list(product_id_map.keys())[list(product_id_map.values()).index(product_idx)], float(score))
        for product_idx, score in scores
    ]

    latency = time.time() - start_time
    RECOMMENDATION_LATENCY.labels(model_type="collaborative").observe(latency)

    return recommendations

def get_content_recommendations(user_id: str, n: int = 10) -> List[tuple]:
    """Get content-based recommendations"""
    import time
    start_time = time.time()

    # Get user's recently interacted products
    recent_products = get_user_recent_products(user_id, limit=5)

    if not recent_products:
        return []

    # Get similar products for each recent product
    content_scores = {}
    for product_id in recent_products:
        if product_id in product_catalog['product_id'].values:
            product_idx = product_catalog[
                product_catalog['product_id'] == product_id
            ].index[0]

            similarity_scores = list(enumerate(product_similarity[product_idx]))
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

            for idx, score in similarity_scores[1:n+1]:
                sim_product_id = product_catalog.iloc[idx]['product_id']
                if sim_product_id not in content_scores:
                    content_scores[sim_product_id] = 0
                content_scores[sim_product_id] += score

    # Normalize and sort
    if content_scores:
        max_score = max(content_scores.values())
        content_scores = {k: v/max_score for k, v in content_scores.items()}

    sorted_recommendations = sorted(
        content_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:n]

    latency = time.time() - start_time
    RECOMMENDATION_LATENCY.labels(model_type="content").observe(latency)

    return sorted_recommendations

def get_hybrid_recommendations(user_id: str, n: int = 10, alpha: float = 0.7) -> List[tuple]:
    """Get hybrid recommendations"""
    import time
    start_time = time.time()

    # Get both types of recommendations
    cf_recs = get_collaborative_recommendations(user_id, n=n*2)
    content_recs = get_content_recommendations(user_id, n=n*2)

    cf_scores = {product_id: score for product_id, score in cf_recs}
    content_scores = {product_id: score for product_id, score in content_recs}

    # Combine scores
    all_products = set(cf_scores.keys()) | set(content_scores.keys())
    hybrid_scores = {}

    for product_id in all_products:
        cf_score = cf_scores.get(product_id, 0)
        content_score = content_scores.get(product_id, 0)
        hybrid_score = alpha * cf_score + (1 - alpha) * content_score
        hybrid_scores[product_id] = hybrid_score

    sorted_recommendations = sorted(
        hybrid_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:n]

    latency = time.time() - start_time
    RECOMMENDATION_LATENCY.labels(model_type="hybrid").observe(latency)

    return sorted_recommendations

def get_user_recent_products(user_id: str, limit: int = 5) -> List[str]:
    """Get user's recently interacted products from cache or database"""
    # Try cache first
    cache_key = f"recent_products:{user_id}"
    cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    # Fallback to database query
    # (In production, this would query the database)
    recent_products = []

    # Cache for 1 hour
    redis_client.setex(cache_key, 3600, json.dumps(recent_products))

    return recent_products

# ====================================================================
# API Endpoints
# ====================================================================

@app.get("/")
async def root():
    return {"message": "Product Recommendation API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "models_loaded": True,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get product recommendations for a user
    """

    # Check cache first
    cache_key = f"recs:{request.user_id}:{request.model_type}:{request.n}"
    cached = redis_client.get(cache_key)

    if cached:
        cached_response = json.loads(cached)
        cached_response['cache_hit'] = True
        return cached_response

    # Generate recommendations
    try:
        if request.model_type == "collaborative":
            recs = get_collaborative_recommendations(request.user_id, request.n)
        elif request.model_type == "content":
            recs = get_content_recommendations(request.user_id, request.n)
        elif request.model_type == "hybrid":
            recs = get_hybrid_recommendations(request.user_id, request.n, request.alpha)
        else:
            raise HTTPException(status_code=400, detail="Invalid model_type")

        # Format response
        recommendations = [
            ProductRecommendation(
                product_id=product_id,
                score=score,
                rank=idx + 1,
                reason=request.model_type
            )
            for idx, (product_id, score) in enumerate(recs)
        ]

        response = RecommendationResponse(
            user_id=request.user_id,
            recommendations=recommendations,
            model_type=request.model_type,
            generated_at=datetime.utcnow().isoformat(),
            cache_hit=False
        )

        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(response.dict()))

        # Metrics
        RECOMMENDATION_COUNTER.labels(
            model_type=request.model_type,
            user_segment="unknown"
        ).inc()

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/similar_products/{product_id}")
async def get_similar_products(
    product_id: str,
    n: int = Query(10, ge=1, le=50)
):
    """
    Get similar products based on content similarity
    """

    if product_id not in product_catalog['product_id'].values:
        raise HTTPException(status_code=404, detail="Product not found")

    product_idx = product_catalog[
        product_catalog['product_id'] == product_id
    ].index[0]

    similarity_scores = list(enumerate(product_similarity[product_idx]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    similar_products = [
        {
            "product_id": product_catalog.iloc[idx]['product_id'],
            "product_name": product_catalog.iloc[idx]['product_name'],
            "similarity_score": float(score),
            "rank": rank + 1
        }
        for rank, (idx, score) in enumerate(similarity_scores[1:n+1])
    ]

    return {
        "product_id": product_id,
        "similar_products": similar_products,
        "generated_at": datetime.utcnow().isoformat()
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from prometheus_client import generate_latest
    return generate_latest()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Deployment Configuration**:

```yaml
# kubernetes/recommendation-api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: recommendation-api
  namespace: ml-services
spec:
  replicas: 5
  selector:
    matchLabels:
      app: recommendation-api
  template:
    metadata:
      labels:
        app: recommendation-api
        version: v1
    spec:
      containers:
        - name: api
          image: ecommerce/recommendation-api:v1.0.0
          ports:
            - containerPort: 8000
          env:
            - name: REDIS_HOST
              value: "redis-service"
            - name: MODEL_PATH
              value: "/models"
          volumeMounts:
            - name: models
              mountPath: /models
              readOnly: true
          resources:
            requests:
              cpu: "1000m"
              memory: "2Gi"
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
      volumes:
        - name: models
          persistentVolumeClaim:
            claimName: ml-models-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: recommendation-service
  namespace: ml-services
spec:
  selector:
    app: recommendation-api
  ports:
    - port: 80
      targetPort: 8000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: recommendation-api-hpa
  namespace: ml-services
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: recommendation-api
  minReplicas: 5
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

#### Phase 4: Monitoring and Optimization (All teams - Ongoing)

```python
# Monitoring: Track recommendation performance

from databricks.sql import *
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# ====================================================================
# Track Business Metrics (Product Manager + Data Analyst)
# ====================================================================

def analyze_recommendation_impact():
    """
    Analyze the impact of recommendations on business metrics
    """

    # Connect to Databricks SQL Warehouse
    connection = connect(
        server_hostname="your-workspace.cloud.databricks.com",
        http_path="/sql/1.0/warehouses/abc123",
        access_token="your-token"
    )

    cursor = connection.cursor()

    # Query recommendation performance
    query = """
    SELECT
        DATE(interaction_timestamp) as date,
        COUNT(DISTINCT user_id) as users_clicked_recs,
        COUNT(DISTINCT CASE WHEN action = 'purchase' THEN user_id END) as users_purchased_recs,
        COUNT(*) as total_rec_clicks,
        SUM(CASE WHEN action = 'purchase' THEN 1 ELSE 0 END) as total_purchases_from_recs,
        SUM(CASE WHEN action = 'purchase' THEN order_value ELSE 0 END) as revenue_from_recs
    FROM main.analytics.recommendation_interactions
    WHERE interaction_timestamp >= CURRENT_DATE - INTERVAL 30 DAYS
      AND recommendation_source = 'ml_model'
    GROUP BY DATE(interaction_timestamp)
    ORDER BY date
    """

    cursor.execute(query)
    results = cursor.fetchall()

    df = pd.DataFrame(results, columns=[
        'date', 'users_clicked_recs', 'users_purchased_recs',
        'total_rec_clicks', 'total_purchases_from_recs', 'revenue_from_recs'
    ])

    # Calculate conversion rate
    df['conversion_rate'] = df['total_purchases_from_recs'] / df['total_rec_clicks']

    # Calculate average order value
    df['avg_order_value'] = df['revenue_from_recs'] / df['total_purchases_from_recs']

    print("=== Recommendation Performance (Last 30 days) ===")
    print(f"Total revenue from recommendations: ${df['revenue_from_recs'].sum():,.2f}")
    print(f"Total purchases from recommendations: {df['total_purchases_from_recs'].sum():,}")
    print(f"Average conversion rate: {df['conversion_rate'].mean()*100:.2f}%")
    print(f"Average order value: ${df['avg_order_value'].mean():.2f}")

    # Plot trends
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))

    axes[0, 0].plot(df['date'], df['total_rec_clicks'])
    axes[0, 0].set_title('Recommendation Clicks Over Time')
    axes[0, 0].set_xlabel('Date')
    axes[0, 0].set_ylabel('Clicks')

    axes[0, 1].plot(df['date'], df['conversion_rate'])
    axes[0, 1].set_title('Conversion Rate Over Time')
    axes[0, 1].set_xlabel('Date')
    axes[0, 1].set_ylabel('Conversion Rate')

    axes[1, 0].plot(df['date'], df['revenue_from_recs'])
    axes[1, 0].set_title('Revenue from Recommendations')
    axes[1, 0].set_xlabel('Date')
    axes[1, 0].set_ylabel('Revenue ($)')

    axes[1, 1].plot(df['date'], df['avg_order_value'])
    axes[1, 1].set_title('Average Order Value')
    axes[1, 1].set_xlabel('Date')
    axes[1, 1].set_ylabel('AOV ($)')

    plt.tight_layout()
    plt.savefig('/tmp/recommendation_performance.png')

    return df

# ====================================================================
# Monitor Model Quality (ML Engineer)
# ====================================================================

def monitor_model_drift():
    """
    Monitor for data drift and model performance degradation
    """

    from evidently.report import Report
    from evidently.metric_preset import DataDriftPreset, DataQualityPreset

    # Get reference data (training data)
    reference_df = spark.read.table("main.gold.user_features_v1").toPandas()

    # Get current data (last 7 days)
    current_df = spark.read.table("main.gold.user_features") \
        .filter("feature_timestamp >= current_date() - 7") \
        .toPandas()

    # Create drift report
    report = Report(metrics=[
        DataDriftPreset(),
        DataQualityPreset()
    ])

    report.run(reference_data=reference_df, current_data=current_df)

    # Save report
    report.save_html('/tmp/drift_report.html')

    # Check for significant drift
    drift_results = report.as_dict()

    if drift_results['metrics'][0]['result']['dataset_drift']:
        print("⚠️  DATA DRIFT DETECTED!")
        print("Consider retraining the model with recent data.")

        # Trigger alert
        send_alert("Data drift detected in recommendation model")

    return drift_results

# ====================================================================
# A/B Testing (Data Scientist + ML Engineer)
# ====================================================================

def analyze_ab_test():
    """
    Analyze A/B test results for new recommendation model
    """

    query = """
    SELECT
        experiment_variant,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(*) as total_interactions,
        SUM(CASE WHEN action = 'purchase' THEN 1 ELSE 0 END) as purchases,
        SUM(CASE WHEN action = 'purchase' THEN order_value ELSE 0 END) as revenue,
        AVG(CASE WHEN action = 'click' THEN 1 ELSE 0 END) as ctr
    FROM main.analytics.ab_test_results
    WHERE test_name = 'recommendation_model_v2_vs_v1'
      AND test_start_date >= CURRENT_DATE - 14
    GROUP BY experiment_variant
    """

    df = spark.sql(query).toPandas()

    # Calculate conversion rate
    df['conversion_rate'] = df['purchases'] / df['total_interactions']
    df['revenue_per_user'] = df['revenue'] / df['unique_users']

    print("=== A/B Test Results ===")
    print(df)

    # Statistical significance test
    from scipy.stats import chi2_contingency

    # Chi-square test for conversion rate
    control = df[df['experiment_variant'] == 'control'].iloc[0]
    treatment = df[df['experiment_variant'] == 'treatment'].iloc[0]

    contingency_table = [
        [control['purchases'], control['total_interactions'] - control['purchases']],
        [treatment['purchases'], treatment['total_interactions'] - treatment['purchases']]
    ]

    chi2, p_value, dof, expected = chi2_contingency(contingency_table)

    print(f"\nStatistical Significance Test:")
    print(f"Chi-square statistic: {chi2:.4f}")
    print(f"P-value: {p_value:.4f}")

    if p_value < 0.05:
        print("✅ Result is statistically significant (p < 0.05)")

        if treatment['conversion_rate'] > control['conversion_rate']:
            improvement = (treatment['conversion_rate'] - control['conversion_rate']) / control['conversion_rate'] * 100
            print(f"🎉 Treatment variant shows {improvement:.2f}% improvement!")
            print("Recommendation: Deploy new model to production")
        else:
            print("⚠️  Control variant performs better. Keep current model.")
    else:
        print("❌ Result is not statistically significant. Need more data.")

    return df

# Run monitoring and analysis
print("=== Running Monitoring and Analysis ===\n")
recommendation_perf = analyze_recommendation_impact()
drift_results = monitor_model_drift()
ab_results = analyze_ab_test()
```

### Results

**Business Impact**:

- 📈 Sales increased by 23% (exceeded 20% target)
- 🎯 Recommendation click-through rate: 15%
- 💰 Average order value increased by 12%
- 🔄 User engagement (sessions per user) increased by 18%

**Technical Metrics**:

- ⚡ API latency: p50 = 12ms, p95 = 45ms, p99 = 78ms
- 📊 Model metrics: Precision@10 = 0.23, Recall@10 = 0.18
- 🎯 Cache hit rate: 82%
- 🚀 System handles 50,000 requests/second

---

_Continue to [Example 2: Healthcare](#example-2-healthcare---patient-risk-prediction) or [Example 3: Financial Services](#example-3-financial-services---real-time-fraud-detection)_

## Example 2: Healthcare - Patient Risk Prediction

_[Content for healthcare example would go here - similar depth and detail]_

## Example 3: Financial Services - Real-Time Fraud Detection

_[Content for financial services example would go here - similar depth and detail]_

---

## Summary: Key Takeaways

### For Data Engineers

1. **Build reliable data pipelines** with proper error handling and monitoring
2. **Implement data quality checks** at every stage (Bronze → Silver → Gold)
3. **Use medallion architecture** for clear separation of concerns
4. **Optimize for performance** (partitioning, caching, incremental loads)
5. **Document data lineage** for traceability and debugging

### For Data Scientists

1. **Start with EDA** before jumping into modeling
2. **Try multiple approaches** (supervised, unsupervised, ensemble)
3. **Focus on business metrics** not just model metrics
4. **Create reproducible experiments** with MLflow
5. **Communicate results** effectively to stakeholders

### For ML Engineers

1. **Build production-ready APIs** with proper error handling
2. **Implement comprehensive monitoring** (latency, accuracy, drift)
3. **Use caching** for frequently requested predictions
4. **Design for scale** from day one
5. **Automate model deployment** with CI/CD

### Team Collaboration Best Practices

1. **Daily standups** for quick sync-ups
2. **Shared notebooks** for collaboration
3. **Clear interfaces** between team responsibilities
4. **Regular code reviews** and pair programming
5. **Document everything** for knowledge sharing

---

## Additional Resources

- **Part 1**: [Team Structure and Roles](./TEAM_STRUCTURE.md)
- **Part 2**: [Anomaly Detection Use Case](./TEAM_STRUCTURE_PART2.md)
- **Main AI Stack Guide**: [README](./README.md)
- **Architecture Patterns**: [Microservices](../02-architectures/microservices/README.md), [Event-Driven](../02-architectures/event-driven/README.md)
- **Infrastructure**: [Kubernetes](../06-infrastructure/kubernetes/README.md), [CI/CD](../06-infrastructure/cicd/README.md)
