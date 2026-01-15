import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, User, ContactIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNavbar() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isGalleryPage = location.pathname === '/gallery';
    const isProfilePage = location.pathname === '/profile';
    const { isAuthenticated } = useAuth();

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;

            // Show after scrolling stops
            scrollTimeout.current = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    // Only show on home page
    if (!isHomePage) return null;

    return (
        <div
            className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-2 px-2 flex items-center justify-around transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
        >
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
            <Link
                to={isAuthenticated ? "/contact" : "/login"}
                className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/contact' ? 'text-[#206060]' : 'text-gray-500 hover:text-[#206060]'}`}
            >
                <ContactIcon className={`h-6 w-6 ${location.pathname === '/contact' ? 'fill-[#206060]/10' : ''}`} />
                <span className={`text-[10px] ${location.pathname === '/contact' ? 'font-bold' : 'font-medium'}`}>Contact</span>
            </Link>
        </div>
    );
}
