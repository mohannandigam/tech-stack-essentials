# Aerospace - Flight Management & Satellite Systems

## Overview

Comprehensive aerospace systems demonstrating flight operations, satellite tracking, aircraft maintenance, and aviation safety. This domain covers both commercial aviation and space systems with real-time data processing, safety-critical operations, and regulatory compliance.

## 🎯 Domain Requirements

### Business Goals

- **Flight Operations**: Real-time flight tracking, route optimization, fuel management
- **Maintenance**: Predictive maintenance, aircraft health monitoring (ACARS/ARINC 429)
- **Safety Systems**: Collision avoidance, weather integration, emergency protocols
- **Satellite Operations**: Orbital tracking, telemetry processing, ground station management
- **Regulatory Compliance**: FAA, EASA, ICAO standards

### Technical Challenges

- **Real-time Processing**: Sub-second latency for flight-critical data
- **High Availability**: 99.999% uptime for safety-critical systems
- **Data Volume**: Terabytes of telemetry, radar, and sensor data daily
- **Safety Certification**: DO-178C (software), DO-254 (hardware) compliance
- **Geospatial Complexity**: 3D positioning, coordinate transformations, great circle calculations
- **Legacy Integration**: ACARS, ADS-B, ARINC protocols

## 🏗️ Architecture

### Pattern: Event-Driven + Real-Time Processing + Microservices

```
┌──────────────────────────────────────────────────────────────────┐
│                    Aircraft & Satellites                          │
│         (ACARS, ADS-B, Telemetry, GPS, Sensors)                  │
└────────────────────┬─────────────────────────────────────────────┘
                     │ Real-time Data Streams
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│              Data Ingestion Layer (Kafka)                         │
│   - ACARS Messages   - ADS-B Positions   - Telemetry            │
└────┬──────────────┬─────────────────┬───────────────────────────┘
     │              │                 │
     ▼              ▼                 ▼
┌─────────────┐ ┌──────────────┐ ┌────────────────┐
│  Flight     │ │  Aircraft    │ │   Satellite    │
│  Tracking   │ │  Health      │ │   Control      │
│  Service    │ │  Monitoring  │ │   System       │
└──────┬──────┘ └──────┬───────┘ └────────┬───────┘
       │               │                   │
       │ Events        │ Events            │ Events
       ▼               ▼                   ▼
┌──────────────────────────────────────────────────────────────────┐
│              Event Processing (Apache Flink)                      │
│   - Position Updates    - Anomaly Detection                      │
│   - Route Optimization  - Collision Avoidance                    │
└───┬────────────┬───────────────┬────────────────────────────────┘
    │            │               │
    ▼            ▼               ▼
┌─────────┐ ┌──────────┐ ┌────────────────┐
│Weather  │ │Navigation│ │  Maintenance   │
│Service  │ │Optimizer │ │   Predictor    │
└────┬────┘ └────┬─────┘ └────────┬───────┘
     │           │                 │
     ▼           ▼                 ▼
┌──────────────────────────────────────────┐
│     Time-Series DB (InfluxDB/TimescaleDB) │
│   - Flight Paths    - Telemetry           │
│   - Sensor Data     - Performance Metrics │
└───────────────────┬──────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│    Analytics & Visualization (Grafana)    │
│  - Flight Tracking Maps                   │
│  - Maintenance Dashboards                 │
│  - Safety Alerts                          │
└──────────────────────────────────────────┘
```

## 💻 Code Examples

### Flight Position Tracking

