import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Grid, List, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { SearchWithSuggestions } from '@/components/ui/search-with-suggestions';
import { SidebarFilters, FilterOption } from '@/components/product/SidebarFilters';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProductCardSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton';
import { cn } from '@/lib/utils';

const brandOptions: FilterOption[] = [
  { label: 'KALINI', value: 'KALINI', count: 10 },
  { label: 'BAESD', value: 'BAESD', count: 5 },
  { label: 'StyleCast', value: 'StyleCast', count: 454 },
  { label: 'LULU & SKY', value: 'LULU & SKY', count: 45 },
];

const colorOptions: FilterOption[] = [
  { label: 'Black', value: 'black', count: 41777 },
  { label: 'White', value: 'white', count: 30152 },
  { label: 'Pink', value: 'pink', count: 27195 },
  { label: 'Green', value: 'green', count: 27003 },
];

const discountOptions: FilterOption[] = [
  { label: '10% and above', value: '10' },
  { label: '20% and above', value: '20' },
  { label: '30% and above', value: '30' },
  { label: '40% and above', value: '40' },
  { label: '50% and above', value: '50' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchProducts, categories } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search and filter states
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: [
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '50000')
    ],
    inStock: searchParams.get('inStock') === 'true',
    rating: parseInt(searchParams.get('rating') || '0'),
    colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
    materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    features: searchParams.get('features')?.split(',').filter(Boolean) || [],
    discountRange: [] as string[],
    sortBy: searchParams.get('sortBy') || 'relevance'
  });
  const [totalResults, setTotalResults] = useState(0);

  // Perform search
  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchFilters = {
        category: filters.category || undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 50000 ? filters.priceRange[1] : undefined,
        inStock: filters.inStock || undefined,
        rating: filters.rating > 0 ? filters.rating : undefined,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        materials: filters.materials.length > 0 ? filters.materials : undefined,
        brands: filters.brands.length > 0 ? filters.brands : undefined,
        features: filters.features.length > 0 ? filters.features : undefined,
        sortBy: filters.sortBy,
      };

      const results = await searchProducts(query, searchFilters);
      setProducts(results);
      setTotalResults(results.length);

      // Update URL params
      const params = new URLSearchParams();
      params.set('q', query);
      if (filters.category) params.set('category', filters.category);
      if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 50000) params.set('maxPrice', filters.priceRange[1].toString());
      if (filters.inStock) params.set('inStock', 'true');
      if (filters.rating > 0) params.set('rating', filters.rating.toString());
      if (filters.colors.length > 0) params.set('colors', filters.colors.join(','));
      if (filters.materials.length > 0) params.set('materials', filters.materials.join(','));
      if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
      if (filters.features.length > 0) params.set('features', filters.features.join(','));
      if (filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);

      setSearchParams(params);
    } catch (error) {
      console.error('Search failed:', error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount and when query changes
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters]);

  // Update query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleNewSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleCheckboxChange = (type: 'brands' | 'colors' | 'discountRange', value: string) => {
    setFilters(prev => {
      const current = prev[type] as string[];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: newValues };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++;
    if (filters.inStock) count++;
    if (filters.rating > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.materials.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.features.length > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">
                {query ? `Search Results for "${query}"` : 'Search Products'}
              </h1>
              {totalResults > 0 && (
                <p className="text-muted-foreground">
                  Found {totalResults} product{totalResults !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* New Search */}
            <div className="w-full md:w-96">
              <SearchWithSuggestions
                onSearch={handleNewSearch}
                placeholder="Search for products..."
                className="w-full"
              />
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {filters.category}
                </span>
              )}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                </span>
              )}
              {filters.inStock && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  In Stock Only
                </span>
              )}
              {filters.rating > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  Rating: {filters.rating}
                </span>
              )}
              {filters.colors.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  Colors: {filters.colors.join(', ')}
                </span>
              )}
              {filters.materials.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  Materials: {filters.materials.join(', ')}
                </span>
              )}
              {filters.brands.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  Brands: {filters.brands.join(', ')}
                </span>
              )}
              {filters.features.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  Features: {filters.features.join(', ')}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar py-4 pr-4 pl-0 bg-background border-t border-r border-b border-gray-100">
            <SidebarFilters
              filters={filters}
              handlePriceChange={handlePriceChange}
              handleCheckboxChange={handleCheckboxChange}
              clearFilters={clearFilters}
              brandOptions={brandOptions}
              colorOptions={colorOptions}
              discountOptions={discountOptions}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Search className="h-4 w-4 mr-2" />
                      Filters
                      {getActiveFiltersCount() > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                          {getActiveFiltersCount()}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-96 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Smart Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <SidebarFilters
                        filters={filters}
                        handlePriceChange={handlePriceChange}
                        handleCheckboxChange={handleCheckboxChange}
                        clearFilters={clearFilters}
                        brandOptions={brandOptions}
                        colorOptions={colorOptions}
                        discountOptions={discountOptions}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={filters.sortBy} onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, sortBy: value }))
                }>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
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
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-t border-l border-gray-100/50 md:border-none">
                {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-t border-l border-gray-100/50 md:border-none"
                  : "space-y-4"
              )}>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any products matching "{query}". Try adjusting your search or filters.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Start your search</h3>
                <p className="text-muted-foreground">
                  Enter a search term to find products you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
