# ==================== fix_halls_table.py ====================
from database import engine
from sqlalchemy import text

def fix_halls_table():
    print("Fixing halls table structure...")
    
    with engine.begin() as conn:
        # Check if owner_id column exists
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'halls' 
            AND COLUMN_NAME = 'owner_id'
        """))
        
        owner_id_exists = result.scalar()
        
        if not owner_id_exists:
            print("Adding owner_id column to halls table...")
            # Add owner_id column
            conn.execute(text("""
                ALTER TABLE halls 
                ADD COLUMN owner_id INT NOT NULL AFTER available,
                ADD FOREIGN KEY (owner_id) REFERENCES users(id)
            """))
            print("✅ owner_id column added successfully!")
        else:
            print("✅ owner_id column already exists!")
        
        print("Halls table structure fixed!")

if __name__ == "__main__":
    fix_halls_table()