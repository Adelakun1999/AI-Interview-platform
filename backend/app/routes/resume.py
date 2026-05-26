from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

import os
import pdfplumber

from app.db.session import get_db
from app.utils.dependencies import get_current_user
from app.models.users import User
from app.models.resume import Resume
from app.ai.resume_analyzer import analyze_rezume
from app.ai.llm_resume_analyzer import llm_resume_analysis

router = APIRouter()

@router.post("/upload")
def upload_resume(
    file : UploadFile = File(...),
    db : Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    try :

    
        if not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )
        
        uploads_dir = "uploads"
        os.makedirs(uploads_dir, exist_ok=True)

        file_path = os.path.join(
            uploads_dir,
            file.filename
        )

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        extracted_text = ""

        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()

                if text : 
                    extracted_text += text + "\n"

        new_resume = Resume(
            user_id = current_user.id,
            file_name = file.filename,
            extracted_text = extracted_text
        )
        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        return new_resume
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the file: {str(e)}"
        )


@router.get("/resume")
def get_user_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume_info = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).first()

    return resume_info


@router.get("/analyze/{resume_id}")
def analyze_uploaded_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail= "Resume not found"
        )
    
    analysis = analyze_rezume(
        resume_text = resume.extracted_text
    )

    return {
        "resume_id" : resume.id,
        "analysis" : analysis
    }

@router.get("/llm-analysis/{resume_id}")
def llm_analyze_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail = "Resume not found"
        )
    
    analysis = llm_resume_analysis(
        resume.extracted_text
    )

    return {
        "resume_id": resume.id,
        "llm_analysis": analysis
    }
