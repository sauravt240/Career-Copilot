import React, { useState } from "react";
import { Sparkles, History, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenHistory: () => void;
  onGetStarted: () => void;
}

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(8,10,15,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)",
            padding: 1.5, boxShadow: "0 0 24px rgba(99,102,241,0.35)",
          }}>
            <div style={{
              width: "100%", height: "100%", background: "#0d111e", borderRadius: 10.5,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={18} color="#67e8f9" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em",
              background: "linear-gradient(90deg, #ffffff 30%, #67e8f9 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Career<span style={{
                background: "linear-gradient(90deg, #818cf8, #22d3ee)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Copilot</span>
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
              letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(148,163,184,0.55)",
              marginTop: -2,
            }}>
              Multi-Agent AI
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
          {[
            { label: "Pipeline Agents", href: "#pipeline" },
            { label: "How It Works", href: "#how-it-works" },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
              color: "rgba(203,213,225,0.8)", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(203,213,225,0.8)")}
            >
              {link.label}
            </a>
          ))}
          <button onClick={onOpenHistory} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
            color: "rgba(203,213,225,0.8)", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a5b4fc")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(203,213,225,0.8)")}
          >
            <History size={15} />
            Past Runs
          </button>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
            color: "rgba(203,213,225,0.8)", textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(203,213,225,0.8)")}
          >
            <GithubIcon size={15} />
            GitHub
          </a>
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onGetStarted}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 9999, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee)",
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12,
              letterSpacing: "0.08em", textTransform: "uppercase", color: "white",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(99,102,241,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; }}
          >
            Start Copilot
            <ArrowRight size={14} />
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none", flexDirection: "column", gap: 5.5,
              alignItems: "center", justifyContent: "center",
              width: 40, height: 40, background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, cursor: "pointer",
            }}
            className="hamburger-btn"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 18, height: 1.5, background: "white", borderRadius: 2,
                transition: "transform 0.25s, opacity 0.25s",
                transform: mobileMenuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 1 ? "scaleX(0)"
                  : "rotate(-45deg) translate(5px, -5px)"
                  : "none",
                opacity: mobileMenuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", inset: 0, top: 72,
          background: "rgba(8,10,15,0.97)", backdropFilter: "blur(24px)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 32, borderTop: "1px solid rgba(255,255,255,0.08)",
          zIndex: 49,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {["Pipeline Agents", "How It Works"].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28,
                  color: "#e2e8f0", textDecoration: "none",
                }}
              >{label}</a>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); onOpenHistory(); }}
              style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28, color: "#e2e8f0",
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <History size={26} /> Past Runs
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28,
                color: "#e2e8f0", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <GithubIcon size={26} /> GitHub
            </a>
          </div>
          <button
            onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
            style={{
              width: "100%", padding: "18px", borderRadius: 14, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee)",
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 14,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "white",
              boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
            }}
          >
            Start Pipeline Run
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};
