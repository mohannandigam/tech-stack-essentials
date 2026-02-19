# GraphQL

## 📋 What is GraphQL?

**GraphQL** is a query language for APIs and a runtime for executing those queries. Unlike traditional REST APIs where the server decides what data to return, GraphQL lets clients specify exactly what data they need in a single request. Think of it as a menu where you can order exactly the ingredients you want, rather than accepting pre-made combo meals.

Developed by Facebook in 2012 and open-sourced in 2015, GraphQL provides a complete description of the data in your API through a strongly-typed schema, enables powerful developer tools, and eliminates common REST problems like over-fetching and under-fetching data.

## 🎯 Simple Analogy

Imagine you're at a restaurant:

**REST is like ordering combo meals:**
- Want a burger? You get "Combo #1": burger, fries, drink, and dessert (even if you only wanted the burger)
- Want to know the burger's ingredients? Make another trip to the counter for the ingredient list
- Want fries with different seasoning? Not on the menu, can't customize
- You make multiple trips: one for food, one for ingredients, one for nutritional info

**GraphQL is like a custom order at a build-your-own restaurant:**
- You fill out one order form with exactly what you want: "burger with extra cheese, no pickles, small fries, and nutritional info"
- The kitchen prepares everything together and brings it in one trip
- You get exactly what you asked for — nothing more, nothing less
- One trip to the counter, one detailed request, one complete response

This is GraphQL: precise requests, complete responses, no wasted bandwidth.

## 🌟 Why Does It Matter?

Modern applications need flexible, efficient APIs. The challenges with traditional REST APIs grow as applications become more complex:

### The Problems GraphQL Solves

**1. Over-fetching (getting too much data)**
```
REST: GET /api/users/123
Returns: { id, name, email, address, phone, bio, settings, preferences, history, ... }
You only wanted the name, but got everything.
```

**2. Under-fetching (getting too little data)**
```
REST:
  GET /api/posts/456        → Get post
  GET /api/users/123        → Get author
  GET /api/comments?post=456 → Get comments
  GET /api/users/789        → Get commenter
  GET /api/users/101        → Get another commenter

Five requests for one screen!
```

**3. Fixed endpoints (inflexible structure)**
```
REST: Server defines what /api/posts returns
Mobile needs less data → Can't get less
Web needs more data → Can't get more
Must create new endpoints for each client
```

**4. API versioning challenges**
```
REST:
  /api/v1/users → Old clients
  /api/v2/users → New clients
  /api/v3/users → Even newer clients

Maintaining multiple versions is painful
```

### Why This Matters

**For Frontend Developers:**
- Request exactly the data needed for each screen
- Reduce number of API calls (better performance)
- Faster iteration (no waiting for backend to add endpoints)
- Self-documenting API (explore schema in GraphQL Playground)

**For Backend Developers:**
- Single endpoint to maintain
- No API versioning headaches
- Clear contract between frontend and backend
- Easy to add new fields without breaking old clients

**For Mobile Apps:**
- Minimize data transfer (save bandwidth and battery)
- Reduce latency (fewer round trips)
- Work better on slow networks

**For Complex Systems:**
- Aggregate data from multiple microservices
- Present unified API to clients
- Enable data federation across teams

## 🏗️ How It Works

### The GraphQL Request Flow

```
1. Client needs data → Writes a GraphQL query

   query {
     user(id: "123") {
       name
       email
     }
   }

2. Query sent to GraphQL server (single endpoint: /graphql)
   POST /graphql
   Body: { query: "..." }

3. GraphQL server parses and validates query against schema
   ✅ Query structure is valid
   ✅ Fields exist in schema
   ✅ Types match

4. GraphQL executes query → Calls resolver functions
   Resolver for 'user' → Fetch user from database
   Resolver for 'name' → Return user.name
   Resolver for 'email' → Return user.email

5. Server returns data in exact shape requested
   {
     "data": {
       "user": {
         "name": "Alice",
         "email": "alice@example.com"
       }
     }
   }
```

### Architecture Diagram

```
┌─────────────────┐
│  Client (Web)   │
│  Client (Mobile)│
│  Client (Other) │
└────────┬────────┘
         │ GraphQL Query (POST /graphql)
         ↓
┌────────────────────────────────────┐
│      GraphQL Server                │
│  ┌──────────────────────────────┐  │
│  │  Schema Definition            │  │
│  │  (Types, Queries, Mutations)  │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Query Validation             │  │
│  │  (Check against schema)       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Execution Engine             │  │
│  │  (Call resolvers)             │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Resolvers                    │  │
│  │  (Business logic)             │  │
│  └──────────────────────────────┘  │
└────────┬───────────┬───────────┬───┘
         │           │           │
         ↓           ↓           ↓
   ┌─────────┐  ┌────────┐  ┌──────────┐
   │Database │  │REST API│  │Other APIs│
   └─────────┘  └────────┘  └──────────┘
```

## 🔑 Key Concepts

### 1. Schema

The **schema** is the contract between client and server. It defines:
- What data is available
- What types that data has
- What operations can be performed

**Schema Definition Language (SDL)**:
```graphql
# Define a type
type User {
  id: ID!           # ! means non-nullable (required)
  name: String!
  email: String!
  age: Int
  posts: [Post!]!   # Array of Posts (array and items are non-nullable)
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!     # Relationship to User
}

# Define the root Query type (read operations)
type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  posts(limit: Int, offset: Int): [Post!]!
}

# Define the root Mutation type (write operations)
type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!
  createPost(title: String!, content: String!, authorId: ID!): Post!
}

# Define the root Subscription type (real-time updates)
type Subscription {
  postCreated: Post!
  userUpdated(id: ID!): User!
}
```

**Built-in Scalar Types:**
- `Int`: Signed 32-bit integer
- `Float`: Signed double-precision floating-point
- `String`: UTF-8 character sequence
- `Boolean`: true or false
- `ID`: Unique identifier (serialized as String)

**Custom Scalar Types:**
```graphql
scalar DateTime
scalar Email
scalar URL

type Event {
  id: ID!
  name: String!
  startDate: DateTime!
  website: URL
}
```

### 2. Queries (Reading Data)

**Queries** fetch data from the server. They specify exactly what fields to return.

**Basic query:**
```graphql
query {
  user(id: "123") {
    name
    email
  }
}

# Response:
{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com"
    }
  }
}
```

**Query with nested fields:**
```graphql
query {
  user(id: "123") {
    name
    email
    posts {
      title
      content
    }
  }
}

# Response includes nested data:
{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com",
      "posts": [
        {
          "title": "GraphQL Introduction",
          "content": "GraphQL is amazing..."
        },
        {
          "title": "Advanced Patterns",
          "content": "Let's explore..."
        }
      ]
    }
  }
}
```

