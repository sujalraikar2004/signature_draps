import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Product } from '@/types';
import { toast } from 'sonner';
import api from '../Api'

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (phoneNo: string, otp: string) => Promise<void>;
  register: (username: string, email: string, phoneNo: string) => Promise<void>;
  verifyPhoneOtp: (phoneNo: string, otp: string, email: string) => Promise<{ email: string } | undefined>;
  resendPhoneOtp: (phoneNo: string) => Promise<void>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  resendEmailOtp: (email: string) => Promise<void>;
  sendLoginOtp: (phoneNo: string) => Promise<void>;
  logout: () => Promise<void>;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await api.get('/user/current-user');

      if (response && response.data.success) {
        setAuthState({
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error: any) {
      // If it's a 401 error, the axios interceptor will try to refresh
      // If refresh fails, user will be logged out
      console.log('Auth check error:', error.response?.status);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const register = async (username: string, email: string, phoneNo: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/user/register', { username, email, phoneNo });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      toast.success(response.data.message || 'Registration successful! Please verify your phone.');

      localStorage.setItem('pendingVerificationPhone', phoneNo);
      localStorage.setItem('pendingVerificationEmail', email);

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred during registration.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyPhoneOtp = async (phoneNo: string, otp: string, email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/user/verify-phone-otp', { phoneNo, otp, email });

      if (!response.data.success) {
        throw new Error(response.data.message || 'OTP verification failed');
      }

      toast.success(response.data.message || 'Phone verified! Please verify your email.');

      return { email: response.data.email };
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Invalid OTP. Please try again.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resendPhoneOtp = async (phoneNo: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/user/resend-phone-otp', { phoneNo });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to resend OTP');
      }

      toast.success(response.data.message || 'OTP resent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to resend OTP.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/user/verify-email-otp', { email, otp });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Email verification failed');
      }

      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });

      toast.success(response.data.message || 'Email verified! Account activated successfully.');
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.response?.data?.message || error.message || 'Invalid OTP. Please try again.');
      throw error;
    }
  };

  const resendEmailOtp = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/user/resend-email-otp', { email });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to resend email OTP')
      }

      toast.success(response.data.message || 'Email OTP resent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to resend email OTP.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const sendLoginOtp = async (phoneNo: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/user/send-login-otp', { phoneNo });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send OTP')
      }

      toast.success(response.data.message || 'OTP sent to your phone!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to send OTP.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (phoneNo: string, otp: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/user/login', { phoneNo, otp });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed')
      }

      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });

      toast.success(response.data.message || 'Login successful!');
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.response?.data?.message || error.message || 'An error occurred during login.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
    } catch (error) {
      console.log(error);
    }

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });

    toast.success('Logged out successfully');
  };

  const addToWishlist = (product: Product) => {
    if (!authState.user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    const isAlreadyInWishlist = authState.user.wishlist.some(item => item._id === product._id);
    if (isAlreadyInWishlist) {
      toast.info('Product is already in your wishlist');
      return;
    }

    const updatedUser = {
      ...authState.user,
      wishlist: [...authState.user.wishlist, product]
    };

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    toast.success('Added to wishlist');
  };

  const removeFromWishlist = (productId: string) => {
    if (!authState.user) return;

    const updatedUser = {
      ...authState.user,
      wishlist: authState.user.wishlist.filter(item => item._id !== productId)
    };

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string) => {
    if (!authState.user) return false;
    return authState.user.wishlist.some(item => item._id === productId);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      verifyPhoneOtp,
      resendPhoneOtp,
      verifyEmailOtp,
      resendEmailOtp,
      sendLoginOtp,
      logout,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
