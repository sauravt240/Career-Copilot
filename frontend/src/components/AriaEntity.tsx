import React, { useEffect, useRef, useState } from "react";

interface AriaEntityProps {
  statusText?: string;
  isProcessing?: boolean;
}

export const AriaEntity: React.FC<AriaEntityProps> = ({
  statusText = "ARIA Orchestrator Online",
  isProcessing = false,
}) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const targetOffsetRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);
  const isTickingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const [displayStatus, setDisplayStatus] = useState(statusText);

  useEffect(() => {
    setDisplayStatus(isProcessing ? "Running Multi-Agent Pipeline..." : statusText);
  }, [statusText, isProcessing]);

  useEffect(() => {
    const SENSITIVITY = 0.8;
    const MAX_ROT = 38;
    const MAX_OFF = 26;

    const tick = () => {
      currentRotationRef.current += (targetRotationRef.current - currentRotationRef.current) * 0.09;
      currentOffsetRef.current += (targetOffsetRef.current - currentOffsetRef.current) * 0.09;

      if (orbRef.current) {
        const rot = currentRotationRef.current;
        const off = currentOffsetRef.current;
        const gx = 50 + rot * 0.7;
        const gy = 50 - off * 0.5;
        orbRef.current.style.transform = `translate3d(${off}px,${off * 0.2}px,0) rotate(${rot}deg)`;
        orbRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, #818cf8 0%, #a78bfa 30%, #22d3ee 65%, #0f172a 100%)`;
      }

      targetRotationRef.current *= 0.95;
      targetOffsetRef.current *= 0.95;

      const settled =
        Math.abs(targetRotationRef.current) < 0.05 &&
        Math.abs(targetOffsetRef.current) < 0.05 &&
        Math.abs(currentRotationRef.current - targetRotationRef.current) < 0.01;

      if (!settled || isProcessing) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        isTickingRef.current = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const cx = e.clientX;
      if (prevXRef.current === null) { prevXRef.current = cx; return; }
      const delta = cx - prevXRef.current;
      prevXRef.current = cx;
      const n = (delta / window.innerWidth) * SENSITIVITY;
      targetRotationRef.current = Math.max(-MAX_ROT, Math.min(MAX_ROT, targetRotationRef.current + n * 230));
      targetOffsetRef.current = Math.max(-MAX_OFF, Math.min(MAX_OFF, targetOffsetRef.current + n * 155));
      if (!isTickingRef.current) { isTickingRef.current = true; rafIdRef.current = requestAnimationFrame(tick); }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isProcessing]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 18px",
        borderRadius: "9999px",
        background: "rgba(10, 13, 22, 0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.25)",
        boxShadow: "0 4px 24px -8px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* ARIA Orb */}
      <div style={{ position: "relative", width: 36, height: 36 }}>
        {/* Glow aura */}
        <div
          style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: isProcessing
              ? "radial-gradient(circle, rgba(99,102,241,0.5), rgba(34,211,238,0.3), transparent)"
              : "radial-gradient(circle, rgba(99,102,241,0.3), transparent)",
            filter: "blur(8px)",
            animation: isProcessing ? "pulse-slow 2s ease-in-out infinite" : undefined,
          }}
        />
        {/* Dynamic orb */}
        <div
          ref={orbRef}
          style={{
            position: "relative",
            width: 36, height: 36,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.25)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 50% 50%, #818cf8, #a78bfa 35%, #22d3ee 75%, #0f172a)",
            cursor: "default",
          }}
        >
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)",
          }} />
        </div>
      </div>

      {/* Label */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11,
            letterSpacing: "0.15em", textTransform: "uppercase",
            background: "linear-gradient(90deg, #a5b4fc, #67e8f9)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            ARIA
          </span>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: isProcessing ? "#f59e0b" : "#10b981",
            boxShadow: isProcessing ? "0 0 8px #f59e0b" : "0 0 8px #10b981",
            animation: isProcessing ? "pulse-slow 1s ease-in-out infinite" : undefined,
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(148,163,184,0.6)" }}>v1.4</span>
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
          {displayStatus}
        </span>
      </div>
    </div>
  );
};
