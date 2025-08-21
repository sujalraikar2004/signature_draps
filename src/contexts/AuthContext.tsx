import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Product } from '@/types';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  addresses: [
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    }
  ],
  orders: [],
  wishlist: []
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@signaturedraps.com' && password === 'demo123') {
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });
      toast.success('Login successful!');
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error('Invalid credentials. Try demo@signaturedraps.com / demo123');
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...mockUser,
      id: Date.now().toString(),
      name,
      email,
      addresses: []
    };
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });
    
    toast.success('Registration successful!');
  };

  const logout = () => {
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

    const isAlreadyInWishlist = authState.user.wishlist.some(item => item.id === product.id);
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
      wishlist: authState.user.wishlist.filter(item => item.id !== productId)
    };

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string) => {
    if (!authState.user) return false;
    return authState.user.wishlist.some(item => item.id === productId);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
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