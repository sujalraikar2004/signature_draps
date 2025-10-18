import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/v1/user/forgot-password", { email });

      if (response.data.success) {
        setIsEmailSent(true);
        toast({
          title: "Email Sent!",
          description: "Password reset link has been sent to your email.",
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send reset email. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isEmailSent ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <Mail className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isEmailSent ? "Check Your Email" : "Forgot Password?"}
          </CardTitle>
          <CardDescription className="mt-2">
            {isEmailSent
              ? "We've sent a password reset link to your email address. Please check your inbox and click the link to reset your password."
              : "Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="font-medium mb-1">Email sent successfully!</p>
                <p>The reset link will expire in 1 hour.</p>
              </div>

              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail("");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Send to a different email
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
