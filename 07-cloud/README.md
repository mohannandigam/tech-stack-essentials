# Cloud Computing

## What Is Cloud Computing?

Cloud computing means using someone else's computers over the internet instead of buying and maintaining your own. Instead of purchasing servers, storage, and networking equipment, you rent these resources from a cloud provider and pay only for what you use.

### Simple Analogy

Think of electricity before and after the power grid. In the early 1900s, every factory had to build and maintain its own power generator. When the power grid was built, factories plugged in — paying only for the electricity they consumed, scaling up or down instantly, and never worrying about generator maintenance again. Cloud computing did the same thing for computing power.

### Why It Matters

- **No upfront cost**: Start a project for pennies instead of thousands in hardware
- **Global scale**: Deploy to data centers worldwide in minutes
- **Elasticity**: Scale from 1 to 1,000,000 users and back again automatically
- **Managed services**: The cloud provider handles security patches, hardware failures, and maintenance
- **Innovation speed**: Experiment quickly — spin up infrastructure in minutes, tear it down if it doesn't work

## The Three Major Cloud Providers

| Aspect | AWS | GCP | Azure |
|--------|-----|-----|-------|
| **Market share** | ~32% (largest) | ~12% | ~23% |
| **Strengths** | Breadth of services, enterprise | Data/AI, Kubernetes | Microsoft integration, hybrid |
| **Best for** | "We need everything" | Data-heavy, ML workloads | Windows/.NET shops |
| **Free tier** | 12-month + always-free | 12-month + always-free | 12-month + always-free |
| **Pricing model** | Per-second (EC2), per-hour | Per-second | Per-minute |

## Cloud Service Models

Understanding these three models is fundamental to cloud computing:

```
┌──────────────────────────────────────────────────────────┐
│                Cloud Service Models                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  IaaS (Infrastructure as a Service)                      │
│  ├── YOU manage: OS, runtime, app, data                  │
│  ├── PROVIDER manages: servers, storage, networking      │
│  ├── Examples: EC2, Compute Engine, Azure VMs            │
│  └── Like: Renting an empty office — you furnish it      │
│                                                          │
│  PaaS (Platform as a Service)                            │
│  ├── YOU manage: App, data                               │
│  ├── PROVIDER manages: OS, runtime, servers, storage     │
│  ├── Examples: Elastic Beanstalk, App Engine, App Service│
│  └── Like: Renting a furnished office — just bring work  │
│                                                          │
│  SaaS (Software as a Service)                            │
│  ├── YOU manage: Nothing (just use it)                   │
│  ├── PROVIDER manages: Everything                        │
│  ├── Examples: Gmail, Slack, Salesforce                  │
│  └── Like: Using a coworking space — just show up        │
│                                                          │
│  Serverless (FaaS — Functions as a Service)              │
│  ├── YOU manage: Individual functions                     │
│  ├── PROVIDER manages: Everything else (including scale) │
│  ├── Examples: Lambda, Cloud Functions, Azure Functions   │
│  └── Like: Hiring a contractor per task — pay per job    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Core Cloud Services (Cross-Provider)

Every major cloud provider offers equivalent services. Here's how they map:

### Compute

| Need | AWS | GCP | Azure |
|------|-----|-----|-------|
| Virtual machines | EC2 | Compute Engine | Virtual Machines |
| Containers | ECS / EKS | GKE | AKS |
| Serverless functions | Lambda | Cloud Functions | Azure Functions |
| App hosting | Elastic Beanstalk | App Engine | App Service |

### Storage

| Need | AWS | GCP | Azure |
|------|-----|-----|-------|
| Object storage | S3 | Cloud Storage | Blob Storage |
| Block storage | EBS | Persistent Disk | Managed Disks |
| File storage | EFS | Filestore | Azure Files |
| Archive | S3 Glacier | Archive Storage | Archive Storage |

### Databases

| Need | AWS | GCP | Azure |
|------|-----|-----|-------|
| Relational (managed) | RDS / Aurora | Cloud SQL / Spanner | Azure SQL |
| NoSQL document | DynamoDB | Firestore | Cosmos DB |
| Cache | ElastiCache | Memorystore | Azure Cache |
| Data warehouse | Redshift | BigQuery | Synapse Analytics |

### Networking

| Need | AWS | GCP | Azure |
|------|-----|-----|-------|
| Virtual network | VPC | VPC | Virtual Network |
| Load balancer | ELB / ALB | Cloud Load Balancing | Azure Load Balancer |
| DNS | Route 53 | Cloud DNS | Azure DNS |
| CDN | CloudFront | Cloud CDN | Azure CDN |

## How to Choose a Cloud Provider

### Decision Framework

```
START HERE:

