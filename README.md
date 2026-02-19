# Learn - Software Architecture & Cloud Stack Guide

Welcome to this comprehensive learning repository! This guide is designed for software testers and developers who want to understand software architectures and cloud platforms from the ground up.

## 📚 What You'll Learn

This repository provides high-level overviews and practical knowledge about:

- Modern software architecture patterns
- Development methodologies
- Major cloud platforms and their services

## 🗂️ Repository Structure

### 1. Software Architectures

Learn about different architectural patterns used in modern software development:

- **[Monorepo](./02-architectures/monorepo/README.md)** - Single repository for multiple projects
- **[Microservices](./02-architectures/microservices/README.md)** - Distributed service-based architecture
- **[Serverless](./02-architectures/serverless/README.md)** - Function-as-a-Service architecture
- **[Event-Driven](./02-architectures/event-driven/README.md)** - Asynchronous event-based systems

### 2. Development Methodologies

Understand the processes and practices that guide software development:

- **[Behaviour-Driven Development (BDD)](./03-methodologies/behaviour-driven-development/README.md)** - Collaboration-focused development approach
- **[Test-Driven Development (TDD)](./03-methodologies/test-driven-development/README.md)** - Test-first development methodology

### 3. Cloud Stacks

Explore the major cloud platforms and their services:

- **[AWS (Amazon Web Services)](./07-cloud/aws/README.md)** - Amazon's cloud platform
- **[GCP (Google Cloud Platform)](./07-cloud/gcp/README.md)** - Google's cloud platform
- **[Azure](./07-cloud/azure/README.md)** - Microsoft's cloud platform

### 4. Practical Examples

Real-world implementation examples with best practices:

- **[Microservices E-Commerce Application](./examples/microservices-ecommerce/README.md)** - Full-stack microservices application demonstrating:
  - Complete user authentication service with JWT
  - Structured logging with correlation IDs
  - Security best practices (OWASP Top 10 coverage)
  - Docker containerization and orchestration
  - Database design and schemas
  - Comprehensive testing strategies
  - Deployment guides for Docker, Kubernetes, and AWS

### 5. Infrastructure

Modern DevOps practices and tools:

- **[Infrastructure Overview](./06-infrastructure/README.md)** - DevOps and infrastructure patterns
- **[Docker](./06-infrastructure/docker/README.md)** - Containerization with domain-specific examples
- **[Kubernetes](./06-infrastructure/kubernetes/README.md)** - Container orchestration at scale
- **[CI/CD](./06-infrastructure/cicd/README.md)** - Continuous Integration and Delivery pipelines
- **[Terraform](./06-infrastructure/terraform/README.md)** - Infrastructure as Code
- **[Monitoring](./06-infrastructure/monitoring/README.md)** - Observability and performance monitoring

### 6. Domain Examples

Quick-start templates across industries:

- **[Domain Examples Overview](./10-domain-examples/README.md)** - Learning templates for 16 industries

#### Core Business Domains

- **[Energy](./10-domain-examples/energy/README.md)** - Smart grid monitoring, IoT sensor networks
- **[Finance](./10-domain-examples/finance/README.md)** - Trading platforms, portfolio management
- **[Banking](./10-domain-examples/banking/README.md)** - Account management, transaction processing
- **[Social Media](./10-domain-examples/social-media/README.md)** - User feeds, content moderation
- **[Dating](./10-domain-examples/dating/README.md)** - Matching algorithms, user profiles
- **[Retail](./10-domain-examples/retail/README.md)** - Inventory management, point-of-sale
- **[Insurance](./10-domain-examples/insurance/README.md)** - Claims processing, risk assessment
- **[Healthcare](./10-domain-examples/healthcare/README.md)** - Patient records, appointment scheduling
- **[Logistics](./10-domain-examples/logistics/README.md)** - Package tracking, route optimization

#### Specialized Industry Domains

- **[Aerospace](./10-domain-examples/aerospace/README.md)** - Flight tracking, satellite systems, aircraft maintenance
- **[Mortgage](./10-domain-examples/mortgage/README.md)** - Loan origination, underwriting, servicing
- **[Manufacturing](./10-domain-examples/manufacturing/README.md)** - Smart factory, IoT, predictive maintenance
- **[Telecommunications](./10-domain-examples/telecommunications/README.md)** - Network ops, billing, subscriber management
- **[Education](./10-domain-examples/education/README.md)** - Learning management, student information systems
- **[Government](./10-domain-examples/government/README.md)** - Citizen services, permits, benefits administration

### 7. Quick Reference

Fast lookup guides for common patterns:

- **[Quick Reference](./quick-reference/README.md)** - Cheat sheets, code snippets, decision trees
  - Pattern selection guide
  - Technology stack recommendations
  - Code snippet library
  - Security checklist
  - Performance benchmarks

### 8. AI Stack

Understand how to build and operate AI systems end-to-end:

