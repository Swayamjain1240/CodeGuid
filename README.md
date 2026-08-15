# 🛡️ CodeGuide AI — Automated PR Security & Code Audit Platform

CodeGuide AI is an enterprise-grade automated code review and security auditing platform designed to protect codebases before changes reach production. Built on a modern decoupled microservices architecture, CodeGuide AI bridges GitHub workflows with advanced Artificial Intelligence to analyze Pull Request (PR) diffs in real time. It automatically surfaces critical security vulnerabilities, secret leaks, injection vectors, and code smells while providing granular security grading and actionable remediation advice.

---

## 🔑 Key Features

* **🔐 GitHub OAuth & Automated Sync:** Single-click sign-in via GitHub OAuth with instant synchronization of user repositories and webhooks.
* **🤖 LLM-Powered Security Auditing:** Deep-inspection analysis of Git diff patches using **LangChain** and **OpenAI GPT-4o** with strict Pydantic schema enforcement.
* **📊 Comprehensive Security Dashboard:** High-level metrics tracking repository security health, open vulnerabilities, and historical PR grade distributions.
* **🎯 Granular Vulnerability Reports:** Line-by-line identification of bugs, classified by severity (`critical`, `high`, `medium`, `low`) along with code-level fix recommendations.
* **⚡ Decoupled Microservices Infrastructure:** High-throughput Node.js orchestration server backed by a dedicated Python FastAPI service optimized for AI execution.
* **🛡️ Security Grade Rating:** Algorithmic security scoring (`A` through `F`) assigned to every pull request scan.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React 18 + Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Routing:** React Router v6
* **HTTP Client:** Axios (with custom request/response interceptors)

### **Backend Core Service**
* **Runtime:** Node.js (Express)
* **Authentication:** GitHub OAuth 2.0 & JWT (JSON Web Tokens)
* **Middleware:** CORS, Cookie Parser, Custom Auth Guards

### **AI Microservice (`aiServices`)**
* **Framework:** Python 3.10+ / FastAPI
* **Server:** Uvicorn
* **Orchestration:** LangChain / LangGraph
* **Data Validation:** Pydantic v2
* **LLM Engine:** OpenAI GPT-4o / GPT-4o-mini

---

## 🏗️ System Architecture

               ┌───────────────────────┐
               │    React + Vite UI    │
               │   (Port 3000 / 5173)  │
               └───────────┬───────────┘
                           │ HTTP / REST
                           ▼
               ┌───────────────────────┐
               │ Express Core Backend  │
               │      (Port 5000)      │
               └───────────┬───────────┘
                           │ HTTP POST /analyze
                           ▼
               ┌───────────────────────┐
               │ FastAPI AI Microservice│
               │      (Port 8000)      │
               └───────────┴───────────┘

📁 Project Structure

CodeGuide/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── api/            # Axios instance and API service definitions
│   │   ├── components/     # Reusable design system components (Button, Modal, etc.)
│   │   ├── features/       # Feature-driven logic (auth, dashboard, PRs, repos)
│   │   ├── hooks/          # Custom React hooks (useAuth, etc.)
│   │   ├── pages/          # View routes (Dashboard, Repositories, PullRequests)
│   │   └── routes/         # App routing engine and protected routes
│   └── package.json
│
├── backend/                # Node.js + Express Core API
│   ├── src/
│   │   ├── controllers/    # Route controllers (Auth, Repositories, PRs)
│   │   ├── middleware/     # JWT verification & CORS configuration
│   │   ├── routes/         # Express API endpoint definitions
│   │   └── services/       # GitHub API integration & AI service HTTP client
│   └── package.json
│
└── aiServices/             # Python FastAPI Microservice
    ├── venv/               # Isolated Python virtual environment
    ├── .env                # OpenAI API credentials & server configuration
    ├── .gitignore          # Python ignore patterns
    ├── requirements.txt    # Python package manifest
    ├── schemas.py          # Pydantic data schemas (AuditRequest, VulnerabilityIssue)
    ├── analyzer.py         # LangChain workflow and OpenAI prompt engine
    └── main.py             # FastAPI entry point & CORS configuration

    
🚀 Installation & Usage


Prerequisites :- 


Node.js (v18+) & npm

Python (3.10+) & pip

OpenAI API Key

GitHub Developer OAuth App (Client ID & Client Secret)

1. Configure & Run AI Microservice (aiServices)

Bash
cd aiServices

# Create and activate virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env configuration
cat <<EOF> .env
PORT=8000
OPENAI_API_KEY=your_openai_api_key_here
EOF

# Start FastAPI server
python main.py


2. Configure & Run Express Backend (backend)
   
Bash
cd backend

# Install dependencies
npm install

# Create .env configuration
cat <<EOF> .env
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
AI_SERVICE_URL=http://localhost:8000
EOF

# Start backend server
npm run dev

3. Configure & Run Frontend Client (client)
   
Bash
cd client

# Install dependencies
npm install

# Create .env configuration
cat <<EOF> .env
VITE_API_BASE_URL=http://localhost:5000/api/v1
EOF

# Start Vite development server

npm run dev


🎯 Key Engineering Decisions

Polyglot Microservices Strategy: Chosen to leverage Node.js for high-concurrency API proxying, GitHub webhook handling, and user session management, while offloading LLM orchestrations to Python's rich ecosystem (FastAPI, LangChain, Pydantic).

Structured Output Guarantee: Applied Pydantic schemas via LangChain's .with_structured_output() to guarantee reliable, strictly-typed JSON responses from OpenAI models, preventing runtime UI parsing errors.

Decoupled Security Processing: The AI service remains completely stateless, enabling horizontal scaling and independent deployment without impacting core authentication or repository management services.

Bearer Token Authorization Interceptor: Implemented automatic JWT attachment in Axios client request interceptors, standardizing secure communication between the frontend client and the backend APIs.

🧪 Testing

Manual Testing & Verification
Auth Flow Testing:

Trigger GitHub OAuth flow from /login.

Ensure /auth-success extracts JWT correctly and redirects to /dashboard.

Verify token persistence across browser refreshes via custom useAuth hook.

AI Microservice Verification:

Test /analyze payload handling directly using FastAPI OpenAPI docs at http://localhost:8000/docs.

Execute sample raw patches containing intentionally vulnerable code (e.g., SQL injection, hardcoded API keys) to verify detection accuracy.

Frontend Component Validation:

Test dashboard metric calculations (dashboardUtils.js) under zero-data and populated states.

Verify error boundary and fallbacks in UI cards when network errors occur.


🔮 Limitations & Future Updates

Current Limitations
Patch Size Constraints: Extremely large pull request diffs exceeding LLM context windows require truncation before processing.

Language AST Scanning: Relies primarily on diff context without full abstract syntax tree (AST) code graphing across untracked files.

Planned Roadmap
[ ] AST & Vector RAG Pipeline: Integrate Qdrant vector store to enable codebase-wide Context Retrieval Augmented Generation (RAG).

[ ] Automated GitHub PR Comments: Automatically publish security audit summaries directly as comments on GitHub Pull Requests.

[ ] Custom Security Rules Engine: Allow engineering teams to define custom rule parameters and compliance thresholds.

👤 Author

Swayam Jain

Software Developer / Full-Stack AI Engineer

GitHub: https://github.com/Swayam-Jain

Role: Lead Architect & Developer of CodeGuide AI
