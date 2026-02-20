# Security Fundamentals

## What is Security in Software?

Security in software engineering is the practice of protecting applications, data, and systems from unauthorized access, theft, damage, or disruption. It's about building software that behaves correctly even when people actively try to break it, steal from it, or use it in unintended ways.

Think of software security like building a house. You don't just build walls and a roof — you add locks to doors, alarms for windows, safes for valuables, and maybe cameras to monitor what's happening. Each layer of protection serves a specific purpose, and together they create a secure environment.

## Why Does Security Matter?

Security isn't optional or something you add later. It's a fundamental requirement because:

**For Users:**
- Protects personal information (passwords, credit cards, medical records)
- Prevents identity theft and fraud
- Ensures privacy and control over personal data

**For Organizations:**
- Prevents financial losses from breaches (average cost: $4.45M per breach in 2023)
- Protects reputation and customer trust
- Ensures regulatory compliance (GDPR fines up to €20M or 4% of revenue)
- Maintains business continuity

**For Society:**
- Protects critical infrastructure (power grids, hospitals, banks)
- Prevents large-scale data theft
- Maintains trust in digital systems

### Real-World Impact

**Equifax Breach (2017)**: A single unpatched vulnerability exposed 147 million people's personal data including Social Security numbers. Cost: $1.4 billion in settlements and remediation.

**SolarWinds Attack (2020)**: Compromised software updates affected 18,000+ organizations including government agencies. Demonstrated how supply chain attacks can have massive downstream impact.

**Capital One Breach (2019)**: Misconfigured firewall exposed 100 million customer records. A preventable configuration error led to massive data exposure.

## The Security Mindset

Security thinking is fundamentally different from feature development:

### Trust Nothing
- Assume all input is malicious until proven otherwise
- Verify everything, even data from your own database
- Never trust client-side validation alone

### Defense in Depth
- Multiple layers of protection
- If one layer fails, others provide backup
- No single point of failure

### Least Privilege
- Grant minimum permissions needed
- Temporary access when possible
- Regular permission audits

### Fail Securely
- When errors occur, fail to a secure state
- Don't expose error details to users
- Log failures for investigation

## Core Security Principles

### 1. Confidentiality
Ensuring information is only accessible to authorized people.

**Example:** Encrypting passwords so database administrators can't read them.

### 2. Integrity
Ensuring information hasn't been tampered with.

**Example:** Using checksums to verify downloaded files haven't been modified.

### 3. Availability
Ensuring systems are accessible when needed.

**Example:** DDoS protection to keep services running under attack.

### 4. Authentication
Verifying "you are who you claim to be."

**Example:** Password + SMS code proves both knowledge (password) and possession (phone).

### 5. Authorization
Determining "what you're allowed to do."

**Example:** Admin users can delete records, regular users can only view their own data.

### 6. Non-Repudiation
Ensuring actions can't be denied later.

**Example:** Digital signatures on contracts prove who signed them.

## How Attacks Happen

Understanding attack patterns helps you defend against them:

### 1. Input-Based Attacks
Attacker sends malicious data to your application.

```python
# VULNERABLE: SQL Injection
username = request.form['username']
query = f"SELECT * FROM users WHERE username = '{username}'"
# Attacker sends: admin' OR '1'='1
# Final query: SELECT * FROM users WHERE username = 'admin' OR '1'='1'
# Result: Returns all users, bypassing authentication

# SECURE: Parameterized query
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))
```

### 2. Authentication Attacks
Trying to access accounts without proper credentials.

**Techniques:**
- **Brute force:** Try millions of password combinations
- **Credential stuffing:** Use leaked passwords from other breaches
- **Session hijacking:** Steal active session tokens
- **Phishing:** Trick users into revealing credentials

### 3. Authorization Attacks
Accessing resources you shouldn't have access to.

