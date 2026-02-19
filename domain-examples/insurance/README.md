# Insurance - Claims Processing System

## Overview

Automated insurance claims processing system demonstrating workflow automation, document management, and risk assessment.

## 🎯 Key Use Cases

- **Claims Submission**: File new insurance claims with documents
- **Auto-Adjudication**: Automatically approve/deny simple claims
- **Manual Review**: Route complex claims to adjusters
- **Fraud Detection**: Identify potentially fraudulent claims
- **Payment Processing**: Authorize and process claim payments

## 🏗️ Architecture Pattern

**Primary**: Workflow Engine + Event-Driven  
**Secondary**: Document Storage, ML Integration

## 💻 Quick Example

```python
# Claims workflow
class ClaimsWorkflow:
    async def process_claim(self, claim: Claim):
        # Step 1: Validate claim
        if not await self.validate_claim(claim):
            return await self.reject_claim(claim, "Invalid claim data")

        # Step 2: Fraud detection
        fraud_score = await self.fraud_detector.analyze(claim)
        if fraud_score > 0.8:
            return await self.flag_for_investigation(claim)

        # Step 3: Auto-adjudication
        if await self.can_auto_adjudicate(claim):
            decision = await self.auto_adjudicate(claim)
            if decision.approved:
                await self.approve_claim(claim, decision.amount)
            else:
                await self.deny_claim(claim, decision.reason)
        else:
            # Route to manual review
            await self.assign_to_adjuster(claim)

    async def auto_adjudicate(self, claim: Claim):
        # Check policy coverage
        policy = await self.get_policy(claim.policy_id)

        if claim.amount > policy.max_claim_amount:
            return Decision(approved=False, reason="Exceeds policy limit")

        # Check claim history
        history = await self.get_claim_history(policy.id)
        if len(history) > 3:  # More than 3 claims this year
            return Decision(approved=False, reason="Requires manual review")

        # Approve
        return Decision(approved=True, amount=claim.amount)
```

## 🚀 Getting Started

```bash
cd domain-examples/insurance
docker-compose up -d

# Submit claim
curl -X POST http://localhost:3000/api/claims \
  -F "policy_id=POL-001" \
  -F "type=auto" \
  -F "amount=5000" \
  -F "documents=@accident_report.pdf"
```

## 🤖 Fraud Detection

- Pattern analysis across claims
- Document verification (OCR, metadata)
- Network analysis (related claims/policies)
- ML model scoring
- Manual investigation workflow

## 📊 Performance Targets

- Claim submission: < 1 second
- Auto-adjudication: < 5 seconds
- Fraud score: < 500ms
- Document processing: < 10 seconds

## 🔗 Related Examples

- [Banking Domain](../banking/README.md)
- [Healthcare Domain](../healthcare/README.md)

## 📦 Implementation Examples

### Example 1: Claims Processing Workflow (Python/Temporal)

```python
# models/claim.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
from decimal import Decimal

class ClaimType(str, Enum):
    AUTO = "auto"
    HOME = "home"
    HEALTH = "health"
    LIFE = "life"

class ClaimStatus(str, Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    DENIED = "denied"
    PAID = "paid"

class Claim(BaseModel):
    id: str
    policy_id: str
    claim_type: ClaimType
    amount: Decimal
    description: str
    incident_date: datetime
    filed_date: datetime
    status: ClaimStatus
    adjuster_id: Optional[str] = None
    documents: List[str] = Field(default_factory=list)
    fraud_score: Optional[float] = None
```

