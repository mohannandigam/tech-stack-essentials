# Authentication and Authorization

## What is Authentication and Authorization?

**Authentication** is the process of verifying **who someone is**. When you log into a website with a username and password, you're proving your identity—the system authenticates you.

**Authorization** is the process of verifying **what someone can do**. After you log in, authorization determines which pages you can access, which actions you can perform, and which data you can see.

Think of going to the airport:
- **Authentication**: Showing your ID at security (proving you are who you claim to be)
- **Authorization**: Your boarding pass determines which flight you can board and which seat you can sit in (what you're allowed to do)

You need both: authentication proves identity, and authorization grants permissions based on that identity.

## Why Do They Matter?

Authentication and authorization are critical for:

- **Security**: Prevent unauthorized access to sensitive data and functionality
- **Privacy**: Ensure users can only see their own data (medical records, financial info, private messages)
- **Compliance**: Meet regulatory requirements (HIPAA, GDPR, SOC 2)
- **Accountability**: Track who performed which actions (audit trails)
- **Personalization**: Deliver user-specific content and experiences
- **Business rules**: Enforce different permissions for different user types (free vs. paid, employee vs. manager)

Without proper authentication and authorization, your application is vulnerable to data breaches, fraud, and legal liability.

## Simple Analogy

Imagine a hotel:

**Authentication (Who are you?)**
- You check in at the front desk with your ID and reservation
- They verify you're the person who booked the room
- You receive a key card

**Authorization (What can you do?)**
- Your key card opens your room (not other guest rooms)
- It grants access to the gym and pool (guest privileges)
- It doesn't open the staff room or office (no staff privileges)
- VIP guests get lounge access (role-based permissions)

The hotel knows who you are (authentication via key card) and what you're allowed to do (authorization based on your guest type).

## Authentication vs. Authorization

| Aspect | Authentication | Authorization |
|--------|----------------|---------------|
| **Question** | Who are you? | What can you do? |
| **Timing** | Happens first | Happens after authentication |
| **Mechanism** | Credentials (password, token, biometric) | Permissions, roles, policies |
| **Result** | User identity confirmed | Access granted or denied |
| **Failure** | Login rejected | "403 Forbidden" or "You don't have permission" |
| **Example** | Username + password | Admin can delete users, regular users cannot |

## Authentication Methods

### 1. Session-Based Authentication

**How it works**: Server creates a session after successful login and stores it. Client receives a session ID in a cookie.

**Flow**:
```
1. User submits username + password
2. Server verifies credentials
3. Server creates session object, stores in database/memory
4. Server sends session ID to client as cookie
5. Client includes cookie in every subsequent request
6. Server looks up session by ID to identify user
7. On logout, server destroys session
```

**Implementation** (Python Flask):

```python
from flask import Flask, request, session, jsonify
from werkzeug.security import check_password_hash
from datetime import timedelta

app = Flask(__name__)
app.secret_key = "your-secret-key-here"  # Use environment variable in production
app.config["SESSION_COOKIE_HTTPONLY"] = True  # Prevent JavaScript access
app.config["SESSION_COOKIE_SECURE"] = True    # HTTPS only
app.config["SESSION_COOKIE_SAMESITE"] = "Lax" # CSRF protection
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Validate input
    if not username or not password:
        return {"error": "Username and password required"}, 400

    # Look up user
    user = db.query(User).filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid credentials"}, 401

    # Create session
    session.permanent = True
    session["user_id"] = user.id
    session["username"] = user.username
    session["role"] = user.role

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return {"message": "Logout successful"}

@app.route("/api/profile", methods=["GET"])
def get_profile():
    # Check if user is authenticated
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401

    user = db.query(User).filter_by(id=session["user_id"]).first()
    return user.to_dict()
```

**Pros**:
- Simple to implement
- Server has full control (can revoke sessions instantly)
- Works well with traditional web apps
- Session data can store more than just user ID

**Cons**:
- Requires server-side storage (memory, database, Redis)
- Harder to scale horizontally (need shared session store)
- Doesn't work well for mobile apps or SPAs
- CSRF vulnerability (need additional protection)

**Use cases**:
- Traditional server-rendered web applications
- Admin dashboards
- Internal tools
- Applications with server-side rendering

### 2. Token-Based Authentication (JWT)

**How it works**: Server creates a signed token containing user info. Client stores token and sends it with every request.

**JWT Structure**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature

Decoded:
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Flow**:
```
1. User submits username + password
2. Server verifies credentials
3. Server creates JWT with user info and signs it
4. Server sends JWT to client
5. Client stores JWT (localStorage, memory, secure cookie)
6. Client includes JWT in Authorization header for every request
7. Server verifies JWT signature and extracts user info
8. On logout, client deletes JWT (server doesn't track)
```

**Implementation** (Python Flask):

```python
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
SECRET_KEY = "your-secret-key"  # Use environment variable in production

def create_token(user):
    """Generate JWT token for user"""
    payload = {
        "sub": user.id,  # Subject (user ID)
        "username": user.username,
        "role": user.role,
        "iat": datetime.utcnow(),  # Issued at
        "exp": datetime.utcnow() + timedelta(hours=24)  # Expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

def require_auth(f):
    """Decorator to protect routes"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid authorization header"}, 401

        token = auth_header.split(" ")[1]
        payload = verify_token(token)

        if not payload:
            return {"error": "Invalid or expired token"}, 401

        # Add user info to request context
        request.user_id = payload["sub"]
        request.username = payload["username"]
        request.role = payload["role"]

        return f(*args, **kwargs)
    return wrapper

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Validate input
    if not username or not password:
        return {"error": "Username and password required"}, 400

    # Look up user
    user = db.query(User).filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid credentials"}, 401

    # Create token
    token = create_token(user)

    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }

@app.route("/api/profile", methods=["GET"])
@require_auth
def get_profile():
    # User info available from @require_auth decorator
    user = db.query(User).filter_by(id=request.user_id).first()
    return user.to_dict()
```

**Client Usage** (JavaScript):

```javascript
// Login and store token
async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  // Store token (use httpOnly cookie for better security)
  localStorage.setItem('token', data.token);
}

// Use token for authenticated requests
async function getProfile() {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
}

// Logout (just remove token)
function logout() {
  localStorage.removeItem('token');
}
```

**Pros**:
- Stateless (server doesn't store sessions)
- Easy to scale horizontally
- Works well with SPAs and mobile apps
- Can contain custom claims (roles, permissions)
- No CSRF vulnerability (not stored in cookies)

**Cons**:
- Can't revoke tokens before expiration (unless using blacklist)
- Token size increases with more data
- Vulnerable if token is stolen (use short expiration)
- Requires secure storage on client

**Use cases**:
- Single-page applications (SPAs)
- Mobile apps
- Microservices (service-to-service auth)
- APIs consumed by third parties

### 3. Refresh Tokens

**Problem**: Short-lived access tokens expire frequently, requiring re-login.

**Solution**: Use two tokens:
- **Access token**: Short-lived (15 minutes), used for API requests
- **Refresh token**: Long-lived (7 days), used to get new access tokens

**Flow**:
```
1. User logs in
2. Server returns access token (15 min) + refresh token (7 days)
3. Client uses access token for requests
4. When access token expires, client sends refresh token
5. Server validates refresh token, issues new access token
6. Repeat until refresh token expires
7. When refresh token expires, user must log in again
```

**Implementation**:

```python
import secrets
from datetime import datetime, timedelta

class RefreshToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(255), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def create_tokens(user):
    """Create access token and refresh token"""
    # Short-lived access token
    access_token = jwt.encode({
        "sub": user.id,
        "username": user.username,
        "role": user.role,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }, SECRET_KEY, algorithm="HS256")

    # Long-lived refresh token
    refresh_token_str = secrets.token_urlsafe(32)
    refresh_token = RefreshToken(
        token=refresh_token_str,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.session.add(refresh_token)
    db.session.commit()

    return access_token, refresh_token_str

@app.route("/api/login", methods=["POST"])
def login():
    # ... verify credentials ...

    access_token, refresh_token = create_tokens(user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": 900,  # 15 minutes in seconds
        "token_type": "Bearer"
    }

@app.route("/api/refresh", methods=["POST"])
def refresh():
    data = request.json
    refresh_token_str = data.get("refresh_token")

    if not refresh_token_str:
        return {"error": "Refresh token required"}, 400

    # Look up refresh token
    refresh_token = db.query(RefreshToken).filter_by(
        token=refresh_token_str,
        revoked=False
    ).first()

    if not refresh_token:
        return {"error": "Invalid refresh token"}, 401

    if refresh_token.expires_at < datetime.utcnow():
        return {"error": "Refresh token expired"}, 401

    # Issue new access token
    user = db.query(User).filter_by(id=refresh_token.user_id).first()
    access_token = jwt.encode({
        "sub": user.id,
        "username": user.username,
        "role": user.role,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }, SECRET_KEY, algorithm="HS256")

    return {
        "access_token": access_token,
        "expires_in": 900
    }

@app.route("/api/logout", methods=["POST"])
def logout():
    data = request.json
    refresh_token_str = data.get("refresh_token")

    if refresh_token_str:
        # Revoke refresh token
        refresh_token = db.query(RefreshToken).filter_by(
            token=refresh_token_str
        ).first()
        if refresh_token:
            refresh_token.revoked = True
            db.session.commit()

    return {"message": "Logged out successfully"}
```

**Client Usage**:

```javascript
let accessToken = null;
let refreshToken = null;

async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  accessToken = data.access_token;
  refreshToken = data.refresh_token;

  // Store refresh token securely (httpOnly cookie is best)
  localStorage.setItem('refresh_token', refreshToken);
}

async function makeAuthenticatedRequest(url, options = {}) {
  // Try request with current access token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // If 401 (expired token), try to refresh
  if (response.status === 401) {
    const refreshResponse = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      accessToken = data.access_token;

      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        }
      });
    } else {
      // Refresh failed, need to log in again
      redirectToLogin();
    }
  }

  return response;
}
```

**Benefits**:
- Better security (access token exposed briefly)
- Better UX (fewer login prompts)
- Ability to revoke access (revoke refresh token)

### 4. OAuth2 and Third-Party Login

**What is OAuth2?** A protocol for delegated authorization—let users grant your app access to their data on another service (Google, GitHub, Facebook) without sharing their password.

**Use cases**:
- "Sign in with Google"
- "Sign in with GitHub"
- Accessing user's Google Drive files
- Posting to user's Twitter

**Flow** (Authorization Code):
```
1. User clicks "Sign in with Google"
2. Your app redirects to Google with client_id
3. User logs into Google and approves your app
4. Google redirects back to your app with authorization code
5. Your app exchanges code for access token (server-to-server)
6. Your app uses access token to fetch user info from Google
7. Your app creates local user account or logs them in
```

**Implementation** (Python Flask with Google OAuth2):

```python
from authlib.integrations.flask_client import OAuth
from flask import redirect, url_for, session

app = Flask(__name__)
app.secret_key = "your-secret-key"

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='YOUR_GOOGLE_CLIENT_ID',
    client_secret='YOUR_GOOGLE_CLIENT_SECRET',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.route("/api/login/google")
def login_google():
    """Redirect to Google login"""
    redirect_uri = url_for('auth_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route("/api/auth/callback")
def auth_callback():
    """Handle Google callback"""
    try:
        # Exchange authorization code for token
        token = google.authorize_access_token()

        # Get user info from Google
        user_info = token.get('userinfo')

        # Create or update local user
        user = db.query(User).filter_by(email=user_info['email']).first()
        if not user:
            user = User(
                email=user_info['email'],
                username=user_info['name'],
                google_id=user_info['sub'],
                email_verified=user_info['email_verified']
            )
            db.session.add(user)
            db.session.commit()

        # Create session or JWT
        session['user_id'] = user.id

        return redirect('/dashboard')

    except Exception as e:
        logger.error(f"OAuth error: {e}")
        return redirect('/login?error=oauth_failed')
```

**Pros**:
- Users don't need to create/remember another password
- Faster registration and login
- Can access user data from other services
- Security delegated to OAuth provider

**Cons**:
- Depends on third-party service
- Users without accounts on those services can't use it
- Privacy concerns (tracking)
- Complex to implement correctly

**Use cases**:
- Consumer applications (easier signup)
- Apps that integrate with other services
- Mobile apps (native OAuth flows)

### 5. Multi-Factor Authentication (MFA)

**What is it?** Requiring two or more verification factors:
- **Something you know**: Password
- **Something you have**: Phone, security key, authenticator app
- **Something you are**: Fingerprint, face recognition

**Common MFA Methods**:

**TOTP (Time-Based One-Time Password)** - Authenticator apps
```python
import pyotp
import qrcode
from io import BytesIO
import base64

def enable_mfa(user):
    """Generate TOTP secret and QR code"""
    # Generate secret
    secret = pyotp.random_base32()

    # Save to user record
    user.mfa_secret = secret
    db.session.commit()

    # Generate QR code for authenticator app
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=user.email,
        issuer_name="YourApp"
    )

    # Create QR code image
    qr = qrcode.make(totp_uri)
    buffer = BytesIO()
    qr.save(buffer, format='PNG')
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        "secret": secret,  # Show to user to enter manually if QR doesn't work
        "qr_code": f"data:image/png;base64,{qr_code_base64}"
    }

@app.route("/api/mfa/enable", methods=["POST"])
@require_auth
def enable_mfa_endpoint():
    user = db.query(User).filter_by(id=request.user_id).first()
    mfa_data = enable_mfa(user)
    return mfa_data

def verify_mfa(user, code):
    """Verify TOTP code"""
    totp = pyotp.TOTP(user.mfa_secret)
    return totp.verify(code, valid_window=1)  # Allow 30 sec window

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    mfa_code = data.get("mfa_code")

    # Verify password
    user = db.query(User).filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid credentials"}, 401

    # If MFA enabled, verify code
    if user.mfa_enabled:
        if not mfa_code:
            return {
                "error": "MFA code required",
                "mfa_required": True
            }, 401

        if not verify_mfa(user, mfa_code):
            return {"error": "Invalid MFA code"}, 401

    # Create session/token
    token = create_token(user)
    return {"token": token}
```

**SMS-Based MFA** (less secure but more accessible)
```python
import random
from twilio.rest import Client

def send_sms_code(user):
    """Send verification code via SMS"""
    # Generate 6-digit code
    code = f"{random.randint(0, 999999):06d}"

    # Store code with expiration
    user.sms_code = code
    user.sms_code_expires = datetime.utcnow() + timedelta(minutes=5)
    db.session.commit()

    # Send SMS (using Twilio)
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    client.messages.create(
        to=user.phone_number,
        from_=TWILIO_PHONE_NUMBER,
        body=f"Your verification code is: {code}"
    )

@app.route("/api/login", methods=["POST"])
def login():
    # ... verify password ...

    if user.sms_mfa_enabled:
        send_sms_code(user)
        return {
            "message": "SMS code sent",
            "mfa_required": True
        }

    # ... complete login ...

@app.route("/api/login/verify-sms", methods=["POST"])
def verify_sms():
    data = request.json
    user_id = data.get("user_id")
    code = data.get("code")

    user = db.query(User).filter_by(id=user_id).first()

    # Verify code and expiration
    if (user.sms_code == code and
        user.sms_code_expires > datetime.utcnow()):

        # Clear code
        user.sms_code = None
        user.sms_code_expires = None
        db.session.commit()

        # Complete login
        token = create_token(user)
        return {"token": token}
    else:
        return {"error": "Invalid or expired code"}, 401
```

**Benefits of MFA**:
- Dramatically reduces account takeovers
- Protects against password breaches
- Required for compliance (PCI-DSS, SOC 2)

## Authorization Models

### 1. Role-Based Access Control (RBAC)

**What it is**: Users are assigned roles, and roles have permissions.

**Example**:
- Roles: `user`, `moderator`, `admin`
- Permissions:
  - `user`: Can read posts, create posts
  - `moderator`: User permissions + can delete posts, ban users
  - `admin`: All permissions + manage users, configure system

**Implementation**:

```python
# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    role = db.Column(db.String(20), default='user')  # user, moderator, admin

# Define role permissions
ROLES = {
    'user': ['read:posts', 'create:posts', 'edit:own_posts'],
    'moderator': ['read:posts', 'create:posts', 'edit:own_posts', 'delete:posts', 'ban:users'],
    'admin': ['*']  # All permissions
}

def has_permission(user, permission):
    """Check if user's role has permission"""
    if user.role == 'admin':
        return True  # Admin has all permissions

    user_permissions = ROLES.get(user.role, [])
    return permission in user_permissions

def require_permission(permission):
    """Decorator to check permission"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not hasattr(request, 'user_id'):
                return {"error": "Unauthorized"}, 401

            user = db.query(User).filter_by(id=request.user_id).first()
            if not has_permission(user, permission):
                return {"error": "Forbidden: insufficient permissions"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Use in routes
@app.route("/api/posts/<post_id>", methods=["DELETE"])
@require_auth
@require_permission("delete:posts")
def delete_post(post_id):
    post = db.query(Post).filter_by(id=post_id).first_or_404()
    db.session.delete(post)
    db.session.commit()
    return {"message": "Post deleted"}
```

**Pros**:
- Simple to understand and implement
- Easy to manage (change role, all permissions update)
- Scales well for most applications

**Cons**:
- Not fine-grained (can't give specific user extra permission)
- Role explosion (too many roles for complex scenarios)

**Use cases**:
- Most web applications
- Admin panels
- Content management systems
- Internal tools

### 2. Attribute-Based Access Control (ABAC)

**What it is**: Permissions based on attributes of user, resource, and environment.

**Attributes**:
- **User**: role, department, clearance_level
- **Resource**: owner, visibility, classification
- **Environment**: time, location, IP address

**Example Policy**:
```
Allow if:
  - User.department == Resource.department
  - User.clearance_level >= Resource.classification
  - Environment.time is during business hours
```

**Implementation**:

```python
def can_access_document(user, document, environment):
    """Check if user can access document based on attributes"""

    # Rule 1: Owner can always access
    if document.owner_id == user.id:
        return True

    # Rule 2: Public documents accessible to all
    if document.visibility == 'public':
        return True

    # Rule 3: Department documents accessible to department members
    if (document.visibility == 'department' and
        user.department == document.department):
        return True

    # Rule 4: Classified documents require clearance
    if (document.classification and
        user.clearance_level < document.classification):
        return False

    # Rule 5: Restricted hours
    if environment.hour < 9 or environment.hour > 17:
        return False

    return False

@app.route("/api/documents/<doc_id>", methods=["GET"])
@require_auth
def get_document(doc_id):
    user = db.query(User).filter_by(id=request.user_id).first()
    document = db.query(Document).filter_by(id=doc_id).first_or_404()

    # Check access based on attributes
    environment = {
        'hour': datetime.utcnow().hour,
        'ip': request.remote_addr
    }

    if not can_access_document(user, document, environment):
        return {"error": "Access denied"}, 403

    return document.to_dict()
```

**Pros**:
- Very flexible and fine-grained
- Handles complex scenarios (time, location, etc.)
- Reduces need for many roles

**Cons**:
- More complex to implement
- Harder to understand and debug
- Performance overhead (evaluating many rules)

**Use cases**:
- Healthcare (HIPAA compliance)
- Government/military (clearance levels)
- Financial services (trading hours, location)
- Enterprise systems with complex rules

### 3. Resource-Based Authorization

**What it is**: Permissions tied to specific resources.

**Example**: Only the creator of a blog post can edit or delete it.

**Implementation**:

```python
@app.route("/api/posts/<post_id>", methods=["PUT"])
@require_auth
def update_post(post_id):
    user = db.query(User).filter_by(id=request.user_id).first()
    post = db.query(Post).filter_by(id=post_id).first_or_404()

    # Check ownership
    if post.author_id != user.id and user.role != 'admin':
        return {"error": "You can only edit your own posts"}, 403

    # Update post
    data = request.json
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    db.session.commit()

    return post.to_dict()
```

**Pros**:
- Intuitive (users own their data)
- Prevents unauthorized access to user data

**Cons**:
- Need to check ownership for every operation
- Doesn't handle shared resources well

**Use cases**:
- User profiles
- Personal documents
- Shopping carts
- Private messages

### 4. Single Sign-On (SSO)

**What it is**: Log in once, access multiple applications.

**Example**: Log into Google, then access Gmail, Drive, Calendar without logging in again.

**Protocols**:
- **SAML** (Security Assertion Markup Language): XML-based, enterprise standard
- **OAuth2/OIDC** (OpenID Connect): JSON-based, modern standard

**Benefits**:
- Better UX (one login for everything)
- Centralized user management
- Reduced password fatigue
- Easier to enforce policies (MFA, password requirements)

**OIDC Flow** (simplified):
```
1. User visits App A
2. App A redirects to Identity Provider (IdP)
3. User logs into IdP (if not already logged in)
4. IdP redirects back to App A with ID token
5. App A verifies token and creates session
6. User visits App B
7. App B redirects to IdP
8. IdP recognizes user (already logged in) and immediately redirects to App B with token
9. App B creates session (no login prompt)
```

**Implementation** (using Auth0 as IdP):

```python
from authlib.integrations.flask_client import OAuth

oauth = OAuth(app)
auth0 = oauth.register(
    'auth0',
    client_id='YOUR_AUTH0_CLIENT_ID',
    client_secret='YOUR_AUTH0_CLIENT_SECRET',
    api_base_url=f'https://{AUTH0_DOMAIN}',
    access_token_url=f'https://{AUTH0_DOMAIN}/oauth/token',
    authorize_url=f'https://{AUTH0_DOMAIN}/authorize',
    client_kwargs={'scope': 'openid profile email'}
)

@app.route("/login")
def login():
    redirect_uri = url_for('callback', _external=True)
    return auth0.authorize_redirect(redirect_uri)

@app.route("/callback")
def callback():
    token = auth0.authorize_access_token()
    user_info = token.get('userinfo')

    # Create or update user
    user = get_or_create_user(user_info)

    # Create session
    session['user_id'] = user.id

    return redirect('/dashboard')
```

**Use cases**:
- Enterprise applications (employees access many internal tools)
- Multi-product companies (Google, Microsoft)
- Partner integrations (access partner systems)

## Best Practices

### Safety and Security

**1. Password Security**

```python
from werkzeug.security import generate_password_hash, check_password_hash
import re

def validate_password(password):
    """Enforce strong password requirements"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase letter"

    if not re.search(r'[a-z]', password):
        return False, "Password must contain lowercase letter"

    if not re.search(r'[0-9]', password):
        return False, "Password must contain number"

    return True, None

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    password = data.get("password")

    # Validate password
    is_valid, error = validate_password(password)
    if not is_valid:
        return {"error": error}, 400

    # Hash password (NEVER store plaintext)
    password_hash = generate_password_hash(
        password,
        method='pbkdf2:sha256',
        salt_length=16
    )

    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=password_hash
    )
    db.session.add(user)
    db.session.commit()

    return {"message": "User created"}, 201
```

**2. Rate Limiting (Prevent Brute Force)**

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["200 per day", "50 per hour"]
)

@app.route("/api/login", methods=["POST"])
@limiter.limit("5 per minute")  # Only 5 login attempts per minute
def login():
    # ... login logic ...
    pass
```

**3. Account Lockout**

```python
class User(db.Model):
    # ... other fields ...
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime, nullable=True)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = db.query(User).filter_by(username=data['username']).first()

    if not user:
        return {"error": "Invalid credentials"}, 401

    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        return {"error": "Account locked. Try again later."}, 403

    # Verify password
    if not check_password_hash(user.password_hash, data['password']):
        user.failed_login_attempts += 1

        # Lock account after 5 failed attempts
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=30)

        db.session.commit()
        return {"error": "Invalid credentials"}, 401

    # Successful login - reset counter
    user.failed_login_attempts = 0
    user.locked_until = None
    db.session.commit()

    token = create_token(user)
    return {"token": token}
