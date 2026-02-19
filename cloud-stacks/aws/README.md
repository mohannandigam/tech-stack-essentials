# AWS (Amazon Web Services) Stack

## 📋 What is AWS?

**Amazon Web Services (AWS)** is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally. AWS provides computing power, storage, databases, and many other services on a pay-as-you-go basis.

## 🎯 Key Concepts

### Simple Analogy

Think of AWS as a massive utility company:

- Instead of building your own power plant, you plug into their grid
- Pay only for what you use (like electricity)
- Scale up or down based on demand
- They handle maintenance and upgrades
- Available 24/7 with high reliability

### Core Benefits

- **Global Infrastructure** - Data centers worldwide
- **Pay-as-You-Go** - No upfront costs
- **Scalability** - Scale from one to millions of users
- **Security** - Enterprise-grade security
- **Flexibility** - Choose from many services and tools

## 🏗️ Core AWS Services

### 1. Compute Services

#### **EC2 (Elastic Compute Cloud)**

Virtual servers in the cloud

- **Use Case**: Web applications, batch processing, gaming servers
- **Pricing**: Pay per hour/second of server runtime
- **Key Feature**: Choose CPU, memory, storage, networking capacity

```
Example: Launch a web server
- Select Amazon Linux AMI
- Choose t2.micro instance (1 vCPU, 1GB RAM)
- Deploy your application
```

#### **Lambda**

Run code without managing servers (Serverless)

- **Use Case**: APIs, data processing, scheduled tasks
- **Pricing**: Pay per request and execution time
- **Key Feature**: Automatic scaling, no server management

```
Example: Resize uploaded images
- User uploads image to S3
- Lambda automatically triggers
- Resizes image and saves result
```

#### **ECS/EKS (Elastic Container Service/Kubernetes Service)**

Run Docker containers

- **ECS**: AWS-managed container orchestration
- **EKS**: Managed Kubernetes service
- **Use Case**: Microservices, containerized applications

#### **Elastic Beanstalk**

Platform as a Service (PaaS)

- **Use Case**: Deploy apps without managing infrastructure
- **Supports**: Java, .NET, PHP, Node.js, Python, Ruby, Go, Docker

### 2. Storage Services

#### **S3 (Simple Storage Service)**

Object storage for any type of data

- **Use Case**: Backup, static website hosting, data lakes
- **Features**: 99.999999999% durability, versioning, lifecycle policies
- **Storage Classes**:
  - S3 Standard - Frequently accessed
  - S3 Intelligent-Tiering - Auto cost optimization
  - S3 Glacier - Long-term archive (cheap)

#### **EBS (Elastic Block Store)**

Block storage for EC2 instances

- **Use Case**: Database storage, file systems
- **Features**: Snapshots, encryption, multiple types (SSD/HDD)

#### **EFS (Elastic File System)**

Shared file storage

- **Use Case**: Shared storage across multiple servers
- **Features**: Auto-scaling, POSIX-compliant

### 3. Database Services

#### **RDS (Relational Database Service)**

Managed SQL databases

- **Engines**: MySQL, PostgreSQL, Oracle, SQL Server, MariaDB
- **Features**: Automated backups, patching, scaling
- **Use Case**: Traditional applications, OLTP

#### **DynamoDB**

NoSQL database (Key-Value & Document)

- **Features**: Single-digit millisecond latency, auto-scaling
- **Use Case**: High-traffic apps, gaming, IoT
- **Pricing**: Pay per read/write capacity

#### **Aurora**

MySQL/PostgreSQL compatible, cloud-native

- **Features**: 5x faster than MySQL, auto-scaling storage
- **Use Case**: Enterprise applications

#### **ElastiCache**

In-memory caching (Redis/Memcached)

- **Use Case**: Session storage, caching, real-time analytics

### 4. Networking & Content Delivery

#### **VPC (Virtual Private Cloud)**

Isolated virtual network

- **Features**: Subnets, route tables, internet gateways
- **Use Case**: Secure network isolation

#### **CloudFront**

Content Delivery Network (CDN)

- **Use Case**: Fast content delivery worldwide
- **Features**: Edge locations, DDoS protection

