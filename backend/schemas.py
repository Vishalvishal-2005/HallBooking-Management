# ==================== schemas.py ====================
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, BookingStatusEnum

# Add these missing response models
class BookingStatsResponse(BaseModel):
    total: int
    upcoming: int

class HallStatsResponse(BaseModel):
    total: int

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
    confirm_password: Optional[str] = None

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and values['new_password']:
            if v != values['new_password']:
                raise ValueError('Passwords do not match')
        return v

    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace(' ', '').replace('-', '').replace('+', '').isdigit():
            raise ValueError('Invalid phone number format')
        return v

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    role: RoleEnum = RoleEnum.USER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    created_at: datetime
    
    class Config:
        from_attributes = True

# Hall Schemas
class HallBase(BaseModel):
    name: str
    description: Optional[str] = None
    capacity: Optional[int] = None
    price_per_hour: Optional[float] = None
    facilities: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    available: bool = True

class HallCreate(HallBase):
    pass

class HallUpdate(HallBase):
    pass

class HallResponse(HallBase):
    id: int
    owner_id: int
    owner: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    hall_id: int
    start_time: datetime
    end_time: datetime
    event_name: Optional[str] = None
    event_type: Optional[str] = None
    attendees: Optional[int] = None
    remarks: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    user_id: int
    total_amount: Optional[float] = None
    status: BookingStatusEnum
    created_at: datetime
    hall: Optional[HallResponse] = None
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Hall Owner specific schemas
class HallOwnerStats(BaseModel):
    total_halls: int
    total_bookings: int
    pending_bookings: int
    revenue: float

class OwnerStatsResponse(BaseModel):
    total_halls: int
    total_bookings: int
    total_revenue: float

class Config:
    from_attributes = True