---
sidebar_position: 4
---

# 🏷️ tag

Apply tags to container images according to your Wake configuration and tagging strategies.

## 📋 Syntax

```bash
wake tag [OPTIONS] [TARGETS...]
```

## 📝 Description

The `tag` command creates additional tags for existing Docker images based on your configuration. It:

- 🎯 **Applies consistent tagging** across all images
- 🔄 **Supports multiple tagging strategies** (semantic versioning, branch names, etc.)
- 🏷️ **Manages tag prefixes** for organization/team workflows
- ⚡ **Tags multiple images** efficiently
- 🛡️ **Validates source images** exist before tagging

## 🎯 Arguments

### `TARGETS` (optional)

Specify which images to tag. If not provided, tags all images with `tag` action.

```bash
# Tag all configured images
wake tag

# Tag specific image
wake tag frontend

# Tag multiple images
wake tag frontend backend api

# Tag with specific source tag
wake tag frontend:v1.0.0

# Tag all targets (same as no arguments)
wake tag all
```

## 🔧 Options

All global options are supported. Most commonly used:

```bash
# Verbose output
wake -v tag

# Dry run to see what tags would be created
wake --dry-run tag

# Use custom configuration
wake -f config/production.yaml tag

# Set tag prefix for all operations
wake -t mycompany/ tag

# Set default tag for source images
wake -d latest tag
```

## 🏷️ Tagging Strategies

### Basic Tagging

Simple tag application from configuration:

```json
[
  {
    "name": "frontend",
    "tag": "v1.0.0",
    "actions": ["tag"],
    "additional_tags": ["latest", "stable"]
  }
]
```

Results in:

```bash
docker tag frontend:v1.0.0 frontend:latest
docker tag frontend:v1.0.0 frontend:stable
```

### Prefix-based Tagging

Using tag prefixes for organization:

```bash
wake -t mycompany/ tag
```

Configuration:

```json
[
  {
    "name": "api",
    "tag": "v2.1.0", 
    "actions": ["tag"],
    "additional_tags": ["latest"]
  }
]
```

Results in:

```bash
docker tag api:v2.1.0 mycompany/api:v2.1.0
docker tag api:v2.1.0 mycompany/api:latest
```

### Environment-based Tagging

Different tags for different environments:

```json
[
  {
    "name": "webapp",
    "tag": "build-123",
    "actions": ["tag"],
    "additional_tags": ["${ENVIRONMENT}", "deploy-ready"]
  }
]
```

With `ENVIRONMENT=staging`:

```bash
docker tag webapp:build-123 webapp:staging
docker tag webapp:build-123 webapp:deploy-ready
```

## 📊 Tagging Process

### 1. Configuration Loading

```bash
wake tag
# INFO: Loading configuration from Wakefile
# INFO: Found 2 images to tag
```

### 2. Source Image Validation

```bash
# INFO: Validating source images exist...
# INFO: ✓ frontend:v1.0.0 exists
# INFO: ✓ backend:v1.0.0 exists
```

### 3. Applying Tags

```bash
# INFO: Tagging frontend:v1.0.0
# INFO: Running command: `docker tag frontend:v1.0.0 frontend:latest`
# INFO: Running command: `docker tag frontend:v1.0.0 frontend:stable`

# INFO: Tagging backend:v1.0.0  
# INFO: Running command: `docker tag backend:v1.0.0 backend:latest`
```

## 🔄 Advanced Tagging Patterns

### Semantic Versioning

Automatic semantic version tagging:

```json
{
  "name": "api",
  "tag": "v2.1.3",
  "actions": ["tag"],
  "additional_tags": ["v2.1", "v2", "latest"]
}
```

Creates:

- `api:v2.1.3` (source)
- `api:v2.1` (minor version)
- `api:v2` (major version)
- `api:latest` (latest)

### Branch-based Tagging

For CI/CD workflows:

```json
{
  "name": "app",
  "tag": "${GIT_COMMIT}",
  "actions": ["tag"],
  "additional_tags": ["${GIT_BRANCH}", "build-${BUILD_NUMBER}"]
}
```

With environment variables:

```bash
export GIT_COMMIT=abc123
export GIT_BRANCH=feature/new-ui  
export BUILD_NUMBER=456

wake tag
```

Results in:

```bash
docker tag app:abc123 app:feature/new-ui
docker tag app:abc123 app:build-456
```

### Multi-registry Tagging

Tagging for different registries:

```json
{
  "name": "service",
  "tag": "v1.0.0",
  "actions": ["tag"],
  "additional_tags": [
    "gcr.io/my-project/service:v1.0.0",
    "docker.io/myorg/service:v1.0.0",
    "my-registry.com/service:latest"
  ]
}
```

