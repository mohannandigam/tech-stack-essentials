# Energy Sector - Smart Grid Monitoring System

## Overview

This example demonstrates a smart grid monitoring system for renewable energy management, showcasing IoT integration, real-time data processing, and time-series analytics.

## 🎯 Domain Requirements

### Business Goals
- Monitor solar panel performance across multiple installations
- Predict maintenance needs before failures occur
- Optimize energy distribution based on production and consumption
- Provide real-time dashboards for operators

### Technical Challenges
- Handle high-volume IoT sensor data (1000+ sensors, 1 reading/second each)
- Store and query time-series data efficiently
- Process real-time alerts for anomalies
- Scale horizontally as installations grow
- Ensure data reliability and accuracy

## 🏗️ Architecture

### Pattern: Event-Driven + CQRS

```
┌─────────────────────────────────────────────────────────────┐
│                     IoT Sensors (Solar Panels)               │
│           (Temperature, Voltage, Current, Power Output)      │
└───────────────────────┬─────────────────────────────────────┘
                        │ MQTT Protocol
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    MQTT Broker (EMQ X)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Ingestion Service (Go)                     │
│  - Validate sensor data                                      │
│  - Enrich with location metadata                             │
│  - Publish to event stream                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 Apache Kafka (Event Stream)                  │
└──────┬─────────────────┬──────────────────┬─────────────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Time-Series │  │   Anomaly    │  │    Real-time     │
│   Writer    │  │   Detector   │  │   Aggregator     │
│  (Python)   │  │  (Python +   │  │   (Flink)        │
│             │  │   ML Model)  │  │                  │
└──────┬──────┘  └──────┬───────┘  └────────┬─────────┘
       │                │                   │
       ▼                ▼                   ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────────┐
│TimescaleDB  │  │    Alert     │  │   Redis Cache    │
│(PostgreSQL) │  │   Service    │  │ (Aggregations)   │
└─────────────┘  └──────────────┘  └──────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Grafana Dashboard                          │
│  - Real-time metrics                                         │
│  - Historical trends                                         │
│  - Alert visualization                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
energy/
├── README.md
├── architecture.md
├── docker-compose.yml
├── services/
│   ├── ingestion/              # Data ingestion service
│   │   ├── main.go
│   │   ├── mqtt_client.go
│   │   └── Dockerfile
│   ├── anomaly-detection/      # ML-based anomaly detection
│   │   ├── detector.py
│   │   ├── model.pkl
│   │   └── Dockerfile
│   ├── time-series-writer/     # Write to TimescaleDB
│   │   ├── writer.py
│   │   └── Dockerfile
│   └── api/                    # REST API for queries
│       ├── main.py
│       ├── models.py
│       └── Dockerfile
├── infrastructure/
│   ├── kafka/
│   │   └── docker-compose.yml
│   ├── timescaledb/
│   │   └── init.sql
│   └── grafana/
│       └── dashboards/
├── tests/
│   ├── integration/
│   └── load/
└── docs/
    ├── api-spec.yaml
    └── deployment.md
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- 4GB RAM minimum
- Ports 1883 (MQTT), 9092 (Kafka), 5432 (PostgreSQL), 3000 (Grafana) available

### Start the System

```bash
# Clone and navigate to energy directory
cd domain-examples/energy

# Start all services
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
docker-compose ps

# Check logs
docker-compose logs -f ingestion
```

### Simulate Sensor Data

```bash
# Run sensor simulator
python scripts/sensor_simulator.py --panels 10 --interval 1

# The simulator will generate readings like:
# Panel-001: 25.3°C, 48.2V, 8.5A, 409.7W
# Panel-002: 26.1°C, 48.5V, 8.7A, 421.95W
```

### View Dashboards

```
# Grafana
http://localhost:3000
Login: admin/admin

# TimescaleDB (via pgAdmin)
http://localhost:5050

# API Documentation
http://localhost:8000/docs
```

## 💻 Code Examples

### Data Models

```python
# models/sensor_reading.py
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class SensorReading:
    """Represents a single sensor reading from a solar panel"""
    panel_id: str
    timestamp: datetime
    temperature_celsius: float
    voltage_volts: float
    current_amperes: float
    power_output_watts: float
    location: Optional[tuple[float, float]] = None  # (latitude, longitude)
    
    def validate(self) -> bool:
        """Validate sensor reading ranges"""
        return (
            -20 <= self.temperature_celsius <= 80 and
            0 <= self.voltage_volts <= 60 and
            0 <= self.current_amperes <= 15 and
            0 <= self.power_output_watts <= 1000
        )
    
    def calculate_efficiency(self, panel_rating_watts: float = 400) -> float:
        """Calculate panel efficiency percentage"""
        return (self.power_output_watts / panel_rating_watts) * 100
```

### Data Ingestion Service

```go
// ingestion/main.go
package main

import (
    "encoding/json"
    "log"
    mqtt "github.com/eclipse/paho.mqtt.golang"
    "github.com/confluentinc/confluent-kafka-go/kafka"
)

