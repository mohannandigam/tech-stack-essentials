# Manufacturing - Smart Factory & Supply Chain

## Overview

Modern manufacturing system demonstrating IoT-enabled production monitoring, predictive maintenance, quality control, supply chain optimization, and Industry 4.0 practices.

## 🎯 Domain Requirements

### Business Goals

- **Production Monitoring**: Real-time equipment status, OEE (Overall Equipment Effectiveness)
- **Quality Control**: Automated inspection, defect detection, statistical process control
- **Predictive Maintenance**: Equipment failure prediction, scheduled maintenance optimization
- **Supply Chain**: Inventory management, demand forecasting, supplier integration
- **Traceability**: Product genealogy, batch tracking, recall management

### Technical Challenges

- **IoT Scale**: 10,000+ sensors across factory floor
- **Real-Time Processing**: Sub-second response for production control
- **Edge Computing**: Local processing for latency-sensitive operations
- **Data Volume**: Terabytes of sensor data, high-resolution images
- **Legacy Integration**: PLC, SCADA, MES, ERP system integration
- **Safety**: IEC 61508/61511 functional safety standards

## 🏗️ Architecture

### Pattern: Event-Driven + IoT + Edge Computing + Time-Series

```
┌──────────────────────────────────────────────────────────────────┐
│                    Factory Floor                                  │
│   (PLCs, CNCs, Robots, Sensors, Vision Systems)                  │
└────────────────────┬─────────────────────────────────────────────┘
                     │ OPC-UA, MQTT, Modbus
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Edge Computing Layer                                 │
│   - Local data aggregation  - Real-time control                  │
│   - ML inference           - Safety monitoring                   │
└────────────────────┬─────────────────────────────────────────────┘
                     │ Filtered Events
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Message Bus (Kafka/MQTT Broker)                      │
└───┬────────────┬─────────────────┬────────────────────────────┬──┘
    │            │                 │                            │
    ▼            ▼                 ▼                            ▼
┌────────┐ ┌───────────┐ ┌─────────────────┐ ┌──────────────────┐
│ OEE    │ │ Quality   │ │   Predictive    │ │ Supply Chain     │
│Monitor │ │ Control   │ │   Maintenance   │ │ Optimizer        │
└───┬────┘ └─────┬─────┘ └────────┬────────┘ └────────┬─────────┘
    │            │                │                    │
    ▼            ▼                ▼                    ▼
┌──────────────────────────────────────────────────────────────────┐
│     Time-Series DB (InfluxDB) + Analytics (Spark)                │
│   - Production Metrics  - Sensor Data  - Quality Results         │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│    MES/ERP Integration + Dashboards (Grafana/Power BI)           │
└──────────────────────────────────────────────────────────────────┘
```

## 💻 Code Examples

### Production Equipment Model

```python
# models/equipment.py
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

class EquipmentStatus(Enum):
    RUNNING = "running"
    IDLE = "idle"
    SETUP = "setup"
    DOWN = "down"
    MAINTENANCE = "maintenance"

class DowntimeReason(Enum):
    PLANNED_MAINTENANCE = "planned_maintenance"
    BREAKDOWN = "breakdown"
    CHANGEOVER = "changeover"
    NO_OPERATOR = "no_operator"
    NO_MATERIAL = "no_material"
    QUALITY_ISSUE = "quality_issue"

@dataclass
class EquipmentMetrics:
    """Real-time equipment metrics"""
    equipment_id: str
    timestamp: datetime

    # Status
    status: EquipmentStatus
    downtime_reason: Optional[DowntimeReason] = None

    # Production
    parts_produced: int = 0
    parts_rejected: int = 0
    target_rate: int = 0  # parts per hour
    actual_rate: int = 0

    # OEE Components
    availability: Decimal = Decimal('0')  # % of scheduled time running
    performance: Decimal = Decimal('0')   # % of ideal cycle time
    quality: Decimal = Decimal('0')       # % good parts
    oee: Decimal = Decimal('0')           # Availability × Performance × Quality

    # Sensor data
    temperature_c: Optional[float] = None
    vibration_mm_s: Optional[float] = None
    power_kw: Optional[float] = None
    spindle_speed_rpm: Optional[int] = None

    def calculate_oee(self) -> Decimal:
        """Calculate Overall Equipment Effectiveness"""
        self.oee = (self.availability * self.performance * self.quality) / 10000
        return self.oee

@dataclass
class ProductionOrder:
    """Manufacturing work order"""
    order_id: str
    product_code: str
    quantity_ordered: int
    quantity_produced: int = 0
    quantity_rejected: int = 0

    equipment_id: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

    # Material traceability
    batch_numbers: list[str] = None
    serial_numbers: list[str] = None

    def __post_init__(self):
        if self.batch_numbers is None:
            self.batch_numbers = []
        if self.serial_numbers is None:
            self.serial_numbers = []
```

