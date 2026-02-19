# OWASP Top 10 Security Risks

## What is the OWASP Top 10?

The OWASP Top 10 is a regularly updated list of the most critical security risks to web applications, created by the Open Web Application Security Project (OWASP). It represents a broad consensus about what the most critical web application security flaws are, based on data from hundreds of organizations and thousands of applications.

Think of it like a "most wanted" list for security vulnerabilities. Just as police publish lists of the most common crimes to help communities stay safe, OWASP publishes the most common security issues to help developers build secure applications.

## Why Does This Matter?

The OWASP Top 10 matters because:

**For Developers:**
- Provides a starting point for secure coding practices
- Helps prioritize security efforts (fix the most common issues first)
- Industry-standard reference for security requirements

**For Organizations:**
- These vulnerabilities cause the majority of breaches
- Many compliance frameworks reference OWASP Top 10
- Cost-effective way to improve security posture

**Real-World Impact:**
- **Equifax (2017)**: Injection vulnerability exposed 147 million records
- **British Airways (2018)**: XSS attack led to $230M GDPR fine
- **Capital One (2019)**: Misconfiguration exposed 100 million customer records

## The Current OWASP Top 10 (2021)

1. **Broken Access Control**
2. **Cryptographic Failures**
3. **Injection**
4. **Insecure Design**
5. **Security Misconfiguration**
6. **Vulnerable and Outdated Components**
7. **Identification and Authentication Failures**
8. **Software and Data Integrity Failures**
9. **Security Logging and Monitoring Failures**
10. **Server-Side Request Forgery (SSRF)**

Let's explore each one in detail.

---

## 1. Broken Access Control

### What is it?

Access control enforces policies so users cannot act outside their intended permissions. Broken access control means users can access resources or perform actions they shouldn't be allowed to.

### Simple Analogy

Imagine a hotel where your room key opens any room in the building, not just yours. That's broken access control — the system fails to restrict you to only your authorized spaces.

### How it Works (The Attack)

```python
# VULNERABLE CODE
@app.route('/user/profile/<user_id>')
def view_profile(user_id):
    """
    This endpoint shows any user's profile.
    The problem: No check if the requester should see this profile!
    """
    user = database.get_user(user_id)
    return render_template('profile.html', user=user)

# Attack scenario:
# 1. User logs in, sees their profile at /user/profile/123
# 2. Changes URL to /user/profile/124 (someone else's ID)
# 3. Sees another user's private profile data
```

This is called **Insecure Direct Object Reference (IDOR)** — one of the most common access control vulnerabilities.

### The Fix

```python
# SECURE CODE
@app.route('/user/profile/<user_id>')
@login_required
def view_profile(user_id):
    """
    Secure implementation with authorization check.

    Security measures:
    1. Verify user is authenticated (@login_required)
    2. Check if user has permission to view this profile
    3. Return 403 Forbidden if unauthorized
    4. Log unauthorized access attempts
    """
    user = database.get_user(user_id)

    # Authorization check
    if user.id != current_user.id and not current_user.is_admin:
        logger.warning(
            f"Unauthorized access attempt: User {current_user.id} "
            f"tried to access profile {user_id}"
        )
        abort(403, "You don't have permission to view this profile")

    return render_template('profile.html', user=user)
```

### Common Broken Access Control Patterns

#### 1. Path Traversal

```python
# VULNERABLE: Users can access any file on the system
@app.route('/download/<filename>')
def download_file(filename):
    return send_file(f'/uploads/{filename}')

# Attack: GET /download/../../../../etc/passwd
# Result: Attacker downloads system password file

# SECURE: Validate and restrict file access
@app.route('/download/<filename>')
@login_required
def download_file(filename):
    # Validate filename (no path traversal characters)
    if '..' in filename or '/' in filename:
        abort(400, "Invalid filename")

    # Build safe path
    safe_path = os.path.join('/uploads', filename)

    # Check file exists and is in allowed directory
    if not safe_path.startswith('/uploads/'):
        abort(403, "Access denied")

    if not os.path.exists(safe_path):
        abort(404, "File not found")

    # Verify user owns this file
    file_owner = database.get_file_owner(filename)
    if file_owner != current_user.id:
        abort(403, "Access denied")

    return send_file(safe_path)
```

#### 2. Missing Function Level Access Control

```python
# VULNERABLE: Admin functions accessible to regular users
@app.route('/admin/delete-user/<user_id>', methods=['POST'])
def delete_user(user_id):
    # No check if requester is admin!
    database.delete_user(user_id)
    return "User deleted"

# SECURE: Require admin role
@app.route('/admin/delete-user/<user_id>', methods=['POST'])
@require_role('admin')  # Custom decorator
def delete_user(user_id):
    """
    Only admins can delete users.

    Security measures:
    - Role-based access control (RBAC)
    - Audit logging of deletions
    - Confirmation required
    """
    logger.info(f"Admin {current_user.id} deleting user {user_id}")

    database.delete_user(user_id)
    return "User deleted"

# Role-checking decorator
def require_role(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.has_role(role):
                logger.warning(
                    f"Unauthorized admin access: {current_user.id} "
                    f"attempted to access {request.path}"
                )
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

#### 3. CORS Misconfiguration

```python
# VULNERABLE: Allows any origin to make requests
@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response
# Problem: Malicious site can read user data from your API

# SECURE: Restrict origins
@app.after_request
def add_cors(response):
    """
    Configure CORS securely.

    Why these settings:
    - Only allow specific origins
    - List specific methods allowed
    - Limit exposed headers
    """
    allowed_origins = ['https://yourapp.com', 'https://app.yourapp.com']
    origin = request.headers.get('Origin')

    if origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '3600'

    return response
```

### Best Practices

1. **Deny by Default:** Require explicit permission grants
2. **Use Access Control Lists (ACL):** Centralized permission management
3. **Enforce on Server:** Never rely on client-side access control
4. **Log Access Failures:** Track unauthorized access attempts
5. **Test Thoroughly:** Try to access resources as different users

### Testing for Broken Access Control

```python
# Example: Automated test
def test_access_control():
    """
    Test that users can only access their own resources.

    Test scenarios:
    1. User A can access their own profile
    2. User A cannot access User B's profile
    3. Admin can access all profiles
    4. Unauthenticated users cannot access any profiles
    """
    # Create test users
    user_a = create_test_user('user_a')
    user_b = create_test_user('user_b')
    admin = create_test_user('admin', role='admin')

    # Test 1: User A accesses own profile (should succeed)
    response = client.get(f'/profile/{user_a.id}',
                         headers={'Authorization': f'Bearer {user_a.token}'})
    assert response.status_code == 200

    # Test 2: User A accesses User B's profile (should fail)
    response = client.get(f'/profile/{user_b.id}',
                         headers={'Authorization': f'Bearer {user_a.token}'})
    assert response.status_code == 403

    # Test 3: Admin accesses any profile (should succeed)
    response = client.get(f'/profile/{user_b.id}',
                         headers={'Authorization': f'Bearer {admin.token}'})
    assert response.status_code == 200

    # Test 4: No auth token (should fail)
    response = client.get(f'/profile/{user_a.id}')
    assert response.status_code == 401
```

### Real-World Case Study

**Uber Data Breach (2016)**

Attackers accessed AWS S3 buckets containing database credentials by exploiting broken access control in a private GitHub repository. They then used those credentials to download 57 million user records.

**Lessons:**
- Credentials in code repositories = broken access control
- Overly permissive S3 bucket permissions
- Missing audit logging delayed detection

---

## 2. Cryptographic Failures

### What is it?

Cryptographic failures (previously "Sensitive Data Exposure") occur when applications fail to properly protect sensitive data through encryption, or use weak/outdated cryptographic methods.

### Simple Analogy

Imagine sending postcards instead of sealed letters for your banking information. Even though the postal service delivers it, anyone who handles your mail can read everything. Cryptographic failures are like using postcards when you need sealed envelopes.

### How it Works (The Attack)

```python
# VULNERABLE CODE
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    # BAD: Storing password in plain text
    user = database.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        (username, password)
    )

    if user:
        return "Login successful"
    return "Login failed"

# Problems:
# 1. Passwords stored in plain text
# 2. If database is compromised, all passwords exposed
# 3. No way to safely reset passwords
# 4. Database admins can see passwords
```

### The Fix

```python
# SECURE CODE
import bcrypt
import secrets

@app.route('/login', methods=['POST'])
def login():
    """
    Secure login with hashed passwords.

    Security measures:
    1. Hash passwords with bcrypt (adaptive cost factor)
    2. Salt automatically handled by bcrypt
    3. Timing-safe comparison
    4. No password ever stored or logged
    """
    username = request.form['username']
    password = request.form['password']

    user = database.query(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    )

    if user and bcrypt.checkpw(password.encode(), user.password_hash):
        # Generate secure session token
        session_token = secrets.token_urlsafe(32)
        store_session(user.id, session_token)
        return {"status": "success", "token": session_token}

    # Don't reveal whether username or password was wrong
    return {"status": "error", "message": "Invalid credentials"}, 401


@app.route('/register', methods=['POST'])
def register():
    """
    Register new user with secure password storage.

    Why bcrypt:
    - Adaptive cost factor (slows down brute force)
    - Built-in salt generation
    - Industry standard
    """
    username = request.form['username']
    password = request.form['password']

    # Validate password strength
    if len(password) < 12:
        return {"error": "Password must be at least 12 characters"}, 400

    # Hash password
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    # Store hash, never the password
    database.query(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, password_hash)
    )

    return {"status": "registered"}
```

### Common Cryptographic Failures

#### 1. Weak Hashing Algorithms

```python
# VULNERABLE: MD5 and SHA1 are broken
import hashlib

password = "user_password"
bad_hash = hashlib.md5(password.encode()).hexdigest()
# MD5 can be cracked in seconds with rainbow tables

# SECURE: Use bcrypt, scrypt, or Argon2
import bcrypt

password = "user_password"
secure_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
# Cost factor makes brute force impractically slow
```

#### 2. Unencrypted Data in Transit

```python
# VULNERABLE: HTTP connection (no encryption)
# http://example.com/api/user-data
# Problem: Anyone on network can intercept and read data

# SECURE: Enforce HTTPS
from flask import Flask, redirect, request

app = Flask(__name__)

@app.before_request
def enforce_https():
    """
    Redirect all HTTP requests to HTTPS.

    Why this matters:
    - Prevents man-in-the-middle attacks
    - Encrypts all data in transit
    - Required for modern web standards
    """
    if not request.is_secure:
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)

# Also add HSTS header
@app.after_request
def add_hsts(response):
    """
    HTTP Strict Transport Security header.

    Forces browsers to only use HTTPS for this domain.
    """
    response.headers['Strict-Transport-Security'] = \
        'max-age=31536000; includeSubDomains; preload'
    return response
```

#### 3. Unencrypted Data at Rest

```python
# VULNERABLE: Sensitive data stored in plain text
user_data = {
    "name": "John Doe",
    "ssn": "123-45-6789",  # Plain text!
    "credit_card": "4532-1234-5678-9010"  # Plain text!
}
database.insert('users', user_data)

# SECURE: Encrypt sensitive fields
from cryptography.fernet import Fernet

class EncryptedField:
    """
    Encrypt sensitive data before storage.

    Security measures:
    - Symmetric encryption (Fernet)
    - Key stored in secure key management system
    - Transparent encryption/decryption
    """
    def __init__(self, key):
        self.cipher = Fernet(key)

    def encrypt(self, plaintext):
        """Encrypt data before storing."""
        return self.cipher.encrypt(plaintext.encode()).decode()

    def decrypt(self, ciphertext):
        """Decrypt data after retrieving."""
        return self.cipher.decrypt(ciphertext.encode()).decode()


# Usage
encryption_key = load_key_from_secure_storage()  # AWS KMS, Vault, etc.
encryptor = EncryptedField(encryption_key)

user_data = {
    "name": "John Doe",  # Not sensitive, can store plain
    "ssn": encryptor.encrypt("123-45-6789"),  # Encrypted
    "credit_card": encryptor.encrypt("4532-1234-5678-9010")  # Encrypted
}
database.insert('users', user_data)

# When retrieving
user = database.get_user(user_id)
user['ssn'] = encryptor.decrypt(user['ssn'])
```

#### 4. Weak Random Number Generation

```python
# VULNERABLE: Predictable random numbers
import random

# BAD: Not cryptographically secure
session_token = random.randint(100000, 999999)
# Attacker can predict future tokens

password_reset_token = str(random.randint(0, 999999))
# Sequential guessing possible

# SECURE: Cryptographically secure random
import secrets

# GOOD: Cryptographically secure random numbers
session_token = secrets.token_urlsafe(32)
# 256 bits of entropy, unpredictable

password_reset_token = secrets.token_hex(16)
# 128 bits of entropy

# For temporary codes (like 2FA)
verification_code = secrets.randbelow(1000000)
# Range: 0-999999, cryptographically random
```

### Best Practices

1. **Use Strong Algorithms:**
   - Encryption: AES-256
   - Hashing: bcrypt, scrypt, or Argon2
   - Random: `secrets` module, not `random`

2. **Encrypt Everything Sensitive:**
   - Data in transit (HTTPS/TLS)
   - Data at rest (database encryption)
   - Backups

3. **Key Management:**
   - Never hardcode encryption keys
   - Use key management systems (AWS KMS, Azure Key Vault, HashiCorp Vault)
   - Rotate keys regularly
   - Separate keys per environment

4. **Classification:**
   - Identify what data is sensitive
   - Apply appropriate protection
   - Document data handling requirements

### Testing for Cryptographic Failures

```python
# Example: Test password hashing
def test_password_security():
    """
    Verify passwords are hashed securely.

    Tests:
    1. Password is hashed before storage
    2. Same password creates different hashes (salt)
    3. Hash verification works correctly
    4. Original password cannot be retrieved
    """
    password = "TestPassword123!"

    # Register user
    response = client.post('/register', data={
        'username': 'testuser',
        'password': password
    })
    assert response.status_code == 200

    # Verify password is hashed in database
    user = database.get_user('testuser')
    assert user.password_hash != password  # Not plain text
    assert len(user.password_hash) > 50  # Bcrypt hashes are long

    # Verify same password creates different hash (salt)
    response2 = client.post('/register', data={
        'username': 'testuser2',
        'password': password
    })
    user2 = database.get_user('testuser2')
    assert user.password_hash != user2.password_hash  # Different salts

    # Verify login works
    response = client.post('/login', data={
        'username': 'testuser',
        'password': password
    })
    assert response.status_code == 200


def test_https_enforcement():
    """Test that HTTP is redirected to HTTPS."""
    response = client.get('http://example.com/api/data')
    assert response.status_code == 301  # Permanent redirect
    assert response.location.startswith('https://')
```

### Real-World Case Study

**Adobe Data Breach (2013)**

Adobe stored passwords using weak encryption (DES-ECB) with no salts. When the database was breached, attackers could:
- Decrypt passwords easily
- Find users with same password (no unique salts)
- Exposed 153 million user credentials

**Lessons:**
- Use strong, modern hashing algorithms (bcrypt, not DES)
- Always salt passwords (unique per user)
- Encrypt other sensitive data properly
- Regular security audits of cryptographic implementations

---

## 3. Injection

### What is it?

Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.

### Simple Analogy

Imagine you're a restaurant waiter taking orders. A customer says: "I'd like a burger, and also tell the kitchen to give free meals to everyone." If you relay that exactly as said, the kitchen might interpret it as two separate commands. Injection attacks work the same way — they sneak malicious commands into normal inputs.

### How it Works (The Attack)

#### SQL Injection (Most Common)

```python
# VULNERABLE CODE
@app.route('/user')
def get_user():
    username = request.args.get('username')

    # BAD: String concatenation in SQL
    query = f"SELECT * FROM users WHERE username = '{username}'"
    result = database.execute(query)

    return jsonify(result)

