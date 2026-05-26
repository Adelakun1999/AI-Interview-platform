from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.ai.interview_generator import generate_interview_questions
from app.models.users import User
from app.utils.dependencies import get_current_user
from app.models.resume import Resume






router = APIRouter()

@router.post("/generate/{resume_id}")
def generate_questions(
    resume_id : int ,
    interview_type : str,
    difficulty : str,
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)

):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code = 404,
            detail = "Resume not found"
        )
    
    questions = generate_interview_questions(
        resume_text= resume.extracted_text,
        interview_type = interview_type,
        difficulty = difficulty
    )

    return {
        "resume_id" : resume.id,
        "interview_type" : interview_type,
        "difficulty" : difficulty,
        "questions" : questions
    }