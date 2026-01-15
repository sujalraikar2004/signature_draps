import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroSlider } from '@/components/ui/HeroSlider';
import { PremiumFeatures } from '@/components/home/PremiumFeatures';
import { ProductCardSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton';
import { useProducts } from '@/contexts/ProductContext';

import slide1 from '@/assets/slider/slide-1.jpg';
import slide2 from '@/assets/slider/slide-2.jpg';
import slide3 from '@/assets/slider/slide-3.jpg';

import curtainsImg from '@/assets/category-curtains.jpg';
import beanbagsImg from '@/assets/category-beanbags.jpg';
import wallpaperImg from '@/assets/category-wallpaper.jpg';
import blindsImg from '@/assets/category-blinds.jpg';

/* ---------------- CATEGORY DATA ---------------- */
const staticCategories = [
  { category: 'curtains-and-accessories', name: 'Curtains And Accessories', image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1765299229/products/products/1765299229630-111033652.jpg" },
  { category: 'sofa-recliner-chairs-corner-sofa', name: 'Sofa, Recliner and Chairs ', image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1763019558/products/products/1763019558252-934864604.jpg" },
  { category: 'home-decor-wallpaper-stickers', name: 'Home Decor Wallpaper ', image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1763274577/products/products/1763274577443-8735332.jpg" },
  { category: 'bedsheet-and-comforters', name: 'Bedsheet and Comforters', image: "https://m.media-amazon.com/images/I/71VR-NjNKYL.jpg" },
  { category: 'institutional-project-window-blinds', name: 'Window Blinds', image: blindsImg },
  { category: 'bean-bags-and-beans', name: 'Bean Bags and Beans', image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1763020339/products/products/1763020339891-192788606.jpg" },
  { category: 'carpet-rugs-door-mats', name: 'Carpet, Rugs and Door Mats', image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1765420344/products/products/1765420343136-538249634.jpg" },
  { category: 'artificial-grass-plant-vertical-garden', name: 'Artificial Grass, Plant and Vertical Garden', image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1765340836/products/products/1765340835878-400873391.jpg" }
];

const Homepage = () => {
  const {
    newProducts,
    bestSellers,
    loading,
    fetchProducts,
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchBestSellers,
    products
  } = useProducts();

  const [categories] = useState(staticCategories);
  const scrollRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
    fetchNewProducts();
    fetchBestSellers();
  }, [fetchProducts, fetchFeaturedProducts, fetchNewProducts, fetchBestSellers]);


  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setTimeout(() => {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }, 400);

    setTimeout(() => {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }, 1800);
  }, []);


  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  };

  const sliderData = [
    {
      id: 1,
      image: slide1,
      title: 'Transform Your Space with',
      subtitle: 'Signature Elegance',
      description: 'Premium curtains, blinds and interior furnishing.',
      badge: 'Premium Interior Solutions',
      cta: {
        primary: { text: 'Shop Curtains', link: '/category/curtains-and-accessories' },
        secondary: { text: 'Learn More', link: '/about' }
      }
    },
    {
      id: 2,
      image: slide2,
      title: 'Luxury Blinds &',
      subtitle: 'Premium Wallpapers',
      description: 'Crafted for modern interiors.',
      badge: 'Exclusive Collection',
      cta: {
        primary: { text: 'Explore Blinds', link: '/category/window-blinds' },
        secondary: { text: 'View Gallery', link: '/gallery' }
      }
    },
    {
      id: 3,
      image: slide3,
      title: 'Complete Interior',
      subtitle: 'Design Solutions',
      description: 'From concept to completion.',
      badge: 'Design Consultation',
      cta: {
        primary: { text: 'Get Consultation', link: '/contact' },
        secondary: { text: 'View Portfolio', link: '/about' }
      }
    }
  ];

  return (
    <main className="min-h-screen ">
      {/* HERO */}
      <HeroSlider slides={sliderData} />

      {/* CATEGORIES */}
      <section className="py-1 mt-5 lg:mt-20 bg-white ">
        <div className="container mx-auto px-2 relative">
          <h2 className=" text-1xl md:text-2xl mb-6 text-gray-900  font-semibold">
            Essential Interior Categories
          </h2>


          <button
            onClick={() => scrollByAmount(-280)}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white border rounded-full shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>


          <button
            onClick={() => scrollByAmount(280)}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white border rounded-full shadow-sm hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div className="overflow-hidden ">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-4 md:px-0 lg:px-0"
            >

              {categories.map((category) => (
                <Link
                  key={category.category}
                  to={`/category/${category.category}`}
                  className="flex-shrink-0"
                >
                  <div className="w-[220px] overflow-hidden flex-col center ">
                    <div className=" h-32 md:h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="py-3 font-medium text-gray-900 text-center tracking-tight group-hover:text-primary transition-colors">
                      {category.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM FEATURES */}
      <PremiumFeatures products={products} />

      {/* BEST SELLERS */}
      <section className="py-16">
        <div className="container mx-auto px-2">
          <h2 className="text-1xl md:text-2xl font-bold mb-6">Best Sellers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16">
        <div className="container mx-auto px-2">
          <h2 className="text-1xl md:text-2xl font-bold mb-6">New Arrivals</h2>

          <div className="grid grid-cols-2   md:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : newProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>
      </section>
      {/* SUPPORT BUTTON - DESKTOP */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-50 items-center">
        <Link
          to="/contact"
          className="group flex items-center gap-3"
        >
          <span className="bg-white/90 backdrop-blur-sm text-[#206060] px-4 py-2 rounded-full text-sm font-semibold shadow-md transform transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 border border-gray-100">
            Need Help?
          </span>
          <div className="relative flex items-center justify-center w-14 h-14 bg-[#206060] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-[#206060] opacity-20 blur-md group-hover:blur-lg transition-all"></div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Homepage;
