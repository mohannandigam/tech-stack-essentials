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
