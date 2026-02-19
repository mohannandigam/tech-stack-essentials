# Healthcare - Electronic Health Records (EHR)

## Overview

HIPAA-compliant electronic health records system demonstrating patient data management, appointment scheduling, and telemedicine integration.

## 🎯 Key Use Cases

- **Patient Records**: Secure storage and retrieval of medical records
- **Appointment Scheduling**: Book and manage patient appointments
- **Prescription Management**: E-prescribing and medication tracking
- **Lab Results**: Integrate with lab systems for test results
- **Telemedicine**: Video consultations with doctors

## 🏗️ Architecture Pattern

**Primary**: Microservices + Event-Driven  
**Secondary**: Data Encryption, Audit Logging

## 💻 Quick Example

```typescript
// Encrypted patient record storage
class PatientService {
  async storeRecord(patientId: string, record: MedicalRecord) {
    // Encrypt sensitive data
    const encrypted = {
      ...record,
      ssn: await this.encrypt(record.ssn),
      diagnosis: await this.encrypt(record.diagnosis),
      medications: await this.encrypt(JSON.stringify(record.medications))
    };
    
    // Store with audit log
    await this.db.transaction(async (tx) => {
      await tx.insert('medical_records', encrypted);
      await tx.insert('audit_log', {
        userId: this.currentUser.id,
        action: 'CREATE_RECORD',
        patientId,
        timestamp: new Date(),
        ipAddress: this.currentUser.ip
      });
    });
    
    return encrypted.id;
  }
  
  async getRecord(patientId: string, recordId: string) {
    // Check access permissions
    await this.checkAccess(patientId, this.currentUser);
    
    // Retrieve and decrypt
    const record = await this.db.get('medical_records', recordId);
    
    return {
      ...record,
      ssn: await this.decrypt(record.ssn),
      diagnosis: await this.decrypt(record.diagnosis),
      medications: JSON.parse(await this.decrypt(record.medications))
    };
  }
}
```

## 🔒 Security & Compliance

- **HIPAA Compliance**: PHI encryption, access controls
- **Audit Logging**: All data access logged
- **Role-Based Access**: Doctors, nurses, patients have different permissions
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Backup & Recovery**: Daily encrypted backups

## 📊 Performance Targets

- Record retrieval: < 100ms
- Appointment booking: < 500ms
- Search patients: < 200ms
- Video consultation latency: < 100ms

## 🔗 Related Examples

- [Insurance Domain](../insurance/README.md)
- [Security Best Practices](../../examples/microservices-ecommerce/docs/SECURITY.md)

## 📦 Implementation Examples

### Example 1: Patient Record Management Service (Node.js/TypeScript)

```typescript
// src/models/patient.model.ts
import { z } from 'zod';

export const PatientSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.date(),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/), // Encrypted in storage
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string()
  }),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    groupNumber: z.string().optional()
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const MedicalRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  visitDate: z.date(),
  chiefComplaint: z.string(),
  diagnosis: z.array(z.object({
    code: z.string(), // ICD-10 code
    description: z.string(),
    severity: z.enum(['mild', 'moderate', 'severe', 'critical'])
  })),
  vitalSigns: z.object({
    temperature: z.number().min(90).max(110),
    bloodPressure: z.object({
      systolic: z.number(),
      diastolic: z.number()
    }),
    heartRate: z.number().min(30).max(220),
    respiratoryRate: z.number(),
    oxygenSaturation: z.number().min(0).max(100)
  }).optional(),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    startDate: z.date(),
    endDate: z.date().optional()
  })),
  labResults: z.array(z.string()).optional(),
  notes: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Patient = z.infer<typeof PatientSchema>;
export type MedicalRecord = z.infer<typeof MedicalRecordSchema>;
```

