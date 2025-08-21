---
sidebar_position: 2
---

# 📦 Add Containers

Now that we have our project structure, let's create the Dockerfiles for each service. We'll build a dependency hierarchy where services depend on a shared base image.

## 🏗️ Base Image

First, create the foundation image that other services will use:

**`base-image/Dockerfile`**:

```dockerfile
FROM ubuntu:22.04

# Install Python and common dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set Python as default
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app
```

This base image provides Python and essential tools that all our services will need.

## 🎨 Frontend Service

Create the frontend service that will serve static content:

**`frontend/Dockerfile`**:

```dockerfile
FROM base-py:latest

# Install frontend dependencies
RUN pip install flask

# Copy frontend application
COPY . /app/

# Expose port for the frontend
EXPOSE 3000

CMD ["python", "app.py"]
```

**`frontend/app.py`**:

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Frontend Service</h1><p>Connected to backend!</p>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
```

## ⚙️ Backend Service

Create the backend API service:

**`backend/Dockerfile`**:

```dockerfile
FROM base-py:latest

# Install backend dependencies
RUN pip install flask psycopg2-binary

# Copy backend application
COPY . /app/

# Expose port for the API
EXPOSE 5000

CMD ["python", "api.py"]
```

**`backend/api.py`**:

```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "backend"})

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Data from backend", "items": [1, 2, 3]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## 🗄️ Database Service

Create the database service:

**`database/Dockerfile`**:

```dockerfile
FROM base-py:latest

# Install PostgreSQL and dependencies
RUN apt-get update && apt-get install -y \
    postgresql \
    postgresql-contrib \
    && rm -rf /var/lib/apt/lists/*

# Set up database initialization script
COPY init-db.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

CMD ["postgres"]
```

**`database/init-db.sql`**:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');
```

## 🔗 Dependency Overview

Our container hierarchy looks like this:

```text
base-py:latest (base image)
├── frontend:latest (depends on base-py)
├── backend:latest (depends on base-py)  
└── database:latest (depends on base-py)
```

## 📁 Complete Project Structure

Your project should now have this structure:

```text
my-app/
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

## ✅ Key Benefits

This container structure provides:

- 🔄 **Reusability**: Base image is shared across services
- 🚀 **Efficiency**: Common layers are cached and reused
- 📦 **Consistency**: All services use the same foundation
- 🔧 **Maintainability**: Updates to the base affect all services

## 🎯 Next Steps

Now that we have our containers defined, we need to configure Wake to:

1. ⚙️ **Define build order** - Ensure base image builds first
2. 🔗 **Manage dependencies** - Link services to the base image
3. 🏷️ **Handle tagging** - Manage image versions consistently

In the next section, we'll create the Wake configuration file that orchestrates these builds intelligently.
