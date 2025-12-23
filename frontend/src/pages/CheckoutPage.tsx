import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeConfig';
import { createPaymentIntent } from '@/services/paymentService';
import StripeCheckoutForm from '@/components/StripeCheckoutForm';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total in cents for Stripe
  const totalWithVAT = Math.round(totalAmount * 1.19 * 100); // Convert to cents

  // Create PaymentIntent when component loads
  useEffect(() => {
    if (items.length > 0 && !clientSecret) {
      setLoadingPaymentIntent(true);
      setError(null);
      createPaymentIntent({
        amount: totalWithVAT,
        currency: 'eur',
        metadata: {
          userId: user?.id.toString() || '',
          companyName: user?.company_name || '',
        },
      })
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          const errorMessage = error.message || 'Failed to initialize payment';
          setError(errorMessage);

          // Check if it's a configuration error
          if (errorMessage.includes('unavailable') || errorMessage.includes('503')) {
            toast.error('Stripe not configured', {
              description: 'Please add your Stripe API keys to the .env files'
            });
          } else {
            toast.error('Payment initialization failed', {
              description: errorMessage
            });
          }
        })
        .finally(() => {
          setLoadingPaymentIntent(false);
        });
    }
  }, [items.length, totalWithVAT, clientSecret, user]);

  const handleStripeSuccess = () => {
    toast.success('Payment successful!', {
      description: 'Thank you for your order'
    });
    clearCart();
    navigate('/dashboard');
  };

  const handleStripeError = (error: string) => {
    toast.error('Payment failed', {
      description: error
    });
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture">
      <header className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link to="/cart">
            <Button className="bg-[#003049] hover:bg-[#003049]/80 text-[#F5F1E8]">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-display text-6xl text-[#F5F1E8] mb-4">
            Secure Checkout
          </h1>
          <p className="text-mono text-xl text-[#F5F1E8]/70 mb-16">
            Complete your payment securely with Stripe
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="bg-[#F5F1E8] rounded-xl p-8 mb-8">
              <h2 className="text-display text-2xl text-[#1A1A1D] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between py-3 border-b border-[#003049]/10">
                    <div>
                      <p className="text-mono font-semibold text-[#1A1A1D]">
                        {item.product.name}
                      </p>
                      <p className="text-mono text-sm text-[#1A1A1D]/60">
                        {item.quantity} {item.product.unit} @ €{item.pricePerUnit.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-mono font-bold text-[#003049]">
                      €{(item.quantity * item.pricePerUnit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t-2 border-[#003049]/20">
                <div className="flex items-center justify-between text-mono">
                  <span className="text-[#1A1A1D]/70">Subtotal</span>
                  <span className="text-[#1A1A1D]">€{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between text-mono">
                  <span className="text-[#1A1A1D]/70">VAT (19%)</span>
                  <span className="text-[#1A1A1D]">€{(totalAmount * 0.19).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#003049]/10">
                  <span className="text-display text-xl text-[#1A1A1D]">Total</span>
                  <span className="text-display text-3xl text-[#003049]">
                    €{(totalAmount * 1.19).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F1E8] rounded-xl p-8">
              <h3 className="text-display text-xl text-[#1A1A1D] mb-4">
                Billing Information
              </h3>
              <div className="space-y-3 text-mono">
                <div>
                  <p className="text-xs text-[#1A1A1D]/60">Company</p>
                  <p className="text-sm font-semibold text-[#1A1A1D]">{user?.company_name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#1A1A1D]/60">Email</p>
                  <p className="text-sm text-[#1A1A1D]">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#1A1A1D]/60">Location</p>
                  <p className="text-sm text-[#1A1A1D]">{user?.country}</p>
                </div>
                {user?.street_address && (
                  <div>
                    <p className="text-xs text-[#1A1A1D]/60">Delivery Address</p>
                    <p className="text-sm text-[#1A1A1D]">
                      {user.street_address}<br />
                      {user.city}, {user.postal_code}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="bg-[#003049] rounded-xl p-8 border-4 border-[#06FFA5] shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-[#06FFA5]" />
                <div>
                  <h2 className="text-display text-2xl text-[#F5F1E8]">
                    Payment Details
                  </h2>
                  <p className="text-mono text-sm text-[#F5F1E8]/60">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>

              {/* Stripe Card Payment */}
              <div>
                {loadingPaymentIntent ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06FFA5] mb-4"></div>
                    <span className="text-[#F5F1E8] text-mono">Initializing secure payment...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-mono text-sm font-semibold text-red-400 mb-2">
                          Payment Configuration Required
                        </p>
                        <p className="text-mono text-xs text-[#F5F1E8]/90 mb-4">
                          {error.includes('unavailable') || error.includes('503')
                            ? 'Stripe API keys need to be configured. Please check the STRIPE_SETUP.md file.'
                            : error
                          }
                        </p>
                        <div className="bg-[#1A1A1D]/50 rounded p-3 text-xs text-[#F5F1E8]/80 text-mono">
                          <p className="mb-2">To fix this:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Get keys from dashboard.stripe.com/test/apikeys</li>
                            <li>Update backend/.env with your secret key</li>
                            <li>Update frontend/.env with your publishable key</li>
                            <li>Restart both servers</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#06FFA5',
                          colorBackground: '#ffffff',
                          colorText: '#1A1A1D',
                          colorDanger: '#ef4444',
                          fontFamily: 'JetBrains Mono, monospace',
                          borderRadius: '8px',
                        },
                      },
                    }}
                  >
                    <StripeCheckoutForm
                      onSuccess={handleStripeSuccess}
                      onError={handleStripeError}
                    />
                  </Elements>
                ) : null}
              </div>

              <div className="mt-6 pt-6 border-t border-[#F5F1E8]/10">
                <p className="text-mono text-xs text-[#F5F1E8]/50 text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