**Query with variables:**
```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    email
  }
}

# Variables (sent separately):
{
  "userId": "123"
}
```

**Query with aliases (rename fields):**
```graphql
query {
  mainUser: user(id: "123") {
    name
  }
  otherUser: user(id: "456") {
    name
  }
}

# Response:
{
  "data": {
    "mainUser": { "name": "Alice" },
    "otherUser": { "name": "Bob" }
  }
}
```

**Query with fragments (reuse fields):**
```graphql
query {
  user(id: "123") {
    ...UserFields
  }
}

fragment UserFields on User {
  id
  name
  email
  posts {
    title
  }
}
```

### 3. Mutations (Writing Data)

**Mutations** modify data on the server (create, update, delete).

**Create mutation:**
```graphql
mutation {
  createUser(name: "Charlie", email: "charlie@example.com") {
    id
    name
    email
  }
}

# Response:
{
  "data": {
    "createUser": {
      "id": "789",
      "name": "Charlie",
      "email": "charlie@example.com"
    }
  }
}
```

**Update mutation:**
```graphql
mutation {
  updateUser(id: "123", name: "Alice Smith") {
    id
    name
    email
  }
}
```

**Mutation with variables:**
```graphql
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
    email
  }
}

# Variables:
{
  "name": "Charlie",
  "email": "charlie@example.com"
}
```

### 4. Subscriptions (Real-Time Data)

**Subscriptions** enable real-time updates using WebSockets.

**Subscribe to new posts:**
```graphql
subscription {
  postCreated {
    id
    title
    author {
      name
    }
  }
}

# Server pushes data when new post is created:
{
  "data": {
    "postCreated": {
      "id": "999",
      "title": "Breaking News",
      "author": {
        "name": "Alice"
      }
    }
  }
}
```

**Use cases for subscriptions:**
- Chat applications (new messages)
- Live dashboards (real-time metrics)
- Collaborative editing (document changes)
- Notifications (user mentions, likes)
- Live sports scores
- Stock price updates

### 5. Resolvers

**Resolvers** are functions that fetch the data for each field. They connect the schema to data sources.

**Basic resolver (JavaScript/TypeScript):**
```javascript
const resolvers = {
  Query: {
    // Resolver for user(id: ID!): User
    user: async (parent, args, context, info) => {
      const { id } = args;
      return await context.db.users.findById(id);
    },

    // Resolver for users: [User!]!
    users: async (parent, args, context) => {
      return await context.db.users.findAll();
    }
  },

  Mutation: {
    // Resolver for createUser
    createUser: async (parent, args, context) => {
      const { name, email } = args;
      return await context.db.users.create({ name, email });
    }
  },

  User: {
    // Resolver for User.posts field
    posts: async (parent, args, context) => {
      // parent is the User object
      return await context.db.posts.findByAuthorId(parent.id);
    }
  }
};
```

**Resolver function signature:**
```javascript
function resolver(parent, args, context, info) {
  // parent: The result from the parent resolver
  // args: Arguments passed to the field
  // context: Shared across all resolvers (db, auth, etc.)
  // info: Information about the query (field name, path, etc.)

  return data; // Or return Promise<data>
}
```

**Python resolver example:**
```python
from ariadne import QueryType, MutationType, make_executable_schema
from ariadne.asgi import GraphQL

# Define resolvers
query = QueryType()

@query.field("user")
async def resolve_user(parent, info, id):
    db = info.context["db"]
    return await db.users.find_one({"id": id})

@query.field("users")
async def resolve_users(parent, info):
    db = info.context["db"]
    return await db.users.find()

# Mutation resolvers
mutation = MutationType()

@mutation.field("createUser")
async def resolve_create_user(parent, info, name, email):
    db = info.context["db"]
    user = {"name": name, "email": email}
    result = await db.users.insert_one(user)
    user["id"] = str(result.inserted_id)
    return user

# Field resolver for nested data
user_type = ObjectType("User")

@user_type.field("posts")
async def resolve_user_posts(user, info):
    db = info.context["db"]
    return await db.posts.find({"author_id": user["id"]})
```

### 6. The N+1 Query Problem

**The Problem:**

When fetching a list of items with nested data, naive resolvers cause N+1 database queries:

```javascript
// Query: Get all users with their posts
query {
  users {          // 1 query to get all users
    name
    posts {        // N queries (one per user!) to get posts
      title
    }
  }
}

// Execution:
// 1. SELECT * FROM users;                     (1 query)
// 2. SELECT * FROM posts WHERE author_id = 1; (query for user 1)
// 3. SELECT * FROM posts WHERE author_id = 2; (query for user 2)
// 4. SELECT * FROM posts WHERE author_id = 3; (query for user 3)
// ... N more queries

// Result: 1 + N queries (if 1000 users → 1001 queries!)
```

**The Solution: DataLoader**

DataLoader batches and caches database requests:

```javascript
const DataLoader = require('dataloader');

// Create a DataLoader that batches user fetches
const userLoader = new DataLoader(async (userIds) => {
  // Receives array of IDs, fetches all at once
  const users = await db.users.findByIds(userIds);

  // Return results in same order as input IDs
  return userIds.map(id => users.find(user => user.id === id));
});

// Create a DataLoader for posts
const postsByAuthorLoader = new DataLoader(async (authorIds) => {
  // Fetch all posts for all authors in one query
  const posts = await db.posts.findByAuthorIds(authorIds);

  // Group posts by author
  return authorIds.map(authorId =>
    posts.filter(post => post.authorId === authorId)
  );
});

// Use in resolvers
const resolvers = {
  Query: {
    users: async () => {
      return await db.users.findAll();
    }
  },
  User: {
    posts: async (user, args, context) => {
      // DataLoader batches these calls!
      return await context.loaders.postsByAuthor.load(user.id);
    }
  }
};

// Context setup (create loaders per request)
const server = new ApolloServer({
  schema,
  context: () => ({
    db,
    loaders: {
      user: new DataLoader(batchUsers),
      postsByAuthor: new DataLoader(batchPostsByAuthor)
    }
  })
});

// Result: Only 2 queries total!
// 1. SELECT * FROM users;
// 2. SELECT * FROM posts WHERE author_id IN (1, 2, 3, ...);
```

**How DataLoader works:**
1. During request execution, resolvers call `loader.load(id)`
2. DataLoader collects all IDs requested in the same tick
3. Batches them into a single call to the batch function
4. Returns cached results if the same ID is requested again
5. Cache is cleared after the request completes

### 7. Directives

**Directives** add conditional logic to queries.

