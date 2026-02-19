# Monitoring and Observability

## 📋 What is Monitoring?

**Monitoring** is the practice of collecting, analyzing, and acting on data about your systems' health and performance. **Observability** goes beyond monitoring by helping you understand _why_ something is happening, not just _what_ is happening.

## 🎯 Key Concepts

### Simple Analogy

Think of monitoring like the dashboard in your car:

- **Metrics (Speedometer)** - How fast are you going?
- **Logs (Trip computer)** - Detailed record of your journey
- **Traces (GPS history)** - Path you took from A to B
- **Alerts (Warning lights)** - Notify when something needs attention
- **Dashboards (Instrument cluster)** - All information at a glance

### The Three Pillars of Observability

#### 1. Metrics

Numerical measurements over time:

- CPU usage: 45%
- Response time: 234ms
- Request rate: 1000 req/sec
- Memory usage: 2.3 GB

#### 2. Logs

Text records of discrete events:

```
2024-01-15 10:23:45 INFO User login successful: user_id=12345
2024-01-15 10:23:46 ERROR Database connection failed: timeout after 30s
2024-01-15 10:23:47 WARN Retry attempt 1/3 for failed connection
```

#### 3. Traces

Record of a request's journey through distributed systems:

```
User Request → API Gateway → Auth Service → User Service → Database
     100ms         20ms          50ms           30ms        150ms
Total: 350ms
```

## 🛠️ Core Monitoring Tools

### 1. Prometheus (Metrics)

**What is Prometheus?**
Open-source monitoring system with time-series database.

**Key Features:**

- Pull-based metrics collection
- Powerful query language (PromQL)
- Built-in alerting
- Service discovery
- Multi-dimensional data model

**Architecture:**

```
Applications → Exporters → Prometheus → Grafana (Visualization)
                              ↓
                         Alertmanager (Alerts)
```

#### Installation (Docker)

```yaml
# docker-compose.yml
version: "3"
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

volumes:
  prometheus-data:
```

**prometheus.yml:**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - "alertmanager:9093"

# Load rules
rule_files:
  - "alerts.yml"

# Scrape configurations
scrape_configs:
  # Prometheus itself
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Node Exporter (system metrics)
  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  # Application metrics
  - job_name: "app"
    static_configs:
      - targets: ["app:8080"]
    metrics_path: "/metrics"

  # Kubernetes service discovery
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

#### Instrumenting Applications

**Python (Flask):**

```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from flask import Flask, Response
import time

app = Flask(__name__)

# Define metrics
REQUEST_COUNT = Counter(
    'app_requests_total',
    'Total number of requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'app_request_latency_seconds',
    'Request latency',
    ['endpoint']
)

ACTIVE_USERS = Gauge(
    'app_active_users',
    'Number of active users'
)

@app.route('/api/data')
def get_data():
    start = time.time()

    # Your business logic
    result = {"data": "value"}

    # Record metrics
    duration = time.time() - start
    REQUEST_LATENCY.labels(endpoint='/api/data').observe(duration)
    REQUEST_COUNT.labels(method='GET', endpoint='/api/data', status=200).inc()

    return result

@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

**Node.js (Express):**

```javascript
const express = require("express");
const promClient = require("prom-client");

const app = express();

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);

    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });

  next();
});

// Your routes
app.get("/api/data", (req, res) => {
  res.json({ data: "value" });
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
```

**Go:**

```go
package main

import (
    "net/http"
    "time"

    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )

    httpRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "Duration of HTTP requests",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "endpoint"},
    )
)

func trackMetrics(endpoint string, handler http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        handler(w, r)

        duration := time.Since(start).Seconds()
        httpRequestDuration.WithLabelValues(r.Method, endpoint).Observe(duration)
        httpRequestsTotal.WithLabelValues(r.Method, endpoint, "200").Inc()
    }
}

