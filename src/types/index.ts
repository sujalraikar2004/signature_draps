export interface Product {
  _id: string;
  name: string;
  productCode: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: { url: string; publicId: string; alt: string; }[];
  videos?: { url: string; publicId: string; thumbnail: string; duration: number; format: string; alt: string; }[];
  category: string;
  subcategory?: string;
  description: string;
  features: string[];
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
  brand?: string;
  isLiked?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
  // Customizable product fields
  isCustomizable?: boolean;
  sizeVariants?: SizeVariant[];
  allowCustomSize?: boolean;
  customSizeConfig?: CustomSizeConfig;
  disclaimer?: string;
  // Delivery and Policy fields
  deliveryInfo?: {
    cashOnDelivery: boolean;
    freeDelivery: boolean;
    deliveryCharges: number;
    estimatedDays: {
      min: number;
      max: number;
    };
    deliveryPartner: string;
  };
  returnPolicy?: {
    returnable: boolean;
    returnDays: number;
    returnConditions?: string;
  };
  secureTransaction?: boolean;
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
  shortName?: string;
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

export interface SizeVariant {
  _id?: string;
  name: string;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'cm' | 'inch' | 'ft' | 'm';
  };
  area?: number; // For area-based products (wallpaper, grass)
  diameter?: number; // For round items (carpets)
  sizeLabel?: string; // For bean bags (S, M, L, XL, XXL, XXXL)
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface CustomSizeConfig {
  enabled: boolean;
  fields: ('length' | 'width' | 'height' | 'area' | 'diameter')[];
  unit: 'cm' | 'inch' | 'ft' | 'm' | 'sqft' | 'sqm';
  pricePerUnit?: number;
  minimumCharge?: number;
}

export interface CustomSize {
  isCustom: boolean;
  measurements: {
    length?: number;
    width?: number;
    height?: number;
    area?: number;
    diameter?: number;
    unit: string;
  };
  calculatedPrice?: number;
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSizeVariant?: {
    variantId: string;
    name: string;
    dimensions: {
      length?: number;
      width?: number;
      height?: number;
      unit: string;
    };
    price: number;
  };
  customSize?: CustomSize;
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