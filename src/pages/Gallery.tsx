import React, { useState } from "react";
import ImageViewer, { GalleryImage } from "../components/ImageViewers/ImageViewer.tsx";


const galleryData: GalleryImage[] = [
    // Curtains
    {
        id: 1,
        category: "Curtains",
        title: "Sheer Elegance Living Room",
        src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop"
    },
    {
        id: 2,
        category: "Curtains",
        title: "Velvet Drapes Bedroom",
        src: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        category: "Curtains",
        title: "Modern Minimalist Curtains",
        src: "https://images.unsplash.com/photo-1629079447777-6242553fb164?q=80&w=2070&auto=format&fit=crop"
    },
    // Wallpapers
    {
        id: 4,
        category: "Wallpapers",
        title: "Floral Feature Wall",
        src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop"
    },
    {
        id: 5,
        category: "Wallpapers",
        title: "Geometric Pattern Design",
        src: "https://images.unsplash.com/photo-1598287515059-8d1979b9003c?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 6,
        category: "Wallpapers",
        title: "Textured Luxury Wallpaper",
        src: "https://images.unsplash.com/photo-1618221155710-d6b711f3d63e?q=80&w=2070&auto=format&fit=crop"
    },
    // Blinds
    {
        id: 7,
        category: "Blinds",
        title: "Wooden Venetian Blinds",
        src: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=2067&auto=format&fit=crop"
    },
    {
        id: 8,
        category: "Blinds",
        title: "Automated Roller Blinds",
        src: "https://images.unsplash.com/photo-1490238059082-82404b9c1d63?q=80&w=2070&auto=format&fit=crop"
    },
    // Furniture
    {
        id: 9,
        category: "Furniture",
        title: "Recliner Sofa Set",
        src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 10,
        category: "Furniture",
        title: "Modern Coffee Table",
        src: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2064&auto=format&fit=crop"
    },
    // Grass/Outdoors
    {
        id: 11,
        category: "Outdoors",
        title: "Vertical Garden Wall",
        src: "https://images.unsplash.com/photo-1533519782559-0f4b3f81014e?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 12,
        category: "Outdoors",
        title: "Artificial Lawn Install",
        src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1932&auto=format&fit=crop"
    }
];

const categories = ["All", "Curtains", "Wallpapers", "Blinds", "Furniture", "Outdoors"];

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const filteredImages = activeCategory === "All"
        ? galleryData
        : galleryData.filter(img => img.category === activeCategory);

    // Original index mapping to pass correct index to viewer even when filtered
    const handleImageClick = (imageId: number | string) => {
        // We pass the filtered list to the viewer, so we need the index relative to the filtered list
        const index = filteredImages.findIndex(img => img.id === imageId);
        if (index !== -1) setSelectedImageIndex(index);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Header */}
                <div className="bg-white py-16 shadow-sm mb-10">
                    <div className="container mx-auto px-4 text-center">
                        <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-2 block">Portfolio</span>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">Our Masterpieces</h1>
                        <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full" />
                        <p className="max-w-2xl mx-auto mt-6 text-gray-500 font-light text-lg">
                            Discover our collection of premium interior transformations, from elegant drapery to modern automation.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4">

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? "bg-primary text-white shadow-md scale-105"
                                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Masonry Grid */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredImages.map((image) => (
                            <div
                                key={image.id}
                                onClick={() => handleImageClick(image.id)}
                                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        loading="lazy"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                        <span className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {image.category}
                                        </span>
                                        <h3 className="text-white font-heading font-medium text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                            {image.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredImages.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p>No images found in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImageIndex !== null && (
                <ImageViewer
                    images={filteredImages}
                    index={selectedImageIndex}
                    onClose={() => setSelectedImageIndex(null)}
                    onChange={setSelectedImageIndex}
                />
            )}
        </>
    );
}
