import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';

interface MarriageCardProductProps {
    product: Product;
    index: number;
    className?: string;
}

export function MarriageCardProduct({ product, index, className = '' }: MarriageCardProductProps) {
    const primaryImage = product.images[0];

    // Define different "Marriage Card" styles
    const styles = [
        {
            bg: 'bg-[#FFF9F2]', // Ivory
            border: 'border-[#D4AF37]', // Gold
            accent: 'text-[#D4AF37]',
            pattern: 'radial-gradient(circle at 10px 10px, #D4AF37 1px, transparent 0)',
            patternSize: '20px 20px',
            corner: 'border-tl-[40px] border-br-[40px]'
        },
        {
            bg: 'bg-[#FDF2F4]', // Soft Pink
            border: 'border-[#B03060]', // Maroon
            accent: 'text-[#B03060]',
            pattern: 'linear-gradient(45deg, #B03060 1px, transparent 1px)',
            patternSize: '15px 15px',
            corner: 'rounded-[30px] border-t-8 border-b-8'
        },
        {
            bg: 'bg-[#F0F7F4]', // Soft Emerald
            border: 'border-[#2E8B57]', // Sea Green
            accent: 'text-[#2E8B57]',
            pattern: 'repeating-conic-gradient(#2E8B57 0 15deg, transparent 0 30deg)',
            patternSize: '40px 40px',
            corner: 'rounded-none border-double border-4'
        }
    ];

    const currentStyle = styles[index % styles.length];

    return (
        <div className={`flex flex-col items-center group bg-white p-2 md:p-3 rounded-none shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300 ${className}`}>
            <Link to={`/product/${product._id}`} className="w-full relative">
                {/* Marriage Card Background & Border */}
                <div
                    className={`relative aspect-[4/5] p-2 transition-all duration-500 border-4 ${currentStyle.bg} ${currentStyle.border} ${currentStyle.corner}`}
                >
                    {/* Pattern Opacity Layer */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: currentStyle.pattern, backgroundSize: currentStyle.patternSize }}></div>
                    {/* Decorative Corner Ornaments (SVG) */}
                    <div className="absolute top-1 left-1 w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentStyle.accent}>
                            <path d="M0 0 L100 0 L100 5 L5 5 L5 100 L0 100 Z" fill="currentColor" />
                            <circle cx="15" cy="15" r="5" fill="currentColor" />
                        </svg>
                    </div>
                    <div className="absolute bottom-1 right-1 w-8 h-8 rotate-180 opacity-40 group-hover:opacity-100 transition-opacity">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentStyle.accent}>
                            <path d="M0 0 L100 0 L100 5 L5 5 L5 100 L0 100 Z" fill="currentColor" />
                            <circle cx="15" cy="15" r="5" fill="currentColor" />
                        </svg>
                    </div>

                    {/* Product Image Holder */}
                    <div className="relative w-full h-full overflow-hidden shadow-md">
                        <img
                            src={primaryImage.url}
                            alt={product.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        {/* Soft Shadow inside the frame */}
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
                    </div>
                </div>

                {/* Ornamental Typography */}
                <div className="mt-3 px-2 text-center relative">
                    {/* Decorative separator */}
                    <div className={`flex items-center justify-center gap-2 mb-1 ${currentStyle.accent}`}>
                        <div className="h-[1px] w-4 bg-current opacity-30"></div>
                        <span className="text-[7px] uppercase tracking-[0.3em] font-bold">Signature Choice</span>
                        <div className="h-[1px] w-4 bg-current opacity-30"></div>
                    </div>

                    <h3 className="text-[11px] md:text-sm font-bold text-gray-900 line-clamp-2 leading-tight uppercase tracking-wider px-1">
                        {product.name}
                    </h3>

                    {/* Price with elegant styling */}
                    <div className={`mt-1 font-bold text-[10px] md:text-xs ${currentStyle.accent}`}>
                        ₹{product.price.toLocaleString()}
                    </div>

                    {/* Bottom flourish */}
                    <div className={`mt-2 h-0.5 w-6 mx-auto bg-current opacity-20 group-hover:w-12 transition-all duration-500 ${currentStyle.accent}`}></div>
                </div>
            </Link>
        </div>
    );
}
