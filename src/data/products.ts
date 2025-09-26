// import { Product } from '@/types';
// import curtain1 from '@/assets/products/curtain-1.jpg';
// import curtain2 from '@/assets/products/curtain-2.jpg';
// import zebraBlind1 from '@/assets/products/zebra-blind-1.jpg';
// import zebraBlind2 from '@/assets/products/zebra-blind-2.jpg';
// import beanbag1 from '@/assets/products/beanbag-1.jpg';
// import beanbag2 from '@/assets/products/beanbag-2.jpg';
// import wallpaper1 from '@/assets/products/wallpaper-1.jpg';
// import wallpaper2 from '@/assets/products/wallpaper-2.jpg';
// import romanBlind1 from '@/assets/products/roman-blind-1.jpg';
// import romanBlind2 from '@/assets/products/roman-blind-2.jpg';
// import carpet1 from '@/assets/products/carpet-1.jpg';
// import carpet2 from '@/assets/products/carpet-2.jpg';

// export const mockProducts: Product[] = [
//   // Curtains & Furnishing
//   {
//     id: '1',
//     name: 'Premium Silk Curtains - Elegant Gold Collection',
//     price: 4999,
//     originalPrice: 6999,
//     rating: 4.8,
//     reviewCount: 156,
//     image: curtain1,
//     images: [curtain1, curtain2, curtain1, curtain2],
//     category: 'curtains-furnishing',
//     subcategory: 'ready-made-curtains',
//     description: 'Luxurious silk curtains with elegant gold accents. Perfect for living rooms and bedrooms. Features premium fabric with excellent light filtering and privacy.',
//     features: [
//       'Premium silk fabric',
//       'Gold embroidered details',
//       'Blackout lining available',
//       'Easy installation',
//       'Machine washable',
//       'Custom sizes available'
//     ],
//     inStock: true,
//     isNew: true,
//     isBestSeller: true,
//     brand: 'Signature Collection'
//   },
//   {
//     id: '2',
//     name: 'Modern Blackout Curtains - Urban Series',
//     price: 3499,
//     originalPrice: 4499,
//     rating: 4.6,
//     reviewCount: 98,
//     image: curtain1,
//     images: [curtain2, curtain1, curtain2, curtain1],
//     category: 'curtains-furnishing',
//     subcategory: 'ready-made-curtains',
//     description: 'Contemporary blackout curtains for modern homes. Excellent light blocking and thermal insulation properties.',
//     features: [
//       '100% blackout capability',
//       'Thermal insulation',
//       'Noise reduction',
//       'Multiple color options',
//       'Easy care fabric',
//       'Standard and custom sizes'
//     ],
//     inStock: true,
//     isBestSeller: true,
//     brand: 'Urban Living'
//   },
//   {
//     id: '3',
//     name: 'Classic Sheer Curtains - Ethereal White',
//     price: 2299,
//     originalPrice: 2999,
//     rating: 4.4,
//     reviewCount: 73,
//     image: curtain1,
//     images: [curtain1, curtain1, curtain1],
//     category: 'curtains-furnishing',
//     subcategory: 'ready-made-curtains',
//     description: 'Delicate sheer curtains that allow natural light while maintaining privacy. Perfect for creating an airy, elegant atmosphere.',
//     features: [
//       'Lightweight sheer fabric',
//       'Natural light filtering',
//       'Privacy protection',
//       'Elegant draping',
//       'Machine washable',
//       'Various width options'
//     ],
//     inStock: true,
//     brand: 'Classic Elegance'
//   },

