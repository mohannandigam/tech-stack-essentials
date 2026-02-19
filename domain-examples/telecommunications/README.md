# Telecommunications - Network Management & Billing Platform

## Overview

Comprehensive telecommunications platform demonstrating network operations, subscriber management, real-time billing, service provisioning, and infrastructure monitoring for mobile and broadband services.

## 🎯 Domain Requirements

### Business Goals

- **Network Operations**: Real-time network monitoring, capacity planning, fault management
- **Subscriber Management**: Customer accounts, service provisioning, SIM management
- **Billing & Rating**: Real-time charging, usage-based billing, invoice generation
- **Service Quality**: QoS monitoring, SLA compliance, customer experience analytics
- **Fraud Detection**: Usage anomalies, subscription fraud, revenue assurance

### Technical Challenges

- **Scale**: Millions of subscribers, billions of CDRs (Call Detail Records) per day
- **Real-Time**: Sub-second rating for prepaid services
- **5G Requirements**: Network slicing, edge computing, ultra-low latency
- **Legacy Integration**: SS7, SMPP, RADIUS, Diameter protocols
- **Regulatory Compliance**: E911, CALEA, data retention laws
- **High Availability**: Five-9s uptime (99.999%)

## 🏗️ Architecture

### Pattern: Event-Driven + Real-Time Processing + Microservices

```
┌──────────────────────────────────────────────────────────────────┐
│                Network Infrastructure                             │
│   (RAN, Core Network, IMS, BSS/OSS Systems)                      │
└────────────────────┬─────────────────────────────────────────────┘
                     │ CDRs, Network Events, Signaling
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│         Mediation Layer (CDR Collection & Normalization)          │
│   - Protocol Adapters (SMPP, Diameter, Radius)                   │
│   - CDR Parsing & Enrichment                                     │
└────┬──────────────┬────────────────┬────────────────────────────┘
     │              │                │
     ▼              ▼                ▼
┌─────────────┐ ┌──────────┐ ┌────────────────┐
│  Real-Time  │ │Network   │ │   Subscriber   │
│   Rating    │ │Operations│ │   Management   │
│  & Charging │ │Center    │ │   (BSS)        │
└──────┬──────┘ └────┬─────┘ └────────┬───────┘
       │             │                 │
       │ Events      │ Metrics         │ Provisioning
       ▼             ▼                 ▼
┌──────────────────────────────────────────────────────────────────┐
│              Event Streaming (Kafka/Pulsar)                       │
│   - Usage Events    - Network Alarms    - Provisioning Events    │
└───┬────────────┬───────────────┬────────────────────────────┬───┘
    │            │               │                            │
    ▼            ▼               ▼                            ▼
┌─────────┐ ┌──────────┐ ┌────────────┐ ┌────────────────────┐
│Billing  │ │Analytics │ │   Fraud    │ │    Customer        │
│Engine   │ │& BI      │ │  Detection │ │    Care Portal     │
└────┬────┘ └────┬─────┘ └──────┬─────┘ └────────────────────┘
     │           │               │
     ▼           ▼               ▼
┌──────────────────────────────────────────┐
│  Data Warehouse (Snowflake/BigQuery)     │
│  - Billing History  - Network Metrics    │
│  - Customer Data    - Analytics          │
└──────────────────────────────────────────┘
```

## 💻 Code Examples

### Real-Time Rating Engine

