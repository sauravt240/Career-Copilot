import React, { useEffect, useState } from "react";
import { X, History, ArrowUpRight, Clock, Award, AlertCircle } from "lucide-react";
import { api } from "../api";
import type { RunHistoryItem, PipelineRun } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRun: (run: PipelineRun) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectRun }) => {
  const [items, setItems] = useState<RunHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      api.getHistory()
        .then(setItems)
        .catch(e => setError(e.message))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleSelect = async (id: string) => {
    setLoadingId(id);
    try {
      const run = await api.getRunById(id);
      onSelectRun(run);
      onClose();
    } catch (e: any) {
      alert(`Failed to load: ${e.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: "100%", maxWidth: 660,
        background: "rgba(10,13,22,0.96)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 24px 80px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)",
        borderRadius: 24, overflow: "hidden",
        display: "flex", flexDirection: "column", maxHeight: "82vh",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: "8px", borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <History size={18} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>
                Pipeline Run History
              </h3>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Persisted in SQLite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748b", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f1f5f9"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#64748b"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {isLoading && (
            <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "2.5px solid rgba(99,102,241,0.3)", borderTopColor: "#818cf8",
                animation: "spin 1s linear infinite",
              }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Querying SQLite...
              </span>
            </div>
          )}

          {error && (
            <div style={{
              padding: "14px 16px", borderRadius: 12,
              background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)",
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#fda4af",
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {!isLoading && !error && items.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#475569" }}>
              No pipeline runs recorded yet. Run your first copilot!
            </div>
          )}

          {items.map(item => (
            <div
              key={item.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                padding: "14px 16px", borderRadius: 14,
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>
                    {item.role_title || "Run"}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    padding: "2px 8px", borderRadius: 9999,
                    background: item.status === "completed" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
                    color: item.status === "completed" ? "#6ee7b7" : "#fda4af",
                    border: `1px solid ${item.status === "completed" ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`,
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#64748b" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} /> {new Date(item.created_at).toLocaleString()}
                  </span>
                  <span>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#22d3ee" }}>
                    <Award size={11} /> {item.match_score}% match
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelect(item.id)}
                disabled={loadingId === item.id}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, color: "#94a3b8",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                {loadingId === item.id
                  ? <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} />
                  : <><span>Load</span><ArrowUpRight size={13} /></>}
              </button>
            </div>
          ))}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};