**@include and @skip:**
```graphql
query GetUser($includeEmail: Boolean!) {
  user(id: "123") {
    name
    email @include(if: $includeEmail)  # Include only if true
    phone @skip(if: $includeEmail)     # Skip if true
  }
}

# Variables:
{ "includeEmail": true }

# Response includes email, skips phone
```

**@deprecated (in schema):**
```graphql
type User {
  id: ID!
  name: String!
  username: String! @deprecated(reason: "Use 'name' instead")
}
```

**Custom directives:**
```graphql
# Define custom directive
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
  USER
  ADMIN
}

type Query {
  posts: [Post!]!
  adminPosts: [Post!]! @auth(requires: ADMIN)
}

// Implement directive
const directiveResolvers = {
  auth: (next, source, args, context) => {
    const { requires } = args;
    const { user } = context;

    if (!user) {
      throw new Error('Not authenticated');
    }

    if (user.role !== requires) {
      throw new Error('Not authorized');
    }

    return next();
  }
};
```

### 8. Input Types

**Input types** define complex objects as arguments:

```graphql
# Schema definition
input CreateUserInput {
  name: String!
  email: String!
  age: Int
  address: AddressInput
}

input AddressInput {
  street: String!
  city: String!
  country: String!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}

# Usage in query
mutation {
  createUser(input: {
    name: "Alice",
    email: "alice@example.com",
    age: 30,
    address: {
      street: "123 Main St",
      city: "Springfield",
      country: "USA"
    }
  }) {
    id
    name
  }
}
```

### 9. Interfaces and Unions

**Interfaces** define common fields across types:

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
  email: String!
}

type Post implements Node {
  id: ID!
  title: String!
  content: String!
}

type Query {
  node(id: ID!): Node
}

# Query with inline fragments
query {
  node(id: "123") {
    id  # Available on all Nodes
    ... on User {
      name
      email
    }
    ... on Post {
      title
      content
    }
  }
}
```

**Unions** represent one of multiple types:

```graphql
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}

# Query
query {
  search(query: "graphql") {
    ... on User {
      name
    }
    ... on Post {
      title
    }
    ... on Comment {
      text
    }
  }
}
```

## 🆚 GraphQL vs REST vs gRPC

### Detailed Comparison

| Aspect | GraphQL | REST | gRPC |
|--------|---------|------|------|
| **Data Fetching** | Exact data requested | Fixed endpoints | Strongly-typed messages |
| **Over-fetching** | ✅ No (request only needed fields) | ❌ Yes (get full resource) | ⚠️ Depends on proto definition |
| **Under-fetching** | ✅ No (request nested data) | ❌ Yes (multiple requests) | ✅ No (nested messages) |
| **Endpoints** | Single `/graphql` | Multiple `/api/users`, `/api/posts` | Service methods |
| **Versioning** | ✅ No versions needed (add fields) | ⚠️ `/v1`, `/v2` required | ⚠️ Proto version management |
| **Type Safety** | ✅ Strong (schema-first) | ❌ Weak (docs can drift) | ✅ Very strong (protobuf) |
| **Real-time** | ✅ Subscriptions (WebSocket) | ⚠️ Long polling, SSE | ✅ Streaming |
| **Caching** | ⚠️ Complex (POST requests) | ✅ Simple (HTTP cache) | ❌ Not built-in |
| **Performance** | ⚠️ Query complexity | ✅ Simple, fast | ✅ Very fast (binary) |
| **Learning Curve** | ⚠️ Steeper | ✅ Gentle | ⚠️ Steep |
| **Tooling** | ✅ Excellent (GraphiQL, Playground) | ✅ Good (Postman, Swagger) | ⚠️ Limited (grpcurl) |
| **Browser Support** | ✅ Yes (HTTP/JSON) | ✅ Yes (HTTP/JSON) | ⚠️ Requires gRPC-Web |
| **Best For** | Dynamic UIs, mobile apps | Simple CRUD, public APIs | Microservices, high-performance |

### When to Use Each

**Use GraphQL when:**
- Building dynamic user interfaces with varied data needs
- Mobile apps need to minimize data transfer
- Frontend and backend teams need independence
- You have multiple clients with different requirements (web, mobile, desktop)
- You want self-documenting APIs with great developer tools
- Real-time features are important (chat, notifications, live updates)

**Use REST when:**
- Building simple CRUD APIs
- HTTP caching is critical
- Team is unfamiliar with GraphQL
- Public API for third-party integrations (REST is more familiar)
- Resources map cleanly to endpoints
- You need maximum compatibility (REST is universal)

**Use gRPC when:**
- Building microservices that communicate internally
- Performance is critical (gRPC uses binary protocol)
- You need bi-directional streaming
- All clients are under your control (not public-facing)
- Strong typing and code generation are priorities
- Language-agnostic service communication

### Example: Fetching User with Posts

**GraphQL:**
```graphql
# Single request
query {
  user(id: "123") {
    name
    email
    posts {
      title
      createdAt
    }
  }
}

# ✅ One request, exact data needed
```

**REST:**
```bash
# Multiple requests required
GET /api/users/123
{
  "id": "123",
  "name": "Alice",
  "email": "alice@example.com",
  "bio": "...",          # Over-fetching (didn't need this)
  "settings": { ... }    # Over-fetching (didn't need this)
}

GET /api/users/123/posts
[
  {
    "id": "1",
    "title": "Post 1",
    "content": "...",    # Over-fetching (didn't need content)
    "createdAt": "..."
  }
]

# ❌ Two requests, over-fetching
```

**gRPC:**
```protobuf
// Define proto
message UserWithPostsRequest {
  string user_id = 1;
}

message UserWithPostsResponse {
  User user = 1;
  repeated Post posts = 2;
}

// Call service
UserWithPostsResponse response = userService.GetUserWithPosts(
  UserWithPostsRequest(user_id="123")
);

// ✅ One request, typed, but requires dedicated endpoint
```

## 🏭 GraphQL Federation (Microservices)

**GraphQL Federation** lets you build a single GraphQL API from multiple services.

### The Problem Without Federation

Each service has its own GraphQL API:
```
User Service:     /graphql → Users
Product Service:  /graphql → Products
Order Service:    /graphql → Orders

Client must know which service to call and make multiple requests.
```

### The Solution: Apollo Federation

**Federated architecture:**
```
                    ┌─────────────────┐
                    │  Apollo Gateway │  ← Single entry point
                    │   (Federation)  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            ↓                ↓                ↓
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │User Service │  │Product Svc  │  │Order Service│
     │   GraphQL   │  │   GraphQL   │  │   GraphQL   │
     └─────────────┘  └─────────────┘  └─────────────┘
```

**User Service schema:**
```graphql
extend type Query {
  user(id: ID!): User
}

