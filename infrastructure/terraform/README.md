# Terraform - Infrastructure as Code

## 📋 What is Terraform?

**Terraform** is an open-source Infrastructure as Code (IaC) tool created by HashiCorp that allows you to define and provision infrastructure using a declarative configuration language. It manages infrastructure across multiple cloud providers (AWS, GCP, Azure) and services using a consistent workflow.

## 🎯 Key Concepts

### Simple Analogy

Think of Terraform as architectural blueprints for buildings:

- **Blueprints (Terraform Code)** - Written specifications of what you want
- **Construction Team (Terraform Engine)** - Builds according to blueprints
- **Building Inspector (State File)** - Tracks what's been built
- **Change Orders (Plan)** - Shows what will change before making changes
- **Multiple Contractors (Providers)** - Can work with different services (AWS, GCP, Azure)

### Core Benefits

- **Declarative** - Describe desired state, Terraform figures out how
- **Multi-Cloud** - Single tool for AWS, GCP, Azure, and 100+ providers
- **Version Control** - Infrastructure definitions in Git
- **Preview Changes** - See what will change before applying
- **State Management** - Tracks real infrastructure state
- **Idempotent** - Safe to run multiple times

## 🏗️ Terraform Core Concepts

### 1. HCL (HashiCorp Configuration Language)

The language used to write Terraform configurations:

```hcl
# This is a comment
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Environment = "Production"
  }
}
```

**Key Elements:**

- `resource` - Infrastructure object to manage
- `"aws_instance"` - Resource type
- `"web"` - Resource name (local identifier)
- Block `{}` - Configuration parameters

### 2. Providers

Plugins that interact with cloud platforms and services:

```hcl
# AWS Provider
provider "aws" {
  region = "us-east-1"
  profile = "default"
}

# GCP Provider
provider "google" {
  project = "my-project-id"
  region  = "us-central1"
}

# Azure Provider
provider "azurerm" {
  features {}
  subscription_id = "xxxxx"
}
```

**Popular Providers:**

- AWS, GCP, Azure (Cloud platforms)
- Kubernetes, Docker (Container orchestration)
- GitHub, GitLab (Version control)
- Datadog, PagerDuty (Monitoring)
- 1000+ community providers

### 3. Resources

Infrastructure components you want to create:

```hcl
# EC2 Instance
resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}

# S3 Bucket
resource "aws_s3_bucket" "data" {
  bucket = "my-company-data-bucket"
}

# Security Group
resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### 4. Variables

Make configurations reusable and flexible:

**variables.tf**

```hcl
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 1
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
```

**Usage:**

```hcl
resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type
  count         = var.instance_count

  tags = merge(
    var.tags,
    {
      Environment = var.environment
    }
  )
}
```

**Passing Variables:**

```bash
# Command line
terraform apply -var="environment=production"

# Variable file (terraform.tfvars)
environment = "production"
instance_type = "t2.small"
instance_count = 3

# Environment variable
export TF_VAR_environment="production"
```

### 5. Outputs

Extract values from your infrastructure:

**outputs.tf**

```hcl
output "instance_ip" {
  description = "Public IP of the instance"
  value       = aws_instance.app.public_ip
}

output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.data.id
}

output "database_endpoint" {
  description = "Database connection endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true  # Hide from console output
}
```

**Access Outputs:**

```bash
# After apply
terraform output instance_ip
# Output: 54.123.45.67

terraform output -json  # Get all outputs as JSON
```

### 6. Data Sources

Query existing infrastructure:

```hcl
# Get latest Amazon Linux AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Get existing VPC
data "aws_vpc" "default" {
  default = true
}

# Use data in resources
resource "aws_instance" "app" {
  ami    = data.aws_ami.amazon_linux.id
  vpc_id = data.aws_vpc.default.id
}
```

### 7. State File

Terraform tracks your infrastructure in a state file:

```json
{
  "version": 4,
  "terraform_version": "1.5.0",
  "resources": [
    {
      "type": "aws_instance",
      "name": "app",
      "instances": [
        {
          "attributes": {
            "id": "i-1234567890abcdef0",
            "public_ip": "54.123.45.67",
            "instance_type": "t2.micro"
          }
        }
      ]
    }
  ]
}
```

**State Management:**

- Default: `terraform.tfstate` (local file)
- Best Practice: Remote backend (S3, Terraform Cloud)
- **Never edit state manually**
- Use `terraform state` commands

**Remote State (S3 Backend):**

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"  # For state locking
  }
}
```

