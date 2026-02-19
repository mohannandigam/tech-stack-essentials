# Threat Modeling

## What is it?

**Threat modeling** is a structured approach to identifying, analyzing, and mitigating security threats to your system before they become real problems. It's a proactive security practice where you think like an attacker to find vulnerabilities in your design, then fix them before writing code.

Think of it like a safety inspection before building a house. You identify potential hazards (fire risks, structural weaknesses, entry points for intruders) and design the house to address those risks upfront. It's much cheaper and easier to add fire exits to architectural plans than to retrofit them after construction.

## Simple Analogy

Imagine you're designing a bank vault:

**Without threat modeling**:
- Build the vault with a strong door
- Discover after opening that:
  - Ventilation duct is large enough to crawl through
  - Walls are reinforced but floor is standard concrete (can be tunneled)
  - Strong lock but key storage is in an unlocked drawer
  - No alarm system
  - No camera coverage of back entrance

**With threat modeling**:
- Before building, ask: "How would I break into this vault?"
  - Through the door? (Install multi-factor locks)
  - Through walls/ceiling/floor? (Reinforce all surfaces)
  - Through ventilation? (Make ducts too small, add sensors)
  - Social engineering guards? (Train staff, implement procedures)
  - Disable alarms? (Add redundant systems, tamper detection)
- Design vault to address all identified threats
- Build once, build right

Threat modeling is the "How would I break in?" process for software systems.

## Why does it matter?

### Security Benefits

**Proactive vs. Reactive**:
- Finding vulnerabilities in design: $0-$100 to fix
- Finding vulnerabilities in testing: $1,000-$10,000 to fix
- Finding vulnerabilities in production: $100,000+ to fix (plus breach costs)

**Real-world example**: A major retailer suffered a breach costing $18 million because network segmentation wasn't properly designed. Threat modeling during architecture phase would have identified this for ~$0 cost to fix in design.

### Development Benefits

- **Shared understanding**: Team alignment on security requirements
- **Better design**: Security built-in, not bolted-on
- **Risk prioritization**: Focus on high-risk areas first
- **Compliance**: Demonstrates due diligence for audits
- **Cost savings**: Cheaper to fix in design than production

### Business Benefits

- **Reduced breach risk**: Identify and fix vulnerabilities early
- **Faster time-to-market**: No major security rewrites later
- **Customer trust**: Demonstrate security-first approach
- **Regulatory compliance**: Meet requirements for secure development
- **Insurance**: May reduce cyber insurance premiums

### When to Threat Model

- **New features**: Before designing new functionality
- **Architecture changes**: When adding new services or integrations
- **Major releases**: Before significant version updates
- **After incidents**: To prevent similar issues
- **Regular reviews**: Annually or when threat landscape changes
- **Third-party integrations**: When connecting to external systems

## How it works

### Threat Modeling Process

```
┌──────────────────┐
│  1. Decompose    │  Understand the system
│     System       │  - What are we building?
│                  │  - How does it work?
│                  │  - What assets do we protect?
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  2. Identify     │  Find potential threats
│     Threats      │  - What can go wrong?
│                  │  - How can attackers abuse this?
│                  │  - Use STRIDE or other framework
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  3. Rank         │  Prioritize threats by risk
│     Risks        │  - Likelihood × Impact
│                  │  - Consider existing controls
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  4. Mitigate     │  Address identified threats
│     Threats      │  - Accept, Avoid, Transfer, Mitigate
│                  │  - Design countermeasures
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  5. Validate     │  Verify mitigations work
│                  │  - Test security controls
│                  │  - Penetration testing
│                  │  - Security review
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  6. Document     │  Record decisions
│                  │  - Threat model document
│                  │  - Accepted risks
│                  │  - Security requirements
└──────────────────┘
```

### Participants

**Who should be involved**:
- **Developers**: Understand implementation details
- **Architects**: Know system design
- **Security engineers**: Bring security expertise
- **Product managers**: Understand business requirements
- **DevOps**: Know deployment and infrastructure
- **QA**: Can help validate mitigations

**Time investment**:
- Small feature: 1-2 hours
- Medium project: 4-8 hours
- Large system: 2-3 days
- Enterprise architecture: 1-2 weeks

## Key Concepts

### **Threat**
A potential danger that could exploit a vulnerability to breach security. Example: "An attacker could steal the database backup containing customer data."

### **Vulnerability**
A weakness in the system that can be exploited. Example: "Database backups are stored unencrypted in an S3 bucket with public read access."

### **Attack**
The method used to exploit a vulnerability. Example: "Attacker discovers public S3 bucket URL and downloads backup files."

### **Asset**
Something of value that needs protection. Examples: customer data, intellectual property, system availability, reputation.

### **Trust Boundary**
A line where trust level changes and data flows across. Examples: user input entering your system, API calls to third-party services, data moving from public to private network.

### **Attack Surface**
All possible points where an attacker could enter or extract data from your system. Larger attack surface = more risk.

### **Threat Actor**
The person or entity that might attack your system. Examples: external hacker, malicious insider, nation-state, script kiddie, competitor.

### **Risk**
The combination of threat likelihood and impact. Risk = Likelihood × Impact.

### **Mitigation**
A countermeasure that reduces threat risk. Can reduce likelihood, reduce impact, or both.

## STRIDE Methodology

**STRIDE** is a threat modeling framework developed by Microsoft. It's a mnemonic for six threat categories:

### S - Spoofing Identity

**What is it**: Pretending to be someone or something else.

**Examples**:
- Attacker uses stolen credentials to log in as legitimate user
- Forged email appears to come from your CEO
- Man-in-the-middle attack impersonates your API
- DNS spoofing redirects users to fake website

**Mitigations**:
- Multi-factor authentication (MFA)
- Mutual TLS for service-to-service communication
- Digital signatures to verify authenticity
- Certificate pinning
- Email authentication (SPF, DKIM, DMARC)

```python
# Example: Mitigating spoofing with JWT authentication
import jwt
import datetime

class AuthenticationService:
    """
    Prevent spoofing by verifying user identity with signed tokens.

    Threat: Attacker tries to impersonate legitimate user
    Mitigation: Use signed JWTs that can't be forged
    """

    def __init__(self, secret_key):
        self.secret_key = secret_key

    def create_token(self, user_id, email):
        """
        Create signed token after successful authentication.

        Can't be forged without secret key.
        """
        payload = {
            'user_id': user_id,
            'email': email,
            'issued_at': datetime.datetime.utcnow().isoformat(),
            'expires_at': (datetime.datetime.utcnow() + datetime.timedelta(hours=1)).isoformat()
        }

        # Sign token - prevents forgery
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')

        logging.info(
            "Authentication token created",
            extra={
                'user_id': user_id,
                'expires_at': payload['expires_at']
            }
        )

        return token

    def verify_token(self, token):
        """
        Verify token signature and extract claims.

        Throws exception if token is forged or expired.
        """
        try:
            # Verify signature - catches forged tokens
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])

            # Check expiration
            expires_at = datetime.datetime.fromisoformat(payload['expires_at'])
            if datetime.datetime.utcnow() > expires_at:
                logging.warning(
                    "Expired token used",
                    extra={'user_id': payload.get('user_id')}
                )
                raise ValueError("Token expired")

            logging.info(
                "Token verified successfully",
                extra={'user_id': payload['user_id']}
            )

            return payload

        except jwt.InvalidSignatureError:
            logging.error("Invalid token signature - possible forgery attempt")
            raise ValueError("Invalid token")
        except jwt.DecodeError:
            logging.error("Token decode failed - malformed token")
            raise ValueError("Invalid token")
```

