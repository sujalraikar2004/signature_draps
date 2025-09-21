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
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, phoneNo: string) => Promise<void>;
  verifyOtp: (phoneNo: string, otp: string) => Promise<void>;
  resendOtp: (phoneNo: string) => Promise<void>;
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
      const response = await api.get('/user/current-user');


      if (response) {
      
        setAuthState({
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error) {
      // User not logged in, which is fine
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await api.post('/user/login', { email, password });
  

    

      if (!response) {
        throw new Error(response.data.message || 'Login failed');
      }

      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });

      toast.success(response.data.message || 'Login successful!');
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.message || 'An error occurred during login.');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, phoneNo: string) => {
    console.log(username,email,password,phoneNo);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/user/register', { username, email, password, phoneNo },
      );



      if (!response) {
        throw new Error(response.data.message || 'Registration failed');
      }

      toast.success(response.data.message || 'Registration successful! Please verify your OTP.');
    
      localStorage.setItem('pendingVerificationPhone', phoneNo);

    } catch (error: any) {
      toast.error(error.message || 'An error occurred during registration.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyOtp = async (phoneNo: string, otp: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await api.post('/user/verify',{ phoneNo, otp });

    

      if (!response) {
        throw new Error(response.data.message || 'OTP verification failed');
      }

  
      localStorage.removeItem('pendingVerificationPhone');
      
      toast.success(response.data.message || 'Account verified successfully!');
      
     
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resendOtp = async (phoneNo: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch('/api/users/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast.success(data.message || 'OTP resent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP.');
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
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
      verifyOtp,
      resendOtp,
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