type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}
```

**Order Service schema (extends User):**
```graphql
extend type User @key(fields: "id") {
  id: ID! @external
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  user: User!
}
```

**Client query (unified API):**
```graphql
query {
  user(id: "123") {
    name         # From User Service
    email        # From User Service
    orders {     # From Order Service
      total
    }
  }
}

# Gateway automatically fetches from both services
```

**Setting up federation:**

```javascript
// User Service
const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = `
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }

  extend type Query {
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }) => getUserById(id)
  },
  User: {
    __resolveReference: (reference) => {
      return getUserById(reference.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});
```

```javascript
// Gateway
const { ApolloGateway } = require('@apollo/gateway');
const { ApolloServer } = require('apollo-server');

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001/graphql' },
    { name: 'orders', url: 'http://localhost:4002/graphql' },
    { name: 'products', url: 'http://localhost:4003/graphql' }
  ]
});

const server = new ApolloServer({ gateway });
```

## 💾 Caching Strategies

### 1. HTTP Caching (GET requests)

**Problem:** GraphQL uses POST requests (can't use HTTP cache).

**Solution:** Use GET for queries with persisted queries:

```javascript
// Client sends query hash instead of full query
GET /graphql?query=abc123&variables={"id":"123"}

// Server looks up query by hash
const queries = {
  'abc123': 'query GetUser($id: ID!) { user(id: $id) { name } }'
};

// Can now use HTTP caching headers
Cache-Control: public, max-age=300
```

### 2. Client-Side Caching

**Apollo Client (normalized cache):**
```javascript
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policy for user field
          user: {
            read(existing, { args, toReference }) {
              return existing || toReference({
                __typename: 'User',
                id: args.id
              });
            }
          }
        }
      },
      User: {
        // Unique identifier for caching
        keyFields: ['id']
      }
    }
  })
});

// Query (cached after first fetch)
const { data } = useQuery(GET_USER, {
  variables: { id: '123' },
  fetchPolicy: 'cache-first'  // Try cache first, then network
});
```

**Cache policies:**
- `cache-first`: Use cache if available (default)
- `cache-and-network`: Use cache, fetch in background
- `network-only`: Skip cache, always fetch
- `cache-only`: Only use cache, never fetch
- `no-cache`: Fetch but don't cache

### 3. Server-Side Caching

**Redis caching in resolvers:**
```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      const cacheKey = `user:${id}`;

      // Check cache
      let user = await context.redis.get(cacheKey);

      if (user) {
        context.logger.info('Cache hit', { userId: id });
        return JSON.parse(user);
      }

      // Cache miss, fetch from database
      context.logger.info('Cache miss', { userId: id });
      user = await context.db.users.findById(id);

      // Store in cache (expire after 5 minutes)
      await context.redis.setex(cacheKey, 300, JSON.stringify(user));

      return user;
    }
  }
};
```

**DataLoader (automatic batching and caching):**
```javascript
// DataLoader provides per-request caching
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findByIds(ids);
  return ids.map(id => users.find(u => u.id === id));
});

// First call: fetches from database
await userLoader.load('123');

// Second call in same request: returns cached value
await userLoader.load('123');  // Cache hit!
```

### 4. Response Caching

**Cache entire responses:**
```javascript
const { ApolloServer } = require('apollo-server');
const { createHash } = require('crypto');
const redis = require('redis').createClient();

const server = new ApolloServer({
  schema,
  plugins: [{
    requestDidStart() {
      return {
        async responseForOperation(requestContext) {
          const { query, variables } = requestContext.request;

          // Create cache key from query and variables
          const cacheKey = createHash('sha256')
            .update(query + JSON.stringify(variables))
            .digest('hex');

          // Check cache
          const cached = await redis.get(cacheKey);
          if (cached) {
            return { data: JSON.parse(cached) };
          }

          // Not in cache, let query execute
          return null;
        },

        async willSendResponse(requestContext) {
          const { query, variables, response } = requestContext;

          // Cache successful responses
          if (!response.errors) {
            const cacheKey = createHash('sha256')
              .update(query + JSON.stringify(variables))
              .digest('hex');

            await redis.setex(
              cacheKey,
              60,  // TTL: 60 seconds
              JSON.stringify(response.data)
            );
          }
        }
      };
    }
  }]
});
```

## 🔐 Authorization and Security

### 1. Field-Level Authorization

**Authorization in resolvers:**
```javascript
const resolvers = {
  Query: {
    adminUsers: async (parent, args, context) => {
      // Check if user is admin
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      return await context.db.users.findAll();
    }
  },

  User: {
    email: (user, args, context) => {
      // Users can only see their own email
      if (context.user.id !== user.id && context.user.role !== 'ADMIN') {
        return null;  // Hide email
      }
      return user.email;
    },

    ssn: (user, args, context) => {
      // Only admins can see SSN
      if (context.user.role !== 'ADMIN') {
        throw new Error('Not authorized to view SSN');
      }
      return user.ssn;
    }
  }
};
```

**Using directives for authorization:**
```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
  USER
  ADMIN
  SUPERADMIN
}

type Query {
  users: [User!]! @auth(requires: USER)
  adminDashboard: Dashboard! @auth(requires: ADMIN)
}

type User {
  id: ID!
  name: String!
  email: String! @auth(requires: USER)
  ssn: String! @auth(requires: ADMIN)
}
```

```javascript
// Implement @auth directive
const { SchemaDirectiveVisitor } = require('apollo-server');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { requires } = this.args;
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function(...args) {
      const context = args[2];

      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const hasRole = checkUserRole(context.user, requires);
      if (!hasRole) {
        throw new Error(`Requires ${requires} role`);
      }

      return resolve.apply(this, args);
    };
  }
}
```

### 2. Query Complexity and Depth Limiting

**Prevent expensive queries:**

```javascript
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const server = new ApolloServer({
  schema,
  validationRules: [
    // Limit query depth
    depthLimit(5),  // Max 5 levels deep

    // Limit query complexity
    createComplexityLimitRule(1000, {
      onCost: (cost) => {
        console.log('Query cost:', cost);
      },
      formatErrorMessage: (cost) =>
        `Query too complex: ${cost}. Maximum allowed: 1000`
    })
  ]
});

// Assign complexity to fields in schema
const typeDefs = `
  type Query {
    users: [User!]!  # Complexity: 10
    expensiveOperation: Result!  # Complexity: 100
  }
`;

const resolvers = {
  Query: {
    users: {
      resolve: () => getUsers(),
      complexity: 10
    },
    expensiveOperation: {
      resolve: () => performExpensiveOperation(),
      complexity: 100
    }
  }
};
```

**Prevent deep queries:**
```javascript
// Bad query (too deep)
query {
  user {
    friends {
      friends {
        friends {
          friends {
            friends {  // Depth: 6
              name
            }
          }
        }
      }
    }
  }
}

// Depth limit plugin
const depthLimit = require('graphql-depth-limit');

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(5)]
});

// Query rejected: "Query exceeds maximum depth of 5"
```

### 3. Rate Limiting

**Per-user rate limiting:**
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// Rate limit middleware
const limiter = rateLimit({
  store: new RedisStore({
    client: redis.createClient()
  }),
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Max 100 requests per window
  keyGenerator: (req) => {
    // Rate limit by user ID
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    throw new Error('Too many requests');
  }
});

app.use('/graphql', limiter);
```

**Rate limiting in resolvers:**
```javascript
const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 10,  // 10 requests
  duration: 60  // Per 60 seconds
});

