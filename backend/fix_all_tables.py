# ==================== fix_all_tables.py ====================
from database import engine
from sqlalchemy import text

def fix_all_tables():
    print("Checking and fixing all table structures...")
    
    with engine.begin() as conn:
        # 1. Fix users table - check role enum
        print("\n1. Checking users table...")
        result = conn.execute(text("""
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'role'
        """))
        current_enum = result.scalar()
        print(f"   Current role enum: {current_enum}")
        
        if 'HALL_OWNER' not in current_enum:
            print("   Updating users role enum...")
            conn.execute(text("""
                ALTER TABLE users 
                MODIFY COLUMN role ENUM('USER', 'ADMIN', 'HALL_OWNER') NOT NULL DEFAULT 'USER'
            """))
            print("   ✅ Users role enum updated!")
        
        # 2. Fix halls table - check owner_id
        print("\n2. Checking halls table...")
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'halls' 
            AND COLUMN_NAME = 'owner_id'
        """))
        owner_id_exists = result.scalar()
        
        if not owner_id_exists:
            print("   Adding owner_id to halls table...")
            conn.execute(text("""
                ALTER TABLE halls 
                ADD COLUMN owner_id INT NOT NULL AFTER available
            """))
            # Add foreign key constraint
            conn.execute(text("""
                ALTER TABLE halls 
                ADD CONSTRAINT fk_halls_owner 
                FOREIGN KEY (owner_id) REFERENCES users(id)
            """))
            print("   ✅ owner_id column added to halls table!")
        
        # 3. Fix bookings table - check all columns and foreign keys
        print("\n3. Checking bookings table...")
        
        # Check status enum
        result = conn.execute(text("""
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'bookings' 
            AND COLUMN_NAME = 'status'
        """))
        status_enum = result.scalar()
        print(f"   Current status enum: {status_enum}")
        
        expected_statuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED']
        if not all(status in status_enum for status in expected_statuses):
            print("   Updating bookings status enum...")
            conn.execute(text("""
                ALTER TABLE bookings 
                MODIFY COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'
            """))
            print("   ✅ Bookings status enum updated!")
        
        # Check if total_amount column exists
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'bookings' 
            AND COLUMN_NAME = 'total_amount'
        """))
        total_amount_exists = result.scalar()
        
        if not total_amount_exists:
            print("   Adding total_amount to bookings table...")
            conn.execute(text("""
                ALTER TABLE bookings 
                ADD COLUMN total_amount FLOAT AFTER attendees
            """))
            print("   ✅ total_amount column added to bookings table!")
        
        # Check if remarks column exists
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'bookings' 
            AND COLUMN_NAME = 'remarks'
        """))
        remarks_exists = result.scalar()
        
        if not remarks_exists:
            print("   Adding remarks to bookings table...")
            conn.execute(text("""
                ALTER TABLE bookings 
                ADD COLUMN remarks TEXT AFTER total_amount
            """))
            print("   ✅ remarks column added to bookings table!")
        
        # Check foreign key constraints
        print("\n4. Checking foreign key constraints...")
        
        # Check halls->users foreign key
        result = conn.execute(text("""
            SELECT COUNT(*)
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
            ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
            WHERE tc.TABLE_NAME = 'halls' 
            AND kcu.COLUMN_NAME = 'owner_id'
            AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
        """))
        hall_fk_exists = result.scalar()
        
        if not hall_fk_exists:
            print("   Adding foreign key constraint for halls.owner_id...")
            conn.execute(text("""
                ALTER TABLE halls 
                ADD CONSTRAINT fk_halls_owner 
                FOREIGN KEY (owner_id) REFERENCES users(id)
            """))
            print("   ✅ Halls foreign key constraint added!")
        
        # Check bookings->users foreign key
        result = conn.execute(text("""
            SELECT COUNT(*)
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
            ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
            WHERE tc.TABLE_NAME = 'bookings' 
            AND kcu.COLUMN_NAME = 'user_id'
            AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
        """))
        booking_user_fk_exists = result.scalar()
        
        if not booking_user_fk_exists:
            print("   Adding foreign key constraint for bookings.user_id...")
            conn.execute(text("""
                ALTER TABLE bookings 
                ADD CONSTRAINT fk_bookings_user 
                FOREIGN KEY (user_id) REFERENCES users(id)
            """))
            print("   ✅ Bookings user foreign key constraint added!")
        
        # Check bookings->halls foreign key
        result = conn.execute(text("""
            SELECT COUNT(*)
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
            ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
            WHERE tc.TABLE_NAME = 'bookings' 
            AND kcu.COLUMN_NAME = 'hall_id'
            AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
        """))
        booking_hall_fk_exists = result.scalar()
        
        if not booking_hall_fk_exists:
            print("   Adding foreign key constraint for bookings.hall_id...")
            conn.execute(text("""
                ALTER TABLE bookings 
                ADD CONSTRAINT fk_bookings_hall 
                FOREIGN KEY (hall_id) REFERENCES halls(id)
            """))
            print("   ✅ Bookings hall foreign key constraint added!")
        
        print("\n✅ All table structures verified and fixed!")

if __name__ == "__main__":
    fix_all_tables()