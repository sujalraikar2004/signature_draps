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
    } else {
      addToCart(product._id, 1);
      toast.success('Added to cart');
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
    <div className={`card-product group relative bg-transparent hover:shadow-lg md:transition-all md:duration-300 border-r border-b border-gray-100/50 md:border-none ${className}`}>
      <Link to={`/product/${product._id}`} className="block relative">
        {/* Image Container - Adjusted Aspect Ratio */}
        <div className="relative aspect-[6/7] overflow-hidden bg-gray-100">
          <img
            src={primaryImage.url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Rating Badge - Bottom Left Overlay */}
          {product.rating > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-[2px] px-1.5 py-0.5 rounded shadow-sm text-[10px] font-bold z-10">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="h-2.5 w-2.5 fill-teal-500 text-teal-500" />
              <span className="text-gray-400 font-normal border-l border-gray-300 pl-1 ml-0.5">
                {product.reviewCount || 0}
              </span>
            </div>
          )}

          {/* Wishlist Button - Always visible on mobile, hover on desktop */}
          <button
            className={`absolute top-2 right-2 p-2 rounded-full bg-transparent hover:bg-white/90 transition-all duration-300 z-10 
              ${product.isLiked ? 'text-red-500' : 'text-transparent group-hover:text-gray-400 group-hover:bg-white/90'}
              ${isLiking ? 'scale-110' : ''}
            `}
            onClick={handleToggleLike}
            disabled={isLiking}
          >
            {/* Show outline by default on hover, filled if liked */}
            <Heart
              className={`h-4 w-4 ${product.isLiked ? 'fill-current' : ''} ${isLiking ? 'animate-bounce' : ''}`}
            />
          </button>

          {/* Add to Bag Button Overlay */}
          <div className="absolute z-20 transition-all duration-300 
            md:bottom-0 md:left-0 md:right-0 md:p-2 md:translate-y-full md:group-hover:translate-y-0
            max-md:bottom-2 max-md:right-2">
            <Button
              className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-100/50 shadow-sm
                md:w-full md:h-9 md:text-xs md:font-semibold
                max-md:h-7 max-md:w-7 max-md:rounded-full max-md:p-0 flex items-center justify-center"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              {isInStock ? (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 md:mr-2" />
                  <span className="hidden md:inline">ADD TO BAG</span>
                </>
              ) : (
                <span className="text-[9px] md:text-xs">OUT</span>
              )}
            </Button>
          </div>
        </div>

        {/* Product Info - Myntra Style */}
        <div className="pt-2 pb-1 px-1">
          {/* Brand & Name */}
          <h3 className="font-bold text-[15px] text-gray-900 truncate leading-tight">
            {product.brand || 'Brand Name'}
          </h3>
          <p className="text-[13px] text-gray-500 font-normal truncate mt-0.5">
            {product.name}
          </p>

          {/* Price Block */}
          <div className="flex items-center flex-wrap gap-2 mt-1.5">
            <span className="text-[14px] font-bold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-[11px] text-gray-400 line-through decoration-gray-400">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-green-600 font-semibold">
                  ({discountPercentage}% OFF)
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}