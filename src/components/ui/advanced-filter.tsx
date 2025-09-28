import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Palette, 
  Tag, 
  DollarSign, 
  Package, 
  Sparkles,
  RotateCcw,
  Check,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FilterProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  className?: string;
  debounceMs?: number;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  rating: number;
  colors: string[];
  materials: string[];
  brands: string[];
  features: string[];
  sortBy: string;
}

const CATEGORIES = [
  { id: 'curtains-furnishing', name: 'Curtains & Furnishing', icon: '🪟', color: 'bg-blue-100 text-blue-700' },
  { id: 'blinds', name: 'Blinds', icon: '🎭', color: 'bg-green-100 text-green-700' },
  { id: 'bean-bags', name: 'Bean Bags', icon: '🪑', color: 'bg-purple-100 text-purple-700' },
  { id: 'wallpaper', name: 'Wallpaper', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  { id: 'carpets-rugs', name: 'Carpets & Rugs', icon: '🏠', color: 'bg-orange-100 text-orange-700' },
];

const COLORS = [
  { name: 'Red', value: 'red', hex: '#ef4444' },
  { name: 'Blue', value: 'blue', hex: '#3b82f6' },
  { name: 'Green', value: 'green', hex: '#10b981' },
  { name: 'Yellow', value: 'yellow', hex: '#f59e0b' },
  { name: 'Purple', value: 'purple', hex: '#8b5cf6' },
  { name: 'Pink', value: 'pink', hex: '#ec4899' },
  { name: 'Gray', value: 'gray', hex: '#6b7280' },
  { name: 'Black', value: 'black', hex: '#1f2937' },
  { name: 'White', value: 'white', hex: '#f9fafb' },
  { name: 'Brown', value: 'brown', hex: '#92400e' },
];

const MATERIALS = [
  'Cotton', 'Silk', 'Polyester', 'Linen', 'Velvet', 'Wool', 'Jute', 'Synthetic'
];

const BRANDS = [
  'Signature Drapes', 'Premium Collection', 'Luxury Line', 'Classic Series', 'Modern Touch'
];

const FEATURES = [
  'Blackout', 'Thermal Insulated', 'Noise Reducing', 'Easy Care', 'Fade Resistant', 
  'Machine Washable', 'Eco-Friendly', 'Fire Retardant', 'Anti-Bacterial', 'UV Protection'
];

export const AdvancedFilter = React.memo(({ 
  onFiltersChange, 
  initialFilters, 
  className,
  debounceMs = 300 
}: FilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 50000],
    inStock: false,
    rating: 0,
    colors: [],
    materials: [],
    brands: [],
    features: [],
    sortBy: 'relevance',
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: false,
    colors: false,
    materials: false,
    brands: false,
    features: false,
  });

  const [searchTerms, setSearchTerms] = useState({
    materials: '',
    brands: '',
    features: '',
  });

  // Debounced filter change handler
  const debouncedOnFiltersChange = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (newFilters: FilterState) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onFiltersChange(newFilters);
        }, debounceMs);
      };
    })(),
    [onFiltersChange, debounceMs]
  );

  useEffect(() => {
    debouncedOnFiltersChange(filters);
  }, [filters, debouncedOnFiltersChange]);

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((key: 'colors' | 'materials' | 'brands' | 'features', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: '',
      priceRange: [0, 50000],
      inStock: false,
      rating: 0,
      colors: [],
      materials: [],
      brands: [],
      features: [],
      sortBy: 'relevance',
    });
  }, []);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const getActiveFiltersCount = useMemo(() => {
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
  }, [filters]);

  const FilterSection = React.memo(({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    icon: any; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  ));

  const filteredItems = useCallback((items: string[], searchTerm: string) => {
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Smart Filters</h3>
            <p className="text-sm text-muted-foreground">
              {getActiveFiltersCount} filter{getActiveFiltersCount !== 1 ? 's' : ''} active
            </p>
          </div>
        </div>
        
        {getActiveFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="Categories" icon={Tag} sectionKey="category">
        <div className="grid grid-cols-1 gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', 
                filters.category === category.id ? '' : category.id
              )}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-colors duration-150 text-left",
                filters.category === category.id
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <span className="text-2xl">{category.icon}</span>
              <div className="flex-1">
                <span className="font-medium">{category.name}</span>
              </div>
              {filters.category === category.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" icon={DollarSign} sectionKey="price">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              ₹{filters.priceRange[0].toLocaleString()}
            </span>
            <span className="text-sm font-medium">
              ₹{filters.priceRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={50000}
            min={0}
            step={500}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter('inStock', checked === true)}
            />
            <Label htmlFor="in-stock" className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              In Stock Only
            </Label>
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Customer Rating" icon={Star} sectionKey="rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg w-full text-left transition-colors duration-150",
                filters.rating === rating
                  ? "bg-primary/10 border border-primary/50"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm">& up</span>
              {filters.rating === rating && (
                <Check className="h-4 w-4 text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" icon={Palette} sectionKey="colors">
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => toggleArrayFilter('colors', color.value)}
              className={cn(
                "relative p-1 rounded-lg border-2 transition-colors duration-150",
                filters.colors.includes(color.value)
                  ? "border-primary shadow-md"
                  : "border-border/50 hover:border-primary/50"
              )}
              title={color.name}
            >
              <div
                className="w-8 h-8 rounded-md border border-border/50"
                style={{ backgroundColor: color.hex }}
              />
              {filters.colors.includes(color.value) && (
                <Check className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-background rounded-full p-0.5" />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Materials */}
      <FilterSection title="Materials" icon={Sparkles} sectionKey="materials">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchTerms.materials}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, materials: e.target.value }))}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {filteredItems(MATERIALS, searchTerms.materials).map((material) => (
              <button
                key={material}
                onClick={() => toggleArrayFilter('materials', material)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-sm transition-colors duration-150",
                  filters.materials.includes(material)
                    ? "bg-primary/10 border border-primary/50 text-primary"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <Checkbox
                  checked={filters.materials.includes(material)}
                />
                <span>{material}</span>
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" icon={Tag} sectionKey="brands">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchTerms.brands}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, brands: e.target.value }))}
              className="pl-10"
            />
          </div>
          <div className="space-y-2">
            {filteredItems(BRANDS, searchTerms.brands).map((brand) => (
              <button
                key={brand}
                onClick={() => toggleArrayFilter('brands', brand)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-sm w-full text-left transition-colors duration-150",
                  filters.brands.includes(brand)
                    ? "bg-primary/10 border border-primary/50 text-primary"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <Checkbox
                  checked={filters.brands.includes(brand)}
                />
                <span>{brand}</span>
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features" icon={Sparkles} sectionKey="features">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchTerms.features}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, features: e.target.value }))}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {filteredItems(FEATURES, searchTerms.features).map((feature) => (
              <button
                key={feature}
                onClick={() => toggleArrayFilter('features', feature)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-sm transition-colors duration-150",
                  filters.features.includes(feature)
                    ? "bg-primary/10 border border-primary/50 text-primary"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <Checkbox
                  checked={filters.features.includes(feature)}
                />
                <span>{feature}</span>
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Active Filters Summary */}
      {getActiveFiltersCount > 0 && (
        <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {CATEGORIES.find(c => c.id === filters.category)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter('category', '')}
                />
              </Badge>
            )}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter('priceRange', [0, 50000])}
                />
              </Badge>
            )}
            {filters.rating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.rating}+ Stars
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter('rating', 0)}
                />
              </Badge>
            )}
            {filters.colors.map(color => (
              <Badge key={color} variant="secondary" className="flex items-center gap-1">
                {color}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => toggleArrayFilter('colors', color)}
                />
              </Badge>
            ))}
            {filters.materials.map(material => (
              <Badge key={material} variant="secondary" className="flex items-center gap-1">
                {material}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => toggleArrayFilter('materials', material)}
                />
              </Badge>
            ))}
            {filters.brands.map(brand => (
              <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                {brand}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => toggleArrayFilter('brands', brand)}
                />
              </Badge>
            ))}
            {filters.features.map(feature => (
              <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                {feature}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => toggleArrayFilter('features', feature)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
AdvancedFilter.displayName = 'AdvancedFilter';
