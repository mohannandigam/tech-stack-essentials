# API Design

## What is it?

API Design is the practice of creating interfaces that allow different software systems to communicate with each other. It defines how applications request and exchange data using rules, protocols, and standards that both sides understand.

Think of an API (Application Programming Interface) as a contract between two systems. One system provides services or data, and the other consumes them. Good API design makes this contract clear, predictable, and easy to use—while also being secure, scalable, and maintainable over time.

When we talk about API design, we're primarily discussing web APIs (also called HTTP APIs or REST APIs), which use the internet's infrastructure to send and receive data. These APIs power everything from mobile apps to microservices, from payment processing to social media integrations.

## Simple Analogy

An API is like a restaurant menu and ordering system:

- **The Menu (API Documentation)**: Shows what you can order, what ingredients are needed (parameters), and what you'll get back (response)
- **The Waiter (API Interface)**: Takes your order, validates it ("Sorry, we're out of that item"), communicates with the kitchen, and brings back your food
- **The Kitchen (Backend Service)**: Does the actual work but stays hidden from customers
- **Standard Ordering Process (HTTP Methods)**: Everyone knows how to order (GET to view menu, POST to place order, DELETE to cancel)
- **Order Number (API Keys/Authentication)**: Identifies your order and ensures only you can modify or cancel it

Just as a well-designed menu is organized, clear about portions and prices, and handles special requests gracefully, a well-designed API is intuitive, well-documented, and handles edge cases predictably.

## Why Does It Matter?

### Business Impact

**Developer Experience Drives Adoption**: If your API is confusing or poorly documented, developers will choose competitors. Companies like Stripe and Twilio succeeded partly because their APIs are exceptionally well-designed.

**Reduces Support Costs**: A clear, consistent API with good error messages means developers can self-serve instead of contacting support.

**Enables Ecosystem Growth**: Good APIs let third-party developers build integrations, extensions, and tools around your product—multiplying its value without your direct effort.

**Speeds Up Development**: Internal teams building mobile apps, web frontends, or partner integrations can move faster when APIs are predictable and well-documented.

### Technical Impact

**Prevents Breaking Changes**: Thoughtful API design and versioning strategies let you evolve systems without breaking existing clients.

**Improves Security**: Proper authentication, authorization, and input validation at the API layer protect your entire system.

**Enables Scalability**: APIs that support pagination, filtering, and efficient data formats reduce server load and network bandwidth.

**Facilitates Testing**: Well-designed APIs are easier to test, monitor, and debug because they have clear contracts and predictable behavior.

## How It Works

### The Request-Response Cycle

Every API interaction follows the same basic pattern:

```
1. Client prepares a request
   ↓
2. Client sends HTTP request (method + URL + headers + body)
   ↓
3. Server receives and validates the request
   ↓
4. Server authenticates and authorizes the client
   ↓
5. Server processes the request (reads/writes data, performs logic)
   ↓
6. Server prepares a response (status code + headers + body)
   ↓
7. Client receives and processes the response
```

### Anatomy of an HTTP Request

```
POST /api/v1/orders HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000

{
  "items": [
    {"product_id": "prod_123", "quantity": 2}
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "postal_code": "94102"
  }
}
```

**Components:**
- **Method (POST)**: What action to perform
- **Path (/api/v1/orders)**: Which resource to act on
- **Headers**: Metadata about the request (content type, authentication, tracing)
- **Body**: The data being sent (for POST, PUT, PATCH requests)

### Anatomy of an HTTP Response

```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/orders/ord_789
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-RateLimit-Remaining: 99

{
  "id": "ord_789",
  "status": "pending",
  "total": 49.99,
  "created_at": "2026-02-19T10:30:00Z",
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 2,
      "price": 24.99
    }
  ]
}
```

**Components:**
- **Status Code (201 Created)**: Outcome of the request
- **Headers**: Metadata about the response (content type, rate limits, pagination links)
- **Body**: The data being returned

## Key Concepts

### REST Principles

REST (Representational State Transfer) is an architectural style for designing networked applications. It's not a standard or protocol—it's a set of principles.

**Core REST Principles:**

1. **Client-Server Separation**: The client and server are independent. The server doesn't need to know about the UI, and the client doesn't need to know about data storage.

2. **Stateless**: Each request contains all information needed to process it. The server doesn't store client context between requests.

3. **Cacheable**: Responses must explicitly indicate if they can be cached to improve performance.

4. **Uniform Interface**: Resources are identified by URLs, manipulated through standard HTTP methods, and use self-descriptive messages.

5. **Layered System**: Client doesn't know if it's connected directly to the end server or an intermediary (like a load balancer or API gateway).

### Richardson Maturity Model

Leonard Richardson created a maturity model to evaluate how "RESTful" an API is. It has four levels:

```
Level 0: The Swamp of POX (Plain Old XML)
- Single URI, single HTTP method (usually POST)
- All operations are commands sent to one endpoint
- Example: XML-RPC, SOAP

Level 1: Resources
- Multiple URIs, one per resource
- Still using a single HTTP method for everything
- Example: POST /users, POST /products

Level 2: HTTP Verbs
- Multiple URIs (resources)
- Proper use of HTTP methods (GET, POST, PUT, DELETE)
- Proper use of HTTP status codes
- Most modern "REST" APIs are here

Level 3: Hypermedia Controls (HATEOAS)
- Level 2 plus hypermedia links in responses
- Client can discover available actions dynamically
- Rarely implemented in practice
```

**Most APIs target Level 2**, which provides a good balance of REST principles without the complexity of full hypermedia.

### HTTP Methods and Their Meanings

HTTP methods (also called "verbs") tell the server what operation to perform.

| Method | Purpose | Safe? | Idempotent? | Request Body? | Response Body? |
|--------|---------|-------|-------------|---------------|----------------|
| **GET** | Retrieve a resource | Yes | Yes | No | Yes |
| **POST** | Create a new resource | No | No | Yes | Yes |
| **PUT** | Replace an entire resource | No | Yes | Yes | Yes |
| **PATCH** | Partially update a resource | No | No | Yes | Yes |
| **DELETE** | Remove a resource | No | Yes | Optional | Optional |
| **HEAD** | Get headers only (no body) | Yes | Yes | No | No |
| **OPTIONS** | Discover allowed methods | Yes | Yes | No | Yes |

