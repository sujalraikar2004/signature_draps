import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/data/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const itemCount = cart?.getItemCount() || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-premium">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Free Delivery in Mumbai & Delhi</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>📞 +91 98765 43210</span>
              <span>✉️ info@signaturedraps.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-premium">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-gold px-3 py-1 rounded-lg">
              <span className="text-xl font-heading font-bold text-primary">SD</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-heading font-bold text-primary">Signature</span>
              <span className="text-xl font-heading font-bold text-accent ml-1">Draps</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="search"
                placeholder="Search for curtains, blinds, wallpapers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none focus:ring-primary"
              />
              <Button 
                type="submit" 
                className="rounded-l-none btn-hero"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isAuthenticated ? user?.username?.split(' ')[0] : 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')}>
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/register')}>
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/wishlist')}
              className="relative"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Wishlist</span>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Cart</span>
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <div className="hidden md:flex border-t">
          <nav className="flex h-12 items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-full font-medium">
                  All Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{category.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {category.productCount}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container-premium py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex mb-4">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none btn-hero">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Navigation
              </h3>
              <Link
                to="/"
                className="block py-2 text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mt-4">
                Categories
              </h3>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="block py-2 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}