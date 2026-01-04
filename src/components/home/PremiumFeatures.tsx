import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

interface PremiumFeaturesProps {
    products: Product[] | null;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ products }) => {
    if (!products) return null;

    // Filter products for specific categories
    const grassProducts = products
        .filter(p => p.category === 'artificial-grass-plant-vertical-garden')
        .slice(0, 2);

    const wallpaperProducts = products
        .filter(p => p.category === 'home-decor-wallpaper-stickers')
        .slice(0, 2);

    const curtainProducts = products
        .filter(p => p.category === 'curtains-and-accessories')
        .slice(0, 2);

    // Ensure we have enough content to show the section
    if (grassProducts.length === 0 && wallpaperProducts.length === 0 && curtainProducts.length === 0) return null;

    const FeatureCard = ({ title, items, link }: { title: string, items: Product[], link: string }) => (
        <div className="relative group overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500">
            <div className="p-5 relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <Link
                        to={link}
                        className="text-primary text-xs font-semibold uppercase tracking-wider hover:underline"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {items.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="block group/item">
                            <div className="relative aspect-square overflow-hidden rounded-lg mb-2 bg-gray-50 border border-gray-50">
                                <img
                                    src={product.images[0]?.url}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h4 className="font-medium text-gray-800 text-xs truncate group-hover/item:text-primary transition-colors">
                                {product.name}
                            </h4>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-8 mt-4">
            <div className="container mx-auto px-1">
                <div className="mb-8 flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Premium Collection</h2>
                    <div className="h-px flex-grow bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Artificial Grass"
                        items={grassProducts}
                        link="/category/artificial-grass-plant-vertical-garden"
                    />
                    <FeatureCard
                        title="Luxury Wallpapers"
                        items={wallpaperProducts}
                        link="/category/home-decor-wallpaper-stickers"
                    />
                    <FeatureCard
                        title="Curtains & Drapes"
                        items={curtainProducts}
                        link="/category/curtains-and-accessories"
                    />
                </div>
            </div>
        </section>
    );
};
