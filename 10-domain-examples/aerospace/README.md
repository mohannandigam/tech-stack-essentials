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

## 🎓 Expert Knowledge

### Space Mission Types

Different orbits serve different purposes — the altitude and path of a satellite determine what it can do:

| Orbit Type | Altitude | Period | Use Cases |
|-----------|----------|--------|-----------|
| **LEO** (Low Earth Orbit) | 160–2,000 km | 90–120 min | ISS, Earth observation, Starlink internet, spy satellites |
| **MEO** (Medium Earth Orbit) | 2,000–35,786 km | 2–24 hours | GPS (20,200 km), Galileo navigation, O3b internet |
| **GEO** (Geostationary Orbit) | 35,786 km | 24 hours (stays "fixed" above one spot) | Weather satellites, TV broadcast, communications |
| **HEO** (Highly Elliptical Orbit) | 500–40,000 km | Varies | Molniya (Russian comms over polar regions), Sirius radio |
| **Deep Space** | Beyond Earth orbit | Days to years | Mars missions, Voyager, James Webb (L2 point at 1.5M km) |

**Simple analogy**: Think of orbits like lanes on a track. The inner lane (LEO) is fast and close — great for quick laps and seeing details on the ground. The outer lane (GEO) is so far out that you appear to stand still relative to the track — perfect for broadcasting to a fixed area. Deep space is leaving the stadium entirely.

### Orbital Mechanics Basics

**Why orbits work**: A satellite in orbit is falling toward Earth but moving forward fast enough that the curvature of Earth "falls away" beneath it at the same rate. It is in constant free fall — just always missing the ground.

**Kepler's Three Laws (in plain English)**:

1. **Law of Ellipses**: Orbits are oval-shaped (ellipses), not perfect circles. Earth sits at one focus of the ellipse, not the center. This means satellites are sometimes closer (perigee) and sometimes farther (apogee) from Earth.

2. **Law of Equal Areas**: A satellite moves faster when it is closer to Earth and slower when farther away. Imagine swinging a ball on a string — pull the string shorter and it whips around faster. This is the same principle.

3. **Law of Periods**: The farther out a satellite orbits, the longer it takes to go around. LEO satellites orbit in ~90 minutes. The Moon (at ~384,000 km) takes ~27 days. The math: orbital period squared is proportional to the semi-major axis cubed (T² ∝ a³).

**Delta-v**: The "currency" of space travel. Every maneuver costs delta-v (change in velocity). Engineers budget delta-v the way accountants budget money — you only have so much fuel, so every burn must count.

### Aircraft Systems Overview

Modern aircraft are flying data centers. Here are the key systems software engineers interact with:

- **Avionics**: The electronic systems on an aircraft. Includes flight instruments, navigation, communication, and autopilot. Modern avionics use ARINC 429/664 data buses to share data between systems.

- **FMS (Flight Management System)**: The "brain" of the aircraft. Pilots enter a flight plan, and the FMS calculates the optimal route, fuel burn, descent profile, and sends commands to autopilot. Think of it as GPS navigation for airplanes, but with 3D routing and fuel optimization.

- **TCAS (Traffic Collision Avoidance System)**: An independent safety system that tracks nearby aircraft via transponder signals. If two planes get too close, TCAS issues a **TA** (Traffic Advisory — "hey, look out") then an **RA** (Resolution Advisory — "CLIMB NOW" or "DESCEND NOW"). Pilots must follow TCAS RAs even if ATC says otherwise.

- **EGPWS (Enhanced Ground Proximity Warning System)**: Compares the aircraft's position and trajectory against a terrain database. If the plane is flying toward a mountain, EGPWS shouts "TERRAIN, TERRAIN — PULL UP!" This system has nearly eliminated controlled flight into terrain (CFIT) accidents.

- **ACARS (Aircraft Communications Addressing and Reporting System)**: A text-messaging system between aircraft and ground. Sends maintenance data, weather updates, gate assignments, and position reports. Think of it as email for airplanes — automatic and crew-initiated messages.

- **ADS-B (Automatic Dependent Surveillance–Broadcast)**: Aircraft broadcast their GPS position, altitude, speed, and identity every second. Anyone with a receiver can see them (that is how Flightradar24 works). Replacing radar as the primary surveillance method.

### Air Traffic Management Layers

Air traffic control operates in layers, each handling different phases of flight:

```
┌─────────────────────────────────────────────────────┐
│  Oceanic Control (over oceans — no radar, use ADS-B │
│  and HF radio, 10-minute position reports)          │
├─────────────────────────────────────────────────────┤
│  En-Route / Area Control (cruise altitude)          │
│  Centers like ZNY, ZLA manage large sectors         │
│  Radar + ADS-B, vertical separation 1000ft          │
├─────────────────────────────────────────────────────┤
│  Approach / TRACON (Terminal Radar Approach Control) │
│  30-50 mile radius around major airports            │
│  Sequence arrivals, manage departures               │
├─────────────────────────────────────────────────────┤
│  Tower Control (airport surface + immediate airspace)│
│  Clears takeoffs, landings, runway crossings        │
├─────────────────────────────────────────────────────┤
│  Ground Control (taxiways and gates)                │
│  "Taxi to runway 28L via Alpha, Bravo"              │
└─────────────────────────────────────────────────────┘
```

Each handoff between layers is a critical moment — the receiving controller must acknowledge and accept responsibility for the aircraft.

### Space Debris Tracking and Collision Avoidance

**The Problem**: There are ~36,000 tracked objects larger than 10 cm in orbit, plus hundreds of millions of smaller pieces. At orbital speeds (7.8 km/s in LEO), even a 1 cm paint flake hits with the energy of a hand grenade.

**Kessler Syndrome**: A theoretical chain reaction where one collision creates debris that causes more collisions, eventually making certain orbits unusable. Named after NASA scientist Donald Kessler who predicted it in 1978. Some scientists believe it has already begun in certain LEO bands.