```python
# services/rating_engine.py
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import Enum
import redis
import logging

logger = logging.getLogger(__name__)

class ServiceType(Enum):
    VOICE = "voice"
    SMS = "sms"
    DATA = "data"
    MMS = "mms"

class ChargeType(Enum):
    PREPAID = "prepaid"
    POSTPAID = "postpaid"

@dataclass
class UsageEvent:
    """Real-time usage event for rating"""
    event_id: str
    subscriber_id: str
    msisdn: str  # Phone number
    service_type: ServiceType
    timestamp: datetime

    # Usage details
    destination: str = None  # For voice/SMS
    duration_seconds: int = 0  # For voice
    data_volume_mb: Decimal = Decimal('0')  # For data

    # Network details
    cell_id: str = None
    roaming: bool = False
    roaming_country: str = None

class RealTimeRatingEngine:
    """Sub-second rating for prepaid/postpaid services"""

    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.rate_cache = {}

    async def rate_usage(self, event: UsageEvent) -> dict:
        """
        Rate usage event in real-time
        Returns: charge amount, balance update, authorization
        """
        start_time = datetime.utcnow()

        # Get subscriber account
        account = await self._get_subscriber_account(event.subscriber_id)

        if not account:
            logger.error(f"Account not found: {event.subscriber_id}")
            return {
                'authorized': False,
                'reason': 'account_not_found'
            }

        # Check if active
        if not account['active']:
            return {
                'authorized': False,
                'reason': 'account_suspended'
            }

        # Get applicable rate
        rate = await self._get_rate(account, event)

        # Calculate charge
        charge = self._calculate_charge(event, rate)

        # For prepaid, check balance and reserve
        if account['charge_type'] == ChargeType.PREPAID:
            balance = await self._get_balance(event.subscriber_id)

            if balance < charge:
                return {
                    'authorized': False,
                    'reason': 'insufficient_balance',
                    'balance': float(balance),
                    'required': float(charge)
                }

            # Reserve balance
            new_balance = await self._deduct_balance(
                event.subscriber_id,
                charge
            )

            result = {
                'authorized': True,
                'charge': float(charge),
                'balance_before': float(balance),
                'balance_after': float(new_balance),
                'rate_applied': rate['rate_plan_id']
            }
        else:
            # Postpaid - authorize and accumulate
            await self._accumulate_usage(event.subscriber_id, charge)

            result = {
                'authorized': True,
                'charge': float(charge),
                'rate_applied': rate['rate_plan_id']
            }

        # Record CDR
        await self._record_cdr(event, charge, rate)

        # Performance logging
        duration_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
        logger.info(f"Rated event {event.event_id} in {duration_ms:.2f}ms")

        return result

    def _calculate_charge(self, event: UsageEvent, rate: dict) -> Decimal:
        """Calculate charge based on usage and rate"""

        if event.service_type == ServiceType.VOICE:
            # Voice: rate per minute
            minutes = Decimal(event.duration_seconds) / 60

            # Round up to next minute for billing
            minutes = minutes.quantize(Decimal('1'), rounding='ROUND_UP')

            if event.roaming:
                charge = minutes * Decimal(rate['roaming_voice_rate'])
            else:
                charge = minutes * Decimal(rate['voice_rate'])

        elif event.service_type == ServiceType.SMS:
            # SMS: rate per message
            if event.roaming:
                charge = Decimal(rate['roaming_sms_rate'])
            else:
                charge = Decimal(rate['sms_rate'])

        elif event.service_type == ServiceType.DATA:
            # Data: rate per MB
            mb = event.data_volume_mb

            if event.roaming:
                charge = mb * Decimal(rate['roaming_data_rate'])
            else:
                charge = mb * Decimal(rate['data_rate'])

        elif event.service_type == ServiceType.MMS:
            if event.roaming:
                charge = Decimal(rate['roaming_mms_rate'])
            else:
                charge = Decimal(rate['mms_rate'])

        else:
            charge = Decimal('0')

        return charge.quantize(Decimal('0.0001'))

    async def _get_subscriber_account(self, subscriber_id: str) -> dict:
        """Get subscriber account from cache or DB"""
        cache_key = f"subscriber:{subscriber_id}"

        # Try cache first
        cached = await self.redis.get(cache_key)
        if cached:
            return json.loads(cached)

        # Load from database
        account = await self._load_account_from_db(subscriber_id)

        if account:
            # Cache for 5 minutes
            await self.redis.setex(
                cache_key,
                300,
                json.dumps(account)
            )

        return account

    async def _get_balance(self, subscriber_id: str) -> Decimal:
        """Get prepaid balance"""
        balance_key = f"balance:{subscriber_id}"

        balance = await self.redis.get(balance_key)

        if balance is None:
            # Load from database
            balance = await self._load_balance_from_db(subscriber_id)
            await self.redis.set(balance_key, str(balance))

        return Decimal(balance)

    async def _deduct_balance(
        self,
        subscriber_id: str,
        amount: Decimal
    ) -> Decimal:
        """Atomically deduct from prepaid balance"""
        balance_key = f"balance:{subscriber_id}"

        # Use Lua script for atomic decrement
        lua_script = """
        local balance = redis.call('GET', KEYS[1])
        if balance then
            local new_balance = tonumber(balance) - tonumber(ARGV[1])
            if new_balance >= 0 then
                redis.call('SET', KEYS[1], new_balance)
                return new_balance
            else
                return nil
            end
        else
            return nil
        end
        """

        new_balance = await self.redis.eval(
            lua_script,
            1,
            balance_key,
            str(amount)
        )

        if new_balance is None:
            raise ValueError("Insufficient balance")

        return Decimal(new_balance)

    async def _record_cdr(
        self,
        event: UsageEvent,
        charge: Decimal,
        rate: dict
    ):
        """Record Call Detail Record"""
        cdr = {
            'event_id': event.event_id,
            'subscriber_id': event.subscriber_id,
            'msisdn': event.msisdn,
            'service_type': event.service_type.value,
            'timestamp': event.timestamp.isoformat(),
            'destination': event.destination,
            'duration_seconds': event.duration_seconds,
            'data_volume_mb': float(event.data_volume_mb),
            'roaming': event.roaming,
            'roaming_country': event.roaming_country,
            'charge': float(charge),
            'rate_plan_id': rate['rate_plan_id'],
            'cell_id': event.cell_id
        }

        # Publish to Kafka for batch processing
        await self._publish_cdr(cdr)

        # Also store in time-series DB for real-time analytics
        await self._store_timeseries(cdr)
```

