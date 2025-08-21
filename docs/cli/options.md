---
sidebar_position: 1
---

# 🛠️ Global Options

Wake provides several global options that can be used with any subcommand to control behavior, configuration, and output.

## 📋 Usage Syntax

```bash
wake [OPTIONS] COMMAND [ARGS...]
```

## 🔧 Global Options

### `-h, --help`

Show help message and exit.

```bash
# Show general help
wake --help

# Show help for specific command
wake build --help
wake pull --help
```

### `-v, --verbose`

Control output verbosity. Can be specified multiple times for increased verbosity.

```bash
# Standard output (warnings and errors)
wake build

# Basic info output  
wake -v build

# Detailed info output
wake -vv build

# Maximum verbosity with live Docker output
wake -vvv build
```

**Verbosity Levels:**

- **No flag**: Warnings and errors only
- **`-v`**: Info messages + warnings + errors
- **`-vv`**: Debug messages + info + warnings + errors  
- **`-vvv`**: All messages + live Docker command output

### `-f, --config CONFIG`

Specify a custom configuration file instead of using the default discovery.

```bash
# Use specific configuration file
wake -f config/production.yaml build

# Use configuration from different directory
wake -f ../shared/microservices.json build

# Combine with other options
wake -f config/staging.json -t staging.registry.com/ all
```

**Default Discovery Order:**

1. Custom file specified with `-f` (highest priority)
2. `Wakefile` in current directory
3. `.wake` directory in current directory
4. Error if no configuration found

### `--dry-run`

Show what commands would be executed without actually running them. Useful for testing and validation.

```bash
# See what would be built
wake --dry-run build

# Test production deployment commands
wake --dry-run -f config/prod.yaml -t registry.company.com/ all

# Verify tag operations
wake --dry-run -t myregistry.com/ tag frontend backend
```

**Dry Run Output Example:**

```text
INFO: Running command: `docker build --tag base-py:latest base-image`
INFO: Running command: `docker build --tag frontend:latest frontend`
INFO: Running command: `docker tag frontend:latest myregistry.com/frontend:latest`
```

### `-d, --default-tag DEFAULT_TAG`

Set the default tag for images that don't specify a tag in the configuration.

```bash
# Use 'dev' as default tag instead of 'latest'
wake -d dev build

# Use version tag for production builds
wake -d v1.2.0 build

# Combine with other options
wake -d staging -f config/staging.yaml build
```

**How it works:**

- Images without explicit `tag` field use this value
- Images with explicit `tag` field are unaffected
- Defaults to `"latest"` if not specified

### `-t, --tag-prefix TAG_PREFIX`

Set a prefix for tagging operations. Only affects `tag` and `push` commands, not `build`.

```bash
# Tag images with Docker Hub username
wake -t docker.io/myusername/ tag

# Tag with private registry
wake -t registry.company.com/project/ tag

# Use with environment variable
export TAG_PREFIX="gcr.io/my-project/"
wake tag

# Complete workflow with prefix
wake build                                    # Build images
wake -t registry.company.com/ tag            # Tag with prefix  
wake -t registry.company.com/ push           # Push to registry
```

**Tagging Behavior:**

- Original: `frontend:latest`
- With prefix `myregistry.com/`: `myregistry.com/frontend:latest`
- Only applied during `tag` operations
- Required for `push` operations to work properly

### `-p, --cosign-profile COSIGN_PROFILE`

Specify cosign profile for image signing (experimental feature).

```bash
# Sign images with specific profile
wake -p production build

# Use with registry operations
wake -t registry.com/ -p secure-profile all
```

**Note:** This is an experimental feature for container image signing with cosign.

## 🌍 Environment Variables

Wake also respects certain environment variables:

### `TAG_PREFIX`

Alternative way to set tag prefix without using `-t` flag.

```bash
export TAG_PREFIX="myregistry.com/project/"
wake tag    # Uses the environment variable
```

### `.env` File Support

Wake automatically loads `.env` files from the current working directory:

**`.env`**:

```bash
TAG_PREFIX=registry.company.com/myproject/
SECRET_KEY=mysecretkey
DATABASE_URL=postgresql://localhost/mydb
```

## 📝 Option Combination Examples

### Development Workflow

```bash
# Build with dev tag and verbose output
wake -d dev -v build

# Test production config without executing
wake --dry-run -f config/prod.yaml -t registry.com/ all
```

### Production Deployment

```bash
# Build and deploy to production registry
wake -f config/production.yaml -t registry.company.com/ -d v1.0.0 all

# Maximum verbosity for debugging
wake -vvv -f config/debug.yaml build
```

### Team-Specific Workflows

```bash
# Backend team builds
wake -f team-configs/backend.json -d feature-branch build

# Frontend team with staging registry
wake -f team-configs/frontend.yaml -t staging.registry.com/ all
```

## ❗ Important Notes

- **Order matters**: Global options must come before the subcommand
- **Precedence**: Command-line options override environment variables
- **Dry run**: Always test with `--dry-run` before production operations
- **Verbosity**: Use `-vvv` to debug Docker build issues
- **Configuration**: `-f` option overrides default file discovery