**How tracking works**:
1. **Detection**: Ground-based radar (US Space Fence) and optical telescopes track objects
2. **Cataloging**: NORAD assigns each object an ID and maintains TLE (Two-Line Element) data
3. **Prediction**: Software propagates orbits forward to find close approaches (conjunction events)
4. **Warning**: If two objects will pass within a dangerous threshold, operators receive a CDM (Conjunction Data Message)
5. **Avoidance**: Spacecraft with propulsion can perform a collision avoidance maneuver (typically days before the event)

**Software challenge**: Predicting orbits is hard because of atmospheric drag (variable), solar radiation pressure, gravitational perturbations from the Moon and Sun, and imprecise measurements. The uncertainty grows over time — a 10-meter prediction error today becomes kilometers of uncertainty in a week.

## 🌍 Real-World Examples

### How SpaceX Landing Software Works (Simplified)

SpaceX Falcon 9 boosters land themselves using a system called the **Autonomous Flight Safety System (AFSS)** and guidance algorithms. Here is the simplified flow:

1. **Boostback Burn**: After stage separation, the booster flips and fires engines to reverse course toward the landing zone. The guidance computer calculates the optimal trajectory in real time using convex optimization (finding the best path given fuel constraints).

2. **Grid Fins Deploy**: Four titanium grid fins steer the booster through the atmosphere. The flight computer adjusts fin angles thousands of times per second to keep the booster on course.

3. **Entry Burn**: Three engines fire to slow the booster from supersonic speeds and protect it from aerodynamic heating. Timing is calculated based on remaining fuel and atmospheric density.

4. **Landing Burn**: A single engine fires at the last moment for a "hoverslam" — the booster cannot hover (thrust-to-weight ratio > 1 even at minimum throttle), so it must time the burn so that velocity reaches zero exactly at ground level. The margin for error is less than a second.

5. **Feedback Loop**: Throughout the descent, the computer runs hundreds of trajectory optimizations per second, adjusting for wind, engine performance variations, and position errors. It uses sensor fusion from GPS, IMU (inertial measurement unit), and radar altimeter.

**Key insight**: The software must find optimal solutions to constrained problems in real time. SpaceX uses a technique called "powered descent guidance" based on research originally done for Mars landing — the same math that could land a rocket on Mars lands boosters on drone ships in the ocean.

### How Airlines Handle Flight Disruptions (IROPS)

**IROPS** = Irregular Operations. When weather, mechanical issues, or crew problems disrupt the schedule, airlines must solve a massive optimization problem in real time:

1. **The Cascade Effect**: One delayed flight means the aircraft, crew, and passengers miss their connections. A single cancellation at a hub can affect 50+ downstream flights.

2. **The Optimization Problem**: Airlines must simultaneously re-solve:
   - **Aircraft routing**: Which planes go where? (Each aircraft has a maintenance schedule)
   - **Crew scheduling**: Pilots have legal duty-time limits (FAA Part 117) — you cannot just add hours
   - **Passenger rebooking**: Thousands of passengers need new itineraries, prioritized by status, connection urgency, and fare class
   - **Gate assignment**: Gates must be shuffled to accommodate new arrival/departure times

3. **Software Systems**: Airlines use operations control centers (OCC) running systems like Jeppesen, Sabre, or proprietary tools. These systems use constraint-satisfaction algorithms and mixed-integer programming to find the "least bad" solution — minimizing total delay, passenger misconnections, and cost.

4. **Scale**: Major airlines operate 3,000–5,000 flights per day. During a major weather event, the rebooking system may process 100,000+ passenger itinerary changes in hours.

### How GPS Satellites Maintain Time Sync

GPS depends on incredibly precise timing — a 1-nanosecond clock error translates to ~30 cm of position error. Here is how the system stays synchronized:

1. **Atomic Clocks**: Each GPS satellite carries 2–4 atomic clocks (rubidium and cesium). These drift by about 1 second every 100,000 years.

2. **Relativistic Corrections**: Einstein's relativity causes two effects:
   - **Special relativity**: Satellite clocks run ~7 microseconds/day slow (because they move fast)
   - **General relativity**: Satellite clocks run ~45 microseconds/day fast (because gravity is weaker at altitude)
   - **Net effect**: Clocks run ~38 microseconds/day fast. Without correction, GPS would drift ~11 km/day
   - The correction is pre-programmed into the satellite clock frequency (10.22999999543 MHz instead of 10.23 MHz)

3. **Ground Monitoring**: The US Air Force monitors satellite clocks from ground stations worldwide and uploads corrections twice daily.

4. **Software Impact**: GPS receivers must apply these corrections, ephemeris data (satellite position), and atmospheric delay models. The math is a system of equations solved for 4 unknowns: x, y, z position plus receiver clock offset (which is why you need minimum 4 satellites).

### How MRO (Maintenance, Repair, Overhaul) Scheduling Works

Aircraft maintenance is not "fix it when it breaks" — it follows strict scheduled intervals defined by the manufacturer and regulator:

1. **Check Types**:
   - **Line Check**: Every flight or daily — walk-around inspection, fluid levels, tire condition (~1 hour)
   - **A Check**: Every 400–600 flight hours — detailed inspection of systems and components (~1–2 days)
   - **C Check**: Every 18–24 months — heavy inspection, structural checks, system overhauls (~1–2 weeks, aircraft out of service)
   - **D Check**: Every 6–12 years — the aircraft is essentially taken apart and rebuilt (~2 months, cost $2–5 million)

2. **MEL (Minimum Equipment List)**: Not everything must work for the aircraft to fly. The MEL defines what can be deferred. For example, one of two coffee makers can be broken, but not one of two engines. Deferred items have repair deadlines (A = 3 days, B = 3 days, C = 10 days, D = 120 days).

3. **Scheduling Software**: MRO systems (AMOS, TRAX, Maintenix) track:
   - Flight hours, cycles (takeoff + landing = 1 cycle), and calendar time for every component
   - Parts inventory across warehouses worldwide
   - Hangar availability at maintenance facilities
   - Technician skills and certification

4. **Optimization Challenge**: Airlines must schedule heavy checks during low-demand periods, route aircraft to maintenance bases without dead-heading (flying empty), and coordinate parts procurement months in advance. This is a resource-constrained scheduling problem solved with operations research techniques.

## 🔧 Deep Dive — Predictive Maintenance

