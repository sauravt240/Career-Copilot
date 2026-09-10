import { useState } from "react";
import { Sparkles, RotateCcw, FileText, Briefcase, Zap } from "lucide-react";

interface InputSectionProps {
  jdText: string;
  setJdText: (val: string) => void;
  resumeText: string;
  setResumeText: (val: string) => void;
  onRunPipeline: () => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    title: "Senior Full-Stack Engineer",
    jd: `Role: Senior Full-Stack Engineer — Stripe / FinTech
Location: Remote · San Francisco, CA

We are seeking an experienced Senior Full-Stack Engineer to architect high-throughput APIs and responsive web interfaces for our global payments platform.

Responsibilities:
- Design, develop, and maintain distributed microservices with Python and FastAPI
- Build dynamic, accessible web applications using React, TypeScript, and Tailwind CSS
- Optimize PostgreSQL database schemas, indexing strategies, and query performance
- Ensure end-to-end reliability through automated CI/CD pipelines and Docker containerization
- Mentor junior engineers and lead cross-functional code reviews

Requirements:
- 5+ years of engineering experience delivering scalable distributed systems
- Proven expertise with Python (FastAPI, asyncio) and TypeScript (React, Next.js)
- Solid database design (PostgreSQL) and caching (Redis)
- Experience with AWS, Docker, Kubernetes
- Nice to have: GraphQL, Redis, CI/CD, Kafka`,
    resume: `Alex Chen — Senior Software Engineer
San Francisco, CA · alex.chen@example.com · github.com/alexchen

EXPERIENCE:
Software Engineer | Apex Systems (2022 – Present)
- Designed and built RESTful backend APIs in Python and FastAPI supporting 2M+ daily requests
- Developed responsive customer dashboards in React, TypeScript, and Tailwind CSS
- Refactored PostgreSQL queries, reducing execution time by 28%
- Configured Docker build pipelines and GitHub Actions for continuous delivery

Full-Stack Developer | InnovateTech (2019 – 2022)
- Built internal tooling in React, JavaScript, and Node.js
- Implemented JWT authentication and role-based access control (RBAC)

SKILLS:
Python, TypeScript, React, FastAPI, PostgreSQL, Docker, AWS, Redis, Git, Tailwind CSS`
  },
  {
    title: "AI / ML Engineer",
    jd: `Role: AI / Machine Learning Engineer — DeepMind Applied AI
Location: Hybrid · New York, NY

Join our AI Applications team to bridge frontier LLMs, vector search, and production backend services.

Responsibilities:
- Build low-latency inference pipelines and multi-agent AI orchestration workflows
- Integrate sentence-transformers and vector stores for semantic search
- Deploy FastAPI microservices handling AI inference at scale
- Translate research model prototypes into production software

Requirements:
- 3+ years experience developing Python AI / ML pipelines
- Strong background in PyTorch, sentence-transformers, or Hugging Face
- Experience with FastAPI or Flask for REST APIs
- Hands-on with vector databases and semantic retrieval
- Nice to have: LangChain, FAISS, RAG pipelines`,
    resume: `Taylor Morgan — AI / ML Systems Engineer
New York, NY · taylor.morgan@example.com · github.com/taylorm

EXPERIENCE:
AI Systems Engineer | NeuralFlow AI (2022 – Present)
- Built semantic search service using sentence-transformers and FAISS vector indices
- Deployed asynchronous FastAPI inference microservices handling 500k+ daily embedding requests
- Reduced embedding latency by 35% through batching and model quantization

Backend Engineer | DataSphere (2020 – 2022)
- Maintained Python microservices and PostgreSQL data pipelines
- Developed automated model evaluation scripts with pytest

SKILLS:
Python, PyTorch, Sentence-Transformers, HuggingFace, FastAPI, Docker, PostgreSQL, FAISS, Git`
  }
];

const sectionStyle: React.CSSProperties = {
  width: "100%", maxWidth: 1280, margin: "0 auto",
  padding: "0 24px 60px",
};

export const InputSection: React.FC<InputSectionProps> = ({
  jdText, setJdText, resumeText, setResumeText, onRunPipeline, isLoading,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const applyPreset = (idx: number) => {
    setSelectedPreset(idx);
    setJdText(PRESETS[idx].jd);
    setResumeText(PRESETS[idx].resume);
  };

  const clearAll = () => { setSelectedPreset(null); setJdText(""); setResumeText(""); };

  const isReady = jdText.trim().length >= 20 && resumeText.trim().length >= 20;

  return (
    <div id="pipeline" style={{ ...sectionStyle, scrollMarginTop: 88 }}>

      {/* Quick preset bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
        gap: 12, marginBottom: 20, padding: "14px 20px", borderRadius: 16,
        background: "rgba(12,15,26,0.65)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px -8px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} color="#22d3ee" />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#e2e8f0" }}>
            Quick Load Demo:
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {PRESETS.map((p, idx) => (
            <button
              key={p.title}
              onClick={() => applyPreset(idx)}
              style={{
                padding: "6px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s ease",
                ...(selectedPreset === idx ? {
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                } : {
                  background: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.08)",
                }),
              }}
              onMouseEnter={e => { if (selectedPreset !== idx) { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#e2e8f0"; }}}
              onMouseLeave={e => { if (selectedPreset !== idx) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}}
            >
              <Briefcase size={12} color="#22d3ee" />
              {p.title}
            </button>
          ))}
          {(jdText || resumeText) && (
            <button
              onClick={clearAll}
              style={{
                padding: "6px 12px", borderRadius: 9999, border: "none", cursor: "pointer",
                background: "transparent", fontFamily: "'Inter', sans-serif", fontSize: 12,
                color: "#64748b", display: "flex", alignItems: "center", gap: 4,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f43f5e"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; }}
            >
              <RotateCcw size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Dual input panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="input-grid">
        {[
          {
            label: "Target Job Description",
            icon: <Briefcase size={16} color="#818cf8" />,
            accent: "#6366f1",
            value: jdText,
            setter: setJdText,
            placeholder: "Paste the target job posting here, or select a Quick Demo preset above...",
          },
          {
            label: "Candidate Resume",
            icon: <FileText size={16} color="#22d3ee" />,
            accent: "#22d3ee",
            value: resumeText,
            setter: setResumeText,
            placeholder: "Paste your resume text (work history, skills, projects) here...",
          },
        ].map(panel => (
          <div
            key={panel.label}
            style={{
              borderRadius: 20, padding: "22px",
              background: "rgba(10,13,22,0.75)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px -12px rgba(0,0,0,0.6)",
              display: "flex", flexDirection: "column", gap: 14,
              borderTop: `2px solid ${panel.accent}55`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  padding: "6px", borderRadius: 8,
                  background: `${panel.accent}18`,
                }}>
                  {panel.icon}
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>
                  {panel.label}
                </span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#475569" }}>
                {panel.value.length} chars
              </span>
            </div>
            <textarea
              rows={13}
              value={panel.value}
              onChange={e => panel.setter(e.target.value)}
              placeholder={panel.placeholder}
              className="input-glass"
              style={{
                width: "100%", borderRadius: 12, padding: "14px 16px",
                fontSize: 12.5, lineHeight: 1.75, minHeight: 280,
              }}
            />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onRunPipeline}
          disabled={!isReady || isLoading}
          style={{
            minWidth: 320, padding: "16px 36px", borderRadius: 9999,
            cursor: isReady && !isLoading ? "pointer" : "not-allowed",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 12,
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 13.5,
            letterSpacing: "0.08em", textTransform: "uppercase",
            border: "none", transition: "all 0.25s ease",
            ...(isReady && !isLoading ? {
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)",
              backgroundSize: "200% 200%",
              color: "white",
              boxShadow: "0 8px 40px -8px rgba(99,102,241,0.55), 0 0 0 1px rgba(99,102,241,0.2)",
            } : {
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.06)",
            }),
          }}
          onMouseEnter={e => { if (isReady && !isLoading) { e.currentTarget.style.transform = "translateY(-2px) scale(1.01)"; e.currentTarget.style.boxShadow = "0 16px 50px -8px rgba(99,102,241,0.65), 0 0 0 1px rgba(99,102,241,0.3)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 40px -8px rgba(99,102,241,0.55), 0 0 0 1px rgba(99,102,241,0.2)"; }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.25)",
                borderTopColor: "white",
                animation: "spin 0.8s linear infinite",
              }} />
              <span>Orchestrating 4 Agents...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} color={isReady ? "#c7d2fe" : "currentColor"} />
              <span>Run Career Copilot Pipeline</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        .input-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) { .input-grid { grid-template-columns: 1fr; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
