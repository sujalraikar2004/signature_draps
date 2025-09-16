import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, Review } from '@/types';
import { toast } from 'sonner';

interface ProductContextType {
  // State
  products: Product[] | null;
  featuredProducts: Product[] | null;
  newProducts: Product[] | null;
  categories: string[] | null;
  loading: boolean;
  error: string | null;

  // Product operations
  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (categoryId: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchNewProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductById: (productId: string) => Promise<Product | null>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Category operations
  fetchCategories: () => Promise<void>;

  // Review operations
  addReview: (productId: string, reviewData: { rating: number; title: string; comment: string }) => Promise<void>;
  updateReview: (productId: string, reviewId: string, reviewData: { rating: number; title: string; comment: string }) => Promise<void>;
  deleteReview: (productId: string, reviewId: string) => Promise<void>;
  markReviewHelpful: (productId: string, reviewId: string) => Promise<void>;
  getProductReviews: (productId: string, page?: number, sort?: string) => Promise<Review[]>;

  // Like operations
  toggleLike: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [newProducts, setNewProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T,>(
    apiCall: () => Promise<Response>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API call failed');
      }

      if (successMessage) {
        toast.success(successMessage);
      }

      return data;
    } catch (err: any) {
      const message = err.message || errorMessage || 'An error occurred';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    const data = await handleApiCall<{ products: Product[] }>(
      () => fetch('/api/products', { credentials: 'include' })
    );
    if (data) {
      setProducts(data.products);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId: string) => {
    const data = await handleApiCall<{ products: Product[] }>(
      () => fetch(`/api/products/category/${categoryId}`, { credentials: 'include' })
    );
    if (data) {
      setProducts(data.products);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    const data = await handleApiCall<{ products: Product[] }>(
      () => fetch('/api/products/featured', { credentials: 'include' })
    );
    if (data) {
      setFeaturedProducts(data.products);
    }
  }, []);

  const fetchNewProducts = useCallback(async () => {
    const data = await handleApiCall<{ products: Product[] }>(
      () => fetch('/api/products/new', { credentials: 'include' })
    );
    if (data) {
      setNewProducts(data.products);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    const data = await handleApiCall<{ products: Product[] }>(
      () => fetch(`/api/products/search?q=${encodeURIComponent(query)}`, { credentials: 'include' })
    );
    if (data) {
      setProducts(data.products);
    }
  }, []);

  const getProductById = useCallback(async (productId: string): Promise<Product | null> => {
    const data = await handleApiCall<{ product: Product }>(
      () => fetch(`/api/products/${productId}`, { credentials: 'include' })
    );
    return data?.product || null;
  }, []);

  const createProduct = useCallback(async (productData: Partial<Product>) => {
    await handleApiCall(
      () => fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData)
      }),
      'Product created successfully',
      'Failed to create product'
    );
    // Refresh products list
    fetchProducts();
  }, [fetchProducts]);

  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    await handleApiCall(
      () => fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData)
      }),
      'Product updated successfully',
      'Failed to update product'
    );
    // Refresh products list
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    await handleApiCall(
      () => fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      }),
      'Product deleted successfully',
      'Failed to delete product'
    );
    // Refresh products list
    fetchProducts();
  }, [fetchProducts]);

  const fetchCategories = useCallback(async () => {
    const data = await handleApiCall<{ categories: string[] }>(
      () => fetch('/api/products/categories', { credentials: 'include' })
    );
    if (data) {
      setCategories(data.categories);
    }
  }, []);

  const addReview = useCallback(async (productId: string, reviewData: { rating: number; title: string; comment: string }) => {
    await handleApiCall(
      () => fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewData)
      }),
      'Review added successfully',
      'Failed to add review'
    );
  }, []);

  const updateReview = useCallback(async (productId: string, reviewId: string, reviewData: { rating: number; title: string; comment: string }) => {
    await handleApiCall(
      () => fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewData)
      }),
      'Review updated successfully',
      'Failed to update review'
    );
  }, []);

  const deleteReview = useCallback(async (productId: string, reviewId: string) => {
    await handleApiCall(
      () => fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
      }),
      'Review deleted successfully',
      'Failed to delete review'
    );
  }, []);

  const markReviewHelpful = useCallback(async (productId: string, reviewId: string) => {
    await handleApiCall(
      () => fetch(`/api/products/${productId}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        credentials: 'include'
      }),
      'Review marked as helpful',
      'Failed to mark review as helpful'
    );
  }, []);

  const getProductReviews = useCallback(async (productId: string, page = 1, sort = 'newest'): Promise<Review[]> => {
    const data = await handleApiCall<{ reviews: Review[] }>(
      () => fetch(`/api/products/${productId}/reviews?page=${page}&sort=${sort}`, { credentials: 'include' })
    );
    return data?.reviews || [];
  }, []);

  const toggleLike = useCallback(async (productId: string) => {
    const data = await handleApiCall<{ message: string; isLiked: boolean; likeCount: number }>(
      () => fetch(`/api/products/${productId}/like`, {
        method: 'POST',
        credentials: 'include'
      })
    );
    
    if (data) {
      // Update the product in the current products list
      setProducts(prev => prev ? prev.map(product => 
        product._id === productId 
          ? { ...product, isLiked: data.isLiked }
          : product
      ) : null);

      // Update featured products if they exist
      setFeaturedProducts(prev => prev ? prev.map(product => 
        product._id === productId 
          ? { ...product, isLiked: data.isLiked }
          : product
      ) : null);

      // Update new products if they exist
      setNewProducts(prev => prev ? prev.map(product => 
        product._id === productId 
          ? { ...product, isLiked: data.isLiked }
          : product
      ) : null);

      toast.success(data.isLiked ? 'Added to wishlist' : 'Removed from wishlist');
    }
  }, []);

  const value: ProductContextType = {
    // State
    products,
    featuredProducts,
    newProducts,
    categories,
    loading,
    error,

    // Product operations
    fetchProducts,
    fetchProductsByCategory,
    fetchFeaturedProducts,
    fetchNewProducts,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,

    // Category operations
    fetchCategories,

    // Review operations
    addReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    getProductReviews,

    // Like operations
    toggleLike,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
