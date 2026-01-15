import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Headset } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function FloatingContact() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const isHomePage = location.pathname === '/';

    return (
        <div className="fixed bottom-8 right-8 z-[60] hidden md:block">
            <Link
                to={isAuthenticated ? "/contact" : "/login"}
                className="group flex items-center gap-3"
            >
                {isHomePage && (
                    <span className="bg-[#206060] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform transition-all duration-300 group-hover:scale-105">
                        Support
                    </span>
                )}
                <div className="bg-[#206060] text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white/20">
                    <Headset className="h-6 w-6" />
                </div>
            </Link>
        </div>
    );
}
