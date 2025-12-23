import { useState } from 'react';
import { Product } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { volumeTiers, calculatePrice } from '@/data/products';
import { Package, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, tier: keyof typeof volumeTiers) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(100);
  const [selectedTier, setSelectedTier] = useState<keyof typeof volumeTiers>('100kg');
  const [imageError, setImageError] = useState(false);

  // Determine tier based on quantity
  const getTierFromQuantity = (qty: number): keyof typeof volumeTiers => {
    if (qty >= 1000) return '1000kg+';
    if (qty >= 500) return '500kg';
    return '100kg';
  };

  const handleQuantityChange = (values: number[]) => {
    const newQty = values[0];
    setQuantity(newQty);
    setSelectedTier(getTierFromQuantity(newQty));
  };

  const currentPrice = calculatePrice(product.basePrice, selectedTier);
  const totalPrice = currentPrice * quantity;

  return (
    <div className="bg-[#F5F1E8] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Image Section - Fixed Height */}
      <div className="aspect-[4/3] overflow-hidden bg-[#1A1A1D]/5 flex items-center justify-center">
        {imageError || !product.image ? (
          <div className="flex flex-col items-center justify-center text-[#1A1A1D]/30">
            <ImageOff className="w-16 h-16 mb-2" />
            <span className="text-mono text-sm">No image available</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content Section - Flex Grow */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-display text-xl text-[#1A1A1D] mb-2">
              {product.name}
            </h3>
            <Badge className="bg-[#003049] text-[#F5F1E8] text-xs">
              {product.category}
            </Badge>
          </div>
          <div className="flex flex-col items-end gap-1 ml-2">
            <div className="flex items-center gap-1 text-mono text-xs text-[#1A1A1D]/60">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-mono text-xs font-semibold text-[#06FFA5]">
              In Stock: {product.stock}
            </span>
          </div>
        </div>

        <p className="text-mono text-sm text-[#1A1A1D]/70 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Volume Tier Slider */}
        <div className="space-y-3 mb-4 p-4 bg-white rounded-lg border border-[#003049]/10">
          <div className="flex items-center justify-between">
            <span className="text-mono text-sm font-semibold text-[#1A1A1D]">
              Volume:
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 100;
                  setQuantity(val);
                  setSelectedTier(getTierFromQuantity(val));
                }}
                min={100}
                max={2000}
                className="w-24 h-8 text-mono text-right"
              />
              <span className="text-mono text-sm text-[#1A1A1D]/60">
                {product.unit}
              </span>
            </div>
          </div>

          <Slider
            value={[quantity]}
            onValueChange={handleQuantityChange}
            min={100}
            max={2000}
            step={50}
            className="w-full"
          />

          {/* Tier Indicators */}
          <div className="grid grid-cols-3 gap-2 text-xs text-mono">
            <div className={`text-center p-2 rounded ${selectedTier === '100kg' ? 'bg-[#003049] text-[#F5F1E8]' : 'bg-[#1A1A1D]/5 text-[#1A1A1D]/60'}`}>
              <div className="font-bold">100-499kg</div>
              <div className="text-[10px] mt-1">Base Price</div>
            </div>
            <div className={`text-center p-2 rounded ${selectedTier === '500kg' ? 'bg-[#003049] text-[#F5F1E8]' : 'bg-[#1A1A1D]/5 text-[#1A1A1D]/60'}`}>
              <div className="font-bold">500-999kg</div>
              <div className="text-[10px] mt-1">-15%</div>
            </div>
            <div className={`text-center p-2 rounded ${selectedTier === '1000kg+' ? 'bg-[#003049] text-[#F5F1E8]' : 'bg-[#1A1A1D]/5 text-[#1A1A1D]/60'}`}>
              <div className="font-bold">1000kg+</div>
              <div className="text-[10px] mt-1">-30%</div>
            </div>
          </div>
        </div>

        {/* Pricing - Pushed to bottom */}
        <div className="mt-auto">
          <div className="mb-4 p-4 bg-[#003049] rounded-lg">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-mono text-sm text-[#F5F1E8]/70">
                Price per {product.unit}:
              </span>
              <span className="text-display text-2xl text-[#06FFA5]">
                €{currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-2 border-t border-[#F5F1E8]/10">
              <span className="text-mono text-sm font-semibold text-[#F5F1E8]">
                Total:
              </span>
              <span className="text-display text-3xl text-[#F5F1E8]">
                €{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onAddToCart(product, quantity, selectedTier)}
            className="w-full bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] font-bold py-6 text-base transition-all hover:scale-[0.98]"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
