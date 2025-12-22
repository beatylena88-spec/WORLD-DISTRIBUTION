import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A1A1D] noise-texture">
        <header className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link to="/dashboard">
              <Button variant="outline" className="border-[#F5F1E8]/20 text-[#F5F1E8] hover:bg-[#F5F1E8]/10">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-[#F5F1E8]/20 mx-auto mb-6" />
            <h2 className="text-display text-4xl text-[#F5F1E8] mb-4">
              Your cart is empty
            </h2>
            <p className="text-mono text-[#F5F1E8]/60 mb-8">
              Start adding products to your bulk order
            </p>
            <Link to="/products">
              <Button className="bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold">
                Browse Products
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture">
      <header className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/products">
                <Button variant="outline" className="border-[#F5F1E8]/20 text-[#F5F1E8] hover:bg-[#F5F1E8]/10">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <div>
                <h1 className="text-display text-2xl text-[#F5F1E8]">
                  Shopping Cart
                </h1>
                <p className="text-mono text-sm text-[#F5F1E8]/60 mt-1">
                  {items.length} items in cart
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="border-[#F5F1E8]/20 text-[#F5F1E8] hover:bg-[#F5F1E8]/10"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="bg-[#F5F1E8] rounded-xl p-6 flex gap-6"
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-display text-xl text-[#1A1A1D]">
                        {item.product.name}
                      </h3>
                      <p className="text-mono text-sm text-[#1A1A1D]/60">
                        {item.product.category}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-mono text-xs text-[#1A1A1D]/60 mb-1">
                        Volume Tier
                      </p>
                      <p className="text-mono text-sm font-semibold text-[#003049]">
                        {item.volumeTier}
                      </p>
                    </div>
                    <div>
                      <p className="text-mono text-xs text-[#1A1A1D]/60 mb-1">
                        Quantity
                      </p>
                      <p className="text-mono text-sm font-semibold text-[#003049]">
                        {item.quantity} {item.product.unit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#003049]/10 flex items-center justify-between">
                    <div>
                      <p className="text-mono text-xs text-[#1A1A1D]/60">
                        Price per {item.product.unit}
                      </p>
                      <p className="text-mono text-sm text-[#1A1A1D]">
                        €{item.pricePerUnit.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-mono text-xs text-[#1A1A1D]/60">
                        Subtotal
                      </p>
                      <p className="text-display text-2xl text-[#003049]">
                        €{(item.pricePerUnit * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#003049] rounded-xl p-8 sticky top-24">
              <h3 className="text-display text-2xl text-[#F5F1E8] mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-[#F5F1E8]/10">
                <div className="flex items-center justify-between text-mono">
                  <span className="text-[#F5F1E8]/70">Subtotal</span>
                  <span className="text-[#F5F1E8]">€{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between text-mono">
                  <span className="text-[#F5F1E8]/70">Estimated VAT</span>
                  <span className="text-[#F5F1E8]">€{(totalAmount * 0.19).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-8">
                <span className="text-display text-xl text-[#F5F1E8]">
                  Total
                </span>
                <span className="text-display text-4xl text-[#06FFA5]">
                  €{(totalAmount * 1.19).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Link to="/checkout">
                <Button className="w-full bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold py-6 text-base transition-all hover:scale-[0.98]">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-mono text-xs text-[#F5F1E8]/60 mt-4 text-center">
                Secure payment routing enabled
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