# Normal use:
# GET /user?username=john
# Query: SELECT * FROM users WHERE username = 'john'

# Attack:
# GET /user?username=admin'--
# Query: SELECT * FROM users WHERE username = 'admin'--'
# The -- comments out the rest, bypassing any additional checks

# Worse attack:
# GET /user?username='; DROP TABLE users;--
# Query: SELECT * FROM users WHERE username = ''; DROP TABLE users;--'
# This deletes the entire users table!
```

### The Fix

```python
# SECURE CODE: Parameterized Queries
@app.route('/user')
def get_user():
    """
    Secure user lookup with parameterized query.

    Security measures:
    1. Use parameterized queries (?, placeholders)
    2. Database driver handles escaping
    3. Input treated as data, never as code
    4. Validate input format
    """
    username = request.args.get('username')

    # Input validation
    if not username or len(username) > 50:
        return jsonify({"error": "Invalid username"}), 400

    # Parameterized query - safe from SQL injection
    query = "SELECT * FROM users WHERE username = ?"
    result = database.execute(query, (username,))

    if not result:
        return jsonify({"error": "User not found"}), 404

    return jsonify(result)


# Using ORM (even safer)
from sqlalchemy import select

@app.route('/user')
def get_user_orm():
    """
    ORM-based query is safest approach.

    Why ORMs help:
    - Automatic parameterization
    - Type safety
    - Less chance of mistakes
    """
    username = request.args.get('username')

    user = db.session.query(User).filter_by(username=username).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict())
```

### Common Injection Types

#### 1. NoSQL Injection

```python
# VULNERABLE: MongoDB injection
from pymongo import MongoClient

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # BAD: Direct insertion of user input
    user = db.users.find_one({
        'username': username,
        'password': password
    })

# Attack payload (JSON):
# {
#   "username": {"$ne": null},
#   "password": {"$ne": null}
# }
# This translates to: find user where username != null AND password != null
# Result: Returns first user, bypassing authentication

# SECURE: Type validation and sanitization
@app.route('/login', methods=['POST'])
def login():
    """
    Secure NoSQL query with type validation.

    Security measures:
    1. Validate input types (must be strings)
    2. Reject objects/arrays in user input
    3. Use schema validation
    """
    username = request.json.get('username')
    password = request.json.get('password')

    # Type validation
    if not isinstance(username, str) or not isinstance(password, str):
        return jsonify({"error": "Invalid input type"}), 400

    # Additional validation
    if len(username) > 50 or len(password) > 100:
        return jsonify({"error": "Input too long"}), 400

    # Now safe to query
    user = db.users.find_one({
        'username': username,
        'password': hash_password(password)
    })

    if user:
        return jsonify({"status": "success"})
    return jsonify({"error": "Invalid credentials"}), 401
```

#### 2. OS Command Injection

```python
# VULNERABLE: OS command injection
import subprocess

@app.route('/ping')
def ping_host():
    host = request.args.get('host')

    # BAD: Direct shell execution with user input
    result = subprocess.run(f'ping -c 1 {host}', shell=True, capture_output=True)
    return result.stdout

# Attack:
# GET /ping?host=8.8.8.8; cat /etc/passwd
# Command executed: ping -c 1 8.8.8.8; cat /etc/passwd
# Result: Attacker reads system password file

# SECURE: Avoid shell, validate input, use allowlist
@app.route('/ping')
def ping_host():
    """
    Secure host pinging with validation.

    Security measures:
    1. Validate input format (IP address only)
    2. Use allowlist of allowed hosts
    3. No shell execution
    4. Limited privileges
    """
    host = request.args.get('host')

    # Validate IP address format
    import ipaddress
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return jsonify({"error": "Invalid IP address"}), 400

    # Allowlist of permitted networks
    allowed_networks = [
        ipaddress.ip_network('10.0.0.0/8'),
        ipaddress.ip_network('8.8.8.0/24')
    ]

    if not any(ip in network for network in allowed_networks):
        return jsonify({"error": "IP not allowed"}), 403

    # Execute without shell (safe)
    result = subprocess.run(
        ['ping', '-c', '1', str(ip)],
        shell=False,  # Don't use shell
        capture_output=True,
        timeout=5
    )

    return jsonify({
        "host": str(ip),
        "result": result.stdout.decode()
    })
```

#### 3. LDAP Injection

```python
# VULNERABLE: LDAP injection
import ldap

def authenticate_user(username, password):
    # BAD: String formatting in LDAP filter
    filter = f"(&(uid={username})(password={password}))"
    result = ldap_connection.search_s("dc=example,dc=com", ldap.SCOPE_SUBTREE, filter)
    return len(result) > 0

# Attack username: admin)(uid=*))((|
# Filter becomes: (&(uid=admin)(uid=*))((|)(password=anything))
# Result: Bypasses password check

# SECURE: Escape special characters
import ldap.filter

def authenticate_user(username, password):
    """
    Secure LDAP authentication.

    Security measures:
    1. Escape LDAP special characters
    2. Validate input format
    3. Use positive authentication (compare hashes)
    """
    # Escape special LDAP characters
    safe_username = ldap.filter.escape_filter_chars(username)

    # Validate username format
    if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
        logger.warning(f"Invalid username format: {username}")
        return False

    # Use escaped filter
    filter = f"(uid={safe_username})"
    result = ldap_connection.search_s("dc=example,dc=com", ldap.SCOPE_SUBTREE, filter)

    if len(result) == 1:
        # Verify password using LDAP bind (secure)
        try:
            ldap_connection.simple_bind_s(result[0][0], password)
            return True
        except ldap.INVALID_CREDENTIALS:
            return False

    return False
```

#### 4. XML Injection (XXE - XML External Entity)

```python
# VULNERABLE: XML parsing without security
import xml.etree.ElementTree as ET

@app.route('/parse-xml', methods=['POST'])
def parse_xml():
    xml_data = request.data

    # BAD: Default XML parser allows external entities
    root = ET.fromstring(xml_data)
    return jsonify({"result": root.text})

# Attack XML:
# <?xml version="1.0"?>
# <!DOCTYPE foo [
#   <!ENTITY xxe SYSTEM "file:///etc/passwd">
# ]>
# <data>&xxe;</data>
# Result: Server reads and returns /etc/passwd contents

# SECURE: Disable external entities
import defusedxml.ElementTree as ET

@app.route('/parse-xml', methods=['POST'])
def parse_xml():
    """
    Secure XML parsing.

    Security measures:
    1. Use defusedxml library
    2. Disable external entities
    3. Limit XML size
    4. Validate schema
    """
    xml_data = request.data

    # Limit size
    if len(xml_data) > 1_000_000:  # 1MB limit
        return jsonify({"error": "XML too large"}), 400

    try:
        # defusedxml prevents XXE attacks
        root = ET.fromstring(xml_data)
        return jsonify({"result": root.text})
    except ET.ParseError:
        return jsonify({"error": "Invalid XML"}), 400
```

### Best Practices

1. **Use Parameterized Queries:** Never concatenate user input into queries
2. **Use ORMs:** Reduce direct SQL writing
3. **Input Validation:** Allowlist valid characters/patterns
4. **Least Privilege:** Database users should have minimum necessary permissions
5. **Escape Output:** When displaying user input, escape it for context
6. **Avoid Shell Commands:** Use language APIs instead of shell execution

### Input Validation Strategies

```python
# Example: Comprehensive input validation
import re
from typing import Any, Optional

