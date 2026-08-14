# 🛡️ CodeGuide — AI-Powered GitHub Security Auditor

CodeGuide is an AI-powered developer security platform that automatically analyzes GitHub Pull Requests for potential security vulnerabilities, code smells, exposed secrets, and insecure coding practices.

It combines a MERN-based web application, GitHub integration, Redis + BullMQ job processing, and an AI security analysis microservice to create an automated security auditing workflow for developers.

---

## 🚀 Features

- 🔐 GitHub OAuth authentication
- 📦 GitHub repository synchronization
- 🔀 Pull Request monitoring
- 🤖 AI-powered security analysis
- 🛡️ Automated vulnerability detection
- 📊 Security grades for Pull Requests
- 📈 Security dashboard and statistics
- ⚠️ Vulnerability severity classification
- 🔄 Pull Request re-scanning
- ⚡ Background processing using BullMQ
- 🧠 Dedicated FastAPI AI microservice
- 🐙 GitHub Webhook integration
- 🔑 JWT-based authentication
- 🚦 API rate limiting
- 🔒 GitHub webhook signature verification
- 📱 Responsive developer dashboard

---

## 🧠 How It Works

```text
Developer
    │
    ▼
GitHub Pull Request
    │
    ▼
GitHub Webhook
    │
    ▼
Node.js / Express Backend
    │
    ▼
BullMQ + Redis
    │
    ▼
Background Worker
    │
    ▼
AI Security Service
    │
    ▼
LLM Security Analysis
    │
    ▼
Structured Security Report
    │
    ├── Security Grade
    ├── Vulnerabilities
    ├── Severity
    ├── Description
    └── Recommendation
    │
    ▼
MongoDB
    │
    ▼
React Dashboard

🏗️ Architecture
CodeGuide
│
├── Frontend
│   ├── React
│   ├── React Router
│   ├── Axios
│   ├── Tailwind CSS
│   └── Lucide React
│
├── Backend
│   ├── Node.js
│   ├── Express.js
│   ├── MongoDB
│   ├── Mongoose
│   ├── JWT
│   ├── BullMQ
│   ├── Redis
│   └── GitHub API
│
└── AI Service
    ├── Python
    ├── FastAPI
    ├── Pydantic
    ├── LangChain
    └── OpenAI
🛠️ Tech Stack
Frontend
React
Vite
React Router
Axios
Tailwind CSS
Lucide React
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
BullMQ
Redis
GitHub API
AI Service
Python
FastAPI
Pydantic
LangChain
LangChain OpenAI
OpenAI API
Development Tools
Git
GitHub
Postman
Nodemon
Concurrently
📂 Project Structure
CodeGuide/
│
├── Backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── queues/
│   ├── routers/
│   ├── services/
│   ├── config/
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
│   ├── public/
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
🔑 Environment Variables

Create the required .env files locally.

Backend
PORT=5000


MONGODB_URI=your_mongodb_connection_string


ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret


GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret


GITHUB_WEBHOOK_SECRET=your_github_webhook_secret


REDIS_HOST=localhost
REDIS_PORT=6379


AI_SERVICE_URL=http://localhost:8000
AI Service
OPENAI_API_KEY=your_openai_api_key
PORT=8000
Frontend
VITE_API_URL=http://localhost:5000/api/v1

Never commit .env, API keys, tokens, or credentials to GitHub.

📦 Installation

Clone the repository:

git clone https://github.com/Swayamjain1240/CodeGuid.git
cd CodeGuid

Install root dependencies:

npm install

Install Backend dependencies:

cd Backend
npm install
cd ..

Install Frontend dependencies:

cd Frontend
npm install
cd ..

Install AI Service dependencies:

cd aiServices
pip install -r requirements.txt
cd ..
▶️ Running the Project

Start Frontend and Backend together:

npm run dev

Start the AI service separately:

cd aiServices
python main.py

The services will run approximately on:

Frontend     → http://localhost:5173
Backend      → http://localhost:5000
AI Service   → http://localhost:8000

Make sure MongoDB and Redis are also running.

❤️ Health Check

Backend:

GET /health

AI Service:

GET /health

Example AI response:

{
  "status": "OK",
  "service": "aiServices"
}
🔐 Authentication

CodeGuide uses JWT-based authentication.

Authentication flow:

GitHub OAuth
     ↓
Backend
     ↓
User Verification
     ↓
Access Token
     ↓
Refresh Token
     ↓
Authenticated Dashboard

Protected APIs require a valid access token.

🐙 GitHub Integration

CodeGuide integrates with GitHub to:

Authenticate developers
Fetch repositories
Synchronize repositories
Receive Pull Request events
Fetch Pull Request information
Analyze Pull Request changes
Process security scans
🔄 Webhook Flow

When a Pull Request is opened, reopened, or synchronized:

GitHub
   ↓
Webhook
   ↓
Signature Verification
   ↓
Express Controller
   ↓
BullMQ Queue
   ↓
Redis
   ↓
PR Worker
   ↓
AI Security Analysis

Supported Pull Request actions:

opened
reopened
synchronize
🤖 AI Security Analysis

The AI service receives Pull Request information and the Git diff.

Example request:

{
  "prTitle": "Update authentication",
  "prDescription": "Improve login security",
  "patch": "git diff content..."
}

The AI generates a structured security report.

Example:

{
  "securityGrade": "B",
  "summary": "Potential security issue detected.",
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "HIGH",
      "file": "server.js",
      "line": 42,
      "description": "User input is directly used in a SQL query.",
      "recommendation": "Use parameterized queries."
    }
  ]
}
📊 Security Grades

Pull Requests are assigned grades:

A → Excellent
B → Good
C → Needs Improvement
D → High Risk
F → Critical Security Risk

Vulnerability severity levels:

CRITICAL
HIGH
MEDIUM
LOW
⚡ Background Processing

CodeGuide uses BullMQ and Redis to process security scans asynchronously.

API Request
    ↓
Create Job
    ↓
BullMQ
    ↓
Redis
    ↓
Worker
    ↓
GitHub + AI Service
    ↓
MongoDB

This prevents long-running AI analysis from blocking normal API requests.

📈 Dashboard

The dashboard provides:

Total repositories
Total Pull Requests
Passed scans
Failed scans
Scanning Pull Requests
Security pass rate
Vulnerability statistics
Recent security scans
Security grade distribution
🧪 API Testing

Postman can be used to test the backend APIs.

Important endpoints include:

GET  /health


GET  /api/v1/auth/me


GET  /api/v1/repositories


GET  /api/v1/pull-requests


GET  /api/v1/dashboard/stats


POST /api/v1/webhooks/github

Authentication, authorization, invalid requests, webhook signatures, and error handling should be tested before deployment.

🔒 Security

CodeGuide implements several backend security mechanisms:

JWT authentication
Protected routes
Refresh-token handling
GitHub webhook signature verification
API rate limiting
Request validation
Environment-based secrets
User/repository ownership checks
Background job retry handling
🚧 Current Development Status
Completed
 MERN application structure
 GitHub authentication
 JWT authentication
 Repository synchronization
 Pull Request APIs
 Dashboard APIs
 React dashboard
 Repository management
 Pull Request management
 Redis integration
 BullMQ integration
 GitHub webhook verification
 FastAPI AI service foundation
In Progress
 Complete AI security analyzer
 End-to-end AI scan testing
 Automated GitHub PR security comments
 Production deployment
 Advanced security rules
 Comprehensive automated tests
🔮 Future Improvements
Multi-model security analysis
RAG-based security knowledge system
OWASP vulnerability mapping
AI Agent for automated remediation
Automatic secure-code suggestions
GitHub PR inline comments
Security trend analytics
Team-based repositories
Organization support
CI/CD integration
Docker deployment
Cloud deployment
Automated security reports
🎯 Project Goal

The goal of CodeGuide is to provide developers with an automated AI-powered security assistant that reviews Pull Requests before insecure code reaches production.

Instead of manually reviewing every security issue, CodeGuide combines GitHub automation, asynchronous processing, and LLM-based analysis to provide developers with actionable security feedback directly inside their development workflow.

👨‍💻 Author

Swayam Jain

Computer Science Engineering Student

GitHub:
https://github.com/Swayamjain1240

⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.
