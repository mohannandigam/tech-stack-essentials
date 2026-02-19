# Secrets Management

## What is it?

**Secrets management** is the practice of securely storing, accessing, and managing sensitive information like passwords, API keys, database credentials, and encryption keys that your applications need to function. Instead of hardcoding these values in your code or leaving them in plain text files, secrets management systems encrypt them, control access, track usage, and rotate them automatically.

Think of it like a high-security vault at a bank. You don't leave money scattered around your desk or written on sticky notes. You put it in a vault with access controls, audit logs, and time-locks. Secrets management does the same for your application's sensitive data.

## Simple Analogy

Imagine you're running a hotel with hundreds of rooms. You could:

**Bad approach**: Write all room keys on a whiteboard in the lobby where anyone can see them
- Anyone can copy any key
- You can't tell who accessed which room
- Changing locks means updating the whiteboard manually
- If someone takes a photo, you've lost control forever

**Good approach**: Use an electronic key card system
- Each guest gets access only to their rooms
- The system logs every access attempt
- Keys expire automatically after checkout
- You can instantly revoke access without changing locks
- Security staff can audit who went where and when

Secrets management is the electronic key card system for your application's sensitive data.

## Why does it matter?

### Security Impact

**Real-world breach example**: In 2019, Capital One suffered a breach affecting 100 million customers. The attacker exploited credentials that were improperly secured. Proper secrets management could have prevented this $80 million penalty.

**Common causes of credential leaks**:
- Hardcoded passwords in source code committed to GitHub (happens hundreds of times daily)
- .env files accidentally pushed to public repositories
- Credentials shared via Slack, email, or documentation
- Service accounts with permanent, never-rotated passwords
- Database dumps containing credentials
- Container images with embedded secrets

### Business Impact

- **Compliance requirements**: GDPR, HIPAA, PCI-DSS all require secure credential management
- **Audit trail**: Know who accessed what secrets and when
- **Operational efficiency**: Rotate credentials without downtime or code changes
- **Team collaboration**: Safely share secrets across teams without copy-paste
- **Zero-trust security**: Applications prove their identity before accessing secrets

## How it works

### The Secret Lifecycle

```
┌─────────────┐
│   Create    │  Generate or store a new secret
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Encrypt   │  Encrypt at rest with master key
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Store    │  Save in secure backend (database, cloud service)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Access    │  Application authenticates and retrieves
│   Control   │  - Who can access?
│             │  - From where?
│             │  - Under what conditions?
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Audit    │  Log every access attempt
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Rotate    │  Automatically change secrets periodically
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Revoke    │  Delete when no longer needed
└─────────────┘
```

### Authentication Flow

```
Application                    Secrets Manager                 Database
    │                                 │                            │
    │  1. Authenticate               │                            │
    │  (using IAM/service account)   │                            │
    ├───────────────────────────────>│                            │
    │                                 │                            │
    │  2. Verify identity & check    │                            │
    │     access policies             │                            │
    │                                 │                            │
    │  3. Return encrypted secret    │                            │
    │<────────────────────────────────┤                            │
    │                                 │                            │
    │  4. Use secret to connect      │                            │
    ├─────────────────────────────────┴───────────────────────────>│
    │                                                               │
    │  5. Access granted                                           │
    │<──────────────────────────────────────────────────────────────┤
    │                                                               │
```

## Key Concepts

### **Secret vs. Configuration**
- **Secret**: Sensitive data that must be encrypted (passwords, keys, tokens)
- **Configuration**: Non-sensitive settings that can be public (port numbers, feature flags, timeouts)
- **Rule of thumb**: If seeing the value gives someone unauthorized access, it's a secret

### **Encryption at Rest**
Secrets are encrypted when stored using strong encryption (AES-256). The encryption keys are managed separately from the secrets themselves, often using a key management service (KMS).

### **Encryption in Transit**
Secrets are encrypted when transmitted over networks using TLS/HTTPS. This prevents interception during API calls.

### **Access Control**
Fine-grained permissions determine who or what can read, write, or manage secrets. Uses identity-based policies (IAM roles, service accounts).

### **Audit Logging**
Every secret access is logged with details: who accessed it, when, from where, and whether access was granted or denied.

### **Secret Rotation**
The process of changing a secret's value periodically without application downtime. Reduces the window of opportunity if a secret is compromised.

### **Secret Versioning**
Keeping multiple versions of a secret allows for zero-downtime rotation and quick rollback if issues occur.

### **Least Privilege**
Applications should only access the specific secrets they need, nothing more. Reduces blast radius if compromised.

### **Time-to-Live (TTL)**
Secrets can have expiration times, forcing applications to re-authenticate and get fresh credentials.

## The .env File Problem

### What NOT to Do

```bash
# ❌ BAD: .env file in your repository
DATABASE_PASSWORD=SuperSecret123!
API_KEY=sk_live_REDACTED_EXAMPLE
AWS_SECRET_ACCESS_KEY=REDACTED_EXAMPLE_KEY
STRIPE_SECRET_KEY=sk_test_REDACTED_EXAMPLE

# ❌ WORSE: Committed to git history
# Even if you delete this file later, it remains in git history forever
```

### Why .env files are dangerous

1. **Easy to commit accidentally**: One `git add .` and your secrets are public
2. **No access control**: Anyone with file access sees all secrets
3. **No audit trail**: Can't tell who accessed what
4. **No encryption**: Stored in plain text on disk
5. **No rotation**: Changing secrets requires updating files everywhere
6. **Git history**: Once committed, secrets persist in git history forever
7. **Shared secrets**: Same .env file often used across environments

### What Happens When .env Gets Pushed to GitHub

**Within minutes**:
- Automated bots scan for API keys and credentials
- Attackers test found credentials immediately
- Your AWS account could be mining cryptocurrency
- Your database could be wiped or stolen

**Real example**: A developer pushed AWS credentials to GitHub. Within 20 minutes, attackers spun up 200+ EC2 instances for cryptocurrency mining. Cost: $50,000 before detection.

### The Right Way to Use .env Files

```bash
# ✅ GOOD: .env.example (template only, no real secrets)
DATABASE_PASSWORD=your_database_password_here
API_KEY=your_api_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_here

# In .gitignore
.env
.env.local
.env.*.local
```

