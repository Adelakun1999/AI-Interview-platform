from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.ai.interview_generator import generate_interview_questions
from app.models.users import User
from app.models.interview_session import InterviewSession
from app.utils.dependencies import get_current_user
from app.models.resume import Resume
from app.ai.answer_evaluator import evaluate_answer
import re 






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

@router.post("/evaluate")
def evaluate_interview_answer(
    question : str,
    answer : str,
    interview_type : str ,
    difficulty : str,
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    evaluation = evaluate_answer(
        question , answer
    )

    score_match = re.search(
        r"Score:\s*(\d+)/10",
        evaluation
    )

    score = int(score_match.group(1)) if score_match else 0

    session = InterviewSession(
        user_id = current_user.id ,
        question = question ,
        answer = answer ,
        evaluation = evaluation,
        score = score ,
        interview_type = interview_type,
        difficulty = difficulty

    )


    db.add(session)

    db.commit()
    db.refresh(session)

    return {
        "score" : score,
        "evaluation" : evaluation,
        "session_id" : session.id
    }