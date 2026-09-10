import React, { useEffect, useRef } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { AriaEntity } from "./AriaEntity";
import { Play, BookOpen } from "lucide-react";
import gsap from "gsap";

interface HeroProps {
  onStartPipeline: () => void;
  onHowItWorks: () => void;
  isProcessing: boolean;
}

const GithubIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const Hero: React.FC<HeroProps> = ({ onStartPipeline, onHowItWorks, isProcessing }) => {
  const headline = "Meet your AI job-search copilot. Paste a JD, get a tailored application in seconds.";
  const { displayedText, isComplete } = useTypewriter(headline, 28, 500);

  const pillsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, { opacity: 0, y: 20, duration: 1, ease: "power3.out", delay: 0.1 });
      gsap.from(subtitleRef.current, { opacity: 0, y: 15, duration: 0.9, ease: "power3.out", delay: 0.2 });
      if (pillsRef.current?.children) {
        gsap.from(Array.from(pillsRef.current.children), {
          opacity: 0, y: 24, duration: 0.8, stagger: 0.13, ease: "power3.out", delay: 0.4,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      padding: "80px 24px 40px", overflow: "hidden", textAlign: "center",
    }}>
      {/* Background decorative orbs */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translate(-50%, -50%)",
        width: 700, height: 500,
        background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.12) 45%, transparent 75%)",
        borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "10%",
        width: 400, height: 350,
        background: "radial-gradient(ellipse, rgba(34,211,238,0.14) 0%, rgba(99,102,241,0.06) 55%, transparent 80%)",
        borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "5%",
        width: 300, height: 250,
        background: "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ maxWidth: 900, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 28, position: "relative", zIndex: 1 }}>

        {/* ARIA Badge */}
        <div ref={badgeRef}>
          <AriaEntity isProcessing={isProcessing} />
        </div>

        {/* Blurred intro label */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(148,163,184,0.7)",
          filter: "blur(0.7px)",
          textShadow: "0 0 16px rgba(99,102,241,0.5)",
          userSelect: "none",
        }}>
          [ MULTI-AGENT AUTONOMOUS RECRUITING PIPELINE ]
        </p>

        {/* Typewriter Headline */}
        <div style={{ minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2rem, 5.5vw, 3.6rem)",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            color: "#ffffff",
            maxWidth: 860,
          }}>
            {displayedText}
            {!isComplete && (
              <span style={{
                display: "inline-block", width: 3, height: "0.85em",
                background: "linear-gradient(180deg, #818cf8, #22d3ee)",
                marginLeft: 6, verticalAlign: "middle",
                animation: "cursor-blink 0.85s step-end infinite",
                borderRadius: 2,
              }} />
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(15px, 2vw, 18px)",
          color: "rgba(148,163,184,0.85)",
          lineHeight: 1.75, maxWidth: 640,
          fontWeight: 400,
        }}>
          Four coordinated specialized agents extract requirements, compute semantic
          match scores, elevate resume bullets with zero hallucination, and draft
          grounded interview responses — orchestrated in real time.
        </p>

        {/* Action Pills */}
        <div ref={pillsRef} style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", paddingTop: 8 }}>
          <button onClick={onStartPipeline} className="action-pill">
            <Play size={14} style={{ fill: "currentColor" }} />
            Start a pipeline run
          </button>

          <button onClick={onHowItWorks} className="action-pill">
            <BookOpen size={14} />
            See how it works
          </button>

          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="action-pill">
            <GithubIcon />
            View on GitHub
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#94a3b8", textTransform: "uppercase" }}>
            Scroll to try
          </span>
          <div style={{
            width: 1, height: 48,
            background: "linear-gradient(to bottom, rgba(99,102,241,0.6), transparent)",
          }} />
        </div>
      </div>
    </section>
  );
};
