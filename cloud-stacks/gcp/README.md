# GCP (Google Cloud Platform) Stack

## 📋 What is Google Cloud Platform?

**Google Cloud Platform (GCP)** is Google's suite of cloud computing services running on the same infrastructure that Google uses internally for its products like Search, Gmail, and YouTube. GCP offers computing, storage, networking, big data, machine learning, and more.

## 🎯 Key Concepts

### Simple Analogy
Think of GCP as using Google's own infrastructure:
- Same power that runs YouTube and Gmail
- Google's expertise in distributed systems
- Strong focus on data analytics and AI/ML
- Pay only for what you consume
- Global network of data centers

### Core Strengths
- **Data & Analytics** - Industry-leading big data tools
- **Machine Learning** - Advanced AI capabilities
- **Kubernetes** - Created Kubernetes (GKE is best-in-class)
- **Network Performance** - Google's global private network
- **Pricing** - Often more cost-effective, per-second billing

## 🏗️ Core GCP Services

### 1. Compute Services

#### **Compute Engine**
Virtual machines (VMs) in the cloud
- **Similar to**: AWS EC2, Azure VMs
- **Use Case**: Web servers, batch processing, custom applications
- **Features**: Custom machine types, preemptible VMs (up to 80% cheaper)
```
Example: Run a web application
- Choose machine type (n1-standard-1)
- Select OS (Ubuntu, CentOS, Windows)
- Deploy application
```

#### **Cloud Functions**
Serverless compute (FaaS)
- **Similar to**: AWS Lambda, Azure Functions
- **Use Case**: Event-driven processing, APIs, webhooks
- **Triggers**: HTTP, Pub/Sub, Cloud Storage, Firestore
```
Example: Process uploaded images
- User uploads to Cloud Storage
- Function triggers automatically
- Generates thumbnail
```

#### **Cloud Run**
Serverless containers
- **Similar to**: AWS Fargate with API Gateway
- **Use Case**: Containerized microservices without K8s complexity
- **Features**: Auto-scaling to zero, pay per request

#### **Google Kubernetes Engine (GKE)**
Managed Kubernetes service
- **Similar to**: AWS EKS, Azure AKS
- **Use Case**: Container orchestration at scale
- **Features**: Auto-scaling, auto-repair, auto-upgrade
- **Note**: Google created Kubernetes!

#### **App Engine**
Platform as a Service (PaaS)
- **Similar to**: AWS Elastic Beanstalk, Azure App Service
- **Use Case**: Build apps without managing infrastructure
- **Environments**: Standard (autoscaling) or Flexible (Docker)

### 2. Storage Services

#### **Cloud Storage**
Object storage for any data
- **Similar to**: AWS S3, Azure Blob Storage
- **Use Case**: Backups, media files, data lakes
- **Storage Classes**:
  - Standard - Hot data
  - Nearline - Monthly access
  - Coldline - Quarterly access
  - Archive - Yearly access

#### **Persistent Disk**
Block storage for VMs
- **Similar to**: AWS EBS, Azure Managed Disks
- **Types**: SSD or HDD
- **Features**: Snapshots, encryption, resizing

#### **Filestore**
Managed file storage (NFS)
- **Similar to**: AWS EFS, Azure Files
- **Use Case**: Shared storage across VMs
- **Features**: High performance, automatic backups

### 3. Database Services

#### **Cloud SQL**
Managed relational databases
- **Similar to**: AWS RDS, Azure Database
- **Engines**: MySQL, PostgreSQL, SQL Server
- **Features**: Automated backups, replication, patching

#### **Cloud Spanner**
Globally distributed relational database
- **Unique**: Only GCP offers this
- **Features**: ACID transactions, horizontal scaling
- **Use Case**: Global applications needing strong consistency
- **Note**: Powers Google Ads, Play Store

#### **Firestore**
NoSQL document database (serverless)
- **Similar to**: AWS DynamoDB, Azure Cosmos DB
- **Features**: Real-time sync, offline support
- **Use Case**: Mobile/web apps, real-time apps

