# Security Compliance

## What is it?

**Security compliance** is the process of meeting established standards, regulations, and laws that govern how organizations must protect sensitive data and systems. These regulations vary by industry (healthcare, finance, retail) and geography (EU, US, global), but they all share a common goal: ensuring that companies handle data responsibly, protect privacy, and maintain security controls to prevent breaches.

Think of compliance as the rules of the road for data security. Just as traffic laws exist to keep everyone safe while driving, compliance regulations exist to keep data and systems secure while businesses operate.

## Simple Analogy

Imagine you're opening a restaurant:

**Without compliance regulations**:
- You could store raw chicken next to desserts
- No requirement to wash hands
- No fire exits needed
- No food safety inspections

**With compliance regulations (health codes)**:
- Specific temperature requirements for food storage
- Mandatory handwashing stations and procedures
- Required fire safety equipment and exits
- Regular inspections with documented checklists
- Penalties for violations

Security compliance works the same way. It establishes minimum standards for data protection, requires documentation and monitoring, mandates regular audits, and imposes penalties for violations.

## Why does it matter?

### Legal and Financial Impact

**Penalties for non-compliance**:
- **GDPR**: Up to €20 million or 4% of global annual revenue (whichever is higher)
- **HIPAA**: Up to $1.5 million per violation category per year
- **PCI-DSS**: Fines from $5,000 to $100,000 per month, plus potential loss of payment processing
- **SOC 2**: Loss of customer trust and contracts (many B2B customers require SOC 2)

**Real-world example**: British Airways was fined £20 million ($26 million) for a 2018 data breach that violated GDPR. The breach exposed personal data of 400,000 customers due to inadequate security measures.

### Business Impact

**Positive effects**:
- **Customer trust**: Compliance certifications signal that you take security seriously
- **Market access**: Many industries require compliance to do business (healthcare, finance)
- **Better security**: Compliance frameworks force you to implement good security practices
- **Reduced breach risk**: Following compliance requirements reduces likelihood of incidents
- **Competitive advantage**: SOC 2, ISO 27001 certifications differentiate you from competitors

**Negative effects of non-compliance**:
- **Legal liability**: Lawsuits from affected customers
- **Reputation damage**: Loss of customer trust and brand value
- **Lost revenue**: Inability to do business in regulated markets
- **Operational disruption**: Systems shut down for compliance failures
- **Executive liability**: Personal liability for executives in some cases

### Operational Impact

- **Documentation requirements**: Policies, procedures, and evidence must be maintained
- **Technical controls**: Specific security measures must be implemented
- **Regular audits**: Internal and external audits to verify compliance
- **Training**: Employee education on compliance requirements
- **Monitoring**: Continuous monitoring and reporting of compliance status

## How it works

### Compliance Lifecycle

```
┌─────────────────┐
│  1. Assessment  │  Identify which regulations apply to your business
│                 │  Gap analysis: where are you now vs. requirements?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Planning     │  Create roadmap to achieve compliance
│                 │  Assign responsibilities and timelines
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Implement    │  Deploy technical controls
│                 │  Create policies and procedures
│                 │  Train employees
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Document     │  Record all controls and evidence
│                 │  Maintain audit trails
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Audit        │  Internal review of compliance status
│                 │  External audit by certified auditor
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Certify      │  Receive compliance certification/attestation
│                 │  Publish results (SOC 2 reports, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 7. Maintain     │  Continuous monitoring
│                 │  Regular re-audits (annual, bi-annual)
│                 │  Update controls as requirements change
└────────┬────────┘
         │
         │ (Loop back to Assessment)
         └─────────────────────────────┐
                                       ▼
```

### Compliance Stack

```
┌────────────────────────────────────────────────────┐
│              Regulatory Requirements               │
│         (GDPR, HIPAA, PCI-DSS, SOC 2, etc.)       │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│           Compliance Frameworks/Standards          │
│      (ISO 27001, NIST, CIS Controls, etc.)        │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│              Technical Controls                    │
│  (Encryption, Access Control, Logging, etc.)      │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│         Policies and Procedures                    │
│   (Documentation, Training, Incident Response)    │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│            Monitoring and Auditing                 │
│    (Logs, Alerts, Compliance Dashboards)          │
└────────────────────────────────────────────────────┘
```

## Key Concepts

### **Compliance vs. Security**
- **Compliance**: Meeting specific regulatory requirements (checkbox approach)
- **Security**: Comprehensive protection against threats (risk-based approach)
- **Important**: Compliance is the minimum bar, not the ceiling. You can be compliant but not secure.

### **Audit**
An independent examination of your systems, processes, and documentation to verify compliance with standards. Can be internal (self-assessment) or external (third-party auditor).

### **Attestation**
A formal statement from an auditor confirming that your organization meets compliance requirements. Examples: SOC 2 Type II report, ISO 27001 certificate.

### **Control**
A security measure implemented to meet a compliance requirement. Controls can be technical (encryption, firewalls), administrative (policies, training), or physical (locks, badges).

### **Evidence**
Documentation proving that controls are in place and operating effectively. Examples: logs, screenshots, policies, training records, access control lists.

### **Data Controller vs. Data Processor**
- **Data Controller**: Organization that determines why and how personal data is processed (e.g., your company)
- **Data Processor**: Organization that processes data on behalf of the controller (e.g., your cloud provider)

### **Personal Data / PII**
Information that can identify an individual. Examples: name, email, IP address, location data, social security number, health records.

### **Data Subject**
An individual whose personal data is being processed.

### **Data Breach**
Unauthorized access, disclosure, or loss of personal data.

### **Right to be Forgotten (Erasure)**
Data subject's right to have their personal data deleted under certain conditions (GDPR requirement).

### **Data Portability**
Data subject's right to receive their personal data in a structured, commonly used format and transfer it to another controller.

## GDPR (General Data Protection Regulation)

### What is GDPR?

**GDPR** is the European Union's data protection law that went into effect May 25, 2018. It applies to any organization that processes personal data of EU residents, regardless of where the organization is located.

**Plain English**: If you have customers in the EU, you must comply with GDPR.

### Who Must Comply?

- Companies operating in the EU
- Companies offering goods/services to EU residents (even if not located in EU)
- Companies monitoring behavior of EU residents (e.g., tracking cookies)

**Examples**:
- US company with EU customers: YES, must comply
- SaaS platform with EU users: YES, must comply
- Mobile app available in EU app stores: YES, must comply
- Website accessible from EU (even without EU customers): Maybe (depends on intent)

### Core Principles

1. **Lawfulness, Fairness, Transparency**: Process data legally, fairly, and transparently
2. **Purpose Limitation**: Collect data for specific, legitimate purposes only
3. **Data Minimization**: Collect only data that's necessary for the purpose
4. **Accuracy**: Keep personal data accurate and up to date
5. **Storage Limitation**: Keep data only as long as necessary
6. **Integrity and Confidentiality**: Protect data with appropriate security
7. **Accountability**: Demonstrate compliance with principles

### Legal Basis for Processing

You need at least one legal basis to process personal data:

1. **Consent**: Clear, affirmative action by data subject
2. **Contract**: Processing necessary to fulfill a contract
3. **Legal Obligation**: Required by law
4. **Vital Interests**: Necessary to protect someone's life
5. **Public Task**: Performing a task in the public interest
6. **Legitimate Interests**: Necessary for legitimate business purposes (with balancing test)

