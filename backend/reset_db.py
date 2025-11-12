# ==================== reset_db.py ====================
from database import engine, Base
from models import User, Hall, Booking
from sqlalchemy import text, inspect

def reset_database():
    print("Resetting database...")
    
    # Get an inspector to check existing tables
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    print(f"Existing tables: {existing_tables}")
    
    # Disable foreign key checks
    with engine.begin() as conn:
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        
        # Drop all tables that exist
        for table_name in existing_tables:
            if table_name in ['bookings', 'users', 'halls']:
                print(f"Dropping table: {table_name}")
                conn.execute(text(f"DROP TABLE IF EXISTS {table_name}"))
        
        # Re-enable foreign key checks
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    # Verify tables were created
    inspector = inspect(engine)
    new_tables = inspector.get_table_names()
    print(f"New tables created: {new_tables}")
    
    print("Database reset completed!")

if __name__ == "__main__":
    reset_database()