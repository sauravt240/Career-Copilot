import sys
import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import init_db, get_all_runs, get_run_by_id
from agents.jd_agent import analyze_job_description
from agents.matching_agent import match_resume_to_jd
from agents.tailor_agent import tailor_resume
from agents.interview_agent import generate_interview_prep
from agents.orchestrator import Orchestrator
from llm_client import get_active_provider

init_db()

app = FastAPI(
    title="Career Copilot API",
    description="Multi-agent AI system orchestrating job-search workflows end-to-end",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class JDAnalysisRequest(BaseModel):
    jd_text: str = Field(..., min_length=10, description="Job description text")

class MatchResumeRequest(BaseModel):
    jd_analysis: Dict[str, Any] = Field(..., description="Structured output from JD Analysis Agent")
    resume_text: str = Field(..., min_length=10, description="Resume text")

class TailorResumeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text")
    jd_analysis: Dict[str, Any] = Field(..., description="Structured output from JD Analysis Agent")
    gap_analysis: Dict[str, Any] = Field(..., description="Gap analysis from Resume Matching Agent")

class InterviewPrepRequest(BaseModel):
    jd_analysis: Dict[str, Any] = Field(..., description="Structured output from JD Analysis Agent")
    resume_text: str = Field(..., min_length=10, description="Resume text")

class RunPipelineRequest(BaseModel):
    jd_text: str = Field(..., min_length=10, description="Full job description")
    resume_text: str = Field(..., min_length=10, description="Candidate resume text")

# Endpoints
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Career Copilot API",
        "active_llm_provider": get_active_provider()
    }

@app.post("/analyze-jd")
def endpoint_analyze_jd(req: JDAnalysisRequest):
    try:
        return analyze_job_description(req.jd_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-resume")
def endpoint_match_resume(req: MatchResumeRequest):
    try:
        return match_resume_to_jd(req.jd_analysis, req.resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tailor-resume")
def endpoint_tailor_resume(req: TailorResumeRequest):
    try:
        return tailor_resume(req.resume_text, req.jd_analysis, req.gap_analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview-prep")
def endpoint_interview_prep(req: InterviewPrepRequest):
    try:
        return generate_interview_prep(req.jd_analysis, req.resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-pipeline")
def endpoint_run_pipeline(req: RunPipelineRequest):
    try:
        result = Orchestrator.run(req.jd_text, req.resume_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")

@app.get("/history")
def endpoint_get_history():
    try:
        return get_all_runs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{run_id}")
def endpoint_get_run(run_id: str):
    run = get_run_by_id(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