### Conditional Tagging

Using tag conditions:

```json
{
  "name": "webapp",
  "tag": "build-${BUILD_ID}",
  "actions": ["tag"],
  "additional_tags": ["latest"],
  "conditions": {
    "tag_latest_only_on_main": true
  }
}
```

## 🎯 Target Selection

### Tagging Specific Images

```bash
# Tag just the frontend
wake tag frontend

# This applies all configured additional_tags for frontend
```

### Cross-image Tagging

```bash
# Tag multiple related services
wake tag frontend backend api

# Apply consistent tagging strategy across services
wake -t v2.0/ tag microservices
```

### Source Tag Override

```bash
# Tag from specific source version
wake tag frontend:v1.0.0

# Override default source tag for all targets
wake -d build-123 tag
```

## ⚙️ Tag Management

### Registry Preparation

Tagging for registry push:

```json
{
  "name": "app",
  "tag": "latest",
  "actions": ["tag"],
  "additional_tags": [
    "registry.company.com/team/app:v${VERSION}",
    "registry.company.com/team/app:latest",
    "registry.company.com/team/app:${ENVIRONMENT}"
  ]
}
```

### Cleanup Tags

Remove old tags before applying new ones:

```json
{
  "name": "service", 
  "tag": "new-version",
  "actions": ["tag"],
  "cleanup_old_tags": true,
  "additional_tags": ["latest"]
}
```

### Tag Validation

Validate tag format before applying:

```json
{
  "name": "api",
  "tag": "v1.0.0",
  "actions": ["tag"],
  "additional_tags": ["${VALIDATED_TAG}"],
  "tag_validation": {
    "pattern": "^v\\d+\\.\\d+\\.\\d+$"
  }
}
```

## 🚫 Error Handling

### Missing Source Image

```text
ERROR: Source image 'app:v1.0.0' does not exist
```

Solution: Ensure the source image exists or build it first.

### Invalid Tag Format

```text
ERROR: Invalid tag format 'my/app:with spaces'
ERROR: Docker tag names must be valid
```

Solution: Use valid Docker tag naming conventions.

### Tag Conflicts

```text
WARNING: Tag 'app:latest' already exists and will be overwritten
```

This is usually expected behavior but can be disabled with configuration.

## 💡 Pro Tips

### Development Workflow

```bash
# Tag for local development
wake -d dev -t local/ tag

# Tag for testing with verbose output
wake -v -t test/ tag

# Preview tagging operations
wake --dry-run tag
```

### Release Management

```bash
# Release tagging for production
wake -f config/release.yaml -t v1.2/ tag

# Emergency hotfix tagging
wake -d hotfix-urgent -t emergency/ tag

# Rollback preparation
wake -t rollback/ tag previous-stable
```

### CI/CD Integration

```bash
# Automated CI tagging
wake -d ${BUILD_SHA} -t ci/ tag

# Deployment tagging
wake -t deploy-$(date +%Y%m%d)/ tag

# Multi-environment tagging
wake -f envs/${ENV}.yaml tag
```

### Tag Organization

1. **Use consistent prefixes** for team/project organization
2. **Apply semantic versioning** for release management
3. **Include metadata** like build numbers, branches, or dates
4. **Tag for multiple registries** in advance of pushing

### Debugging Tagging

```bash
# See all tag commands before execution
wake --dry-run -vv tag

# Get detailed Docker output
wake -vvv tag frontend

# Validate configuration before tagging
wake --dry-run -f config/prod.yaml tag
```

## 📋 Examples

### Basic Usage

```bash
# Tag all configured images
wake tag

# Tag specific service
wake tag api

# Tag multiple services
wake tag frontend backend database
```

### Advanced Usage

```bash
# Production tagging with custom config and prefix
wake -f config/prod.yaml -t prod/v1.0/ tag

# Development tagging with build number
wake -d build-${BUILD_ID} -t dev/ tag

# Test tagging configuration
wake --dry-run -f config/staging.yaml tag
```

### Release Workflows

```bash
# Major release tagging
wake -f releases/v2.0.yaml -t v2.0/ tag

# Patch release with multiple tags
wake -d v1.1.3 tag api
# Results in: api:v1.1.3 → api:v1.1, api:v1, api:latest

# Hotfix tagging for immediate deployment
wake -t hotfix-$(date +%Y%m%d)/ tag critical-services
```

### Team Workflows

```bash
# Development team feature tagging
wake -t feature-new-auth/ tag frontend backend

# QA team testing tags
wake -f team-configs/qa.yaml -t qa-$(date +%m%d)/ tag

# DevOps team release preparation
wake -f releases/candidate.yaml -t rc/ tag all
```ebar_position: 3
---

# tag

The `wake tag` command 
