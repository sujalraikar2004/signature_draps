import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { SEO } from '@/components/seo/SEO';
import { ProductCardSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton';
import { useProducts } from '@/contexts/ProductContext';
import { categories } from '@/data/categories';
import { getCategorySeoContent, CategorySeoContent } from '@/data/categorySeoContent';
import { SidebarFilters, FilterOption } from '@/components/product/SidebarFilters';
import {
  breadcrumbSchema,
  categoryPath,
  collectionSchema,
  DEFAULT_DESCRIPTION,
  faqSchema
} from '@/lib/seo';

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

const titleCase = (value = '') =>
  value.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());

function CategorySeoSection({ content }: { content?: CategorySeoContent }) {
  if (!content) return null;

  return (
    <section className="mt-12 border-t border-gray-100 pt-10">
      <div className="max-w-5xl space-y-8 px-3 md:px-0">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-950">
            {content.h1}
          </h2>
          {content.intro.map(paragraph => (
            <p key={paragraph} className="text-base leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-950">Benefits</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-7">
              {content.benefits.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-950">Applications</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-7">
              {content.applications.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-950">Buying Guide</h3>
          {content.buyingGuide.map(paragraph => (
            <p key={paragraph} className="text-base leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-950">Before You Order</h3>
          <p className="text-base leading-7 text-muted-foreground">
            Before finalizing {content.h1.toLowerCase()}, compare the room purpose, window or floor size, sunlight direction, privacy requirement, cleaning routine, and the finish of nearby furniture. A product that looks good in isolation should also work with wall color, flooring, hardware, lighting, and daily movement in the room. This is especially important for custom interiors, because measurement, mounting position, fabric or material selection, and edge finishing can change both the look and the long-term usability of the installation.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            Customers planning a full makeover should shortlist related categories at the same time instead of choosing each product separately. Curtains, blinds, wallpaper, artificial grass, flooring, rugs, and accessories often share the same visual space, so coordinating textures and colors early helps avoid mismatched finishes. If the project includes multiple rooms, note each room's measurements, photos, wall conditions, and usage needs before ordering. This makes consultation faster and helps Signature Drapes recommend practical combinations for homes, offices, rental properties, and commercial spaces.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-950">Customization</h3>
            <p className="text-base leading-7 text-muted-foreground">{content.customization}</p>
          </section>
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-950">Measurement and Installation</h3>
            <p className="text-base leading-7 text-muted-foreground">{content.installation}</p>
          </section>
        </div>

        {content.faqs.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-950">FAQs</h3>
            <div className="grid gap-4">
              {content.faqs.map(faq => (
                <div key={faq.question} className="border border-gray-100 p-4">
                  <h4 className="font-semibold text-gray-950">{faq.question}</h4>
                  <p className="mt-2 text-muted-foreground leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.relatedLinks.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-950">Related Categories</h3>
            <div className="flex flex-wrap gap-2">
              {content.relatedLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-primary hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

const ProductListing = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const requestedSubcategory = searchParams.get('subcategory') || '';
  const subcategoryParam =
    categoryId === 'artificial-grass-plant-vertical-garden' && requestedSubcategory === 'artificial-grass'
      ? 'lawn-grass'
      : requestedSubcategory;
  const isBestSellerParam = searchParams.get('isBestSeller');
  const isNewParam = searchParams.get('isNew');

  const { products, pagination, loading, fetchProducts, searchProducts: searchProductsAPI } = useProducts();

  const currentCategory = categoryId ? categories.find(category => category.id === categoryId) : undefined;
  const currentSubcategory = currentCategory?.subcategories?.find(subcategory => subcategory.id === subcategoryParam);
  const isCategoryRoute = Boolean(categoryId);
  const isInvalidCategory = Boolean(categoryId && !currentCategory);
  const isInvalidSubcategory = Boolean(subcategoryParam && currentCategory && !currentSubcategory);
  const isInvalidListing = isInvalidCategory || isInvalidSubcategory;
  const categoryContent = getCategorySeoContent(categoryId, subcategoryParam);

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
    const saved = sessionStorage.getItem(getStorageKey());
    return saved ? parseInt(saved, 10) : 1;
  });

  const hasActiveFilters = Boolean(
    filters.brands.length ||
    filters.colors.length ||
    filters.discountRange.length ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 150000
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categoryId, searchQuery, subcategoryParam]);

  useEffect(() => {
    if (requestedSubcategory !== 'artificial-grass' || subcategoryParam !== 'lawn-grass') return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('subcategory', 'lawn-grass');
    setSearchParams(nextParams, { replace: true });
  }, [requestedSubcategory, searchParams, setSearchParams, subcategoryParam]);

  useEffect(() => {
    if (isInvalidListing) {
      setIsInitialLoad(false);
      return;
    }

    setIsInitialLoad(true);
    const fetchParams: Record<string, string | number | boolean> = {
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

    const request = searchQuery
      ? searchProductsAPI(searchQuery, fetchParams)
      : fetchProducts(fetchParams);

    request.finally(() => setIsInitialLoad(false));
  }, [
    categoryId,
    currentCategory,
    currentPage,
    fetchProducts,
    filters,
    isBestSellerParam,
    isInvalidListing,
    isNewParam,
    searchProductsAPI,
    searchQuery,
    subcategoryParam
  ]);

  useEffect(() => {
    sessionStorage.setItem(getStorageKey(), currentPage.toString());
  }, [currentPage, categoryId, subcategoryParam, searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const currentProducts = useMemo(() => {
    if (isInitialLoad && !products) return [];
    return products || [];
  }, [products, isInitialLoad]);

  const totalProducts = pagination?.totalProducts ?? currentProducts.length;
  const totalPages = pagination?.totalPages || 1;
  const isFetchComplete = !loading && !isInitialLoad;
  const isEmptyValidCategory = Boolean(
    isCategoryRoute &&
    !isInvalidListing &&
    !searchQuery &&
    !hasActiveFilters &&
    isFetchComplete &&
    totalProducts === 0
  );

  const handleCheckboxChange = (type: 'brands' | 'colors' | 'discountRange', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const newValues = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: newValues };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const clearFilters = () => {
    setFilters({ category: categoryId || '', priceRange: [0, 150000], brands: [], colors: [], discountRange: [] });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (subcategoryId) {
      nextParams.set('subcategory', subcategoryId);
    } else {
      nextParams.delete('subcategory');
    }
    setSearchParams(nextParams);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const pageName = currentSubcategory?.name || currentCategory?.name;
  const displayName = searchQuery
    ? `Search Results for "${searchQuery}"`
    : isBestSellerParam === 'true'
      ? 'Best Sellers'
      : isNewParam === 'true'
        ? 'New Arrivals'
        : pageName || (categoryId ? titleCase(categoryId) : 'All Products');
  const h1 = categoryContent?.h1 || displayName;
  const seoTitle = pageName ? `${pageName} Online` : displayName;
  const seoDescription = categoryContent?.intro[0] || (currentCategory
    ? `Shop premium ${currentCategory.name.toLowerCase()} from Signature Drapes. Explore quality designs for homes, offices, and commercial interiors.`
    : DEFAULT_DESCRIPTION);
  const canonicalPath = categoryId ? categoryPath(categoryId, subcategoryParam || undefined) : '/products';
  const shouldNoindex = Boolean(
    isInvalidListing ||
    isEmptyValidCategory ||
    searchQuery ||
    hasActiveFilters ||
    currentPage > 1 ||
    isBestSellerParam ||
    isNewParam
  );
  const breadcrumbItems = categoryId
    ? [
        { name: 'Home', path: '/' },
        { name: currentCategory?.name || titleCase(categoryId), path: categoryPath(categoryId) },
        ...(currentSubcategory ? [{ name: currentSubcategory.name, path: canonicalPath }] : [])
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' }
      ];
  const schemas = isInvalidListing
    ? null
    : [
        collectionSchema(seoTitle, seoDescription, canonicalPath),
        breadcrumbSchema(breadcrumbItems),
        ...(categoryContent?.faqs.length ? [faqSchema(categoryContent.faqs)] : [])
      ];

  if (isInvalidListing) {
    const invalidName = isInvalidCategory ? titleCase(categoryId || '') : titleCase(subcategoryParam);

    return (
      <>
        <SEO
          title={`${invalidName || 'Category'} Not Found`}
          description="This Signature Drapes category page does not exist."
          canonicalPath={categoryId ? `/category/${categoryId}` : '/products'}
          robots="noindex, nofollow"
        />
        <main className="min-h-screen bg-background">
          <div className="container-premium py-16 text-center">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Category not found</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-gray-950">
              We could not find this category
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-7">
              The category URL may be outdated or typed incorrectly. Browse our active interior categories to continue shopping.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/products">View All Products</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/category/curtains-and-accessories">Shop Curtains</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={pageName ? `${pageName}, ${pageName} online, home decor, interior furnishing, Signature Drapes` : undefined}
        canonicalPath={canonicalPath}
        robots={shouldNoindex ? 'noindex, follow' : 'index, follow'}
        structuredData={schemas}
      />
      <main className="min-h-screen bg-background">
        <div className="w-full px-0 md:px-4 py-4 md:py-8">
          <header className="mb-8 px-3 md:px-0">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Signature Drapes Collection
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-950">
              {h1}
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">
              {categoryContent?.intro[0] || seoDescription}
            </p>
            <p className="text-muted-foreground mt-3">
              {isFetchComplete ? `${totalProducts} products found` : 'Loading products...'}
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </header>

          {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
            <nav aria-label="Subcategories" className="mb-6 flex gap-2 overflow-x-auto px-3 md:px-0 pb-2">
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
            </nav>
          )}

          <div className="flex gap-8">
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

            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between gap-3 px-3 md:px-0">
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
                <div className="hidden md:flex items-center gap-2">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')} aria-label="Grid view">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} aria-label="List view">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {(loading || isInitialLoad) ? (
                <div className="grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-t border-l border-gray-100/50 md:border-none">
                  {Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="border border-gray-100 bg-white px-6 py-12 text-center">
                  <h2 className="text-xl font-semibold text-gray-950">
                    {isEmptyValidCategory ? 'Products for this category are being updated' : 'No products matched these filters'}
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-muted-foreground leading-7">
                    {isEmptyValidCategory
                      ? 'This is a valid Signature Drapes category, but active products are not available right now. Please explore related categories or contact us for custom assistance.'
                      : 'Try clearing filters or browsing the full category collection.'}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                    <Button asChild>
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={`grid gap-x-0 sm:gap-x-6 gap-y-0 sm:gap-y-10 border-t border-l border-gray-100/50 md:border-none ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1'}`}>
                    {currentProducts.map(product => (
                      <ProductCard key={product._id} product={product} className={viewMode === 'list' ? 'flex-row' : ''} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3"
                      >
                        Previous Page
                      </Button>

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

          <CategorySeoSection content={categoryContent} />
        </div>
      </main>
    </>
  );
};

export default ProductListing;
