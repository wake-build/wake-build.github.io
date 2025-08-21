---
sidebar_position: 3
---

# ⚙️ Add Wake Config

Now that we have our containers defined, let's create a Wake configuration file that orchestrates the build process intelligently. Wake will ensure the base image builds first, and then build the dependent services in the optimal order.

## 📝 Understanding Wake Configuration

Wake uses a declarative JSON or YAML configuration file. By default, Wake looks for:

1. `Wakefile` (JSON or YAML)
2. `.wake` directory (containing JSON/YAML files)
3. Custom file specified with `-f` flag

This file defines:

- 🏷️ **Image definitions** with names and tags
- 🔗 **Dependencies** between images  
- ⚡ **Actions** each image supports (pull, build, tag, push)
- 🎯 **Build context** and Dockerfile locations

## 🗂️ Basic Wakefile Structure

Each image in the Wakefile has this structure:

```json
{
  "name": "image-name",
  "tag": "version",
  "actions": ["build", "tag", "push"],
  "dockerfile": "path/to/Dockerfile",
  "context": "build/context/path",
  "dependencies": [
    {"name": "base-image", "tag": "latest"}
  ]
}
```

## ⚙️ Create the Wakefile

Create a `Wakefile` in your project root with the following configuration:

**`Wakefile`** (JSON format):

```json
[
  {
    "name": "base-py",
    "tag": "latest",
    "actions": ["build"],
    "dockerfile": "base-image/Dockerfile",
    "context": "base-image"
  },
  {
    "name": "frontend",
    "tag": "latest", 
    "actions": ["build"],
    "dockerfile": "frontend/Dockerfile",
    "context": "frontend",
    "dependencies": [
      {"name": "base-py", "tag": "latest"}
    ]
  },
  {
    "name": "backend",
    "tag": "latest",
    "actions": ["build"], 
    "dockerfile": "backend/Dockerfile",
    "context": "backend",
    "dependencies": [
      {"name": "base-py", "tag": "latest"}
    ]
  },
  {
    "name": "database",
    "tag": "latest",
    "actions": ["build"],
    "dockerfile": "database/Dockerfile", 
    "context": "database",
    "dependencies": [
      {"name": "base-py", "tag": "latest"}
    ]
  }
]
```

## 📁 Alternative: Using .wake Directory

Instead of a single `Wakefile`, you can organize configurations in a `.wake` directory. This is useful for complex projects or when you want to split configurations:

Create a `.wake` directory and add configuration files:

**`.wake/base.json`**:

```json
{
  "name": "base-py",
  "tag": "latest",
  "actions": ["build"],
  "dockerfile": "base-image/Dockerfile",
  "context": "base-image"
}
```

**`.wake/services.yaml`**:

```yaml
- name: frontend
  tag: latest
  actions: [build]
  dockerfile: frontend/Dockerfile
  context: frontend
  dependencies:
    - name: base-py
      tag: latest

- name: backend
  tag: latest
  actions: [build]
  dockerfile: backend/Dockerfile
  context: backend
  dependencies:
    - name: base-py
      tag: latest

- name: database
  tag: latest
  actions: [build]
  dockerfile: database/Dockerfile
  context: database
  dependencies:
    - name: base-py
      tag: latest
```

With this structure, Wake will automatically discover and load all configuration files in the `.wake` directory:

```text
my-app/
├── .wake/
│   ├── base.json
│   └── services.yaml
├── base-image/
├── frontend/
├── backend/
└── database/
```

## 🗂️ Using Custom Configuration Files

You can also specify custom configuration files using the `-f` flag:

### Environment-Specific Configurations

**`config/development.json`**:

```json
[
  {
    "name": "base-py",
    "tag": "dev",
    "actions": ["build"],
    "dockerfile": "base-image/Dockerfile",
    "context": "base-image"
  },
  {
    "name": "frontend",
    "tag": "dev",
    "actions": ["build"],
    "dockerfile": "frontend/Dockerfile.dev",
    "context": "frontend",
    "dependencies": [{"name": "base-py", "tag": "dev"}]
  }
]
```

