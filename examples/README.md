# Working Code Examples

## What Is This?

This directory contains runnable code examples that demonstrate concepts from the guides. Unlike the guides (which focus on explanation), these examples focus on **working, executable code** you can run locally.

## Available Examples

### [Microservices E-Commerce Platform](./microservices-ecommerce/README.md)

A complete microservices architecture for an e-commerce system demonstrating:
- Service decomposition (product, order, payment, notification services)
- Docker Compose for local development
- API Gateway pattern
- Inter-service communication
- Database per service
- Logging, monitoring, and security

**Technologies**: Python, Docker, PostgreSQL, Redis, RabbitMQ

**Related Guides**:
- [Microservices Architecture](../02-architectures/microservices/README.md)
- [Docker](../06-infrastructure/docker/README.md)
- [Message Queues](../05-backend/message-queues/README.md)
- [REST APIs](../05-backend/rest-apis/README.md)

## How to Use These Examples

1. **Read the guide first** — understand the concepts before running the code
2. **Clone and run locally** — each example has setup instructions in its README
3. **Experiment** — modify the code, break things, fix them
4. **Connect to theory** — each example links back to the relevant guide

## Contributing Examples

When adding a new example:
- Keep it minimal — demonstrate one concept clearly
- Include a README with setup instructions
- Add Docker/docker-compose for easy setup
- Link back to the relevant guide(s)
- Include comments explaining the "why"