```python
# ✅ GOOD: Load from environment, fallback to secrets manager
import os
from secrets_manager import get_secret

def get_database_password():
    """
    Get database password with proper fallback.

    Priority:
    1. Environment variable (for local dev only)
    2. Secrets manager (for all deployments)
    3. Fail safely with clear error
    """
    # Local development fallback
    password = os.getenv('DATABASE_PASSWORD')

    if password:
        logger.warning("Using password from environment variable - dev only!")
        return password

    # Production: always use secrets manager
    try:
        return get_secret('prod/database/password')
    except Exception as e:
        logger.error(f"Failed to retrieve secret: {e}")
        raise RuntimeError("Cannot connect to database: secret unavailable")
```

## Git Security

### Preventing Secret Commits

#### 1. git-secrets (by AWS)

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Initialize in your repository
cd your-repo
git secrets --install

# Add patterns to detect
git secrets --register-aws  # AWS keys
git secrets --add 'password\s*=\s*.+'  # Passwords
git secrets --add '[A-Za-z0-9+/]{40}'  # Generic secrets
git secrets --add 'sk_live_[0-9a-zA-Z]{24}'  # Stripe keys

# Scan existing history
git secrets --scan-history
```

#### 2. Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-added-large-files
      - id: detect-private-key
      - id: check-merge-conflict

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  - repo: https://github.com/awslabs/git-secrets
    rev: master
    hooks:
      - id: git-secrets
```

```bash
# Install pre-commit
pip install pre-commit

# Install hooks in your repository
pre-commit install

# Run against all files
pre-commit run --all-files
```

#### 3. .gitignore Best Practices

```bash
# .gitignore for secrets

# Environment files
.env
.env.*
!.env.example
.env.local
.env.*.local

# Credentials
**/credentials.json
**/serviceaccount.json
**/secrets.yaml
**/.secrets/

# Cloud provider configs
.aws/credentials
.azure/credentials
.gcloud/credentials.json

# IDE configurations that might contain secrets
.vscode/settings.json
.idea/

# Build artifacts that might contain secrets
dist/
build/
*.log
```

### If You Already Committed Secrets

```bash
# ⚠️ WARNING: This rewrites git history. Coordinate with your team!

# Option 1: BFG Repo-Cleaner (recommended for large repos)
brew install bfg
bfg --replace-text passwords.txt your-repo.git
cd your-repo
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Option 2: git-filter-repo (most powerful)
pip install git-filter-repo
git filter-repo --invert-paths --path .env
git filter-repo --invert-paths --path config/secrets.yaml

# Option 3: GitHub Secret Scanning (automated)
# GitHub automatically scans and alerts on known secret patterns
# Check Security > Secret scanning alerts

# IMPORTANT: After removing from git
# 1. Rotate ALL exposed secrets immediately
# 2. Review access logs for unauthorized usage
# 3. Notify security team
# 4. Force push (coordinate with team)
git push --force --all origin
```

## Secrets Management Solutions

### 1. HashiCorp Vault

**Best for**: Multi-cloud, Kubernetes, dynamic secrets, enterprise features

#### Setup

```bash
# Install Vault
brew install vault  # macOS
# or
wget https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip
unzip vault_1.15.0_linux_amd64.zip
sudo mv vault /usr/local/bin/

# Start Vault in dev mode (for learning only)
vault server -dev

# In another terminal, configure
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='dev-token'

# Enable secrets engine
vault secrets enable -path=secret kv-v2

# Store a secret
vault kv put secret/database/config \
    username="dbadmin" \
    password="SuperSecret123!" \
    host="db.example.com"

# Read a secret
vault kv get secret/database/config

# Read specific field
vault kv get -field=password secret/database/config
```

#### Production Setup

```hcl
# vault-config.hcl
storage "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/path/to/cert.pem"
  tls_key_file  = "/path/to/key.pem"
}

api_addr = "https://vault.example.com:8200"
cluster_addr = "https://vault.example.com:8201"
ui = true
```

```bash
# Start Vault
vault server -config=vault-config.hcl

# Initialize (do this once)
vault operator init

# Unseal (requires 3 of 5 keys)
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>
```

#### Application Integration

```python
# Python example with hvac
import hvac
import logging

logger = logging.getLogger(__name__)

class VaultClient:
    """
    HashiCorp Vault client for secrets management.

    Best Practices:
    - Use AppRole authentication for applications
    - Cache secrets with TTL to reduce Vault load
    - Handle token renewal automatically
    - Log all access attempts
    """

    def __init__(self, url, role_id, secret_id):
        self.client = hvac.Client(url=url)
        self._authenticate(role_id, secret_id)

    def _authenticate(self, role_id, secret_id):
        """Authenticate using AppRole."""
        try:
            response = self.client.auth.approle.login(
                role_id=role_id,
                secret_id=secret_id
            )
            logger.info("Successfully authenticated to Vault")
        except Exception as e:
            logger.error(f"Vault authentication failed: {e}")
            raise

    def get_secret(self, path):
        """
        Retrieve a secret from Vault.

        Args:
            path: Secret path (e.g., 'secret/data/database/config')

        Returns:
            dict: Secret data
        """
        try:
            response = self.client.secrets.kv.v2.read_secret_version(
                path=path
            )
            logger.info(f"Retrieved secret from path: {path}")
            return response['data']['data']
        except hvac.exceptions.InvalidPath:
            logger.error(f"Secret not found at path: {path}")
            raise
        except Exception as e:
            logger.error(f"Failed to retrieve secret: {e}")
            raise

    def create_secret(self, path, secret_data):
        """Create or update a secret."""
        try:
            self.client.secrets.kv.v2.create_or_update_secret(
                path=path,
                secret=secret_data
            )
            logger.info(f"Created/updated secret at path: {path}")
        except Exception as e:
            logger.error(f"Failed to create secret: {e}")
            raise

# Usage
vault = VaultClient(
    url='https://vault.example.com:8200',
    role_id=os.getenv('VAULT_ROLE_ID'),
    secret_id=os.getenv('VAULT_SECRET_ID')
)

db_config = vault.get_secret('database/config')
db_password = db_config['password']
```

#### Dynamic Secrets

