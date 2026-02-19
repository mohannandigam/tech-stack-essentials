# Authentication Patterns

## What is Authentication?

Authentication is the process of verifying that someone or something is who they claim to be. It's the digital equivalent of showing ID at an airport — you prove your identity before being granted access.

Think of authentication like a bouncer at a club checking IDs. The bouncer needs to:
1. Verify the ID is real (not fake)
2. Confirm the person matches the ID
3. Check the ID hasn't expired
4. Sometimes ask for additional proof (second form of ID)

In software, authentication establishes trust before granting access to resources, data, or functionality.

## Why Does Authentication Matter?

Authentication is the front line of application security:

**Without Authentication:**
- Anyone can access anyone else's data
- No accountability for actions
- No way to personalize experiences
- Impossible to enforce business rules

**Real-World Costs:**
- **Average credential-based breach cost:** $4.24M
- **Weak passwords used:** 81% of breaches involve stolen/weak passwords
- **User frustration:** Poor authentication UX drives abandonment

**Benefits of Strong Authentication:**
- Protects user data and privacy
- Enables auditing and compliance
- Prevents unauthorized access
- Builds user trust

## Core Authentication Concepts

### Authentication Factors

Authentication methods fall into three categories:

**1. Something You Know**
- Passwords
- PIN codes
- Security questions
- Passphrases

**2. Something You Have**
- Phone (SMS codes)
- Hardware tokens (YubiKey)
- Smart cards
- Authentication apps (Google Authenticator)

**3. Something You Are**
- Fingerprint
- Face recognition
- Iris scan
- Voice recognition

**Multi-Factor Authentication (MFA):** Combining two or more factors provides much stronger security than any single factor alone.

### Sessions vs Tokens

**Sessions (Stateful):**
- Server stores session data
- Client receives session ID
- Every request includes session ID
- Server looks up session data

**Tokens (Stateless):**
- No server-side storage needed
- All data in the token itself
- Token is signed/encrypted
- Server validates signature

## Best Practices Summary

1. **Password Security**
   - Use bcrypt, scrypt, or Argon2
   - Enforce strong password requirements (12+ characters)
   - Check against breach databases
   - Never store passwords in plain text

2. **Multi-Factor Authentication**
   - TOTP is more secure than SMS
   - Provide backup codes
   - Support multiple MFA methods
   - Make MFA mandatory for sensitive operations

3. **Session Management**
   - Regenerate session ID on login
   - Use secure cookie flags (HttpOnly, Secure, SameSite)
   - Implement session timeout
   - Provide logout functionality

4. **Token Security**
   - Use strong secrets (256+ bits)
   - Short expiration times (15-60 minutes)
   - Implement token revocation
   - Always use HTTPS

5. **Rate Limiting**
   - Prevent brute force attacks
   - Limit failed login attempts
   - Rate limit by IP and username
   - Implement account lockout

6. **Monitoring and Logging**
   - Log all authentication attempts
   - Alert on suspicious patterns
   - Track successful logins from new locations
   - Monitor for credential stuffing

## Quick Reference

### Password Hashing (Python)
```python
import bcrypt

# Hash password
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# Verify password
is_valid = bcrypt.checkpw(password.encode(), stored_hash)
```

### JWT Tokens (Python)
```python
import jwt
from datetime import datetime, timedelta

# Create token
payload = {
    'sub': user_id,
    'exp': datetime.utcnow() + timedelta(hours=1),
    'iat': datetime.utcnow()
}
token = jwt.encode(payload, secret_key, algorithm='HS256')

# Verify token
try:
    payload = jwt.decode(token, secret_key, algorithms=['HS256'])
except jwt.ExpiredSignatureError:
    # Token expired
    pass
except jwt.InvalidTokenError:
    # Invalid token
    pass
```

### Rate Limiting (Python with Redis)
```python
import redis

redis_client = redis.Redis()

def is_rate_limited(ip_address: str, max_attempts: int = 5, window_seconds: int = 300) -> bool:
    key = f"rate_limit:{ip_address}"
    current = redis_client.get(key)

    if current and int(current) >= max_attempts:
        return True

    pipe = redis_client.pipeline()
    pipe.incr(key)
    pipe.expire(key, window_seconds)
    pipe.execute()

    return False
```

## Authentication Pattern Comparison

| Pattern | Security Level | Complexity | Best For |
|---------|---------------|-----------|----------|
| **Username/Password** | Medium | Low | Simple applications, internal tools |
| **Password + MFA (TOTP)** | High | Medium | Security-critical applications |
| **Password + SMS** | Medium-High | Low | Consumer apps, wide accessibility |
| **OAuth 2.0** | High | Medium | Social login, third-party integrations |
| **SAML** | High | High | Enterprise SSO, corporate environments |
| **JWT** | Medium-High | Medium | Stateless APIs, mobile applications |
| **API Keys** | Medium | Low | API access, machine-to-machine |
| **Mutual TLS** | Very High | High | Service-to-service, zero-trust networks |