const resolvers = {
  Query: {
    expensiveQuery: async (parent, args, context) => {
      const userId = context.user.id;

      try {
        await rateLimiter.consume(userId);
      } catch (error) {
        throw new Error('Rate limit exceeded');
      }

      return await performExpensiveQuery();
    }
  }
};
```

### 4. Input Validation and Sanitization

**Validate and sanitize inputs:**
```javascript
const { z } = require('zod');

// Define validation schemas
const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().positive().max(150).optional()
});

const resolvers = {
  Mutation: {
    createUser: async (parent, args, context) => {
      // Validate input
      try {
        const validated = createUserSchema.parse(args);
      } catch (error) {
        context.logger.error('Validation failed', { args, error });
        throw new Error(`Invalid input: ${error.message}`);
      }

      // Sanitize (prevent XSS)
      const sanitized = {
        name: sanitizeHtml(validated.name),
        email: validated.email.toLowerCase().trim(),
        age: validated.age
      };

      context.logger.info('Creating user', { input: sanitized });

      return await context.db.users.create(sanitized);
    }
  }
};
```

### 5. Preventing Data Leaks

**Hide error details in production:**
```javascript
const server = new ApolloServer({
  schema,
  formatError: (error) => {
    // Log full error server-side
    logger.error('GraphQL error', {
      message: error.message,
      path: error.path,
      stack: error.stack
    });

    // Hide sensitive details from client in production
    if (process.env.NODE_ENV === 'production') {
      return {
        message: 'Internal server error',
        path: error.path
      };
    }

    return error;
  }
});
```

## 📊 Best Practices

### Safety: Error Handling

**Structured error handling:**
```javascript
const { ApolloError } = require('apollo-server');

// Custom error classes
class NotFoundError extends ApolloError {
  constructor(message, properties) {
    super(message, 'NOT_FOUND', properties);
  }
}

class ValidationError extends ApolloError {
  constructor(message, properties) {
    super(message, 'VALIDATION_ERROR', properties);
  }
}

const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      try {
        const user = await context.db.users.findById(id);

        if (!user) {
          throw new NotFoundError('User not found', { userId: id });
        }

        return user;
      } catch (error) {
        context.logger.error('Failed to fetch user', {
          userId: id,
          error: error.message,
          stack: error.stack
        });

        throw error;
      }
    }
  }
};

// Client receives structured error
{
  "errors": [{
    "message": "User not found",
    "extensions": {
      "code": "NOT_FOUND",
      "userId": "123"
    }
  }]
}
```

**Partial errors (some fields succeed, some fail):**
```javascript
const resolvers = {
  User: {
    posts: async (user, args, context) => {
      try {
        return await context.db.posts.findByAuthorId(user.id);
      } catch (error) {
        context.logger.error('Failed to fetch posts', {
          userId: user.id,
          error
        });

        // Return null instead of throwing
        // User query succeeds, but posts field is null
        return null;
      }
    }
  }
};

// Response
{
  "data": {
    "user": {
      "name": "Alice",
      "posts": null  // Failed, but query succeeded
    }
  },
  "errors": [{
    "message": "Failed to fetch posts",
    "path": ["user", "posts"]
  }]
}
```

### Quality: Testing

**Unit test resolvers:**
```javascript
describe('User resolvers', () => {
  it('should fetch user by id', async () => {
    const mockDb = {
      users: {
        findById: jest.fn().mockResolvedValue({
          id: '123',
          name: 'Alice',
          email: 'alice@example.com'
        })
      }
    };

    const context = { db: mockDb, logger: console };

    const result = await resolvers.Query.user(
      null,
      { id: '123' },
      context
    );

    expect(result).toEqual({
      id: '123',
      name: 'Alice',
      email: 'alice@example.com'
    });

    expect(mockDb.users.findById).toHaveBeenCalledWith('123');
  });

  it('should throw error when user not found', async () => {
    const mockDb = {
      users: {
        findById: jest.fn().mockResolvedValue(null)
      }
    };

    const context = { db: mockDb, logger: console };

    await expect(
      resolvers.Query.user(null, { id: '999' }, context)
    ).rejects.toThrow('User not found');
  });
});
```

**Integration tests:**
```javascript
const { ApolloServer } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

