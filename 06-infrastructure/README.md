# Infrastructure & DevOps

## What is it?

Infrastructure is the foundation that runs your applications - servers, networks, databases, and all supporting services. DevOps is the practice of automating and streamlining how we build, deploy, and maintain this infrastructure.

## Simple Analogy

Think of infrastructure like **the plumbing, electricity, and foundation of a building**. You don't see it, but without it, nothing works. DevOps engineers are like facilities managers who ensure everything runs smoothly, automate maintenance, and quickly fix problems before tenants (users) even notice.

## Why Does It Matter?

Modern applications require:
- **Scalability**: Handle growth from 100 to 1M users
- **Reliability**: Stay online 99.99% of the time
- **Speed**: Deploy new features multiple times per day
- **Security**: Protect against attacks and breaches
- **Cost Efficiency**: Optimize resource usage

Good infrastructure enables developers to move fast while maintaining quality.

## DevOps Philosophy

### Core Principles

1. **Automation Over Manual Work**
   - Automate repetitive tasks
   - Reduce human error
   - Free humans for creative work

2. **Infrastructure as Code (IaC)**
   - Define infrastructure in version-controlled files
   - Reproducible environments
   - Easy disaster recovery

3. **You Build It, You Run It**
   - Developers responsible for operations
   - Faster feedback loops
   - Better system design

4. **Continuous Everything**
   - Continuous Integration (CI)
   - Continuous Delivery (CD)
   - Continuous Monitoring

5. **Measure Everything**
   - Metrics-driven decisions
   - Observability over debugging
   - Data informs improvements

### DevOps vs SRE (Site Reliability Engineering)

**DevOps**: Culture and practices for collaboration between development and operations

**SRE**: Google's implementation of DevOps principles with engineering rigor
- Error budgets (acceptable downtime)
- SLIs/SLOs/SLAs (service level indicators/objectives/agreements)
- Toil reduction (automate repetitive work)

## Topics Covered

### [Docker](./docker/README.md)
Containerization - package applications with dependencies

**Why Docker**:
- Consistent environments (dev = prod)
- Isolation between applications
- Lightweight compared to VMs
- Fast startup times

**Use Cases**:
- Microservices deployment
- Local development environments
- CI/CD pipelines
- Legacy application modernization

**Learn**: Container basics, Dockerfiles, multi-stage builds, Docker Compose

---

### [Kubernetes](./kubernetes/README.md)
Container orchestration at scale

**Why Kubernetes**:
- Auto-scaling based on load
- Self-healing (restart failed containers)
- Rolling updates (zero-downtime deploys)
- Service discovery and load balancing

**Use Cases**:
- Production microservices
- Stateful applications (databases)
- Batch processing jobs
- Machine learning workflows

**Learn**: Pods, Services, Deployments, ConfigMaps, Ingress, Helm

---

### [CI/CD](./cicd/README.md)
Automated testing and deployment pipelines

**Why CI/CD**:
- Fast feedback (catch bugs early)
- Consistent builds
- Automated testing
- Rapid deployments

**Stages**:
1. **Build**: Compile code, run linters
2. **Test**: Unit tests, integration tests
3. **Deploy**: Staging → production
4. **Monitor**: Track deployment health

**Learn**: GitHub Actions, GitLab CI, Jenkins, deployment strategies

---

### [Terraform](./terraform/README.md)
Infrastructure as Code (IaC)

**Why Terraform**:
- Version-controlled infrastructure
- Multi-cloud support (AWS, GCP, Azure)
- Declarative (describe desired state)
- Change planning (preview before apply)

**Use Cases**:
- Provision cloud resources
- Network configuration
- Database setup
- Multi-environment management

**Learn**: Resources, modules, state management, workspaces

---

### [Monitoring](./monitoring/README.md)
Observability and performance tracking

**Why Monitor**:
- Detect issues before users report them
- Understand system behavior
- Capacity planning
- Performance optimization

**Three Pillars of Observability**:
1. **Metrics**: Numbers over time (CPU, latency, error rate)
2. **Logs**: Event records (error messages, audit trails)
3. **Traces**: Request paths through distributed systems

**Learn**: Prometheus, Grafana, ELK stack, distributed tracing

---

## DevOps Maturity Model

