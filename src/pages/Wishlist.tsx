import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { products, toggleLike } = useProducts();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter liked products from all products
  useEffect(() => {
    if (products && isAuthenticated) {
      const likedProducts = products.filter(product => product.isLiked);
      setWishlistProducts(likedProducts);
    } else {
      setWishlistProducts([]);
    }
    setLoading(false);
  }, [products, isAuthenticated]);

  const handleAddToCart = (product: any) => {
    addToCart(product._id, 1);
    toast.success('Added to cart');
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await toggleLike(productId);
      // Update local state immediately
      setWishlistProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      // Error is handled in context
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-16 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-heading font-bold mb-4">My Wishlist</h1>
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </main>
    );
  }

  if (wishlistProducts.length === 0) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Best Seller
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock status */}
                  <div className="mb-4">
                    {product.inStock && product.stockQuantity > 0 ? (
                      <span className="text-sm text-green-600 font-medium">In Stock ({product.stockQuantity})</span>
                    ) : (
                      <span className="text-sm text-destructive font-medium">Out of Stock</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock || product.stockQuantity <= 0}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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