describe('GraphQL API', () => {
  let server, query, mutate;

  beforeAll(() => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        db: testDb,
        logger: testLogger
      })
    });

    const testClient = createTestClient(server);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  it('should create and fetch user', async () => {
    // Create user
    const CREATE_USER = gql`
      mutation CreateUser($name: String!, $email: String!) {
        createUser(name: $name, email: $email) {
          id
          name
          email
        }
      }
    `;

    const createResult = await mutate({
      mutation: CREATE_USER,
      variables: {
        name: 'Bob',
        email: 'bob@example.com'
      }
    });

    expect(createResult.data.createUser).toMatchObject({
      name: 'Bob',
      email: 'bob@example.com'
    });

    const userId = createResult.data.createUser.id;

    // Fetch user
    const GET_USER = gql`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;

    const fetchResult = await query({
      query: GET_USER,
      variables: { id: userId }
    });

    expect(fetchResult.data.user).toEqual({
      id: userId,
      name: 'Bob',
      email: 'bob@example.com'
    });
  });
});
```

**Schema testing:**
```javascript
const { assertValidSchema } = require('graphql');

describe('Schema', () => {
  it('should be valid', () => {
    expect(() => assertValidSchema(schema)).not.toThrow();
  });

  it('should have Query type', () => {
    const queryType = schema.getQueryType();
    expect(queryType).toBeDefined();
    expect(queryType.name).toBe('Query');
  });

  it('should have user query', () => {
    const queryType = schema.getQueryType();
    const fields = queryType.getFields();
    expect(fields.user).toBeDefined();
    expect(fields.user.type.toString()).toBe('User');
  });
});
```

### Logging: Structured and Contextual

**Request logging:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'graphql.log' })
  ]
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    logger,
    traceId: req.headers['x-trace-id'] || generateTraceId(),
    userId: req.user?.id
  }),
  plugins: [{
    requestDidStart(requestContext) {
      const { query, variables, operationName } = requestContext.request;
      const { traceId, userId } = requestContext.context;

      logger.info('GraphQL request started', {
        traceId,
        userId,
        operationName,
        query: query?.substring(0, 200),  // Truncate for logging
        variables
      });

      const startTime = Date.now();

      return {
        willSendResponse(requestContext) {
          const duration = Date.now() - startTime;
          const { errors } = requestContext.response;

          if (errors) {
            logger.error('GraphQL request failed', {
              traceId,
              userId,
              operationName,
              duration,
              errors: errors.map(e => ({
                message: e.message,
                path: e.path,
                code: e.extensions?.code
              }))
            });
          } else {
            logger.info('GraphQL request completed', {
              traceId,
              userId,
              operationName,
              duration
            });
          }
        }
      };
    }
  }]
});
```

**Resolver logging:**
```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      const { logger, traceId } = context;

      logger.info('Fetching user', {
        traceId,
        userId: id,
        resolver: 'Query.user'
      });

      try {
        const user = await context.db.users.findById(id);

        if (!user) {
          logger.warn('User not found', {
            traceId,
            userId: id
          });
          throw new NotFoundError('User not found');
        }

        logger.info('User fetched successfully', {
          traceId,
          userId: id
        });

        return user;
      } catch (error) {
        logger.error('Failed to fetch user', {
          traceId,
          userId: id,
          error: error.message,
          stack: error.stack
        });

        throw error;
      }
    }
  }
};
```

**DataLoader logging:**
```javascript
const DataLoader = require('dataloader');

const createUserLoader = (db, logger, traceId) => {
  return new DataLoader(
    async (userIds) => {
      logger.info('Batch loading users', {
        traceId,
        userIds,
        count: userIds.length
      });

      const startTime = Date.now();

      try {
        const users = await db.users.findByIds(userIds);

        logger.info('Users loaded successfully', {
          traceId,
          count: users.length,
          duration: Date.now() - startTime
        });

        return userIds.map(id => users.find(u => u.id === id));
      } catch (error) {
        logger.error('Failed to load users', {
          traceId,
          userIds,
          error: error.message,
          duration: Date.now() - startTime
        });

        throw error;
      }
    },
    {
      cacheKeyFn: (key) => key.toString()
    }
  );
};
```

## 🏢 Use Cases Across Industries

### E-Commerce: Product Catalog and Orders

**Challenge:** Display products with reviews, inventory, and personalized recommendations.

**GraphQL solution:**
```graphql
query ProductPage($productId: ID!, $userId: ID!) {
  product(id: $productId) {
    id
    name
    description
    price
    images {
      url
      alt
    }
    inventory {
      inStock
      quantity
      nextRestockDate
    }
    reviews(limit: 5) {
      rating
      comment
      author {
        name
        verified
      }
    }
    relatedProducts {
      id
      name
      price
      image
    }
  }

  user(id: $userId) {
    cart {
      items {
        product {
          name
          price
        }
        quantity
      }
      total
    }
    recommendations(limit: 10) {
      id
      name
      price
    }
  }
}

# Single request fetches all data for the page
```

**Why GraphQL works:**
- One request gets all page data (products, reviews, cart, recommendations)
- Mobile app can request fewer fields (save bandwidth)
- Easy to add new features (wishlist, compare) by adding fields
- Different clients get different data without new endpoints

### Social Media: News Feed

**Challenge:** Build personalized feeds with posts, comments, likes, and real-time updates.

**GraphQL solution:**
```graphql
query NewsFeed($userId: ID!, $limit: Int!) {
  user(id: $userId) {
    name
    avatar
    feed(limit: $limit) {
      id
      content
      createdAt
      author {
        id
        name
        avatar
      }
      likes {
        count
        likedByUser(userId: $userId)
      }
      comments(limit: 3) {
        id
        text
        author {
          name
          avatar
        }
      }
      media {
        type
        url
        thumbnail
      }
    }
  }
}

# Real-time updates with subscriptions
subscription OnNewPost($userId: ID!) {
  postCreated(userId: $userId) {
    id
    content
    author {
      name
      avatar
    }
  }
}
```

**Why GraphQL works:**
- Flexible feed structure (posts with different media types)
- Real-time updates via subscriptions (new posts appear instantly)
- Mobile app requests smaller images and fewer comments
- Easy to A/B test new feed features

### Healthcare: Patient Records

**Challenge:** Access patient data across appointments, medications, labs, and insurance.

**GraphQL solution:**
```graphql
query PatientDashboard($patientId: ID!) {
  patient(id: $patientId) {
    id
    name
    dateOfBirth

    # Medical history
    conditions {
      name
      diagnosedDate
      status
    }

    # Medications
    medications {
      name
      dosage
      frequency
      prescribedBy {
        name
        specialty
      }
    }

    # Upcoming appointments
    appointments(status: SCHEDULED) {
      date
      time
      doctor {
        name
        specialty
      }
      location {
        name
        address
      }
    }

    # Recent lab results
    labResults(limit: 5) {
      testName
      value
      date
      normalRange
      status
    }

    # Insurance
    insurance {
      provider
      policyNumber
      coverageDetails
    }
  }
}
```

**Why GraphQL works:**
- Aggregate data from multiple systems (EHR, lab, insurance)
- Field-level authorization (hide sensitive fields based on role)
- Complete audit trail (log which fields were accessed)
- Different interfaces for doctors, nurses, patients (different queries)

### Financial Services: Trading Platform

**Challenge:** Real-time market data, portfolio tracking, and trade execution.

**GraphQL solution:**
```graphql
query TradingDashboard($userId: ID!) {
  user(id: $userId) {
    portfolio {
      totalValue
      dayChange
      holdings {
        symbol
        shares
        currentPrice
        totalValue
        gainLoss
      }
    }

    watchlist {
      symbol
      currentPrice
      dayChange
      alerts {
        type
        threshold
      }
    }

    recentTrades(limit: 10) {
      id
      symbol
      type
      shares
      price
      timestamp
    }
  }

  marketData(symbols: ["AAPL", "GOOGL", "MSFT"]) {
    symbol
    price
    volume
    high
    low
  }
}

