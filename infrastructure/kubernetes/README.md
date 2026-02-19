# Kubernetes - Container Orchestration

## 📋 What is Kubernetes?

**Kubernetes (K8s)** is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It was originally developed by Google and is now maintained by the Cloud Native Computing Foundation (CNCF).

## 🎯 Key Concepts

### Simple Analogy

Think of Kubernetes as a **smart office building manager**:

- **Pods** are office spaces where teams (containers) work
- **Services** are the reception desks that route visitors to the right office
- **Deployments** are the building plans specifying how many offices you need
- **ConfigMaps/Secrets** are the company policies and security codes
- **The control plane** is the building management that ensures everything runs smoothly

### Why Kubernetes?

Without Kubernetes, running containers at scale means:

- Manually starting containers when they crash
- Manually distributing containers across servers
- Manually updating containers without downtime
- Manually routing traffic to healthy containers

Kubernetes automates all of this!

## 🏗️ Core Components

### 1. Control Plane (The Brain)

Manages the cluster and makes decisions about scheduling and scaling:

- **API Server**: Front-end for K8s, handles all REST commands
- **etcd**: Distributed key-value store for cluster state
- **Scheduler**: Assigns pods to nodes based on resource requirements
- **Controller Manager**: Maintains desired state (handles replication, endpoints, etc.)

### 2. Worker Nodes (The Workers)

Run your containerized applications:

- **kubelet**: Agent that ensures containers are running in pods
- **kube-proxy**: Manages network rules for pod communication
- **Container Runtime**: Docker, containerd, or CRI-O

### 3. Key Kubernetes Objects

#### **Pod**

Smallest deployable unit; one or more containers that share storage/network

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx
      image: nginx:1.21
      ports:
        - containerPort: 80
```

#### **Deployment**

Manages replica sets and provides declarative updates

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: myapp:1.0
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "128Mi"
              cpu: "250m"
            limits:
              memory: "256Mi"
              cpu: "500m"
```

#### **Service**

Exposes pods to network traffic (ClusterIP, NodePort, LoadBalancer)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

#### **ConfigMap**

Store non-sensitive configuration data

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_URL: "postgresql://db:5432"
  LOG_LEVEL: "info"
```

#### **Secret**

Store sensitive data (passwords, tokens, keys)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  password: cGFzc3dvcmQxMjM= # base64 encoded
```

#### **Ingress**

Manage external access to services (HTTP/HTTPS routing)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
```

## 🚀 Quick Start

### 1. Install kubectl (CLI tool)

```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
```

### 2. Local Kubernetes Cluster

**Option A: Minikube** (for local development)

```bash
# Install minikube
brew install minikube  # macOS
# or download from https://minikube.sigs.k8s.io/

# Start cluster
minikube start --cpus=4 --memory=8192

# Verify
kubectl get nodes
```

**Option B: Kind** (Kubernetes in Docker)

```bash
# Install kind
brew install kind

# Create cluster
kind create cluster --name dev-cluster

# Verify
kubectl cluster-info
```

### 3. Deploy Your First Application

```bash
# Create deployment
kubectl create deployment nginx --image=nginx:1.21

# Expose as service
kubectl expose deployment nginx --port=80 --type=NodePort

# Check status
kubectl get pods
kubectl get services

# Access (with minikube)
minikube service nginx
```

## 📊 Common kubectl Commands

### Cluster & Node Management

```bash
# Get cluster info
kubectl cluster-info

# Get nodes
kubectl get nodes
kubectl describe node <node-name>

# Get all resources
kubectl get all --all-namespaces
```

### Pod Management

```bash
# List pods
kubectl get pods
kubectl get pods -o wide  # Show more details

# Describe pod
kubectl describe pod <pod-name>

# View logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # Follow logs

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/bash

# Delete pod
kubectl delete pod <pod-name>
```

### Deployment Management

```bash
# Create deployment
kubectl create deployment myapp --image=myapp:1.0

# Scale deployment
kubectl scale deployment myapp --replicas=5

