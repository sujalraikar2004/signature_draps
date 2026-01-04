import React from 'react';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./ImageViewer.css";

export interface GalleryImage {
    id: number | string;
    src: string;
    category: string;
    title: string;
}

interface ImageViewerProps {
    images: GalleryImage[];
    index: number;
    onClose: () => void;
    onChange: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, index, onClose, onChange }) => {
    const currentImage = images[index];

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && index > 0) onChange(index - 1);
            if (e.key === 'ArrowRight' && index < images.length - 1) onChange(index + 1);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index, images.length, onClose, onChange]);

    if (!currentImage) return null;

    return (
        <div className="overlay fixed inset-0 z-[9999] bg-white/95 flex items-center justify-center backdrop-blur-md transition-all duration-300">

            {/* Close */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 z-50"
            >
                <X size={32} strokeWidth={1.5} />
            </button>

            <div className="flex items-center justify-between w-full h-full max-w-[95vw] px-4 md:px-10 relative">

                {/* Left Arrow */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (index > 0) onChange(index - 1);
                    }}
                    disabled={index === 0}
                    className={`p-3 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transform hover:scale-110 ${index === 0 ? 'invisible' : ''}`}
                >
                    <ChevronLeft size={48} strokeWidth={1} />
                </button>

                {/* Image Container */}
                <div className="flex-1 flex flex-col items-center justify-center h-full py-8 md:py-12" onClick={onClose}>
                    <div
                        className="relative max-h-[85vh] max-w-full flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={currentImage.src}
                            alt={currentImage.title}
                            className="imgContainer max-h-[75vh] md:max-h-[80vh] max-w-full object-contain shadow-2xl rounded-sm"
                        />

                        {/* Caption - Soft and subtle */}
                        <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-gray-900 text-xl font-heading font-light tracking-wide">{currentImage.title}</h3>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{currentImage.category}</p>
                        </div>
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (index < images.length - 1) onChange(index + 1);
                    }}
                    disabled={index === images.length - 1}
                    className={`p-3 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transform hover:scale-110 ${index === images.length - 1 ? 'invisible' : ''}`}
                >
                    <ChevronRight size={48} strokeWidth={1} />
                </button>
            </div>
        </div>
    );
};

export default ImageViewer;
