import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">("idle");
  const [countdown, setCountdown] = useState(3);

  // Auto-redirect countdown on success
  useEffect(() => {
    if (resetStatus === "success") {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        navigate("/login");
      }
    }
  }, [resetStatus, countdown, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/v1/user/reset-password/${token}`, { password });

      if (response.data.success) {
        setResetStatus("success");
        toast({
          title: "Password Reset!",
          description: "Your password has been reset successfully.",
        });
      }
    } catch (error: any) {
      setResetStatus("error");
      const errorMessage = error.response?.data?.message || "Failed to reset password. The link may be invalid or expired.";
      toast({
        title: "Reset Failed",
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
            {resetStatus === "success" ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : resetStatus === "error" ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Lock className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {resetStatus === "success" ? "Password Reset!" : resetStatus === "error" ? "Reset Failed" : "Reset Password"}
          </CardTitle>
          <CardDescription className="mt-2">
            {resetStatus === "success" ? (
              <div className="space-y-2">
                <p className="text-base font-medium text-green-600">
                  Your password has been reset successfully!
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting to login page in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>
            ) : resetStatus === "error" ? (
              "The reset link is invalid or has expired. Please request a new one."
            ) : (
              "Enter your new password below"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetStatus === "idle" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          )}

          {resetStatus === "success" && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Go to Login Now
              </Button>
            </div>
          )}

          {resetStatus === "error" && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/forgot-password")}
                className="w-full"
              >
                Request New Reset Link
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
