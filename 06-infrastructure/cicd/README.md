# CI/CD - Continuous Integration & Continuous Delivery

## 📋 What is CI/CD?

**CI/CD** is a method to frequently deliver apps to customers by introducing automation into the stages of app development. It bridges the gap between development and operations through automation.

- **Continuous Integration (CI)**: Automatically building and testing code changes
- **Continuous Delivery (CD)**: Automatically deploying code changes to testing/staging environments
- **Continuous Deployment**: Automatically deploying to production

## 🎯 Key Concepts

### Simple Analogy

Think of CI/CD as an **automated assembly line**:

- **CI**: Quality checks at each station - if a part is defective, the line stops immediately
- **CD**: Automatically moving products through packaging and shipping stages
- **Continuous Deployment**: Products automatically shipped to customers once they pass all checks

### Why CI/CD?

Without CI/CD:

- Manual testing before each release (hours/days)
- Integration issues discovered late
- Risky, infrequent deployments
- Long feedback loops

With CI/CD:

- Automated testing (minutes)
- Issues caught early
- Frequent, low-risk deployments
- Fast feedback

## 🏗️ CI/CD Pipeline Stages

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Code      │    │   Build &   │    │   Test      │    │   Deploy    │
│   Commit    │───▶│   Compile   │───▶│   (Auto)    │───▶│   Staging   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                  │
                                                                  ▼
                                                          ┌─────────────┐
                                                          │   Deploy    │
                                                          │  Production │
                                                          └─────────────┘
```

### 1. Source Stage

- Developer commits code to version control (Git)
- Triggers CI/CD pipeline automatically

### 2. Build Stage

- Compile code
- Resolve dependencies
- Create artifacts (Docker images, binaries, etc.)

### 3. Test Stage

- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user workflows
- **Security Scans**: Check for vulnerabilities
- **Code Quality**: Linting, code coverage

### 4. Deploy Stage

- **Staging**: Deploy to test environment
- **Production**: Deploy to live environment (manual approval or automatic)

## 🛠️ Popular CI/CD Tools

### GitHub Actions

- Integrated with GitHub repositories
- YAML-based workflows
- Large marketplace of actions
- Free for public repos

### Jenkins

- Open-source automation server
- Highly extensible with plugins
- Self-hosted
- Pipeline as code (Jenkinsfile)

### GitLab CI/CD

- Built into GitLab
- YAML configuration (.gitlab-ci.yml)
- Auto DevOps features
- Integrated container registry

### CircleCI

- Cloud-based CI/CD
- Fast parallel testing
- Docker-first approach
- Good free tier

### Azure DevOps

- Microsoft's CI/CD platform
- Integrates with Azure services
- Supports multiple languages
- Build and release pipelines

## 📝 GitHub Actions Examples

### Basic CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run coverage
        run: npm run coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
```

### Docker Build & Push

```yaml
# .github/workflows/docker.yml
name: Docker Build & Push

on:
  push:
    branches: [main]
    tags: ["v*"]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache,mode=max
```

### Deploy to Kubernetes

```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig.yaml
          export KUBECONFIG=kubeconfig.yaml

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp \
            myapp=ghcr.io/${{ github.repository }}:${{ github.sha }} \
            -n production

          kubectl rollout status deployment/myapp -n production

      - name: Verify deployment
        run: |
          kubectl get pods -n production
          kubectl get services -n production
```

### Complete CI/CD Pipeline

```yaml
# .github/workflows/pipeline.yml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: 18.x
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Stage 1: Code Quality & Testing
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

  # Stage 2: Security Scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run dependency check
        run: npm audit

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run CodeQL analysis
        uses: github/codeql-action/analyze@v2

  # Stage 3: Build & Push
  build:
    needs: [quality, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  # Stage 4: Deploy to Staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          # Deploy commands here
          echo "Deploying to staging..."

      - name: Run smoke tests
        run: |
          # Smoke test commands
          echo "Running smoke tests..."

  # Stage 5: Deploy to Production
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy to production
        run: |
          # Deploy commands here
          echo "Deploying to production..."

      - name: Verify deployment
        run: |
          # Health check commands
          echo "Verifying deployment..."

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Production deployment completed!"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📝 Jenkins Pipeline Examples

### Declarative Pipeline (Jenkinsfile)

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'myregistry.com'
        IMAGE_NAME = 'myapp'
        KUBECONFIG = credentials('kubernetes-config')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy image ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}'
            }
        }

        stage('Push Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    kubectl set image deployment/myapp \\
                        myapp=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \\
                        -n staging
                    kubectl rollout status deployment/myapp -n staging
                '''
            }
        }

        stage('Smoke Tests') {
            steps {
                sh 'npm run test:smoke -- --env=staging'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                sh '''
                    kubectl set image deployment/myapp \\
                        myapp=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \\
                        -n production
                    kubectl rollout status deployment/myapp -n production
                '''
            }
        }
    }

    post {
        always {
            junit 'test-results/**/*.xml'
            publishHTML([
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
        success {
            slackSend(
                color: 'good',
                message: "Build ${BUILD_NUMBER} succeeded: ${JOB_NAME}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Build ${BUILD_NUMBER} failed: ${JOB_NAME}"
            )
        }
    }
}
```

## 📝 GitLab CI/CD Example

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy-staging
  - deploy-production

variables:
  DOCKER_REGISTRY: registry.gitlab.com
  IMAGE_NAME: $CI_PROJECT_PATH
  DOCKER_TLS_CERTDIR: "/certs"

