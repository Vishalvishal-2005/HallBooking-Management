# ==================== routers/halls.py ====================
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas import HallCreate, HallResponse, HallUpdate, HallStatsResponse
from crud import create_hall, get_halls, get_hall, update_hall, delete_hall
from auth import get_current_admin, get_current_user, get_current_owner  # Add get_current_owner
from models import User, Hall
from sqlalchemy import or_

router = APIRouter(prefix="/api/halls", tags=["Halls"])

@router.get("/", response_model=List[HallResponse])
def list_halls(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search by name, location, or facilities"),
    min_capacity: Optional[int] = Query(None, description="Minimum capacity"),
    max_price: Optional[float] = Query(None, description="Maximum price per hour"),
    location: Optional[str] = Query(None, description="Filter by location"),
    db: Session = Depends(get_db)
):
    query = db.query(Hall)
    
    # Search functionality
    if search:
        query = query.filter(
            or_(
                Hall.name.ilike(f"%{search}%"),
                Hall.location.ilike(f"%{search}%"),
                Hall.facilities.ilike(f"%{search}%")
            )
        )
    
    # Filter by capacity
    if min_capacity:
        query = query.filter(Hall.capacity >= min_capacity)
    
    # Filter by price
    if max_price:
        query = query.filter(Hall.price_per_hour <= max_price)
    
    # Filter by location
    if location:
        query = query.filter(Hall.location.ilike(f"%{location}%"))
    
    return query.offset(skip).limit(limit).all()

@router.get("/available", response_model=List[HallResponse])
def get_available_halls(db: Session = Depends(get_db)):
    return db.query(Hall).filter(Hall.available == True).all()

@router.get("/{hall_id}", response_model=HallResponse)
def get_hall_by_id(hall_id: int, db: Session = Depends(get_db)):
    hall = get_hall(db, hall_id)
    if not hall:
        raise HTTPException(status_code=404, detail="Hall not found")
    return hall

# Allow both admin and hall owners to create halls
@router.post("/", response_model=HallResponse)
def create_new_hall(
    hall: HallCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)  # Changed from get_current_admin
):
    return create_hall(db, hall, current_user.id)

# Allow admin to update any hall, owners to update their own halls
@router.put("/{hall_id}", response_model=HallResponse)
def update_hall_by_id(
    hall_id: int,
    hall: HallUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)  # Changed from get_current_admin
):
    # If user is admin, allow updating any hall
    if current_user.role == 'ADMIN':
        return update_hall(db, hall_id, hall.dict(exclude_unset=True))
    # If user is hall owner, only allow updating their own halls
    else:
        return update_hall(db, hall_id, hall.dict(exclude_unset=True), current_user.id)

# Allow admin to delete any hall, owners to delete their own halls
@router.delete("/{hall_id}")
def delete_hall_by_id(
    hall_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_owner)  # Changed from get_current_admin
):
    # If user is admin, allow deleting any hall
    if current_user.role == 'ADMIN':
        return delete_hall(db, hall_id)
    # If user is hall owner, only allow deleting their own halls
    else:
        return delete_hall(db, hall_id, current_user.id)

@router.get("/stats/owner", response_model=HallStatsResponse)
async def get_hall_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != 'HALL_OWNER':
        raise HTTPException(
            status_code=403, 
            detail="Not authorized"
        )
    
    try:
        total_halls = db.query(Hall).filter(Hall.owner_id == current_user.id).count()
        return HallStatsResponse(total=total_halls)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch hall stats"
        )