### 8. Modules

Reusable Terraform configurations:

**Directory Structure:**

```
modules/
  web-server/
    main.tf
    variables.tf
    outputs.tf
main.tf
```

**Module Definition (modules/web-server/main.tf):**

```hcl
variable "instance_type" {
  type = string
}

variable "name" {
  type = string
}

resource "aws_instance" "server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type

  tags = {
    Name = var.name
  }
}

output "instance_id" {
  value = aws_instance.server.id
}
```

**Using Module (main.tf):**

```hcl
module "web_server" {
  source        = "./modules/web-server"
  instance_type = "t2.micro"
  name          = "production-web"
}

# Access module outputs
output "web_server_id" {
  value = module.web_server.instance_id
}
```

**Public Modules:**

```hcl
# From Terraform Registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
}
```

## 🔄 Terraform Workflow

### 1. Write Configuration

Create `.tf` files defining your infrastructure:

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

### 2. Initialize (`terraform init`)

Download provider plugins and initialize backend:

```bash
terraform init
```

**What it does:**

- Downloads provider plugins
- Initializes backend
- Downloads modules
- Creates `.terraform/` directory

### 3. Plan (`terraform plan`)

Preview changes before applying:

```bash
terraform plan
```

**Output Example:**

```
Terraform will perform the following actions:

  # aws_instance.web will be created
  + resource "aws_instance" "web" {
      + ami           = "ami-0c55b159cbfafe1f0"
      + instance_type = "t2.micro"
      + id            = (known after apply)
      + public_ip     = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

**Save Plan:**

```bash
terraform plan -out=tfplan
terraform apply tfplan  # Apply saved plan
```

### 4. Apply (`terraform apply`)

Create/update infrastructure:

```bash
terraform apply
```

**With auto-approve:**

```bash
terraform apply -auto-approve
```

### 5. Destroy (`terraform destroy`)

Remove all managed infrastructure:

```bash
terraform destroy
```

**Destroy specific resource:**

```bash
terraform destroy -target=aws_instance.web
```

## 📚 Real-World Examples

### Example 1: Complete AWS Web Application

**Directory Structure:**

```
terraform-web-app/
  main.tf
  variables.tf
  outputs.tf
  terraform.tfvars
```

**main.tf:**

```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-igw"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-${count.index + 1}"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.environment}-public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "web" {
  name        = "${var.environment}-web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH from admin"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.admin_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-web-sg"
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  count                  = var.instance_count
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public[count.index % length(aws_subnet.public)].id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "<h1>Hello from $(hostname -f)</h1>" > /var/www/html/index.html
              EOF

  tags = {
    Name        = "${var.environment}-web-${count.index + 1}"
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_lb" "web" {
  name               = "${var.environment}-web-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web.id]
  subnets            = aws_subnet.public[*].id

  tags = {
    Name = "${var.environment}-web-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "web" {
  name     = "${var.environment}-web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
  }
}

# Target Group Attachment
resource "aws_lb_target_group_attachment" "web" {
  count            = var.instance_count
  target_group_arn = aws_lb_target_group.web.arn
  target_id        = aws_instance.web[count.index].id
  port             = 80
}

# Listener
resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.web.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# Data source for AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
```

**variables.tf:**

```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 2
}

variable "key_name" {
  description = "SSH key name"
  type        = string
}

variable "admin_cidr_blocks" {
  description = "CIDR blocks for admin access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
```

**outputs.tf:**

```hcl
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "load_balancer_dns" {
  description = "Load balancer DNS name"
  value       = aws_lb.web.dns_name
}

output "instance_ids" {
  description = "Instance IDs"
  value       = aws_instance.web[*].id
}

output "instance_public_ips" {
  description = "Public IPs of instances"
  value       = aws_instance.web[*].public_ip
}
```

**terraform.tfvars:**

```hcl
environment = "production"
instance_type = "t2.small"
instance_count = 3
key_name = "my-key-pair"
admin_cidr_blocks = ["203.0.113.0/24"]
```

**Deploy:**

```bash
terraform init
terraform plan
terraform apply
```

### Example 2: GCP Kubernetes Cluster

```hcl
provider "google" {
  project = var.project_id
  region  = var.region
}

# GKE Cluster
resource "google_container_cluster" "primary" {
  name     = "${var.environment}-gke-cluster"
  location = var.region

  # We can't create a cluster with no node pool, so create smallest possible
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.environment}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = var.node_count

  node_config {
    preemptible  = var.use_preemptible
    machine_type = var.machine_type

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = {
      environment = var.environment
    }

    tags = ["gke-node", var.environment]
  }

  autoscaling {
    min_node_count = var.min_node_count
    max_node_count = var.max_node_count
  }
}