#### **Cloud Bigtable**
NoSQL wide-column database
- **Similar to**: AWS DynamoDB, Apache HBase
- **Use Case**: IoT, time-series, analytics
- **Note**: Powers Google Search, Gmail, Maps

#### **Memorystore**
In-memory caching (Redis/Memcached)
- **Similar to**: AWS ElastiCache
- **Use Case**: Session storage, caching

### 4. Networking & Content Delivery

#### **Virtual Private Cloud (VPC)**
Isolated network environment
- **Similar to**: AWS VPC, Azure VNet
- **Features**: Subnets, firewall rules, VPN
- **Global by default** (unlike AWS)

#### **Cloud CDN**
Content Delivery Network
- **Similar to**: AWS CloudFront, Azure CDN
- **Use Case**: Fast global content delivery
- **Features**: Integrated with Cloud Storage/Load Balancers

#### **Cloud DNS**
Domain Name System service
- **Similar to**: AWS Route 53, Azure DNS
- **Features**: Low latency, high availability

#### **Cloud Load Balancing**
Distribute traffic globally
- **Types**: HTTP(S), TCP/UDP, Internal
- **Features**: Global load balancing, auto-scaling

#### **Cloud Armor**
DDoS protection and WAF
- **Similar to**: AWS WAF + Shield
- **Features**: IP filtering, rate limiting

### 5. Security & Identity

#### **Cloud IAM (Identity and Access Management)**
Control access to resources
- **Similar to**: AWS IAM, Azure RBAC
- **Features**: Users, service accounts, roles, policies
- **Concept**: Hierarchical (Org → Folder → Project)

#### **Cloud Identity**
Identity as a Service (IDaaS)
- **Similar to**: AWS Cognito, Azure AD
- **Use Case**: Employee/user management

#### **Secret Manager**
Store API keys, passwords, certificates
- **Similar to**: AWS Secrets Manager, Azure Key Vault

#### **Cloud KMS (Key Management Service)**
Encryption key management
- **Similar to**: AWS KMS
- **Features**: Create, rotate, manage keys

### 6. Monitoring & Management

#### **Cloud Monitoring (formerly Stackdriver)**
Monitor infrastructure and applications
- **Similar to**: AWS CloudWatch, Azure Monitor
- **Features**: Metrics, alerts, dashboards
- **Integrated**: Works with AWS and on-premises too!

#### **Cloud Logging**
Centralized logging
- **Similar to**: AWS CloudWatch Logs
- **Features**: Log analysis, export to BigQuery

#### **Cloud Trace**
Distributed tracing
- **Similar to**: AWS X-Ray
- **Use Case**: Debug latency in microservices

#### **Cloud Profiler**
Continuous profiling
- **Use Case**: Identify performance bottlenecks

### 7. Developer Tools

#### **Cloud Source Repositories**
Git repository hosting
- **Similar to**: AWS CodeCommit, GitHub

#### **Cloud Build**
CI/CD platform
- **Similar to**: AWS CodeBuild
- **Features**: Build, test, deploy

#### **Artifact Registry**
Store and manage container images
- **Similar to**: AWS ECR, Docker Hub

### 8. Big Data & Analytics

#### **BigQuery**
Serverless data warehouse
- **Unique**: GCP's flagship analytics service
- **Features**: Petabyte-scale, SQL queries, ML integration
- **Pricing**: Pay per query (data processed)
- **Use Case**: Data analytics, business intelligence

#### **Cloud Dataflow**
Stream and batch data processing
- **Similar to**: AWS Kinesis + EMR
- **Based on**: Apache Beam
- **Use Case**: ETL, real-time analytics

#### **Cloud Dataproc**
Managed Hadoop/Spark
- **Similar to**: AWS EMR
- **Use Case**: Big data processing
- **Features**: Fast cluster creation