### Level 1: Manual Everything
- Manual deployments
- No version control for infrastructure
- Reactive incident response
- Long deployment cycles

### Level 2: Basic Automation
- Some scripts for common tasks
- Version control for code (not infra)
- Manual testing before deploy
- Weekly/monthly releases

### Level 3: CI/CD Adoption
- Automated builds and tests
- Containerization
- Infrastructure as code started
- Daily/weekly releases

### Level 4: Full DevOps
- Comprehensive automation
- IaC for all environments
- Monitoring and alerting
- Multiple deployments per day

### Level 5: Continuous Improvement
- Chaos engineering
- Self-healing systems
- Predictive analytics
- Feature flags and canary releases

## Common Patterns

### 1. GitOps
**Concept**: Git as single source of truth for infrastructure

**Flow**:
```
Git Repo (infrastructure code) → CI/CD → Apply Changes → Production
```

**Benefits**:
- Audit trail (all changes in git history)
- Easy rollbacks (git revert)
- Pull request reviews for infra changes

### 2. Blue-Green Deployment
**Concept**: Two identical production environments

**Process**:
1. Blue = current production
2. Deploy new version to Green
3. Test Green environment
4. Switch traffic from Blue to Green
5. Keep Blue as backup

**Benefits**: Zero-downtime, easy rollback

### 3. Canary Deployment
**Concept**: Gradual rollout to subset of users

**Process**:
1. Deploy new version to 5% of servers
2. Monitor for errors
3. Gradually increase to 25%, 50%, 100%
4. Rollback if issues detected

**Benefits**: Reduced blast radius, early issue detection

### 4. Feature Flags
**Concept**: Toggle features without deploying

```python
# Feature flag example
if feature_flag_enabled('new_checkout_flow', user_id):
    return new_checkout()
else:
    return old_checkout()
```

**Benefits**: Decouple deployment from release, A/B testing, quick disable

### 5. Immutable Infrastructure
**Concept**: Never modify existing servers, replace them

**Traditional**: SSH into server, run update commands
**Immutable**: Build new server image, replace old servers

**Benefits**: Consistent environments, easy rollbacks, no configuration drift

## SRE Practices

### 1. Error Budgets
**Concept**: Acceptable amount of downtime

Example: 99.9% uptime = 43 minutes downtime/month

**Use**: Balance reliability with velocity
- Budget remaining → ship features fast
- Budget exhausted → focus on reliability

### 2. SLI/SLO/SLA

**SLI (Service Level Indicator)**: Metric to measure (latency, error rate)

**SLO (Service Level Objective)**: Target for SLI (95% of requests < 200ms)

**SLA (Service Level Agreement)**: Contract with consequences (refund if SLO missed)

### 3. Toil Reduction
**Toil**: Manual, repetitive, automatable work

**Goal**: Spend < 50% of time on toil, rest on engineering

**Examples of Toil**:
- Manual deployments
- Responding to alerts without automation
- Manual scaling

### 4. Blameless Postmortems
After incidents:
1. **Timeline**: What happened and when
2. **Root Cause**: Why it happened
3. **Impact**: Customers affected, revenue lost
4. **Action Items**: How to prevent recurrence

**Key**: Focus on systems, not people. No blame.

## Platform Engineering

**Trend**: Build internal developer platforms (IDPs)

**Goal**: Make developers self-sufficient
- Self-service infrastructure
- Standardized deployment pipelines
- Built-in observability
- Security by default

**Example Tools**:
- Backstage (Spotify) - developer portal
- Humanitec - platform orchestrator
- Port - internal developer portal

## FinOps (Financial Operations)

**Concept**: Optimize cloud costs

