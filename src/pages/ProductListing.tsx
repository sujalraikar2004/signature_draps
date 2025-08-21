import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { categories } from '@/data/categories';
import { mockProducts, getProductsByCategory, searchProducts } from '@/data/products';
import { FilterOptions } from '@/types';

export default function ProductListing() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 50000],
    categories: [],
    ratings: [],
    inStock: false,
    brands: [],
    sortBy: 'relevance'
  });

  // Get current category info
  const currentCategory = categoryId ? categories.find(cat => cat.id === categoryId) : null;

  // Get products based on category or search
  const baseProducts = useMemo(() => {
    if (searchQuery) {
      return searchProducts(searchQuery);
    } else if (categoryId) {
      return getProductsByCategory(categoryId);
    } else {
      return mockProducts;
    }
  }, [categoryId, searchQuery]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let products = [...baseProducts];

    // Price filter
    products = products.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // In stock filter
    if (filters.inStock) {
      products = products.filter(product => product.inStock);
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      products = products.filter(product => 
        filters.ratings.some(rating => product.rating >= rating)
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      products = products.filter(product => 
        product.brand && filters.brands.includes(product.brand)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return products;
  }, [baseProducts, filters]);

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value as [number, number] }));
  };

  const handleInStockToggle = (checked: boolean) => {
    setFilters(prev => ({ ...prev, inStock: checked }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value as FilterOptions['sortBy'] }));
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Price Range</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={50000}
            min={0}
            step={500}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Availability</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={handleInStockToggle}
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Customer Rating</Label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.ratings.includes(rating)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters(prev => ({ ...prev, ratings: [...prev.ratings, rating] }));
                  } else {
                    setFilters(prev => ({ ...prev, ratings: prev.ratings.filter(r => r !== rating) }));
                  }
                }}
              />
              <Label htmlFor={`rating-${rating}`}>
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Sort and Filter Bar */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="card-premium p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                <FilterSidebar />
              </div>
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
                  onClick={() => setFilters({
                    priceRange: [0, 50000],
                    categories: [],
                    ratings: [],
                    inStock: false,
                    brands: [],
                    sortBy: 'relevance'
                  })}
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
                    key={product.id} 
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