# VPC
resource "google_compute_network" "vpc" {
  name                    = "${var.environment}-vpc"
  auto_create_subnetworks = "false"
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.environment}-subnet"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.10.0.0/24"
}

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "node_count" {
  description = "Number of nodes"
  type        = number
  default     = 3
}

variable "min_node_count" {
  description = "Minimum nodes for autoscaling"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum nodes for autoscaling"
  type        = number
  default     = 10
}

variable "machine_type" {
  description = "Machine type"
  type        = string
  default     = "n1-standard-1"
}

variable "use_preemptible" {
  description = "Use preemptible instances"
  type        = bool
  default     = false
}

output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE cluster name"
}

output "kubernetes_cluster_host" {
  value       = google_container_cluster.primary.endpoint
  description = "GKE cluster host"
  sensitive   = true
}
```

### Example 3: Multi-Environment with Workspaces

```bash
# Create workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Switch workspace
terraform workspace select dev

# View current workspace
terraform workspace show

# List workspaces
terraform workspace list
```

**Configuration with workspaces:**

```hcl
locals {
  environment = terraform.workspace

  instance_counts = {
    dev     = 1
    staging = 2
    prod    = 5
  }

  instance_types = {
    dev     = "t2.micro"
    staging = "t2.small"
    prod    = "t2.medium"
  }
}

resource "aws_instance" "app" {
  count         = local.instance_counts[local.environment]
  ami           = data.aws_ami.amazon_linux.id
  instance_type = local.instance_types[local.environment]

  tags = {
    Name        = "${local.environment}-app-${count.index + 1}"
    Environment = local.environment
  }
}
```

## 🐛 Debugging and Troubleshooting

### Common Issues and Solutions

#### 1. **State Lock Errors**

**Error:**

```
Error: Error acquiring the state lock
Error message: ConditionalCheckFailedException
Lock Info:
  ID:        abc123-456-789
  Path:      terraform.tfstate
  Operation: OperationTypeApply
  Who:       user@hostname
```

**Causes:**

- Previous operation crashed
- Multiple users/CI jobs running simultaneously
- Stale lock from failed operation

**Solutions:**

```bash
# Option 1: Wait for lock to expire (usually 5-15 minutes)

# Option 2: Force unlock (use with caution!)
terraform force-unlock abc123-456-789

# Option 3: Manual DynamoDB lock removal (S3 backend)
aws dynamodb delete-item \
  --table-name terraform-locks \
  --key '{"LockID": {"S": "my-bucket/terraform.tfstate-md5"}}'

# Prevention: Use state locking with DynamoDB
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}
```

#### 2. **Resource Already Exists**

**Error:**

```
Error: Error creating S3 bucket: BucketAlreadyExists
Error: creating EC2 Instance: InvalidKeyPair.Duplicate
```

**Causes:**

- Resource created outside Terraform
- State file out of sync
- Previous failed apply

**Solutions:**

```bash
# Option 1: Import existing resource
terraform import aws_s3_bucket.data my-existing-bucket
terraform import aws_instance.web i-1234567890abcdef0

# Option 2: Remove from configuration if not needed

# Option 3: Rename resource in config
resource "aws_s3_bucket" "data" {
  bucket = "my-new-unique-bucket-name-${random_id.bucket.hex}"
}

# Option 4: Refresh state
terraform refresh
```

#### 3. **Provider Authentication Issues**

**Error:**

```
Error: error configuring Terraform AWS Provider: no valid credential sources
Error: google: could not find default credentials
```

**Solutions:**

**AWS:**

```bash
# Option 1: Environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

# Option 2: AWS CLI profile
aws configure --profile myprofile
terraform apply -var="profile=myprofile"

