import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Cart() {
  const { items, totalPrice, isLoading, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-heading font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to find your perfect interior solutions!
            </p>
            <Button className="btn-hero" asChild>
              <Link to="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId._id} className="card-premium p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.productId.image }
                      alt={item.productId.name}
                      className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/product/${item.productId._id}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {item.productId.name}
                        </Link>
                        {item.productId.brand && (
                          <p className="text-sm text-muted-foreground">
                            Brand: {item.productId.brand}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId._id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          ₹{(item.productId.price * item.quantity).toLocaleString()}
                        </div>
                        {item.productId.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ₹{(item.productId.originalPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.productId.stock <= 0 && (
                      <Badge variant="destructive" className="w-fit">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (18% GST)</span>
                  <span>₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{Math.round(totalPrice * 1.18).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full btn-hero" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Delivery Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Free delivery in Mumbai & Delhi NCR</li>
                  <li>• Professional installation available</li>
                  <li>• 30-day return policy</li>
                  <li>• Quality guarantee on all products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}