func main() {
    http.HandleFunc("/api/data", trackMetrics("/api/data", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"data": "value"}`))
    }))

    http.Handle("/metrics", promhttp.Handler())

    http.ListenAndServe(":8080", nil)
}
```

#### PromQL Queries

```promql
# CPU usage percentage
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# Request rate (requests per second)
rate(http_requests_total[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# Top 5 endpoints by request count
topk(5, sum by (endpoint) (rate(http_requests_total[5m])))

# Prediction (linear)
predict_linear(node_filesystem_free_bytes[1h], 4 * 3600)
```

#### Alerting Rules

**alerts.yml:**

```yaml
groups:
  - name: example_alerts
    interval: 30s
    rules:
      # High CPU usage
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is {{ $value }}%"

      # High memory usage
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ $value }}%"

      # Service down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} down"
          description: "{{ $labels.instance }} has been down for more than 1 minute"

      # High error rate
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100 > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate"
          description: "Error rate is {{ $value }}%"

      # Slow response time
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time"
          description: "95th percentile latency is {{ $value }}s"

      # Disk space low
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
          description: "Only {{ $value }}% disk space remaining"
```

### 2. Grafana (Visualization)

**What is Grafana?**
Open-source analytics and visualization platform.

**Key Features:**

- Beautiful dashboards
- Multiple data source support (Prometheus, Elasticsearch, InfluxDB)
- Alerting
- User management
- Templating

#### Installation (Docker)

```yaml
# docker-compose.yml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning

volumes:
  grafana-data:
```

#### Dashboard Configuration

**datasource.yml** (Provisioning):

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
```

**Dashboard JSON** (Example):

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m]))",
            "refId": "A"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100",
            "refId": "A"
          }
        ],
        "type": "graph"
      },
      {
        "title": "95th Percentile Latency",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "refId": "A"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

### 3. ELK Stack (Logs)

**ELK = Elasticsearch + Logstash + Kibana**

#### Architecture

```
Applications → Filebeat/Fluentd → Logstash → Elasticsearch → Kibana
                                      ↓
                                   Parsing
                                   Filtering
                                   Enrichment
```

#### Installation (Docker)

```yaml
# docker-compose.yml
version: "3"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    ports:
      - "5000:5000"
      - "9600:9600"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - logstash

volumes:
  elasticsearch-data:
```

#### Logstash Configuration

**logstash/pipeline/logstash.conf:**

```ruby
input {
  beats {
    port => 5000
  }
}

filter {
  # Parse JSON logs
  if [message] =~ /^\{.*\}$/ {
    json {
      source => "message"
    }
  }

  # Parse common log format
  grok {
    match => { "message" => "%{COMBINEDAPACHELOG}" }
  }

  # Parse timestamp
  date {
    match => [ "timestamp", "ISO8601" ]
    target => "@timestamp"
  }

  # Add GeoIP data
  geoip {
    source => "client_ip"
  }

  # Remove sensitive data
  mutate {
    remove_field => ["password", "credit_card"]
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }

  # Debug output
  stdout {
    codec => rubydebug
  }
}
```

#### Filebeat Configuration

**filebeat/filebeat.yml:**

```yaml
filebeat.inputs:
  - type: container
    paths:
      - "/var/lib/docker/containers/*/*.log"
    processors:
      - add_docker_metadata: ~

  - type: log
    enabled: true
    paths:
      - /var/log/*.log
      - /var/log/app/*.log

output.logstash:
  hosts: ["logstash:5000"]
```

#### Application Logging Best Practices

**Structured Logging (Python):**

```python
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }

        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id

        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id

        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)

        return json.dumps(log_data)

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Usage
logger.info("User logged in", extra={"user_id": 12345, "request_id": "abc-123"})
```

**Structured Logging (Node.js with Winston):**

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Usage
logger.info("User logged in", {
  user_id: 12345,
  request_id: "abc-123",
  ip_address: "192.168.1.1",
});

logger.error("Database connection failed", {
  error: err.message,
  stack: err.stack,
  database: "users_db",
});
```

### 4. Distributed Tracing (Jaeger/Zipkin)

**What is Distributed Tracing?**
Tracks requests as they flow through multiple services in a distributed system.

#### Jaeger Installation

```yaml
# docker-compose.yml
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686" # UI
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HTTP_PORT=9411
```

#### Instrumenting with OpenTelemetry

**Python:**

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Configure tracing
resource = Resource(attributes={
    SERVICE_NAME: "user-service"
})

jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)

provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(jaeger_exporter)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

# Use in application
def get_user(user_id):
    with tracer.start_as_current_span("get_user") as span:
        span.set_attribute("user.id", user_id)

        # Database call
        with tracer.start_as_current_span("database_query"):
            user = db.query(user_id)

        # External API call
        with tracer.start_as_current_span("external_api"):
            profile = api.get_profile(user_id)

        return user, profile
```

**Node.js:**

```javascript
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");

// Configure tracing
const provider = new NodeTracerProvider({
  resource: {
    attributes: {
      "service.name": "user-service",
    },
  },
});

const exporter = new JaegerExporter({
  endpoint: "http://localhost:14268/api/traces",
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

// Auto-instrument HTTP and Express
registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

// Manual instrumentation
const tracer = require("@opentelemetry/api").trace.getTracer("user-service");

async function getUser(userId) {
  const span = tracer.startSpan("get_user");
  span.setAttribute("user.id", userId);

  try {
    const user = await db.query(userId);
    const profile = await api.getProfile(userId);
    return { user, profile };
  } finally {
    span.end();
  }
}
```

## 🐛 Debugging and Troubleshooting

### Common Monitoring Issues

#### 1. **Prometheus Not Scraping Targets**

**Symptoms:**

- Targets show as "DOWN" in Prometheus UI
- No metrics appearing in Grafana

**Debug:**

```bash
# Check Prometheus targets
curl http://localhost:9090/targets

# Check if metrics endpoint is accessible
curl http://app:8080/metrics

# Check Prometheus logs
docker logs prometheus

# Validate prometheus.yml
promtool check config prometheus.yml
```

**Solutions:**

- Verify network connectivity
- Check firewall rules
- Ensure correct target addresses
- Verify authentication if required
- Check scrape_interval and timeout

#### 2. **High Cardinality Metrics**

**Symptoms:**

- Prometheus using excessive memory
- Slow query performance
- High disk usage

**Problem Example:**

```python
# BAD - user_id has millions of possible values
request_counter = Counter('requests', 'Requests', ['user_id', 'endpoint'])
request_counter.labels(user_id=user_id, endpoint=endpoint).inc()
```

**Solution:**

```python
# GOOD - Limited label values
request_counter = Counter('requests', 'Requests', ['endpoint', 'status'])
request_counter.labels(endpoint=endpoint, status=status).inc()

# Track user metrics differently (aggregated)
active_users_gauge = Gauge('active_users', 'Active users')
active_users_gauge.set(len(active_user_set))
```

**Best Practices:**

- Keep label cardinality low (<100 values per label)
- Avoid user IDs, email addresses, timestamps in labels
- Use aggregations instead

#### 3. **Grafana Dashboard Not Loading**

**Symptoms:**

- Dashboard shows "No data"
- Query errors

**Debug:**

```bash
# Test query in Prometheus directly
curl -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=up'

# Check Grafana logs
docker logs grafana

# Verify data source connection
curl http://localhost:3000/api/datasources
```

**Solutions:**

- Verify Prometheus URL in data source settings
- Check time range (ensure data exists for selected range)
- Validate PromQL syntax
- Check for metric name typos

#### 4. **Elasticsearch Running Out of Disk Space**

**Symptoms:**

- Elasticsearch cluster status RED
- Cannot index new documents

**Debug:**

```bash
# Check cluster health
curl http://localhost:9200/_cluster/health?pretty

# Check disk usage
curl http://localhost:9200/_cat/allocation?v

# Check indices size
curl http://localhost:9200/_cat/indices?v&s=store.size:desc
```

**Solutions:**

```bash
# Delete old indices
curl -X DELETE http://localhost:9200/logs-2024.01.01

# Set up Index Lifecycle Management (ILM)
PUT _ilm/policy/logs_policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "1d",
            "max_size": "50gb"
          }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}

# Adjust shard count
PUT logs-template
{
  "index_patterns": ["logs-*"],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
```

#### 5. **Missing or Incomplete Traces**

**Symptoms:**

- Traces not appearing in Jaeger
- Incomplete trace spans

**Debug:**

```bash
# Check Jaeger agent logs
docker logs jaeger

# Verify trace export
# Add debug logging to application

# Check sampling rate
```

**Solutions:**

```python
# Ensure proper context propagation
from opentelemetry.propagate import inject, extract

# When making HTTP requests, inject context
headers = {}
inject(headers)
requests.get(url, headers=headers)

# When receiving requests, extract context
context = extract(request.headers)

# Increase sampling rate for debugging
from opentelemetry.sdk.trace.sampling import TraceIdRatioBased
sampler = TraceIdRatioBased(1.0)  # 100% sampling
```

#### 6. **Alert Fatigue**

**Symptoms:**

- Too many alerts
- Team ignoring alerts
- Alert noise

**Solutions:**

```yaml
# Add proper thresholds and "for" duration
- alert: HighCPU
  expr: cpu_usage > 80
  for: 10m  # Fire only if sustained for 10 minutes

# Use routing and grouping in Alertmanager
route:
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h

# Add severity levels
labels:
  severity: warning  # vs critical

# Silence alerts during maintenance
amtool silence add alertname=HighCPU --duration=2h
```

### Monitoring Debugging Commands

**Prometheus:**

```bash
# Query metrics
curl -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=up{job="app"}'

# Query range
curl -G 'http://localhost:9090/api/v1/query_range' \
  --data-urlencode 'query=rate(http_requests_total[5m])' \
  --data-urlencode 'start=2024-01-01T00:00:00Z' \
  --data-urlencode 'end=2024-01-01T23:59:59Z' \
  --data-urlencode 'step=15s'

# Check targets
curl http://localhost:9090/api/v1/targets

# Validate config
promtool check config prometheus.yml

# Check rules
promtool check rules alerts.yml

# Test query
promtool query instant http://localhost:9090 'up'
```

**Elasticsearch:**

```bash
# Cluster health
curl http://localhost:9200/_cluster/health?pretty

# Node stats
curl http://localhost:9200/_nodes/stats?pretty

# Index stats
curl http://localhost:9200/_cat/indices?v

# Search logs
curl -X POST http://localhost:9200/logs-*/_search?pretty \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "match": {
        "level": "ERROR"
      }
    },
    "sort": [
      { "@timestamp": "desc" }
    ],
    "size": 10
  }'

