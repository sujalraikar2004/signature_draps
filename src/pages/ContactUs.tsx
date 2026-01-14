import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Instagram, Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/Api';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNo', formData.phone);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);

      // Append media files
      mediaFiles.forEach((file) => {
        formDataToSend.append('mediaFiles', file);
      });

      const response = await api.post('/contact-queries', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setMediaFiles([]);
      }
    } catch (error: any) {
      console.error('Error submitting query:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB

      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a valid image or video file`);
        return false;
      }

      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        return false;
      }

      return true;
    });

    // Check total number of files
    if (mediaFiles.length + validFiles.length > 10) {
      toast.error('You can only upload up to 10 files');
      return;
    }

    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <Video className="h-4 w-4" />;
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

              {/* File Upload Section */}
              <div>
                <Label htmlFor="mediaFiles">
                  Attach Images or Videos (Optional)
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload images or videos of the product you need help with (Max 10 files, 50MB each)
                </p>
                <div className="space-y-3">
                  <Input
                    id="mediaFiles"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  
                  {/* File Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Selected Files ({mediaFiles.length}/10)
                      </p>
                      <div className="grid gap-2">
                        {mediaFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {getFileIcon(file)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-hero" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.8!2d74.5!3d15.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDUxJzAwLjAiTiA3NMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
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
                  onClick={() => window.open('https://maps.app.goo.gl/ysSzo27SnUpvks2AA?g_st=aw', '_blank')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </Button>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </main>
  );
}