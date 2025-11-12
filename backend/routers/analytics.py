# ==================== routers/analytics.py ====================
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_admin
from models import User, Hall, Booking, BookingStatusEnum
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Total counts
    total_users = db.query(User).count()
    total_halls = db.query(Hall).count()
    total_bookings = db.query(Booking).count()
    
    # Booking status counts
    pending_bookings = db.query(Booking).filter(Booking.status == BookingStatusEnum.PENDING).count()
    approved_bookings = db.query(Booking).filter(Booking.status == BookingStatusEnum.APPROVED).count()
    completed_bookings = db.query(Booking).filter(Booking.status == BookingStatusEnum.COMPLETED).count()
    
    # Revenue
    total_revenue = db.query(func.sum(Booking.total_amount)).filter(
        Booking.status == BookingStatusEnum.COMPLETED
    ).scalar() or 0.0
    
    # Recent bookings (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_bookings = db.query(Booking).filter(
        Booking.created_at >= thirty_days_ago
    ).count()
    
    # Hall owners count
    hall_owners = db.query(User).filter(User.role == "HALL_OWNER").count()
    
    return {
        "total_users": total_users,
        "total_halls": total_halls,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "approved_bookings": approved_bookings,
        "completed_bookings": completed_bookings,
        "total_revenue": total_revenue,
        "recent_bookings_last_30_days": recent_bookings,
        "hall_owners_count": hall_owners
    }

@router.get("/revenue")
def get_revenue_analytics(
    period: str = "monthly",  # monthly, weekly, daily
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # This would typically involve more complex date grouping
    # Simplified version
    revenue_by_status = db.query(
        Booking.status,
        func.sum(Booking.total_amount).label('revenue')
    ).group_by(Booking.status).all()
    
    return {
        "revenue_by_status": [
            {"status": status.value, "revenue": revenue} 
            for status, revenue in revenue_by_status
        ]
    }