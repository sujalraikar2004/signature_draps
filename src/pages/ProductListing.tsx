import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ProductCardSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton';
import { useProducts } from '@/contexts/ProductContext';
import { categories } from '@/data/categories';
import { SidebarFilters, FilterOption } from '@/components/product/SidebarFilters';



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

const ProductListing = () => {
  const location = useLocation().pathname;
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const isBestSellerParam = searchParams.get('isBestSeller');
  const isNewParam = searchParams.get('isNew');

  const { products, loading, error, fetchProducts, fetchProductsByCategory, searchProducts: searchProductsAPI } = useProducts();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: categoryId || '',
    priceRange: [0, 150000],
    brands: [] as string[],
    colors: [] as string[],
    discountRange: [] as string[],
  });

  // Fetch products based on category or search
  useEffect(() => {
    if (searchQuery) searchProductsAPI(searchQuery);
    else if (categoryId) fetchProductsByCategory(categoryId);
    else if (isBestSellerParam === 'true') fetchProducts({ isBestSeller: true });
    else if (isNewParam === 'true') fetchProducts({ isNew: true });
    else fetchProducts();
  }, [categoryId, searchQuery, isBestSellerParam, isNewParam]);

  const handleCheckboxChange = (type: 'brands' | 'colors' | 'discountRange', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: newValues };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      // Price filter
      const inPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      // Brand filter
      const inBrand = filters.brands.length ? filters.brands.includes(p.brand) : true;
      // Color filter
      const inColor = filters.colors.length
        ? filters.colors.some(color => p.name.toLowerCase().includes(color.toLowerCase()))
        : true;
      return inPrice && inBrand && inColor;
    });
  }, [products, filters]);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(20);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  // Reset visible count when filters or products change
  useEffect(() => {
    setVisibleCount(20);
  }, [filters, searchQuery, categoryId]);

  // Infinite scroll observer - only load more if there are more products
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => Math.min(prev + 20, filteredProducts.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  const clearFilters = () => setFilters({ category: categoryId || '', priceRange: [0, 150000], brands: [], colors: [], discountRange: [] });

  // Get category display name
  const getCategoryName = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (isBestSellerParam === 'true') return 'Best Sellers';
    if (isNewParam === 'true') return 'New Arrivals';
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId);
      return category?.name || categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'All Products';
  };


  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-0 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-1xl md:text-2xl font-semibold">
              {getCategoryName()}
            </h1>
            <p className="text-muted-foreground mt-1">{filteredProducts.length} products found</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <SidebarFilters
                  filters={filters}
                  handlePriceChange={handlePriceChange}
                  handleCheckboxChange={handleCheckboxChange}
                  clearFilters={clearFilters}
                  brandOptions={brandOptions}
                  colorOptions={colorOptions}
                  discountOptions={discountOptions}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-56 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar py-4 pr-4 pl-0 bg-background border-t border-r border-b border-gray-100">
            <SidebarFilters
              filters={filters}
              handlePriceChange={handlePriceChange}
              handleCheckboxChange={handleCheckboxChange}
              clearFilters={clearFilters}
              brandOptions={brandOptions}
              colorOptions={colorOptions}
              discountOptions={discountOptions}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-t border-l border-gray-100/50 md:border-none`}>
                {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div>
                <div className={`grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 border-t border-l border-gray-100/50 md:border-none ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1'}`}>
                  {filteredProducts.slice(0, visibleCount).map(p => <ProductCard key={p._id} product={p} className={viewMode === 'list' ? 'flex-row' : ''} />)}
                </div>

                {/* Infinite Scroll Sentinel & Loading State */}
                <div ref={observerTarget} className="mt-8 h-10 w-full">
                  {visibleCount < filteredProducts.length && (
                    <div className={`grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`}>
                      {Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}



export default ProductListing;