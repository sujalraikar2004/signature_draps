import React from 'react';
import { Shield, Eye, Lock, Users } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Information We Collect */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Account credentials and preferences</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pages visited and time spent on our website</li>
                <li>Search queries and product interactions</li>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Communications</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Customer service interactions</li>
                <li>Reviews and feedback</li>
                <li>Marketing communications preferences</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">Order Processing</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and updates</li>
                <li>Arrange delivery and installation services</li>
                <li>Handle returns and exchanges</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Customer Service</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respond to your inquiries and support requests</li>
                <li>Provide technical assistance</li>
                <li>Resolve complaints and disputes</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Personalization</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Recommend products based on your preferences</li>
                <li>Customize your shopping experience</li>
                <li>Send personalized offers and promotions</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Legal Compliance</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with applicable laws and regulations</li>
                <li>Prevent fraud and unauthorized activities</li>
                <li>Protect our rights and property</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">Information Sharing</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
              
              <h3 className="text-lg font-medium text-foreground">Service Providers</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment processors for secure transaction handling</li>
                <li>Shipping companies for order delivery</li>
                <li>Technology service providers for website functionality</li>
                <li>Customer service platforms for support</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Legal Requirements</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>When required by law or legal process</li>
                <li>To protect our rights and safety</li>
                <li>To prevent fraud or illegal activities</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Business Transfers</h3>
              <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</p>
            </div>
          </section>

          {/* Data Security */}
          <section className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-semibold">Data Security</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>We implement industry-standard security measures to protect your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-4 p-4 bg-primary/10 rounded-lg">
                <strong>Note:</strong> While we strive to protect your information, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Your Rights</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Marketing:</strong> Opt-out of marketing communications</li>
                <li><strong>Cookies:</strong> Control cookie preferences in your browser</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <strong>privacy@signaturedraps.com</strong> or through our customer support channels.
              </p>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="card-premium p-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Cookies and Tracking</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve website functionality and performance</li>
              </ul>
              <p className="mt-4">
                You can control cookie settings through your browser preferences. However, disabling cookies may affect website functionality.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="card-premium p-8 bg-primary/5">
            <h2 className="text-2xl font-heading font-semibold mb-6">Contact Us</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Email</h3>
                  <p>privacy@signaturedraps.com</p>
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
                  <h3 className="font-medium text-foreground mb-2">Response Time</h3>
                  <p>We respond to privacy requests within 30 days</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}