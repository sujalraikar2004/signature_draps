import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WhatsappIcon } from '@/components/icons/whatsappIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ otp?: string; phoneNo?: string }>({});
  
  const { verifyPhoneOtp, resendPhoneOtp, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const phoneFromParams = searchParams.get('phone');
    const phoneFromStorage = localStorage.getItem('pendingVerificationPhone');
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
    
    if (phoneFromParams) {
      setPhoneNo(phoneFromParams);
    } else if (phoneFromStorage) {
      setPhoneNo(phoneFromStorage);
    }
    
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateForm = () => {
    const newErrors: { otp?: string; phoneNo?: string } = {};
    
    if (!phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNo)) {
      newErrors.phoneNo = 'Please enter a valid 10-digit phone number';
    }
   
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }
    
    try {
      const result = await verifyPhoneOtp(phoneNo, otp, email);
      if (result && result.email) {
        localStorage.setItem('pendingEmailVerification', result.email);
        navigate(`/verify-email-otp?email=${result.email}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNo.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      await resendPhoneOtp(phoneNo);
      setCountdown(60);
      setOtp('');
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNo(value);
  };

  return (
    <main className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="card-premium">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-gold px-3 py-1 rounded-lg">
                <span className="text-xl font-heading font-bold text-primary">SD</span>
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-primary">Signature</span>
                <span className="text-xl font-heading font-bold text-accent ml-1">Draps</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-heading">Verify Phone Number</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <WhatsappIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className="font-semibold text-green-800 dark:text-green-300">Check your WhatsApp!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                An OTP has been sent to your number. Please enter the 6-digit code to verify your phone.
              </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNo}
                  onChange={handlePhoneChange}
                  className={errors.phoneNo ? 'border-destructive' : ''}
                />
                {errors.phoneNo && (
                  <p className="text-sm text-destructive">{errors.phoneNo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className={`text-center text-lg tracking-wider ${errors.otp ? 'border-destructive' : ''}`}
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-sm text-destructive">{errors.otp}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isLoading}
                  className="text-sm"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-hero" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Phone Number'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already verified?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
