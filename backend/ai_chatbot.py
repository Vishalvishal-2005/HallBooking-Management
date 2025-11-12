# ==================== ai_chatbot.py ====================
import openai
import os
from typing import Dict, List

class BookingChatbot:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "your-openai-key-here")
        # If you don't have OpenAI API key, we'll use a simple rule-based system
        self.use_openai = bool(self.openai_api_key and self.openai_api_key != "your-openai-key-here")
        
    def get_context_prompt(self):
        """Get the context prompt for the chatbot"""
        return """
        You are a helpful assistant for a Hall Booking Management System called "HallBooker".
        Your role is to help users with:
        1. Finding suitable halls for their events
        2. Understanding booking procedures
        3. Answering questions about pricing and availability
        4. Providing information about hall facilities
        5. Helping with booking modifications or cancellations
        
        Be friendly, professional, and provide accurate information.
        If you don't know something, suggest contacting support.
        """
    
    def rule_based_response(self, user_message: str) -> str:
        """Simple rule-based responses for when OpenAI is not available"""
        user_message = user_message.lower()
        
        if any(word in user_message for word in ['hello', 'hi', 'hey']):
            return "Hello! I'm your HallBooker assistant. How can I help you with your venue booking today?"
        
        elif any(word in user_message for word in ['price', 'cost', 'how much']):
            return "Hall prices vary based on capacity, location, and facilities. You can check specific pricing on each hall's details page. Most halls range from ₹1000 to ₹5000 per hour."
        
        elif any(word in user_message for word in ['availability', 'available', 'book']):
            return "To check availability, please visit the hall details page and use the booking calendar. You can see available time slots and make bookings there."
        
        elif any(word in user_message for word in ['facilities', 'amenities', 'features']):
            return "Our halls offer various facilities including AC, parking, catering, audio-visual equipment, and more. Check individual hall pages for specific facilities."
        
        elif any(word in user_message for word in ['cancel', 'modify', 'change']):
            return "You can modify or cancel bookings from your 'My Bookings' page. Please note cancellation policies may vary by hall."
        
        else:
            return "I understand you're looking for help with hall bookings. For detailed assistance, please check our FAQ section or contact our support team at support@hallbooker.com."
    
    def generate_response(self, user_message: str, conversation_history: List[Dict] = None) -> str:
        """Generate AI response using OpenAI API or rule-based system"""
        if not self.use_openai:
            return self.rule_based_response(user_message)
            
        try:
            messages = [
                {"role": "system", "content": self.get_context_prompt()}
            ]
            
            if conversation_history:
                messages.extend(conversation_history)
                
            messages.append({"role": "user", "content": user_message})
            
            # Note: This uses the older openai API format
            # You might need to adjust based on your openai version
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Fallback to rule-based system if OpenAI fails
            return self.rule_based_response(user_message)

chatbot = BookingChatbot()