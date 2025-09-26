import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckCircle, XCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const { orders, getUserOrders, isLoading } = useOrders();

  useEffect(() => {
    if (isAuthenticated) getUserOrders();
  }, [isAuthenticated, getUserOrders]);

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
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card-premium p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold">Order #{order.orderId}</h2>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Payment Mode: {order.paymentMode} • Status: {order.paymentStatus}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          order.orderStatus === 'DELIVERED'
                            ? 'success'
                            : order.orderStatus === 'CANCELLED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                      {order.orderStatus === 'DELIVERED' && <CheckCircle className="h-5 w-5 text-success" />}
                      {order.orderStatus === 'CANCELLED' && <XCircle className="h-5 w-5 text-destructive" />}
                      {order.orderStatus === 'SHIPPED' && <Truck className="h-5 w-5 text-primary" />}
                    </div>
                  </div>

                  <Separator />

                  {/* Products */}
                  <div className="divide-y">
                    {order.products.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 py-4">
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productId.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-semibold">₹{(item.priceAtPurchase * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary / Info */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-semibold">Delivery & Info</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Free delivery in Mumbai & Delhi NCR</li>
                <li>• Professional installation available</li>
                <li>• 30-day return policy</li>
                <li>• Quality guarantee on all products</li>
              </ul>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Total Orders Amount</h3>
                <p className="text-lg font-semibold">
                  ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                </p>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
