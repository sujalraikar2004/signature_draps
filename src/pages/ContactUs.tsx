import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or need assistance? We're here to help you 
            transform your space into something beautiful.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your requirements..."
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full btn-hero" size="lg">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card-premium p-8">
              <h2 className="text-2xl font-heading font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+91 9036587169</p>
                    <p className="text-muted-foreground">+91 8310100837</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">signaturedraps31@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Shree Siddhi Decor<br />
                      831/1, Opposite 2nd Railway Gate Besides MedPlus<br />
                      Congress Road, Tilakwadi, Belgaum<br />
                      Karnataka 590006<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instagram</h3>
                    <a 
                      href="https://www.instagram.com/shreesiddhidecor?igsh=MTNua2M1Z3J1MTh6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @shreesiddhidecor
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="text-primary font-bold text-sm">GST</div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">GST Number</h3>
                    <p className="text-muted-foreground">29ACKFS9402L1ZH</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="card-premium p-8">
              <h3 className="text-xl font-heading font-semibold mb-4">Find Us on Map</h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://maps.app.goo.gl/3L1WAA2iywzbMX3C9"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shree Siddhi Decor Location"
                ></iframe>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://maps.app.goo.gl/3L1WAA2iywzbMX3C9?g_st=aw', '_blank')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card-premium p-8">
              <h3 className="text-xl font-heading font-semibold mb-4">Quick Support</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Schedule a Free Consultation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Request a Quote
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Nearest Store
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}