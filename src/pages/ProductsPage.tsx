import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { products, volumeTiers, calculatePrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductsPage() {
  const location = useLocation();
  const { addItem } = useCart();
  const categoryFilter = location.state?.category;

  const filteredProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products;

  const handleAddToCart = (product: typeof products[0], quantity: number, tier: keyof typeof volumeTiers) => {
    addItem({
      product,
      quantity,
      volumeTier: tier,
      pricePerUnit: calculatePrice(product.basePrice, tier)
    });
    toast.success(`Added ${product.name} to cart`, {
      description: `${quantity}${product.unit} at ${tier} pricing`
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture">
      {/* Header */}
      <header className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button className="bg-[#003049] hover:bg-[#003049]/80 text-[#F5F1E8]">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-display text-2xl text-[#F5F1E8]">
                  {categoryFilter || 'All Products'}
                </h1>
                <p className="text-mono text-sm text-[#F5F1E8]/60 mt-1">
                  {filteredProducts.length} items available
                </p>
              </div>
            </div>
            <Link to="/cart">
              <Button className="bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
