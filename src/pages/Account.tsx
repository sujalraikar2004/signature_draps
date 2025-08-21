import React from 'react';
import { Button } from '@/components/ui/button';

export default function Account() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Account dashboard with orders, addresses, and profile settings.
        </p>
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </main>
  );
}