#### **Route 53**

DNS web service

- **Use Case**: Domain registration, routing policies
- **Features**: Health checks, traffic management

#### **API Gateway**

Create and manage APIs

- **Use Case**: RESTful APIs, WebSocket APIs
- **Features**: Authentication, rate limiting, caching

#### **ELB (Elastic Load Balancer)**

Distribute traffic across servers

- **Types**: Application LB, Network LB, Gateway LB
- **Features**: Health checks, SSL termination

### 5. Security & Identity

#### **IAM (Identity and Access Management)**

Manage access to AWS services

- **Features**: Users, groups, roles, policies
- **Best Practice**: Least privilege principle
- **Free**: No charge for IAM

#### **Cognito**

User authentication and authorization

- **Use Case**: User sign-up/sign-in for apps
- **Features**: Social login, MFA, user pools

#### **KMS (Key Management Service)**

Create and manage encryption keys

- **Use Case**: Encrypt data at rest and in transit

#### **Secrets Manager**

Store and rotate secrets

- **Use Case**: Database credentials, API keys

### 6. Monitoring & Management

#### **CloudWatch**

Monitoring and observability

- **Features**: Metrics, logs, alarms, dashboards
- **Use Case**: Track application and infrastructure health

#### **CloudTrail**

Audit and compliance

- **Features**: Log all API calls
- **Use Case**: Security analysis, compliance

#### **X-Ray**

Distributed tracing

- **Use Case**: Debug and analyze microservices

### 7. Developer Tools

#### **CodeCommit**

Git repository hosting

- **Use Case**: Source control

#### **CodeBuild**

Build and test code

- **Use Case**: CI/CD pipelines

#### **CodeDeploy**

Automated deployments

- **Use Case**: Deploy to EC2, Lambda, on-premises

#### **CodePipeline**

Continuous delivery service

- **Use Case**: Automate release pipelines

### 8. Analytics & Big Data

#### **Athena**

Query data in S3 using SQL

- **Use Case**: Ad-hoc analysis, log analysis
- **Pricing**: Pay per query (data scanned)

#### **EMR (Elastic MapReduce)**

Big data processing (Hadoop, Spark)

- **Use Case**: Data transformation, machine learning

#### **Kinesis**

Real-time data streaming

- **Use Case**: Log processing, real-time analytics

#### **Glue**

ETL service (Extract, Transform, Load)

- **Use Case**: Data preparation for analytics

### 9. Machine Learning & AI

#### **SageMaker**

Build, train, deploy ML models

- **Use Case**: Custom machine learning

#### **Rekognition**

Image and video analysis

- **Use Case**: Face detection, object recognition

#### **Comprehend**

Natural language processing

- **Use Case**: Sentiment analysis, entity extraction

#### **Lex**

Build chatbots

- **Use Case**: Conversational interfaces

## 🧪 Testing Considerations for QA

### Cloud-Specific Testing Challenges

1. **Cost Management**
   - Testing in cloud costs money
   - Use AWS Free Tier when possible
   - Clean up resources after testing
   - Use tags to track test resources

2. **Environment Parity**
   - Test environments should match production
   - Use Infrastructure as Code (CloudFormation)
   - Automate environment creation

3. **Distributed Systems**
   - Test network latency
   - Verify cross-region functionality
   - Test failure scenarios

### Testing Strategies

**1. Unit Testing**

- Test Lambda functions locally
- Mock AWS services (LocalStack, Moto)
- Fast and cheap

**2. Integration Testing**

- Test against real AWS services
- Use separate test accounts
- Test service interactions

**3. Performance Testing**

- Test auto-scaling behavior
- Verify performance meets SLAs
- Test under various loads
- Tools: JMeter, Gatling, Locust

**4. Security Testing**

- Test IAM policies
- Verify encryption
- Check security groups
- Scan for vulnerabilities
- Tools: AWS Inspector, Scout Suite

**5. Chaos Engineering**

- Test system resilience
- Simulate failures
- Tools: Chaos Monkey, Gremlin

### Common Issues to Test

1. **IAM Permissions**
   - Verify services have correct permissions
   - Test least privilege
   - Check cross-account access

