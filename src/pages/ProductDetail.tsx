import React, { useState, useEffect } from 'react';
import { ProductDetailSkeleton } from '@/components/ui/skeletons/ProductDetailSkeleton';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Headphones, Plus, Minus, ThumbsUp, MessageCircle, User, Ruler, AlertCircle, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProductCard } from '@/components/product/ProductCard';
import { ImageZoomModal } from '@/components/ui/image-zoom-modal';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from 'sonner';
import api from '@/Api';
import { Product, Review, SizeVariant, CustomSize } from '@/types';

// Helper function to format size display based on category and variant data
const formatSizeDisplay = (variant: SizeVariant, category?: string): string => {
  // Bean bags - prioritize sizeLabel
  if (variant.sizeLabel) {
    return variant.sizeLabel;
  }

  // Area-based products (wallpaper, grass)
  if (variant.area && variant.area > 0) {
    return `${variant.area} sq ft`;
  }

  // Round items (carpets with diameter)
  if (variant.diameter && variant.diameter > 0) {
    return `⌀ ${variant.diameter} ${variant.dimensions?.unit || 'ft'}`;
  }

  // Dimension-based products (curtains, blinds, etc.)
  if (variant.dimensions?.length && variant.dimensions?.width) {
    const parts = [variant.dimensions.length, variant.dimensions.width];
    if (variant.dimensions.height && variant.dimensions.height > 0) {
      parts.push(variant.dimensions.height);
    }
    return `${parts.join(' × ')} ${variant.dimensions.unit || 'ft'}`;
  }

  // Fallback
  return 'Standard size';
};

// Helper function to generate detailed size information for tooltip
const getDetailedSizeInfo = (variant: SizeVariant): string[] => {
  const details: string[] = [];

  // Add size label if available
  if (variant.sizeLabel) {
    details.push(`Size: ${variant.sizeLabel}`);
  }

  // Add dimensions if available
  if (variant.dimensions) {
    const { length, width, height, unit } = variant.dimensions;
    if (length) details.push(`Length: ${length} ${unit}`);
    if (width) details.push(`Width: ${width} ${unit}`);
    if (height && height > 0) details.push(`Height: ${height} ${unit}`);
  }

  // Add area if available
  if (variant.area && variant.area > 0) {
    details.push(`Area: ${variant.area} sq ft`);
  }

  // Add diameter if available
  if (variant.diameter && variant.diameter > 0) {
    details.push(`Diameter: ${variant.diameter} ${variant.dimensions?.unit || 'ft'}`);
  }

  // Add stock information
  if (variant.stockQuantity !== undefined) {
    details.push(`Stock: ${variant.stockQuantity} units`);
  }

  return details;
};

const renderDescription = (text: string): React.ReactNode => {
  if (!text) return null;
  return (
    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
      {text}
    </p>
  );
};

