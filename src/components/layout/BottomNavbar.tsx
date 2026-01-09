import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, User } from 'lucide-react';

export function BottomNavbar() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Only show on mobile and only on the Home page
    if (!isHomePage) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t py-2 px-6 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <Link
                to="/"
                className="flex flex-col items-center gap-1 text-[#206060] hover:text-[#1a4d4d] transition-colors"
            >
                <Home className="h-6 w-6" />
                <span className="text-[10px] font-semibold">Home</span>
            </Link>

            <Link
                to="/gallery"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#206060] transition-colors"
            >
                <Image className="h-6 w-6" />
                <span className="text-[10px] font-medium">Gallery</span>
            </Link>

            <Link
                to="/account"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#206060] transition-colors"
            >
                <User className="h-6 w-6" />
                <span className="text-[10px] font-medium">Account</span>
            </Link>
        </div>
    );
}