### Network Operations Center (NOC) Monitor

```python
# services/noc_monitor.py
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Dict
import asyncio

class AlarmSeverity(Enum):
    CRITICAL = "critical"
    MAJOR = "major"
    MINOR = "minor"
    WARNING = "warning"
    CLEARED = "cleared"

class NetworkElementType(Enum):
    BTS = "base_station"
    RNC = "radio_controller"
    MME = "mobility_mgmt"
    SGW = "serving_gateway"
    PGW = "packet_gateway"
    ROUTER = "router"
    SWITCH = "switch"

@dataclass
class NetworkAlarm:
    """Network element alarm"""
    alarm_id: str
    element_id: str
    element_type: NetworkElementType
    severity: AlarmSeverity
    alarm_type: str
    description: str
    timestamp: datetime
    acknowledged: bool = False
    cleared_at: datetime = None

@dataclass
class NetworkMetrics:
    """Real-time network metrics"""
    element_id: str
    timestamp: datetime

    # Performance
    cpu_usage_pct: float
    memory_usage_pct: float
    throughput_mbps: float
    active_sessions: int

    # Quality
    packet_loss_pct: float
    latency_ms: float
    jitter_ms: float

    # Capacity
    capacity_pct: float
    available_bandwidth_mbps: float

class NOCMonitor:
    """Network Operations Center monitoring"""

    def __init__(self, alert_service, metrics_db):
        self.alert_service = alert_service
        self.metrics_db = metrics_db
        self.active_alarms: Dict[str, NetworkAlarm] = {}

    async def process_network_event(self, event: dict):
        """Process real-time network event"""
        event_type = event['type']

        if event_type == 'alarm':
            await self._handle_alarm(event)
        elif event_type == 'metrics':
            await self._handle_metrics(event)
        elif event_type == 'performance_degradation':
            await self._handle_performance_issue(event)

    async def _handle_alarm(self, event: dict):
        """Process network alarm"""
        alarm = NetworkAlarm(
            alarm_id=event['alarm_id'],
            element_id=event['element_id'],
            element_type=NetworkElementType(event['element_type']),
            severity=AlarmSeverity(event['severity']),
            alarm_type=event['alarm_type'],
            description=event['description'],
            timestamp=datetime.fromisoformat(event['timestamp'])
        )

        if alarm.severity == AlarmSeverity.CLEARED:
            # Clear existing alarm
            if alarm.alarm_id in self.active_alarms:
                self.active_alarms[alarm.alarm_id].cleared_at = alarm.timestamp
                del self.active_alarms[alarm.alarm_id]
        else:
            # New or updated alarm
            self.active_alarms[alarm.alarm_id] = alarm

            # Alert on critical/major alarms
            if alarm.severity in [AlarmSeverity.CRITICAL, AlarmSeverity.MAJOR]:
                await self._send_alert(alarm)

            # Auto-remediation for known issues
            await self._attempt_auto_remediation(alarm)

    async def _handle_metrics(self, event: dict):
        """Process network element metrics"""
        metrics = NetworkMetrics(**event['metrics'])

        # Store in time-series DB
        await self.metrics_db.write_point(
            measurement='network_metrics',
            tags={
                'element_id': metrics.element_id,
            },
            fields={
                'cpu_usage': metrics.cpu_usage_pct,
                'memory_usage': metrics.memory_usage_pct,
                'throughput': metrics.throughput_mbps,
                'active_sessions': metrics.active_sessions,
                'packet_loss': metrics.packet_loss_pct,
                'latency': metrics.latency_ms,
                'capacity': metrics.capacity_pct
            },
            timestamp=metrics.timestamp
        )

        # Check thresholds
        await self._check_thresholds(metrics)

    async def _check_thresholds(self, metrics: NetworkMetrics):
        """Check if metrics exceed thresholds"""
        alerts = []

        # High CPU
        if metrics.cpu_usage_pct > 90:
            alerts.append({
                'severity': 'critical',
                'type': 'high_cpu',
                'element_id': metrics.element_id,
                'value': metrics.cpu_usage_pct
            })

        # High capacity
        if metrics.capacity_pct > 85:
            alerts.append({
                'severity': 'major',
                'type': 'capacity_warning',
                'element_id': metrics.element_id,
                'value': metrics.capacity_pct
            })

        # High packet loss
        if metrics.packet_loss_pct > 1.0:
            alerts.append({
                'severity': 'major',
                'type': 'high_packet_loss',
                'element_id': metrics.element_id,
                'value': metrics.packet_loss_pct
            })

        for alert in alerts:
            await self._send_alert(alert)

    async def _attempt_auto_remediation(self, alarm: NetworkAlarm):
        """Attempt automatic remediation"""
        remediation_map = {
            'link_down': self._restart_interface,
            'service_unavailable': self._restart_service,
            'memory_exhausted': self._clear_cache,
        }

        remediation_func = remediation_map.get(alarm.alarm_type)

        if remediation_func:
            logger.info(f"Attempting auto-remediation for {alarm.alarm_id}")
            try:
                await remediation_func(alarm.element_id)
            except Exception as e:
                logger.error(f"Auto-remediation failed: {e}")
```

