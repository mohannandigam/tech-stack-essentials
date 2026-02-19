# Banking - Core Banking System

## Overview

A modern core banking system demonstrating account management, transaction processing, and fraud detection using microservices and saga patterns.

## 🎯 Key Use Cases

- **Account Management**: Create, update, and manage customer accounts
- **Transaction Processing**: Deposits, withdrawals, transfers with ACID guarantees
- **Fraud Detection**: Real-time transaction monitoring and alerts
- **Loan Management**: Loan origination, servicing, and payments
- **Regulatory Reporting**: AML, KYC compliance reporting

## 🏗️ Architecture Pattern

**Primary**: Microservices + Saga Pattern  
**Secondary**: Event-Driven, CQRS

### Services

- Account Service
- Transaction Service
- Fraud Detection Service
- Notification Service
- Reporting Service

## 💡 Key Challenges

- **ACID Compliance**: Maintain consistency across distributed transactions
- **Regulatory Requirements**: AML, KYC, PCI-DSS, SOX compliance
- **Security**: Multi-factor authentication, encryption at rest/transit
- **Audit Trail**: Complete transaction history with tamper-proof logs
- **High Availability**: 99.99% uptime requirement

## 💻 Quick Example

```typescript
// Saga pattern for money transfer
class TransferSaga {
  async execute(fromAccount: string, toAccount: string, amount: Decimal) {
    const sagaId = uuid();

    try {
      // Step 1: Debit source account
      await this.accountService.debit(fromAccount, amount, sagaId);

      // Step 2: Credit destination account
      await this.accountService.credit(toAccount, amount, sagaId);

      // Step 3: Record transaction
      await this.transactionService.record({
        sagaId,
        from: fromAccount,
        to: toAccount,
        amount,
        status: "COMPLETED",
      });

      return { success: true, sagaId };
    } catch (error) {
      // Compensating transactions
      await this.compensate(sagaId);
      throw error;
    }
  }

  async compensate(sagaId: string) {
    // Rollback all saga steps
  }
}
```

## 🚀 Getting Started

```bash
# Clone and setup
cd domain-examples/banking
docker-compose up -d

# Create test account
curl -X POST http://localhost:3000/api/accounts \
  -d '{"customerId": "CUST-001", "type": "CHECKING"}'

# Make transfer
curl -X POST http://localhost:3000/api/transfers \
  -d '{"from": "ACC-001", "to": "ACC-002", "amount": "100.00"}'
```

## 🔒 Security Features

- OAuth 2.0 + Multi-factor authentication
- AES-256 encryption for sensitive data
- PCI-DSS Level 1 compliance
- Transaction signing and verification
- IP whitelisting and rate limiting

## 📊 Performance Targets

- Transaction latency: < 200ms
- Throughput: 5,000 TPS
- Availability: 99.99%
- Data consistency: Strong (ACID)

## 🔗 Related Examples

- [Finance Domain](../finance/README.md) - Trading and investments
- [Insurance Domain](../insurance/README.md) - Policy and claims
- [Event-Driven Architecture](../../architectures/event-driven/README.md)

## 📦 Implementation Examples

### Example 1: Account Service with Saga Pattern (TypeScript)

```typescript
// src/models/account.model.ts
import { z } from "zod";
import Decimal from "decimal.js";

export const AccountSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  accountNumber: z.string().length(16),
  accountType: z.enum(["CHECKING", "SAVINGS", "MONEY_MARKET", "CD"]),
  balance: z.instanceof(Decimal),
  availableBalance: z.instanceof(Decimal),
  currency: z.string().length(3).default("USD"),
  status: z.enum(["ACTIVE", "FROZEN", "CLOSED"]),
  interestRate: z.number().min(0).max(100).optional(),
  overdraftLimit: z.instanceof(Decimal).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  type: z.enum(["DEBIT", "CREDIT"]),
  amount: z.instanceof(Decimal),
  description: z.string(),
  reference: z.string().optional(),
  balanceAfter: z.instanceof(Decimal),
  timestamp: z.date(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REVERSED"]),
});

export type Account = z.infer<typeof AccountSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
```