**Practices**:
- Right-size resources (don't over-provision)
- Use spot/preemptible instances
- Auto-scaling to match demand
- Reserved instances for predictable load
- Delete unused resources

**Tools**: AWS Cost Explorer, CloudHealth, Kubecost

## DevSecOps

**Concept**: Security integrated into DevOps

**Shift-Left Security**: Find vulnerabilities early
- Dependency scanning (Snyk, Dependabot)
- SAST (static code analysis)
- DAST (dynamic testing)
- Container scanning (Trivy, Clair)

**Security in CI/CD**:
- Automated security tests
- Secret scanning (GitGuardian)
- Compliance checks
- Vulnerability gates (block deploy if critical vulnerabilities)

## Quick Start by Domain

### Startup (< 100K users)
- **Hosting**: Heroku, Railway, or Cloud Run
- **Database**: Managed DB (RDS, Cloud SQL)
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in cloud monitoring

**Focus**: Ship fast, worry about scale later

### Growing (100K-1M users)
- **Containers**: Docker
- **Orchestration**: Kubernetes or ECS
- **IaC**: Terraform basics
- **CI/CD**: Automated testing + deployment
- **Monitoring**: Prometheus + Grafana

**Focus**: Reliability and automation

### Scale (1M+ users)
- **Multi-region**: Global deployment
- **Service Mesh**: Istio or Linkerd
- **Advanced IaC**: Terraform modules, workspaces
- **Observability**: Full stack (metrics, logs, traces)
- **Chaos Engineering**: Test resilience

**Focus**: Efficiency and resilience

## Learning Path

### Beginner (0-3 months)
1. **Linux basics**: Command line, file system, processes
2. **Git**: Version control fundamentals
3. **Docker**: Containers and Dockerfiles
4. **Basic CI/CD**: GitHub Actions workflow

**Project**: Containerize and auto-deploy a simple app

### Intermediate (3-9 months)
1. **Kubernetes**: Deploy microservices
2. **Terraform**: Provision cloud resources
3. **Monitoring**: Set up Prometheus + Grafana
4. **CI/CD Advanced**: Test automation, deployment strategies

**Project**: Full CI/CD pipeline with monitoring

### Advanced (9-18 months)
1. **Service Mesh**: Istio or Linkerd
2. **Advanced K8s**: Operators, custom resources
3. **Multi-cloud**: AWS + GCP or Azure
4. **Chaos Engineering**: Simulate failures

**Project**: Production-grade platform with observability

## Best Practices

### 1. Everything as Code
- Infrastructure (Terraform)
- Configuration (Ansible, Chef)
- Pipelines (YAML)
- Documentation (Markdown in Git)

### 2. Test in Production-Like Environments
- Staging mirrors production
- Use production-size databases
- Test at production scale

### 3. Automate Repetitive Tasks
- Server provisioning
- Deployments
- Backups
- Scaling

### 4. Monitor Proactively
- Set up alerts before issues occur
- Track trends, not just current state
- Use SLOs to guide improvements

### 5. Document Everything
- Architecture decisions (ADRs)
- Runbooks for common tasks
- Incident playbooks
- Onboarding guides

## Common Pitfalls

1. **Over-Engineering Early**: Start simple, add complexity as needed
2. **Ignoring Monitoring**: Can't fix what you can't see
3. **Manual Configuration**: Leads to drift and outages
4. **Skipping Disaster Recovery**: Test backups and restore procedures
5. **Not Practicing Incidents**: Fire drills reveal gaps

## Related Topics

### Prerequisites
- [Foundations](../00-foundations/README.md) - Networking, Linux basics, and how computers work
- [Programming](../01-programming/README.md) - Scripting languages (Bash, Python) for automation
- [Backend Development](../05-backend/README.md) - The applications you are deploying and managing

### Next Steps
- [Cloud Platforms](../07-cloud/RESOURCES.md) - AWS, GCP, Azure — cloud-specific infrastructure services
- [Security & Compliance](../08-security/README.md) - DevSecOps practices and infrastructure security

### Complementary Topics
- [System Architecture](../02-architectures/README.md) - Microservices, event-driven, and other patterns infrastructure supports
- [Development Methodologies](../03-methodologies/README.md) - DevOps culture, CI/CD practices, and team workflows
- [Frontend Development](../04-frontend/README.md) - CDN deployment and static site hosting
- [AI/ML](../09-ai-ml/README.md) - MLOps infrastructure for model training and serving
- [Domain Examples](../10-domain-examples/README.md) - Infrastructure patterns in real industries
- [Case Studies](../11-case-studies/README.md) - Real-world infrastructure scaling decisions
- [Career Development](../12-career/README.md) - DevOps and SRE career paths

### Learning Resources
- [YouTube, Books & Courses for Infrastructure](./RESOURCES.md)

---

**Start Here**: Begin with [Docker](./docker/README.md) to understand containerization fundamentals.
