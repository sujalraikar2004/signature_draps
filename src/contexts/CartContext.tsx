import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';
import api from '../Api';

export interface CartItem {
  _id?: string; // MongoDB subdocument ID
  productId: Product; // Populated from backend
  quantity: number;
  priceAtAddition: number;
  selectedSizeVariant?: {
    variantId: string;
    name: string;
    dimensions: {
      length?: number;
      width?: number;
      height?: number;
      unit: string;
    };
    price: number;
  };
  customSize?: {
    isCustom: boolean;
    measurements: {
      length?: number;
      width?: number;
      height?: number;
      area?: number;
      diameter?: number;
      unit: string;
    };
    calculatedPrice?: number;
    notes?: string;
  };
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  isLoading: boolean;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity: number, selectedSizeVariant?: any, customSize?: any) => Promise<void>;
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

  const addToCart = async (productId: string, quantity: number, selectedSizeVariant?: any, customSize?: any) => {
    setLoading(true);
    try {
      const requestBody: any = { productId, quantity };
      
      // Add size data if provided
      if (selectedSizeVariant) {
        requestBody.selectedSizeVariant = selectedSizeVariant;
      }
      if (customSize) {
        requestBody.customSize = customSize;
      }
      
      const response = await api.post('cart/add', requestBody);

   
      if (!response) throw new Error(response.data.message || response.data.messege);

      toast.success(response.data.messege || 'Item added to cart');
      
   
      await getCartTotal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart');
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    console.log(productId)
    setLoading(true);
    try {
      const response = await api.delete(`/cart/remove/${productId}`);

      if (!response) throw new Error(response.data.message);

     
      if (response.data.products && response.data.totalPrice !== undefined) {
        setCartState(prev => ({
          ...prev,
          items: response.data.products,
          totalPrice: response.data.totalPrice,
          isLoading: false
        }));
      } else {
        await getCartTotal();
      }
   
         getCartTotal();
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item from cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    console.log(productId)
    if (quantity <= 0) {
      await removeFromCart(productId);

      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/cart/update',{ productId, quantity });

 
      if (!response) throw new Error(response.data.message);

      // Update local state with returned cart data
      if (response.data.products && response.data.totalPrice !== undefined) {
        setCartState(prev => ({
          ...prev,
          items: response.data.products,
          totalPrice: response.data.totalPrice,
          isLoading: false
        }));
      } else {
        await getCartTotal();
      }
         getCartTotal();
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
      setLoading(false);
    }
  };

  const getCartTotal = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart/total');
      console.log(response.data)
      if (response.status === 404) {

        setCartState({
          items: [],
          totalPrice: 0,
          isLoading: false
        });
        return;
      }

      if (!response) throw new Error(response.data.message);

      setCartState({
        items: response.data.items || [],
        totalPrice: response.data.total || 0,
        isLoading: false
      });
    } catch (error: any) {
     
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
      const response = await api.delete('/cart/clear');


      if (!response) throw new Error(response.data.message);

      setCartState({
        items: [],
        totalPrice: 0,
        isLoading: false
      });

      toast.success(response.data.message || 'Cart cleared successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
      setLoading(false);
    }
  };

  const getItemCount = (): number => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartState.items.find(item => item.productId._id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return cartState.items.some(item => item.productId._id === productId);
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