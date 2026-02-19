# Netflix - Microservices Migration at Scale

## Overview

Netflix transformed from a monolithic application to over 1000 microservices, pioneering patterns that became industry standards. This migration enabled them to scale to 260M+ subscribers across 190+ countries while maintaining high availability.

## The Problem

### Initial State (2008)
- Single monolithic application (Java)
- Deployed to on-premise data centers
- Tight coupling between components
- Slow deployment cycles (weeks)
- Single point of failure
- Scaling entire app for one feature

### Business Pressure
- Rapid subscriber growth
- Global expansion requirements
- Need for faster feature deployment
- 99.99% availability target
- Demand for personalization at scale

### Technical Constraints
- Data center limitations
- Unpredictable traffic spikes
- Database bottlenecks
- Deployment risk (any deploy could break everything)

## The Solution

### Phase 1: Move to AWS (2008-2010)
**Decision**: Migrate from data centers to AWS cloud

**Why AWS**:
- Infinite scalability
- Pay-per-use model
- Global presence
- Managed services

**Challenge**: Complete migration after data center failure in 2008

### Phase 2: Break the Monolith (2009-2011)
**Decision**: Decompose into microservices

**Decomposition Strategy**:
1. Identify bounded contexts (Billing, Recommendations, Playback, etc.)
2. Create service for each domain
3. Implement API gateway for routing
4. Gradually migrate functionality

**Service Examples**:
- **Playback Service**: Video streaming
- **Recommendation Service**: Personalized suggestions
- **Billing Service**: Subscriptions and payments
- **User Service**: Authentication and profiles

### Phase 3: Build Supporting Infrastructure (2010-2015)

#### Service Discovery (Eureka)
```java
// Service registration
@EnableEurekaClient
@SpringBootApplication
public class RecommendationService {
    public static void main(String[] args) {
        SpringApplication.run(RecommendationService.class, args);
    }
}

// Service discovery client
@Autowired
private DiscoveryClient discoveryClient;

public List<ServiceInstance> getRecommendationInstances() {
    return discoveryClient.getInstances("recommendation-service");
}
```

#### API Gateway (Zuul)
- Single entry point for all clients
- Dynamic routing
- Load balancing
- Security
- Monitoring

#### Circuit Breaker (Hystrix)
```java
// Prevent cascade failures
@HystrixCommand(fallbackMethod = "getDefaultRecommendations")
public List<Movie> getPersonalizedRecommendations(String userId) {
    return recommendationService.getRecommendations(userId);
}

// Fallback when service fails
public List<Movie> getDefaultRecommendations(String userId) {
    return popularMoviesCache.get();
}
```

### Phase 4: Chaos Engineering
**Innovation**: Intentionally break things to build resilience

**Chaos Monkey**: Randomly terminates instances
**Chaos Gorilla**: Simulates entire AWS region failure
**Chaos Kong**: Simulates multi-region failure

**Philosophy**: If it hasn't broken in production, you don't know if it works

## Architecture

### High-Level Architecture
```
                    ┌─────────────┐
                    │   Clients   │
                    │ (Web, Apps) │
                    └──────┬──────┘
                           │
                    ┌──────▼───────┐
                    │   Zuul API   │
                    │   Gateway    │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼────┐  ┌─────▼─────┐  ┌────▼────┐
    │Playback    │  │Recommend  │  │ Billing │
    │Service     │  │Service    │  │ Service │
    └───────┬────┘  └─────┬─────┘  └────┬────┘
            │              │              │
    ┌───────▼────┐  ┌─────▼─────┐  ┌────▼────┐
    │Video Cache │  │ML Models  │  │Payment  │
    │(Redis)     │  │(TensorFlow)│  │Gateway  │
    └────────────┘  └───────────┘  └─────────┘
```

### Key Components

1. **Zuul (API Gateway)**
   - Request routing
   - Authentication/authorization
   - Rate limiting
   - Load balancing

2. **Eureka (Service Discovery)**
   - Service registration
   - Health checks
   - Load-balanced client
   - Failover support

3. **Hystrix (Circuit Breaker)**
   - Fault tolerance
   - Fallback mechanisms
   - Real-time metrics
   - Request collapsing

