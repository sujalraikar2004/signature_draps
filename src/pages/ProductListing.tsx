import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const subcategoryParam = searchParams.get('subcategory') || '';
  const isBestSellerParam = searchParams.get('isBestSeller');
  const isNewParam = searchParams.get('isNew');

  const { products, pagination, loading, error, fetchProducts, searchProducts: searchProductsAPI } = useProducts();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState({
    category: categoryId || '',
    priceRange: [0, 150000],
    brands: [] as string[],
    colors: [] as string[],
    discountRange: [] as string[],
  });

  const getStorageKey = () => `productListing_page_${categoryId || searchQuery || 'all'}_${subcategoryParam || 'all'}`;
  
  const [currentPage, setCurrentPage] = useState(() => {
    // Try to restore previous page from sessionStorage
    const saved = sessionStorage.getItem(getStorageKey());
    return saved ? parseInt(saved, 10) : 1;
  });

  // Reset to page 1 when filters, category, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categoryId, searchQuery, subcategoryParam]);

  // Fetch products based on category or search along with all filters
  useEffect(() => {
    setIsInitialLoad(true);
    const fetchParams: any = {
      page: currentPage,
      limit: 25,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
    };

    if (filters.brands.length) fetchParams.brands = filters.brands.join(',');
    if (filters.colors.length) fetchParams.colors = filters.colors.join(',');
    if (categoryId) fetchParams.category = categoryId;
    if (subcategoryParam) fetchParams.subcategory = subcategoryParam;
    if (isBestSellerParam === 'true') fetchParams.isBestSeller = true;
    if (isNewParam === 'true') fetchParams.isNew = true;

    if (searchQuery) {
      searchProductsAPI(searchQuery, fetchParams).finally(() => setIsInitialLoad(false));
    } else {
      fetchProducts(fetchParams).finally(() => setIsInitialLoad(false));
    }
  }, [categoryId, subcategoryParam, searchQuery, isBestSellerParam, isNewParam, currentPage, filters]);

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

  // Get current products (from context after backend filtering)
  const currentProducts = useMemo(() => {
    if (isInitialLoad && !products) return [];
    return products || [];
  }, [products, isInitialLoad]);

  // Save current page to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(getStorageKey(), currentPage.toString());
  }, [currentPage, categoryId, subcategoryParam, searchQuery]);

  const totalPages = pagination?.totalPages || 1;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const clearFilters = () => setFilters({ category: categoryId || '', priceRange: [0, 150000], brands: [], colors: [], discountRange: [] });

  const currentCategory = categoryId ? categories.find(c => c.id === categoryId) : undefined;
  const currentSubcategory = currentCategory?.subcategories?.find(subcategory => subcategory.id === subcategoryParam);

  const handleSubcategoryChange = (subcategoryId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (subcategoryId) {
      nextParams.set('subcategory', subcategoryId);
    } else {
      nextParams.delete('subcategory');
    }
    setSearchParams(nextParams);
  };

  // Get category display name
  const getCategoryName = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (isBestSellerParam === 'true') return 'Best Sellers';
    if (isNewParam === 'true') return 'New Arrivals';
    if (categoryId) {
      const categoryName = currentCategory?.name || categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return currentSubcategory ? `${categoryName} / ${currentSubcategory.name}` : categoryName;
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
            <p className="text-muted-foreground mt-1">
              {pagination?.totalProducts || currentProducts.length} products found
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
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

        {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto px-3 md:px-0 pb-2">
            <Button
              variant={!subcategoryParam ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSubcategoryChange('')}
              className="shrink-0"
            >
              All
            </Button>
            {currentCategory.subcategories.map(subcategory => (
              <Button
                key={subcategory.id}
                variant={subcategoryParam === subcategory.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSubcategoryChange(subcategory.id)}
                className="shrink-0"
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        )}

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
            {(loading || isInitialLoad) ? (
              <div className={`grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-t border-l border-gray-100/50 md:border-none`}>
                {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div>
                <div className={`grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 border-t border-l border-gray-100/50 md:border-none ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1'}`}>
                  {currentProducts.map(p => <ProductCard key={p._id} product={p} className={viewMode === 'list' ? 'flex-row' : ''} />)}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3"
                    >
                      Previous Page
                    </Button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page as number)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      )
                    ))}

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || !pagination?.hasNext}
                      className="px-3"
                    >
                      Next Page
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}



export default ProductListing;