type SensorReading struct {
    PanelID     string  `json:"panel_id"`
    Timestamp   string  `json:"timestamp"`
    Temperature float64 `json:"temperature_celsius"`
    Voltage     float64 `json:"voltage_volts"`
    Current     float64 `json:"current_amperes"`
    Power       float64 `json:"power_output_watts"`
}

func main() {
    // Connect to MQTT broker
    mqttOpts := mqtt.NewClientOptions().
        AddBroker("tcp://mqtt-broker:1883").
        SetClientID("ingestion-service")
    
    mqttClient := mqtt.NewClient(mqttOpts)
    if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
        log.Fatal(token.Error())
    }
    
    // Connect to Kafka
    producer, err := kafka.NewProducer(&kafka.ConfigMap{
        "bootstrap.servers": "kafka:9092",
    })
    if err != nil {
        log.Fatal(err)
    }
    defer producer.Close()
    
    // Subscribe to sensor topics
    mqttClient.Subscribe("sensors/+/readings", 0, func(client mqtt.Client, msg mqtt.Message) {
        var reading SensorReading
        if err := json.Unmarshal(msg.Payload(), &reading); err != nil {
            log.Printf("Invalid reading: %v", err)
            return
        }
        
        // Validate reading
        if !validateReading(reading) {
            log.Printf("Reading out of range: %+v", reading)
            return
        }
        
        // Publish to Kafka
        value, _ := json.Marshal(reading)
        producer.Produce(&kafka.Message{
            TopicPartition: kafka.TopicPartition{
                Topic:     kafka.StringPointer("sensor-readings"),
                Partition: kafka.PartitionAny,
            },
            Value: value,
        }, nil)
    })
    
    log.Println("Ingestion service started")
    select {} // Keep running
}

func validateReading(r SensorReading) bool {
    return r.Temperature >= -20 && r.Temperature <= 80 &&
           r.Voltage >= 0 && r.Voltage <= 60 &&
           r.Current >= 0 && r.Current <= 15 &&
           r.Power >= 0 && r.Power <= 1000
}
```

### Anomaly Detection

```python
# anomaly-detection/detector.py
import joblib
import numpy as np
from kafka import KafkaConsumer, KafkaProducer
import json
from typing import Dict