```python
# models/flight_position.py
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

@dataclass
class FlightPosition:
    """ADS-B position report"""
    flight_id: str
    callsign: str
    icao24: str  # Aircraft identifier
    timestamp: datetime

    # Position (WGS84)
    latitude: Decimal
    longitude: Decimal
    altitude_ft: int

    # Velocity
    ground_speed_kts: int
    track_degrees: int  # Heading
    vertical_rate_fpm: int

    # Status
    on_ground: bool
    squawk: str  # Transponder code
    emergency: bool

    def distance_to(self, other: 'FlightPosition') -> Decimal:
        """Calculate great circle distance in nautical miles"""
        from math import radians, sin, cos, asin, sqrt

        lat1, lon1 = radians(float(self.latitude)), radians(float(self.longitude))
        lat2, lon2 = radians(float(other.latitude)), radians(float(other.longitude))

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))

        # Earth radius in nautical miles
        r_nm = 3440.065
        return Decimal(c * r_nm)

    def is_collision_risk(self, other: 'FlightPosition',
                          horizontal_nm: Decimal = Decimal('5'),
                          vertical_ft: int = 1000) -> bool:
        """TCAS-style collision detection"""
        if self.on_ground or other.on_ground:
            return False

        h_distance = self.distance_to(other)
        v_distance = abs(self.altitude_ft - other.altitude_ft)

        return h_distance < horizontal_nm and v_distance < vertical_ft
```

### Real-Time Flight Tracking Service

```python
# services/flight_tracking_service.py
import asyncio
from typing import Dict, List
from datetime import datetime, timedelta
import aioredis
from kafka import KafkaConsumer, KafkaProducer

class FlightTrackingService:
    """Real-time flight position tracking and monitoring"""

    def __init__(self, redis_url: str, kafka_bootstrap: str):
        self.redis = aioredis.from_url(redis_url)
        self.kafka_consumer = KafkaConsumer(
            'adsb-positions',
            bootstrap_servers=kafka_bootstrap,
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        self.kafka_producer = KafkaProducer(
            bootstrap_servers=kafka_bootstrap,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        self.active_flights: Dict[str, FlightPosition] = {}

    async def process_adsb_stream(self):
        """Process ADS-B position updates in real-time"""
        for message in self.kafka_consumer:
            position = FlightPosition(**message.value)

            # Update active flights cache
            await self.update_flight_position(position)

            # Check for anomalies
            await self.check_anomalies(position)

            # Collision detection
            await self.check_collisions(position)

            # Store in time-series DB
            await self.store_position(position)

    async def update_flight_position(self, position: FlightPosition):
        """Update Redis cache with latest position"""
        key = f"flight:{position.flight_id}:current"

        # Store current position (expires in 5 minutes)
        await self.redis.setex(
            key,
            300,
            json.dumps({
                'flight_id': position.flight_id,
                'callsign': position.callsign,
                'latitude': str(position.latitude),
                'longitude': str(position.longitude),
                'altitude_ft': position.altitude_ft,
                'ground_speed_kts': position.ground_speed_kts,
                'timestamp': position.timestamp.isoformat(),
                'emergency': position.emergency
            })
        )

        # Update in-memory cache
        self.active_flights[position.flight_id] = position

    async def check_anomalies(self, position: FlightPosition):
        """Detect flight anomalies"""
        anomalies = []

        # Emergency squawk codes
        if position.squawk in ['7500', '7600', '7700']:
            anomalies.append({
                'type': 'emergency_squawk',
                'severity': 'critical',
                'code': position.squawk,
                'description': {
                    '7500': 'Hijacking',
                    '7600': 'Radio Failure',
                    '7700': 'General Emergency'
                }[position.squawk]
            })

        # Excessive vertical rate
        if abs(position.vertical_rate_fpm) > 6000:
            anomalies.append({
                'type': 'excessive_vertical_rate',
                'severity': 'warning',
                'rate': position.vertical_rate_fpm
            })

        # Get previous position
        prev_key = f"flight:{position.flight_id}:previous"
        prev_data = await self.redis.get(prev_key)

        if prev_data:
            prev = FlightPosition(**json.loads(prev_data))

            # Sudden altitude change
            alt_change = abs(position.altitude_ft - prev.altitude_ft)
            time_diff = (position.timestamp - prev.timestamp).total_seconds()

            if time_diff > 0:
                rate = (alt_change / time_diff) * 60  # ft/min
                if rate > 8000 and not position.on_ground:
                    anomalies.append({
                        'type': 'rapid_altitude_change',
                        'severity': 'warning',
                        'rate': rate
                    })

        # Publish anomalies
        if anomalies:
            await self.publish_alert({
                'flight_id': position.flight_id,
                'callsign': position.callsign,
                'position': {
                    'lat': str(position.latitude),
                    'lon': str(position.longitude),
                    'alt': position.altitude_ft
                },
                'anomalies': anomalies,
                'timestamp': datetime.utcnow().isoformat()
            })

    async def check_collisions(self, position: FlightPosition):
        """TCAS-style collision detection"""
        # Get nearby flights (within 10nm box)
        nearby = await self.get_nearby_flights(
            position.latitude,
            position.longitude,
            radius_nm=10
        )

        for other_id, other_pos in nearby.items():
            if other_id == position.flight_id:
                continue

            if position.is_collision_risk(other_pos):
                await self.publish_alert({
                    'type': 'collision_risk',
                    'severity': 'critical',
                    'flight1': {
                        'id': position.flight_id,
                        'callsign': position.callsign,
                        'position': position.__dict__
                    },
                    'flight2': {
                        'id': other_id,
                        'callsign': other_pos.callsign,
                        'position': other_pos.__dict__
                    },
                    'separation': {
                        'horizontal_nm': str(position.distance_to(other_pos)),
                        'vertical_ft': abs(position.altitude_ft - other_pos.altitude_ft)
                    }
                })

    async def get_nearby_flights(self, lat: Decimal, lon: Decimal,
                                 radius_nm: int) -> Dict[str, FlightPosition]:
        """Get flights within radius using geospatial query"""
        # In production, use Redis geospatial commands or PostGIS
        nearby = {}
        for flight_id, pos in self.active_flights.items():
            # Simple box filter (optimize with geohashing in production)
            lat_diff = abs(float(pos.latitude - lat))
            lon_diff = abs(float(pos.longitude - lon))

            # Rough approximation: 1 degree ≈ 60nm
            if lat_diff < (radius_nm / 60) and lon_diff < (radius_nm / 60):
                nearby[flight_id] = pos

        return nearby

    async def publish_alert(self, alert: dict):
        """Publish alert to operations"""
        self.kafka_producer.send('flight-alerts', value=alert)
```

