# ==================== routers/__init__.py ====================
from .auth import router as auth_router
from .halls import router as halls_router
from .bookings import router as bookings_router
from .owner import router as owner_router
from .ai_recommendations import router as ai_recommendations_router
from .ai_chatbot import router as ai_chatbot_router
from .ai_pricing import router as ai_pricing_router

__all__ = [
    "auth_router", 
    "halls_router", 
    "bookings_router", 
    "owner_router",
    "ai_recommendations_router",
    "ai_chatbot_router", 
    "ai_pricing_router"
]