Predictive maintenance (PdM) is the highest-value application of software in aviation. A single unscheduled engine removal costs $1–5 million and strands hundreds of passengers. PdM uses sensor data and machine learning to predict failures **before** they happen, letting airlines schedule repairs during planned downtime instead of reacting to surprises.

### Condition-Based vs Predictive Maintenance

There are three philosophies for maintaining aircraft components. Think of them using a car analogy:

- **Scheduled (Time-Based)**: Change your car oil every 5,000 miles whether it needs it or not. Safe but wasteful — you replace parts that still have life left.
- **Condition-Based (CBM)**: Check the tire tread depth and replace when it's low. Better — you use more of each part's life. Requires inspection.
- **Predictive (PdM)**: Your dashboard says "brakes need replacing in 2,000 miles" based on wear patterns. Best — you plan ahead, order parts in advance, and schedule the repair when convenient.

| Approach | Cost | Effectiveness | Complexity | When to Use |
|----------|------|--------------|------------|-------------|
| **Scheduled** | High (over-maintenance) | Good safety, wasteful | Low | Regulatory-mandated items, life-limited parts |
| **Condition-Based** | Medium | Good — replaces at right time | Medium | Components with observable wear (brakes, tires) |
| **Predictive** | Lowest long-term | Best — plans ahead | High | Engines, APU, landing gear, avionics with sensor data |

In practice, airlines use **all three** simultaneously. Regulatory requirements dictate scheduled checks. CBM handles observable wear items. PdM targets the expensive, complex components where early warning saves millions.

### Failure Modes & Effects Analysis (FMEA)

**What is it?** FMEA is a systematic catalog of everything that can fail in a system, how likely each failure is, how bad it would be, and how detectable it is. Think of it as a "worry list" ranked by priority.

**Simple analogy**: Imagine listing every way your car could break down, rating each by how dangerous it is (severity), how often it happens (occurrence), and how likely you are to notice before it's too late (detection). Multiply those three numbers together and fix the highest scores first.

**How RPN Works**:
- **Severity** (1–10): 1 = no effect, 10 = catastrophic (loss of aircraft)
- **Occurrence** (1–10): 1 = extremely unlikely, 10 = almost certain
- **Detection** (1–10): 1 = always detected early, 10 = undetectable until failure
- **RPN** = Severity × Occurrence × Detection (range: 1–1,000)

**Example FMEA for a Turbofan Engine**:

| Component | Failure Mode | Severity | Occurrence | Detection | RPN | Action |
|-----------|-------------|----------|------------|-----------|-----|--------|
| Turbine blade | Crack propagation | 9 | 3 | 4 | 108 | Borescope inspection every 500 cycles |
| Oil pump | Reduced flow rate | 7 | 2 | 3 | 42 | Oil pressure sensor + trending |
| Main bearing | Excessive wear | 8 | 2 | 5 | 80 | Vibration monitoring + oil debris analysis |
| Fuel nozzle | Coking/blockage | 6 | 4 | 3 | 72 | EGT spread monitoring |
| Compressor blade | Foreign object damage | 8 | 3 | 6 | 144 | Borescope + N2 vibration trending |
| Oil filter | Clogging | 4 | 3 | 2 | 24 | Differential pressure sensor |

**Why this matters for software engineers**: Your ML models should be guided by FMEA. The components with the highest RPN are where predictive models add the most value. Don't build models for things that are cheap to replace or easy to detect — focus on the high-RPN items.

### Remaining Useful Life (RUL) Estimation

**What is it?** RUL answers one question: "How many more flight cycles (or hours) can this component operate before it fails?" It's the core output of a predictive maintenance system.

**Simple analogy**: Your phone battery degrades over time. RUL estimation is like predicting "you have 8 months before this battery holds less than 80% charge" — based on how fast it's been degrading so far.

**Three Approaches**:

1. **Physics-based degradation models**: Use engineering knowledge of how materials wear. Example: turbine blade creep models that predict remaining life based on temperature exposure history. Accurate but require deep domain expertise.

2. **Survival analysis**: Statistical approach borrowed from medical research ("how long until event X?"). Kaplan-Meier curves and Cox proportional hazards models estimate probability of failure over time given observed covariates.

3. **Data-driven ML**: Train models on historical sensor data from components that eventually failed. The model learns the degradation signature and predicts when a new component will reach the failure threshold.

```python
import numpy as np

def estimate_rul_from_egt_margin(egt_margin_history, failure_threshold=0):
    """
    Estimate Remaining Useful Life from EGT margin degradation.

    EGT margin = (max allowable EGT) - (actual EGT at takeoff thrust).
    As an engine degrades, EGT rises and margin shrinks toward zero.

    Why this works:
    - EGT margin is the single best indicator of turbofan health
    - Degradation is roughly linear over long periods
    - When margin reaches zero, engine must be removed for overhaul

    Args:
        egt_margin_history: List of (cycle_number, egt_margin_celsius) tuples
        failure_threshold: Margin value that triggers removal (default 0°C)

    Returns:
        Estimated cycles remaining until removal
    """
    cycles = np.array([point[0] for point in egt_margin_history])
    margins = np.array([point[1] for point in egt_margin_history])

    # Fit a linear trend to the degradation
    slope, intercept = np.polyfit(cycles, margins, deg=1)

    if slope >= 0:
        return float('inf')  # Margin is not degrading — no removal predicted

    # Extrapolate: at what cycle does margin hit the threshold?
    cycles_to_threshold = (failure_threshold - intercept) / slope
    current_cycle = cycles[-1]

    return max(0, int(cycles_to_threshold - current_cycle))


# Example: engine with shrinking EGT margin
history = [
    (0, 55),      # New engine: 55°C margin
    (500, 50),    # After 500 cycles: 50°C margin
    (1000, 46),   # After 1000 cycles: 46°C margin
    (1500, 41),   # Degradation accelerating slightly
    (2000, 35),
]

rul = estimate_rul_from_egt_margin(history)
print(f"Estimated remaining cycles: {rul}")
# Output: ~1500 cycles until EGT margin reaches 0
```

### Advanced ML Models for Maintenance

