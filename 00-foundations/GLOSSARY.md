# Tech Stack Essentials Glossary

A comprehensive A-Z reference of technical terms used throughout this guide. Each term includes a clear definition and context for when you'll encounter it.

---

## A

**Abstraction**: Hiding complex implementation details behind a simpler interface. Like driving a car—you use the steering wheel and pedals without knowing how the engine works internally.

**Abstract Class**: Class that cannot be instantiated directly. Provides base functionality for other classes to inherit. See: [Design Patterns](../01-programming/design-patterns/README.md)

**Access Control**: Security mechanism determining what resources users can access and what actions they can perform. See: [Authentication & Authorization](../05-backend/authentication-authorization/README.md)

**Access Modifier**: Keyword defining visibility (public, private, protected). Controls encapsulation in object-oriented programming.

**Accessibility (A11y)**: Designing products usable by people with disabilities. WCAG guidelines provide standards. See: [Frontend Development](../04-frontend/README.md)

**ACID**: Properties guaranteeing database transaction reliability: Atomicity (all or nothing), Consistency (valid state), Isolation (transactions don't interfere), Durability (committed data persists). See: [Database Patterns](../02-architectures/database-patterns/README.md)

**Actor Model**: Concurrency pattern where actors are independent entities that communicate through message passing. Used in Akka and Erlang.

**Adapter Pattern**: Design pattern converting interface of class into another interface clients expect. Allows incompatible interfaces to work together.

**Aggregate (DDD)**: Cluster of domain objects treated as single unit for data changes. Has root entity and consistency boundary. See: [Domain-Driven Design](../03-methodologies/domain-driven-design/README.md)

**Aggregation (Database)**: Operation combining multiple values (SUM, AVG, COUNT, MAX, MIN). Used in SQL queries and analytics.

**Agile**: Development methodology emphasizing iterative progress, collaboration, and adaptability. Work is broken into short "sprints" (1-4 weeks) with regular feedback. See: [Agile & Scrum](../03-methodologies/agile-scrum/README.md)

**AJAX (Asynchronous JavaScript and XML)**: Technique for updating parts of web page without full reload. Uses XMLHttpRequest or Fetch API.

**Algorithm**: Step-by-step procedure for solving a problem or performing a computation. Like a recipe for cooking. See: [Data Structures & Algorithms](../00-foundations/data-structures-algorithms/README.md)

**ALB (Application Load Balancer)**: AWS load balancer operating at HTTP/HTTPS level. Routes requests based on content. See: [AWS](../07-cloud/aws/README.md)

**Anomaly Detection**: Identifying patterns in data that deviate from expected behavior. Used for fraud detection, system monitoring, quality control. See: [AI/ML](../09-ai-ml/ANOMALY_DETECTION.md)

**Anonymous Function**: Function without name. Lambda expressions or arrow functions in JavaScript.

**Anti-Pattern**: Common solution to problem that appears helpful but is actually ineffective or counterproductive.

**API (Application Programming Interface)**: Set of rules allowing software components to communicate. REST APIs use HTTP; GraphQL APIs use a query language. See: [REST APIs](../05-backend/rest-apis/README.md), [API Design](../02-architectures/api-design/README.md)

**API Gateway**: Entry point for client requests, routing to appropriate backend services. Handles authentication, rate limiting, request transformation. See: [Microservices](../02-architectures/microservices/README.md)

**API Key**: Unique identifier authenticating application or user for API access. Simpler than OAuth but less secure.

**Application Layer**: Top layer of OSI model. Protocols like HTTP, FTP, SMTP operate here. See: [Networking Basics](../00-foundations/networking-basics/README.md)

**Array**: Fixed-size collection of elements of the same type, stored contiguously in memory. Access by index is fast O(1). See: [Data Structures](../00-foundations/data-structures-algorithms/README.md)

**Artifact**: File produced by build process. Compiled code, Docker images, packages, JARs. See: [CI/CD](../06-infrastructure/cicd/README.md)

**Artificial Intelligence (AI)**: Computer systems performing tasks typically requiring human intelligence. Includes machine learning, natural language processing, computer vision. See: [AI/ML](../09-ai-ml/README.md)

**ASCII**: Character encoding standard using 7 bits. Represents 128 characters including English letters, digits, punctuation.

**Asynchronous**: Operations that don't block—program continues executing while waiting for result. Opposite of synchronous (wait for completion).

**Atomic Operation**: Operation completed entirely or not at all. No partial execution visible to other processes.

**AUC-ROC (Area Under Curve - Receiver Operating Characteristic)**: Metric measuring classification model performance. Higher is better (max 1.0).

**Authentication**: Verifying identity (who you are). Typically username/password, OAuth, or biometrics. See: [Authentication Patterns](../08-security/authentication-patterns/README.md)

**Authorization**: Verifying permissions (what you're allowed to do). Happens after authentication. See: [Authentication & Authorization](../05-backend/authentication-authorization/README.md)

**Auto-Scaling**: Automatically adjusting compute resources based on demand. Scales up under load, down when idle. See: [Cloud Computing](../07-cloud/README.md)

**Availability**: Proportion of time system is operational and accessible. Usually expressed as percentage (99.9% = "three nines").

**Availability Zone**: Isolated location within cloud region. Provides fault tolerance by distributing resources. See: [AWS](../07-cloud/aws/README.md)

**Azure**: Microsoft's cloud computing platform. Offers IaaS, PaaS, SaaS services. See: [Azure](../07-cloud/azure/README.md)

## B

**Backlog**: Prioritized list of work items in Agile methodology. Product backlog contains features; sprint backlog contains current sprint tasks. See: [Agile & Scrum](../03-methodologies/agile-scrum/README.md)

**Backpressure**: Mechanism controlling data flow when producer creates data faster than consumer processes it. Prevents system overload.

**Backward Compatibility**: New version works with data/interfaces from older version. Critical for API versioning.

**Bandwidth**: Maximum data transfer rate of network connection. Measured in bits per second (bps, Kbps, Mbps, Gbps).

**BASE**: Alternative to ACID for distributed databases: Basically Available, Soft state, Eventually consistent. Favors availability over consistency. See: [Database Patterns](../02-architectures/database-patterns/README.md)

**Bash**: Unix shell and command language. Default shell on most Linux systems.

**Batch Processing**: Processing data in large chunks at scheduled intervals. Contrast with stream processing (continuous). See: [Data Processing](../09-ai-ml/DATA_SCIENCE_FUNDAMENTALS.md)

**BDD (Behavior-Driven Development)**: Agile methodology using natural language to describe expected system behavior. Tests written in Given-When-Then format. See: [BDD](../03-methodologies/behaviour-driven-development/README.md)

**Backend**: Server-side of application—handles data processing, business logic, database interactions. Not visible to users. See: [Backend Development](../05-backend/README.md)

**Big O Notation**: Mathematical notation describing algorithm complexity. O(1) constant, O(n) linear, O(n²) quadratic. See: [Algorithms](../00-foundations/data-structures-algorithms/README.md)

**Binary**: Number system using only 0 and 1. Computers operate in binary at the hardware level. See: [How Computers Work](../00-foundations/how-computers-work/README.md)

**Binary Search**: Algorithm finding item in sorted array by repeatedly halving search space. O(log n) time complexity.

**Binary Tree**: Tree data structure where each node has at most two children. Basis for many efficient algorithms.

**Bit**: Smallest unit of data—single binary digit (0 or 1).

**Blockchain**: Distributed ledger technology where records (blocks) are linked cryptographically. Used for cryptocurrencies and immutable audit trails.

**Blue-Green Deployment**: Two identical production environments. Switch traffic between them for zero-downtime deploys. See: [CI/CD](../06-infrastructure/cicd/README.md)

**Boolean**: Data type with two values: true or false. Named after mathematician George Boole.

**Bootstrap**: Popular CSS framework providing responsive components. Speeds up frontend development.

**Bounded Context**: Central pattern in Domain-Driven Design defining boundary where specific model applies. See: [DDD](../03-methodologies/domain-driven-design/README.md)

**Branch**: Independent line of development in version control. Allows parallel work without conflicts.

**Breaking Change**: API or interface modification that breaks existing clients. Requires major version bump.

**Broker (Message)**: Middleware managing message queues and routing. Examples: RabbitMQ, Kafka. See: [Message Queues](../05-backend/message-queues/README.md)

**Browser**: Application for accessing and displaying web pages. Examples: Chrome, Firefox, Safari.

**Bucket**: Container for storing objects in cloud storage. Used in AWS S3, Google Cloud Storage.

**Bug**: Error or flaw in software causing incorrect behavior. Requires debugging to fix.

**Builder Pattern**: Design pattern separating object construction from representation. Allows step-by-step object creation.

**Build Tool**: Software automating compilation, testing, packaging. Examples: Maven, Gradle, Webpack, Make.

**Byte**: Unit of data containing 8 bits. Can represent 256 different values (0-255).

## C

**C++**: General-purpose programming language. Extension of C with object-oriented features. Used for systems programming, games.

**Cache**: Temporary storage for frequently accessed data to improve performance. RAM cache is faster than disk; CDN cache is closer to users. See: [Caching](../02-architectures/caching/README.md)

**Cache Aside (Lazy Loading)**: Caching pattern where application loads data into cache on demand. Cache checked first, then database.

**Cache Eviction**: Removing items from cache to make room for new ones. Policies: LRU (Least Recently Used), LFU (Least Frequently Used), FIFO.

**Cache Hit**: Requested data found in cache. Fast retrieval without accessing slower storage.

**Cache Miss**: Requested data not in cache. Must fetch from slower storage.

**Cache Stampede**: Multiple requests simultaneously trying to regenerate same expired cache entry. Can overwhelm database.

**Callback**: Function passed as argument to another function. Executed after operation completes. Common in asynchronous programming.

**Canary Deployment**: Gradual rollout to subset of users. Monitor before full deployment. See: [CI/CD](../06-infrastructure/cicd/README.md)

**CAP Theorem**: Distributed systems can guarantee only two of: Consistency, Availability, Partition tolerance. See: [Database Patterns](../02-architectures/database-patterns/README.md)

**CDN (Content Delivery Network)**: Distributed servers delivering content based on user location. Reduces latency. Examples: CloudFlare, Akamai.

**Certificate**: Digital document proving ownership of public key. Used in HTTPS (SSL/TLS certificates).

**Chain of Responsibility**: Design pattern passing request along chain of handlers. Each handler decides to process or pass to next.

**Chaos Engineering**: Practice of intentionally injecting failures to test system resilience. Tools: Chaos Monkey, Gremlin.

**Checksum**: Small piece of data derived from larger data block for detecting errors. Used to verify data integrity.

**choreography**: Decentralized coordination where each service produces/consumes events independently. Opposite of orchestration. See: [Saga Pattern](../02-architectures/saga-pattern/README.md)

**CI/CD (Continuous Integration/Continuous Deployment)**: Automated pipeline for building, testing, and deploying code. Changes go from development to production quickly and safely. See: [CI/CD](../06-infrastructure/cicd/README.md)

**Circuit Breaker**: Design pattern preventing cascading failures. Stops requests to failing service, retries after cooldown. See: [Microservices](../02-architectures/microservices/README.md)

**Class**: Blueprint for creating objects in object-oriented programming. Defines properties and methods objects will have.

**CLI (Command Line Interface)**: Text-based interface for interacting with programs. Contrast with GUI.

**Client**: Program or device that requests services from a server. Web browser is a client requesting pages from web servers.

**Client-Side Rendering (CSR)**: JavaScript renders HTML in browser. Contrast with server-side rendering.

**Closure**: Function accessing variables from outer scope even after outer function returns. Common in JavaScript.

**Cloud Computing**: Delivery of computing services (servers, storage, databases, networking) over the internet. Pay-as-you-go model. See: [Cloud](../07-cloud/README.md)

**Cloud Native**: Applications designed specifically for cloud environments. Containerized, dynamically orchestrated, microservices-based.

**Cluster**: Group of connected computers working together as single system. Provides high availability and scalability.

**CMS (Content Management System)**: Software for creating and managing digital content. Examples: WordPress, Drupal, Contentful.

**Code Review**: Systematic examination of source code by peers. Improves quality and knowledge sharing.

**Code Smell**: Indicator of potential problem in code. Not bug, but suggests refactoring needed.

**Cohesion**: Degree to which elements within module belong together. High cohesion is desirable.

**Column-Oriented Database**: Database storing data by columns rather than rows. Efficient for analytics. Examples: Cassandra, ClickHouse.

**Command (CQRS)**: Request to change system state. Named imperatively (CreateOrder, UpdateUser). See: [CQRS](../02-architectures/cqrs/README.md)

**Command Pattern**: Design pattern encapsulating request as object. Allows queuing, logging, undo operations.

**Commit**: Saving changes to version control repository. Creates permanent record in history.

**Compensating Transaction**: Transaction semantically undoing previous transaction. Used in Saga pattern for distributed rollback. See: [Saga Pattern](../02-architectures/saga-pattern/README.md)

**Compiler**: Program that translates source code (human-readable) into machine code (executable). Java, C++ use compilers.

**Complexity**: Measure of resources (time, space) algorithm requires. Expressed in Big O notation.

**Component**: Self-contained, reusable piece of software with defined interface. In UI, reusable building block.

**Composition**: Combining simple objects/functions to build complex ones. Alternative to inheritance.

**Compression**: Reducing data size for storage or transmission. Lossless (perfect reconstruction) or lossy (approximate).

**Computer Vision**: AI field enabling computers to interpret visual information. Used for image recognition, object detection. See: [AI/ML](../09-ai-ml/README.md)

**Concurrency**: Multiple tasks making progress simultaneously. May or may not execute at exact same time (see Parallelism).

**ConfigMap**: Kubernetes object storing non-confidential configuration data as key-value pairs. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Configuration Management**: Automating and tracking system configurations. Tools: Ansible, Puppet, Chef. See: [Infrastructure](../06-infrastructure/README.md)

**Connection Pool**: Set of reusable database connections. Avoids overhead of creating new connection for each request.

**Consistency**: Database property ensuring data remains valid according to rules. In distributed systems, all nodes see same data.

**Constructor**: Special method called when creating object. Initializes object state.

**Container**: Lightweight, standalone package containing application and all dependencies. Docker containers are portable across environments. See: [Docker](../06-infrastructure/docker/README.md)

**Container Orchestration**: Automated deployment, scaling, and management of containers. Kubernetes is primary tool. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Content Security Policy (CSP)**: Security standard preventing XSS attacks. Specifies trusted content sources. See: [OWASP](../08-security/owasp-top-10/README.md)

**Context Switching**: Process of storing and restoring state when switching between processes/threads. Has performance cost.

**Continuous Delivery**: Extension of CI where code can be deployed to production at any time. Manual approval before deploy.

**Continuous Deployment**: Further extension where every change passing tests automatically deploys to production. No manual approval.

**Continuous Integration (CI)**: Practice of frequently merging code changes into shared repository. Automated builds and tests. See: [CI/CD](../06-infrastructure/cicd/README.md)

**Controller**: Component handling user input and coordinating model/view in MVC pattern. In Kubernetes, manages resource state.

**Cookie**: Small text file stored by browser, sent with HTTP requests. Used for session management, personalization, tracking.

**CORS (Cross-Origin Resource Sharing)**: Security mechanism allowing/restricting web pages to request resources from different domains. See: [Security](../08-security/README.md)

**Correlation ID**: Unique identifier tracking request across distributed services. Essential for debugging. Also called Trace ID.

**Coupling**: Degree of interdependence between modules. Low coupling is desirable.

**CPU (Central Processing Unit)**: Brain of computer executing instructions. Clock speed measured in GHz.

**CQRS (Command Query Responsibility Segregation)**: Pattern separating read operations (queries) from write operations (commands). Uses different models for each. See: [CQRS](../02-architectures/cqrs/README.md)

**Cron**: Time-based job scheduler in Unix. Used for running periodic tasks.

**CRUD**: Basic database operations: Create, Read, Update, Delete. Foundation of most applications.

**CSRF (Cross-Site Request Forgery)**: Attack forcing user to execute unwanted actions on authenticated site. Prevented by CSRF tokens. See: [OWASP](../08-security/owasp-top-10/README.md)

**CSS (Cascading Style Sheets)**: Language for styling HTML documents—colors, layouts, fonts, spacing. See: [HTML & CSS](../04-frontend/html-css/README.md)

**CSV (Comma-Separated Values)**: Simple file format storing tabular data. Each line is row, commas separate columns.

**Cyclomatic Complexity**: Metric measuring number of independent paths through code. Higher values indicate complex code.

## D

**Daemon**: Background process running without user interaction. Examples: web servers, database servers.

**DAG (Directed Acyclic Graph)**: Graph with directed edges and no cycles. Used in Git commits, task scheduling, data pipelines.

**Data Class**: Class primarily holding data with minimal behavior. Often generated automatically.

**Data Lake**: Storage repository holding vast amounts of raw data in native format. Used for big data analytics.

**Data Pipeline**: Series of data processing steps. Extract, transform, load (ETL) is common pattern. See: [Data Science](../09-ai-ml/DATA_SCIENCE_FUNDAMENTALS.md)

**Data Science**: Field extracting insights from data using statistics, machine learning, visualization. See: [Data Science Fundamentals](../09-ai-ml/DATA_SCIENCE_FUNDAMENTALS.md)

**Data Structure**: Way of organizing data for efficient access and modification. Examples: arrays, lists, trees, hash tables. See: [Data Structures](../00-foundations/data-structures-algorithms/README.md)

**Data Warehouse**: Central repository of integrated data from multiple sources. Optimized for analysis and reporting.

**Database**: Organized collection of structured data. Relational (SQL) use tables; NoSQL use various models. See: [Databases](../05-backend/databases/README.md)

**Database Index**: Data structure improving query speed. Like book index—direct lookup instead of scanning all pages.

**Database Migration**: Process of changing database schema. Tools: Flyway, Liquibase, Alembic.

**Databricks**: Unified analytics platform built on Apache Spark. Used for big data processing and ML. See: [AI/ML](../09-ai-ml/README.md)

**Dead Letter Queue**: Queue storing messages that couldn't be processed. Allows retry or manual inspection.

**Deadlock**: Situation where two or more processes wait for each other indefinitely. Requires careful resource management.

**Debugging**: Process of finding and fixing bugs in code. Uses debuggers, logging, print statements.

**Declarative Programming**: Describing what result you want, not how to achieve it. SQL, HTML, Terraform are declarative.

**Decorator Pattern**: Design pattern attaching additional responsibilities to object dynamically. Flexible alternative to subclassing.

**Deep Learning**: Subset of machine learning using neural networks with many layers. Used for image recognition, NLP. See: [AI/ML](../09-ai-ml/README.md)

**Denial of Service (DoS)**: Attack making system unavailable by overwhelming it. DDoS uses multiple sources.

**Denormalization**: Intentionally introducing redundancy to improve read performance. Trade-off for data consistency.

**Dependency**: External library or module that software relies on. Managed by package managers.

**Dependency Injection**: Design pattern providing object's dependencies from outside. Improves testability. See: [Design Patterns](../01-programming/design-patterns/README.md)

**Deployment**: Process of making application available to users. Can be manual or automated (CI/CD). See: [CI/CD](../06-infrastructure/cicd/README.md)

**Deployment Pipeline**: Automated sequence of steps from code commit to production. Build, test, deploy stages.

**Deserialization**: Converting data from storage/transmission format back to objects. Reverse of serialization.

**Destructor**: Method called when object is destroyed. Cleans up resources (files, connections).

**DevOps**: Practices combining development and operations—automation, collaboration, continuous improvement. See: [DevOps Culture](../03-methodologies/devops-culture/README.md)

**DHCP (Dynamic Host Configuration Protocol)**: Automatically assigns IP addresses to devices on network. See: [Networking](../00-foundations/networking-basics/README.md)

**Diff**: Tool showing differences between two files or versions. Used in version control.

**Digital Signature**: Cryptographic technique proving authenticity and integrity of message. Uses public-key cryptography.

**Distributed System**: System with components on different networked computers. Communicates and coordinates actions.

**Distributed Tracing**: Tracking request as it flows through distributed system. Tools: Jaeger, Zipkin.

**DNS (Domain Name System)**: Translates domain names (example.com) to IP addresses (93.184.216.34). See: [How Internet Works](../00-foundations/how-internet-works/README.md)

**Docker**: Platform for developing, shipping, and running applications in containers. See: [Docker](../06-infrastructure/docker/README.md)

**Dockerfile**: Text file with instructions for building Docker image. Specifies base image, dependencies, commands.

**Docker Compose**: Tool for defining and running multi-container Docker applications. Uses YAML configuration.

**Docker Image**: Read-only template for creating containers. Contains application and all dependencies.

**Document Database**: NoSQL database storing data as documents (usually JSON). Examples: MongoDB, CouchDB.

**DOM (Document Object Model)**: Tree structure representing HTML document. JavaScript manipulates DOM to change page content. See: [JavaScript](../04-frontend/javascript/README.md)

**Domain**: Sphere of knowledge or activity. In DDD, the problem space the software addresses.

**Domain Event**: Something significant that happened in domain. Past tense (OrderPlaced, UserRegistered). See: [Event Sourcing](../02-architectures/event-sourcing/README.md)

**Domain Model**: Object model of domain incorporating behavior and data. Central to DDD. See: [DDD](../03-methodologies/domain-driven-design/README.md)

**Domain-Driven Design (DDD)**: Approach connecting software implementation to evolving business model. See: [DDD](../03-methodologies/domain-driven-design/README.md)

**DTO (Data Transfer Object)**: Object carrying data between processes. No business logic, just data.

**Duck Typing**: Type system where object's methods/properties determine compatibility. "If it walks like duck and quacks like duck, it's duck."

**Durability**: Database property ensuring committed transactions persist even after system failure. Part of ACID.

**Dynamic Typing**: Type checking at runtime. Variables can hold any type. Python, JavaScript use dynamic typing.

## E

**EC2 (Elastic Compute Cloud)**: AWS service providing resizable virtual servers. Core compute service. See: [AWS](../07-cloud/aws/README.md)

**Edge Case**: Unusual or extreme situation that might cause software to fail. Important to test.

**Edge Computing**: Processing data near source rather than centralized cloud. Reduces latency for IoT.

**EKS (Elastic Kubernetes Service)**: AWS managed Kubernetes service. Simplifies cluster management. See: [AWS](../07-cloud/aws/README.md)

**Elastic**: Ability to scale resources up or down based on need. Key cloud computing benefit.

**Elasticsearch**: Distributed search and analytics engine. Used for log analytics, full-text search. Based on Lucene.

**Encryption**: Converting data into coded form to prevent unauthorized access. Decryption reverses the process with key. See: [Security](../08-security/README.md)

**Endpoint**: URL where API can access resources. Example: `https://api.example.com/users/123`. See: [REST APIs](../05-backend/rest-apis/README.md)

**Entity**: Object with distinct identity that persists over time. In DDD, has continuous thread through lifecycle.

**Entity Framework**: ORM for .NET. Enables database operations using .NET objects.

**Environment**: Set of configurations and resources for running application. Common: development, staging, production.

**Environment Variable**: Dynamic value outside code affecting program behavior. Used for configuration (database URLs, API keys).

**Ephemeral Storage**: Temporary storage deleted when instance stops. Opposite of persistent.

**Error Handling**: Code that responds to errors gracefully—try/catch blocks, validation, fallbacks.

**ESB (Enterprise Service Bus)**: Middleware routing messages between services. Traditional approach before microservices.

**ETL (Extract, Transform, Load)**: Process of moving data from sources to warehouse. Transform applies business logic.

**etcd**: Distributed key-value store for configuration data. Used by Kubernetes for cluster state. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Eureka**: Service discovery tool for microservices. Developed by Netflix.

**Event**: Action or occurrence detected by program—user click, timer expiration, data arrival. See: [Event-Driven Architecture](../02-architectures/event-driven/README.md)

**Event Bus**: Infrastructure routing events from publishers to subscribers. Decouples components. See: [Event-Driven](../02-architectures/event-driven/README.md)

**Event Loop**: Programming construct waiting for and dispatching events. Foundation of asynchronous programming in JavaScript.

**Event Sourcing**: Pattern storing all changes as sequence of events. Current state derived by replaying events. See: [Event Sourcing](../02-architectures/event-sourcing/README.md)

**Event Store**: Database storing events. Append-only, maintains complete history. See: [Event Sourcing](../02-architectures/event-sourcing/README.md)

**Event-Driven Architecture (EDA)**: Design where flow determined by events. Components communicate asynchronously through events. See: [Event-Driven](../02-architectures/event-driven/README.md)

**Eventual Consistency**: Consistency model where system eventually converges to consistent state. Immediate consistency not guaranteed.

**Exception**: Error that disrupts normal program flow. Can be caught and handled to prevent crashes.

**Expression**: Combination of values, variables, operators evaluating to single value. Contrast with statement.

## F

**Facade Pattern**: Design pattern providing simplified interface to complex subsystem. Hides complexity.

**Factory Pattern**: Design pattern creating objects without specifying exact class. See: [Design Patterns](../01-programming/design-patterns/README.md)

**Failover**: Switching to backup system when primary fails. Ensures high availability.

**Fault Tolerance**: System's ability to continue operating despite failures. Built through redundancy, replication.

**Feature Flag**: Technique enabling/disabling features without deploying code. Allows gradual rollout, A/B testing.

**Feature Store**: Centralized repository for ML features. Ensures consistency between training and serving. See: [MLOps](../09-ai-ml/MLOPS_GUIDE.md)

**Fetch API**: Modern browser API for making HTTP requests. Replaces XMLHttpRequest. See: [JavaScript](../04-frontend/javascript/README.md)

**FIFO (First In, First Out)**: Data structure or queue ordering. First item added is first removed.

**Firewall**: Security system controlling incoming/outgoing network traffic based on rules. Blocks unauthorized access. See: [Security](../08-security/README.md)

**Foreign Key**: Column referencing primary key in another table. Enforces relationships in relational databases.

**Fork**: Creating independent copy of repository. Allows development without affecting original.

**Framework**: Pre-built structure providing foundation for building applications. Includes libraries, tools, conventions. See: [Frontend](../04-frontend/README.md), [Backend](../05-backend/README.md)

**Frontend**: Client-side of application—what users see and interact with. HTML, CSS, JavaScript. See: [Frontend Development](../04-frontend/README.md)

**FTP (File Transfer Protocol)**: Standard protocol for transferring files over network. SFTP/FTPS add security.

**Full-Stack**: Developer working on both frontend and backend. Understands entire application stack.

**Function**: Reusable block of code performing specific task. Takes inputs (parameters), returns output.

**Functional Programming**: Programming paradigm treating computation as evaluation of mathematical functions. Emphasizes immutability and pure functions. See: [OOP vs Functional](../01-programming/oop-vs-functional/README.md)

**Fuzzy Matching**: Technique finding strings approximately matching pattern. Used in search, autocomplete.

## G

**Garbage Collection**: Automatic memory management—reclaims memory from objects no longer needed. Java, Python, JavaScript use GC.

**Gateway**: Node routing traffic between networks. API gateway routes requests to appropriate microservices. See: [Microservices](../02-architectures/microservices/README.md)

**GCP (Google Cloud Platform)**: Google's cloud computing platform. Offers compute, storage, ML services. See: [GCP](../07-cloud/gcp/README.md)

**Generator**: Function returning iterator. Produces values lazily (one at a time). Uses yield in Python.

**Git**: Distributed version control system tracking code changes. Enables collaboration and history. See: [DevOps](../03-methodologies/devops-culture/README.md)

**GitHub**: Web-based platform for hosting Git repositories. Adds collaboration features (pull requests, issues, actions).

**GitHub Actions**: CI/CD service integrated with GitHub. Automates workflows using YAML configuration. See: [CI/CD](../06-infrastructure/cicd/README.md)

**GitLab**: Web-based Git repository manager with integrated CI/CD. Alternative to GitHub.

**GitOps**: Practice of using Git as single source of truth for infrastructure and application code. Deployments via Git commits.

**Global Variable**: Variable accessible from anywhere in program. Generally discouraged due to coupling.

**Go (Golang)**: Programming language designed by Google. Known for simplicity, concurrency, performance.

**Graceful Degradation**: Design approach where system continues functioning at reduced level when parts fail.

**Grafana**: Visualization and analytics platform. Creates dashboards from metrics. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Graph Database**: Database using graph structures with nodes, edges, properties. Excellent for relationships. Example: Neo4j.

**GraphQL**: Query language for APIs allowing clients to request exactly data they need. Alternative to REST. See: [GraphQL](../02-architectures/graphql/README.md)

**Grep**: Command-line tool searching text using patterns. Essential Unix utility.

**gRPC**: High-performance RPC framework using Protocol Buffers. Faster than REST for service-to-service communication.

**GUI (Graphical User Interface)**: Visual interface with windows, buttons, menus. Contrast with CLI.

## H

**HAProxy**: High-performance load balancer and proxy. Often used in microservices architectures.

**Hardware**: Physical components of computer. CPU, RAM, disk, etc.

**Hash Function**: Function mapping data of arbitrary size to fixed-size value. Used for data integrity, passwords, indexing. See: [Security](../08-security/README.md)

**Hash Table**: Data structure using hash function to map keys to values. Fast O(1) average lookup. Also called hash map, dictionary.

**Hashing**: Applying hash function to data. One-way transformation—cannot reverse to get original.

**Head**: Reference to most recent commit in current branch. In HTTP, request method retrieving headers only.

**Health Check**: Monitoring endpoint verifying service is operational. Used by load balancers. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Heap**: Region of memory for dynamic allocation. Objects created at runtime stored here. Also: tree-based data structure.

**Helm**: Package manager for Kubernetes. Uses charts to define, install, upgrade applications. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Heroku**: Cloud platform as a service (PaaS). Simplifies deployment for web applications.

**Hexadecimal**: Base-16 number system (0-9, A-F). Compact representation of binary. Used for colors (#FF5733), memory addresses.

**Higher-Order Function**: Function taking or returning functions. Enables functional programming patterns.

**HIPAA**: US law protecting medical information. Strict compliance requirements for healthcare apps. See: [Compliance](../08-security/compliance/README.md)

**HMAC (Hash-based Message Authentication Code)**: Cryptographic authentication verifying message integrity and authenticity. Uses hash function with secret key.

**Horizontal Scaling**: Adding more machines to handle load. Scale out. Better for distributed systems.

**Hot Reload**: Development feature automatically updating application when code changes. No manual restart.

**HTML (HyperText Markup Language)**: Standard markup language for web pages. Defines structure and content. See: [HTML & CSS](../04-frontend/html-css/README.md)

**HTTP (HyperText Transfer Protocol)**: Protocol for transmitting web pages and data. Foundation of the web. See: [How Internet Works](../00-foundations/how-internet-works/README.md)

**HTTP Methods**: Verbs indicating desired action. GET (retrieve), POST (create), PUT (update), PATCH (partial update), DELETE (remove).

**HTTP Status Code**: Three-digit code indicating request result. 2xx success, 3xx redirect, 4xx client error, 5xx server error.

**HTTPS (HTTP Secure)**: Encrypted version of HTTP using TLS/SSL. Protects data in transit. See: [Security](../08-security/README.md)

**Hybrid Cloud**: Computing environment combining on-premises infrastructure with public cloud. Provides flexibility.

**Hypervisor**: Software creating and running virtual machines. Type 1 (bare metal) or Type 2 (hosted).

## I

**IaaS (Infrastructure as a Service)**: Cloud computing model providing virtualized resources. Examples: AWS EC2, Azure VMs. See: [Cloud](../07-cloud/README.md)

**IaC (Infrastructure as Code)**: Managing infrastructure through code. Version controlled, reproducible. Tools: Terraform, CloudFormation. See: [Terraform](../06-infrastructure/terraform/README.md)

**IDE (Integrated Development Environment)**: Software application for coding—editor, debugger, compiler in one tool. Examples: VS Code, IntelliJ, Eclipse.

**Idempotent**: Operation that produces same result when executed multiple times. Important for retry logic. See: [API Design](../02-architectures/api-design/README.md)

**IDOR (Insecure Direct Object Reference)**: Vulnerability exposing internal objects. Example: changing ID in URL to access others' data. See: [OWASP](../08-security/owasp-top-10/README.md)

**Immutable**: Cannot be modified after creation. Immutable objects are safer in concurrent environments.

**Immutable Infrastructure**: Servers never modified after deployment. Replace instead of update. See: [Infrastructure](../06-infrastructure/README.md)

**Imperative Programming**: Describing how to achieve result through explicit statements. C, Java are primarily imperative.

**Implicit Conversion**: Automatic type conversion by compiler/interpreter. Also called type coercion.

**Import**: Including code from another module or file. Makes functionality available.

**Index (Database)**: Database structure improving query speed. Trade-off: faster reads, slower writes. See: [Databases](../05-backend/databases/README.md)

**Inference**: Using trained ML model to make predictions on new data. See: [AI/ML](../09-ai-ml/README.md)

**Infrastructure**: Hardware and software supporting application operations. Servers, networks, databases.

**Ingress**: Object managing external access to Kubernetes services. Provides load balancing, SSL. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Inheritance**: Object-oriented concept where class inherits properties and methods from parent class. See: [OOP](../01-programming/oop-vs-functional/README.md)

**Injection**: Security vulnerability where untrusted data executed as code. SQL injection is most common. See: [OWASP](../08-security/owasp-top-10/README.md)

**Input Validation**: Verifying user input meets expected format. Critical security practice. See: [Security](../08-security/README.md)

**Integration Test**: Test verifying multiple components work together correctly. Broader than unit tests.

**Interface**: Contract defining methods a class must implement. Enables polymorphism and abstraction.

**Internet**: Global network of interconnected computers. Uses TCP/IP protocol suite. See: [How Internet Works](../00-foundations/how-internet-works/README.md)

**Interpreter**: Program executing code directly without prior compilation. Python, JavaScript use interpreters.

**IP Address**: Numerical label identifying device on network. IPv4 (32-bit) or IPv6 (128-bit). See: [Networking](../00-foundations/networking-basics/README.md)

**IPv4**: Internet Protocol version 4—32-bit addresses (e.g., 192.168.1.1). ~4.3 billion addresses.

**IPv6**: Internet Protocol version 6—128-bit addresses. 340 undecillion addresses (practically unlimited).

**Isolation**: Database property ensuring concurrent transactions don't interfere. Part of ACID. See: [Database Patterns](../02-architectures/database-patterns/README.md)

**Istio**: Service mesh providing traffic management, security, observability for microservices. See: [Microservices](../02-architectures/microservices/README.md)

**Iteration**: Single pass through loop. Also: development cycle in Agile.

**Iterator**: Object enabling traversal through collection. Implements next() method.

## J

**Java**: Object-oriented programming language. Known for "write once, run anywhere" via JVM. See: [Languages](../01-programming/languages-overview/README.md)

**JavaScript**: Programming language for web browsers. Also used server-side (Node.js). See: [JavaScript](../04-frontend/javascript/README.md)

**Jenkins**: Open-source automation server for CI/CD. Widely used despite newer alternatives. See: [CI/CD](../06-infrastructure/cicd/README.md)

**JIT (Just-In-Time)**: Compilation during execution rather than before. Balances interpreted vs compiled benefits.

**Join**: Combining rows from multiple tables based on related columns. Types: INNER, LEFT, RIGHT, FULL OUTER.

**JSON (JavaScript Object Notation)**: Lightweight data interchange format. Human-readable, language-independent. Common in APIs. See: [REST APIs](../05-backend/rest-apis/README.md)

**JSON Schema**: Standard for describing structure of JSON data. Used for validation.

**JWT (JSON Web Token)**: Compact, URL-safe means of representing claims between parties. Used for authentication. See: [Authentication](../08-security/authentication-patterns/README.md)

**JVM (Java Virtual Machine)**: Virtual machine executing Java bytecode. Enables platform independence.

## K

**Kafka**: Distributed streaming platform. Used for building real-time data pipelines and streaming applications. See: [Message Queues](../05-backend/message-queues/README.md)

**Key-Value Store**: Database storing data as key-value pairs. Fast lookups. Examples: Redis, DynamoDB. See: [Databases](../05-backend/databases/README.md)

**Kubernetes (K8s)**: Open-source platform for automating containerized application deployment, scaling, and management. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**kubectl**: Command-line tool for interacting with Kubernetes clusters. Manages resources, deploys applications.

**kubelet**: Agent running on each Kubernetes node. Ensures containers are running in pods.

## L

**Lambda**: Anonymous function. In AWS, serverless compute service executing code in response to events. See: [Serverless](../02-architectures/serverless/README.md)

**Lambda Architecture**: Data processing architecture combining batch and stream processing for comprehensive analysis.

**LAN (Local Area Network)**: Network covering small area like office or home. Devices connected via Ethernet or Wi-Fi.

**Latency**: Time delay between action and response. Network latency is round-trip time. Lower is better. See: [Performance](../02-architectures/system-design-concepts/README.md)

**Lazy Loading**: Deferring loading of resources until needed. Improves initial page load.

**LDAP (Lightweight Directory Access Protocol)**: Protocol for accessing and maintaining distributed directory services. Used for authentication.

**Leader Election**: Process of designating single node as coordinator in distributed system. Prevents conflicts.

**Least Privilege**: Security principle giving users minimum access needed. Reduces attack surface.

**Library**: Collection of reusable code (functions, classes) for common tasks. Imported into programs. See: [Programming](../01-programming/README.md)

**Linter**: Tool analyzing code for potential errors and style violations. Examples: ESLint, Pylint.

**Linked List**: Data structure where elements (nodes) contain data and reference to next node. Dynamic size.

**Linux**: Open-source Unix-like operating system. Dominant in servers and cloud. See: [Infrastructure](../06-infrastructure/README.md)

**Liskov Substitution Principle**: Objects of superclass should be replaceable with objects of subclass. SOLID principle.

**Load Balancer**: Distributes incoming traffic across multiple servers. Improves performance and availability. See: [System Design](../02-architectures/system-design-concepts/README.md)

**Load Testing**: Testing system behavior under expected load. Identifies performance bottlenecks.

**Local Storage**: Browser API for storing data persistently. Larger capacity than cookies. See: [JavaScript](../04-frontend/javascript/README.md)

**Localhost**: Hostname referring to current computer (127.0.0.1). Used for local development.

**Lock**: Synchronization mechanism preventing concurrent access to shared resource. Prevents race conditions.

**Log**: Record of events in system—errors, warnings, informational messages. Essential for debugging and monitoring. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Log Aggregation**: Collecting logs from multiple sources into central location. Tools: ELK stack, Splunk.

**Logging Level**: Severity of log message. DEBUG, INFO, WARN, ERROR, FATAL.

**Loop**: Programming construct repeating code multiple times. For loops (fixed iterations), while loops (condition-based).

**Loose Coupling**: Components with minimal dependencies on each other. Makes system more flexible, maintainable.

**LRU (Least Recently Used)**: Cache eviction policy removing least recently accessed items first.

## M

**MAC Address (Media Access Control)**: Hardware address uniquely identifying network interface. 48-bit number (e.g., 00:1A:2B:3C:4D:5E).

**Machine Learning (ML)**: Subset of AI where systems learn from data without explicit programming. Used for predictions, classifications, recommendations. See: [AI/ML](../09-ai-ml/README.md)

**Man-in-the-Middle (MitM)**: Attack intercepting communication between two parties. Prevented by encryption. See: [Security](../08-security/README.md)

**Manifest**: File describing application and dependencies. Examples: package.json, requirements.txt, Dockerfile.

**MapReduce**: Programming model for processing large datasets in parallel. Popularized by Hadoop.

**Marshalling**: Converting object to format suitable for storage or transmission. Similar to serialization.

**Master-Slave Replication**: Database replication where master handles writes, slaves handle reads. Improves read scalability.

**Memoization**: Optimization caching function results. Improves performance for expensive operations.

**Memory Leak**: Bug where program doesn't release unused memory. Eventually exhausts available memory.

**Merge**: Combining changes from different branches. Creates new commit with multiple parents.

**Message Broker**: Middleware managing message queues and routing. Examples: RabbitMQ, Kafka. See: [Message Queues](../05-backend/message-queues/README.md)

**Message Queue**: Asynchronous communication pattern. Producers send messages, consumers process them. Decouples components. See: [Message Queues](../05-backend/message-queues/README.md)

**Metadata**: Data about data. Examples: file creation date, image EXIF data, database schema.

**Method**: Function belonging to class or object. Called on instances. See: [OOP](../01-programming/oop-vs-functional/README.md)

**Metric**: Quantitative measurement tracked over time. Examples: CPU usage, request rate, error count. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Microservices**: Architecture style structuring application as collection of small, independent services. Opposite of monolith. See: [Microservices](../02-architectures/microservices/README.md)

**Middleware**: Software connecting applications or components. Intercepts requests/responses to add functionality (logging, authentication). See: [Backend](../05-backend/README.md)

**Migration (Database)**: Process of changing database schema. Tools: Flyway, Liquibase, Alembic.

**Minification**: Removing unnecessary characters from code. Reduces file size for production.

**Mixin**: Class providing methods to other classes through inheritance. Adds functionality without being base class.

**ML Pipeline**: Series of automated steps for training ML models. Data prep, training, evaluation, deployment. See: [MLOps](../09-ai-ml/MLOPS_GUIDE.md)

**MLOps**: Practices applying DevOps principles to machine learning. Automates ML lifecycle. See: [MLOps](../09-ai-ml/MLOPS_GUIDE.md)

**Mock**: Simulated object replacing real one in tests. Controls behavior and verifies interactions.

**Model (ML)**: Mathematical representation learned from data. Makes predictions on new inputs. See: [AI/ML](../09-ai-ml/README.md)

**Model (MVC)**: Component managing data and business logic in MVC pattern. Notifies views of changes.

**Model Drift**: ML model performance degrading over time as data distribution changes. Requires monitoring. See: [MLOps](../09-ai-ml/MLOPS_GUIDE.md)

**Module**: Self-contained unit of code. File or group of related functions/classes.

**Monolith**: Application where all components are tightly coupled in single codebase. Simpler but harder to scale. See: [Microservices](../02-architectures/microservices/README.md)

**Monorepo**: Single repository containing multiple projects. Simplifies code sharing and versioning. See: [Monorepo](../02-architectures/monorepo/README.md)

**Multi-Tenancy**: Single instance serving multiple customers (tenants). Resources shared. See: [SaaS](../10-domain-examples/README.md)

**Mutex (Mutual Exclusion)**: Synchronization primitive preventing multiple threads from accessing shared resource simultaneously.

**MVC (Model-View-Controller)**: Architectural pattern separating application into three components. UI logic, business logic, presentation.

**MVVM (Model-View-ViewModel)**: Variation of MVC. ViewModel mediates between View and Model. Used in WPF, Angular.

## N

**Namespace**: Container organizing code elements (classes, functions) to avoid naming conflicts. Examples: packages in Java, modules in Python.

**NAT (Network Address Translation)**: Technique mapping private IP addresses to public IP. Allows many devices to share one public IP. See: [Networking](../00-foundations/networking-basics/README.md)

**Natural Language Processing (NLP)**: AI field enabling computers to understand human language. Used for chatbots, translation, sentiment analysis. See: [AI/ML](../09-ai-ml/README.md)

**Neural Network**: Computing system inspired by biological neural networks. Foundation of deep learning. See: [AI/ML](../09-ai-ml/README.md)

**NGINX**: High-performance web server and reverse proxy. Often used as load balancer. See: [Infrastructure](../06-infrastructure/README.md)

**Node**: Single computer in network or cluster. In data structures, element in tree or linked list.

**Node.js**: JavaScript runtime built on Chrome's V8 engine. Enables server-side JavaScript. See: [Backend](../05-backend/README.md)

**NoSQL**: Non-relational databases. Flexible schemas. Types: document (MongoDB), key-value (Redis), column (Cassandra), graph (Neo4j). See: [Databases](../05-backend/databases/README.md)

**Normalization**: Organizing database to reduce redundancy and improve integrity. Multiple normal forms (1NF, 2NF, 3NF).

**npm**: Package manager for JavaScript. Installs dependencies defined in package.json. See: [JavaScript](../04-frontend/javascript/README.md)

**Null**: Absence of value. Different from zero or empty string.

**Null Pointer Exception**: Error when trying to use reference that points to nothing. Common runtime error.

## O

**OAuth**: Open standard for access delegation. Allows third-party access without sharing passwords. See: [Authentication](../08-security/authentication-patterns/README.md)

**Object**: Instance of class containing data (properties) and code (methods). See: [OOP](../01-programming/oop-vs-functional/README.md)

**Object Storage**: Storage architecture managing data as objects. Used for unstructured data. Examples: S3, Blob Storage.

**Observability**: Ability to understand system internal state from external outputs. Logs, metrics, traces. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Observer Pattern**: Design pattern where object (subject) notifies dependents (observers) of state changes. See: [Design Patterns](../01-programming/design-patterns/README.md)

**OOP (Object-Oriented Programming)**: Programming paradigm based on objects and classes. Principles: encapsulation, inheritance, polymorphism. See: [OOP vs Functional](../01-programming/oop-vs-functional/README.md)

**OpenAPI**: Specification for describing REST APIs. Formerly Swagger. Enables code generation, documentation. See: [API Design](../02-architectures/api-design/README.md)

**Open-Closed Principle**: Software entities should be open for extension but closed for modification. SOLID principle.

**Operating System**: Software managing hardware and providing services to applications. Examples: Windows, macOS, Linux. See: [How Computers Work](../00-foundations/how-computers-work/README.md)

**Operational Database**: Database optimized for day-to-day operations. Handles transactions (OLTP). Contrast with analytical database.

**Optimization**: Improving software performance or resource usage. Premature optimization is root of evil.

**Orchestration**: Automated coordination of complex tasks. Kubernetes orchestrates containers. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Orchestration (Saga)**: Centralized saga coordinator directing participants. Single service controls flow. See: [Saga Pattern](../02-architectures/saga-pattern/README.md)

**ORM (Object-Relational Mapping)**: Technique converting data between incompatible type systems (objects in code, rows in database). Examples: Hibernate, Entity Framework.

**OSI Model**: Seven-layer model describing network communication. Physical, Data Link, Network, Transport, Session, Presentation, Application. See: [Networking](../00-foundations/networking-basics/README.md)

**Outage**: Period when system is unavailable. Downtime. Measured in hours or percentage.

**Overhead**: Extra resources (time, memory, bandwidth) required by abstraction layer. Trade-off for convenience.

**OWASP**: Open Web Application Security Project. Organization producing security resources like Top 10. See: [OWASP Top 10](../08-security/owasp-top-10/README.md)

## P

**PaaS (Platform as a Service)**: Cloud platform providing runtime environment. Examples: Heroku, Google App Engine. See: [Cloud](../07-cloud/README.md)

**Package**: Bundle of related code and resources. Distributed via package managers (npm, pip, Maven).

**Package Manager**: Tool automating installation, upgrade, configuration of software packages. Examples: npm (JavaScript), pip (Python), Maven (Java).

**Packet**: Unit of data transmitted over network. Contains header (metadata) and payload (actual data). See: [Networking](../00-foundations/networking-basics/README.md)

**Pagination**: Dividing content into discrete pages. Improves performance for large datasets. See: [API Design](../02-architectures/api-design/README.md)

**Parallelism**: Multiple tasks executing at exact same time (multiple CPU cores). Subset of concurrency.

**Parameter**: Variable passed to function. Input for function to process.

**Parsing**: Analyzing string of symbols according to grammar rules. Converting text to structured data.

**Partition (Database)**: Dividing large table into smaller pieces. Improves query performance. See: [Database Patterns](../02-architectures/database-patterns/README.md)

**Partition Tolerance**: System continues operating despite network partitions. Part of CAP theorem.

**Patch**: Small update fixing bugs or security issues. In HTTP, method for partial updates.

**Pattern Matching**: Checking data for presence of pattern. Used in regex, functional programming.

**Peer Review**: Process where teammates examine code changes. Same as code review.

**Penetration Testing**: Simulated attack testing security. Identifies vulnerabilities. See: [Security](../08-security/README.md)

**Performance**: How fast or efficiently system operates. Measured by latency, throughput, resource usage. See: [System Design](../02-architectures/system-design-concepts/README.md)

**Persistence**: Data surviving after process that created it ends. Stored to disk rather than RAM.

**Phishing**: Fraudulent attempt obtaining sensitive information by impersonating trusted entity. See: [Security](../08-security/README.md)

**PII (Personally Identifiable Information)**: Data that can identify specific individual. Requires protection. See: [Compliance](../08-security/compliance/README.md)

**Pipeline**: Series of processing stages where output of one is input to next. Used in CI/CD, data processing.

**Pixel**: Smallest unit of digital image. Screen resolution in pixels (e.g., 1920x1080 = 2,073,600 pixels).

**Pod**: Smallest deployable unit in Kubernetes. One or more containers sharing resources. See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Pointer**: Variable storing memory address of another variable. Used in C/C++. References in other languages.

**Polling**: Repeatedly checking for condition or data. Alternative to event-driven approach (push).

**Polymorphism**: Ability of different objects to respond to same message differently. One interface, multiple implementations. See: [OOP](../01-programming/oop-vs-functional/README.md)

**Polyglot Persistence**: Using different database technologies for different parts of application. Optimize per use case.

**Port**: Virtual endpoint for network connections. Identified by number (0-65535). Well-known ports: 80 (HTTP), 443 (HTTPS), 22 (SSH). See: [Networking](../00-foundations/networking-basics/README.md)

**POST**: HTTP method for creating resources or submitting data. Request has body.

**PostgreSQL**: Open-source relational database. Known for reliability and SQL standards compliance. See: [Databases](../05-backend/databases/README.md)

**Postman**: Tool for testing APIs. Simplifies sending HTTP requests and viewing responses.

**Pre-commit Hook**: Script running automatically before commit. Used for linting, testing, formatting.

**Precision**: ML metric: of predicted positives, how many are actually positive. High precision = few false positives.

**Primary Key**: Column(s) uniquely identifying each row in database table. Cannot be null.

**Priority Queue**: Queue where elements have priorities. Higher priority elements dequeued first.

**Private Cloud**: Cloud infrastructure operated solely for single organization. More control than public cloud.

**Process**: Instance of running program. Has own memory space, isolated from other processes.

**Producer-Consumer**: Pattern where producers create data, consumers process it. Decoupled via queue.

**Prometheus**: Open-source monitoring system with time-series database. Widely used with Kubernetes. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Protocol**: Set of rules governing data communication. Examples: HTTP, TCP, IP, FTP. See: [Networking](../00-foundations/networking-basics/README.md)

**Protocol Buffers (Protobuf)**: Google's language-neutral serialization format. More efficient than JSON. Used by gRPC.

**Provisioning**: Setting up infrastructure resources. Servers, networks, storage. See: [Infrastructure](../06-infrastructure/README.md)

**Proxy**: Intermediary server between client and server. Can cache, filter, or anonymize requests.

**Proxy Pattern**: Design pattern providing surrogate controlling access to another object. Adds functionality like lazy loading.

**Public Cloud**: Cloud services offered over public internet. Examples: AWS, Azure, GCP. See: [Cloud](../07-cloud/README.md)

**Public Key Infrastructure (PKI)**: Framework managing digital certificates and public-key encryption. Enables secure communication.

**Pull Request**: Proposed code changes for review before merging. Enables collaboration and quality control.

**Pure Function**: Function with no side effects. Same input always produces same output. See: [Functional Programming](../01-programming/oop-vs-functional/README.md)

**Push Notification**: Message sent from server to client without client requesting it. Used in mobile apps.

**PWA (Progressive Web App)**: Web application functioning like native app. Offline support, push notifications. See: [Frontend](../04-frontend/README.md)

**Python**: High-level programming language. Known for readability. Popular for data science, ML, web development. See: [Languages](../01-programming/languages-overview/README.md)

## Q

**QA (Quality Assurance)**: Process ensuring software meets quality standards. Includes testing, code review, monitoring.

**Query**: Request for data from database. SQL queries use SELECT statements. See: [Databases](../05-backend/databases/README.md)

**Query (CQRS)**: Request to read system state without modifying it. See: [CQRS](../02-architectures/cqrs/README.md)

**Query Optimization**: Improving query performance through indexes, query rewriting, execution plan analysis.

**Query String**: Part of URL containing parameters. Format: `?key1=value1&key2=value2`.

**Queue**: Data structure following FIFO (First In, First Out). Add to back, remove from front. See: [Data Structures](../00-foundations/data-structures-algorithms/README.md)

## R

**RabbitMQ**: Open-source message broker implementing AMQP. Used for asynchronous communication. See: [Message Queues](../05-backend/message-queues/README.md)

**Race Condition**: Bug where behavior depends on timing of uncontrollable events. Occurs in concurrent programs.

**RAID**: Technology combining multiple disk drives for redundancy or performance. Various levels (0, 1, 5, 10).

**RAM (Random Access Memory)**: Computer's short-term memory. Fast but volatile (lost when power off). See: [How Computers Work](../00-foundations/how-computers-work/README.md)

**Rate Limiting**: Restricting number of requests in time period. Prevents abuse. See: [API Design](../02-architectures/api-design/README.md)

**RBAC (Role-Based Access Control)**: Access control based on user roles. Users assigned roles, roles have permissions. See: [Security](../08-security/README.md)

**React**: JavaScript library for building user interfaces. Component-based, declarative. See: [React](../04-frontend/react/README.md)

**Reactive Programming**: Programming paradigm dealing with asynchronous data streams. Uses observables.

**Read Replica**: Copy of database for read operations. Reduces load on primary database.

**Recall**: ML metric: of actual positives, how many are correctly identified. High recall = few false negatives.

**Recursion**: Function calling itself. Useful for problems with self-similar structure (trees, factorials).

**Redis**: In-memory data structure store. Used as database, cache, message broker. Extremely fast. See: [Databases](../05-backend/databases/README.md), [Caching](../02-architectures/caching/README.md)

**Refactoring**: Restructuring code without changing external behavior. Improves readability, maintainability.

**Referential Integrity**: Database constraint ensuring relationships between tables remain consistent. Enforced by foreign keys.

**Regex (Regular Expression)**: Pattern describing set of strings. Used for searching, validation, extraction.

**Region**: Geographic area containing multiple data centers. Choose region close to users. See: [Cloud](../07-cloud/README.md)

**Registry**: Centralized repository. Docker registry stores images, npm registry stores packages.

**Regression**: Unintended functionality break caused by changes. Regression testing catches these.

**Regression (ML)**: Predicting continuous values. Contrast with classification (discrete categories).

**Relational Database**: Database using tables with relationships between them. Uses SQL. Examples: PostgreSQL, MySQL. See: [Databases](../05-backend/databases/README.md)

**Release**: Version of software made available to users. Major, minor, patch versions (semantic versioning).

**Reliability**: System consistently performing intended function. Measured by uptime, error rates.

**Replica Set**: Group of database instances maintaining same data. Provides redundancy and high availability.

**Replication**: Copying data to multiple databases. Improves availability and read performance. See: [Database Patterns](../02-architectures/database-patterns/README.md)

**Repository**: Storage location for code, often with version control. Git repository tracks all changes. Also: pattern abstracting data access.

**Repository Pattern**: Design pattern mediating between domain and data mapping layers. Provides collection-like interface.

**Request-Response**: Communication pattern where client sends request, waits for response. Synchronous.

**Resilience**: System's ability to handle and recover from failures. Built through redundancy, retries, circuit breakers.

**Resource**: Entity managed by application. In REST, noun that API operates on (users, orders, products).

**REST (Representational State Transfer)**: Architectural style for APIs. Uses HTTP methods (GET, POST, PUT, DELETE) on resources. See: [REST APIs](../05-backend/rest-apis/README.md)

**RESTful**: API adhering to REST principles. Stateless, resource-based, uses HTTP methods appropriately.

**Retry Logic**: Automatically retrying failed operations. Use exponential backoff to avoid overwhelming system.

**Reverse Proxy**: Server sitting in front of web servers, forwarding client requests. Provides load balancing, caching, security.

**Rollback**: Reverting to previous version. Database rollback undoes transaction, deployment rollback reverts code.

**Rolling Deployment**: Gradually replacing instances with new version. Minimizes downtime. See: [CI/CD](../06-infrastructure/cicd/README.md)

**Router**: Device forwarding data packets between networks. Reads destination IP and determines best path. See: [Networking](../00-foundations/networking-basics/README.md)

**Routing**: Process of selecting paths in network or directing URLs to handlers in web applications.

**RPC (Remote Procedure Call)**: Protocol for executing procedure on remote computer. gRPC is modern implementation.

**RSA**: Public-key cryptography algorithm. Used for secure data transmission, digital signatures.

**Runtime**: Period during which program is executing. Also: environment providing services to running program.

## S

**S3 (Simple Storage Service)**: AWS object storage service. Scalable, durable, accessible via HTTP. See: [AWS](../07-cloud/aws/README.md)

**SaaS (Software as a Service)**: Software delivered over internet. Examples: Gmail, Salesforce, Office 365. See: [Cloud](../07-cloud/README.md)

**Saga Pattern**: Managing distributed transactions through local transactions and compensating transactions. See: [Saga Pattern](../02-architectures/saga-pattern/README.md)

**Salt**: Random data added to password before hashing. Prevents rainbow table attacks. See: [Security](../08-security/README.md)

**SAML (Security Assertion Markup Language)**: XML-based standard for authentication and authorization. Used for single sign-on.

**Sandbox**: Isolated environment for testing code without affecting production. Security boundary.

**Scalability**: System's ability to handle growth (more users, data, transactions). Vertical (bigger servers) or horizontal (more servers). See: [System Design](../02-architectures/system-design-concepts/README.md)

**Schema**: Structure defining organization of data. Database schema defines tables, columns, types, relationships.

**Scope**: Region of code where variable is accessible. Local scope (function), global scope (entire program).

**Scrum**: Agile framework for managing work. Uses sprints, daily standups, retrospectives. See: [Agile & Scrum](../03-methodologies/agile-scrum/README.md)

**SDK (Software Development Kit)**: Collection of tools, libraries, documentation for developing applications for specific platform.

**Secret**: Sensitive information like passwords, API keys, certificates. Should never be in code. See: [Secrets Management](../08-security/secrets-management/README.md)

**Security Group**: Virtual firewall controlling inbound/outbound traffic to resources. Used in AWS, Azure.

**Semantic Versioning**: Versioning scheme using MAJOR.MINOR.PATCH. Breaking changes increment MAJOR, features MINOR, fixes PATCH.

**Serialization**: Converting data structure to format for storage or transmission. Deserialization reverses it.

**Server**: Computer or program providing functionality to clients. Web servers serve web pages; database servers handle queries. See: [Backend](../05-backend/README.md)

**Server-Side Rendering (SSR)**: Generating HTML on server instead of client. Improves SEO and initial load. See: [Frontend](../04-frontend/README.md)

**Serverless**: Execution model where cloud provider manages servers. Pay per execution. AWS Lambda, Azure Functions. See: [Serverless](../02-architectures/serverless/README.md)

**Service**: Self-contained unit of functionality. In microservices, independent deployable component.

**Service Discovery**: Mechanism for services to find each other dynamically. Examples: Consul, Eureka, etcd. See: [Microservices](../02-architectures/microservices/README.md)

**Service Mesh**: Infrastructure layer handling service-to-service communication. Examples: Istio, Linkerd. See: [Microservices](../02-architectures/microservices/README.md)

**Session**: Period of interaction between user and system. Web sessions track user state across requests.

**Setter/Getter**: Methods for accessing (getter) or modifying (setter) private properties. Encapsulation mechanism.

**Shadow Deployment**: Running new version alongside production without sending real traffic. Tests performance impact.

**Shard**: Horizontal partition distributing data across multiple servers. Improves scalability. See: [Database Patterns](../02-architectures/database-patterns/README.md)

**Sharding**: Technique of splitting data across multiple databases. Each shard holds subset of data.

**Side Effect**: Operation affecting state outside function. File I/O, modifying global variables, network requests.

**Single Page Application (SPA)**: Web app loading single page, dynamically updating content. React, Angular, Vue. See: [Frontend](../04-frontend/README.md)

**Single Responsibility Principle**: Class should have only one reason to change. SOLID principle.

**Singleton**: Design pattern ensuring class has only one instance. Used for shared resources (database connections, loggers). See: [Design Patterns](../01-programming/design-patterns/README.md)

**SLA (Service Level Agreement)**: Contract defining expected service level. Includes availability, performance guarantees.

**SLI (Service Level Indicator)**: Metric measuring aspect of service level. Examples: latency, error rate, throughput.

**SLO (Service Level Objective)**: Target value or range for SLI. Example: 99.9% availability, p99 latency < 200ms.

**SMTP (Simple Mail Transfer Protocol)**: Protocol for sending email. Port 25, 587, or 465.

**Snapshot**: Point-in-time copy of data or system state. Used for backups, testing, disaster recovery.

**SOAP (Simple Object Access Protocol)**: Protocol for exchanging structured information (XML) in web services. More complex than REST.

**Socket**: Endpoint for network communication. Combination of IP address and port. See: [Networking](../00-foundations/networking-basics/README.md)

**SOLID**: Five principles of object-oriented design. Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.

**SPA**: See Single Page Application.

**Split Brain**: Problem in distributed systems where cluster partitions into groups believing others failed.

**SQL (Structured Query Language)**: Language for managing relational databases. Commands: SELECT, INSERT, UPDATE, DELETE. See: [Databases](../05-backend/databases/README.md)

**SQL Injection**: Attack inserting malicious SQL code through input. Prevented by parameterized queries. See: [OWASP](../08-security/owasp-top-10/README.md)

**SSH (Secure Shell)**: Protocol for secure remote login and command execution. Encrypted alternative to Telnet.

**SSL/TLS (Secure Sockets Layer/Transport Layer Security)**: Protocols providing secure communication over networks. HTTPS uses TLS. See: [Security](../08-security/README.md)

**SSO (Single Sign-On)**: Authentication scheme allowing access to multiple systems with single login. Uses protocols like SAML, OAuth.

**Stack**: Data structure following LIFO (Last In, First Out). Add to top, remove from top. Also: technology stack. See: [Data Structures](../00-foundations/data-structures-algorithms/README.md)

**Stack Trace**: List of method calls that led to exception. Essential for debugging.

**Stateful**: System maintaining state between requests. Requires sticky sessions or shared state storage.

**Stateless**: System not maintaining state between requests. Each request contains all needed information. Scales better.

**Static Analysis**: Analyzing code without executing it. Finds bugs, security issues, style violations.

**Static Typing**: Type checking at compile time. Variables have fixed types. Java, C++, TypeScript use static typing.

**Static Website**: Website with fixed content. No server-side processing. Contrast with dynamic website.

**Status Code**: See HTTP Status Code.

**Stored Procedure**: Precompiled SQL code stored in database. Reusable, faster execution.

**Strategy Pattern**: Design pattern defining family of algorithms, making them interchangeable. See: [Design Patterns](../01-programming/design-patterns/README.md)

**Stream Processing**: Processing data continuously as it arrives. Contrast with batch processing. Tools: Kafka Streams, Flink.

**String**: Sequence of characters. Fundamental data type in programming.

**Struct**: Composite data type grouping variables. Used in C, Go, Rust.

**Structured Logging**: Logging in machine-readable format (JSON). Easier to query and analyze. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Stub**: Simplified implementation used in testing. Provides canned responses.

**Subnet**: Logical subdivision of IP network. Segments network for organization and performance. See: [Networking](../00-foundations/networking-basics/README.md)

**Supervised Learning**: ML approach learning from labeled data. Examples: classification, regression. See: [AI/ML](../09-ai-ml/README.md)

**Swagger**: Tools for designing, building, documenting REST APIs. Now called OpenAPI. See: [API Design](../02-architectures/api-design/README.md)

**Switch**: Network device connecting devices within LAN. Forwards data to specific devices based on MAC addresses.

**Synchronous**: Operation blocking until completion. Program waits for result before continuing. Opposite of asynchronous.

**Syntax**: Grammar rules of programming language. Code must follow syntax to be valid.

**System Design**: Process of defining architecture, components, interfaces of system. See: [System Design Concepts](../02-architectures/system-design-concepts/README.md)

## T

**Table**: Database structure organizing data in rows and columns. Represents entity in relational databases.

**Tag**: Label attached to resource for organization, cost tracking, access control. Also: version identifier.

**TCP (Transmission Control Protocol)**: Connection-oriented protocol ensuring reliable, ordered delivery. Used by HTTP, SMTP, FTP. See: [Networking](../00-foundations/networking-basics/README.md)

**TDD (Test-Driven Development)**: Development approach writing tests before code. Red-Green-Refactor cycle. See: [TDD](../03-methodologies/test-driven-development/README.md)

**Technical Debt**: Cost of additional rework caused by choosing quick solution over better approach. Accumulates interest.

**Telemetry**: Automatic measurement and transmission of data. Metrics from distributed systems. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Template**: Pre-formatted content with placeholders. Used for code generation, emails, infrastructure.

**Terraform**: Infrastructure as code tool using declarative configuration. Works with multiple cloud providers. See: [Terraform](../06-infrastructure/terraform/README.md)

**Test Coverage**: Percentage of code executed by tests. High coverage doesn't guarantee quality but helps.

**Testing**: Process of verifying software works correctly. Unit, integration, end-to-end tests. See: [TDD](../03-methodologies/test-driven-development/README.md)

**Thread**: Smallest unit of execution within process. Multiple threads share same memory space.

**Thread Pool**: Set of reusable threads. Avoids overhead of creating threads for each task.

**Threat Model**: Analysis identifying potential security threats. Guides security measures. See: [Threat Modeling](../08-security/threat-modeling/README.md)

**Throttling**: Limiting rate of operations. Similar to rate limiting but often more granular.

**Throughput**: Amount of data processed in given time. Measured in requests/second, bytes/second. See: [Performance](../02-architectures/system-design-concepts/README.md)

**Tight Coupling**: Components highly dependent on each other. Makes system rigid, hard to change.

**Time Complexity**: Measure of algorithm execution time as function of input size. Expressed in Big O notation.

**Time Series Database**: Database optimized for time-stamped data. Examples: InfluxDB, TimescaleDB. Used for metrics, IoT.

**Time to Live (TTL)**: Lifespan of data. DNS TTL determines cache duration; packet TTL limits network hops.

**TLS**: See SSL/TLS.

**Token**: Piece of data representing right to access resource. Authentication tokens verify identity. See: [Authentication](../08-security/authentication-patterns/README.md)

**Tomb stoning**: Marking deleted items rather than physically removing them. Allows eventual consistency in distributed systems.

**Trace**: Record of request's journey through distributed system. Shows timing, errors, dependencies. See: [Monitoring](../06-infrastructure/monitoring/README.md)

**Transaction**: Sequence of operations performed as single logical unit. Database transactions follow ACID properties. See: [Databases](../05-backend/databases/README.md)

**Transaction Isolation Level**: Degree to which transactions are isolated from each other. Trade-off between consistency and concurrency.

**Transpiler**: Converts source code from one language to another at same abstraction level. Babel transpiles ES6 to ES5.

**Tree**: Hierarchical data structure with root and child nodes. No cycles. See: [Data Structures](../00-foundations/data-structures-algorithms/README.md)

**Trigger**: Automatically executed code when specific database event occurs. Used for auditing, validation, cascading changes.

**TTL**: See Time to Live.

**Tuple**: Ordered collection of elements. Immutable in most languages. Used for returning multiple values.

**Turing Complete**: System capable of simulating any Turing machine. Can compute anything computable.

**Two-Factor Authentication (2FA)**: Authentication requiring two different factors. Something you know (password) + something you have (phone). See: [Authentication](../08-security/authentication-patterns/README.md)

**Type**: Classification of data defining possible values and operations. Primitive types (int, string, boolean) or composite (objects, arrays).

**Type Coercion**: Automatic type conversion. JavaScript: "5" + 1 = "51" (string concatenation).

**Type Inference**: Compiler determining variable type from context. Reduces boilerplate. Used in TypeScript, Kotlin.

**TypeScript**: Superset of JavaScript adding static types. Compiles to JavaScript. See: [JavaScript](../04-frontend/javascript/README.md)

## U

**Ubiquitous Language**: Shared language between developers and domain experts. Central to DDD. See: [DDD](../03-methodologies/domain-driven-design/README.md)

**UDP (User Datagram Protocol)**: Connectionless protocol for fast, unreliable delivery. Used by DNS, video streaming, gaming. See: [Networking](../00-foundations/networking-basics/README.md)

**UI (User Interface)**: Visual elements user interacts with. Includes buttons, forms, menus, displays. See: [Frontend](../04-frontend/README.md)

**Unboxing**: Converting wrapper object to primitive type. Opposite of boxing. Auto-unboxing is automatic.

**Unicode**: Universal character encoding standard. Supports all writing systems (1.1+ million characters).

**Unit Test**: Test verifying single unit of code (function, class) works correctly. Fast, isolated. See: [TDD](../03-methodologies/test-driven-development/README.md)

**Unix**: Family of multitasking operating systems. Linux is Unix-like. Philosophy: small, composable tools.

**Unsupervised Learning**: ML approach learning patterns from unlabeled data. Examples: clustering, dimensionality reduction.

**Uptime**: Percentage of time system is operational. 99.9% uptime = ~8.7 hours downtime per year.

**URI (Uniform Resource Identifier)**: String identifying resource. URLs (with location) are subset of URIs.

**URL (Uniform Resource Locator)**: Address of resource on internet. Format: `protocol://domain:port/path?query#fragment`. See: [How Internet Works](../00-foundations/how-internet-works/README.md)

**Use Case**: Specific way user interacts with system to achieve goal. Describes flow and expected outcome.

**User Story**: Agile requirement format. "As a [user], I want [goal], so that [benefit]." See: [Agile](../03-methodologies/agile-scrum/README.md)

**UTF-8**: Variable-length Unicode encoding. 1-4 bytes per character. Backward-compatible with ASCII. Most common encoding.

**UUID (Universally Unique Identifier)**: 128-bit number guaranteed to be unique. Used for IDs across systems.

**UX (User Experience)**: Overall experience of user interacting with product. Includes UI, performance, accessibility, satisfaction.

## V

**Validation**: Verifying data meets expected criteria. Client-side for UX, server-side for security.

**Value Object**: Object defined by attributes rather than identity. Immutable. Example: Money, Address. See: [DDD](../03-methodologies/domain-driven-design/README.md)

**Variable**: Named storage location holding value. Can be reassigned (mutable) or constant (immutable).

**VCS (Version Control System)**: System tracking changes to files over time. Git is most popular. See: [DevOps](../03-methodologies/devops-culture/README.md)

**Vector**: Dynamic array that automatically resizes. Used in C++, Java (ArrayList).

**Vendor Lock-in**: Dependence on specific vendor making switching difficult or expensive. Cloud and SaaS concern.

**Version Control**: System tracking changes to files over time. Enables collaboration, history, rollback. Git is most popular.

**Vertical Scaling**: Adding more resources (CPU, RAM) to single machine. Scale up. Limited by hardware.

**View**: Component presenting data to user in MVC pattern. Also: virtual table based on query in databases.

**Virtual Machine**: Software emulation of physical computer. Runs operating system and applications. Used for isolation and portability.

**Virtualization**: Creating virtual versions of resources (servers, storage, networks). Enables better resource utilization.

**VLAN (Virtual Local Area Network)**: Logical network segmentation. Groups devices regardless of physical location.

**Volume**: Persistent storage for containers. Survives container restarts. See: [Docker](../06-infrastructure/docker/README.md), [Kubernetes](../06-infrastructure/kubernetes/README.md)

**VPC (Virtual Private Cloud)**: Isolated section of cloud for your resources. Private network in cloud. See: [AWS](../07-cloud/aws/README.md)

**VPN (Virtual Private Network)**: Encrypted connection over public network. Secures communication and hides IP address.

**Vue**: Progressive JavaScript framework for building user interfaces. Approachable, versatile. See: [Vue](../04-frontend/vue/README.md)

**Vulnerability**: Weakness in system that can be exploited. CVE (Common Vulnerabilities and Exposures) database tracks them. See: [Security](../08-security/README.md)

## W

**WAF (Web Application Firewall)**: Security layer filtering HTTP traffic to web applications. Protects against attacks (SQL injection, XSS). See: [Security](../08-security/README.md)

**Waterfall**: Sequential development methodology. Each phase completed before next begins. Less flexible than Agile.

**Web Assembly (WASM)**: Binary instruction format for web. Enables near-native performance in browsers.

**Web Server**: Software serving web pages over HTTP. Examples: Apache, NGINX. See: [Backend](../05-backend/README.md)

**Web Service**: Service available over network using standardized protocols. SOAP and REST are common.

**Webhook**: HTTP callback—automatic message sent when event occurs. Push model vs polling. See: [Event-Driven](../02-architectures/event-driven/README.md)

**WebSocket**: Protocol providing full-duplex communication over single TCP connection. Enables real-time features (chat, live updates).

**Whitelist**: List of permitted items. Opposite of blacklist. Whitelist approach is more secure.

**Whitespace**: Characters not visible (spaces, tabs, newlines). Some languages (Python) use for structure; others ignore.

## X

**XHR (XMLHttpRequest)**: API for making HTTP requests from JavaScript. Used in AJAX for asynchronous updates. Largely replaced by Fetch API.

**XML (eXtensible Markup Language)**: Markup language for encoding documents. Human-readable, self-documenting. More verbose than JSON.

**XSS (Cross-Site Scripting)**: Security vulnerability allowing attackers to inject malicious scripts. Prevent by sanitizing user input. See: [OWASP](../08-security/owasp-top-10/README.md)

## Y

**YAML (YAML Ain't Markup Language)**: Human-readable data serialization format. Used for configuration files (Docker, Kubernetes). See: [Kubernetes](../06-infrastructure/kubernetes/README.md)

**Yak Shaving**: Solving progressively disconnected problems to reach original goal. Example: fixing build tool to fix dependency to implement feature.

**YAGNI (You Aren't Gonna Need It)**: Principle advising against adding functionality until needed. Avoids over-engineering.

## Z

**Zero-Day**: Security vulnerability unknown to vendor. No patch available, making it dangerous. See: [Security](../08-security/README.md)

**Zero Downtime Deployment**: Deploying new version without service interruption. Uses techniques like blue-green, rolling deployments. See: [CI/CD](../06-infrastructure/cicd/README.md)

**Zero Trust**: Security model assuming no trust by default. Verify every access request regardless of source.

**Zombie Process**: Terminated process still in process table. Waiting for parent to read exit status.

**Zone**: Isolated failure domain within region. AWS Availability Zones, Google Cloud Zones.

---

## How to Use This Glossary

1. **Quick Reference**: Look up unfamiliar terms encountered in guides
2. **Learning Path**: Read terms sequentially to build vocabulary
3. **Context**: Terms link to concepts—read related guides for depth
4. **Study Aid**: Use for technical interview preparation
5. **Teaching Tool**: Share definitions when explaining concepts

**Tips:**
- Don't memorize—understand concepts through practice
- Terms often have multiple meanings in different contexts
- Some terms are interchangeable (e.g., method/function)
- Technologies evolve—meanings may shift over time
- Best learned through use in real projects

---

## Coverage

This glossary covers essential vocabulary across all major software engineering domains:

- **Foundations**: Networking, computers, internet, data structures, algorithms
- **Programming**: Languages, paradigms, design patterns, OOP, functional programming
- **Architectures**: Microservices, event-driven, CQRS, serverless, system design
- **Methodologies**: Agile, Scrum, TDD, BDD, DDD, DevOps
- **Frontend**: HTML, CSS, JavaScript, React, Angular, Vue
- **Backend**: REST APIs, databases, message queues, authentication
- **Infrastructure**: Docker, Kubernetes, CI/CD, monitoring, Terraform
- **Cloud**: AWS, Azure, GCP, serverless, scaling
- **Security**: Authentication, authorization, OWASP, compliance, threats
- **AI/ML**: Machine learning, deep learning, MLOps, data science
- **Industry**: Domain-specific terms and applications

---

This glossary contains **500+ terms** comprehensively covering the technical vocabulary needed to understand modern software engineering from foundations to production systems.
