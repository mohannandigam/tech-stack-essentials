# Monorepo Architecture

## What is a Monorepo?

A **monorepo** (monolithic repository) is a software development strategy where code for many projects, applications, or services lives in a single version-controlled repository. Instead of having one repository per project (polyrepo), all your code lives together in one place.

Think of it like this: Instead of organizing books in separate buildings for each genre, you keep all books in one library with different sections. You can easily move between sections, share resources, and manage everything from one place.

## Simple Analogy

Imagine you run a restaurant chain:

**Monorepo approach**: You keep all recipes, supplier contracts, employee handbooks, and training materials in one central office. Any chef at any location can access the same recipes. When you update a recipe, all locations get the update immediately. Everyone sees the whole operation.

**Polyrepo approach**: Each restaurant location has its own filing cabinet. When you update the burger recipe, you need to send copies to every location separately. Locations might end up with different versions of the same recipe.

A monorepo gives you that central office where everything lives together.

## Why Does It Matter?

In modern software, applications rarely work alone. Your mobile app, website, API server, and admin dashboard often share code — the same data structures, validation logic, utility functions. Managing these shared pieces is critical to productivity.

**The core problem monorepos solve**: How do you share code between related projects without creating chaos?

Without a monorepo, sharing code means publishing packages, managing versions, and coordinating updates across repositories. Change a shared function? You publish a new package version, update dependencies in five other repos, test them all separately, and hope nothing breaks.

With a monorepo, you change the function once, see immediately which projects use it, update them all in one commit, and test everything together. The feedback loop collapses from days to minutes.

This matters for:
- **Startups** building multiple apps quickly
- **Platform teams** maintaining shared libraries
- **Enterprises** coordinating large-scale changes
- **Anyone** with frontend + backend + mobile apps

## How It Works

### The Structure

A typical monorepo looks like this:

```
my-company/
├── apps/                          # Individual applications
│   ├── web/                       # Main website
│   │   ├── package.json
│   │   └── src/
│   ├── mobile/                    # Mobile app
│   │   ├── package.json
│   │   └── src/
│   └── admin/                     # Admin dashboard
│       ├── package.json
│       └── src/
│
├── packages/                      # Shared libraries
│   ├── ui-components/             # Shared React components
│   │   ├── package.json
│   │   └── src/
│   ├── utils/                     # Common utilities
│   │   ├── package.json
│   │   └── src/
│   └── api-client/                # API wrapper
│       ├── package.json
│       └── src/
│
├── tools/                         # Development tools
│   ├── build-scripts/
│   └── generators/
│
├── package.json                   # Root package.json
├── nx.json                        # Monorepo tool config
└── tsconfig.base.json             # Shared TypeScript config
```

### Key Mechanisms

**1. Workspaces**

Modern package managers (npm, yarn, pnpm) support "workspaces" — they understand that multiple package.json files exist and can link them together. When `web` depends on `ui-components`, the package manager creates a direct link to the local code instead of downloading from npm.

**2. Dependency Graphs**

Monorepo tools build a graph showing which projects depend on which. When you change `ui-components`, the tool knows that `web`, `mobile`, and `admin` all use it. This enables smart building: only rebuild what's affected.

```
ui-components changes
    ↓
  web (uses ui-components) → needs rebuild
  mobile (uses ui-components) → needs rebuild
  admin (uses ui-components) → needs rebuild
  api-server (doesn't use it) → skip rebuild
```

**3. Task Orchestration**

Instead of running `npm test` in each directory manually, you run one command: `nx test --all` or `turborepo run test`. The tool:
- Figures out which projects have tests
- Runs them in parallel (when possible)
- Caches results (if nothing changed, skip it)
- Shows you a unified report

**4. Shared Configuration**

One `.prettierrc`, one `.eslintrc`, one `tsconfig.json` at the root. All projects inherit these settings. Want to change the formatting style? Update one file, and all projects follow.

## Key Concepts

### Workspace

A **workspace** is a project within the monorepo with its own `package.json`. It can be an application (something you deploy) or a package (something other workspaces use).