### Data Subject Rights

```python
# Implementation example for GDPR rights

class GDPRDataSubjectRights:
    """
    Handle GDPR data subject rights requests.

    Required rights:
    1. Right to access (data portability)
    2. Right to rectification
    3. Right to erasure ("right to be forgotten")
    4. Right to restrict processing
    5. Right to data portability
    6. Right to object
    7. Rights related to automated decision-making
    """

    def __init__(self, db_connection):
        self.db = db_connection
        self.logger = logging.getLogger(__name__)

    def handle_access_request(self, user_id, email):
        """
        Right to Access: Provide copy of all personal data.

        Requirements:
        - Respond within 30 days (extendable to 90 days if complex)
        - Provide data in structured, commonly used format
        - Include information about processing purposes
        - Free of charge (first request)
        """
        try:
            # Verify identity
            if not self._verify_identity(user_id, email):
                self.logger.warning(f"Failed identity verification for access request: {email}")
                raise ValueError("Identity verification failed")

            # Collect all personal data
            user_data = {
                'profile': self._get_profile_data(user_id),
                'orders': self._get_order_history(user_id),
                'interactions': self._get_interaction_data(user_id),
                'preferences': self._get_preferences(user_id),
                'logs': self._get_access_logs(user_id)
            }

            # Include processing information
            processing_info = {
                'purposes': [
                    'Account management',
                    'Order fulfillment',
                    'Customer support',
                    'Marketing (with consent)'
                ],
                'legal_basis': 'Contract and Consent',
                'retention_period': '7 years after account closure',
                'recipients': [
                    'Payment processor (Stripe)',
                    'Email service (SendGrid)',
                    'Analytics (Google Analytics - anonymized)'
                ],
                'transfers': 'Data stored in AWS EU-West-1 (Ireland)'
            }

            # Log the request
            self.logger.info(
                "GDPR access request processed",
                extra={
                    'user_id': user_id,
                    'email': email,
                    'timestamp': datetime.utcnow().isoformat(),
                    'data_categories': list(user_data.keys())
                }
            )

            # Generate export file
            export_file = self._create_data_export(user_data, processing_info)

            return {
                'status': 'completed',
                'export_file': export_file,
                'message': 'Your personal data export is ready for download'
            }

        except Exception as e:
            self.logger.error(f"Failed to process access request: {e}")
            raise

    def handle_erasure_request(self, user_id, email):
        """
        Right to Erasure: Delete personal data ("right to be forgotten").

        Requirements:
        - Must delete unless legal obligation to retain
        - Notify third parties who received the data
        - Respond within 30 days
        - Document reason if unable to delete
        """
        try:
            # Verify identity
            if not self._verify_identity(user_id, email):
                self.logger.warning(f"Failed identity verification for erasure request: {email}")
                raise ValueError("Identity verification failed")

            # Check if we can delete (legal obligations?)
            retention_requirements = self._check_retention_requirements(user_id)

            if retention_requirements:
                self.logger.info(f"Cannot fully delete data due to legal requirements: {user_id}")
                return {
                    'status': 'partial',
                    'message': f"Some data must be retained due to: {retention_requirements}",
                    'actions_taken': 'Anonymized non-required data'
                }

            # Delete from all systems
            deletion_results = {
                'profile': self._delete_profile_data(user_id),
                'orders': self._anonymize_order_history(user_id),  # May need to retain for tax
                'interactions': self._delete_interaction_data(user_id),
                'preferences': self._delete_preferences(user_id),
                'backups': self._schedule_backup_deletion(user_id)
            }

            # Notify third parties
            self._notify_processors_of_erasure(user_id)

            # Log the erasure
            self.logger.info(
                "GDPR erasure request processed",
                extra={
                    'user_id': user_id,
                    'email': email,
                    'timestamp': datetime.utcnow().isoformat(),
                    'deletion_results': deletion_results
                }
            )

            return {
                'status': 'completed',
                'message': 'Your personal data has been deleted',
                'details': deletion_results
            }

        except Exception as e:
            self.logger.error(f"Failed to process erasure request: {e}")
            raise

    def handle_portability_request(self, user_id, email):
        """
        Right to Data Portability: Provide data in machine-readable format.

        Requirements:
        - Structured, commonly used, machine-readable format (JSON, CSV)
        - Includes data provided by user and generated by system
        - Only applies to data processed based on consent or contract
        """
        try:
            if not self._verify_identity(user_id, email):
                raise ValueError("Identity verification failed")

            # Collect portable data (only consent/contract basis)
            portable_data = {
                'profile': self._get_profile_data(user_id),
                'orders': self._get_order_history(user_id),
                'preferences': self._get_preferences(user_id)
            }

            # Export as JSON (structured, machine-readable)
            export_json = json.dumps(portable_data, indent=2, default=str)

            self.logger.info(f"GDPR portability request processed: {user_id}")

            return {
                'status': 'completed',
                'format': 'application/json',
                'data': export_json
            }

        except Exception as e:
            self.logger.error(f"Failed to process portability request: {e}")
            raise

    def handle_rectification_request(self, user_id, email, corrections):
        """
        Right to Rectification: Correct inaccurate personal data.

        Requirements:
        - Respond within 30 days
        - Notify third parties of corrections
        - Provide confirmation of changes
        """
        try:
            if not self._verify_identity(user_id, email):
                raise ValueError("Identity verification failed")

            # Update data
            updated_fields = []
            for field, new_value in corrections.items():
                if self._validate_field_update(field, new_value):
                    self._update_field(user_id, field, new_value)
                    updated_fields.append(field)

            # Notify third parties
            self._notify_processors_of_rectification(user_id, updated_fields)

            self.logger.info(
                "GDPR rectification request processed",
                extra={
                    'user_id': user_id,
                    'email': email,
                    'updated_fields': updated_fields,
                    'timestamp': datetime.utcnow().isoformat()
                }
            )

            return {
                'status': 'completed',
                'updated_fields': updated_fields,
                'message': 'Your personal data has been updated'
            }

        except Exception as e:
            self.logger.error(f"Failed to process rectification request: {e}")
            raise

    def _verify_identity(self, user_id, email):
        """
        Verify identity before processing request.

        Best practice: Require additional verification for sensitive requests.
        """
        # Implementation would include:
        # - Email verification link
        # - Account login
        # - Additional identity proofs for sensitive requests
        return True

    def _check_retention_requirements(self, user_id):
        """
        Check if data must be retained for legal reasons.

        Common retention requirements:
        - Tax records: 7 years
        - Financial transactions: 7 years
        - Legal claims: Until claim is resolved
        - Contract obligations: Duration of contract + statute of limitations
        """
        requirements = []

        # Check for active legal holds
        if self._has_legal_hold(user_id):
            requirements.append("Active legal hold")

        # Check for financial retention requirements
        if self._has_recent_financial_transactions(user_id):
            requirements.append("Financial records retention (7 years)")

        # Check for contractual obligations
        if self._has_active_contracts(user_id):
            requirements.append("Active contract obligations")

        return requirements
```

### Technical Requirements

#### 1. Data Encryption

