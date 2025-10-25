import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import api from "@/Api";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/user/verify-email/${token}`);
        if (response.data.success) {
          setVerificationStatus("success");
          setMessage(response.data.message);
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. You can now login.",
          });
        }
      } catch (error: any) {
        setVerificationStatus("error");
        const errorMessage = error.response?.data?.message || "Failed to verify email. The link may be invalid or expired.";
        setMessage(errorMessage);
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token, toast]);

  // Auto-redirect countdown on success
  useEffect(() => {
    if (verificationStatus === "success") {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        navigate("/login");
      }
    }
  }, [verificationStatus, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationStatus === "loading" && (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            )}
            {verificationStatus === "success" && (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            )}
            {verificationStatus === "error" && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus === "loading" && "Verifying Your Email"}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="mt-2">
            {verificationStatus === "loading" && "Please wait while we verify your email address..."}
            {verificationStatus === "success" && (
              <div className="space-y-2">
                <p className="text-base font-medium text-green-600">
                  Your email is verified and now you can login
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting to login page in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>
            )}
            {verificationStatus === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === "success" && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Go to Login Now
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          )}
          {verificationStatus === "error" && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/resend-verification")}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Verification Email
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="outline"
                className="w-full"
              >
                Back to Register
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
