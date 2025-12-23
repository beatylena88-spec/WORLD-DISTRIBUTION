import { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StripeCheckoutFormProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

export default function StripeCheckoutForm({
    onSuccess,
    onError,
}: StripeCheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message || 'An unexpected error occurred.');
            onError(error.message || 'Payment failed');
            setIsProcessing(false);
        } else {
            // Payment succeeded
            setMessage('Payment successful!');
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {message && (
                <div
                    className={`flex items-center gap-2 p-4 rounded-lg ${message.includes('successful')
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                >
                    {message.includes('successful') ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{message}</span>
                </div>
            )}

            <Button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold py-6 text-base transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    'Pay Now'
                )}
            </Button>

            <p className="text-mono text-xs text-[#F5F1E8]/50 text-center">
                Your payment is secured by Stripe
            </p>
        </form>
    );
}