### Fraud Detection System

```python
# services/fraud_detector.py
from sklearn.ensemble import IsolationForest
import pandas as pd
from datetime import datetime, timedelta

class FraudDetectionService:
    """Real-time fraud detection for telecom"""

    def __init__(self):
        self.anomaly_model = IsolationForest(contamination=0.01)
        self.subscriber_profiles = {}

    async def analyze_usage(self, subscriber_id: str, usage_event: dict) -> dict:
        """Analyze usage for fraud indicators"""

        fraud_score = 0
        indicators = []

        # Get subscriber profile
        profile = await self._get_subscriber_profile(subscriber_id)

        # Check for anomalies
        # 1. Unusual destination
        if usage_event.get('destination'):
            if await self._is_unusual_destination(subscriber_id, usage_event['destination']):
                fraud_score += 2
                indicators.append('unusual_destination')

        # 2. Unusual time
        hour = usage_event['timestamp'].hour
        if hour < 6 or hour > 23:  # Late night usage
            if not profile.get('night_user', False):
                fraud_score += 1
                indicators.append('unusual_time')

        # 3. High volume
        if usage_event['service_type'] == 'voice':
            if usage_event['duration_seconds'] > 3600:  # > 1 hour call
                fraud_score += 2
                indicators.append('long_duration_call')

        # 4. Roaming fraud
        if usage_event.get('roaming'):
            if not profile.get('roaming_enabled', False):
                fraud_score += 5
                indicators.append('unexpected_roaming')

            # High-risk roaming countries
            if usage_event.get('roaming_country') in ['XX', 'YY']:
                fraud_score += 3
                indicators.append('high_risk_country')

        # 5. SIM box detection (many short calls)
        recent_calls = await self._get_recent_calls(subscriber_id, minutes=60)
        if len(recent_calls) > 50:  # > 50 calls in hour
            avg_duration = sum(c['duration'] for c in recent_calls) / len(recent_calls)
            if avg_duration < 30:  # Average < 30 seconds
                fraud_score += 5
                indicators.append('sim_box_pattern')

        # 6. Account takeover
        if await self._detect_account_takeover(subscriber_id, usage_event):
            fraud_score += 4
            indicators.append('account_takeover')

        # Determine action
        if fraud_score >= 8:
            action = 'block'
        elif fraud_score >= 5:
            action = 'review'
        else:
            action = 'allow'

        result = {
            'subscriber_id': subscriber_id,
            'fraud_score': fraud_score,
            'action': action,
            'indicators': indicators,
            'timestamp': datetime.utcnow().isoformat()
        }

        # Block if high risk
        if action == 'block':
            await self._block_subscriber(subscriber_id, result)

        # Create fraud case for review
        if action == 'review':
            await self._create_fraud_case(subscriber_id, result)

        return result
```

