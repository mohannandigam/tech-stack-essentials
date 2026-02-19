# REST APIs

## What is a REST API?

A REST API (Representational State Transfer Application Programming Interface) is a **set of rules for how software applications communicate over the internet**. It defines how a client (like a web browser or mobile app) can request data from a server and how the server should respond.

REST APIs use standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on **resources**—things like users, products, or orders. Each resource has a unique URL, and clients interact with these resources by sending HTTP requests to those URLs.

Think of a REST API as a menu at a restaurant: the menu lists what you can order (the available resources), how to order it (the HTTP methods), and what you'll get back (the response format). The kitchen doesn't care whether you're sitting in the restaurant, ordering takeout, or using a delivery app—the menu (API) works the same way for everyone.

## Why Do REST APIs Matter?

REST APIs are the backbone of modern web and mobile applications because they:

- **Separate concerns**: Frontend and backend teams can work independently as long as they agree on the API contract
- **Enable multiple clients**: The same API can serve a web app, mobile app, and third-party integrations
- **Are language-agnostic**: A Python backend can serve a JavaScript frontend without issue
- **Use standard protocols**: Built on HTTP, which every programming language and platform supports
- **Scale independently**: Frontend and backend can scale separately based on demand
- **Promote reusability**: Well-designed APIs can be consumed by internal and external developers

Without REST APIs, every client would need custom backend code, making development slow, error-prone, and impossible to scale.

## Simple Analogy

Imagine a library with a strict checkout system:

- **Resources**: Books are the resources (users, products, orders in an API)
- **URLs**: Each book has a unique catalog number (the URL/endpoint)
- **HTTP Methods**:
  - GET: Browse or read a book (retrieve data)
  - POST: Add a new book to the library (create data)
  - PUT: Update a book's information (update data)
  - DELETE: Remove a book from the catalog (delete data)
- **Request**: You fill out a form with the catalog number and what you want to do
- **Response**: The librarian either gives you the book, confirms they added it, or explains why they can't (error message)

Just like you don't need to know how the library organizes its storage room, API clients don't need to know how the server stores data—they just follow the published interface.

## How REST APIs Work

### The Request-Response Cycle

```
Client (Browser/App)
        ↓
Sends HTTP Request
    - Method: GET, POST, PUT, DELETE
    - URL: /api/users/123
    - Headers: Authorization, Content-Type
    - Body: JSON data (for POST/PUT)
        ↓
Server (Backend)
    - Receives request
    - Authenticates user
    - Validates input
    - Executes business logic
    - Queries database
    - Formats response
        ↓
Sends HTTP Response
    - Status Code: 200, 404, 500, etc.
    - Headers: Content-Type, Cache-Control
    - Body: JSON data or error message
        ↓
Client (Browser/App)
    - Receives response
    - Parses JSON
    - Updates UI or handles error
```

### Example Request and Response

