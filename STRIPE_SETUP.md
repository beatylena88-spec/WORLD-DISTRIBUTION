# ⚠️ STRIPE SETUP REQUIRED

## You're seeing a 503 error because Stripe keys are not configured yet!

### Quick Fix (5 minutes):

1. **Get your Stripe test keys**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Sign in or create a free account

2. **Copy two keys:**
   - Click "Reveal test key" for the Secret key
   - Copy the Publishable key too

3. **Update backend/.env (line 5):**
   ```bash
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
   ```

4. **Update frontend/.env (line 4):**
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY
   ```

5. **Restart both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   # Press Ctrl+C to stop
   ./venv/bin/uvicorn main:app --reload --port 8000

   # Terminal 2 - Frontend  
   cd frontend
   # Press Ctrl+C to stop
   npm run dev
   ```

6. **Test with card:** `4242 4242 4242 4242` (exp: 12/34, cvc: 123)

---

## What Changed

✅ Removed bank transfer option  
✅ Checkout now goes directly to Stripe  
✅ Better error messages showing how to fix  
✅ Shows delivery address if provided  

The checkout page is now **Stripe-only** and much simpler!