```python
# Database credentials that expire automatically
def get_dynamic_db_credentials():
    """
    Get temporary database credentials from Vault.

    Why dynamic secrets:
    - Credentials automatically expire after TTL
    - Each application instance gets unique credentials
    - Automatic revocation when application shuts down
    - Reduces risk of credential theft
    """
    response = vault.client.secrets.database.generate_credentials(
        name='my-database-role',
        ttl='1h'  # Credentials expire after 1 hour
    )

    return {
        'username': response['data']['username'],
        'password': response['data']['password'],
        'expires_at': response['lease_duration']
    }
```

### 2. AWS Secrets Manager

**Best for**: AWS-native applications, automatic rotation, RDS integration

#### Setup

```bash
# Create a secret
aws secretsmanager create-secret \
    --name prod/database/password \
    --description "Production database password" \
    --secret-string "SuperSecret123!"

# Create secret from file
aws secretsmanager create-secret \
    --name prod/api/credentials \
    --secret-string file://credentials.json

# Enable automatic rotation
aws secretsmanager rotate-secret \
    --secret-id prod/database/password \
    --rotation-lambda-arn arn:aws:lambda:us-east-1:123456789012:function:RotateSecret \
    --rotation-rules AutomaticallyAfterDays=30
```

#### Application Integration

```python
# Python example with boto3
import boto3
import json
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class AWSSecretsManager:
    """
    AWS Secrets Manager client.

    Best Practices:
    - Cache secrets to reduce API calls and costs
    - Use IAM roles instead of access keys
    - Enable automatic rotation
    - Use resource policies for cross-account access
    """

    def __init__(self, region_name='us-east-1'):
        self.client = boto3.client(
            'secretsmanager',
            region_name=region_name
        )
        self._cache = {}

    def get_secret(self, secret_name, force_refresh=False):
        """
        Retrieve a secret with caching.

        Args:
            secret_name: Name or ARN of the secret
            force_refresh: Bypass cache and fetch fresh value

        Returns:
            dict or str: Secret value
        """
        # Check cache first
        if not force_refresh and secret_name in self._cache:
            logger.debug(f"Returning cached secret: {secret_name}")
            return self._cache[secret_name]

        try:
            response = self.client.get_secret_value(SecretId=secret_name)
            logger.info(f"Retrieved secret: {secret_name}")

            # Handle both string and binary secrets
            if 'SecretString' in response:
                secret = response['SecretString']
                # Try to parse as JSON
                try:
                    secret = json.loads(secret)
                except json.JSONDecodeError:
                    pass
            else:
                secret = response['SecretBinary']

            # Cache the secret
            self._cache[secret_name] = secret
            return secret

        except ClientError as e:
            error_code = e.response['Error']['Code']

            if error_code == 'ResourceNotFoundException':
                logger.error(f"Secret not found: {secret_name}")
            elif error_code == 'InvalidRequestException':
                logger.error(f"Invalid request for secret: {secret_name}")
            elif error_code == 'InvalidParameterException':
                logger.error(f"Invalid parameter for secret: {secret_name}")
            elif error_code == 'DecryptionFailure':
                logger.error(f"Failed to decrypt secret: {secret_name}")
            elif error_code == 'InternalServiceError':
                logger.error(f"Internal service error retrieving secret: {secret_name}")
            else:
                logger.error(f"Unknown error retrieving secret: {e}")

            raise

    def create_secret(self, secret_name, secret_value, description=''):
        """Create a new secret."""
        try:
            # Convert dict to JSON string
            if isinstance(secret_value, dict):
                secret_value = json.dumps(secret_value)

            response = self.client.create_secret(
                Name=secret_name,
                Description=description,
                SecretString=secret_value
            )
            logger.info(f"Created secret: {secret_name}")
            return response['ARN']

        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceExistsException':
                logger.warning(f"Secret already exists: {secret_name}")
            raise

    def update_secret(self, secret_name, secret_value):
        """Update an existing secret."""
        try:
            if isinstance(secret_value, dict):
                secret_value = json.dumps(secret_value)

            self.client.update_secret(
                SecretId=secret_name,
                SecretString=secret_value
            )
            logger.info(f"Updated secret: {secret_name}")

            # Invalidate cache
            self._cache.pop(secret_name, None)

        except ClientError as e:
            logger.error(f"Failed to update secret: {e}")
            raise

# Usage
secrets = AWSSecretsManager(region_name='us-east-1')

# Get database credentials
db_creds = secrets.get_secret('prod/database/credentials')
print(f"Username: {db_creds['username']}")
print(f"Password: {db_creds['password']}")

# Get API key
api_key = secrets.get_secret('prod/api/key')
```

#### RDS Integration

```python
# Automatic credential rotation for RDS
def get_rds_connection():
    """
    Get database connection with automatic credential rotation.

    AWS Secrets Manager automatically rotates RDS credentials:
    1. Creates new credentials in database
    2. Updates secret with new credentials
    3. Deletes old credentials after grace period

    No downtime - applications use AWSCURRENT version
    """
    import psycopg2

    secrets = AWSSecretsManager()
    db_creds = secrets.get_secret('rds/postgres/credentials')

    conn = psycopg2.connect(
        host=db_creds['host'],
        port=db_creds['port'],
        dbname=db_creds['dbname'],
        user=db_creds['username'],
        password=db_creds['password']
    )

    return conn
```

### 3. Azure Key Vault

**Best for**: Azure-native applications, certificate management

#### Setup

```bash
# Create Key Vault
az keyvault create \
    --name myKeyVault \
    --resource-group myResourceGroup \
    --location eastus \
    --enabled-for-deployment true \
    --enabled-for-template-deployment true

# Set a secret
az keyvault secret set \
    --vault-name myKeyVault \
    --name DatabasePassword \
    --value "SuperSecret123!"

# Get a secret
az keyvault secret show \
    --vault-name myKeyVault \
    --name DatabasePassword
```

#### Application Integration

