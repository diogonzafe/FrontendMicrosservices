import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  name: string;
  price: number;
}

interface Order {
  items: CartItem[];
  total: number;
  date: Date;
  deliveryAddress: string;
}

interface CartContextType {
  cart: CartItem[];
  lastOrder: Order | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  confirmOrder: (deliveryAddress: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const confirmOrder = (deliveryAddress: string) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setLastOrder({
      items: [...cart],
      total,
      date: new Date(),
      deliveryAddress,
    });
    clearCart();
  };

  return (
    <CartContext.Provider value={{ cart, lastOrder, addToCart, removeFromCart, clearCart, confirmOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 