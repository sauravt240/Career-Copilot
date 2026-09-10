from typing import Dict, Any, List
from pydantic import BaseModel, Field
from llm_client import call_llm

class JDAnalysisResult(BaseModel):
    role_title: str = Field(..., description="Job role title extracted from the JD")
    seniority_level: str = Field(..., description="Seniority level (Entry, Mid, Senior, Lead, Staff)")
    required_skills: List[str] = Field(default_factory=list, description="Non-negotiable required technical skills")
    nice_to_have_skills: List[str] = Field(default_factory=list, description="Bonus or preferred skills")
    key_responsibilities: List[str] = Field(default_factory=list, description="Key duties and core expectations")
    keywords: List[str] = Field(default_factory=list, description="Important ATS keywords found in the JD")

def analyze_job_description(jd_text: str) -> Dict[str, Any]:
    """
    Agent 1: JD Analysis Agent
    Parses an uploaded or pasted job description and extracts structured requirements.
    """
    if not jd_text or not jd_text.strip():
        raise ValueError("Job description cannot be empty.")

    system_prompt = (
        "You are the JD Analysis Agent in Career Copilot. "
        "Analyze the provided job description and extract structured data accurately in JSON format. "
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        '  "role_title": string,\n'
        '  "seniority_level": string,\n'
        '  "required_skills": [string],\n'
        '  "nice_to_have_skills": [string],\n'
        '  "key_responsibilities": [string],\n'
        '  "keywords": [string]\n'
        "}"
    )

    user_prompt = f"Here is the job description:\n\n{jd_text.strip()}"
    
    result = call_llm(system_prompt, user_prompt)
    # Ensure fallbacks if any fields were omitted
    validated = JDAnalysisResult(
        role_title=result.get("role_title", "Software Engineer"),
        seniority_level=result.get("seniority_level", "Mid-Level"),
        required_skills=result.get("required_skills", []),
        nice_to_have_skills=result.get("nice_to_have_skills", []),
        key_responsibilities=result.get("key_responsibilities", []),
        keywords=result.get("keywords", [])
    )
    return validated.model_dump()
