# ==================== fix_database.py ====================
from database import engine
from sqlalchemy import text

def fix_database_enum():
    print("Fixing database ENUM types...")
    
    with engine.begin() as conn:
        # Check current enum values for users.role
        result = conn.execute(text("""
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'role'
        """))
        
        current_enum = result.scalar()
        print(f"Current role enum: {current_enum}")
        
        # Modify the enum to include HALL_OWNER
        conn.execute(text("""
            ALTER TABLE users 
            MODIFY COLUMN role ENUM('USER', 'ADMIN', 'HALL_OWNER') NOT NULL DEFAULT 'USER'
        """))
        
        print("✅ Users role enum updated successfully!")
        
        # Also check bookings.status enum
        result = conn.execute(text("""
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'bookings' 
            AND COLUMN_NAME = 'status'
        """))
        
        current_status_enum = result.scalar()
        print(f"Current status enum: {current_status_enum}")
        
        print("✅ Database enum types fixed!")

if __name__ == "__main__":
    fix_database_enum()
