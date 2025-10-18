import React from 'react';
import { Users, Award, Clock, MapPin, Scissors, Palette, Shield, Settings, Heart, CheckCircle } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        {/* Hero Section - Our Mission */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            About Signature Drapes
          </h1>
          <h2 className="text-2xl lg:text-3xl font-heading font-semibold mb-8 text-primary">
            Our Mission: Elevating Your Home
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            At Signature Drapes, we believe that curtains and furnishings are more than just functional necessities—they are the soul of your home. Our mission is to transform your living spaces with high-quality, beautifully crafted products that reflect your personal style, enhance comfort, and provide essential functionality like privacy and light control.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">50,000+</h3>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">15+</h3>
            <p className="text-muted-foreground">Product Categories</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">9+</h3>
            <p className="text-muted-foreground">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">100+</h3>
            <p className="text-muted-foreground">Cities Served</p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-semibold text-center mb-12">What We Offer</h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            We are a full-service destination for all your home décor needs, specializing in:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Custom & Ready-Made Curtains</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                From light-filtering sheers and decorative drapes to thermal and complete blackout options. We offer a variety of heading styles (grommet, rod pocket, pleated) and lengths to fit any window.
              </p>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Blinds & Shades</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A curated collection of roller, roman, vertical, and Venetian blinds for modern light management and privacy control.
              </p>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Premium Fabrics & Upholstery</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A vast selection of materials—including linen, cotton, velvet, and performance fabrics—perfect for curtains, cushions, and upholstery projects.
              </p>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Complementary Furnishings</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A handpicked range of accessories, hardware, and décor to complete your look and tie your entire space together.
              </p>
            </div>
          </div>
        </div>

        {/* Quality & Craftsmanship Section */}
        <div className="card-premium p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-heading font-semibold text-center mb-8">
            Our Commitment to Quality and Craftsmanship
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Quality is the foundation of everything we do.
          </p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Skilled Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our products are crafted by experienced tailors and artisans using meticulous fabrication processes to ensure durability and a flawless finish.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Finest Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                We source only the best materials from around the world, focusing on textiles that are beautiful, long-lasting, and meet various needs for insulation, privacy, or aesthetics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Focus on Detail</h3>
              <p className="text-muted-foreground leading-relaxed">
                We obsess over the details, from the perfect pleat to the smooth function of our hardware, ensuring your furnishings look exceptional and perform reliably for years to come.
              </p>
            </div>
          </div>
        </div>

        {/* Personalized Experience Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-semibold text-center mb-8">
            A Personalized Experience
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            We understand that every home is unique, which is why we offer services designed for a perfect fit:
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Customization</h4>
              <p className="text-muted-foreground">
                We provide complete customization options for size, length, and fabric to perfectly match your windows and design vision.
              </p>
            </div>
            
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Transparent Pricing</h4>
              <p className="text-muted-foreground">
                We are committed to straightforward, honest pricing with no hidden costs, so you know exactly what you're paying for.
              </p>
            </div>
            
            <div className="card-premium p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Dedicated Support</h4>
              <p className="text-muted-foreground">
                Our expert team is here to guide you through measurements, product selection, and design choices to make your experience seamless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}