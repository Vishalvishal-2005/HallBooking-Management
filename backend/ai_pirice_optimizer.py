# ==================== ai_price_optimizer.py ====================
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import numpy as np
from datetime import datetime

class PriceOptimizationEngine:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.is_trained = False
        
    def prepare_training_data(self, bookings_data, halls_data):
        """Prepare data for price optimization model"""
        if bookings_data.empty:
            return None, None
            
        merged_data = pd.merge(bookings_data, halls_data, on='hall_id')
        
        # Feature engineering
        merged_data['day_of_week'] = merged_data['start_time'].dt.dayofweek
        merged_data['month'] = merged_data['start_time'].dt.month
        merged_data['is_weekend'] = merged_data['day_of_week'].isin([5, 6]).astype(int)
        merged_data['hour'] = merged_data['start_time'].dt.hour
        
        features = ['capacity', 'day_of_week', 'month', 'is_weekend', 'hour']
        X = merged_data[features]
        y = merged_data['price_per_hour']
        
        return X, y
    
    def train(self, bookings_data, halls_data):
        """Train the price optimization model"""
        X, y = self.prepare_training_data(bookings_data, halls_data)
        
        if X is None or len(X) < 10:  # Need minimum data to train
            self.is_trained = False
            return
            
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
    def predict_optimal_price(self, hall, event_datetime, duration_hours=1):
        """Predict optimal price for a hall at specific time"""
        if not self.is_trained:
            return hall.price_per_hour  # Return default price if model not trained
            
        features = pd.DataFrame([{
            'capacity': hall.capacity or 100,
            'day_of_week': event_datetime.weekday(),
            'month': event_datetime.month,
            'is_weekend': 1 if event_datetime.weekday() in [5, 6] else 0,
            'hour': event_datetime.hour,
        }])
        
        try:
            predicted_price = self.model.predict(features)[0]
            # Ensure price is within reasonable bounds
            min_price = hall.price_per_hour * 0.7
            max_price = hall.price_per_hour * 1.5
            return max(min_price, min(predicted_price, max_price))
        except:
            return hall.price_per_hour

price_optimizer = PriceOptimizationEngine()