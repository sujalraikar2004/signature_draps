import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import api from '@/Api';

interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderProduct {
  productId: string;
  name: string;
  image: string | null;
  description?: string;
  quantity: number;
  priceAtPurchase: number;
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
      unit?: string;
    };
    calculatedPrice?: number;
    notes?: string;
  };
}

interface Order {
  _id: string;
  userId: string;
  orderId: string;
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMode: 'ONLINE' | 'COD';
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

interface PlaceOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMode: 'ONLINE' | 'COD';
}

interface PlaceOrderResponse {
  success: boolean;
  message: string;
  order: Order;
  razorpayOrder?: RazorpayOrder;
  key?: string;
}

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  receipt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
}

interface OrderContextType extends OrderState {
  placeOrder: (orderData: PlaceOrderRequest) => Promise<PlaceOrderResponse>;
  verifyPayment: (paymentData: PaymentVerificationRequest) => Promise<void>;
  getUserOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<void>;
  createRazorpayOrder: (orderId: string) => Promise<any>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderState, setOrderState] = useState<OrderState>({
    orders: [],
    currentOrder: null,
    isLoading: false
  });

  const setLoading = (loading: boolean) => {
    setOrderState(prev => ({ ...prev, isLoading: loading }));
  };

  const placeOrder = async (orderData: PlaceOrderRequest): Promise<PlaceOrderResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOrderState(prev => ({
        ...prev,
        currentOrder: data.order,
        isLoading: false
      }));

      toast.success(data.message || 'Order placed successfully');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      setLoading(false);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: PaymentVerificationRequest) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOrderState(prev => ({
        ...prev,
        currentOrder: data.order,
        isLoading: false
      }));

      toast.success(data.message || 'Payment verified successfully');
    } catch (error: any) {
      toast.error(error.message || 'Payment verification failed');
      setLoading(false);
      throw error;
    }
  };

  const getUserOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('orders/my-orders');

      
      if (!response.data.success) throw new Error(response.data.message || 'Failed to fetch orders');

      setOrderState(prev => ({
        ...prev,
        orders: response.data.orders || [],
        isLoading: false
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const getOrderById = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOrderState(prev => ({
        ...prev,
        currentOrder: data,
        isLoading: false
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch order details');
      setLoading(false);
    }
  };

  const createRazorpayOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/payments/razorpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create Razorpay order');
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{
      ...orderState,
      placeOrder,
      verifyPayment,
      getUserOrders,
      getOrderById,
      createRazorpayOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

// Export types for use in components
export type { 
  Order, 
  ShippingAddress, 
  PlaceOrderRequest, 
  PlaceOrderResponse, 
  PaymentVerificationRequest 
};