Different failure modes require different ML approaches. Choosing the wrong model architecture wastes months of development time.

**LSTM (Long Short-Term Memory) for Time-Series**

Why sequence matters: A slow, steady rise in EGT over 200 flights is normal degradation. A sudden 5°C spike in one flight is an anomaly. Standard tabular models can't tell the difference — they see a snapshot, not the trajectory. LSTMs process sequences and learn temporal patterns like "when vibration increases for 3 consecutive flights, failure follows within 50 cycles."

**Autoencoders for Anomaly Detection**

Train an autoencoder on data from **healthy** engines only. It learns to reconstruct normal sensor patterns. When a degrading engine's data passes through, the reconstruction error spikes because the model has never seen that pattern. High reconstruction error = anomaly flag.

**Ensemble Methods for Reliability**

Combine multiple models (Random Forest + Gradient Boosting + LSTM) and take a weighted vote. If two out of three models predict imminent failure, flag the component. Ensembles reduce false alarms, which is critical — every false alarm erodes technician trust.

| Model | Best For | Strength | Weakness |
|-------|----------|----------|----------|
| **LSTM** | Degradation trending | Captures temporal patterns | Needs long sequences, slow to train |
| **Autoencoder** | Anomaly detection | Works with healthy-only data | Can't predict *when* failure occurs |
| **Random Forest** | Feature-rich tabular data | Fast, interpretable | Misses sequential patterns |
| **Gradient Boosting** | Structured data with mixed types | High accuracy | Prone to overfitting small datasets |
| **Survival Models** | Time-to-event prediction | Handles censored data | Assumes proportional hazards |

### Feature Engineering for Aircraft Sensors

Raw sensor readings are nearly useless for ML. A single EGT reading of 450°C means nothing without context — is this takeoff or cruise? Is this a new engine or one with 5,000 cycles? Feature engineering transforms raw data into meaningful signals.

**Key Feature Types**:

- **Rolling averages**: Smooth out noise. A 10-flight rolling average of EGT removes flight-to-flight variation and reveals the underlying trend.
- **Rate of change**: How fast is a parameter changing? `delta_EGT = (EGT_today - EGT_30_flights_ago) / 30`. A sudden increase in rate-of-change is more alarming than a high absolute value.
- **Cross-sensor ratios**: EGT/N1 ratio normalizes engine temperature by thrust level. If the ratio increases, the engine is running hotter for the same thrust — a degradation signal.
- **Flight-phase-specific baselines**: Takeoff EGT of 900°C is normal. Cruise EGT of 900°C is an emergency. Always segment data by flight phase (takeoff, climb, cruise, descent, landing) before computing features.

```python
import pandas as pd
import numpy as np

class AircraftFeatureEngineer:
    """
    Transform raw sensor readings into ML-ready features.

    Why feature engineering matters:
    - Raw sensor data has noise, missing values, and phase-dependent behavior
    - Models need normalized, context-aware features to learn meaningful patterns
    - Good features can make a simple model outperform a complex one on raw data
    """

    def __init__(self, window_size=10):
        self.window_size = window_size  # Number of flights for rolling stats

    def compute_features(self, flight_data: pd.DataFrame) -> pd.DataFrame:
        """
        Compute features from a DataFrame with columns:
        flight_number, egt, n1, n2, oil_temp, vibration, flight_phase
        """
        features = pd.DataFrame()
        features['flight_number'] = flight_data['flight_number']

        # Rolling statistics — smooth out noise, reveal trends
        for param in ['egt', 'n1', 'vibration', 'oil_temp']:
            features[f'{param}_rolling_mean'] = (
                flight_data[param].rolling(self.window_size).mean()
            )
            features[f'{param}_rolling_std'] = (
                flight_data[param].rolling(self.window_size).std()
            )

        # Rate of change — how fast is degradation progressing?
        for param in ['egt', 'vibration']:
            features[f'{param}_rate_of_change'] = (
                flight_data[param].diff(periods=self.window_size)
                / self.window_size
            )

        # Cross-sensor ratios — normalize by operating condition
        features['egt_n1_ratio'] = flight_data['egt'] / flight_data['n1']
        features['egt_oil_ratio'] = flight_data['egt'] / flight_data['oil_temp']

        # Deviation from phase-specific baseline
        phase_baselines = flight_data.groupby('flight_phase')['egt'].transform('mean')
        features['egt_phase_deviation'] = flight_data['egt'] - phase_baselines

        return features.dropna()  # Drop rows where rolling window isn't full yet
```

### Handling Imbalanced Data

**The problem**: In a fleet of 200 aircraft flying 4 flights/day, you might see 1 unscheduled engine removal per year out of ~290,000 flights. That's a 0.0003% failure rate. A model that always predicts "no failure" achieves 99.9997% accuracy — and is completely useless.

**Simple analogy**: Imagine a fire alarm that never goes off. It's "accurate" 99.99% of the time, but it fails at the one job that matters.

**Solutions**:

1. **SMOTE (Synthetic Minority Over-sampling)**: Generate synthetic failure examples by interpolating between real failure cases. This balances the dataset without just duplicating the rare events.

2. **Class weighting**: Tell the model that missing a real failure is 1,000x worse than a false alarm. Most frameworks support this natively.

3. **Anomaly detection framing**: Instead of binary classification ("will it fail?"), frame it as anomaly detection ("is this engine behaving abnormally?"). Train only on healthy data, flag deviations.

4. **Use the right metrics**: Never use accuracy. Use:
   - **Precision**: Of all alerts raised, how many were real failures?
   - **Recall**: Of all real failures, how many did we catch?
   - **F1 Score**: Harmonic mean of precision and recall
   - In aviation, **recall is king** — missing a real failure is far worse than a false alarm

```python
from sklearn.ensemble import GradientBoostingClassifier

# Class weighting: penalize missed failures heavily
# "failure" class gets 1000x the weight of "normal" class
model = GradientBoostingClassifier(
    n_estimators=200,
    max_depth=5,
    # sample_weight applied during fit — not a constructor param
)

# Apply weights during training
sample_weights = np.where(y_train == 1, 1000, 1)
model.fit(X_train, y_train, sample_weight=sample_weights)
```

