import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { Product, Review } from "@/types";
import api from "../Api"; // axios instance with baseURL & interceptors

// Types
interface ProductContextType {
  products: Product[] | null;
  featuredProducts: Product[] | null;
  newProducts: Product[] | null;
  categories: string[] | null;
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (categoryId: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchNewProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
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
  ) => Promise<void>;
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

  toggleLike: (productId: string) => Promise<void>;
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
  const [products, setProducts] = useState<Product[] | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(
    null
  );
  const [newProducts, setNewProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<string[] | null>(null);
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
  const fetchProducts = useCallback(async () => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get("/products")
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
    console.log("featured product",data)
    if (data) setFeaturedProducts(data.data);
  }, []);

  const fetchNewProducts = useCallback(async () => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get("/products/new")
    );
    if (data) setNewProducts(data.data);
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    const data = await handleApiCall<{ data: Product[] }>(() =>
      api.get(`/products/search?q=${encodeURIComponent(query)}`)
    );
    if (data) setProducts(data.data);
  }, []);

  const getProductById = useCallback(
    async (productId: string): Promise<Product | null> => {
      const data = await handleApiCall<{ data: Product }>(() =>
        api.get(`/products/${productId}`)
      );
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

  // --- Category APIs ---
  const fetchCategories = useCallback(async () => {
    const data = await handleApiCall<{ data: string[] }>(() =>
      api.get("/products/categories")
    );
    if (data) setCategories(data.data);
  }, []);

  // --- Reviews ---
  const addReview = useCallback(
    async (
      productId: string,
      reviewData: { rating: number; title: string; comment: string }
    ) => {
      await handleApiCall(
        () => api.post(`/products/${productId}/reviews`, reviewData),
        "Review added successfully",
        "Failed to add review"
      );
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
      const data = await handleApiCall<{ data: Review[] }>(() =>
        api.get(`/products/${productId}/reviews`, { params: { page, sort } })
      );
      return data?.data || [];
    },
    []
  );

  // --- Wishlist/Like ---
  const toggleLike = useCallback(async (productId: string) => {
    const data = await handleApiCall<{
      isLiked: boolean;
      likeCount: number;
    }>(() => api.post(`/products/${productId}/like`));

    if (data) {
      setProducts((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked: data.isLiked } : p
            )
          : null
      );
      setFeaturedProducts((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked: data.isLiked } : p
            )
          : null
      );
      setNewProducts((prev) =>
        prev
          ? prev.map((p) =>
              p._id === productId ? { ...p, isLiked: data.isLiked } : p
            )
          : null
      );

      toast.success(data.isLiked ? "Added to wishlist" : "Removed from wishlist");
    }
  }, []);

  // Auto fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value: ProductContextType = {
    products,
    featuredProducts,
    newProducts,
    categories,
    loading,
    error,

    fetchProducts,
    fetchProductsByCategory,
    fetchFeaturedProducts,
    fetchNewProducts,
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

    toggleLike,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