# Delete index
curl -X DELETE http://localhost:9200/logs-2024.01.01
```

**Grafana:**

```bash
# API health
curl http://localhost:3000/api/health

# List datasources
curl -u admin:admin http://localhost:3000/api/datasources

# Test datasource
curl -u admin:admin -X POST \
  http://localhost:3000/api/datasources/1/test

# Create dashboard via API
curl -u admin:admin -X POST \
  -H "Content-Type: application/json" \
  -d @dashboard.json \
  http://localhost:3000/api/dashboards/db
```

## 🎯 Best Practices

### 1. Use the Four Golden Signals (SRE)

Monitor these for every service:

- **Latency** - Time to service requests
- **Traffic** - Demand on your system (requests/sec)
- **Errors** - Rate of failed requests
- **Saturation** - How "full" your service is (CPU, memory, disk)

### 2. Implement SLIs, SLOs, and SLAs

```yaml
# Service Level Indicator (SLI)
availability = successful_requests / total_requests

# Service Level Objective (SLO)
SLO: 99.9% availability (43.2 minutes downtime/month)

# Service Level Agreement (SLA)
SLA: 99.5% availability (penalty if breached)
```

### 3. Use Meaningful Metrics Names

```python
# BAD
metric_1 = Counter('m1', 'metric')

