# 🛡️ CodeGuardian AI

> **Autonomous, multi-agent AI code reviewer that scans Pull Requests for security vulnerabilities, verifies syntax trees self-correctively, and posts automated inline fixes back to GitHub.**

---

## 📌 Executive Summary

Modern software development moves fast, but manual code reviews often cause engineering bottlenecks. **CodeGuardian AI** automates this by acting as an intelligent co-pilot for your GitHub repositories. When a developer opens or updates a Pull Request, CodeGuardian AI intercepts the event via secure webhooks, performs an AST-aware deep security audit using Retrieval-Augmented Generation (RAG), self-corrects syntax errors, and leaves actionable review comments with code fixes directly on GitHub.

---

## 🏗️ System Architecture & Workflow

The platform utilizes a **Microservices Architecture** combining a fast Node.js ingestion backend with an agentic Python FastAPI engine.
