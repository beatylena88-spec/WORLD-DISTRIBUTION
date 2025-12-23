"""
Authentication utilities for WORLD DISTRIBUTION
"""
import bcrypt
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Cookie, Response
from database import execute_one, execute_insert, execute_update


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_session_id() -> str:
    """Generate a secure random session ID"""
    return secrets.token_urlsafe(32)


def create_session(user_id: int) -> str:
    """Create a new session for a user"""
    session_id = generate_session_id()
    expires_at = datetime.now() + timedelta(days=7)  # 7 day session
    
    execute_insert(
        "INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)",
        (session_id, user_id, expires_at.isoformat())
    )
    
    return session_id


def get_user_from_session(session_id: Optional[str]) -> Optional[dict]:
    """Get user data from session ID"""
    if not session_id:
        return None
    
    # Get session and check if it's expired
    session = execute_one(
        "SELECT * FROM sessions WHERE session_id = ? AND expires_at > ?",
        (session_id, datetime.now().isoformat())
    )
    
    if not session:
        return None
    
    # Get user data
    user = execute_one(
        "SELECT id, email, company_name, country, region FROM users WHERE id = ?",
        (session['user_id'],)
    )
    
    return user


def delete_session(session_id: str):
    """Delete a session (logout)"""
    execute_update("DELETE FROM sessions WHERE session_id = ?", (session_id,))


def cleanup_expired_sessions():
    """Remove expired sessions from database"""
    execute_update(
        "DELETE FROM sessions WHERE expires_at < ?",
        (datetime.now().isoformat(),)
    )


def set_session_cookie(response: Response, session_id: str):
    """Set session cookie in response"""
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )


def clear_session_cookie(response: Response):
    """Clear session cookie"""
    response.delete_cookie(key="session_id")


def require_auth(session_id: Optional[str] = Cookie(None)) -> dict:
    """Dependency to require authentication"""
    user = get_user_from_session(session_id)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
