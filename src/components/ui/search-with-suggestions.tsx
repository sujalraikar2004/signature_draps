import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, Tag, Building2, Sparkles, Palette } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';
import api from '@/Api';

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'tag' | 'feature' | 'material';
  value: string;
  label: string;
  description?: string;
  count?: number;
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  className?: string;
}

const SUGGESTION_ICONS = {
  product: Package,
  category: Tag,
  brand: Building2,
  tag: Tag,
  feature: Sparkles,
  material: Palette,
};

export function SearchWithSuggestions({ 
  placeholder = "Search products, categories...", 
  className = "" 
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/product/search?q=${encodeURIComponent(query.trim())}`);
        
        if (response.data.success) {
          const results: SearchSuggestion[] = [];

          // Add products
          response.data.data.products?.forEach((product: any) => {
            results.push({
              type: 'product',
              value: product._id,
              label: product.name,
              description: product.category?.name || '',
            });
          });

          // Add categories
          response.data.data.categories?.forEach((category: any) => {
            results.push({
              type: 'category',
              value: category._id,
              label: category.name,
              count: category.productCount,
            });
          });

          // Add unique brands
          const brands = new Set<string>();
          response.data.data.products?.forEach((product: any) => {
            if (product.brand) brands.add(product.brand);
          });
          brands.forEach(brand => {
            results.push({
              type: 'brand',
              value: brand,
              label: brand,
            });
          });

          setSuggestions(results);
          setIsOpen(results.length > 0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      setIsOpen(false);
      setQuery('');
      setSuggestions([]);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);

    switch (suggestion.type) {
      case 'product':
        navigate(`/product/${suggestion.value}`);
        break;
      case 'category':
        navigate(`/products?category=${encodeURIComponent(suggestion.label)}`);
        break;
      case 'brand':
        navigate(`/products?brand=${encodeURIComponent(suggestion.value)}`);
        break;
      default:
        navigate(`/products?search=${encodeURIComponent(suggestion.label)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-7 w-7 p-0"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => handleSearch()}
            className="h-7 px-3"
            disabled={!query.trim()}
          >
            <Search className="h-3.5 w-3.5 mr-1" />
            Search
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => {
                const Icon = SUGGESTION_ICONS[suggestion.type];
                return (
                  <button
                    key={`${suggestion.type}-${suggestion.value}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left hover:bg-accent transition-colors flex items-center gap-3",
                      selectedIndex === index && "bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{suggestion.label}</div>
                      {suggestion.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {suggestion.description}
                        </div>
                      )}
                    </div>
                    {suggestion.count !== undefined && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {suggestion.count} items
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground capitalize flex-shrink-0">
                      {suggestion.type}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
