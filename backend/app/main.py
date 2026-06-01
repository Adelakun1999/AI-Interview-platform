from fastapi import FastAPI
from app.db.database import engine , Base
from app.models.users import User
from app.models.resume import Resume
from app.models.interview_session import InterviewSession
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.resume import router as resume_router
from app.routes.interview import router as interview_router
from app.routes.analytics import router as analytics_router
from fastapi.middleware.cors import CORSMiddleware



Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
         "http://localhost:3000",
          "https://your-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

app.include_router(
   analytics_router,
   prefix="/analytics",
   tags=["Analytics"]
)

@app.get("/")
def home():
   return {"message" : "AI Interview Platfrom API"}