# Option 3: In provider block
provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

# Option 4: Use IAM role (EC2, Lambda, ECS)
provider "aws" {
  region = "us-east-1"
  # Uses instance IAM role automatically
}
```

**GCP:**

```bash
# Option 1: Application Default Credentials
gcloud auth application-default login

# Option 2: Service account key
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/keyfile.json"

# Option 3: In provider block
provider "google" {
  credentials = file("keyfile.json")
  project     = "my-project-id"
  region      = "us-central1"
}
```

#### 4. **Dependency Errors**

**Error:**

```
Error: Reference to undeclared resource
Error: Cycle detected in resource dependencies
```

**Solutions:**

```hcl
# Use explicit depends_on when implicit dependency isn't working
resource "aws_instance" "app" {
  ami           = "ami-xxx"
  instance_type = "t2.micro"

  depends_on = [
    aws_security_group.app,
    aws_iam_role_policy_attachment.app
  ]
}

# Break circular dependencies by separating resources
# Instead of A -> B -> A
# Make A -> B -> C

# Use data sources for existing resources
data "aws_vpc" "existing" {
  id = var.vpc_id
}

resource "aws_subnet" "new" {
  vpc_id = data.aws_vpc.existing.id
}
```

#### 5. **Module Errors**

**Error:**

```
Error: Module not installed
Error: Failed to download module
Error: Unsupported argument in module call
```

**Solutions:**

```bash
# Reinitialize to download modules
terraform init -upgrade

# Clear module cache
rm -rf .terraform/modules
terraform init

# Check module source
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"  # Always specify version
}

# For local modules, check path
module "web_server" {
  source = "./modules/web-server"  # Relative to root
}

# Debug module issues
terraform get -update
```

#### 6. **Variable Validation Errors**

**Error:**

```
Error: Invalid value for variable
Error: Required variable not set
```

**Solutions:**

```hcl
# Add validation rules
variable "instance_type" {
  type    = string
  default = "t2.micro"

  validation {
    condition     = contains(["t2.micro", "t2.small", "t2.medium"], var.instance_type)
    error_message = "Instance type must be t2.micro, t2.small, or t2.medium."
  }
}

# Set required variables
variable "environment" {
  type        = string
  description = "Environment name"
  # No default = required
}

# Provide via multiple methods
terraform apply -var="environment=prod"
terraform apply -var-file="prod.tfvars"
export TF_VAR_environment="prod"
```

#### 7. **State Drift**

**Error:**

```
Warning: Resource has been modified outside Terraform
Error: Provider configuration changed
```

**Solutions:**

```bash
# Detect drift
terraform plan -refresh-only

# Accept drift (update state to match reality)
terraform apply -refresh-only

# Restore to desired state (update reality to match state)
terraform apply

# View state
terraform show
terraform state list
terraform state show aws_instance.web

# Remove resource from state (keep in cloud)
terraform state rm aws_instance.web

# Move resource in state
terraform state mv aws_instance.web aws_instance.app
```

### Debugging Commands

```bash
# Enable detailed logging
export TF_LOG=DEBUG
export TF_LOG_PATH=terraform.log
terraform apply

# Levels: TRACE, DEBUG, INFO, WARN, ERROR
export TF_LOG=TRACE

# Disable logging
unset TF_LOG

# Validate configuration syntax
terraform validate

# Format code
terraform fmt -recursive

# Check for syntax errors without accessing remote state
terraform validate

# Show execution plan in detail
terraform plan -out=plan.out
terraform show plan.out

# Show current state
terraform show

# Graph dependencies
terraform graph | dot -Tpng > graph.png

# Console for testing expressions
terraform console
> var.environment
> aws_instance.web.public_ip
> length(var.availability_zones)
```

### State Management Commands

```bash
# List resources in state
terraform state list

# Show specific resource
terraform state show aws_instance.web

# Pull remote state to local
terraform state pull > terraform.tfstate.backup

# Push local state to remote (dangerous!)
terraform state push terraform.tfstate

# Remove resource from state
terraform state rm aws_instance.web

# Move/rename resource
terraform state mv aws_instance.old aws_instance.new

# Replace resource (mark for recreation)
terraform apply -replace=aws_instance.web