### Dependency Graph

A **dependency graph** maps which workspaces depend on which. It's how the monorepo tool knows what to rebuild when something changes.

```
     api-client
         ↓
    ┌────┴────┐
    ↓         ↓
  web       mobile
```

If `api-client` changes, both `web` and `mobile` need to be retested.

### Affected Detection

**Affected detection** means "figure out what changed and only rebuild/test those parts." If you change a file in `admin`, you don't need to rebuild `web`. This makes CI fast even with hundreds of projects.

### Task Caching

**Task caching** means "remember the results of commands and skip them if inputs haven't changed." If you run `npm run build` and nothing changed, the tool returns the cached output instantly.

### Code Generation

Many monorepo tools include **generators** — scripts that create new projects with the right structure. Run `nx generate app my-new-app` and it scaffolds a complete application following your team's conventions.

## Advantages

### 1. Effortless Code Sharing

**Without monorepo**: You write a utility function in the API. The frontend team needs it. You extract it into a package, publish to npm (or a private registry), update the frontend's `package.json`, install, test, deploy. Timeline: days.

**With monorepo**: You move the function to `packages/utils`, import it in the frontend, test both together, commit. Timeline: minutes.

No publishing, no version juggling, no waiting.

### 2. Atomic Changes Across Projects

**Scenario**: Your API changes the user data structure. Now the web app, mobile app, and admin dashboard need updates.

**Without monorepo**: You make three separate PRs in three repos, coordinate reviews, merge them in sequence, hope nothing breaks between merges.

**With monorepo**: One PR changes the API and all three frontends. One review, one merge, one deploy. If tests pass, everything works together.

### 3. Consistent Tooling and Standards

Everyone uses the same linter, formatter, testing framework, build tools. New developers clone one repo and have the entire development environment ready.

Update your linting rules? They apply everywhere instantly. Adopt a new testing library? Migrate all projects together and see the full impact.

### 4. Easier Large-Scale Refactoring

Need to rename a function used in 50 places across 10 projects?

**Without monorepo**: Find all repos that use it, update each, coordinate merges, deploy in sequence.

**With monorepo**: Your IDE finds all 50 usages automatically. Rename, test, commit. Done.

### 5. Better Visibility

See the entire system in one place. Understand how pieces fit together. New team members grasp the architecture faster because they see everything, not isolated fragments.

### 6. Simplified Dependency Management

One `node_modules` at the root (mostly). Projects share the same version of React, TypeScript, ESLint. No "our web app uses React 18 but mobile uses React 17" confusion.

Updating a major dependency? You see immediately what breaks across all projects.

## Challenges

### 1. Repository Size and Performance

As the monorepo grows, `git clone` gets slower. Repositories can reach gigabytes. Operations like `git status` and `git log` take longer.