**`config/production.yaml`**:

```yaml
- name: base-py
  tag: v1.0.0
  actions: [build, tag, push]
  dockerfile: base-image/Dockerfile.prod
  context: base-image

- name: frontend
  tag: v1.0.0
  actions: [build, tag, push]
  dockerfile: frontend/Dockerfile
  context: frontend
  target: production
  dependencies:
    - name: base-py
      tag: v1.0.0
```

### Using Custom Configurations

```bash
# Use development config
wake -f config/development.json build

# Use production config with registry
wake -f config/production.yaml -t registry.company.com/ all

# Use config from different directory
wake -f ../shared-configs/microservices.yaml build frontend

# Combine with other flags
wake -f config/staging.json -d staging -v build
```

### Team-Specific Configurations

**`team-configs/backend-team.json`**:

```json
[
  {
    "name": "base-py",
    "tag": "latest",
    "actions": ["pull"]
  },
  {
    "name": "backend",
    "tag": "latest",
    "actions": ["build"],
    "dockerfile": "backend/Dockerfile",
    "context": "backend",
    "dependencies": [{"name": "base-py", "tag": "latest"}]
  },
  {
    "name": "backend-tests",
    "tag": "latest",
    "actions": ["build"],
    "dockerfile": "backend/Dockerfile.test",
    "context": "backend",
    "dependencies": [{"name": "backend", "tag": "latest"}]
  }
]
```

```bash
# Backend team can focus on their services
wake -f team-configs/backend-team.json build
```

## 🔧 Alternative: YAML Format

If you prefer YAML, create `Wakefile.yaml` instead:

```yaml
- name: base-py
  tag: latest
  actions: [build]
  dockerfile: base-image/Dockerfile
  context: base-image

- name: frontend
  tag: latest
  actions: [build]
  dockerfile: frontend/Dockerfile
  context: frontend
  dependencies:
    - name: base-py
      tag: latest

- name: backend
  tag: latest
  actions: [build]
  dockerfile: backend/Dockerfile
  context: backend
  dependencies:
    - name: base-py
      tag: latest

- name: database
  tag: latest
  actions: [build]
  dockerfile: database/Dockerfile
  context: database
  dependencies:
    - name: base-py
      tag: latest
```

## 🔍 Configuration Breakdown

Let's understand each field:

### 📦 Required Fields

- **`name`**: The Docker image name
- **`tag`**: The image tag (version)
- **`actions`**: What Wake can do with this image

### ⚡ Supported Actions

- **`pull`**: Pull the image from a registry
- **`build`**: Build the image from a Dockerfile  
- **`tag`**: Tag the image with prefix (only when prefix is specified)
- **`push`**: Push the image to a registry
- **`sign`**: Sign the image (for security - experimental)

### 🗂️ Optional Fields

- **`dockerfile`**: Path to the Dockerfile (defaults to `./Dockerfile`)
- **`context`**: Build context directory (defaults to `.`)
- **`dependencies`**: Images that must be built first
- **`target`**: Multi-stage build target
- **`build_args`**: Build arguments
- **`env_args`**: Environment variables to pass as build args

## 🔗 Dependency Resolution

Wake automatically resolves the build order:

```text
Build Order:
1. base-py:latest        (no dependencies)
2. frontend:latest       (depends on base-py)  
   backend:latest        (depends on base-py)
   database:latest       (depends on base-py)
```

Services 2-4 can build in parallel since they only depend on the base image!

## 🎯 Advanced Configuration Examples

### Multi-stage Build with Target

```json
{
  "name": "frontend",
  "tag": "production",
  "actions": ["build"],
  "dockerfile": "frontend/Dockerfile",
  "target": "production",
  "context": "frontend"
}
```

### Build Arguments and Environment Variables

```json
{
  "name": "backend", 
  "tag": "latest",
  "actions": ["build"],
  "dockerfile": "backend/Dockerfile",
  "context": "backend",
  "build_args": {
    "NODE_ENV": "production",
    "API_VERSION": "v2"
  },
  "env_args": ["SECRET_KEY", "DATABASE_URL"]
}
```