2. **Network Configuration**
   - Test security group rules
   - Verify VPC configuration
   - Check connectivity

3. **Scaling**
   - Test auto-scaling triggers
   - Verify performance under load
   - Check for bottlenecks

4. **Cost Optimization**
   - Monitor spending
   - Test reserved vs on-demand instances
   - Verify auto-scaling down works

5. **Disaster Recovery**
   - Test backup and restore
   - Verify cross-region replication
   - Test failover procedures

## 💰 AWS Pricing Models

### 1. On-Demand

- Pay by hour/second
- No commitment
- Most expensive

### 2. Reserved Instances

- 1 or 3-year commitment
- Up to 75% discount
- Best for steady workloads

### 3. Spot Instances

- Bid on spare capacity
- Up to 90% discount
- Can be terminated anytime
- Good for flexible workloads

### 4. Savings Plans

- Flexible pricing model
- Commitment to $ amount per hour
- Up to 72% savings

## 🛠️ Essential Tools

### AWS CLI

Command-line interface for AWS

```bash
# Install
pip install awscli

# Configure
aws configure

# Example: List S3 buckets
aws s3 ls

# Example: Create EC2 instance
aws ec2 run-instances --image-id ami-xxxxx
```

### AWS SDKs

Available for many languages:

- JavaScript/Node.js (AWS SDK for JavaScript)
- Python (Boto3)
- Java (AWS SDK for Java)
- .NET (AWS SDK for .NET)
- Go, Ruby, PHP, etc.

### Infrastructure as Code

**CloudFormation**

- AWS native IaC tool
- YAML/JSON templates
- Manage entire stack

**Terraform**

- Multi-cloud IaC tool
- HCL language
- Popular choice

**AWS CDK**

- Define infrastructure in code
- Supports TypeScript, Python, Java, C#
- Compiles to CloudFormation

### Management Console

Web-based interface for AWS

## 📐 AWS Well-Architected Framework

Five pillars for building on AWS:

### 1. Operational Excellence

- Run and monitor systems
- Continuous improvement
- Automate operations

### 2. Security

- Protect data, systems, assets
- Risk assessment
- Principle of least privilege

### 3. Reliability

- Recover from failures
- Scale to meet demand
- Test disaster recovery

### 4. Performance Efficiency

- Use computing resources efficiently
- Select right resource types
- Monitor performance

### 5. Cost Optimization

- Avoid unnecessary costs
- Right-size resources
- Use pricing models effectively

## 🎓 Learning Resources

### Getting Started Path

1. **Create Free Account**
   - 12 months free tier
   - Always free services
   - Practice without cost

2. **Learn Core Services**
   - Start with EC2, S3, RDS
   - Build simple applications
   - Follow tutorials

3. **AWS Training**
   - AWS Skill Builder (free courses)
   - AWS Workshops
   - AWS Documentation

4. **Hands-On Practice**
   - Deploy a web application
   - Build a serverless API
   - Create a data pipeline

### Certifications

- **Cloud Practitioner** - Entry level
- **Solutions Architect Associate** - Popular
- **Developer Associate** - For developers
- **SysOps Administrator** - For operations
- **Specialty Certifications** - Advanced topics

### Practice Projects

1. **Static Website Hosting**
   - Use S3 + CloudFront
   - Add Route 53 for custom domain

2. **Serverless API**
   - API Gateway + Lambda + DynamoDB
   - Deploy CRUD application

3. **Web Application**
   - EC2 + RDS + ELB
   - Auto-scaling group
   - CloudWatch monitoring

4. **Data Pipeline**
   - S3 + Lambda + Glue + Athena
   - Process and analyze data

## 🔗 Related Topics

- [Microservices Architecture](../../architectures/microservices/README.md)
- [Serverless Architecture](../../architectures/serverless/README.md)
- [Event-Driven Architecture](../../architectures/event-driven/README.md)
- [Google Cloud Platform](../gcp/README.md)
- [Microsoft Azure](../azure/README.md)

---

**Next Steps**: Explore [Google Cloud Platform](../gcp/README.md) to see how Google's cloud services compare!
