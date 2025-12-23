from fastapi import FastAPI, HTTPException, Depends, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import stripe
import os
from dotenv import load_dotenv

# Import our modules
from models import (
    UserRegister, UserLogin, UserResponse,
    Product, OrderCreate, OrderResponse, OrderItem,
    PaymentIntentRequest, PaymentIntentResponse
)
from database import execute_query, execute_one, execute_insert
from auth import (
    hash_password, verify_password, create_session, get_user_from_session,
    delete_session, set_session_cookie, clear_session_cookie, require_auth
)

load_dotenv()

app = FastAPI(title="World Distribution API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================

@app.get("/")
def read_root():
    return {
        "message": "World Distribution API",
        "version": "2.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserRegister, response: Response):
    """Register a new user"""
    # Check if user already exists
    existing_user = execute_one(
        "SELECT id FROM users WHERE email = ?",
        (user_data.email,)
    )
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    password_hash = hash_password(user_data.password)
    user_id = execute_insert(
        """INSERT INTO users (email, password_hash, company_name, country, region, 
           street_address, city, postal_code, phone)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_data.email, password_hash, user_data.company_name,
         user_data.country, user_data.region, user_data.street_address,
         user_data.city, user_data.postal_code, user_data.phone)
    )
    
    # Create session
    session_id = create_session(user_id)
    set_session_cookie(response, session_id)
    
    return UserResponse(
        id=user_id,
        email=user_data.email,
        company_name=user_data.company_name,
        country=user_data.country,
        region=user_data.region,
        street_address=user_data.street_address,
        city=user_data.city,
        postal_code=user_data.postal_code,
        phone=user_data.phone
    )


@app.post("/api/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin, response: Response):
    """Login user and create session"""
    # Get user from database
    user = execute_one(
        "SELECT * FROM users WHERE email = ?",
        (credentials.email,)
    )
    
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create session
    session_id = create_session(user['id'])
    set_session_cookie(response, session_id)
    
    return UserResponse(
        id=user['id'],
        email=user['email'],
        company_name=user['company_name'],
        country=user['country'],
        region=user['region'],
        street_address=user.get('street_address'),
        city=user.get('city'),
        postal_code=user.get('postal_code'),
        phone=user.get('phone')
    )


@app.post("/api/auth/logout")
async def logout(response: Response, session_id: Optional[str] = Cookie(None)):
    """Logout user and clear session"""
    if session_id:
        delete_session(session_id)
    clear_session_cookie(response)
    return {"message": "Logged out successfully"}


@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user(session_id: Optional[str] = Cookie(None)):
    """Get current user from session"""
    user = get_user_from_session(session_id)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return UserResponse(**user)


# ============================================================================
# PRODUCT ENDPOINTS (PUBLIC)
# ============================================================================

@app.get("/api/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    """Get all products (public endpoint)"""
    if category:
        products = execute_query(
            "SELECT * FROM products WHERE category = ? ORDER BY name",
            (category,)
        )
    else:
        products = execute_query("SELECT * FROM products ORDER BY category, name")
    
    return [Product(**p) for p in products]


@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get single product by ID (public endpoint)"""
    product = execute_one("SELECT * FROM products WHERE id = ?", (product_id,))
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**product)


# ============================================================================
# ORDER ENDPOINTS (PROTECTED)
# ============================================================================

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    user: dict = Depends(require_auth)
):
    """Create a new order (requires authentication)"""
    # Calculate totals
    total_amount = sum(
        item.quantity * item.price_per_unit
        for item in order_data.items
    )
    vat_amount = total_amount * 0.19
    
    # Create order
    order_id = execute_insert(
        """INSERT INTO orders (user_id, total_amount, vat_amount, status, payment_method, payment_intent_id)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (user['id'], total_amount, vat_amount, 'pending',
         order_data.payment_method, order_data.payment_intent_id)
    )
    
    # Create order items
    for item in order_data.items:
        execute_insert(
            """INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, volume_tier)
               VALUES (?, ?, ?, ?, ?)""",
            (order_id, item.product_id, item.quantity, item.price_per_unit, item.volume_tier)
        )
    
    return OrderResponse(
        id=order_id,
        user_id=user['id'],
        total_amount=total_amount,
        vat_amount=vat_amount,
        status='pending',
        payment_method=order_data.payment_method,
        created_at="",  # Will be set by database
        items=order_data.items
    )


@app.get("/api/orders", response_model=List[OrderResponse])
async def get_user_orders(user: dict = Depends(require_auth)):
    """Get all orders for current user"""
    orders = execute_query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        (user['id'],)
    )
    
    result = []
    for order in orders:
        # Get order items
        items = execute_query(
            "SELECT * FROM order_items WHERE order_id = ?",
            (order['id'],)
        )
        
        result.append(OrderResponse(
            id=order['id'],
            user_id=order['user_id'],
            total_amount=order['total_amount'],
            vat_amount=order['vat_amount'],
            status=order['status'],
            payment_method=order['payment_method'],
            created_at=order['created_at'],
            items=[OrderItem(**item) for item in items]
        ))
    
    return result


# ============================================================================
# PAYMENT ENDPOINTS
# ============================================================================

@app.post("/api/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Stripe PaymentIntent for the checkout process.
    Amount should be in cents (e.g., €45.00 = 4500)
    """
    try:
        if not stripe.api_key or stripe.api_key == "sk_test_your_secret_key_here":
            raise HTTPException(
                status_code=503,
                detail="Payment processing is currently unavailable. Please contact support or try bank transfer."
            )

        payment_intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            metadata=request.metadata or {},
            automatic_payment_methods={"enabled": True},
        )

        return PaymentIntentResponse(
            clientSecret=payment_intent.client_secret,
            paymentIntentId=payment_intent.id
        )

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/webhook")
async def stripe_webhook():
    """
    Stripe webhook endpoint for handling payment events.
    In production, this would verify webhook signatures and update order status.
    """
    return {"received": True}
