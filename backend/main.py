from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import stripe
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="World Distribution API", version="1.0.0")

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


class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "eur"
    metadata: Optional[dict] = None


class PaymentIntentResponse(BaseModel):
    clientSecret: str
    paymentIntentId: str


@app.get("/")
def read_root():
    return {"message": "World Distribution API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Stripe PaymentIntent for the checkout process.
    Amount should be in cents (e.g., €45.00 = 4500)
    """
    try:
        if not stripe.api_key:
            raise HTTPException(
                status_code=500,
                detail="Stripe API key not configured"
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
    TODO: Implement webhook signature verification and event handling.
    """
    return {"received": True}
