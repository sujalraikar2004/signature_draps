import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Image, User, Headset, WhatsappLogo } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNavbar() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;

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

    const navItems = [
        { label: 'Home', icon: House, path: '/', type: 'link' },
        { label: 'Support', icon: Headset, path: '/contact', type: 'link' },
        { label: 'Gallery', icon: Image, path: '/gallery', type: 'center' },
        { label: 'Contact', icon: WhatsappLogo, path: 'https://wa.me/919036587169', type: 'external' },
        { label: 'Profile', icon: User, path: isAuthenticated ? '/profile' : '/login', type: 'link' },
    ];

    return (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full'}`}>
            <div className="bg-white border-t border-gray-200 py-3 px-2 flex items-center justify-around relative">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = item.type === 'link' && isActive(item.path);
                    const isGalleryActive = item.type === 'center' && isActive(item.path);

                    if (item.type === 'center') {
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className="flex flex-col items-center group relative h-full px-4"
                            >
                                <div className={`transition-all duration-300 ${isGalleryActive ? 'text-[#206060]' : 'text-gray-900 group-hover:text-[#206060]'}`}>
                                    <Icon size={28} weight={isGalleryActive ? "fill" : "regular"} />
                                </div>
                                <span className={`text-[11px] mt-1 font-bold tracking-tight transition-colors duration-200 ${isGalleryActive ? 'text-[#206060]' : 'text-gray-900'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    if (item.type === 'external') {
                        return (
                            <a
                                key={index}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1 group"
                            >
                                <Icon size={24} weight="regular" className="text-gray-900 transition-all duration-300 group-hover:text-[#25D366]" />
                                <span className="text-[11px] font-bold tracking-tight text-gray-900">{item.label}</span>
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 group`}
                        >
                            <Icon
                                size={24}
                                weight={active ? "fill" : "regular"}
                                className={`transition-all duration-300 ${active ? 'text-[#206060]' : 'text-gray-900 group-hover:text-[#206060]'}`}
                            />
                            <span className={`text-[11px] tracking-tight transition-colors duration-200 ${active ? 'text-[#206060]' : 'text-gray-900 font-bold'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