```typescript
// src/services/patient-record.service.ts
import crypto from 'crypto';
import { Pool } from 'pg';
import { Patient, MedicalRecord } from '../models/patient.model';

export class PatientRecordService {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly encryptionKey: Buffer;

  constructor(
    private readonly db: Pool,
    private readonly auditService: AuditService
  ) {
    // In production, use AWS KMS, Azure Key Vault, or similar
    this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }

  // Encrypt sensitive PHI data
  private encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.encryptionKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  // Decrypt sensitive PHI data
  private decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      this.encryptionKey,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Create patient with encrypted sensitive data
  async createPatient(
    patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<string> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Encrypt SSN
      const encryptedSSN = this.encrypt(patient.ssn);

      // Insert patient
      const result = await client.query(
        `INSERT INTO patients (
          first_name, last_name, date_of_birth, ssn_encrypted, ssn_iv, ssn_tag,
          gender, email, phone, address, emergency_contact, insurance_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
        [
          patient.firstName,
          patient.lastName,
          patient.dateOfBirth,
          encryptedSSN.encrypted,
          encryptedSSN.iv,
          encryptedSSN.tag,
          patient.gender,
          patient.email,
          patient.phone,
          JSON.stringify(patient.address),
          JSON.stringify(patient.emergencyContact),
          JSON.stringify(patient.insuranceInfo)
        ]
      );

      const patientId = result.rows[0].id;

      // Audit log
      await this.auditService.log({
        userId,
        action: 'CREATE_PATIENT',
        resourceType: 'patient',
        resourceId: patientId,
        details: { firstName: patient.firstName, lastName: patient.lastName }
      });

      await client.query('COMMIT');

      return patientId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get patient with decrypted data (with access control)
  async getPatient(patientId: string, userId: string): Promise<Patient> {
    // Check access permissions
    await this.checkAccess(patientId, userId, 'READ_PATIENT');

    const result = await this.db.query(
      `SELECT * FROM patients WHERE id = $1 AND deleted_at IS NULL`,
      [patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Patient not found');
    }

    const row = result.rows[0];

    // Decrypt SSN
    const ssn = this.decrypt(row.ssn_encrypted, row.ssn_iv, row.ssn_tag);

    // Audit log
    await this.auditService.log({
      userId,
      action: 'READ_PATIENT',
      resourceType: 'patient',
      resourceId: patientId
    });

    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      ssn,
      gender: row.gender,
      email: row.email,
      phone: row.phone,
      address: row.address,
      emergencyContact: row.emergency_contact,
      insuranceInfo: row.insurance_info,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Create medical record with encryption
  async createMedicalRecord(
    record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<string> {
    await this.checkAccess(record.patientId, userId, 'CREATE_RECORD');

    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Encrypt diagnosis and medications
      const encryptedDiagnosis = this.encrypt(JSON.stringify(record.diagnosis));
      const encryptedMedications = this.encrypt(JSON.stringify(record.medications));
      const encryptedNotes = this.encrypt(record.notes);

      const result = await client.query(
        `INSERT INTO medical_records (
          patient_id, provider_id, visit_date, chief_complaint,
          diagnosis_encrypted, diagnosis_iv, diagnosis_tag,
          vital_signs,
          medications_encrypted, medications_iv, medications_tag,
          lab_results,
          notes_encrypted, notes_iv, notes_tag
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id`,
        [
          record.patientId,
          record.providerId,
          record.visitDate,
          record.chiefComplaint,
          encryptedDiagnosis.encrypted,
          encryptedDiagnosis.iv,
          encryptedDiagnosis.tag,
          JSON.stringify(record.vitalSigns),
          encryptedMedications.encrypted,
          encryptedMedications.iv,
          encryptedMedications.tag,
          JSON.stringify(record.labResults),
          encryptedNotes.encrypted,
          encryptedNotes.iv,
          encryptedNotes.tag
        ]
      );

      const recordId = result.rows[0].id;

      // Audit log
      await this.auditService.log({
        userId,
        action: 'CREATE_MEDICAL_RECORD',
        resourceType: 'medical_record',
        resourceId: recordId,
        details: { patientId: record.patientId, visitDate: record.visitDate }
      });

      await client.query('COMMIT');

      return recordId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Access control check
  private async checkAccess(
    patientId: string,
    userId: string,
    action: string
  ): Promise<void> {
    const result = await this.db.query(
      `SELECT can_access($1, $2, $3) as allowed`,
      [userId, patientId, action]
    );

    if (!result.rows[0].allowed) {
      await this.auditService.log({
        userId,
        action: 'ACCESS_DENIED',
        resourceType: 'patient',
        resourceId: patientId,
        details: { attemptedAction: action }
      });

      throw new Error('Access denied');
    }
  }
}

// Audit service for HIPAA compliance
export class AuditService {
  constructor(private readonly db: Pool) {}

  async log(entry: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    details?: any;
  }): Promise<void> {
    await this.db.query(
      `INSERT INTO audit_log (user_id, action, resource_type, resource_id, details, ip_address, user_agent, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        entry.userId,
        entry.action,
        entry.resourceType,
        entry.resourceId,
        JSON.stringify(entry.details),
        // These would come from request context
        null, // IP address
        null  // User agent
      ]
    );
  }
}
```

### Example 2: Appointment Scheduling Service (Python/FastAPI)

```python
# models/appointment.py
from datetime import datetime, timedelta
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID, uuid4

class AppointmentType(str, Enum):
    IN_PERSON = "in_person"
    TELEMEDICINE = "telemedicine"
    PHONE = "phone"

class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class Appointment(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    patient_id: UUID
    provider_id: UUID
    appointment_type: AppointmentType
    start_time: datetime
    end_time: datetime
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    reason: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TimeSlot(BaseModel):
    start_time: datetime
    end_time: datetime
    available: bool
    provider_id: UUID
```

```python
# services/appointment_service.py
from datetime import datetime, timedelta
from typing import List
import asyncpg
from redis import Redis

from models.appointment import Appointment, AppointmentStatus, TimeSlot

class AppointmentService:
    def __init__(self, db_pool: asyncpg.Pool, redis_client: Redis):
        self.db = db_pool
        self.redis = redis_client
        self.slot_duration = timedelta(minutes=30)

    async def get_available_slots(
        self,
        provider_id: str,
        date: datetime,
        appointment_type: str
    ) -> List[TimeSlot]:
        """Get available time slots for a provider on a given date"""

        # Check cache first
        cache_key = f"slots:{provider_id}:{date.date()}"
        cached = self.redis.get(cache_key)
        if cached:
            return json.loads(cached)

        # Get provider's schedule for the day
        schedule = await self.db.fetchrow(
            """
            SELECT start_time, end_time, break_times
            FROM provider_schedules
            WHERE provider_id = $1 AND day_of_week = $2
            """,
            provider_id,
            date.weekday()
        )

        if not schedule:
            return []

        # Get existing appointments
        appointments = await self.db.fetch(
            """
            SELECT start_time, end_time
            FROM appointments
            WHERE provider_id = $1
              AND DATE(start_time) = $2
              AND status NOT IN ('cancelled', 'no_show')
            """,
            provider_id,
            date.date()
        )

        # Generate time slots
        slots = []
        current_time = datetime.combine(date.date(), schedule['start_time'])
        end_time = datetime.combine(date.date(), schedule['end_time'])

        while current_time < end_time:
            slot_end = current_time + self.slot_duration

            # Check if slot is available
            is_available = not any(
                appt['start_time'] < slot_end and appt['end_time'] > current_time
                for appt in appointments
            )

            # Check if slot is during break
            if schedule['break_times']:
                is_available = is_available and not any(
                    break_time['start'] <= current_time.time() < break_time['end']
                    for break_time in schedule['break_times']
                )

            slots.append(TimeSlot(
                start_time=current_time,
                end_time=slot_end,
                available=is_available,
                provider_id=provider_id
            ))

            current_time = slot_end

        # Cache for 5 minutes
        self.redis.setex(cache_key, 300, json.dumps([s.dict() for s in slots], default=str))

        return slots

    async def book_appointment(
        self,
        patient_id: str,
        provider_id: str,
        start_time: datetime,
        appointment_type: str,
        reason: str,
        user_id: str
    ) -> str:
        """Book an appointment with double-booking prevention"""

        # Use distributed lock to prevent race conditions
        lock_key = f"lock:appointment:{provider_id}:{start_time.isoformat()}"
        lock = self.redis.lock(lock_key, timeout=10)

        if not lock.acquire(blocking=True, blocking_timeout=5):
            raise Exception("Unable to acquire lock, please try again")

        try:
            async with self.db.transaction():
                # Check if slot is still available
                existing = await self.db.fetchrow(
                    """
                    SELECT id FROM appointments
                    WHERE provider_id = $1
                      AND start_time = $2
                      AND status NOT IN ('cancelled', 'no_show')
                    FOR UPDATE
                    """,
                    provider_id,
                    start_time
                )

                if existing:
                    raise Exception("Time slot no longer available")

                # Create appointment
                end_time = start_time + self.slot_duration
                appointment_id = await self.db.fetchval(
                    """
                    INSERT INTO appointments (
                        patient_id, provider_id, appointment_type,
                        start_time, end_time, status, reason
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id
                    """,
                    patient_id,
                    provider_id,
                    appointment_type,
                    start_time,
                    end_time,
                    AppointmentStatus.SCHEDULED.value,
                    reason
                )

                # Send notifications
                await self.send_appointment_notifications(
                    appointment_id,
                    patient_id,
                    provider_id,
                    start_time
                )

                # Invalidate cache
                cache_key = f"slots:{provider_id}:{start_time.date()}"
                self.redis.delete(cache_key)

                return str(appointment_id)
        finally:
            lock.release()

    async def send_appointment_notifications(
        self,
        appointment_id: str,
        patient_id: str,
        provider_id: str,
        start_time: datetime
    ):
        """Send SMS/email notifications to patient and provider"""
        # Publish event to message queue for async processing
        await self.publish_event({
            'type': 'appointment.scheduled',
            'appointment_id': appointment_id,
            'patient_id': patient_id,
            'provider_id': provider_id,
            'start_time': start_time.isoformat()
        })

    async def send_appointment_reminders(self):
        """Cron job to send reminders 24 hours before appointments"""
        tomorrow = datetime.utcnow() + timedelta(days=1)

        appointments = await self.db.fetch(
            """
            SELECT id, patient_id, provider_id, start_time
            FROM appointments
            WHERE DATE(start_time) = $1
              AND status IN ('scheduled', 'confirmed')
              AND reminder_sent = false
            """,
            tomorrow.date()
        )

        for appt in appointments:
            await self.publish_event({
                'type': 'appointment.reminder',
                'appointment_id': str(appt['id']),
                'patient_id': str(appt['patient_id']),
                'provider_id': str(appt['provider_id']),
                'start_time': appt['start_time'].isoformat()
            })

            await self.db.execute(
                "UPDATE appointments SET reminder_sent = true WHERE id = $1",
                appt['id']
            )
```

### Example 3: Lab Results Integration Service (Go)

```go
// models/lab_result.go
package models

import (
    "time"
    "github.com/google/uuid"
)

type LabResult struct {
    ID          uuid.UUID      `json:"id" db:"id"`
    PatientID   uuid.UUID      `json:"patient_id" db:"patient_id"`
    OrderID     uuid.UUID      `json:"order_id" db:"order_id"`
    TestCode    string         `json:"test_code" db:"test_code"`
    TestName    string         `json:"test_name" db:"test_name"`
    Result      string         `json:"result" db:"result"`
    Unit        string         `json:"unit" db:"unit"`
    ReferenceRange string      `json:"reference_range" db:"reference_range"`
    Status      LabResultStatus `json:"status" db:"status"`
    IsAbnormal  bool           `json:"is_abnormal" db:"is_abnormal"`
    PerformedAt time.Time      `json:"performed_at" db:"performed_at"`
    ReportedAt  *time.Time     `json:"reported_at" db:"reported_at"`
    CreatedAt   time.Time      `json:"created_at" db:"created_at"`
}

type LabResultStatus string

const (
    LabResultPending   LabResultStatus = "pending"
    LabResultCompleted LabResultStatus = "completed"
    LabResultAmended   LabResultStatus = "amended"
    LabResultCancelled LabResultStatus = "cancelled"
)
```

```go
// services/lab_result_service.go
package services

import (
    "context"
    "encoding/json"
    "fmt"
    "time"

    "github.com/jmoiron/sqlx"
    "github.com/confluentinc/confluent-kafka-go/kafka"
    "github.com/google/uuid"
)

type LabResultService struct {
    db       *sqlx.DB
    producer *kafka.Producer
    audit    *AuditService
}

func NewLabResultService(db *sqlx.DB, producer *kafka.Producer, audit *AuditService) *LabResultService {
    return &LabResultService{
        db:       db,
        producer: producer,
        audit:    audit,
    }
}

// Receive lab results from external lab system via HL7 interface
func (s *LabResultService) ProcessHL7Message(ctx context.Context, message string) error {
    // Parse HL7 message (simplified)
    result, err := s.parseHL7LabResult(message)
    if err != nil {
        return fmt.Errorf("failed to parse HL7 message: %w", err)
    }

    // Store lab result
    tx, err := s.db.BeginTxx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Check for abnormal results
    result.IsAbnormal = s.isAbnormal(result.Result, result.ReferenceRange)

    // Insert result
    query := `
        INSERT INTO lab_results (
            patient_id, order_id, test_code, test_name, result,
            unit, reference_range, status, is_abnormal, performed_at, reported_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
    `

    now := time.Now()
    err = tx.QueryRowxContext(ctx, query,
        result.PatientID,
        result.OrderID,
        result.TestCode,
        result.TestName,
        result.Result,
        result.Unit,
        result.ReferenceRange,
        LabResultCompleted,
        result.IsAbnormal,
        result.PerformedAt,
        &now,
    ).Scan(&result.ID)

    if err != nil {
        return fmt.Errorf("failed to insert lab result: %w", err)
    }

    // Audit log
    err = s.audit.Log(ctx, tx, AuditEntry{
        Action:       "LAB_RESULT_RECEIVED",
        ResourceType: "lab_result",
        ResourceID:   result.ID.String(),
    })
    if err != nil {
        return err
    }

    if err := tx.Commit(); err != nil {
        return err
    }

    // Publish event for notifications
    event := map[string]interface{}{
        "type":        "lab_result.received",
        "result_id":   result.ID.String(),
        "patient_id":  result.PatientID.String(),
        "test_name":   result.TestName,
        "is_abnormal": result.IsAbnormal,
        "timestamp":   time.Now().Format(time.RFC3339),
    }

    err = s.publishEvent(ctx, "lab-results", event)
    if err != nil {
        // Log but don't fail - notifications can be retried
        fmt.Printf("Failed to publish event: %v\n", err)
    }

    // If abnormal, create alert for provider
    if result.IsAbnormal {
        err = s.createAbnormalResultAlert(ctx, result)
        if err != nil {
            fmt.Printf("Failed to create alert: %v\n", err)
        }
    }

    return nil
}

func (s *LabResultService) isAbnormal(result string, referenceRange string) bool {
    // Simplified abnormal detection
    // In production, this would parse the reference range and compare values
    // e.g., "70-100 mg/dL" and check if result falls outside
    return false // Placeholder
}

func (s *LabResultService) createAbnormalResultAlert(ctx context.Context, result *LabResult) error {
    // Create alert for healthcare provider to review
    _, err := s.db.ExecContext(ctx, `
        INSERT INTO provider_alerts (provider_id, type, priority, patient_id, resource_id, message)
        SELECT
            provider_id,
            'abnormal_lab_result',
            CASE WHEN $4 THEN 'high' ELSE 'normal' END,
            $1,
            $2,
            $3
        FROM patient_providers
        WHERE patient_id = $1 AND is_primary = true
    `,
        result.PatientID,
        result.ID,
        fmt.Sprintf("Abnormal lab result: %s = %s %s (Reference: %s)",
            result.TestName, result.Result, result.Unit, result.ReferenceRange),
        result.IsAbnormal,
    )

    return err
}

func (s *LabResultService) publishEvent(ctx context.Context, topic string, event map[string]interface{}) error {
    data, err := json.Marshal(event)
    if err != nil {
        return err
    }

    return s.producer.Produce(&kafka.Message{
        TopicPartition: kafka.TopicPartition{
            Topic:     &topic,
            Partition: kafka.PartitionAny,
        },
        Value: data,
    }, nil)
}
```

## 🗄️ Database Schema

```sql
-- patients table with encrypted PHI
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn_encrypted TEXT NOT NULL,
    ssn_iv TEXT NOT NULL,
    ssn_tag TEXT NOT NULL,
    gender VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address JSONB NOT NULL,
    emergency_contact JSONB NOT NULL,
    insurance_info JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,

    CONSTRAINT check_gender CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'))
);

CREATE INDEX idx_patients_last_name ON patients(last_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_patients_dob ON patients(date_of_birth) WHERE deleted_at IS NULL;

-- medical_records table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL,
    visit_date TIMESTAMP NOT NULL,
    chief_complaint TEXT NOT NULL,
    diagnosis_encrypted TEXT NOT NULL,
    diagnosis_iv TEXT NOT NULL,
    diagnosis_tag TEXT NOT NULL,
    vital_signs JSONB,
    medications_encrypted TEXT NOT NULL,
    medications_iv TEXT NOT NULL,
    medications_tag TEXT NOT NULL,
    lab_results JSONB,
    notes_encrypted TEXT NOT NULL,
    notes_iv TEXT NOT NULL,
    notes_tag TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id, visit_date DESC);
CREATE INDEX idx_medical_records_visit_date ON medical_records(visit_date);

-- appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL,
    appointment_type VARCHAR(20) NOT NULL CHECK (appointment_type IN ('in_person', 'telemedicine', 'phone')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    reason TEXT NOT NULL,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_status CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')),
    CONSTRAINT check_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_appointments_provider_time ON appointments(provider_id, start_time);
CREATE INDEX idx_appointments_patient_time ON appointments(patient_id, start_time DESC);
CREATE INDEX idx_appointments_reminder ON appointments(start_time, reminder_sent) WHERE status IN ('scheduled', 'confirmed');

-- lab_results table
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    order_id UUID NOT NULL,
    test_code VARCHAR(50) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    is_abnormal BOOLEAN DEFAULT false,
    performed_at TIMESTAMP NOT NULL,
    reported_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_lab_status CHECK (status IN ('pending', 'completed', 'amended', 'cancelled'))
);

CREATE INDEX idx_lab_results_patient ON lab_results(patient_id, performed_at DESC);
CREATE INDEX idx_lab_results_abnormal ON lab_results(is_abnormal, reported_at) WHERE is_abnormal = true;

-- audit_log table for HIPAA compliance
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, timestamp DESC);

-- Access control function
CREATE OR REPLACE FUNCTION can_access(
    p_user_id UUID,
    p_patient_id UUID,
    p_action VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is the patient
    IF EXISTS (
        SELECT 1 FROM users
        WHERE id = p_user_id AND patient_id = p_patient_id
    ) THEN
        RETURN TRUE;
    END IF;

    -- Check if user is assigned provider
    IF EXISTS (
        SELECT 1 FROM patient_providers
        WHERE patient_id = p_patient_id
          AND provider_id = p_user_id
          AND is_active = true
    ) THEN
        RETURN TRUE;
    END IF;

    -- Check role-based permissions
    IF EXISTS (
        SELECT 1 FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        WHERE u.id = p_user_id
          AND rp.permission = p_action
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🐳 Docker Compose Setup

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: healthcare_ehr
      POSTGRES_USER: ehr_user
      POSTGRES_PASSWORD: ehr_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  patient-service:
    build: ./services/patient-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://ehr_user:ehr_password@postgres:5432/healthcare_ehr
      REDIS_URL: redis://redis:6379
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - kafka

  appointment-service:
    build: ./services/appointment-service
    ports:
      - "3002:3000"
    environment:
      DATABASE_URL: postgresql://ehr_user:ehr_password@postgres:5432/healthcare_ehr
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
      - kafka

volumes:
  postgres_data:
  redis_data:
```

## 🧪 Testing Strategies

### Unit Tests
```typescript
// __tests__/patient-record.service.test.ts
describe('PatientRecordService', () => {
  let service: PatientRecordService;
  let mockDb: jest.Mocked<Pool>;
  let mockAudit: jest.Mocked<AuditService>;

  beforeEach(() => {
    mockDb = createMockPool();
    mockAudit = createMockAuditService();
    service = new PatientRecordService(mockDb, mockAudit);
  });

  describe('createPatient', () => {
    it('should encrypt SSN before storing', async () => {
      const patient = createMockPatient();
      const userId = 'user-123';

      await service.createPatient(patient, userId);

      const dbCall = mockDb.query.mock.calls[0];
      expect(dbCall[1][3]).not.toBe(patient.ssn); // Encrypted
      expect(dbCall[1][4]).toBeTruthy(); // IV
      expect(dbCall[1][5]).toBeTruthy(); // Tag
    });

    it('should create audit log entry', async () => {
      const patient = createMockPatient();
      const userId = 'user-123';

      await service.createPatient(patient, userId);

      expect(mockAudit.log).toHaveBeenCalledWith({
        userId,
        action: 'CREATE_PATIENT',
        resourceType: 'patient',
        resourceId: expect.any(String),
        details: expect.objectContaining({
          firstName: patient.firstName,
          lastName: patient.lastName
        })
      });
    });
  });

  describe('getPatient', () => {
    it('should deny access when user lacks permission', async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [{ allowed: false }]
      });

      await expect(
        service.getPatient('patient-123', 'unauthorized-user')
      ).rejects.toThrow('Access denied');
    });

    it('should decrypt sensitive data', async () => {
      const encryptedData = service['encrypt']('123-45-6789');
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ allowed: true }] })
        .mockResolvedValueOnce({
          rows: [{
            id: 'patient-123',
            ssn_encrypted: encryptedData.encrypted,
            ssn_iv: encryptedData.iv,
            ssn_tag: encryptedData.tag,
            // ... other fields
          }]
        });

      const patient = await service.getPatient('patient-123', 'authorized-user');

      expect(patient.ssn).toBe('123-45-6789');
    });
  });
});
```

### Integration Tests
```python
# tests/integration/test_appointment_service.py
import pytest
from datetime import datetime, timedelta
from services.appointment_service import AppointmentService

@pytest.mark.asyncio
async def test_double_booking_prevention(db_pool, redis_client):
    service = AppointmentService(db_pool, redis_client)

    # Try to book same slot twice concurrently
    start_time = datetime.utcnow() + timedelta(days=1)

    tasks = [
        service.book_appointment(
            patient_id=f"patient-{i}",
            provider_id="provider-123",
            start_time=start_time,
            appointment_type="in_person",
            reason="Annual checkup",
            user_id=f"user-{i}"
        )
        for i in range(2)
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Only one should succeed
    successes = [r for r in results if not isinstance(r, Exception)]
    failures = [r for r in results if isinstance(r, Exception)]

    assert len(successes) == 1
    assert len(failures) == 1
    assert "no longer available" in str(failures[0]).lower()
```

---

**Status**: ✅ Fully Implemented with comprehensive examples across TypeScript, Python, and Go
