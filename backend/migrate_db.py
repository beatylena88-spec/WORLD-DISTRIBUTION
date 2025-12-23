"""
Database migration script to add delivery address fields to users table
"""
import sqlite3
import shutil
from datetime import datetime

DB_PATH = "world_distribution.db"
BACKUP_PATH = f"world_distribution_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"

def migrate_database():
    """Migrate database to add address fields"""
    print(f"Creating backup at {BACKUP_PATH}...")
    shutil.copy(DB_PATH, BACKUP_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'street_address' in columns:
            print("Address fields already exist. No migration needed.")
            return
        
        print("Adding address fields to users table...")
        
        # Add new columns
        cursor.execute("ALTER TABLE users ADD COLUMN street_address TEXT")
        cursor.execute("ALTER TABLE users ADD COLUMN city TEXT")
        cursor.execute("ALTER TABLE users ADD COLUMN postal_code TEXT")
        cursor.execute("ALTER TABLE users ADD COLUMN phone TEXT")
        
        conn.commit()
        print("✓ Migration completed successfully!")
        
        # Verify
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        print(f"\nUsers table columns: {', '.join(columns)}")
        
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
