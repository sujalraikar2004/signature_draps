import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { Product, Review, Category } from "@/types";
import api from "@/Api"; // axios instance with baseURL & interceptors
import { useAuth } from "./AuthContext";

// Types
interface ProductContextType {
  products: Product[] | null;
  featuredProducts: Product[] | null;
  newProducts: Product[] | null;
  bestSellers: Product[] | null;
  wishlistProducts: Product[] | null;
  categories: Category[] | null;
  wishlistCount: number;
  loading: boolean;
  error: string | null;

  fetchProducts: (params?: Record<string, any>) => Promise<void>;
  fetchProductsByCategory: (categoryId: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchNewProducts: () => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  searchProducts: (query: string, filters?: any) => Promise<Product[]>;
  getProductById: (productId: string) => Promise<Product | null>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (
    productId: string,
    productData: Partial<Product>
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  fetchCategories: () => Promise<void>;

  addReview: (
    productId: string,
    reviewData: { rating: number; title: string; comment: string }
  ) => Promise<any>;
  updateReview: (
    productId: string,
    reviewId: string,
    reviewData: { rating: number; title: string; comment: string }
  ) => Promise<void>;
  deleteReview: (productId: string, reviewId: string) => Promise<void>;
  markReviewHelpful: (productId: string, reviewId: string) => Promise<void>;
  getProductReviews: (
    productId: string,
    page?: number,
    sort?: string
  ) => Promise<Review[]>;
  getUserReview: (productId: string) => Promise<Review | null>;

  toggleLike: (productId: string) => Promise<void>;
  getSearchSuggestions: (query: string) => Promise<any>;
}

// Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const ProductProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(
    null
  );
  const [newProducts, setNewProducts] = useState<Product[] | null>(null);
  const [bestSellers, setBestSellers] = useState<Product[] | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<Product[] | null>(
    null
  );
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Central API handler ---
  const handleApiCall = async <T,>(
    apiCall: () => Promise<{ data: T }>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();
      if (successMessage) toast.success(successMessage);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        errorMessage ||
        "Something went wrong, please try again.";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- Product APIs ---
  const fetchProducts = useCallback(async (params?: Record<string, any>) => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get("/products", { params })
    );
    if (data) setProducts(data.data);
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId: string) => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get(`/products/category/${categoryId}`)
    );
    if (data) setProducts(data.data);
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get("/products/featured")
    );
    console.log("featured product", data);
    if (data) setFeaturedProducts(data.data);
  }, []);

  const fetchNewProducts = useCallback(async () => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get("/products/new")
    );
    if (data) setNewProducts(data.data);
  }, []);

  const fetchBestSellers = useCallback(async () => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get("/products/best-sellers")
    );
    if (data) setBestSellers(data.data);
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await api.get("/user/wishlist");
      if (response.data.success) {
        // Extract products from wishlist items
        const wishlistItems = response.data.data.wishlist || [];
        const products = wishlistItems
          .map((item: any) => item.productId)
          .filter((product: any) => product); // Filter out null products
        setWishlistProducts(products);
        setWishlistCount(products.length);
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      setWishlistProducts([]);
    }
  }, []);

  const searchProducts = useCallback(
    async (query: string, filters: any = {}) => {
      try {
        const params = { q: query, ...filters };
        const response = await api.get("/products/search", { params });
        return response.data.data || [];
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Search failed");
        return [];
      }
    },
    []
  );

  const getProductById = useCallback(
    async (productId: string): Promise<Product | null> => {
      const data = await handleApiCall<{ data: Product }>(() =>
        api.get(`/products/${productId}`)
      );
      console.log(data);
      return data?.data || null;
    },
    []
  );

  const createProduct = useCallback(
    async (productData: Partial<Product>) => {
      await handleApiCall(
        () => api.post("/products", productData),
        "Product created successfully",
        "Failed to create product"
      );
      fetchProducts();
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (productId: string, productData: Partial<Product>) => {
      await handleApiCall(
        () => api.put(`/products/${productId}`, productData),
        "Product updated successfully",
        "Failed to update product"
      );
      fetchProducts();
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      await handleApiCall(
        () => api.delete(`/products/${productId}`),
        "Product deleted successfully",
        "Failed to delete product"
      );
      fetchProducts();
    },
    [fetchProducts]
  );

  const fetchCategories = useCallback(async () => {
    const response = await handleApiCall<{ data: Category[] }>(() =>
      api.get("/products/categories")
    );
    console.log("this is categories api response", response);
    if (response) setCategories(response.data);
    console.log(categories);
  }, []);

  const addReview = useCallback(
    async (
      productId: string,
      reviewData: { rating: number; title: string; comment: string }
    ) => {
      try {
        const response = await api.post(`/products/${productId}/reviews`, reviewData);
        toast.success("Review submitted successfully!");
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 400 && error.response?.data?.data?.existingReview) {
          // User already has a review, return the existing review data
          const existingReview = error.response.data.data.existingReview;
          toast.error(error.response.data.message);
          throw { 
            isExistingReview: true, 
            existingReview,
            message: error.response.data.message 
          };
        }
        toast.error(error.response?.data?.message || "Failed to submit review");
        throw error;
      }
    },
    []
  );

  const updateReview = useCallback(
    async (
      productId: string,
      reviewId: string,
      reviewData: { rating: number; title: string; comment: string }
    ) => {
      await handleApiCall(
        () => api.put(`/products/${productId}/reviews/${reviewId}`, reviewData),
        "Review updated successfully",
        "Failed to update review"
      );
    },
    []
  );

  const deleteReview = useCallback(async (productId: string, reviewId: string) => {
    await handleApiCall(
      () => api.delete(`/products/${productId}/reviews/${reviewId}`),
      "Review deleted successfully",
      "Failed to delete review"
    );
  }, []);

  const markReviewHelpful = useCallback(
    async (productId: string, reviewId: string) => {
      await handleApiCall(
        () => api.post(`/products/${productId}/reviews/${reviewId}/helpful`),
        "Marked as helpful",
        "Failed to mark as helpful"
      );
    },
    []
  );

  const getProductReviews = useCallback(
    async (productId: string, page = 1, sort = "newest"): Promise<Review[]> => {
      const data = await handleApiCall<{ data: { reviews: Review[] } }>(() =>
        api.get(`/products/${productId}/reviews`, { params: { page, sort } })
      );
      return data?.data?.reviews || [];
    },
    []
  );

  const getUserReview = useCallback(
    async (productId: string): Promise<Review | null> => {
      try {
        if (!user) return null;
        
        const reviews = await getProductReviews(productId, 1, 'newest');
        // Find the current user's review
        const userReview = reviews.find(review => 
          (review as any).userId === user._id || 
          (review as any).userName === user.username
        );
        return userReview || null;
      } catch (error) {
        return null;
      }
    },
    [getProductReviews, user]
  );

  const getSearchSuggestions = useCallback(async (query: string) => {
    try {
      if (!query || query.length < 2) {
        return { suggestions: [], categories: [], brands: [], products: [] };
      }
      
      const response = await api.get("/products/search/suggestions", {
        params: { q: query, limit: 10 }
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Search suggestions failed:", error);
      return { suggestions: [], categories: [], brands: [], products: [] };
    }
  }, []);

  // --- Wishlist/Like ---
  const toggleLike = useCallback(async (productId: string) => {
    try {
      const response = await api.post(`/products/${productId}/like`);
      const { data, message } = response.data;
      const { isLiked } = data;
      
      setProducts((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked } : p
            )
          : null
      );
      setFeaturedProducts((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked } : p
            )
          : null
      );
      setNewProducts((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked } : p
            )
          : null
      );
      setBestSellers((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked } : p
            )
          : null
      );

      // Refresh wishlist to keep it in sync
      fetchWishlist();

      toast.success(message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  }, [fetchWishlist]);

  // Calculate wishlist count whenever products change
  useEffect(() => {
    if (products) {
      const count = products.filter((product) => product.isLiked).length;
      setWishlistCount(count);
    }
  }, [products]);

  // Auto fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value: ProductContextType = {
    products,
    featuredProducts,
    newProducts,
    bestSellers,
    wishlistProducts,
    categories,
    wishlistCount,
    loading,
    error,

    fetchProducts,
    fetchProductsByCategory,
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchBestSellers,
    fetchWishlist,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,

    fetchCategories,

    addReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    getProductReviews,
    getUserReview,

    toggleLike,
    getSearchSuggestions,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