## Common Authentication Vulnerabilities

1. **Weak Password Policies**
   - Problem: Allowing passwords like "password123"
   - Solution: Enforce length (12+ chars), check against breach databases

2. **No Rate Limiting**
   - Problem: Unlimited login attempts enable brute force
   - Solution: Limit to 5 attempts per 15 minutes, implement account lockout

3. **Session Fixation**
   - Problem: Session ID not regenerated on login
   - Solution: Always regenerate session ID after authentication

4. **Credential Stuffing**
   - Problem: Attackers use leaked credentials from other sites
   - Solution: CAPTCHA after failures, MFA, breach password checking

5. **Missing MFA**
   - Problem: Password-only authentication
   - Solution: Implement TOTP or SMS-based MFA

6. **Insecure Password Storage**
   - Problem: Passwords stored in plain text or weak hashing
   - Solution: Use bcrypt, scrypt, or Argon2 with appropriate cost factors

7. **Token Theft**
   - Problem: Tokens transmitted insecurely or stored in localStorage
   - Solution: HTTPS only, HttpOnly cookies, short expiration times

## Testing Authentication

Essential test cases for authentication systems:

```python
# Test successful login
def test_successful_login():
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'ValidPass123!'
    })
    assert response.status_code == 200
    assert 'token' in response.json

# Test invalid credentials
def test_invalid_credentials():
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'wrong'
    })
    assert response.status_code == 401

# Test rate limiting
def test_rate_limiting():
    for i in range(10):
        client.post('/login', json={
            'username': 'testuser',
            'password': 'wrong'
        })

    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'wrong'
    })
    assert response.status_code == 429  # Too Many Requests

# Test MFA enforcement
def test_mfa_required():
    # User with MFA enabled
    response = client.post('/login', json={
        'username': 'mfa_user',
        'password': 'ValidPass123!'
    })
    assert response.json['requires_mfa'] == True

# Test session expiration
def test_session_expiration():
    # Login and get token
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'ValidPass123!'
    })
    token = response.json['token']

    # Advance time past expiration
    # ... (mock time or wait)

    # Try to use expired token
    response = client.get('/protected', headers={
        'Authorization': f'Bearer {token}'
    })
    assert response.status_code == 401
```

## Implementation Checklist

```markdown
Basic Authentication
- [ ] Password hashing with bcrypt/Argon2
- [ ] Password strength validation (12+ characters)
- [ ] Check against breach databases (HaveIBeenPwned)
- [ ] Secure session management
- [ ] HttpOnly, Secure, SameSite cookie flags
- [ ] Session regeneration on login
- [ ] Proper logout implementation

Rate Limiting & Abuse Prevention
- [ ] Rate limiting on login endpoint (5/15min)
- [ ] Account lockout after failures (lock for 1 hour)
- [ ] CAPTCHA after 3 failed attempts
- [ ] Credential stuffing detection
- [ ] IP reputation checking
- [ ] Device fingerprinting

Multi-Factor Authentication
- [ ] TOTP support (Google Authenticator compatible)
- [ ] SMS fallback option
- [ ] Backup codes generation and management
- [ ] Recovery process for lost MFA device
- [ ] MFA enforcement for admin accounts

Token Management
- [ ] Cryptographically secure token generation
- [ ] Short token expiration (15-60 minutes)
- [ ] Refresh token implementation
- [ ] Token revocation support
- [ ] Token rotation on refresh

Monitoring & Logging
- [ ] Log all authentication attempts
- [ ] Log successful logins with IP and device
- [ ] Alert on suspicious activity
- [ ] Alert on login from new location
- [ ] Track failed authentication patterns
- [ ] Monitor for brute force attempts

Security Headers
- [ ] Content-Security-Policy
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Strict-Transport-Security (HSTS)
- [ ] X-XSS-Protection (legacy browsers)

User Experience
- [ ] Clear error messages (without revealing details)
- [ ] Password strength indicator
- [ ] "Show password" toggle
- [ ] "Remember me" option (with clear explanation)
- [ ] Password reset flow
- [ ] Email verification flow
```

## Related Topics

- **[OWASP Top 10](../owasp-top-10/README.md)** - Authentication failures (#7)
- **[Secrets Management](../secrets-management/README.md)** - Storing authentication secrets
- **[Threat Modeling](../threat-modeling/README.md)** - Identifying authentication threats
- **[Compliance](../compliance/README.md)** - Authentication requirements for regulations

---

**Remember:** Authentication is just the first step. Always implement proper authorization, encryption, logging, and monitoring for comprehensive security. The best authentication system is one that's both secure and usable — if it's too complex, users will find ways around it.
