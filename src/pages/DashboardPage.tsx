import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogOut, Package, Utensils, Boxes, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const categories = [
    {
      name: 'Food Commodities',
      icon: Utensils,
      count: products.filter(p => p.category === 'Food Commodities').length,
      totalStock: products.filter(p => p.category === 'Food Commodities').reduce((sum, p) => sum + p.stock, 0),
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80'
    },
    {
      name: 'Durable Consumables',
      icon: Boxes,
      count: products.filter(p => p.category === 'Durable Consumables').length,
      totalStock: products.filter(p => p.category === 'Durable Consumables').reduce((sum, p) => sum + p.stock, 0),
      image: 'https://images.unsplash.com/photo-1580982172477-9373ff52ae43?w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-3xl text-[#F5F1E8]">
                WORLD DISTRIBUTION
              </h1>
              <p className="text-mono text-sm text-[#F5F1E8]/60 mt-1">
                Welcome back, <span className="text-[#06FFA5]">{user?.companyName}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/cart">
                <Button className="bg-[#003049] hover:bg-[#003049]/90 text-[#F5F1E8] relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#06FFA5] text-[#1A1A1D] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Button 
                onClick={logout}
                className="bg-[#D62828] hover:bg-[#D62828]/80 text-[#F5F1E8]"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-display text-6xl text-[#F5F1E8] mb-4">
            Product Categories
          </h2>
          <p className="text-mono text-xl text-[#F5F1E8]/70 mb-16 max-w-2xl">
            Browse our extensive catalog of wholesale commodities and consumables. 
            <span className="text-[#06FFA5]"> Live inventory tracking</span> for enterprise buyers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.08), duration: 0.4 }}
              >
                <Link to="/products" state={{ category: category.name }}>
                  <div className="group relative overflow-hidden rounded-2xl bg-[#F5F1E8] hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-8 h-8 text-[#003049]" />
                            <h3 className="text-display text-3xl text-[#1A1A1D]">
                              {category.name}
                            </h3>
                          </div>
                          <p className="text-mono text-sm text-[#1A1A1D]/60">
                            {category.count} products available
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#003049]/10">
                        <div className="text-mono">
                          <p className="text-xs text-[#1A1A1D]/60">Live Inventory</p>
                          <p className="text-2xl font-bold text-[#003049]">
                            {category.totalStock.toLocaleString()}
                          </p>
                        </div>
                        <Button className="bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold">
                          Browse →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Link to="/products">
            <div className="bg-[#003049] rounded-xl p-8 hover:bg-[#003049]/90 transition-all hover:scale-[1.02] border border-[#06FFA5]/20">
              <Package className="w-12 h-12 text-[#06FFA5] mb-4" />
              <h3 className="text-display text-2xl text-[#F5F1E8] mb-2">
                View All Products
              </h3>
              <p className="text-mono text-sm text-[#F5F1E8]/70">
                Browse complete product catalog with bulk pricing
              </p>
            </div>
          </Link>

          <Link to="/quote">
            <div className="bg-[#003049] rounded-xl p-8 hover:bg-[#003049]/90 transition-all hover:scale-[1.02] border border-[#06FFA5]/20">
              <FileText className="w-12 h-12 text-[#06FFA5] mb-4" />
              <h3 className="text-display text-2xl text-[#F5F1E8] mb-2">
                Request Custom Quote
              </h3>
              <p className="text-mono text-sm text-[#F5F1E8]/70">
                Submit specifications for custom bulk orders
              </p>
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