### Predictive Maintenance System

```python
# services/maintenance_predictor.py
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from datetime import datetime, timedelta

class AircraftMaintenancePredictor:
    """Predictive maintenance using sensor data and ML"""

    def __init__(self):
        self.anomaly_detector = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        self.models = {}

    async def process_acars_message(self, message: dict):
        """Process ACARS maintenance message"""
        aircraft_id = message['aircraft_id']
        timestamp = datetime.fromisoformat(message['timestamp'])

        # Extract sensor readings
        sensors = {
            'engine1_egt': message.get('engine1_egt'),  # Exhaust Gas Temp
            'engine2_egt': message.get('engine2_egt'),
            'engine1_n1': message.get('engine1_n1'),    # Fan speed
            'engine2_n1': message.get('engine2_n1'),
            'engine1_n2': message.get('engine1_n2'),    # Core speed
            'engine2_n2': message.get('engine2_n2'),
            'oil_pressure': message.get('oil_pressure'),
            'oil_temp': message.get('oil_temp'),
            'fuel_flow': message.get('fuel_flow'),
            'vibration': message.get('vibration')
        }

        # Detect anomalies
        anomaly_score = await self.detect_anomalies(aircraft_id, sensors)

        if anomaly_score > 0.7:
            # Predict maintenance needed
            prediction = await self.predict_maintenance(aircraft_id, sensors)

            if prediction['confidence'] > 0.8:
                await self.create_maintenance_alert(
                    aircraft_id,
                    prediction,
                    sensors,
                    timestamp
                )

    async def detect_anomalies(self, aircraft_id: str,
                               sensors: dict) -> float:
        """Detect anomalous sensor patterns"""
        # Get historical baseline
        baseline = await self.get_baseline_metrics(aircraft_id)

        if not baseline:
            return 0.0

        # Calculate z-scores
        anomaly_scores = []
        for key, value in sensors.items():
            if value is None or key not in baseline:
                continue

            mean = baseline[key]['mean']
            std = baseline[key]['std']

            if std > 0:
                z_score = abs((value - mean) / std)
                anomaly_scores.append(min(z_score / 3.0, 1.0))

        return np.mean(anomaly_scores) if anomaly_scores else 0.0

    async def predict_maintenance(self, aircraft_id: str,
                                  sensors: dict) -> dict:
        """Predict maintenance type and urgency"""
        predictions = []

        # Engine overheating check
        if sensors.get('engine1_egt', 0) > 950 or sensors.get('engine2_egt', 0) > 950:
            predictions.append({
                'component': 'engine',
                'issue': 'overheating',
                'severity': 'high',
                'estimated_hours': 50,
                'confidence': 0.9
            })

        # Oil system check
        if sensors.get('oil_pressure', 100) < 40:
            predictions.append({
                'component': 'oil_system',
                'issue': 'low_pressure',
                'severity': 'critical',
                'estimated_hours': 10,
                'confidence': 0.95
            })

        # Vibration check
        if sensors.get('vibration', 0) > 5.0:
            predictions.append({
                'component': 'engine_mount',
                'issue': 'excessive_vibration',
                'severity': 'medium',
                'estimated_hours': 100,
                'confidence': 0.75
            })

        # Return highest severity prediction
        if predictions:
            return max(predictions, key=lambda x: x['confidence'])

        return {'confidence': 0.0}

    async def create_maintenance_alert(self, aircraft_id: str,
                                      prediction: dict,
                                      sensors: dict,
                                      timestamp: datetime):
        """Create maintenance work order"""
        alert = {
            'aircraft_id': aircraft_id,
            'timestamp': timestamp.isoformat(),
            'prediction': prediction,
            'sensor_data': sensors,
            'priority': {
                'critical': 1,
                'high': 2,
                'medium': 3,
                'low': 4
            }.get(prediction['severity'], 5),
            'recommended_action': self.get_maintenance_action(prediction)
        }

        # Publish to maintenance system
        await self.publish_maintenance_order(alert)
```

