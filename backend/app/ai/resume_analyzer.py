def analyze_rezume(resume_text : str):
    skills_found = []
    recommendations = []
    strengths = []
    known_skills = [
        "Python",
        "FastAPI",
        "Docker",
        "TensorFlow",
        "PyTorch",
        "AWS",
        "SQL",
        "LangChain",
        "Machine Learning",
        "Deep Learning",
        "NLP"
    ]

    for skill in known_skills:
        if skill.lower() in resume_text.lower():
            skills_found.append(skill)

    if "Docker" not in skills_found:
        recommendations.append(
                "Learn Docker for deployment workflows"
        )

    if "AWS" not in skills_found:
        recommendations.append(
            "Gain cloud deployment experience"
        )
    

    if len(skills_found)>= 5:
        strengths.append(
        "Strong technical stack detected"
        )

    if "FastAPI" in skills_found:
        strengths.append(
            "Backend API development experience"
        )

    return {
        "skills_found": skills_found,
        "strengths": strengths,
        "recommendations": recommendations
    }


        


