"""
Database connection and helper functions for WORLD DISTRIBUTION
"""
import sqlite3
from contextlib import contextmanager
from typing import Optional, List, Dict, Any
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "world_distribution.db")


def init_database():
    """Initialize the database with schema"""
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    
    with open(schema_path, 'r') as f:
        schema = f.read()
    
    conn = sqlite3.connect(DATABASE_PATH)
    conn.executescript(schema)
    conn.commit()
    conn.close()
    print(f"✅ Database initialized at {DATABASE_PATH}")


@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def execute_query(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """Execute a SELECT query and return results as list of dicts"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]


def execute_one(query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
    """Execute a SELECT query and return first result as dict"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None


def execute_insert(query: str, params: tuple = ()) -> int:
    """Execute an INSERT query and return the last inserted row ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.lastrowid


def execute_update(query: str, params: tuple = ()) -> int:
    """Execute an UPDATE/DELETE query and return number of affected rows"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.rowcount


# Initialize database on module import if it doesn't exist
if not os.path.exists(DATABASE_PATH):
    init_database()
