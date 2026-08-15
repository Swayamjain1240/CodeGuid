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

```

🎯 Problem

Modern software teams create Pull Requests continuously.

Traditional security review can be:

Time consuming
Difficult to scale
Dependent on manual review
Easy to overlook during rapid development
Performed too late in the development lifecycle

CodeGuide addresses this by bringing an automated AI-powered security review layer directly into the GitHub workflow.

💡 Solution

CodeGuide analyzes Pull Request changes and produces a structured security report containing:

Security grade
Vulnerability type
Severity
Affected file
Line number
Vulnerability description
Recommended remediation

The goal is not to replace professional security testing, but to provide an automated first layer of security analysis during development.

✨ Features

🔐 Authentication
GitHub OAuth authentication
JWT access tokens
Refresh token handling
Protected application routes

🐙 GitHub Integration
GitHub repository synchronization
Pull Request retrieval
GitHub Webhooks
Pull Request event processing
Webhook signature verification

🤖 AI Security Analysis
AI-powered Pull Request analysis
Structured security reports
Vulnerability classification
Security grading
Security recommendations

⚡ Distributed Processing
BullMQ job queue
Redis-backed background jobs
Retry mechanism
Asynchronous PR scanning
Non-blocking API architecture

📊 Dashboard
Repository overview
Pull Request statistics
Security pass rate
Vulnerability distribution
Security grade distribution
Recent security scans

🏗️ Architecture

                    ┌────────────────────┐
                    │      GitHub        │
                    │   Pull Request     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │  GitHub Webhook    │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   Express API      │
                    │     Backend        │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │     BullMQ         │
                    │   Redis Queue      │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    PR Worker       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   FastAPI AI       │
                    │    Microservice    │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   LLM Security     │
                    │     Analysis       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │      MongoDB       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   React Dashboard  │
                    └────────────────────┘

🔄 End-to-End Workflow

1. Developer creates Pull Request
                ↓
2. GitHub sends webhook
                ↓
3. Backend verifies webhook signature
                ↓
4. PR job is added to BullMQ
                ↓
5. Redis stores the job
                ↓
6. Worker processes the PR
                ↓
7. Pull Request diff is collected
                ↓
8. Diff is sent to AI Service
                ↓
9. LLM analyzes security risks
                ↓
10. Structured report is returned
                ↓
11. Result is stored in MongoDB
                ↓
12. Dashboard displays security report


🧠 AI Security Report
<img width="766" height="367" alt="image" src="https://github.com/user-attachments/assets/3e009e05-bd27-4993-954c-ebfa7f9cec6c" />

📊 Security Grading

Grade	Risk Level
🟢 A	Excellent
🔵 B	Good
🟡 C	Needs Improvement
🟠 D	High Risk
🔴 F	Critical Risk

🛠️ Technology Stack

Frontend
React ->	UI
Vite ->	Frontend tooling
React Router ->	Routing
Axios	API -> communication
Tailwind CSS ->	Styling
Lucide React ->	Icons

Backend
Node.js ->	Runtime
Express.js ->	REST API
MongoDB ->	Database
Mongoose ->	ODM
JWT ->	Authentication
bcrypt ->	Password security
BullMQ ->	Job processing
Redis ->	Queue backend
GitHub API ->	GitHub integration

AI Service
Python ->	AI service runtime
FastAPI	 -> AI microservice API
Pydantic ->	Data validation
LangChain ->	LLM application layer
OpenAI ->	Security analysis

📁 Project Structure
CodeGuide/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── queues/
│   ├── routers/
│   ├── services/
│   ├── index.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── aiServices/
│   ├── analyzer.py
│   ├── schemas.py
│   ├── main.py
│   ├── requirements.txt
│   └── .gitignore
│
├── package.json
├── package-lock.json
└── README.md

🔒 Security Architecture

CodeGuide includes security controls at multiple layers.

Application Security
JWT authentication
Protected routes
Token validation
Request validation
API rate limiting
GitHub Security
OAuth authentication
Webhook signature verification
Repository ownership validation
Pull Request validation
Infrastructure
Redis-backed job processing
Retryable background jobs
Environment-based secrets
Separated AI microservice


🔌 API
Authentication
GET  /api/v1/auth/me
Repositories
GET  /api/v1/repositories
Pull Requests
GET  /api/v1/pull-requests
Dashboard
GET  /api/v1/dashboard/stats
GitHub Webhook
POST /api/v1/webhooks/github
AI Service
GET  /health
POST /analyze

⚙️ Environment Setup
Backend .env
PORT=5000


MONGODB_URI=your_mongodb_uri


ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret


GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret


REDIS_HOST=localhost
REDIS_PORT=6379


AI_SERVICE_URL=http://localhost:8000
AI Service .env
OPENAI_API_KEY=your_openai_api_key
PORT=8000
Frontend .env
VITE_API_URL=http://localhost:5000/api/v1


👨‍💻 Author
Swayam Jain

Software Developer |Full-stack AI Developer

GitHub:
https://github.com/Swayamjain1240
