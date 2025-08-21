import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-premium">
        {/* Newsletter Section */}
        <div className="border-b border-primary-foreground/20 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-heading font-semibold mb-4">
              Stay Updated with Our Latest Designs
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to get exclusive offers, design tips, and new arrivals
            </p>
            <div className="flex max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-r-none bg-primary-foreground text-foreground"
              />
              <Button className="rounded-l-none btn-gold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-gold px-3 py-1 rounded-lg">
                  <span className="text-xl font-heading font-bold text-primary">SD</span>
                </div>
                <div>
                  <span className="text-xl font-heading font-bold">Signature</span>
                  <span className="text-xl font-heading font-bold text-accent ml-1">Draps</span>
                </div>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Premium interior solutions for your home and office. We specialize in 
                luxury curtains, blinds, wallpapers, and complete interior furnishing 
                with over 10 years of expertise.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:text-accent">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:text-accent">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:text-accent">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:text-accent">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-lg">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-primary-foreground/80 hover:text-accent transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="text-primary-foreground/80 hover:text-accent transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-primary-foreground/80 hover:text-accent transition-colors">Returns & Exchanges</Link></li>
                <li><Link to="/size-guide" className="text-primary-foreground/80 hover:text-accent transition-colors">Size Guide</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-lg">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/category/curtains-furnishing" className="text-primary-foreground/80 hover:text-accent transition-colors">Curtains & Furnishing</Link></li>
                <li><Link to="/category/blinds" className="text-primary-foreground/80 hover:text-accent transition-colors">Blinds</Link></li>
                <li><Link to="/category/wallpaper" className="text-primary-foreground/80 hover:text-accent transition-colors">Wallpaper</Link></li>
                <li><Link to="/category/bean-bags" className="text-primary-foreground/80 hover:text-accent transition-colors">Bean Bags</Link></li>
                <li><Link to="/category/carpets-rugs" className="text-primary-foreground/80 hover:text-accent transition-colors">Carpets & Rugs</Link></li>
                <li><Link to="/category/flooring-mats" className="text-primary-foreground/80 hover:text-accent transition-colors">Flooring & Mats</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-lg">Contact Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                  <div>
                    <p className="text-primary-foreground/80">
                      123 Design Street, Andheri West,<br />
                      Mumbai, Maharashtra 400053
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-accent" />
                  <p className="text-primary-foreground/80">+91 98765 43210</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <p className="text-primary-foreground/80">info@signaturedraps.com</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-semibold text-accent">Business Hours</h5>
                <p className="text-sm text-primary-foreground/80">
                  Mon - Sat: 10:00 AM - 8:00 PM<br />
                  Sunday: 11:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/60 mb-4 md:mb-0">
              © 2024 Signature Draps. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/sitemap" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}