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
        <div className={`md:hidden fixed bottom-6 left-5 right-5 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-32'}`}>
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] py-3 px-5 flex items-center justify-between relative ring-1 ring-black/[0.05]">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = item.type === 'link' && isActive(item.path);
                    const isGalleryActive = item.type === 'center' && isActive(item.path);

                    if (item.type === 'center') {
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className="relative -top-7 flex flex-col items-center group"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 active:scale-95 ${isGalleryActive ? 'bg-[#206060] text-white' : 'bg-[#206060] text-white'}`}>
                                    <Icon size={28} weight={isGalleryActive ? "fill" : "regular"} />
                                </div>
                                <span className={`text-[10px] mt-1.5 font-bold tracking-tight transition-colors duration-200 ${isGalleryActive ? 'text-[#206060]' : 'text-gray-400 group-hover:text-[#206060]'}`}>
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
                                className="flex flex-col items-center gap-1.5 min-w-[50px] group"
                            >
                                <Icon size={24} weight="regular" className="text-gray-400 transition-all duration-300 group-hover:text-[#25D366] group-hover:scale-110" />
                                <span className="text-[10px] font-bold tracking-tight text-gray-400 group-hover:text-gray-600">{item.label}</span>
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex flex-col items-center gap-1.5 min-w-[50px] transition-all duration-300 group hover:scale-105 active:scale-95`}
                        >
                            <Icon
                                size={24}
                                weight={active ? "fill" : "regular"}
                                className={`transition-all duration-300 ${active ? 'text-[#206060] scale-110' : 'text-gray-400 group-hover:text-[#206060]'}`}
                            />
                            <span className={`text-[10px] tracking-tight transition-colors duration-200 ${active ? 'text-[#206060] font-bold' : 'text-gray-400 font-bold group-hover:text-gray-600'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
