import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our website and services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Acceptance of Terms */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using the Signature Draps website ("the Site") and our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms and Conditions constitute a legally binding agreement between you and Signature Draps ("we," "us," or "our"). These terms apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and content contributors.
              </p>
            </div>
          </section>

          {/* Use of Website */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Use of Website</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Permitted Use</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Browse and purchase products for personal or commercial use</li>
                <li>Create an account and manage your orders</li>
                <li>Leave reviews and feedback on products</li>
                <li>Contact customer support for assistance</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Prohibited Use</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the site for any unlawful purpose or activity</li>
                <li>Attempt to gain unauthorized access to any part of the site</li>
                <li>Upload viruses or malicious code</li>
                <li>Violate any laws or regulations</li>
                <li>Interfere with the security or proper functioning of the site</li>
                <li>Use automated tools to access the site without permission</li>
              </ul>
            </div>
          </section>

          {/* Products and Orders */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Products and Orders</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Product Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We strive to display accurate product information, including descriptions, pricing, and images</li>
                <li>Colors may vary slightly due to monitor settings and photography</li>
                <li>We reserve the right to correct any errors in product information</li>
                <li>Product availability is subject to change without notice</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Order Acceptance</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All orders are subject to acceptance and availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Order confirmation does not guarantee product availability</li>
                <li>Prices are subject to change without notice</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Custom Orders</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Custom-made products require accurate measurements</li>
                <li>Custom orders may have longer delivery times</li>
                <li>Custom products may have different return policies</li>
                <li>Additional charges may apply for custom specifications</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Payment Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Payment Methods</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We accept major credit cards, debit cards, UPI, and net banking</li>
                <li>Cash on delivery is available for eligible orders</li>
                <li>EMI options are available for orders above ₹10,000</li>
                <li>All payments are processed securely through our payment partners</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Pricing and Taxes</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                <li>Prices may change without prior notice</li>
                <li>Additional charges may apply for shipping and installation</li>
                <li>Currency conversion rates are determined by payment processors</li>
              </ul>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Shipping and Delivery</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Delivery Terms</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delivery times are estimates and may vary due to location and availability</li>
                <li>We are not responsible for delays caused by external factors</li>
                <li>Delivery address changes may incur additional charges</li>
                <li>Someone must be available to receive the delivery</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Risk of Loss</h3>
              <p>
                Risk of loss and title for products pass to you upon delivery. We recommend inspecting products upon delivery and reporting any damage within 48 hours.
              </p>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">Returns and Refunds</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Return Policy</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>30-day return policy for most products in original condition</li>
                <li>Custom-made products may not be returnable</li>
                <li>Return shipping costs may apply</li>
                <li>Refunds are processed within 5-7 business days</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Non-Returnable Items</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Custom-made or personalized products</li>
                <li>Products damaged by misuse</li>
                <li>Products without original packaging</li>
                <li>Hygiene-sensitive items (as specified)</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Signature Draps or its content suppliers and is protected by intellectual property laws.
              </p>
              <h3 className="text-lg font-medium text-foreground">Your Rights</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may view and download content for personal, non-commercial use</li>
                <li>You may not reproduce, distribute, or create derivative works</li>
                <li>You may not use our trademarks without written permission</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">Limitation of Liability</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                In no event shall Signature Draps be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p>
                Our total liability to you for any claim arising from your use of the website or products shall not exceed the amount you paid for the specific product giving rise to the claim.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Governing Law</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to update or change these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after any changes constitutes acceptance of the new terms.
              </p>
              <p>
                We encourage you to review these terms periodically for any updates or changes.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="card-premium p-8 bg-primary/5">
            <h2 className="text-2xl font-heading font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Email</h3>
                  <p>legal@signaturedraps.com</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Address</h3>
                  <p>123 Design Street, Interior Plaza<br />Mumbai, Maharashtra 400001</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Business Hours</h3>
                  <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}