### T - Tampering with Data

**What is it**: Modifying data in unauthorized ways.

**Examples**:
- Attacker modifies price in shopping cart before checkout
- Database records changed by SQL injection
- Log files deleted to hide tracks
- Configuration files modified to create backdoor
- API request parameters modified in transit

**Mitigations**:
- Input validation and sanitization
- Parameterized queries (prevent SQL injection)
- Digital signatures for data integrity
- Integrity checks (checksums, hashes)
- Audit logging (detect tampering)
- Principle of least privilege (limit who can modify data)

```python
# Example: Preventing tampering with checksums
import hashlib
import json

class DataIntegrityService:
    """
    Prevent data tampering using checksums.

    Threat: Attacker modifies data in transit or storage
    Mitigation: Calculate and verify checksums
    """

    def create_signed_data(self, data, secret):
        """
        Create data with integrity checksum.

        Any modification will invalidate checksum.
        """
        # Serialize data
        data_json = json.dumps(data, sort_keys=True)

        # Calculate HMAC (keyed hash)
        signature = hmac.new(
            secret.encode(),
            data_json.encode(),
            hashlib.sha256
        ).hexdigest()

        # Return data with signature
        return {
            'data': data,
            'signature': signature
        }

    def verify_signed_data(self, signed_data, secret):
        """
        Verify data hasn't been tampered with.

        Raises exception if signature doesn't match.
        """
        data = signed_data['data']
        provided_signature = signed_data['signature']

        # Recalculate signature
        data_json = json.dumps(data, sort_keys=True)
        expected_signature = hmac.new(
            secret.encode(),
            data_json.encode(),
            hashlib.sha256
        ).hexdigest()

        # Compare signatures
        if not hmac.compare_digest(provided_signature, expected_signature):
            logging.error(
                "Data tampering detected - signature mismatch",
                extra={'data': data}
            )
            raise ValueError("Data integrity check failed")

        logging.info("Data integrity verified")
        return data

# Example: Preventing price tampering in e-commerce
class SecureShoppingCart:
    """
    Prevent price tampering in shopping cart.

    Threat: User modifies price in browser before checkout
    Mitigation: Never trust client-side prices, always verify server-side
    """

    def add_to_cart(self, cart_id, product_id, quantity, claimed_price):
        """
        Add item to cart with server-side price verification.

        Never trust prices from client.
        """
        # ✅ GOOD: Look up actual price from database
        actual_price = self._get_product_price(product_id)

        # Check if claimed price matches actual price
        if claimed_price != actual_price:
            logging.warning(
                "Price tampering attempt detected",
                extra={
                    'cart_id': cart_id,
                    'product_id': product_id,
                    'claimed_price': claimed_price,
                    'actual_price': actual_price
                }
            )
            # Use actual price, not claimed price

        # Add to cart with server-verified price
        self.db.insert('cart_items', {
            'cart_id': cart_id,
            'product_id': product_id,
            'quantity': quantity,
            'price': actual_price,  # Server-verified price
            'added_at': datetime.utcnow()
        })

        return actual_price
```

### R - Repudiation

**What is it**: Claiming you didn't do something when you actually did (or vice versa).

**Examples**:
- User claims they never made a purchase
- Employee denies accessing sensitive files
- Admin denies deleting records
- Transaction sender denies initiating transfer

**Mitigations**:
- Comprehensive audit logging
- Digital signatures (non-repudiation)
- Timestamps and log integrity
- Multi-party authorization
- Email receipts and confirmations
- Video recording of physical access

```python
# Example: Non-repudiation through audit logging
class AuditLogger:
    """
    Prevent repudiation with comprehensive audit logging.

    Threat: User claims they didn't perform an action
    Mitigation: Detailed, tamper-proof audit logs
    """

    def __init__(self, db_connection):
        self.db = db_connection

    def log_action(self, user_id, action, resource, details=None):
        """
        Log user action with full context.

        Audit log serves as proof of action.
        """
        audit_record = {
            'audit_id': str(uuid.uuid4()),
            'timestamp': datetime.utcnow(),
            'user_id': user_id,
            'username': self._get_username(user_id),
            'action': action,
            'resource': resource,
            'details': details,
            'ip_address': self._get_client_ip(),
            'user_agent': self._get_user_agent(),
            'session_id': self._get_session_id()
        }

        # Calculate signature for log integrity
        audit_record['signature'] = self._sign_record(audit_record)

        # Store in append-only audit log
        self.db.insert('audit_log', audit_record)

        # Also send to SIEM for external storage
        self._send_to_siem(audit_record)

        logging.info(
            "Action audited",
            extra=audit_record
        )

        return audit_record['audit_id']

    def verify_log_integrity(self, audit_id):
        """
        Verify audit log hasn't been tampered with.

        Detect if someone tries to modify or delete logs.
        """
        record = self.db.query_one('audit_log', {'audit_id': audit_id})

        # Recalculate signature
        expected_signature = self._sign_record(record)

        if record['signature'] != expected_signature:
            logging.critical(
                "Audit log tampering detected",
                extra={'audit_id': audit_id}
            )
            raise ValueError("Audit log integrity check failed")

        return True

# Example: Digital signatures for non-repudiation
class DigitalSignatureService:
    """
    Use digital signatures for non-repudiation.

    Threat: User denies signing a transaction
    Mitigation: Cryptographic signature proves they signed it
    """

    def sign_transaction(self, transaction_data, private_key):
        """
        Sign transaction with user's private key.

        Only user has private key, so signature proves they authorized it.
        """
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.asymmetric import padding

        # Serialize transaction
        transaction_json = json.dumps(transaction_data, sort_keys=True)

        # Sign with private key
        signature = private_key.sign(
            transaction_json.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )

        return {
            'transaction': transaction_data,
            'signature': signature.hex(),
            'signer': self._get_public_key_fingerprint(private_key.public_key()),
            'signed_at': datetime.utcnow().isoformat()
        }

    def verify_signature(self, signed_transaction, public_key):
        """
        Verify signature - proves who signed it.

        Can be used as legal evidence.
        """
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.asymmetric import padding

        transaction = signed_transaction['transaction']
        signature = bytes.fromhex(signed_transaction['signature'])

        transaction_json = json.dumps(transaction, sort_keys=True)

        try:
            public_key.verify(
                signature,
                transaction_json.encode(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except:
            return False
```

### I - Information Disclosure

**What is it**: Exposing information to unauthorized parties.