# Real-time price updates
subscription OnPriceUpdate($symbols: [String!]!) {
  priceUpdated(symbols: $symbols) {
    symbol
    price
    timestamp
  }
}
```

**Why GraphQL works:**
- Real-time updates via subscriptions (live prices)
- Aggregate data from multiple sources (market data, account data, news)
- Complex authorization (users see only their portfolios)
- Mobile app needs minimal data, web dashboard needs everything

### Education: Learning Management System

**Challenge:** Students, courses, assignments, grades, and discussions.

**GraphQL solution:**
```graphql
query StudentDashboard($studentId: ID!) {
  student(id: $studentId) {
    name
    enrolledCourses {
      id
      name
      instructor {
        name
        avatar
      }

      # Upcoming assignments
      assignments(status: PENDING) {
        id
        title
        dueDate
        points
        submitted
      }

      # Recent grades
      grades {
        assignment {
          title
        }
        score
        feedback
      }

      # Course progress
      progress {
        completedLessons
        totalLessons
        percentComplete
      }

      # Discussions
      discussions(unread: true) {
        id
        title
        lastPost {
          author {
            name
          }
          createdAt
        }
      }
    }
  }
}
```

**Why GraphQL works:**
- Students, teachers, admins query same API differently
- One request loads entire dashboard
- Easy to add new features (forums, video progress, peer reviews)
- Mobile app optimizes for bandwidth

## ⚠️ Common Pitfalls

### 1. The N+1 Query Problem

**Problem:** Fetching lists with nested data causes excessive database queries.

**Bad (without DataLoader):**
```javascript
// Query: Get users with posts
query {
  users {        // 1 query
    name
    posts {      // N queries (one per user)
      title
    }
  }
}

// Execution:
// 1. SELECT * FROM users;                     (1 query)
// 2. SELECT * FROM posts WHERE author_id = 1; (N queries)
// 3. SELECT * FROM posts WHERE author_id = 2;
// ... N more queries
// Result: 1 + N queries!
```

**Solution: Use DataLoader**
```javascript
const DataLoader = require('dataloader');

// Create DataLoader
const postsByAuthorLoader = new DataLoader(async (authorIds) => {
  // Batch all author IDs into one query
  const posts = await db.posts.findByAuthorIds(authorIds);

  // Group by author
  return authorIds.map(id =>
    posts.filter(post => post.authorId === id)
  );
});

// Use in resolver
const resolvers = {
  User: {
    posts: (user, args, context) => {
      return context.loaders.postsByAuthor.load(user.id);
    }
  }
};

// Result: Only 2 queries!
// 1. SELECT * FROM users;
// 2. SELECT * FROM posts WHERE author_id IN (1, 2, 3, ...);
```

### 2. Over-Fetching in Resolvers

**Problem:** Resolvers fetch more data than needed.

**Bad:**
```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      // Fetches ALL user data from database
      const user = await context.db.users.findById(id);
      return user;  // Returns everything, even if query only asks for name
    }
  }
};

// Query only wants name:
query {
  user(id: "123") {
    name  // But resolver fetched all fields
  }
}
```

**Solution: Use GraphQL info to fetch selectively**
```javascript
const { parseResolveInfo } = require('graphql-parse-resolve-info');

const resolvers = {
  Query: {
    user: async (parent, { id }, context, info) => {
      // Parse which fields were requested
      const parsedInfo = parseResolveInfo(info);
      const requestedFields = Object.keys(parsedInfo.fields);

      // Fetch only requested fields from database
      const user = await context.db.users.findById(id, {
        select: requestedFields
      });

      return user;
    }
  }
};

// Now only fetches name field from database
```

### 3. No Query Complexity Limits

**Problem:** Malicious or accidental expensive queries crash the server.

**Bad (no limits):**
```graphql
query ExpensiveQuery {
  users {           # 1000 users
    posts {         # 100 posts each = 100,000
      comments {    # 50 comments each = 5,000,000
        author {    # 5 million database calls!
          friends { # Exponential explosion
            name
          }
        }
      }
    }
  }
}

# Server crashes!
```

**Solution: Add query depth and complexity limits**
```javascript
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const server = new ApolloServer({
  schema,
  validationRules: [
    depthLimit(5),  // Max 5 levels deep
    createComplexityLimitRule(1000)  // Max complexity: 1000
  ]
});

