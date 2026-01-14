import React from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import "./ImageViewer.css";

export interface GalleryImage {
    id: number | string;
    src: string;
    category: string;
    title: string;
    type?: 'image' | 'video';
    thumbnailUrl?: string;
}

interface ImageViewerProps {
    images: GalleryImage[];
    index: number;
    onClose: () => void;
    onChange: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, index, onClose, onChange }) => {
    const currentImage = images[index];
    const [isZoomed, setIsZoomed] = React.useState(false);

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

    // Reset zoom when changing images
    React.useEffect(() => {
        setIsZoomed(false);
    }, [index]);

    if (!currentImage) return null;

    return (
        <div className="overlay fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center transition-all duration-300 animate-fade-in">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/95 to-black/90"></div>
            
            {/* Top bar with controls */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                {/* Image counter */}
                <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20 animate-slide-in-left">
                    <span className="font-bold text-lg">{index + 1}</span>
                    <span className="mx-2 text-white/60">/</span>
                    <span className="text-white/80">{images.length}</span>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="group p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 transform hover:scale-110 hover:rotate-90 border border-white/20 animate-slide-in-right"
                    aria-label="Close"
                >
                    <X size={24} strokeWidth={2} />
                </button>
            </div>

            <div className="flex items-center justify-center w-full h-full px-4 md:px-8 relative">

                {/* Left Arrow - Enhanced */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (index > 0) onChange(index - 1);
                    }}
                    disabled={index === 0}
                    className={`absolute left-4 md:left-8 z-40 group p-4 md:p-5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-0 disabled:pointer-events-none border border-white/20 hover:border-white/40 ${
                        index === 0 ? 'invisible' : ''
                    }`}
                    aria-label="Previous"
                >
                    <ChevronLeft size={32} strokeWidth={2.5} className="transform group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Media Container - Much Larger */}
                <div className="flex-1 flex flex-col items-center justify-center h-full py-4 md:py-6 max-w-7xl mx-auto">
                    <div
                        className="relative w-full flex flex-col items-center animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {currentImage.type === 'video' ? (
                            <video
                                src={currentImage.src}
                                controls
                                autoPlay
                                className={`w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-black/50 transition-all duration-500 ${
                                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                                }`}
                                onClick={() => setIsZoomed(!isZoomed)}
                            />
                        ) : (
                            <img
                                src={currentImage.src}
                                alt={currentImage.title}
                                className={`w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-black/50 transition-all duration-500 ${
                                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in hover:scale-105'
                                }`}
                                onClick={() => setIsZoomed(!isZoomed)}
                            />
                        )}

                        {/* Zoom indicator for images */}
                        {currentImage.type !== 'video' && !isZoomed && (
                            <div className="absolute top-4 right-4 px-3 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium border border-white/20 flex items-center gap-2 animate-fade-in">
                                <ZoomIn size={14} />
                                <span>Click to zoom</span>
                            </div>
                        )}

                        {/* Caption - Enhanced */}
                        <div className="mt-8 text-center px-4 animate-fade-in-up max-w-2xl">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3">
                                <p className="text-white/80 text-xs uppercase tracking-widest font-semibold">{currentImage.category}</p>
                            </div>
                            <h3 className="text-white text-2xl md:text-3xl font-heading font-semibold tracking-wide leading-tight">
                                {currentImage.title}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Right Arrow - Enhanced */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (index < images.length - 1) onChange(index + 1);
                    }}
                    disabled={index === images.length - 1}
                    className={`absolute right-4 md:right-8 z-40 group p-4 md:p-5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-0 disabled:pointer-events-none border border-white/20 hover:border-white/40 ${
                        index === images.length - 1 ? 'invisible' : ''
                    }`}
                    aria-label="Next"
                >
                    <ChevronRight size={32} strokeWidth={2.5} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ImageViewer;
