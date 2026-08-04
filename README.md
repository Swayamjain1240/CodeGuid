# 🚧 CodeGuardian AI (Under Development)

> **⚠️ This project is currently under active development. Features, architecture, and APIs may change before the first stable release.**

---

# 🛡️ CodeGuardian AI

**Autonomous Multi-Agent AI Code Reviewer for GitHub Pull Requests**

CodeGuardian AI is an enterprise-grade AI-powered DevSecOps platform that automatically reviews GitHub Pull Requests for security vulnerabilities, code quality issues, syntax errors, and repository-specific best practices.

Instead of relying solely on manual code reviews, CodeGuardian AI acts as an intelligent code reviewer that continuously analyzes pull requests using **LangGraph**, **Retrieval-Augmented Generation (RAG)**, **Tree-Sitter AST analysis**, and **LLMs**, then posts actionable review comments and suggested fixes directly back to GitHub.

---

# ✨ Features

* 🔍 Automatic GitHub Pull Request Analysis
* 🤖 Multi-Agent AI Workflow using LangGraph
* 🛡️ Security Vulnerability Detection (OWASP Top 10)
* 🌳 AST-aware Code Parsing using Tree-Sitter
* 📚 Repository-Aware RAG with Qdrant
* 💬 Automated Inline GitHub Review Comments
* 🔄 Self-Correcting AI Validation Loop
* 📊 Live React Dashboard
* ⚡ Real-time Progress Streaming via Socket.io
* 📦 Asynchronous Job Processing using BullMQ
* 🐳 Docker-based Microservice Architecture

---

# 🏗️ System Architecture

```text
Developer
      │
      ▼
GitHub Pull Request
      │
      ▼
──────────────────────────────────────────────
Phase 1 : Webhook Ingestion (Node.js)
──────────────────────────────────────────────
Verify GitHub Signature
Store Pull Request
Create BullMQ Job
Return 202 Accepted

      │
      ▼
──────────────────────────────────────────────
Phase 2 : BullMQ Queue
──────────────────────────────────────────────
Async Job Processing
Background Workers
Retry Mechanism

      │
      ▼
──────────────────────────────────────────────
Phase 3 : AI Service (FastAPI)
──────────────────────────────────────────────
Supervisor Agent
Security Agent
Quality Agent
RAG Retrieval
Tree-Sitter AST Validation
Self-Correction Loop

      │
      ▼
──────────────────────────────────────────────
Phase 4 : Frontend Dashboard
──────────────────────────────────────────────
Live Logs
Security Findings
PR Timeline
Code Suggestions
Analytics
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Socket.io Client
* Axios
* React Context API

## Backend

* Node.js
* Express.js
* MongoDB
* BullMQ
* Redis
* Socket.io
* GitHub Webhooks

## AI Service

* Python
* FastAPI
* LangGraph
* LangChain
* Tree-Sitter
* OpenAI / Groq
* Qdrant Vector Database

## DevOps

* Docker
* Docker Compose
* NGINX
* GitHub API

---

# 📂 Project Structure

```text
CodeGuardian-AI/

├── frontend/          # React Dashboard
├── backend/           # Node.js API & GitHub Webhooks
├── ai-service/        # FastAPI + LangGraph AI Engine
├── docs/              # Project Documentation
└── docker-compose.yml
```

---

# 🚀 Core Workflow

1. Developer opens or updates a GitHub Pull Request.
2. GitHub sends a secure webhook event.
3. Node.js verifies the HMAC signature.
4. Pull Request is stored in MongoDB.
5. BullMQ schedules an asynchronous AI job.
6. FastAPI receives the PR information.
7. LangGraph orchestrates multiple AI agents.
8. Repository context is retrieved from Qdrant.
9. Tree-Sitter validates generated code fixes.
10. Self-correction runs if syntax errors are found.
11. AI posts review comments to GitHub.
12. Dashboard streams live progress and results.

---

# 🧠 AI Agents

### 🟢 Supervisor Agent

* Coordinates the complete workflow
* Manages agent execution
* Controls state transitions

### 🔴 Security Agent

* Detects OWASP Top 10 vulnerabilities
* Finds credential leaks
* Identifies insecure coding patterns

### 🟡 Code Quality Agent

* Reviews maintainability
* Detects code duplication
* Suggests refactoring opportunities

### 🌳 AST Validation Agent

* Parses generated code
* Detects syntax errors
* Triggers automatic self-correction

---

# 📊 Dashboard

The React dashboard provides:

* Repository Management
* Pull Request History
* Security Findings
* Vulnerability Charts
* AI Agent Live Logs
* Audit Reports
* Security Scores
* Repository Analytics

---

# 🔒 Security

* GitHub Webhook HMAC Verification
* OAuth Authentication
* AES-256 Encrypted Tokens
* Repository Isolation
* Secure API Communication
* Role-Based Access Control (Planned)

---

# 📦 Planned Features

* GitHub App Integration
* Multi-Repository Support
* Multi-Language Code Analysis
* AI Generated Unit Tests
* Custom Organization Security Policies
* CI/CD Integration
* Kubernetes Deployment
* Slack & Discord Notifications
* Team Analytics Dashboard
* Performance Insights

---

# 📸 Screenshots

> Screenshots will be added after the first working prototype.

---

# 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/your-username/CodeGuardian-AI.git

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install

# Install AI Service
cd ../ai-service
pip install -r requirements.txt
```

---

# 📅 Project Status

| Module                  | Status            |
| ----------------------- | ----------------- |
| Frontend                | 🚧 In Development |
| Backend API             | ✅  Complete      |
| GitHub Webhooks         | 🚧 In Development |
| BullMQ Queue            | 🚧 In Development |
| FastAPI AI Service      | 🚧 In Development |
| LangGraph Workflow      | 🚧 In Development |
| Tree-Sitter Integration | 🚧 In Development |
| Qdrant RAG              | 🚧 In Development |
| Docker Deployment       | 🚧 In Development |

---

# 🤝 Contributing

Contributions, suggestions, and feedback are welcome. Once the initial stable version is released, contribution guidelines will be published.

---

# 📄 License

This project is intended for educational and portfolio purposes during development. A production license will be selected before the first public release.

---

# 👨‍💻 Author

**Swayam Jain**

B.Tech Computer Science Engineering

Building intelligent software systems using **Full Stack Development, AI, Machine Learning, LLMs, RAG, LangGraph, and Agentic AI.**

---

⭐ **If you like this project, consider giving it a star once it's publicly released!**
