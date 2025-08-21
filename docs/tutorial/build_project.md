---
sidebar_position: 4
---

# 🔨 Build Project

Now that we have our containers and Wake configuration ready, let's build our multi-service project! Wake will intelligently manage the build order and dependencies for us.

## 🚀 Quick Start - Build Everything

The simplest way to build your entire project is:

```bash
wake build
```

This command will:

1. 🔍 **Analyze dependencies** in your Wakefile
2. ⚡ **Build base-py first** (no dependencies)
3. 🔄 **Build frontend, backend, and database in parallel** (all depend only on base-py)

Note: Wake's `build` command only builds images. For a complete workflow including tagging and pushing, you'd run separate commands or use `wake all`.

## 📊 Understanding Build Output

When you run `wake build`, you'll see output like this:

```text
INFO: Running command: `docker build --tag base-py:latest base-image`
INFO: Running command: `docker build --tag frontend:latest frontend` 
INFO: Running command: `docker build --tag backend:latest backend`
INFO: Running command: `docker build --tag database:latest database`
```

## 🎯 Selective Building

You can also build specific services:

### Build Individual Services

```bash
# Build just the frontend
wake build frontend

# Build multiple specific services
wake build frontend backend

# Build with specific tag
wake build frontend:v1.2.0
```

### Build Dependencies Automatically

When you build a service, Wake automatically builds its dependencies:

```bash
# This builds base-py first, then frontend
wake build frontend
```

## ⚙️ Build Commands Reference

### Core Build Commands

```bash
# Build all images that have "build" action
wake build

# Pull images that have "pull" action
wake pull

# Tag images for registry (only if prefix specified)
wake tag

# Push to registry
wake push

# Build, tag, and push in sequence
wake all

# Build specific targets
wake build [target1] [target2]
```

**Important**: The `all` command runs `build`, `tag`, and `push` in sequence, but:

- `tag` only works if you specify a prefix with `-t`
- `push` only works if images are tagged with a registry prefix
- If no prefix is specified, `tag` and `push` operations are effectively skipped

### Useful Options

```bash
# Dry run (show what would be built)
wake --dry-run build

# Verbose output for debugging
wake -v build
wake -vv build  # more verbose
wake -vvv build # maximum verbosity with live output

# Use custom config file
wake -f custom-wakefile.json build

# Set tag prefix for registry operations
wake -t myregistry.com/ tag
wake -t myregistry.com/ push

# Set default tag (defaults to "latest")
wake -d v1.0.0 build
```

## 🔧 Development Workflow

### Typical Development Commands

```bash
# 1. First time setup - build everything
wake build

# 2. During development - build just what changed
wake build frontend  # after frontend changes
wake build backend   # after backend changes

# 3. Test with fresh base image
wake build base-py
wake build frontend backend database  # rebuild dependents

# 4. Prepare for deployment with registry
wake -t myregistry.com/myproject/ tag  # tag with prefix
wake -t myregistry.com/myproject/ push # push to registry
```

### Hot Development Tips

```bash
# Build without cache for fresh build
docker build --no-cache --tag base-py:latest base-image/
wake build frontend backend database

# Build specific service with live output
wake -vvv build frontend

# Check what would be built without building
wake --dry-run build
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### "No config found"

```bash
# Make sure you're in the project directory with Wakefile
ls Wakefile
wake build
```

#### "Circular dependency detected"

```text
Check your Wakefile for circular references in dependencies
```

#### "Target not found"

```bash
# Check available targets
wake build --help
# Make sure your target exists in the Wakefile and has the right action
# For example, if an image only has ["pull"] actions, you can't build it
```

#### Build fails for dependency issues

```bash
# Build dependencies first
wake build base-py
wake build frontend  # should work now
```

### Debug Mode

For detailed debugging:

```bash
# Show all commands that would run
wake --dry-run -vvv all

# Live output to see Docker build logs
wake -vvv build frontend
```

## 📦 Registry Operations

### Tagging for Registry

Tag prefix is only applied during `tag` operations when specified:

```bash
# Tag all images with registry prefix
wake -t docker.io/myusername/ tag

# Tag specific service
wake -t gcr.io/myproject/ tag frontend

# Custom tag with environment variables
export TAG_PREFIX="myregistry.com/prod/"
wake tag
```

### Pushing to Registry

```bash
# Push all images with specified prefix
wake -t docker.io/myusername/ push

# Push specific image
wake -t myregistry.com/myproject/ push frontend

# Complete tag and push workflow
wake -t myregistry.com/myproject/ tag
wake -t myregistry.com/myproject/ push
```

## 🎯 Advanced Build Scenarios

### Environment-Specific Builds

### Environment-Specific Tags

**Development**:

```bash
wake -d dev build        # Uses "dev" as default tag instead of "latest"
```

**Production**:

```bash
wake -d production build                           # Build with "production" tag
wake -t registry.company.com/ -d production tag   # Tag for registry
wake -t registry.company.com/ -d production push  # Push to registry
```

### Parallel Build Optimization

Wake automatically builds independent services in parallel. In our example:

```text
base-py (builds first)
├── frontend   ┐
├── backend    ├─ (build in parallel)
└── database   ┘
```

### Dependency Chain Example

For more complex dependencies:

```json
[
  {"name": "base", "actions": ["build"]},
  {"name": "shared-lib", "dependencies": [{"name": "base", "tag": "latest"}], "actions": ["build"]},
  {"name": "service-a", "dependencies": [{"name": "shared-lib", "tag": "latest"}], "actions": ["build"]},
  {"name": "service-b", "dependencies": [{"name": "shared-lib", "tag": "latest"}], "actions": ["build"]}
]
```

Build order: `base` → `shared-lib` → `service-a` & `service-b` (parallel)

## ✅ Build Success

After successful builds, you should have:

```bash
# Check your built images
docker images | grep -E "(base-py|frontend|backend|database)"

# Should show:
# base-py      latest    abc123    2 minutes ago    100MB
# frontend     latest    def456    1 minute ago     150MB  
# backend      latest    ghi789    1 minute ago     145MB
# database     latest    jkl012    1 minute ago     200MB
```

## 🎉 Congratulations

You've successfully:

- 🏗️ **Created a multi-service project** with dependency management
- ⚙️ **Configured Wake** for intelligent build orchestration  
- 🔨 **Built your entire project** with automatic dependency resolution
- 🎯 **Learned advanced build workflows** for development and production

Your project is now ready for development, testing, and deployment! Wake handles all the complexity of build ordering, dependency management, and parallel execution automatically.

