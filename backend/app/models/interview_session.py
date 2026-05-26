from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Text

from app.db.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_session"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    question = Column(Text)
    answer = Column(Text)
    evaluation = Column(Text)
    score = Column(Integer)
    interview_type = Column(String)
    difficulty = Column(String)