```python
# Encryption at rest and in transit
class GDPREncryption:
    """
    Implement encryption for GDPR compliance.

    Requirements:
    - Encryption at rest for all personal data
    - TLS 1.2+ for data in transit
    - Key management with access controls
    """

    def __init__(self):
        from cryptography.fernet import Fernet
        # In production, retrieve key from secrets manager
        self.key = self._get_encryption_key()
        self.cipher = Fernet(self.key)

    def encrypt_pii(self, data):
        """Encrypt personal data before storage."""
        if isinstance(data, str):
            data = data.encode()
        return self.cipher.encrypt(data)

    def decrypt_pii(self, encrypted_data):
        """Decrypt personal data for authorized access."""
        decrypted = self.cipher.decrypt(encrypted_data)
        return decrypted.decode()

    def _get_encryption_key(self):
        """Get encryption key from secure storage."""
        # In production: use AWS KMS, Azure Key Vault, etc.
        from secrets_manager import get_secret
        return get_secret('gdpr/encryption-key')
```

#### 2. Access Controls

```python
# Implement role-based access control for personal data
class GDPRAccessControl:
    """
    Control access to personal data based on roles and purposes.

    Requirements:
    - Access only for legitimate purposes
    - Log all access to personal data
    - Implement principle of least privilege
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def check_access(self, user_id, requester_id, purpose):
        """
        Check if requester can access user's personal data.

        Args:
            user_id: ID of data subject
            requester_id: ID of person requesting access
            purpose: Business purpose for access

        Returns:
            bool: Access granted or denied
        """
        # Self-access always allowed
        if user_id == requester_id:
            self._log_access(requester_id, user_id, purpose, granted=True, reason="self-access")
            return True

        # Check requester's role and purpose
        requester_role = self._get_role(requester_id)
        valid_purposes = self._get_valid_purposes(requester_role)

        if purpose not in valid_purposes:
            self._log_access(requester_id, user_id, purpose, granted=False, reason="invalid purpose")
            return False

        # Check if user has consented to this purpose (if consent-based)
        if self._requires_consent(purpose):
            has_consent = self._check_consent(user_id, purpose)
            if not has_consent:
                self._log_access(requester_id, user_id, purpose, granted=False, reason="no consent")
                return False

        self._log_access(requester_id, user_id, purpose, granted=True, reason="authorized")
        return True

    def _log_access(self, requester_id, user_id, purpose, granted, reason):
        """
        Log all access attempts to personal data.

        Required for GDPR accountability.
        """
        self.logger.info(
            "Personal data access attempt",
            extra={
                'requester_id': requester_id,
                'data_subject_id': user_id,
                'purpose': purpose,
                'granted': granted,
                'reason': reason,
                'timestamp': datetime.utcnow().isoformat(),
                'ip_address': self._get_client_ip()
            }
        )
```

#### 3. Consent Management

```python
# Track and manage user consent
class GDPRConsentManager:
    """
    Manage user consent for data processing.

    Requirements:
    - Freely given, specific, informed, unambiguous
    - Separate consent for different purposes
    - Easy to withdraw
    - Record when and how consent was given
    """

    def __init__(self, db_connection):
        self.db = db_connection

    def request_consent(self, user_id, purpose, description):
        """
        Request consent from user for specific purpose.

        Args:
            user_id: User identifier
            purpose: Processing purpose (e.g., 'marketing', 'analytics')
            description: Clear description of what will be done

        Returns:
            consent_id: Unique identifier for consent request
        """
        consent_id = str(uuid.uuid4())

        consent_record = {
            'consent_id': consent_id,
            'user_id': user_id,
            'purpose': purpose,
            'description': description,
            'requested_at': datetime.utcnow(),
            'status': 'pending'
        }

        self.db.insert('consent_records', consent_record)

        return consent_id

    def record_consent(self, consent_id, user_id, granted, consent_method):
        """
        Record user's consent decision.

        Args:
            consent_id: Consent request identifier
            user_id: User identifier
            granted: True if consent given, False if denied
            consent_method: How consent was given (e.g., 'checkbox', 'button', 'form')
        """
        consent_record = {
            'consent_id': consent_id,
            'user_id': user_id,
            'granted': granted,
            'consent_method': consent_method,
            'granted_at': datetime.utcnow(),
            'ip_address': self._get_client_ip(),
            'user_agent': self._get_user_agent(),
            'status': 'active' if granted else 'denied'
        }

        self.db.update('consent_records', {'consent_id': consent_id}, consent_record)

        # Log for audit trail
        logging.info(
            "Consent recorded",
            extra={
                'consent_id': consent_id,
                'user_id': user_id,
                'granted': granted,
                'purpose': self._get_consent_purpose(consent_id)
            }
        )

    def withdraw_consent(self, user_id, purpose):
        """
        Allow user to withdraw consent.

        Must stop processing immediately upon withdrawal.
        """
        self.db.update(
            'consent_records',
            {'user_id': user_id, 'purpose': purpose, 'status': 'active'},
            {
                'status': 'withdrawn',
                'withdrawn_at': datetime.utcnow()
            }
        )

        # Trigger processing stoppage
        self._stop_processing(user_id, purpose)

        logging.info(f"Consent withdrawn: user={user_id}, purpose={purpose}")

    def check_consent(self, user_id, purpose):
        """Check if user has given consent for purpose."""
        result = self.db.query(
            'consent_records',
            {
                'user_id': user_id,
                'purpose': purpose,
                'status': 'active',
                'granted': True
            }
        )

        return len(result) > 0
```

#### 4. Data Breach Notification

```python
# Implement breach notification system
class GDPRBreachNotification:
    """
    Handle data breach notification requirements.

    Requirements:
    - Notify supervisory authority within 72 hours
    - Notify affected individuals without undue delay
    - Document all breaches (even if not reported)
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def report_breach(self, breach_details):
        """
        Report a personal data breach.

        Args:
            breach_details: dict with:
                - nature: Description of breach
                - affected_users: List of user IDs
                - data_categories: Types of data exposed
                - likely_consequences: Risk assessment
                - measures_taken: Remediation actions
        """
        breach_id = str(uuid.uuid4())

        # Document breach
        breach_record = {
            'breach_id': breach_id,
            'discovered_at': datetime.utcnow(),
            'nature': breach_details['nature'],
            'affected_count': len(breach_details['affected_users']),
            'data_categories': breach_details['data_categories'],
            'likely_consequences': breach_details['likely_consequences'],
            'measures_taken': breach_details['measures_taken'],
            'status': 'under_investigation'
        }

        self._log_breach(breach_record)

        # Assess if notification required
        notification_required = self._assess_breach_severity(breach_details)

        if notification_required['authority']:
            self._notify_supervisory_authority(breach_record)

        if notification_required['individuals']:
            self._notify_affected_individuals(breach_details['affected_users'], breach_record)

        return breach_id

    def _assess_breach_severity(self, breach_details):
        """
        Assess if breach notification is required.

        Notify authority if:
        - Risk to rights and freedoms of individuals
        - Not encrypted/pseudonymized
        - Affects sensitive data

        Notify individuals if:
        - High risk to rights and freedoms
        - Cannot rely on mitigation measures
        """
        risk_level = 'low'

        # Check data sensitivity
        sensitive_categories = ['health', 'financial', 'biometric', 'genetic', 'racial']
        if any(cat in breach_details['data_categories'] for cat in sensitive_categories):
            risk_level = 'high'

        # Check if encrypted
        if not breach_details.get('encrypted', False):
            if risk_level == 'low':
                risk_level = 'medium'

        # Check scale
        if len(breach_details['affected_users']) > 1000:
            if risk_level != 'high':
                risk_level = 'medium'

        return {
            'authority': risk_level in ['medium', 'high'],
            'individuals': risk_level == 'high',
            'risk_level': risk_level
        }

    def _notify_supervisory_authority(self, breach_record):
        """
        Notify supervisory authority within 72 hours.

        Must include:
        - Nature of breach
        - Categories and number of data subjects affected
        - Likely consequences
        - Measures taken or proposed
        """
        notification = {
            'to': 'supervisory_authority@dpa.eu',
            'subject': f"Data Breach Notification - {breach_record['breach_id']}",
            'body': self._create_authority_notification(breach_record),
            'sent_at': datetime.utcnow()
        }

        # Send notification
        self._send_email(notification)

        # Log notification
        self.logger.critical(
            "Supervisory authority notified of data breach",
            extra={
                'breach_id': breach_record['breach_id'],
                'affected_count': breach_record['affected_count']
            }
        )

    def _notify_affected_individuals(self, user_ids, breach_record):
        """
        Notify affected individuals without undue delay.

        Must be in clear and plain language.
        Must describe nature of breach and recommended actions.
        """
        for user_id in user_ids:
            user_email = self._get_user_email(user_id)

            notification = {
                'to': user_email,
                'subject': 'Important Security Notice: Data Breach',
                'body': self._create_individual_notification(breach_record),
                'sent_at': datetime.utcnow()
            }

            self._send_email(notification)

        self.logger.critical(
            "Affected individuals notified of data breach",
            extra={
                'breach_id': breach_record['breach_id'],
                'notification_count': len(user_ids)
            }
        )
```