//   // Blinds
//   {
//     id: '4',
//     name: 'Premium Zebra Blinds - Day & Night Collection',
//     price: 5999,
//     originalPrice: 7999,
//     rating: 4.9,
//     reviewCount: 234,
//     image: zebraBlind1,
//     images: [zebraBlind1, zebraBlind2, zebraBlind1, zebraBlind2],
//     category: 'blinds',
//     subcategory: 'zebra-blinds',
//     description: 'Innovative zebra blinds offering perfect light control with alternating transparent and opaque stripes. Premium quality mechanism.',
//     features: [
//       'Day & night light control',
//       'Premium fabric quality',
//       'Smooth operation mechanism',
//       'Child safety features',
//       'Easy installation',
//       'UV protection'
//     ],
//     inStock: true,
//     isNew: true,
//     isBestSeller: true,
//     brand: 'Smart Blinds'
//   },
//   {
//     id: '5',
//     name: 'Motorized Roman Blinds - Luxury Automation',
//     price: 8999,
//     originalPrice: 11999,
//     rating: 4.7,
//     reviewCount: 87,
//     image: romanBlind1,
//     images: [romanBlind1, romanBlind1, romanBlind1],
//     category: 'blinds',
//     subcategory: 'roman-blinds',
//     description: 'Luxury motorized Roman blinds with remote control and smart home integration. Premium fabric with elegant pleating.',
//     features: [
//       'Motorized operation',
//       'Remote control included',
//       'Smart home compatible',
//       'Premium fabric options',
//       'Soft-close mechanism',
//       'Battery backup'
//     ],
//     inStock: true,
//     isNew: true,
//     brand: 'Smart Home Solutions'
//   },
//   {
//     id: '6',
//     name: 'Bamboo Roman Blinds - Natural Collection',
//     price: 3999,
//     originalPrice: 4999,
//     rating: 4.5,
//     reviewCount: 124,
//     image: romanBlind1,
//     images: [romanBlind1, romanBlind1, romanBlind1],
//     category: 'blinds',
//     subcategory: 'roman-blinds',
//     description: 'Eco-friendly bamboo Roman blinds that bring natural warmth to your space. Sustainable and stylish window treatment.',
//     features: [
//       '100% natural bamboo',
//       'Eco-friendly material',
//       'Natural light filtering',
//       'Easy to clean',
//       'Durable construction',
//       'Various stain options'
//     ],
//     inStock: true,
//     brand: 'Eco Living'
//   },

//   // Bean Bags
//   {
//     id: '7',
//     name: 'Executive Leather Bean Bag - Premium Comfort',
//     price: 12999,
//     originalPrice: 15999,
//     rating: 4.8,
//     reviewCount: 156,
//     image: beanbag1,
//     images: [beanbag1, beanbag2, beanbag1, beanbag2],
//     category: 'bean-bags',
//     subcategory: 'bean-bags',
//     description: 'Luxurious leather bean bag perfect for executive offices and premium living spaces. Filled with premium beans for ultimate comfort.',
//     features: [
//       'Genuine leather exterior',
//       'Premium bean filling',
//       'Ergonomic design',
//       'Easy to clean',
//       'Durable stitching',
//       'Available in multiple colors'
//     ],
//     inStock: true,
//     isBestSeller: true,
//     brand: 'Premium Comfort'
//   },
//   {
//     id: '8',
//     name: 'Jumbo Bean Bag - Family Size',
//     price: 6999,
//     originalPrice: 8999,
//     rating: 4.6,
//     reviewCount: 203,
//     image: beanbag1,
//     images: [beanbag1, beanbag1, beanbag1],
//     category: 'bean-bags',
//     subcategory: 'bean-bags',
//     description: 'Extra-large bean bag perfect for families. Can comfortably seat 2-3 people. Premium fabric with refill service available.',
//     features: [
//       'Jumbo size - seats 2-3 people',
//       'Premium fabric cover',
//       'Refillable design',
//       'Machine washable cover',
//       'Anti-bacterial treatment',
//       'Multiple color options'
//     ],
//     inStock: true,
//     brand: 'Family Living'
//   },