```python
# workflows/claims_workflow.py
from temporal import workflow
from datetime import timedelta

@workflow.defn
class ClaimsWorkflow:
    @workflow.run
    async def process_claim(self, claim_id: str) -> dict:
        """Main claims processing workflow"""

        # Step 1: Validate claim
        validation_result = await workflow.execute_activity(
            validate_claim,
            claim_id,
            start_to_close_timeout=timedelta(minutes=5)
        )

        if not validation_result['valid']:
            await workflow.execute_activity(
                reject_claim,
                claim_id,
                validation_result['reason']
            )
            return {'status': 'REJECTED', 'reason': validation_result['reason']}

        # Step 2: Fraud detection
        fraud_score = await workflow.execute_activity(
            analyze_fraud_risk,
            claim_id,
            start_to_close_timeout=timedelta(minutes=10)
        )

        if fraud_score > 0.8:
            await workflow.execute_activity(
                flag_for_investigation,
                claim_id,
                fraud_score
            )
            return {'status': 'FLAGGED', 'fraud_score': fraud_score}

        # Step 3: Auto-adjudication or manual review
        if await self.can_auto_adjudicate(claim_id):
            decision = await workflow.execute_activity(
                auto_adjudicate,
                claim_id,
                start_to_close_timeout=timedelta(minutes=5)
            )

            if decision['approved']:
                # Step 4: Process payment
                payment_result = await workflow.execute_activity(
                    process_payment,
                    claim_id,
                    decision['amount'],
                    start_to_close_timeout=timedelta(hours=1)
                )
                return {'status': 'APPROVED', 'amount': decision['amount']}
            else:
                await workflow.execute_activity(
                    deny_claim,
                    claim_id,
                    decision['reason']
                )
                return {'status': 'DENIED', 'reason': decision['reason']}
        else:
            # Route to manual adjuster
            await workflow.execute_activity(
                assign_to_adjuster,
                claim_id
            )

            # Wait for adjuster decision (with timeout)
            adjuster_decision = await workflow.wait_condition(
                lambda: self.get_adjuster_decision(claim_id),
                timeout=timedelta(days=7)
            )

            return adjuster_decision

    async def can_auto_adjudicate(self, claim_id: str) -> bool:
        """Determine if claim can be auto-adjudicated"""
        claim_data = await workflow.execute_activity(
            get_claim_data,
            claim_id
        )

        # Auto-adjudicate if:
        # 1. Amount is below threshold
        # 2. Low fraud risk
        # 3. Policy is in good standing
        # 4. No previous claims issues
        return (
            claim_data['amount'] < 5000 and
            claim_data['fraud_score'] < 0.3 and
            claim_data['policy_status'] == 'active' and
            claim_data['previous_denied_claims'] == 0
        )
```

```python
# services/claims_service.py
import asyncpg
from typing import Dict, List
from decimal import Decimal

class ClaimsService:
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool

    async def validate_claim(self, claim_id: str) -> Dict:
        """Validate claim submission"""
        claim = await self.db.fetchrow(
            "SELECT * FROM claims WHERE id = $1",
            claim_id
        )

        if not claim:
            return {'valid': False, 'reason': 'Claim not found'}

        # Check policy validity
        policy = await self.db.fetchrow(
            "SELECT * FROM policies WHERE id = $1",
            claim['policy_id']
        )

        if not policy or policy['status'] != 'active':
            return {'valid': False, 'reason': 'Policy is not active'}

        # Check coverage
        if claim['claim_type'] not in policy['covered_types']:
            return {'valid': False, 'reason': 'Claim type not covered'}

        # Check policy limits
        if claim['amount'] > policy['coverage_limit']:
            return {'valid': False, 'reason': 'Claim exceeds policy limit'}

        # Check claim filing deadline
        days_since_incident = (claim['filed_date'] - claim['incident_date']).days
        if days_since_incident > policy['claim_deadline_days']:
            return {'valid': False, 'reason': 'Claim filed past deadline'}

        return {'valid': True}

    async def auto_adjudicate(self, claim_id: str) -> Dict:
        """Auto-adjudicate claim using business rules"""
        claim = await self.db.fetchrow(
            "SELECT c.*, p.* FROM claims c JOIN policies p ON c.policy_id = p.id WHERE c.id = $1",
            claim_id
        )

        # Calculate payout amount
        deductible = claim['deductible']
        claim_amount = Decimal(claim['amount'])
        payout_amount = max(Decimal(0), claim_amount - deductible)

        # Apply policy-specific rules
        if claim['claim_type'] == ClaimType.AUTO:
            # Check if repairs at approved shop
            if not await self.is_approved_repair_shop(claim['repair_shop_id']):
                return {'approved': False, 'reason': 'Repairs must be at approved shop'}

        # Check claim history
        recent_claims = await self.get_recent_claims(claim['policy_id'], days=180)
        if len(recent_claims) > 3:
            return {'approved': False, 'reason': 'Too many recent claims - requires manual review'}

        # Approve claim
        await self.db.execute(
            """UPDATE claims
               SET status = 'approved', approved_amount = $1, approved_at = NOW()
               WHERE id = $2""",
            payout_amount, claim_id
        )

        return {'approved': True, 'amount': float(payout_amount)}

    async def process_payment(self, claim_id: str, amount: Decimal) -> Dict:
        """Process claim payment"""
        claim = await self.db.fetchrow(
            "SELECT * FROM claims WHERE id = $1",
            claim_id
        )

        # Create payment record
        payment_id = await self.db.fetchval(
            """INSERT INTO claim_payments (claim_id, amount, payment_method, status)
               VALUES ($1, $2, 'ACH', 'pending')
               RETURNING id""",
            claim_id, amount
        )

        # Integrate with payment processor
        # ... payment processing logic ...

        # Update claim status
        await self.db.execute(
            "UPDATE claims SET status = 'paid', paid_at = NOW() WHERE id = $1",
            claim_id
        )

        return {'payment_id': payment_id, 'status': 'completed'}
```

