import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useOrders, type PlaceOrderResponse, type PaymentVerificationRequest } from '@/contexts/OrderContext';
import { toast } from 'sonner';

interface RazorpayPaymentProps {
  orderData: PlaceOrderResponse;
  onSuccess: () => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  orderData,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { verifyPayment } = useOrders();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      if (!orderData.razorpayOrder || !orderData.key) {
        throw new Error('Invalid payment data');
      }

      const options = {
        key: orderData.key,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: 'Signature Draps',
        description: `Order ${orderData.order.orderId}`,
        order_id: orderData.razorpayOrder.id,
        handler: async (response: any) => {
          try {
            const verificationData: PaymentVerificationRequest = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              receipt: orderData.order.orderId
            };

            await verifyPayment(verificationData);
            onSuccess();
          } catch (error: any) {
            onError(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: orderData.order.shippingAddress.name,
          contact: orderData.order.shippingAddress.phone,
        },
        theme: {
          color: '#8B5A3C'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            onError('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setIsProcessing(false);
      onError(error.message || 'Failed to initiate payment');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Payment Details</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono">{orderData.order.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">₹{orderData.order.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Mode:</span>
            <span>{orderData.order.paymentMode}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full btn-hero"
        size="lg"
      >
        {isProcessing ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing Payment...
          </>
        ) : (
          `Pay ₹${orderData.order.totalAmount}`
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Secure payment powered by Razorpay
      </p>
    </div>
  );
};

export default RazorpayPayment;