# Update image (rolling update)
kubectl set image deployment/myapp myapp=myapp:2.0

# Rollback
kubectl rollout undo deployment/myapp

# Check rollout status
kubectl rollout status deployment/myapp

# View rollout history
kubectl rollout history deployment/myapp
```

### Service Management

```bash
# List services
kubectl get services

# Describe service
kubectl describe service <service-name>

# Delete service
kubectl delete service <service-name>
```

### ConfigMap & Secret

```bash
# Create ConfigMap from literal
kubectl create configmap app-config --from-literal=key1=value1

# Create ConfigMap from file
kubectl create configmap app-config --from-file=config.properties

# Create Secret
kubectl create secret generic db-secret --from-literal=password=mypassword

# View (secrets are base64 encoded)
kubectl get secret db-secret -o yaml
```

### Debugging

```bash
# Get pod logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # Previous container logs

# Describe resource (shows events)
kubectl describe pod <pod-name>

# Port forwarding (access pod locally)
kubectl port-forward <pod-name> 8080:80

# Check resource usage
kubectl top nodes
kubectl top pods

# Events
kubectl get events --sort-by='.lastTimestamp'
```

## 🏭 Real-World Examples

### Example 1: Microservices Deployment

```yaml
# web-app-deployment.yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: production

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: mycompany/frontend:v1.2.0
          ports:
            - containerPort: 3000
          env:
            - name: API_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: api_url
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: password
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: production
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: api
          image: mycompany/backend-api:v2.1.0
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: database_url
          livenessProbe:
            httpGet:
              path: /api/health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"
            limits:
              memory: "1Gi"
              cpu: "1000m"

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: production
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - myapp.example.com
      secretName: app-tls
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 8080
```

Deploy:

```bash
kubectl apply -f web-app-deployment.yaml
kubectl get all -n production
```

### Example 2: StatefulSet for Databases

```yaml
# postgres-statefulset.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  ports:
    - port: 5432
  clusterIP: None
  selector:
    app: postgres

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:14
          ports:
            - containerPort: 5432
              name: postgres
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: postgres-storage
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

### Example 3: Horizontal Pod Autoscaler (HPA)

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### Example 4: CronJob for Scheduled Tasks

```yaml
# backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 2 * * *" # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: mycompany/db-backup:latest
              env:
                - name: DB_HOST
                  value: postgres.default.svc.cluster.local
                - name: BACKUP_BUCKET
                  value: s3://my-backups
          restartPolicy: OnFailure
```

## 🐛 Debugging & Troubleshooting

### Common Issues and Solutions

#### 1. Pod Stuck in Pending State

```bash
# Check pod events
kubectl describe pod <pod-name>

# Common causes:
# - Insufficient resources (CPU/memory)
# - PersistentVolume not available
# - Node selector/affinity constraints

# Check node resources
kubectl top nodes
kubectl describe node <node-name>
```

#### 2. Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # Previous crash logs

# Common causes:
# - Application error on startup
# - Missing environment variables
# - Failed health checks
# - Insufficient resources

# Check resource limits
kubectl describe pod <pod-name> | grep -A 5 Limits
```

#### 3. Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints <service-name>

# Test connectivity from within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
wget -O- http://<service-name>:<port>

# Check if pods are ready
kubectl get pods -l app=<your-app>

# Verify service selector matches pod labels
kubectl get service <service-name> -o yaml
kubectl get pods --show-labels
```

#### 4. ImagePullBackOff

```bash
# Check image name and tag
kubectl describe pod <pod-name> | grep Image

# Check image pull secret (for private registries)
kubectl get secrets

# Verify registry credentials
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<username> \
  --docker-password=<password>
```

### Debugging Tools

```bash
# Interactive debugging pod
kubectl run -it --rm debug \
  --image=nicolaka/netshoot \
  --restart=Never -- bash

# Inside debug pod, you can use:
# - curl, wget (HTTP testing)
# - nslookup, dig (DNS testing)
# - ping, traceroute (network testing)
# - netstat (port checking)

# Check DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup kubernetes.default

# Port forward for local access
kubectl port-forward pod/<pod-name> 8080:80

# Copy files from/to pod
kubectl cp <pod-name>:/path/to/file ./local-file
kubectl cp ./local-file <pod-name>:/path/to/destination
```

