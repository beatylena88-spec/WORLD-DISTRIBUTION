import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { volumeTiers, calculatePrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Product {
  id: number;
  name: string;
  category: string;
  base_price: number;
  unit: string;
  stock: number;
  description: string;
  image_url: string;
}

export default function ProductsPage() {
  const location = useLocation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const categoryFilter = location.state?.category;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const fetchProducts = async () => {
    try {
      const url = categoryFilter
        ? `${API_URL}/api/products?category=${encodeURIComponent(categoryFilter)}`
        : `${API_URL}/api/products`;

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, quantity: number, tier: keyof typeof volumeTiers) => {
    addItem({
      product: {
        id: product.id.toString(),
        name: product.name,
        category: product.category,
        basePrice: product.base_price,
        unit: product.unit,
        stock: product.stock,
        description: product.description,
        image: product.image_url
      },
      quantity,
      volumeTier: tier,
      pricePerUnit: calculatePrice(product.base_price, tier)
    });
    toast.success(`Added ${product.name} to cart`, {
      description: `${quantity}${product.unit} at ${tier} pricing`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1D] flex items-center justify-center text-[#F5F1E8]">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture">
      {/* Header */}
      <header className="bg-[#1A1A1D] border-b border-[#F5F1E8]/10 grid-pattern sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/products"}>
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
                  {products.length} items available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <Link to="/login">
                  <Button className="bg-[#003049] hover:bg-[#003049]/80 text-[#F5F1E8]">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
              <Link to="/cart">
                <Button className="bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <ProductCard
                product={{
                  id: product.id.toString(),
                  name: product.name,
                  category: product.category,
                  basePrice: product.base_price,
                  unit: product.unit,
                  stock: product.stock,
                  description: product.description,
                  image: product.image_url
                }}
                onAddToCart={(prod, qty, tier) => handleAddToCart(product, qty, tier)}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
