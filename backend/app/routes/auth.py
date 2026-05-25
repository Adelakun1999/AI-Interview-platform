from fastapi import APIRouter , Depends , HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.schemas.user import UserCreate , Token, UserLogin
from app.db.session import get_db
from app.models.users import User 
from app.utils.security import hash_password , verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register_user(
    user : UserCreate,
    db : Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400 , detail = "Email already registered")
    
    hashed_password = hash_password(user.password)

    new_user = User(
        name = user.name,
        email = user.email,
        password = hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message" : "User created succesfully"
    }

@router.post("/login", response_model=Token)
def login_user(
    form_data : OAuth2PasswordRequestForm= Depends(),
    db : Session = Depends(get_db)
):
    
    existing_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail= "Invalid email or password"
        )
    
    valid_password = verify_password(
        form_data.password,
        existing_user.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail= "Invalid "
        )
    
    access_token = create_access_token(
        data = {"sub" : existing_user.email}
    )

    return {
        "access_token" : access_token,
        "token_type" : "bearer"
    }



