# ==================== routers/auth.py ====================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, UserLogin, Token, ProfileUpdate, UserResponse
from crud import create_user, get_user_by_email
from auth import verify_password, create_access_token, get_current_user, get_password_hash  # Use auth.py functions
from models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = create_user(db, user)
        access_token = create_access_token(data={"sub": db_user.email})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": db_user
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_data.email)
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Check if email is already taken by another user
        if profile_data.email and profile_data.email != current_user.email:
            existing_user = db.query(User).filter(
                User.email == profile_data.email,
                User.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

        # Update user fields
        update_data = profile_data.dict(exclude_unset=True, exclude_none=True)
        
        # Handle password update
        if update_data.get('current_password') and update_data.get('new_password'):
            # Verify current password
            if not verify_password(update_data['current_password'], current_user.password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is incorrect"
                )
            
            # Update password
            current_user.password = get_password_hash(update_data['new_password'])
            # Remove password fields from update data
            update_data.pop('current_password')
            update_data.pop('new_password')
            update_data.pop('confirm_password', None)

        # Update other fields
        for field, value in update_data.items():
            if hasattr(current_user, field) and field not in ['current_password', 'confirm_password']:
                setattr(current_user, field, value)

        db.commit()
        db.refresh(current_user)
        return current_user

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )