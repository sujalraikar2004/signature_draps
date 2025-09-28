import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AdvancedFilter, FilterState } from '@/components/ui/advanced-filter';
import { useProducts } from '@/contexts/ProductContext';
import { categories } from '@/data/categories';

export default function ProductListing() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const isBestSellerParam = searchParams.get('isBestSeller');
  const isNewParam = searchParams.get('isNew');

  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    fetchProductsByCategory, 
    searchProducts: searchProductsAPI 
  } = useProducts();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    category: categoryId || '',
    priceRange: [0, 50000],
    inStock: false,
    rating: 0,
    colors: [],
    materials: [],
    brands: [],
    features: [],
    sortBy: 'relevance'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get current category info
  const currentCategory = categoryId ? categories.find(cat => cat.id === categoryId) : null;

  // Fetch products based on category or search
  useEffect(() => {
    if (searchQuery) {
      searchProductsAPI(searchQuery);
    } else if (categoryId) {
      fetchProductsByCategory(categoryId);
    } else if (isBestSellerParam === 'true') {
      fetchProducts({ isBestSeller: true });
    } else if (isNewParam === 'true') {
      fetchProducts({ isNew: true });
    } else {
      fetchProducts();
    }
  }, [categoryId, searchQuery, isBestSellerParam, isNewParam, fetchProducts, fetchProductsByCategory, searchProductsAPI]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filteredList = [...products];

    // Category filter
    if (filters.category && !categoryId) {
      filteredList = filteredList.filter(product => 
        product.category === filters.category
      );
    }

    // Price filter
    filteredList = filteredList.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // In stock filter
    if (filters.inStock) {
      filteredList = filteredList.filter(product => product.inStock && product.stockQuantity > 0);
    }

    // Rating filter
    if (filters.rating > 0) {
      filteredList = filteredList.filter(product => 
        product.rating >= filters.rating
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filteredList = filteredList.filter(product => 
        product.brand && filters.brands.includes(product.brand)
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filteredList = filteredList.filter(product => 
        filters.colors.some(color => 
          product.name.toLowerCase().includes(color.toLowerCase()) ||
          product.description.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    // Material filter
    if (filters.materials.length > 0) {
      filteredList = filteredList.filter(product => 
        filters.materials.some(material => 
          product.name.toLowerCase().includes(material.toLowerCase()) ||
          product.description.toLowerCase().includes(material.toLowerCase()) ||
          product.features.some(feature => 
            feature.toLowerCase().includes(material.toLowerCase())
          )
        )
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filteredList = filteredList.filter(product => 
        product.features && filters.features.some(feature => 
          product.features.some(pFeature => 
            pFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_low':
        filteredList.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredList.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredList.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filteredList;
  }, [products, filters, categoryId]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: categoryId || '',
      priceRange: [0, 50000],
      inStock: false,
      rating: 0,
      colors: [],
      materials: [],
      brands: [],
      features: [],
      sortBy: 'relevance'
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-8">
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-premium py-8">
          <div className="text-center py-16">
            <p className="text-lg text-destructive mb-4">
              Error loading products: {error}
            </p>
            <Button 
              onClick={() => {
                if (searchQuery) {
                  searchProductsAPI(searchQuery);
                } else if (categoryId) {
                  fetchProductsByCategory(categoryId);
                } else {
                  fetchProducts();
                }
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold">
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : currentCategory?.name || 'All Products'
                }
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredProducts.length} products found
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    Smart Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-96 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Smart Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <AdvancedFilter 
                      onFiltersChange={handleFiltersChange}
                      initialFilters={filters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Sort and Filter Bar */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Select value={filters.sortBy} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, sortBy: value }))
              }>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <AdvancedFilter 
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  No products found matching your criteria
                </p>
                <Button 
                  variant="outline"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