### Model Explainability

**Why it matters**: A maintenance engineer will not ground an aircraft because "the model said so." They need to know **why** the model flagged this engine. Explainability is not optional in aviation — it's the difference between a tool that gets used and one that gets ignored.

**Simple analogy**: A doctor doesn't just say "you're sick." They explain: "Your white blood cell count is elevated, you have a fever, and your throat is swollen — so you likely have an infection." PdM models need to explain their reasoning the same way.

**SHAP (SHapley Additive exPlanations)**: Assigns each feature a contribution score for each prediction. "This engine was flagged because EGT rate-of-change contributed +0.35 to the risk score, vibration contributed +0.20, and oil temperature contributed +0.10."

**LIME (Local Interpretable Model-agnostic Explanations)**: Creates a simple, interpretable model (like linear regression) that approximates the complex model's behavior for a single prediction. Good for one-off explanations.

```python
import shap

# After training a model on maintenance data
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# For a single flagged engine — which sensors drove the alert?
# shap_values[i] shows each feature's contribution for prediction i
# Positive = pushes toward "failure", Negative = pushes toward "healthy"

# Example output for a flagged engine:
# egt_rate_of_change:    +0.35  (EGT rising faster than normal)
# vibration_rolling_std: +0.20  (vibration becoming erratic)
# egt_n1_ratio:          +0.15  (engine running hotter per unit thrust)
# oil_temp_rolling_mean: +0.10  (oil running warmer)
# n2_rolling_mean:       -0.05  (core speed is actually normal)
```

### Feedback Loops & Continuous Learning

A predictive maintenance model is not a "train once, deploy forever" system. Aircraft age, fleet composition changes, and maintenance practices evolve. Without feedback loops, model accuracy degrades over time.

**Confirmed failure feedback**: When a model predicts failure and the technician confirms it during inspection, that's a **true positive**. When a model raises an alert but inspection finds nothing wrong, that's a **false positive**. Both outcomes must feed back into training data to improve the model.

**Concept drift in aging aircraft**: A model trained on a fleet with average age 5 years will perform poorly when that fleet reaches 15 years. Degradation patterns shift — older aircraft have different baseline sensor values, different failure modes, and different component interactions. Retrain periodically on recent data.

**Champion/Challenger deployment**:
1. The current production model (champion) makes all real decisions
2. A new candidate model (challenger) runs in shadow mode — it scores every engine but its predictions are logged, not acted on
3. After 3–6 months, compare champion vs challenger performance on confirmed outcomes
4. If the challenger is better, promote it to champion
5. This prevents deploying a worse model to production

```
Feedback Loop Flow:

Sensor Data → Model Prediction → Maintenance Action → Outcome
                                                         │
                  ┌──────────────────────────────────────┘
                  ▼
        [True Positive? False Positive? Missed Failure?]
                  │
                  ▼
        Update Training Dataset → Retrain Model → Validate → Deploy
```

---

## 🏭 Aircraft Health Monitoring — End-to-End Pipeline

Building a working health monitoring system requires connecting dozens of components across aircraft, communications networks, and ground infrastructure. Here's the full pipeline:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌───────────────┐
│  AIRCRAFT    │    │  DATA LINK   │    │   GROUND     │    │  ANALYTICS    │
│             │    │              │    │  INGESTION   │    │              │
│ Sensors     │───▶│ ACARS/       │───▶│ Kafka        │───▶│ Feature      │
│ (EGT, N1,  │    │ SATCOM /     │    │ Cluster      │    │ Engineering  │
│  Vib, Oil)  │    │ Wi-Fi at     │    │              │    │              │
│             │    │ gate         │    │ Data Quality │    │ Model        │
│ Edge CPU    │    │              │    │ Gates        │    │ Scoring      │
│ (filtering, │    │ Latency:     │    │              │    │              │
│  compression│    │ In-flight:   │    │ Schema       │    │ Alert        │
│  anomaly    │    │  2-30 min    │    │ Validation   │    │ Generation   │
│  pre-screen)│    │ At gate:     │    │              │    │              │
│             │    │  real-time   │    │ Dedup &      │    │ Severity     │
└─────────────┘    └──────────────┘    │ Ordering     │    │ Classification│
                                       └───────────────┘    └──────┬────────┘
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    ▼
┌───────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ MAINTENANCE   │    │  TECHNICIAN  │    │  FEEDBACK    │    │  RETRAIN     │
│ PLANNING      │    │              │    │              │    │              │
│               │    │ Receives     │    │ Inspection   │    │ Updated      │
│ Work Order    │◀──│ work order   │───▶│ result fed   │───▶│ training     │
│ Generation    │    │ with model   │    │ back:        │    │ data →       │
│               │    │ explanation  │    │ confirmed /  │    │ retrain      │
│ Parts Pre-    │    │ + sensor     │    │ false alarm  │    │ quarterly    │
│ Ordering      │    │ charts       │    │              │    │              │
│               │    │              │    │              │    │              │
│ Schedule      │    │ Makes final  │    │              │    │              │
│ Optimization  │    │ go/no-go     │    │              │    │              │
│               │    │ decision     │    │              │    │              │
└───────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

**Data Quality Gates at Each Stage**:

| Stage | Quality Check | What Happens on Failure |
|-------|--------------|------------------------|
| **Edge (on aircraft)** | Sensor range validation, stuck-sensor detection | Discard reading, flag sensor for maintenance |
| **Data link** | Message integrity (CRC), sequence numbering | Request retransmission or mark gap |
| **Ground ingestion** | Schema validation, deduplication, timestamp ordering | Reject malformed messages, log for investigation |
| **Feature engineering** | Null/NaN checks, statistical outlier detection | Impute or exclude flight from scoring |
| **Model scoring** | Confidence threshold (only alert if confidence > 0.85) | Low-confidence scores logged but not alerted |
| **Alert generation** | Cross-check with maintenance history (was this part just serviced?) | Suppress alert if part was recently replaced |

**Latency Expectations**:

