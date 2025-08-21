---
sidebar_position: 5
---

# 🚀 push

Push container images to registries based on your Wake configuration.

## 📋 Syntax

```bash
wake push [OPTIONS] [TARGETS...]
```

## 📝 Description

The `push` command uploads Docker images to container registries according to your configuration. It:

- 🔍 **Resolves registry destinations** from configuration
- 🔐 **Handles registry authentication** automatically
- ⚡ **Pushes in parallel** when possible
- 🏷️ **Applies consistent tagging** with your prefix rules
- ✅ **Validates image existence** before pushing
- 🛡️ **Supports image signing** with cosign

## 🎯 Arguments

### `TARGETS` (optional)

Specify which images to push. If not provided, pushes all images with `push` action.

```bash
# Push all configured images
wake push

# Push specific image
wake push frontend

# Push multiple images
wake push frontend backend

# Push with specific tag
wake push frontend:v1.0.0

# Push all targets (same as no arguments)
wake push all
```

## 🔧 Options

All global options are supported. Most commonly used:

```bash
# Verbose output
wake -v push

# Dry run to see what would be pushed
wake --dry-run push

# Use custom configuration
wake -f config/production.yaml push

# Set tag prefix for pushed images
wake -t mycompany/ push

# Sign images during push
wake -p production push
```

## 🏷️ Registry and Tagging

### Registry Configuration

Images specify their registry destination:

```json
[
  {
    "name": "frontend",
    "tag": "latest", 
    "actions": ["build", "push"],
    "registry": "docker.io/mycompany"
  },
  {
    "name": "backend",
    "tag": "v1.0.0",
    "actions": ["build", "push"],
    "registry": "gcr.io/my-project"
  },
  {
    "name": "worker",
    "tag": "latest",
    "actions": ["build", "push"]
  }
]
```

### Push Behavior

```bash
wake -t mycompany/ push
```

Executes:

```bash
# docker tag mycompany/frontend:latest docker.io/mycompany/frontend:latest
# docker push docker.io/mycompany/frontend:latest

# docker tag mycompany/backend:v1.0.0 gcr.io/my-project/backend:v1.0.0
# docker push gcr.io/my-project/backend:v1.0.0

# docker tag mycompany/worker:latest mycompany/worker:latest
# docker push mycompany/worker:latest (registry defaults to docker.io)
```

## 🔐 Authentication

### Registry Authentication

Wake uses Docker's authentication configuration:

```bash
# Login to Docker Hub
docker login

# Login to private registry
docker login my-registry.com

# Login to AWS ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com

# Then push with Wake
wake push
```

### Environment Variables

Common registry authentication patterns:

```bash
# Docker Hub with token
export DOCKER_USERNAME=myuser
export DOCKER_PASSWORD=mytoken

# GitHub Container Registry
export CR_PAT=ghp_xxxxxxxxxxxx
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# Google Container Registry
gcloud auth configure-docker

# Then use Wake
wake push
```

## 📊 Push Process

### 1. Configuration Loading

```bash
wake push
# INFO: Loading configuration from Wakefile
# INFO: Found 3 images to push
```

### 2. Image Validation

```bash
# INFO: Validating local images exist...
# INFO: ✓ mycompany/frontend:latest exists
# INFO: ✓ mycompany/backend:v1.0.0 exists
# INFO: ✓ mycompany/worker:latest exists
```

### 3. Registry Resolution

```bash
# INFO: Resolving registries for push targets...
# INFO: frontend:latest → docker.io/mycompany/frontend:latest
# INFO: backend:v1.0.0 → gcr.io/my-project/backend:v1.0.0
# INFO: worker:latest → mycompany/worker:latest
```

### 4. Pushing Images

```bash
# INFO: Pushing frontend:latest
# INFO: Running command: `docker push docker.io/mycompany/frontend:latest`
# The push refers to repository [docker.io/mycompany/frontend]

# INFO: Pushing backend:v1.0.0
# INFO: Running command: `docker push gcr.io/my-project/backend:v1.0.0`
# The push refers to repository [gcr.io/my-project/backend]
```

## 🎯 Target Selection

### Pushing Specific Images

```bash
# Push just the frontend
wake push frontend

# Push with custom tag
wake push frontend:v2.0.0

# Push multiple specific images
wake push frontend backend
```

### Registry Override

```json
{
  "name": "custom-app",
  "tag": "v1.0.0",
  "actions": ["build", "push"],
  "registry": "my-private-registry.com/team"
}
```

Results in:

```bash
docker push my-private-registry.com/team/custom-app:v1.0.0
```

## 🔏 Image Signing with Cosign

### Basic Signing

Enable image signing during push:

```bash
# Sign images with default profile
wake -p default push

# Sign with custom profile
wake -p production push
```

### Cosign Configuration

Configure signing in your environment:

```bash
# Set up cosign key
export COSIGN_PASSWORD=mypassword
cosign generate-key-pair

# Or use keyless signing
export COSIGN_EXPERIMENTAL=1

# Push and sign
wake -p production push
```

### Signing Process