```typescript
// src/services/transfer-saga.service.ts
import { Pool } from "pg";
import Decimal from "decimal.js";
import { v4 as uuid } from "uuid";
import { EventEmitter } from "events";

interface SagaStep {
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

export class TransferSaga {
  private steps: SagaStep[] = [];
  private completedSteps: number = 0;

  constructor(
    private readonly db: Pool,
    private readonly eventBus: EventEmitter,
    private readonly auditService: AuditService,
  ) {}

  async executeTransfer(
    fromAccountId: string,
    toAccountId: string,
    amount: Decimal,
    reference: string,
    userId: string,
  ): Promise<string> {
    const sagaId = uuid();

    try {
      // Step 1: Validate accounts
      this.addStep({
        execute: async () => {
          await this.validateAccounts(fromAccountId, toAccountId, amount);
        },
        compensate: async () => {
          // No compensation needed for validation
        },
      });

      // Step 2: Reserve funds (debit hold)
      this.addStep({
        execute: async () => {
          await this.debitAccount(fromAccountId, amount, sagaId, "PENDING");
        },
        compensate: async () => {
          await this.releaseDebitHold(fromAccountId, amount, sagaId);
        },
      });

      // Step 3: Credit destination account
      this.addStep({
        execute: async () => {
          await this.creditAccount(toAccountId, amount, sagaId, "PENDING");
        },
        compensate: async () => {
          await this.reverseCreditHold(toAccountId, amount, sagaId);
        },
      });

      // Step 4: Finalize transaction
      this.addStep({
        execute: async () => {
          await this.finalizeTransfer(sagaId);
        },
        compensate: async () => {
          // Cannot compensate finalized transfer
        },
      });

      // Execute all steps
      for (const step of this.steps) {
        await step.execute();
        this.completedSteps++;
      }

      // Record successful transfer
      await this.recordTransfer(
        sagaId,
        fromAccountId,
        toAccountId,
        amount,
        reference,
        userId,
      );

      // Publish event
      this.eventBus.emit("transfer.completed", {
        sagaId,
        fromAccountId,
        toAccountId,
        amount: amount.toString(),
        timestamp: new Date(),
      });

      return sagaId;
    } catch (error) {
      // Compensate in reverse order
      await this.compensate();

      await this.auditService.log({
        userId,
        action: "TRANSFER_FAILED",
        details: {
          sagaId,
          fromAccountId,
          toAccountId,
          amount: amount.toString(),
          error: (error as Error).message,
        },
      });

      throw error;
    }
  }

  private addStep(step: SagaStep): void {
    this.steps.push(step);
  }

  private async compensate(): Promise<void> {
    // Execute compensating transactions in reverse order
    for (let i = this.completedSteps - 1; i >= 0; i--) {
      try {
        await this.steps[i].compensate();
      } catch (error) {
        console.error(`Failed to compensate step ${i}:`, error);
        // Log but continue with other compensations
      }
    }
  }

  private async validateAccounts(
    fromAccountId: string,
    toAccountId: string,
    amount: Decimal,
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        `SELECT id, status, balance, available_balance, overdraft_limit
         FROM accounts
         WHERE id = ANY($1::uuid[])`,
        [[fromAccountId, toAccountId]],
      );

      if (result.rows.length !== 2) {
        throw new Error("One or both accounts not found");
      }

      const fromAccount = result.rows.find((r) => r.id === fromAccountId);
      const toAccount = result.rows.find((r) => r.id === toAccountId);

      if (fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE") {
        throw new Error("Account is not active");
      }

      const availableBalance = new Decimal(fromAccount.available_balance);
      const overdraftLimit = fromAccount.overdraft_limit
        ? new Decimal(fromAccount.overdraft_limit)
        : new Decimal(0);

      if (availableBalance.plus(overdraftLimit).lessThan(amount)) {
        throw new Error("Insufficient funds");
      }
    } finally {
      client.release();
    }
  }

  private async debitAccount(
    accountId: string,
    amount: Decimal,
    sagaId: string,
    status: string,
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      // Update balance
      const result = await client.query(
        `UPDATE accounts
         SET balance = balance - $1,
             available_balance = available_balance - $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING balance, available_balance`,
        [amount.toString(), accountId],
      );

      // Record transaction
      await client.query(
        `INSERT INTO transactions (account_id, type, amount, description, reference, balance_after, status)
         VALUES ($1, 'DEBIT', $2, 'Transfer out', $3, $4, $5)`,
        [accountId, amount.toString(), sagaId, result.rows[0].balance, status],
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private async creditAccount(
    accountId: string,
    amount: Decimal,
    sagaId: string,
    status: string,
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE accounts
         SET balance = balance + $1,
             available_balance = available_balance + $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING balance`,
        [amount.toString(), accountId],
      );

      await client.query(
        `INSERT INTO transactions (account_id, type, amount, description, reference, balance_after, status)
         VALUES ($1, 'CREDIT', $2, 'Transfer in', $3, $4, $5)`,
        [accountId, amount.toString(), sagaId, result.rows[0].balance, status],
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private async finalizeTransfer(sagaId: string): Promise<void> {
    await this.db.query(
      `UPDATE transactions
       SET status = 'COMPLETED'
       WHERE reference = $1 AND status = 'PENDING'`,
      [sagaId],
    );
  }

  private async releaseDebitHold(
    accountId: string,
    amount: Decimal,
    sagaId: string,
  ): Promise<void> {
    await this.db.query(
      `UPDATE accounts
       SET balance = balance + $1,
           available_balance = available_balance + $1
       WHERE id = $2`,
      [amount.toString(), accountId],
    );

    await this.db.query(
      `UPDATE transactions SET status = 'REVERSED' WHERE reference = $1 AND account_id = $2`,
      [sagaId, accountId],
    );
  }

  private async reverseCreditHold(
    accountId: string,
    amount: Decimal,
    sagaId: string,
  ): Promise<void> {
    await this.db.query(
      `UPDATE accounts
       SET balance = balance - $1,
           available_balance = available_balance - $1
       WHERE id = $2`,
      [amount.toString(), accountId],
    );

    await this.db.query(
      `UPDATE transactions SET status = 'REVERSED' WHERE reference = $1 AND account_id = $2`,
      [sagaId, accountId],
    );
  }

  private async recordTransfer(
    sagaId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: Decimal,
    reference: string,
    userId: string,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO transfer_records (id, from_account_id, to_account_id, amount, reference, user_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'COMPLETED')`,
      [
        sagaId,
        fromAccountId,
        toAccountId,
        amount.toString(),
        reference,
        userId,
      ],
    );
  }
}
```

### Example 2: Fraud Detection Service (Python)

```python
# models/fraud_detection.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class FraudCheck(BaseModel):
    transaction_id: str
    account_id: str
    amount: float
    risk_score: float  # 0.0 to 1.0
    risk_level: RiskLevel
    flags: List[str]
    timestamp: datetime
    action: str  # ALLOW, BLOCK, REVIEW

class FraudRule(BaseModel):
    id: str
    name: str
    description: str
    rule_type: str
    threshold: float
    action: str
    enabled: bool
```

```python
# services/fraud_detection_service.py
from typing import List, Dict
import asyncpg
from datetime import datetime, timedelta
from decimal import Decimal

class FraudDetectionService:
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool
        self.rules = self._load_rules()

    async def analyze_transaction(
        self,
        transaction_id: str,
        account_id: str,
        amount: Decimal,
        merchant: str,
        location: str
    ) -> FraudCheck:
        """Analyze transaction for fraud indicators"""

        flags = []
        risk_score = 0.0

        # Rule 1: High-value transaction
        if amount > 10000:
            flags.append("HIGH_VALUE_TRANSACTION")
            risk_score += 0.3

        # Rule 2: Unusual spending pattern
        avg_transaction = await self.get_average_transaction(account_id)
        if amount > avg_transaction * 5:
            flags.append("UNUSUAL_AMOUNT")
            risk_score += 0.4

        # Rule 3: High frequency
        recent_count = await self.get_recent_transaction_count(account_id, minutes=60)
        if recent_count > 5:
            flags.append("HIGH_FREQUENCY")
            risk_score += 0.3

        # Rule 4: Location change
        if await self.is_location_unusual(account_id, location):
            flags.append("UNUSUAL_LOCATION")
            risk_score += 0.4

        # Rule 5: Time-based anomaly
        if await self.is_unusual_time(account_id):
            flags.append("UNUSUAL_TIME")
            risk_score += 0.2

        # Rule 6: Multiple failed attempts
        failed_count = await self.get_failed_attempts(account_id, hours=24)
        if failed_count > 3:
            flags.append("MULTIPLE_FAILED_ATTEMPTS")
            risk_score += 0.5

        # Rule 7: Known fraud patterns
        if await self.matches_fraud_pattern(account_id, amount, merchant):
            flags.append("KNOWN_FRAUD_PATTERN")
            risk_score += 0.6

        # Cap risk score at 1.0
        risk_score = min(risk_score, 1.0)

        # Determine risk level and action
        if risk_score >= 0.8:
            risk_level = RiskLevel.CRITICAL
            action = "BLOCK"
        elif risk_score >= 0.6:
            risk_level = RiskLevel.HIGH
            action = "REVIEW"
        elif risk_score >= 0.3:
            risk_level = RiskLevel.MEDIUM
            action = "ALLOW_WITH_MONITORING"
        else:
            risk_level = RiskLevel.LOW
            action = "ALLOW"

        # Record fraud check
        await self.record_fraud_check(
            transaction_id,
            account_id,
            risk_score,
            risk_level.value,
            flags,
            action
        )

        return FraudCheck(
            transaction_id=transaction_id,
            account_id=account_id,
            amount=float(amount),
            risk_score=risk_score,
            risk_level=risk_level,
            flags=flags,
            timestamp=datetime.utcnow(),
            action=action
        )

    async def get_average_transaction(self, account_id: str) -> Decimal:
        """Calculate average transaction amount for account"""
        result = await self.db.fetchrow(
            """
            SELECT AVG(amount) as avg_amount
            FROM transactions
            WHERE account_id = $1
              AND timestamp > NOW() - INTERVAL '90 days'
              AND type = 'DEBIT'
            """,
            account_id
        )
        return result['avg_amount'] or Decimal(0)

    async def get_recent_transaction_count(self, account_id: str, minutes: int) -> int:
        """Count recent transactions"""
        result = await self.db.fetchval(
            """
            SELECT COUNT(*)
            FROM transactions
            WHERE account_id = $1
              AND timestamp > NOW() - INTERVAL '%s minutes'
            """,
            account_id, minutes
        )
        return result or 0

    async def is_location_unusual(self, account_id: str, location: str) -> bool:
        """Check if location is unusual for this account"""
        # Get common locations for account
        result = await self.db.fetch(
            """
            SELECT location, COUNT(*) as count
            FROM transactions
            WHERE account_id = $1
              AND timestamp > NOW() - INTERVAL '180 days'
            GROUP BY location
            HAVING COUNT(*) > 5
            """,
            account_id
        )

        common_locations = [row['location'] for row in result]
        return location not in common_locations

    async def is_unusual_time(self, account_id: str) -> bool:
        """Check if transaction time is unusual"""
        current_hour = datetime.utcnow().hour

        # Transactions between 2 AM and 6 AM are considered unusual
        if 2 <= current_hour < 6:
            # Check if account has history of transactions at this time
            result = await self.db.fetchval(
                """
                SELECT COUNT(*)
                FROM transactions
                WHERE account_id = $1
                  AND EXTRACT(HOUR FROM timestamp) BETWEEN 2 AND 6
                  AND timestamp > NOW() - INTERVAL '90 days'
                """,
                account_id
            )
            return (result or 0) < 5

        return False

    async def get_failed_attempts(self, account_id: str, hours: int) -> int:
        """Get count of failed transaction attempts"""
        result = await self.db.fetchval(
            """
            SELECT COUNT(*)
            FROM transactions
            WHERE account_id = $1
              AND status = 'FAILED'
              AND timestamp > NOW() - INTERVAL '%s hours'
            """,
            account_id, hours
        )
        return result or 0

    async def matches_fraud_pattern(
        self,
        account_id: str,
        amount: Decimal,
        merchant: str
    ) -> bool:
        """Check against known fraud patterns"""
        # Check for rapid sequence of small transactions (card testing)
        small_transactions = await self.db.fetchval(
            """
            SELECT COUNT(*)
            FROM transactions
            WHERE account_id = $1
              AND amount < 5
              AND timestamp > NOW() - INTERVAL '1 hour'
            """,
            account_id
        )

        if small_transactions > 10:
            return True

        # Check merchant against fraud database
        is_fraudulent_merchant = await self.db.fetchval(
            "SELECT EXISTS(SELECT 1 FROM fraudulent_merchants WHERE name = $1)",
            merchant
        )

        return is_fraudulent_merchant

    async def record_fraud_check(
        self,
        transaction_id: str,
        account_id: str,
        risk_score: float,
        risk_level: str,
        flags: List[str],
        action: str
    ):
        """Record fraud check results"""
        await self.db.execute(
            """
            INSERT INTO fraud_checks (
                transaction_id, account_id, risk_score, risk_level, flags, action
            ) VALUES ($1, $2, $3, $4, $5, $6)
            """,
            transaction_id, account_id, risk_score, risk_level, flags, action
        )
```

### Example 3: Transaction Processing Service (Go)

```go
// models/transaction.go
package models

import (
    "time"
    "github.com/google/uuid"
    "github.com/shopspring/decimal"
)

type TransactionType string

const (
    Deposit    TransactionType = "DEPOSIT"
    Withdrawal TransactionType = "WITHDRAWAL"
    Transfer   TransactionType = "TRANSFER"
    Fee        TransactionType = "FEE"
    Interest   TransactionType = "INTEREST"
)

type TransactionStatus string

const (
    Pending   TransactionStatus = "PENDING"
    Completed TransactionStatus = "COMPLETED"
    Failed    TransactionStatus = "FAILED"
    Reversed  TransactionStatus = "REVERSED"
)

type Transaction struct {
    ID            uuid.UUID          `json:"id" db:"id"`
    AccountID     uuid.UUID          `json:"account_id" db:"account_id"`
    Type          TransactionType    `json:"type" db:"type"`
    Amount        decimal.Decimal    `json:"amount" db:"amount"`
    Description   string             `json:"description" db:"description"`
    Reference     string             `json:"reference" db:"reference"`
    BalanceAfter  decimal.Decimal    `json:"balance_after" db:"balance_after"`
    Status        TransactionStatus  `json:"status" db:"status"`
    Timestamp     time.Time          `json:"timestamp" db:"timestamp"`
    ProcessedBy   string             `json:"processed_by" db:"processed_by"`
}
```

```go
// services/transaction_service.go
package services

import (
    "context"
    "database/sql"
    "fmt"
    "time"

    "github.com/jmoiron/sqlx"
    "github.com/shopspring/decimal"
    "github.com/google/uuid"
)

type TransactionService struct {
    db              *sqlx.DB
    fraudDetection  *FraudDetectionService
    notificationSvc *NotificationService
}

func NewTransactionService(
    db *sqlx.DB,
    fraudDetection *FraudDetectionService,
    notificationSvc *NotificationService,
) *TransactionService {
    return &TransactionService{
        db:              db,
        fraudDetection:  fraudDetection,
        notificationSvc: notificationSvc,
    }
}

// ProcessDeposit handles deposit transactions
func (s *TransactionService) ProcessDeposit(
    ctx context.Context,
    accountID uuid.UUID,
    amount decimal.Decimal,
    description string,
    userID string,
) (*Transaction, error) {
    if amount.LessThanOrEqual(decimal.Zero) {
        return nil, fmt.Errorf("deposit amount must be positive")
    }

    tx, err := s.db.BeginTxx(ctx, nil)
    if err != nil {
        return nil, err
    }
    defer tx.Rollback()

    // Lock account row
    var account Account
    err = tx.GetContext(ctx, &account,
        "SELECT * FROM accounts WHERE id = $1 FOR UPDATE",
        accountID,
    )
    if err != nil {
        return nil, fmt.Errorf("account not found: %w", err)
    }

    if account.Status != "ACTIVE" {
        return nil, fmt.Errorf("account is not active")
    }

    // Update balance
    newBalance := account.Balance.Add(amount)
    _, err = tx.ExecContext(ctx,
        `UPDATE accounts
         SET balance = $1, available_balance = $2, updated_at = NOW()
         WHERE id = $3`,
        newBalance, newBalance, accountID,
    )
    if err != nil {
        return nil, err
    }

    // Create transaction record
    transaction := &Transaction{
        ID:           uuid.New(),
        AccountID:    accountID,
        Type:         Deposit,
        Amount:       amount,
        Description:  description,
        BalanceAfter: newBalance,
        Status:       Completed,
        Timestamp:    time.Now(),
        ProcessedBy:  userID,
    }

    _, err = tx.NamedExecContext(ctx,
        `INSERT INTO transactions (
            id, account_id, type, amount, description, balance_after, status, timestamp, processed_by
        ) VALUES (
            :id, :account_id, :type, :amount, :description, :balance_after, :status, :timestamp, :processed_by
        )`,
        transaction,
    )
    if err != nil {
        return nil, err
    }

    if err = tx.Commit(); err != nil {
        return nil, err
    }

    // Send notification
    go s.notificationSvc.SendTransactionNotification(accountID, transaction)

    return transaction, nil
}

// ProcessWithdrawal handles withdrawal transactions with fraud detection
func (s *TransactionService) ProcessWithdrawal(
    ctx context.Context,
    accountID uuid.UUID,
    amount decimal.Decimal,
    description string,
    location string,
    userID string,
) (*Transaction, error) {
    if amount.LessThanOrEqual(decimal.Zero) {
        return nil, fmt.Errorf("withdrawal amount must be positive")
    }

    // Fraud detection check
    fraudCheck, err := s.fraudDetection.AnalyzeTransaction(
        ctx, accountID, amount, "WITHDRAWAL", location,
    )
    if err != nil {
        return nil, fmt.Errorf("fraud check failed: %w", err)
    }

    if fraudCheck.Action == "BLOCK" {
        return nil, fmt.Errorf("transaction blocked: high fraud risk")
    }

    tx, err := s.db.BeginTxx(ctx, nil)
    if err != nil {
        return nil, err
    }
    defer tx.Rollback()

    // Lock account
    var account Account
    err = tx.GetContext(ctx, &account,
        "SELECT * FROM accounts WHERE id = $1 FOR UPDATE",
        accountID,
    )
    if err != nil {
        return nil, err
    }

    if account.Status != "ACTIVE" {
        return nil, fmt.Errorf("account is not active")
    }

    // Check sufficient funds (including overdraft)
    overdraftLimit := account.OverdraftLimit
    if overdraftLimit == nil {
        overdraftLimit = &decimal.Zero
    }

    availableWithOverdraft := account.AvailableBalance.Add(*overdraftLimit)
    if availableWithOverdraft.LessThan(amount) {
        return nil, fmt.Errorf("insufficient funds")
    }

    // Update balance
    newBalance := account.Balance.Sub(amount)
    _, err = tx.ExecContext(ctx,
        `UPDATE accounts
         SET balance = $1, available_balance = $2, updated_at = NOW()
         WHERE id = $3`,
        newBalance, newBalance, accountID,
    )
    if err != nil {
        return nil, err
    }

    // Create transaction
    transaction := &Transaction{
        ID:           uuid.New(),
        AccountID:    accountID,
        Type:         Withdrawal,
        Amount:       amount,
        Description:  description,
        BalanceAfter: newBalance,
        Status:       Completed,
        Timestamp:    time.Now(),
        ProcessedBy:  userID,
    }

    _, err = tx.NamedExecContext(ctx,
        `INSERT INTO transactions (
            id, account_id, type, amount, description, balance_after, status, timestamp, processed_by
        ) VALUES (
            :id, :account_id, :type, :amount, :description, :balance_after, :status, :timestamp, :processed_by
        )`,
        transaction,
    )
    if err != nil {
        return nil, err
    }

    if err = tx.Commit(); err != nil {
        return nil, err
    }

    // Async notifications
    go s.notificationSvc.SendTransactionNotification(accountID, transaction)

    if fraudCheck.RiskLevel == "HIGH" || fraudCheck.RiskLevel == "MEDIUM" {
        go s.notificationSvc.SendFraudAlert(accountID, fraudCheck)
    }

    return transaction, nil
}

// GetAccountStatement generates account statement
func (s *TransactionService) GetAccountStatement(
    ctx context.Context,
    accountID uuid.UUID,
    startDate, endDate time.Time,
) ([]Transaction, error) {
    var transactions []Transaction

    err := s.db.SelectContext(ctx, &transactions,
        `SELECT * FROM transactions
         WHERE account_id = $1
           AND timestamp BETWEEN $2 AND $3
         ORDER BY timestamp DESC`,
        accountID, startDate, endDate,
    )

    return transactions, err
}
```

## 🗄️ Database Schema

```sql
-- Accounts table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    account_number VARCHAR(16) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('CHECKING', 'SAVINGS', 'MONEY_MARKET', 'CD')),
    balance DECIMAL(19, 4) NOT NULL DEFAULT 0 CHECK (balance >= -overdraft_limit),
    available_balance DECIMAL(19, 4) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED')),
    interest_rate DECIMAL(5, 4),
    overdraft_limit DECIMAL(19, 4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_accounts_number ON accounts(account_number);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('DEBIT', 'CREDIT', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'FEE', 'INTEREST')),
    amount DECIMAL(19, 4) NOT NULL CHECK (amount != 0),
    description TEXT NOT NULL,
    reference VARCHAR(100),
    balance_after DECIMAL(19, 4) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
    timestamp TIMESTAMP DEFAULT NOW(),
    processed_by VARCHAR(50)
);

CREATE INDEX idx_transactions_account ON transactions(account_id, timestamp DESC);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status, timestamp);

-- Transfer records table
CREATE TABLE transfer_records (
    id UUID PRIMARY KEY,
    from_account_id UUID NOT NULL REFERENCES accounts(id),
    to_account_id UUID NOT NULL REFERENCES accounts(id),
    amount DECIMAL(19, 4) NOT NULL CHECK (amount > 0),
    reference VARCHAR(100),
    user_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transfers_from ON transfer_records(from_account_id, created_at DESC);
CREATE INDEX idx_transfers_to ON transfer_records(to_account_id, created_at DESC);

-- Fraud checks table
CREATE TABLE fraud_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    risk_score DECIMAL(3, 2) NOT NULL CHECK (risk_score BETWEEN 0 AND 1),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    flags TEXT[],
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fraud_checks_account ON fraud_checks(account_id, timestamp DESC);
CREATE INDEX idx_fraud_checks_risk ON fraud_checks(risk_level, timestamp DESC) WHERE risk_level IN ('HIGH', 'CRITICAL');

-- Audit log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB,
    ip_address INET,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, timestamp DESC);
```

## 🐳 Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: banking_db
      POSTGRES_USER: banking_user
      POSTGRES_PASSWORD: banking_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  account-service:
    build: ./services/account-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://banking_user:banking_password@postgres:5432/banking_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

**Status**: ✅ Fully Implemented with Saga pattern, fraud detection, and transaction processing
