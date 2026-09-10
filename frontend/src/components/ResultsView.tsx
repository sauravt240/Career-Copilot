import { useState } from "react";
import {
  ChevronDown, ChevronUp, CheckCircle2, AlertCircle,
  Copy, Check, Award, Sparkles, FileCheck, MessageSquare,
  ArrowRight, Layers, HelpCircle, Briefcase,
} from "lucide-react";
import type { PipelineRun } from "../types";

interface ResultsViewProps { runData: PipelineRun; }

const glass: React.CSSProperties = {
  background: "rgba(10,13,22,0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 8px 40px -16px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.03)",
};

const sectionWrap: React.CSSProperties = {
  width: "100%", maxWidth: 1280, margin: "0 auto",
  padding: "0 24px 64px", display: "flex", flexDirection: "column", gap: 20,
};

const cardHeader = (isOpen: boolean, accent: string, label: string, title: string, icon: React.ReactNode): React.ReactNode => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px", cursor: "pointer",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ padding: "8px", borderRadius: 10, background: `${accent}18` }}>{icon}</div>
      <div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.14em", color: accent,
        }}>{label}</span>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17,
          color: "#f1f5f9", marginTop: 2,
        }}>{title}</h3>
      </div>
    </div>
    {isOpen
      ? <ChevronUp size={18} color="#64748b" />
      : <ChevronDown size={18} color="#64748b" />}
  </div>
);

