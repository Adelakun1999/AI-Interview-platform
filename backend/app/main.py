from fastapi import FastAPI
from app.db.database import engine , Base
from app.models.users import User
from app.models.resume import Resume
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.resume import router as resume_router
from app.routes.interview import router as interview_router



Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(
   auth_router,
   prefix="/auth",
   tags = ['Authentication']
)

app.include_router(
   user_router,
   prefix="/user",
   tags=["Users"]
)

app.include_router(
   resume_router,
   prefix="/resume",
   tags=["Resumes"]
)

app.include_router(
   interview_router,
   prefix="/interview",
   tags=["Interview"]
)

@app.get("/")
def home():
   return {"message" : "AI Interview Platfrom API"}