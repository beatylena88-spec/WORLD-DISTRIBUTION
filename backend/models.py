"""
Pydantic models for WORLD DISTRIBUTION API
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# Authentication Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    company_name: str
    country: str
    region: str = "EU"  # Default to EU
    street_address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    company_name: str
    country: str
    region: str
    street_address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None


# Product Models
class Product(BaseModel):
    id: int
    name: str
    category: str
    base_price: float
    unit: str
    stock: int
    description: Optional[str] = None
    image_url: Optional[str] = None


class ProductCreate(BaseModel):
    name: str
    category: str
    base_price: float
    unit: str
    stock: int
    description: Optional[str] = None
    image_url: Optional[str] = None


# Order Models
class OrderItem(BaseModel):
    product_id: int
    quantity: int
    price_per_unit: float
    volume_tier: str


class OrderCreate(BaseModel):
    items: List[OrderItem]
    payment_method: str  # 'card' or 'bank'
    payment_intent_id: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    vat_amount: float
    status: str
    payment_method: str
    created_at: str
    items: List[OrderItem]


# Payment Models (existing)
class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "eur"
    metadata: Optional[dict] = None


class PaymentIntentResponse(BaseModel):
    clientSecret: str
    paymentIntentId: str
