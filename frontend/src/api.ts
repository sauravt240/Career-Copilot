import type { PipelineRun, RunHistoryItem, JDAnalysis, MatchResult, TailoredResume, InterviewPrep } from "./types";

const API_BASE = "http://127.0.0.1:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API error at ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => request<{ status: string; active_llm_provider: string }>("/health"),

  analyzeJD: (jd_text: string) =>
    request<JDAnalysis>("/analyze-jd", {
      method: "POST",
      body: JSON.stringify({ jd_text }),
    }),

  matchResume: (jd_analysis: JDAnalysis, resume_text: string) =>
    request<MatchResult>("/match-resume", {
      method: "POST",
      body: JSON.stringify({ jd_analysis, resume_text }),
    }),

  tailorResume: (resume_text: string, jd_analysis: JDAnalysis, gap_analysis: MatchResult) =>
    request<TailoredResume>("/tailor-resume", {
      method: "POST",
      body: JSON.stringify({ resume_text, jd_analysis, gap_analysis }),
    }),

  interviewPrep: (jd_analysis: JDAnalysis, resume_text: string) =>
    request<InterviewPrep>("/interview-prep", {
      method: "POST",
      body: JSON.stringify({ jd_analysis, resume_text }),
    }),

  runPipeline: (jd_text: string, resume_text: string) =>
    request<PipelineRun>("/run-pipeline", {
      method: "POST",
      body: JSON.stringify({ jd_text, resume_text }),
    }),

  getHistory: () => request<RunHistoryItem[]>("/history"),

  getRunById: (run_id: string) => request<PipelineRun>(`/history/${run_id}`),
};
