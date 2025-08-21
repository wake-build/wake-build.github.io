---
title: What is Wake?
---

# What is Wake?

Wake is a container management system for projects that need to build multiple images in one repo. Simply create a declarative json or yaml-based configuration file to describe your container build processes, and run `wake all`.

## ✨ Key Features

### 🔗 Intelligent Dependency Resolution

Wake analyzes your defined dependency graph and determines the optimal build order for your containers. It understands complex links between components of your build pipeline and ensures that:

- 📦 Base images are built before dependent images
- ♻️ Shared dependencies are built only once and reused
- 🔄 Circular dependencies are detected and reported

### ⚡ Cache Optimization

Using Wake, you have full control over Docker's caching features and can seamlessly leverage the capability across your entire project.

- **🧱 Layer-aware caching**: Automatically detects when Docker layers can be reused across builds
- **🎯 Dependency-based invalidation**: Only rebuilds containers when their actual dependencies change
- **🏗️ Multi-stage build optimization**: Efficiently caches intermediate build stages
- **🤝 Cross-container cache sharing**: Shares common base layers and dependencies between related containers


### 📝 Declarative Configuration

The `Wakefile` provides a simple, declarative way to define your entire container ecosystem:

- 🏗️ Container definitions with clear dependency relationships
- ⚙️ Common build option specifications
- 🌍 Environment-specific configurations


### 🚀 Features Coming Soon

- 🛡️ Build failures in one container don't unnecessarily block unrelated builds
- ⚡ Parallelized builds
- 🔍 Automatic dependency detection
