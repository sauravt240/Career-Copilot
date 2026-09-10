export interface JDAnalysis {
  role_title: string;
  seniority_level: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  key_responsibilities: string[];
  keywords: string[];
}

export interface MatchResult {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  growth_areas: string[];
  semantic_summary: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  rationale: string;
}

export interface TailoredResume {
  tailored_summary: string;
  bullet_improvements: BulletImprovement[];
  tailored_skills_section: string[];
  alignment_notes: string;
}

export interface InterviewQuestion {
  question: string;
  context: string;
  talking_points: string[];
}

export interface InterviewPrep {
  technical_questions: InterviewQuestion[];
  behavioral_questions: InterviewQuestion[];
  company_targeted_questions: string[];
}

export interface TimelineEvent {
  stage: string;
  status: string;
  duration_ms: number;
  timestamp: string;
}

export interface PipelineRun {
  id: string;
  created_at: string;
  role_title?: string;
  match_score?: number;
  jd_text: string;
  resume_text: string;
  jd_analysis?: JDAnalysis;
  match_result?: MatchResult;
  tailored_resume?: TailoredResume;
  interview_prep?: InterviewPrep;
  status: 'completed' | 'failed' | 'in_progress';
  error?: string | null;
  timeline?: TimelineEvent[];
  stage_times?: Record<string, number>;
}

export interface RunHistoryItem {
  id: string;
  created_at: string;
  role_title: string;
  match_score: number;
  status: string;
  error?: string | null;
}