### Production Configuration Example

For production, you might want separate configs for different environments:

**`Wakefile.prod.json`**:

```json
[
  {
    "name": "base-py",
    "tag": "v1.0.0",
    "actions": ["build", "tag", "push"],
    "dockerfile": "base-image/Dockerfile",
    "context": "base-image"
  },
  {
    "name": "frontend",
    "tag": "v1.0.0",
    "actions": ["build", "tag", "push"],
    "dockerfile": "frontend/Dockerfile",
    "context": "frontend",
    "dependencies": [{"name": "base-py", "tag": "v1.0.0"}]
  }
]
```

Then use it with: `wake -f Wakefile.prod.json -t myregistry.com/ all`

## 📁 Final Project Structure

Depending on your configuration approach, your complete project could look like:

### Option 1: Single Wakefile

```text
my-app/
├── Wakefile                    # Single configuration file
├── base-image/
│   └── Dockerfile
├── frontend/
│   ├── Dockerfile
│   └── app.py
├── backend/
│   ├── Dockerfile
│   └── api.py
└── database/
    ├── Dockerfile
    └── init-db.sql
```

### Option 2: .wake Directory

```text
my-app/
├── .wake/                      # Configuration directory
│   ├── base.json
│   └── services.yaml
├── base-image/
│   └── Dockerfile
├── frontend/
│   ├── Dockerfile
│   └── app.py
├── backend/
│   ├── Dockerfile
│   └── api.py
└── database/
    ├── Dockerfile
    └── init-db.sql
```

### Option 3: Custom Configuration Files

```text
my-app/
├── config/                     # Custom config directory
│   ├── development.json
│   ├── production.yaml
│   └── staging.json
├── team-configs/               # Team-specific configs
│   ├── backend-team.json
│   └── frontend-team.yaml
├── base-image/
│   └── Dockerfile
├── frontend/
│   ├── Dockerfile
│   └── app.py
├── backend/
│   ├── Dockerfile
│   └── api.py
└── database/
    ├── Dockerfile
    └── init-db.sql
```

## ✅ Configuration Benefits

This setup provides:

- 🔄 **Automatic dependency resolution** - Base image builds first
- ⚡ **Parallel builds** - Independent services build simultaneously  
- 🎯 **Selective building** - Build only what you need
- 🏷️ **Flexible tagging** - Add registry prefixes when needed
- 📦 **Registry integration** - Optional push/pull operations

### Important Notes

- **Actions are selective**: Only include actions you actually need for each image
- **Tag prefix**: The `-t` flag only affects `tag` and `push` operations, not `build`
- **Dependencies**: Only images with `pull` or `build` actions can be dependencies
- **Default behavior**: Wake looks for `Wakefile` or `.wake` directory by default

## 🔍 Configuration Discovery Order

Wake discovers configuration files in this order:

1. **Custom file** specified with `-f` flag (highest priority)
2. **`Wakefile`** in current directory (JSON or YAML)
3. **`.wake` directory** containing configuration files
4. **Error** if no configuration found

### Configuration Selection Examples

```bash
# Use default discovery (Wakefile or .wake directory)
wake build

# Use specific file
wake -f config/production.yaml build

# Use file with custom tag
wake -f team-configs/backend.json -d dev build

# Complex example with all options
wake -f config/staging.yaml -t staging.registry.com/ -d v2.1.0 -v all
```

### Mixed Format Support

You can mix JSON and YAML files in the `.wake` directory:

```text
.wake/
├── base-images.json      # JSON format
├── services.yaml         # YAML format
├── databases.yml         # YAML format
└── utilities.json        # JSON format
```

Wake will automatically detect and parse both formats!

## 🎯 Next Steps

Now that we have our Wake configuration in place, we're ready to:

1. 🔨 **Build images** with intelligent dependency resolution
2. 🎯 **Build specific services** for development workflows
3. 🏷️ **Tag images** with registry prefixes when needed
4. 📤 **Push to registries** for deployment

In the next section, we'll execute these builds and see Wake's dependency management in action!
