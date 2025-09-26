import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import api from '../Api'

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ otp?: string; phoneNo?: string }>({});
  
  const { verifyOtp, resendOtp, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get phone number from URL params or localStorage
    const phoneFromParams = searchParams.get('phone');
    const phoneFromStorage = localStorage.getItem('pendingVerificationPhone');
    
    if (phoneFromParams) {
      setPhoneNo(phoneFromParams);
    } else if (phoneFromStorage) {
      setPhoneNo(phoneFromStorage);
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
    
    try {
      const  responce = await api.post("/user/verify",{phoneNo,otp})
      toast.success('Account verified successfully! You can now login.');
      navigate('/login');
    } catch (error) {
       toast.error(" failed to verify otp");
       console.log(error);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNo.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      await resendOtp(phoneNo);
      setCountdown(60); // 60 second countdown
      setOtp(''); // Clear current OTP
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
            <CardTitle className="text-2xl font-heading">Verify Your Account</CardTitle>
            <CardDescription>
              Enter the 6-digit OTP sent to your phone number
            </CardDescription>
          </CardHeader>
          
          <CardContent>
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
                  'Verify Account'
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