**Definitions:**
- **Safe**: Doesn't modify server state (read-only)
- **Idempotent**: Making the same request multiple times has the same effect as making it once

### When to Use Each HTTP Method

**GET - Retrieving Data**

Use GET when you want to read data without changing anything on the server.

```javascript
// Get a single resource
GET /api/v1/users/123

// Get a collection with filtering
GET /api/v1/products?category=electronics&price_max=500

// Get a nested resource
GET /api/v1/orders/456/items
```

**Best Practices:**
- Never use GET to modify data (no side effects)
- Always support filtering and pagination for collections
- Use query parameters for filters, sorting, pagination
- Cache aggressively (use ETags, Cache-Control headers)

**POST - Creating Resources**

Use POST when creating a new resource where the server generates the ID.

```javascript
// Create a new user
POST /api/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "Jane Doe"
}

// Response
HTTP/1.1 201 Created
Location: /api/v1/users/789

{
  "id": "789",
  "email": "user@example.com",
  "name": "Jane Doe",
  "created_at": "2026-02-19T10:30:00Z"
}
```

**Best Practices:**
- Return 201 Created with the new resource
- Include Location header pointing to the new resource
- Return the complete resource in the response body
- Validate all input thoroughly

**PUT - Replacing Resources**

Use PUT when replacing an entire resource. The client provides the complete new representation.

```javascript
// Replace entire user resource
PUT /api/v1/users/789
Content-Type: application/json

{
  "email": "newemail@example.com",
  "name": "Jane Smith",
  "bio": "Updated bio",
  "preferences": {
    "notifications": true,
    "theme": "dark"
  }
}
```

**Key Characteristics:**
- Idempotent: Calling it 5 times has the same effect as calling it once
- Must send the complete resource (missing fields may be deleted)
- Returns 200 OK with the updated resource, or 204 No Content

**PATCH - Partial Updates**

Use PATCH when updating only specific fields of a resource.

```javascript
// Update only the email
PATCH /api/v1/users/789
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

**Best Practices:**
- Only include fields that are changing
- Return 200 OK with the full updated resource
- Be explicit about what happens to nested objects
- Consider using JSON Patch format for complex updates

**DELETE - Removing Resources**

Use DELETE to remove a resource.

```javascript
// Delete a user
DELETE /api/v1/users/789

// Response
HTTP/1.1 204 No Content
```

**Best Practices:**
- Return 204 No Content (successful deletion, no body)
- Return 404 if the resource doesn't exist
- Idempotent: Deleting something twice should not error
- Consider soft deletes for important data (mark as deleted but keep in database)

### HTTP Status Codes

Status codes tell the client what happened with their request. Always use the most appropriate code.

**2xx - Success**
- **200 OK**: Request succeeded (GET, PUT, PATCH)
- **201 Created**: Resource created successfully (POST)
- **202 Accepted**: Request accepted, processing not complete (async operations)
- **204 No Content**: Success with no response body (DELETE, PUT)

**3xx - Redirection**
- **301 Moved Permanently**: Resource has a new permanent URL
- **302 Found**: Temporary redirect
- **304 Not Modified**: Cached version is still valid (use with ETags)

**4xx - Client Errors**
- **400 Bad Request**: Invalid request format or data
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **405 Method Not Allowed**: HTTP method not supported for this endpoint
- **409 Conflict**: Request conflicts with current state (e.g., duplicate email)
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded

**5xx - Server Errors**
- **500 Internal Server Error**: Generic server error
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Server temporarily unavailable
- **504 Gateway Timeout**: Upstream server didn't respond in time

### Error Response Format

Always return structured error responses with enough information for the client to handle the problem.

```javascript
// Example error response
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "message": "Email address is already registered",
        "code": "DUPLICATE_EMAIL"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "code": "PASSWORD_TOO_SHORT"
      }
    ],
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "documentation_url": "https://docs.example.com/errors/VALIDATION_ERROR"
  }
}
```

**Best Practices for Error Responses:**
- Use consistent error structure across all endpoints
- Include machine-readable error codes (not just messages)
- Provide field-level validation errors
- Include request_id for debugging and support
- Link to documentation for common errors
- Never expose internal implementation details (stack traces, SQL queries)

### API Versioning Strategies

APIs evolve over time. Versioning lets you make changes without breaking existing clients.

**1. URL Path Versioning (Most Common)**

```javascript
GET /api/v1/users/123
GET /api/v2/users/123
```

**Pros:**
- Extremely clear and visible
- Easy to route in API gateways
- Works with all HTTP clients

**Cons:**
- Creates URL duplication
- Appears in cache keys

**2. Header Versioning**

```javascript
GET /api/users/123
Accept: application/vnd.example.v2+json
```

**Pros:**
- Keeps URLs clean
- Follows HTTP content negotiation standards

**Cons:**
- Less visible (harder to test in browser)
- Requires custom header parsing

**3. Query Parameter Versioning**

```javascript
GET /api/users/123?version=2
```

**Pros:**
- Easy to implement
- Visible in URLs

**Cons:**
- Mixes versioning with filtering
- Can interfere with caching

**4. Content Negotiation**

```javascript
GET /api/users/123
Accept: application/vnd.example+json; version=2
```

**Pros:**
- Standards-compliant
- Separates content type from version

**Cons:**
- Complex header parsing
- Less developer-friendly

**Recommendation**: Use URL path versioning (v1, v2) for simplicity and clarity. Only increment the major version for breaking changes.

### Pagination Strategies

When returning large collections, always paginate to avoid overwhelming clients and servers.

**1. Offset-Based Pagination (Page Numbers)**

Simple but has performance issues with large datasets.

```javascript
// Request
GET /api/v1/products?page=2&limit=20