class AnomalyDetector:
    """Detect anomalies in solar panel performance using ML"""
    
    def __init__(self, model_path: str = 'models/isolation_forest.pkl'):
        self.model = joblib.load(model_path)
        self.consumer = KafkaConsumer(
            'sensor-readings',
            bootstrap_servers=['kafka:9092'],
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        self.producer = KafkaProducer(
            bootstrap_servers=['kafka:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    
    def extract_features(self, reading: Dict) -> np.ndarray:
        """Extract features for ML model"""
        return np.array([[
            reading['temperature_celsius'],
            reading['voltage_volts'],
            reading['current_amperes'],
            reading['power_output_watts'],
            reading['power_output_watts'] / (reading['voltage_volts'] * reading['current_amperes'])  # efficiency
        ]])
    
    def run(self):
        """Process readings and detect anomalies"""
        for message in self.consumer:
            reading = message.value
            features = self.extract_features(reading)
            
            # Predict: -1 = anomaly, 1 = normal
            prediction = self.model.predict(features)[0]
            
            if prediction == -1:
                alert = {
                    'panel_id': reading['panel_id'],
                    'timestamp': reading['timestamp'],
                    'alert_type': 'performance_anomaly',
                    'severity': 'medium',
                    'details': reading,
                    'recommendation': self._get_recommendation(reading)
                }
                
                # Publish alert
                self.producer.send('alerts', value=alert)
                print(f"⚠️  Anomaly detected: Panel {reading['panel_id']}")
    
    def _get_recommendation(self, reading: Dict) -> str:
        """Generate recommendation based on reading"""
        if reading['temperature_celsius'] > 60:
            return "High temperature detected. Check cooling system."
        elif reading['power_output_watts'] < 100:
            return "Low power output. Inspect panel for debris or damage."
        elif reading['voltage_volts'] < 40:
            return "Low voltage. Check electrical connections."
        else:
            return "Performance anomaly detected. Schedule inspection."

if __name__ == '__main__':
    detector = AnomalyDetector()
    detector.run()
```

### Time-Series Query API

```python
# api/main.py
from fastapi import FastAPI, Query
from datetime import datetime, timedelta
from typing import List, Optional
import asyncpg

app = FastAPI(title="Energy Monitoring API")

@app.on_event("startup")
async def startup():
    app.state.pool = await asyncpg.create_pool(
        "postgresql://energy:password@timescaledb:5432/energy_monitoring"
    )

@app.get("/api/panels/{panel_id}/readings")
async def get_panel_readings(
    panel_id: str,
    start_time: datetime,
    end_time: datetime,
    interval: str = "1h"
):
    """Get aggregated readings for a panel"""
    query = """
        SELECT 
            time_bucket($1, timestamp) AS bucket,
            AVG(power_output_watts) as avg_power,
            MAX(power_output_watts) as max_power,
            MIN(power_output_watts) as min_power,
            AVG(temperature_celsius) as avg_temp
        FROM sensor_readings
        WHERE panel_id = $2
          AND timestamp >= $3
          AND timestamp <= $4
        GROUP BY bucket
        ORDER BY bucket DESC
    """
    
    async with app.state.pool.acquire() as conn:
        rows = await conn.fetch(query, interval, panel_id, start_time, end_time)
        
    return [{
        'timestamp': row['bucket'],
        'avg_power': float(row['avg_power']),
        'max_power': float(row['max_power']),
        'min_power': float(row['min_power']),
        'avg_temperature': float(row['avg_temp'])
    } for row in rows]

@app.get("/api/panels/{panel_id}/efficiency")
async def get_panel_efficiency(
    panel_id: str,
    days: int = 7
):
    """Calculate panel efficiency over time"""
    start_time = datetime.utcnow() - timedelta(days=days)
    
    query = """
        SELECT 
            time_bucket('1 day', timestamp) AS day,
            AVG(power_output_watts) / 400.0 * 100 as efficiency_pct
        FROM sensor_readings
        WHERE panel_id = $1
          AND timestamp >= $2
        GROUP BY day
        ORDER BY day DESC
    """
    
    async with app.state.pool.acquire() as conn:
        rows = await conn.fetch(query, panel_id, start_time)
    
    return [{
        'date': row['day'],
        'efficiency_percentage': float(row['efficiency_pct'])
    } for row in rows]

@app.get("/api/alerts/recent")
async def get_recent_alerts(limit: int = 50):
    """Get recent system alerts"""
    # Implementation...
    pass
```

## 🧪 Testing

### Unit Tests

```python
# tests/test_sensor_reading.py
import pytest
from models.sensor_reading import SensorReading
from datetime import datetime

def test_valid_reading():
    reading = SensorReading(
        panel_id="PANEL-001",
        timestamp=datetime.utcnow(),
        temperature_celsius=25.0,
        voltage_volts=48.0,
        current_amperes=8.5,
        power_output_watts=408.0
    )
    assert reading.validate() is True

def test_invalid_temperature():
    reading = SensorReading(
        panel_id="PANEL-001",
        timestamp=datetime.utcnow(),
        temperature_celsius=100.0,  # Too high
        voltage_volts=48.0,
        current_amperes=8.5,
        power_output_watts=408.0
    )
    assert reading.validate() is False

def test_efficiency_calculation():
    reading = SensorReading(
        panel_id="PANEL-001",
        timestamp=datetime.utcnow(),
        temperature_celsius=25.0,
        voltage_volts=48.0,
        current_amperes=8.5,
        power_output_watts=400.0
    )
    assert reading.calculate_efficiency(400) == 100.0
```

### Integration Tests

```python
# tests/integration/test_end_to_end.py
import pytest
import asyncio
from mqtt_client import publish_reading
from api_client import EnergyAPI

@pytest.mark.asyncio
async def test_reading_flow():
    """Test complete flow from sensor to database"""
    # Publish sensor reading
    reading = {
        'panel_id': 'TEST-001',
        'temperature_celsius': 25.0,
        'voltage_volts': 48.0,
        'current_amperes': 8.5,
        'power_output_watts': 408.0
    }
    
    publish_reading('sensors/TEST-001/readings', reading)
    
    # Wait for processing
    await asyncio.sleep(5)
    
    # Query API
    api = EnergyAPI(base_url='http://localhost:8000')
    results = await api.get_panel_readings('TEST-001', limit=1)
    
    # Verify
    assert len(results) > 0
    assert results[0]['panel_id'] == 'TEST-001'
```

## 🚀 Deployment

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mqtt-broker:
    image: emqx/emqx:latest
    ports:
      - "1883:1883"
      - "8083:8083"

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092

  timescaledb:
    image: timescale/timescaledb:latest-pg14
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: energy_monitoring
    volumes:
      - ./infrastructure/timescaledb/init.sql:/docker-entrypoint-initdb.d/init.sql

  ingestion:
    build: ./services/ingestion
    depends_on:
      - mqtt-broker
      - kafka

  anomaly-detection:
    build: ./services/anomaly-detection
    depends_on:
      - kafka

  api:
    build: ./services/api
    ports:
      - "8000:8000"
    depends_on:
      - timescaledb

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - ./infrastructure/grafana/dashboards:/etc/grafana/provisioning/dashboards
```

## 📊 Key Metrics

- **Throughput**: 1,000 readings/second
- **Latency**: < 100ms from sensor to database
- **Storage**: ~1GB per 1M readings
- **Query Performance**: < 50ms for hourly aggregations

## 🔗 Related Patterns

- [Event-Driven Architecture](../../architectures/event-driven/README.md)
- [CQRS Pattern](../../architectures/microservices/README.md)
- [Time-Series Databases](../../infrastructure/docker/README.md)
- [IoT Best Practices](../../infrastructure/monitoring/README.md)

## 📚 Additional Resources

- [TimescaleDB Documentation](https://docs.timescale.com/)
- [Apache Kafka Guide](https://kafka.apache.org/documentation/)
- [MQTT Protocol](https://mqtt.org/)
- [Solar Panel Monitoring Best Practices]

---

**Next**: Explore [Finance Domain](../finance/README.md) for transaction processing patterns.