```python
# Python example with Azure SDK
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import logging

logger = logging.getLogger(__name__)

class AzureKeyVaultClient:
    """
    Azure Key Vault client.

    Best Practices:
    - Use Managed Identity instead of connection strings
    - Cache secrets to reduce API calls
    - Use access policies for fine-grained control
    - Enable soft-delete and purge protection
    """

    def __init__(self, vault_url):
        """
        Initialize client with Managed Identity.

        Args:
            vault_url: Key Vault URL (e.g., https://myvault.vault.azure.net/)
        """
        credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=vault_url, credential=credential)
        self._cache = {}

    def get_secret(self, secret_name, version=None, force_refresh=False):
        """
        Retrieve a secret with caching.

        Args:
            secret_name: Name of the secret
            version: Specific version (None for latest)
            force_refresh: Bypass cache

        Returns:
            str: Secret value
        """
        cache_key = f"{secret_name}:{version}" if version else secret_name

        if not force_refresh and cache_key in self._cache:
            logger.debug(f"Returning cached secret: {secret_name}")
            return self._cache[cache_key]

        try:
            secret = self.client.get_secret(secret_name, version=version)
            logger.info(f"Retrieved secret: {secret_name}")

            self._cache[cache_key] = secret.value
            return secret.value

        except Exception as e:
            logger.error(f"Failed to retrieve secret {secret_name}: {e}")
            raise

    def set_secret(self, secret_name, secret_value, tags=None):
        """Create or update a secret."""
        try:
            secret = self.client.set_secret(
                secret_name,
                secret_value,
                tags=tags
            )
            logger.info(f"Set secret: {secret_name}")

            # Invalidate cache
            self._cache.pop(secret_name, None)

            return secret

        except Exception as e:
            logger.error(f"Failed to set secret {secret_name}: {e}")
            raise

    def list_secrets(self):
        """List all secrets (names only)."""
        try:
            secrets = self.client.list_properties_of_secrets()
            return [s.name for s in secrets]
        except Exception as e:
            logger.error(f"Failed to list secrets: {e}")
            raise

# Usage
vault_url = "https://myvault.vault.azure.net/"
kv_client = AzureKeyVaultClient(vault_url)

# Get secret
db_password = kv_client.get_secret("DatabasePassword")

# Set secret
kv_client.set_secret(
    "ApiKey",
    "sk_live_abc123",
    tags={"environment": "production", "service": "api"}
)
```

### 4. Google Secret Manager

**Best for**: GCP-native applications, simple secret storage

#### Setup

```bash
# Enable API
gcloud services enable secretmanager.googleapis.com

# Create a secret
echo -n "SuperSecret123!" | gcloud secrets create database-password \
    --data-file=-

# Create secret from file
gcloud secrets create api-credentials \
    --data-file=credentials.json

# Grant access
gcloud secrets add-iam-policy-binding database-password \
    --member="serviceAccount:my-app@my-project.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

#### Application Integration

```python
# Python example with Google Cloud SDK
from google.cloud import secretmanager
import logging

logger = logging.getLogger(__name__)

class GCPSecretManager:
    """
    Google Secret Manager client.

    Best Practices:
    - Use service accounts with minimal permissions
    - Cache secrets to reduce API calls and costs
    - Enable automatic replication or regional replication
    - Use secret versions for rotation
    """

    def __init__(self, project_id):
        self.client = secretmanager.SecretManagerServiceClient()
        self.project_id = project_id
        self._cache = {}

    def get_secret(self, secret_id, version='latest', force_refresh=False):
        """
        Retrieve a secret with caching.

        Args:
            secret_id: Secret ID (name)
            version: Version number or 'latest'
            force_refresh: Bypass cache

        Returns:
            str: Secret value
        """
        cache_key = f"{secret_id}:{version}"

        if not force_refresh and cache_key in self._cache:
            logger.debug(f"Returning cached secret: {secret_id}")
            return self._cache[cache_key]

        try:
            name = f"projects/{self.project_id}/secrets/{secret_id}/versions/{version}"
            response = self.client.access_secret_version(request={"name": name})

            secret_value = response.payload.data.decode('UTF-8')
            logger.info(f"Retrieved secret: {secret_id}")

            self._cache[cache_key] = secret_value
            return secret_value

        except Exception as e:
            logger.error(f"Failed to retrieve secret {secret_id}: {e}")
            raise

    def create_secret(self, secret_id, secret_value, labels=None):
        """Create a new secret."""
        try:
            parent = f"projects/{self.project_id}"

            # Create the secret
            secret = self.client.create_secret(
                request={
                    "parent": parent,
                    "secret_id": secret_id,
                    "secret": {
                        "replication": {"automatic": {}},
                        "labels": labels or {}
                    }
                }
            )
            logger.info(f"Created secret: {secret_id}")

            # Add secret version
            self.add_secret_version(secret_id, secret_value)

            return secret

        except Exception as e:
            logger.error(f"Failed to create secret {secret_id}: {e}")
            raise

    def add_secret_version(self, secret_id, secret_value):
        """Add a new version to an existing secret."""
        try:
            parent = f"projects/{self.project_id}/secrets/{secret_id}"

            payload = secret_value.encode('UTF-8')
            response = self.client.add_secret_version(
                request={
                    "parent": parent,
                    "payload": {"data": payload}
                }
            )
            logger.info(f"Added version to secret: {secret_id}")

            # Invalidate cache
            self._cache = {k: v for k, v in self._cache.items()
                          if not k.startswith(f"{secret_id}:")}

            return response

        except Exception as e:
            logger.error(f"Failed to add version to secret {secret_id}: {e}")
            raise

# Usage
sm = GCPSecretManager(project_id='my-project-id')

# Get secret
db_password = sm.get_secret('database-password')

# Create secret
sm.create_secret(
    'api-key',
    'sk_live_abc123',
    labels={'environment': 'production', 'service': 'api'}
)
```

## Secret Rotation Strategies

### Why Rotate Secrets?

**Security benefits**:
- Limits damage if a secret is compromised
- Reduces window of opportunity for attackers
- Meets compliance requirements (PCI-DSS, HIPAA)
- Detects broken dependencies early

**Operational benefits**:
- Validates your disaster recovery process
- Ensures no hardcoded credentials exist
- Tests secret management system regularly

### Rotation Frequency

| Secret Type | Recommended Rotation | Risk Level |
|-------------|---------------------|------------|
| Root database passwords | 30-90 days | Critical |
| Application database passwords | 30-90 days | High |
| API keys (external services) | 90-180 days | High |
| Service account credentials | 30-90 days | High |
| OAuth client secrets | 180-365 days | Medium |
| Encryption keys | 365+ days | Critical |
| TLS certificates | Before expiration | Critical |

### Rotation Patterns

#### 1. Blue-Green Rotation

```python
def rotate_secret_blue_green(secret_name, generate_new_value):
    """
    Blue-green rotation: create new secret before deleting old.

    Process:
    1. Create new secret with different name (green)
    2. Update applications to use new secret
    3. Monitor for errors
    4. Delete old secret (blue)

    Pros: Zero downtime, easy rollback
    Cons: Requires application changes
    """
    # Step 1: Create new secret
    new_secret_name = f"{secret_name}-new"
    new_value = generate_new_value()

    secrets_manager.create_secret(new_secret_name, new_value)
    logger.info(f"Created new secret: {new_secret_name}")

    # Step 2: Update application configuration
    # (requires deployment or dynamic config update)

    # Step 3: Monitor (wait for confirmation)
    input("Press Enter after verifying new secret works...")

    # Step 4: Delete old secret
    secrets_manager.delete_secret(secret_name)
    logger.info(f"Deleted old secret: {secret_name}")

    # Step 5: Rename new secret to original name
    secrets_manager.create_secret(secret_name, new_value)
    secrets_manager.delete_secret(new_secret_name)