// Response
{
  "data": [/* 20 products */],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total_pages": 50,
    "total_count": 1000
  },
  "links": {
    "first": "/api/v1/products?page=1&limit=20",
    "prev": "/api/v1/products?page=1&limit=20",
    "next": "/api/v1/products?page=3&limit=20",
    "last": "/api/v1/products?page=50&limit=20"
  }
}
```

**Pros:**
- Easy to understand
- Can jump to any page
- Shows total count

**Cons:**
- Performance degrades on large offsets
- Inconsistent results if data changes between requests
- Database query: `OFFSET 10000 LIMIT 20` scans and discards 10000 rows

**2. Cursor-Based Pagination (Recommended)**

Uses an opaque token to track position. More efficient and consistent.

```javascript
// Request (first page)
GET /api/v1/products?limit=20

// Response
{
  "data": [/* 20 products */],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzLCJjcmVhdGVkX2F0IjoiMjAyNi0wMi0xOSJ9",
    "has_more": true
  },
  "links": {
    "next": "/api/v1/products?limit=20&cursor=eyJpZCI6MTIzLCJjcmVhdGVkX2F0IjoiMjAyNi0wMi0xOSJ9"
  }
}

// Request (next page)
GET /api/v1/products?limit=20&cursor=eyJpZCI6MTIzLCJjcmVhdGVkX2F0IjoiMjAyNi0wMi0xOSJ9
```

**How Cursor Works:**

The cursor encodes the position in the dataset. For example, it might contain:

```javascript
// Decoded cursor
{
  "id": 123,
  "created_at": "2026-02-19T10:30:00Z"
}

// SQL query using cursor
SELECT * FROM products
WHERE (created_at, id) > ('2026-02-19T10:30:00Z', 123)
ORDER BY created_at, id
LIMIT 20
```

**Pros:**
- Consistent performance regardless of position
- Handles data changes gracefully (no skipped/duplicate items)
- More efficient for large datasets

**Cons:**
- Can't jump to arbitrary pages
- No total count (expensive to calculate)
- Cursor format tied to implementation

**3. Keyset Pagination (Seek Method)**

Similar to cursor-based but uses explicit fields instead of opaque tokens.

```javascript
// Request
GET /api/v1/products?limit=20&after_id=123

// Response
{
  "data": [/* 20 products */],
  "pagination": {
    "after_id": 143,
    "has_more": true
  }
}
```

**Pros:**
- More transparent than cursors
- Efficient performance

**Cons:**
- Requires indexed fields
- Complex with multiple sort fields

**Recommendation**: Use cursor-based pagination for most APIs. Use offset-based only for small datasets or when page jumping is required.

### Rate Limiting and Throttling

Rate limiting protects your API from overuse, whether accidental or malicious.

**Why Rate Limiting Matters:**
- Prevents abuse and DDoS attacks
- Ensures fair resource distribution
- Protects backend services from overload
- Enables tiered pricing (basic vs premium plans)

**Common Rate Limiting Strategies:**

1. **Fixed Window**: 100 requests per minute
2. **Sliding Window**: 100 requests in any 60-second period
3. **Token Bucket**: Allows bursts but average rate limited
4. **Concurrent Request Limiting**: Max 5 concurrent connections

**Rate Limit Headers:**

```javascript
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1645283400

// When rate limit exceeded
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1645283400

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Best Practices:**
- Always return rate limit headers with every response
- Use 429 status code when limit exceeded
- Include Retry-After header
- Document rate limits clearly
- Consider different limits for different endpoints (e.g., writes vs reads)
- Implement graceful degradation (e.g., reduce to read-only mode)

### Authentication and Authorization

APIs need to verify who is making the request (authentication) and what they're allowed to do (authorization).

**Common Authentication Patterns:**

**1. API Keys**

Simple but limited. Good for server-to-server communication.

```javascript
GET /api/v1/users
X-API-Key: sk_live_1234567890abcdef
```

**Pros:**
- Simple to implement
- Easy to revoke

**Cons:**
- No built-in expiration
- Hard to manage permissions
- Less secure (often long-lived)

**2. JWT (JSON Web Tokens)**

Self-contained tokens that carry user identity and claims.

```javascript
GET /api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

// Decoded JWT payload
{
  "sub": "user_123",
  "email": "user@example.com",
  "role": "admin",
  "exp": 1645287000,
  "iat": 1645283400
}
```

**Pros:**
- Stateless (no server-side session storage)
- Contains user information (reduces database lookups)
- Supports expiration

**Cons:**
- Can't revoke before expiration (use short TTL + refresh tokens)
- Token size can be large
- Requires secure key management

**3. OAuth 2.0**

Industry standard for delegated authorization. Used when third-party apps need access to user data.

```javascript
// 1. Get authorization code
GET /oauth/authorize?
  response_type=code&
  client_id=abc123&
  redirect_uri=https://client.example.com/callback&
  scope=read:profile write:posts

// 2. Exchange code for token
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=xyz789&
client_id=abc123&
client_secret=secret123&
redirect_uri=https://client.example.com/callback

// 3. Use access token
GET /api/v1/users/me
Authorization: Bearer ya29.a0AfH6SMBx...
```

**Pros:**
- Industry standard
- Supports scopes (fine-grained permissions)
- Secure delegation without sharing passwords

**Cons:**
- Complex to implement
- Multiple flows (authorization code, client credentials, implicit)
- Requires OAuth provider

**Best Practices:**
- Use HTTPS always (never send credentials over HTTP)
- Implement token expiration and refresh mechanisms
- Store secrets securely (use environment variables, secret managers)
- Log authentication attempts (detect brute force attacks)
- Implement account lockout after failed attempts
- Use scopes to limit token permissions

### API Gateway Pattern

An API Gateway sits between clients and backend services, handling cross-cutting concerns.

```
┌─────────┐
│  Mobile │
│   App   │
└────┬────┘
     │
┌────┴────┐
│   Web   │
│   App   │
└────┬────┘
     │
     ├──────────► ┌────────────────┐      ┌──────────────┐
     │            │                │      │    User      │
     └──────────► │  API Gateway   │─────►│   Service    │
                  │                │      └──────────────┘
                  │  - Auth        │      ┌──────────────┐
                  │  - Rate Limit  │─────►│   Order      │
                  │  - Logging     │      │   Service    │
                  │  - Caching     │      └──────────────┘
                  │  - Transform   │      ┌──────────────┐
                  └────────────────┘─────►│  Inventory   │
                                           │   Service    │
                                           └──────────────┘
```