### Satellite Tracking System

```typescript
// services/satellite-tracking.ts
import { Decimal } from "decimal.js";
import * as satellite from "satellite.js";

interface TLE {
  line1: string; // Two-Line Element Set
  line2: string;
  epoch: Date;
}

interface SatellitePosition {
  satelliteId: string;
  timestamp: Date;
  latitude: Decimal;
  longitude: Decimal;
  altitude_km: Decimal;
  velocity_kmps: Decimal;
  elevation_deg: number; // Relative to ground station
  azimuth_deg: number;
  inView: boolean;
}

class SatelliteTrackingService {
  private tleCache: Map<string, TLE> = new Map();

  constructor(
    private groundStations: Map<
      string,
      { lat: number; lon: number; alt_m: number }
    >,
  ) {}

  /**
   * Calculate satellite position using SGP4 propagator
   */
  calculatePosition(
    satelliteId: string,
    timestamp: Date,
    groundStationId?: string,
  ): SatellitePosition | null {
    const tle = this.tleCache.get(satelliteId);
    if (!tle) return null;

    // Initialize SGP4 propagator
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);

    // Propagate to timestamp
    const positionAndVelocity = satellite.propagate(satrec, timestamp);

    if (positionAndVelocity.position === false) {
      return null;
    }

    const positionEci =
      positionAndVelocity.position as satellite.EciVec3<number>;

    // Convert ECI to geodetic coordinates
    const gmst = satellite.gstime(timestamp);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    let elevation = 0;
    let azimuth = 0;
    let inView = false;

    // Calculate look angles if ground station specified
    if (groundStationId) {
      const gs = this.groundStations.get(groundStationId);
      if (gs) {
        const observerGd = {
          latitude: gs.lat * (Math.PI / 180),
          longitude: gs.lon * (Math.PI / 180),
          height: gs.alt_m / 1000, // Convert to km
        };

        const positionEcf = satellite.eciToEcf(positionEci, gmst);
        const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

        elevation = lookAngles.elevation * (180 / Math.PI);
        azimuth = lookAngles.azimuth * (180 / Math.PI);
        inView = elevation > 10; // Above horizon with margin
      }
    }

    // Calculate velocity magnitude
    const velocity = positionAndVelocity.velocity as satellite.EciVec3<number>;
    const velocityMag = Math.sqrt(
      velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2,
    );

    return {
      satelliteId,
      timestamp,
      latitude: new Decimal(positionGd.latitude * (180 / Math.PI)),
      longitude: new Decimal(positionGd.longitude * (180 / Math.PI)),
      altitude_km: new Decimal(positionGd.height),
      velocity_kmps: new Decimal(velocityMag),
      elevation_deg: elevation,
      azimuth_deg: azimuth,
      inView,
    };
  }

  /**
   * Predict next pass over ground station
   */
  async predictNextPass(
    satelliteId: string,
    groundStationId: string,
    startTime: Date,
  ): Promise<{
    aos: Date; // Acquisition of Signal
    los: Date; // Loss of Signal
    maxElevation: number;
    maxElevationTime: Date;
  } | null> {
    const timeStep = 60; // Check every 60 seconds
    const maxDuration = 24 * 60 * 60; // Search 24 hours ahead

    let currentTime = new Date(startTime);
    let inPass = false;
    let aos: Date | null = null;
    let los: Date | null = null;
    let maxElevation = 0;
    let maxElevationTime = currentTime;

    for (let elapsed = 0; elapsed < maxDuration; elapsed += timeStep) {
      const pos = this.calculatePosition(
        satelliteId,
        currentTime,
        groundStationId,
      );

      if (!pos) break;

      if (pos.inView && !inPass) {
        // Start of pass
        aos = new Date(currentTime);
        inPass = true;
        maxElevation = pos.elevation_deg;
        maxElevationTime = new Date(currentTime);
      } else if (pos.inView && inPass) {
        // During pass
        if (pos.elevation_deg > maxElevation) {
          maxElevation = pos.elevation_deg;
          maxElevationTime = new Date(currentTime);
        }
      } else if (!pos.inView && inPass) {
        // End of pass
        los = new Date(currentTime);
        break;
      }

      currentTime = new Date(currentTime.getTime() + timeStep * 1000);
    }

    if (aos && los) {
      return { aos, los, maxElevation, maxElevationTime };
    }

    return null;
  }

  /**
   * Update TLE data from space-track.org or similar
   */
  async updateTLE(
    satelliteId: string,
    line1: string,
    line2: string,
  ): Promise<void> {
    // Extract epoch from TLE
    const epochYear = parseInt(line1.substring(18, 20));
    const epochDay = parseFloat(line1.substring(20, 32));

    const year = epochYear < 57 ? 2000 + epochYear : 1900 + epochYear;
    const epoch = new Date(year, 0, epochDay);

    this.tleCache.set(satelliteId, { line1, line2, epoch });
  }
}
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.9+ (for ML/analytics)
- Node.js 18+ (for real-time services)
- 16GB RAM recommended
- Kafka, Redis, InfluxDB, PostgreSQL

### Start the System

```bash
cd domain-examples/aerospace

