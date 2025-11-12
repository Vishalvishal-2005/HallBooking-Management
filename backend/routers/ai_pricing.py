# ==================== routers/ai_pricing.py ====================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from auth import get_current_user
from models import User, Hall, Booking
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["AI Pricing"])

class PriceSuggestionResponse(BaseModel):
    current_price: float
    suggested_price: float
    reason: str

# Simple price optimization without ML dependencies
class SimplePriceOptimizer:
    def __init__(self):
        pass
    
    def calculate_suggested_price(self, base_price: float, event_datetime: datetime, capacity: int) -> float:
        """Calculate suggested price based on simple rules"""
        # Weekend premium (20% increase)
        if event_datetime.weekday() >= 5:  # Saturday or Sunday
            multiplier = 1.2
        # Evening premium (15% increase for events after 6 PM)
        elif event_datetime.hour >= 18:
            multiplier = 1.15
        # Afternoon (standard)
        elif event_datetime.hour >= 12:
            multiplier = 1.0
        # Morning discount (10% discount)
        else:
            multiplier = 0.9
        
        # Capacity-based adjustment
        if capacity > 200:
            multiplier *= 1.1  # Large capacity premium
        elif capacity < 50:
            multiplier *= 0.9  # Small capacity discount
        
        suggested_price = base_price * multiplier
        
        # Ensure price doesn't go below 70% or above 150% of base price
        min_price = base_price * 0.7
        max_price = base_price * 1.5
        
        return max(min_price, min(suggested_price, max_price))

price_optimizer = SimplePriceOptimizer()

@router.get("/pricing/suggest/{hall_id}", response_model=PriceSuggestionResponse)
def get_price_suggestion(
    hall_id: int,
    event_datetime: str,
    duration_hours: int = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered price suggestion for a hall"""
    try:
        # Get the hall
        hall = db.query(Hall).filter(Hall.id == hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Hall not found")
        
        # Parse datetime
        event_dt = datetime.fromisoformat(event_datetime.replace('Z', '+00:00'))
        
        # Get price suggestion
        suggested_price = price_optimizer.calculate_suggested_price(
            hall.price_per_hour, 
            event_dt, 
            hall.capacity or 100
        )
        
        # Determine reason for suggestion
        if suggested_price > hall.price_per_hour:
            reason = "High demand period - premium pricing"
        elif suggested_price < hall.price_per_hour:
            reason = "Low demand period - discounted price"
        else:
            reason = "Standard pricing"
        
        return PriceSuggestionResponse(
            current_price=hall.price_per_hour,
            suggested_price=round(suggested_price, 2),
            reason=reason
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating price suggestion: {str(e)}")