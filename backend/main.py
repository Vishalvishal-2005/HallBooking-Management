# ==================== main.py ====================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import routers
from routers.auth import router as auth_router
from routers.halls import router as halls_router
from routers.bookings import router as bookings_router
from routers.owner import router as owner_router
from routers.ai_recommendations import router as ai_recommendations_router
from routers.ai_chatbot import router as ai_chatbot_router
from routers.ai_pricing import router as ai_pricing_router

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created/verified successfully")
except Exception as e:
    print(f"Error creating database tables: {e}")

app = FastAPI(
    title="Hall Booking Management System",
    description="Smart Bookings, Seamless Events with AI",
    version="1.0.0"
)

# CORS configuration
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)
# Include routers
app.include_router(auth_router)
app.include_router(halls_router)
app.include_router(bookings_router)
app.include_router(owner_router)
app.include_router(ai_recommendations_router)
app.include_router(ai_chatbot_router)
app.include_router(ai_pricing_router)

@app.get("/")
def root():
    return {
        "message": "Hall Booking Management System API",
        "motto": "Smart Bookings, Seamless Events",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}