import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Backend API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
