import React from 'react';
import { Button } from '@/components/ui/button';

export default function Checkout() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Checkout functionality will be implemented here with payment processing.
        </p>
        <Button onClick={() => window.history.back()}>
          Back to Cart
        </Button>
      </div>
    </main>
  );
}