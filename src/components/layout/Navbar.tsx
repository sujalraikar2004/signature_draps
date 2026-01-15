import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, MapPin, Image, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchWithSuggestions } from '@/components/ui/search-with-suggestions';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
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
  const cart = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';

  const itemCount = cart?.getItemCount() || 0;

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
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
    <>
      <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur  supports-[backdrop-filter]:bg-background/60">
        {/* Top Bar */}
        {/* <div className="bg-[#061E29] text-primary-foreground  ">
        <div className="container-premium">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Shree Siddhi Decor - curtain and furnishings website</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>📞 +919036587169</span>
              <span>✉️ signaturedrapes31@gmail.com</span>
            </div>
          </div>
        </div>
      </div> */}

        {/* Main Navigation */}
        <div className="bg-[#206060] text-white py-2  px-4 " >
          <div className="flex h-8  md:h-30 items-center justify-between">
            {/* Mobile Back Arrow */}
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Logo */}
            <Link to="/" className={`flex items-center ${!isHome ? 'hidden md:flex' : ''}`}>
              <img
                src="https://res.cloudinary.com/dvesn2uo2/image/upload/v1767972463/Dark_Green_Modern_Initial_Logo_3_veq59q.png"
                className="h-5 md:h-12 w-auto object-contain drop-shadow-sm"
              />
            </Link>

            <div></div>

            {/* Search Bar - Desktop */}
            <div className={`hidden md:flex flex-1 max-w-xl mx-8 ${location.pathname === '/contact' ? 'invisible' : ''}`}>
              <SearchWithSuggestions
                onSearch={handleSearch}
                placeholder="Search by product code, name, price, category..."
                className="w-full"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-0.3">
              {/* User Menu */}
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                    <User className="=  h-4 w-4" />
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
                      <DropdownMenuItem onClick={() => navigate('/my-orders')}>
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
                className={`relative ${isProfile ? 'hidden md:flex' : ''}`}
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Wishlist</span>
                {isAuthenticated && wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className=" absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cart')}
                className={`relative ${isProfile ? 'hidden md:flex' : ''}`}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/gallery')}
                className="relative hidden md:block"
              >
                <Image className=" md:h-4 md:w-4" />
                <span className="hidden sm:inline ml-1">Gallery</span>
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
        </div>
      </header>

      {/* Category Navigation - Desktop */}
      <div className="bg-[#061E29] hidden md:flex border-t border-[#1D546D]">
        <nav className="container-premium flex items-center space-x-8 px-5 h-12">
          <Link
            to="/"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-full font-medium text-gray-300 hover:text-white p-0 hover:bg-transparent data-[state=open]:text-white">
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

          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
      {!isProfile && location.pathname !== '/contact' && (
        <div className="md:hidden flex flex-1 max-w-xl mx-3 my-3">
          <SearchWithSuggestions
            onSearch={handleSearch}
            placeholder="Search by product code, name, price, category..."
            className="w-full"
          />
        </div>
      )}
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className=" w-full h-full bg-black/50">
          <div
            className={`
    fixed top-0 right-0 z-50 h-full w-1/2
    bg-background border-l
    transform transition-transform duration-300 ease-in-out
    md:hidden
    ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
  `}
          >
            <div className="container-premium py-6">
              {/* Close Button (optional but recommended) */}
              <button
                className="mb-4 text-sm text-muted-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕ Close
              </button>

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

                <div className="grid grid-cols-2 gap-4 mt-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-all group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-primary transition-all">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-center line-clamp-2">
                        {category.shortName || category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      )}

    </>

  );
}