# Start infrastructure
docker-compose up -d

# Initialize databases
python scripts/init_db.py

# Load sample TLE data for satellites
python scripts/load_tle_data.py

# Start flight tracking service
python services/flight_tracking_service.py &

# Start maintenance predictor
python services/maintenance_predictor.py &

# Start web dashboard
npm install && npm start
```

### Simulate Flight Data

```bash
# Inject test ADS-B data
python scripts/simulate_flight.py --callsign UAL123 --origin KSFO --destination KJFK

# Monitor dashboard
open http://localhost:3000/flights
```

## 📊 Key Features

1. **Real-Time Flight Tracking**: ADS-B/ACARS message processing with sub-second latency
2. **Collision Detection**: TCAS-style separation monitoring
3. **Predictive Maintenance**: ML-based component failure prediction
4. **Satellite Tracking**: Orbital propagation with SGP4, ground station pass predictions
5. **Weather Integration**: METAR/TAF parsing, turbulence detection
6. **Safety Alerts**: Emergency detection, anomaly alerting
7. **Regulatory Compliance**: Audit logs, data retention per FAA/EASA requirements

## 🧪 Testing

### Unit Tests

```python
def test_collision_detection():
    pos1 = FlightPosition(
        flight_id='UAL123',
        callsign='UAL123',
        icao24='A12345',
        timestamp=datetime.utcnow(),
        latitude=Decimal('37.7749'),
        longitude=Decimal('-122.4194'),
        altitude_ft=35000,
        ground_speed_kts=450,
        track_degrees=90,
        vertical_rate_fpm=0,
        on_ground=False,
        squawk='2000',
        emergency=False
    )

    # Too close horizontally and vertically
    pos2 = FlightPosition(
        flight_id='AAL456',
        callsign='AAL456',
        icao24='B67890',
        timestamp=datetime.utcnow(),
        latitude=Decimal('37.7849'),  # ~1nm north
        longitude=Decimal('-122.4194'),
        altitude_ft=35500,  # 500ft above
        ground_speed_kts=460,
        track_degrees=270,
        vertical_rate_fpm=0,
        on_ground=False,
        squawk='2001',
        emergency=False
    )

    assert pos1.is_collision_risk(pos2) == True
