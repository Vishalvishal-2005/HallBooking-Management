# ==================== models.py ====================
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    HALL_OWNER = "HALL_OWNER"  # Add hall owner role

class BookingStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    role = Column(Enum(RoleEnum), default=RoleEnum.USER)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user")
    owned_halls = relationship("Hall", back_populates="owner")  # Add relationship to owned halls

class Hall(Base):
    __tablename__ = "halls"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    capacity = Column(Integer)
    price_per_hour = Column(Float)
    facilities = Column(String(500))
    location = Column(String(255))
    image_url = Column(String(500))
    available = Column(Boolean, default=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Add owner reference
    
    bookings = relationship("Booking", back_populates="hall")
    owner = relationship("User", back_populates="owned_halls")  # Add relationship to owner

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hall_id = Column(Integer, ForeignKey("halls.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    event_name = Column(String(255))
    event_type = Column(String(100))
    attendees = Column(Integer)
    total_amount = Column(Float)
    status = Column(Enum(BookingStatusEnum), default=BookingStatusEnum.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    remarks = Column(Text)
    
    user = relationship("User", back_populates="bookings")
    hall = relationship("Hall", back_populates="bookings")