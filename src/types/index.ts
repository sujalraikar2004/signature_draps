export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subcategory?: string;
  description: string;
  features: string[];
  stock: number;
  featured?: boolean;
  brand?: string;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  helpfulBy: string[];
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: any;
  description: string;
  subcategories?: Subcategory[];
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phoneNo?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: Product[];
}

export interface Address {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  orderId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMode: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  ratings: number[];
  inStock: boolean;
  brands: string[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
}