```

**4. Secure Token Storage**

```javascript
// Don't store tokens in localStorage (vulnerable to XSS)
// localStorage.setItem('token', token);  // BAD

// Instead, use httpOnly cookies (backend sets cookie)
@app.route("/api/login", methods=["POST"])
def login():
    # ... verify credentials ...

    token = create_token(user)

    response = jsonify({"message": "Login successful"})

    # Set token in httpOnly cookie (JavaScript can't access)
    response.set_cookie(
        'access_token',
        token,
        httponly=True,     # Prevent JavaScript access
        secure=True,       # HTTPS only
        samesite='Strict', # CSRF protection
        max_age=3600       # 1 hour
    )

    return response
```

**5. CSRF Protection (for session-based auth)**

```python
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect(app)

# CSRF token automatically checked on POST/PUT/DELETE
# Frontend must include token in requests

@app.route("/api/get-csrf-token", methods=["GET"])
def get_csrf_token():
    return {"csrf_token": generate_csrf()}
```

### Quality Assurance

**Testing Strategy**

```python
import pytest

def test_login_success(client):
    """Test successful login"""
    response = client.post("/api/login", json={
        "username": "testuser",
        "password": "ValidPass123"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data

def test_login_invalid_credentials(client):
    """Test login with wrong password"""
    response = client.post("/api/login", json={
        "username": "testuser",
        "password": "WrongPassword"
    })

    assert response.status_code == 401
    data = response.get_json()
    assert "error" in data

def test_protected_route_without_auth(client):
    """Test accessing protected route without token"""
    response = client.get("/api/profile")
    assert response.status_code == 401

def test_protected_route_with_auth(client):
    """Test accessing protected route with valid token"""
    # Login first
    login_response = client.post("/api/login", json={
        "username": "testuser",
        "password": "ValidPass123"
    })
    token = login_response.get_json()["token"]

    # Access protected route
    response = client.get("/api/profile", headers={
        "Authorization": f"Bearer {token}"
    })

    assert response.status_code == 200

def test_rbac_admin_only(client):
    """Test that only admins can access admin route"""
    # Login as regular user
    login_response = client.post("/api/login", json={
        "username": "regularuser",
        "password": "ValidPass123"
    })
    token = login_response.get_json()["token"]

    # Try to access admin route
    response = client.delete("/api/users/123", headers={
        "Authorization": f"Bearer {token}"
    })

    assert response.status_code == 403  # Forbidden

def test_mfa_required(client):
    """Test MFA enforcement"""
    # Login with password only
    response = client.post("/api/login", json={
        "username": "mfauser",
        "password": "ValidPass123"
    })

    assert response.status_code == 401
    data = response.get_json()
    assert data.get("mfa_required") == True

def test_refresh_token_flow(client):
    """Test refresh token renewal"""
    # Login
    login_response = client.post("/api/login", json={
        "username": "testuser",
        "password": "ValidPass123"
    })
    refresh_token = login_response.get_json()["refresh_token"]

    # Wait for access token to expire (or mock expiration)
    time.sleep(1)

    # Use refresh token to get new access token
    refresh_response = client.post("/api/refresh", json={
        "refresh_token": refresh_token
    })

    assert refresh_response.status_code == 200
    assert "access_token" in refresh_response.get_json()
```

### Logging and Observability

```python
import logging
import json

logger = logging.getLogger(__name__)

# Log authentication events
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")

    user = db.query(User).filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        # Log failed login attempt
        logger.warning("Failed login attempt", extra={
            "event": "login_failed",
            "username": username,
            "ip": request.remote_addr,
            "user_agent": request.headers.get("User-Agent")
        })
        return {"error": "Invalid credentials"}, 401

    # Log successful login
    logger.info("Successful login", extra={
        "event": "login_success",
        "user_id": user.id,
        "username": user.username,
        "ip": request.remote_addr
    })

    token = create_token(user)
    return {"token": token}

# Log authorization failures
@app.route("/api/admin/users", methods=["GET"])
@require_auth
@require_permission("admin:users")
def list_users():
    # Permission check in decorator will log failure
    users = db.query(User).all()
    return {"data": [u.to_dict() for u in users]}

def require_permission(permission):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = db.query(User).filter_by(id=request.user_id).first()

            if not has_permission(user, permission):
                # Log authorization failure
                logger.warning("Authorization denied", extra={
                    "event": "authz_denied",
                    "user_id": user.id,
                    "required_permission": permission,
                    "user_role": user.role,
                    "endpoint": request.path
                })
                return {"error": "Forbidden"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator
```

**What to Log**:
- All login attempts (success and failure)
- Password reset requests
- MFA events (enabled, disabled, code sent)
- Authorization failures
- Account lockouts
- Role changes
- Token refresh events
- Logout events

**What NOT to Log**:
- Passwords (plaintext or hashed)
- Tokens (access or refresh)
- MFA codes
- Security questions/answers

## Common Pitfalls

### 1. Storing Passwords in Plaintext

**Problem**: Database breach exposes all passwords.

**Solution**: Always hash passwords.

```python
# NEVER do this
user.password = request.json['password']  # Plaintext!

# Always do this
user.password_hash = generate_password_hash(request.json['password'])
```

### 2. Using Weak JWT Secrets

**Problem**: Weak secrets can be brute-forced, allowing token forgery.

**Solution**: Use long, random secrets.

```python
# Don't do this
SECRET_KEY = "secret"  # Easy to guess

# Do this
SECRET_KEY = secrets.token_urlsafe(32)  # Cryptographically random
# Store in environment variable: os.getenv('JWT_SECRET_KEY')
```

### 3. Not Validating Token Expiration

**Problem**: Accepting expired tokens allows unauthorized access.

**Solution**: Always check expiration.

```python
# JWT library handles this automatically
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
except jwt.ExpiredSignatureError:
    return {"error": "Token expired"}, 401
```

### 4. Not Revoking Sessions on Password Change

**Problem**: Old sessions remain valid after password change.

**Solution**: Invalidate all sessions when password changes.

```python
@app.route("/api/change-password", methods=["POST"])
@require_auth
def change_password():
    user = db.query(User).filter_by(id=request.user_id).first()

    # Update password
    user.password_hash = generate_password_hash(request.json['new_password'])

    # Invalidate all refresh tokens
    db.query(RefreshToken).filter_by(user_id=user.id).update({'revoked': True})

    db.session.commit()

    return {"message": "Password changed. Please log in again."}
```

### 5. Exposing User Existence

**Problem**: Different error messages reveal whether username exists.

**Solution**: Use generic error messages.

```python
# Don't do this
if not user:
    return {"error": "Username not found"}, 404
if not check_password(user, password):
    return {"error": "Incorrect password"}, 401

# Do this - generic message
if not user or not check_password(user, password):
    return {"error": "Invalid username or password"}, 401
```

### 6. Not Implementing Rate Limiting

**Problem**: Attackers can brute-force passwords.

**Solution**: Limit login attempts.

```python
@app.route("/api/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    # ... login logic ...
    pass
```

## Real-World Use Cases

### Banking Application

**Requirements**:
- Highest security level
- Multi-factor authentication
- Session timeout
- IP allowlisting for certain operations

**Implementation**:
- Password + MFA (TOTP or SMS)
- Short session timeout (15 minutes)
- Re-authentication for sensitive operations (wire transfer)
- Geographic anomaly detection (login from unusual location)
- Transaction limits based on authentication strength

### SaaS Application

**Requirements**:
- Multiple user types (admin, user, guest)
- Team/organization support
- SSO for enterprise customers
- API access for integrations

**Implementation**:
- Email/password login with optional MFA
- OAuth2 for third-party login
- SAML/OIDC SSO for enterprise
- Role-based access (org admin, member, guest)
- API keys for programmatic access

### Healthcare Portal

**Requirements**:
- HIPAA compliance
- Different roles (doctor, nurse, patient, admin)
- Audit trail of all data access
- Automatic timeout

**Implementation**:
- Strong password + MFA mandatory
- RBAC with granular permissions
- Attribute-based rules (only assigned doctor can see patient records)
- Comprehensive audit logging
- 10-minute session timeout
- Re-authentication for sensitive operations

### E-Commerce Site

**Requirements**:
- Fast checkout (don't force login)
- Social login options
- Remember me functionality
- Account recovery

**Implementation**:
- Optional registration (guest checkout allowed)
- OAuth2 for Google/Facebook/Apple login
- Remember me with long-lived secure cookies
- Email-based password reset with expiring tokens
- Simple password requirements (UX over security for non-sensitive data)

## Quick Reference

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| **Session** | Traditional web apps | Simple, revocable | Hard to scale, CSRF risk |
| **JWT** | SPAs, mobile apps | Stateless, scalable | Can't revoke easily, size |
| **OAuth2** | Third-party login | No passwords, access external data | Depends on provider |
| **MFA** | High-security apps | Very secure | Extra UX friction |
| **RBAC** | Most applications | Simple, manageable | Not fine-grained |
| **ABAC** | Complex enterprise | Very flexible | Complex to implement |

| Security Practice | Purpose |
|-------------------|---------|
| **Hash passwords** | Protect passwords if database breached |
| **Use HTTPS** | Encrypt data in transit |
| **Rate limiting** | Prevent brute force attacks |
| **Account lockout** | Block attackers after failed attempts |
| **Token expiration** | Limit window of compromised token |
| **Refresh tokens** | Allow revocation while maintaining UX |
| **httpOnly cookies** | Prevent XSS attacks on tokens |
| **CSRF tokens** | Prevent cross-site request forgery |
| **Audit logging** | Track access for compliance and forensics |

## Next Steps

Now that you understand authentication and authorization, continue to:

- **[Databases](../databases/README.md)**: Learn how to store user credentials, sessions, and permissions securely
- **[REST APIs](../rest-apis/README.md)**: Understand how to protect API endpoints with authentication
- **[Message Queues](../message-queues/README.md)**: Send background tasks like email verification and MFA codes

## Related Topics

- **08-security**: Advanced security patterns, threat modeling, compliance
- **02-architectures/microservices**: Authentication in distributed systems
- **07-cloud/aws**: AWS Cognito, IAM for cloud-native auth
- **04-frontend**: Client-side auth flows, token storage, login UX

---

**Remember**: Security is not optional. Every application needs authentication (who are you?) and authorization (what can you do?). Start with strong foundations—hash passwords, validate inputs, enforce least privilege—and add layers as your application grows.