#### **Cloud Pub/Sub**
Real-time messaging service
- **Similar to**: AWS SNS/SQS, Azure Service Bus
- **Use Case**: Event-driven architectures
- **Features**: At-least-once delivery, ordering

#### **Cloud Composer**
Managed Apache Airflow
- **Use Case**: Workflow orchestration
- **Features**: Schedule and monitor pipelines

#### **Looker**
Business intelligence platform
- **Acquired by Google**
- **Use Case**: Data visualization, analytics

### 9. Machine Learning & AI

#### **Vertex AI**
Unified ML platform
- **Similar to**: AWS SageMaker
- **Features**: Build, deploy, scale ML models
- **Use Case**: Custom ML development

#### **AutoML**
Train custom models without ML expertise
- **Types**: Vision, Natural Language, Tables, Video
- **Use Case**: Custom ML with minimal code

#### **AI Platform (Pre-trained APIs)**
- **Vision AI** - Image analysis
- **Natural Language AI** - Text analysis
- **Translation AI** - Language translation
- **Speech-to-Text / Text-to-Speech**
- **Video AI** - Video analysis

#### **TensorFlow**
Open-source ML framework (by Google)
- **Best on**: GCP with TPUs (Tensor Processing Units)

## 🧪 Testing Considerations for QA

### GCP-Specific Testing Challenges

1. **Cost Control**
   - Use GCP Free Tier ($300 credit for 90 days)
   - Label resources for cost tracking
   - Use preemptible VMs for testing

2. **Global Services**
   - Test multi-region setups
   - Verify data locality/compliance
   - Test network latency

3. **IAM Hierarchy**
   - Test permissions at org/folder/project levels
   - Verify service account permissions
   - Test IAM policy inheritance

### Testing Strategies

**1. Local Testing**
- **Cloud Functions**: Functions Framework
- **Cloud Run**: Docker locally
- **Firestore**: Emulator suite
- **Pub/Sub**: Emulator

**2. Integration Testing**
- Use separate GCP projects for test environments
- Automate with Cloud Build
- Test service interactions

**3. Performance Testing**
- BigQuery query performance
- Cloud Functions cold starts
- Load testing with Locust/JMeter
- Network latency tests

**4. Security Testing**
- IAM policy validation
- VPC firewall rules testing
- Encryption verification
- Compliance checks (CIS benchmarks)

### Common Issues to Test

1. **IAM & Permissions**
   - Service account permissions
   - API enablement
   - Organization policies

2. **Networking**
   - VPC firewall rules
   - Load balancer configuration
   - Internal vs external access

3. **Quotas & Limits**
   - API rate limits
   - Concurrent function executions
   - BigQuery slots

4. **Data Consistency**
   - Eventually consistent services
   - Firestore transactions
   - Pub/Sub ordering

5. **Cold Starts**
   - Cloud Functions warmup
   - Cloud Run startup time
   - Impact on user experience

## 💰 GCP Pricing

### Key Advantages
- **Per-Second Billing** - More granular than AWS
- **Sustained Use Discounts** - Automatic (up to 30%)
- **Committed Use Discounts** - 1 or 3-year (up to 57%)
- **Preemptible VMs** - Up to 80% cheaper

### Pricing Calculator
Use Google Cloud Pricing Calculator to estimate costs

### Free Tier
- **Always Free**: 
  - Cloud Functions: 2M invocations/month
  - Cloud Run: 2M requests/month
  - Firestore: 1GB storage, 50K reads/day
  - Cloud Storage: 5GB/month
- **$300 Credit**: First 90 days

## 🛠️ Essential Tools

### gcloud CLI
Command-line tool for GCP
```bash
# Install
curl https://sdk.cloud.google.com | bash

# Initialize
gcloud init

# Example: List projects
gcloud projects list

# Example: Deploy to App Engine
gcloud app deploy

# Example: Create VM
gcloud compute instances create my-vm
```