### OEE Monitoring Service

```python
# services/oee_monitor.py
import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class OEEMonitor:
    """Real-time OEE calculation and monitoring"""

    def __init__(self, equipment_service, metrics_db):
        self.equipment_service = equipment_service
        self.metrics_db = metrics_db
        self.equipment_states: Dict[str, EquipmentMetrics] = {}

    async def process_equipment_event(self, event: dict):
        """Process real-time equipment event"""
        equipment_id = event['equipment_id']
        event_type = event['type']
        timestamp = datetime.fromisoformat(event['timestamp'])

        # Get or create equipment state
        if equipment_id not in self.equipment_states:
            self.equipment_states[equipment_id] = await self._load_equipment_state(
                equipment_id
            )

        state = self.equipment_states[equipment_id]

        # Process event
        if event_type == 'status_change':
            await self._handle_status_change(state, event, timestamp)
        elif event_type == 'part_produced':
            await self._handle_part_produced(state, event, timestamp)
        elif event_type == 'part_rejected':
            await self._handle_part_rejected(state, event, timestamp)
        elif event_type == 'sensor_reading':
            await self._handle_sensor_reading(state, event, timestamp)

        # Calculate OEE
        await self._calculate_oee(state, timestamp)

        # Store metrics
        await self.metrics_db.write_point(
            measurement='equipment_metrics',
            tags={'equipment_id': equipment_id},
            fields={
                'status': state.status.value,
                'parts_produced': state.parts_produced,
                'parts_rejected': state.parts_rejected,
                'availability': float(state.availability),
                'performance': float(state.performance),
                'quality': float(state.quality),
                'oee': float(state.oee),
                'temperature': state.temperature_c,
                'vibration': state.vibration_mm_s,
                'power': state.power_kw
            },
            timestamp=timestamp
        )

        # Check alerts
        await self._check_alerts(state)

    async def _calculate_oee(self, state: EquipmentMetrics, timestamp: datetime):
        """Calculate OEE components"""
        # Get shift schedule for the day
        shift_start, shift_end = await self._get_current_shift(state.equipment_id)

        if not shift_start:
            return

        # Calculate availability
        total_shift_time = (shift_end - shift_start).total_seconds() / 3600  # hours

        # Get downtime in current shift
        downtime = await self._get_downtime_minutes(
            state.equipment_id,
            shift_start,
            timestamp
        )

        running_time = total_shift_time * 60 - downtime  # minutes
        state.availability = Decimal(
            (running_time / (total_shift_time * 60)) * 100
        ).quantize(Decimal('0.01'))

        # Calculate performance
        if state.target_rate > 0 and running_time > 0:
            ideal_parts = (running_time / 60) * state.target_rate
            if ideal_parts > 0:
                state.performance = Decimal(
                    (state.parts_produced / ideal_parts) * 100
                ).quantize(Decimal('0.01'))

        # Calculate quality
        total_parts = state.parts_produced + state.parts_rejected
        if total_parts > 0:
            state.quality = Decimal(
                (state.parts_produced / total_parts) * 100
            ).quantize(Decimal('0.01'))

        # Calculate OEE
        state.calculate_oee()

    async def _check_alerts(self, state: EquipmentMetrics):
        """Check for alert conditions"""
        alerts = []

        # Low OEE
        if state.oee < Decimal('75'):
            alerts.append({
                'severity': 'warning',
                'type': 'low_oee',
                'message': f'OEE {state.oee}% below target 75%',
                'equipment_id': state.equipment_id
            })

        # High temperature
        if state.temperature_c and state.temperature_c > 80:
            alerts.append({
                'severity': 'critical',
                'type': 'high_temperature',
                'message': f'Temperature {state.temperature_c}°C exceeds limit',
                'equipment_id': state.equipment_id
            })

        # Excessive vibration
        if state.vibration_mm_s and state.vibration_mm_s > 10:
            alerts.append({
                'severity': 'warning',
                'type': 'high_vibration',
                'message': f'Vibration {state.vibration_mm_s} mm/s above normal',
                'equipment_id': state.equipment_id
            })

        # Publish alerts
        for alert in alerts:
            await self._publish_alert(alert)
```