# GOOD
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)
```

### 4. Implement Health Checks

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route('/ready')
def ready():
    # Check dependencies
    db_healthy = check_database()
    cache_healthy = check_cache()

    if db_healthy and cache_healthy:
        return jsonify({"status": "ready"}), 200
    else:
        return jsonify({
            "status": "not ready",
            "database": "healthy" if db_healthy else "unhealthy",
            "cache": "healthy" if cache_healthy else "unhealthy"
        }), 503
```

### 5. Correlation IDs

```python
import uuid
from flask import Flask, request, g

app = Flask(__name__)

@app.before_request
def before_request():
    g.request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))

@app.after_request
def after_request(response):
    response.headers['X-Request-ID'] = g.request_id
    return response

# Use in logging
logger.info("Processing request", extra={"request_id": g.request_id})
```

### 6. Set Appropriate Retention Periods

```yaml
# Prometheus retention
--storage.tsdb.retention.time=30d
--storage.tsdb.retention.size=50GB

# Elasticsearch ILM
phases:
  hot: { max_age: 3d }
  warm: { min_age: 3d }
  cold: { min_age: 7d }
  delete: { min_age: 30d }
```

## 💡 Common Questions

### Basic Level

**Q1: What are the three pillars of observability?**
**A:** Metrics, Logs, and Traces.