- **[AI Stack Guide](./09-ai-ml/README.md)** - Model creation, optimization, MLOps flows, data platforms, and QA playbooks
  - **[Team Structure & Collaboration](./09-ai-ml/TEAM_STRUCTURE.md)** - Complete guide to AI/ML teams (Data Engineers, Data Scientists, ML Engineers)
  - **[Snowflake to Databricks Pipeline](./09-ai-ml/TEAM_STRUCTURE_PART2.md)** - End-to-end anomaly detection with Unity Catalog
  - **[Real-World Examples](./09-ai-ml/TEAM_STRUCTURE_PART3.md)** - E-commerce recommendations, healthcare, financial services

## 🎯 For Software Testers

As a software tester, understanding these concepts will help you:

- Design better test strategies for different architectures
- Identify potential issues and edge cases early
- Collaborate more effectively with development teams
- Test cloud-native applications with confidence
- Find complex problems by understanding system design

## 🚀 How to Use This Repository

### For Fast-Paced Learning

1. **Check Quick Reference** - Start with [Quick Reference](./quick-reference/README.md) for immediate answers
2. **Pick a Domain** - Choose a [domain example](./10-domain-examples/) that interests you
3. **Run the Example** - Follow quick-start guides to see working code
4. **Understand Patterns** - Read architecture guides to understand why
5. **Adapt and Apply** - Use templates for your own projects

### For Deep Learning

1. **Start with the basics** - Begin with the architecture that interests you most
2. **Understand the concepts** - Read through the high-level explanations
3. **Think about testing** - Each topic includes testing considerations
4. **Try the practical examples** - Deploy examples to see concepts in action
5. **Explore infrastructure** - Learn Docker, Kubernetes, CI/CD
6. **Practice across domains** - See how patterns apply differently

### For Quick Lookups

- **Need a code snippet?** Check [Quick Reference](./quick-reference/README.md)
- **Choosing a pattern?** See pattern selection guide
- **Domain-specific?** Visit [Domain Examples](./10-domain-examples/)
- **Infrastructure?** Check [Infrastructure](./06-infrastructure/)

## 📖 Learning Path Recommendations

### For Complete Beginners:

1. Start with [Quick Reference](./quick-reference/README.md) for overview
2. Learn [TDD](./03-methodologies/test-driven-development/README.md) and [BDD](./03-methodologies/behaviour-driven-development/README.md) methodologies
3. Try [Docker basics](./06-infrastructure/docker/README.md)
4. Pick a simple domain ([Retail](./10-domain-examples/retail/README.md) or [Energy](./10-domain-examples/energy/README.md))
5. Explore one cloud platform (start with [AWS](./07-cloud/aws/README.md))

### For Those with Some Experience:

1. Compare [Microservices](./02-architectures/microservices/README.md) vs [Serverless](./02-architectures/serverless/README.md) architectures
2. Understand [Event-Driven](./02-architectures/event-driven/README.md) patterns
3. Set up [Kubernetes](./06-infrastructure/kubernetes/README.md) and [CI/CD](./06-infrastructure/cicd/README.md)
4. Try complex domains ([Finance](./10-domain-examples/finance/README.md), [Healthcare](./10-domain-examples/healthcare/README.md))
5. Explore all three cloud platforms

### For Domain-Specific Learning:

- **Finance/Banking**: Event Sourcing → CQRS → Saga Pattern
- **Social Media**: Microservices → Caching → Real-time Processing
- **Healthcare**: Security → Compliance → Data Encryption
- **IoT/Energy**: Event-Driven → Time-Series → Real-time Analytics
- **E-Commerce**: Microservices → API Gateway → Payment Integration

## 🔄 What's Included

This repository now includes:

### ✅ Theoretical Knowledge

- 4 Architecture patterns (Monorepo, Microservices, Serverless, Event-Driven)
- 2 Development methodologies (TDD, BDD)
- 3 Cloud platforms (AWS, GCP, Azure)

### ✅ Practical Infrastructure

- Docker containerization with domain examples
- Kubernetes orchestration patterns
- CI/CD pipeline configurations
- Infrastructure as Code (Terraform)
- Monitoring and observability setups

### ✅ Domain-Specific Examples

- 10 industry domains with quick-start templates
- Real-world use cases and implementations
- Domain-specific patterns and best practices
- Complete code examples with tests

### ✅ Quick References

- Pattern selection guides
- Code snippet library
- Technology stack recommendations
- Security checklists
- Performance benchmarks
- Decision trees for common choices

### 🚧 Coming Soon

- More domain implementations
- Frontend examples (React, Vue, Angular)
- Mobile development patterns
- Machine Learning integration examples
- GraphQL implementations
- Code examples and tutorials
- Testing frameworks and best practices
- CI/CD pipeline examples
- Real-world case studies

## 🤝 Contributing

This is a learning repository. Feel free to:

- Add your own notes and learnings
- Contribute examples and code samples
- Share resources and references
- Ask questions and discuss concepts

---

**Happy Learning! 🎓**
