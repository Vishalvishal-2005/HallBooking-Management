# ==================== routers/ai_engines.py ====================
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class HallRecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.hall_features = None
        
    def train(self, halls_data):
        """Train the recommendation model with hall data"""
        features_text = halls_data.apply(
            lambda x: f"{x['name']} {x['description']} {x['facilities']} {x['location']}", 
            axis=1
        )
        self.hall_features = self.vectorizer.fit_transform(features_text)
        
    def get_similar_halls(self, hall_id, halls_data, top_n=5):
        """Get similar halls based on content"""
        if self.hall_features is None:
            self.train(halls_data)
            
        hall_idx = halls_data[halls_data['id'] == hall_id].index[0]
        similarity_scores = cosine_similarity(
            self.hall_features[hall_idx], 
            self.hall_features
        ).flatten()
        
        similar_indices = similarity_scores.argsort()[-top_n-1:-1][::-1]
        return halls_data.iloc[similar_indices]['id'].tolist()

class UserPreferenceEngine:
    def __init__(self):
        self.user_profiles = {}
        
    def update_user_profile(self, user_id, booked_halls, halls_data):
        """Update user preferences based on booking history"""
        user_halls = halls_data[halls_data['id'].isin(booked_halls)]
        
        # Extract preferences from booked halls
        preferred_facilities = ' '.join(user_halls['facilities'].fillna(''))
        preferred_locations = ' '.join(user_halls['location'].fillna(''))
        
        self.user_profiles[user_id] = {
            'facilities': preferred_facilities,
            'locations': preferred_locations,
        }
    
    def recommend_for_user(self, user_id, halls_data, top_n=5):
        """Recommend halls based on user preferences"""
        if user_id not in self.user_profiles:
            return []
            
        profile = self.user_profiles[user_id]
        query_text = f"{profile['facilities']} {profile['locations']}"
        
        vectorizer = TfidfVectorizer(stop_words='english')
        hall_features = vectorizer.fit_transform(
            halls_data.apply(
                lambda x: f"{x['facilities']} {x['location']}", 
                axis=1
            )
        )
        
        query_vector = vectorizer.transform([query_text])
        similarity_scores = cosine_similarity(query_vector, hall_features).flatten()
        
        recommended_indices = similarity_scores.argsort()[-top_n:][::-1]
        return halls_data.iloc[recommended_indices]['id'].tolist()

# Initialize engines
recommendation_engine = HallRecommendationEngine()
preference_engine = UserPreferenceEngine()