# ==================== routers/bookings.py ====================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime  # Add datetime import
from database import get_db
from schemas import BookingCreate, BookingResponse, BookingStatsResponse  # Add BookingStatsResponse import
from crud import (
    create_booking, get_user_bookings, get_all_bookings,
    update_booking_status, cancel_booking
)
from auth import get_current_user, get_current_admin
from models import User, BookingStatusEnum, Booking  # Add Booking import

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("/", response_model=BookingResponse)
def create_new_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_booking(db, booking, current_user.id)

@router.get("/my-bookings", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_bookings(db, current_user.id)

@router.get("/", response_model=List[BookingResponse])
def list_all_bookings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return get_all_bookings(db)

@router.put("/{booking_id}/approve", response_model=BookingResponse)
def approve_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return update_booking_status(db, booking_id, BookingStatusEnum.APPROVED)

@router.put("/{booking_id}/reject", response_model=BookingResponse)
def reject_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return update_booking_status(db, booking_id, BookingStatusEnum.REJECTED)

@router.delete("/{booking_id}")
def cancel_user_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return cancel_booking(db, booking_id, current_user.id)

@router.get("/stats/user", response_model=BookingStatsResponse)  # Changed endpoint path
async def get_booking_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        total_bookings = db.query(Booking).filter(Booking.user_id == current_user.id).count()
        
        upcoming_bookings = db.query(Booking).filter(
            Booking.user_id == current_user.id,
            Booking.start_time >= datetime.utcnow(),
            Booking.status.in_(['PENDING', 'APPROVED'])
        ).count()

        return BookingStatsResponse(
            total=total_bookings,
            upcoming=upcoming_bookings
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch booking stats"
        )