**API Gateway Responsibilities:**

1. **Authentication & Authorization**: Verify tokens before forwarding requests
2. **Rate Limiting**: Enforce limits per user/client
3. **Request Routing**: Direct requests to appropriate backend services
4. **Protocol Translation**: Convert REST to gRPC, WebSocket, etc.
5. **Response Aggregation**: Combine multiple backend calls into one response
6. **Caching**: Cache frequently requested data
7. **Logging & Monitoring**: Track all API traffic
8. **Load Balancing**: Distribute requests across service instances

**Popular API Gateway Solutions:**
- AWS API Gateway
- Kong
- NGINX
- Apigee
- Azure API Management

### OpenAPI/Swagger Specification

OpenAPI (formerly Swagger) is a standard format for describing REST APIs. It enables automatic documentation, client generation, and validation.

```yaml
openapi: 3.0.0
info:
  title: E-commerce API
  version: 1.0.0
  description: API for managing products and orders

servers:
  - url: https://api.example.com/v1
    description: Production server

paths:
  /products:
    get:
      summary: List all products
      parameters:
        - name: category
          in: query
          description: Filter by category
          required: false
          schema:
            type: string
        - name: limit
          in: query
          description: Number of items to return
          required: false
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /products/{id}:
    get:
      summary: Get a product by ID
      parameters:
        - name: id
          in: path
          required: true
          description: Product ID
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
      properties:
        id:
          type: string
          example: "prod_123"
        name:
          type: string
          example: "Wireless Headphones"
        description:
          type: string
        price:
          type: number
          format: float
          example: 79.99
        category:
          type: string
          example: "electronics"
        created_at:
          type: string
          format: date-time

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total_count:
          type: integer

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: array
          items:
            type: object
        request_id:
          type: string

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

**Benefits of OpenAPI:**
- **Interactive Documentation**: Tools like Swagger UI generate browsable docs
- **Client Generation**: Auto-generate SDKs in multiple languages
- **Server Stubs**: Generate server code from specification
- **Validation**: Validate requests/responses against schema
- **Contract Testing**: Ensure API matches specification

### gRPC vs REST

gRPC is an alternative to REST APIs, using Protocol Buffers and HTTP/2.

**REST API Example:**

```javascript
// REST Request
GET /api/v1/users/123
Accept: application/json

// REST Response
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "123",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**gRPC Example:**

```protobuf
// user.proto
syntax = "proto3";

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
}

message GetUserRequest {
  string id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

```javascript
// gRPC Client
const user = await client.getUser({ id: '123' });
console.log(user.name); // "Jane Doe"
```

**Comparison:**

| Aspect | REST | gRPC |
|--------|------|------|
| Protocol | HTTP/1.1 | HTTP/2 |
| Data Format | JSON (text) | Protocol Buffers (binary) |
| Performance | Good | Excellent (smaller payloads) |
| Browser Support | Native | Requires proxy (gRPC-Web) |
| Streaming | Limited | Bidirectional streaming |
| Human Readable | Yes (JSON) | No (binary) |
| Tooling | Extensive | Growing |
| Learning Curve | Easy | Moderate |

**When to Use REST:**
- Public APIs (easier for third-party developers)
- Browser-based applications
- Simple CRUD operations
- When human readability matters

**When to Use gRPC:**
- Internal microservices communication
- High-performance requirements
- Real-time streaming data
- Polyglot environments (strong typing across languages)

## Best Practices

### Safety: Input Validation and Security

**1. Validate All Inputs**

Never trust client data. Validate every field for type, format, and constraints.

```python
from pydantic import BaseModel, EmailStr, validator

class CreateUserRequest(BaseModel):
    email: EmailStr  # Validates email format
    name: str
    age: int

    @validator('name')
    def name_must_not_be_empty(cls, v):
        """Ensure name is not empty or just whitespace."""
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('age')
    def age_must_be_reasonable(cls, v):
        """Ensure age is within realistic bounds."""
        if v < 0 or v > 150:
            raise ValueError('Age must be between 0 and 150')
        return v

# Usage in API endpoint
@app.post('/api/v1/users')
def create_user(request: CreateUserRequest):
    """
    Create a new user with validated input.

    Why we validate:
    - Prevents injection attacks (SQL, XSS, command injection)
    - Ensures data consistency in database
    - Provides clear error messages to clients
    - Catches bugs early before they cause data corruption
    """
    try:
        user = User.create(
            email=request.email,
            name=request.name,
            age=request.age
        )
        logger.info(f"User created: {user.id}", extra={
            'user_id': user.id,
            'email': request.email
        })
        return {'id': user.id, 'email': user.email}
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}", extra={
            'email': request.email
        })
        raise HTTPException(status_code=422, detail=str(e))
```

**2. Sanitize Output**

Prevent injection attacks by escaping or removing dangerous characters.

```python
import html
import bleach

def sanitize_user_content(content: str) -> str:
    """
    Remove dangerous HTML/JavaScript from user-provided content.

    Why we do this:
    - Prevents XSS (Cross-Site Scripting) attacks
    - Protects users from malicious content
    - Allows safe rendering in web browsers

    Best Practices:
    - Use allowlist approach (specify allowed tags/attributes)
    - Escape HTML entities
    - Remove script tags and event handlers
    """
    # Allow only safe HTML tags
    allowed_tags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li']
    allowed_attrs = {}

    cleaned = bleach.clean(
        content,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )

    return cleaned
```

**3. Implement Authentication & Authorization**

```python
from functools import wraps
from flask import request, jsonify
import jwt

def require_auth(f):
    """
    Decorator to require valid JWT authentication.

    Why we need this:
    - Ensures only authenticated users can access endpoints
    - Verifies token integrity (hasn't been tampered with)
    - Checks token expiration
    - Logs authentication attempts for security monitoring
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')

        if not token:
            logger.warning('Authentication failed: No token provided', extra={
                'ip': request.remote_addr,
                'endpoint': request.path
            })
            return jsonify({'error': 'Authentication required'}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = payload['sub']
            request.user_role = payload.get('role', 'user')

        except jwt.ExpiredSignatureError:
            logger.warning('Authentication failed: Token expired', extra={
                'ip': request.remote_addr
            })
            return jsonify({'error': 'Token expired'}), 401

        except jwt.InvalidTokenError:
            logger.warning('Authentication failed: Invalid token', extra={
                'ip': request.remote_addr
            })
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated

def require_role(required_role: str):
    """
    Decorator to require specific role for authorization.

    Why we need this:
    - Implements principle of least privilege
    - Prevents unauthorized access to sensitive operations
    - Centralized authorization logic
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if request.user_role != required_role:
                logger.warning(
                    f'Authorization failed: User role {request.user_role} '
                    f'cannot access {required_role} endpoint',
                    extra={
                        'user_id': request.user_id,
                        'required_role': required_role,
                        'user_role': request.user_role
                    }
                )
                return jsonify({'error': 'Forbidden'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

# Usage
@app.delete('/api/v1/users/<user_id>')
@require_auth
@require_role('admin')
def delete_user(user_id):
    """Only authenticated admins can delete users."""
    user = User.get(user_id)
    user.delete()
    return '', 204
```

**4. Prevent Rate Limit Abuse**

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.post('/api/v1/orders')
@limiter.limit("10 per minute")
def create_order():
    """
    Rate limit order creation to prevent abuse.

    Why we rate limit:
    - Prevents DDoS attacks
    - Stops automated abuse (scalping bots, spam)
    - Protects backend services from overload
    - Ensures fair resource distribution

    Best Practices:
    - Use different limits for different endpoints
    - Rate limit by user ID for authenticated endpoints
    - Return clear error messages with retry time
    - Log rate limit violations (detect attackers)
    """
    pass
```

### Quality: Testing and Validation

**1. API Contract Testing**

Ensure your API matches its specification.

```python
import pytest
from openapi_core import create_spec
from openapi_core.validation.request import openapi_request_validator
from openapi_core.validation.response import openapi_response_validator

def test_get_user_matches_openapi_spec():
    """
    Verify GET /users/{id} response matches OpenAPI specification.

    Why we do this:
    - Catches breaking changes before deployment
    - Ensures documentation stays in sync with implementation
    - Validates data types, required fields, status codes
    - Builds client confidence in API stability
    """
    # Load OpenAPI spec
    spec = create_spec('openapi.yaml')

    # Make API request
    response = client.get('/api/v1/users/123')

    # Validate response against spec
    validator = openapi_response_validator(spec)
    result = validator.validate(response)

    assert result.errors == [], f"OpenAPI validation errors: {result.errors}"
    assert response.status_code == 200
    assert 'id' in response.json
    assert 'email' in response.json
```

**2. Integration Testing**

Test complete workflows, not just individual endpoints.

```python
def test_user_registration_and_login_flow():
    """
    Test complete user journey from registration to authentication.

    Why integration tests:
    - Verify multiple systems work together
    - Catch issues that unit tests miss
    - Validate end-to-end user experience
    - Test real database, authentication, etc.
    """
    # Step 1: Register new user
    register_response = client.post('/api/v1/users', json={
        'email': 'test@example.com',
        'password': 'SecurePass123!',
        'name': 'Test User'
    })
    assert register_response.status_code == 201
    user_id = register_response.json['id']

    # Step 2: Login with credentials
    login_response = client.post('/api/v1/auth/login', json={
        'email': 'test@example.com',
        'password': 'SecurePass123!'
    })
    assert login_response.status_code == 200
    token = login_response.json['access_token']

    # Step 3: Access protected resource
    profile_response = client.get(
        '/api/v1/users/me',
        headers={'Authorization': f'Bearer {token}'}
    )
    assert profile_response.status_code == 200
    assert profile_response.json['id'] == user_id
```

**3. Error Scenario Testing**

Test how your API handles failures.

```python
def test_duplicate_email_returns_409():
    """
    Verify appropriate error when registering duplicate email.

    Why test error cases:
    - Most bugs occur in error handling paths
    - Ensures clients get actionable error messages
    - Validates proper status codes
    - Tests security (no information leakage)
    """
    # Create first user
    client.post('/api/v1/users', json={
        'email': 'test@example.com',
        'name': 'User 1'
    })

    # Try to create duplicate
    response = client.post('/api/v1/users', json={
        'email': 'test@example.com',
        'name': 'User 2'
    })

    assert response.status_code == 409
    assert 'email' in response.json['error']['message'].lower()
    assert 'request_id' in response.json['error']

def test_invalid_token_returns_401():
    """Verify authentication failure with invalid token."""
    response = client.get(
        '/api/v1/users/me',
        headers={'Authorization': 'Bearer invalid_token'}
    )
    assert response.status_code == 401
    assert 'error' in response.json
```

### Logging: Observability and Debugging

**1. Structured Logging**

Use consistent, machine-readable log formats.

```python
import logging
import json
from datetime import datetime

class StructuredLogger:
    """
    Logger that outputs structured JSON logs.

    Why structured logging:
    - Easy to search and filter in log aggregation tools
    - Consistent format across all services
    - Includes context for debugging
    - Supports correlation across services
    """

    def __init__(self, service_name):
        self.service_name = service_name
        self.logger = logging.getLogger(service_name)

    def _log(self, level, message, **extra):
        """Create structured log entry."""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'service': self.service_name,
            'level': level,
            'message': message,
            **extra
        }
        self.logger.log(getattr(logging, level), json.dumps(log_entry))

    def info(self, message, **extra):
        self._log('INFO', message, **extra)

    def error(self, message, **extra):
        self._log('ERROR', message, **extra)

    def warning(self, message, **extra):
        self._log('WARNING', message, **extra)

# Usage in API
logger = StructuredLogger('api-service')

@app.post('/api/v1/orders')
def create_order():
    """
    Create order with comprehensive logging.

    Best Practices:
    - Log at entry and exit points
    - Include correlation IDs for tracing
    - Log business metrics (not just errors)
    - Never log sensitive data (passwords, tokens, PII)
    """
    request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))

    logger.info('Order creation started',
        request_id=request_id,
        user_id=request.user_id,
        items_count=len(request.json['items'])
    )

    try:
        order = create_order_logic(request.json)

        logger.info('Order created successfully',
            request_id=request_id,
            order_id=order.id,
            total_amount=order.total,
            duration_ms=elapsed_time
        )

        return {'id': order.id}, 201

    except InsufficientInventoryError as e:
        logger.warning('Order failed: insufficient inventory',
            request_id=request_id,
            product_id=e.product_id,
            requested_qty=e.requested,
            available_qty=e.available
        )
        return {'error': 'Insufficient inventory'}, 409

    except Exception as e:
        logger.error('Order creation failed',
            request_id=request_id,
            error_type=type(e).__name__,
            error_message=str(e),
            exc_info=True
        )
        return {'error': 'Internal server error'}, 500
```

**2. Request/Response Logging Middleware**

```python
import time

@app.before_request
def log_request():
    """
    Log all incoming requests.

    Why we log requests:
    - Track API usage patterns
    - Debug client issues
    - Detect security threats
    - Monitor performance

    Best Practices:
    - Don't log sensitive data (passwords, tokens in body)
    - Include correlation IDs
    - Log before processing (capture all attempts)
    """
    request.start_time = time.time()

    logger.info('Request received',
        request_id=request.headers.get('X-Request-ID'),
        method=request.method,
        path=request.path,
        query_params=dict(request.args),
        user_agent=request.headers.get('User-Agent'),
        ip=request.remote_addr
    )

@app.after_request
def log_response(response):
    """
    Log all outgoing responses.

    Why we log responses:
    - Track error rates
    - Monitor response times
    - Correlate with requests
    - Calculate SLOs
    """
    duration_ms = (time.time() - request.start_time) * 1000

    logger.info('Response sent',
        request_id=request.headers.get('X-Request-ID'),
        status_code=response.status_code,
        duration_ms=duration_ms,
        response_size=len(response.data)
    )

    return response
```

**3. Distributed Tracing**

Track requests across multiple services.

```python
import opentelemetry

@app.route('/api/v1/orders', methods=['POST'])
def create_order():
    """
    Create order with distributed tracing.

    Why distributed tracing:
    - Debug issues in microservice architectures
    - Identify slow service dependencies
    - Visualize request flow across services
    - Calculate end-to-end latency

    Best Practices:
    - Propagate trace context to downstream services
    - Add custom spans for important operations
    - Tag spans with relevant metadata
    - Sample traces (don't trace every request in production)
    """
    tracer = opentelemetry.trace.get_tracer(__name__)

    with tracer.start_as_current_span("create_order") as span:
        span.set_attribute("user.id", request.user_id)
        span.set_attribute("order.items_count", len(request.json['items']))

        # Call inventory service
        with tracer.start_as_current_span("check_inventory"):
            inventory_available = inventory_service.check(request.json['items'])

        if not inventory_available:
            span.set_attribute("error", True)
            span.set_attribute("error.reason", "insufficient_inventory")
            return {'error': 'Insufficient inventory'}, 409

        # Call payment service
        with tracer.start_as_current_span("process_payment"):
            payment = payment_service.charge(request.json['payment'])

        # Create order
        order = Order.create(items=request.json['items'], payment_id=payment.id)

        span.set_attribute("order.id", order.id)
        span.set_attribute("order.total", order.total)

        return {'id': order.id}, 201
```

## Use Cases

### E-commerce Platform

**Scenario**: An online retailer needs APIs for product browsing, cart management, and checkout.

**API Design Decisions:**

```
Product Catalog:
GET    /api/v1/products              # List products with filtering/pagination
GET    /api/v1/products/{id}         # Get product details
GET    /api/v1/categories            # List categories
GET    /api/v1/products/{id}/reviews # Get product reviews

Shopping Cart:
GET    /api/v1/cart                  # Get current user's cart
POST   /api/v1/cart/items            # Add item to cart
PATCH  /api/v1/cart/items/{id}       # Update quantity
DELETE /api/v1/cart/items/{id}       # Remove item from cart

Orders:
POST   /api/v1/orders                # Create order (checkout)
GET    /api/v1/orders                # List user's orders
GET    /api/v1/orders/{id}           # Get order details
POST   /api/v1/orders/{id}/cancel    # Cancel order
```

**Why This Design:**
- **Resource-based URLs**: Each noun (products, cart, orders) is a resource
- **Nested resources**: `/products/{id}/reviews` shows relationship
- **Action endpoints**: `/orders/{id}/cancel` for non-CRUD operations
- **Idempotent cart operations**: Adding same item twice updates quantity
- **Cursor pagination**: Product lists can be very large

### Banking API

**Scenario**: A bank provides APIs for account management and transactions with strict security requirements.

**API Design Decisions:**

```
Accounts:
GET    /api/v1/accounts              # List user's accounts
GET    /api/v1/accounts/{id}         # Get account details
GET    /api/v1/accounts/{id}/balance # Get current balance

Transactions:
GET    /api/v1/accounts/{id}/transactions  # List transactions
POST   /api/v1/transfers                   # Create transfer (2FA required)
GET    /api/v1/transfers/{id}              # Get transfer status

Statements:
POST   /api/v1/accounts/{id}/statements    # Request statement generation
GET    /api/v1/statements/{id}             # Download statement (PDF)
```

**Why This Design:**
- **Read-heavy optimizations**: Separate balance endpoint (cached aggressively)
- **Idempotency keys**: Transfers require `Idempotency-Key` header to prevent double-charging
- **2FA verification**: Transfers require second factor (SMS, OTP)
- **Audit logging**: Every request logged with retention for compliance
- **Rate limiting**: Aggressive limits on transfer endpoints
- **Async operations**: Statement generation returns 202 Accepted, client polls for completion

### SaaS Analytics Platform

**Scenario**: An analytics platform ingests events from customer applications and provides query APIs.

**API Design Decisions:**

```
Event Ingestion:
POST   /api/v1/events                # Ingest single event
POST   /api/v1/events/batch          # Ingest multiple events (up to 1000)

Querying:
POST   /api/v1/queries               # Create query (async)
GET    /api/v1/queries/{id}          # Get query status and results
DELETE /api/v1/queries/{id}          # Cancel running query

Dashboards:
GET    /api/v1/dashboards            # List user's dashboards
POST   /api/v1/dashboards            # Create dashboard
PATCH  /api/v1/dashboards/{id}       # Update dashboard
```

**Why This Design:**
- **Batch ingestion**: Reduces network overhead for high-volume events
- **Async queries**: Long-running queries return immediately with job ID
- **Webhook notifications**: Optional webhook when query completes
- **Query caching**: Identical queries return cached results
- **Compressed payloads**: Events can be gzip-compressed to reduce bandwidth

### Healthcare API (HIPAA-Compliant)

**Scenario**: A healthcare provider needs APIs for patient records with strict privacy and compliance requirements.

**API Design Decisions:**

```
Patients:
GET    /api/v1/patients              # List patients (filtered by provider)
GET    /api/v1/patients/{id}         # Get patient demographics
GET    /api/v1/patients/{id}/records # Get medical records (role-based)

Appointments:
GET    /api/v1/appointments          # List appointments
POST   /api/v1/appointments          # Schedule appointment
PATCH  /api/v1/appointments/{id}     # Reschedule
DELETE /api/v1/appointments/{id}     # Cancel appointment

Prescriptions:
POST   /api/v1/prescriptions         # Create prescription (requires MD role)
GET    /api/v1/prescriptions/{id}    # Get prescription details
```

**Why This Design:**
- **Role-based access**: Nurses, doctors, admins have different permissions
- **Audit trails**: Every access to patient records logged for HIPAA compliance
- **Data minimization**: Responses only include fields user is authorized to see
- **PII encryption**: Patient data encrypted at rest and in transit
- **Consent checks**: API validates patient consent before sharing data
- **No caching**: Patient data never cached due to sensitivity

## Common Pitfalls

### 1. Breaking Backward Compatibility

**Problem**: Changing API responses breaks existing clients.

**Example of Breaking Change:**

```javascript
// v1: Returns object
GET /api/v1/users/123
{
  "id": "123",
  "name": "Jane Doe"
}

// v2: Returns array (BREAKING CHANGE!)
GET /api/v1/users/123
[
  {
    "id": "123",
    "name": "Jane Doe"
  }
]
```

**Solution**: Use API versioning and maintain old versions.

```javascript
// Keep v1 unchanged
GET /api/v1/users/123
{ "id": "123", "name": "Jane Doe" }

// Introduce v2 with new format
GET /api/v2/users/123
{
  "data": [
    { "id": "123", "name": "Jane Doe" }
  ]
}
```

**Safe Changes (Non-Breaking):**
- Adding new optional fields
- Adding new endpoints
- Adding new optional query parameters
- Making required fields optional

**Breaking Changes (Require New Version):**
- Removing fields
- Renaming fields
- Changing data types
- Making optional fields required
- Changing response structure

### 2. Returning Too Much Data

**Problem**: Returning entire objects when client needs only specific fields wastes bandwidth and exposes unnecessary data.

**Bad Example:**

```javascript
GET /api/v1/users
[
  {
    "id": "123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "password_hash": "...",  // Should never be exposed!
    "ssn": "123-45-6789",    // Unnecessary PII exposure
    "internal_notes": "...", // Internal data leak
    "created_at": "...",
    "updated_at": "...",
    "last_login": "...",
    "failed_login_attempts": 0,
    "account_locked": false
  }
]
```

**Solution**: Use field selection and pagination.

```javascript
// Return only necessary fields by default
GET /api/v1/users
[
  {
    "id": "123",
    "name": "Jane Doe",
    "email": "user@example.com"
  }
]

// Let client request specific fields
GET /api/v1/users?fields=id,name,last_login
[
  {
    "id": "123",
    "name": "Jane Doe",
    "last_login": "2026-02-19T10:30:00Z"
  }
]
```

### 3. Using Wrong HTTP Methods

**Problem**: Using POST for everything or GET for operations that modify data.

**Bad Examples:**

```javascript
// Using GET to delete (WRONG!)
GET /api/v1/users/delete?id=123

// Using POST for everything (WRONG!)
POST /api/v1/users/get
{ "id": "123" }

POST /api/v1/users/update
{ "id": "123", "name": "New Name" }
```

**Correct Usage:**

```javascript
GET    /api/v1/users/123      # Retrieve
POST   /api/v1/users           # Create
PUT    /api/v1/users/123       # Replace
PATCH  /api/v1/users/123       # Update
DELETE /api/v1/users/123       # Delete
```

### 4. Inconsistent Naming Conventions

**Problem**: Mixing different naming styles confuses developers.

**Bad Example:**

```javascript
{
  "UserID": "123",              // PascalCase
  "user_name": "Jane",          // snake_case
  "userEmail": "user@email.com", // camelCase
  "USER-ROLE": "admin"          // kebab-case with caps
}
```

**Solution**: Pick one convention and stick to it.

```javascript
// Good: Consistent camelCase
{
  "userId": "123",
  "userName": "Jane",
  "userEmail": "user@email.com",
  "userRole": "admin"
}
```

**Best Practice**: Use camelCase for JSON APIs (matches JavaScript convention).

### 5. Not Implementing Pagination

**Problem**: Returning thousands of results in one response overwhelms clients and servers.

**Bad Example:**

```javascript
GET /api/v1/products
// Returns 50,000 products (100MB response)
```

**Solution**: Always paginate collections.

```javascript
GET /api/v1/products?limit=20&cursor=abc123
{
  "data": [/* 20 products */],
  "pagination": {
    "next_cursor": "xyz789",
    "has_more": true
  }
}
```

### 6. Poor Error Messages

**Problem**: Generic error messages don't help developers fix issues.

**Bad Example:**

```javascript
HTTP/1.1 400 Bad Request
{
  "error": "Invalid input"
}
```

**Solution**: Provide detailed, actionable error messages.

```javascript
HTTP/1.1 422 Unprocessable Entity
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "message": "Email address is already registered",
        "code": "DUPLICATE_EMAIL"
      }
    ],
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "documentation_url": "https://docs.example.com/errors/VALIDATION_ERROR"
  }
}
```

### 7. Not Versioning Your API

**Problem**: Impossible to evolve API without breaking clients.

**Bad Approach:**

```javascript
// Make breaking change to /api/users
// All existing clients break immediately
```

**Solution**: Version from day one.

```javascript
// Start with v1
GET /api/v1/users

// Introduce v2 when needed
GET /api/v2/users

// Keep v1 running for transition period
```

## Quick Reference

### HTTP Method Decision Tree

```
Do you want to read data?
├─ Yes → Use GET
└─ No → Do you want to create a new resource?
    ├─ Yes → Use POST
    └─ No → Do you want to replace entire resource?
        ├─ Yes → Use PUT
        └─ No → Do you want to update parts of a resource?
            ├─ Yes → Use PATCH
            └─ No → Do you want to delete?
                ├─ Yes → Use DELETE
                └─ No → Use POST with action in path
```

### Status Code Quick Guide

| Scenario | Status Code | Example |
|----------|-------------|---------|
| Successfully retrieved data | 200 OK | GET request returned data |
| Successfully created resource | 201 Created | POST created new user |
| Successfully updated (no body) | 204 No Content | DELETE succeeded |
| Invalid request format | 400 Bad Request | Malformed JSON |
| Not authenticated | 401 Unauthorized | Missing/invalid token |
| Authenticated but not authorized | 403 Forbidden | User can't access resource |
| Resource doesn't exist | 404 Not Found | User ID doesn't exist |
| HTTP method not allowed | 405 Method Not Allowed | DELETE on read-only resource |
| Data conflict | 409 Conflict | Duplicate email |
| Validation failed | 422 Unprocessable Entity | Password too short |
| Rate limit exceeded | 429 Too Many Requests | Made too many requests |
| Server error | 500 Internal Server Error | Unhandled exception |
| Service temporarily unavailable | 503 Service Unavailable | Database down |

### Pagination Strategy Comparison

| Approach | Best For | Pros | Cons |
|----------|----------|------|------|
| **Offset** | Small datasets, UIs with page numbers | Simple, can jump to any page | Slow on large offsets, inconsistent with changes |
| **Cursor** | Large datasets, infinite scroll | Fast, consistent results | Can't jump to arbitrary page, no total count |
| **Keyset** | Time-series data, sorted lists | Fast, works with database indexes | Complex with multiple sort fields |

### API Design Checklist

**Before Launch:**
- [ ] All endpoints use appropriate HTTP methods
- [ ] Status codes match HTTP semantics
- [ ] Error responses include codes, messages, and request IDs
- [ ] Collections are paginated
- [ ] Rate limiting implemented
- [ ] Authentication required for protected endpoints
- [ ] Input validation on all fields
- [ ] Output doesn't include sensitive data
- [ ] API versioned (starts with v1)
- [ ] OpenAPI specification created
- [ ] Interactive documentation published
- [ ] Comprehensive tests written (happy path + error cases)
- [ ] Logging and monitoring in place
- [ ] Security review completed

**For Production:**
- [ ] HTTPS enforced (no HTTP)
- [ ] CORS configured properly
- [ ] Secrets stored in environment variables
- [ ] Database queries optimized (use indexes)
- [ ] Caching strategy implemented
- [ ] API gateway configured
- [ ] Distributed tracing enabled
- [ ] Alerts set up for errors and latency
- [ ] Load tested
- [ ] Disaster recovery plan documented

## Related Topics

### In This Repository

- **[Microservices Architecture](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/microservices/README.md)**: Learn how APIs enable service-to-service communication in distributed systems
- **[GraphQL](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/graphql/README.md)**: Explore an alternative API paradigm that lets clients request exactly the data they need
- **[Event-Driven Architecture](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/event-driven/README.md)**: Understand asynchronous communication patterns as a complement to synchronous APIs
- **[System Design Concepts](/home/runner/work/tech-stack-essentials/tech-stack-essentials/02-architectures/system-design-concepts/README.md)**: Apply API design principles to larger architectural decisions
- **[Security Best Practices](/home/runner/work/tech-stack-essentials/tech-stack-essentials/08-security)**: Deep dive into authentication, authorization, and API security

### External Resources

**Standards and Specifications:**
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) - Industry-standard API specification format
- [JSON:API](https://jsonapi.org/) - Convention for building JSON APIs with relationships
- [RFC 7231 (HTTP/1.1)](https://tools.ietf.org/html/rfc7231) - Official HTTP methods and semantics
- [RFC 6749 (OAuth 2.0)](https://tools.ietf.org/html/rfc6749) - OAuth 2.0 authorization framework

**Tools:**
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive API documentation from OpenAPI specs
- [Postman](https://www.postman.com/) - API development and testing platform
- [Insomnia](https://insomnia.rest/) - REST and GraphQL client
- [Paw](https://paw.cloud/) - API testing tool for macOS

**API Examples (Study These):**
- [Stripe API](https://stripe.com/docs/api) - Considered the gold standard for API design
- [GitHub API](https://docs.github.com/en/rest) - Comprehensive REST API with excellent docs
- [Twilio API](https://www.twilio.com/docs/usage/api) - Developer-friendly design and documentation

---

**Key Takeaway**: Great API design is about empathy for developers. Make your API intuitive, consistent, well-documented, and forgiving of mistakes. Treat your API as a product with real users who deserve a delightful experience.

When in doubt, ask yourself: "If I were integrating this API for the first time, would I understand it? Would I enjoy using it?" If the answer is no, keep iterating.
