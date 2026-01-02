import { Product } from '@/contexts/CartContext';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Olive Oil',
    category: 'Food Commodities',
    basePrice: 45,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
    stock: 5000,
    description: 'Extra virgin olive oil from Mediterranean groves. Ideal for restaurants and food service.'
  },
  {
    id: '2',
    name: 'Basmati Rice',
    category: 'Food Commodities',
    basePrice: 0.4,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    stock: 15000,
    description: 'Premium long-grain basmati rice. Perfect for hotels and restaurant chains.'
  },
  {
    id: '3',
    name: 'Industrial Coffee Beans',
    category: 'Food Commodities',
    basePrice: 0.8,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
    stock: 8000,
    description: 'Premium Arabica coffee beans sourced from sustainable farms worldwide.'
  },
  {
    id: '4',
    name: 'Disposable Gloves',
    category: 'Durable Consumables',
    basePrice: 18,
    unit: 'box',
    image: 'https://images.unsplash.com/photo-1584930330451-7ff79da88cfd?w=800&q=80',
    stock: 20000,
    description: 'Nitrile gloves for food service and hospitality industry. FDA approved.'
  },
  {
    id: '5',
    name: 'Cleaning Supplies Kit',
    category: 'Durable Consumables',
    basePrice: 35,
    unit: 'kit',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80',
    stock: 3000,
    description: 'Commercial-grade cleaning supplies for hospitality and food service operations.'
  },
  {
    id: '6',
    name: 'Organic Pasta',
    category: 'Food Commodities',
    basePrice: 8,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    stock: 12000,
    description: 'Italian organic durum wheat pasta. Bulk quantities for restaurant supply.'
  },
  {
    id: '7',
    name: 'Paper Towels',
    category: 'Durable Consumables',
    basePrice: 22,
    unit: 'case',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80',
    stock: 8500,
    description: 'Industrial paper towels for commercial kitchens and hospitality.'
  },
  {
    id: '8',
    name: 'Sea Salt',
    category: 'Food Commodities',
    basePrice: 15,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1583954369783-07df0e2c6fa7?w=800&q=80',
    stock: 6000,
    description: 'Natural sea salt from Atlantic coast. Food-grade for culinary use.'
  }
];

export const volumeTiers = {
  '100kg': { multiplier: 1, label: '100-499kg' },
  '500kg': { multiplier: 0.85, label: '500-999kg', discount: '15%' },
  '1000kg+': { multiplier: 0.70, label: '1000kg+', discount: '30%' }
};

export const calculatePrice = (basePrice: number, tier: keyof typeof volumeTiers) => {
  return basePrice * volumeTiers[tier].multiplier;
};
