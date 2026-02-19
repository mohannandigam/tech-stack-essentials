# Tech Stack Essentials Glossary

A comprehensive A-Z reference of technical terms used throughout this guide. Each term includes a clear definition and context for when you'll encounter it.

---

## A

**Abstraction**: Hiding complex implementation details behind a simpler interface. Like driving a car—you use the steering wheel and pedals without knowing how the engine works internally.

**ACID**: Properties guaranteeing database transaction reliability: Atomicity (all or nothing), Consistency (valid state), Isolation (transactions don't interfere), Durability (committed data persists).

**Agile**: Development methodology emphasizing iterative progress, collaboration, and adaptability. Work is broken into short "sprints" (1-4 weeks) with regular feedback.

**Algorithm**: Step-by-step procedure for solving a problem or performing a computation. Like a recipe for cooking.

**API (Application Programming Interface)**: Set of rules allowing software components to communicate. REST APIs use HTTP; GraphQL APIs use a query language.

**Array**: Fixed-size collection of elements of the same type, stored contiguously in memory. Access by index is fast O(1).

**Asynchronous**: Operations that don't block—program continues executing while waiting for result. Opposite of synchronous (wait for completion).

**Authentication**: Verifying identity (who you are). Typically username/password, OAuth, or biometrics.

**Authorization**: Verifying permissions (what you're allowed to do). Happens after authentication.

## B

**Backend**: Server-side of application—handles data processing, business logic, database interactions. Not visible to users.

**Bandwidth**: Maximum data transfer rate of network connection. Measured in bits per second (bps, Kbps, Mbps, Gbps).

**Binary**: Number system using only 0 and 1. Computers operate in binary at the hardware level.

**Bit**: Smallest unit of data—single binary digit (0 or 1).

**Blockchain**: Distributed ledger technology where records (blocks) are linked cryptographically. Used for cryptocurrencies and immutable audit trails.

**Boolean**: Data type with two values: true or false. Named after mathematician George Boole.

**Bug**: Error or flaw in software causing incorrect behavior. Requires debugging to fix.

**Byte**: Unit of data containing 8 bits. Can represent 256 different values (0-255).

## C

**Cache**: Temporary storage for frequently accessed data to improve performance. RAM cache is faster than disk; CDN cache is closer to users.

**CI/CD (Continuous Integration/Continuous Deployment)**: Automated pipeline for building, testing, and deploying code. Changes go from development to production quickly and safely.

**Class**: Blueprint for creating objects in object-oriented programming. Defines properties and methods objects will have.

**Client**: Program or device that requests services from a server. Web browser is a client requesting pages from web servers.

**Cloud Computing**: Delivery of computing services (servers, storage, databases, networking) over the internet. Pay-as-you-go model.

**Compiler**: Program that translates source code (human-readable) into machine code (executable). Java, C++ use compilers.

**Compression**: Reducing data size for storage or transmission. Lossless (perfect reconstruction) or lossy (approximate).

**Concurrency**: Multiple tasks making progress simultaneously. May or may not execute at exact same time (see Parallelism).

**Container**: Lightweight, standalone package containing application and all dependencies. Docker containers are portable across environments.

**Cookie**: Small text file stored by browser, sent with HTTP requests. Used for session management, personalization, tracking.

**CORS (Cross-Origin Resource Sharing)**: Security mechanism allowing/restricting web pages to request resources from different domains.

**CRUD**: Basic database operations: Create, Read, Update, Delete. Foundation of most applications.

**CSS (Cascading Style Sheets)**: Language for styling HTML documents—colors, layouts, fonts, spacing.

## D

**Database**: Organized collection of structured data. Relational (SQL) use tables; NoSQL use various models.

**Data Structure**: Way of organizing data for efficient access and modification. Examples: arrays, lists, trees, hash tables.

**Debugging**: Process of finding and fixing bugs in code. Uses debuggers, logging, print statements.

**Deployment**: Process of making application available to users. Can be manual or automated (CI/CD).

**DevOps**: Practices combining development and operations—automation, collaboration, continuous improvement.

**DHCP (Dynamic Host Configuration Protocol)**: Automatically assigns IP addresses to devices on network.

**DNS (Domain Name System)**: Translates domain names (example.com) to IP addresses (93.184.216.34).

**Docker**: Platform for developing, shipping, and running applications in containers.

**DOM (Document Object Model)**: Tree structure representing HTML document. JavaScript manipulates DOM to change page content.

## E

**Encryption**: Converting data into coded form to prevent unauthorized access. Decryption reverses the process with key.

**Endpoint**: URL where API can access resources. Example: `https://api.example.com/users/123`.

**Environment Variable**: Dynamic value outside code affecting program behavior. Used for configuration (database URLs, API keys).

**Error Handling**: Code that responds to errors gracefully—try/catch blocks, validation, fallbacks.

**Event**: Action or occurrence detected by program—user click, timer expiration, data arrival.

**Exception**: Error that disrupts normal program flow. Can be caught and handled to prevent crashes.

## F

**Firewall**: Security system controlling incoming/outgoing network traffic based on rules. Blocks unauthorized access.

**Framework**: Pre-built structure providing foundation for building applications. Includes libraries, tools, conventions.

**Frontend**: Client-side of application—what users see and interact with. HTML, CSS, JavaScript.

**FTP (File Transfer Protocol)**: Standard protocol for transferring files over network. SFTP/FTPS add security.

**Function**: Reusable block of code performing specific task. Takes inputs (parameters), returns output.

**Functional Programming**: Programming paradigm treating computation as evaluation of mathematical functions. Emphasizes immutability and pure functions.

## G

**Garbage Collection**: Automatic memory management—reclaims memory from objects no longer needed. Java, Python, JavaScript use GC.

**Gateway**: Node routing traffic between networks. API gateway routes requests to appropriate microservices.

**Git**: Distributed version control system tracking code changes. Enables collaboration and history.

**GitHub**: Web-based platform for hosting Git repositories. Adds collaboration features (pull requests, issues, actions).

**GraphQL**: Query language for APIs allowing clients to request exactly the data they need. Alternative to REST.

## H

**Hash Function**: Function mapping data of arbitrary size to fixed-size value. Used for data integrity, passwords, indexing.

**Hash Table**: Data structure using hash function to map keys to values. Fast O(1) average lookup.

**Hexadecimal**: Base-16 number system (0-9, A-F). Compact representation of binary. Used for colors (#FF5733), memory addresses.

**HTML (HyperText Markup Language)**: Standard markup language for web pages. Defines structure and content.

**HTTP (HyperText Transfer Protocol)**: Protocol for transmitting web pages and data. Foundation of the web.

**HTTPS (HTTP Secure)**: Encrypted version of HTTP using TLS/SSL. Protects data in transit.

## I

**IDE (Integrated Development Environment)**: Software application for coding—editor, debugger, compiler in one tool. Examples: VS Code, IntelliJ, Eclipse.

**Idempotent**: Operation that produces same result when executed multiple times. Important for retry logic.

**Immutable**: Cannot be modified after creation. Immutable objects are safer in concurrent environments.

**Index**: Database structure improving query speed. Like book index—direct lookup instead of scanning all pages.

**Inheritance**: Object-oriented concept where class inherits properties and methods from parent class.

**Interface**: Contract defining methods a class must implement. Enables polymorphism and abstraction.

**Interpreter**: Program executing code directly without prior compilation. Python, JavaScript use interpreters.

**IP Address**: Numerical label identifying device on network. IPv4 (32-bit) or IPv6 (128-bit).

**IPv4**: Internet Protocol version 4—32-bit addresses (e.g., 192.168.1.1). ~4.3 billion addresses.

**IPv6**: Internet Protocol version 6—128-bit addresses. 340 undecillion addresses (practically unlimited).

## J

**JavaScript**: Programming language for web browsers. Also used server-side (Node.js).

**JSON (JavaScript Object Notation)**: Lightweight data interchange format. Human-readable, language-independent. Common in APIs.

**JWT (JSON Web Token)**: Compact, URL-safe means of representing claims between parties. Used for authentication.

## K

**Kubernetes**: Open-source platform for automating containerized application deployment, scaling, and management.

**Key-Value Store**: Database storing data as key-value pairs. Fast lookups. Examples: Redis, DynamoDB.

## L

**Latency**: Time delay between action and response. Network latency is round-trip time. Lower is better.

**Library**: Collection of reusable code (functions, classes) for common tasks. Imported into programs.

**Linked List**: Data structure where elements (nodes) contain data and reference to next node. Dynamic size.

**Load Balancer**: Distributes incoming traffic across multiple servers. Improves performance and availability.

**Localhost**: Hostname referring to current computer (127.0.0.1). Used for local development.

**Log**: Record of events in system—errors, warnings, informational messages. Essential for debugging and monitoring.

**Loop**: Programming construct repeating code multiple times. For loops (fixed iterations), while loops (condition-based).

## M

**Machine Learning**: Subset of AI where systems learn from data without explicit programming. Used for predictions, classifications, recommendations.

**MAC Address (Media Access Control)**: Hardware address uniquely identifying network interface. 48-bit number (e.g., 00:1A:2B:3C:4D:5E).

**Metadata**: Data about data. Examples: file creation date, image EXIF data, database schema.

**Method**: Function belonging to class or object. Called on instances.

**Microservices**: Architecture style structuring application as collection of small, independent services. Opposite of monolith.

**Middleware**: Software connecting applications or components. Intercepts requests/responses to add functionality (logging, authentication).

**Migration**: Process of moving data, applications, or infrastructure to new environment. Also database schema changes.

**Monolith**: Application where all components are tightly coupled in single codebase. Simpler but harder to scale.

**Mutex (Mutual Exclusion)**: Synchronization primitive preventing multiple threads from accessing shared resource simultaneously.

## N

**Namespace**: Container organizing code elements (classes, functions) to avoid naming conflicts.

**NAT (Network Address Translation)**: Technique mapping private IP addresses to public IP. Allows many devices to share one public IP.

**NoSQL**: Non-relational databases. Flexible schemas. Types: document (MongoDB), key-value (Redis), column (Cassandra), graph (Neo4j).

**Null**: Absence of value. Different from zero or empty string.

## O

**Object**: Instance of class containing data (properties) and code (methods).

**OOP (Object-Oriented Programming)**: Programming paradigm based on objects and classes. Principles: encapsulation, inheritance, polymorphism.

**Operating System**: Software managing hardware and providing services to applications. Examples: Windows, macOS, Linux.

**ORM (Object-Relational Mapping)**: Technique converting data between incompatible type systems (objects in code, rows in database).

**Overhead**: Extra resources (time, memory, bandwidth) required by abstraction layer. Trade-off for convenience.

## P

**Package Manager**: Tool automating installation, upgrade, configuration of software packages. Examples: npm (JavaScript), pip (Python), Maven (Java).

**Packet**: Unit of data transmitted over network. Contains header (metadata) and payload (actual data).

**Parallelism**: Multiple tasks executing at exact same time (multiple CPU cores). Subset of concurrency.

**Parameter**: Variable passed to function. Input for function to process.

**Parsing**: Analyzing string of symbols according to grammar rules. Converting text to structured data.

**Performance**: How fast or efficiently system operates. Measured by latency, throughput, resource usage.

**Pixel**: Smallest unit of digital image. Screen resolution in pixels (e.g., 1920x1080 = 2,073,600 pixels).

**Pointer**: Variable storing memory address of another variable. Used in C/C++. References in other languages.

**Polymorphism**: Ability of different objects to respond to same message differently. One interface, multiple implementations.

**Port**: Virtual endpoint for network connections. Identified by number (0-65535). Well-known ports: 80 (HTTP), 443 (HTTPS), 22 (SSH).

**Primary Key**: Column(s) uniquely identifying each row in database table. Cannot be null.

**Protocol**: Set of rules governing data communication. Examples: HTTP, TCP, IP, FTP.

**Proxy**: Intermediary server between client and server. Can cache, filter, or anonymize requests.

## Q

**Query**: Request for data from database. SQL queries use SELECT statements.

**Query String**: Part of URL containing parameters. Format: `?key1=value1&key2=value2`.

**Queue**: Data structure following FIFO (First In, First Out). Add to back, remove from front.

## R

**Race Condition**: Bug where behavior depends on timing of uncontrollable events. Occurs in concurrent programs.

**RAM (Random Access Memory)**: Computer's short-term memory. Fast but volatile (lost when power off).

**Recursion**: Function calling itself. Useful for problems with self-similar structure (trees, factorials).

**Refactoring**: Restructuring code without changing external behavior. Improves readability, maintainability.

**Regex (Regular Expression)**: Pattern describing set of strings. Used for searching, validation, extraction.

**Repository**: Storage location for code, often with version control. Git repository tracks all changes.

**REST (Representational State Transfer)**: Architectural style for APIs. Uses HTTP methods (GET, POST, PUT, DELETE) on resources.

**Router**: Device forwarding data packets between networks. Reads destination IP and determines best path.

**Routing**: Process of selecting paths in network or directing URLs to handlers in web applications.

## S

**Scalability**: System's ability to handle growth (more users, data, transactions). Vertical (bigger servers) or horizontal (more servers).

**Schema**: Structure defining organization of data. Database schema defines tables, columns, types, relationships.

**Scope**: Region of code where variable is accessible. Local scope (function), global scope (entire program).

**SDK (Software Development Kit)**: Collection of tools, libraries, documentation for developing applications for specific platform.

**Serialization**: Converting data structure to format for storage or transmission. Deserialization reverses it.

**Server**: Computer or program providing functionality to clients. Web servers serve web pages; database servers handle queries.

**Session**: Period of interaction between user and system. Web sessions track user state across requests.

**Singleton**: Design pattern ensuring class has only one instance. Used for shared resources (database connections, loggers).

**SMTP (Simple Mail Transfer Protocol)**: Protocol for sending email.

**SOAP (Simple Object Access Protocol)**: Protocol for exchanging structured information (XML) in web services. More complex than REST.

**Socket**: Endpoint for network communication. Combination of IP address and port.

**SQL (Structured Query Language)**: Language for managing relational databases. Commands: SELECT, INSERT, UPDATE, DELETE.

**SSH (Secure Shell)**: Protocol for secure remote login and command execution. Encrypted alternative to Telnet.

**SSL/TLS (Secure Sockets Layer/Transport Layer Security)**: Protocols providing secure communication over networks. HTTPS uses TLS.

**Stack**: Data structure following LIFO (Last In, First Out). Add to top, remove from top. Also: technology stack.

**Static**: Not changing or determined at compile time. Static variables, static methods, static websites (no server-side processing).

**Subnet**: Logical subdivision of IP network. Segments network for organization and performance.

**Switch**: Network device connecting devices within LAN. Forwards data to specific devices based on MAC addresses.

**Syntax**: Grammar rules of programming language. Code must follow syntax to be valid.

## T

**TCP (Transmission Control Protocol)**: Connection-oriented protocol ensuring reliable, ordered delivery. Used by HTTP, SMTP, FTP.

**Thread**: Smallest unit of execution within process. Multiple threads share same memory space.

**Throughput**: Amount of data processed in given time. Measured in requests/second, bytes/second.

**Token**: Piece of data representing right to access resource. Authentication tokens verify identity.

**Transaction**: Sequence of operations performed as single logical unit. Database transactions follow ACID properties.

**TTL (Time To Live)**: Lifespan of data. DNS TTL determines cache duration; packet TTL limits network hops.

**Type**: Classification of data defining possible values and operations. Primitive types (int, string, boolean) or composite (objects, arrays).

## U

**UDP (User Datagram Protocol)**: Connectionless protocol for fast, unreliable delivery. Used by DNS, video streaming, gaming.

**UI (User Interface)**: Visual elements user interacts with. Includes buttons, forms, menus, displays.

**Unicode**: Universal character encoding standard. Supports all writing systems (1.1+ million characters).

**URI (Uniform Resource Identifier)**: String identifying resource. URLs (with location) are subset of URIs.

**URL (Uniform Resource Locator)**: Address of resource on internet. Format: `protocol://domain:port/path?query#fragment`.

**UTF-8**: Variable-length Unicode encoding. 1-4 bytes per character. Backward-compatible with ASCII. Most common encoding.

**UUID (Universally Unique Identifier)**: 128-bit number guaranteed to be unique. Used for IDs across systems.

**UX (User Experience)**: Overall experience of user interacting with product. Includes UI, performance, accessibility, satisfaction.

## V

**Variable**: Named storage location holding value. Can be reassigned (mutable) or constant (immutable).

**Version Control**: System tracking changes to files over time. Enables collaboration, history, rollback. Git is most popular.

**Virtual Machine**: Software emulation of physical computer. Runs operating system and applications. Used for isolation and portability.

**VLAN (Virtual Local Area Network)**: Logical network segmentation. Groups devices regardless of physical location.

**VPN (Virtual Private Network)**: Encrypted connection over public network. Secures communication and hides IP address.

## W

**WAF (Web Application Firewall)**: Security layer filtering HTTP traffic to web applications. Protects against attacks (SQL injection, XSS).

**Webhook**: HTTP callback—automatic message sent when event occurs. Push model vs polling.

**WebSocket**: Protocol providing full-duplex communication over single TCP connection. Enables real-time features (chat, live updates).

**Whitespace**: Characters not visible (spaces, tabs, newlines). Some languages (Python) use for structure; others ignore.

## X

**XHR (XMLHttpRequest)**: API for making HTTP requests from JavaScript. Used in AJAX for asynchronous updates.

**XML (eXtensible Markup Language)**: Markup language for encoding documents. Human-readable, self-documenting. More verbose than JSON.

**XSS (Cross-Site Scripting)**: Security vulnerability allowing attackers to inject malicious scripts. Prevent by sanitizing user input.

## Y

**YAML (YAML Ain't Markup Language)**: Human-readable data serialization format. Used for configuration files (Docker, Kubernetes).

**Yak Shaving**: Solving progressively disconnected problems to reach original goal. Example: fixing build tool to fix dependency to implement feature.

## Z

**Zero-Day**: Security vulnerability unknown to vendor. No patch available, making it dangerous.

**Zombie Process**: Terminated process still in process table. Waiting for parent to read exit status.

---

## Additional Terms by Category

### Programming Concepts

**Abstract Class**: Class that cannot be instantiated. Provides base for other classes to inherit.

**Access Modifier**: Keyword defining visibility (public, private, protected). Controls encapsulation.

**Anonymous Function**: Function without name. Lambda expressions or arrow functions.

**Callback**: Function passed as argument to another function. Executed after operation completes.

**Closure**: Function accessing variables from outer scope even after outer function returns.

**Constructor**: Special method called when creating object. Initializes object state.

**Dependency Injection**: Design pattern providing object's dependencies from outside. Improves testability.

**Destructor**: Method called when object is destroyed. Cleans up resources.

**Event Loop**: Programming construct waiting for and dispatching events. Foundation of asynchronous programming.

**Factory Pattern**: Design pattern creating objects without specifying exact class.

**Generator**: Function returning iterator. Produces values lazily (one at a time).

**Higher-Order Function**: Function taking or returning functions. Enables functional programming patterns.

**Interface Segregation**: Principle that clients shouldn't depend on interfaces they don't use.

**Memoization**: Optimization caching function results. Improves performance for expensive operations.

**Observer Pattern**: Design pattern where object (subject) notifies dependents (observers) of state changes.

**Pure Function**: Function with no side effects. Same input always produces same output.

**Setter/Getter**: Methods for accessing (getter) or modifying (setter) private properties.

**Side Effect**: Operation affecting state outside function. File I/O, modifying global variables.

**Type Inference**: Compiler determining variable type from context. Reduces boilerplate.

### Web Development

**Accessibility**: Designing products usable by people with disabilities. WCAG guidelines.

**AJAX (Asynchronous JavaScript and XML)**: Technique for updating parts of page without full reload.

**Bootstrap**: Popular CSS framework providing responsive components.

**CMS (Content Management System)**: Software for creating and managing digital content. Examples: WordPress, Drupal.

**CSP (Content Security Policy)**: Security standard preventing XSS attacks. Specifies trusted content sources.

**Fragment**: URL part after # symbol. References section within page.

**Hot Reload**: Development feature automatically updating application when code changes. No manual restart.

**JWT Claims**: Statements about entity (user). Included in JWT payload.

**Lazy Loading**: Deferring loading of resources until needed. Improves initial page load.

**Minification**: Removing unnecessary characters from code. Reduces file size for production.

**Progressive Web App (PWA)**: Web application functioning like native app. Offline support, push notifications.

**Responsive Design**: Approach making web pages adapt to screen sizes. Uses media queries, flexible layouts.

**SEO (Search Engine Optimization)**: Practices improving website visibility in search results.

**SPA (Single Page Application)**: Web app loading single page, dynamically updating content. React, Angular, Vue.

**SSR (Server-Side Rendering)**: Generating HTML on server instead of client. Improves SEO and initial load.

### Databases

**Aggregation**: Operation combining multiple values (SUM, AVG, COUNT, MAX, MIN).

**Denormalization**: Intentionally introducing redundancy to improve read performance.

**Foreign Key**: Column referencing primary key in another table. Enforces relationships.

**Join**: Combining rows from multiple tables based on related columns.

**Normalization**: Organizing database to reduce redundancy and improve integrity.

**Partition**: Dividing large table into smaller pieces. Improves query performance.

**Replication**: Copying data to multiple databases. Improves availability and read performance.

**Shard**: Horizontal partition distributing data across multiple servers.

**Stored Procedure**: Precompiled SQL code stored in database. Reusable, faster execution.

**Transaction Isolation Level**: Degree to which transactions are isolated from each other. Trade-off between consistency and concurrency.

**Trigger**: Automatically executed code when specific database event occurs.

**View**: Virtual table based on query. Simplifies complex queries, provides security.

### Security

**CSRF (Cross-Site Request Forgery)**: Attack forcing user to execute unwanted actions on authenticated site.

**DDoS (Distributed Denial of Service)**: Attack overwhelming system with traffic from multiple sources.

**HMAC (Hash-based Message Authentication Code)**: Cryptographic authentication verifying message integrity and authenticity.

**Man-in-the-Middle**: Attack intercepting communication between two parties.

**OAuth**: Open standard for access delegation. Allows third-party access without sharing passwords.

**Penetration Testing**: Simulated attack testing security. Identifies vulnerabilities.

**Phishing**: Fraudulent attempt obtaining sensitive information by impersonating trusted entity.

**Rate Limiting**: Restricting number of requests in time period. Prevents abuse.

**Salt**: Random data added to password before hashing. Prevents rainbow table attacks.

**SAML (Security Assertion Markup Language)**: XML-based standard for authentication and authorization.

**Threat Model**: Analysis identifying potential security threats. Guides security measures.

**Two-Factor Authentication (2FA)**: Authentication requiring two different factors. Something you know (password) + something you have (phone).

**Vulnerability**: Weakness in system that can be exploited. CVE (Common Vulnerabilities and Exposures) database tracks them.

### DevOps and Infrastructure

**Artifact**: File produced by build process. Compiled code, Docker images, packages.

**Blue-Green Deployment**: Two identical production environments. Switch traffic between them for zero-downtime deploys.

**Canary Deployment**: Gradual rollout to subset of users. Monitor before full deployment.

**Configuration Management**: Automating and tracking system configurations. Tools: Ansible, Puppet, Chef.

**Health Check**: Monitoring endpoint verifying service is operational. Used by load balancers.

**IaC (Infrastructure as Code)**: Managing infrastructure through code. Version controlled, reproducible.

**Immutable Infrastructure**: Servers never modified after deployment. Replace instead of update.

**Monitoring**: Continuous observation of system state. Metrics, logs, alerts.

**Observability**: Ability to understand system internal state from external outputs. Logs, metrics, traces.

**Orchestration**: Automated coordination of complex tasks. Kubernetes orchestrates containers.

**Provisioning**: Setting up infrastructure resources. Servers, networks, storage.

**Rolling Deployment**: Gradually replacing instances with new version. Minimizes downtime.

**Service Mesh**: Infrastructure layer handling service-to-service communication. Examples: Istio, Linkerd.

**Telemetry**: Automatic measurement and transmission of data. Metrics from distributed systems.

### Cloud Computing

**Auto-Scaling**: Automatically adjusting compute resources based on demand.

**Availability Zone**: Isolated location within region. Provides fault tolerance.

**CDN (Content Delivery Network)**: Distributed servers delivering content based on user location. Reduces latency.

**Elastic**: Ability to scale resources up or down based on need.

**Ephemeral Storage**: Temporary storage deleted when instance stops. Opposite of persistent.

**IaaS (Infrastructure as a Service)**: Cloud computing model providing virtualized resources. Examples: AWS EC2, Azure VMs.

**Multi-Tenancy**: Single instance serving multiple customers (tenants). Resources shared.

**PaaS (Platform as a Service)**: Cloud platform providing runtime environment. Examples: Heroku, Google App Engine.

**Region**: Geographic area containing multiple data centers. Choose region close to users.

**Serverless**: Execution model where cloud provider manages servers. Pay per execution. AWS Lambda, Azure Functions.

**SaaS (Software as a Service)**: Software delivered over internet. Examples: Gmail, Salesforce, Office 365.

**VPC (Virtual Private Cloud)**: Isolated section of cloud for your resources. Private network in cloud.

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

This glossary covers the essential vocabulary for understanding modern software engineering. As you encounter these terms in the guides, refer back here for quick definitions, then dive into the detailed guides for comprehensive explanations and examples.
