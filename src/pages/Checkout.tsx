import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Lock } from "lucide-react";
import api from "@/Api";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.username || "",
    phone: user?.phoneNo || "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async () => {
    // Basic validation
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Step 1: Place order on backend to get Razorpay order ID
      const placeOrderRes = await api.post("/orders/place", {
        shippingAddress,
        paymentMode: "ONLINE",
      });

      const { razorpayOrder, key, order } = placeOrderRes.data;

      if (!razorpayOrder || !key) {
        toast.error("Failed to initialize payment");
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay Checkout popup
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Signature Draps",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            setLoading(true);
            // Step 3: Verify payment on backend
            const verifyRes = await api.post("/orders/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              receipt: order.orderId,
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful! Order placed.");
              await clearCart();
              navigate("/orders");
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed");
            }
          } catch (verifyErr: any) {
            toast.error(verifyErr.response?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
          email: user?.email || "",
        },
        theme: {
          color: "#206060", // Rich Teal
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong while placing order");
      toast.error(err.response?.data?.message || "Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  const gstRate = 0.18;
  const subtotal = totalPrice;
  const tax = Math.round(subtotal * gstRate);
  const finalTotal = subtotal + tax;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate("/")} variant="outline">Continue Shopping</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      {/* Professional Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-2 mb-4">
        <div className="container-premium flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-gray-800">Checkout</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="text-primary">Cart</span>
            <span>/</span>
            <span className="text-primary font-bold">Shipping</span>
            <span>/</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="container-premium pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Shipping Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Shipping Address
              </h2>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-600">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-600">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold text-gray-600">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="street" className="text-sm font-semibold text-gray-600">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleChange}
                    placeholder="Flat, House no., Building, Company, Apartment"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-600">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-semibold text-gray-600">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-semibold text-gray-600">Pincode</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    placeholder="6 digits [0-9] PIN code"
                    className="rounded-xl h-12 border-gray-200 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
              </form>
            </div>


          </div>

          {/* Right Column: Review your cart (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-premium">
                {items.map((item, index) => (
                  <div key={item._id || index} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden group-hover:border-primary/30 transition-colors">
                      <img
                        src={item.productId.images?.[0]?.url || '/placeholder-product.png'}
                        alt={item.productId.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs text-gray-800 line-clamp-1">{item.productId.name}</h3>
                      <p className="text-gray-400 text-[10px] mt-0.5">Quantity: {item.quantity}</p>
                      <p className="font-bold text-sm mt-1 text-primary">₹{item.productId.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Filter</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated GST (18%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>

                <Separator className="my-2 bg-gray-100" />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-2xl font-bold text-primary">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-primary/20 shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : (
                    <>
                      Pay Now
                      <Lock className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {error && <p className="text-red-500 mt-2 text-center text-sm font-medium">{error}</p>}

                <div className="flex flex-col items-center gap-2 pt-4">

                  <p className="text-[10px] text-gray-400 font-medium">100% Encrypted & Secure Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
