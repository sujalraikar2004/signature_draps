import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/product/ProductCard';
import { getProductById, mockProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const product = productId ? getProductById(productId) : null;
  
  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to wishlist`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Review submitted successfully!');
    setNewReview({ rating: 5, title: '', comment: '' });
  };

  const handleHelpfulClick = (reviewId: string) => {
    toast.success('Thank you for your feedback!');
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <span>Home</span> / <span>Categories</span> / <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl font-heading font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.isNew && (
                  <Badge className="bg-success text-success-foreground">New Arrival</Badge>
                )}
                {product.isBestSeller && (
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
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
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
              {product.inStock ? (
                <Badge variant="outline" className="text-success border-success">
                  ✓ In Stock - Ready to Ship
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
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleAddToWishlist}
                  className="px-3"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <Button 
                className="w-full btn-gold" 
                size="lg"
                disabled={!product.inStock}
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
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="write-review">Write Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="card-premium p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="card-premium p-6">
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
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
                              i < Math.floor(product.rating)
                                ? 'fill-accent text-accent'
                                : 'text-muted-foreground/40'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{product.rating} out of 5</span>
                      <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      id: '1',
                      userName: 'Priya Sharma',
                      rating: 5,
                      title: 'Excellent Quality!',
                      comment: 'The curtains are exactly as shown in the pictures. The fabric quality is premium and the colors are vibrant. Installation was smooth and the team was professional. Highly recommended!',
                      date: '2 weeks ago',
                      verified: true,
                      helpful: 12
                    },
                    {
                      id: '2',
                      userName: 'Rajesh Kumar',
                      rating: 4,
                      title: 'Good value for money',
                      comment: 'Nice product overall. The delivery was on time and packaging was good. The only minor issue was that the color was slightly different from what I expected, but still looks great in my living room.',
                      date: '1 month ago',
                      verified: true,
                      helpful: 8
                    },
                    {
                      id: '3',
                      userName: 'Anita Desai',
                      rating: 5,
                      title: 'Perfect for my bedroom',
                      comment: 'Love these curtains! They block out light perfectly and the material feels luxurious. The customer service was also very helpful with measurements. Will definitely order again.',
                      date: '2 months ago',
                      verified: false,
                      helpful: 5
                    }
                  ].map((review) => (
                    <div key={review.id} className="border border-border rounded-lg p-6">
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
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
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
                          onClick={() => handleHelpfulClick(review.id)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="write-review" className="mt-6">
              <div className="card-premium p-6">
                <h3 className="text-2xl font-heading font-semibold mb-6">Write a Review</h3>
                
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
                        Submit Review
                      </Button>
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
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}