```

#### 2. Versioned Rotation

```python
def rotate_secret_versioned(secret_name, generate_new_value):
    """
    Versioned rotation: update secret in place with versions.

    Process:
    1. Add new version to existing secret
    2. Applications automatically use new version
    3. Old versions remain accessible for grace period
    4. Delete old versions after confirmation

    Pros: Automatic for applications, no config changes
    Cons: Requires versioning support in secrets manager
    """
    # Step 1: Generate new value
    new_value = generate_new_value()

    # Step 2: Add new version (old version becomes AWSPREVIOUS)
    secrets_manager.update_secret(secret_name, new_value)
    logger.info(f"Added new version to secret: {secret_name}")

    # Step 3: Applications automatically use AWSCURRENT
    # No deployment needed

    # Step 4: Monitor for issues
    time.sleep(300)  # Wait 5 minutes

    # Step 5: Delete old versions (optional)
    # Or let them expire based on retention policy
```

#### 3. Database Credential Rotation

```python
def rotate_database_credentials(db_config):
    """
    Rotate database credentials with zero downtime.

    Process:
    1. Create new user in database
    2. Grant same permissions as old user
    3. Update secret with new credentials
    4. Wait for applications to pick up new credentials
    5. Revoke old user permissions
    6. Delete old user

    Supports: PostgreSQL, MySQL, SQL Server, Oracle
    """
    import psycopg2

    # Step 1: Connect with master credentials
    admin_conn = psycopg2.connect(
        host=db_config['host'],
        user=db_config['admin_user'],
        password=db_config['admin_password'],
        database=db_config['database']
    )
    cursor = admin_conn.cursor()

    # Step 2: Create new user
    old_user = db_config['current_user']
    new_user = f"{old_user}_{int(time.time())}"
    new_password = generate_secure_password()

    cursor.execute(f"CREATE USER {new_user} WITH PASSWORD %s", (new_password,))
    logger.info(f"Created new database user: {new_user}")

    # Step 3: Copy permissions from old user to new user
    cursor.execute(f"GRANT {old_user} TO {new_user}")
    cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {db_config['database']} TO {new_user}")
    admin_conn.commit()
    logger.info(f"Granted permissions to new user: {new_user}")

    # Step 4: Update secret
    new_credentials = {
        'username': new_user,
        'password': new_password,
        'host': db_config['host'],
        'port': db_config['port'],
        'database': db_config['database']
    }
    secrets_manager.update_secret('prod/database/credentials', new_credentials)
    logger.info("Updated secret with new credentials")

    # Step 5: Wait for applications to refresh credentials
    time.sleep(600)  # Wait 10 minutes

    # Step 6: Verify new user is being used
    cursor.execute("""
        SELECT count(*) FROM pg_stat_activity
        WHERE usename = %s
    """, (new_user,))
    active_connections = cursor.fetchone()[0]

    if active_connections == 0:
        logger.warning("No active connections with new user - rotation may have failed")
        return

    # Step 7: Revoke old user permissions
    cursor.execute(f"REVOKE ALL PRIVILEGES ON DATABASE {db_config['database']} FROM {old_user}")
    admin_conn.commit()
    logger.info(f"Revoked permissions from old user: {old_user}")

    # Step 8: Wait for old connections to close
    time.sleep(300)  # Wait 5 minutes

    # Step 9: Delete old user
    cursor.execute(f"DROP USER IF EXISTS {old_user}")
    admin_conn.commit()
    logger.info(f"Deleted old user: {old_user}")

    cursor.close()
    admin_conn.close()

def generate_secure_password(length=32):
    """Generate a cryptographically secure password."""
    import secrets
    import string

    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))
```

### Automatic Rotation with AWS Lambda

```python
# Lambda function for automatic secret rotation
import json
import boto3
import psycopg2

secrets_client = boto3.client('secretsmanager')

def lambda_handler(event, context):
    """
    AWS Secrets Manager automatic rotation Lambda.

    Steps:
    1. createSecret: Create new credentials
    2. setSecret: Update database with new credentials
    3. testSecret: Verify new credentials work
    4. finishSecret: Mark rotation complete
    """
    arn = event['SecretId']
    token = event['ClientRequestToken']
    step = event['Step']

    if step == "createSecret":
        create_secret(arn, token)
    elif step == "setSecret":
        set_secret(arn, token)
    elif step == "testSecret":
        test_secret(arn, token)
    elif step == "finishSecret":
        finish_secret(arn, token)
    else:
        raise ValueError(f"Invalid step: {step}")

def create_secret(arn, token):
    """Generate new password and store in AWSPENDING."""
    # Get current secret
    current = secrets_client.get_secret_value(SecretId=arn, VersionStage="AWSCURRENT")
    current_dict = json.loads(current['SecretString'])

    # Generate new password
    new_password = generate_secure_password()
    current_dict['password'] = new_password

    # Store as pending
    secrets_client.put_secret_value(
        SecretId=arn,
        ClientRequestToken=token,
        SecretString=json.dumps(current_dict),
        VersionStages=['AWSPENDING']
    )

