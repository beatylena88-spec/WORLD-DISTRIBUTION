import { API_URL } from '@/lib/stripeConfig';

interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

interface CreatePaymentIntentParams {
    amount: number; // Amount in cents
    currency?: string;
    metadata?: Record<string, string>;
}

export async function createPaymentIntent({
    amount,
    currency = 'eur',
    metadata = {},
}: CreatePaymentIntentParams): Promise<PaymentIntentResponse> {
    const response = await fetch(`${API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount,
            currency,
            metadata,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create payment intent');
    }

    return response.json();
}