export default function ProductDetail() {
  const { productId } = useParams();

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById, products, toggleLike, addReview, getProductReviews, markReviewHelpful, updateReview, getUserReview } = useProducts();
  const { user } = useAuth();

  // Log productId for debugging
  console.log('ProductDetail - productId from URL:', productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video'>('image');
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [userExistingReview, setUserExistingReview] = useState<any>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // New states for customizable products
  const [sizeOption, setSizeOption] = useState<'ready-made' | 'custom' | ''>('');
  const [selectedSizeVariant, setSelectedSizeVariant] = useState<SizeVariant | null>(null);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [selectedVariantForDialog, setSelectedVariantForDialog] = useState<SizeVariant | null>(null);
  const [customSize, setCustomSize] = useState<CustomSize>({
    isCustom: false,
    measurements: {
      unit: 'ft'
    }
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ x, y });
  };

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(productId);

        if (!data) {
          setError("Product not found");
          return;
        }

        setProduct(data);

        // Set default size variant and ready-made option if available
        if (data.isCustomizable && data.sizeVariants && data.sizeVariants.length > 0) {
          setSelectedSizeVariant(data.sizeVariants[0]);
          setSizeOption('ready-made'); // Always default to ready-made for better UX
        }

        // Set custom size unit from config
        if (data.customSizeConfig?.enabled) {
          setCustomSize(prev => ({
            ...prev,
            measurements: {
              ...prev.measurements,
              unit: data.customSizeConfig?.unit || 'ft'
            }
          }));
        }
      } catch (err: any) {
        console.error('Error loading product:', err);
        setError(err?.message || "Failed to load product. Please try again.");
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

  const relatedProducts = (products || [])
    .filter(p => p.category === product?.category && p._id !== product?._id);

  const discountPercentage = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Calculate custom size price
  const calculateCustomPrice = () => {
    if (!product?.customSizeConfig || !customSize.measurements) return 0;

    const { length, width, height, area, diameter } = customSize.measurements;
    const { pricePerUnit, minimumCharge } = product.customSizeConfig;

    let calculatedArea = 0;

    if (area) {
      calculatedArea = area;
    } else if (length && width) {
      calculatedArea = length * width;
    } else if (diameter) {
      calculatedArea = Math.PI * Math.pow(diameter / 2, 2);
    }

    const calculatedPrice = calculatedArea * (pricePerUnit || 0);
    return Math.max(calculatedPrice, minimumCharge || 0);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Validate size selection for customizable products
    if (product?.isCustomizable) {
      if (sizeOption === 'ready-made' && !selectedSizeVariant) {
        toast.error('Please select a size');
        return;
      }

      if (sizeOption === 'custom') {
        const requiredFields = product.customSizeConfig?.fields || [];
        const hasAllFields = requiredFields.every(field => {
          const value = customSize.measurements[field];
          return value && value > 0;
        });

        if (!hasAllFields) {
          toast.error('Please fill in all required measurements');
          return;
        }
      }
    }

    // Prepare size data for cart
    let sizeVariantData = null;
    let customSizeData = null;

    if (product?.isCustomizable) {
      if (sizeOption === 'ready-made' && selectedSizeVariant) {
        sizeVariantData = {
          variantId: selectedSizeVariant._id,
          name: selectedSizeVariant.name,
          dimensions: selectedSizeVariant.dimensions,
          price: selectedSizeVariant.price
        };
      } else if (sizeOption === 'custom') {
        const calculatedPrice = calculateCustomPrice();
        customSizeData = {
          isCustom: true,
          measurements: customSize.measurements,
          calculatedPrice: calculatedPrice,
          notes: customSize.notes || ''
        };
      }
    }

    // Add to cart with size information
    addToCart(product?._id || '', quantity, sizeVariantData, customSizeData);

    // Show toast with size info
    if (sizeVariantData) {
      toast.success(`Added ${sizeVariantData.name} to cart`);
    } else if (customSizeData?.isCustom) {
      toast.success('Added custom size product to cart');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Validate size selection for customizable products
    if (product?.isCustomizable) {
      if (sizeOption === 'ready-made' && !selectedSizeVariant) {
        toast.error('Please select a size');
        return;
      }

      if (sizeOption === 'custom') {
        const requiredFields = product.customSizeConfig?.fields || [];
        const hasAllFields = requiredFields.every(field => {
          const value = customSize.measurements[field];
          return value && value > 0;
        });

        if (!hasAllFields) {
          toast.error('Please fill in all required measurements');
          return;
        }
      }
    }

    // Prepare size data for cart
    let sizeVariantData = null;
    let customSizeData = null;

    if (product?.isCustomizable) {
      if (sizeOption === 'ready-made' && selectedSizeVariant) {
        sizeVariantData = {
          variantId: selectedSizeVariant._id,
          name: selectedSizeVariant.name,
          dimensions: selectedSizeVariant.dimensions,
          price: selectedSizeVariant.price
        };
      } else if (sizeOption === 'custom') {
        const calculatedPrice = calculateCustomPrice();
        customSizeData = {
          isCustom: true,
          measurements: customSize.measurements,
          calculatedPrice: calculatedPrice,
          notes: customSize.notes || ''
        };
      }
    }

    // Add to cart with size information
    addToCart(product?._id || '', quantity, sizeVariantData, customSizeData);

    // Navigate to cart page
    navigate('/cart');
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isLiking || !product?._id) return; // Prevent double clicks

    setIsLiking(true);
    try {
      await toggleLike(product._id);

      // Update local product state to reflect the change immediately
      setProduct(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: !prev.isLiked
        };
      });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLiking(false);
    }
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
    } catch (err: any) {
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to mark as helpful');
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setIsZoomModalOpen(true);
  };

  // Handle missing productId
  if (!productId) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-6xl">😕</div>
              <h2 className="text-2xl font-bold">Invalid Product URL</h2>
              <p className="text-muted-foreground">
                The product URL is missing or invalid.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate(-1)} variant="outline">
                  Go Back
                </Button>
                <Button onClick={() => navigate('/')}>
                  Go to Homepage
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // Error state or product not found
  if (error || !product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-6xl">😕</div>
              <h2 className="text-2xl font-bold">Product Not Found</h2>
              <p className="text-muted-foreground">
                {error || "The product you're looking for doesn't exist or has been removed."}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate(-1)} variant="outline">
                  Go Back
                </Button>
                <Button onClick={() => navigate('/')}>
                  Go to Homepage
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        {/* Breadcrumb */}
        {/* <nav className="mb-8 text-sm text-muted-foreground">
          <span>Home</span> / <span>Categories</span> / <span className="text-foreground">{product?.name}</span>
        </nav> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images & Videos */}
          <div className="space-y-4">
            <div
              className="h-[400px] w-full overflow-hidden rounded-lg bg-white relative border border-gray-100"
              onMouseMove={selectedMediaType === 'image' ? handleMouseMove : undefined}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {selectedMediaType === 'image' ? (
                <img
                  src={product?.images[selectedImage]?.url}
                  alt={product?.name}
                  className="w-full h-full object-contain cursor-zoom-in transition-transform duration-100 ease-out"
                  style={{
                    transformOrigin: `${zoomStyle.x}% ${zoomStyle.y}%`,
                    transform: isHovering ? 'scale(2.5)' : 'scale(1)'
                  }}
                  onClick={() => handleImageClick(selectedImage)}
                />
              ) : (
                <video
                  key={product?.videos?.[selectedImage - (product?.images?.length || 0)]?.url}
                  controls
                  className="w-full h-full object-contain bg-black"
                  poster={product?.videos?.[selectedImage - (product?.images?.length || 0)]?.thumbnail}
                >
                  <source src={product?.videos?.[selectedImage - (product?.images?.length || 0)]?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Media Thumbnails (Images first, then Videos) */}
            {(((product?.images?.length || 0) + (product?.videos?.length || 0)) > 1 || (product?.videos?.length || 0) > 0) && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {/* Image Thumbnails */}
                {product?.images?.map((image, index) => (
                  <button
                    key={`img-${index}`}
                    onClick={() => {
                      setSelectedImage(index);
                      setSelectedMediaType('image');
                    }}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index && selectedMediaType === 'image' ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </button>
                ))}

                {/* Video Thumbnails */}
                {product?.videos?.map((video, index) => (
                  <button
                    key={`vid-${index}`}
                    onClick={() => {
                      setSelectedImage((product?.images?.length || 0) + index);
                      setSelectedMediaType('video');
                    }}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors relative ${selectedImage === (product?.images?.length || 0) + index && selectedMediaType === 'video'
                      ? 'border-primary'
                      : 'border-transparent'
                      }`}
                  >
                    <img
                      src={video.thumbnail || video.url}
                      alt={`${product?.name} video ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-8 w-8 text-white" fill="white" />
                    </div>
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
              <h1 className="text-3xl font-heading font-bold mb-1">{product?.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">Code: {product?.productCode}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product?.rating)
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
                {product?.isCustomizable && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <Ruler className="h-3 w-3 mr-1" />
                    Customizable
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{(sizeOption === 'ready-made' && selectedSizeVariant
                    ? selectedSizeVariant.price
                    : sizeOption === 'custom'
                      ? calculateCustomPrice()
                      : product?.price || 0).toLocaleString()}
                </span>
                {((sizeOption === 'ready-made' && selectedSizeVariant?.originalPrice) || product?.originalPrice) && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{(sizeOption === 'ready-made' && selectedSizeVariant?.originalPrice
                      ? selectedSizeVariant.originalPrice
                      : product?.originalPrice || 0).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes • Free shipping available
              </p>
            </div>

            {/* Disclaimer */}
            {product?.disclaimer && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {product.disclaimer}
                </AlertDescription>
              </Alert>
            )}

            {/* Size Selection for Customizable Products */}
            {product?.isCustomizable && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Select Size Option</h3>
                  </div>
                  {sizeOption && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSizeOption('');
                        setSelectedSizeVariant(null);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear Selection
                    </Button>
                  )}
                </div>

                <RadioGroup
                  value={sizeOption}
                  onValueChange={(value: any) => {
                    // If clicking on already selected option, deselect it
                    if (sizeOption === value) {
                      setSizeOption('');
                      setSelectedSizeVariant(null);
                    } else {
                      setSizeOption(value);
                      if (value === 'custom') {
                        setSelectedSizeVariant(null);
                      }
                    }
                  }}
                >
                  {product.sizeVariants && product.sizeVariants.length > 0 && (
                    <div className="space-y-3">
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => {
                          if (sizeOption === 'ready-made') {
                            setSizeOption('');
                            setSelectedSizeVariant(null);
                          } else {
                            setSizeOption('ready-made');
                          }
                        }}
                      >
                        <RadioGroupItem value="ready-made" id="ready-made" checked={sizeOption === 'ready-made'} />
                        <Label htmlFor="ready-made" className="font-medium cursor-pointer">
                          Ready-Made Sizes
                        </Label>
                      </div>

                      {/* Always show size variants for better UX */}
                      {(
                        <TooltipProvider>
                          <div className="ml-6 space-y-2">
                            {product.sizeVariants.map((variant) => {
                              const sizeDetails = getDetailedSizeInfo(variant);

                              return (
                                <Tooltip key={variant._id} delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <div
                                      onClick={() => {
                                        if (!variant.inStock) return;
                                        // Auto-select ready-made option when clicking variant
                                        if (sizeOption !== 'ready-made') {
                                          setSizeOption('ready-made');
                                        }
                                        // Toggle selection: if already selected, deselect it
                                        if (selectedSizeVariant?._id === variant._id) {
                                          setSelectedSizeVariant(null);
                                        } else {
                                          setSelectedSizeVariant(variant);
                                        }
                                      }}
                                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all relative ${selectedSizeVariant?._id === variant._id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      {selectedSizeVariant?._id === variant._id && (
                                        <div className="absolute top-2 right-2">
                                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium">{variant.name}</p>
                                            {/* Mobile: Show detailed info button */}
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="md:hidden h-7 px-2 text-xs"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVariantForDialog(variant);
                                                setVariantDialogOpen(true);
                                              }}
                                            >
                                              <Ruler className="h-3 w-3 mr-1" />
                                              Details
                                            </Button>
                                          </div>
                                          {/* Desktop: Show inline details */}
                                          <div className="hidden md:block text-xs text-muted-foreground mt-1 space-y-0.5">
                                            {variant.sizeLabel && (
                                              <p className="font-medium text-primary">Size: {variant.sizeLabel}</p>
                                            )}
                                            {variant.dimensions && (
                                              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                                {variant.dimensions.length && (
                                                  <span>• Length: {variant.dimensions.length} {variant.dimensions.unit}</span>
                                                )}
                                                {variant.dimensions.width && (
                                                  <span>• Width: {variant.dimensions.width} {variant.dimensions.unit}</span>
                                                )}
                                                {variant.dimensions.height && variant.dimensions.height > 0 && (
                                                  <span>• Height: {variant.dimensions.height} {variant.dimensions.unit}</span>
                                                )}
                                              </div>
                                            )}
                                            {variant.area && variant.area > 0 && (
                                              <p>• Area: {variant.area} sq ft</p>
                                            )}
                                            {variant.diameter && variant.diameter > 0 && (
                                              <p>• Diameter: {variant.diameter} {variant.dimensions?.unit || 'ft'}</p>
                                            )}
                                            {variant.stockQuantity !== undefined && (
                                              <p className="text-success">• Available: {variant.stockQuantity} units</p>
                                            )}
                                          </div>
                                          {/* Mobile: Show compact info */}
                                          <div className="md:hidden text-xs text-muted-foreground mt-1">
                                            <p className="truncate">{formatSizeDisplay(variant, product?.category)}</p>
                                            {variant.stockQuantity !== undefined && (
                                              <p className="text-success">Stock: {variant.stockQuantity} units</p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-bold text-primary">₹{variant.price.toLocaleString()}</p>
                                          {variant.originalPrice && variant.originalPrice > variant.price && (
                                            <p className="text-sm text-muted-foreground line-through">
                                              ₹{variant.originalPrice.toLocaleString()}
                                            </p>
                                          )}
                                          {!variant.inStock && (
                                            <Badge variant="destructive" className="text-xs mt-1">Out of Stock</Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-xs p-4 bg-popover border-2 border-primary/20 shadow-lg"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                                        <Ruler className="h-4 w-4 text-primary" />
                                        <p className="font-semibold text-sm">Complete Size Details</p>
                                      </div>
                                      {sizeDetails.length > 0 ? (
                                        <div className="space-y-1">
                                          {sizeDetails.map((detail, index) => (
                                            <p key={index} className="text-xs text-muted-foreground">
                                              • {detail}
                                            </p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground">No detailed size information available</p>
                                      )}
                                      {variant.inStock ? (
                                        <div className="mt-2 pt-2 border-t border-border">
                                          <Badge variant="outline" className="text-xs text-success border-success">
                                            ✓ Available
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="mt-2 pt-2 border-t border-border">
                                          <Badge variant="destructive" className="text-xs">
                                            Out of Stock
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </TooltipProvider>
                      )}
                    </div>
                  )}

                  {product.allowCustomSize && product.customSizeConfig?.enabled && (
                    <div className="space-y-3">
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => {
                          if (sizeOption === 'custom') {
                            setSizeOption('');
                          } else {
                            setSizeOption('custom');
                            setSelectedSizeVariant(null);
                          }
                        }}
                      >
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="font-medium cursor-pointer">
                          Custom Size (Made to Order)
                        </Label>
                      </div>

                      {sizeOption === 'custom' && (
                        <div className="ml-6 space-y-3 p-4 bg-background rounded-lg border border-border">
                          <p className="text-sm text-muted-foreground mb-3">
                            Enter your custom measurements below:
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            {product.customSizeConfig.fields.includes('length') && (
                              <div>
                                <Label htmlFor="length" className="text-sm">Length *</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    id="length"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                    value={customSize.measurements.length || ''}
                                    onChange={(e) => setCustomSize(prev => ({
                                      ...prev,
                                      measurements: {
                                        ...prev.measurements,
                                        length: parseFloat(e.target.value) || undefined
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                  <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                                    {product.customSizeConfig.unit}
                                  </span>
                                </div>
                              </div>
                            )}

                            {product.customSizeConfig.fields.includes('width') && (
                              <div>
                                <Label htmlFor="width" className="text-sm">Width *</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    id="width"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                    value={customSize.measurements.width || ''}
                                    onChange={(e) => setCustomSize(prev => ({
                                      ...prev,
                                      measurements: {
                                        ...prev.measurements,
                                        width: parseFloat(e.target.value) || undefined
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                  <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                                    {product.customSizeConfig.unit}
                                  </span>
                                </div>
                              </div>
                            )}

                            {product.customSizeConfig.fields.includes('height') && (
                              <div>
                                <Label htmlFor="height" className="text-sm">Height *</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    id="height"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                    value={customSize.measurements.height || ''}
                                    onChange={(e) => setCustomSize(prev => ({
                                      ...prev,
                                      measurements: {
                                        ...prev.measurements,
                                        height: parseFloat(e.target.value) || undefined
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                  <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                                    {product.customSizeConfig.unit}
                                  </span>
                                </div>
                              </div>
                            )}

                            {product.customSizeConfig.fields.includes('area') && (
                              <div>
                                <Label htmlFor="area" className="text-sm">Area *</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    id="area"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                    value={customSize.measurements.area || ''}
                                    onChange={(e) => setCustomSize(prev => ({
                                      ...prev,
                                      measurements: {
                                        ...prev.measurements,
                                        area: parseFloat(e.target.value) || undefined
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                  <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                                    {product.customSizeConfig.unit}
                                  </span>
                                </div>
                              </div>
                            )}

                            {product.customSizeConfig.fields.includes('diameter') && (
                              <div>
                                <Label htmlFor="diameter" className="text-sm">Diameter *</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    id="diameter"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                    value={customSize.measurements.diameter || ''}
                                    onChange={(e) => setCustomSize(prev => ({
                                      ...prev,
                                      measurements: {
                                        ...prev.measurements,
                                        diameter: parseFloat(e.target.value) || undefined
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                  <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                                    {product.customSizeConfig.unit}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="notes" className="text-sm">Additional Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Any special instructions or requirements..."
                              value={customSize.notes || ''}
                              onChange={(e) => setCustomSize(prev => ({
                                ...prev,
                                notes: e.target.value
                              }))}
                              className="mt-1"
                              rows={3}
                            />
                          </div>

                          {product.customSizeConfig.pricePerUnit && (
                            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                              <p className="text-sm font-medium">
                                Price: ₹{product.customSizeConfig.pricePerUnit} per {product.customSizeConfig.unit}
                              </p>
                              {product.customSizeConfig.minimumCharge && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Minimum charge: ₹{product.customSizeConfig.minimumCharge.toLocaleString()}
                                </p>
                              )}
                              {calculateCustomPrice() > 0 && (
                                <p className="text-lg font-bold text-primary mt-2">
                                  Estimated Total: ₹{calculateCustomPrice().toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}

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
                  className={`transition-all duration-200 ${product?.isLiked
                    ? 'text-red-500 bg-red-50 hover:bg-red-100 border-red-200 shadow-md'
                    : 'hover:text-red-400 hover:bg-red-50'
                    } ${isLiking ? 'scale-105' : ''}`}
                  onClick={handleAddToWishlist}
                  disabled={isLiking}
                >
                  <Heart
                    className={`mr-2 h-5 w-5 transition-all duration-200 ${product?.isLiked ? 'fill-current animate-pulse' : ''
                      } ${isLiking ? 'animate-bounce' : ''}`}
                  />
                  {isLiking ? 'Adding...' : product?.isLiked ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              <Button
                className="w-full btn-gold"
                size="lg"
                onClick={handleBuyNow}
                disabled={!product?.inStock || product?.stockQuantity <= 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Delivery & Policy Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Delivery & Returns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                {product?.deliveryInfo?.cashOnDelivery && (
                  <div className="flex items-center space-x-2 p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                )}

                {/* Free Delivery or Delivery Charges */}
                <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {product?.deliveryInfo?.freeDelivery ? 'Free Delivery' : 'Delivery Charges'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product?.deliveryInfo?.freeDelivery
                        ? 'No shipping cost'
                        : `₹${product?.deliveryInfo?.deliveryCharges || 0}`}
                    </p>
                  </div>
                </div>

                {/* Return Policy */}
                {product?.returnPolicy?.returnable ? (
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.returnPolicy.returnDays}-Day Returns</p>
                      <p className="text-xs text-muted-foreground">Easy returns available</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">No Returns</p>
                      <p className="text-xs text-muted-foreground">Non-returnable item</p>
                    </div>
                  </div>
                )}

                {/* Secure Transaction */}
                {product?.secureTransaction && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Secure Transaction</p>
                      <p className="text-xs text-muted-foreground">SSL encrypted payment</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Information */}
              {product?.deliveryInfo && (
                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Delivery Information</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>
                          Estimated delivery: {product.deliveryInfo.estimatedDays?.min || 3}-
                          {product.deliveryInfo.estimatedDays?.max || 7} business days
                        </p>
                        {product.deliveryInfo.deliveryPartner && (
                          <p>Delivered by: {product.deliveryInfo.deliveryPartner}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Return Conditions */}
              {product?.returnPolicy?.returnable && product?.returnPolicy?.returnConditions && (
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
                  <div className="flex items-start space-x-3">
                    <RotateCcw className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Return Conditions</p>
                      <p className="text-xs text-muted-foreground">
                        {product.returnPolicy.returnConditions}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                {product?.description && renderDescription(product.description)}
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
                            className={`h-5 w-5 ${i < Math.floor(product?.rating)
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
                                className={`h-4 w-4 ${i < (review.rating || 0)
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
                              className={`h-5 w-5 ${i < userExistingReview.rating
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
                              className={`h-6 w-6 transition-colors ${i < newReview.rating
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
