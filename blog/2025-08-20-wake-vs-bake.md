---
slug: wake-vs-bake
title: Wake vs Docker Buildx Bake
authors: spenpw
tags: [intro]
---

The Docker Buildx project has produced a tool very similar to Wake called "Bake". IT is not only similar in name, but also in function. Overall, I have been very impressed with Bake, but it is missing a few things that were some of the key motivation behind building Wake.

<!-- truncate -->

First, Bake lacks the ability to share layers between multiple *separate* dockerfiles in a consistent manner.