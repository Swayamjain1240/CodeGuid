Here is a high-quality, professional README.md template specifically tailored for your CodeGuide / GitGuard AI project. It includes badges, project architecture, setup instructions for both Node.js and Python microservices, and clean Markdown formatting.

🛡️ CodeGuide AI — Automated PR Security & Code Audit Platform
An AI-powered automated code review and security auditing platform. CodeGuide AI connects to GitHub via OAuth, monitors Pull Requests, and runs standard static analysis alongside an LLM-powered security audit engine to detect vulnerabilities, secrets, and code smells before code hits production.

✨ Features
🔐 GitHub OAuth Integration: Secure, single-click sign-in and automated repository synchronization.

🤖 Automated AI Code Audits: Analyzes incoming Git diffs using LangChain & GPT-4o to detect security risks and vulnerabilities.

📊 Interactive Dashboard: Overview of pull request security health, open vulnerabilities, and repository metrics.

⚡ Dual-Engine Architecture: Express Node.js core backend paired with a high-performance FastAPI Python microservice.

🎯 Granular Vulnerability Scoring: Severity levels (critical, high, medium, low) with contextual recommendations and line-by-line findings.

🏗️ System Architecture
Plaintext
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
               └───────────────────────┘
📁 Repository Structure
Plaintext
.
├── client/                 # React + Vite Frontend Application
│   ├── src/                # UI Components, Contexts, Hooks & Pages
│   └── package.json
├── backend/                # Node.js + Express Core API Server
│   ├── src/                # Webhook Handlers, Routes & Middleware
│   └── package.json
└── aiServices/             # Python FastAPI + LangChain AI Service
    ├── main.py             # FastAPI Server Entry Point
    ├── analyzer.py         # OpenAI / LangChain Security Engine
    ├── schemas.py          # Pydantic Request/Response Models
    └── requirements.txt    # Python Dependencies
🚀 Getting Started
Prerequisites
Node.js v18+ and npm

Python 3.10+

OpenAI API Key

GitHub OAuth App (Client ID & Secret)

1. Setup Python AI Microservice (aiServices)
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
cat <<EOF > .env
PORT=8000
OPENAI_API_KEY=your_openai_api_key_here
EOF

# Run the FastAPI service
python main.py
2. Setup Express Backend (backend)
Bash
cd backend

# Install dependencies
npm install

# Create .env configuration
cat <<EOF > .env
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
AI_SERVICE_URL=http://localhost:8000
EOF

# Start backend in development mode
npm run dev
3. Setup React Frontend (client)
Bash
cd client

# Install dependencies
npm install

# Create .env configuration
cat <<EOF > .env
VITE_API_BASE_URL=http://localhost:5000/api/v1
EOF

# Start Vite development server
npm run dev
🔌 API Reference
AI Microservice (aiServices)
POST /analyze
Runs an LLM-driven security audit on a Git diff patch.

Request Body:

JSON
{
  "prTitle": "Fix authentication bug",
  "prDescription": "Refactored JWT handling",
  "patch": "diff --git a/server.js b/server.js..."
}
Response:

JSON
{
  "securityGrade": "B",
  "vulnerabilities": [
    {
      "type": "Insecure Secret Storage",
      "severity": "high",
      "file": "server.js",
      "line": 42,
      "description": "Hardcoded secret string detected in authorization middleware.",
      "recommendation": "Use environment variables via process.env for JWT keys."
    }
  ],
  "summary": "Overall good patch, but hardcoded secrets need immediate mitigation."
}
