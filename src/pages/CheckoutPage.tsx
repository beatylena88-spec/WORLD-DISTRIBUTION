import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, AlertTriangle, Globe, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const paymentAccounts = {
  EU: {
    name: 'Olky B.V.',
    iban: 'NL89ABNA0417164300',
    swift: 'ABNANL2A',
    type: 'SEPA',
    region: 'European Union',
    compatible: ['Germany', 'France', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Austria']
  },
  INTERNATIONAL: {
    name: 'B Partner GmbH',
    iban: 'DE89370400440532013000',
    swift: 'COBADEFFXXX',
    type: 'SWIFT',
    region: 'International',
    compatible: ['United States', 'United Kingdom', 'Switzerland', 'Canada', 'Australia']
  }
};

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Auto-select payment account based on user location
  const selectedAccount = user?.location.region === 'EU' 
    ? paymentAccounts.EU 
    : paymentAccounts.INTERNATIONAL;

  const isCompatible = selectedAccount.compatible.includes(user?.location.country || '');

  const handlePlaceOrder = async () => {
    if (!isCompatible) {
      toast.error('Payment method not compatible with your location');
      return;
    }

    setProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Order placed successfully!', {
      description: 'Invoice will be sent to your email'
    });
    
    clearCart();
    navigate('/dashboard');
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
            <Button variant="outline" className="border-[#F5F1E8]/20 text-[#F5F1E8] hover:bg-[#F5F1E8]/10">
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
            Checkout
          </h1>
          <p className="text-mono text-xl text-[#F5F1E8]/70 mb-16">
            Review your order and complete payment
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
                Client Information
              </h3>
              <div className="space-y-3 text-mono">
                <div>
                  <p className="text-xs text-[#1A1A1D]/60">Company</p>
                  <p className="text-sm font-semibold text-[#1A1A1D]">{user?.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#1A1A1D]/60">Email</p>
                  <p className="text-sm text-[#1A1A1D]">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#1A1A1D]/60">Location</p>
                  <p className="text-sm text-[#1A1A1D]">{user?.location.country}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Routing Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4, type: 'spring', stiffness: 100 }}
          >
            <div className="bg-[#003049] rounded-xl p-8 border-4 border-[#06FFA5] shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-[#06FFA5]" />
                <div>
                  <h2 className="text-display text-2xl text-[#F5F1E8]">
                    Payment Routing
                  </h2>
                  <p className="text-mono text-sm text-[#F5F1E8]/60">
                    Auto-selected based on your location
                  </p>
                </div>
              </div>

              {/* Banking Compliance Widget */}
              <div className="bg-[#F5F1E8]/10 backdrop-blur-xl rounded-lg p-6 mb-6 border border-[#06FFA5]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#06FFA5]" />
                    <span className="text-mono font-semibold text-[#F5F1E8]">
                      {selectedAccount.name}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedAccount.type === 'SEPA' 
                      ? 'bg-[#06FFA5] text-[#1A1A1D]' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {selectedAccount.type}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-mono text-xs text-[#F5F1E8]/60 mb-1">IBAN</p>
                    <p className="text-mono text-lg font-bold text-[#06FFA5] tracking-wider">
                      {selectedAccount.iban}
                    </p>
                  </div>
                  <div>
                    <p className="text-mono text-xs text-[#F5F1E8]/60 mb-1">SWIFT/BIC</p>
                    <p className="text-mono text-sm text-[#F5F1E8]">
                      {selectedAccount.swift}
                    </p>
                  </div>
                  <div>
                    <p className="text-mono text-xs text-[#F5F1E8]/60 mb-1">Region</p>
                    <p className="text-mono text-sm text-[#F5F1E8]">
                      {selectedAccount.region}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compatibility Check */}
              {isCompatible ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-mono text-sm font-semibold text-green-400 mb-1">
                        Payment Method Compatible
                      </p>
                      <p className="text-mono text-xs text-[#F5F1E8]/80">
                        This IBAN is compatible with your bank location ({user?.location.country})
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-mono text-sm font-semibold text-red-400 mb-1">
                        Incompatible Payment Method
                      </p>
                      <p className="text-mono text-xs text-[#F5F1E8]/80">
                        This IBAN may not be compatible with your bank location. Please contact support.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handlePlaceOrder}
                disabled={processing || !isCompatible}
                className="w-full bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold py-6 text-base transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing Order...' : 'Place Order'}
              </Button>

              <p className="text-mono text-xs text-[#F5F1E8]/50 mt-4 text-center">
                Invoice with payment details will be generated after order confirmation
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