# Import existing resource
terraform import aws_instance.web i-1234567890abcdef0
```

## 🎯 Best Practices

### 1. Code Organization

```
terraform-project/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   └── prod/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/
│   └── database/
└── README.md
```

### 2. Use Remote State

```hcl
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
    kms_key_id     = "arn:aws:kms:us-east-1:123456789:key/xxx"
  }
}
```

### 3. Version Everything

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Allow 5.x updates
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"  # Exact version
}
```

### 4. Use Variables and Outputs

```hcl
# Don't hardcode values
resource "aws_instance" "bad" {
  ami           = "ami-0c55b159cbfafe1f0"  # Bad
  instance_type = "t2.micro"                # Bad
}

# Use variables
resource "aws_instance" "good" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  tags = var.common_tags
}
```

### 5. Use Data Sources

```hcl
# Get latest AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*"]
  }
}

# Get availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Use in resources
resource "aws_subnet" "public" {
  count             = length(data.aws_availability_zones.available.names)
  availability_zone = data.aws_availability_zones.available.names[count.index]
}
```

### 6. Implement Naming Conventions

```hcl
locals {
  name_prefix = "${var.environment}-${var.project}"

  common_tags = {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = var.owner
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-web-${count.index + 1}"
    }
  )
}
```

### 7. Use Modules for Reusability

```hcl
# Don't repeat yourself
module "vpc_dev" {
  source      = "./modules/vpc"
  environment = "dev"
  cidr_block  = "10.0.0.0/16"
}

module "vpc_prod" {
  source      = "./modules/vpc"
  environment = "prod"
  cidr_block  = "10.1.0.0/16"
}
```

### 8. Implement Resource Lifecycle

```hcl
resource "aws_instance" "web" {
  ami           = var.ami
  instance_type = var.instance_type

  lifecycle {
    # Prevent accidental deletion
    prevent_destroy = true

    # Create new before destroying old
    create_before_destroy = true

    # Ignore changes to certain attributes
    ignore_changes = [
      tags,
      user_data
    ]
  }
}
```

### 9. Use Terraform Workspaces or Separate State Files

```bash
# Option 1: Workspaces
terraform workspace new dev
terraform workspace new prod

# Option 2: Separate directories (preferred)
environments/
  dev/
    backend.tf  # Different state file
  prod/
    backend.tf  # Different state file
```

### 10. Implement CI/CD

```yaml
# GitHub Actions example
name: Terraform
on: [push]
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Terraform Init
        run: terraform init

      - name: Terraform Validate
        run: terraform validate

      - name: Terraform Plan
        run: terraform plan

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve
```

## 💡 Common Questions

### Basic Level

**Q1: What is Infrastructure as Code?**
**A:** Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through machine-readable definition files rather than manual processes. Benefits include version control, consistency, repeatability, and automation.

**Q2: What is the difference between Terraform and CloudFormation?**
**A:**

- **Terraform**: Multi-cloud, uses HCL, open-source, provider-agnostic
- **CloudFormation**: AWS-only, uses JSON/YAML, AWS-native integration
- Both are declarative IaC tools

**Q3: Explain the Terraform workflow.**
**A:**

1. **Write** - Create `.tf` configuration files
2. **Init** - Initialize backend and download providers
3. **Plan** - Preview changes before applying
4. **Apply** - Create/update infrastructure
5. **Destroy** - Remove infrastructure when done

**Q4: What is a Terraform provider?**
**A:** A provider is a plugin that enables Terraform to interact with cloud platforms, SaaS providers, and APIs. Examples: AWS, GCP, Azure, Kubernetes, GitHub.

**Q5: What is the Terraform state file?**
**A:** The state file (`terraform.tfstate`) is a JSON file that maps Terraform configuration to real-world resources. It tracks resource IDs, attributes, and dependencies. Should be stored securely and remotely.

### Intermediate Level

**Q6: What are Terraform modules and why use them?**
**A:** Modules are containers for multiple resources used together. Benefits:

- Reusability
- Encapsulation
- Organization
- Versioning
  Example: VPC module reused across environments.

**Q7: How do you handle secrets in Terraform?**
**A:**

- Use environment variables: `TF_VAR_db_password`
- Use secret management: AWS Secrets Manager, Vault
- Mark outputs as sensitive: `sensitive = true`
- Never commit secrets to version control
- Use encrypted remote state