//   // Wallpaper
//   {
//     id: '9',
//     name: '3D Textured Wallpaper - Luxury Gold Pattern',
//     price: 899,
//     originalPrice: 1299,
//     rating: 4.7,
//     reviewCount: 89,
//     image: wallpaper1,
//     images: [wallpaper1, wallpaper2, wallpaper1, wallpaper2],
//     category: 'wallpaper',
//     subcategory: '3d-wallpaper',
//     description: 'Stunning 3D textured wallpaper with luxury gold patterns. Imported quality with easy application and removal.',
//     features: [
//       'Imported 3D texture',
//       'Gold metallic finish',
//       'Easy application',
//       'Removable adhesive',
//       'Washable surface',
//       'Premium quality material'
//     ],
//     inStock: true,
//     isNew: true,
//     brand: 'Luxury Walls'
//   },
//   {
//     id: '10',
//     name: 'Self-Adhesive Marble Wallpaper - Carrara White',
//     price: 599,
//     originalPrice: 799,
//     rating: 4.4,
//     reviewCount: 167,
//     image: wallpaper1,
//     images: [wallpaper1, wallpaper1, wallpaper1],
//     category: 'wallpaper',
//     subcategory: 'self-adhesive-wallpaper',
//     description: 'Realistic marble pattern wallpaper with self-adhesive backing. Perfect for kitchens and bathrooms.',
//     features: [
//       'Realistic marble pattern',
//       'Self-adhesive backing',
//       'Waterproof surface',
//       'Easy to cut and apply',
//       'No additional adhesive needed',
//       'Removable without residue'
//     ],
//     inStock: true,
//     isBestSeller: true,
//     brand: 'Stone Look'
//   },

//   // Carpets & Rugs
//   {
//     id: '11',
//     name: 'Persian Style Area Rug - Traditional Elegance',
//     price: 18999,
//     originalPrice: 24999,
//     rating: 4.9,
//     reviewCount: 78,
//     image: carpet1,
//     images: [carpet1, carpet2, carpet1, carpet2],
//     category: 'carpets-rugs',
//     subcategory: 'carpets-rugs',
//     description: 'Handwoven Persian style area rug with intricate traditional patterns. Premium wool blend for durability and comfort.',
//     features: [
//       'Handwoven craftsmanship',
//       'Premium wool blend',
//       'Traditional Persian design',
//       'Stain resistant treatment',
//       'Non-slip backing',
//       'Professional cleaning recommended'
//     ],
//     inStock: true,
//     isBestSeller: true,
//     brand: 'Heritage Rugs'
//   },
//   {
//     id: '12',
//     name: 'Modern Geometric Rug - Contemporary Collection',
//     price: 8999,
//     originalPrice: 11999,
//     rating: 4.5,
//     reviewCount: 134,
//     image: carpet1,
//     images: [carpet1, carpet1, carpet1],
//     category: 'carpets-rugs',
//     subcategory: 'carpets-rugs',
//     description: 'Contemporary geometric rug perfect for modern living spaces. Machine-made with high-quality synthetic fibers.',
//     features: [
//       'Modern geometric pattern',
//       'High-quality synthetic fibers',
//       'Machine washable',
//       'Fade resistant colors',
//       'Multiple size options',
//       'Anti-slip backing'
//     ],
//     inStock: true,
//     brand: 'Modern Living'
//   }
// ];

// // Helper functions
// export const getProductsByCategory = (categoryId: string) => {
//   return mockProducts.filter(product => product.category === categoryId);
// };

// export const getBestSellerProducts = () => {
//   return mockProducts.filter(product => product.isBestSeller);
// };

// export const getNewProducts = () => {
//   return mockProducts.filter(product => product.isNew);
// };

// export const getProductById = (id: string) => {
//   return mockProducts.find(product => product.id === id);
// };

// export const searchProducts = (query: string) => {
//   const lowercaseQuery = query.toLowerCase();
//   return mockProducts.filter(product => 
//     product.name.toLowerCase().includes(lowercaseQuery) ||
//     product.description.toLowerCase().includes(lowercaseQuery) ||
//     product.category.toLowerCase().includes(lowercaseQuery)
//   );
// };