import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Login() {
  const [phoneNo, setPhoneNo] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ phoneNo?: string; otp?: string }>({});
  
  const { sendLoginOtp, login, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validatePhoneNo = () => {
    const newErrors: { phoneNo?: string } = {};
    
    if (!phoneNo) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNo)) {
      newErrors.phoneNo = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: { otp?: string } = {};
    
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validatePhoneNo()) return;
    
    try {
      await sendLoginOtp(phoneNo);
      setOtpSent(true);
      setCountdown(60);
      setOtp('');
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOtp()) return;
    
    try {
      await login(phoneNo, otp);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNo(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
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
            <CardTitle className="text-2xl font-heading">Welcome Back</CardTitle>
            <CardDescription>
              Sign in with your phone number
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNo"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNo}
                      onChange={handlePhoneChange}
                      className={`pl-10 ${errors.phoneNo ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.phoneNo && (
                    <p className="text-sm text-destructive">{errors.phoneNo}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-hero" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone Number</Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    value={phoneNo}
                    disabled
                    className="bg-muted"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setCountdown(0);
                    }}
                    className="p-0 h-auto text-sm"
                  >
                    Change phone number
                  </Button>
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
                    autoFocus
                  />
                  {errors.otp && (
                    <p className="text-sm text-destructive">{errors.otp}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSendOtp}
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
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}