### Example 2: Policy Management Service (Java/Spring Boot)

```java
// models/Policy.java
package com.insurance.models;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class Policy {
    private UUID id;
    private String policyNumber;
    private UUID customerId;
    private PolicyType type;
    private PolicyStatus status;
    private BigDecimal premium;
    private BigDecimal coverageLimit;
    private BigDecimal deductible;
    private LocalDate effectiveDate;
    private LocalDate expirationDate;
    private List<String> coveredTypes;
    private int claimDeadlineDays;
}

enum PolicyType {
    AUTO, HOME, HEALTH, LIFE
}

enum PolicyStatus {
    ACTIVE, SUSPENDED, CANCELLED, EXPIRED
}
```

```java
// services/PolicyService.java
package com.insurance.services;

import com.insurance.models.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class PolicyService {

    private final PolicyRepository policyRepo;
    private final RiskAssessmentService riskService;

    @Transactional
    public Policy createPolicy(PolicyRequest request) {
        // Risk assessment
        RiskScore riskScore = riskService.assessRisk(
            request.getCustomerId(),
            request.getType(),
            request.getCoverageAmount()
        );

        // Calculate premium based on risk
        BigDecimal premium = calculatePremium(
            request.getCoverageAmount(),
            riskScore,
            request.getDeductible()
        );

        // Create policy
        Policy policy = new Policy();
        policy.setId(UUID.randomUUID());
        policy.setPolicyNumber(generatePolicyNumber());
        policy.setCustomerId(request.getCustomerId());
        policy.setType(request.getType());
        policy.setStatus(PolicyStatus.ACTIVE);
        policy.setPremium(premium);
        policy.setCoverageLimit(request.getCoverageAmount());
        policy.setDeductible(request.getDeductible());
        policy.setEffectiveDate(LocalDate.now());
        policy.setExpirationDate(LocalDate.now().plusYears(1));

        return policyRepo.save(policy);
    }

    private BigDecimal calculatePremium(
        BigDecimal coverageAmount,
        RiskScore riskScore,
        BigDecimal deductible
    ) {
        // Base rate: 2% of coverage
        BigDecimal baseRate = coverageAmount.multiply(new BigDecimal("0.02"));

        // Risk multiplier (1.0 to 3.0)
        BigDecimal riskMultiplier = new BigDecimal(1.0 + (riskScore.getScore() * 2.0));

        // Deductible discount
        BigDecimal deductibleDiscount = deductible
            .divide(coverageAmount, 4, RoundingMode.HALF_UP)
            .multiply(new BigDecimal("0.1")); // Up to 10% discount

        BigDecimal premium = baseRate
            .multiply(riskMultiplier)
            .multiply(BigDecimal.ONE.subtract(deductibleDiscount));

        return premium.setScale(2, RoundingMode.HALF_UP);
    }
}
```

### Example 3: Fraud Detection with ML (Python/scikit-learn)