Is your org already using Microsoft 365/Active Directory?
├── YES → Azure (best integration with Microsoft ecosystem)
└── NO → Continue

Is your primary workload data analytics or ML?
├── YES → GCP (BigQuery + Vertex AI are best-in-class)
└── NO → Continue

Do you need the widest range of services?
├── YES → AWS (most services, most regions)
└── NO → Continue

Are you building Kubernetes-native applications?
├── YES → GCP (created K8s, GKE is the gold standard)
└── NO → Continue

Default → AWS (largest community, most documentation, most job listings)
```

### Multi-Cloud vs. Single Cloud

| Approach | Pros | Cons |
|----------|------|------|
| **Single cloud** | Simpler operations, deeper discounts, less complexity | Vendor lock-in, single point of failure |
| **Multi-cloud** | Avoid lock-in, best-of-breed services | Complexity, higher cost, more expertise needed |
| **Hybrid** (cloud + on-prem) | Regulatory compliance, data sovereignty | Most complex, requires VPN/connectivity |

**Recommendation for most teams**: Start with a single cloud provider. Multi-cloud adds complexity that small-to-medium teams can't afford. Only go multi-cloud when you have a specific business reason (regulatory requirements, avoiding vendor lock-in at scale).

## Cloud Cost Management

```
TOP COST OPTIMIZATION STRATEGIES:

1. RIGHT-SIZE INSTANCES
   └── Most people over-provision. Start small, scale up.

2. USE RESERVED/COMMITTED PRICING
   └── 30-60% savings for 1-3 year commitments on steady workloads.

3. USE SPOT/PREEMPTIBLE INSTANCES
   └── Up to 90% savings for fault-tolerant, interruptible workloads.

4. AUTO-SCALE
   └── Scale down during off-peak hours. Don't pay for idle.

5. CLEAN UP UNUSED RESOURCES
   └── Orphaned volumes, unused IPs, idle load balancers add up.

6. USE MANAGED SERVICES
   └── Often cheaper than running your own (RDS vs self-managed DB).

7. SET BUDGETS AND ALERTS
   └── Every cloud provider has budget alerts. USE THEM.
```

## Best Practices

### Safety
- **Principle of least privilege**: Grant minimum permissions needed
- **Enable MFA**: On all accounts, especially root/admin
- **Encrypt everything**: At rest and in transit
- **Use private subnets**: Don't expose databases to the internet
- **Regular security audits**: Use cloud-native tools (AWS Config, Security Center)

### Quality
- **Infrastructure as Code**: Use Terraform, CloudFormation, or Pulumi — never click-ops
- **Automated testing**: Test infrastructure changes before deploying
- **Blue-green deployments**: Zero-downtime updates
- **Disaster recovery**: Cross-region replication for critical data

### Logging & Observability
- **Centralized logging**: CloudWatch, Cloud Logging, Azure Monitor
- **Distributed tracing**: X-Ray, Cloud Trace, Application Insights
- **Cost monitoring**: Set up billing alerts and cost dashboards
- **Compliance reporting**: Automated compliance checks

## Detailed Guides

### [AWS - Amazon Web Services](./aws/README.md)
The largest cloud platform with the widest range of services. Best for enterprises needing comprehensive cloud solutions and the largest community of practitioners.

### [GCP - Google Cloud Platform](./gcp/README.md)
Built on Google's infrastructure. Best for data analytics, machine learning, and Kubernetes-native workloads. Often the most developer-friendly experience.

### [Azure - Microsoft Azure](./azure/README.md)
Microsoft's cloud platform. Best for organizations already using Microsoft products (Active Directory, Office 365, .NET). Strong hybrid cloud capabilities.

## Related Topics

- [Docker & Containers](../06-infrastructure/docker/README.md) — Foundation for cloud-native applications
- [Kubernetes](../06-infrastructure/kubernetes/README.md) — Container orchestration on cloud
- [Terraform](../06-infrastructure/terraform/README.md) — Infrastructure as Code across clouds
- [CI/CD](../06-infrastructure/cicd/README.md) — Automated deployment pipelines
- [Serverless Architecture](../02-architectures/serverless/README.md) — Event-driven cloud computing
- [Security](../08-security/README.md) — Cloud security best practices

### Learning Resources
- [YouTube, Books & Courses for Cloud](./RESOURCES.md)

---

**Start with**: Pick ONE cloud provider and learn it deeply. AWS has the most job listings, GCP is best for data/ML, Azure is best for Microsoft shops.