### GDPR Compliance Checklist

#### Initial Setup
- [ ] Appoint Data Protection Officer (if required)
- [ ] Map all personal data flows (what, where, why)
- [ ] Document legal basis for each processing activity
- [ ] Create Records of Processing Activities (ROPA)
- [ ] Review and update privacy policy
- [ ] Implement cookie consent management
- [ ] Set up data subject rights request process

#### Technical Controls
- [ ] Encrypt personal data at rest (AES-256)
- [ ] Use TLS 1.2+ for data in transit
- [ ] Implement access controls and authentication
- [ ] Enable audit logging for personal data access
- [ ] Implement data minimization in collection forms
- [ ] Set up data retention and deletion schedules
- [ ] Anonymize or pseudonymize data where possible

#### Consent Management
- [ ] Implement granular consent options
- [ ] Record consent with timestamp and method
- [ ] Make consent withdrawal easy and accessible
- [ ] Refresh consent periodically (every 2 years)
- [ ] Separate consent from terms of service

#### Data Subject Rights
- [ ] Create process for access requests (30-day SLA)
- [ ] Implement data portability export (JSON/CSV)
- [ ] Create secure erasure process ("right to be forgotten")
- [ ] Enable data rectification mechanism
- [ ] Implement processing restriction capability

#### Breach Response
- [ ] Create breach detection monitoring
- [ ] Document breach notification procedures
- [ ] Establish 72-hour notification timeline
- [ ] Prepare notification templates
- [ ] Conduct breach response drills

#### Vendor Management
- [ ] Review Data Processing Agreements (DPAs) with all vendors
- [ ] Ensure Standard Contractual Clauses (SCCs) for non-EU vendors
- [ ] Verify vendor compliance certifications
- [ ] Conduct vendor security assessments

#### Training and Awareness
- [ ] Train all staff on GDPR requirements
- [ ] Conduct annual refresher training
- [ ] Maintain training records
- [ ] Create incident reporting procedures

## HIPAA (Health Insurance Portability and Accountability Act)

### What is HIPAA?

**HIPAA** is a US federal law protecting sensitive patient health information. It applies to healthcare providers, health plans, healthcare clearinghouses, and their business associates.

**Plain English**: If you handle medical records or patient health information in the US, you must comply with HIPAA.

### Who Must Comply?

**Covered Entities**:
- Healthcare providers (doctors, hospitals, clinics, pharmacies)
- Health plans (insurance companies, HMOs, Medicare/Medicaid)
- Healthcare clearinghouses (billing services, claims processors)

**Business Associates**:
- Anyone who handles PHI on behalf of covered entities
- Examples: IT providers, cloud storage, medical billing companies, transcription services

### What is Protected Health Information (PHI)?

PHI is any health information that can identify an individual:

- Name, address, phone, email
- Medical record numbers
- Health insurance information
- Dates (birth, admission, discharge, death)
- Diagnosis and treatment information
- Test results
- Prescription information
- Photos of patients
- IP addresses when linked to health information

### HIPAA Rules

#### 1. Privacy Rule

Protects the privacy of PHI and gives patients rights over their health information.

**Key requirements**:
- Minimum necessary: Only access PHI needed for the task
- Patient rights: Access, amendment, accounting of disclosures
- Notice of privacy practices
- Consent for uses beyond treatment, payment, operations

#### 2. Security Rule

Establishes safeguards for electronic PHI (ePHI).

**Three types of safeguards**:

1. **Administrative Safeguards**
   - Security management process
   - Assigned security responsibility
   - Workforce training
   - Access management
   - Security incident procedures

2. **Physical Safeguards**
   - Facility access controls
   - Workstation use and security
   - Device and media controls

3. **Technical Safeguards**
   - Access control (unique user IDs, encryption)
   - Audit controls (logging)
   - Integrity controls (detect modifications)
   - Transmission security (encryption)

#### 3. Breach Notification Rule

Requires notification of breaches of unsecured PHI.

**Timeline**:
- Notify individuals: Within 60 days of discovery
- Notify HHS: Within 60 days (breaches affecting 500+ individuals)
- Notify media: If breach affects 500+ individuals in a jurisdiction

### Technical Implementation

#### 1. Access Control