# Reusable templates
.test_template: &test_template
  image: node:18
  before_script:
    - npm ci
  cache:
    paths:
      - node_modules/

# Test jobs
lint:
  <<: *test_template
  stage: test
  script:
    - npm run lint

unit-tests:
  <<: *test_template
  stage: test
  script:
    - npm run test:unit
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

integration-tests:
  <<: *test_template
  stage: test
  services:
    - postgres:14
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
  script:
    - npm run test:integration

security-scan:
  stage: test
  image: aquasec/trivy:latest
  script:
    - trivy fs --security-checks vuln,config .

# Build job
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main

# Deploy to staging
deploy-staging:
  stage: deploy-staging
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context staging
    - kubectl set image deployment/myapp myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -n staging
    - kubectl rollout status deployment/myapp -n staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main

# Deploy to production
deploy-production:
  stage: deploy-production
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - kubectl set image deployment/myapp myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -n production
    - kubectl rollout status deployment/myapp -n production
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

## 🐛 Debugging CI/CD Issues

### Common Problems

#### 1. Build Failures

```bash
# Check build logs carefully
# Common issues:
# - Missing dependencies
# - Incorrect Node/Python version
# - Environment variable not set
# - Insufficient permissions

# Solution: Run build locally first
docker build -t myapp:test .
npm run build
```

#### 2. Test Failures in CI but Pass Locally

```bash
# Common causes:
# - Timing issues (tests too fast/slow in CI)
# - Missing test database
# - Environment differences

# Solution: Match CI environment
docker run -it node:18 bash
npm ci  # Use exact versions
npm test
```

#### 3. Deployment Timeouts

```bash
# Check rollout status
kubectl rollout status deployment/myapp

# Check pod events
kubectl get events --sort-by='.lastTimestamp'

# Common fixes:
# - Increase readiness probe initial delay
# - Check image pull times
# - Verify resource limits
```

#### 4. Authentication Issues

```bash
# Docker registry
docker login registry.example.com

# Kubernetes cluster
kubectl config view
kubectl get pods  # Test access

# AWS/Cloud
aws sts get-caller-identity
```

### Debugging Tips

```bash
# GitHub Actions
# - Enable debug logging
# Settings → Secrets → ACTIONS_STEP_DEBUG = true

# Jenkins
# - Check console output
# - Review stage view
# - Check workspace files

# GitLab CI
# - Review job logs
# - Use artifacts to debug
# - Check CI/CD > Pipelines > Job details
```

## 🎓 Common Questions

### Basic

**Q1: What's the difference between CI and CD?**

- A: CI focuses on automating integration and testing of code changes. CD extends this by automating deployment to staging/production environments.

**Q2: What are the benefits of CI/CD?**

- A: Faster feedback, reduced integration issues, automated testing, frequent low-risk deployments, faster time to market.

**Q3: What is a pipeline in CI/CD?**

- A: A pipeline is an automated sequence of steps (build, test, deploy) that code goes through from commit to production.

### Intermediate

**Q4: How do you handle secrets in CI/CD?**

- A: Use encrypted environment variables, secret management tools (Vault, AWS Secrets Manager), or CI/CD platform's built-in secret storage. Never commit secrets to code.

**Q5: What is a deployment strategy?**

- A: Methods for releasing new versions: Blue-Green (two identical environments), Canary (gradual rollout), Rolling (incremental replacement), Recreate (stop old, start new).

**Q6: How do you ensure zero-downtime deployments?**

- A: Use rolling updates, health checks, readiness probes, gradual traffic shifting, and maintain backward compatibility.

### Advanced

**Q7: How would you implement a multi-environment CI/CD pipeline?**

- A: Use environment-specific configurations, separate deployment stages with approval gates, environment variables/secrets per environment, and progressive testing (dev → staging → production).

**Q8: How do you handle database migrations in CI/CD?**

- A: Run migrations before deploying new code, ensure backward compatibility, use tools like Flyway/Liquibase, test migrations in staging, have rollback plan.

**Q9: What metrics would you track in a CI/CD pipeline?**

- A: Build success rate, build duration, deployment frequency, lead time for changes, change failure rate, mean time to recovery (MTTR).

## 📚 Best Practices

### 1. Keep Pipelines Fast

```yaml
# Use caching
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# Run tests in parallel
strategy:
  matrix:
    test-group: [unit, integration, e2e]
```

### 2. Fail Fast

```yaml
# Run quick checks first
stages:
  - lint # Fast
  - test # Medium
  - build # Slower
  - deploy # Slowest
```

### 3. Use Pipeline as Code

- Store CI/CD configuration in version control
- Review pipeline changes in pull requests
- Test pipeline changes in branches

### 4. Secure Your Pipeline

- Use least privilege for credentials
- Scan for vulnerabilities
- Sign and verify artifacts
- Audit pipeline changes

### 5. Monitor and Alert

- Track pipeline metrics
- Alert on failures
- Set up notifications (Slack, email)
- Create dashboards

## 🔗 Related Resources

- **Infrastructure**: [Docker](../docker/), [Kubernetes](../kubernetes/), [Terraform](../terraform/)
- **Architectures**: [Microservices](../../02-architectures/microservices/)
- **Domain Examples**: See CI/CD in practice across [domains](../../10-domain-examples/)

---

**Remember**: Start simple, add complexity as needed, and always test your pipeline changes!