4. **Ribbon (Client-Side Load Balancer)**
   - Service-to-service communication
   - Multiple load balancing algorithms
   - Integration with Eureka

5. **Archaius (Configuration Management)**
   - Dynamic configuration
   - Property overrides
   - Environment-specific configs

## Key Decisions

### 1. Eventual Consistency Over ACID
**Decision**: Accept eventual consistency for better availability

**Reasoning**:
- CAP theorem: Can't have all three (Consistency, Availability, Partition tolerance)
- Chose AP over CP
- Video recommendations can be slightly stale
- Billing requires stronger consistency (different approach)

### 2. Cassandra for Data Storage
**Decision**: Use Cassandra as primary database

**Why Cassandra**:
- Linear scalability
- No single point of failure
- Multi-region replication
- Tunable consistency

**Trade-offs**:
- Eventually consistent
- No joins (denormalize data)
- Complex data modeling

### 3. Chaos Engineering
**Decision**: Break things on purpose in production

**Why**:
- Traditional testing insufficient at scale
- Build real resilience
- Continuous validation
- Cultural shift: embrace failure

### 4. Freedom & Responsibility
**Decision**: Let teams choose their own tech stack

**Why**:
- Innovation speed
- Team autonomy
- Best tool for the job

**Trade-offs**:
- Operational complexity
- Multiple technologies to support
- Knowledge silos

### 5. Shared Nothing Architecture
**Decision**: Each service owns its data

**Why**:
- Loose coupling
- Independent deployment
- Service autonomy
- Failure isolation

**Trade-offs**:
- Data duplication
- No database-level joins
- Distributed transactions complexity

## Results

### Metrics
- **Services**: 1000+ microservices
- **Deployments**: 4000+ per day
- **API Calls**: 200M+ per day
- **Data Processed**: 100+ PB
- **Availability**: 99.99%+ (4 nines)

### Business Impact
- Faster feature deployment (minutes vs weeks)
- Global expansion enabled
- Personalization at scale
- Cost optimization through elasticity

### Engineering Culture
- DevOps teams (you build it, you run it)
- Chaos engineering as standard practice
- Open-source contributions (Netflix OSS)
- Industry leadership in microservices

## Lessons Learned

### What Worked
1. **Gradual Migration**: Didn't rewrite everything at once
2. **API Gateway**: Single entry point simplified client integration
3. **Circuit Breakers**: Prevented cascade failures
4. **Chaos Engineering**: Built real resilience
5. **Service Autonomy**: Teams could move fast independently

### What Was Hard
1. **Distributed Tracing**: Hard to debug across services
2. **Data Consistency**: Eventual consistency increased complexity
3. **Service Discovery**: Network failures required careful handling
4. **Operational Complexity**: More services = more to manage
5. **Cultural Change**: Shift from monolith mindset took time

### What They'd Do Differently
1. **Start with Observability**: Built too late, retrofitted monitoring
2. **Contract Testing**: More investment in consumer-driven contracts
3. **Data Governance**: Better data management from the start
4. **Service Granularity**: Some services too fine-grained
5. **Documentation**: Kept documentation closer to code

## Related Concepts

- [Microservices Architecture](../02-architectures/microservices/README.md)
- [API Gateway Pattern](../02-architectures/api-design/README.md)
- [Circuit Breaker Pattern](../02-architectures/microservices/README.md#circuit-breaker)
- [Service Discovery](../02-architectures/microservices/README.md#service-discovery)
- [Event-Driven Architecture](../02-architectures/event-driven/README.md)
- [Eventual Consistency](../02-architectures/database-patterns/README.md)
- [Chaos Engineering](../06-infrastructure/monitoring/README.md)

## Further Reading

- [Netflix Tech Blog](https://netflixtechblog.com/)
- [Netflix OSS](https://netflix.github.io/)
- Mastering Chaos - Netflix Engineering Talk
- Building Microservices by Sam Newman (Netflix case study)

---

**Key Takeaway**: Microservices enable scalability and agility but require significant investment in tooling, culture, and operational excellence. Start simple, evolve gradually, and embrace failure as a learning opportunity.
