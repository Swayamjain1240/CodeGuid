# 🛡️ CodeGuide

### AI-Powered Pull Request Security Review Platform

> **CodeGuide automatically reviews GitHub Pull Requests using AI, detects potential security vulnerabilities, and provides developers with actionable security feedback before insecure code reaches production.**

<p align="center">

  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-LLM-1C3C3C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Redis-BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white" />

</p>

---

## 📌 Overview

CodeGuide is a full-stack **AI-powered GitHub security auditing platform** designed to integrate security analysis directly into the Pull Request workflow.

Instead of manually reviewing every code change for security issues, CodeGuide listens for GitHub Pull Request events, processes the changes asynchronously, sends the relevant code diff to an AI security analyzer, and stores the resulting security report.

The developer can then review the result from a centralized dashboard.

### Core Pipeline

```text
GitHub PR
   ↓
Webhook
   ↓
Node.js API
   ↓
BullMQ + Redis
   ↓
Background Worker
   ↓
AI Security Service
   ↓
LLM Analysis
   ↓
Security Report
   ↓
MongoDB
   ↓
React Dashboard
