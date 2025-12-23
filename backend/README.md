# World Distribution Backend

FastAPI backend for Stripe payment processing.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your Stripe secret key
```

4. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/api/create-payment-intent` | Create Stripe PaymentIntent |

## Environment Variables

- `STRIPE_SECRET_KEY` - Your Stripe secret key (required)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (optional)