```

## 🔒 Security & Compliance

- **FAA Part 107/108**: Regulatory compliance for aviation data
- **ICAO Annex 17**: Aviation security standards
- **Data Encryption**: AES-256 for sensitive flight data
- **Access Control**: Role-based access for operations, maintenance, safety
- **Audit Logging**: All system actions logged per regulatory requirements
- **Secure Communications**: TLS 1.3 for all data transmission
- **Cyber Security**: Protection against spoofing, jamming, unauthorized access

## 📈 Performance Targets

- **Position Update Latency**: < 100ms from ADS-B reception to display
- **Collision Detection**: < 50ms computation time
- **Satellite Position**: < 10ms calculation per satellite
- **Maintenance Prediction**: < 1 second per ACARS message
- **System Availability**: 99.999% uptime
- **Data Throughput**: 10,000+ position updates/second
- **Query Response**: < 100ms for flight history queries

## 🤖 AI/ML Applications

### Predictive Maintenance

- **Algorithm**: Isolation Forest for anomaly detection
- **Features**: Engine temperatures, pressures, vibration, oil metrics
- **Training Data**: Historical ACARS messages, maintenance logs
- **Validation**: Precision/recall on known failures, false positive rate < 5%

### Route Optimization

- **Algorithm**: Genetic algorithms, reinforcement learning
- **Optimization**: Fuel efficiency, time, weather avoidance
- **Constraints**: Airspace restrictions, aircraft performance, weather

### Demand Forecasting

- **Algorithm**: LSTM time-series forecasting
- **Input**: Historical bookings, seasonality, events, economic indicators
- **Output**: Passenger demand by route, dynamic pricing recommendations

## 🔗 Related Patterns

- [Event-Driven Architecture](../../architectures/event-driven/README.md)
- [Real-Time Processing](../../architectures/microservices/README.md)
- [Time-Series Data](../energy/README.md)
- [IoT Integration](../manufacturing/README.md)

## 📚 Industry Standards & Protocols

- **ARINC 429**: Aircraft data bus
- **ACARS**: Aircraft Communications Addressing and Reporting System
- **ADS-B**: Automatic Dependent Surveillance-Broadcast
- **DO-178C**: Software considerations in airborne systems
- **DO-254**: Hardware design assurance
- **ICAO**: International Civil Aviation Organization standards

## 🌐 Integration Points

- **Flight Planning Systems**: OAG, Sabre, Amadeus
- **Weather Services**: NOAA, Weather.gov, Aviation Weather Center
- **Air Traffic Control**: FAA SWIM, Eurocontrol Network Manager
- **Maintenance Systems**: AMOS, TRAX, Maintenix
- **Satellite Operators**: NORAD, Space-Track.org

---

**Note**: This is a learning template for aerospace software systems. Real aviation systems require DO-178C certification, extensive testing, and regulatory approval. Always consult with aviation authorities and follow safety-critical development processes.
