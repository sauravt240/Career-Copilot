# Career Copilot 🚀

**Career Copilot** is a full-stack, multi-agent AI system that automates the end-to-end job search workflow: analyzing job descriptions, computing semantic vector match scores with gap analysis, tailoring resume bullet points without experience fabrication, and generating grounded interview prep talking points.

All stages are orchestrated in real time by a central autonomous agent and persisted in SQLite.

---

## 🏛️ Architecture Overview

The system is decomposed into 4 specialized single-purpose agent modules coordinated by an **Orchestrator Agent**:

```
                  ┌─────────────────────────────────────┐
                  │          User Input (JD + Resume)   │
                  └──────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │      ARIA Orchestrator Agent    │
                    └────────────────┬────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│  01. JD Analysis  │       │ 02. Resume Match  │       │03. Resume Tailor  │
│      Agent        │──────▶│      Agent        │──────▶│      Agent        │
│ • Roles & Seniority│       │ • Semantic Cosine │       │ • Google X-Y-Z    │
│ • Required Skills │       │ • Match Score     │       │ • No Hallucinated │
│ • ATS Keywords    │       │ • Skill Gaps      │       │   Experience      │
└───────────────────┘       └───────────────────┘       └─────────┬─────────┘
                                                                  │
                                                                  ▼
                                                        ┌───────────────────┐
                                                        │ 04. Interview Prep│
                                                        │      Agent        │
                                                        │ • Technical Qs    │
                                                        │ • Behavioral STAR │
                                                        │ • Talking Points  │
                                                        └───────────────────┘
                                                                  │
                                    ┌─────────────────────────────┘
                                    ▼
                         ┌────────────────────┐
                         │   SQLite Database  │
                         │ (Runs & Timelines) │
                         └────────────────────┘
```

1. **JD Analysis Agent (`backend/agents/jd_agent.py`)**  
   Extracts role titles, seniority tier, non-negotiable required skills, nice-to-haves, key duties, and ATS keywords.
2. **Resume Matching Agent (`backend/agents/matching_agent.py`)**  
   Uses `sentence-transformers` vector embeddings and cosine similarity to evaluate semantic candidate alignment, matched skills, and gap areas.
3. **Resume Tailoring Agent (`backend/agents/tailor_agent.py`)**  
   Transforms weak bullet points into high-impact metrics using the Google X-Y-Z formula (*"Accomplished [X] measured by [Y] by doing [Z]"*) without fabricating non-existent experience.
4. **Interview Prep Agent (`backend/agents/interview_agent.py`)**  
   Constructs realistic technical and behavioral interview questions with talking points strictly grounded in the candidate's actual projects.
5. **Orchestrator Agent (`backend/agents/orchestrator.py`)**  
   Coordinates execution order, captures performance timelines, handles fallbacks, and persists runs to SQLite.

---

## 💻 Tech Stack

- **Backend:** Python 3.12, FastAPI, SQLite, Pydantic, sentence-transformers, PyTorch, scikit-learn, HTTPX.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, GSAP, Lenis (smooth scroll), Lucide icons.
- **AI / LLM Integration:** Abstracted multi-provider client supporting **Google Gemini**, **OpenAI**, and **Anthropic Claude**, plus an intelligent local heuristic engine for zero-friction testing without requiring immediate API keys.

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend

# (Optional) Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy environment template and add your API keys
cp ../.env.example .env

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
Backend will be available at: `http://127.0.0.1:8000` (API docs at `/docs`).

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be live at: `http://localhost:5173`.

---

## 🎯 Key Features

- **Interactive ARIA Entity:** Cursor-reactive orchestrator entity tracking mouse velocity and delta with smooth settling and gradient shifts.
- **Typewriter Headline:** Custom `useTypewriter` hook with `step-end` blinking cursor.
- **Live Pipeline Stepper:** GSAP-animated horizontal and vertical progress indicators showing agent status, execution times, and transitions.
- **Glassmorphism Results Cards:** Collapsible panels with before/after bullet comparison, single-click copy buttons, and candidate talking points.
- **One-Click Presets:** Instant loading of realistic Full-Stack and AI/ML job descriptions and candidate resumes.
- **Persistent Run History:** Past pipeline runs saved in SQLite with instant reload capabilities.