**Examples**:
- Database backup exposed in public S3 bucket
- Stack traces revealing system internals
- API returning more data than necessary
- Error messages containing sensitive details
- Source code leaked through version control
- Metadata in documents revealing internal info

**Mitigations**:
- Encrypt data at rest and in transit
- Implement access controls
- Data classification and handling procedures
- Sanitize error messages
- Remove debug endpoints in production
- Review API responses for over-sharing
- Scan for secrets in code repositories

```python
# Example: Preventing information disclosure
class SecureErrorHandler:
    """
    Prevent information disclosure through error messages.

    Threat: Detailed error messages reveal system internals to attackers
    Mitigation: Generic errors to users, detailed logs internally
    """

    def handle_exception(self, exception, request):
        """
        Return generic error to user, log details internally.

        Never expose stack traces, database queries, or file paths to users.
        """
        # Generate unique error ID for correlation
        error_id = str(uuid.uuid4())

        # ✅ GOOD: Log detailed error internally
        logging.error(
            "Request failed",
            extra={
                'error_id': error_id,
                'exception_type': type(exception).__name__,
                'exception_message': str(exception),
                'stack_trace': traceback.format_exc(),
                'request_path': request.path,
                'request_method': request.method,
                'user_id': self._get_user_id(request),
                'ip_address': self._get_client_ip(request)
            }
        )

        # ✅ GOOD: Return generic error to user
        # ❌ BAD: Don't include stack trace or database details
        return {
            'error': 'An error occurred while processing your request',
            'error_id': error_id,
            'message': 'Please contact support with this error ID if the problem persists'
        }, 500

# Example: Preventing data over-exposure in APIs
class SecureAPIResponse:
    """
    Prevent information disclosure through API responses.

    Threat: API returns more data than necessary
    Mitigation: Return only required fields, filter by permissions
    """

    def get_user_profile(self, user_id, requester_id):
        """
        Return user profile with appropriate field filtering.

        Don't return sensitive fields unless authorized.
        """
        # Get full user record
        user = self.db.query_one('users', {'user_id': user_id})

        # ❌ BAD: Return everything
        # return user

        # ✅ GOOD: Filter based on permissions
        if requester_id == user_id:
            # Self-access: return most fields
            allowed_fields = [
                'user_id', 'email', 'name', 'phone',
                'address', 'preferences', 'created_at'
            ]
        elif self._is_admin(requester_id):
            # Admin: return admin-relevant fields
            allowed_fields = [
                'user_id', 'email', 'name', 'status',
                'last_login', 'created_at'
            ]
        else:
            # Other users: minimal public profile
            allowed_fields = [
                'user_id', 'name', 'public_profile_url'
            ]

        # Filter response
        filtered_user = {
            k: v for k, v in user.items()
            if k in allowed_fields
        }

        logging.info(
            "User profile accessed",
            extra={
                'user_id': user_id,
                'requester_id': requester_id,
                'fields_returned': list(filtered_user.keys())
            }
        )

        return filtered_user

# Example: Encrypting sensitive data at rest
class DataEncryption:
    """
    Prevent information disclosure with encryption.

    Threat: Database backup or disk stolen
    Mitigation: Encrypt sensitive data at rest
    """

    def __init__(self):
        from cryptography.fernet import Fernet
        # Get key from secrets manager
        self.key = self._get_encryption_key()
        self.cipher = Fernet(self.key)

    def store_sensitive_data(self, user_id, field_name, value):
        """
        Encrypt sensitive data before storing.

        Even if database is compromised, data is protected.
        """
        # Identify sensitive fields
        sensitive_fields = [
            'ssn', 'credit_card', 'bank_account',
            'password', 'secret', 'token'
        ]

        if field_name in sensitive_fields:
            # Encrypt before storing
            encrypted_value = self.cipher.encrypt(value.encode())

            self.db.update('users', {'user_id': user_id}, {
                f'{field_name}_encrypted': encrypted_value
            })

            logging.info(
                "Sensitive data encrypted and stored",
                extra={
                    'user_id': user_id,
                    'field_name': field_name
                }
            )
        else:
            # Store non-sensitive data normally
            self.db.update('users', {'user_id': user_id}, {
                field_name: value
            })
```

### D - Denial of Service

**What is it**: Making system unavailable to legitimate users.

**Examples**:
- Flooding server with requests (DDoS)
- Resource exhaustion (CPU, memory, disk)
- Database connection pool exhaustion
- Algorithmic complexity attacks (ReDoS)
- Locking user accounts with failed login attempts

**Mitigations**:
- Rate limiting
- Resource quotas
- Load balancing and auto-scaling
- Circuit breakers
- Input validation (prevent expensive operations)
- DDoS protection services (Cloudflare, AWS Shield)
- Graceful degradation

```python
# Example: Rate limiting to prevent DoS
from functools import wraps
import time

class RateLimiter:
    """
    Prevent DoS through rate limiting.

    Threat: Attacker floods API with requests
    Mitigation: Limit requests per IP/user
    """

    def __init__(self, redis_client):
        self.redis = redis_client

    def rate_limit(self, max_requests=100, window_seconds=60):
        """
        Decorator to rate limit function calls.

        Limits to max_requests per window_seconds.
        """
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Get identifier (IP address or user ID)
                identifier = self._get_identifier()
                key = f"rate_limit:{func.__name__}:{identifier}"

                # Get current request count
                current = self.redis.get(key)

                if current and int(current) >= max_requests:
                    logging.warning(
                        "Rate limit exceeded",
                        extra={
                            'identifier': identifier,
                            'function': func.__name__,
                            'limit': max_requests,
                            'window': window_seconds
                        }
                    )
                    raise ValueError(f"Rate limit exceeded. Try again in {window_seconds} seconds.")

                # Increment counter
                pipe = self.redis.pipeline()
                pipe.incr(key)
                pipe.expire(key, window_seconds)
                pipe.execute()

                # Call function
                return func(*args, **kwargs)

            return wrapper
        return decorator

# Example: Resource limits to prevent DoS
class ResourceLimits:
    """
    Prevent DoS through resource limits.

    Threat: Attacker triggers expensive operations
    Mitigation: Limit resources consumed per request
    """

    def paginate_results(self, query, page=1, page_size=20, max_page_size=100):
        """
        Limit query results to prevent database exhaustion.

        Threat: Request for millions of records at once
        Mitigation: Enforce maximum page size
        """
        # ✅ GOOD: Enforce maximum page size
        if page_size > max_page_size:
            logging.warning(
                "Page size limit exceeded",
                extra={
                    'requested': page_size,
                    'max': max_page_size
                }
            )
            page_size = max_page_size

        # ✅ GOOD: Set query timeout
        query_timeout = 5  # seconds

        results = self.db.query(
            query,
            limit=page_size,
            offset=(page - 1) * page_size,
            timeout=query_timeout
        )

        return {
            'results': results,
            'page': page,
            'page_size': page_size,
            'total_pages': self._get_total_pages(query, page_size)
        }

    def limit_file_upload(self, file, max_size_mb=10):
        """
        Limit file upload size to prevent storage exhaustion.

        Threat: Attacker uploads huge files
        Mitigation: Enforce size limits
        """
        max_size_bytes = max_size_mb * 1024 * 1024

        if file.size > max_size_bytes:
            logging.warning(
                "File upload rejected - too large",
                extra={
                    'file_size': file.size,
                    'max_size': max_size_bytes
                }
            )
            raise ValueError(f"File too large. Maximum size: {max_size_mb}MB")

        return file

# Example: Circuit breaker pattern
class CircuitBreaker:
    """
    Prevent cascading failures with circuit breaker.

    Threat: Failing dependency causes system-wide DoS
    Mitigation: Stop calling failing service, fail fast
    """

    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.state = 'closed'  # closed, open, half-open
        self.last_failure_time = None

    def call(self, func, *args, **kwargs):
        """
        Call function with circuit breaker protection.

        States:
        - Closed: Normal operation, passes calls through
        - Open: Too many failures, reject calls immediately
        - Half-open: After timeout, try one call to test
        """
        if self.state == 'open':
            # Check if timeout has elapsed
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'half-open'
                logging.info("Circuit breaker entering half-open state")
            else:
                logging.warning("Circuit breaker open - request rejected")
                raise ValueError("Service unavailable - circuit breaker open")

        try:
            result = func(*args, **kwargs)

            # Success - reset if in half-open state
            if self.state == 'half-open':
                self.state = 'closed'
                self.failure_count = 0
                logging.info("Circuit breaker closed - service recovered")

            return result

        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = 'open'
                logging.error(
                    "Circuit breaker opened - too many failures",
                    extra={'failure_count': self.failure_count}
                )

            raise
```

