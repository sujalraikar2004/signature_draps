import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ArrowUpDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { SearchWithSuggestions } from '@/components/ui/search-with-suggestions';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
];

const CATEGORIES = [
  'curtains-furnishing',
  'blinds',
  'bean-bags',
  'wallpaper',
  'carpets-rugs'
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
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  const [totalResults, setTotalResults] = useState(0);

  // Perform search
  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const filters = {
        category: selectedCategory || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
        inStock: inStockOnly || undefined,
        sortBy,
      };

      const results = await searchProducts(query, filters);
      setProducts(results);
      setTotalResults(results.length);

      // Update URL params
      const params = new URLSearchParams();
      params.set('q', query);
      if (selectedCategory) params.set('category', selectedCategory);
      if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
      if (priceRange[1] < 50000) params.set('maxPrice', priceRange[1].toString());
      if (inStockOnly) params.set('inStock', 'true');
      if (sortBy !== 'relevance') params.set('sortBy', sortBy);
      
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
  }, [query, selectedCategory, priceRange, inStockOnly, sortBy]);

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

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 50000]);
    setInStockOnly(false);
    setSortBy('relevance');
  };

  const activeFiltersCount = [
    selectedCategory,
    priceRange[0] > 0 || priceRange[1] < 50000,
    inStockOnly,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Category</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-categories"
              checked={!selectedCategory}
              onCheckedChange={() => setSelectedCategory('')}
            />
            <Label htmlFor="all-categories" className="text-sm">All Categories</Label>
          </div>
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              />
              <Label htmlFor={category} className="text-sm capitalize">
                {category.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          min={0}
          step={500}
          className="w-full"
        />
      </div>

      {/* Stock Filter */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked === true)}
          />
          <Label htmlFor="in-stock" className="text-sm">In Stock Only</Label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container-premium py-8">
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
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory.replace('-', ' ')}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory('')}
                  />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setPriceRange([0, 50000])}
                  />
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock Only
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setInStockOnly(false)}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card-premium p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <FilterContent />
            </div>
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
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
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
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
