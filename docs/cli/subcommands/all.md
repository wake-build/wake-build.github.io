---
sidebar_position: 1
---

# 🚀 all

Execute the complete container workflow: build, tag, and push images in sequence.

## 📋 Syntax

```bash
wake all [OPTIONS] [TARGETS...]
```

## 📝 Description

The `all` command is a powerful workflow command that executes a complete container pipeline. It sequentially runs:

1. **🔨 Build** - Builds images with dependency resolution
2. **🏷️ Tag** - Applies consistent tagging with prefixes  
3. **📤 Push** - Pushes images to registries

This is the most common command for complete CI/CD workflows where you want to build, tag, and deploy images in one operation.

## 🔄 Execution Flow

The `all` command executes the following sequence:

### 1. Build Phase

- Analyzes dependencies and builds in correct order
- Builds only images with `build` action
- Handles build failures gracefully

### 2. Tag Phase

- Tags images with specified prefixes
- Applies additional tags if configured
- Skips if no tag prefix is provided

### 3. Push Phase

- Pushes images to configured registries
- Handles registry authentication
- Supports parallel pushes when possible

## 🎯 Arguments

### `TARGETS` (optional)

Specify which images to process through the entire workflow. If not provided, processes all images with corresponding actions.

```bash
# Process all configured images
wake all

# Process specific image through full workflow
wake all frontend

# Process multiple images
wake all frontend backend

# Process with specific tag
wake all frontend:v1.0.0

# Process all targets (same as no arguments)
wake all all
```

## 🔧 Options

All global options are supported and apply to each phase:

```bash
# Verbose output for all phases
wake -v all

# Dry run to see what would happen in each phase
wake --dry-run all

# Use custom configuration
wake -f config/production.yaml all

# Set tag prefix and default tag
wake -t mycompany/ -d v1.0.0 all

# Sign images during push phase
wake -p production all
```

## 📊 Complete Workflow Example

### Configuration

```json
[
  {
    "name": "base-image",
    "tag": "latest",
    "actions": ["build", "tag", "push"],
    "registry": "docker.io/mycompany"
  },
  {
    "name": "frontend", 
    "tag": "latest",
    "actions": ["build", "tag", "push"],
    "dependencies": [{"name": "base-image", "tag": "latest"}],
    "registry": "docker.io/mycompany"
  },
  {
    "name": "backend",
    "tag": "latest", 
    "actions": ["build", "tag", "push"],
    "dependencies": [{"name": "base-image", "tag": "latest"}],
    "registry": "gcr.io/my-project"
  }
]
```

### Execution

```bash
wake -t mycompany/ all
```

### Output Flow

```bash
# === BUILD PHASE ===
# INFO: Loading configuration from Wakefile
# INFO: Found 3 images to build
# INFO: Building base-image:latest
# INFO: Running command: `docker build --tag base-image:latest .`
# INFO: Building frontend:latest  
# INFO: Running command: `docker build --tag frontend:latest frontend/`
# INFO: Building backend:latest
# INFO: Running command: `docker build --tag backend:latest backend/`

# === TAG PHASE ===
# INFO: Found 3 images to tag
# INFO: Tagging base-image:latest as mycompany/base-image:latest
# INFO: Running command: `docker tag base-image:latest mycompany/base-image:latest`
# INFO: Tagging frontend:latest as mycompany/frontend:latest
# INFO: Running command: `docker tag frontend:latest mycompany/frontend:latest`
# INFO: Tagging backend:latest as mycompany/backend:latest
# INFO: Running command: `docker tag backend:latest mycompany/backend:latest`

# === PUSH PHASE ===
# INFO: Found 3 images to push
# INFO: Pushing mycompany/base-image:latest
# INFO: Running command: `docker push docker.io/mycompany/base-image:latest`
# INFO: Pushing mycompany/frontend:latest
# INFO: Running command: `docker push docker.io/mycompany/frontend:latest`
# INFO: Pushing mycompany/backend:latest
# INFO: Running command: `docker push gcr.io/my-project/backend:latest`
```

## 🎯 Target Selection

### Processing Specific Images

```bash
# Process just the frontend through all phases
wake all frontend

# This will:
# 1. Build base-image:latest (dependency) + frontend:latest
# 2. Tag both images with prefix
# 3. Push both images to registries
```

### Target Filtering

Each phase only processes images that have the corresponding action:

```json
[
  {
    "name": "cache-only",
    "actions": ["build"]  // Only participates in build phase
  },
  {
    "name": "deploy-ready", 
    "actions": ["build", "tag", "push"]  // Participates in all phases
  },
  {
    "name": "external-image",
    "actions": ["pull", "tag", "push"]  // Skipped in build, included in tag/push
  }
]
```

## ⚙️ Phase-specific Behavior

