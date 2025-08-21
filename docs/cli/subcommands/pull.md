---
sidebar_position: 3
---

# 📥 pull

Pull container images from registries based on your Wake configuration.

## 📋 Syntax

```bash
wake pull [OPTIONS] [TARGETS...]
```

## 📝 Description

The `pull` command downloads Docker images from container registries according to your configuration. It:

- 🔍 **Resolves image sources** from configuration
- 🔄 **Handles registry authentication** automatically
- ⚡ **Pulls in parallel** when possible
- 🏷️ **Applies consistent tagging** with your prefix rules
- 🛡️ **Validates image availability** before pulling

## 🎯 Arguments

### `TARGETS` (optional)

Specify which images to pull. If not provided, pulls all images with `pull` action.

```bash
# Pull all configured images
wake pull

# Pull specific image
wake pull redis

# Pull multiple images
wake pull redis postgres nginx

# Pull with specific tag  
wake pull redis:6.2

# Pull all targets (same as no arguments)
wake pull all
```

## 🔧 Options

All global options are supported. Most commonly used:

```bash
# Verbose output
wake -v pull

# Dry run to see what would be pulled
wake --dry-run pull

# Use custom configuration
wake -f config/production.yaml pull

# Set tag prefix for pulled images
wake -t mycompany/ pull
```

## 🏷️ Registry and Tagging

### Registry Configuration

Images specify their registry source:

```json
[
  {
    "name": "redis",
    "tag": "6.2", 
    "actions": ["pull"],
    "registry": "docker.io"
  },
  {
    "name": "postgres",
    "tag": "13",
    "actions": ["pull"],
    "registry": "gcr.io/my-project"
  },
  {
    "name": "nginx",
    "tag": "latest",
    "actions": ["pull"]
  }
]
```

### Pull Behavior

```bash
wake -t mycompany/ pull
```

Executes:

```bash
# docker pull docker.io/redis:6.2
# docker tag docker.io/redis:6.2 mycompany/redis:6.2

# docker pull gcr.io/my-project/postgres:13  
# docker tag gcr.io/my-project/postgres:13 mycompany/postgres:13

# docker pull nginx:latest (registry defaults to docker.io)
# docker tag nginx:latest mycompany/nginx:latest
```

## 🔐 Authentication

### Registry Authentication

Wake uses Docker's authentication configuration:

```bash
# Login to Docker Hub
docker login

# Login to private registry
docker login my-registry.com

# Then pull with Wake
wake pull
```

### Environment Variables

Common registry authentication patterns:

```bash
# Docker Hub with token
export DOCKER_USERNAME=myuser
export DOCKER_PASSWORD=mytoken

# AWS ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com

# Google Container Registry  
gcloud auth configure-docker

# Then use Wake
wake pull
```

## 📊 Pull Process

### 1. Configuration Loading

```bash
wake pull
# INFO: Loading configuration from Wakefile
# INFO: Found 3 images to pull
```

### 2. Registry Resolution

```bash
# INFO: Resolving registries for pull targets...
# INFO: redis:6.2 from docker.io
# INFO: postgres:13 from gcr.io/my-project  
# INFO: nginx:latest from docker.io
```

### 3. Pulling Images

```bash
# INFO: Pulling redis:6.2
# INFO: Running command: `docker pull docker.io/redis:6.2`
# 6.2: Pulling from library/redis
# INFO: Tagging redis:6.2 as mycompany/redis:6.2

# INFO: Pulling postgres:13
# INFO: Running command: `docker pull gcr.io/my-project/postgres:13`
# 13: Pulling from my-project/postgres
# INFO: Tagging postgres:13 as mycompany/postgres:13
```

## 🎯 Target Selection

### Pulling Specific Images

```bash
# Pull just Redis
wake pull redis

# Pull with custom tag
wake pull redis:7.0

# Pull multiple specific images
wake pull redis postgres
```

### Registry Override