### Cloud Console
Web-based management interface

### Cloud Shell
Browser-based terminal with tools pre-installed
- Free to use
- 5GB persistent storage
- Pre-authenticated

### SDKs
Available for many languages:
- Python (google-cloud-python)
- Java (google-cloud-java)
- Node.js (google-cloud-node)
- Go (google-cloud-go)
- .NET, Ruby, PHP

### Infrastructure as Code

**Deployment Manager**
- GCP native IaC
- YAML/Python/Jinja2 templates

**Terraform**
- Multi-cloud support
- Popular choice
- HCL language

**Pulumi**
- Use programming languages
- Modern approach

## 📐 GCP Best Practices

### 1. Organization Structure
```
Organization
  └── Folders (by environment/team)
      └── Projects (isolate resources)
```

### 2. IAM Best Practices
- Use service accounts for applications
- Grant least privilege
- Use predefined roles when possible
- Review permissions regularly

### 3. Network Security
- Use VPC Service Controls
- Enable Cloud Armor
- Implement firewall rules
- Use Private Google Access

### 4. Cost Optimization
- Use committed use discounts
- Leverage preemptible VMs
- Set up budget alerts
- Use labels for cost allocation
- Right-size resources

### 5. High Availability
- Use regional resources
- Implement health checks
- Configure auto-scaling
- Test disaster recovery

## 🏢 Who Uses GCP?

- **Spotify** - Data analytics and ML
- **Twitter** - Hadoop and data processing
- **Snapchat** - Core infrastructure
- **PayPal** - Risk analysis and ML
- **Target** - Data analytics
- **Home Depot** - E-commerce platform

## 🎓 Learning Resources

### Getting Started

1. **Create Free Account**
   - $300 credit for 90 days
   - No auto-charge after trial
   - Always-free tier services

2. **Qwiklabs**
   - Hands-on labs
   - Real GCP environment
   - Earn skill badges

3. **Google Cloud Training**
   - Free online courses
   - Instructor-led training
   - Certification prep

### Certifications
- **Cloud Digital Leader** - Business/non-technical
- **Associate Cloud Engineer** - Entry level
- **Professional Cloud Architect** - Most popular
- **Professional Data Engineer** - Data focus
- **Professional Cloud Developer** - App development
- **Specializations**: Network, Security, ML

### Practice Projects

1. **Serverless Website**
   - Cloud Storage + Cloud CDN
   - Cloud Functions for backend

2. **Containerized Microservices**
   - GKE cluster
   - Multiple services
   - Load balancing

3. **Data Pipeline**
   - Cloud Storage → Dataflow → BigQuery
   - Schedule with Cloud Scheduler

4. **Real-Time App**
   - Pub/Sub for messaging
   - Cloud Functions for processing
   - Firestore for storage

## 🔄 GCP vs AWS vs Azure

### When to Choose GCP

**Best For:**
✅ Data analytics and BigQuery workloads
✅ Machine learning and AI projects
✅ Kubernetes-based applications
✅ Startups and cost-conscious projects
✅ Organizations already using Google Workspace

**Consider Others If:**
❌ Need widest range of services (AWS)
❌ Microsoft-centric organization (Azure)
❌ Need most mature enterprise features (AWS)
❌ Require specific regional presence

### Key Differentiators
- **BigQuery**: Industry-leading data warehouse
- **GKE**: Best Kubernetes experience
- **Networking**: Superior global network
- **AI/ML**: Strong capabilities, easy to use
- **Pricing**: Often more cost-effective

## 🔗 Related Topics
- [Microservices Architecture](../../architectures/microservices/README.md)
- [Serverless Architecture](../../architectures/serverless/README.md)
- [Event-Driven Architecture](../../architectures/event-driven/README.md)
- [AWS](../aws/README.md)
- [Azure](../azure/README.md)

---

**Next Steps**: Explore [Microsoft Azure](../azure/README.md) to complete your understanding of major cloud platforms!