### Quality Control with Computer Vision

```python
# services/quality_inspection.py
import cv2
import numpy as np
from tensorflow import keras
import logging

logger = logging.getLogger(__name__)

class QualityInspectionService:
    """AI-powered visual quality inspection"""

    def __init__(self, model_path: str):
        self.model = keras.models.load_model(model_path)
        self.defect_classes = [
            'scratch', 'dent', 'discoloration',
            'crack', 'missing_component', 'good'
        ]

    async def inspect_part(self, image_path: str, part_id: str) -> dict:
        """Inspect part using computer vision"""

        # Load and preprocess image
        image = cv2.imread(image_path)
        if image is None:
            logger.error(f"Failed to load image: {image_path}")
            return {'status': 'error', 'message': 'Image load failed'}

        # Preprocess for model
        processed = self._preprocess_image(image)

        # Run inference
        predictions = self.model.predict(processed)

        # Get top prediction
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        defect_type = self.defect_classes[class_idx]

        # Determine pass/fail
        is_good = defect_type == 'good' and confidence > 0.95

        result = {
            'part_id': part_id,
            'status': 'pass' if is_good else 'fail',
            'defect_type': defect_type if not is_good else None,
            'confidence': confidence,
            'timestamp': datetime.utcnow().isoformat()
        }

        # If defect detected, extract defect location
        if not is_good:
            defect_location = self._locate_defect(image, defect_type)
            result['defect_location'] = defect_location

        # Store result
        await self._store_inspection_result(result)

        # Trigger corrective action if needed
        if not is_good and confidence > 0.90:
            await self._trigger_quality_alert(result)

        return result

    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for model input"""
        # Resize to model input size
        resized = cv2.resize(image, (224, 224))

        # Normalize
        normalized = resized.astype(np.float32) / 255.0

        # Add batch dimension
        batched = np.expand_dims(normalized, axis=0)

        return batched

    def _locate_defect(self, image: np.ndarray, defect_type: str) -> dict:
        """Locate defect in image using GradCAM or similar"""
        # Simplified - real implementation would use GradCAM
        # or object detection model

        # For demonstration, return center coordinates
        height, width = image.shape[:2]

        return {
            'x': width // 2,
            'y': height // 2,
            'width': 100,
            'height': 100,
            'confidence': 0.85
        }
```

### Predictive Maintenance

