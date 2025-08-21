---
sidebar_position: 2
---

# 🔨 build

Build container images based on your Wake configuration with intelligent dependency resolution.

## 📋 Syntax

```bash
wake build [OPTIONS] [TARGETS...]
```

## 📝 Description

The `build` command analyzes your configuration and builds Docker images in the correct order based on dependencies. It automatically:

- 🔍 **Resolves dependencies** and determines build order
- ⚡ **Builds in parallel** when possible  
- 🎯 **Validates configurations** before starting
- 🛡️ **Handles failures** gracefully

## 🎯 Arguments

### `TARGETS` (optional)

Specify which images to build. If not provided, builds all images with `build` action.

```bash
# Build all images
wake build

# Build specific image
wake build frontend

# Build multiple images  
wake build frontend backend

# Build with specific tag
wake build frontend:v1.0.0

# Build all targets (same as no arguments)
wake build all
```

## 🔧 Options

All global options are supported. Most commonly used:

```bash
# Verbose output
wake -v build

# Dry run to see what would be built
wake --dry-run build

# Use custom configuration
wake -f config/production.yaml build

# Set default tag
wake -d dev build
```

## 🔗 Dependency Resolution

Wake automatically determines the optimal build order:

### Example Configuration

```json
[
  {
    "name": "base-image",
    "tag": "latest", 
    "actions": ["build"]
  },
  {
    "name": "frontend",
    "tag": "latest",
    "actions": ["build"],
    "dependencies": [{"name": "base-image", "tag": "latest"}]
  },
  {
    "name": "backend", 
    "tag": "latest",
    "actions": ["build"],
    "dependencies": [{"name": "base-image", "tag": "latest"}]
  }
]
```

### Build Order

```text
1. base-image:latest (no dependencies)
2. frontend:latest and backend:latest (parallel, both depend on base-image)
```

## 📊 Build Process

### 1. Configuration Loading

```bash
wake build
# INFO: Loading configuration from Wakefile
# INFO: Found 3 images to build
```

### 2. Dependency Analysis

```bash
# INFO: Analyzing dependencies...
# INFO: Build order: base-image → [frontend, backend]
```

### 3. Building Images

```bash
# INFO: Building base-image:latest
# INFO: Running command: `docker build --tag base-image:latest .`
# INFO: Building frontend:latest  
# INFO: Running command: `docker build --tag frontend:latest frontend/`
# INFO: Building backend:latest
# INFO: Running command: `docker build --tag backend:latest backend/`
```

## 🎯 Target Selection

### Building Specific Images

```bash
# Build just the frontend
wake build frontend

# This will also build its dependencies automatically:
# 1. base-image:latest (dependency)
# 2. frontend:latest (target)
```

### Building Multiple Images

```bash
# Build frontend and backend (and their dependencies)
wake build frontend backend

# Equivalent to building all in this example since base-image
# will be built as a dependency
```

### Target Format

```bash
# By name (uses tag from config)
wake build frontend

# By name:tag (overrides config tag)  
wake build frontend:v2.0.0

# Multiple targets with different tags
wake build frontend:latest backend:dev
```

## ⚙️ Build Context & Options

### Dockerfile Location

Images can specify custom Dockerfile paths:

```json
{
  "name": "frontend",
  "dockerfile": "docker/Dockerfile.production",
  "context": "frontend/"
}
```

### Build Arguments

```json
{
  "name": "backend",
  "build_args": {
    "NODE_ENV": "production",
    "API_VERSION": "v2"
  },
  "env_args": ["SECRET_KEY", "DATABASE_URL"]
}
```

Wake will execute:

```bash
docker build \
  --tag backend:latest \
  --build-arg NODE_ENV=production \
  --build-arg API_VERSION=v2 \
  --build-arg SECRET_KEY=${SECRET_KEY} \
  --build-arg DATABASE_URL=${DATABASE_URL} \
  backend/
```

### Multi-stage Builds

```json
{
  "name": "frontend",
  "target": "production",
  "dockerfile": "Dockerfile"
}
```

Executes:

```bash
docker build --tag frontend:latest --target production .
```

## 🚫 Error Handling

### Circular Dependencies

```text
ERROR: Circular dependency detected between images
```

Wake validates your configuration and prevents circular dependencies.

### Missing Dependencies

```text
ERROR: Image 'frontend' depends on 'base-image:latest' which does not exist or has no build action
```

All dependencies must be defined in the configuration.

### Build Failures

```text
ERROR: Failed to build image: frontend:latest
```

When a build fails, Wake stops and reports the error. Use `-v` for more details.

## 💡 Pro Tips

### Development Workflow

```bash
# Build with dev tag and see all output
wake -d dev -vv build

# Build only what changed after modifying frontend
wake build frontend

# Test build without executing
wake --dry-run build
```

### Optimizing Build Times

1. **Order dependencies** from most stable to least stable
2. **Use multi-stage builds** to reduce final image size
3. **Cache base images** by building them separately first
4. **Leverage parallel builds** by minimizing dependencies

### Debugging Builds

```bash
# See exactly what commands will run
wake --dry-run -vv build

# Get full Docker output for debugging
wake -vvv build frontend

# Build with custom configuration for testing
wake -f debug-config.json build
```

## 📋 Examples

### Basic Usage

```bash
# Build everything
wake build

# Build specific service
wake build api

# Build multiple services  
wake build api frontend database
```

### Advanced Usage

```bash
# Production build with custom config and tag
wake -f config/prod.yaml -d v1.0.0 build

# Development build with verbose output
wake -d dev -v build frontend backend

# Test build configuration
wake --dry-run -f config/staging.yaml build
```

### Team Workflows

```bash
# Backend team builds
wake -f team-configs/backend.json build

# Frontend team with development tags
wake -f team-configs/frontend.yaml -d feature-branch build

# Full stack build for integration testing
wake -d integration build
```