```python
# VULNERABLE: Insecure Direct Object Reference
@app.route('/invoice/<invoice_id>')
def get_invoice(invoice_id):
    # No check if user owns this invoice!
    return database.get_invoice(invoice_id)
# Attacker changes URL from /invoice/123 to /invoice/124

# SECURE: Authorization check
@app.route('/invoice/<invoice_id>')
def get_invoice(invoice_id):
    invoice = database.get_invoice(invoice_id)
    if invoice.user_id != current_user.id:
        abort(403)  # Forbidden
    return invoice
```

### 4. Configuration Attacks
Exploiting misconfigured systems.

**Common mistakes:**
- Default passwords still active
- Debug mode enabled in production
- Unnecessary services exposed
- Overly permissive CORS settings

### 5. Supply Chain Attacks
Compromising dependencies or build tools.

**Example:** Malicious npm package with 2 million downloads that stole environment variables containing API keys.

## Security Through the Development Lifecycle

Security isn't a single phase — it's integrated throughout:

### 1. Design Phase
**Threat Modeling:** Identify what could go wrong before writing code.
- What are we building?
- What can go wrong?
- What are we doing about it?
- Did we do a good job?

### 2. Development Phase
**Secure Coding Practices:**
- Input validation on all user data
- Output encoding to prevent XSS
- Parameterized queries to prevent SQL injection
- Proper error handling without information leakage
- Security-focused code reviews

### 3. Testing Phase
**Security Testing:**
- Static analysis (SAST): Scan code for vulnerabilities
- Dynamic analysis (DAST): Test running application
- Dependency scanning: Check for vulnerable libraries
- Penetration testing: Simulate real attacks

### 4. Deployment Phase
**Secure Configuration:**
- Secrets management (no hardcoded credentials)
- Principle of least privilege
- Network segmentation
- Monitoring and alerting

### 5. Operations Phase
**Continuous Security:**
- Log analysis for suspicious activity
- Regular security updates
- Incident response planning
- Vulnerability management

## Key Security Concepts

### Encryption
Transforming data so only authorized parties can read it.

**Types:**
- **At rest:** Encrypting stored data (database, files)
- **In transit:** Encrypting data being transmitted (HTTPS)
- **End-to-end:** Only sender and receiver can decrypt

```python
# Example: Encrypting sensitive data
from cryptography.fernet import Fernet

# Generate key (store securely!)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
sensitive_data = "Patient SSN: 123-45-6789"
encrypted = cipher.encrypt(sensitive_data.encode())
# Result: b'gAAAAABh...' (unreadable)

# Decrypt (only with correct key)
decrypted = cipher.decrypt(encrypted).decode()
```

