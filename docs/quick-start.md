---
sidebar_position: 1
---

# 🚀 Quick Start

Get up and running with Wake in 5 minutes! This guide will take you from installation to your first successful build.

## 📦 Installation

Install Wake using pip:

```bash
pip install wake-build
```

## ⚡ 5-Minute Demo

Let's build a simple multi-container project to see Wake in action.

### 1. Create Project Structure

```bash
# Create a new project
mkdir wake-demo && cd wake-demo

# Create directories
mkdir base-service frontend backend

# Create a simple base Dockerfile
cat > base-service/Dockerfile << 'EOF'
FROM python:3.11-slim
RUN pip install flask
WORKDIR /app
EOF

# Create frontend service
cat > frontend/Dockerfile << 'EOF'
FROM base-app:latest
COPY . .
EXPOSE 3000
CMD ["python", "app.py"]
EOF

cat > frontend/app.py << 'EOF'
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Frontend!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
EOF

# Create backend service
cat > backend/Dockerfile << 'EOF'
FROM base-app:latest
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
EOF

cat > backend/app.py << 'EOF'
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/status')
def status():
    return jsonify({"status": "Backend is running!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
```

### 2. Create Wake Configuration

Create a `Wakefile` in your project root:

```json
[
  {
    "name": "base-app",
    "tag": "latest",
    "context": "base-service/",
    "actions": ["build"]
  },
  {
    "name": "frontend",
    "tag": "latest", 
    "context": "frontend/",
    "actions": ["build"],
    "dependencies": [
      {"name": "base-app", "tag": "latest"}
    ]
  },
  {
    "name": "backend",
    "tag": "latest",
    "context": "backend/", 
    "actions": ["build"],
    "dependencies": [
      {"name": "base-app", "tag": "latest"}
    ]
  }
]
```

### 3. Build Everything

Run Wake to build all containers in the correct order:

```bash
wake all
```

**That's it!** Wake will:

1. 🔍 **Analyze dependencies** → Determines base-app must be built first
2. 🏗️ **Build base-app** → Creates the shared base image
3. ⚡ **Build frontend & backend in parallel** → Both depend on base-app
4. ✅ **Complete successfully** → All images ready to use

### 4. Verify Your Build

Check that all images were created:

```bash
docker images | grep -E "(base-app|frontend|backend)"
```

You should see:

```text
frontend     latest    a1b2c3d4e5f6   1 minute ago   150MB
backend      latest    b2c3d4e5f6a1   1 minute ago   150MB  
base-app     latest    c3d4e5f6a1b2   2 minutes ago   140MB
```

## 🎯 What Just Happened?

Wake automatically:

- **📊 Resolved dependencies** → Built base-app before frontend/backend
- **⚡ Optimized build order** → Ran frontend/backend builds in parallel
- **🎯 Used efficient contexts** → Each service only sent its own files to Docker
- **✅ Handled failures gracefully** → Would stop and report any build errors

## 🔗 Next Steps

Choose your learning path:

### 📚 **Complete Tutorial**

[Follow our step-by-step tutorial →](/docs/category/-tutorial)

Learn to build a real-world multi-service application with advanced Wake features.

### ⚡ **CLI Reference**

[Explore all commands →](/docs/category/-cli-reference)

Master Wake's powerful command-line interface with detailed examples.

### 🔧 **Configuration Guide**

[Learn Wakefile syntax →](/docs/tutorial/add_wake_config)

Understand all configuration options and advanced patterns.

## 💡 Pro Tips

### Development Workflow

```bash
# Build with verbose output
wake -v all

# Test configuration without building
wake --dry-run all

# Build only specific services
wake build frontend backend

# Build with custom tag
wake -d dev all
```

### Common Patterns

```bash
# Development build
wake -d dev -t local/ all

# Production build  
wake -d v1.0.0 -t registry.company.com/ all

# CI/CD integration
wake --dry-run all  # Validate config
wake all           # Build everything
```

## ❓ Need Help?

- **📖 [Full Tutorial](/docs/category/-tutorial)** - Complete walkthrough
- **⚡ [CLI Commands](/docs/category/-cli-reference)** - All available commands  
- **🔧 [Configuration](/docs/tutorial/add_wake_config)** - Wakefile reference
- **🐛 [GitHub Issues](https://github.com/wake-build/wake)** - Report bugs or ask questions

---

**🎉 Congratulations!** You've successfully built your first multi-container project with Wake. The intelligent dependency resolution and parallel building make complex projects simple to manage.
