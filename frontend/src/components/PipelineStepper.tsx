import React, { useEffect, useRef } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import gsap from "gsap";

export type StageStatus = "idle" | "running" | "completed" | "error";

interface StageInfo {
  id: string;
  name: string;
  role: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  status: StageStatus;
  durationMs?: number;
}

interface PipelineStepperProps {
  stages: StageInfo[];
}

const stageColors = {
  idle:      { bg: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.08)", text: "#64748b", icon: "rgba(100,116,139,0.6)" },
  running:   { bg: "rgba(34,211,238,0.06)",  border: "rgba(34,211,238,0.45)",  text: "#67e8f9", icon: "#22d3ee" },
  completed: { bg: "rgba(16,185,129,0.07)",  border: "rgba(16,185,129,0.35)", text: "#6ee7b7", icon: "#10b981" },
  error:     { bg: "rgba(244,63,94,0.07)",   border: "rgba(244,63,94,0.35)",  text: "#fda4af", icon: "#f43f5e" },
};

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ stages }) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    stages.forEach((stage, idx) => {
      const el = refs.current[idx];
      if (el && stage.status === "completed") {
        gsap.fromTo(el, { scale: 0.94, }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
      }
    });
  }, [stages]);

  return (
    <>
      {/* Desktop: Horizontal 4-col */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
      }} className="stepper-desktop">
        {stages.map((stage, idx) => {
          const c = stageColors[stage.status];
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              ref={el => { refs.current[idx] = el; }}
              style={{
                borderRadius: 18, padding: "20px 18px",
                background: c.bg,
                border: `1px solid ${c.border}`,
                boxShadow: stage.status === "running"
                  ? `0 0 24px -6px rgba(34,211,238,0.3), inset 0 0 0 1px rgba(34,211,238,0.08)`
                  : stage.status === "completed"
                  ? "0 4px 20px -8px rgba(16,185,129,0.2)"
                  : "none",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                display: "flex", flexDirection: "column", gap: 14,
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "rgba(100,116,139,0.7)",
                }}>
                  Agent 0{idx + 1}
                </span>

                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: stage.status === "idle" ? "rgba(255,255,255,0.04)" : `${c.bg}`,
                  border: `1px solid ${c.border}`,
                }}>
                  {stage.status === "completed" && <Check size={13} color="#10b981" strokeWidth={3} />}
                  {stage.status === "running" && (
                    <div style={{ animation: "spin 1s linear infinite", display: "flex" }}>
                      <Loader2 size={13} color="#22d3ee" />
                    </div>
                  )}
                  {stage.status === "error" && <AlertCircle size={13} color="#f43f5e" />}
                  {stage.status === "idle" && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#475569" }}>{idx + 1}</span>
                  )}
                </div>
              </div>

              {/* Icon + Title */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  padding: "8px", borderRadius: 10, flexShrink: 0,
                  background: stage.status === "idle" ? "rgba(255,255,255,0.04)" : `rgba(${stage.status === "completed" ? "16,185,129" : stage.status === "running" ? "34,211,238" : "244,63,94"},0.12)`,
                }}>
                  <Icon size={18} color={c.icon} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
                    color: stage.status === "idle" ? "#94a3b8" : "#f1f5f9",
                    lineHeight: 1.3,
                  }}>
                    {stage.name}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#64748b", marginTop: 2, lineHeight: 1.4 }}>
                    {stage.role}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: c.text, textTransform: "capitalize" }}>
                  {stage.status === "running" ? "Executing..." : stage.status}
                </span>
                {stage.durationMs && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#22d3ee" }}>
                    {stage.durationMs}ms
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertical list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="stepper-mobile">
        {stages.map((stage) => {
          const c = stageColors[stage.status];
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              style={{
                borderRadius: 14, padding: "14px 16px",
                background: c.bg, border: `1px solid ${c.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  padding: "7px", borderRadius: 9,
                  background: `rgba(${stage.status === "completed" ? "16,185,129" : stage.status === "running" ? "34,211,238" : "255,255,255"},0.1)`,
                }}>
                  <Icon size={17} color={c.icon} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13.5, color: stage.status === "idle" ? "#94a3b8" : "#f1f5f9" }}>
                    {stage.name}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#64748b" }}>{stage.role}</div>
                </div>
              </div>
              <div>
                {stage.status === "completed" && <Check size={16} color="#10b981" strokeWidth={3} />}
                {stage.status === "running" && <div style={{ animation: "spin 1s linear infinite", display: "flex" }}><Loader2 size={16} color="#22d3ee" /></div>}
                {stage.status === "idle" && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#475569" }}>Pending</span>}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .stepper-mobile { display: none; }
        @media (max-width: 1023px) {
          .stepper-desktop { display: none !important; }
          .stepper-mobile  { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};