```python
class HIPAAAccessControl:
    """
    Implement HIPAA-compliant access controls for ePHI.

    Requirements:
    - Unique user identification
    - Emergency access procedure
    - Automatic logoff
    - Encryption and decryption
    """

    def __init__(self, db_connection):
        self.db = db_connection
        self.logger = logging.getLogger(__name__)

    def authenticate_user(self, username, password, mfa_token):
        """
        Authenticate user with MFA.

        HIPAA requires strong authentication for ePHI access.
        """
        # Verify credentials
        user = self._verify_credentials(username, password)
        if not user:
            self._log_failed_auth(username, reason="invalid_credentials")
            return None

        # Verify MFA
        if not self._verify_mfa(user['user_id'], mfa_token):
            self._log_failed_auth(username, reason="invalid_mfa")
            return None

        # Create session with auto-logoff
        session = self._create_session(
            user_id=user['user_id'],
            timeout_minutes=15  # HIPAA recommends auto-logoff
        )

        self._log_successful_auth(user['user_id'])

        return session

    def authorize_phi_access(self, user_id, patient_id, purpose):
        """
        Authorize access to patient's PHI.

        HIPAA Requirements:
        - Minimum necessary access
        - Role-based access control
        - Purpose-based authorization
        - Emergency access procedures
        """
        user_role = self._get_user_role(user_id)

        # Check if user has treating relationship with patient
        if self._has_treating_relationship(user_id, patient_id):
            access_granted = True
            reason = "treating_provider"
        # Check if user role allows access for this purpose
        elif self._check_role_purpose_access(user_role, purpose):
            access_granted = True
            reason = "authorized_role"
        # Check emergency access (break-the-glass)
        elif purpose == "emergency":
            access_granted = True
            reason = "emergency_access"
            self._alert_security_emergency_access(user_id, patient_id)
        else:
            access_granted = False
            reason = "unauthorized"

        # Log all access attempts (HIPAA audit requirement)
        self._log_phi_access_attempt(
            user_id=user_id,
            patient_id=patient_id,
            purpose=purpose,
            granted=access_granted,
            reason=reason
        )

        return access_granted

    def _log_phi_access_attempt(self, user_id, patient_id, purpose, granted, reason):
        """
        Log PHI access for HIPAA audit trail.

        Must log:
        - Who accessed
        - What was accessed
        - When
        - Whether access was granted
        """
        self.logger.info(
            "PHI access attempt",
            extra={
                'user_id': user_id,
                'patient_id': patient_id,
                'purpose': purpose,
                'granted': granted,
                'reason': reason,
                'timestamp': datetime.utcnow().isoformat(),
                'ip_address': self._get_client_ip(),
                'workstation_id': self._get_workstation_id()
            }
        )

        # Store in audit database (HIPAA requires 6-year retention)
        self.db.insert('audit_log', {
            'user_id': user_id,
            'patient_id': patient_id,
            'action': 'access_attempt',
            'purpose': purpose,
            'granted': granted,
            'reason': reason,
            'timestamp': datetime.utcnow(),
            'ip_address': self._get_client_ip(),
            'workstation_id': self._get_workstation_id()
        })
```

#### 2. Encryption

```python
class HIPAAEncryption:
    """
    Implement HIPAA-compliant encryption for ePHI.

    Requirements:
    - Encryption at rest (AES-256)
    - Encryption in transit (TLS 1.2+)
    - Key management
    """

    def __init__(self):
        from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
        from cryptography.hazmat.backends import default_backend
        self.backend = default_backend()

    def encrypt_ephi(self, data, key):
        """
        Encrypt electronic PHI with AES-256.

        HIPAA requires encryption of ePHI at rest.
        """
        from cryptography.hazmat.primitives import padding
        import os

        # Generate random IV
        iv = os.urandom(16)

        # Pad data
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(data.encode()) + padder.finalize()

        # Encrypt
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=self.backend
        )
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()

        # Return IV + ciphertext
        return iv + ciphertext

    def decrypt_ephi(self, encrypted_data, key):
        """Decrypt ePHI for authorized access."""
        from cryptography.hazmat.primitives import padding

        # Extract IV and ciphertext
        iv = encrypted_data[:16]
        ciphertext = encrypted_data[16:]

        # Decrypt
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=self.backend
        )
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(ciphertext) + decryptor.finalize()

        # Unpad
        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(padded_data) + unpadder.finalize()

        return data.decode()
```

#### 3. Audit Logging

```python
class HIPAAAuditLog:
    """
    Implement HIPAA-compliant audit logging.

    Requirements:
    - Log all ePHI access
    - Retain logs for 6 years
    - Protect log integrity
    - Regular log reviews
    """

    def __init__(self, db_connection):
        self.db = db_connection
        self.logger = logging.getLogger(__name__)

    def log_phi_access(self, event_type, user_id, patient_id, action, success):
        """
        Log PHI access event.

        Required audit log elements:
        - Event date and time
        - Event type
        - User identification
        - Patient identification
        - Action performed
        - Outcome (success/failure)
        """
        audit_record = {
            'event_id': str(uuid.uuid4()),
            'event_type': event_type,
            'event_timestamp': datetime.utcnow(),
            'user_id': user_id,
            'user_name': self._get_user_name(user_id),
            'user_role': self._get_user_role(user_id),
            'patient_id': patient_id,
            'action': action,
            'success': success,
            'ip_address': self._get_client_ip(),
            'workstation_id': self._get_workstation_id(),
            'application': 'EHR System'
        }

        # Store in tamper-proof audit database
        self.db.insert('hipaa_audit_log', audit_record)

        # Also log to SIEM for monitoring
        self.logger.info(
            f"HIPAA audit event: {event_type}",
            extra=audit_record
        )

        return audit_record['event_id']

    def generate_audit_report(self, start_date, end_date, patient_id=None):
        """
        Generate audit report for patient or time period.

        HIPAA requires accounting of disclosures upon patient request.
        """
        query = {
            'event_timestamp': {
                '$gte': start_date,
                '$lte': end_date
            }
        }

        if patient_id:
            query['patient_id'] = patient_id

        audit_records = self.db.query('hipaa_audit_log', query)

        report = {
            'report_generated': datetime.utcnow(),
            'period': {
                'start': start_date,
                'end': end_date
            },
            'patient_id': patient_id,
            'total_events': len(audit_records),
            'events_by_type': self._group_by_event_type(audit_records),
            'events': audit_records
        }

        return report
```

### HIPAA Compliance Checklist

#### Administrative Safeguards
- [ ] Designate HIPAA Security Officer
- [ ] Conduct risk analysis
- [ ] Implement risk management plan
- [ ] Develop security policies and procedures
- [ ] Provide workforce security training
- [ ] Implement sanctions policy for violations
- [ ] Establish incident response procedures
- [ ] Create business associate agreements (BAAs)

#### Physical Safeguards
- [ ] Implement facility access controls
- [ ] Maintain facility security plan
- [ ] Control workstation access
- [ ] Implement device and media controls
- [ ] Establish media disposal procedures
- [ ] Control physical access to servers

#### Technical Safeguards
- [ ] Implement unique user IDs
- [ ] Enable automatic logoff (15 minutes)
- [ ] Use encryption for ePHI at rest (AES-256)
- [ ] Use encryption in transit (TLS 1.2+)
- [ ] Implement audit logging
- [ ] Enable integrity controls
- [ ] Implement access controls (role-based)

#### Breach Notification
- [ ] Create breach detection monitoring
- [ ] Establish breach assessment procedures
- [ ] Prepare notification templates
- [ ] Document 60-day notification timeline
- [ ] Create breach log

#### Business Associate Management
- [ ] Identify all business associates
- [ ] Execute BAAs with all vendors handling PHI
- [ ] Conduct vendor security assessments
- [ ] Monitor business associate compliance

## PCI-DSS (Payment Card Industry Data Security Standard)

### What is PCI-DSS?

**PCI-DSS** is a set of security standards designed to ensure that all companies that accept, process, store, or transmit credit card information maintain a secure environment.

**Plain English**: If you handle credit card data, you must comply with PCI-DSS.

### Who Must Comply?

Any organization that:
- Accepts credit/debit cards as payment
- Stores credit card data
- Processes credit card transactions
- Transmits credit card data

**Compliance levels** (based on annual transaction volume):

| Level | Transactions/Year | Validation Requirements |
|-------|-------------------|------------------------|
| 1 | 6M+ | Annual on-site audit + quarterly network scans |
| 2 | 1M - 6M | Annual self-assessment + quarterly network scans |
| 3 | 20K - 1M (e-commerce) | Annual self-assessment + quarterly network scans |
| 4 | <20K (e-commerce) or <1M (other) | Annual self-assessment + quarterly network scans |

### The 12 PCI-DSS Requirements