### Build Phase Specifics

- ✅ **Dependency resolution** - Automatically builds dependencies
- ✅ **Parallel builds** - When dependencies allow
- ✅ **Build order** - Ensures correct sequence
- ❌ **Continues on failure** - Stops entire workflow if build fails

### Tag Phase Specifics

- ✅ **Prefix application** - Uses `-t` flag value
- ✅ **Additional tags** - Applies configured extra tags
- ✅ **Smart skipping** - Skips if no prefix provided
- ✅ **Continues on failure** - Attempts to tag all images

### Push Phase Specifics

- ✅ **Registry resolution** - Uses configured registry per image
- ✅ **Authentication** - Uses Docker's auth configuration
- ✅ **Parallel pushing** - When possible
- ✅ **Image signing** - If cosign profile specified

## 🚫 Error Handling

### Build Phase Failures

```bash
# If build fails, entire workflow stops
ERROR: Failed to build image: frontend:latest
```

The `all` command stops at the first build failure and does not proceed to tag/push phases.

### Tag Phase Failures

```bash
# Tag failures are logged but don't stop the workflow
ERROR: Failed to tag image: frontend:latest
# Continues to push phase with successfully tagged images
```

### Push Phase Failures

```bash
# Push failures are logged but attempt continues
ERROR: Failed to push image: frontend:latest
ERROR: unauthorized: authentication required
```

## 💡 Pro Tips

### Development Workflow

```bash
# Complete development workflow with verbose output
wake -v -d dev -t dev-registry.com/ all

# Test complete workflow without executing
wake --dry-run -f config/dev.yaml -t staging/ all

# Quick local build and tag without push
wake -t local/ build tag  # Use separate commands instead of all
```

### Production Deployment

```bash
# Production deployment with signing
wake -f config/prod.yaml -t registry.company.com/ -p production all

# Release workflow with specific version
wake -f config/release.yaml -d v1.0.0 -t releases/ -p signing all

# Multi-environment deployment
wake -f config/staging.yaml -t staging/ all
wake -f config/prod.yaml -t prod/ all
```

### CI/CD Integration

```bash
# Complete CI/CD pipeline
wake -f .ci/build-config.yaml -t ${CI_REGISTRY}/ -d ${VERSION} all

# Feature branch workflow
wake -f .ci/feature.yaml -t ${CI_REGISTRY}/feature-${BRANCH}/ all

# Automated testing and deployment
wake --dry-run all  # Validate configuration
wake all           # Execute full pipeline
```

### Performance Optimization

1. **Minimize dependencies** - Reduces build time in sequence
2. **Use layer caching** - Optimize Dockerfiles for caching  
3. **Authenticate early** - Run `docker login` before Wake
4. **Parallel execution** - Let Wake handle parallelization automatically
5. **Resource allocation** - Ensure sufficient disk space for builds

### Debugging Workflows

```bash
# See exactly what each phase will do
wake --dry-run -vv all

# Get detailed output from all phases
wake -vvv all

# Debug specific phase
wake --dry-run build  # Test build phase
wake --dry-run tag    # Test tag phase  
wake --dry-run push   # Test push phase

# Partial workflow testing
wake build            # Test just build
wake -t test/ tag     # Test just tagging
```

## 📋 Examples

### Basic Usage

```bash
# Complete workflow for all images
wake all

# Complete workflow for specific service
wake all api

# Complete workflow for multiple services
wake all api frontend database
```

### Advanced Usage

```bash
# Production release workflow
wake -f config/prod.yaml -t registry.company.com/ -d v1.0.0 -p prod all

# Development workflow with verbose output
wake -v -d dev -t dev.registry.com/ all

# Staging deployment workflow
wake -f environments/staging.yaml -t staging/ all
```

### Team Workflows

```bash
# Feature development workflow
wake -f team-configs/feature.yaml -t feature-${BRANCH}/ all

# Integration testing workflow
wake -f .ci/integration.yaml -t integration/ all

# Release candidate workflow
wake -f releases/rc.yaml -t rc/ -p signing all
```

### Environment-specific Workflows

```bash
# Local development
wake -d dev -t local/ all

# Continuous integration
wake -f .ci/build.yaml -t ${CI_REGISTRY}/${BRANCH}/ all

# Production deployment
wake -f config/production.yaml -t prod/ -p production all

# Multi-registry deployment
wake -f config/multi-registry.yaml -t primary/ all
wake -f config/backup-registry.yaml -t backup/ all
```

## 🔗 Related Commands

- **[build](./build.md)** - Build images only
- **[tag](./tag.md)** - Tag images only  
- **[push](./push.md)** - Push images only
- **[pull](./pull.md)** - Pull external images

Use `all` when you want the complete workflow, or use individual commands for more granular control.
