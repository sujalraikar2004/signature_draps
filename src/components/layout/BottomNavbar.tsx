import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { count } from 'console';

export function BottomNavbar() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isGalleryPage = location.pathname === '/gallery';
    const isProfilePage = location.pathname === '/profile';
    const { isAuthenticated } = useAuth();
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t py-2 px-6 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <Link
                to="/"
                className={`flex flex-col items-center gap-1 transition-colors ${isHomePage ? 'text-[#206060]' : 'text-gray-500 hover:text-[#206060]'}`}
            >
                <Home className={`h-6 w-6 ${isHomePage ? 'fill-[#206060]/10' : ''}`} />
                <span className={`text-[10px] ${isHomePage ? 'font-bold' : 'font-medium'}`}>Home</span>
            </Link>

            <Link
                to="/gallery"
                className={`flex flex-col items-center gap-1 transition-colors ${isGalleryPage ? 'text-[#206060]' : 'text-gray-500 hover:text-[#206060]'}`}
            >
                <Image className={`h-6 w-6 ${isGalleryPage ? 'fill-[#206060]/10' : ''}`} />
                <span className={`text-[10px] ${isGalleryPage ? 'font-bold' : 'font-medium'}`}>Gallery</span>
            </Link>

            <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className={`flex flex-col items-center gap-1 transition-colors ${isProfilePage || location.pathname === '/login' ? 'text-[#206060]' : 'text-gray-500 hover:text-[#206060]'}`}
            >
                <User className={`h-6 w-6 ${isProfilePage || location.pathname === '/login' ? 'fill-[#206060]/10' : ''}`} />
                <span className={`text-[10px] ${isProfilePage || location.pathname === '/login' ? 'font-bold' : 'font-medium'}`}>Account</span>
            </Link>
        </div>
    );
}