**Request** (from client):
```http
GET /api/users/123 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

**Response** (from server):
```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{
  "id": "123",
  "username": "johndoe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Core REST Principles

### 1. Client-Server Architecture

**Principle**: Client and server are separate, communicating only through requests and responses.

**Why it matters**: Teams can develop, deploy, and scale frontend and backend independently.

**Example**: Your mobile app (client) doesn't need to know if the backend is written in Python, Java, or Go.

### 2. Statelessness

**Principle**: Each request contains all information needed to process it. The server doesn't remember previous requests.

**Why it matters**:
- Servers can scale horizontally (add more servers)
- Any server can handle any request
- Failures are isolated to single requests

**Example**:
```python
# Stateless - each request includes authentication
@app.route("/api/profile")
def get_profile():
    token = request.headers.get("Authorization")
    user = verify_token(token)  # Token contains user ID
    return {"user": user.to_dict()}

# Not stateless - server remembers session
@app.route("/api/profile")
def get_profile():
    user_id = session.get("user_id")  # Depends on server memory
    user = db.get_user(user_id)
    return {"user": user.to_dict()}
```

### 3. Uniform Interface

**Principle**: Use standard HTTP methods and predictable URL patterns.

**Why it matters**: Developers can intuitively understand your API without extensive documentation.

**Example**:
```
GET    /api/products        - List all products
GET    /api/products/123    - Get product 123
POST   /api/products        - Create new product
PUT    /api/products/123    - Update product 123
DELETE /api/products/123    - Delete product 123
```

### 4. Resource-Based

**Principle**: Everything is a resource with a unique identifier (URL).

**Why it matters**: Clear, logical structure that maps to business concepts.

**Example**:
```
/api/users              - Users collection
/api/users/123          - Specific user
/api/users/123/orders   - User's orders
/api/orders/456         - Specific order
```

### 5. Cacheability

**Principle**: Responses should indicate whether they can be cached.

**Why it matters**: Reduces server load and improves performance.

**Example**:
```python
@app.route("/api/products/<product_id>")
def get_product(product_id):
    product = db.get_product(product_id)

    response = jsonify(product.to_dict())
    # Tell clients they can cache for 1 hour
    response.headers["Cache-Control"] = "public, max-age=3600"
    return response
```

## HTTP Methods

### GET - Retrieve Data

**Purpose**: Fetch a resource or collection of resources.

**Characteristics**:
- Should not modify data (safe operation)
- Can be cached
- Can be bookmarked
- Idempotent (same request, same result)

**Examples**:
```python
# Get all users
@app.route("/api/users", methods=["GET"])
def list_users():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    users = db.query(User).paginate(page=page, per_page=limit)

    return {
        "data": [u.to_dict() for u in users.items],
        "page": page,
        "total": users.total,
        "pages": users.pages
    }

# Get specific user
@app.route("/api/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = db.query(User).filter_by(id=user_id).first_or_404()
    return user.to_dict()
```

**Use cases**:
- Loading a page with user data
- Searching for products
- Fetching order history
- Retrieving configuration settings

### POST - Create Data

**Purpose**: Create a new resource.

**Characteristics**:
- Modifies data (not safe)
- Not idempotent (repeated requests create multiple resources)
- Should return 201 Created with Location header

**Examples**:
```python
@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.json

    # Validate input
    if not data.get("email") or not data.get("password"):
        return {"error": "Email and password required"}, 400

    # Check if user exists
    if db.query(User).filter_by(email=data["email"]).first():
        return {"error": "User already exists"}, 409

    # Create user
    user = User(
        email=data["email"],
        password_hash=hash_password(data["password"]),
        username=data.get("username")
    )
    db.session.add(user)
    db.session.commit()

    # Return 201 with location of new resource
    response = jsonify(user.to_dict())
    response.status_code = 201
    response.headers["Location"] = f"/api/users/{user.id}"
    return response
```

**Use cases**:
- User registration
- Creating a new blog post
- Placing an order
- Uploading a file

### PUT - Update Data (Replace)

**Purpose**: Replace an entire resource with new data.

**Characteristics**:
- Modifies data
- Idempotent (same request produces same result)
- Client must send complete resource representation

**Examples**:
```python
@app.route("/api/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    user = db.query(User).filter_by(id=user_id).first_or_404()
    data = request.json

    # Validate ownership or permissions
    if not can_edit_user(current_user, user):
        return {"error": "Forbidden"}, 403

    # Replace all fields (this is PUT, not PATCH)
    user.email = data.get("email", user.email)
    user.username = data.get("username", user.username)
    user.bio = data.get("bio", "")
    user.updated_at = datetime.utcnow()

    db.session.commit()

    return user.to_dict()
```

**Use cases**:
- Updating profile information
- Replacing document content
- Changing configuration settings

### PATCH - Update Data (Partial)

**Purpose**: Modify specific fields of a resource.

**Characteristics**:
- Modifies data
- Idempotent
- Client sends only fields to change

**Examples**:
```python
@app.route("/api/users/<user_id>", methods=["PATCH"])
def patch_user(user_id):
    user = db.query(User).filter_by(id=user_id).first_or_404()
    data = request.json

    # Validate ownership
    if not can_edit_user(current_user, user):
        return {"error": "Forbidden"}, 403

    # Update only provided fields
    if "email" in data:
        user.email = data["email"]
    if "username" in data:
        user.username = data["username"]
    if "bio" in data:
        user.bio = data["bio"]

    user.updated_at = datetime.utcnow()
    db.session.commit()

    return user.to_dict()
```

**Use cases**:
- Updating a single profile field
- Changing order status
- Toggling feature flags

### DELETE - Remove Data

**Purpose**: Delete a resource.

**Characteristics**:
- Modifies data
- Idempotent (deleting twice has same effect as once)
- Should return 204 No Content or 200 OK

**Examples**:
```python
@app.route("/api/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = db.query(User).filter_by(id=user_id).first_or_404()

    # Validate permissions
    if not can_delete_user(current_user, user):
        return {"error": "Forbidden"}, 403

    # Soft delete (recommended for audit trails)
    user.deleted_at = datetime.utcnow()
    db.session.commit()

    # Or hard delete
    # db.session.delete(user)
    # db.session.commit()

    return "", 204  # No Content
```

**Use cases**:
- Deleting an account
- Removing a blog post
- Canceling an order

## HTTP Status Codes

Status codes tell clients whether their request succeeded and how to handle the response.

### 2xx - Success

**200 OK**
- Request succeeded
- Use for successful GET, PUT, PATCH, DELETE

**201 Created**
- New resource created
- Use for successful POST
- Include Location header with new resource URL

**204 No Content**
- Request succeeded but no data to return
- Use for DELETE operations

### 3xx - Redirection

**301 Moved Permanently**
- Resource has new URL
- Update bookmarks/links

**304 Not Modified**
- Cached version is still valid
- Saves bandwidth

### 4xx - Client Errors

**400 Bad Request**
- Invalid syntax or data
- Validation failed

```python
if not isinstance(data.get("age"), int):
    return {"error": "Age must be an integer"}, 400
```

**401 Unauthorized**
- Authentication required or failed
- Missing or invalid token

```python
token = request.headers.get("Authorization")
if not token or not verify_token(token):
    return {"error": "Unauthorized"}, 401
```

**403 Forbidden**
- Authenticated but not authorized
- User lacks permissions

```python
if current_user.role != "admin":
    return {"error": "Forbidden: Admin access required"}, 403
```

**404 Not Found**
- Resource doesn't exist

```python
user = db.query(User).filter_by(id=user_id).first()
if not user:
    return {"error": "User not found"}, 404
```

**409 Conflict**
- Request conflicts with current state
- Duplicate resource

```python
if db.query(User).filter_by(email=email).first():
    return {"error": "Email already registered"}, 409
```

**422 Unprocessable Entity**
- Validation failed on well-formed request

```python
if len(password) < 8:
    return {"error": "Password must be at least 8 characters"}, 422
```

**429 Too Many Requests**
- Rate limit exceeded

```python
if request_count > rate_limit:
    return {"error": "Rate limit exceeded. Try again in 60 seconds."}, 429
```

### 5xx - Server Errors

**500 Internal Server Error**
- Generic server error
- Something unexpected went wrong

```python
try:
    result = process_data(data)
except Exception as e:
    logger.error(f"Unexpected error: {e}", exc_info=True)
    return {"error": "Internal server error"}, 500
```

**502 Bad Gateway**
- Upstream server error
- External API call failed

**503 Service Unavailable**
- Server overloaded or down for maintenance

**504 Gateway Timeout**
- Upstream server didn't respond in time

## API Versioning

### Why Version Your API?

- **Prevent breaking changes**: Allow old clients to keep working while you improve the API
- **Gradual migration**: Give users time to update their code
- **A/B testing**: Test new features with subset of users
- **Deprecation management**: Phase out old versions systematically

### Versioning Strategies

#### 1. URL Path Versioning (Most Common)

**Approach**: Include version in URL path.

**Pros**: Clear, easy to route, supports all HTTP clients
**Cons**: URLs change between versions

```python
# Version 1
@app.route("/api/v1/users", methods=["GET"])
def get_users_v1():
    users = db.query(User).all()
    return {
        "users": [u.to_dict() for u in users]
    }

# Version 2 - different response format
@app.route("/api/v2/users", methods=["GET"])
def get_users_v2():
    users = db.query(User).all()
    return {
        "data": [u.to_dict() for u in users],
        "meta": {
            "total": len(users),
            "version": "2.0"
        }
    }
```

#### 2. Header Versioning

**Approach**: Specify version in custom header.

**Pros**: Clean URLs, doesn't pollute path
**Cons**: Less visible, harder to test in browser

```python
@app.route("/api/users", methods=["GET"])
def get_users():
    version = request.headers.get("API-Version", "1")

    if version == "1":
        return get_users_v1()
    elif version == "2":
        return get_users_v2()
    else:
        return {"error": "Unsupported API version"}, 400
```

**Request**:
```http
GET /api/users HTTP/1.1
Host: api.example.com
API-Version: 2
```

#### 3. Accept Header Versioning

**Approach**: Use content negotiation with custom media type.

**Pros**: RESTful, follows HTTP standards
**Cons**: Complex to implement, less intuitive

```python
@app.route("/api/users", methods=["GET"])
def get_users():
    accept = request.headers.get("Accept", "")

    if "application/vnd.myapi.v1+json" in accept:
        return get_users_v1()
    elif "application/vnd.myapi.v2+json" in accept:
        return get_users_v2()
    else:
        return {"error": "Unsupported API version"}, 400
```

**Request**:
```http
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/vnd.myapi.v2+json
```

### Best Practices for Versioning

1. **Start with v1**: Even if it's your first version
2. **Document changes**: Maintain changelog of what changed between versions
3. **Deprecation warnings**: Include headers indicating when version will be removed
4. **Support multiple versions**: Keep at least 2 versions active during transition
5. **Sunset policy**: Communicate how long versions will be supported

```python
@app.route("/api/v1/users", methods=["GET"])
def get_users_v1():
    users = db.query(User).all()

    response = jsonify({"users": [u.to_dict() for u in users]})

    # Warn about deprecation
    response.headers["Warning"] = '299 - "API v1 is deprecated. Migrate to v2 by 2026-12-31"'
    response.headers["Sunset"] = "Sun, 31 Dec 2026 23:59:59 GMT"

    return response
```

## Pagination

Pagination prevents overwhelming clients with too much data at once.

### Offset-Based Pagination

**How it works**: Client specifies page number and page size.

**Pros**: Simple, allows jumping to specific page
**Cons**: Inconsistent if data changes between requests

```python
@app.route("/api/products", methods=["GET"])
def list_products():
    # Get parameters with defaults
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    # Validate
    if page < 1:
        return {"error": "Page must be >= 1"}, 400
    if limit < 1 or limit > 100:
        return {"error": "Limit must be between 1 and 100"}, 400

    # Query with offset
    offset = (page - 1) * limit
    products = db.query(Product).offset(offset).limit(limit).all()
    total = db.query(Product).count()

    return {
        "data": [p.to_dict() for p in products],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit
        }
    }
```

**Request**:
```http
GET /api/products?page=2&limit=20
```

### Cursor-Based Pagination

**How it works**: Client provides a cursor (usually last seen ID) to get next batch.

**Pros**: Consistent even if data changes, efficient for infinite scroll
**Cons**: Can't jump to specific page, more complex

```python
@app.route("/api/products", methods=["GET"])
def list_products():
    cursor = request.args.get("cursor", type=int)
    limit = request.args.get("limit", 20, type=int)

    # Validate
    if limit < 1 or limit > 100:
        return {"error": "Limit must be between 1 and 100"}, 400

    # Query starting from cursor
    query = db.query(Product).order_by(Product.id)
    if cursor:
        query = query.filter(Product.id > cursor)

    products = query.limit(limit).all()

    # Next cursor is the last item's ID
    next_cursor = products[-1].id if products else None

    return {
        "data": [p.to_dict() for p in products],
        "pagination": {
            "next_cursor": next_cursor,
            "limit": limit
        }
    }
```

**Request**:
```http
GET /api/products?cursor=12345&limit=20
```

### Link Header Pagination

**How it works**: Include pagination links in response headers (GitHub style).

**Pros**: Follows standards, client-agnostic
**Cons**: Requires header parsing

```python
from urllib.parse import urlencode

@app.route("/api/products", methods=["GET"])
def list_products():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    offset = (page - 1) * limit
    products = db.query(Product).offset(offset).limit(limit).all()
    total = db.query(Product).count()
    pages = (total + limit - 1) // limit

    # Build Link header
    links = []
    base_url = request.base_url

    if page > 1:
        prev_params = urlencode({"page": page - 1, "limit": limit})
        links.append(f'<{base_url}?{prev_params}>; rel="prev"')

    if page < pages:
        next_params = urlencode({"page": page + 1, "limit": limit})
        links.append(f'<{base_url}?{next_params}>; rel="next"')

    first_params = urlencode({"page": 1, "limit": limit})
    links.append(f'<{base_url}?{first_params}>; rel="first"')

    last_params = urlencode({"page": pages, "limit": limit})
    links.append(f'<{base_url}?{last_params}>; rel="last"')

    response = jsonify({"data": [p.to_dict() for p in products]})
    response.headers["Link"] = ", ".join(links)
    response.headers["X-Total-Count"] = str(total)

    return response
```

**Response**:
```http
HTTP/1.1 200 OK
Link: </api/products?page=1&limit=20>; rel="first",
      </api/products?page=3&limit=20>; rel="next",
      </api/products?page=10&limit=20>; rel="last"
X-Total-Count: 200
```

## Filtering, Sorting, and Searching

### Filtering

Allow clients to filter results by field values.

```python
@app.route("/api/products", methods=["GET"])
def list_products():
    query = db.query(Product)

    # Filter by category
    category = request.args.get("category")
    if category:
        query = query.filter(Product.category == category)

    # Filter by price range
    min_price = request.args.get("min_price", type=float)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    max_price = request.args.get("max_price", type=float)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Filter by availability
    in_stock = request.args.get("in_stock", type=lambda x: x.lower() == "true")
    if in_stock:
        query = query.filter(Product.stock > 0)

    products = query.all()
    return {"data": [p.to_dict() for p in products]}
```

**Request**:
```http
GET /api/products?category=electronics&min_price=100&max_price=500&in_stock=true
```

### Sorting

Allow clients to specify sort order.

```python
@app.route("/api/products", methods=["GET"])
def list_products():
    query = db.query(Product)

    # Get sort parameter (e.g., "price" or "-price" for descending)
    sort = request.args.get("sort", "id")

    # Determine direction
    if sort.startswith("-"):
        direction = "desc"
        field = sort[1:]
    else:
        direction = "asc"
        field = sort

    # Validate field (prevent SQL injection)
    allowed_fields = ["id", "name", "price", "created_at"]
    if field not in allowed_fields:
        return {"error": f"Invalid sort field. Allowed: {allowed_fields}"}, 400

    # Apply sorting
    if direction == "desc":
        query = query.order_by(getattr(Product, field).desc())
    else:
        query = query.order_by(getattr(Product, field).asc())

    products = query.all()
    return {"data": [p.to_dict() for p in products]}
```

**Request**:
```http
GET /api/products?sort=-price  (sort by price descending)
GET /api/products?sort=name    (sort by name ascending)
```

### Searching

Full-text search across multiple fields.

```python
@app.route("/api/products", methods=["GET"])
def list_products():
    query = db.query(Product)

    # Search query
    search = request.args.get("q")
    if search:
        # Simple search across multiple fields
        search_pattern = f"%{search}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(search_pattern),
                Product.description.ilike(search_pattern),
                Product.sku.ilike(search_pattern)
            )
        )

    products = query.all()
    return {"data": [p.to_dict() for p in products]}
```

**Request**:
```http
GET /api/products?q=wireless%20mouse
```

## OpenAPI (Swagger) Documentation

OpenAPI is a standard format for describing REST APIs. It generates interactive documentation.

### Why Document Your API?

- **Developer onboarding**: New developers understand API quickly
- **Client generation**: Auto-generate client libraries
- **Testing**: Interactive playground to test endpoints
- **Contract**: Formal specification of API behavior

### Example OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Product API
  version: 1.0.0
  description: API for managing products

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

paths:
  /products:
    get:
      summary: List all products
      description: Returns a paginated list of products with optional filtering
      parameters:
        - name: page
          in: query
          description: Page number
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          description: Items per page
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: category
          in: query
          description: Filter by category
          schema:
            type: string
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
          description: Invalid parameters
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      summary: Create a product
      description: Creates a new product
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        '201':
          description: Product created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '400':
          description: Invalid input
        '401':
          description: Unauthorized

  /products/{productId}:
    get:
      summary: Get a product
      description: Returns a single product by ID
      parameters:
        - name: productId
          in: path
          required: true
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

components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: string
          example: "123"
        name:
          type: string
          example: "Wireless Mouse"
        description:
          type: string
          example: "Ergonomic wireless mouse with USB receiver"
        price:
          type: number
          format: float
          example: 29.99
        category:
          type: string
          example: "electronics"
        created_at:
          type: string
          format: date-time

    ProductInput:
      type: object
      required:
        - name
        - price
      properties:
        name:
          type: string
        description:
          type: string
        price:
          type: number
          format: float
        category:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer

    Error:
      type: object
      properties:
        error:
          type: string

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Generating OpenAPI in Python (Flask)

```python
from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from marshmallow import Schema, fields

app = Flask(__name__)

# Create OpenAPI spec
spec = APISpec(
    title="Product API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[MarshmallowPlugin()],
)

# Define schemas
class ProductSchema(Schema):
    id = fields.Str()
    name = fields.Str(required=True)
    description = fields.Str()
    price = fields.Float(required=True)
    category = fields.Str()
    created_at = fields.DateTime()

# Register schemas
spec.components.schema("Product", schema=ProductSchema)

@app.route("/api/products", methods=["GET"])
def list_products():
    """List products
    ---
    get:
      summary: List all products
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        200:
          description: A list of products
          content:
            application/json:
              schema:
                type: array
                items: ProductSchema
    """
    return {"data": []}

# Serve OpenAPI spec
@app.route("/api/openapi.json")
def openapi_spec():
    return spec.to_dict()

# Serve Swagger UI
SWAGGER_URL = "/api/docs"
API_URL = "/api/openapi.json"
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "Product API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
```

Now visiting `/api/docs` shows interactive documentation.

## Best Practices

### Safety and Security

**1. Input Validation**

```python
from marshmallow import Schema, fields, ValidationError

class CreateProductSchema(Schema):
    name = fields.Str(required=True, validate=lambda x: len(x) <= 255)
    price = fields.Float(required=True, validate=lambda x: x > 0)
    category = fields.Str(required=True)

@app.route("/api/products", methods=["POST"])
def create_product():
    schema = CreateProductSchema()

    try:
        # Validate and deserialize
        data = schema.load(request.json)
    except ValidationError as err:
        return {"errors": err.messages}, 400

    # Data is now validated and safe to use
    product = Product(**data)
    db.session.add(product)
    db.session.commit()

    return product.to_dict(), 201
```

**2. Rate Limiting**

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route("/api/products", methods=["POST"])
@limiter.limit("10 per minute")  # Stricter limit for writes
def create_product():
    # ... create product logic
    pass
```

**3. CORS (Cross-Origin Resource Sharing)**

```python
from flask_cors import CORS

# Allow specific origins
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://example.com", "https://app.example.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

**4. SQL Injection Prevention**

```python
# Don't do this - vulnerable to SQL injection
@app.route("/api/users/<username>")
def get_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    result = db.execute(query)  # DANGER!

# Do this - use parameterized queries
@app.route("/api/users/<username>")
def get_user(username):
    user = db.query(User).filter_by(username=username).first()
    # ORM handles escaping
```

### Quality Assurance

**Testing Strategy**

```python
import pytest
from app import app, db

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

# Test successful creation
def test_create_product(client):
    response = client.post("/api/products", json={
        "name": "Test Product",
        "price": 29.99,
        "category": "electronics"
    })

    assert response.status_code == 201
    data = response.get_json()
    assert data["name"] == "Test Product"
    assert data["price"] == 29.99

# Test validation error
def test_create_product_invalid_price(client):
    response = client.post("/api/products", json={
        "name": "Test Product",
        "price": -10,  # Invalid
        "category": "electronics"
    })

    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

# Test authentication
def test_create_product_unauthorized(client):
    response = client.post("/api/products", json={
        "name": "Test Product",
        "price": 29.99
    })  # No auth header

    assert response.status_code == 401

# Test pagination
def test_list_products_pagination(client):
    # Create test products
    for i in range(25):
        client.post("/api/products", json={
            "name": f"Product {i}",
            "price": 10.0
        })

    # Get first page
    response = client.get("/api/products?page=1&limit=10")
    data = response.get_json()

    assert len(data["data"]) == 10
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["total"] == 25
```

### Logging and Observability

**Request Logging Middleware**

```python
import time
import logging
from flask import request, g
import uuid

logger = logging.getLogger(__name__)

@app.before_request
def before_request():
    # Generate trace ID for request tracking
    g.trace_id = request.headers.get("X-Trace-ID", str(uuid.uuid4()))
    g.start_time = time.time()

@app.after_request
def after_request(response):
    # Calculate request duration
    duration_ms = (time.time() - g.start_time) * 1000

    # Log request details
    logger.info("API Request", extra={
        "trace_id": g.trace_id,
        "method": request.method,
        "path": request.path,
        "status_code": response.status_code,
        "duration_ms": round(duration_ms, 2),
        "user_id": getattr(g, "user_id", None),
        "ip_address": request.remote_addr,
        "user_agent": request.headers.get("User-Agent")
    })

    # Add trace ID to response headers
    response.headers["X-Trace-ID"] = g.trace_id

    return response

# Log errors with context
@app.errorhandler(Exception)
def handle_exception(error):
    logger.error("API Error", extra={
        "trace_id": g.trace_id,
        "error_type": type(error).__name__,
        "error_message": str(error),
        "path": request.path,
        "method": request.method
    }, exc_info=True)

    return {"error": "Internal server error", "trace_id": g.trace_id}, 500
```

**What to Log**:
- All API requests (method, path, status, duration, user ID)
- Authentication events (login success/failure)
- Authorization failures
- Validation errors
- Database errors
- External API calls
- Rate limit hits

**What NOT to Log**:
- Passwords or tokens
- Credit card numbers
- PII (unless encrypted and necessary)
- Full request/response bodies (may contain sensitive data)

### Performance Optimization

**1. Database Query Optimization**

```python
# Don't do this - N+1 query problem
@app.route("/api/orders")
def list_orders():
    orders = db.query(Order).all()
    result = []
    for order in orders:
        # Each iteration makes a separate query
        customer = db.query(Customer).filter_by(id=order.customer_id).first()
        result.append({
            "order": order.to_dict(),
            "customer": customer.to_dict()
        })
    return {"data": result}

# Do this - use joins
@app.route("/api/orders")
def list_orders():
    orders = db.query(Order).join(Customer).all()
    return {
        "data": [{
            "order": order.to_dict(),
            "customer": order.customer.to_dict()
        } for order in orders]
    }
```

**2. Caching**

```python
from flask_caching import Cache

cache = Cache(app, config={
    "CACHE_TYPE": "redis",
    "CACHE_REDIS_URL": "redis://localhost:6379/0"
})

@app.route("/api/products/<product_id>")
@cache.cached(timeout=300, query_string=True)  # Cache for 5 minutes
def get_product(product_id):
    product = db.query(Product).filter_by(id=product_id).first_or_404()
    return product.to_dict()

# Invalidate cache on update
@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    product = db.query(Product).filter_by(id=product_id).first_or_404()
    # ... update logic ...
    db.session.commit()

    # Clear cache
    cache.delete(f"view//api/products/{product_id}")

    return product.to_dict()
```

**3. Response Compression**

```python
from flask_compress import Compress

Compress(app)  # Automatically compresses responses > 500 bytes
```

## Common Pitfalls

### 1. Not Using Proper HTTP Methods

**Problem**: Using GET for operations that modify data.

**Why it's bad**: GET requests can be cached, prefetched, or logged, causing unintended side effects.

```python
# Don't do this
@app.route("/api/users/delete/<user_id>", methods=["GET"])
def delete_user(user_id):
    db.query(User).filter_by(id=user_id).delete()

# Do this
@app.route("/api/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    db.query(User).filter_by(id=user_id).delete()
```

### 2. Exposing Implementation Details in URLs

**Problem**: URLs reveal database structure or internal IDs.

**Why it's bad**: Tightly couples API to implementation, makes refactoring difficult.

```python
# Don't do this
GET /api/db_users_table/get?internal_id=12345

# Do this
GET /api/users/abc-def-ghi  (use UUIDs or public IDs)
```

### 3. Inconsistent Response Formats

**Problem**: Different endpoints return data in different formats.

**Why it's bad**: Clients must handle multiple response structures.

```python
# Don't do this
# Endpoint 1 returns: {"user": {...}}
# Endpoint 2 returns: {"data": {...}}
# Endpoint 3 returns: {...} (no wrapper)

# Do this - consistent format
# All success responses: {"data": {...}}
# All error responses: {"error": "message", "details": [...]}
```

### 4. Not Handling Large Payloads

**Problem**: Accepting unlimited request sizes or returning huge responses.

**Why it's bad**: Causes memory issues, denial of service, slow responses.

```python
# Limit request size
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max

# Always paginate large collections
@app.route("/api/products")
def list_products():
    # Don't return all products at once
    # Use pagination (see Pagination section)
    pass
```

### 5. Returning Stack Traces to Clients

**Problem**: Exposing internal errors to API consumers.

**Why it's bad**: Reveals system architecture, aids attackers.

```python
# Don't do this
@app.errorhandler(Exception)
def handle_error(error):
    return {"error": str(error), "trace": traceback.format_exc()}, 500

# Do this
@app.errorhandler(Exception)
def handle_error(error):
    # Log detailed error internally
    logger.error("Error", exc_info=True)

    # Return generic message to client
    return {"error": "Internal server error"}, 500
```

## Real-World Use Cases

### E-Commerce API

**Challenges**: Product catalog, inventory, orders, payments

**Key Endpoints**:
```
GET    /api/v1/products              - Browse products
GET    /api/v1/products/:id          - Product details
POST   /api/v1/cart                  - Add to cart
GET    /api/v1/cart                  - View cart
POST   /api/v1/orders                - Place order
GET    /api/v1/orders/:id            - Order status
POST   /api/v1/orders/:id/cancel     - Cancel order
```

**Best Practices**:
- Pagination for product lists
- Caching for product details
- Idempotency for order creation (prevent double charges)
- Webhooks for payment status updates

### Social Media API

**Challenges**: Real-time feeds, high read volume, content moderation

**Key Endpoints**:
```
GET    /api/v1/feed                  - User's timeline
POST   /api/v1/posts                 - Create post
GET    /api/v1/posts/:id             - Get post
DELETE /api/v1/posts/:id             - Delete post
POST   /api/v1/posts/:id/like        - Like post
GET    /api/v1/users/:id/followers   - Get followers
```

**Best Practices**:
- Cursor-based pagination for feeds
- Aggressive caching (Redis)
- Rate limiting to prevent spam
- Soft deletes for posts (legal compliance)

### Financial API

**Challenges**: Security, accuracy, regulatory compliance

**Key Endpoints**:
```
GET    /api/v1/accounts              - List accounts
GET    /api/v1/accounts/:id/balance  - Account balance
POST   /api/v1/transfers             - Transfer money
GET    /api/v1/transactions          - Transaction history
```

**Best Practices**:
- Strong authentication (MFA required)
- Audit logging (track every access)
- Idempotency (prevent duplicate transactions)
- Encryption at rest and in transit
- Decimal precision for currency (never use floats)

### Healthcare API

**Challenges**: HIPAA compliance, PHI protection, high reliability

**Key Endpoints**:
```
GET    /api/v1/patients/:id          - Patient profile
GET    /api/v1/patients/:id/records  - Medical records
POST   /api/v1/appointments          - Schedule appointment
GET    /api/v1/appointments/:id      - Appointment details
```

**Best Practices**:
- Role-based access control (doctors, nurses, patients)
- Comprehensive audit logs
- Data encryption
- Consent management for data access
- Strict validation (medical data accuracy critical)

## Quick Reference

| Aspect | Best Practice |
|--------|---------------|
| **URL Design** | Nouns for resources, not verbs (`/users`, not `/getUsers`) |
| **HTTP Methods** | GET (read), POST (create), PUT/PATCH (update), DELETE (remove) |
| **Status Codes** | 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error) |
| **Versioning** | URL path (`/api/v1/users`) or header (`API-Version: 1`) |
| **Pagination** | Offset-based for pages, cursor-based for infinite scroll |
| **Authentication** | Bearer tokens in `Authorization` header |
| **Errors** | Consistent format with message and optional details |
| **Documentation** | OpenAPI/Swagger for interactive docs |
| **Testing** | Unit tests for logic, integration tests for endpoints |
| **Logging** | Structured logs with trace IDs |
| **Caching** | Use `Cache-Control` headers, cache GET requests |
| **Rate Limiting** | Protect against abuse, return 429 when exceeded |

## Next Steps

Now that you understand REST APIs, continue to:

- **[Authentication & Authorization](../authentication-authorization/README.md)**: Learn how to secure your APIs with sessions, JWT, and OAuth2
- **[Databases](../databases/README.md)**: Understand how to store and retrieve data that your APIs serve
- **[Message Queues](../message-queues/README.md)**: Handle asynchronous operations triggered by API calls

## Related Topics

- **02-architectures/microservices**: How REST APIs enable service-to-service communication
- **04-frontend**: How frontends consume REST APIs
- **06-infrastructure/api-gateways**: Managing and securing APIs at scale
- **08-security/api-security**: Advanced API security patterns

---

**Remember**: REST APIs are the contract between frontend and backend. Design them with care—they're hard to change once clients depend on them. Prioritize consistency, security, and clear documentation.