**Solutions**:
- **Shallow clones**: `git clone --depth=1` only downloads recent history
- **Sparse checkout**: Only download the directories you need
- **Git LFS**: Store large binary files separately
- **VFS for Git**: Virtual file system (Microsoft's solution for Windows repo)

### 2. Build Times

Building everything from scratch can take hours in a large monorepo.

**Solutions**:
- **Incremental builds**: Only rebuild what changed
- **Distributed caching**: Share build results across the team
- **Parallel execution**: Build multiple projects simultaneously
- **Smart task scheduling**: Build dependencies first, then dependents

### 3. CI/CD Complexity

Running all tests on every commit wastes time and resources.

**Solutions**:
- **Affected testing**: Only test projects impacted by changes
- **Distributed task execution**: Run tests across multiple machines
- **Selective deployment**: Only deploy changed applications
- **Matrix builds**: Test multiple configurations in parallel

### 4. Access Control and Security

Everyone can see all code. This is great for collaboration but can be a problem for:
- Proprietary code that only some teams should access
- Compliance requirements (e.g., PCI, HIPAA)
- Separating open-source from closed-source code

**Solutions**:
- Code ownership files (CODEOWNERS) for review requirements
- Branch protections and required approvals
- Separate sensitive code into a different repo
- Use git submodules for sensitive portions

### 5. Merge Conflicts

More people working in one repo means more potential conflicts.

**Solutions**:
- Frequent small commits instead of large ones
- Clear code ownership and boundaries
- Automated merge tools and conflict resolution
- Good communication and coordination

### 6. Learning Curve

Monorepo tools have their own concepts and commands. Teams need training.

**Solutions**:
- Comprehensive documentation
- Onboarding guides and tutorials
- Dedicated monorepo champions on the team
- Gradual adoption (start small, grow over time)

## Tools Comparison

### Nx

**Best for**: JavaScript/TypeScript applications (Angular, React, Node.js)

**Strengths**:
- Smart affected detection
- Built-in code generators
- Excellent caching (local and distributed)
- Visualization tools (dependency graphs)
- Active community and plugins

**Use when**: You're building JavaScript apps and want powerful tooling with great DX.

**Example**:
```bash
# Create a new Nx workspace
npx create-nx-workspace@latest my-company

# Generate a new React app
nx generate @nrwl/react:app web

# Run tests only for affected projects
nx affected:test

# Build with caching
nx build web
```

### Turborepo

**Best for**: JavaScript/TypeScript projects, especially Next.js

**Strengths**:
- Fast (written in Rust under the hood)
- Simple configuration
- Remote caching with Vercel
- Great for frontend-heavy stacks
- Minimal boilerplate

**Use when**: You want speed and simplicity, especially with Next.js apps.

**Example**:
```bash
# Install Turborepo
npm install turbo --save-dev

# Run all build scripts in parallel
turbo run build

# Run tests with caching
turbo run test --cache-dir=".turbo"
```

### Lerna

**Best for**: Publishing multiple npm packages

**Strengths**:
- Mature and widely used
- Great for open-source projects
- Handles versioning and publishing
- Works with existing repos
- Lower learning curve

**Use when**: You're managing multiple npm packages that you publish publicly.

**Example**:
```bash
# Initialize Lerna
npx lerna init

# Bootstrap (install dependencies)
lerna bootstrap

# Publish all changed packages
lerna publish
```

### Bazel

**Best for**: Large-scale, multi-language projects (Google uses this)

**Strengths**:
- Supports many languages (Java, Go, C++, Python, etc.)
- Extremely fast with hermetic builds
- Scales to massive codebases
- Reproducible builds

**Use when**: You have a very large codebase with multiple languages and need Google-scale tooling.

**Example**:
```bash
# Build a target
bazel build //my-app:server

# Run tests
bazel test //...

# Query dependencies
bazel query 'deps(//my-app:server)'
```

### Comparison Table

| Feature | Nx | Turborepo | Lerna | Bazel |
|---------|-----|-----------|-------|-------|
| **Ease of Use** | Medium | Easy | Easy | Hard |
| **Speed** | Fast | Very Fast | Medium | Extremely Fast |
| **Caching** | Excellent | Excellent | Basic | Excellent |
| **Language Support** | JS/TS | JS/TS | JS/TS | Multi-language |
| **Learning Curve** | Medium | Low | Low | High |
| **Best For** | JS apps | Next.js apps | npm packages | Enterprise, multi-lang |
| **Remote Caching** | Yes (Nx Cloud) | Yes (Vercel) | No | Yes |
| **Affected Detection** | Yes | Yes | Limited | Yes |
| **Distributed Execution** | Yes | No | No | Yes |

## CI/CD Strategies

### Strategy 1: Test Everything (Simple)

Run all tests on every commit. Easy to set up but slow as the repo grows.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test:all  # Tests everything
```

**Pros**: Simple, guaranteed coverage
**Cons**: Slow, wastes resources

### Strategy 2: Affected Testing (Smart)

Only test what changed. Fast and efficient.

```yaml
# With Nx
- run: npx nx affected:test --base=origin/main

# With Turborepo
- run: npx turbo run test --filter="...[origin/main]"
```

**Pros**: Fast, efficient
**Cons**: Requires proper dependency graph

### Strategy 3: Distributed Execution (Scale)

Split tests across multiple machines.

```yaml
# With Nx Cloud
- run: npx nx affected:test --parallel=5
```

**Pros**: Very fast even with many projects
**Cons**: More complex setup, costs money

### Strategy 4: Selective Deployment

Only deploy apps that changed.

```yaml
# Detect which apps changed
- run: |
    AFFECTED=$(nx affected:apps --plain --base=origin/main)
    echo "Deploying: $AFFECTED"

# Deploy only affected
- run: |
    for app in $AFFECTED; do
      npm run deploy:$app
    done
```

### Best Practices for CI/CD

1. **Use affected detection** — Don't waste time testing unchanged code
2. **Cache dependencies** — node_modules changes rarely, cache it
3. **Cache build outputs** — Reuse builds from previous runs
4. **Fail fast** — Run quick tests first (linting, type-checking)
5. **Parallelize** — Run independent tasks simultaneously
6. **Set up notifications** — Alert team when builds break
7. **Use branch protections** — Require passing tests before merge

## Real-World Examples

### Google

**Scale**: One of the world's largest monorepos (billions of lines of code)

**How they do it**:
- Custom version control (Piper) instead of Git
- Bazel for builds
- Massive infrastructure for distributed builds
- 25,000+ engineers working in one repo

**Why it works**: Custom tools built for extreme scale, strong engineering culture.

### Meta (Facebook)

**Scale**: Millions of lines of code across many products

**How they do it**:
- Mercurial (not Git) for version control
- Custom build system (Buck)
- Distributed caching across datacenters
- Code ownership and review systems

**Why it works**: Investment in tooling and infrastructure.

### Microsoft

**Scale**: Windows codebase, Office, and more

**How they do it**:
- Git with Virtual File System (VFS)
- Custom build orchestration
- Sparse checkout (developers only download what they need)

**Why it works**: VFS makes Git scale to massive repos.

### Uber

**Scale**: Microservices architecture in a monorepo

**How they do it**:
- Migrated from polyrepo to monorepo
- Bazel for builds
- Automated migration tools
- Strong testing culture

**Why it works**: Better coordination across services.

### Your Company (Getting Started)

**Scale**: A few apps and shared libraries

**How to do it**:
- Start with Nx or Turborepo (easy setup)
- Use npm/yarn/pnpm workspaces
- Set up CI with affected testing
- Grow gradually

**Why it works**: Modern tools make monorepos accessible to teams of any size.

## Dependency Graph Visualization

Understanding dependencies is crucial. Here's how to visualize them:

### With Nx

```bash
# Generate interactive graph
nx graph

# Opens browser showing all projects and dependencies
```

You see:
- Circles = projects
- Arrows = dependencies
- Click to explore

### ASCII Example

Here's a simple dependency graph:

```
                    shared-utils
                    /     |     \
                   /      |      \
                  /       |       \
            ui-components |     api-client
               /    \     |       /    \
              /      \    |      /      \
           web      mobile  |   admin  mobile
                            |
                        api-server
```

This shows:
- `shared-utils` is used by everything
- `ui-components` is used by `web` and `mobile`
- `api-client` wraps the API and is used by `web`, `admin`, and `mobile`
- `api-server` uses `shared-utils`

When `shared-utils` changes, everything needs retesting. When `ui-components` changes, only `web` and `mobile` are affected.

## Best Practices

### Safety: Input Validation and Error Handling

Even in a monorepo, each project should validate inputs at boundaries:

```typescript
// Bad: Assume data is valid
function formatUser(user) {
  return `${user.firstName} ${user.lastName}`; // Crashes if user is null
}

// Good: Validate inputs
function formatUser(user) {
  if (!user || typeof user !== 'object') {
    throw new Error('Invalid user object');
  }

  const firstName = user.firstName ?? 'Unknown';
  const lastName = user.lastName ?? 'Unknown';

  return `${firstName} ${lastName}`;
}
```

**Why it matters**: Shared code is used everywhere. One broken function breaks multiple apps.

### Quality: Comprehensive Testing

Test shared libraries thoroughly because they have many consumers:

```typescript
// packages/utils/src/formatUser.test.ts
describe('formatUser', () => {
  it('formats valid user correctly', () => {
    expect(formatUser({ firstName: 'Alice', lastName: 'Smith' }))
      .toBe('Alice Smith');
  });

  it('handles missing fields gracefully', () => {
    expect(formatUser({ firstName: 'Bob' }))
      .toBe('Bob Unknown');
  });

  it('throws on invalid input', () => {
    expect(() => formatUser(null))
      .toThrow('Invalid user object');
  });
});
```

**Testing strategy**:
- **Unit tests**: Test each function in isolation
- **Integration tests**: Test how packages work together
- **E2E tests**: Test complete user flows across apps

### Logging: Structured and Contextual

In a monorepo with many projects, good logging helps you debug across boundaries:

```typescript
// Bad: Basic console.log
console.log('User logged in');

// Good: Structured logging with context
logger.info('User logged in', {
  userId: user.id,
  source: 'web-app',
  action: 'login',
  timestamp: new Date().toISOString(),
  traceId: req.headers['x-trace-id'] // Trace across services
});
```

**Why it matters**: When a bug involves multiple projects, you need to trace the flow. Structured logs with trace IDs let you follow a request across the entire system.

**Example scenario**: User reports checkout failure. You search logs for their `traceId` and see:
1. `web-app`: Added item to cart
2. `api-client`: Called `/checkout`
3. `api-server`: Payment validation failed
4. `payment-service`: Credit card declined

Without structured logging and trace IDs, you'd be guessing.

### Code Ownership

Use a `CODEOWNERS` file to define who reviews changes:

```
# CODEOWNERS file at repo root

# Default owner for everything
*                     @tech-lead

# Specific teams for their domains
/apps/web/            @frontend-team
/apps/mobile/         @mobile-team
/apps/api-server/     @backend-team

# Shared code needs more scrutiny
/packages/            @tech-lead @frontend-team @backend-team

# Infrastructure changes
/.github/             @devops-team
/tools/               @devops-team
```

**Why it matters**: Changes to shared code impact multiple teams. Required reviewers prevent breaking changes.

### Versioning Strategies

**Strategy 1: Independent Versioning**

Each package has its own version. Best for libraries you publish.

```
packages/ui-components: v2.3.0
packages/api-client: v1.5.2
packages/utils: v3.0.1
```

**Strategy 2: Unified Versioning**

All packages share one version. Best for tightly coupled apps.

```
All packages: v1.4.0
```

**Strategy 3: No Versioning**

Don't version internal packages at all. Just use latest code. Best for apps you don't publish.

### Configuration Sharing

Create a base configuration that all projects extend:

```json
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

// apps/web/tsconfig.json (extends base)
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

**Benefits**:
- Consistency across projects
- Update once, apply everywhere
- Projects can override when needed

## Use Cases Across Industries

### Healthcare

**Challenge**: HIPAA-compliant patient portal with mobile app, web dashboard, and admin tools

**Monorepo solution**:
```
packages/
  patient-data/        # Shared data models (HIPAA-compliant)
  auth/                # Authentication logic
  audit-logging/       # Track all data access

apps/
  patient-portal/      # Web app for patients
  patient-mobile/      # Mobile app
  clinician-dashboard/ # For doctors and nurses
  admin-tools/         # For IT and compliance
```

**Why it works**:
- Change patient data model once, all apps update
- Shared audit logging ensures compliance everywhere
- Test HIPAA compliance across the entire system

### Finance

**Challenge**: Trading platform with web UI, mobile app, risk management tools, and reporting

**Monorepo solution**:
```
packages/
  trading-models/      # Stock, options, futures data models
  risk-engine/         # Risk calculation library
  market-data/         # Real-time market data client
  compliance/          # SEC compliance utilities

apps/
  trading-web/         # Web trading platform
  trading-mobile/      # Mobile trading app
  risk-dashboard/      # For risk managers
  compliance-reports/  # Automated reports
```

**Why it works**:
- Risk calculations consistent across all apps
- Market data client shared, reducing bugs
- Compliance rules enforced everywhere

### E-commerce

**Challenge**: Online store with web, mobile, admin, inventory, and fulfillment systems

**Monorepo solution**:
```
packages/
  product-catalog/     # Product data and search
  cart/                # Shopping cart logic
  payment/             # Payment processing
  inventory/           # Stock management

apps/
  storefront-web/      # Customer-facing website
  storefront-mobile/   # Mobile app
  admin-portal/        # Manage products, orders
  warehouse-app/       # Fulfillment system
```

**Why it works**:
- Product catalog shared ensures consistency
- Cart logic identical across web and mobile
- Inventory updates propagate everywhere

### Social Media

**Challenge**: Platform with web app, iOS app, Android app, content moderation tools, analytics

**Monorepo solution**:
```
packages/
  social-graph/        # Follower/following logic
  feed-algorithm/      # Content ranking
  content-moderation/  # Shared moderation rules
  api-client/          # API wrapper

apps/
  web-app/             # Main website
  ios-app/             # Native iOS
  android-app/         # Native Android
  moderation-tools/    # For content moderators
  analytics-dashboard/ # Business intelligence
```

**Why it works**:
- Feed algorithm consistent across platforms
- Content policies enforced uniformly
- API changes update all clients simultaneously

## Debugging in a Monorepo

### Challenge: Bugs Span Multiple Projects

A bug report: "Checkout fails on the mobile app."

Possible culprits:
- Mobile app UI code
- Shared cart logic
- API client
- Backend API
- Payment service

### Debugging Strategy

**Step 1: Identify the Boundary**

Where does the problem start? Use logs with trace IDs:

```typescript
// Mobile app
logger.error('Checkout failed', {
  traceId: 'abc123',
  step: 'calling-api',
  error: error.message
});

// API client (search logs for abc123)
logger.error('API request failed', {
  traceId: 'abc123',
  endpoint: '/checkout',
  statusCode: 500
});

// Backend (search for abc123)
logger.error('Payment processing failed', {
  traceId: 'abc123',
  service: 'payment-service',
  reason: 'card-declined'
});
```

Following the `traceId` shows the error originated in the payment service.

**Step 2: Use Dependency Graph**

Run `nx graph` to see what depends on the payment service. Maybe you changed something there that broke checkout.

**Step 3: Run Affected Tests**

```bash
# Test everything affected by your recent changes
nx affected:test --base=main
```

If payment service tests pass but integration tests fail, the issue is in how components connect.

**Step 4: Local Reproduction**

In a monorepo, you can run the entire stack locally:

```bash
# Start all services
npm run dev

# All projects run together:
# - Mobile app on simulator
# - API server on localhost:3000
# - Payment service on localhost:4000
```

Set breakpoints across projects and debug the entire flow.

### Common Debugging Patterns

**Pattern 1: Trace Requests Across Projects**

Use a trace ID that flows through all layers:

```typescript
// Frontend generates trace ID
const traceId = generateTraceId();
api.checkout({ traceId, ...data });

// API forwards it
await paymentService.process({ traceId, ...data });

// All logs include traceId
logger.info('Processing payment', { traceId });
```

**Pattern 2: Use Dependency Graph to Find Impact**

Changed a function? Run:

```bash
nx affected:graph --base=main
```

See visually what's affected. Test those projects.

**Pattern 3: Incremental Debugging**

Build projects one by one to isolate issues:

```bash
nx build api-client    # Does this work?
nx build web           # Does this work?
nx build mobile        # Does this fail? Issue is here or in dependencies.
```

## Common Pitfalls

### Pitfall 1: Circular Dependencies

**Problem**: Project A depends on B, B depends on C, C depends on A. Nothing builds.

**Example**:
```
ui-components → utils → formatters → ui-components  // Circle!
```

**Solution**:
- Tools like Nx detect and prevent this
- Refactor: move shared code to a new package both can use
- Use lint rules to catch circular deps early

```bash
# Nx detects this automatically
nx build ui-components
# Error: Circular dependency detected!
```

### Pitfall 2: Oversharing Code

**Problem**: You create a `utils` package that becomes a dumping ground for everything. It has 1000+ functions and everything depends on it.

**Impact**: Changing anything in `utils` means rebuilding the entire repo.

**Solution**:
- Create focused packages: `date-utils`, `string-utils`, `api-utils`
- Use dependency graph to monitor: Is everything depending on one package?
- Regular refactoring to split large packages

### Pitfall 3: Ignoring Affected Testing

**Problem**: You test everything on every commit, CI takes 30 minutes, developers wait.

**Solution**:
- Use affected testing: `nx affected:test`
- Only test what changed
- CI drops from 30 minutes to 3 minutes

### Pitfall 4: No Code Ownership

**Problem**: Anyone can change anything, no one feels responsible, quality degrades.

**Solution**:
- Add a CODEOWNERS file
- Require reviews from appropriate teams
- Set up branch protections

```
# Require frontend team approval for UI changes
/packages/ui-components/  @frontend-team
```

### Pitfall 5: Poor Local Development Experience

**Problem**: Developers need to start 10 services manually to work on one feature. Frustration ensues.

**Solution**:
- Create a single "dev" command that starts everything:

```bash
# In root package.json
"scripts": {
  "dev": "nx run-many --target=serve --projects=web,api,mobile --parallel"
}
```

Now `npm run dev` starts the entire stack.

### Pitfall 6: Merge Conflicts in Lockfiles

**Problem**: `package-lock.json` or `yarn.lock` conflicts constantly.

**Solution**:
- Use `pnpm` (better conflict resolution)
- Commit lockfile separately: commit code first, then regenerate and commit lockfile
- Use merge strategies: `git merge -X theirs package-lock.json`

### Pitfall 7: Slow Git Operations

**Problem**: Repo grows to gigabytes, `git clone` takes 20 minutes.

**Solution**:
- Use shallow clone: `git clone --depth=1`
- Use Git LFS for large files
- Clean up old branches regularly
- Consider sparse checkout for huge repos

## Common Interview Questions

### Q: When would you choose a monorepo over polyrepo?

**Good Answer**:

"I'd choose a monorepo when:
- Multiple projects share significant code
- We need atomic changes across projects (change an API and all clients at once)
- The team is small enough to handle shared visibility
- We have the tooling expertise (Nx, Turborepo)

I'd choose polyrepo when:
- Projects are truly independent
- Teams are large and work on separate products
- We need strict access control
- Projects have radically different tech stacks

The key question is: How much code sharing and coordination do we need? High sharing → monorepo. Low sharing → polyrepo."

### Q: How do you prevent a monorepo from becoming slow?

**Good Answer**:

"Three main strategies:

1. **Affected detection**: Only build and test what changed. Tools like Nx analyze the dependency graph and run tasks only for affected projects.

2. **Caching**: Cache build outputs and test results. If inputs haven't changed, reuse cached results. Nx Cloud and Turborepo offer distributed caching across the team.

3. **Parallel execution**: Run independent tasks simultaneously. If projects A and B don't depend on each other, test them in parallel.

Additionally, Git-level optimizations like shallow clones and sparse checkout help with large repositories."

### Q: How do you handle versioning in a monorepo?

**Good Answer**:

"It depends on whether you're publishing packages or building applications:

**For published packages** (e.g., open-source libraries): Use independent versioning. Each package has its own semver version. Tools like Lerna manage this.

**For internal applications**: Often you don't version at all, or use unified versioning (one version for the whole repo). Applications just use the latest code.

The key is consistency and automation. Use tools to bump versions, generate changelogs, and publish automatically."

### Q: What are the security considerations in a monorepo?

**Good Answer**:

"Key concerns:

1. **Access control**: Everyone can see all code. Use CODEOWNERS for review requirements, but if you have truly secret code, it might need a separate repo.

2. **Dependency vulnerabilities**: One vulnerable dependency affects multiple projects. Use tools like `npm audit` and Dependabot to catch these.

3. **Secrets management**: Don't commit secrets. Use environment variables and secret managers. In a monorepo, a leaked secret can affect many projects.

4. **Supply chain security**: Verify dependencies. In a monorepo, the blast radius of a compromised dependency is larger.

Use branch protections, required reviews, and CI checks to maintain security standards."

## Quick Reference

### When to Use Monorepo

| Scenario | Monorepo | Polyrepo |
|----------|----------|----------|
| Multiple projects sharing code | ✅ Great fit | ❌ Complex package management |
| Need atomic cross-project changes | ✅ Easy (one commit) | ❌ Coordinated PRs |
| Microservices architecture | ✅ Good for coordination | ⚠️ Works but less visibility |
| Large org, independent teams | ⚠️ Can work with tooling | ✅ Easier independence |
| Open source with external contributors | ❌ Too much access | ✅ Better access control |
| Startup with small team | ✅ Fast iteration | ⚠️ Overhead of multiple repos |

### Tooling Decision Tree

```
Start here: What's your primary language?
│
├─ JavaScript/TypeScript
│  │
│  ├─ Multiple apps + shared libraries? → Nx
│  ├─ Next.js heavy? → Turborepo
│  └─ Publishing npm packages? → Lerna
│
├─ Multiple languages (Java, Go, Python)
│  │
│  └─ Large scale? → Bazel
│
└─ Simple project, no special needs
   │
   └─ npm/yarn/pnpm workspaces (no extra tool)
```

### Common Commands

#### Nx

```bash
# Create workspace
npx create-nx-workspace@latest

# Generate new app
nx generate @nrwl/react:app my-app

# Run command for one project
nx build my-app

# Run for all projects
nx run-many --target=build --all

# Run only for affected projects
nx affected:build

# See dependency graph
nx graph

# Test affected projects
nx affected:test
```

#### Turborepo

```bash
# Install
npm install turbo --global

# Run tasks across all projects
turbo run build
turbo run test
turbo run lint

# Run with filtering
turbo run build --filter=my-app

# Clear cache
turbo run build --force
```

#### Lerna

```bash
# Initialize
npx lerna init

# Install dependencies
lerna bootstrap

# Run command in all packages
lerna run build
lerna run test

# Publish changed packages
lerna publish

# Version bump
lerna version
```

### Essential Files Checklist

```
✅ package.json (root) - Main package file
✅ nx.json or turbo.json - Monorepo tool config
✅ tsconfig.base.json - Shared TypeScript config
✅ .eslintrc.json - Shared linting rules
✅ .prettierrc - Shared formatting rules
✅ CODEOWNERS - Define code ownership
✅ .gitignore - Ignore node_modules, build outputs
✅ CI/CD config (.github/workflows/) - Automated testing
```

## Related Topics

### Within Architecture

- **[Microservices Architecture](../microservices/README.md)** — Monorepos are popular for managing multiple microservices
- **[System Design Concepts](../system-design-concepts/README.md)** — Understand how components interact at scale

### Development Practices

- **[CI/CD](../../03-methodologies/README.md)** — Monorepos require smart CI/CD strategies
- **[Code Review Practices](../../03-methodologies/README.md)** — CODEOWNERS and review flows
- **[Testing Strategies](../../03-methodologies/README.md)** — Unit, integration, and E2E testing in monorepos

### Infrastructure

- **[Version Control (Git)](../../00-foundations/README.md)** — Understanding Git for large repositories
- **[Build Systems](../../06-infrastructure/README.md)** — How builds work in monorepos
- **[Caching Strategies](../../06-infrastructure/README.md)** — Distributed caching for performance

## Next Steps

1. **Experiment**: Create a small monorepo with 2-3 projects
2. **Try a tool**: Install Nx or Turborepo and explore the commands
3. **Study dependency graphs**: Visualize how projects connect
4. **Set up CI**: Implement affected testing in a CI pipeline
5. **Read about scale**: Study how Google, Meta, and Microsoft manage massive monorepos

**Ready to dive deeper?** Explore [System Design Concepts](../system-design-concepts/README.md) to understand the architectural principles that apply to large codebases, or jump into [Microservices Architecture](../microservices/README.md) to see how monorepos and microservices often work together.