class InputValidator:
    """
    Centralized input validation.

    Why centralize:
    - Consistent validation across application
    - Single place to update rules
    - Easier to test
    """

    @staticmethod
    def validate_username(username: str) -> bool:
        """
        Validate username format.

        Rules:
        - 3-20 characters
        - Alphanumeric, underscore, hyphen only
        - Must start with letter
        """
        if not username or not isinstance(username, str):
            return False

        pattern = r'^[a-zA-Z][a-zA-Z0-9_-]{2,19}$'
        return bool(re.match(pattern, username))

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format."""
        if not email or not isinstance(email, str):
            return False

        # Simple but effective email regex
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_integer(value: Any, min_val: Optional[int] = None,
                        max_val: Optional[int] = None) -> bool:
        """Validate integer with optional range."""
        try:
            num = int(value)
            if min_val is not None and num < min_val:
                return False
            if max_val is not None and num > max_val:
                return False
            return True
        except (ValueError, TypeError):
            return False

    @staticmethod
    def sanitize_sql_identifier(identifier: str) -> str:
        """
        Sanitize SQL identifier (table/column name).

        Use case: Dynamic table names in queries
        Only allow: letters, numbers, underscore
        """
        if not re.match(r'^[a-zA-Z0-9_]+$', identifier):
            raise ValueError("Invalid SQL identifier")
        return identifier


# Usage in route
@app.route('/search')
def search():
    username = request.args.get('username')

    if not InputValidator.validate_username(username):
        return jsonify({"error": "Invalid username format"}), 400

    # Now safe to use in query
    query = "SELECT * FROM users WHERE username = ?"
    result = database.execute(query, (username,))
    return jsonify(result)
```

### Testing for Injection Vulnerabilities

```python
# Example: Test for SQL injection protection
def test_sql_injection_protection():
    """
    Test common SQL injection payloads.

    Test cases:
    1. Basic injection (admin'-- )
    2. UNION-based injection
    3. Boolean-based blind injection
    4. Time-based blind injection
    """
    injection_payloads = [
        "admin'--",
        "' OR '1'='1",
        "' OR 1=1--",
        "' UNION SELECT NULL--",
        "'; DROP TABLE users;--",
        "admin' AND SLEEP(5)--"
    ]

    for payload in injection_payloads:
        response = client.get(f'/user?username={payload}')

        # Should return error, not data
        assert response.status_code in [400, 404], \
            f"Injection payload succeeded: {payload}"

        # Should not expose SQL errors
        assert 'SQL' not in response.data.decode()
        assert 'syntax error' not in response.data.decode()


def test_command_injection_protection():
    """Test OS command injection protection."""
    payloads = [
        "8.8.8.8; cat /etc/passwd",
        "8.8.8.8 && ls -la",
        "8.8.8.8 | whoami",
        "$(cat /etc/passwd)",
        "`cat /etc/passwd`"
    ]

    for payload in payloads:
        response = client.get(f'/ping?host={payload}')

        # Should reject invalid input
        assert response.status_code in [400, 403]

        # Should not contain command output
        assert 'root:' not in response.data.decode()
```

### Real-World Case Study

**TalkTalk Hack (2015)**

Attackers used SQL injection to breach TalkTalk's website, stealing personal data of 157,000 customers. The vulnerability was basic: unescaped user input in SQL queries.

**Lessons:**
- SQL injection is still common despite being well-known
- Basic parameterized queries would have prevented this
- Regular security testing is essential
- Impact: £400,000 fine, massive reputation damage

---

## 4. Insecure Design

### What is it?

Insecure design represents missing or ineffective security controls in the design phase. It's different from implementation bugs — these are fundamental architectural flaws where security wasn't adequately considered during design.

### Simple Analogy

Imagine designing a bank vault with a combination lock, but the combination is written on the door. Even if the lock itself is perfectly manufactured, the design is fundamentally insecure. Insecure design means the blueprint itself has security flaws.

### How it Works (The Problem)

```python
# INSECURE DESIGN: Password reset without rate limiting
@app.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Design flaw: No rate limiting or verification delays.

    Problems:
    1. Attacker can try thousands of reset codes
    2. No account lockout
    3. Codes might be predictable
    4. No monitoring of abuse
    """
    email = request.json['email']
    code = request.json['code']
    new_password = request.json['new_password']

    # Check if code matches
    stored_code = get_reset_code(email)
    if code == stored_code:
        update_password(email, new_password)
        return {"status": "success"}

    return {"error": "Invalid code"}, 400

# Attack scenario:
# 1. Request password reset for victim@example.com
# 2. Code is 6 digits (000000-999999)
# 3. Try all codes until one works
# 4. No rate limiting = easy brute force
```

### The Fix

```python
# SECURE DESIGN: Multiple layers of protection
from datetime import datetime, timedelta
from collections import defaultdict
import secrets

class PasswordResetManager:
    """
    Secure password reset with proper design.

    Security measures:
    1. Rate limiting (attempts per IP and per email)
    2. Code expiration
    3. Cryptographically secure codes
    4. Account lockout after failures
    5. Monitoring and alerting
    6. Multi-factor verification
    """

    def __init__(self):
        self.attempts = defaultdict(int)  # Track attempts per IP
        self.email_attempts = defaultdict(int)  # Track per email
        self.lockouts = {}  # Track locked accounts

    def request_reset(self, email: str, ip: str) -> dict:
        """
        Request password reset code.

        Rate limits:
        - 3 requests per hour per email
        - 10 requests per hour per IP
        """
        # Check if email is locked out
        if email in self.lockouts:
            lockout_end = self.lockouts[email]
            if datetime.now() < lockout_end:
                logger.warning(f"Reset requested for locked account: {email}")
                # Return same message (don't reveal lockout)
                return {"status": "If account exists, code sent"}

        # Check rate limits
        if self.email_attempts[email] >= 3:
            logger.warning(f"Rate limit exceeded for email: {email}")
            return {"error": "Too many requests, try again later"}, 429

        if self.attempts[ip] >= 10:
            logger.warning(f"Rate limit exceeded for IP: {ip}")
            return {"error": "Too many requests, try again later"}, 429

        # Generate secure code
        code = secrets.randbelow(1000000)  # 6-digit code
        code_hash = hash_code(code)

        # Store with expiration (15 minutes)
        store_reset_code(email, code_hash, expires=datetime.now() + timedelta(minutes=15))

        # Send code via email
        send_email(email, f"Your reset code: {code:06d}")

        # Increment attempt counters
        self.email_attempts[email] += 1
        self.attempts[ip] += 1

        logger.info(f"Password reset requested for {email} from {ip}")
        return {"status": "If account exists, code sent"}

    def verify_and_reset(self, email: str, code: str, new_password: str, ip: str) -> dict:
        """
        Verify code and reset password.

        Security measures:
        - Limited attempts before lockout
        - Code expiration
        - Timing-safe comparison
        - Audit logging
        """
        # Check if locked out
        if email in self.lockouts:
            lockout_end = self.lockouts[email]
            if datetime.now() < lockout_end:
                logger.warning(f"Reset attempt on locked account: {email}")
                return {"error": "Invalid code"}, 400

        # Get stored code
        stored = get_reset_code(email)
        if not stored:
            logger.warning(f"No reset code found for {email}")
            return {"error": "Invalid or expired code"}, 400

        # Check expiration
        if datetime.now() > stored['expires']:
            logger.info(f"Expired reset code used for {email}")
            delete_reset_code(email)
            return {"error": "Code expired"}, 400

        # Verify code (timing-safe comparison)
        code_hash = hash_code(int(code))
        if not secrets.compare_digest(code_hash, stored['code_hash']):
            # Increment failure count
            stored['attempts'] = stored.get('attempts', 0) + 1

            # Lock after 3 failures
            if stored['attempts'] >= 3:
                self.lockouts[email] = datetime.now() + timedelta(hours=1)
                delete_reset_code(email)
                logger.warning(f"Account locked after failed resets: {email}")
                return {"error": "Invalid code"}, 400

            update_reset_code(email, stored)
            logger.warning(f"Invalid reset code for {email} from {ip}")
            return {"error": "Invalid code"}, 400

        # Code is valid - reset password
        update_password(email, hash_password(new_password))
        delete_reset_code(email)

        # Clear from tracking
        if email in self.lockouts:
            del self.lockouts[email]

        logger.info(f"Password successfully reset for {email}")

        # Send notification email
        send_email(email, "Your password was reset")

        return {"status": "Password reset successful"}


# Usage in routes
reset_manager = PasswordResetManager()

@app.route('/reset-password/request', methods=['POST'])
def request_reset():
    email = request.json['email']
    ip = request.remote_addr
    return reset_manager.request_reset(email, ip)

@app.route('/reset-password/verify', methods=['POST'])
def verify_reset():
    email = request.json['email']
    code = request.json['code']
    new_password = request.json['new_password']
    ip = request.remote_addr
    return reset_manager.verify_and_reset(email, code, new_password, ip)
```

### Common Insecure Design Patterns

#### 1. Insufficient Anti-Automation

```python
# INSECURE: No protection against bots
@app.route('/create-account', methods=['POST'])
def create_account():
    # Attacker creates thousands of fake accounts
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    create_user(username, email, password)
    return {"status": "created"}

# SECURE: Multiple anti-automation measures
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/create-account', methods=['POST'])
@limiter.limit("3 per hour")  # Rate limit
def create_account():
    """
    Secure account creation with anti-automation.

    Protection layers:
    1. Rate limiting (3 accounts per hour per IP)
    2. CAPTCHA verification
    3. Email verification required
    4. Device fingerprinting
    5. Suspicious pattern detection
    """
    # Verify CAPTCHA
    captcha_response = request.json.get('captcha')
    if not verify_captcha(captcha_response):
        return {"error": "CAPTCHA verification failed"}, 400

    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    # Check for suspicious patterns
    if is_suspicious_signup(email, username, request.remote_addr):
        logger.warning(f"Suspicious signup attempt: {email}")
        # Still create account but mark for review
        flag_for_manual_review(email)

    # Create unverified account
    user = create_user(username, email, password, verified=False)

    # Send verification email
    verification_token = secrets.token_urlsafe(32)
    store_verification_token(user.id, verification_token)
    send_verification_email(email, verification_token)

    return {"status": "created", "message": "Please verify your email"}
```

#### 2. Trust Boundaries Not Defined

```python
# INSECURE DESIGN: Internal API assumes all calls are trusted
@app.route('/internal/promote-to-admin', methods=['POST'])
def promote_to_admin():
    """
    Design flaw: Assumes only internal services call this.

    Problem:
    - What if an attacker discovers this endpoint?
    - No authentication or authorization
    - "Security through obscurity"
    """
    user_id = request.json['user_id']
    update_user_role(user_id, 'admin')
    return {"status": "promoted"}

# SECURE DESIGN: Every endpoint has authentication
@app.route('/internal/promote-to-admin', methods=['POST'])
@require_internal_service_auth
def promote_to_admin():
    """
    Secure internal endpoint.

    Security measures:
    1. Service-to-service authentication (API key or JWT)
    2. IP allowlist (only internal network)
    3. Audit logging
    4. Rate limiting even for internal calls
    """
    user_id = request.json['user_id']

    # Additional authorization check
    if not current_service.has_permission('promote_admin'):
        logger.warning(
            f"Unauthorized admin promotion attempt by {current_service.name}"
        )
        return {"error": "Insufficient permissions"}, 403

    # Log the action
    logger.info(
        f"User {user_id} promoted to admin by service {current_service.name}"
    )

    update_user_role(user_id, 'admin')

    # Send alert for sensitive action
    send_admin_alert(f"New admin: {user_id}")

    return {"status": "promoted"}
```

#### 3. Business Logic Flaws

```python
# INSECURE DESIGN: Race condition in fund transfer
@app.route('/transfer', methods=['POST'])
def transfer_funds():
    """
    Design flaw: Race condition allows double-spending.

    Attack:
    1. Account has $100
    2. Submit two transfers of $100 simultaneously
    3. Both checks pass (balance >= 100)
    4. Both transfers execute
    5. Spent $200 with only $100 available
    """
    from_account = request.json['from']
    to_account = request.json['to']
    amount = request.json['amount']

    # Check balance
    balance = get_balance(from_account)
    if balance >= amount:
        # Problem: Another thread might execute here
        debit(from_account, amount)
        credit(to_account, amount)
        return {"status": "transferred"}

    return {"error": "Insufficient funds"}, 400

# SECURE DESIGN: Atomic transactions with proper locking
@app.route('/transfer', methods=['POST'])
def transfer_funds():
    """
    Secure fund transfer.

    Security measures:
    1. Database transaction (atomic)
    2. Row-level locking
    3. Balance check inside transaction
    4. Audit trail
    5. Idempotency key (prevent duplicate submissions)
    """
    from_account = request.json['from']
    to_account = request.json['to']
    amount = request.json['amount']
    idempotency_key = request.json['idempotency_key']

    # Check for duplicate request
    if is_duplicate_transfer(idempotency_key):
        logger.info(f"Duplicate transfer blocked: {idempotency_key}")
        return get_transfer_result(idempotency_key)

    # Authorization check
    if from_account != current_user.account_id:
        return {"error": "Unauthorized"}, 403

    try:
        with database.transaction():
            # Lock the from_account row
            balance = get_balance_for_update(from_account)

            # Check balance inside transaction
            if balance < amount:
                raise InsufficientFundsError()

            # Perform transfer (atomic)
            debit(from_account, amount)
            credit(to_account, amount)

            # Record transaction
            transaction_id = record_transfer(
                from_account, to_account, amount, idempotency_key
            )

            logger.info(
                f"Transfer completed: {amount} from {from_account} "
                f"to {to_account} (tx: {transaction_id})"
            )

            return {"status": "transferred", "transaction_id": transaction_id}

    except InsufficientFundsError:
        logger.info(f"Transfer failed: insufficient funds in {from_account}")
        return {"error": "Insufficient funds"}, 400
    except Exception as e:
        logger.error(f"Transfer failed: {e}")
        return {"error": "Transfer failed"}, 500
```

### Security Design Principles

#### 1. Defense in Depth
Multiple layers of security controls.

**Example:** Authentication requires:
- Something you know (password)
- Something you have (phone for 2FA)
- Something you are (biometric, optional)
- Where you are (IP reputation check)
- When you're accessing (unusual time alerts)

#### 2. Principle of Least Privilege
Grant minimum necessary permissions.

```python
# Example: Database user permissions
# WRONG: Application uses database admin account
# If SQL injection occurs, attacker has full database control

# RIGHT: Separate database users per function
database_users = {
    'app_readonly': ['SELECT'],  # For read operations
    'app_write': ['SELECT', 'INSERT', 'UPDATE'],  # For normal operations
    'app_admin': ['ALL'],  # Only for admin operations
}

# Application uses appropriate user per operation
def get_user(user_id):
    with db.connect(user='app_readonly') as conn:
        return conn.execute("SELECT * FROM users WHERE id = ?", (user_id,))

def update_user(user_id, data):
    with db.connect(user='app_write') as conn:
        return conn.execute("UPDATE users SET name = ? WHERE id = ?",
                          (data['name'], user_id))
```

#### 3. Fail Securely
When errors occur, fail to a secure state.

```python
# Example: Secure error handling
@app.route('/admin/delete-user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Secure deletion with safe error handling.

    Design principle:
    - On error, don't delete (safer to fail closed)
    - Don't expose error details to user
    - Log everything for investigation
    """
    try:
        # Check authorization
        if not current_user.is_admin:
            # Fail securely: deny access
            logger.warning(
                f"Unauthorized delete attempt by {current_user.id}"
            )
            abort(403)

        # Verify user exists
        user = get_user(user_id)
        if not user:
            abort(404)

        # Perform deletion
        database.delete_user(user_id)

        logger.info(f"User {user_id} deleted by admin {current_user.id}")
        return {"status": "deleted"}

    except DatabaseError as e:
        # Fail securely: don't delete if database error
        logger.error(f"Failed to delete user {user_id}: {e}")
        # Don't expose database error details
        return {"error": "Operation failed"}, 500

    except Exception as e:
        # Unexpected error: fail securely
        logger.error(f"Unexpected error deleting user {user_id}: {e}")
        return {"error": "Operation failed"}, 500
```

### Best Practices

1. **Threat Modeling During Design:** Identify risks before coding
2. **Secure by Default:** Opt-in for less secure options, not opt-out
3. **Use Battle-Tested Patterns:** Don't invent new security mechanisms
4. **Assume Breach:** Design with the assumption that components will be compromised
5. **Security Reviews:** Review designs with security focus before implementation

### Testing for Insecure Design

Insecure design requires thinking like an attacker during the design phase:

```python
# Example: Security design review checklist

class SecurityDesignReview:
    """
    Checklist for security design reviews.

    Use this before implementing new features.
    """

    @staticmethod
    def review_authentication():
        """
        Authentication design review questions.
        """
        return [
            "Is multi-factor authentication supported?",
            "Are there rate limits on login attempts?",
            "Is there account lockout after failed attempts?",
            "Are passwords hashed with strong algorithm (bcrypt, etc.)?",
            "Is there session timeout?",
            "Can users see active sessions and revoke them?",
            "Is there protection against password spraying?",
            "Are there alerts for suspicious login activity?"
        ]

    @staticmethod
    def review_authorization():
        """
        Authorization design review questions.
        """
        return [
            "Is authorization checked on every request?",
            "Is authorization server-side (not client-side only)?",
            "Does authorization check the specific resource, not just type?",
            "Is there proper separation of regular and admin functions?",
            "Are there audit logs for authorization failures?",
            "Is least privilege principle applied?",
            "Can users access only their own data?",
            "Are there tests for horizontal privilege escalation?"
        ]

    @staticmethod
    def review_business_logic():
        """
        Business logic design review questions.
        """
        return [
            "Are there race conditions in state changes?",
            "Are operations atomic where needed?",
            "Is there protection against double-submission?",
            "Are there limits on resource consumption?",
            "Is there validation of business rules?",
            "Can users manipulate prices or amounts?",
            "Are there checks for unusual patterns?",
            "Is there protection against automated abuse?"
        ]
```

### Real-World Case Study

**Optus Data Breach (2022)**

Attackers accessed an API endpoint that was designed to allow unauthenticated access to customer data when provided with valid IDs. The design flaw: authentication wasn't required, only knowledge of customer IDs.

**Lessons:**
- Authentication should be required for all sensitive data access
- "Security through obscurity" (hidden endpoints) doesn't work
- Regular security design reviews could have caught this
- Impact: 9.8 million customer records exposed

---

## 5. Security Misconfiguration

### What is it?

Security misconfiguration occurs when security settings are not properly implemented, maintained, or when default configurations (which are often insecure) are left unchanged. This can happen at any level: application, server, database, cloud services, or APIs.

### Simple Analogy

Imagine buying a home security system but leaving the default password as "1234", never updating the software, and leaving a spare key under the doormat. The security system itself is fine, but your configuration makes it useless.

### How it Works (The Problem)

```python
# MISCONFIGURATION: Debug mode enabled in production
from flask import Flask

app = Flask(__name__)

# DANGEROUS: Debug mode in production
app.config['DEBUG'] = True
app.config['TESTING'] = True

# Problems this causes:
# 1. Detailed error messages expose code structure
# 2. Interactive debugger allows code execution
# 3. Automatic reloader can cause race conditions
# 4. Sensitive configuration visible

@app.route('/crash')
def crash():
    return undefined_variable  # Causes error

# With DEBUG=True, error page shows:
# - Full stack trace
# - Source code
# - Local variables (may include passwords, tokens)
# - Interactive Python console (!!!!)
```

### The Fix

```python
# SECURE CONFIGURATION: Environment-based settings
import os
from flask import Flask

app = Flask(__name__)

# Load configuration based on environment
ENV = os.getenv('FLASK_ENV', 'production')

if ENV == 'development':
    app.config.from_object('config.DevelopmentConfig')
elif ENV == 'testing':
    app.config.from_object('config.TestingConfig')
else:
    app.config.from_object('config.ProductionConfig')


# config.py
class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY environment variable not set")

    # Security headers
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    # Disable unnecessary features
    SEND_FILE_MAX_AGE_DEFAULT = 31536000  # Cache static files


class ProductionConfig(Config):
    """
    Production configuration.

    Security principles:
    - Debug mode OFF
    - Detailed errors OFF
    - Logging to external service
    - Secrets from environment variables
    """
    DEBUG = False
    TESTING = False

    # Don't expose detailed errors
    PROPAGATE_EXCEPTIONS = False

    # Database connection
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

    # Logging
    LOG_LEVEL = 'INFO'


class DevelopmentConfig(Config):
    """Development configuration - more permissive."""
    DEBUG = True
    TESTING = True

    # Use local database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'

    LOG_LEVEL = 'DEBUG'


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True

    # In-memory database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
```

### Common Misconfiguration Types

#### 1. Default Credentials

```python
# VULNERABLE: Default/hardcoded credentials
database_config = {
    'host': 'localhost',
    'user': 'admin',  # Default username
    'password': 'admin',  # Default password
    'database': 'myapp'
}

# Attackers try common defaults:
# admin/admin, root/root, admin/password, etc.

# SECURE: Credentials from secure storage
import os
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

def get_database_config():
    """
    Load database credentials from Azure Key Vault.

    Security measures:
    - No credentials in code
    - Credentials rotated regularly
    - Access logged and audited
    - Managed identity for auth (no secrets)
    """
    credential = DefaultAzureCredential()
    vault_url = os.getenv('KEY_VAULT_URL')
    client = SecretClient(vault_url=vault_url, credential=credential)

    return {
        'host': client.get_secret('db-host').value,
        'user': client.get_secret('db-user').value,
        'password': client.get_secret('db-password').value,
        'database': client.get_secret('db-name').value
    }
```

#### 2. Overly Permissive CORS

```python
# VULNERABLE: Allow all origins
from flask_cors import CORS

# BAD: Any website can make requests to your API
CORS(app, resources={r"/*": {"origins": "*"}})

# This allows malicious sites to:
# - Read user data from your API
# - Make requests on behalf of users
# - Steal session tokens

# SECURE: Restrictive CORS policy
from flask_cors import CORS

# Allowlist of trusted origins
allowed_origins = [
    'https://yourapp.com',
    'https://app.yourapp.com',
    'https://admin.yourapp.com'
]

# Configure CORS properly
CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["X-Total-Count"],
        "supports_credentials": True,
        "max_age": 600  # Cache preflight requests for 10 minutes
    }
})

# Don't allow CORS on sensitive endpoints
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    # No CORS configured for admin endpoints
    if not current_user.is_admin:
        abort(403)
    return jsonify(get_users())
```

#### 3. Directory Listing Enabled

```python
# VULNERABLE: Directory listing exposed
# Apache/Nginx misconfiguration shows file listings
# http://example.com/uploads/ shows all uploaded files

# Nginx secure configuration
"""
server {
    listen 80;
    server_name example.com;

    # Disable directory listing
    autoindex off;

    # Restrict access to sensitive files
    location ~ /\. {
        deny all;  # Block .git, .env, etc.
    }

    location ~* \.(log|sql|conf)$ {
        deny all;  # Block sensitive file types
    }

    # Application
    location / {
        proxy_pass http://app:5000;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    }

    # Static files (separate location, still no listing)
    location /static {
        alias /var/www/static;
        autoindex off;
    }
}
"""
```

#### 4. Unnecessary Services Enabled

```python
# VULNERABLE: Expose unnecessary functionality
@app.route('/debug/info')
def debug_info():
    """
    Exposes system information.

    Problem: This shouldn't exist in production!
    """
    import sys
    import platform

    return jsonify({
        'python_version': sys.version,
        'platform': platform.platform(),
        'environment': dict(os.environ),  # DANGER: Exposes secrets!
        'config': dict(app.config)  # DANGER: Exposes configuration!
    })

# SECURE: Remove or protect debug endpoints
@app.route('/health')
def health_check():
    """
    Simple health check endpoint.

    Only returns minimal information:
    - Application is running
    - Database is reachable
    - No sensitive information
    """
    try:
        # Test database connection
        database.execute('SELECT 1')
        db_status = 'ok'
    except Exception:
        db_status = 'error'

    return jsonify({
        'status': 'ok' if db_status == 'ok' else 'degraded',
        'timestamp': datetime.now().isoformat()
    })


# Debug endpoints only in development
if app.config['DEBUG']:
    @app.route('/debug/routes')
    def debug_routes():
        """Development only: Show all routes."""
        import urllib
        output = []
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            output.append(f"{rule.endpoint}: {methods} {rule.rule}")
        return jsonify(output)
```

#### 5. Missing Security Headers

```python
# VULNERABLE: No security headers
@app.route('/page')
def page():
    return render_template('page.html')

# Missing headers allow:
# - Clickjacking attacks (no X-Frame-Options)
# - MIME type attacks (no X-Content-Type-Options)
# - XSS attacks (no Content-Security-Policy)

# SECURE: Comprehensive security headers
@app.after_request
def set_security_headers(response):
    """
    Set security headers on all responses.

    Headers explained:
    - X-Frame-Options: Prevents clickjacking
    - X-Content-Type-Options: Prevents MIME sniffing
    - X-XSS-Protection: Enables browser XSS filter
    - Strict-Transport-Security: Forces HTTPS
    - Content-Security-Policy: Controls resource loading
    - Referrer-Policy: Controls referrer information
    - Permissions-Policy: Controls browser features
    """
    # Prevent clickjacking
    response.headers['X-Frame-Options'] = 'DENY'

    # Prevent MIME sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'

    # Enable XSS filter
    response.headers['X-XSS-Protection'] = '1; mode=block'

    # Force HTTPS (1 year)
    response.headers['Strict-Transport-Security'] = \
        'max-age=31536000; includeSubDomains; preload'

    # Content Security Policy
    response.headers['Content-Security-Policy'] = \
        "default-src 'self'; " \
        "script-src 'self' 'unsafe-inline' https://cdn.example.com; " \
        "style-src 'self' 'unsafe-inline'; " \
        "img-src 'self' data: https:; " \
        "font-src 'self'; " \
        "connect-src 'self'; " \
        "frame-ancestors 'none';"

    # Control referrer information
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

    # Disable unnecessary browser features
    response.headers['Permissions-Policy'] = \
        'geolocation=(), microphone=(), camera=()'

    return response
```

### Cloud Service Misconfiguration

#### AWS S3 Bucket Misconfiguration

```python
# VULNERABLE: Public S3 bucket
"""
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",  # Anyone can access!
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-bucket/*"
        }
    ]
}
"""

# SECURE: Restricted S3 bucket
"""
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::my-bucket",
                "arn:aws:s3:::my-bucket/*"
            ],
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"  # Deny non-HTTPS
                }
            }
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/AppRole"  # Specific role
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::my-bucket/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": ["10.0.0.0/16"]  # Only from VPC
                }
            }
        }
    ]
}
"""

# Application code with secure access
import boto3

def upload_file_securely(file_path, bucket_name, object_name):
    """
    Upload file to S3 with proper configuration.

    Security measures:
    - Use IAM role (no hardcoded credentials)
    - Server-side encryption
    - Private ACL
    - Metadata for tracking
    """
    s3_client = boto3.client('s3')

    try:
        s3_client.upload_file(
            file_path,
            bucket_name,
            object_name,
            ExtraArgs={
                'ServerSideEncryption': 'AES256',  # Encrypt at rest
                'ACL': 'private',  # Not public
                'Metadata': {
                    'uploaded-by': current_user.id,
                    'uploaded-at': datetime.now().isoformat()
                }
            }
        )
        logger.info(f"File uploaded: {object_name} by {current_user.id}")
        return True
    except Exception as e:
        logger.error(f"Failed to upload file: {e}")
        return False
```

### Configuration Management

```python
# Example: Secure configuration management
import os
import json
from typing import Dict, Any

class SecureConfig:
    """
    Secure configuration management.

    Principles:
    - No secrets in code
    - Environment-specific settings
    - Validation of required settings
    - Immutable after initialization
    """

    def __init__(self, env: str = 'production'):
        self.env = env
        self._config = {}
        self._load_config()
        self._validate_config()
        self._frozen = True

    def _load_config(self):
        """Load configuration from environment variables."""
        required = [
            'SECRET_KEY',
            'DATABASE_URL',
            'API_KEY',
            'REDIS_URL'
        ]

        for key in required:
            value = os.getenv(key)
            if not value and self.env == 'production':
                raise ValueError(f"Required config missing: {key}")
            self._config[key] = value

        # Load optional settings with defaults
        self._config['DEBUG'] = os.getenv('DEBUG', 'false').lower() == 'true'
        self._config['LOG_LEVEL'] = os.getenv('LOG_LEVEL', 'INFO')
        self._config['MAX_UPLOAD_SIZE'] = int(os.getenv('MAX_UPLOAD_SIZE', '10485760'))

    def _validate_config(self):
        """Validate configuration values."""
        # Check debug mode
        if self.env == 'production' and self._config['DEBUG']:
            raise ValueError("DEBUG must be False in production")

        # Check secret key strength
        secret_key = self._config['SECRET_KEY']
        if secret_key and len(secret_key) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")

        # Validate URLs
        database_url = self._config['DATABASE_URL']
        if database_url and not database_url.startswith(('postgresql://', 'mysql://')):
            raise ValueError("Invalid DATABASE_URL format")

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value."""
        return self._config.get(key, default)

    def __setattr__(self, name: str, value: Any):
        """Prevent modification after initialization."""
        if hasattr(self, '_frozen') and self._frozen:
            raise AttributeError("Configuration is immutable")
        super().__setattr__(name, value)


# Usage
config = SecureConfig(env=os.getenv('ENVIRONMENT', 'production'))
app.config['SECRET_KEY'] = config.get('SECRET_KEY')
```

### Best Practices

1. **Least Privilege:** Grant minimum necessary permissions
2. **Secure Defaults:** Configuration should be secure out-of-the-box
3. **Regular Audits:** Periodically review configurations
4. **Automated Checks:** Use tools to detect misconfigurations
5. **Documentation:** Document security settings and rationale
6. **Separation:** Different credentials per environment

### Security Configuration Checklist

```markdown
Application Configuration
- [ ] Debug mode disabled in production
- [ ] Error messages don't expose sensitive information
- [ ] Default credentials changed
- [ ] Unnecessary features disabled
- [ ] Security headers configured
- [ ] Session configuration secure (HttpOnly, Secure, SameSite)
- [ ] CORS policy restrictive
- [ ] File upload restrictions configured

Server Configuration
- [ ] Directory listing disabled
- [ ] Unnecessary services disabled
- [ ] TLS/SSL properly configured (strong ciphers only)
- [ ] HTTP redirects to HTTPS
- [ ] Access logs enabled
- [ ] Error logs don't contain sensitive data
- [ ] Default pages removed
- [ ] Server version hidden

Database Configuration
- [ ] Default credentials changed
- [ ] Remote access restricted
- [ ] Least privilege for application user
- [ ] Backups encrypted
- [ ] Audit logging enabled
- [ ] Prepared statements enforced
- [ ] Connection encryption enforced

Cloud Configuration
- [ ] Storage buckets not public
- [ ] IAM roles follow least privilege
- [ ] Encryption at rest enabled
- [ ] Encryption in transit enforced
- [ ] Network segmentation configured
- [ ] Security groups restrictive
- [ ] Logging and monitoring enabled
- [ ] MFA enabled for admin access

Dependency Configuration
- [ ] Dependencies up to date
- [ ] Vulnerability scanning enabled
- [ ] Unused dependencies removed
- [ ] Dependencies from trusted sources
- [ ] License compliance verified
```

### Real-World Case Study

**Capital One Breach (2019)**

A misconfigured web application firewall (WAF) allowed an attacker to access the underlying infrastructure. The attacker then found overly permissive IAM roles that allowed listing and reading S3 buckets.

**Misconfigurations:**
1. WAF rule incorrectly configured
2. IAM role had excessive permissions
3. S3 buckets accessible with stolen credentials
4. No alerts for unusual data access patterns

**Impact:** 100 million customer records exposed

**Lessons:**
- Multiple layers of misconfiguration compounded
- Least privilege principle not followed
- Need for configuration validation tools
- Importance of monitoring for unusual access patterns

---

## 6. Vulnerable and Outdated Components

### What is it?

This vulnerability occurs when applications use libraries, frameworks, or other software components with known security vulnerabilities. It also includes using outdated or unsupported versions of components that no longer receive security updates.

### Simple Analogy

Imagine your car has a recall for faulty brakes, but you never take it to the dealer for the fix. The car still runs, but you're driving with a known safety issue. Vulnerable components are like driving with recalled parts — the fix exists, but you haven't applied it.

### How it Works (The Attack)

```python
# VULNERABLE: Using outdated packages
# requirements.txt
"""
Flask==0.12.0  # Released 2017, many known vulnerabilities
requests==2.6.0  # Very old version, security issues
Pillow==5.0.0  # Image processing, known CVEs
SQLAlchemy==0.9.0  # Old ORM version
"""

# Attackers scan for known vulnerabilities:
# 1. Identify versions being used (error messages, headers, etc.)
# 2. Look up CVE (Common Vulnerabilities and Exposures) database
# 3. Use public exploit code
# 4. Compromise application

# Example vulnerable code
from flask import Flask, request
import pickle  # Dangerous with untrusted data

app = Flask(__name__)

@app.route('/load', methods=['POST'])
def load_data():
    # DANGEROUS: Unpickling untrusted data (CVE-2020-XXXX)
    data = pickle.loads(request.data)
    return f"Loaded: {data}"

# Attacker sends malicious pickle:
# Executes arbitrary code on server!
```

### The Fix

```python
# SECURE: Keep dependencies updated
# requirements.txt
"""
Flask==3.0.0
requests==2.31.0
Pillow==10.2.0
SQLAlchemy==2.0.25
safety==3.0.1  # Checks for known vulnerabilities
"""

# Use dependency scanning
"""
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/python-3.8@master
        with:
          args: --severity-threshold=high

      - name: Run Safety check
        run: |
          pip install safety
          safety check --json
"""

# Secure alternative to pickle
import json
from typing import Any

@app.route('/load', methods=['POST'])
def load_data():
    """
    Secure data loading.

    Security measures:
    - Use JSON instead of pickle (no code execution)
    - Validate data structure
    - Type checking
    """
    try:
        # JSON is safe (no arbitrary code execution)
        data = json.loads(request.data)

        # Validate structure
        if not isinstance(data, dict):
            return {"error": "Invalid data format"}, 400

        # Validate required fields
        required_fields = ['type', 'value']
        if not all(field in data for field in required_fields):
            return {"error": "Missing required fields"}, 400

        return {"status": "loaded", "data": data}

    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}, 400
```

### Common Vulnerable Component Scenarios

#### 1. Known CVE Exploitation

```python
# VULNERABLE: Old version with known vulnerability
# Using Pillow 5.0.0 with CVE-2018-16509
from PIL import Image

@app.route('/resize', methods=['POST'])
def resize_image():
    file = request.files['image']
    img = Image.open(file)
    img = img.resize((800, 600))
    # Old Pillow version vulnerable to buffer overflow
    # Attacker sends crafted image -> code execution

# SECURE: Update to patched version
# requirements.txt: Pillow>=10.2.0
from PIL import Image

@app.route('/resize', methods=['POST'])
def resize_image():
    """
    Secure image resizing.

    Security measures:
    - Updated library (no known CVEs)
    - File type validation
    - Size limits
    - Error handling
    """
    file = request.files.get('image')
    if not file:
        return {"error": "No file provided"}, 400

    # Validate file type
    if not file.content_type.startswith('image/'):
        return {"error": "File must be an image"}, 400

    # Size limit (10MB)
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning

    if size > 10 * 1024 * 1024:
        return {"error": "File too large"}, 400

    try:
        img = Image.open(file)

        # Validate image (catches malformed images)
        img.verify()

        # Re-open after verify
        file.seek(0)
        img = Image.open(file)

        # Resize safely
        img = img.resize((800, 600), Image.Resampling.LANCZOS)

        # Save to secure location
        output_path = f"/secure/uploads/{secrets.token_hex(16)}.jpg"
        img.save(output_path)

        return {"status": "resized", "path": output_path}

    except Exception as e:
        logger.error(f"Image processing failed: {e}")
        return {"error": "Failed to process image"}, 500
```

#### 2. Transitive Dependencies

```python
# VULNERABLE: Direct dependencies are updated, but their dependencies aren't
"""
Your application uses:
- package-a==2.0.0 (updated, secure)
  └─ package-b==1.0.0 (not updated, vulnerable!)
      └─ package-c==0.5.0 (very old, critical CVE!)

You updated package-a, but didn't check its dependencies.
"""

# SECURE: Check entire dependency tree
"""
# Use pip-audit or safety to check all dependencies
pip install pip-audit
pip-audit

# Output shows all vulnerabilities, including transitive:
# package-c (0.5.0) has vulnerability CVE-2023-XXXX
# Installed as dependency of: package-b -> package-a

# Fix: Update package-a to version that uses secure dependencies
# Or explicitly pin secure versions of transitive dependencies
"""

# Automated dependency management
"""
# dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    # Auto-update security patches
    labels:
      - "dependencies"
      - "security"
"""
```

#### 3. Abandoned Packages

```python
# VULNERABLE: Using unmaintained package
"""
# requirements.txt
some-old-package==1.0.0  # Last updated 2015, no longer maintained

Problems:
- No security patches
- May not work with modern Python
- Compatibility issues
- No community support
"""

# SECURE: Find maintained alternatives
"""
Before adding dependency, check:
1. Last update date (within 1 year)
2. Number of maintainers (multiple is better)
3. Issue response time
4. Download statistics (active use)
5. Alternative packages

Example: Replacing abandoned package
Old: some-old-package (last update 2015)
New: modern-alternative (actively maintained)
"""

class DependencyEvaluator:
    """
    Evaluate if a package is safe to use.

    Checks:
    - Update frequency
    - Known vulnerabilities
    - Maintainer activity
    - Community size
    """

    @staticmethod
    def check_package(package_name: str) -> dict:
        """
        Check package health.

        Returns security assessment.
        """
        import requests
        from datetime import datetime, timedelta

        # Get package info from PyPI
        response = requests.get(f"https://pypi.org/pypi/{package_name}/json")
        if response.status_code != 200:
            return {"status": "error", "message": "Package not found"}

        data = response.json()
        info = data['info']
        releases = data['releases']

        # Check last release date
        if releases:
            latest_version = info['version']
            latest_release = releases[latest_version][0]['upload_time']
            release_date = datetime.fromisoformat(latest_release.replace('Z', '+00:00'))
            days_old = (datetime.now(release_date.tzinfo) - release_date).days
        else:
            days_old = 999999

        # Evaluate
        status = {
            'package': package_name,
            'version': info.get('version'),
            'last_updated_days': days_old,
            'maintainers': len(info.get('maintainer_email', '').split(',')),
            'warnings': []
        }

        if days_old > 365:
            status['warnings'].append(f"Not updated in {days_old} days")

        if not info.get('home_page'):
            status['warnings'].append("No homepage/repository")

        # Check for known vulnerabilities (simplified)
        # In production, use proper vulnerability database
        vulns = check_vulnerabilities(package_name, info['version'])
        if vulns:
            status['warnings'].append(f"Known vulnerabilities: {len(vulns)}")
            status['vulnerabilities'] = vulns

        return status
```

### Best Practices

1. **Maintain Inventory:** Know all components you use (including transitive dependencies)
2. **Monitor CVEs:** Subscribe to security advisories for your dependencies
3. **Automate Updates:** Use Dependabot, Renovate, or similar tools
4. **Scan Regularly:** Use tools like Snyk, Safety, or npm audit
5. **Test Updates:** Have good test coverage to catch breaking changes
6. **Remove Unused:** Delete dependencies you no longer need

### Dependency Management Strategy

```python
# Example: Comprehensive dependency management

# 1. Pin exact versions (requirements.txt)
"""
# Generated from: pip freeze
Flask==3.0.0
requests==2.31.0
cryptography==41.0.7
"""

# 2. Separate development dependencies (requirements-dev.txt)
"""
pytest==7.4.3
black==23.12.1
mypy==1.7.1
safety==3.0.1
"""

# 3. Use dependency groups (pyproject.toml with Poetry)
"""
[tool.poetry.dependencies]
python = "^3.11"
flask = "^3.0.0"
requests = "^2.31.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.3"
black = "^23.12.1"

[tool.poetry.group.security.dependencies]
safety = "^3.0.1"
bandit = "^1.7.5"
"""

# 4. Automated security checks (pre-commit hook)
"""
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: safety-check
        name: Safety vulnerability check
        entry: safety check --json
        language: system
        pass_filenames: false

      - id: bandit
        name: Bandit security check
        entry: bandit -r src/
        language: system
        pass_filenames: false
"""

# 5. CI/CD security scanning
"""
# .github/workflows/security.yml
name: Security Checks

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install safety pip-audit

      - name: Run Safety check
        run: safety check --json

      - name: Run pip-audit
        run: pip-audit

      - name: Run Snyk
        uses: snyk/actions/python-3.9@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: test
          args: --severity-threshold=high

      - name: Upload results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: snyk.sarif
"""
```

### Testing for Vulnerable Components

```bash
# Manual checks
pip list --outdated  # Show outdated packages
pip-audit  # Check for vulnerabilities
safety check  # Another vulnerability checker
npm audit  # For Node.js projects

# Automated in CI/CD
# Fail build if high-severity vulnerabilities found
safety check --exit-code 1 --severity high

# Generate report
safety check --output json > vulnerability-report.json
```

### Real-World Case Study

**Equifax Breach (2017)**

Equifax used Apache Struts with a known vulnerability (CVE-2017-5638). A patch was available for 2 months, but Equifax didn't apply it. Attackers exploited this vulnerability to access 147 million records.

**Timeline:**
- March 7: Vulnerability disclosed, patch available
- March 9: US-CERT issues alert
- Mid-May: Equifax breached (2+ months after patch)
- July 29: Breach discovered
- September 7: Public disclosure

**Lessons:**
- Have process to apply security patches quickly
- Inventory all components to know what needs updating
- Automated scanning would have detected this
- Cost: $1.4 billion in settlements and remediation

---

## 7. Identification and Authentication Failures

### What is it?

Authentication failures occur when functions related to user identity, authentication, or session management are implemented incorrectly, allowing attackers to compromise passwords, keys, session tokens, or exploit other implementation flaws to assume other users' identities.

### Simple Analogy

Imagine a nightclub where the bouncer:
- Accepts fake IDs
- Lets people share wristbands
- Never checks if the person leaving is the same as who entered
- Accepts "I'm on the list" without checking

That's authentication failure — the identity verification system is broken.

### How it Works (The Attack)

```python
# VULNERABLE: Weak authentication
from flask import Flask, request, session

@app.route('/login', methods=['POST'])
def login():
    """
    Multiple authentication problems:
    1. No rate limiting (brute force possible)
    2. No password complexity requirements
    3. Weak session management
    4. No account lockout
    """
    username = request.form['username']
    password = request.form['password']

    # Query database (simplified)
    user = database.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        (username, password)  # Plain text password!
    )

    if user:
        session['user_id'] = user['id']  # Weak session
        return "Login successful"

    return "Login failed"

# Attack scenarios:
# 1. Brute force: Try millions of password combinations
# 2. Credential stuffing: Use leaked passwords from other sites
# 3. Session hijacking: Steal weak session cookies
```

### The Fix

```python
# SECURE: Robust authentication
import bcrypt
import secrets
from datetime import datetime, timedelta
from collections import defaultdict
from flask import Flask, request, session, abort

class AuthenticationManager:
    """
    Secure authentication with multiple protections.

    Security measures:
    1. Password hashing with bcrypt
    2. Rate limiting per IP and per username
    3. Account lockout after failures
    4. Secure session management
    5. Multi-factor authentication support
    6. Audit logging
    """

    def __init__(self):
        self.failed_attempts = defaultdict(int)  # Track by IP
        self.username_attempts = defaultdict(int)  # Track by username
        self.lockouts = {}  # Locked accounts
        self.sessions = {}  # Active sessions

    def login(self, username: str, password: str, ip: str, mfa_code: str = None) -> dict:
        """
        Secure login with comprehensive checks.

        Returns:
        - Success: {"status": "success", "token": "..."}
        - MFA required: {"status": "mfa_required", "temp_token": "..."}
        - Failure: {"status": "error", "message": "..."}
        """
        # Input validation
        if not username or not password:
            return {"status": "error", "message": "Invalid credentials"}, 400

        # Check rate limiting (10 attempts per hour per IP)
        if self.failed_attempts[ip] >= 10:
            logger.warning(f"Rate limit exceeded for IP: {ip}")
            return {"status": "error", "message": "Too many attempts"}, 429

        # Check username rate limiting (5 attempts per hour)
        if self.username_attempts[username] >= 5:
            logger.warning(f"Rate limit exceeded for username: {username}")
            return {"status": "error", "message": "Too many attempts"}, 429

        # Check if account is locked
        if username in self.lockouts:
            lockout_end = self.lockouts[username]
            if datetime.now() < lockout_end:
                remaining = (lockout_end - datetime.now()).seconds // 60
                logger.warning(f"Login attempt for locked account: {username}")
                # Don't reveal account is locked
                return {"status": "error", "message": "Invalid credentials"}, 401

        # Get user from database
        user = database.query(
            "SELECT id, username, password_hash, mfa_enabled FROM users WHERE username = ?",
            (username,)
        )

        if not user:
            # User doesn't exist
            self._record_failure(username, ip)
            # Don't reveal whether username exists
            return {"status": "error", "message": "Invalid credentials"}, 401

        # Verify password (timing-safe comparison)
        if not bcrypt.checkpw(password.encode(), user['password_hash'].encode()):
            self._record_failure(username, ip)
            logger.warning(f"Failed login for {username} from {ip}")
            return {"status": "error", "message": "Invalid credentials"}, 401

        # Password correct - check if MFA required
        if user['mfa_enabled']:
            if not mfa_code:
                # Generate temporary token for MFA step
                temp_token = secrets.token_urlsafe(32)
                self._store_mfa_pending(user['id'], temp_token)
                return {
                    "status": "mfa_required",
                    "temp_token": temp_token
                }

            # Verify MFA code
            if not self._verify_mfa_code(user['id'], mfa_code):
                self._record_failure(username, ip)
                logger.warning(f"Invalid MFA code for {username}")
                return {"status": "error", "message": "Invalid MFA code"}, 401

        # Authentication successful
        session_token = self._create_session(user['id'], ip)

        # Clear failure counters
        self.failed_attempts[ip] = 0
        self.username_attempts[username] = 0
        if username in self.lockouts:
            del self.lockouts[username]

        logger.info(f"Successful login: {username} from {ip}")

        return {
            "status": "success",
            "token": session_token,
            "user_id": user['id']
        }

    def _record_failure(self, username: str, ip: str):
        """Record failed login attempt."""
        self.failed_attempts[ip] += 1
        self.username_attempts[username] += 1

        # Lock account after 5 failed attempts
        if self.username_attempts[username] >= 5:
            self.lockouts[username] = datetime.now() + timedelta(hours=1)
            logger.warning(f"Account locked: {username}")

            # Send email notification
            user = database.get_user_by_username(username)
            if user:
                send_email(
                    user['email'],
                    "Account Locked",
                    f"Your account was locked due to multiple failed login attempts. "
                    f"It will be unlocked in 1 hour."
                )

    def _create_session(self, user_id: int, ip: str) -> str:
        """
        Create secure session.

        Security features:
        - Cryptographically random token
        - Expiration time
        - IP binding
        - Device fingerprint
        """
        session_token = secrets.token_urlsafe(32)

        session_data = {
            'user_id': user_id,
            'created_at': datetime.now(),
            'expires_at': datetime.now() + timedelta(hours=24),
            'ip': ip,
            'last_activity': datetime.now()
        }

        # Store in database (or Redis)
        database.store_session(session_token, session_data)

        self.sessions[session_token] = session_data

        return session_token

    def verify_session(self, token: str, ip: str) -> dict:
        """
        Verify session is valid.

        Checks:
        - Token exists
        - Not expired
        - IP matches (optional, configurable)
        - Recent activity
        """
        session_data = database.get_session(token)

        if not session_data:
            return None

        # Check expiration
        if datetime.now() > session_data['expires_at']:
            database.delete_session(token)
            return None

        # Check IP (optional - can break with dynamic IPs)
        # if ip != session_data['ip']:
        #     logger.warning(f"Session IP mismatch: {token}")
        #     return None

        # Update last activity
        session_data['last_activity'] = datetime.now()
        database.update_session(token, session_data)

        return session_data

    def _verify_mfa_code(self, user_id: int, code: str) -> bool:
        """
        Verify TOTP MFA code.

        Uses time-based one-time password (Google Authenticator, etc.)
        """
        import pyotp

        user = database.get_user(user_id)
        if not user or not user['mfa_secret']:
            return False

        totp = pyotp.TOTP(user['mfa_secret'])
        return totp.verify(code, valid_window=1)  # Allow 30s clock drift


# Usage in routes
auth_manager = AuthenticationManager()

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    mfa_code = request.json.get('mfa_code')
    ip = request.remote_addr

    return auth_manager.login(username, password, ip, mfa_code)


@app.route('/api/protected')
def protected_resource():
    """Protected endpoint requiring valid session."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')

    session_data = auth_manager.verify_session(token, request.remote_addr)

    if not session_data:
        return {"error": "Unauthorized"}, 401

    # Request is authenticated
    return {"data": "secret information"}
```

### Common Authentication Failures

#### 1. Weak Password Policy

```python
# VULNERABLE: Accepts weak passwords
def register_user(username, password, email):
    # No password requirements!
    user = create_user(username, password, email)
    return user

# Users can set:
# - "123456"
# - "password"
# - Their username as password

# SECURE: Strong password policy
import re
from typing import List, Tuple

class PasswordValidator:
    """
    Validate password strength.

    Requirements:
    - Minimum 12 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    - Not in common password list
    - Not similar to username/email
    """

    # Common passwords to block
    COMMON_PASSWORDS = {
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey'
    }

    @classmethod
    def validate(cls, password: str, username: str = '', email: str = '') -> Tuple[bool, List[str]]:
        """
        Validate password meets requirements.

        Returns:
        - (True, []) if valid
        - (False, [list of errors]) if invalid
        """
        errors = []

        # Length check
        if len(password) < 12:
            errors.append("Password must be at least 12 characters")

        # Uppercase check
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")

        # Lowercase check
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")

        # Number check
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one number")

        # Special character check
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")

        # Common password check
        if password.lower() in cls.COMMON_PASSWORDS:
            errors.append("Password is too common")

        # Username similarity check
        if username and username.lower() in password.lower():
            errors.append("Password cannot contain username")

        # Email similarity check
        if email:
            email_local = email.split('@')[0].lower()
            if email_local in password.lower():
                errors.append("Password cannot contain email")

        # Check against haveibeenpwned database (optional)
        if cls._check_pwned_password(password):
            errors.append("Password has been exposed in a data breach")

        return (len(errors) == 0, errors)

    @staticmethod
    def _check_pwned_password(password: str) -> bool:
        """
        Check if password appears in known breaches.

        Uses haveibeenpwned API (k-anonymity model).
        """
        import hashlib
        import requests

        # Hash password
        sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
        prefix = sha1_hash[:5]
        suffix = sha1_hash[5:]

        # Query API with prefix (k-anonymity - doesn't reveal full password)
        response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}')

        if response.status_code == 200:
            # Check if suffix appears in results
            hashes = response.text.split('\r\n')
            for h in hashes:
                hash_suffix, count = h.split(':')
                if hash_suffix == suffix:
                    return True  # Password is pwned

        return False


# Usage
def register_user(username: str, password: str, email: str) -> dict:
    """Register user with strong password validation."""

    # Validate password
    valid, errors = PasswordValidator.validate(password, username, email)

    if not valid:
        return {
            "status": "error",
            "errors": errors
        }, 400

    # Hash password
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    # Create user
    user = database.create_user(username, password_hash, email)

    logger.info(f"User registered: {username}")

    return {"status": "success", "user_id": user.id}
```

#### 2. Session Fixation

```python
# VULNERABLE: Session fixation attack
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if verify_credentials(username, password):
        # BUG: Reuses existing session ID
        session['logged_in'] = True
        session['user_id'] = get_user_id(username)
        return "Login successful"

# Attack:
# 1. Attacker gets session ID: session_id=abc123
# 2. Tricks victim to use that session: victim.com?session_id=abc123
# 3. Victim logs in (session ID stays abc123)
# 4. Attacker now logged in as victim (shared session)

# SECURE: Regenerate session ID on login
@app.route('/login', methods=['POST'])
def login():
    """
    Secure login with session regeneration.

    Security measures:
    - Regenerate session ID after authentication
    - Invalidate old session
    - Set secure cookie flags
    """
    username = request.form['username']
    password = request.form['password']

    if verify_credentials(username, password):
        # Get old session data
        old_session_data = dict(session)

        # Clear old session
        session.clear()

        # Regenerate session ID
        session.modified = True

        # Restore and update session data
        session.update(old_session_data)
        session['logged_in'] = True
        session['user_id'] = get_user_id(username)

        # Set secure cookie flags
        app.config.update(
            SESSION_COOKIE_SECURE=True,  # Only send over HTTPS
            SESSION_COOKIE_HTTPONLY=True,  # Not accessible via JavaScript
            SESSION_COOKIE_SAMESITE='Lax'  # CSRF protection
        )

        logger.info(f"User logged in: {username}")

        return "Login successful"

    return "Login failed", 401
```

#### 3. Credential Stuffing

```python
# VULNERABLE: No protection against automated attacks
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    # No rate limiting or CAPTCHA
    if verify_credentials(username, password):
        return "Success"
    return "Failed"

# Attack: Credential stuffing
# 1. Attacker has millions of username:password pairs from other breaches
# 2. Tries them all against your site (automated)
# 3. Users who reuse passwords are compromised

# SECURE: Multiple layers of protection
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per day", "100 per hour"]
)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # Aggressive rate limit
def login():
    """
    Secure login with credential stuffing protection.

    Protections:
    1. Rate limiting (5 attempts per minute per IP)
    2. CAPTCHA after failures
    3. Unusual pattern detection
    4. Compromised password checking
    """
    username = request.form['username']
    password = request.form['password']
    captcha_response = request.form.get('captcha')

    # Check if CAPTCHA required (after 3 failures)
    failure_count = get_failure_count(request.remote_addr)
    if failure_count >= 3:
        if not verify_captcha(captcha_response):
            return {"error": "CAPTCHA required"}, 400

    # Check for suspicious patterns
    if is_credential_stuffing_pattern(request.remote_addr):
        logger.warning(f"Possible credential stuffing from {request.remote_addr}")
        # Require CAPTCHA
        return {"error": "Security check required", "captcha_required": True}, 400

    # Verify credentials
    if verify_credentials(username, password):
        # Check if password is in breach database
        if is_password_compromised(password):
            logger.warning(f"Compromised password used: {username}")
            # Allow login but force password change
            return {
                "status": "password_change_required",
                "message": "Your password has been found in a data breach. Please change it."
            }

        clear_failure_count(request.remote_addr)
        return {"status": "success"}

    # Failed login
    increment_failure_count(request.remote_addr)
    return {"error": "Invalid credentials"}, 401


def is_credential_stuffing_pattern(ip: str) -> bool:
    """
    Detect credential stuffing patterns.

    Indicators:
    - High volume of login attempts
    - Multiple different usernames
    - Short time between attempts
    - No browser fingerprint variation
    """
    # Get recent login attempts from this IP
    attempts = get_recent_attempts(ip, minutes=5)

    if len(attempts) < 10:
        return False  # Too few to determine

    # Check for multiple usernames
    unique_usernames = len(set(a['username'] for a in attempts))

    # Credential stuffing: many different usernames
    if unique_usernames > 5:
        return True

    # Check timing (credential stuffing is very regular)
    intervals = []
    for i in range(1, len(attempts)):
        interval = (attempts[i]['timestamp'] - attempts[i-1]['timestamp']).total_seconds()
        intervals.append(interval)

    # Very consistent timing = bot
    if intervals and max(intervals) - min(intervals) < 0.5:
        return True

    return False
```

### Best Practices

1. **Use Multi-Factor Authentication:** Require second factor for sensitive operations
2. **Strong Password Policy:** Enforce complexity, length, and breach checking
3. **Rate Limiting:** Prevent brute force and credential stuffing
4. **Secure Session Management:** HttpOnly, Secure, SameSite cookies
5. **Account Lockout:** Temporary lockout after failures
6. **Password Hashing:** Use bcrypt, scrypt, or Argon2 (not MD5/SHA1)
7. **Monitor for Anomalies:** Detect unusual login patterns

### Real-World Case Study

**LinkedIn Breach (2012)**

LinkedIn stored passwords using simple SHA1 hashing without salts. When the database was breached, attackers could:
- Crack passwords easily (no salt means rainbow tables work)
- Find all users with same password
- Compromised 6.5 million accounts

**Lessons:**
- Always salt passwords (unique per user)
- Use slow hashing algorithms (bcrypt, not SHA1)
- Notify users of breaches promptly
- Force password resets after breach

---

## 8. Software and Data Integrity Failures

### What is it?

This vulnerability covers code and infrastructure that doesn't protect against integrity violations. This includes trusting updates, critical data, or CI/CD pipelines without verification, allowing attackers to inject malicious code or data.

### Simple Analogy

Imagine a restaurant that:
- Accepts food deliveries without checking who sent them
- Doesn't verify the seals on packages
- Trusts that ingredients haven't been tampered with
- Has no way to tell if the recipe was altered

That's integrity failure — you can't verify things are what they claim to be.

### How it Works (The Attack)

```python
# VULNERABLE: Accepting unverified updates
import requests
import subprocess

@app.route('/update-app', methods=['POST'])
def update_application():
    """
    DANGEROUS: Downloads and runs code without verification.

    Problems:
    1. No signature verification
    2. HTTP (not HTTPS) - can be intercepted
    3. No checksum validation
    4. Runs with full privileges
    """
    update_url = "http://updates.example.com/latest.tar.gz"

    # Download update (no verification!)
    response = requests.get(update_url)
    with open('/tmp/update.tar.gz', 'wb') as f:
        f.write(response.content)

    # Extract and run (no validation!)
    subprocess.run(['tar', '-xzf', '/tmp/update.tar.gz'])
    subprocess.run(['./install.sh'])  # Could be malicious!

    return "Update installed"

# Attack scenarios:
# 1. Man-in-the-middle: Intercept HTTP request, inject malware
# 2. Compromised update server: Serve malicious updates
# 3. Supply chain attack: Legitimate update process compromised
```

### The Fix

```python
# SECURE: Verified software updates
import requests
import hashlib
import subprocess
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.exceptions import InvalidSignature

class SecureUpdater:
    """
    Secure software update with integrity verification.

    Security measures:
    1. HTTPS only (TLS verification)
    2. Cryptographic signature verification
    3. Checksum validation
    4. Version verification
    5. Rollback capability
    6. Audit logging
    """

    def __init__(self, public_key_path: str):
        # Load trusted public key for signature verification
        with open(public_key_path, 'rb') as f:
            self.public_key = serialization.load_pem_public_key(f.read())

    def update_application(self, update_url: str, expected_version: str) -> dict:
        """
        Download and install verified update.

        Returns:
        - {"status": "success"} if update installed
        - {"status": "error", "message": "..."} if verification failed
        """
        try:
            # Step 1: Download update manifest (metadata)
            manifest_url = update_url + '.manifest.json'
            manifest = self._download_manifest(manifest_url)

            # Step 2: Verify manifest signature
            signature_url = update_url + '.signature'
            signature = self._download_signature(signature_url)

            if not self._verify_signature(manifest, signature):
                logger.error("Update signature verification failed")
                return {"status": "error", "message": "Invalid signature"}

            # Step 3: Check version
            if manifest['version'] != expected_version:
                logger.warning(f"Version mismatch: expected {expected_version}, got {manifest['version']}")
                return {"status": "error", "message": "Version mismatch"}

            # Step 4: Download update package
            update_data = self._download_update(update_url)

            # Step 5: Verify checksum
            if not self._verify_checksum(update_data, manifest['checksum']):
                logger.error("Update checksum verification failed")
                return {"status": "error", "message": "Checksum mismatch"}

            # Step 6: Create backup for rollback
            self._create_backup()

            # Step 7: Install update
            success = self._install_update(update_data)

            if success:
                logger.info(f"Update installed successfully: version {manifest['version']}")
                return {"status": "success", "version": manifest['version']}
            else:
                # Rollback on failure
                self._rollback()
                return {"status": "error", "message": "Installation failed, rolled back"}

        except Exception as e:
            logger.error(f"Update failed: {e}")
            return {"status": "error", "message": str(e)}

    def _download_manifest(self, url: str) -> dict:
        """Download and parse update manifest."""
        response = requests.get(url, timeout=30, verify=True)  # Verify TLS
        response.raise_for_status()
        return response.json()

    def _download_signature(self, url: str) -> bytes:
        """Download cryptographic signature."""
        response = requests.get(url, timeout=30, verify=True)
        response.raise_for_status()
        return response.content

    def _download_update(self, url: str) -> bytes:
        """Download update package."""
        response = requests.get(url, timeout=300, verify=True)
        response.raise_for_status()
        return response.content

    def _verify_signature(self, data: dict, signature: bytes) -> bool:
        """
        Verify cryptographic signature.

        Uses RSA with PSS padding and SHA256 hash.
        """
        import json

        message = json.dumps(data, sort_keys=True).encode()

        try:
            self.public_key.verify(
                signature,
                message,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except InvalidSignature:
            return False

    def _verify_checksum(self, data: bytes, expected_checksum: str) -> bool:
        """Verify SHA256 checksum."""
        actual_checksum = hashlib.sha256(data).hexdigest()
        return actual_checksum == expected_checksum

    def _create_backup(self):
        """Create backup of current version for rollback."""
        import shutil
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = f"/backups/app_{timestamp}"
        shutil.copytree('/app', backup_dir)
        logger.info(f"Backup created: {backup_dir}")

    def _install_update(self, update_data: bytes) -> bool:
        """Install the verified update."""
        try:
            # Write update to temp location
            with open('/tmp/update.tar.gz', 'wb') as f:
                f.write(update_data)

            # Extract (validate tar contents first)
            import tarfile
            with tarfile.open('/tmp/update.tar.gz', 'r:gz') as tar:
                # Check for path traversal attempts
                for member in tar.getmembers():
                    if member.name.startswith('/') or '..' in member.name:
                        raise ValueError(f"Suspicious file path: {member.name}")

                tar.extractall('/tmp/update')

            # Run install script (with limited privileges)
            result = subprocess.run(
                ['./install.sh'],
                cwd='/tmp/update',
                timeout=300,
                capture_output=True
            )

            return result.returncode == 0

        except Exception as e:
            logger.error(f"Installation failed: {e}")
            return False

    def _rollback(self):
        """Rollback to previous version."""
        import shutil
        # Find most recent backup
        backups = sorted(os.listdir('/backups'), reverse=True)
        if backups:
            latest_backup = f"/backups/{backups[0]}"
            shutil.copytree(latest_backup, '/app', dirs_exist_ok=True)
            logger.info(f"Rolled back to: {latest_backup}")
```

### Common Integrity Failure Scenarios

#### 1. Insecure Deserialization

```python
# VULNERABLE: Deserializing untrusted data
import pickle

@app.route('/load-data', methods=['POST'])
def load_data():
    # DANGEROUS: pickle can execute arbitrary code
    data = pickle.loads(request.data)
    return process_data(data)

# Attack: Send malicious pickle object
# Result: Arbitrary code execution on server

# SECURE: Use safe serialization formats
import json
from typing import Any

@app.route('/load-data', methods=['POST'])
def load_data():
    """
    Secure data loading.

    Security measures:
    - Use JSON (no code execution)
    - Schema validation
    - Type checking
    - Size limits
    """
    try:
        # Size limit (prevent DOS)
        if len(request.data) > 1_000_000:  # 1MB
            return {"error": "Data too large"}, 400

        # Parse JSON (safe)
        data = json.loads(request.data)

        # Validate schema
        if not validate_schema(data):
            return {"error": "Invalid data schema"}, 400

        # Process data
        result = process_data(data)
        return {"status": "success", "result": result}

    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}, 400


def validate_schema(data: Any) -> bool:
    """
    Validate data matches expected schema.

    Use library like jsonschema for complex validation.
    """
    # Example: Expecting specific structure
    if not isinstance(data, dict):
        return False

    required_fields = {'type', 'value', 'timestamp'}
    if not all(field in data for field in required_fields):
        return False

    # Validate types
    if not isinstance(data['type'], str):
        return False

    if not isinstance(data['timestamp'], (int, float)):
        return False

    return True
```

#### 2. CI/CD Pipeline Compromise

```yaml
# VULNERABLE: Insecure CI/CD pipeline
# .github/workflows/deploy.yml
name: Deploy

on: [push]  # Runs on any push, including external PRs

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # DANGER: Runs untrusted code from PR
      - name: Run tests
        run: ./run_tests.sh  # Could be malicious script from PR

      # DANGER: Secrets exposed to PRs
      - name: Deploy
        env:
          AWS_ACCESS_KEY: ${{ secrets.AWS_ACCESS_KEY }}
        run: ./deploy.sh

# Attack: Attacker creates PR with malicious run_tests.sh
# Result: Steals AWS credentials, deploys backdoor

# SECURE: Protected CI/CD pipeline
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main  # Only main branch, not PRs

jobs:
  test:
    runs-on: ubuntu-latest
    # Separate test job without secrets
    steps:
      - uses: actions/checkout@v3

      - name: Run tests
        run: |
          # Use verified test framework
          pytest tests/

      - name: Security scan
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy:
    needs: test  # Only run if tests pass
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Extra check
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v3

      # Use OIDC instead of long-lived credentials
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: us-east-1

      # Verify deployment package integrity
      - name: Build and verify
        run: |
          # Build application
          python setup.py bdist_wheel

          # Generate checksum
          sha256sum dist/*.whl > checksums.txt

          # Sign checksums
          gpg --sign checksums.txt

      - name: Deploy
        run: |
          # Use verified deployment script
          aws s3 cp dist/*.whl s3://my-bucket/
          aws lambda update-function-code --function-name my-func
```

#### 3. Supply Chain Attack

```python
# VULNERABLE: Installing unverified dependencies
"""
# requirements.txt
some-package==1.0.0  # No hash verification

pip install -r requirements.txt
# If PyPI compromised or package hijacked, malicious code installed
"""

# SECURE: Pin dependencies with hashes
"""
# requirements.txt (generated with pip-compile --generate-hashes)
Flask==3.0.0 \
    --hash=sha256:abc123...def456
requests==2.31.0 \
    --hash=sha256:789ghi...012jkl
"""

# Installation verifies hashes
pip install --require-hashes -r requirements.txt

# Additional security: Use private PyPI mirror
"""
# pip.conf
[global]
index-url = https://pypi.internal.company.com/simple
trusted-host = pypi.internal.company.com
cert = /path/to/cert.pem

# Private mirror:
# 1. Scans packages for malware
# 2. Verifies package signatures
# 3. Stores verified copies
# 4. Controlled update process
"""

# Dependency verification script
import subprocess
import hashlib
import json

def verify_dependencies():
    """
    Verify installed packages match requirements.

    Checks:
    - All required packages installed
    - Correct versions
    - No unexpected packages
    - Hash verification
    """
    # Read expected dependencies
    with open('requirements.json', 'r') as f:
        expected = json.load(f)

    # Get installed packages
    result = subprocess.run(
        ['pip', 'list', '--format=json'],
        capture_output=True,
        text=True
    )
    installed = {pkg['name']: pkg['version'] for pkg in json.loads(result.stdout)}

    issues = []

    # Check required packages
    for package, details in expected.items():
        if package not in installed:
            issues.append(f"Missing package: {package}")
        elif installed[package] != details['version']:
            issues.append(
                f"Version mismatch: {package} "
                f"(expected {details['version']}, got {installed[package]})"
            )

    # Check for unexpected packages
    expected_names = set(expected.keys())
    installed_names = set(installed.keys())
    unexpected = installed_names - expected_names

    if unexpected:
        issues.append(f"Unexpected packages: {', '.join(unexpected)}")

    if issues:
        print("Dependency verification FAILED:")
        for issue in issues:
            print(f"  - {issue}")
        return False

    print("Dependency verification PASSED")
    return True
```

### Best Practices

1. **Digital Signatures:** Verify signatures on updates and packages
2. **Checksum Verification:** Validate file integrity with cryptographic hashes
3. **Dependency Pinning:** Use exact versions with hash verification
4. **Secure CI/CD:** Separate test/deploy, verify inputs, limit secrets
5. **Supply Chain Security:** Vet dependencies, use private mirrors
6. **Immutable Infrastructure:** Deployments from verified images only

### Real-World Case Study

**SolarWinds Attack (2020)**

Attackers compromised SolarWinds' build system and inserted malicious code into Orion software updates. The malicious update was:
- Digitally signed (compromised signing process)
- Distributed through official update mechanism
- Trusted by 18,000+ organizations

**Impact:**
- Government agencies compromised
- Major corporations affected
- Access maintained for months

**Lessons:**
- Sign updates with hardware security modules (HSM)
- Separate build environment from development
- Monitor build process for anomalies
- Implement "golden image" verification
- Zero trust even for signed updates

---

## 9. Security Logging and Monitoring Failures

### What is it?

Insufficient logging and monitoring allows attackers to persist in systems without being detected, escalate privileges, maintain persistence, and laterally move to other systems. Most breaches take months to detect because of inadequate logging.

### Simple Analogy

Imagine a bank with no security cameras, no guards taking notes, and no alarm system. If someone robs it, you might not know for months, and you'll have no evidence to investigate. That's logging failure — you're blind to attacks.

### How it Works (The Problem)

```python
# VULNERABLE: No security logging
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if verify_credentials(username, password):
        # No logging of successful login
        return "Success"

    # No logging of failed login
    return "Failed"

# Problems:
# - Can't detect brute force attacks
# - No evidence for investigation
# - No alerts for suspicious activity
# - Can't trace attacker actions
```

### The Fix

```python
# SECURE: Comprehensive security logging
import logging
import json
from datetime import datetime
from typing import Dict, Any

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SecurityLogger:
    """
    Security event logging with structured data.

    Logs:
    - Authentication events (success/failure)
    - Authorization failures
    - Data access
    - Configuration changes
    - Suspicious activity
    - System events
    """

    @staticmethod
    def log_event(event_type: str, severity: str, details: Dict[str, Any]):
        """
        Log security event in structured format.

        Parameters:
        - event_type: Category of event (auth, access, etc.)
        - severity: info, warning, error, critical
        - details: Event-specific data
        """
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'severity': severity,
            'details': details,
            'correlation_id': get_correlation_id()  # Track related events
        }

        # Add context
        log_entry['context'] = {
            'ip': request.remote_addr if request else None,
            'user_agent': request.headers.get('User-Agent') if request else None,
            'session_id': session.get('id') if session else None
        }

        # Log based on severity
        log_message = json.dumps(log_entry)

        if severity == 'critical':
            logger.critical(log_message)
            send_alert(log_entry)  # Immediate alert
        elif severity == 'error':
            logger.error(log_message)
        elif severity == 'warning':
            logger.warning(log_message)
        else:
            logger.info(log_message)

        # Send to SIEM (Security Information and Event Management)
        send_to_siem(log_entry)

    @staticmethod
    def log_authentication(username: str, success: bool, reason: str = None):
        """Log authentication attempt."""
        details = {
            'username': username,
            'success': success,
            'reason': reason
        }

        severity = 'info' if success else 'warning'

        SecurityLogger.log_event('authentication', severity, details)

        # Detect brute force
        if not success:
            check_brute_force_pattern(username, request.remote_addr)

    @staticmethod
    def log_authorization_failure(user_id: int, resource: str, action: str):
        """Log unauthorized access attempt."""
        details = {
            'user_id': user_id,
            'resource': resource,
            'action': action
        }

        SecurityLogger.log_event('authorization_failure', 'warning', details)

        # Check for privilege escalation attempts
        check_privilege_escalation_pattern(user_id)

    @staticmethod
    def log_data_access(user_id: int, resource_type: str, resource_id: str,
                       action: str, sensitive: bool = False):
        """Log data access (especially sensitive data)."""
        details = {
            'user_id': user_id,
            'resource_type': resource_type,
            'resource_id': resource_id,
            'action': action,
            'sensitive': sensitive
        }

        severity = 'warning' if sensitive else 'info'

        SecurityLogger.log_event('data_access', severity, details)

        # Check for data exfiltration patterns
        if sensitive:
            check_exfiltration_pattern(user_id)

    @staticmethod
    def log_config_change(user_id: int, config_key: str,
                         old_value: str, new_value: str):
        """Log configuration changes."""
        details = {
            'user_id': user_id,
            'config_key': config_key,
            'old_value': old_value,  # Don't log sensitive values
            'new_value': new_value
        }

        SecurityLogger.log_event('config_change', 'warning', details)

    @staticmethod
    def log_suspicious_activity(activity_type: str, details: Dict[str, Any]):
        """Log suspicious activity for investigation."""
        SecurityLogger.log_event('suspicious_activity', 'error', {
            'activity_type': activity_type,
            **details
        })


# Usage in application
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if verify_credentials(username, password):
        user = get_user(username)

        # Log successful login
        SecurityLogger.log_authentication(username, success=True)

        session['user_id'] = user.id
        return {"status": "success"}

    # Log failed login
    SecurityLogger.log_authentication(
        username,
        success=False,
        reason="Invalid credentials"
    )

    return {"error": "Invalid credentials"}, 401


@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    if not current_user.is_admin:
        # Log unauthorized access attempt
        SecurityLogger.log_authorization_failure(
            current_user.id,
            resource='/api/admin/users',
            action='GET'
        )
        abort(403)

    # Log sensitive data access
    SecurityLogger.log_data_access(
        current_user.id,
        resource_type='users',
        resource_id='all',
        action='list',
        sensitive=True
    )

    return jsonify(get_users())


@app.route('/api/user/<user_id>', methods=['GET'])
def get_user_data(user_id):
    if user_id != current_user.id and not current_user.is_admin:
        # Suspicious: Trying to access other users' data
        SecurityLogger.log_suspicious_activity(
            'unauthorized_access_attempt',
            {
                'attacker_user_id': current_user.id,
                'target_user_id': user_id
            }
        )
        abort(403)

    # Log data access
    SecurityLogger.log_data_access(
        current_user.id,
        resource_type='user',
        resource_id=user_id,
        action='read'
    )

    return jsonify(get_user(user_id))
```

### What to Log

#### Essential Security Events

```python
# Comprehensive logging examples

# 1. Authentication events
def log_all_auth_events():
    """
    Authentication events to log:
    - Login attempts (success and failure)
    - Logout
    - Session creation/destruction
    - Password changes
    - Password reset requests
    - MFA enrollments/changes
    - Account lockouts
    """
    pass

# 2. Authorization events
def log_all_authz_events():
    """
    Authorization events to log:
    - Access denied (403)
    - Privilege escalation attempts
    - Role changes
    - Permission changes
    """
    pass

# 3. Data access events
def log_all_data_events():
    """
    Data access events to log:
    - Access to sensitive data (PII, financial, health)
    - Bulk data exports
    - Database queries on sensitive tables
    - File downloads
    - API calls to sensitive endpoints
    """
    pass

# 4. System events
def log_all_system_events():
    """
    System events to log:
    - Application start/stop
    - Configuration changes
    - Deployment events
    - Service outages
    - Resource exhaustion
    """
    pass

# 5. Suspicious activity
def log_all_suspicious_events():
    """
    Suspicious activity to log:
    - SQL injection attempts
    - XSS attempts
    - Path traversal attempts
    - Unusual access patterns
    - Geographic anomalies
    - Credential stuffing indicators
    - Reconnaissance activity (scanning)
    """
    pass
```

### What NOT to Log

```python
# DANGEROUS: Logging sensitive data
logger.info(f"User logged in: {username} with password: {password}")
# NEVER log passwords!

logger.info(f"Processing payment: {credit_card_number}")
# NEVER log full credit card numbers!

logger.info(f"Request headers: {request.headers}")
# Headers may contain Authorization tokens!

logger.error(f"Database error: {sql_query}")
# May contain sensitive data from user input!

# SAFE: Sanitized logging
logger.info(f"User logged in: {username}")
# No password

logger.info(f"Processing payment: ****{credit_card_number[-4:]}")
# Only last 4 digits

logger.info(f"Request path: {request.path}")
# No sensitive headers

logger.error(f"Database error on table: {table_name}")
# No actual data
```

### Monitoring and Alerting

```python
# Example: Anomaly detection and alerting
from collections import defaultdict
from datetime import datetime, timedelta

class SecurityMonitor:
    """
    Real-time security monitoring and alerting.

    Detects:
    - Brute force attacks
    - Credential stuffing
    - Privilege escalation attempts
    - Data exfiltration
    - Unusual access patterns
    """

    def __init__(self):
        self.failed_logins = defaultdict(list)  # Track by username
        self.ip_activity = defaultdict(list)  # Track by IP
        self.user_activity = defaultdict(list)  # Track by user ID

    def check_brute_force(self, username: str, ip: str):
        """
        Detect brute force login attempts.

        Alert if:
        - 5+ failures from same IP in 5 minutes
        - 10+ failures for same username in 1 hour
        """
        now = datetime.now()

        # Track failed login
        self.failed_logins[username].append(now)
        self.ip_activity[ip].append({'type': 'failed_login', 'time': now})

        # Clean old entries (older than 1 hour)
        cutoff = now - timedelta(hours=1)
        self.failed_logins[username] = [
            t for t in self.failed_logins[username] if t > cutoff
        ]

        # Check thresholds
        recent_failures_username = len(self.failed_logins[username])

        recent_failures_ip = len([
            a for a in self.ip_activity[ip]
            if a['type'] == 'failed_login' and a['time'] > now - timedelta(minutes=5)
        ])

        if recent_failures_ip >= 5:
            self._send_alert(
                'brute_force_ip',
                f"Brute force detected from IP {ip}: {recent_failures_ip} failures in 5 minutes"
            )

        if recent_failures_username >= 10:
            self._send_alert(
                'brute_force_user',
                f"Brute force detected for user {username}: {recent_failures_username} failures in 1 hour"
            )

    def check_privilege_escalation(self, user_id: int, resource: str):
        """
        Detect privilege escalation attempts.

        Alert if:
        - Multiple authorization failures in short time
        - Accessing progressively higher privilege resources
        """
        now = datetime.now()

        self.user_activity[user_id].append({
            'type': 'authz_failure',
            'resource': resource,
            'time': now
        })

        # Check recent authorization failures
        recent_cutoff = now - timedelta(minutes=10)
        recent_failures = [
            a for a in self.user_activity[user_id]
            if a['type'] == 'authz_failure' and a['time'] > recent_cutoff
        ]

        if len(recent_failures) >= 5:
            self._send_alert(
                'privilege_escalation',
                f"Possible privilege escalation: User {user_id} had {len(recent_failures)} "
                f"authorization failures in 10 minutes"
            )

    def check_data_exfiltration(self, user_id: int, data_volume: int):
        """
        Detect unusual data access patterns.

        Alert if:
        - Large volume of data accessed
        - Unusual time (outside business hours)
        - Different geographic location
        """
        now = datetime.now()

        # Check volume
        if data_volume > 1000:  # 1000 records
            self._send_alert(
                'data_exfiltration',
                f"Large data access: User {user_id} accessed {data_volume} records"
            )

        # Check time (outside 8 AM - 6 PM)
        hour = now.hour
        if hour < 8 or hour > 18:
            self._send_alert(
                'unusual_access_time',
                f"Off-hours access: User {user_id} accessing data at {now.strftime('%H:%M')}"
            )

    def _send_alert(self, alert_type: str, message: str):
        """
        Send security alert.

        Channels:
        - Email to security team
        - Slack/Teams notification
        - PagerDuty for critical alerts
        - SIEM system
        """
        logger.critical(f"SECURITY ALERT [{alert_type}]: {message}")

        # Send to alerting system
        send_to_alerting_system({
            'type': alert_type,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'severity': 'high'
        })


# Usage
monitor = SecurityMonitor()

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if not verify_credentials(username, password):
        # Check for brute force
        monitor.check_brute_force(username, request.remote_addr)
        return {"error": "Invalid credentials"}, 401

    return {"status": "success"}
```

### Best Practices

1. **Log All Security Events:** Authentication, authorization, data access
2. **Structured Logging:** Use JSON format for easy parsing
3. **Correlation IDs:** Track related events across systems
4. **Centralized Logging:** Send logs to SIEM system
5. **Real-Time Monitoring:** Alert on suspicious patterns
6. **Log Retention:** Keep logs for compliance period (often 90+ days)
7. **Protect Logs:** Secure, tamper-proof log storage
8. **Regular Review:** Analyze logs for patterns

### Real-World Case Study

**Target Breach (2013)**

Target's security tools detected the breach and sent alerts, but the alerts were ignored. Attackers maintained access for weeks, stealing 40 million credit card numbers.

**Timeline:**
- Nov 30: Initial compromise (logged and alerted)
- Dec 2: More alerts (ignored)
- Dec 12-15: Massive data exfiltration (logged but not acted on)
- Dec 18: Breach discovered by external party

**Lessons:**
- Logging without monitoring is useless
- Alerts must be actionable and reviewed
- Have clear escalation procedures
- Regular log review is essential

---

## 10. Server-Side Request Forgery (SSRF)

### What is it?

SSRF occurs when a web application fetches a remote resource without validating the user-supplied URL. This allows an attacker to force the application to send requests to unintended locations, potentially accessing internal systems or external services.

### Simple Analogy

Imagine you run an errand service where you fetch things for customers. A malicious customer asks you to "go to 123 Main Street and get what's there." You go, but it's actually the bank's vault and because you're a trusted employee, the bank lets you in. The customer tricked you into accessing something they couldn't access directly. That's SSRF.

### How it Works (The Attack)

```python
# VULNERABLE: Fetching user-provided URL
import requests

@app.route('/fetch-url', methods=['POST'])
def fetch_url():
    """
    DANGEROUS: Fetches any URL provided by user.

    Problems:
    1. Can access internal services (localhost, 192.168.x.x)
    2. Can access cloud metadata APIs
    3. Can scan internal network
    4. Can access internal files (file://)
    """
    url = request.json['url']

    # No validation!
    response = requests.get(url)
    return response.text

# Attack scenarios:
# 1. Access cloud metadata:
#    POST /fetch-url {"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}
#    Result: Steal AWS credentials

# 2. Access internal services:
#    POST /fetch-url {"url": "http://localhost:8080/admin"}
#    Result: Access admin panel not exposed publicly

# 3. Port scanning:
#    POST /fetch-url {"url": "http://192.168.1.1:22"}
#    Result: Map internal network

# 4. File access:
#    POST /fetch-url {"url": "file:///etc/passwd"}
#    Result: Read system files
```

### The Fix

```python
# SECURE: Validated URL fetching
import requests
import ipaddress
from urllib.parse import urlparse
from typing import Tuple, Optional

class SSRFProtection:
    """
    SSRF protection with multiple validation layers.

    Protections:
    1. URL allowlist (only specific domains)
    2. Block private IP ranges
    3. Block localhost
    4. Block cloud metadata endpoints
    5. Protocol allowlist (HTTP/HTTPS only)
    6. DNS rebinding protection
    """

    # Private IP ranges to block
    PRIVATE_RANGES = [
        ipaddress.ip_network('10.0.0.0/8'),
        ipaddress.ip_network('172.16.0.0/12'),
        ipaddress.ip_network('192.168.0.0/16'),
        ipaddress.ip_network('127.0.0.0/8'),
        ipaddress.ip_network('169.254.0.0/16'),  # AWS metadata
        ipaddress.ip_network('::1/128'),  # IPv6 localhost
        ipaddress.ip_network('fc00::/7'),  # IPv6 private
    ]

    # Allowed domains (allowlist)
    ALLOWED_DOMAINS = [
        'api.example.com',
        'images.example.com',
        'data.example.com'
    ]

    @classmethod
    def validate_url(cls, url: str) -> Tuple[bool, Optional[str]]:
        """
        Validate URL is safe to fetch.

        Returns:
        - (True, None) if valid
        - (False, error_message) if invalid
        """
        # Parse URL
        try:
            parsed = urlparse(url)
        except Exception:
            return False, "Invalid URL format"

        # Check protocol (only HTTP/HTTPS)
        if parsed.scheme not in ['http', 'https']:
            return False, f"Protocol not allowed: {parsed.scheme}"

        # Check domain allowlist
        if parsed.hostname not in cls.ALLOWED_DOMAINS:
            return False, f"Domain not allowed: {parsed.hostname}"

        # Resolve DNS
        try:
            import socket
            ip_str = socket.gethostbyname(parsed.hostname)
            ip = ipaddress.ip_address(ip_str)
        except Exception as e:
            return False, f"DNS resolution failed: {e}"

        # Check IP is not private
        for private_range in cls.PRIVATE_RANGES:
            if ip in private_range:
                return False, f"Private IP address not allowed: {ip}"

        # Check for DNS rebinding (domain resolves to different IPs)
        # This is a simplified check
        try:
            ip_str2 = socket.gethostbyname(parsed.hostname)
            if ip_str != ip_str2:
                return False, "Possible DNS rebinding attack"
        except Exception:
            pass

        return True, None

    @classmethod
    def safe_fetch(cls, url: str, timeout: int = 10) -> Tuple[bool, str]:
        """
        Safely fetch URL with validation.

        Returns:
        - (True, content) if successful
        - (False, error_message) if failed
        """
        # Validate URL
        valid, error = cls.validate_url(url)
        if not valid:
            logger.warning(f"SSRF attempt blocked: {url} - {error}")
            return False, error

        try:
            # Fetch with restrictions
            response = requests.get(
                url,
                timeout=timeout,
                allow_redirects=False,  # Don't follow redirects
                headers={'User-Agent': 'SafeFetcher/1.0'},
                stream=False  # Don't stream (limit size)
            )

            # Check response size (prevent DOS)
            if len(response.content) > 10 * 1024 * 1024:  # 10MB limit
                return False, "Response too large"

            # Check for redirects to private IPs
            if 300 <= response.status_code < 400:
                redirect_location = response.headers.get('Location')
                if redirect_location:
                    valid, error = cls.validate_url(redirect_location)
                    if not valid:
                        logger.warning(f"SSRF redirect blocked: {redirect_location}")
                        return False, f"Redirect blocked: {error}"

            logger.info(f"URL fetched successfully: {url}")
            return True, response.text

        except requests.exceptions.Timeout:
            return False, "Request timeout"
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching URL: {e}")
            return False, "Failed to fetch URL"


# Usage in application
@app.route('/fetch-url', methods=['POST'])
def fetch_url():
    """
    Secure URL fetching endpoint.

    Security measures:
    - URL validation (allowlist)
    - IP range blocking
    - Protocol restriction
    - Size limits
    - Timeout
    - Logging
    """
    url = request.json.get('url')

    if not url:
        return {"error": "URL required"}, 400

    # Rate limiting to prevent abuse
    if exceeded_rate_limit(request.remote_addr):
        return {"error": "Rate limit exceeded"}, 429

    # Validate and fetch
    success, content = SSRFProtection.safe_fetch(url)

    if not success:
        # Log potential SSRF attempt
        SecurityLogger.log_suspicious_activity(
            'ssrf_attempt',
            {
                'url': url,
                'error': content,
                'ip': request.remote_addr
            }
        )
        return {"error": content}, 400

    return {"content": content}
```

### Common SSRF Attack Vectors

#### 1. Cloud Metadata Access

```python
# Attack: Accessing AWS metadata to steal credentials
"""
POST /fetch-url
{
    "url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name"
}

Response:
{
    "AccessKeyId": "ASIA...",
    "SecretAccessKey": "...",
    "Token": "..."
}

Attacker now has AWS credentials!
"""

# Protection: Block metadata endpoints
BLOCKED_IPS = [
    '169.254.169.254',  # AWS/Azure metadata
    '169.254.170.2',  # AWS ECS metadata
    'metadata.google.internal',  # GCP metadata
]

def is_metadata_endpoint(hostname: str) -> bool:
    """Check if URL targets cloud metadata."""
    return hostname in BLOCKED_IPS or hostname.endswith('.metadata.google.internal')
```

#### 2. Internal Service Access

```python
# Attack: Accessing internal services
"""
POST /fetch-url
{
    "url": "http://localhost:8080/admin/delete-all-users"
}

Application makes request from server (bypasses firewall).
Result: Attacker can access internal admin panel.
"""

# Protection: Block localhost and private IPs
def is_private_ip(ip: str) -> bool:
    """Check if IP is private/localhost."""
    try:
        ip_obj = ipaddress.ip_address(ip)
        return (
            ip_obj.is_private or
            ip_obj.is_loopback or
            ip_obj.is_link_local or
            ip_obj.is_multicast
        )
    except ValueError:
        return False
```

#### 3. Port Scanning

```python
# Attack: Scanning internal network
"""
for port in range(1, 1000):
    POST /fetch-url {"url": f"http://192.168.1.1:{port}"}

If port is open: Connection succeeds (even if no data)
If port is closed: Connection fails quickly
Result: Attacker maps internal network
"""

# Protection: Rate limiting and monitoring
def check_port_scanning(ip: str, user_id: int):
    """Detect port scanning patterns."""
    # Get recent URL fetch attempts
    recent_attempts = get_recent_url_fetches(ip, user_id, minutes=5)

    # Check for sequential ports
    ports_tried = []
    for attempt in recent_attempts:
        parsed = urlparse(attempt['url'])
        if parsed.port:
            ports_tried.append(parsed.port)

    # Sequential ports = likely scanning
    if len(ports_tried) > 5:
        sequential = all(
            ports_tried[i] + 1 == ports_tried[i + 1]
            for i in range(len(ports_tried) - 1)
        )

        if sequential:
            SecurityLogger.log_suspicious_activity(
                'port_scanning',
                {
                    'ip': ip,
                    'user_id': user_id,
                    'ports': ports_tried
                }
            )
            return True

    return False
```

#### 4. File Access

```python
# Attack: Reading local files
"""
POST /fetch-url
{
    "url": "file:///etc/passwd"
}

Result: Attacker reads system files
"""

# Protection: Protocol allowlist
ALLOWED_PROTOCOLS = ['http', 'https']

def validate_protocol(url: str) -> bool:
    """Only allow HTTP/HTTPS."""
    parsed = urlparse(url)
    return parsed.scheme in ALLOWED_PROTOCOLS
```

### Best Practices

1. **Allowlist Approach:** Only allow specific domains, not blocklist
2. **Validate at Multiple Layers:** URL, DNS resolution, IP address
3. **Block Private IPs:** Don't allow access to internal networks
4. **Disable Redirects:** Or validate redirect targets
5. **Use Dedicated Service:** Separate service for external requests (with no internal access)
6. **Rate Limiting:** Prevent scanning and abuse
7. **Monitoring:** Log and alert on suspicious patterns

### Defense in Depth

```python
# Example: Multiple protection layers
class RobustSSRFProtection:
    """
    Multi-layer SSRF protection.

    Layers:
    1. Input validation
    2. DNS resolution check
    3. Network-level restrictions
    4. Application-level monitoring
    5. Response validation
    """

    @classmethod
    def secure_fetch(cls, url: str) -> dict:
        """Fetch URL with maximum security."""

        # Layer 1: Input validation
        if not cls._validate_input(url):
            return {"error": "Invalid URL"}

        # Layer 2: Parse and validate structure
        parsed = urlparse(url)
        if not cls._validate_structure(parsed):
            return {"error": "URL structure not allowed"}

        # Layer 3: DNS resolution and IP validation
        ip = cls._resolve_and_validate_dns(parsed.hostname)
        if not ip:
            return {"error": "Domain not allowed"}

        # Layer 4: Make request with restrictions
        response = cls._make_restricted_request(url)
        if not response:
            return {"error": "Request failed"}

        # Layer 5: Validate response
        if not cls._validate_response(response):
            return {"error": "Response validation failed"}

        # Layer 6: Monitor and log
        cls._monitor_usage(url, response)

        return {"content": response.text}

    @classmethod
    def _validate_input(cls, url: str) -> bool:
        """Basic input validation."""
        if not url or not isinstance(url, str):
            return False

        if len(url) > 2048:  # URL too long
            return False

        # Check for obvious bypasses
        bypasses = ['@', '\\', 'localhost', '127.', '0.0.0.0']
        if any(b in url.lower() for b in bypasses):
            return False

        return True

    @classmethod
    def _validate_structure(cls, parsed) -> bool:
        """Validate URL structure."""
        # Only HTTP/HTTPS
        if parsed.scheme not in ['http', 'https']:
            return False

        # Must have hostname
        if not parsed.hostname:
            return False

        # No username/password in URL (can hide real destination)
        if parsed.username or parsed.password:
            return False

        return True

    @classmethod
    def _resolve_and_validate_dns(cls, hostname: str) -> Optional[str]:
        """Resolve DNS and validate IP."""
        try:
            import socket

            # Resolve hostname
            ip_str = socket.gethostbyname(hostname)
            ip = ipaddress.ip_address(ip_str)

            # Check against private ranges
            if any(ip in r for r in SSRFProtection.PRIVATE_RANGES):
                logger.warning(f"Private IP blocked: {ip}")
                return None

            return ip_str

        except Exception as e:
            logger.error(f"DNS resolution failed: {e}")
            return None

    @classmethod
    def _make_restricted_request(cls, url: str):
        """Make request with security restrictions."""
        try:
            # Use separate network namespace or proxy
            # that blocks access to private networks

            response = requests.get(
                url,
                timeout=10,
                allow_redirects=False,
                headers={'User-Agent': 'SecureFetcher/2.0'},
                # Use proxy that blocks private IPs
                proxies={'http': 'http://ssrf-proxy:3128'}
            )

            return response

        except Exception as e:
            logger.error(f"Request failed: {e}")
            return None

    @classmethod
    def _validate_response(cls, response) -> bool:
        """Validate response is safe."""
        # Check size
        if len(response.content) > 10 * 1024 * 1024:
            return False

        # Check content type (prevent binary exploits)
        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('text/'):
            return False

        return True

    @classmethod
    def _monitor_usage(cls, url: str, response):
        """Monitor for abuse patterns."""
        # Log the request
        SecurityLogger.log_event('ssrf_fetch', 'info', {
            'url': url,
            'response_size': len(response.content),
            'response_code': response.status_code
        })

        # Check for scanning patterns
        check_port_scanning(request.remote_addr, current_user.id)
```

### Real-World Case Study

**Capital One Breach (2019)**

While primarily a misconfiguration issue, SSRF played a key role. The attacker:
1. Found SSRF vulnerability in web application
2. Used it to access AWS metadata endpoint
3. Stole IAM role credentials from metadata
4. Used credentials to access S3 buckets
5. Downloaded 100 million customer records

**Lessons:**
- SSRF + cloud metadata = credential theft
- Block metadata endpoints at network level
- Use IMDSv2 (requires token, prevents SSRF)
- Principle of least privilege for IAM roles
- Monitor for metadata endpoint access

---

## Summary and Quick Reference

### OWASP Top 10 at a Glance

| Rank | Vulnerability | Primary Defense |
|------|--------------|-----------------|
| 1 | Broken Access Control | Enforce authorization on every request |
| 2 | Cryptographic Failures | Use strong encryption, hash passwords with bcrypt |
| 3 | Injection | Parameterized queries, input validation |
| 4 | Insecure Design | Threat modeling, security design principles |
| 5 | Security Misconfiguration | Secure defaults, regular audits, automation |
| 6 | Vulnerable Components | Dependency scanning, regular updates |
| 7 | Auth/Auth Failures | MFA, rate limiting, secure sessions |
| 8 | Data Integrity Failures | Verify signatures, validate checksums |
| 9 | Logging/Monitoring Failures | Log security events, real-time monitoring |
| 10 | SSRF | URL allowlist, block private IPs |

### Prevention Checklist

Use this checklist for every new feature:

```markdown
Access Control
- [ ] Authorization checks on all endpoints
- [ ] User can only access their own resources
- [ ] Admin functions require admin role
- [ ] Direct object references are indirect or validated

Cryptography
- [ ] Passwords hashed with bcrypt
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced (HSTS header)
- [ ] Cryptographically secure random numbers

Input Handling
- [ ] All inputs validated (type, length, format)
- [ ] Parameterized queries (no string concatenation)
- [ ] Output encoded for context (HTML, JavaScript, etc.)
- [ ] File uploads restricted and validated

Design
- [ ] Threat model created
- [ ] Rate limiting implemented
- [ ] Security controls at multiple layers
- [ ] Fails securely on errors

Configuration
- [ ] Debug mode off in production
- [ ] Security headers configured
- [ ] Unnecessary services disabled
- [ ] Default credentials changed

Dependencies
- [ ] All dependencies updated
- [ ] Vulnerability scan passed
- [ ] Unused dependencies removed
- [ ] Hashes verified

Authentication
- [ ] MFA available
- [ ] Password policy enforced
- [ ] Account lockout after failures
- [ ] Session management secure

Integrity
- [ ] Updates verified (signatures, checksums)
- [ ] Secure serialization formats (JSON, not pickle)
- [ ] CI/CD pipeline secured
- [ ] Dependencies pinned with hashes

Logging
- [ ] Authentication events logged
- [ ] Authorization failures logged
- [ ] Data access logged
- [ ] Alerts configured for anomalies

Network
- [ ] SSRF protections in place
- [ ] Private IP ranges blocked
- [ ] URL allowlist enforced
- [ ] Redirects validated
```

### Next Steps

1. **Start with the basics:** Focus on input validation, parameterized queries, and access control
2. **Use tools:** Static analysis, dependency scanning, and DAST tools
3. **Security reviews:** Include security considerations in code reviews
4. **Testing:** Write security test cases for each vulnerability type
5. **Continuous learning:** OWASP updates regularly; stay current

### Resources

- **OWASP Top 10 (Latest):** https://owasp.org/Top10/
- **OWASP Cheat Sheets:** https://cheatsheetseries.owasp.org/
- **Practice:** OWASP WebGoat, DVWA, HackTheBox
- **Tools:** Snyk, Semgrep, OWASP ZAP, Burp Suite

## Related Topics

- **[Authentication Patterns](../authentication-patterns/README.md)**: Deep dive into secure authentication
- **[Secrets Management](../secrets-management/README.md)**: Protecting credentials and keys
- **[Threat Modeling](../threat-modeling/README.md)**: Proactive security design
- **[Compliance](../compliance/README.md)**: Meeting regulatory requirements

---

**Remember:** Security is a continuous process, not a one-time fix. The OWASP Top 10 evolves as attack patterns change. Regular security reviews, updates, and testing are essential to maintaining secure applications.