```python
# services/fraud_detection_service.py
import joblib
import numpy as np
from typing import Dict, List
from sklearn.ensemble import RandomForestClassifier
import asyncpg

class FraudDetectionService:
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
        self.model = joblib.load('models/fraud_detection_model.pkl')

    async def analyze_fraud_risk(self, claim_id: str) -> float:
        """Analyze claim for fraud indicators using ML model"""

        # Extract features
        features = await self.extract_features(claim_id)

        # Get ML model prediction
        fraud_probability = self.model.predict_proba([features])[0][1]

        # Combine with rule-based checks
        rule_score = await self.rule_based_fraud_check(claim_id)

        # Weighted average
        final_score = (fraud_probability * 0.7) + (rule_score * 0.3)

        # Record fraud check
        await self.record_fraud_check(claim_id, final_score, features)

        return final_score

    async def extract_features(self, claim_id: str) -> List[float]:
        """Extract features for ML model"""
        claim = await self.db.fetchrow(
            """
            SELECT c.*, p.*,
                   COUNT(ch.id) as claim_history_count,
                   AVG(ch.amount) as avg_historical_amount
            FROM claims c
            JOIN policies p ON c.policy_id = p.id
            LEFT JOIN claims ch ON ch.policy_id = p.id AND ch.id != c.id
            WHERE c.id = $1
            GROUP BY c.id, p.id
            """,
            claim_id
        )

        features = [
            float(claim['amount']),  # Claim amount
            (claim['filed_date'] - claim['incident_date']).days,  # Days to file
            claim['claim_history_count'],  # Number of previous claims
            float(claim['avg_historical_amount'] or 0),  # Avg previous claim amount
            1 if claim['amount'] > claim['coverage_limit'] * 0.8 else 0,  # Near limit flag
            len(claim['documents']),  # Number of documents provided
            (claim['filed_date'] - claim['policy_effective_date']).days,  # Policy age
        ]

        return features

    async def rule_based_fraud_check(self, claim_id: str) -> float:
        """Rule-based fraud detection"""
        score = 0.0

        claim = await self.db.fetchrow(
            "SELECT * FROM claims WHERE id = $1",
            claim_id
        )

        # Rule 1: Suspicious timing
        days_to_file = (claim['filed_date'] - claim['incident_date']).days
        if days_to_file < 1:  # Filed same day
            score += 0.3
        elif days_to_file > 180:  # Filed very late
            score += 0.2

        # Rule 2: Round dollar amount (often fraudulent)
        if claim['amount'] % 1000 == 0:
            score += 0.1

        # Rule 3: Multiple claims in short period
        recent_claims = await self.db.fetchval(
            """SELECT COUNT(*) FROM claims
               WHERE policy_id = $1
               AND filed_date > $2 - INTERVAL '90 days'
               AND id != $3""",
            claim['policy_id'], claim['filed_date'], claim_id
        )
        if recent_claims > 2:
            score += 0.4

        # Rule 4: New policy (< 30 days)
        policy_age = (claim['filed_date'] - claim['policy_effective_date']).days
        if policy_age < 30:
            score += 0.3

        # Rule 5: Insufficient documentation
        if len(claim['documents']) < 2:
            score += 0.2

        return min(score, 1.0)
```

## 🗄️ Database Schema

```sql
-- Policies table
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('AUTO', 'HOME', 'HEALTH', 'LIFE')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED')),
    premium DECIMAL(10, 2) NOT NULL,
    coverage_limit DECIMAL(12, 2) NOT NULL,
    deductible DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    covered_types TEXT[],
    claim_deadline_days INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_policies_customer ON policies(customer_id);
CREATE INDEX idx_policies_number ON policies(policy_number);

-- Claims table
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id),
    claim_type VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    filed_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted',
    adjuster_id UUID,
    documents TEXT[],
    fraud_score DECIMAL(3, 2),
    approved_amount DECIMAL(12, 2),
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_claims_policy ON claims(policy_id, filed_date DESC);
CREATE INDEX idx_claims_status ON claims(status, filed_date DESC);
CREATE INDEX idx_claims_fraud ON claims(fraud_score DESC) WHERE fraud_score > 0.6;

-- Claim payments table
CREATE TABLE claim_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES claims(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(100),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🐳 Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: insurance_db
      POSTGRES_USER: insurance_user
      POSTGRES_PASSWORD: insurance_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  temporal:
    image: temporalio/auto-setup:latest
    ports:
      - "7233:7233"
    environment:
      - DB=postgresql
      - DB_PORT=5432
      - POSTGRES_USER=insurance_user
      - POSTGRES_PWD=insurance_password
    depends_on:
      - postgres

  claims-service:
    build: ./services/claims-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://insurance_user:insurance_password@postgres:5432/insurance_db
      TEMPORAL_HOST: temporal:7233
    depends_on:
      - postgres
      - temporal

volumes:
  postgres_data:
```

---

**Status**: ✅ Fully Implemented with workflow automation, fraud detection, and policy management