```
┌─────────────────────────────────────────────────┐
│       Build and Maintain Secure Network         │
│  1. Install and maintain firewall configuration │
│  2. Don't use vendor defaults for security      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│          Protect Cardholder Data                │
│  3. Protect stored cardholder data              │
│  4. Encrypt transmission over public networks   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│    Maintain Vulnerability Management Program    │
│  5. Protect against malware                     │
│  6. Develop secure systems and applications     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│   Implement Strong Access Control Measures      │
│  7. Restrict access to cardholder data          │
│  8. Assign unique ID to each person             │
│  9. Restrict physical access                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│      Regularly Monitor and Test Networks        │
│  10. Track and monitor network access           │
│  11. Regularly test security systems            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│    Maintain Information Security Policy         │
│  12. Maintain policy addressing info security   │
└─────────────────────────────────────────────────┘
```

### What Data Must Be Protected?

**Cardholder Data (must protect)**:
- Primary Account Number (PAN) - the 16-digit card number
- Cardholder name
- Expiration date
- Service code

**Sensitive Authentication Data (NEVER store after authorization)**:
- Full magnetic stripe data
- CAV2/CVC2/CVV2/CID (3-digit security code)
- PINs/PIN blocks

### Best Practice: Don't Store Card Data

```python
# ❌ BAD: Storing card data yourself
def process_payment_bad(card_number, cvv, expiry):
    """
    DON'T DO THIS: Storing card data makes you PCI-DSS compliant.
    This requires expensive audits and security controls.
    """
    # Store card (NEVER DO THIS)
    db.insert('customer_cards', {
        'card_number': card_number,  # PCI scope
        'cvv': cvv,  # NEVER STORE THIS
        'expiry': expiry
    })

# ✅ GOOD: Use payment processor (Stripe, PayPal, etc.)
def process_payment_good(payment_token):
    """
    Use tokenization to avoid storing card data.
    Payment processor handles PCI-DSS compliance.
    """
    import stripe

    # Token contains no real card data
    # Can be stored safely
    charge = stripe.Charge.create(
        amount=1000,
        currency='usd',
        source=payment_token,  # Token, not real card data
        description='Product purchase'
    )

    # Store only the token (not in PCI scope)
    db.insert('transactions', {
        'charge_id': charge.id,
        'amount': 1000,
        'status': 'completed'
    })

    return charge
```

### Tokenization

```python
class PCITokenization:
    """
    Use tokenization to reduce PCI-DSS scope.

    How it works:
    1. Customer enters card data on payment processor's form (not your server)
    2. Payment processor returns a token
    3. You store and use the token (not real card data)
    4. To charge: send token to payment processor

    Benefits:
    - Card data never touches your servers
    - Dramatically reduces PCI-DSS scope
    - Lower compliance costs
    """

    def __init__(self, stripe_api_key):
        import stripe
        stripe.api_key = stripe_api_key
        self.stripe = stripe

    def create_payment_intent(self, amount, currency='usd'):
        """
        Create payment intent for Stripe Elements.

        Front-end collects card data directly to Stripe.
        Your server never sees card data.
        """
        intent = self.stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            automatic_payment_methods={'enabled': True}
        )

        # Return client secret to front-end
        # Front-end uses this to complete payment
        return {
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        }

    def save_payment_method(self, customer_id, payment_method_id):
        """
        Save tokenized payment method for future use.

        payment_method_id is a token, not real card data.
        Safe to store.
        """
        # Attach payment method to customer
        self.stripe.PaymentMethod.attach(
            payment_method_id,
            customer=customer_id
        )

        # Store token in your database (not in PCI scope)
        db.insert('customer_payment_methods', {
            'customer_id': customer_id,
            'payment_method_id': payment_method_id,  # Token, safe to store
            'created_at': datetime.utcnow()
        })

    def charge_saved_card(self, customer_id, amount):
        """
        Charge a saved card using its token.

        No card data involved - just tokens.
        """
        # Get saved payment method token
        payment_method = db.query_one('customer_payment_methods', {
            'customer_id': customer_id
        })

        # Charge using token
        payment_intent = self.stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            customer=customer_id,
            payment_method=payment_method['payment_method_id'],
            confirm=True
        )

        return payment_intent
```

### If You Must Store Card Data

```python
class PCICompliantStorage:
    """
    PCI-DSS compliant card data storage.

    ⚠️ WARNING: Only do this if absolutely necessary.
    Requires expensive audits and security controls.

    Requirements:
    - Encrypt PAN with strong cryptography (AES-256)
    - Truncate/mask PAN for display (show last 4 digits only)
    - Hash PAN if used for searching
    - Never store CVV, full magnetic stripe, or PIN
    - Implement strong access controls
    - Log all access to cardholder data
    """

    def __init__(self):
        from cryptography.fernet import Fernet
        # In production: use Hardware Security Module (HSM)
        self.encryption_key = self._get_encryption_key_from_hsm()
        self.cipher = Fernet(self.encryption_key)

    def store_card_data(self, pan, expiry, cardholder_name):
        """
        Store card data with PCI-DSS controls.

        NEVER store:
        - CVV/CVC
        - Full magnetic stripe
        - PIN
        """
        # Encrypt PAN
        encrypted_pan = self.cipher.encrypt(pan.encode())

        # Hash PAN for indexing (one-way)
        pan_hash = hashlib.sha256(pan.encode()).hexdigest()

        # Truncate for display
        truncated_pan = self._truncate_pan(pan)

        # Store
        card_record = {
            'pan_hash': pan_hash,  # For lookup
            'encrypted_pan': encrypted_pan,  # Encrypted full PAN
            'truncated_pan': truncated_pan,  # For display only
            'expiry': expiry,
            'cardholder_name': cardholder_name,
            'created_at': datetime.utcnow()
        }

        db.insert('cardholder_data', card_record)

        # Log access (PCI requirement)
        self._log_cardholder_data_access('store', pan_hash)

        return card_record

    def retrieve_card_data(self, pan_hash, user_id, purpose):
        """
        Retrieve card data with access control and logging.

        PCI Requirements:
        - Need-to-know basis only
        - Log all access
        - Verify authorization
        """
        # Check authorization
        if not self._authorize_access(user_id, purpose):
            self._log_unauthorized_access_attempt(user_id, pan_hash)
            raise PermissionError("Unauthorized access to cardholder data")

        # Retrieve encrypted data
        record = db.query_one('cardholder_data', {'pan_hash': pan_hash})

        # Decrypt PAN
        decrypted_pan = self.cipher.decrypt(record['encrypted_pan']).decode()

        # Log access (PCI requirement)
        self._log_cardholder_data_access('retrieve', pan_hash, user_id, purpose)

        return {
            'pan': decrypted_pan,
            'expiry': record['expiry'],
            'cardholder_name': record['cardholder_name']
        }

    def _truncate_pan(self, pan):
        """
        Truncate PAN for display.

        PCI allows:
        - First 6 and last 4 digits
        - Or first 4 and last 4 digits
        - Or just last 4 digits (most common)
        """
        return f"****{pan[-4:]}"

    def _log_cardholder_data_access(self, action, pan_hash, user_id=None, purpose=None):
        """
        Log all access to cardholder data.

        PCI Requirement 10: Track and monitor all access.
        """
        logging.info(
            "Cardholder data access",
            extra={
                'action': action,
                'pan_hash': pan_hash,
                'user_id': user_id,
                'purpose': purpose,
                'timestamp': datetime.utcnow().isoformat(),
                'ip_address': self._get_client_ip()
            }
        )
```

