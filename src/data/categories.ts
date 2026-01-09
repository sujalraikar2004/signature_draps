import { Category } from '@/types';
import curtainsImg from '@/assets/category-curtains.jpg';
import beanbagsImg from '@/assets/category-beanbags.jpg';
import wallpaperImg from '@/assets/category-wallpaper.jpg';
import blindsImg from '@/assets/category-blinds.jpg';

export const categories: Category[] = [
  {
    id: 'curtains-and-accessories',
    name: 'Curtains & Accessories',
    shortName: 'Curtains',
    image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1765299229/products/products/1765299229630-111033652.jpg",
    icon: '🪟',
    description: 'Premium curtains, drapes, and accessories to transform your windows',
    productCount: 125,
    subcategories: [
      { id: 'ready-made-curtains', name: 'Ready Made Curtains', productCount: 45 },
      { id: 'custom-curtains', name: 'Custom Curtains', productCount: 35 },
      { id: 'curtain-accessories', name: 'Curtain Accessories', productCount: 25 },
      { id: 'curtain-tracks', name: 'Curtain Track & Steel Pipe', productCount: 20 }
    ]
  },
  {
    id: 'window-blinds',
    name: 'Window Blinds',
    shortName: 'Blinds',
    image: blindsImg,
    icon: '🎭',
    description: 'Modern and functional window blinds for light control and privacy',
    productCount: 110,
    subcategories: [
      { id: 'zebra-blinds', name: 'Zebra Blinds', productCount: 30 },
      { id: 'roller-blinds', name: 'Roller Blinds', productCount: 35 },
      { id: 'roman-blinds', name: 'Roman Blinds', productCount: 25 },
      { id: 'pvc-balcony-blinds', name: 'PVC Balcony Blinds', productCount: 20 }
    ]
  },
  {
    id: 'bean-bags-and-beans',
    name: 'Bean Bags and Beans',
    shortName: 'Bean Bags',
    image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1763020339/products/products/1763020339891-192788606.jpg",
    icon: '🪑',
    description: 'Comfortable bean bags and refill beans for relaxed seating',
    productCount: 85,
    subcategories: [
      { id: 'bean-bags', name: 'Bean Bags', productCount: 40 },
      { id: 'thermacol-beans', name: 'Thermacol Beans', productCount: 15 },
      { id: 'bean-bag-covers', name: 'Bean Bag Covers', productCount: 30 }
    ]
  },
  {
    id: 'home-decor-wallpaper-stickers',
    name: 'Wallpaper & Wall Coverings',
    shortName: 'Wallpaper',
    image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1763274577/products/products/1763274577443-8735332.jpg",
    icon: '🎨',
    description: 'Beautiful wallpapers and decorative stickers for wall enhancement',
    productCount: 95,
    subcategories: [
      { id: '3d-wallpaper', name: 'Imported 3D Wallpaper', productCount: 35 },
      { id: 'self-adhesive-wallpaper', name: 'Self-Adhesive Wallpaper', productCount: 30 },
      { id: 'wall-stickers', name: 'Wall Stickers', productCount: 20 },
      { id: 'pvc-wall-panel', name: 'PVC Wall Panel', productCount: 10 }
    ]
  },
  {
    id: 'sofa-recliner-chairs-corner-sofa',
    name: 'Sofa, Recliner, Chairs and Corner Sofa',
    shortName: 'Seating',
    image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1763019558/products/products/1763019558252-934864604.jpg",
    icon: '🛋️',
    description: 'Comfortable and stylish seating solutions for your living space',
    productCount: 150,
    subcategories: [
      { id: 'sofas', name: 'Sofas', productCount: 50 },
      { id: 'recliners', name: 'Recliners', productCount: 30 },
      { id: 'chairs', name: 'Chairs', productCount: 40 },
      { id: 'corner-sofas', name: 'Corner Sofas', productCount: 30 }
    ]
  },
  {
    id: 'bedsheet-and-comforters',
    name: 'Bedsheet & Comforters',
    shortName: 'Bedding',
    image: "https://m.media-amazon.com/images/I/71VR-NjNKYL.jpg",
    icon: '🛏️',
    description: 'Comfortable bedding essentials for a good night\'s sleep',
    productCount: 80,
    subcategories: [
      { id: 'bedsheets', name: 'Bedsheets', productCount: 40 },
      { id: 'comforters', name: 'Comforters', productCount: 25 },
      { id: 'pillow-covers', name: 'Pillow Covers', productCount: 15 }
    ]
  },
  {
    id: 'institutional-project-window-blinds',
    name: 'Institutional Project Window Blinds',
    shortName: 'Office Blinds',
    image: blindsImg,
    icon: '🏢',
    description: 'Professional-grade blinds for offices, hospitals, and institutions',
    productCount: 60,
    subcategories: [
      { id: 'office-blinds', name: 'Office Blinds', productCount: 25 },
      { id: 'hospital-blinds', name: 'Hospital Blinds', productCount: 15 },
      { id: 'school-blinds', name: 'School Blinds', productCount: 20 }
    ]
  },
  {
    id: 'carpet-rugs-door-mats',
    name: 'Carpet, Rugs & Door Mats',
    shortName: 'Floor Decor',
    image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1765420344/products/products/1765420343136-538249634.jpg",
    icon: '🏠',
    description: 'Quality carpets, rugs, and mats for flooring and decoration',
    productCount: 90,
    subcategories: [
      { id: 'carpets', name: 'Carpets', productCount: 35 },
      { id: 'rugs', name: 'Rugs', productCount: 30 },
      { id: 'door-mats', name: 'Door Mats', productCount: 25 }
    ]
  },
  {
    id: 'artificial-grass-plant-vertical-garden',
    name: 'Artificial Grass, Plant and Vertical Garden',
    shortName: 'Grass & Plants',
    image: "https://res.cloudinary.com/dfoybcsqz/image/upload/v1765340836/products/products/1765340835878-400873391.jpg",
    icon: '🌿',
    description: 'Artificial greenery solutions for indoor and outdoor spaces',
    productCount: 70,
    subcategories: [
      { id: 'artificial-grass', name: 'Artificial Grass', productCount: 25 },
      { id: 'artificial-plants', name: 'Artificial Plants', productCount: 25 },
      { id: 'vertical-gardens', name: 'Vertical Gardens', productCount: 20 }
    ]
  }
];