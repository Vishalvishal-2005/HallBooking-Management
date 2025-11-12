# ==================== crud.py ====================
from sqlalchemy.orm import Session
from models import User, Hall, Booking, BookingStatusEnum, RoleEnum
from schemas import UserCreate, HallCreate, BookingCreate
from auth import get_password_hash
from datetime import datetime
from fastapi import HTTPException


# User CRUD
def create_user(db: Session, user: UserCreate):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)  # Use the correct function
    db_user = User(
        email=user.email,
        password=hashed_password,  # Store hashed password
        full_name=user.full_name,
        phone=user.phone,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Add this missing function
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Hall CRUD
def create_hall(db: Session, hall: HallCreate, owner_id: int):
    db_hall = Hall(**hall.dict(), owner_id=owner_id)
    db.add(db_hall)
    db.commit()
    db.refresh(db_hall)
    return db_hall

def get_halls(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Hall).offset(skip).limit(limit).all()

def get_hall(db: Session, hall_id: int):
    return db.query(Hall).filter(Hall.id == hall_id).first()

def get_owner_halls(db: Session, owner_id: int):
    return db.query(Hall).filter(Hall.owner_id == owner_id).all()

def update_hall(db: Session, hall_id: int, hall_data: dict, owner_id: int = None):
    db_hall = get_hall(db, hall_id)
    if not db_hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    
    # Check if user owns the hall (if owner_id is provided)
    if owner_id and db_hall.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this hall")
    
    for key, value in hall_data.items():
        setattr(db_hall, key, value)
    
    db.commit()
    db.refresh(db_hall)
    return db_hall

def delete_hall(db: Session, hall_id: int, owner_id: int = None):
    db_hall = get_hall(db, hall_id)
    if not db_hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    
    # Check if user owns the hall (if owner_id is provided)
    if owner_id and db_hall.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this hall")
    
    db.delete(db_hall)
    db.commit()
    return {"message": "Hall deleted successfully"}

# Booking CRUD
def create_booking(db: Session, booking: BookingCreate, user_id: int):
    # Check if hall exists
    hall = get_hall(db, booking.hall_id)
    if not hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    
    # Check for overlapping bookings
    overlapping = db.query(Booking).filter(
        Booking.hall_id == booking.hall_id,
        Booking.status.in_([BookingStatusEnum.PENDING, BookingStatusEnum.APPROVED]),
        Booking.start_time < booking.end_time,
        Booking.end_time > booking.start_time
    ).first()
    
    if overlapping:
        raise HTTPException(status_code=400, detail="Hall is already booked for this time slot")
    
    # Calculate total amount
    duration_hours = (booking.end_time - booking.start_time).total_seconds() / 3600
    total_amount = duration_hours * (hall.price_per_hour or 0)
    
    db_booking = Booking(
        **booking.dict(),
        user_id=user_id,
        total_amount=total_amount
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_user_bookings(db: Session, user_id: int):
    return db.query(Booking).filter(Booking.user_id == user_id).all()

def get_owner_bookings(db: Session, owner_id: int):
    return db.query(Booking).join(Hall).filter(Hall.owner_id == owner_id).all()

def get_all_bookings(db: Session):
    return db.query(Booking).all()

def update_booking_status(db: Session, booking_id: int, status: BookingStatusEnum, owner_id: int = None):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if user owns the hall (if owner_id is provided)
    if owner_id and booking.hall.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")
    
    booking.status = status
    db.commit()
    db.refresh(booking)
    return booking

def cancel_booking(db: Session, booking_id: int, user_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    
    if booking.status in [BookingStatusEnum.COMPLETED, BookingStatusEnum.CANCELLED]:
        raise HTTPException(status_code=400, detail="Cannot cancel this booking")
    
    booking.status = BookingStatusEnum.CANCELLED
    db.commit()
    return {"message": "Booking cancelled successfully"}

# Hall Owner specific functions
def get_owner_stats(db: Session, owner_id: int):
    total_halls = db.query(Hall).filter(Hall.owner_id == owner_id).count()
    total_bookings = db.query(Booking).join(Hall).filter(Hall.owner_id == owner_id).count()
    pending_bookings = db.query(Booking).join(Hall).filter(
        Hall.owner_id == owner_id,
        Booking.status == BookingStatusEnum.PENDING
    ).count()
    
    revenue_result = db.query(Booking).join(Hall).filter(
        Hall.owner_id == owner_id,
        Booking.status == BookingStatusEnum.COMPLETED
    ).with_entities(db.func.sum(Booking.total_amount)).scalar()
    
    revenue = revenue_result or 0.0
    
    return {
        "total_halls": total_halls,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "revenue": revenue
    }