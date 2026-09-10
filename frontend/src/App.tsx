import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { FileText, Target, Edit3, MessageSquare, Cpu, CheckCircle } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { InputSection } from "./components/InputSection";
import { PipelineStepper } from "./components/PipelineStepper";
import type { StageStatus } from "./components/PipelineStepper";
import { ResultsView } from "./components/ResultsView";
import { HistoryModal } from "./components/HistoryModal";
import { api } from "./api";
import type { PipelineRun } from "./types";

export default function App() {
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineRun, setPipelineRun] = useState<PipelineRun | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [stages, setStages] = useState([
    { id: "jd_analysis",    name: "JD Analysis Agent",    role: "Parses requirements, seniority & keywords", icon: FileText,    status: "idle" as StageStatus, durationMs: undefined as number | undefined },
    { id: "resume_matching",name: "Resume Matching Agent", role: "Semantic embeddings & gap analysis",        icon: Target,      status: "idle" as StageStatus, durationMs: undefined as number | undefined },
    { id: "resume_tailoring",name: "Resume Tailoring Agent",role: "Elevates bullets without hallucination",  icon: Edit3,       status: "idle" as StageStatus, durationMs: undefined as number | undefined },
    { id: "interview_prep", name: "Interview Prep Agent",  role: "Technical & behavioral talking points",    icon: MessageSquare,status:"idle" as StageStatus, durationMs: undefined as number | undefined },
  ]);

  const lenisRef = useRef<Lenis | null>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenisRef.current = lenis;
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    const id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -70 });
  };

  const handleRunPipeline = async () => {
    if (!jdText.trim() || !resumeText.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setPipelineRun(null);
    setStages(prev => prev.map(s => ({ ...s, status: "idle", durationMs: undefined })));
    if (stepperRef.current && lenisRef.current) lenisRef.current.scrollTo(stepperRef.current, { offset: -80 });

    setStages(prev => [{ ...prev[0], status: "running" }, prev[1], prev[2], prev[3]]);

    try {
      const runPromise = api.runPipeline(jdText, resumeText);
      setTimeout(() => setStages(prev => [{ ...prev[0], status: "completed" }, { ...prev[1], status: "running" }, prev[2], prev[3]]), 450);
      setTimeout(() => setStages(prev => [prev[0], { ...prev[1], status: "completed" }, { ...prev[2], status: "running" }, prev[3]]), 850);
      setTimeout(() => setStages(prev => [prev[0], prev[1], { ...prev[2], status: "completed" }, { ...prev[3], status: "running" }]), 1250);

      const result = await runPromise;
      const t = result.stage_times || {};
      setStages(prev => [
        { ...prev[0], status: "completed", durationMs: t["jd_analysis"] || 120 },
        { ...prev[1], status: "completed", durationMs: t["resume_matching"] || 210 },
        { ...prev[2], status: "completed", durationMs: t["resume_tailoring"] || 340 },
        { ...prev[3], status: "completed", durationMs: t["interview_prep"] || 280 },
      ]);
      setPipelineRun(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Pipeline failed. Ensure the FastAPI backend is running on port 8000.");
      setStages(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" } : s));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryRun = (run: PipelineRun) => {
    setPipelineRun(run);
    setJdText(run.jd_text || "");
    setResumeText(run.resume_text || "");
    setStages(prev => prev.map(s => ({ ...s, status: "completed", durationMs: run.stage_times?.[s.id] || 250 })));
    if (stepperRef.current && lenisRef.current) lenisRef.current.scrollTo(stepperRef.current, { offset: -80 });
  };

  // How it works steps config
  const steps = [
    { n: "01", title: "JD Analysis Agent", desc: "Extracts role title, seniority tier, non-negotiable skills, nice-to-haves, and ATS keywords into a strict Pydantic JSON schema.", color: "#6366f1", glow: "rgba(99,102,241,0.25)" },
    { n: "02", title: "Resume Matching Agent", desc: "Computes cosine semantic similarity with sentence-transformers embeddings to score candidate alignment, matched skills, and gap areas.", color: "#10b981", glow: "rgba(16,185,129,0.2)" },
    { n: "03", title: "Resume Tailoring Agent", desc: "Rewrites weak bullets using the Google X-Y-Z formula (action + metric + impact) — grounded in real experience, no hallucination.", color: "#a855f7", glow: "rgba(168,85,247,0.2)" },
    { n: "04", title: "Interview Prep Agent", desc: "Generates realistic technical and STAR behavioral questions, equipping you with talking points anchored in your actual projects.", color: "#22d3ee", glow: "rgba(34,211,238,0.2)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#08090f", color: "#e2e8f0", overflowX: "hidden", position: "relative" }}>
      {/* Global grid overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <Navbar onOpenHistory={() => setHistoryOpen(true)} onGetStarted={() => scrollTo("#pipeline")} />

      <Hero onStartPipeline={() => scrollTo("#pipeline")} onHowItWorks={() => scrollTo("#how-it-works")} isProcessing={isLoading} />

      {/* Input Section */}
      <InputSection
        jdText={jdText} setJdText={setJdText}
        resumeText={resumeText} setResumeText={setResumeText}
        onRunPipeline={handleRunPipeline} isLoading={isLoading}
      />

      {/* Pipeline Stepper */}
      <div ref={stepperRef} style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 24px 48px", scrollMarginTop: 88 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Cpu size={16} color="#22d3ee" />
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13,
              textTransform: "uppercase", letterSpacing: "0.12em", color: "#94a3b8",
            }}>
              Multi-Agent Execution Pipeline
            </span>
          </div>
          {pipelineRun && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#10b981" }}>
              <CheckCircle size={13} /> Complete
            </span>
          )}
        </div>
        <PipelineStepper stages={stages} />
      </div>

      {/* Error */}
      {errorMessage && (
        <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 24px 24px" }}>
          <div style={{
            padding: "16px 20px", borderRadius: 14,
            background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)",
            fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#fda4af",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#64748b", textDecoration: "underline" }}
            >Dismiss</button>
          </div>
        </div>
      )}

      {/* Results */}
      {pipelineRun && <ResultsView runData={pipelineRun} />}

      {/* How It Works */}
      <section id="how-it-works" style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "60px 24px 80px", scrollMarginTop: 88 }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 52px" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.18em", color: "#22d3ee",
          }}>
            Autonomous Architecture
          </span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            fontSize: "clamp(28px, 4vw, 40px)", color: "white",
            letterSpacing: "-0.025em", marginTop: 8,
          }}>
            How Career Copilot Works
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#64748b", marginTop: 12, lineHeight: 1.7 }}>
            Four specialized agents coordinated by the ARIA Orchestrator pass structured JSON across a validated pipeline, persisting every run's state to SQLite.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="steps-grid">
          {steps.map(step => (
            <div
              key={step.n}
              style={{
                padding: "24px 20px", borderRadius: 20,
                background: "rgba(10,13,22,0.75)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: `2px solid ${step.color}60`,
                boxShadow: "0 8px 32px -12px rgba(0,0,0,0.5)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 50px -12px ${step.glow}`;
                e.currentTarget.style.borderColor = `${step.color}55`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 8px 32px -12px rgba(0,0,0,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: 18,
                background: `${step.color}18`,
                border: `1px solid ${step.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 15, color: step.color,
              }}>
                {step.n}
              </div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15.5, color: "#f1f5f9", marginBottom: 8 }}>
                {step.title}
              </h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "32px 24px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#475569" }}>
            © 2026 Career Copilot · Multi-Agent AI Job-Search Orchestration
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[
              { label: "Copilot Pipeline", href: "#pipeline" },
              { label: "How It Works", href: "#how-it-works" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#475569", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={e => e.currentTarget.style.color = "#475569"}
              >{l.label}</a>
            ))}
            <button
              onClick={() => setHistoryOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#475569", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >Past Runs</button>
          </div>
        </div>
      </footer>

      <HistoryModal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onSelectRun={handleSelectHistoryRun} />

      <style>{`
        .steps-grid { grid-template-columns: repeat(4,1fr); }
        @media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .steps-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
