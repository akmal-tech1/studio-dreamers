"""Auth router: register, login, and current-user profile."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import auth as auth_service
from database import get_db
from models import User
from schemas import Token, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(name=payload.name, email=payload.email, password_hash=auth_service.hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return Token(access_token=auth_service.create_access_token({"sub": str(user.id)}), user=user)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not auth_service.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return Token(access_token=auth_service.create_access_token({"sub": str(user.id)}), user=user)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(auth_service.get_current_user)):
    return user_out(current_user)


def user_out(user: User) -> UserOut:
    return UserOut(id=user.id, name=user.name, email=user.email)
