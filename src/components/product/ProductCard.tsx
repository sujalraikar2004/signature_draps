import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleLike } = useProducts();
  const [isLiking, setIsLiking] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to Cart');
       navigate("/login")
    }else{
        addToCart(product._id, 1);
    }
  
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate("/login");
      return;
    }

    if (isLiking) return; // Prevent double clicks
    
    setIsLiking(true);
    try {
      await toggleLike(product._id);
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsLiking(false);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInStock = product.inStock && product.stockQuantity > 0;
  const primaryImage = product.images[0];

  return (
    
    <div className={`card-product group ${className}`}>
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={primaryImage.url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isBestSeller && (
              <Badge className="bg-amber-500 text-white shadow">
                Best Seller
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground shadow">
                New
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive">{discountPercentage}% OFF</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className={`h-8 w-8 p-0 transition-all duration-200 ${
                product.isLiked 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100 border-red-200 shadow-md' 
                  : 'hover:text-red-400 hover:bg-red-50'
              } ${isLiking ? 'scale-110' : ''}`}
              onClick={handleToggleLike}
              disabled={isLiking}
            >
              <Heart 
                className={`h-4 w-4 transition-all duration-200 ${
                  product.isLiked ? 'fill-current animate-pulse' : ''
                } ${isLiking ? 'animate-bounce' : ''}`} 
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Add to Cart - Mobile */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
            <Button
              size="sm"
              className="w-full btn-hero"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            {product.brand && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Code: {product.productCode}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-semibold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {isInStock ? (
              <Badge variant="outline" className="text-success border-success">
                In Stock ({product.stockQuantity})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Delivery & Policy Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.deliveryInfo?.cashOnDelivery && (
              <Badge variant="outline" className="text-xs bg-success/5 border-success/30 text-success">
                <Truck className="h-3 w-3 mr-1" />
                COD
              </Badge>
            )}
            {product.deliveryInfo?.freeDelivery && (
              <Badge variant="outline" className="text-xs bg-primary/5 border-primary/30 text-primary">
                <Truck className="h-3 w-3 mr-1" />
                Free Delivery
              </Badge>
            )}
            {product.returnPolicy?.returnable && product.returnPolicy.returnDays > 0 && (
              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600">
                <RotateCcw className="h-3 w-3 mr-1" />
                {product.returnPolicy.returnDays}D Returns
              </Badge>
            )}
          </div>

          {/* Add to Cart Button - Desktop */}
          <div className="hidden md:block">
            <Button
              size="sm"
              className="w-full btn-hero"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}