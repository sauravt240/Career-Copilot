import time
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from agents.jd_agent import analyze_job_description
from agents.matching_agent import match_resume_to_jd
from agents.tailor_agent import tailor_resume
from agents.interview_agent import generate_interview_prep
from database import save_run, get_run_by_id, get_all_runs

class Orchestrator:
    """
    Coordinates the 4 AI agent modules in sequence, manages state passing,
    records execution timelines, and persists results to SQLite.
    """

    @staticmethod
    def run(jd_text: str, resume_text: str) -> Dict[str, Any]:
        run_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()
        
        timeline = []
        stage_times = {}

        def record_stage(stage_name: str, duration_ms: float, status: str = "success"):
            timeline.append({
                "stage": stage_name,
                "status": status,
                "duration_ms": round(duration_ms, 1),
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
            stage_times[stage_name] = round(duration_ms, 1)

        run_record = {
            "id": run_id,
            "created_at": created_at,
            "jd_text": jd_text,
            "resume_text": resume_text,
            "status": "in_progress",
            "error": None
        }

        try:
            # Stage 1: JD Analysis Agent
            t0 = time.time()
            jd_analysis = analyze_job_description(jd_text)
            record_stage("jd_analysis", (time.time() - t0) * 1000)
            run_record["jd_analysis"] = jd_analysis
            run_record["role_title"] = jd_analysis.get("role_title", "Target Role")

            # Stage 2: Resume Matching Agent
            t0 = time.time()
            match_result = match_resume_to_jd(jd_analysis, resume_text)
            record_stage("resume_matching", (time.time() - t0) * 1000)
            run_record["match_result"] = match_result
            run_record["match_score"] = match_result.get("match_score", 0.0)

            # Stage 3: Resume Tailoring Agent
            t0 = time.time()
            tailored_resume = tailor_resume(resume_text, jd_analysis, match_result)
            record_stage("resume_tailoring", (time.time() - t0) * 1000)
            run_record["tailored_resume"] = tailored_resume

            # Stage 4: Interview Prep Agent
            t0 = time.time()
            interview_prep = generate_interview_prep(jd_analysis, resume_text)
            record_stage("interview_prep", (time.time() - t0) * 1000)
            run_record["interview_prep"] = interview_prep

            run_record["status"] = "completed"
            run_record["timeline"] = timeline
            run_record["stage_times"] = stage_times

            # Persist to SQLite
            save_run(run_record)
            return run_record

        except Exception as exc:
            run_record["status"] = "failed"
            run_record["error"] = str(exc)
            save_run(run_record)
            raise exc