| Stage | Typical Latency | Notes |
|-------|----------------|-------|
| Sensor → Edge processing | < 1 second | On-board computer |
| Edge → Ground (in-flight) | 2–30 minutes | ACARS burst every few minutes |
| Edge → Ground (at gate) | < 10 seconds | Wi-Fi bulk download |
| Ground ingestion | < 30 seconds | Kafka + stream processing |
| Feature engineering + scoring | < 2 minutes | Batch per flight arrival |
| Alert → Maintenance planner | < 5 minutes | Dashboard + notification |
| **Total (at gate)** | **< 10 minutes** | From engine shutdown to actionable alert |

---

## ✈️ Engine Health Management — Deep Dive

Engines are the most expensive components on an aircraft ($10–40 million each) and the most data-rich. Engine Health Management (EHM) is the most mature application of predictive maintenance in aviation.

### How a Turbofan Engine Works

A turbofan engine follows four steps, sometimes summarized as **"suck, squeeze, bang, blow"**:

```
                    ┌─────────────────────────────────────────────┐
  Air In ──▶       │  FAN  │ COMPRESSOR │ COMBUSTION │ TURBINE │ NOZZLE  ──▶ Thrust Out
                    │       │            │   CHAMBER  │         │         │
                    │ Suck  │  Squeeze   │    Bang    │  Blow   │  Blow   │
                    └─────────────────────────────────────────────┘
                                                         │
                              Turbine drives compressor ◀─┘
                              and fan via shaft
```

1. **Fan (Suck)**: The large front fan pulls in massive amounts of air. Most of this air bypasses the core (bypass ratio 8:1 to 12:1 on modern engines) and provides most of the thrust.
2. **Compressor (Squeeze)**: Multiple stages of rotating blades compress the remaining air to 30–50x atmospheric pressure.
3. **Combustion Chamber (Bang)**: Fuel is injected and ignited. Temperatures reach 1,500–2,000°C — hotter than the melting point of the turbine blades (they survive thanks to ceramic coatings and internal cooling channels).
4. **Turbine (Blow)**: Hot gas spins the turbine, which drives the compressor and fan via a shaft. This is where energy is extracted.
5. **Nozzle (Blow)**: Remaining gas accelerates out the back, providing additional thrust.

### Key Engine Parameters

These are the vital signs every EHM system monitors:

| Parameter | What It Measures | Normal Range (Cruise) | Warning Sign |
|-----------|-----------------|----------------------|--------------|
| **EGT** (Exhaust Gas Temp) | Temperature after turbine | 400–550°C | Margin < 15°C or sudden rise > 5°C |
| **EGT Margin** | Max allowable EGT minus actual | 20–60°C (new engine) | < 10°C = schedule removal |
| **N1** (Fan Speed) | Fan RPM as % of max | 85–95% at cruise | Unusual vibration at specific N1 |
| **N2** (Core Speed) | Core compressor RPM as % of max | 90–100% at cruise | N2 increasing to maintain same thrust |
| **Oil Temperature** | Lubrication system temp | 60–100°C | Sustained > 120°C |
| **Oil Pressure** | Lubrication system pressure | 40–100 psi | Dropping below 30 psi |
| **Oil Consumption** | Rate of oil usage | 0.1–0.3 qt/hr | Sudden increase (seal leak) |
| **Vibration** | Rotating component balance | < 1.0 IPS (inches/sec) | > 1.5 IPS or sudden change |
| **Fuel Flow** | Rate of fuel consumption | Varies by thrust setting | Increasing to maintain same thrust |

### Engine Trend Monitoring

Airlines don't wait for a parameter to hit a red line. They track **trends** over hundreds of flights to catch slow degradation before it becomes critical.

**How it works**:
1. After every flight, the EHM system records a "snapshot" of engine parameters at a standardized condition (typically cruise at a specific altitude and Mach number).
2. These snapshots are plotted over time. Each dot is one flight.
3. A linear (or polynomial) fit reveals the degradation trend.
4. When the trend line projects to hit a limit within N flights, an alert fires.

**What to watch for**:
- **Steady degradation**: Normal. All engines degrade. The question is *how fast*.
- **Step change**: A sudden shift (e.g., EGT jumps 8°C between two flights) indicates a discrete event — possible blade damage, seal failure, or instrument fault.
- **Trend reversal**: If EGT was climbing and suddenly drops, something changed — possibly an engine wash restored performance, or a sensor shifted.
- **Increasing scatter**: If flight-to-flight variation grows, the engine may be entering an unstable regime.

### Engine Wash Scheduling

**What is it?** Over time, dirt, salt, and pollutants accumulate on compressor blades, reducing aerodynamic efficiency. An engine wash (water or chemical solution injected while the engine runs) cleans the blades and restores lost performance.

**Simple analogy**: Like cleaning a clogged air filter on your car — the engine breathes better and runs cooler.

**Key facts**:
- A wash typically recovers 5–15°C of EGT margin
- The first wash after a long period gives the biggest improvement; subsequent washes have diminishing returns
- Cost: $5,000–15,000 per wash (including aircraft downtime)
- A wash that recovers 10°C of EGT margin can delay a $5 million engine overhaul by hundreds of cycles

**Optimization problem**: Wash too often = waste money. Wash too rarely = accelerated degradation and earlier overhaul. The optimal schedule depends on operating environment (desert/coastal routes degrade faster), engine age, and current EGT margin trajectory.

---

## 📦 Parts & Supply Chain Management

Aircraft maintenance is only possible if the right part is in the right place at the right time. A missing $200 seal can keep a $150 million aircraft on the ground. Parts management is where predictive maintenance meets logistics.

### Part Categories

**Rotable Parts** — Repairable components that cycle through a pool.

*Analogy*: Like library books. When you return one, it gets inspected, repaired if needed, and goes back on the shelf for the next borrower. Examples: actuators, pumps, heat exchangers, avionics boxes.

- When a rotable fails, it's removed and sent to a repair shop
- A serviceable spare from the pool is installed immediately
- The repaired unit returns to the pool for future use
- Airlines track: total pool size, serviceable stock, average repair turnaround time (TAT)

**Consumable Parts** — Replaced and discarded after use.

