from typing import Dict, Any, List
from pydantic import BaseModel, Field
from llm_client import call_llm

class InterviewQuestion(BaseModel):
    question: str = Field(..., description="The interview question")
    context: str = Field(..., description="Why an interviewer for this role asks this")
    talking_points: List[str] = Field(default_factory=list, description="Talking points grounded in candidate's actual projects/experience")

class InterviewPrepResult(BaseModel):
    technical_questions: List[InterviewQuestion] = Field(default_factory=list)
    behavioral_questions: List[InterviewQuestion] = Field(default_factory=list)
    company_targeted_questions: List[str] = Field(default_factory=list, description="Smart reverse-interview questions for the candidate to ask")

def generate_interview_prep(
    jd_analysis: Dict[str, Any],
    resume_text: str
) -> Dict[str, Any]:
    """
    Agent 4: Interview Prep Agent
    Generates likely interview questions (technical and behavioral) based on the JD
    and candidate's resume, plus talking points grounded in actual resume projects.
    """
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    system_prompt = (
        "You are the Interview Prep Agent in Career Copilot. "
        "Generate realistic, challenging technical and behavioral interview questions tailored to the provided JD "
        "and candidate resume. For each question, provide 3 crisp, highly persuasive talking points grounded directly "
        "in the candidate's actual projects, technologies, and achievements. Also include thoughtful reverse-interview questions. "
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        '  "technical_questions": [\n'
        '    {\n'
        '      "question": string,\n'
        '      "context": string,\n'
        '      "talking_points": [string]\n'
        '    }\n'
        '  ],\n'
        '  "behavioral_questions": [\n'
        '    {\n'
        '      "question": string,\n'
        '      "context": string,\n'
        '      "talking_points": [string]\n'
        '    }\n'
        '  ],\n'
        '  "company_targeted_questions": [string]\n'
        "}"
    )

    user_prompt = (
        f"Target Job: {jd_analysis.get('role_title', 'Role')} ({jd_analysis.get('seniority_level', 'Mid')})\n"
        f"Key Responsibilities: {'; '.join(jd_analysis.get('key_responsibilities', []))}\n"
        f"Target Skills: {', '.join(jd_analysis.get('required_skills', []))}\n\n"
        f"Candidate Resume Experience:\n{resume_text.strip()}"
    )

    result = call_llm(system_prompt, user_prompt)
    validated = InterviewPrepResult(
        technical_questions=[
            InterviewQuestion(**q) for q in result.get("technical_questions", [])
        ],
        behavioral_questions=[
            InterviewQuestion(**q) for q in result.get("behavioral_questions", [])
        ],
        company_targeted_questions=result.get("company_targeted_questions", [])
    )
    return validated.model_dump()
