import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNavbar } from "@/components/layout/BottomNavbar";
import Homepage from "./pages/Homepage";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import VerifyEmailOtp from "./pages/VerifyEmailOtp";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders"
import RazorpayPayment from "./components/payment/RazorpayPayment"
import ScrollToTop from "./components/ui/ScrollToTop.jsx"
import { Analytics } from "@vercel/analytics/react"
import Gallery from "./pages/Gallery"
import UserProfile from "./pages/UserProfile.tsx"


const queryClient = new QueryClient();

const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Analytics />
              <BrowserRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/category/:categoryId" element={<ProductListing />} />
                      <Route path="/products" element={<ProductListing />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/product/:productId" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path="/verify-email-otp" element={<VerifyEmailOtp />} />
                      <Route path="/verify-email/:token" element={<VerifyEmail />} />
                      <Route path="/resend-verification" element={<ResendVerification />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:token" element={<ResetPassword />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="payment" element={<RazorpayPayment />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsConditions />} />
                      <Route path="/my-orders" element={<Orders />} />
                      <Route path="/orders" element={<Orders />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Footer />
                  <BottomNavbar />
                </div>
              </BrowserRouter>
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>

);

export default App;
