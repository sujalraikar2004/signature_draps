import { Category } from '@/types';
import curtainsImg from '@/assets/category-curtains.jpg';
import beanbagsImg from '@/assets/category-beanbags.jpg';
import wallpaperImg from '@/assets/category-wallpaper.jpg';
import blindsImg from '@/assets/category-blinds.jpg';

export const categories: Category[] = [
  {
    id: 'curtains-furnishing',
    name: 'Curtains & Furnishing',
    image: curtainsImg,
    productCount: 125,
    subcategories: [
      { id: 'ready-made-curtains', name: 'Ready Made Curtains', productCount: 45 },
      { id: 'custom-curtains', name: 'Custom Curtains', productCount: 35 },
      { id: 'curtain-accessories', name: 'Curtain Accessories', productCount: 25 },
      { id: 'curtain-tracks', name: 'Curtain Track & Steel Pipe', productCount: 20 }
    ]
  },
  {
    id: 'bean-bags',
    name: 'Bean Bags & Cushions',
    image: beanbagsImg,
    productCount: 85,
    subcategories: [
      { id: 'bean-bags', name: 'Bean Bags', productCount: 40 },
      { id: 'thermacol-beans', name: 'Thermacol Beans', productCount: 15 },
      { id: 'pillows-cushions', name: 'Knobs, Pillows & Cushions', productCount: 30 }
    ]
  },
  {
    id: 'wallpaper',
    name: 'Wallpaper & Wall Coverings',
    image: wallpaperImg,
    productCount: 95,
    subcategories: [
      { id: '3d-wallpaper', name: 'Imported 3D Wallpaper', productCount: 35 },
      { id: 'self-adhesive-wallpaper', name: 'Self-Adhesive Wallpaper', productCount: 30 },
      { id: 'marble-sheets', name: 'Self-Adhesive UV Marble Sheet', productCount: 20 },
      { id: 'pvc-wall-panel', name: 'PVC Wall Panel', productCount: 10 }
    ]
  },
  {
    id: 'blinds',
    name: 'Blinds & Window Treatments',
    image: blindsImg,
    productCount: 110,
    subcategories: [
      { id: 'zebra-blinds', name: 'Zebra Blinds', productCount: 30 },
      { id: 'roller-blinds', name: 'Roller Blinds', productCount: 35 },
      { id: 'roman-blinds', name: 'Roman Blinds', productCount: 25 },
      { id: 'pvc-balcony-blinds', name: 'PVC Balcony Blinds', productCount: 20 }
    ]
  },
  {
    id: 'flooring-mats',
    name: 'Flooring & Mats',
    image: curtainsImg, // Will generate more category images later
    productCount: 75,
    subcategories: [
      { id: 'door-mats', name: 'Door Mats', productCount: 20 },
      { id: 'synthetic-mats', name: 'Synthetic Mats', productCount: 15 },
      { id: 'grass-mats', name: 'Grass Mats', productCount: 10 },
      { id: 'artificial-grass', name: 'Artificial Grass Lawn', productCount: 12 },
      { id: 'rubber-mats', name: 'Rubber Mats', productCount: 8 },
      { id: 'pvc-flooring', name: 'PVC Flooring', productCount: 10 }
    ]
  },
  {
    id: 'carpets-rugs',
    name: 'Carpets & Rugs',
    image: beanbagsImg, // Will generate more category images later
    productCount: 65,
    subcategories: [
      { id: 'carpets-rugs', name: 'Carpets & Rugs', productCount: 40 },
      { id: 'wall-to-wall-carpet', name: 'Wall-to-Wall Carpet', productCount: 25 }
    ]
  },
  {
    id: 'mattress',
    name: 'Mattress & Bedding',
    image: wallpaperImg, // Will generate more category images later
    productCount: 25,
    subcategories: [
      { id: 'restrlox-mattress', name: 'RestRlox Mattress', productCount: 25 }
    ]
  }
];