**Q8: Explain Terraform state locking.**
**A:** State locking prevents concurrent modifications to state file. Implemented using:

- DynamoDB table for S3 backend (AWS)
- Built-in for Terraform Cloud
- Prevents race conditions and corruption

**Q9: What is the difference between `count` and `for_each`?**
**A:**

```hcl
# count - creates indexed list
resource "aws_instance" "server" {
  count         = 3
  # Creates: server[0], server[1], server[2]
}

# for_each - creates map/set
resource "aws_instance" "server" {
  for_each      = toset(["web", "app", "db"])
  # Creates: server["web"], server["app"], server["db"]
}
```

`for_each` is better when resources might be added/removed from middle.

**Q10: How do you manage multiple environments?**
**A:**

- **Option 1**: Terraform workspaces (simple, same code)
- **Option 2**: Separate directories (better for prod, different state files)
- **Option 3**: Separate repositories (maximum isolation)

### Advanced Level

**Q11: What are Terraform provisioners and when should you avoid them?**
**A:** Provisioners run scripts on resources after creation (local-exec, remote-exec).
**Avoid because:**

- Not declarative
- Error-prone
- Hard to maintain
  **Better alternatives:**
- User data scripts
- Configuration management tools (Ansible)
- Container images (pre-baked AMIs)

**Q12: Explain Terraform's graph and dependency management.**
**A:** Terraform builds a dependency graph of resources:

- Implicit dependencies (references like `aws_subnet.main.id`)
- Explicit dependencies (`depends_on`)
- Parallel execution where possible
- Proper ordering during create/destroy
  View with: `terraform graph`

**Q13: How do you perform a blue-green deployment with Terraform?**
**A:**

```hcl
# Create new (green) infrastructure
resource "aws_instance" "green" {
  count = var.deploy_green ? var.instance_count : 0
}

# Keep old (blue) infrastructure
resource "aws_instance" "blue" {
  count = var.deploy_green ? 0 : var.instance_count
}

# Switch traffic at load balancer
resource "aws_lb_target_group_attachment" "active" {
  target_id = var.deploy_green ? aws_instance.green[0].id : aws_instance.blue[0].id
}
```

**Q14: What is the difference between `terraform taint` and `terraform apply -replace`?**
**A:**

- `terraform taint` (deprecated): Marked resource for recreation in state
- `terraform apply -replace` (new): Immediately recreates resource
  Both force resource recreation, but `-replace` is preferred in Terraform 0.15.2+

**Q15: How do you import existing infrastructure into Terraform?**
**A:**

```bash
# 1. Write resource block (without attributes)
resource "aws_instance" "imported" {
  # Leave empty initially
}

# 2. Import existing resource
terraform import aws_instance.imported i-1234567890abcdef0

# 3. Run terraform plan to see differences
terraform plan

# 4. Update configuration to match
# 5. Run plan again until no changes

# Better: Use terraform import blocks (Terraform 1.5+)
import {
  to = aws_instance.imported
  id = "i-1234567890abcdef0"
}
```

**Q16: What strategies do you use for handling Terraform state drift?**
**A:**

- Regular `terraform plan` in CI/CD to detect drift
- Use `-refresh-only` to safely update state
- Implement resource policies to prevent manual changes
- Use AWS Config, Azure Policy for compliance
- Automated drift detection and alerting
- Consider using `lifecycle.ignore_changes` for expected drift

**Q17: How do you test Terraform code?**
**A:**

- **Static analysis**: `terraform validate`, `terraform fmt`
- **Security scanning**: tfsec, Checkov, Terrascan
- **Unit tests**: Terratest (Go), kitchen-terraform
- **Integration tests**: Deploy to test environment
- **Policy as code**: Sentinel, OPA
- **Cost estimation**: Infracost

## 📚 Related Topics

- [Docker](../docker/README.md)
- [Kubernetes](../kubernetes/README.md)
- [CI/CD](../cicd/README.md)
- [AWS Cloud Stack](../../cloud-stacks/aws/README.md)
- [GCP Cloud Stack](../../cloud-stacks/gcp/README.md)
- [Azure Cloud Stack](../../cloud-stacks/azure/README.md)

---

**Next**: Explore [Monitoring](../monitoring/README.md) to learn how to observe your Terraform-managed infrastructure!