- **Metrics**: Numerical measurements (CPU, memory, request rate)
- **Logs**: Text records of events
- **Traces**: Request journey through distributed systems

**Q2: What is the difference between monitoring and observability?**
**A:**

- **Monitoring**: Tracking known issues (predefined dashboards, alerts)
- **Observability**: Understanding unknown issues (exploratory analysis)
- Monitoring answers "Is something wrong?"
- Observability answers "Why is it wrong?"

**Q3: What is Prometheus and how does it work?**
**A:** Prometheus is a time-series database and monitoring system.

- **Pull-based**: Scrapes metrics from targets
- **Time-series**: Stores data with timestamps
- **PromQL**: Query language for analysis
- **Alerting**: Built-in alert rules

**Q4: What is the difference between logs and metrics?**
**A:**

- **Logs**: Discrete events with details (text-heavy, good for debugging)
- **Metrics**: Aggregated measurements (numeric, good for trends)
- Logs: "User 123 failed login at 10:23:45"
- Metrics: "Failed logins: 15 in last 5 minutes"

**Q5: What is a health check endpoint?**
**A:** An endpoint that returns the application's health status.

- `/health` - Basic alive check
- `/ready` - Ready to serve traffic (dependencies healthy)
- Used by load balancers and orchestrators (Kubernetes)

### Intermediate Level

**Q6: Explain the four golden signals of monitoring.**
**A:**

1. **Latency** - Response time (p50, p95, p99)
2. **Traffic** - Request volume (requests/second)
3. **Errors** - Failure rate (errors/total requests)
4. **Saturation** - Resource utilization (CPU, memory, disk)

From Google's SRE book, these cover most critical issues.

**Q7: What is high cardinality and why is it a problem?**
**A:** High cardinality means many unique values for a metric label.
**Problem:**

- Exponential memory growth
- Slow queries
- Storage issues

**Bad example:**

```python
counter.labels(user_id=12345, timestamp=now)  # Millions of combinations
```

**Solution:** Use aggregations, avoid unique IDs in labels.

**Q8: How do you implement distributed tracing?**
**A:**

1. Generate trace ID at entry point
2. Propagate trace ID through all services (headers)
3. Create spans for each operation
4. Send spans to collector (Jaeger, Zipkin)
5. Visualize in UI

**Key concepts:** Trace (full request), Span (single operation), Context propagation.

**Q9: What is the difference between push and pull monitoring?**
**A:**

- **Pull (Prometheus)**: Monitoring system scrapes targets
  - Pros: Service discovery, central control
  - Cons: Need network access to targets
- **Push (StatsD, CloudWatch)**: Applications send metrics
  - Pros: Works behind firewalls, handles short-lived jobs
  - Cons: More network traffic, harder to debug

**Q10: How do you handle alert fatigue?**
**A:**

- Set appropriate thresholds (not too sensitive)
- Use `for` duration to avoid flapping alerts
- Implement severity levels (critical, warning, info)
- Group related alerts
- Use alert routing (send to right team)
- Regular alert review and tuning

### Advanced Level

**Q11: Design a complete observability stack for a microservices architecture.**
**A:**
**Components:**

```
Metrics: Prometheus + Grafana
Logs: ELK Stack (Filebeat → Logstash → Elasticsearch → Kibana)
Traces: Jaeger
APM: Elastic APM or New Relic

Service Mesh: Istio (automatic metrics, traces)
Alerting: Alertmanager + PagerDuty
Dashboards: Grafana with service-level dashboards
```