## 🎓 Common Questions

### Basic Level

**Q1: What is a Pod in Kubernetes?**

- A: A Pod is the smallest deployable unit in Kubernetes that represents one or more containers that share storage, network, and specifications for how to run.

**Q2: What's the difference between a Deployment and a StatefulSet?**

- A: Deployments are for stateless applications where pods are interchangeable. StatefulSets maintain stable identities and persistent storage for stateful applications like databases.

**Q3: What are the main components of Kubernetes control plane?**

- A: API Server, etcd, Scheduler, and Controller Manager.

### Intermediate Level

**Q4: Explain how a Service discovers pods.**

- A: Services use label selectors to match pods. When a service is created, Kubernetes creates an endpoint that tracks all pods matching the selector. The service then load-balances traffic across these endpoints.

**Q5: What's the purpose of readiness and liveness probes?**

- A: Liveness probes check if a container is running; if it fails, Kubernetes restarts the container. Readiness probes check if a container is ready to serve traffic; if it fails, the pod is removed from service endpoints.

**Q6: How does Horizontal Pod Autoscaler work?**

- A: HPA automatically scales the number of pods based on observed metrics (CPU, memory, or custom metrics). It checks metrics periodically and adjusts replicas to maintain the target utilization.

### Advanced Level

**Q7: Explain the difference between ClusterIP, NodePort, and LoadBalancer services.**

- A: ClusterIP exposes service internally within the cluster. NodePort exposes service on each node's IP at a static port. LoadBalancer provisions an external load balancer (cloud provider) that routes to the service.

**Q8: How would you perform a zero-downtime deployment?**

- A: Use rolling updates with proper readiness probes, set maxUnavailable and maxSurge in deployment strategy, ensure sufficient replicas, and configure appropriate health checks.

**Q9: What strategies can you use for managing secrets in Kubernetes?**

- A: Native Secrets (base64), external secret managers (HashiCorp Vault, AWS Secrets Manager), Sealed Secrets, encryption at rest using KMS, and tools like SOPS for GitOps.

## 📚 Best Practices

### 1. Resource Management

```yaml
# Always set resource requests and limits
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 2. Health Checks

```yaml
# Configure both liveness and readiness probes
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### 3. Use Namespaces

```bash
# Separate environments
kubectl create namespace dev
kubectl create namespace staging
kubectl create namespace production
```

### 4. Labels and Selectors

```yaml
# Use meaningful labels
metadata:
  labels:
    app: frontend
    version: v1.2.0
    environment: production
    team: platform
```

### 5. Security

```yaml
# Use security context
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```

### 6. ConfigMap and Secrets

```yaml
# Don't hardcode configuration
env:
  - name: DATABASE_URL
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: database_url
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

## 🔗 Related Resources

- **Official Documentation**: https://kubernetes.io/docs/
- **Interactive Tutorial**: https://kubernetes.io/docs/tutorials/kubernetes-basics/
- **Patterns**: https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/
- **Architecture**: [Microservices](../../architectures/microservices/), [Event-Driven](../../architectures/event-driven/)
- **Infrastructure**: [Docker](../docker/), [CI/CD](../cicd/), [Monitoring](../monitoring/)

## 📖 Next Steps

1. **Practice**: Set up a local cluster with Minikube or Kind
2. **Deploy**: Try deploying the examples above
3. **Scale**: Experiment with HPA and manual scaling
4. **Monitor**: Set up Prometheus and Grafana (see [Monitoring](../monitoring/))
5. **Advanced**: Learn Helm charts, Operators, and service meshes (Istio, Linkerd)

---

**Remember**: Kubernetes is complex but powerful. Start small, practice regularly, and gradually add complexity as you understand the basics!
