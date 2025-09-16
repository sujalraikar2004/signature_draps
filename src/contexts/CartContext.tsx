import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  quantity: number;
  priceAtAddition: number;
  product?: Product;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getCartTotal: () => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    totalPrice: 0,
    isLoading: false
  });

  // Load cart on component mount
  useEffect(() => {
    getCartTotal();
  }, []);

  const setLoading = (loading: boolean) => {
    setCartState(prev => ({ ...prev, isLoading: loading }));
  };

  const addToCart = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.messege);

      toast.success(data.messege || 'Item added to cart');
      
      // Refresh cart data
      await getCartTotal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart');
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update local state with returned cart data
      if (data.products && data.totalPrice !== undefined) {
        setCartState(prev => ({
          ...prev,
          items: data.products,
          totalPrice: data.totalPrice,
          isLoading: false
        }));
      } else {
        await getCartTotal();
      }

      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item from cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update local state with returned cart data
      if (data.products && data.totalPrice !== undefined) {
        setCartState(prev => ({
          ...prev,
          items: data.products,
          totalPrice: data.totalPrice,
          isLoading: false
        }));
      } else {
        await getCartTotal();
      }

      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
      setLoading(false);
    }
  };

  const getCartTotal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/total', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 404) {
        // Cart not found - user has empty cart
        setCartState({
          items: [],
          totalPrice: 0,
          isLoading: false
        });
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCartState({
        items: data.items || [],
        totalPrice: data.total || 0,
        isLoading: false
      });
    } catch (error: any) {
      // If cart doesn't exist, set empty cart
      setCartState({
        items: [],
        totalPrice: 0,
        isLoading: false
      });
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCartState({
        items: [],
        totalPrice: 0,
        isLoading: false
      });

      toast.success(data.message || 'Cart cleared successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
      setLoading(false);
    }
  };

  const getItemCount = (): number => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartState.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return cartState.items.some(item => item.productId === productId);
  };

  return (
    <CartContext.Provider value={{
      ...cartState,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      clearCart,
      getItemCount,
      getItemQuantity,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};