# ==================== routers/ai_chatbot.py ====================
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/chatbot", tags=["AI Chatbot"])

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str

class EnhancedChatbot:
    def __init__(self):
        self.responses = {
            'greeting': {
                'patterns': ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
                'response': "Hello! I'm your HallBooker assistant. I can help you find venues, check prices, understand facilities, and assist with bookings. What type of event are you planning?"
            },
            'pricing': {
                'patterns': ['price', 'cost', 'how much', 'rate', 'expensive', 'cheap'],
                'response': "Hall prices vary based on capacity, location, and facilities. Most halls range from ₹1000 to ₹5000 per hour. You can check specific pricing on each hall's details page. What's your budget range?"
            },
            'availability': {
                'patterns': ['available', 'availability', 'free', 'booked', 'schedule'],
                'response': "To check availability, visit the hall details page and use the booking calendar. You'll see all available time slots there. You can also filter halls by date on the search page."
            },
            'facilities': {
                'patterns': ['facilities', 'amenities', 'features', 'equipment', 'what includes'],
                'response': "Our halls offer various facilities including AC, parking, catering, audio-visual equipment, WiFi, furniture, and more. Check individual hall pages for specific amenities. Any particular facility you need?"
            },
            'booking_process': {
                'patterns': ['book', 'booking', 'reserve', 'how to book', 'process'],
                'response': "Booking is simple: 1) Find your preferred hall 2) Check availability 3) Fill booking form 4) Submit request 5) Get confirmation. You can manage all bookings from 'My Bookings' page."
            },
            'cancellation': {
                'patterns': ['cancel', 'cancellation', 'refund', 'change booking'],
                'response': "You can cancel bookings from your 'My Bookings' page. Please note cancellation policies may vary by hall. Most halls allow free cancellation 48 hours before the event."
            },
            'capacity': {
                'patterns': ['capacity', 'how many people', 'guests', 'attendees', 'size'],
                'response': "Halls have different capacities from small (50 people) to large (500+ people). Use the capacity filter on the search page to find halls that fit your needs. How many guests are you expecting?"
            },
            'location': {
                'patterns': ['location', 'where', 'area', 'city', 'address'],
                'response': "We have halls in various locations across the city. Use the location filter on the search page to find halls in your preferred area. Any specific area you're looking at?"
            },
            'help': {
                'patterns': ['help', 'support', 'problem', 'issue', 'contact'],
                'response': "I can help you with: finding halls, checking prices, understanding facilities, booking process, and cancellations. For urgent issues, contact support@hallbooker.com or call +91-XXXXX-XXXXX."
            },
            'event_types': {
                'patterns': ['wedding', 'conference', 'meeting', 'party', 'birthday', 'corporate'],
                'response': "We have perfect venues for {event_type}s! Use our search filters to find halls suitable for your event type. Would you like me to help you find {event_type} venues?"
            }
        }
    
    def get_response(self, message: str) -> str:
        message_lower = message.lower()
        
        for event_type in ['wedding', 'conference', 'meeting', 'party', 'birthday', 'corporate']:
            if event_type in message_lower:
                return self.responses['event_types']['response'].format(event_type=event_type)
        
        for category, data in self.responses.items():
            if category == 'event_types':
                continue
                
            for pattern in data['patterns']:
                if pattern in message_lower:
                    return data['response']
        
        return "I understand you're looking for help with hall bookings. I can assist with finding venues, checking prices, understanding facilities, and the booking process. What specific information do you need?"

chatbot = EnhancedChatbot()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(chat_message: ChatMessage):
    try:
        if not chat_message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        response_text = chatbot.get_response(chat_message.message)
        
        return ChatResponse(
            response=response_text,
            conversation_id=chat_message.conversation_id or "default_session",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        return ChatResponse(
            response="I'm currently experiencing technical difficulties. Please try again in a moment or contact our support team for immediate assistance.",
            conversation_id=chat_message.conversation_id or "error_session",
            timestamp=datetime.now().isoformat()
        )