**Implementation:**

- Instrument all services with OpenTelemetry
- Use correlation IDs across all logs
- Implement service level indicators (SLIs)
- Set up SLO-based alerts
- Create runbooks for common issues

**Q12: How do you monitor Kubernetes clusters?**
**A:**
**Layers to monitor:**

1. **Infrastructure**: Node CPU, memory, disk
2. **Kubernetes objects**: Pod restarts, deployment status
3. **Applications**: Service metrics, logs
4. **Network**: Service mesh metrics

**Tools:**

```yaml
# Prometheus Operator for K8s
- kube-state-metrics (K8s object metrics)
- node-exporter (node metrics)
- cAdvisor (container metrics)

# Setup
helm install prometheus-operator prometheus-community/kube-prometheus-stack

# Service monitors for auto-discovery
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-metrics
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
```

**Q13: What are recording rules in Prometheus and when should you use them?**
**A:** Recording rules pre-compute expensive queries and store results as new metrics.

**Use cases:**

- Frequently used queries in dashboards
- Complex aggregations
- Rolling window calculations
- Reduce dashboard load time

**Example:**

```yaml
groups:
  - name: aggregations
    interval: 30s
    rules:
      # Pre-compute request rate
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))

      # Pre-compute error ratio
      - record: job:http_errors:ratio
        expr: |
          sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum by (job) (rate(http_requests_total[5m]))
```

**Q14: How do you implement zero-downtime deployments with monitoring?**
**A:**

1. **Blue-Green Deployment**:
   - Deploy new version (green)
   - Monitor green for health, errors, performance
   - Switch traffic if healthy
   - Rollback if issues detected

2. **Canary Deployment**:
   - Deploy to small percentage (5%)
   - Monitor key metrics (error rate, latency)
   - Gradually increase traffic if healthy
   - Automated rollback on anomalies

3. **Progressive Delivery**:

```yaml
# Flagger canary config
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: app
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  service:
    port: 80
  analysis:
    threshold: 10
    maxWeight: 50
    stepWeight: 5
    metrics:
      - name: request-success-rate
        thresholdRange:
          min: 99
        interval: 1m
      - name: request-duration
        thresholdRange:
          max: 500
        interval: 1m
```

**Q15: Explain the USE and RED methods for monitoring.**
**A:**
**USE Method** (Resources):

- **Utilization**: % time resource is busy
- **Saturation**: Amount of queued work
- **Errors**: Error count

Best for: Hardware resources (CPU, disk, network)

**RED Method** (Services):

- **Rate**: Requests per second
- **Errors**: Failed requests per second
- **Duration**: Response time distribution

Best for: Request-driven services

**Example queries:**

```promql
# USE - CPU
rate(node_cpu_seconds_total{mode="user"}[5m])  # Utilization
node_load5  # Saturation

# RED - Service
rate(http_requests_total[5m])  # Rate
rate(http_requests_total{status=~"5.."}[5m])  # Errors
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))  # Duration
```

**Q16: How do you detect and prevent alert storms?**
**A:**
**Detection:**

- Monitor alert volume
- Track alert duration and frequency
- Correlation analysis

**Prevention:**

```yaml
# Alertmanager grouping
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h

  # Inhibition rules (suppress related alerts)
inhibit_rules:
  - source_match:
      alertname: 'NodeDown'
    target_match:
      alertname: 'HighCPU'
    equal: ['instance']

# Rate limiting
global:
  resolve_timeout: 5m

# Dependencies (don't alert on cascade failures)
- alert: ServiceDown
  expr: up{job="web"} == 0
  labels:
    severity: critical

- alert: SlowResponse
  expr: http_duration > 1
  labels:
    severity: warning
  # Don't fire if service is down
  inhibit_if: up{job="web"} == 0
```

## 📚 Related Topics

- [Kubernetes](../kubernetes/README.md)
- [CI/CD](../cicd/README.md)
- [Microservices Architecture](../../02-architectures/microservices/README.md)
- [AWS Cloud Stack](../../07-cloud/aws/README.md)

---

**Next**: Explore [Architecture Patterns](../../02-architectures/) to learn how to design observable systems!
