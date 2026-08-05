import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Product } from '../components/ProductCard';

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface AppliedCoupon {
  code: string;
  discountValue: number;
  type: string;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  activeCartTab: 'cart' | 'wishlist';
  setActiveCartTab: (tab: 'cart' | 'wishlist') => void;
  openWishlistDrawer: () => void;
  wishlistPulseTrigger: number;
  triggerWishlistPulse: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  cartCount: number;
  wishlistItems: Product[];
  setWishlistItems: React.Dispatch<React.SetStateAction<Product[]>>;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productName: string) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (prod: Product | null) => void;
  updateCartItemQty: (cartId: string, qty: number) => void;
  updateCartItemSize: (cartId: string, size: string) => void;
  clearCart: () => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tobeque_cart_data_v2';

const WISHLIST_STORAGE_KEY = 'tobeque_wishlist_data_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCartTab, setActiveCartTab] = useState<'cart' | 'wishlist'>('cart');
  const [wishlistPulseTrigger, setWishlistPulseTrigger] = useState(0);

  const openWishlistDrawer = () => {
    setActiveCartTab('wishlist');
    setIsCartOpen(true);
  };

  const triggerWishlistPulse = () => {
    setWishlistPulseTrigger(prev => prev + 1);
  };
  
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // FORCE CLEAR STALE CARTS: If any item is missing taxRate, drop the cart so the user has to re-add it.
        const hasStaleItems = parsedCart.some((item: any) => item.taxRate === undefined);
        if (hasStaleItems) {
          localStorage.removeItem(CART_STORAGE_KEY);
          return [];
        }
        return parsedCart;
      }
    } catch (err) {
      console.error('Failed to parse cart from localStorage', err);
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Initialize wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        return JSON.parse(savedWishlist);
      }
    } catch (err) {
      console.error('Failed to parse wishlist from localStorage', err);
    }
    return [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

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
      const exists = prev.find((p) => (p.id && product.id && String(p.id) === String(product.id)) || p.name === product.name);
      if (exists) return prev;
      return [...prev, product];
    });
    setWishlistPulseTrigger(prev => prev + 1);
  };

  const removeFromWishlist = (productIdentifier: string) => {
    setWishlistItems((prev) => prev.filter((p) => String(p.id) !== String(productIdentifier) && p.name !== productIdentifier));
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
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        activeCartTab,
        setActiveCartTab,
        openWishlistDrawer,
        wishlistPulseTrigger,
        triggerWishlistPulse,
        cart,
        addToCart,
        removeFromCart,
        cartCount,
        wishlistItems,
        setWishlistItems,
        addToWishlist,
        removeFromWishlist,
        checkoutProduct,
        setCheckoutProduct,
        updateCartItemQty,
        updateCartItemSize,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon
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