```bash
wake -p production push frontend
# INFO: Pushing frontend:latest
# INFO: Running command: `docker push docker.io/mycompany/frontend:latest`
# INFO: Signing image with cosign profile: production
# INFO: Running command: `cosign sign docker.io/mycompany/frontend:latest`
```

## 🔄 Dependency Handling

### Push Dependencies

When pushing images, Wake can optionally push dependency images:

```json
[
  {
    "name": "base-image",
    "tag": "latest",
    "actions": ["build", "push"],
    "registry": "my-registry.com"
  },
  {
    "name": "app",
    "tag": "latest", 
    "actions": ["build", "push"],
    "dependencies": [{"name": "base-image", "tag": "latest"}],
    "registry": "my-registry.com"
  }
]
```

```bash
# This pushes base-image first, then app
wake push app
```

## ⚙️ Advanced Configuration

### Custom Push Commands

For complex registry scenarios:

```json
{
  "name": "special-image",
  "tag": "latest",
  "actions": ["build", "push"],
  "commands": {
    "push": "skopeo copy docker-daemon:special-image:latest docker://quay.io/special/image:latest"
  }
}
```

### Multi-registry Push

Push the same image to multiple registries:

```json
{
  "name": "multi-registry-app",
  "tag": "v1.0.0",
  "actions": ["build", "push"],
  "registries": [
    "docker.io/mycompany",
    "gcr.io/my-project", 
    "quay.io/myorg"
  ]
}
```

Wake will push to all specified registries:

```bash
docker push docker.io/mycompany/multi-registry-app:v1.0.0
docker push gcr.io/my-project/multi-registry-app:v1.0.0
docker push quay.io/myorg/multi-registry-app:v1.0.0
```

### Platform-specific Pushes

```json
{
  "name": "multi-arch-app", 
  "tag": "latest",
  "actions": ["build", "push"],
  "registry": "docker.io/mycompany",
  "platforms": ["linux/amd64", "linux/arm64"]
}
```

## 🚫 Error Handling

### Authentication Failures

```text
ERROR: Failed to push image frontend:latest
ERROR: unauthorized: authentication required
```

Solution: Ensure proper registry authentication with `docker login`.

### Image Not Found

```text
ERROR: Failed to push image myapp:v1.0.0
ERROR: Local image myapp:v1.0.0 not found
```

Solution: Build the image first with `wake build` or ensure it exists locally.

### Registry Quota Exceeded

```text
ERROR: Failed to push image large-app:latest
ERROR: repository quota exceeded
```

Solution: Clean up old images or increase registry quota.

### Network Issues

```text
ERROR: Failed to push image backend:latest
ERROR: Get https://index.docker.io/v2/: dial tcp: lookup index.docker.io: no such host
```

Solution: Check network connectivity and DNS resolution.

## 💡 Pro Tips

### Development Workflow

```bash
# Build and push in one flow
wake build && wake push

# Push with verbose output to debug issues
wake -v push

# See what would be pushed without doing it
wake --dry-run push

# Push with development tags
wake -d dev push
```

### Production Deployment

```bash
# Production push with signing
wake -f config/prod.yaml -p production push

# Push specific version to production registry
wake -f config/prod.yaml -d v1.0.0 push

# Push to multiple environments
wake -f config/staging.yaml push
wake -f config/prod.yaml push
```

### Performance Optimization

1. **Push in parallel** by using Wake's built-in concurrency
2. **Use layer caching** by pushing base images first
3. **Authenticate once** before running Wake
4. **Push during off-peak hours** for large images
5. **Use registry mirrors** for faster uploads

### Debugging Pushes

```bash
# See all push commands before execution
wake --dry-run -vv push

# Get detailed Docker output
wake -vvv push frontend

# Test registry connectivity
docker push hello-world  # Test outside Wake first

# Verify local images exist
docker images | grep mycompany
```

## 📋 Examples

### Basic Usage

```bash
# Push all configured images
wake push

# Push specific service
wake push api

# Push multiple services
wake push api frontend database
```

### Advanced Usage

```bash
# Production push with custom config, signing, and prefix
wake -f config/prod.yaml -p production -t v1.0.0/ push

# Development push with verbose output
wake -d dev -v push

# Test push configuration
wake --dry-run -f config/staging.yaml push
```

### CI/CD Workflows

```bash
# Build, test, and push pipeline
wake build
wake test  # If you have test actions
wake push

# Feature branch deployment
wake -f config/feature.yaml -t feature-xyz/ push

# Release workflow
wake -f config/release.yaml -d ${VERSION} -p production push
```

### Team Workflows

```bash
# Development team pushes to dev registry
wake -f team-configs/dev.json -t dev/ push

# Push for specific environment
wake -f environments/staging.yaml push

# Multi-registry deployment
wake -f config/multi-registry.yaml push

# Signed release for production
wake -f config/prod.yaml -p release-signing push
```

### Registry Management

```bash
# Push to organization registry
wake -t myorg/ push

# Push to private registry
docker login my-registry.com
wake -f config/private-registry.yaml push

# Push with different tags per environment
wake -f config/dev.yaml -d dev push
wake -f config/staging.yaml -d staging push
wake -f config/prod.yaml -d latest push
```ebar_position: 4
---

# push

The `wake push` command 

