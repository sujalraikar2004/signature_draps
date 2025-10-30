import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/product/ProductCard'; 
import { ImageZoomModal } from '@/components/ui/image-zoom-modal';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from 'sonner';
import api from '@/Api';
import { Product, Review } from '@/types';

export default function ProductDetail() {
  const { productId } = useParams();
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById, products, toggleLike, addReview, getProductReviews, markReviewHelpful, updateReview, getUserReview } = useProducts();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [userExistingReview, setUserExistingReview] = useState<any>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

 const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(productId); 
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getProductById]); 
 
  // Fetch reviews for the product
  useEffect(() => {
    if (!productId) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const list = await getProductReviews(productId, 1, 'newest');
        setReviews(list);
        
        // Check if current user has already reviewed this product
        if (user) {
          const existingReview = await getUserReview(productId);
          if (existingReview) {
            setUserExistingReview(existingReview);
            setNewReview({
              rating: (existingReview as any).rating || 5,
              title: (existingReview as any).title || '',
              comment: (existingReview as any).comment || ''
            });
          }
        }
       } catch (e) {
         setReviewsError('Failed to load reviews');
       } finally {
         setReviewsLoading(false);
       }
     };
     fetchReviews();
  }, [productId, getProductReviews, getUserReview, user]);

  const relatedProducts = products
    .filter(p => p.category === product?.category && p._id !== product?._id)
    .slice(0, 4);

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
     if(user){
      addToCart(product?._id,quantity);
     }else{
      navigate("/login");
     }
    
      
    
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (isLiking || !product?._id) return; // Prevent double clicks
    
    setIsLiking(true);
    toggleLike(product._id).finally(() => {
      setIsLiking(false);
    });
   };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      if (!productId) return;
      
      if (isEditingReview && userExistingReview) {
        // Update existing review
        await updateReview(productId, userExistingReview._id, {
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
        });
        toast.success('Review updated successfully!');
        setIsEditingReview(false);
      } else {
        // Try to add new review
        await addReview(productId, {
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
        });
        setNewReview({ rating: 5, title: '', comment: '' });
      }
      
      // Refresh reviews and product rating/count
      const list = await getProductReviews(productId, 1, 'newest');
      setReviews(list);
      const updated = await getProductById(productId);
      if (updated) setProduct(updated);
      
      // Refresh user's review status
      const existingReview = await getUserReview(productId);
      setUserExistingReview(existingReview);
     } catch (err:any) {
      if (err?.isExistingReview) {
        // User already has a review, switch to edit mode
        setUserExistingReview(err.existingReview);
        setIsEditingReview(true);
        setNewReview({
          rating: err.existingReview.rating,
          title: err.existingReview.title,
          comment: err.existingReview.comment
        });
      }
      // Error toasts are already handled in context
     }
   };

  const handleEditReview = () => {
    if (userExistingReview) {
      setIsEditingReview(true);
      setNewReview({
        rating: userExistingReview.rating,
        title: userExistingReview.title,
        comment: userExistingReview.comment
      });
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditingReview(false);
    if (userExistingReview) {
      setNewReview({
        rating: userExistingReview.rating,
        title: userExistingReview.title,
        comment: userExistingReview.comment
      });
    } else {
      setNewReview({ rating: 5, title: '', comment: '' });
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      if (!user) {
        toast.error('Please login to vote');
        return;
      }
      if (!productId) return;
      await markReviewHelpful(productId, reviewId);
      // Optimistically update helpful count locally
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } as Review : r));
    } catch (err:any) {
      toast.error(err?.response?.data?.message || 'Failed to mark as helpful');
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setIsZoomModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        {/* Breadcrumb */}
        {/* <nav className="mb-8 text-sm text-muted-foreground">
          <span>Home</span> / <span>Categories</span> / <span className="text-foreground">{product?.name}</span>
        </nav> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product?.images[selectedImage].url}
                alt={product?.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(selectedImage)}
              />
            </div>
            
            {product?.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product?.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product?.brand && (
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl font-heading font-bold mb-4">{product?.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product?.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product?.rating} ({product?.reviewCount} reviews)
                </span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product?.isNew && (
                  <Badge className="bg-success text-success-foreground">New Arrival</Badge>
                )}
                {product?.isBestSeller && (
                  <Badge className="bg-accent text-accent-foreground">Best Seller</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">{discountPercentage}% OFF</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{product?.price.toLocaleString()}
                </span>
                {product?.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes • Free shipping available
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {product?.inStock && product?.stockQuantity > 0 ? (
                <Badge variant="outline" className="text-success border-success">
                  ✓ In Stock - Ready to Ship ({product.stockQuantity} available)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-destructive border-destructive">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 btn-hero" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product?.inStock || product?.stockQuantity <= 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className={`transition-all duration-200 ${
                    product?.isLiked 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100 border-red-200 shadow-md' 
                      : 'hover:text-red-400 hover:bg-red-50'
                  } ${isLiking ? 'scale-105' : ''}`}
                  onClick={handleAddToWishlist}
                  disabled={isLiking}
                >
                  <Heart 
                    className={`mr-2 h-5 w-5 transition-all duration-200 ${
                      product?.isLiked ? 'fill-current animate-pulse' : ''
                    } ${isLiking ? 'animate-bounce' : ''}`} 
                  />
                  {isLiking ? 'Adding...' : product?.isLiked ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              <Button 
                className="w-full btn-gold" 
                size="lg"
                disabled={!product?.inStock || product?.stockQuantity <= 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span className="text-sm">30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-primary" />
                <span className="text-sm">Expert Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product?.reviewCount})</TabsTrigger>
              <TabsTrigger value="write-review">Write Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="card-premium p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product?.description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="card-premium p-6">
                <ul className="space-y-2">
                  {product?.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="card-premium p-6">
                {/* Reviews Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-heading font-semibold mb-2">Customer Reviews</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product?.rating)
                                ? 'fill-accent text-accent'
                                : 'text-muted-foreground/40'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{product?.rating} out of 5</span>
                      <span className="text-muted-foreground">({product?.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>
                ) : reviewsError ? (
                  <div className="py-8 text-center text-destructive">{reviewsError}</div>
                ) : reviews.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No reviews yet. Be the first to review!</div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{review.userName}</h4>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs text-success border-success">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{new Date((review as any).createdAt || '').toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (review.rating || 0)
                                    ? 'fill-accent text-accent'
                                    : 'text-muted-foreground/40'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <h5 className="font-medium mb-2">{review.title}</h5>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{review.comment}</p>
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHelpfulClick(review._id)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful || 0})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="write-review" className="mt-6">
              <div className="card-premium p-6">
                <h3 className="text-2xl font-heading font-semibold mb-6">
                  {userExistingReview && !isEditingReview ? 'Your Review' : isEditingReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                 
                {!user ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Please login to write a review for this product.
                    </p>
                    <Button onClick={() => navigate('/login')} className="btn-hero">
                      Login to Review
                    </Button>
                  </div>
                ) : userExistingReview && !isEditingReview ? (
                  <div className="space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < userExistingReview.rating
                                  ? 'fill-accent text-accent'
                                  : 'text-muted-foreground/40'
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-medium">{userExistingReview.rating} stars</span>
                        </div>
                        <Button onClick={handleEditReview} variant="outline" size="sm">
                          Edit Review
                        </Button>
                      </div>
                      <h4 className="font-semibold mb-2">{userExistingReview.title}</h4>
                      <p className="text-muted-foreground">{userExistingReview.comment}</p>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      You can only submit one review per product, but you can edit it anytime.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Rating *</Label>
                      <div className="flex items-center space-x-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                i < newReview.rating
                                  ? 'fill-accent text-accent'
                                  : 'text-muted-foreground/40 hover:text-accent'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-3 text-sm text-muted-foreground">
                          {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="review-title" className="text-base font-medium">Review Title *</Label>
                      <input
                        id="review-title"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Summarize your review in a few words"
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="review-comment" className="text-base font-medium">Your Review *</Label>
                      <Textarea
                        id="review-comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Tell others about your experience with this product..."
                        rows={5}
                        className="mt-2"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit" className="btn-hero">
                        {isEditingReview ? 'Update Review' : 'Submit Review'}
                      </Button>
                      {isEditingReview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNewReview({ rating: 5, title: '', comment: '' })}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-heading font-semibold mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
      <ImageZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={product?.images.map(image => ({ url: image.url, alt: image.alt || product?.name || 'Product image' })) || []}
        initialIndex={selectedImage}
      />
    </main>
  );
}