## 🚀 Quick Start

```bash
cd domain-examples/telecommunications

# Start infrastructure
docker-compose up -d

# Initialize subscribers and rate plans
python scripts/init_billing.py

# Start rating engine
python services/rating_engine.py &

# Start NOC monitor
python services/noc_monitor.py &

# Simulate network traffic
python scripts/simulate_usage.py
```

## 📊 Key Features

1. **Real-Time Rating**: Sub-second charging for prepaid/postpaid
2. **Network Monitoring**: Real-time NOC with auto-remediation
3. **Fraud Detection**: ML-based usage anomaly detection
4. **Billing Engine**: Usage-based billing, invoice generation
5. **Service Provisioning**: Automated subscriber activation
6. **Analytics**: Network performance, customer insights

## 🔒 Security & Compliance

- **CALEA**: Law enforcement intercept capability
- **E911**: Emergency services location
- **Data Retention**: CDR storage per regulatory requirements
- **GDPR/CCPA**: Customer data privacy
- **Encryption**: TLS 1.3, IPsec for signaling

## 📈 Performance Targets

- **Rating Latency**: < 50ms per event
- **System Throughput**: 100K+ events/second
- **CDR Processing**: 10M+ records/day
- **Network Monitoring**: < 1 second alert latency
- **Availability**: 99.999% uptime

## 🤖 AI/ML Applications

- **Fraud Detection**: Anomaly detection, pattern recognition
- **Churn Prediction**: Customer lifetime value, retention
- **Network Optimization**: Load balancing, capacity planning
- **Predictive Maintenance**: Equipment failure prediction
- **Customer Service**: Chatbots, sentiment analysis

## 🔗 Related Patterns

- [Real-Time Processing](../finance/README.md)
- [Event-Driven](../../architectures/event-driven/README.md)
- [IoT Scale](../manufacturing/README.md)

---

**Note**: Telecom systems require carrier-grade reliability and regulatory compliance. This is a learning template.
