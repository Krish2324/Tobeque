import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type Product } from '../components/ProductCard';

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  cartCount: number;
  wishlistItems: Product[];
  setWishlistItems: React.Dispatch<React.SetStateAction<Product[]>>;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productName: string) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (prod: Product | null) => void;
  updateCartItemQty: (cartId: string, qty: number) => void;
  updateCartItemSize: (cartId: string, size: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `${item.id}-${Date.now()}`;
    const newItem: CartItem = { ...item, cartId };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((p) => p.name === product.name);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productName: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.name !== productName));
  };

  const updateCartItemQty = (cartId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const updateCartItemSize = (cartId: string, selectedSize: string) => {
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, selectedSize } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        cart,
        addToCart,
        removeFromCart,
        cartCount,
        wishlistItems,
        setWishlistItems,
        addToWishlist,
        removeFromWishlist,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutProduct,
        setCheckoutProduct,
        updateCartItemQty,
        updateCartItemSize,
        clearCart
      }}
    >
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