### Hashing
One-way transformation of data (can't be reversed).

**Use cases:**
- Password storage (store hash, not password)
- Data integrity verification (checksums)
- Digital signatures

```python
# Example: Hashing passwords
import bcrypt

# Storing password
password = "user_password_123"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
# Store: $2b$12$KIXn... (can't reverse to get original)

# Verifying password
if bcrypt.checkpw(password.encode(), hashed):
    print("Password correct")
```

### Tokens
Credentials that prove authentication without sending passwords repeatedly.

**Types:**
- **Session tokens:** Server-stored, referenced by ID
- **JWT:** Self-contained, signed by server
- **API keys:** Long-lived tokens for service access

### Certificate Authority (CA)
Trusted third party that vouches for identity.

**Analogy:** Like a passport office — they verify your identity and issue a document (certificate) that others trust because they trust the issuer.

## Best Practices Overview

### For All Applications

1. **Never Trust User Input**
   - Validate data type, length, format
   - Sanitize for context (SQL, HTML, shell)
   - Use allowlists over blocklists

2. **Use Strong Authentication**
   - Multi-factor authentication (MFA)
   - Strong password requirements
   - Account lockout after failed attempts

3. **Apply Least Privilege**
   - Minimum necessary permissions
   - Separate admin accounts from regular accounts
   - Regular permission audits

4. **Encrypt Sensitive Data**
   - HTTPS for all traffic
   - Encrypt data at rest
   - Use strong, modern algorithms (AES-256, RSA-2048+)

5. **Keep Software Updated**
   - Regular security patches
   - Dependency updates
   - Vulnerability scanning

6. **Log Security Events**
   - Authentication attempts (success and failure)
   - Authorization failures
   - Data access and modifications
   - System changes

7. **Plan for Incidents**
   - Incident response plan
   - Regular backups
   - Disaster recovery procedures
   - Communication protocols

### For Web Applications

```python
# Example: Security headers
from flask import Flask, make_response

@app.after_request
def add_security_headers(response):
    """
    Add security headers to every response.

    Why each header matters:
    - X-Content-Type-Options: Prevents MIME sniffing attacks
    - X-Frame-Options: Prevents clickjacking
    - Content-Security-Policy: Prevents XSS attacks
    - Strict-Transport-Security: Forces HTTPS
    """
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['Strict-Transport-Security'] = 'max-age=31536000'
    return response
```

### For APIs

```python
# Example: Rate limiting to prevent abuse
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.headers.get('X-API-Key', 'anonymous'),
    default_limits=["100 per hour"]
)

@app.route('/api/search')
@limiter.limit("10 per minute")  # Stricter for expensive operations
def search():
    """
    Rate limiting prevents:
    - Brute force attacks
    - Resource exhaustion
    - Scraping and abuse

    Best practices:
    - Different limits for different endpoints
    - Higher limits for authenticated users
    - Clear error messages when limit exceeded
    """
    return perform_search()
```

## Common Security Pitfalls

### 1. "Security Through Obscurity"
**Mistake:** Relying on keeping implementation details secret.

**Example:** Hiding API endpoints instead of requiring authentication.

**Why it fails:** Attackers can discover hidden endpoints through various methods (scanning, leaked code, etc.).

**Better approach:** Assume attackers know your system. Security should work even if implementation is public.

### 2. Rolling Your Own Crypto
**Mistake:** Creating custom encryption algorithms.

**Why it fails:** Cryptography is extremely difficult to get right. Professional cryptographers spend years creating and vetting algorithms.

**Better approach:** Use well-tested, industry-standard libraries (like libsodium, cryptography.io).

### 3. Client-Side Security
**Mistake:** Trusting client-side validation or security checks.

```javascript
// WRONG: Client-side check can be bypassed
if (user.isAdmin) {
    deleteAccount();  // Attacker can modify JavaScript
}

// RIGHT: Always validate on server
@app.route('/delete-account', methods=['POST'])
def delete_account():
    if not current_user.is_admin:
        abort(403)
    # Proceed with deletion
```

### 4. Ignoring Updates
**Mistake:** Not applying security patches promptly.

**Impact:** Known vulnerabilities remain exploitable. Attackers have public exploit code.

**Better approach:** Regular update schedule, automated vulnerability scanning, emergency patch procedures.

### 5. Weak Password Policies
**Mistake:** Allowing weak passwords or not using MFA.

**Impact:** Accounts easily compromised through brute force or credential stuffing.

**Better approach:**
- Minimum length requirements (12+ characters)
- Check against common password lists
- Multi-factor authentication
- Password managers encouraged

## Learning Path

This section covers security from fundamentals to advanced topics. Follow this path:

### 1. **OWASP Top 10** (Start Here)
Learn the most critical web application security risks and how to prevent them.

**Topics:**
- Injection attacks (SQL, NoSQL, OS commands)
- Broken authentication and session management
- Cross-Site Scripting (XSS)
- Insecure design patterns
- Security misconfiguration
- And 5 more critical vulnerabilities

**Why start here:** These account for the majority of security issues in web applications. Understanding these protects against 80%+ of common attacks.

[→ Go to OWASP Top 10 Guide](./owasp-top-10/README.md)

### 2. **Authentication Patterns**
Deep dive into verifying user identity securely.

**Topics:**
- OAuth2 flows (authorization code, implicit, client credentials)
- SAML for enterprise SSO
- JWT (JSON Web Tokens) deep dive
- API key management
- Session management and cookies
- Multi-factor authentication

**Build on:** OWASP Top 10 (specifically Broken Authentication)

[→ Go to Authentication Patterns Guide](./authentication-patterns/README.md)

### 3. **Secrets Management**
Handling sensitive credentials and configuration safely.

**Topics:**
- Environment variable pitfalls
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- Secret rotation strategies
- Preventing secret leaks

**Build on:** Authentication patterns (API keys and credentials)

[→ Go to Secrets Management Guide](./secrets-management/README.md)

### 4. **Threat Modeling**
Proactively identify security risks in your designs.

**Topics:**
- STRIDE methodology
- Trust boundaries
- Data flow diagrams
- Attack trees
- Risk assessment
- Example threat models

**Build on:** All previous topics (apply them systematically)

[→ Go to Threat Modeling Guide](./threat-modeling/README.md)

### 5. **Compliance**
Meeting legal and regulatory security requirements.

**Topics:**
- GDPR (data protection and privacy)
- HIPAA (healthcare data)
- PCI-DSS (payment card data)
- SOC2 (service organization controls)
- Technical controls for compliance

**Build on:** All previous topics (compliance requires comprehensive security)

[→ Go to Compliance Guide](./compliance/README.md)

## Quick Reference

### Security Checklist for New Features

```markdown
Authentication & Authorization
- [ ] All endpoints require authentication
- [ ] Authorization checks present (users can only access their own data)
- [ ] Session tokens are secure (HttpOnly, Secure, SameSite)
- [ ] Password complexity requirements enforced
- [ ] Account lockout after failed attempts

Input Validation
- [ ] All user input validated (type, length, format)
- [ ] SQL queries use parameterized statements
- [ ] File uploads restricted (type, size, location)
- [ ] URLs validated before redirects
- [ ] JSON/XML parsing has size limits

Output Encoding
- [ ] HTML content properly escaped
- [ ] JSON responses use proper content-type
- [ ] No sensitive data in error messages
- [ ] No sensitive data in logs

Cryptography
- [ ] HTTPS enforced (HSTS header present)
- [ ] Sensitive data encrypted at rest
- [ ] Strong algorithms used (AES-256, RSA-2048+)
- [ ] No hardcoded secrets
- [ ] Proper random number generation (cryptographically secure)

Configuration
- [ ] Debug mode disabled in production
- [ ] Unnecessary services disabled
- [ ] Security headers configured
- [ ] CORS policy restrictive
- [ ] Error messages don't leak information

Dependencies
- [ ] All dependencies up to date
- [ ] Vulnerability scan passed
- [ ] Dependencies from trusted sources
- [ ] License compliance checked

Logging & Monitoring
- [ ] Authentication events logged
- [ ] Authorization failures logged
- [ ] Data access logged (who accessed what, when)
- [ ] Alerts configured for suspicious activity
- [ ] Logs protected from tampering

Testing
- [ ] Security unit tests present
- [ ] Integration tests cover security scenarios
- [ ] Static analysis performed
- [ ] Dependency scan performed
- [ ] Manual testing included attack scenarios
```

### When to Escalate

Not all security issues are equal. Use this guide to prioritize:

**Critical (Fix Immediately):**
- Remote code execution possible
- SQL injection with data exposure
- Authentication bypass
- Hardcoded secrets in production
- Known vulnerability with active exploits

**High (Fix This Week):**
- XSS on sensitive pages
- Authorization bypass
- Sensitive data in logs
- Missing encryption for PII
- Outdated dependencies with CVE

**Medium (Fix This Sprint):**
- Missing rate limiting
- Weak password policy
- Missing security headers
- Overly permissive CORS
- Information disclosure in errors

**Low (Fix When Possible):**
- Missing security in non-sensitive areas
- Verbose error messages
- Non-critical dependencies outdated
- Documentation gaps

## Tools and Resources

### Security Testing Tools

**Static Analysis (SAST):**
- **Bandit** (Python): Scans code for security issues
- **Brakeman** (Ruby): Rails security scanner
- **SonarQube**: Multi-language code quality and security
- **Semgrep**: Pattern-based code analysis

**Dependency Scanning:**
- **Snyk**: Finds vulnerabilities in dependencies
- **OWASP Dependency-Check**: Identifies known vulnerable components
- **npm audit / pip-audit**: Language-specific tools

**Dynamic Analysis (DAST):**
- **OWASP ZAP**: Web application security scanner
- **Burp Suite**: Web vulnerability scanner and proxy
- **Nikto**: Web server scanner

**Secret Scanning:**
- **git-secrets**: Prevents committing secrets
- **TruffleHog**: Finds secrets in git history
- **GitGuardian**: Real-time secret detection

### Learning Resources

**Practice Environments:**
- **OWASP WebGoat**: Deliberately vulnerable application for learning
- **HackTheBox**: Security training platform
- **PentesterLab**: Web penetration testing exercises
- **DVWA (Damn Vulnerable Web App)**: Practice environment

**Reference Materials:**
- **OWASP Top 10**: Most critical web security risks
- **CWE Top 25**: Most dangerous software weaknesses
- **NIST Cybersecurity Framework**: Comprehensive security guide
- **SANS Posters**: Quick reference guides

**Staying Updated:**
- **CVE Database**: Public vulnerability disclosures
- **Security mailing lists**: Language/framework specific
- **Security blogs**: Krebs on Security, Schneier on Security
- **Conferences**: DEF CON, Black Hat, OWASP AppSec

## Incident Response Basics

Even with perfect security, incidents can happen. Be prepared:

### 1. Detection
**Signs of compromise:**
- Unusual login patterns
- Unexpected system changes
- Alerts from monitoring tools
- User reports of suspicious activity

### 2. Containment
**Immediate actions:**
- Isolate affected systems
- Revoke compromised credentials
- Block malicious IPs
- Preserve evidence

### 3. Investigation
**Key questions:**
- What happened?
- When did it start?
- What data was accessed?
- How did attackers get in?

### 4. Recovery
**Steps to restore:**
- Remove attacker access
- Patch vulnerabilities
- Restore from clean backups
- Reset credentials

### 5. Lessons Learned
**Post-incident:**
- Document timeline
- Identify root cause
- Implement preventive measures
- Update response plan

## Next Steps

Start with the **OWASP Top 10** guide to learn about the most critical web application security risks. Each guide builds on previous knowledge and includes practical examples.

Security is a journey, not a destination. Every feature you build, every line of code you write, is an opportunity to build security in from the start.

Remember: **Security is not a feature you add. It's a quality you build in.**

## Related Topics

### Prerequisites
- [Foundations](../00-foundations/README.md) - Networking basics, HTTP/HTTPS, and how data travels
- [Programming](../01-programming/README.md) - Writing secure code and understanding common vulnerability patterns

### Next Steps
- [Infrastructure & DevOps](../06-infrastructure/README.md) - Container security, CI/CD pipeline security, secrets management
- [Cloud Platforms](../07-cloud/RESOURCES.md) - Cloud-specific security (IAM, VPC, encryption services)

### Complementary Topics
- [System Architecture](../02-architectures/README.md) - Security architecture patterns (zero trust, defense in depth)
- [Development Methodologies](../03-methodologies/README.md) - DevSecOps integration and security testing workflows
- [Frontend Development](../04-frontend/README.md) - XSS prevention, CSP, and client-side security
- [Backend Development](../05-backend/README.md) - Secure API design, authentication, authorization
- [AI/ML](../09-ai-ml/README.md) - ML model security, adversarial attacks, data privacy
- [Domain Examples](../10-domain-examples/README.md) - Industry-specific compliance (HIPAA, PCI-DSS, SOX)
- [Case Studies](../11-case-studies/README.md) - Real-world security implementations and incident analysis
- [Career Development](../12-career/README.md) - Security certifications and career paths

### Learning Resources
- [YouTube, Books & Courses for Security](./RESOURCES.md)

---

**Remember:** Security is everyone's responsibility. Whether you're a frontend developer, backend engineer, DevOps specialist, or manager — security considerations apply to your work. Start with the basics, build on them continuously, and always think like an attacker while building like a defender.