Examples: filters, seals, O-rings, brake pads, light bulbs. These are ordered in bulk and kept in stock at maintenance bases. The challenge is demand forecasting — order too many and capital is tied up; order too few and aircraft sit waiting.

**Life-Limited Parts (LLPs)** — Must be replaced after a fixed number of cycles, regardless of condition.

Examples: turbine disks, fan hubs, compressor disks. These are the structural components inside engines that experience extreme stress. Even if they look perfect at inspection, metallurgical fatigue accumulates invisibly. Regulatory authorities set hard cycle limits (e.g., 20,000 cycles). Exceeding the limit is illegal.

### AOG — Aircraft On Ground

**What is it?** AOG is the aviation industry's highest-priority status. It means an aircraft cannot fly because a required part or repair is missing. Every minute of AOG costs the airline money:

- **Direct cost**: $10,000–$150,000 per hour depending on aircraft type and route
- **Indirect cost**: Passenger rebooking, crew disruption, knock-on delays to the rest of the schedule
- **AOG desks**: Every major airline and parts supplier operates a 24/7 AOG desk. When an AOG call comes in, it triggers an emergency logistics chain — parts are located worldwide, chartered if necessary, and couriered to the aircraft

### How Predictive Maintenance Feeds Parts Management

This is where PdM delivers its highest ROI — not by predicting failures, but by enabling **proactive parts ordering**:

1. PdM model predicts: "Engine serial number 12345 will need turbine blade replacement in ~300 cycles (approximately 3 months)"
2. Parts team orders blades from the manufacturer (lead time: 6–8 weeks)
3. Maintenance planning schedules the work during a planned C-check
4. When the aircraft arrives for the C-check, blades are waiting on the shelf
5. **Result**: Zero AOG, zero emergency procurement, work done during planned downtime

Without PdM, the same scenario plays out as: blade fails unexpectedly → AOG → emergency procurement (2-5x cost) → passengers stranded → schedule disruption cascades across the network.

---

## 📋 Regulatory Framework for Maintenance Software

Aviation software operates under strict regulatory oversight. Understanding the regulatory landscape is essential for any engineer building maintenance or safety-related systems.

### DO-178C Certification Levels

DO-178C ("Software Considerations in Airborne Systems and Equipment Certification") defines five levels based on the consequences of software failure:

| Level | Failure Condition | Example System | Certification Cost | Testing Rigor |
|-------|------------------|----------------|-------------------|---------------|
| **A** | Catastrophic (loss of aircraft) | Flight control, TCAS RA | $10–50M+ | MC/DC coverage, formal methods |
| **B** | Hazardous (serious injury) | Engine FADEC | $5–20M | Decision coverage, code review |
| **C** | Major (passenger discomfort, workload) | Autopilot modes | $2–10M | Statement + branch coverage |
| **D** | Minor (slight inconvenience) | Passenger entertainment | $500K–2M | Statement coverage |
| **E** | No effect | Maintenance logging | Minimal | Basic testing |

### Where Predictive Maintenance Fits

Most PdM systems are classified as **Level D or E** because they are **advisory only** — they inform human decision-makers but never directly control aircraft systems. A PdM alert saying "consider inspecting engine 2" goes to a maintenance planner who makes the final call. The aircraft's airworthiness is never directly affected by the PdM system's output.

**Why most PdM is advisory only**: Certifying a system at Level A costs $10–50M+ and takes 3–7 years. PdM models, which are retrained frequently and use ML (which is inherently non-deterministic), are extremely difficult to certify at higher levels. The pragmatic approach: keep PdM advisory, keep a human in the loop, and classify it at Level D/E.

### Advisory vs Mandatory Systems

| Aspect | Advisory System | Mandatory System |
|--------|----------------|------------------|
| **Example** | PdM alert, trend report | TCAS Resolution Advisory |
| **Human role** | Decides whether to act | **Must** comply immediately |
| **Certification** | Level D/E | Level A/B |
| **ML allowed?** | Yes (with documentation) | Extremely difficult to certify |
| **Liability** | Shared (system + human) | System must be correct |
| **Update frequency** | Monthly/quarterly retraining OK | Multi-year certification per change |

### Safety Case Development

Even for Level D/E advisory systems, you must develop a **safety case** — a structured argument documenting that the system cannot cause harm. The key elements:

1. **System boundary**: Define exactly what the PdM system does and does not do. "The system generates maintenance recommendations. It does not issue airworthiness directives, modify flight plans, or control any aircraft system."

2. **Human-in-the-loop guarantee**: Document that a qualified maintenance engineer always reviews and approves any action before it's taken. The system never acts autonomously.

3. **Failure modes**: What happens if the PdM system gives a wrong prediction? Answer: nothing dangerous — the worst case is a false alarm (unnecessary inspection) or missed prediction (caught by existing scheduled maintenance). Neither affects flight safety.

4. **Data integrity**: How sensor data flows from aircraft to model, what validation occurs at each stage, and how corrupt data is handled (rejected, not propagated).

5. **Model governance**: Version control, change management, validation before deployment, rollback procedures, and audit trail for every model update.

---

## 🔗 Related Topics

### Prerequisites
- [Foundations](../../00-foundations/README.md) - Networking, data structures, and how the internet works
- [Programming](../../01-programming/README.md) - Python, TypeScript, and real-time programming concepts

### Core Architecture
- [Event-Driven Architecture](../../02-architectures/event-driven/README.md) - The primary pattern for aerospace real-time systems
- [Microservices Architecture](../../02-architectures/microservices/README.md) - Service decomposition for flight systems
- [System Design Patterns](../../02-architectures/README.md) - Broader architecture decisions

### Related Domains
- [Energy & Utilities](../energy/README.md) - Similar time-series data patterns and SCADA systems
- [Manufacturing](../manufacturing/README.md) - IoT integration and predictive maintenance parallels
- [Healthcare](../healthcare/README.md) - Safety-critical systems and regulatory compliance patterns
- [Logistics](../logistics/README.md) - Route optimization and real-time tracking

