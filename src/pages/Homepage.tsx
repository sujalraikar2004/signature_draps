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

import { MarriageCardProduct } from '@/components/product/MarriageCardProduct';

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
      <section className="py-1 mt-5 lg:mt-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 relative">
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
              className="grid grid-cols-2 md:flex gap-4 md:overflow-x-auto md:scroll-smooth md:scrollbar-horizontal px-4 md:px-0 lg:px-0 pb-4"
            >

              {categories.map((category) => (
                <Link
                  key={category.category}
                  to={`/category/${category.category}`}
                  className="w-full md:flex-shrink-0"
                >
                  <div className="w-full md:w-[220px] overflow-hidden flex-col center ">
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
      <section className="py-2">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-1xl md:text-2xl font-bold mb-4">Best Sellers</h2>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers?.slice(0, 10).map((product, index) => (
                <MarriageCardProduct key={product._id} product={product} index={index + 1} />
              ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-2">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-1xl md:text-2xl font-bold mb-4">New Arrivals</h2>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : newProducts?.slice(0, 10).map((product, index) => (
                <MarriageCardProduct key={product._id} product={product} index={index} />
              ))}
          </div>
        </div>
      </section>
      {/* SUPPORT BUTTON - DESKTOP ONLY */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col gap-4 items-end">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919036587169"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <span className="bg-white/90 backdrop-blur-sm text-[#25D366] px-4 py-2 rounded-full text-sm font-semibold shadow-md transform transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 border border-gray-100">
            Chat on WhatsApp
          </span>
          <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="relative z-10"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 blur-md group-hover:blur-lg transition-all"></div>
          </div>
        </a>

        {/* Support Button */}
        <Link
          to="/contact"
          className="group items-center gap-3 flex"
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
