import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import api from "@/Api";


export default function Checkout({ cart }) {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const navigate=useNavigate()

  const [paymentMode, setPaymentMode] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      setLoading(true);

      if (paymentMode === "COD") {
       
        const res = await api.post("/api/v1/orders/place", {
          shippingAddress,
          paymentMode: "COD",
        });
        console.log("Order created:", res.data);
        
      } else {
      
        sessionStorage.setItem("checkoutData", JSON.stringify({ shippingAddress, paymentMode }));
        navigate("/payment")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container-premium py-16">
        <h1 className="text-3xl font-heading font-bold mb-8 text-center">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              {Object.keys(shippingAddress).map((field) => (
                <div key={field}>
                  <Label className="capitalize">{field}</Label>
                  <Input
                    name={field}
                    value={(shippingAddress as any)[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </form>
          </div>

          {/* Payment Options */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ONLINE" id="online" />
                <Label htmlFor="online">Online Payment (Razorpay)</Label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : paymentMode === "COD" ? "Place Order" : "Proceed to Payment"}
              </Button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