### Supporting Topics
- [Infrastructure & DevOps](../../06-infrastructure/README.md) - Container orchestration for ground systems
- [Security & Compliance](../../08-security/README.md) - Aviation cybersecurity and data protection
- [AI/ML](../../09-ai-ml/README.md) - Predictive maintenance, route optimization, anomaly detection
- [Backend Development](../../05-backend/README.md) - API design for aviation data services
- [Case Studies](../../11-case-studies/README.md) - Real-world aerospace system implementations

### Learning Resources
- [YouTube, Books & Courses for Aerospace](./RESOURCES.md)
- [Domain Examples Resources](../RESOURCES.md)

## 📚 Industry Standards & Protocols

- **ARINC 429**: Aircraft data bus — a one-way broadcast protocol carrying avionics data (speed, altitude, heading) between systems at 12.5 or 100 kbit/s
- **ARINC 664 (AFDX)**: Avionics Full-Duplex Switched Ethernet — modern replacement for ARINC 429, used in Airbus A380 and Boeing 787
- **ACARS**: Aircraft Communications Addressing and Reporting System — text-based air-ground messaging for operations, maintenance, and ATC
- **ADS-B**: Automatic Dependent Surveillance-Broadcast — GPS-based position broadcasting, mandatory in most controlled airspace since 2020
- **DO-178C**: Software Considerations in Airborne Systems and Equipment Certification — the standard for safety-critical aviation software (5 levels: A=catastrophic to E=no effect)
- **DO-254**: Design Assurance Guidance for Airborne Electronic Hardware
- **DO-326A**: Airworthiness Security Process Specification — cybersecurity for aircraft systems
- **ICAO**: International Civil Aviation Organization — sets global aviation standards (Annexes 1–19)
- **SWIM**: System Wide Information Management — FAA's framework for sharing aviation data between stakeholders

## 🌐 Integration Points

- **Flight Planning Systems**: OAG, Sabre, Amadeus
- **Weather Services**: NOAA, Weather.gov, Aviation Weather Center
- **Air Traffic Control**: FAA SWIM, Eurocontrol Network Manager
- **Maintenance Systems**: AMOS, TRAX, Maintenix
- **Satellite Operators**: NORAD, Space-Track.org

## 📖 Aerospace Jargon Glossary

Every acronym and term used in this guide, defined:

| Acronym/Term | Full Name | What It Means |
|-------------|-----------|---------------|
| **ACARS** | Aircraft Communications Addressing and Reporting System | Text messaging between aircraft and ground stations |
| **ADS-B** | Automatic Dependent Surveillance-Broadcast | GPS position broadcasting by aircraft |
| **AFDX** | Avionics Full-Duplex Switched Ethernet | Modern aircraft data network (ARINC 664) |
| **AGL** | Above Ground Level | Altitude measured from the terrain below |
| **AOS** | Acquisition of Signal | When a ground station first contacts a satellite in a pass |
| **ARINC** | Aeronautical Radio, Incorporated | Organization that sets avionics data standards |
| **ATC** | Air Traffic Control | The service managing aircraft separation and flow |
| **CDM** | Conjunction Data Message | Warning that two space objects may collide |
| **CFIT** | Controlled Flight Into Terrain | When a functioning aircraft flies into ground |
| **DO-178C** | (Document number) | Software certification standard for airborne systems |
| **DO-254** | (Document number) | Hardware certification standard for airborne systems |
| **EASA** | European Union Aviation Safety Agency | Europe's aviation regulator |
| **ECI** | Earth-Centered Inertial | Coordinate system fixed relative to stars |
| **ECF** | Earth-Centered Fixed | Coordinate system that rotates with Earth |
| **EGT** | Exhaust Gas Temperature | Key engine health indicator |
| **EGPWS** | Enhanced Ground Proximity Warning System | Terrain collision avoidance using GPS + terrain database |
| **FAA** | Federal Aviation Administration | US aviation regulator |
| **FMS** | Flight Management System | Onboard computer that manages the flight plan |
| **GEO** | Geostationary Earth Orbit | Orbit where satellite appears stationary (35,786 km) |
| **GMST** | Greenwich Mean Sidereal Time | Time system used for satellite coordinate conversion |
| **HEO** | Highly Elliptical Orbit | Elongated orbit for high-latitude coverage |
| **ICAO** | International Civil Aviation Organization | UN agency setting global aviation standards |
| **IMU** | Inertial Measurement Unit | Sensor measuring acceleration and rotation |
| **IROPS** | Irregular Operations | Industry term for schedule disruptions |
| **LEO** | Low Earth Orbit | Orbit below 2,000 km altitude |
| **LOS** | Loss of Signal | When a ground station loses contact with a satellite |
| **MEL** | Minimum Equipment List | List of items that can be inoperative for flight |
| **MEO** | Medium Earth Orbit | Orbit between 2,000 and 35,786 km |
| **METAR** | Meteorological Terminal Air Report | Standardized weather observation for airports |
| **MRO** | Maintenance, Repair, and Overhaul | Heavy aircraft maintenance industry |
| **MSL** | Mean Sea Level | Standard altitude reference |
| **N1** | (Engine parameter) | Fan speed — primary thrust indicator |
| **N2** | (Engine parameter) | Core compressor speed |
| **NORAD** | North American Aerospace Defense Command | Tracks all objects in Earth orbit |
| **OCC** | Operations Control Center | Airline's central operations hub |
| **RA** | Resolution Advisory | TCAS command to climb or descend immediately |
| **SGP4** | Simplified General Perturbations 4 | Algorithm for predicting satellite positions from TLEs |
| **SWIM** | System Wide Information Management | FAA's data-sharing framework |
| **TA** | Traffic Advisory | TCAS alert about nearby traffic |
| **TAF** | Terminal Aerodrome Forecast | Weather forecast for airports |
| **TCAS** | Traffic Collision Avoidance System | Independent system that prevents mid-air collisions |
| **TLE** | Two-Line Element Set | Standard format for describing a satellite's orbit |
| **TRACON** | Terminal Radar Approach Control | ATC facility handling arrivals and departures |
| **WGS84** | World Geodetic System 1984 | The coordinate system GPS uses |

---

**Note**: This is a learning template for aerospace software systems. Real aviation systems require DO-178C certification, extensive testing, and regulatory approval. Always consult with aviation authorities and follow safety-critical development processes.
