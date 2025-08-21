import React from 'react';
import { Users, Award, Clock, MapPin } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            About Signature Draps
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transforming homes with premium curtains, blinds, and interior solutions since 2015. 
            We believe every space deserves to be beautiful, functional, and uniquely yours.
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
            <p className="text-muted-foreground">Categories</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-2">9</h3>
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

        {/* Story Section */}
        <div className="card-premium p-8 lg:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-semibold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2015 with a vision to transform ordinary spaces into extraordinary homes, 
                  Signature Draps has grown from a small family business to one of India's most trusted 
                  names in home furnishing.
                </p>
                <p>
                  We started with a simple belief: every home deserves beautiful, functional, and 
                  affordable window treatments. Today, we offer a comprehensive range of curtains, 
                  blinds, wallpapers, and interior accessories.
                </p>
                <p>
                  Our commitment to quality, innovation, and customer satisfaction has earned us the 
                  trust of over 50,000 happy customers across 100+ cities in India.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 h-80 flex items-center justify-center">
              <div className="text-center text-primary">
                <Users className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Building Beautiful Homes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="card-premium p-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide premium quality home furnishing solutions that combine style, 
              functionality, and affordability. We strive to make beautiful homes accessible 
              to everyone through innovative products and exceptional service.
            </p>
          </div>
          <div className="card-premium p-8">
            <h3 className="text-2xl font-heading font-semibold mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become the leading destination for home furnishing in India, known for our 
              commitment to quality, design innovation, and customer satisfaction. We envision 
              a future where every home reflects the unique personality of its owners.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center">
          <h2 className="text-3xl font-heading font-semibold mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Quality First</h4>
              <p className="text-muted-foreground">
                We never compromise on quality. Every product is carefully selected and tested 
                to meet our high standards.
              </p>
            </div>
            <div className="card-premium p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Customer Centric</h4>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We listen, understand, and deliver solutions 
                that exceed expectations.
              </p>
            </div>
            <div className="card-premium p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Innovation</h4>
              <p className="text-muted-foreground">
                We continuously evolve our products and services to bring you the latest 
                trends and technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}