import re
from typing import Dict, Any, List
from pydantic import BaseModel, Field

try:
    from sentence_transformers import SentenceTransformer, util
    _st_model = None
    def _get_st_model():
        global _st_model
        if _st_model is None:
            _st_model = SentenceTransformer("all-MiniLM-L6-v2")
        return _st_model
except Exception:
    _st_model = None

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except Exception:
    TfidfVectorizer = None
    cosine_similarity = None

class MatchResult(BaseModel):
    match_score: float = Field(..., description="Overall match percentage (0-100)")
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    growth_areas: List[str] = Field(default_factory=list)
    semantic_summary: str = Field(..., description="High-level narrative of the candidate fit")

def _compute_semantic_similarity(text_a: str, text_b: str) -> float:
    """Computes cosine similarity between two texts (0.0 to 1.0)."""
    # 1. Try sentence-transformers if available
    try:
        model = _get_st_model()
        if model is not None:
            embeddings = model.encode([text_a, text_b], convert_to_tensor=True)
            sim = util.cos_sim(embeddings[0], embeddings[1]).item()
            return max(0.0, min(1.0, float(sim)))
    except Exception:
        pass

    # 2. Fallback to scikit-learn TF-IDF ngram cosine similarity
    try:
        if TfidfVectorizer and cosine_similarity:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
            tfidf_matrix = vectorizer.fit_transform([text_a, text_b])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return max(0.0, min(1.0, float(sim)))
    except Exception:
        pass

    # 3. Basic jaccard token overlap fallback
    tokens_a = set(re.findall(r"\w+", text_a.lower()))
    tokens_b = set(re.findall(r"\w+", text_b.lower()))
    if not tokens_a or not tokens_b:
        return 0.5
    return len(tokens_a.intersection(tokens_b)) / len(tokens_a.union(tokens_b))

def match_resume_to_jd(jd_analysis: Dict[str, Any], resume_text: str) -> Dict[str, Any]:
    """
    Agent 2: Resume Matching Agent
    Compares the resume against the JD's extracted requirements using semantic embeddings,
    producing a match score (0-100) and gap analysis.
    """
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    resume_lower = resume_text.lower()
    
    required_skills = jd_analysis.get("required_skills", [])
    nice_skills = jd_analysis.get("nice_to_have_skills", [])
    keywords = jd_analysis.get("keywords", [])
    all_target_skills = list(set(required_skills + nice_skills + keywords))

    matched_skills = []
    missing_skills = []

    for skill in all_target_skills:
        # Check direct or word boundary occurrence
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, resume_lower) or skill.lower() in resume_lower:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Compute semantic similarity on the overall content
    jd_summary = (
        f"{jd_analysis.get('role_title', '')} "
        f"{' '.join(required_skills)} "
        f"{' '.join(jd_analysis.get('key_responsibilities', []))}"
    )
    semantic_sim = _compute_semantic_similarity(jd_summary, resume_text)

    # Skill coverage ratio
    total_skills = len(all_target_skills)
    skill_score = (len(matched_skills) / total_skills) if total_skills > 0 else 0.7

    # Weighted aggregate match score: 55% skill coverage + 45% semantic context
    raw_score = (skill_score * 0.55) + (semantic_sim * 0.45)
    # Normalize to a realistic 0-100 score, typically scaled smoothly
    normalized_score = round(min(98.0, max(25.0, raw_score * 100)), 1)

    # Generate strengths and growth areas
    strengths = []
    if matched_skills:
        strengths.append(f"Strong alignment in core technologies: {', '.join(matched_skills[:4])}")
    if semantic_sim > 0.4:
        strengths.append("Project scope and architectural focus closely matches the target team's responsibilities")
    if not strengths:
        strengths.append("Foundational technical experience aligned with software delivery principles")

    growth_areas = []
    if missing_skills:
        growth_areas.append(f"Missing direct keywords for: {', '.join(missing_skills[:4])}")
    if len(matched_skills) < len(required_skills):
        growth_areas.append("Highlight more concrete production metrics for non-negotiable JD requirements")
    if not growth_areas:
        growth_areas.append("Ensure specific business impact metrics are highlighted across older work history")

    fit_tier = "exceptional" if normalized_score >= 80 else ("strong" if normalized_score >= 65 else "moderate")
    summary = (
        f"Candidate exhibits a {fit_tier} match ({normalized_score}%) for {jd_analysis.get('role_title', 'the role')}. "
        f"Successfully demonstrates {len(matched_skills)} of {total_skills} target skills with notable technical overlap."
    )

    result = MatchResult(
        match_score=normalized_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        strengths=strengths,
        growth_areas=growth_areas,
        semantic_summary=summary
    )
    return result.model_dump()