def set_secret(arn, token):
    """Update database with new password."""
    pending = secrets_client.get_secret_value(
        SecretId=arn,
        VersionId=token,
        VersionStage="AWSPENDING"
    )
    pending_dict = json.loads(pending['SecretString'])

    # Connect to database with current credentials
    current = secrets_client.get_secret_value(SecretId=arn, VersionStage="AWSCURRENT")
    current_dict = json.loads(current['SecretString'])

    conn = psycopg2.connect(
        host=current_dict['host'],
        user=current_dict['username'],
        password=current_dict['password'],
        database=current_dict['dbname']
    )

    # Update password in database
    cursor = conn.cursor()
    cursor.execute(
        f"ALTER USER {pending_dict['username']} WITH PASSWORD %s",
        (pending_dict['password'],)
    )
    conn.commit()
    cursor.close()
    conn.close()

def test_secret(arn, token):
    """Test that new credentials work."""
    pending = secrets_client.get_secret_value(
        SecretId=arn,
        VersionId=token,
        VersionStage="AWSPENDING"
    )
    pending_dict = json.loads(pending['SecretString'])

    # Try to connect with new credentials
    try:
        conn = psycopg2.connect(
            host=pending_dict['host'],
            user=pending_dict['username'],
            password=pending_dict['password'],
            database=pending_dict['dbname']
        )
        conn.close()
    except Exception as e:
        raise ValueError(f"Failed to connect with new credentials: {e}")

def finish_secret(arn, token):
    """Mark rotation as complete."""
    # Move AWSCURRENT to AWSPREVIOUS
    # Move AWSPENDING to AWSCURRENT
    metadata = secrets_client.describe_secret(SecretId=arn)
    current_version = None
    for version, stages in metadata['VersionIdsToStages'].items():
        if "AWSCURRENT" in stages:
            current_version = version
            break

    secrets_client.update_secret_version_stage(
        SecretId=arn,
        VersionStage="AWSCURRENT",
        MoveToVersionId=token,
        RemoveFromVersionId=current_version
    )
```

## Environment-Specific Secrets

### Separation by Environment

```
# Naming convention: environment/service/secret-name

# Development
dev/api/database-password
dev/api/stripe-key
dev/api/jwt-secret

# Staging
staging/api/database-password
staging/api/stripe-key
staging/api/jwt-secret

# Production
prod/api/database-password
prod/api/stripe-key
prod/api/jwt-secret
```

### Environment-Aware Secret Retrieval

```python
import os

class EnvironmentSecretsManager:
    """
    Environment-aware secrets manager.

    Automatically prefixes secret paths with environment name.
    Prevents accidentally using production secrets in development.
    """

    def __init__(self, secrets_manager, environment=None):
        self.secrets_manager = secrets_manager
        self.environment = environment or os.getenv('ENVIRONMENT', 'dev')

        # Validate environment
        valid_environments = ['dev', 'staging', 'prod']
        if self.environment not in valid_environments:
            raise ValueError(f"Invalid environment: {self.environment}")

        logger.info(f"Initialized secrets manager for environment: {self.environment}")

    def get_secret(self, secret_name):
        """Get secret with environment prefix."""
        full_path = f"{self.environment}/{secret_name}"

        try:
            return self.secrets_manager.get_secret(full_path)
        except Exception as e:
            logger.error(f"Failed to get secret {full_path}: {e}")

            # For dev environment, allow fallback to local config
            if self.environment == 'dev':
                logger.warning(f"Falling back to environment variable for {secret_name}")
                return os.getenv(secret_name.upper().replace('/', '_'))

            raise

# Usage
env_secrets = EnvironmentSecretsManager(
    secrets_manager=aws_secrets,
    environment=os.getenv('ENVIRONMENT')
)

