import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.orchestrator import Orchestrator
from database import get_all_runs, get_run_by_id

sample_jd = """
We are seeking a Senior Full-Stack Engineer with strong expertise in Python, FastAPI, React, and TypeScript.
You will architect high-throughput APIs, lead migration to microservices, and build responsive web applications with Tailwind CSS.
Requirements:
- 5+ years building distributed web applications
- Strong proficiency in Python, FastAPI, and asynchronous programming
- Expertise in React, TypeScript, and modern state management
- Hands-on experience with Docker, PostgreSQL, and AWS
- Nice to have: GraphQL, Redis, CI/CD pipelines
"""

sample_resume = """
Jane Doe - Software Engineer
Experience:
- Software Engineer at TechCorp (2021-Present)
  - Developed REST APIs in Python and FastAPI for core payment services
  - Built customer-facing dashboard interfaces in React and TypeScript
  - Worked with PostgreSQL databases and managed schema migrations
  - Containerized applications using Docker for cloud deployment
- Junior Developer at StartUpCo (2019-2021)
  - Created internal tooling using JavaScript and Node.js
  - Collaborated in Agile sprints and code reviews
Skills: Python, FastAPI, React, JavaScript, TypeScript, PostgreSQL, Docker, Git, REST APIs
"""

print("Running Orchestrator pipeline test...")
result = Orchestrator.run(sample_jd, sample_resume)
print("Pipeline run ID:", result["id"])
print("Role Title:", result["role_title"])
print("Match Score:", result["match_score"])
print("JD Analysis Skills:", result["jd_analysis"]["required_skills"])
print("Tailored bullets count:", len(result["tailored_resume"]["bullet_improvements"]))
print("Interview questions count:", len(result["interview_prep"]["technical_questions"]))

# Verify SQLite persistence
runs = get_all_runs()
print(f"Total persisted runs in SQLite: {len(runs)}")
retrieved = get_run_by_id(result["id"])
assert retrieved is not None, "Failed to retrieve saved run from SQLite!"
print("All backend tests PASSED successfully!")
