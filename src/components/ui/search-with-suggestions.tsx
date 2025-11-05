import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, Tag, Package, Building2, Palette, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/contexts/ProductContext';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag' | 'feature' | 'material';
}

interface SearchWithSuggestionsProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showRecentSearches?: boolean;
}

const SUGGESTION_ICONS = {
  product: Package,
  category: Tag,
  brand: Building2,
  tag: Tag,
  feature: Sparkles,
  material: Palette,
};

const SUGGESTION_COLORS = {
  product: 'bg-blue-50 text-blue-700 border-blue-200',
  category: 'bg-green-50 text-green-700 border-green-200',
  brand: 'bg-purple-50 text-purple-700 border-purple-200',
  tag: 'bg-orange-50 text-orange-700 border-orange-200',
  feature: 'bg-pink-50 text-pink-700 border-pink-200',
  material: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export function SearchWithSuggestions({
  onSearch,
  placeholder = "Search by product code, name, price, category...",
  className,
  showRecentSearches = true
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { getSearchSuggestions } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches) {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    }
  }, [showRecentSearches]);

  // Debounced search suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getSearchSuggestions(searchQuery);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [getSearchSuggestions]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    if (showRecentSearches) {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }

    onSearch(searchQuery.trim());
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalSuggestions = suggestions.length + (showRecentSearches ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalSuggestions);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalSuggestions - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < recentSearches.length) {
            handleSearch(recentSearches[selectedIndex]);
          } else {
            const suggestionIndex = selectedIndex - recentSearches.length;
            handleSuggestionClick(suggestions[suggestionIndex]);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const SuggestionIcon = ({ type }: { type: SearchSuggestion['type'] }) => {
    const Icon = SUGGESTION_ICONS[type];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10 focus:ring-primary"
        />
        <Button
          type="button"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => handleSearch()}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length >= 2 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && query.length < 2 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={search}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors",
                      selectedIndex === index && "bg-muted"
                    )}
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {query.length >= 2 && (
            <div className="p-3">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground mb-2 block">
                    Suggestions
                  </span>
                  {suggestions.map((suggestion, index) => {
                    const adjustedIndex = index + (showRecentSearches ? recentSearches.length : 0);
                    return (
                      <button
                        key={`${suggestion.type}-${suggestion.text}`}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2",
                          selectedIndex === adjustedIndex && "bg-muted"
                        )}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <SuggestionIcon type={suggestion.type} />
                        <span className="flex-1">{suggestion.text}</span>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", SUGGESTION_COLORS[suggestion.type])}
                        >
                          {suggestion.type}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              ) : query.length >= 2 && !loading ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No suggestions found for "{query}"
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