```python
# services/predictive_maintenance.py
from sklearn.ensemble import IsolationForest
import pandas as pd
from datetime import datetime, timedelta

class PredictiveMaintenanceService:
    """ML-based predictive maintenance"""

    def __init__(self):
        self.anomaly_detectors = {}
        self.failure_predictors = {}

    async def analyze_equipment(self, equipment_id: str) -> dict:
        """Analyze equipment health and predict failures"""

        # Get recent sensor data (last 24 hours)
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=1)

        sensor_data = await self._fetch_sensor_data(
            equipment_id,
            start_time,
            end_time
        )

        if sensor_data.empty:
            return {'status': 'insufficient_data'}

        # Detect anomalies
        anomaly_score = await self._detect_anomalies(equipment_id, sensor_data)

        # Predict time to failure
        ttf_days = await self._predict_time_to_failure(equipment_id, sensor_data)

        # Generate recommendation
        recommendation = self._generate_recommendation(anomaly_score, ttf_days)

        result = {
            'equipment_id': equipment_id,
            'health_score': 100 - anomaly_score * 100,
            'anomaly_score': anomaly_score,
            'predicted_ttf_days': ttf_days,
            'recommendation': recommendation,
            'timestamp': datetime.utcnow().isoformat()
        }

        # Create maintenance work order if critical
        if recommendation['priority'] == 'critical':
            await self._create_maintenance_order(equipment_id, recommendation)

        return result

    async def _detect_anomalies(
        self,
        equipment_id: str,
        sensor_data: pd.DataFrame
    ) -> float:
        """Detect anomalous patterns in sensor data"""

        # Get or train anomaly detector
        if equipment_id not in self.anomaly_detectors:
            self.anomaly_detectors[equipment_id] = IsolationForest(
                contamination=0.1,
                random_state=42
            )
            # Train on historical normal data
            historical = await self._fetch_historical_data(equipment_id)
            if not historical.empty:
                self.anomaly_detectors[equipment_id].fit(historical)

        detector = self.anomaly_detectors[equipment_id]

        # Features for anomaly detection
        features = sensor_data[[
            'temperature',
            'vibration',
            'power',
            'speed'
        ]].fillna(0)

        # Predict anomaly scores (-1 for anomaly, 1 for normal)
        scores = detector.score_samples(features)

        # Normalize to 0-1 (higher = more anomalous)
        anomaly_score = 1 - (scores.mean() + 0.5)  # Rough normalization

        return max(0, min(1, anomaly_score))

    async def _predict_time_to_failure(
        self,
        equipment_id: str,
        sensor_data: pd.DataFrame
    ) -> float:
        """Predict days until failure"""

        # Simplified model - real system would use RUL prediction
        # (Remaining Useful Life) with LSTM or similar

        # Calculate degradation indicators
        temp_trend = sensor_data['temperature'].pct_change().mean()
        vibration_trend = sensor_data['vibration'].pct_change().mean()

        # Simple heuristic
        if temp_trend > 0.01 or vibration_trend > 0.01:
            # Degrading
            return 30  # 30 days
        elif temp_trend > 0.005 or vibration_trend > 0.005:
            return 90  # 90 days
        else:
            return 180  # 180 days (healthy)

    def _generate_recommendation(
        self,
        anomaly_score: float,
        ttf_days: float
    ) -> dict:
        """Generate maintenance recommendation"""

        if anomaly_score > 0.8 or ttf_days < 7:
            return {
                'priority': 'critical',
                'action': 'immediate_inspection',
                'description': 'Equipment shows critical anomalies',
                'recommended_date': datetime.utcnow().date().isoformat()
            }
        elif anomaly_score > 0.6 or ttf_days < 30:
            return {
                'priority': 'high',
                'action': 'schedule_maintenance',
                'description': 'Equipment requires maintenance soon',
                'recommended_date': (
                    datetime.utcnow() + timedelta(days=7)
                ).date().isoformat()
            }
        elif anomaly_score > 0.4 or ttf_days < 90:
            return {
                'priority': 'medium',
                'action': 'monitor_closely',
                'description': 'Equipment showing early warning signs',
                'recommended_date': (
                    datetime.utcnow() + timedelta(days=30)
                ).date().isoformat()
            }
        else:
            return {
                'priority': 'low',
                'action': 'routine_maintenance',
                'description': 'Equipment operating normally',
                'recommended_date': (
                    datetime.utcnow() + timedelta(days=90)
                ).date().isoformat()
            }
```

## 🚀 Quick Start

```bash
cd domain-examples/manufacturing

# Start infrastructure
docker-compose up -d

# Initialize databases
python scripts/init_db.py

# Start edge services
python services/edge_gateway.py &

# Start OEE monitor
python services/oee_monitor.py &

# Start quality inspection
python services/quality_inspection.py &

# Simulate factory floor
python scripts/simulate_production.py
```

## 📊 Key Features

1. **Real-Time OEE**: Availability, Performance, Quality tracking
2. **Predictive Maintenance**: ML-based failure prediction
3. **Quality Control**: AI vision inspection, SPC charting
4. **Digital Twin**: Virtual factory model for simulation
5. **Traceability**: Complete product genealogy
6. **Supply Chain**: Demand forecasting, inventory optimization

## 🔒 Security & Safety

- **Functional Safety**: IEC 61508 SIL 2/3 compliance
- **Cybersecurity**: IEC 62443 industrial security
- **Access Control**: Role-based, two-factor authentication
- **Network Segmentation**: IT/OT separation
- **Encryption**: TLS for data in transit

## 📈 Performance Targets

- **Edge Processing**: < 10ms latency
- **OEE Update**: < 1 second
- **Vision Inspection**: < 500ms per part
- **Data Throughput**: 100K+ sensor readings/second
- **System Uptime**: 99.99%

## 🤖 AI/ML Applications

- **Defect Detection**: CNN for visual inspection
- **Anomaly Detection**: Isolation Forest for sensor data
- **Demand Forecasting**: LSTM for production planning
- **Predictive Maintenance**: RUL prediction models
- **Process Optimization**: Reinforcement learning

## 🔗 Related Patterns

- [IoT Architecture](../energy/README.md)
- [Event-Driven](../../02-architectures/event-driven/README.md)
- [Time-Series Data](../energy/README.md)

---

**Note**: Manufacturing systems require safety certification and extensive validation. This is a learning template only.
