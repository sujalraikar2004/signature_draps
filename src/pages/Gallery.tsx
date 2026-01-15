import React, { useState, useEffect } from "react";
import ImageViewer, { GalleryImage } from "../components/ImageViewers/ImageViewer.tsx";
import api from "../Api.tsx";

export default function Gallery() {
    const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Fetch gallery items from API
    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/gallery', {
                    params: {
                        isActive: true,
                        limit: 100
                    }
                });

                if (response.data.success) {
                    const items = response.data.data;

                    // Transform API data to GalleryImage format
                    const transformedData: GalleryImage[] = items.map((item: any) => ({
                        id: item._id,
                        category: item.category,
                        title: item.title,
                        src: item.mediaUrl,
                        type: item.mediaType,
                        thumbnailUrl: item.thumbnailUrl
                    }));

                    setGalleryData(transformedData);

                    // Extract unique categories
                    const categorySet = new Set(items.map((item: any) => item.category));
                    const uniqueCategories = ["All", ...Array.from(categorySet)] as string[];
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error('Error fetching gallery data:', error);
                // Fallback to empty array on error
                setGalleryData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 py-20 mb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <span className="inline-block text-primary font-bold tracking-widest text-xs uppercase mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm animate-fade-in">Our Portfolio</span>
                        <h1 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent animate-fade-in-up">
                            Our Masterpieces
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary mx-auto mt-8 rounded-full shadow-lg animate-scale-in" />
                        <p className="max-w-3xl mx-auto mt-8 text-gray-600 font-light text-lg md:text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Discover our collection of premium interior transformations, from elegant drapery to modern automation.
                        </p>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary absolute top-0 left-0"></div>
                            </div>
                            <p className="mt-6 text-gray-500 animate-pulse">Loading gallery...</p>
                        </div>
                    ) : (
                        <>
                            {/* Filter Tabs with modern design */}
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16 animate-fade-in">
                                {categories.map((cat, index) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                        className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 animate-fade-in-up ${activeCategory === cat
                                            ? "bg-[#206060] text-white shadow-md"
                                            : "bg-white text-gray-600 border border-gray-200 hover:border-[#206060]/50 hover:text-[#206060]"
                                            }`}
                                    >
                                        <span className="relative z-10">{cat}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Enhanced Masonry Grid */}
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                                {filteredImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        onClick={() => handleImageClick(image.id)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                        className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                                    >
                                        <div className="relative overflow-hidden rounded-2xl">
                                            {/* Media content */}
                                            {image.type === 'video' ? (
                                                <div className="relative">
                                                    <video
                                                        src={image.src}
                                                        className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                                        poster={image.thumbnailUrl}
                                                        muted
                                                        loop
                                                        onMouseEnter={(e) => e.currentTarget.play()}
                                                        onMouseLeave={(e) => e.currentTarget.pause()}
                                                    />
                                                    {/* Video play icon overlay */}
                                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={image.src}
                                                    alt={image.title}
                                                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    loading="lazy"
                                                />
                                            )}

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                {/* Category badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                                        {image.category}
                                                    </span>
                                                </div>

                                                {/* Title and view button */}
                                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                                    <h3 className="text-white font-heading font-semibold text-xl mb-3 leading-tight">
                                                        {image.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span className="font-medium">View Full Size</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Border glow on hover */}
                                            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/50 transition-all duration-500"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredImages.length === 0 && (
                                <div className="text-center py-32 animate-fade-in">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Found</h3>
                                    <p className="text-gray-500">No images found in this category yet. Check back soon!</p>
                                </div>
                            )}
                        </>
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