### PCI-DSS Compliance Checklist

#### Requirement 1: Firewall Configuration
- [ ] Install firewall at network perimeter
- [ ] Configure firewall rules (deny all, allow by exception)
- [ ] Prohibit direct public access to cardholder data
- [ ] Restrict inbound/outbound traffic to necessary only
- [ ] Document and review firewall rules semi-annually

#### Requirement 2: Secure Configurations
- [ ] Change all vendor-supplied defaults (passwords, SNMP strings)
- [ ] Develop configuration standards for all system components
- [ ] Encrypt non-console administrative access
- [ ] Document all security parameters
- [ ] Remove unnecessary services, protocols, daemons

#### Requirement 3: Protect Stored Data
- [ ] Minimize cardholder data storage (only store if necessary)
- [ ] Never store sensitive authentication data (CVV, full magnetic stripe, PIN)
- [ ] Mask PAN when displayed (show last 4 digits only)
- [ ] Encrypt PAN wherever stored (AES-256 or stronger)
- [ ] Document and implement key management procedures

#### Requirement 4: Encrypt Transmissions
- [ ] Use strong cryptography for transmission over public networks (TLS 1.2+)
- [ ] Never send unencrypted PANs via end-user messaging (email, chat)
- [ ] Implement proper certificate validation
- [ ] Use only trusted keys and certificates

#### Requirement 5: Anti-Malware
- [ ] Deploy anti-virus software on all systems
- [ ] Keep anti-virus up to date
- [ ] Enable automatic updates
- [ ] Generate and review anti-virus logs

#### Requirement 6: Secure Systems
- [ ] Establish process for identifying security vulnerabilities
- [ ] Install critical security patches within one month
- [ ] Develop applications based on secure coding guidelines
- [ ] Review custom code for vulnerabilities
- [ ] Implement change control procedures

#### Requirement 7: Restrict Access
- [ ] Limit access to cardholder data to need-to-know basis
- [ ] Implement role-based access control (RBAC)
- [ ] Default deny all access
- [ ] Document and review access permissions semi-annually

#### Requirement 8: Unique IDs
- [ ] Assign unique ID to each user
- [ ] Implement multi-factor authentication for remote access
- [ ] Use strong passwords (min 8 characters, complexity requirements)
- [ ] Change passwords every 90 days
- [ ] Lock accounts after 6 failed login attempts

#### Requirement 9: Physical Access
- [ ] Implement physical security controls for facilities
- [ ] Use video cameras and access control mechanisms
- [ ] Physically secure all media
- [ ] Destroy media before disposal
- [ ] Maintain visitor log for 3 months

#### Requirement 10: Logging and Monitoring
- [ ] Log all access to cardholder data
- [ ] Log all actions by privileged users
- [ ] Synchronize all system clocks (NTP)
- [ ] Retain audit logs for at least one year
- [ ] Review logs daily
- [ ] Implement automated log monitoring

#### Requirement 11: Security Testing
- [ ] Conduct quarterly network vulnerability scans (by ASV)
- [ ] Conduct quarterly internal vulnerability scans
- [ ] Perform penetration testing annually
- [ ] Implement intrusion detection/prevention systems
- [ ] Deploy file integrity monitoring

#### Requirement 12: Security Policy
- [ ] Establish and publish security policy
- [ ] Conduct annual risk assessment
- [ ] Develop usage policies for critical technologies
- [ ] Implement security awareness program
- [ ] Implement incident response plan
- [ ] Review policy annually

## SOC 2 (Service Organization Control 2)

### What is SOC 2?

**SOC 2** is an auditing standard for service providers that store customer data in the cloud. It focuses on how organizations manage and protect customer data based on five "Trust Service Criteria."

**Plain English**: If you're a B2B SaaS company, your customers will likely require SOC 2 compliance before doing business with you.

### Who Needs SOC 2?

- SaaS companies
- Cloud service providers
- Data centers
- Any company that stores customer data in the cloud

### SOC 2 Type I vs Type II

| Aspect | Type I | Type II |
|--------|--------|---------|
| **What it proves** | Controls are properly designed at a point in time | Controls operate effectively over time (usually 6-12 months) |
| **Audit duration** | 1-2 weeks | 6-12 months of monitoring |
| **Value to customers** | Lower | Higher (shows sustained compliance) |
| **Cost** | $15,000 - $50,000 | $30,000 - $100,000+ |
| **When to get** | Early stage, first compliance effort | Growth stage, customer requirement |

### The Five Trust Service Criteria

#### 1. Security

The system is protected against unauthorized access (both physical and logical).

**Controls include**:
- Access management (MFA, RBAC)
- Network security (firewalls, IDS/IPS)
- Encryption (data at rest and in transit)
- Vulnerability management
- Incident response

```python
# Example security controls for SOC 2
class SOC2SecurityControls:
    """
    Implement SOC 2 security controls.

    CC6.1: The entity implements logical access controls to protect
    information from unauthorized access.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def enforce_mfa(self, user_id):
        """
        Require multi-factor authentication for all users.

        SOC 2 CC6.1: Logical access security
        """
        # Check if MFA is enabled
        mfa_enabled = self._check_mfa_status(user_id)

        if not mfa_enabled:
            self.logger.warning(
                "User attempted login without MFA enabled",
                extra={'user_id': user_id}
            )
            raise ValueError("MFA required for all users")

        # Verify MFA token
        mfa_token = self._prompt_for_mfa()
        if not self._verify_mfa_token(user_id, mfa_token):
            self.logger.warning(
                "Invalid MFA token",
                extra={'user_id': user_id}
            )
            raise ValueError("Invalid MFA token")

        self.logger.info(
            "MFA verification successful",
            extra={'user_id': user_id}
        )

    def implement_rbac(self, user_id, resource, action):
        """
        Role-Based Access Control.

        SOC 2 CC6.2: Prior to issuing system credentials, the entity
        registers and authorizes new users.
        """
        user_role = self._get_user_role(user_id)
        required_permission = f"{resource}:{action}"

        # Check if role has permission
        if not self._role_has_permission(user_role, required_permission):
            self.logger.warning(
                "Access denied - insufficient permissions",
                extra={
                    'user_id': user_id,
                    'role': user_role,
                    'required_permission': required_permission
                }
            )
            return False

        self.logger.info(
            "Access granted",
            extra={
                'user_id': user_id,
                'role': user_role,
                'resource': resource,
                'action': action
            }
        )

        return True

    def enforce_password_policy(self, password):
        """
        Enforce strong password policy.

        SOC 2 CC6.1: Passwords must meet complexity requirements.
        """
        requirements = {
            'min_length': 12,
            'require_uppercase': True,
            'require_lowercase': True,
            'require_number': True,
            'require_special': True,
            'prevent_common': True
        }

        errors = []

        if len(password) < requirements['min_length']:
            errors.append(f"Password must be at least {requirements['min_length']} characters")

        if requirements['require_uppercase'] and not any(c.isupper() for c in password):
            errors.append("Password must contain uppercase letter")

        if requirements['require_lowercase'] and not any(c.islower() for c in password):
            errors.append("Password must contain lowercase letter")

        if requirements['require_number'] and not any(c.isdigit() for c in password):
            errors.append("Password must contain number")

        if requirements['require_special'] and not any(c in '!@#$%^&*' for c in password):
            errors.append("Password must contain special character")

        if errors:
            raise ValueError("; ".join(errors))

        return True
```

