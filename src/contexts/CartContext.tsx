import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  image: string;
  stock: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  volumeTier: '100kg' | '500kg' | '1000kg+';
  pricePerUnit: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === item.product.id);
      if (existing) {
        return prev.map(i => 
          i.product.id === item.product.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => 
      prev.map(i => 
        i.product.id === productId 
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
