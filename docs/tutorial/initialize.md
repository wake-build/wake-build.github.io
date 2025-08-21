---
sidebar_position: 1
---

# 🚀 Initialize Project

Let's start by setting up a new project with Wake to manage multiple container builds. This tutorial will walk you through creating a multi-service application with dependency management.

## Prerequisites

Before getting started, make sure you have:

- 📦 **Docker** installed and running
- 🐍 **Python 3.7+** with pip
- 🔧 **Wake** installed (`pip install wake-build`)

## Project Structure

We'll create a project with the following structure:

```text
my-app/
├── Wakefile                    # Wake configuration
├── base-image/
│   └── Dockerfile             # Base image with Python
├── frontend/
│   └── Dockerfile             # Frontend service
├── backend/
│   └── Dockerfile             # Backend API service
└── database/
    └── Dockerfile             # Database service
```

## 📁 Create Project Directory

First, let's create our project directory and navigate into it:

```bash
mkdir my-app
cd my-app
```

## 🏗️ Set Up Base Infrastructure

Create the directory structure for our services:

```bash
mkdir base-image frontend backend database
```

This gives us a clean foundation where each service has its own directory, and we'll have a centralized Wake configuration to orchestrate the builds.

## ✅ Verify Setup

Your project directory should now look like this:

```text
my-app/
├── base-image/
├── frontend/
├── backend/
└── database/
```

## 🎯 Next Steps

Now that we have our project structure in place, let's move on to:

1. 📦 **Add Containers** - Create Dockerfiles for each service  
2. ⚙️ **Add Wake Config** - Define the build orchestration
3. 🔨 **Build Project** - Execute the coordinated build process

In the next section, we'll create the Dockerfiles for each of our services and establish the dependency relationships between them.
