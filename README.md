# 🚀 CodeGuide

> AI-Powered Pull Request Security Auditor

CodeGuide is an AI-powered developer security platform that automatically
analyzes GitHub Pull Requests and identifies potential security vulnerabilities.

---

## 🔐 Security Architecture

CodeGuide provides multiple layers of security:

- **JWT Authentication**
- **Protected Routes**
- **GitHub OAuth**
- **Webhook Signature Verification**
- **Rate Limiting**
- **Input Validation**
- **Repository Ownership Validation**
- **Pull Request Validation**
- **Background Job Processing**
- **Environment-based Secrets**

---

## 🎯 Problem

Modern software teams create Pull Requests continuously.

Traditional security review can be:

- Time consuming
- Difficult to scale
- Dependent on manual review
- Easy to overlook during rapid development
- Performed too late in the development lifecycle

CodeGuide addresses this problem by introducing an **automated AI-powered
security review layer** into the Pull Request workflow.

---

## 💡 Solution

CodeGuide automatically analyzes Pull Request changes and generates a
structured security report containing:

- Security grade
- Vulnerability type
- Severity
- Affected file
- Line number
- Vulnerability description
- Recommended remediation
- Security summary

---

## ⚙️ Core Pipeline

```text
GitHub Pull Request
        ↓
GitHub Webhook
        ↓
Node.js / Express API
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

---

## 🧠 AI Security Analysis

The AI service is implemented as a separate **FastAPI microservice**.

It receives:

```json
{
  "prTitle": "Add authentication",
  "prDescription": "Added login functionality",
  "patch": "git diff content..."
}
```

and returns a structured security report:

```json
{
  "securityGrade": "B",
  "vulnerabilities": [
    {
      "type": "Hardcoded Secret",
      "severity": "High",
      "file": "config.js",
      "line": 12,
      "description": "Sensitive credential detected.",
      "recommendation": "Move the credential to environment variables."
    }
  ],
  "summary": "Potential security issues were detected."
}
```

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │     GitHub      │
                    └────────┬────────┘
                             │
                       Pull Request
                             │
                             ▼
                    ┌─────────────────┐
                    │ GitHub Webhook  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express Backend │
                    └────────┬────────┘
                             │
                       Queue Job
                             │
                             ▼
                    ┌─────────────────┐
                    │ BullMQ + Redis  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Background      │
                    │ Worker          │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ FastAPI AI      │
                    │ Microservice    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ LLM Security    │
                    │ Analysis        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    MongoDB      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Dashboard │
                    └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- **React**
- **Vite**
- **React Router**
- **Axios**
- **Tailwind CSS**
- **Lucide React**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT**
- **BullMQ**
- **Redis**

### AI Service

- **Python**
- **FastAPI**
- **Pydantic**
- **LangChain**
- **OpenAI API**
- **LLM Structured Output**

### Integration

- **GitHub OAuth**
- **GitHub Webhooks**
- **GitHub REST API**

---

## 📁 Project Structure

```text
CodeGuide/
│
├── Backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── queues/
│   ├── routers/
│   ├── services/
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
│
├── aiServices/
│   ├── analyzer.py
│   ├── schemas.py
│   ├── main.py
│   └── requirements.txt
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔄 Pull Request Workflow

When a developer creates or updates a Pull Request:

1. GitHub sends a webhook.
2. Backend verifies the webhook signature.
3. The PR information is validated.
4. A security analysis job is added to **BullMQ**.
5. Redis manages the background queue.
6. The worker processes the job.
7. GitHub PR diff is collected.
8. The diff is sent to the **AI Security Service**.
9. The LLM analyzes the code.
10. A structured security report is generated.
11. The report is stored in MongoDB.
12. The React dashboard displays the result.

---

## 🔒 Security

CodeGuide implements security controls at multiple levels.

**Authentication**

```text
GitHub OAuth
     ↓
JWT
     ↓
Protected API Routes
```

**Webhook Security**

```text
GitHub Webhook
     ↓
x-hub-signature-256
     ↓
HMAC SHA-256 Verification
     ↓
Webhook Processing
```

Sensitive credentials are stored using environment variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret
OPENAI_API_KEY=your_openai_api_key
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Swayamjain1240/CodeGuid.git
cd CodeGuid
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the complete application

```bash
npm run dev
```

The root script starts the frontend and backend together.

---

## 🐍 Start AI Service

Navigate to the AI service:

```bash
cd aiServices
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

Health check:

```text
GET http://localhost:8000/health
```

---

## 🌐 API Overview

### Authentication

```http
GET /api/v1/auth/me
```

Returns the currently authenticated user.

### Repositories

```http
GET /api/v1/repositories
```

Fetches synchronized GitHub repositories.

### Pull Requests

```http
GET /api/v1/pull-requests
```

Returns analyzed Pull Requests.

### Pull Request Details

```http
GET /api/v1/pull-requests/:id
```

Returns the security analysis for a specific Pull Request.

### GitHub Webhook

```http
POST /api/v1/webhooks/github
```

Receives Pull Request events from GitHub.

### AI Analysis

```http
POST /analyze
```

Sends a Pull Request patch to the AI security analyzer.

---

## 📊 Dashboard

The React dashboard provides a centralized view of:

- Total repositories
- Pull Requests analyzed
- Security grades
- Vulnerability statistics
- Security trends
- Repository information
- Pull Request audit reports

---

## 🧪 Example Security Findings

CodeGuide can identify security issues such as:

```text
Hardcoded Secrets
SQL Injection
Command Injection
Authentication Issues
Authorization Problems
Insecure Input Handling
Sensitive Data Exposure
Dangerous API Usage
Security Misconfiguration
Suspicious Code Patterns
```

---

## 🔁 Background Processing

Pull Request analysis is processed asynchronously using:

```text
Express
  ↓
BullMQ
  ↓
Redis
  ↓
Worker
  ↓
AI Service
```

This prevents expensive AI analysis from blocking normal API requests.

Jobs support retry mechanisms with exponential backoff:

```javascript
{
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5000
  }
}
```

---

## 📌 Environment Variables

### Backend

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=
REDIS_URL=
AI_SERVICE_URL=
```

### AI Service

```env
OPENAI_API_KEY=
PORT=8000
```

### Frontend

```env
VITE_API_URL=
```

---

## 🧩 Future Improvements

- [ ] Multi-model security analysis
- [ ] CWE classification
- [ ] OWASP mapping
- [ ] Security trend analytics
- [ ] Automatic remediation suggestions
- [ ] GitHub PR comments
- [ ] AI-generated fix patches
- [ ] Repository-wide security scanning
- [ ] Authentication anomaly detection
- [ ] Advanced agentic security workflows

---

## 🎓 Project Highlights

CodeGuide demonstrates practical implementation of:

**Full-Stack Development**

**AI / LLM Integration**

**Microservice Architecture**

**Event-Driven Architecture**

**Background Job Processing**

**GitHub API Integration**

**Webhook Security**

**Authentication & Authorization**

**Database Design**

**Production-Oriented API Design**

---

## 👨‍💻 Author

**Swayam Jain**

Software Developer | Full-stack AI Developer

GitHub:  
https://github.com/Swayamjain1240

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---
