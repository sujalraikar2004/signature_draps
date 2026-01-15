import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { wishlistProducts, toggleLike, fetchWishlist } = useProducts();
  const [loading, setLoading] = useState(true);

  // Fetch wishlist when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchWishlist().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleAddToCart = (product: any) => {
    addToCart(product._id, 1);
    toast.success('Added to cart');
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await toggleLike(productId);
      // Explicitly refresh wishlist to ensure UI is updated
      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-16 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-1xl md:text-2xl font-heading font-bold mb-4">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">
            Please login to view your wishlist items.
          </p>
          <Link to="/login">
            <Button>Login to Continue</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-16 text-center">
          <p>Loading wishlist...</p>
        </div>
      </main>
    );
  }

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-16 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-heading font-bold mb-4">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">
            Your wishlist is empty. Start adding items you love!
          </p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-heading font-bold">My Wishlist</h1>
          <span className="text-muted-foreground">({wishlistProducts.length} items)</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0 md:gap-6 border-t border-l border-gray-100/50 md:border-none">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCartLabel="MOVE TO CART"
            />
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}