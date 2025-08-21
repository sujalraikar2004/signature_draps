import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroSlider } from '@/components/ui/HeroSlider';
import { categories } from '@/data/categories';
import { getBestSellerProducts, getNewProducts } from '@/data/products';
import slide1 from '@/assets/slider/slide-1.jpg';
import slide2 from '@/assets/slider/slide-2.jpg';
import slide3 from '@/assets/slider/slide-3.jpg';

export default function Homepage() {
  const bestSellers = getBestSellerProducts().slice(0, 8);
  const newProducts = getNewProducts().slice(0, 8);

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
        primary: { text: "Get Quote", link: "/contact" },
        secondary: { text: "Our Services", link: "/about" }
      }
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Slider Section */}
      <HeroSlider slides={sliderData} autoPlay={true} interval={6000} />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">Mumbai & Delhi NCR</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">Premium materials only</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Expert Support</h3>
                <p className="text-sm text-muted-foreground">Design consultation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-12">
            <h2 className="text-section-title font-heading mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive collection of premium interior solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group card-premium overflow-hidden hover-lift"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.productCount} products
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Collection
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-premium">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-section-title font-heading mb-4">
                Best Sellers
              </h2>
              <p className="text-lg text-muted-foreground">
                Our most popular premium products
              </p>
            </div>
            <Button 
              variant="outline" 
              className="hidden md:flex"
              asChild
            >
              <Link to="/bestsellers">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button 
              variant="outline"
              asChild
            >
              <Link to="/bestsellers">
                View All Best Sellers <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-section-title font-heading mb-4">
                New Arrivals
              </h2>
              <p className="text-lg text-muted-foreground">
                Latest additions to our premium collection
              </p>
            </div>
            <Button 
              variant="outline" 
              className="hidden md:flex"
              asChild
            >
              <Link to="/new-arrivals">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button 
              variant="outline"
              asChild
            >
              <Link to="/new-arrivals">
                View All New Arrivals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-premium text-center">
          <h2 className="text-section-title font-heading mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get a free consultation with our interior design experts. 
            We'll help you choose the perfect solutions for your home or office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-gold text-lg px-8 py-4"
              asChild
            >
              <Link to="/contact">
                Book Free Consultation
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/catalog">
                Browse Catalog
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}