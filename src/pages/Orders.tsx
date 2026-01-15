import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckCircle, XCircle, Package, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { downloadInvoice } from '@/utils/generateInvoice';
import { useToast } from '@/hooks/use-toast';
import api from '@/Api';

export default function Orders() {
  const { isAuthenticated, user } = useAuth();
  const { orders, getUserOrders, isLoading } = useOrders();
  const { toast } = useToast();
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) getUserOrders();
  }, []);

  const handleDownloadInvoice = (order: any) => {
    console.log('Download invoice clicked for order:', order.orderId);
    console.log('Order data:', order);
    console.log('User data:', user);
    
    if (order.paymentStatus !== 'PAID') {
      toast({
        title: 'Cannot Download Invoice',
        description: 'Invoice can only be downloaded for paid orders.',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Starting invoice generation...');
      const userInfo = { 
        email: user?.email || '', 
        username: user?.username || '' 
      };
      console.log('User info for invoice:', userInfo);
      
      downloadInvoice(order, userInfo);
      
      console.log('Invoice generated successfully');
      toast({
        title: 'Invoice Downloaded',
        description: `Invoice for order #${order.orderId} has been downloaded successfully.`,
      });
    } catch (error: any) {
      console.error('Download invoice error:', error);
      console.error('Error stack:', error.stack);
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to generate invoice. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEmailInvoice = async (order: any) => {
    if (order.paymentStatus !== 'PAID') {
      toast({
        title: 'Cannot Send Invoice',
        description: 'Invoice can only be sent for paid orders.',
        variant: 'destructive'
      });
      return;
    }

    setSendingEmail(order.orderId);
    try {
      const response = await api.post(`/order/${order.orderId}/send-invoice`);
      
      if (response.data.success) {
        toast({
          title: 'Invoice Sent',
          description: `Invoice has been sent to ${user?.email}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Failed to Send Invoice',
        description: error.response?.data?.message || 'Failed to send invoice email. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSendingEmail(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-20 text-center">
          <Package className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-heading font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            You need to log in to view your orders.
          </p>
          <Button className="btn-hero" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-20 text-center">
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-20 text-center">
          <Package className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-heading font-bold mb-4">No Orders Found</h1>
          <p className="text-muted-foreground mb-6">
            You haven’t placed any orders yet. Start shopping to find something you love!
          </p>
          <Button className="btn-hero" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container-premium py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 px-2 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold mb-1 tracking-tight">My Orders</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed in total
            </p>
          </div>
          
        </div>

        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Desktop Header */}
              <div className="hidden sm:flex items-center justify-between p-4 bg-muted/30 border-b border-border/50">
                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider mb-1">Order Placed</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider mb-1">Total Amount</p>
                    <p className="font-medium text-primary">₹{(order.totalAmount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider mb-1">Ship To</p>
                    <p className="font-medium underline decoration-dotted cursor-help">{order.shippingAddress.fullName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider mb-1">Order ID #{order.orderId}</p>
                  
                </div>
              </div>

              {/* Mobile Header (Simplified) */}
              <div className="sm:hidden p-4 border-b border-border/40 flex justify-between items-center bg-muted/10">
                <div>
                  <p className="font-bold text-sm"># {order.orderId}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    order.orderStatus === 'DELIVERED'
                      ? 'outline'
                      : order.orderStatus === 'CANCELLED'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className={`capitalize px-3 py-1 text-[10px] font-bold ${order.orderStatus === 'DELIVERED' ? 'border-green-500 text-green-600 bg-green-50' : ''
                    }`}
                >
                  {order.orderStatus.toLowerCase()}
                </Badge>
              </div>

              <div className="p-4 sm:p-6">
                {/* Status Section for Mobile/Desktop */}
                <div className="flex items-center gap-2 mb-6 sm:mb-8">
                  <div className={`p-2 rounded-full ${order.orderStatus === 'DELIVERED' ? 'bg-green-100' : 'bg-primary/10'}`}>
                    {order.orderStatus === 'DELIVERED' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : order.orderStatus === 'CANCELLED' ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Truck className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg leading-tight">
                      {order.orderStatus === 'DELIVERED' ? 'Arrived' : order.orderStatus === 'CANCELLED' ? 'Order Cancelled' : 'In Transit'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {order.orderStatus === 'DELIVERED'
                        ? 'Your package was delivered successfully'
                        : order.orderStatus === 'CANCELLED'
                          ? 'This order was cancelled and refunded'
                          : 'Your order is being processed and will ship soon'}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-6 sm:space-y-4">
                  {order.products.map((item) => (
                    <div key={item.productId} className="flex gap-4 sm:gap-6 items-start border-b border-border/20 last:border-0 pb-6 last:pb-0">
                      <div className="relative shrink-0">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-md border border-border/50 bg-muted/20"
                        />
                        <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Link to={`/my-orders/${order._id}`} className="font-bold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {item.name}
                        </Link>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 italic">
                            {item.description}
                          </p>
                        )}
                        <p className="font-bold text-sm sm:text-base mt-1">₹{(item.priceAtPurchase).toLocaleString()}</p>

                        <div className="pt-2 flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm" className="h-8 text-[11px] font-bold px-4 rounded-md">
                            <Link to={`/product/${item.productId}`}>Buy it again</Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm" className="h-8 text-[11px] font-medium px-4">
                            <Link to={`/product/${item.productId}`}>View item</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Download Invoice Button - Mobile & Desktop */}
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