### E - Elevation of Privilege

**What is it**: Gaining capabilities beyond what you're authorized for.

**Examples**:
- Regular user gains admin access
- Horizontal privilege escalation (access other users' data)
- SQL injection allows database admin commands
- Path traversal accesses restricted files
- Buffer overflow gains system-level access

**Mitigations**:
- Principle of least privilege
- Role-based access control (RBAC)
- Input validation and sanitization
- Secure coding practices
- Separation of duties
- Security context validation

```python
# Example: Preventing privilege escalation
class AccessControl:
    """
    Prevent elevation of privilege through strict access controls.

    Threat: User gains unauthorized access to privileged functions
    Mitigation: Check permissions before every sensitive operation
    """

    def __init__(self, db_connection):
        self.db = db_connection

    def check_permission(self, user_id, resource, action):
        """
        Verify user has permission for action on resource.

        Never trust client-side permission checks.
        """
        # Get user's roles
        user_roles = self._get_user_roles(user_id)

        # Get required permissions for action
        required_permission = f"{resource}:{action}"

        # Check if any role has permission
        for role in user_roles:
            role_permissions = self._get_role_permissions(role)
            if required_permission in role_permissions:
                logging.info(
                    "Permission check passed",
                    extra={
                        'user_id': user_id,
                        'role': role,
                        'resource': resource,
                        'action': action
                    }
                )
                return True

        # Log authorization failure
        logging.warning(
            "Permission denied - privilege escalation attempt?",
            extra={
                'user_id': user_id,
                'roles': user_roles,
                'resource': resource,
                'action': action
            }
        )

        return False

    def delete_user(self, admin_id, target_user_id):
        """
        Admin function with permission check.

        Threat: Regular user tries to delete others' accounts
        Mitigation: Verify admin permission before allowing
        """
        # ✅ GOOD: Check permission before action
        if not self.check_permission(admin_id, 'users', 'delete'):
            raise PermissionError("Insufficient privileges to delete users")

        # ✅ GOOD: Prevent self-deletion
        if admin_id == target_user_id:
            raise ValueError("Cannot delete your own account")

        # ✅ GOOD: Additional check for protected accounts
        if self._is_protected_account(target_user_id):
            raise ValueError("Cannot delete protected account")

        # Perform deletion
        self.db.delete('users', {'user_id': target_user_id})

        logging.info(
            "User deleted by admin",
            extra={
                'admin_id': admin_id,
                'deleted_user_id': target_user_id
            }
        )

# Example: Preventing horizontal privilege escalation
class DataAccessControl:
    """
    Prevent accessing other users' data.

    Threat: User modifies request to access another user's data
    Mitigation: Verify ownership before allowing access
    """

    def get_user_document(self, requester_id, document_id):
        """
        Get document with ownership verification.

        Threat: User changes document_id in URL to access others' documents
        Mitigation: Verify requester owns document
        """
        # Get document
        document = self.db.query_one('documents', {'document_id': document_id})

        if not document:
            raise ValueError("Document not found")

        # ✅ GOOD: Verify ownership
        if document['owner_id'] != requester_id:
            # Check if requester has been granted access
            if not self._has_shared_access(document_id, requester_id):
                logging.warning(
                    "Unauthorized document access attempt",
                    extra={
                        'requester_id': requester_id,
                        'document_id': document_id,
                        'owner_id': document['owner_id']
                    }
                )
                raise PermissionError("Access denied")

        return document

    def update_user_settings(self, requester_id, user_id, settings):
        """
        Update user settings with authorization check.

        Threat: User changes user_id in request to modify others' settings
        Mitigation: Verify requester can modify target user's settings
        """
        # ✅ GOOD: Verify authorization
        # Can only modify own settings unless admin
        if requester_id != user_id:
            if not self._is_admin(requester_id):
                logging.warning(
                    "Unauthorized settings modification attempt",
                    extra={
                        'requester_id': requester_id,
                        'target_user_id': user_id
                    }
                )
                raise PermissionError("Can only modify own settings")

        # Update settings
        self.db.update('user_settings', {'user_id': user_id}, settings)

        logging.info(
            "User settings updated",
            extra={
                'requester_id': requester_id,
                'target_user_id': user_id
            }
        )
```

## Trust Boundaries and Data Flow Diagrams

### What are Trust Boundaries?

**Trust boundaries** are lines where the trust level changes - typically where data crosses from a trusted zone to an untrusted zone (or vice versa).

**Common trust boundaries**:
- User input entering your system
- Your system calling third-party APIs
- Data moving from DMZ to internal network
- Database queries with user-supplied parameters
- File uploads from users
- Inter-service communication

### Data Flow Diagram (DFD)

A visual representation of how data moves through your system, showing trust boundaries.

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet (Untrusted)                  │
│                                                              │
│  ┌──────────┐                                               │
│  │  User    │                                               │
│  │ Browser  │                                               │
│  └────┬─────┘                                               │
│       │                                                      │
└───────┼──────────────────────────────────────────────────────┘
        │ HTTPS (Trust Boundary #1)
        │ ⚠️ Validate all input here
        ▼
┌─────────────────────────────────────────────────────────────┐
│                        DMZ / Public Zone                     │
│                                                              │
│  ┌──────────────┐                                           │
│  │  Web Server  │                                           │
│  │  (NGINX)     │                                           │
│  └──────┬───────┘                                           │
│         │                                                    │
└─────────┼────────────────────────────────────────────────────┘
          │ (Trust Boundary #2)
          │ ⚠️ Sanitize, authenticate, authorize
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Semi-trusted)           │
│                                                              │
│  ┌────────────┐        ┌────────────┐                      │
│  │    API     │◄──────►│   Cache    │                      │
│  │  Service   │        │  (Redis)   │                      │
│  └────┬───────┘        └────────────┘                      │
│       │                                                      │
└───────┼──────────────────────────────────────────────────────┘
        │ (Trust Boundary #3)
        │ ⚠️ Parameterized queries, least privilege
        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (Trusted)                       │
│                                                              │
│  ┌──────────────┐                                           │
│  │   Database   │                                           │
│  │  (PostgreSQL)│                                           │
│  └──────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Creating a DFD

```python
# Example: Document data flows and trust boundaries
class ThreatModelingDFD:
    """
    Document system architecture for threat modeling.

    For each data flow, identify:
    1. Source and destination
    2. Trust boundaries crossed
    3. Data classification
    4. Existing controls
    5. Potential threats
    """

    def create_data_flow(self):
        """
        Document a specific data flow.
        """
        return {
            'flow_id': 'DF001',
            'name': 'User Login',
            'source': {
                'component': 'User Browser',
                'trust_level': 'untrusted'
            },
            'destination': {
                'component': 'API Server',
                'trust_level': 'semi-trusted'
            },
            'trust_boundary': 'TB001 - Internet to DMZ',
            'data_classification': 'sensitive (credentials)',
            'transport': 'HTTPS',
            'existing_controls': [
                'TLS 1.3 encryption',
                'Input validation',
                'Rate limiting',
                'Password hashing (bcrypt)'
            ],
            'threats': [
                {
                    'stride_category': 'Spoofing',
                    'description': 'Attacker uses stolen credentials',
                    'mitigation': 'Implement MFA'
                },
                {
                    'stride_category': 'Information Disclosure',
                    'description': 'Credentials intercepted in transit',
                    'mitigation': 'TLS encryption (already implemented)'
                },
                {
                    'stride_category': 'Denial of Service',
                    'description': 'Brute force attack on login',
                    'mitigation': 'Rate limiting, account lockout'
                }
            ]
        }
```

## Attack Surface Analysis

### What is Attack Surface?

The **attack surface** is the sum of all points where an attacker could try to enter or extract data from your system.

**Components of attack surface**:
- **Network attack surface**: Open ports, protocols, APIs
- **Software attack surface**: Application code, libraries, dependencies
- **Human attack surface**: Social engineering, phishing, insider threats
- **Physical attack surface**: Server rooms, devices, paper records

### Reducing Attack Surface

```python
# Example: Attack surface inventory
class AttackSurfaceInventory:
    """
    Document and analyze attack surface.

    Goal: Minimize attack surface by eliminating unnecessary exposure.
    """

    def create_inventory(self):
        """
        Document all attack surface elements.
        """
        return {
            'network_exposure': {
                'public_endpoints': [
                    {
                        'url': 'https://api.example.com/v1',
                        'authentication': 'API key + JWT',
                        'rate_limit': '1000 req/hour per IP',
                        'threats': ['DDoS', 'Credential stuffing'],
                        'mitigations': ['Cloudflare DDoS protection', 'Rate limiting', 'MFA']
                    },
                    {
                        'url': 'https://admin.example.com',
                        'authentication': 'Username/password + MFA',
                        'rate_limit': '100 req/hour per IP',
                        'ip_whitelist': ['Corporate VPN IPs'],
                        'threats': ['Brute force', 'Credential theft'],
                        'mitigations': ['MFA', 'IP whitelist', 'Account lockout']
                    }
                ],
                'open_ports': [
                    {
                        'port': 443,
                        'protocol': 'HTTPS',
                        'purpose': 'API traffic',
                        'exposed_to': 'Internet'
                    },
                    {
                        'port': 22,
                        'protocol': 'SSH',
                        'purpose': 'Server management',
                        'exposed_to': 'VPN only',
                        'mitigation': 'Key-based auth only, no passwords'
                    }
                ]
            },
            'software_exposure': {
                'dependencies': {
                    'total_count': 347,
                    'known_vulnerabilities': 3,
                    'scan_frequency': 'daily',
                    'tool': 'Snyk'
                },
                'custom_code': {
                    'lines_of_code': 125000,
                    'security_reviews': 'quarterly',
                    'static_analysis': 'on every commit',
                    'tool': 'SonarQube'
                }
            },
            'data_exposure': {
                'publicly_accessible': [
                    'Public product catalog',
                    'Blog posts',
                    'Marketing content'
                ],
                'requires_authentication': [
                    'User profiles',
                    'Order history',
                    'Payment methods (tokenized)'
                ],
                'highly_restricted': [
                    'Full credit card numbers (not stored)',
                    'SSNs (encrypted)',
                    'Health records (encrypted)'
                ]
            }
        }

    def reduce_attack_surface(self):
        """
        Steps to minimize attack surface.
        """
        recommendations = [
            {
                'action': 'Close unused ports',
                'impact': 'Reduce network attack surface',
                'example': 'Close port 23 (Telnet), use SSH instead'
            },
            {
                'action': 'Remove debug endpoints in production',
                'impact': 'Prevent information disclosure',
                'example': 'Disable /debug, /metrics on public internet'
            },
            {
                'action': 'Minimize data collected',
                'impact': 'Reduce data breach risk',
                'example': 'Don\'t collect SSN unless legally required'
            },
            {
                'action': 'Update dependencies',
                'impact': 'Eliminate known vulnerabilities',
                'example': 'Automated weekly dependency updates'
            },
            {
                'action': 'Implement API versioning',
                'impact': 'Deprecate and remove old, insecure endpoints',
                'example': 'Remove v1 API after 6-month deprecation period'
            }
        ]

        return recommendations
```

## Risk Assessment and Prioritization

### Risk Calculation

**Risk = Likelihood × Impact**

```python
class RiskAssessment:
    """
    Assess and prioritize security risks.

    Use DREAD model for scoring:
    - Damage potential
    - Reproducibility
    - Exploitability
    - Affected users
    - Discoverability
    """

    def calculate_dread_score(self, threat):
        """
        Calculate risk score using DREAD model.

        Each factor scored 1-10, total 5-50.
        """
        damage = threat['damage_potential']  # 1-10
        reproducibility = threat['reproducibility']  # 1-10
        exploitability = threat['exploitability']  # 1-10
        affected_users = threat['affected_users']  # 1-10
        discoverability = threat['discoverability']  # 1-10

        total_score = (
            damage +
            reproducibility +
            exploitability +
            affected_users +
            discoverability
        )

        risk_level = self._categorize_risk(total_score)

        return {
            'total_score': total_score,
            'risk_level': risk_level,
            'breakdown': {
                'damage': damage,
                'reproducibility': reproducibility,
                'exploitability': exploitability,
                'affected_users': affected_users,
                'discoverability': discoverability
            }
        }

    def _categorize_risk(self, score):
        """Categorize risk level based on DREAD score."""
        if score >= 40:
            return 'Critical'
        elif score >= 30:
            return 'High'
        elif score >= 20:
            return 'Medium'
        else:
            return 'Low'

    def prioritize_threats(self, threats):
        """
        Prioritize threats by risk score.

        Focus on high-risk threats first.
        """
        scored_threats = []

        for threat in threats:
            score = self.calculate_dread_score(threat)
            scored_threats.append({
                **threat,
                'risk_score': score
            })

        # Sort by score (highest first)
        sorted_threats = sorted(
            scored_threats,
            key=lambda x: x['risk_score']['total_score'],
            reverse=True
        )

        return sorted_threats
```

### Risk Treatment Options

```python
class RiskTreatment:
    """
    Four options for treating identified risks:
    1. Mitigate (reduce risk)
    2. Accept (acknowledge risk, do nothing)
    3. Transfer (insurance, third-party)
    4. Avoid (eliminate risky feature)
    """

    def mitigate_risk(self, threat):
        """
        Implement controls to reduce risk.

        Most common approach for high-risk threats.
        """
        mitigation = {
            'threat': threat['description'],
            'controls': [
                {
                    'type': 'preventive',
                    'description': 'Prevent threat from occurring',
                    'example': 'Input validation, authentication'
                },
                {
                    'type': 'detective',
                    'description': 'Detect if threat occurs',
                    'example': 'Logging, monitoring, alerts'
                },
                {
                    'type': 'corrective',
                    'description': 'Respond when threat detected',
                    'example': 'Incident response, rollback'
                }
            ],
            'residual_risk': 'Low'
        }

        return mitigation

    def accept_risk(self, threat, justification):
        """
        Accept risk without mitigation.

        Only for low-risk threats where cost of mitigation > cost of risk.
        Requires executive approval.
        """
        acceptance = {
            'threat': threat['description'],
            'decision': 'Accept',
            'justification': justification,
            'approved_by': 'CTO',
            'approved_date': datetime.utcnow(),
            'review_date': datetime.utcnow() + timedelta(days=180),
            'residual_risk': threat['risk_score']['risk_level']
        }

        return acceptance

    def transfer_risk(self, threat):
        """
        Transfer risk to third party.

        Examples: Insurance, outsourcing to managed service.
        """
        transfer = {
            'threat': threat['description'],
            'decision': 'Transfer',
            'method': 'Cyber insurance policy',
            'coverage_amount': '$5,000,000',
            'annual_premium': '$50,000',
            'residual_risk': 'Medium'
        }

        return transfer

    def avoid_risk(self, threat):
        """
        Eliminate risk by removing risky feature.

        Most effective but may impact functionality.
        """
        avoidance = {
            'threat': threat['description'],
            'decision': 'Avoid',
            'action': 'Remove feature or don\'t implement',
            'business_impact': 'Cannot offer this functionality',
            'residual_risk': 'None'
        }

        return avoidance
```

## Threat Modeling Example Walkthrough

Let's walk through a complete threat model for a simple e-commerce checkout flow.

### Step 1: Decompose the System

```
Feature: Checkout Flow

Actors:
- Customer (untrusted)
- Payment processor (trusted third-party)
- Internal API (trusted)
- Database (trusted)

Data Flow:
1. Customer submits order (items, quantity, shipping address)
2. API validates cart and calculates total
3. API creates payment intent with payment processor
4. Customer enters card details on payment processor's form
5. Payment processor returns payment confirmation
6. API creates order record in database
7. API returns confirmation to customer

Trust Boundaries:
- TB1: Customer browser to API (Internet)
- TB2: API to payment processor (HTTPS)
- TB3: API to database (internal network)

Assets:
- Customer personal information (PII)
- Order data
- Payment information (handled by processor)
- Inventory data
- API credentials
```

### Step 2: Identify Threats (using STRIDE)

```python
checkout_threats = [
    {
        'id': 'T001',
        'stride_category': 'Tampering',
        'description': 'Customer modifies prices in shopping cart before checkout',
        'affected_asset': 'Order total',
        'attack_scenario': 'Customer intercepts API request and changes item prices',
        'existing_controls': 'None',
        'damage_potential': 8,  # Financial loss
        'reproducibility': 10,  # Easy to reproduce
        'exploitability': 7,  # Requires HTTP interception
        'affected_users': 10,  # All customers
        'discoverability': 6  # Requires some technical knowledge
    },
    {
        'id': 'T002',
        'stride_category': 'Elevation of Privilege',
        'description': 'Customer accesses other users\' orders by changing order ID',
        'affected_asset': 'Order data (PII)',
        'attack_scenario': 'Customer changes order_id in URL to view others\' orders',
        'existing_controls': 'Authentication required',
        'damage_potential': 9,  # PII breach
        'reproducibility': 10,  # Very easy
        'exploitability': 10,  # No special tools needed
        'affected_users': 10,  # All customers
        'discoverability': 8  # Common vulnerability
    },
    {
        'id': 'T003',
        'stride_category': 'Information Disclosure',
        'description': 'Payment information exposed in logs',
        'affected_asset': 'Credit card data',
        'attack_scenario': 'Full card numbers logged, accessible to developers',
        'existing_controls': 'None',
        'damage_potential': 10,  # PCI violation
        'reproducibility': 10,  # Happens on every transaction
        'exploitability': 5,  # Requires access to logs
        'affected_users': 10,  # All customers
        'discoverability': 7  # Log review would find it
    },
    {
        'id': 'T004',
        'stride_category': 'Denial of Service',
        'description': 'Checkout API flooded with requests',
        'affected_asset': 'API availability',
        'attack_scenario': 'Attacker sends thousands of checkout requests per second',
        'existing_controls': 'None',
        'damage_potential': 7,  # Lost revenue
        'reproducibility': 8,  # Easy with scripts
        'exploitability': 9,  # No authentication required
        'affected_users': 10,  # All customers affected
        'discoverability': 5  # Obvious when it happens
    },
    {
        'id': 'T005',
        'stride_category': 'Repudiation',
        'description': 'Customer denies making purchase',
        'affected_asset': 'Order records',
        'attack_scenario': 'Customer claims fraudulent charge, no proof of authorization',
        'existing_controls': 'None',
        'damage_potential': 6,  # Chargeback costs
        'reproducibility': 7,  # Can happen frequently
        'exploitability': 10,  # No special skills needed
        'affected_users': 1,  # Individual customers
        'discoverability': 10  # Will be reported by customers
    }
]
```

### Step 3: Rank Risks

```python
risk_assessment = RiskAssessment()
prioritized_threats = risk_assessment.prioritize_threats(checkout_threats)

# Results:
# 1. T003 - Information Disclosure (Card data in logs): Score 47 - CRITICAL
# 2. T002 - Privilege Escalation (View others' orders): Score 47 - CRITICAL
# 3. T001 - Tampering (Price modification): Score 41 - CRITICAL
# 4. T004 - DoS (API flooding): Score 39 - HIGH
# 5. T005 - Repudiation (Deny purchase): Score 34 - HIGH
```

### Step 4: Mitigate Threats

```python
mitigations = [
    {
        'threat_id': 'T003',
        'threat': 'Card data in logs',
        'mitigation': 'Never log payment information',
        'implementation': '''
            # Sanitize logs to remove sensitive data
            def log_transaction(transaction):
                safe_transaction = transaction.copy()
                # Remove sensitive fields
                safe_transaction.pop('card_number', None)
                safe_transaction.pop('cvv', None)
                # Mask PII
                if 'email' in safe_transaction:
                    safe_transaction['email'] = mask_email(safe_transaction['email'])
                logging.info(f"Transaction processed: {safe_transaction}")
        ''',
        'verification': 'Review logs to confirm no sensitive data',
        'residual_risk': 'Low'
    },
    {
        'threat_id': 'T002',
        'threat': 'View others\' orders',
        'mitigation': 'Verify order ownership before returning data',
        'implementation': '''
            def get_order(order_id, customer_id):
                order = db.get_order(order_id)
                # Verify ownership
                if order.customer_id != customer_id:
                    logging.warning(f"Unauthorized order access: {customer_id} -> {order_id}")
                    raise PermissionError("Access denied")
                return order
        ''',
        'verification': 'Penetration test - try accessing others\' orders',
        'residual_risk': 'Low'
    },
    {
        'threat_id': 'T001',
        'threat': 'Price modification',
        'mitigation': 'Always use server-side prices, never trust client',
        'implementation': '''
            def create_order(cart_items):
                # Look up actual prices from database
                total = 0
                for item in cart_items:
                    actual_price = db.get_product_price(item.product_id)
                    # Ignore client-provided price
                    total += actual_price * item.quantity
                return create_order_with_total(total)
        ''',
        'verification': 'Try modifying prices in API requests',
        'residual_risk': 'Low'
    },
    {
        'threat_id': 'T004',
        'threat': 'DoS attack on API',
        'mitigation': 'Implement rate limiting',
        'implementation': '''
            @rate_limit(max_requests=10, window_seconds=60)
            def checkout(customer_id, cart):
                # Process checkout
                ...
        ''',
        'verification': 'Load testing with excessive requests',
        'residual_risk': 'Medium (sophisticated DDoS still possible)'
    },
    {
        'threat_id': 'T005',
        'threat': 'Customer denies purchase',
        'mitigation': 'Comprehensive audit logging + email confirmation',
        'implementation': '''
            def complete_order(order):
                # Log with full context
                audit_log(
                    user_id=order.customer_id,
                    action='order_placed',
                    details=order.to_dict(),
                    ip_address=request.ip,
                    timestamp=datetime.utcnow()
                )
                # Send confirmation email as proof
                send_order_confirmation(order)
        ''',
        'verification': 'Verify audit logs captured and email sent',
        'residual_risk': 'Low'
    }
]
```

### Step 5: Validate Mitigations

```python
validation_plan = [
    {
        'threat_id': 'T003',
        'validation_method': 'Log review',
        'steps': [
            '1. Process test transaction',
            '2. Review all logs (application, web server, database)',
            '3. Search for patterns: "card", "cvv", "credit card numbers"',
            '4. Verify no sensitive data appears'
        ],
        'success_criteria': 'No payment information in any logs',
        'responsible': 'Security Engineer',
        'due_date': '2026-02-26'
    },
    {
        'threat_id': 'T002',
        'validation_method': 'Penetration testing',
        'steps': [
            '1. Create two test customer accounts',
            '2. Place order with customer A',
            '3. Attempt to access customer A\'s order as customer B',
            '4. Try various methods: URL manipulation, API direct calls'
        ],
        'success_criteria': 'All unauthorized access attempts return 403 Forbidden',
        'responsible': 'Security Engineer',
        'due_date': '2026-02-26'
    },
    {
        'threat_id': 'T001',
        'validation_method': 'API testing',
        'steps': [
            '1. Intercept checkout API request',
            '2. Modify item prices to $0.01',
            '3. Submit modified request',
            '4. Verify order total uses server-side prices'
        ],
        'success_criteria': 'Order total matches server-side calculation regardless of client input',
        'responsible': 'QA Engineer',
        'due_date': '2026-02-26'
    }
]
```

### Step 6: Document

```markdown
# Threat Model: E-Commerce Checkout Flow
**Date**: 2026-02-19
**Version**: 1.0
**Participants**: Security team, Development team, Product Manager

## Executive Summary
Identified 5 threats across STRIDE categories. 3 Critical and 2 High risk.
All threats have mitigations planned or implemented.

## System Overview
E-commerce checkout flow allowing customers to purchase products.

## Assets
1. Customer PII (Critical)
2. Payment information (Critical - handled by Stripe)
3. Order data (High)
4. Inventory data (Medium)

## Trust Boundaries
- TB1: Customer browser to API (validate all input)
- TB2: API to Stripe (mutual TLS)
- TB3: API to database (least privilege access)

## Threats and Mitigations
[Full threat list with DREAD scores and mitigations]

## Accepted Risks
None - all identified risks mitigated.

## Validation Status
- T001, T002, T003: Validated, mitigations effective
- T004, T005: Scheduled for validation 2026-02-26

## Next Review
2026-08-19 (6 months) or when significant changes made to checkout flow
```

## Threat Modeling Tools

### 1. Microsoft Threat Modeling Tool

**Best for**: Windows users, STRIDE methodology, Microsoft stack

**Features**:
- Visual DFD creation
- Automatic threat generation based on STRIDE
- Threat library with mitigations
- Report generation

**Download**: https://aka.ms/threatmodelingtool

### 2. OWASP Threat Dragon

**Best for**: Open-source, cross-platform, web-based

**Features**:
- Browser-based (no installation)
- Desktop version available
- GitHub integration
- STRIDE support
- Free and open-source

**Download**: https://owasp.org/www-project-threat-dragon/

### 3. IriusRisk

**Best for**: Enterprise, automated threat modeling, DevSecOps integration

**Features**:
- Automated threat identification
- Integration with CI/CD
- Compliance mapping
- Collaborative threat modeling

**Pricing**: Commercial (free community edition available)

### 4. Threagile

**Best for**: Code-based threat modeling, DevOps workflows

**Features**:
- YAML-based model definition
- CLI tool for CI/CD integration
- Risk tracking
- Report generation

**Download**: https://threagile.io

## Integration with SDLC

### When to Threat Model in Development Lifecycle

```
Requirements Phase
    │
    ├─ Initial threat model for new features
    │  - Identify security requirements
    │  - Inform architecture decisions
    │
    ▼
Design Phase
    │
    ├─ Detailed threat modeling
    │  - Create DFDs
    │  - Identify threats with STRIDE
    │  - Design security controls
    │
    ▼
Development Phase
    │
    ├─ Implement mitigations
    │  - Code security controls
    │  - Security unit tests
    │
    ▼
Testing Phase
    │
    ├─ Validate mitigations
    │  - Security testing
    │  - Penetration testing
    │
    ▼
Deployment Phase
    │
    ├─ Final security review
    │  - Verify all controls in place
    │
    ▼
Maintenance Phase
    │
    ├─ Periodic review
    │  - Annual threat model update
    │  - Review after incidents
    │  - Update when architecture changes
```

### Threat Modeling Cadence

| Activity | Frequency |
|----------|-----------|
| New feature threat model | Before design approval |
| Architecture change review | Before major releases |
| Full system review | Annually |
| Post-incident review | After each security incident |
| Third-party integration review | Before integration |
| Compliance review | Per regulatory requirements |

## Team Workshops

### Running a Threat Modeling Workshop

**Duration**: 2-4 hours (depending on complexity)

**Participants**:
- Security engineer (facilitator)
- Software architect
- Lead developer
- Product manager
- DevOps engineer

**Agenda**:

```
1. Introduction (15 minutes)
   - Threat modeling overview
   - Goals for this session

2. System Overview (30 minutes)
   - Present architecture diagram
   - Identify components and data flows
   - Mark trust boundaries

3. Brainstorm Threats (60 minutes)
   - Use STRIDE framework
   - Go through each component and data flow
   - Document threats in shared document

4. Risk Assessment (30 minutes)
   - Calculate DREAD scores
   - Prioritize threats

5. Mitigation Planning (45 minutes)
   - Identify mitigations for high-risk threats
   - Assign owners and deadlines
   - Document accepted risks

6. Wrap-up (15 minutes)
   - Summarize findings
   - Document action items
   - Schedule follow-up
```

**Facilitation Tips**:
- Use a whiteboard or digital collaboration tool (Miro, Mural)
- Encourage "yes, and" thinking - no idea is bad
- Focus on identifying threats, not solving everything immediately
- Time-box discussions to maintain momentum
- Document everything - threats, mitigations, decisions

## Common Mistakes

### 1. Threat Modeling Too Late

**Problem**: Waiting until code is written to think about security

**Solution**: Threat model during design phase

### 2. Analysis Paralysis

**Problem**: Trying to identify every possible threat, never finishing

**Solution**: Time-box sessions, focus on high-risk areas first

### 3. Treating It as Checkbox Exercise

**Problem**: Creating threat model document that nobody uses

**Solution**: Make it living document, review regularly, update when changes occur

### 4. Missing Trust Boundaries

**Problem**: Not identifying where data crosses trust levels

**Solution**: Explicitly mark trust boundaries on diagrams

### 5. No Follow-Through

**Problem**: Identifying threats but never implementing mitigations

**Solution**: Assign owners, set deadlines, track in project management tool

### 6. Working in Isolation

**Problem**: Security team threat models alone without developers

**Solution**: Collaborative workshops with all stakeholders

### 7. Using Only One Framework

**Problem**: STRIDE doesn't catch everything

**Solution**: Combine frameworks (STRIDE + attack trees + abuse cases)

### 8. Ignoring Third-Party Services

**Problem**: Only modeling your own code, forgetting dependencies

**Solution**: Include all external services and APIs in model

## Quick Reference

### STRIDE Cheat Sheet

| Category | Threat | Mitigation |
|----------|--------|------------|
| **Spoofing** | Impersonation | Authentication (MFA, certs, tokens) |
| **Tampering** | Data modification | Input validation, signatures, checksums |
| **Repudiation** | Deny action | Audit logging, digital signatures |
| **Information Disclosure** | Data exposure | Encryption, access controls, data minimization |
| **Denial of Service** | Unavailability | Rate limiting, resource quotas, redundancy |
| **Elevation of Privilege** | Unauthorized access | RBAC, least privilege, input validation |

### Threat Modeling Checklist

#### Preparation
- [ ] Identify scope (what are we modeling?)
- [ ] Schedule workshop with stakeholders
- [ ] Gather architecture diagrams
- [ ] Prepare collaboration tools

#### System Decomposition
- [ ] Create data flow diagram
- [ ] Identify all components (services, databases, APIs)
- [ ] Mark trust boundaries
- [ ] List assets and their classification
- [ ] Document assumptions

#### Threat Identification
- [ ] Apply STRIDE to each component
- [ ] Apply STRIDE to each data flow
- [ ] Apply STRIDE to each trust boundary
- [ ] Consider threat actors and their capabilities
- [ ] Document attack scenarios

#### Risk Assessment
- [ ] Calculate DREAD or risk scores for each threat
- [ ] Prioritize threats by risk level
- [ ] Consider likelihood and impact
- [ ] Review existing controls

#### Mitigation
- [ ] Design mitigations for high-risk threats
- [ ] Assign owners and deadlines
- [ ] Document accepted risks with justification
- [ ] Update security requirements

#### Validation
- [ ] Create validation plan for each mitigation
- [ ] Schedule security testing
- [ ] Conduct penetration testing
- [ ] Review with security team

#### Documentation
- [ ] Create threat model document
- [ ] Include diagrams, threats, mitigations
- [ ] Document decisions and rationale
- [ ] Set review schedule

#### Follow-up
- [ ] Track mitigation implementation
- [ ] Validate mitigations are effective
- [ ] Update threat model as system changes
- [ ] Schedule annual review

## Use Cases

### E-Commerce Platform

**Key threats**:
- Price tampering
- Payment information disclosure
- Account takeover
- Inventory manipulation
- Order fraud

**Focus areas**:
- Checkout flow
- Payment integration
- User authentication
- Admin interfaces

### Healthcare Application

**Key threats**:
- PHI disclosure
- Unauthorized access to medical records
- Prescription fraud
- HIPAA violations

**Focus areas**:
- Patient data access controls
- Encryption at rest and in transit
- Audit logging
- Third-party integrations (labs, pharmacies)

### Financial Services

**Key threats**:
- Unauthorized transactions
- Account takeover
- Insider threats
- Data breaches

**Focus areas**:
- Transaction authorization
- Multi-factor authentication
- Fraud detection
- Compliance controls (SOX, PCI-DSS)

### SaaS Application

**Key threats**:
- Tenant data isolation failures
- API abuse
- DDoS attacks
- Insider threats

**Focus areas**:
- Multi-tenancy architecture
- API security
- Rate limiting
- Admin access controls

## Related Topics

- **[Secure Coding Practices](../../01-programming/secure-coding/README.md)**: Implementing threat mitigations in code
- **[Security Testing](../security-testing/README.md)**: Validating threat mitigations
- **[Incident Response](../incident-response/README.md)**: Responding when threats become reality
- **[Zero Trust Architecture](../../02-architectures/zero-trust/README.md)**: Architectural approach informed by threat modeling
- **[API Security](../../05-backend/api-security/README.md)**: Specific threat modeling for APIs
- **[Cloud Security](../../07-cloud/security/README.md)**: Threat modeling in cloud environments
- **[Compliance](../compliance/README.md)**: Regulatory requirements drive threat modeling
- **[Pen Testing](../penetration-testing/README.md)**: Validating threat models through testing

---

**Remember**: Threat modeling is not a one-time activity. As your system evolves, so do the threats. Make threat modeling a regular part of your development process, not just a security audit checkbox. The goal is to build secure systems, not just document insecure ones.

Last Updated: 2026-02-19
