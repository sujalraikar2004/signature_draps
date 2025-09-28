import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroSlider } from '@/components/ui/HeroSlider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useProducts } from '@/contexts/ProductContext';
import api from '@/Api';
import slide1 from '@/assets/slider/slide-1.jpg';
import slide2 from '@/assets/slider/slide-2.jpg';
import slide3 from '@/assets/slider/slide-3.jpg';
import curtainsImg from '@/assets/category-curtains.jpg';
import beanbagsImg from '@/assets/category-beanbags.jpg';
import wallpaperImg from '@/assets/category-wallpaper.jpg';
import blindsImg from '@/assets/category-blinds.jpg';

interface Product {
  count: number;
  category: string;
  image: string;
}

// Static category data with local images
const staticCategories = [
  {
    category: 'curtains-furnishing',
    name: 'Curtains & Furnishing',
    image: curtainsImg,
    count: 125
  },
  {
    category: 'bean-bags',
    name: 'Bean Bags & Cushions', 
    image: beanbagsImg,
    count: 85
  },
  {
    category: 'wallpaper',
    name: 'Wallpaper & Wall Coverings',
    image: wallpaperImg,
    count: 95
  },
  {
    category: 'blinds',
    name: 'Blinds & Window Treatments',
    image: blindsImg,
    count: 110
  }
];

export default function Homepage() {
  const { featuredProducts, newProducts, bestSellers, loading, fetchFeaturedProducts, fetchNewProducts, fetchBestSellers } = useProducts();
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchNewProducts();
    fetchBestSellers();
  }, [fetchFeaturedProducts, fetchNewProducts, fetchBestSellers]);

  console.log(featuredProducts);

  const sliderData = [
    {
      id: 1,
      image: slide1,
      title: "Transform Your Space with",
      subtitle: "Signature Elegance",
      description: "Discover our premium collection of curtains, blinds, wallpapers, and complete interior furnishing solutions. Over 10 years of crafting beautiful homes.",
      badge: "Premium Interior Solutions",
      cta: {
        primary: { text: "Shop Curtains", link: "/category/curtains-furnishing" },
        secondary: { text: "Learn More", link: "/about" }
      }
    },
    {
      id: 2,
      image: slide2,
      title: "Luxury Blinds &",
      subtitle: "Premium Wallpapers",
      description: "Experience the finest quality blinds and wallpapers that bring sophistication and style to every room in your home.",
      badge: "Exclusive Collection",
      cta: {
        primary: { text: "Explore Blinds", link: "/category/zebra-blinds" },
        secondary: { text: "View Gallery", link: "/products" }
      }
    },
    {
      id: 3,
      image: slide3,
      title: "Complete Interior",
      subtitle: "Design Solutions",
      description: "From concept to completion, we provide comprehensive interior design services with premium materials and expert craftsmanship.",
      badge: "Design Consultation",
      cta: {
        primary: { text: "Get Consultation", link: "/contact" },
        secondary: { text: "View Portfolio", link: "/about" }
      }
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <HeroSlider slides={sliderData} />
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-6 text-gray-800">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Explore our comprehensive range of interior furnishing solutions, carefully curated to transform your living spaces.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.category}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4">
                    {category.count} products
                  </p>

                  <Link
                    to={`/category/${category.category}`}
                    className="inline-block w-full text-center bg-gray-100 hover:bg-primary hover:text-white text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-300"
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16">
        <div className="container-premium">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4">Best Sellers</h2>
              <p className="text-muted-foreground">
                Explore our top-selling interior furnishing products.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products?isBestSeller=true">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bestSellers?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container-premium">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4">New Arrivals</h2>
              <p className="text-muted-foreground">
                Discover our latest collection of interior furnishing products.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products?isNew=true">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-premium">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Why Choose Signature Draps?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience excellence in every aspect of our service, from premium quality products to exceptional customer care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                description: "Free delivery on orders above ₹2,000 within city limits"
              },
              {
                icon: Shield,
                title: "Quality Guarantee",
                description: "Premium quality materials with comprehensive warranty coverage"
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description: "Professional consultation and 24/7 customer support"
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                description: "Hassle-free returns and exchanges within 30 days"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Get in touch with our design experts for a personalized consultation and bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Get Free Consultation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}