// Query rejected: "Query exceeds maximum depth"
```

### 4. Not Implementing Pagination

**Problem:** Fetching large lists without pagination.

**Bad:**
```graphql
query {
  users {  # Returns 10,000 users!
    name
    email
  }
}
```

**Solution: Implement cursor-based pagination**
```graphql
type Query {
  users(first: Int!, after: String): UserConnection!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  cursor: String!
  node: User!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

# Usage:
query {
  users(first: 10) {
    edges {
      cursor
      node {
        name
        email
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Next page:
query {
  users(first: 10, after: "cursor123") {
    edges {
      node {
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### 5. Ignoring Caching

**Problem:** Every request hits the database, even for identical queries.

**Solution: Implement caching at multiple levels**
```javascript
// 1. DataLoader (per-request caching)
const userLoader = new DataLoader(batchGetUsers);

// 2. Redis (cross-request caching)
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      const cached = await context.redis.get(`user:${id}`);
      if (cached) return JSON.parse(cached);

      const user = await context.db.users.findById(id);
      await context.redis.setex(`user:${id}`, 300, JSON.stringify(user));

      return user;
    }
  }
};

// 3. Client-side caching (Apollo Client)
const client = new ApolloClient({
  cache: new InMemoryCache()
});
```

### 6. Missing Error Handling

**Problem:** Generic errors don't help debugging.

**Bad:**
```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.db.users.findById(id);
      // What if database is down?
      // What if user not found?
      // Client gets generic error
    }
  }
};
```

**Solution: Structured error handling**
```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      try {
        const user = await context.db.users.findById(id);

        if (!user) {
          throw new NotFoundError('User not found', { userId: id });
        }

        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }

        context.logger.error('Database error', { userId: id, error });
        throw new Error('Failed to fetch user');
      }
    }
  }
};

// Client gets structured error:
{
  "errors": [{
    "message": "User not found",
    "extensions": {
      "code": "NOT_FOUND",
      "userId": "123"
    }
  }]
}
```

### 7. Exposing Internal Implementation

**Problem:** Schema exposes database structure directly.

**Bad:**
```graphql
type User {
  id: ID!
  name_first: String!    # Database column name
  name_last: String!     # Database column name
  email_addr: String!    # Database column name
  created_at: String!    # Internal timestamp
  updated_at: String!    # Internal timestamp
}
```

**Solution: Design API-first schema**
```graphql
type User {
  id: ID!
  firstName: String!     # Clean API naming
  lastName: String!
  fullName: String!      # Computed field
  email: String!
  createdAt: DateTime!   # Custom scalar
}

# Resolver maps to database
const resolvers = {
  User: {
    firstName: (user) => user.name_first,
    lastName: (user) => user.name_last,
    fullName: (user) => `${user.name_first} ${user.name_last}`,
    email: (user) => user.email_addr,
    createdAt: (user) => new Date(user.created_at)
  }
};
```

## 🛠️ Tooling and Ecosystem

### 1. GraphQL Playground / GraphiQL

**Interactive API explorer:**
- Autocomplete queries based on schema
- Schema documentation browser
- Query history
- Share queries via URL

**Setup:**
```javascript
const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({
  schema,
  playground: true  // Enable playground at /graphql
});
```

### 2. Apollo Client (Frontend)

**React integration:**
```javascript
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// Setup client
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

// Wrap app
function App() {
  return (
    <ApolloProvider client={client}>
      <UserProfile userId="123" />
    </ApolloProvider>
  );
}

// Use in component
function UserProfile({ userId }) {
  const GET_USER = gql`
    query GetUser($id: ID!) {
      user(id: $id) {
        name
        email
        posts {
          title
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <p>{data.user.email}</p>
      <ul>
        {data.user.posts.map(post => (
          <li key={post.title}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. GraphQL Code Generator

**Generate TypeScript types from schema:**
```bash
npm install @graphql-codegen/cli

# codegen.yml
schema: http://localhost:4000/graphql
generates:
  ./src/types.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
```

```bash
# Run codegen
npx graphql-codegen

# Generated types:
export type User = {
  id: string;
  name: string;
  email: string;
  posts: Post[];
};

export type GetUserQuery = {
  user: User;
};
```

### 4. Apollo Studio

**GraphQL observability platform:**
- Schema registry
- Operation metrics (latency, error rates)
- Field-level performance analytics
- Query usage tracking
- Schema change validation

### 5. GraphQL ESLint

**Lint GraphQL queries:**
```bash
npm install @graphql-eslint/eslint-plugin

# .eslintrc.js
module.exports = {
  overrides: [
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      rules: {
        '@graphql-eslint/known-type-names': 'error',
        '@graphql-eslint/no-anonymous-operations': 'error',
        '@graphql-eslint/naming-convention': 'warn'
      }
    }
  ]
};
```

## 📚 Quick Reference

### GraphQL vs REST

| Feature | GraphQL | REST |
|---------|---------|------|
| **Endpoints** | Single `/graphql` | Multiple `/api/resource` |
| **Data fetching** | Request exact fields | Fixed responses |
| **Over-fetching** | ✅ No | ❌ Yes |
| **Under-fetching** | ✅ No | ❌ Yes (multiple requests) |
| **Versioning** | ✅ Not needed | ⚠️ `/v1`, `/v2` |
| **Real-time** | ✅ Subscriptions | ⚠️ Long polling, SSE |
| **Caching** | ⚠️ Complex | ✅ HTTP cache |
| **Learning curve** | ⚠️ Steeper | ✅ Gentle |
| **Tooling** | ✅ Excellent | ✅ Good |
| **Type safety** | ✅ Strong | ❌ Weak |

### When to Use GraphQL

✅ **Use GraphQL when:**
- Building complex UIs with varied data needs
- Mobile apps need to minimize bandwidth
- Multiple clients need different data
- Real-time features are important
- Want self-documenting APIs
- Frontend and backend teams need independence

❌ **Don't use GraphQL when:**
- Simple CRUD operations
- File uploads/downloads are primary use case
- HTTP caching is critical
- Team unfamiliar with GraphQL (and no time to learn)
- Public API for third parties (REST is more familiar)

### Query Checklist

```
✅ Use variables instead of inline values
✅ Name your operations (query GetUser)
✅ Request only fields you need
✅ Use fragments for repeated fields
✅ Implement pagination for lists
✅ Handle loading and error states
✅ Add error boundaries
✅ Use DataLoader to prevent N+1
✅ Implement field-level authorization
✅ Log with trace IDs for debugging
```

### Security Checklist

```
✅ Implement authentication (JWT, OAuth)
✅ Add field-level authorization
✅ Limit query depth (prevent deep nesting)
✅ Limit query complexity (prevent expensive queries)
✅ Implement rate limiting (per user/IP)
✅ Validate and sanitize inputs
✅ Hide sensitive errors in production
✅ Use HTTPS in production
✅ Implement CORS properly
✅ Log security events (failed auth, rate limits)
```

## 🔗 Related Topics

### Within Architecture

- **[Microservices Architecture](../microservices/README.md)** — GraphQL Federation enables unified API across services
- **[Event-Driven Architecture](../event-driven/README.md)** — GraphQL Subscriptions for real-time events
- **[CQRS Pattern](../cqrs/README.md)** — Separate GraphQL schemas for queries and mutations
- **[System Design Concepts](../system-design-concepts/README.md)** — Caching, scalability patterns

### API Patterns

- **[REST APIs](../../05-backend/rest-api/README.md)** — Traditional API design
- **[API Gateway](../../02-architectures/microservices/README.md)** — GraphQL as API gateway
- **[WebSockets](../../05-backend/websockets/README.md)** — Underlying tech for subscriptions

### Infrastructure

- **[Caching Strategies](../../06-infrastructure/caching/README.md)** — Redis, CDN for GraphQL
- **[Load Balancing](../../06-infrastructure/load-balancing/README.md)** — Scaling GraphQL servers
- **[Monitoring](../../06-infrastructure/monitoring/README.md)** — Observability for GraphQL

### Frontend

- **[React](../../04-frontend/react/README.md)** — Apollo Client integration
- **[State Management](../../04-frontend/state-management/README.md)** — Apollo Cache
- **[Performance Optimization](../../04-frontend/performance/README.md)** — Query optimization

## 🎯 Next Steps

1. **Start simple**: Build a basic GraphQL server with a few queries
2. **Add mutations**: Implement create, update, delete operations
3. **Implement DataLoader**: Solve the N+1 problem
4. **Add authentication**: JWT-based auth with context
5. **Try subscriptions**: Real-time updates with WebSockets
6. **Explore federation**: Split schema across services
7. **Learn Apollo Client**: Integrate with React/Vue/Angular
8. **Production considerations**: Caching, rate limiting, monitoring

**Ready to build APIs?** Check out [REST APIs](../../05-backend/rest-api/README.md) to compare traditional API design, or dive into [Microservices Architecture](../microservices/README.md) to see how GraphQL fits into distributed systems. For frontend integration, explore [React](../../04-frontend/react/README.md) with Apollo Client.

---

**GraphQL transforms how we build APIs** — moving from server-dictated responses to client-driven queries. Start with simple queries, master resolvers and DataLoader, and gradually adopt advanced patterns like subscriptions and federation. The self-documenting nature and powerful tooling make GraphQL a joy to work with for both frontend and backend developers.