# Automatically gets dev/api/database-password or prod/api/database-password
db_password = env_secrets.get_secret('api/database-password')
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # ✅ Good: Use GitHub Secrets
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      # ✅ Good: Fetch secrets from AWS Secrets Manager
      - name: Get secrets from AWS
        id: secrets
        run: |
          DB_PASSWORD=$(aws secretsmanager get-secret-value \
            --secret-id prod/database/password \
            --query SecretString \
            --output text)
          echo "::add-mask::$DB_PASSWORD"
          echo "DB_PASSWORD=$DB_PASSWORD" >> $GITHUB_ENV

      # ✅ Good: Use secrets in deployment
      - name: Deploy application
        run: |
          ./deploy.sh
        env:
          DATABASE_PASSWORD: ${{ env.DB_PASSWORD }}

      # ❌ Bad: Don't do this
      - name: Bad example (DON'T DO THIS)
        run: |
          # Never echo secrets
          echo "Password: ${{ secrets.DB_PASSWORD }}"

          # Never write secrets to files in CI
          echo "${{ secrets.DB_PASSWORD }}" > password.txt

          # Never pass secrets in URLs
          curl "https://api.example.com?key=${{ secrets.API_KEY }}"
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_production:
  stage: deploy
  image: amazon/aws-cli

  # ✅ Good: Use GitLab CI/CD variables (masked & protected)
  variables:
    AWS_DEFAULT_REGION: us-east-1

  before_script:
    # Fetch secrets from AWS Secrets Manager
    - |
      export DB_PASSWORD=$(aws secretsmanager get-secret-value \
        --secret-id prod/database/password \
        --query SecretString \
        --output text)

  script:
    - ./deploy.sh

  only:
    - main

  # Protect secrets
  environment:
    name: production
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
    }

    stages {
        stage('Deploy') {
            steps {
                script {
                    // ✅ Good: Use Jenkins credentials
                    withCredentials([
                        string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        // Fetch secrets from AWS Secrets Manager
                        def dbPassword = sh(
                            script: """
                                aws secretsmanager get-secret-value \
                                    --secret-id prod/database/password \
                                    --query SecretString \
                                    --output text
                            """,
                            returnStdout: true
                        ).trim()

                        // Use secret in deployment (masked in logs)
                        sh """
                            export DATABASE_PASSWORD='${dbPassword}'
                            ./deploy.sh
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up any secret files
            sh 'find . -name "*secret*" -o -name "*password*" | xargs rm -f'
        }
    }
}
```

## Best Practices

### 1. Never Hardcode Secrets

```python
# ❌ BAD: Hardcoded in code
DATABASE_PASSWORD = "SuperSecret123!"
API_KEY = "sk_live_51KZqF8G9X3hRnT4P"

# ✅ GOOD: Retrieved from secrets manager
DATABASE_PASSWORD = secrets_manager.get_secret('prod/database/password')
API_KEY = secrets_manager.get_secret('prod/api/key')
```

### 2. Use Environment Variables for Secret Paths Only

```python
# ✅ GOOD: Environment variable contains path to secret, not secret itself
SECRET_PATH = os.getenv('DATABASE_SECRET_PATH', 'prod/database/password')
DATABASE_PASSWORD = secrets_manager.get_secret(SECRET_PATH)

# ❌ BAD: Secret value in environment variable
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')  # Vulnerable
```

### 3. Implement Secret Caching

```python
class CachedSecretsManager:
    """
    Cache secrets to reduce API calls and improve performance.

    Best Practices:
    - Set reasonable TTL (5-15 minutes)
    - Implement cache invalidation
    - Handle cache misses gracefully
    - Monitor cache hit rates
    """

    def __init__(self, secrets_manager, ttl=300):
        self.secrets_manager = secrets_manager
        self.ttl = ttl  # seconds
        self._cache = {}
        self._timestamps = {}

    def get_secret(self, secret_name):
        """Get secret with TTL-based caching."""
        import time

        current_time = time.time()

        # Check if cached and not expired
        if secret_name in self._cache:
            cached_time = self._timestamps.get(secret_name, 0)
            if current_time - cached_time < self.ttl:
                logger.debug(f"Cache hit for secret: {secret_name}")
                return self._cache[secret_name]

        # Cache miss or expired - fetch fresh
        logger.debug(f"Cache miss for secret: {secret_name}")
        secret = self.secrets_manager.get_secret(secret_name)

        self._cache[secret_name] = secret
        self._timestamps[secret_name] = current_time

        return secret

    def invalidate(self, secret_name=None):
        """Invalidate cache for specific secret or all secrets."""
        if secret_name:
            self._cache.pop(secret_name, None)
            self._timestamps.pop(secret_name, None)
        else:
            self._cache.clear()
            self._timestamps.clear()
```

### 4. Use IAM Roles, Not Access Keys

```python
# ✅ GOOD: Use IAM roles (for EC2, Lambda, ECS)
# No credentials needed - automatic from instance metadata
secrets_client = boto3.client('secretsmanager')

# ❌ BAD: Hardcoded access keys
secrets_client = boto3.client(
    'secretsmanager',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
)
```

### 5. Implement Audit Logging

```python
class AuditedSecretsManager:
    """
    Wrap secrets manager with audit logging.

    Logs:
    - Who accessed which secret
    - When they accessed it
    - From which service/IP
    - Whether access was granted or denied
    """

    def __init__(self, secrets_manager):
        self.secrets_manager = secrets_manager

    def get_secret(self, secret_name):
        """Get secret with audit logging."""
        start_time = time.time()

        try:
            secret = self.secrets_manager.get_secret(secret_name)

            logger.info(
                "Secret access granted",
                extra={
                    'secret_name': secret_name,
                    'user': get_current_user(),
                    'service': get_service_name(),
                    'ip_address': get_client_ip(),
                    'timestamp': datetime.utcnow().isoformat(),
                    'duration_ms': (time.time() - start_time) * 1000,
                    'status': 'success'
                }
            )

            return secret

        except Exception as e:
            logger.error(
                "Secret access denied",
                extra={
                    'secret_name': secret_name,
                    'user': get_current_user(),
                    'service': get_service_name(),
                    'ip_address': get_client_ip(),
                    'timestamp': datetime.utcnow().isoformat(),
                    'duration_ms': (time.time() - start_time) * 1000,
                    'status': 'failure',
                    'error': str(e)
                }
            )
            raise
```

### 6. Implement Least Privilege Access

```python
# AWS IAM Policy example
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": [
                "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/api/*"
            ],
            "Condition": {
                "StringEquals": {
                    "secretsmanager:VersionStage": "AWSCURRENT"
                }
            }
        }
    ]
}
```

### 7. Use Secret Rotation

```python
# Enable automatic rotation
def enable_automatic_rotation(secret_name, rotation_days=30):
    """
    Enable automatic rotation for a secret.

    Args:
        secret_name: Name of the secret
        rotation_days: Days between rotations
    """
    response = secrets_client.rotate_secret(
        SecretId=secret_name,
        RotationLambdaARN='arn:aws:lambda:us-east-1:123456789012:function:RotateSecret',
        RotationRules={
            'AutomaticallyAfterDays': rotation_days
        }
    )

    logger.info(f"Enabled automatic rotation for {secret_name} every {rotation_days} days")
    return response
```

### 8. Handle Secret Updates Gracefully

```python
def get_secret_with_fallback(secret_name):
    """
    Get secret with automatic fallback to previous version.

    Handles rotation scenarios where new credentials don't work yet.
    """
    try:
        # Try current version first
        return secrets_manager.get_secret(secret_name, version='AWSCURRENT')
    except Exception as e:
        logger.warning(f"Failed to get current version: {e}")

        try:
            # Fallback to previous version
            logger.info("Falling back to previous secret version")
            return secrets_manager.get_secret(secret_name, version='AWSPREVIOUS')
        except Exception as e2:
            logger.error(f"Failed to get previous version: {e2}")
            raise
```

## Common Mistakes

### 1. Committing Secrets to Git

**Problem**: Secrets in git history forever, even after deletion

**Solution**:
- Use git-secrets and pre-commit hooks
- Scan regularly with tools like truffleHog
- Use .gitignore for all credential files
- If committed, rotate immediately and clean history

### 2. Logging Secrets

```python
# ❌ BAD: Logging secret values
logger.info(f"Database password: {db_password}")
logger.debug(f"API response: {response}")  # Might contain secrets

# ✅ GOOD: Mask secrets in logs
logger.info("Database password: ********")
logger.debug(f"API response: {mask_sensitive_data(response)}")

def mask_sensitive_data(data):
    """Mask sensitive fields in data structures."""
    sensitive_fields = ['password', 'secret', 'key', 'token', 'credential']

    if isinstance(data, dict):
        return {
            k: '********' if any(field in k.lower() for field in sensitive_fields) else v
            for k, v in data.items()
        }
    return data
```

### 3. Sharing Secrets via Chat/Email

**Problem**: No access control, no audit trail, stored insecurely

**Solution**:
- Use secrets manager with access controls
- Share secret names/paths, not values
- Use time-limited access tokens
- Revoke access when no longer needed

### 4. Using Same Secrets Across Environments

**Problem**: Production breach also compromises dev/staging

**Solution**:
- Separate secrets per environment
- Use different credentials for each environment
- Implement environment-specific access controls

### 5. No Secret Rotation

**Problem**: Compromised secrets remain valid forever

**Solution**:
- Implement automatic rotation
- Test rotation process regularly
- Monitor for rotation failures

### 6. Storing Secrets in Container Images

```dockerfile
# ❌ BAD: Secrets baked into image
ENV DATABASE_PASSWORD="SuperSecret123!"
RUN echo "password=SuperSecret123!" > /app/config.ini

# ✅ GOOD: Secrets injected at runtime
# Docker run with environment variables
docker run -e DATABASE_PASSWORD=$(aws secretsmanager get-secret-value ...) myapp

# Kubernetes with secret mounts
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: myapp
    env:
    - name: DATABASE_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

### 7. Inadequate Access Controls

```python
# ❌ BAD: Everyone can access all secrets
# No restrictions on secret access

# ✅ GOOD: Fine-grained access controls
# Service A can only access secrets in /serviceA/*
# Service B can only access secrets in /serviceB/*
# Production secrets require MFA for human access
```

## Use Cases

### E-commerce Platform

```
secrets/
├── prod/
│   ├── database/
│   │   ├── main-db-password        # Primary database credentials
│   │   ├── read-replica-password   # Read replica credentials
│   │   └── redis-password          # Cache credentials
│   ├── payment/
│   │   ├── stripe-secret-key       # Payment processing
│   │   ├── stripe-webhook-secret   # Webhook verification
│   │   └── paypal-client-secret    # Alternative payment
│   ├── external-apis/
│   │   ├── sendgrid-api-key        # Email service
│   │   ├── twilio-auth-token       # SMS service
│   │   └── shipstation-api-key     # Shipping service
│   └── encryption/
│       ├── jwt-secret              # Token signing
│       └── aes-encryption-key      # Data encryption
```

### Healthcare Application

```
secrets/
├── prod/
│   ├── database/
│   │   └── phi-database-password   # Protected Health Information
│   ├── hl7-integration/
│   │   ├── hl7-server-password     # Healthcare data exchange
│   │   └── fhir-api-key            # FHIR API access
│   ├── encryption/
│   │   ├── phi-encryption-key      # PHI encryption at rest
│   │   └── transmission-key        # PHI encryption in transit
│   └── audit/
│       └── audit-log-key           # Audit log signing
```

### Financial Services

```
secrets/
├── prod/
│   ├── database/
│   │   ├── transaction-db-password
│   │   └── customer-db-password
│   ├── trading/
│   │   ├── trading-api-key
│   │   └── market-data-token
│   ├── compliance/
│   │   ├── aml-service-key         # Anti-money laundering
│   │   └── kyc-api-key             # Know your customer
│   └── encryption/
│       ├── pci-encryption-key      # PCI-DSS compliant
│       └── hsm-credentials         # Hardware security module
```

## Quick Reference

| Aspect | Recommendation |
|--------|----------------|
| **Storage** | Use dedicated secrets manager (Vault, AWS, Azure, GCP) |
| **Access** | IAM roles/service accounts, never access keys |
| **Encryption** | AES-256 at rest, TLS 1.3 in transit |
| **Rotation** | Automatic, 30-90 days for critical secrets |
| **Audit** | Log every access attempt with context |
| **Environments** | Separate secrets per environment |
| **Git** | Never commit secrets, use git-secrets and pre-commit hooks |
| **CI/CD** | Inject secrets at runtime, never in build artifacts |
| **Caching** | 5-15 minute TTL, invalidate on rotation |
| **Fallback** | Support previous version during rotation |

## Secrets Management Checklist

### Setup
- [ ] Choose appropriate secrets manager for your cloud/platform
- [ ] Configure encryption at rest with KMS
- [ ] Enable audit logging
- [ ] Set up access policies (least privilege)
- [ ] Configure network access controls
- [ ] Enable MFA for human access
- [ ] Set up monitoring and alerting

### Development
- [ ] Add all credential files to .gitignore
- [ ] Install git-secrets or pre-commit hooks
- [ ] Create .env.example with placeholders
- [ ] Document secret naming conventions
- [ ] Implement secrets manager client
- [ ] Add caching layer
- [ ] Test secret retrieval in all environments

### Operations
- [ ] Enable automatic secret rotation
- [ ] Test rotation process
- [ ] Monitor rotation failures
- [ ] Set up secret expiration alerts
- [ ] Document rotation procedures
- [ ] Create runbook for secret leaks
- [ ] Regular secret access audits

### Security
- [ ] Scan git history for secrets (truffleHog)
- [ ] Review IAM policies quarterly
- [ ] Test secret access from unauthorized locations
- [ ] Verify secrets are never logged
- [ ] Check secrets are not in backups/snapshots
- [ ] Validate secrets are not in container images
- [ ] Confirm MFA is required for production secrets

### Compliance
- [ ] Document secret lifecycle
- [ ] Maintain audit logs for required retention period
- [ ] Implement required rotation frequencies
- [ ] Create compliance reports
- [ ] Review access controls quarterly
- [ ] Conduct secret management training
- [ ] Document incident response procedures

## Related Topics

- **[Identity and Access Management](../iam/README.md)**: Managing who can access secrets
- **[Encryption](../encryption/README.md)**: How secrets are encrypted at rest and in transit
- **[Compliance](../compliance/README.md)**: Regulatory requirements for secrets management
- **[Zero Trust Architecture](../../02-architectures/zero-trust/README.md)**: Never trust, always verify approach
- **[Kubernetes Security](../../06-infrastructure/kubernetes-security/README.md)**: Managing secrets in Kubernetes
- **[CI/CD Security](../../06-infrastructure/cicd-security/README.md)**: Secrets in pipelines
- **[Threat Modeling](../threat-modeling/README.md)**: Identifying secret-related threats
- **[Incident Response](../incident-response/README.md)**: Handling secret leaks

---

**Remember**: Secrets management is not just about technology - it's about creating a culture where security is everyone's responsibility. The best secrets manager in the world can't protect secrets that developers share via Slack or commit to GitHub.

Last Updated: 2026-02-19
