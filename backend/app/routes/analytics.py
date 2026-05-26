from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session 
from sqlalchemy import func
from app.db.session import get_db
from app.models.users import User
from app.models.interview_session import InterviewSession
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.get("/performance")
def get_performance_analytics(
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).all()

    total_sessions = len(sessions)
    if total_sessions == 0:
        return {
            "message" : "No interview sessions found",
        }
    
    average_score = db.query(func.avg(InterviewSession.score)).filter(
        InterviewSession.user_id == current_user.id
    ).scalar()

    highest_score = db.query(func.max(InterviewSession.score)).filter(
        InterviewSession.user_id == current_user.id
    ).scalar()
    lowest_score = db.query(func.min(InterviewSession.score)).filter(
        InterviewSession.user_id == current_user.id
    ).scalar()

    return {
        "total_sessions" : total_sessions,
        "average_score" : round(average_score,2),
        "highest_score" : highest_score,
        "lowest_score" : lowest_score
    }