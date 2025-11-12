# ==================== routers/ai_recommendations.py ====================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
from models import User, Hall, Booking
from schemas import HallResponse
import random

class SimpleRecommendationEngine:
    def __init__(self):
        self.hall_similarities = {}
        
    def calculate_similarity(self, hall1, hall2):
        score = 0
        
        if hall1.location and hall2.location:
            loc1, loc2 = hall1.location.lower(), hall2.location.lower()
            if loc1 == loc2:
                score += 3
            elif any(area in loc1 and area in loc2 for area in ['downtown', 'uptown', 'suburb', 'center']):
                score += 1
        
        if hall1.price_per_hour and hall2.price_per_hour:
            price1, price2 = hall1.price_per_hour, hall2.price_per_hour
            if 0.75 <= price1/price2 <= 1.25:
                score += 2
        
        if hall1.capacity and hall2.capacity:
            cap1, cap2 = hall1.capacity, hall2.capacity
            if 0.7 <= cap1/cap2 <= 1.3:
                score += 2
            elif 0.5 <= cap1/cap2 <= 2.0:
                score += 1
        
        if hall1.facilities and hall2.facilities:
            facilities1 = set(f.strip().lower() for f in hall1.facilities.split(','))
            facilities2 = set(f.strip().lower() for f in hall2.facilities.split(','))
            common_facilities = facilities1.intersection(facilities2)
            score += len(common_facilities) * 0.5
        
        return score
    
    def get_similar_halls(self, hall_id, halls, top_n=5):
        target_hall = next((h for h in halls if h.id == hall_id), None)
        if not target_hall:
            return []
        
        similarities = []
        for hall in halls:
            if hall.id == hall_id:
                continue
            similarity = self.calculate_similarity(target_hall, hall)
            similarities.append((hall, similarity))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [hall for hall, score in similarities[:top_n] if score > 0]

class SimplePreferenceEngine:
    def __init__(self):
        self.user_preferences = {}
        
    def update_user_profile(self, user_id, booked_halls, all_halls):
        if not booked_halls:
            return
            
        user_halls = [h for h in all_halls if h.id in booked_halls]
        
        if not user_halls:
            return
            
        locations = {}
        for hall in user_halls:
            if hall.location:
                locations[hall.location] = locations.get(hall.location, 0) + 1
        
        preferred_location = max(locations.items(), key=lambda x: x[1])[0] if locations else None
        
        all_facilities = []
        for hall in user_halls:
            if hall.facilities:
                facilities = [f.strip().lower() for f in hall.facilities.split(',')]
                all_facilities.extend(facilities)
        
        from collections import Counter
        common_facilities = [facility for facility, count in Counter(all_facilities).most_common(5)]
        
        self.user_preferences[user_id] = {
            'preferred_location': preferred_location,
            'common_facilities': common_facilities,
            'avg_capacity': sum(h.capacity or 0 for h in user_halls) / len(user_halls) if user_halls else 100
        }
    
    def recommend_for_user(self, user_id, halls, top_n=5):
        if user_id not in self.user_preferences:
            return self.get_popular_halls(halls, top_n)
            
        preferences = self.user_preferences[user_id]
        scores = []
        
        for hall in halls:
            score = 0
            
            if preferences['preferred_location'] and hall.location:
                if hall.location.lower() == preferences['preferred_location'].lower():
                    score += 3
            
            if preferences['common_facilities'] and hall.facilities:
                hall_facilities = [f.strip().lower() for f in hall.facilities.split(',')]
                common_count = len(set(preferences['common_facilities']).intersection(hall_facilities))
                score += common_count
            
            if hall.capacity and preferences['avg_capacity']:
                capacity_ratio = hall.capacity / preferences['avg_capacity']
                if 0.8 <= capacity_ratio <= 1.2:
                    score += 2
            
            scores.append((hall, score))
        
        scores.sort(key=lambda x: x[1], reverse=True)
        recommended = [hall for hall, score in scores[:top_n] if score > 0]
        
        if not recommended:
            return self.get_popular_halls(halls, top_n)
            
        return recommended
    
    def get_popular_halls(self, halls, top_n=5):
        if len(halls) <= top_n:
            return halls
        return random.sample(halls, top_n)

recommendation_engine = SimpleRecommendationEngine()
preference_engine = SimplePreferenceEngine()

router = APIRouter(prefix="/api/ai", tags=["AI Recommendations"])

@router.get("/similar/{hall_id}", response_model=List[HallResponse])
def get_similar_halls(
    hall_id: int,
    top_n: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        halls = db.query(Hall).filter(Hall.available == True).all()
        if not halls:
            return []
        
        target_hall = db.query(Hall).filter(Hall.id == hall_id).first()
        if not target_hall:
            raise HTTPException(status_code=404, detail="Hall not found")
            
        similar_halls = recommendation_engine.get_similar_halls(hall_id, halls, top_n)
        
        if not similar_halls:
            other_halls = [h for h in halls if h.id != hall_id]
            similar_halls = preference_engine.get_popular_halls(other_halls, top_n)
        
        return similar_halls
    except Exception as e:
        print(f"Error in similar halls recommendation: {str(e)}")
        fallback_halls = db.query(Hall).filter(Hall.available == True, Hall.id != hall_id).limit(top_n).all()
        return fallback_halls

@router.get("/personalized", response_model=List[HallResponse])
def get_personalized_recommendations(
    top_n: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        user_bookings = db.query(Booking).filter(
            Booking.user_id == current_user.id
        ).all()
        
        booked_hall_ids = [booking.hall_id for booking in user_bookings]
        
        halls = db.query(Hall).filter(Hall.available == True).all()
        if not halls:
            return []
        
        preference_engine.update_user_profile(current_user.id, booked_hall_ids, halls)
        recommended_halls = preference_engine.recommend_for_user(current_user.id, halls, top_n)
        
        return recommended_halls
        
    except Exception as e:
        print(f"Error in personalized recommendations: {str(e)}")
        fallback_halls = db.query(Hall).filter(Hall.available == True).limit(top_n).all()
        return fallback_halls