#### 2. Availability

The system is available for operation and use as committed or agreed.

**Controls include**:
- Uptime monitoring
- Redundancy and failover
- Disaster recovery
- Capacity planning
- Performance monitoring

```python
# Example availability controls
class SOC2AvailabilityControls:
    """
    Implement SOC 2 availability controls.

    A1.2: The entity maintains, monitors, and evaluates current processing
    capacity and use of system components.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def monitor_uptime(self):
        """
        Monitor system uptime and availability.

        SOC 2 A1.1: System availability commitments
        """
        # Check all critical services
        services = [
            'api_server',
            'database',
            'cache',
            'queue'
        ]

        availability_report = {}

        for service in services:
            status = self._check_service_health(service)
            availability_report[service] = status

            if not status['available']:
                self.logger.error(
                    f"Service unavailable: {service}",
                    extra={
                        'service': service,
                        'error': status['error'],
                        'downtime_start': status['down_since']
                    }
                )

                # Trigger incident response
                self._create_incident(service, status)

        return availability_report

    def implement_disaster_recovery(self):
        """
        Implement disaster recovery procedures.

        SOC 2 A1.3: The entity implements business continuity and disaster
        recovery procedures.
        """
        dr_plan = {
            'rpo': '1 hour',  # Recovery Point Objective
            'rto': '4 hours',  # Recovery Time Objective
            'backup_frequency': 'hourly',
            'backup_retention': '30 days',
            'failover_region': 'us-west-2'
        }

        # Test DR plan quarterly
        self._test_disaster_recovery_plan()

        return dr_plan
```

#### 3. Processing Integrity

System processing is complete, valid, accurate, timely, and authorized.

**Controls include**:
- Input validation
- Processing monitoring
- Error handling
- Reconciliation processes
- Output validation

#### 4. Confidentiality

Information designated as confidential is protected as committed or agreed.

**Controls include**:
- Data classification
- Encryption
- Access controls
- Confidentiality agreements
- Secure disposal

#### 5. Privacy

Personal information is collected, used, retained, disclosed, and disposed of in conformity with privacy commitments.

**Controls include**:
- Privacy notice
- Consent management
- Data subject rights
- Data retention and disposal
- Third-party management

### SOC 2 Compliance Checklist

#### Pre-Audit Preparation (3-6 months)
- [ ] Define scope of audit
- [ ] Select trust service criteria (Security is required, others optional)
- [ ] Conduct gap analysis
- [ ] Choose Type I or Type II
- [ ] Select auditor (CPA firm with SOC 2 experience)

#### Security Controls
- [ ] Implement MFA for all users
- [ ] Enable role-based access control
- [ ] Deploy intrusion detection/prevention
- [ ] Enable encryption at rest and in transit
- [ ] Implement vulnerability management program
- [ ] Create incident response plan
- [ ] Enable security monitoring and alerting

#### Access Management (CC6.x)
- [ ] Document user provisioning/deprovisioning procedures
- [ ] Review access permissions quarterly
- [ ] Implement least privilege principle
- [ ] Enable audit logging for all access
- [ ] Require background checks for employees

#### Change Management (CC8.x)
- [ ] Document change management procedures
- [ ] Require approval for production changes
- [ ] Test all changes before deployment
- [ ] Maintain change log
- [ ] Implement rollback procedures

#### Monitoring (CC7.x)
- [ ] Deploy log aggregation system (SIEM)
- [ ] Enable automated alerting
- [ ] Review logs regularly
- [ ] Monitor system performance
- [ ] Track security incidents

#### Risk Management (CC3.x)
- [ ] Conduct annual risk assessment
- [ ] Document identified risks and mitigations
- [ ] Review risk register quarterly
- [ ] Update risk treatment plans

#### Vendor Management (CC9.x)
- [ ] Maintain vendor inventory
- [ ] Review vendor security (SOC 2, certifications)
- [ ] Execute contracts with security requirements
- [ ] Monitor vendor compliance
- [ ] Conduct vendor risk assessments

#### Business Continuity (A1.x)
- [ ] Create disaster recovery plan
- [ ] Test DR plan annually
- [ ] Document backup procedures
- [ ] Test backup restoration quarterly
- [ ] Define RPO/RTO targets

#### Documentation
- [ ] Security policies and procedures
- [ ] Access control policies
- [ ] Incident response plan
- [ ] Business continuity plan
- [ ] Vendor management procedures
- [ ] Change management procedures
- [ ] Risk assessment documentation
- [ ] Employee training records

#### Evidence Collection (Type II only)
- [ ] Save logs continuously throughout audit period
- [ ] Document all security incidents
- [ ] Record all access reviews
- [ ] Track vulnerability scans and remediation
- [ ] Document all changes to production
- [ ] Save training completion records

## Quick Reference

### Compliance Comparison

| Aspect | GDPR | HIPAA | PCI-DSS | SOC 2 |
|--------|------|-------|---------|-------|
| **Geographic scope** | EU (extraterritorial) | US only | Global | Global |
| **Industry** | All (with EU customers) | Healthcare | Payment processing | B2B SaaS, cloud |
| **Data protected** | Personal data | Health information (PHI) | Credit card data | Customer data |
| **Penalties** | Up to 4% revenue | Up to $1.5M/year | $5K-$100K/month | Loss of customers |
| **Certification** | Self-declaration | Self-assessment or audit | Self-assessment or audit | External audit |
| **Audit frequency** | N/A | N/A | Annual | Annual (Type II: ongoing) |
| **Focus** | Privacy rights | Health data security | Card data security | Trust & security |

### Choosing What to Implement

```
Do you handle EU customer data?
├─ YES → Implement GDPR (mandatory)
└─ NO → Continue

Do you handle US patient health information?
├─ YES → Implement HIPAA (mandatory)
└─ NO → Continue

Do you process credit cards?
├─ YES → Implement PCI-DSS (mandatory)
│        └─ Use tokenization to reduce scope
└─ NO → Continue

Are you a B2B SaaS company?
├─ YES → Get SOC 2 (customer requirement)
│        └─ Start with Type I, then Type II
└─ NO → Continue

Do you handle financial data?
├─ YES → Consider SOX, GLBA, etc.
└─ NO → Continue
```

## Related Topics

- **[Secrets Management](../secrets-management/README.md)**: Protecting credentials and keys
- **[Encryption](../encryption/README.md)**: Protecting data at rest and in transit
- **[Identity and Access Management](../iam/README.md)**: User authentication and authorization
- **[Audit Logging](../../05-backend/observability/README.md)**: Tracking system activity
- **[Threat Modeling](../threat-modeling/README.md)**: Identifying security risks
- **[Incident Response](../incident-response/README.md)**: Handling security breaches
- **[Zero Trust Architecture](../../02-architectures/zero-trust/README.md)**: Never trust, always verify
- **[Cloud Security](../../07-cloud/security/README.md)**: AWS, Azure, GCP security

---

**Remember**: Compliance is not security, but it's a minimum foundation. Meeting compliance requirements doesn't guarantee you won't be breached - it just ensures you have basic security controls in place. Always go beyond compliance to implement defense-in-depth security.

Last Updated: 2026-02-19