export const ResultsView: React.FC<ResultsViewProps> = ({ runData }) => {
  const [open, setOpen] = useState({ jd: true, match: true, tailor: true, interview: true });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggle = (k: keyof typeof open) => setOpen(prev => ({ ...prev, [k]: !prev[k] }));

  const copyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const { jd_analysis: jd, match_result: match, tailored_resume: tailor, interview_prep: interview } = runData;
  const score = match?.match_score ?? 0;

  return (
    <div style={sectionWrap}>

      {/* ─── Summary Banner ─── */}
      <div style={{
        ...glass, borderRadius: 22,
        borderLeft: "3px solid #6366f1",
        padding: "24px 28px",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)",
            padding: 1.5, boxShadow: "0 0 30px rgba(99,102,241,0.4)",
          }}>
            <div style={{ width: "100%", height: "100%", background: "#0d111e", borderRadius: 14.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={28} color="#c7d2fe" />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#22d3ee" }}>
                Pipeline Complete
              </span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: "clamp(22px, 3vw, 32px)", color: "white", letterSpacing: "-0.02em",
            }}>
              {jd?.role_title || runData.role_title || "Target Role"}
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#64748b", marginTop: 2 }}>
              ID: {runData.id.slice(0, 14)}... · Seniority: {jd?.seniority_level || "Standard"}
            </p>
          </div>
        </div>

        {/* Score */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderRadius: 16,
          background: "rgba(5,7,14,0.8)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b" }}>
              Semantic Match
            </span>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 44, lineHeight: 1,
              background: "linear-gradient(135deg, #67e8f9, #818cf8, #6ee7b7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {score}%
            </div>
          </div>
          {/* SVG ring */}
          <svg width={56} height={56} viewBox="0 0 56 56">
            <circle cx={28} cy={28} r={24} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
            <circle
              cx={28} cy={28} r={24} fill="none"
              stroke={score >= 70 ? "#10b981" : score >= 50 ? "#6366f1" : "#f59e0b"}
              strokeWidth={4} strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 150.8} 150.8`}
              transform="rotate(-90 28 28)"
              style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.34,1.56,0.64,1)" }}
            />
          </svg>
        </div>
      </div>

      {/* ─── CARD 1: JD Analysis ─── */}
      {jd && (
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden", borderTop: "2px solid rgba(99,102,241,0.55)" }}>
          <div onClick={() => toggle("jd")}>
            {cardHeader(open.jd, "#818cf8", "Stage 01 · JD Analysis Agent", "Job Description Requirements & Keywords",
              <Briefcase size={18} color="#818cf8" />)}
          </div>
          {open.jd && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 20, marginTop: 4 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 10 }}>
                  Required Skills ({jd.required_skills.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {jd.required_skills.map(s => <span key={s} className="skill-required">{s}</span>)}
                </div>
              </div>
              {jd.nice_to_have_skills?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 10 }}>
                    Nice-to-Have Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {jd.nice_to_have_skills.map(s => <span key={s} className="skill-nicetohave">{s}</span>)}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 10 }}>
                  Key Responsibilities
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 0, listStyle: "none" }}>
                  {jd.key_responsibilities.map((r, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", marginTop: 7, flexShrink: 0 }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              {jd.keywords?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 10 }}>
                    ATS Keywords
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {jd.keywords.map(k => (
                      <span key={k} style={{
                        padding: "3px 9px", borderRadius: 6,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                        background: "rgba(255,255,255,0.04)", color: "#64748b",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}>#{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── CARD 2: Resume Match ─── */}
      {match && (
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden", borderTop: "2px solid rgba(16,185,129,0.55)" }}>
          <div onClick={() => toggle("match")}>
            {cardHeader(open.match, "#6ee7b7", "Stage 02 · Semantic Vector Matching", "Match Score & Gap Analysis",
              <Layers size={18} color="#6ee7b7" />)}
          </div>
          {open.match && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                padding: "16px", borderRadius: 12,
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
                fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, fontWeight: 500,
              }}>
                {match.semantic_summary}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="match-grid">
                <div style={{ padding: 16, borderRadius: 12, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6ee7b7" }}>
                      Matched ({match.matched_skills.length})
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {match.matched_skills.map(s => <span key={s} className="skill-matched">✓ {s}</span>)}
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <AlertCircle size={14} color="#f59e0b" />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fcd34d" }}>
                      Gap Areas ({match.missing_skills.length})
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {match.missing_skills.length > 0
                      ? match.missing_skills.map(s => <span key={s} className="skill-missing">+ {s}</span>)
                      : <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#64748b" }}>No critical gaps!</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="match-grid">
                {[
                  { label: "Core Strengths", items: match.strengths, color: "#10b981" },
                  { label: "Growth Areas", items: match.growth_areas, color: "#f59e0b" },
                ].map(col => (
                  <div key={col.label}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 8 }}>
                      {col.label}
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                      {col.items.map((s, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>
                          <span style={{ color: col.color, flexShrink: 0 }}>●</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── CARD 3: Tailoring ─── */}
      {tailor && (
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden", borderTop: "2px solid rgba(168,85,247,0.55)" }}>
          <div onClick={() => toggle("tailor")}>
            {cardHeader(open.tailor, "#d8b4fe", "Stage 03 · Bullet Point Tailoring", "Elevated Experience Bullets (Zero Hallucination)",
              <FileCheck size={18} color="#d8b4fe" />)}
          </div>
          {open.tailor && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4, display: "flex", flexDirection: "column", gap: 20 }}>
              {tailor.tailored_summary && (
                <div style={{
                  padding: "16px", borderRadius: 12,
                  background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a5b4fc", display: "block", marginBottom: 6 }}>
                    Optimized Professional Summary
                  </span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.7 }}>
                    {tailor.tailored_summary}
                  </p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b" }}>
                  Bullet Point Transformations ({tailor.bullet_improvements.length})
                </span>
                {tailor.bullet_improvements.map((b, idx) => (
                  <div key={idx} style={{
                    padding: "18px 20px", borderRadius: 14,
                    background: "rgba(5,7,14,0.8)", border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    <div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", color: "#475569", letterSpacing: "0.1em" }}>
                        Original:
                      </span>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#64748b", marginTop: 4, textDecoration: "line-through", textDecorationColor: "rgba(244,63,94,0.4)" }}>
                        {b.original}
                      </p>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", color: "#6ee7b7", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 5 }}>
                          <Sparkles size={12} color="#6ee7b7" /> Google X-Y-Z Impact:
                        </span>
                        <button
                          onClick={() => copyBullet(b.improved, idx)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 7,
                            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                            cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 11.5,
                            color: copiedIdx === idx ? "#6ee7b7" : "#94a3b8",
                            transition: "all 0.2s",
                          }}
                        >
                          {copiedIdx === idx ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, lineHeight: 1.65,
                        color: "#d1fae5",
                        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)",
                        padding: "12px 14px", borderRadius: 10,
                      }}>
                        {b.improved}
                      </p>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#64748b", fontStyle: "italic", lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 600, color: "#94a3b8" }}>Why this works: </span>{b.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── CARD 4: Interview Prep ─── */}
      {interview && (
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden", borderTop: "2px solid rgba(34,211,238,0.55)" }}>
          <div onClick={() => toggle("interview")}>
            {cardHeader(open.interview, "#67e8f9", "Stage 04 · Interview Preparation", "Technical & Behavioral Talking Points",
              <MessageSquare size={18} color="#67e8f9" />)}
          </div>
          {open.interview && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4, display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { label: "Technical Architecture Questions", items: interview.technical_questions, color: "#67e8f9", pointColor: "#22d3ee" },
                { label: "Behavioral & Leadership Scenarios", items: interview.behavioral_questions, color: "#c4b5fd", pointColor: "#a855f7" },
              ].map(group => (
                <div key={group.label}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: group.color, marginBottom: 12, fontWeight: 600 }}>
                    {group.label} ({group.items.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {group.items.map((q, idx) => (
                      <div key={idx} style={{
                        padding: "16px 18px", borderRadius: 14,
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                        display: "flex", flexDirection: "column", gap: 10,
                      }}>
                        <h5 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14.5, color: "#f1f5f9" }}>
                          Q{idx + 1}: {q.question}
                        </h5>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>{q.context}</p>
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 10 }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: group.pointColor, display: "block", marginBottom: 8 }}>
                            Grounded Talking Points:
                          </span>
                          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                            {q.talking_points.map((tp, ti) => (
                              <li key={ti} style={{ display: "flex", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>
                                <ArrowRight size={13} color={group.pointColor} style={{ flexShrink: 0, marginTop: 2 }} />
                                {tp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {interview.company_targeted_questions?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 10 }}>
                    Questions to Ask the Team
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {interview.company_targeted_questions.map((q, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, padding: "10px 14px", borderRadius: 10,
                        background: "rgba(255,255,255,0.02)", fontFamily: "'Inter', sans-serif",
                        fontSize: 13, color: "#94a3b8", lineHeight: 1.5,
                      }}>
                        <HelpCircle size={14} color="#22d3ee" style={{ flexShrink: 0, marginTop: 2 }} />
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        .match-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) { .match-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};
