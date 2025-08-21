import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export default function FAQ() {
  const faqData = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does delivery take?',
          answer: 'Standard delivery takes 3-7 business days within India. Express delivery is available in select cities with 1-2 day delivery. Custom-made products may take 7-14 days depending on specifications.'
        },
        {
          question: 'Do you provide free shipping?',
          answer: 'Yes! We offer free shipping on orders above ₹2,999. For orders below this amount, standard shipping charges of ₹199 apply.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order is shipped, you\'ll receive a tracking link via SMS and email. You can also track your order from your account dashboard.'
        },
        {
          question: 'What if I need to change my delivery address?',
          answer: 'You can change your delivery address before the order is shipped. Please contact our customer support team as soon as possible with your order number.'
        }
      ]
    },
    {
      category: 'Products & Quality',
      questions: [
        {
          question: 'Are your products machine washable?',
          answer: 'Most of our curtains and fabric products are machine washable. Each product page contains specific care instructions. For premium silk and delicate fabrics, we recommend dry cleaning.'
        },
        {
          question: 'Do you offer custom sizes?',
          answer: 'Yes! We offer custom sizing for most of our products including curtains, blinds, and wallpapers. Use our size calculator or contact our team for assistance with measurements.'
        },
        {
          question: 'What is the quality of your products?',
          answer: 'All our products undergo strict quality checks. We source from trusted manufacturers and offer quality guarantees. Premium products come with extended warranties.'
        },
        {
          question: 'Do you have color matching services?',
          answer: 'Yes, we offer color matching services for curtains and blinds. You can send us a sample or photo, and we\'ll help you find the closest match from our collection.'
        }
      ]
    },
    {
      category: 'Installation & Measurements',
      questions: [
        {
          question: 'Do you provide installation services?',
          answer: 'Yes, we offer professional installation services in major cities. Our certified installers ensure perfect fitting and optimal functionality of your products.'
        },
        {
          question: 'How do I measure for curtains and blinds?',
          answer: 'We provide detailed measurement guides for each product type. You can also book a free home consultation where our experts will take precise measurements.'
        },
        {
          question: 'What tools do I need for DIY installation?',
          answer: 'Most products come with installation hardware. You\'ll typically need a drill, screwdriver, level, and measuring tape. Detailed instructions are included with every order.'
        },
        {
          question: 'Can you install on different window types?',
          answer: 'Yes, our products and installation services cover all window types including bay windows, French doors, skylights, and irregular-shaped windows.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: '30-day hassle-free returns on most products. Items must be in original condition with tags. Custom-made products have different return terms - please check individual product pages.'
        },
        {
          question: 'How do I return a product?',
          answer: 'Contact our customer support to initiate a return. We\'ll provide a return label and arrange pickup. Refunds are processed within 5-7 business days after we receive the item.'
        },
        {
          question: 'Can I exchange for a different size or color?',
          answer: 'Yes, exchanges are available within 30 days for the same product in different size or color, subject to availability. Exchange processing takes 3-5 business days.'
        },
        {
          question: 'What if my product arrives damaged?',
          answer: 'We take full responsibility for damaged products during shipping. Contact us within 48 hours with photos, and we\'ll arrange immediate replacement at no cost.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, digital wallets, and cash on delivery (for eligible orders). EMI options are available for orders above ₹10,000.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'No hidden charges! All prices displayed include applicable taxes. Shipping charges (if any) and installation fees are clearly mentioned before checkout.'
        },
        {
          question: 'Do you offer bulk discounts?',
          answer: 'Yes, we offer attractive bulk discounts for large orders, corporate clients, and interior designers. Contact our sales team for custom pricing.'
        },
        {
          question: 'Can I get a quote for multiple items?',
          answer: 'Absolutely! Add items to your cart or wishlist and use the "Request Quote" feature. Our team will provide a comprehensive quote with any applicable discounts.'
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and policies. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="card-premium p-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="text-sm">
                  {section.category}
                </Badge>
                <h2 className="text-2xl font-heading font-semibold">
                  {section.category}
                </h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {section.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${sectionIndex}-${index}`}
                    className="border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="card-premium p-8 text-center mt-16">
          <h3 className="text-2xl font-heading font-semibold mb-4">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our customer support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-hero px-6 py-3 rounded-md font-medium">
              Contact Support
            </button>
            <button className="btn-outline px-6 py-3 rounded-md font-medium border border-border hover:bg-muted">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}