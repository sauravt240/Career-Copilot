from typing import Dict, Any, List
from pydantic import BaseModel, Field
from llm_client import call_llm

class BulletImprovement(BaseModel):
    original: str = Field(..., description="Original bullet point from resume")
    improved: str = Field(..., description="Tailored bullet point with strong action verb, metric, and JD alignment")
    rationale: str = Field(..., description="Why this edit enhances the candidate's alignment without fabricating facts")

class TailoredResumeResult(BaseModel):
    tailored_summary: str = Field(..., description="Targeted professional summary")
    bullet_improvements: List[BulletImprovement] = Field(default_factory=list)
    tailored_skills_section: List[str] = Field(default_factory=list)
    alignment_notes: str = Field(..., description="Strategic advice on how the resume was repositioned")

def tailor_resume(
    resume_text: str,
    jd_analysis: Dict[str, Any],
    gap_analysis: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Agent 3: Resume Tailoring Agent
    Rewrites and refines key resume bullet points using the JD analysis and gap analysis
    to better align with JD requirements without fabricating experience.
    """
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    system_prompt = (
        "You are the Resume Tailoring Agent in Career Copilot. "
        "Your task is to reposition and elevate the candidate's resume to align with the target job description "
        "WITHOUT fabricating skills, dates, companies, or accomplishments. "
        "Identify weak, generic bullet points and rewrite them using the Google X-Y-Z formula: "
        "'Accomplished [X] as measured by [Y], by doing [Z]'. Emphasize keywords identified in the gap analysis. "
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        '  "tailored_summary": string,\n'
        '  "bullet_improvements": [\n'
        '    {\n'
        '      "original": string,\n'
        '      "improved": string,\n'
        '      "rationale": string\n'
        '    }\n'
        '  ],\n'
        '  "tailored_skills_section": [string],\n'
        '  "alignment_notes": string\n'
        "}"
    )

    user_prompt = (
        f"Target Role: {jd_analysis.get('role_title', 'Target Role')} ({jd_analysis.get('seniority_level', 'Mid')})\n"
        f"Required Skills: {', '.join(jd_analysis.get('required_skills', []))}\n"
        f"Missing Skills to Highlight if genuine: {', '.join(gap_analysis.get('missing_skills', []))}\n\n"
        f"Candidate's Current Resume:\n{resume_text.strip()}"
    )

    result = call_llm(system_prompt, user_prompt)
    validated = TailoredResumeResult(
        tailored_summary=result.get("tailored_summary", "Experienced engineer with a focus on scalable systems."),
        bullet_improvements=[
            BulletImprovement(**b) for b in result.get("bullet_improvements", [])
        ],
        tailored_skills_section=result.get("tailored_skills_section", []),
        alignment_notes=result.get("alignment_notes", "Highlighted core technical competencies and metric-driven results.")
    )
    return validated.model_dump()