```json
{
  "name": "custom-app",
  "tag": "v1.0.0",
  "actions": ["pull"],
  "registry": "my-private-registry.com/team"
}
```

Results in:

```bash
docker pull my-private-registry.com/team/custom-app:v1.0.0
```

## 🔄 Dependency Handling

### Pull Dependencies

When pulling images with dependencies, Wake can optionally pull dependency sources:

```json
[
  {
    "name": "base-image",
    "tag": "latest",
    "actions": ["pull"],
    "registry": "my-registry.com"
  },
  {
    "name": "app",
    "tag": "latest", 
    "actions": ["build"],
    "dependencies": [{"name": "base-image", "tag": "latest"}]
  }
]
```

```bash
# This pulls base-image since app depends on it
wake pull app
```

## ⚙️ Advanced Configuration

### Custom Pull Commands

For complex registry scenarios:

```json
{
  "name": "special-image",
  "tag": "latest",
  "actions": ["pull"],
  "commands": {
    "pull": "skopeo copy docker://quay.io/special/image:latest docker-daemon:special-image:latest"
  }
}
```

### Multi-architecture Images

```json
{
  "name": "multi-arch-app", 
  "tag": "latest",
  "actions": ["pull"],
  "registry": "docker.io",
  "platform": "linux/amd64"
}
```

Wake will pull:

```bash
docker pull --platform linux/amd64 docker.io/multi-arch-app:latest
```

## 🚫 Error Handling

### Authentication Failures

```text
ERROR: Failed to pull image redis:6.2
ERROR: unauthorized: authentication required
```

Solution: Ensure proper registry authentication.

### Network Issues

```text
ERROR: Failed to pull image postgres:13
ERROR: Get https://gcr.io/v2/: dial tcp: lookup gcr.io: no such host
```

Solution: Check network connectivity and DNS resolution.

### Missing Images

```text
ERROR: Failed to pull image myapp:nonexistent
ERROR: manifest for myapp:nonexistent not found
```

Solution: Verify the image tag exists in the registry.

## 💡 Pro Tips

### Development Workflow

```bash
# Pull latest versions of base images
wake -d latest pull

# Pull with verbose output to debug issues
wake -v pull

# See what would be pulled without doing it
wake --dry-run pull
```

### Registry Management

```bash
# Use different registries for different environments
wake -f config/dev.yaml pull      # Uses dev registry
wake -f config/prod.yaml pull     # Uses prod registry

# Pull with organization prefix
wake -t myorg/ pull
```

### Performance Optimization

1. **Pull in parallel** by using Wake's built-in concurrency
2. **Use layer caching** by pulling base images first
3. **Authenticate once** before running Wake
4. **Use registry mirrors** for faster access

### Debugging Pulls

```bash
# See all pull commands before execution
wake --dry-run -vv pull

# Get detailed Docker output
wake -vvv pull redis

# Test registry connectivity
docker pull redis:latest  # Test outside Wake first
```

## 📋 Examples

### Basic Usage

```bash
# Pull all configured images
wake pull

# Pull specific service
wake pull database

# Pull multiple services
wake pull cache database message-queue
```

### Advanced Usage

```bash
# Production pull with custom config and prefix
wake -f config/prod.yaml -t prod/ pull

# Development pull with latest tags
wake -d latest -v pull

# Test pull configuration  
wake --dry-run -f config/staging.yaml pull
```

### Team Workflows

```bash
# Development team pulls latest dependencies
wake -f team-configs/dev.json -d latest pull

# Pull for specific feature branch
wake -t feature-branch/ pull dependencies

# Full environment pull for testing
wake -f environments/integration.yaml pull
```

### Registry Patterns

```bash
# Pull from multiple registries
wake -f multi-registry-config.yaml pull

# Pull with authentication for private registries
docker login my-registry.com
wake -t my-org/ pull

# Pull specific architecture for deployment
wake -f config/arm64.yaml pull
```ebar_position: 1
---

# pull

The `wake pull` command 
