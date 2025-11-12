# ==================== routers/owner.py ====================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime, timedelta
from pydantic import BaseModel  # Add this import

from database import get_db
from schemas import HallCreate, HallResponse, HallUpdate, BookingResponse, OwnerStatsResponse
from crud import (
    create_hall, get_owner_halls, update_hall, delete_hall,
    get_owner_bookings, update_booking_status
)
from auth import get_current_user, get_current_owner
from models import User, Hall, Booking

router = APIRouter(prefix="/api/owner", tags=["Hall Owner"])

# Add this schema for status update
class StatusUpdate(BaseModel):
    status: str

# Hall Management Endpoints
@router.post("/halls", response_model=HallResponse)
def create_owner_hall(
    hall: HallCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)
):
    return create_hall(db, hall, current_user.id)

@router.get("/halls", response_model=List[HallResponse])
def get_my_halls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)
):
    return get_owner_halls(db, current_user.id)

@router.put("/halls/{hall_id}", response_model=HallResponse)
def update_owner_hall(
    hall_id: int,
    hall: HallUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)
):
    return update_hall(db, hall_id, hall.dict(exclude_unset=True), current_user.id)

@router.delete("/halls/{hall_id}")
def delete_owner_hall(
    hall_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)
):
    return delete_hall(db, hall_id, current_user.id)

# Booking Management Endpoints
@router.get("/bookings", response_model=List[BookingResponse])
def get_owner_bookings_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)
):
    return get_owner_bookings(db, current_user.id)

@router.get("/stats", response_model=OwnerStatsResponse)
async def get_owner_stats(
    current_user: User = Depends(get_current_owner),
    db: Session = Depends(get_db)
):
    try:
        # Get owner stats
        total_halls = db.query(Hall).filter(Hall.owner_id == current_user.id).count()
        
        # Get total bookings for owner's halls
        total_bookings = db.query(Booking).join(Hall).filter(
            Hall.owner_id == current_user.id
        ).count()
        
        # Get pending bookings count
        pending_bookings = db.query(Booking).join(Hall).filter(
            Hall.owner_id == current_user.id,
            Booking.status == 'PENDING'
        ).count()
        
        # Get revenue stats
        total_revenue = db.query(func.sum(Booking.total_amount)).join(Hall).filter(
            Hall.owner_id == current_user.id,
            Booking.status.in_(['APPROVED', 'COMPLETED'])
        ).scalar() or 0
        
        return OwnerStatsResponse(
            total_halls=total_halls,
            total_bookings=total_bookings,
            pending_bookings=pending_bookings,
            total_revenue=float(total_revenue)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch owner stats: {str(e)}"
        )

# FIXED: Use the correct endpoint path that matches frontend call
@router.put("/bookings/{booking_id}/status")
def update_booking_status(
    booking_id: int, 
    data: StatusUpdate,  # Use the Pydantic model
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_owner)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify the booking belongs to owner's hall
    hall = db.query(Hall).filter(Hall.id == booking.hall_id, Hall.owner_id == current_user.id).first()
    if not hall:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")

    new_status = data.status
    if new_status not in ["APPROVED", "REJECTED", "CANCELLED", "COMPLETED"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    booking.status = new_status
    db.commit()
    db.refresh(booking)
    return {"message": f"Booking {new_status.lower()} successfully", "booking": booking}

# Alternative simplified endpoints (keep these for compatibility)
@router.put("/bookings/{booking_id}/approve")
def approve_booking(
    booking_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_owner)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify ownership
    hall = db.query(Hall).filter(Hall.id == booking.hall_id, Hall.owner_id == current_user.id).first()
    if not hall:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if booking.status != "PENDING":
        raise HTTPException(status_code=400, detail="Booking already processed")

    booking.status = "APPROVED"
    db.commit()
    db.refresh(booking)
    return {"message": "Booking approved successfully", "booking": booking}

@router.put("/bookings/{booking_id}/reject")
def reject_booking(
    booking_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_owner)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify ownership
    hall = db.query(Hall).filter(Hall.id == booking.hall_id, Hall.owner_id == current_user.id).first()
    if not hall:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if booking.status != "PENDING":
        raise HTTPException(status_code=400, detail="Booking already processed")

    booking.status = "REJECTED"
    db.commit()
    db.refresh(booking)
    return {"message": "Booking rejected successfully", "booking": booking}

# Chart endpoints (keep as is)
@router.get("/charts/booking-trends")
async def get_booking_trends(
    current_user: User = Depends(get_current_owner),
    db: Session = Depends(get_db)
):
    """Get booking trends for the last 6 months"""
    try:
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        
        monthly_data = db.query(
            extract('month', Booking.created_at).label('month'),
            extract('year', Booking.created_at).label('year'),
            func.count(Booking.id).label('bookings'),
            func.sum(Booking.total_amount).label('revenue')
        ).join(Hall).filter(
            Hall.owner_id == current_user.id,
            Booking.created_at >= six_months_ago
        ).group_by(
            extract('year', Booking.created_at),
            extract('month', Booking.created_at)
        ).order_by('year', 'month').all()
        
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        chart_data = []
        
        for data in monthly_data:
            chart_data.append({
                'month': months[data.month - 1],
                'bookings': data.bookings,
                'revenue': float(data.revenue or 0)
            })
        
        return chart_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chart data: {str(e)}")

@router.get("/charts/hall-performance")
async def get_hall_performance(
    current_user: User = Depends(get_current_owner),
    db: Session = Depends(get_db)
):
    """Get performance data for each hall"""
    try:
        hall_performance = db.query(
            Hall.name,
            func.count(Booking.id).label('bookings'),
            func.avg(Booking.total_amount).label('avg_revenue')
        ).outerjoin(Booking).filter(
            Hall.owner_id == current_user.id
        ).group_by(Hall.id, Hall.name).all()
        
        performance_data = []
        for hall in hall_performance:
            performance_data.append({
                'name': hall.name,
                'bookings': hall.bookings,
                'occupancy': min((hall.bookings / 30) * 100, 100)
            })
        
        return performance_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching performance data: {str(e)}")
@router.get("/debug/bookings")
async def debug_owner_bookings(
    current_user: User = Depends(get_current_owner),
    db: Session = Depends(get_db)
):
    """Debug endpoint to check owner bookings data"""
    try:
        user_id = current_user.id
        
        # Check owner's halls
        owner_halls = db.query(Hall).filter(Hall.owner_id == user_id).all()
        hall_ids = [hall.id for hall in owner_halls]
        
        # Check all bookings for owner's halls
        all_bookings = db.query(Booking).join(Hall).filter(Hall.owner_id == user_id).all()
        
        # Check the actual get_owner_bookings function
        actual_bookings = get_owner_bookings(db, user_id)
        
        return {
            "debug_info": {
                "owner_id": user_id,
                "owner_halls_count": len(owner_halls),
                "owner_hall_ids": hall_ids,
                "all_bookings_count": len(all_bookings),
                "get_owner_bookings_count": len(actual_bookings),
                "owner_halls": [
                    {
                        "id": hall.id,
                        "name": hall.name,
                        "owner_id": hall.owner_id
                    } for hall in owner_halls
                ],
                "all_bookings": [
                    {
                        "id": booking.id,
                        "hall_id": booking.hall_id,
                        "status": booking.status,
                        "start_time": booking.start_time,
                        "user_id": booking.user_id
                    } for booking in all_bookings
                ]
            }
        }
    except Exception as e:
        return {"error": str(e)}