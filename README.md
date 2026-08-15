# 🛡️ CodeGuide AI — Automated PR Security & Code Audit Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/AI_Microservice-FastAPI_%2B_LangChain-3776AB?logo=python)](https://fastapi.tiangolo.com/)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI_GPT--4o-412991?logo=openai)](https://openai.com/)

An intelligent code analysis and security auditing platform designed to protect your repository before code reaches production. **CodeGuide AI** integrates seamlessly with GitHub OAuth to monitor Pull Requests, running incoming Git diffs through an LLM-powered engine using **LangChain** and **GPT-4o** to detect vulnerabilities, hardcoded secrets, injection risks, and code smells.

---

## ✨ Key Features

* **🔐 GitHub OAuth Integration:** One-click authentication with automated repository synchronization.
* **🤖 AI-Driven Pull Request Audits:** Deep security inspection of Git diff patches using LangChain and OpenAI structured outputs.
* **📊 Security Health Dashboard:** Real-time visibility into PR audit statuses, security grades, and active vulnerability metrics.
* **⚡ Decoupled Microservice Architecture:** Node.js/Express core backend paired with a high-performance Python FastAPI service dedicated to AI processing.
* **🎯 Actionable Vulnerability Reporting:** Structured reports including security grades (`A` through `F`), severity rankings (`critical`, `high`, `medium`, `low`), line numbers, and concrete remediation steps.

---

## 🏗️ System Architecture

```text
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
📁 Project Structure

CodeGuide/
├── client/                 # React 18 + Vite frontend interface
│   ├── src/                # Components, pages, hooks, and contexts
│   └── package.json
├── backend/                # Node.js + Express API server
│   ├── src/                # Controllers, routes, auth, and webhook handlers
│   └── package.json
└── aiServices/             # Python FastAPI + LangChain microservice
    ├── main.py             # FastAPI entry point & API endpoints
    ├── analyzer.py         # OpenAI & LangChain processing engine
    ├── schemas.py          # Pydantic data structures
    └── requirements.txt    # Python dependencies







               ┌───────────────────────┐
               │ FastAPI AI Microservice│
               │      (Port 8000)      │
               └───────────┴───────────┘📁 Project Structure
