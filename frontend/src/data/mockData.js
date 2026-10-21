export const CATEGORIES = [
  {
    id: 'books',
    name: 'Books & Study Materials',
    count: '120+ Items',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    description: 'Textbooks, exam guides, reference materials & syllabus notes'
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    count: '85+ Items',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Headphones, power banks, scientific calculators & study tech'
  },
  {
    id: 'stationery',
    name: 'Stationery',
    count: '240+ Items',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    description: 'Spiral notebooks, highlighters, sticky notes & writing sets'
  },
  {
    id: 'backpacks',
    name: 'Bags & Backpacks',
    count: '45+ Items',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Ergonomic water-resistant student backpacks with laptop sleeves'
  },
  {
    id: 'hostel',
    name: 'Hostel Essentials',
    count: '90+ Items',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    description: 'Study lamps, electric kettles, organizers & water bottles'
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories',
    count: '65+ Items',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    description: 'Student hoodies, casual college tees, watches & caps'
  }
];

export const PRODUCTS = [
  {
    id: 1,
    name: 'Student Spiral Study Notebooks (Pack of 4)',
    category: 'Stationery',
    categoryId: 'stationery',
    price: 349,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    inStock: true,
    description: 'Premium 80 GSM paper, micro-perforated pages, 300 pages per notebook. Ideal for college lectures, note-taking, and assignment drafting.'
  },
  {
    id: 2,
    name: 'Ergonomic Student Laptop Backpack (28L)',
    category: 'Bags & Backpacks',
    categoryId: 'backpacks',
    price: 1499,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 480,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
    inStock: true,
    description: 'Water-resistant fabric with dedicated padded compartment for laptops up to 15.6 inches, anti-theft back pocket, and USB charging pass-through.'
  },
  {
    id: 3,
    name: 'Noise Cancelling Wireless Headphones',
    category: 'Electronics & Gadgets',
    categoryId: 'electronics',
    price: 2499,
    originalPrice: 3999,
    rating: 4.7,
    reviewsCount: 350,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'Top Tech',
    inStock: true,
    description: 'Active Noise Cancellation (ANC) up to 25dB for library and study sessions. 40-hour ultra-long battery life with deep bass audio.'
  },
  {
    id: 4,
    name: 'Scientific Engineering Calculator (FX-991EX)',
    category: 'Electronics & Gadgets',
    categoryId: 'electronics',
    price: 1199,
    originalPrice: 1395,
    rating: 4.9,
    reviewsCount: 540,
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    badge: 'Essential',
    inStock: true,
    description: 'High-resolution natural textbook display with 552 functions. Approved for university engineering and science examinations.'
  },
  {
    id: 5,
    name: 'Dorm Study LED Desk Lamp with USB Charger',
    category: 'Hostel Essentials',
    categoryId: 'hostel',
    price: 799,
    originalPrice: 1299,
    rating: 4.6,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    badge: 'Hostel Must-have',
    inStock: true,
    description: 'Eye-caring touch control desk light with 3 color modes and 5 brightness levels. Includes 5V USB output to charge your smartphone overnight.'
  },
  {
    id: 6,
    name: 'Pastel Aesthetic Highlighters & Gel Pens Set',
    category: 'Stationery',
    categoryId: 'stationery',
    price: 299,
    originalPrice: 450,
    rating: 4.8,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    badge: 'Trending',
    inStock: true,
    description: 'Set of 6 soft pastel no-bleed chisel-tip highlighters and 4 quick-drying smudge-free black gel pens for aesthetic study notes.'
  },
  {
    id: 7,
    name: 'Stainless Steel Insulated Water Bottle (750ml)',
    category: 'Hostel Essentials',
    categoryId: 'hostel',
    price: 549,
    originalPrice: 899,
    rating: 4.7,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=600&q=80',
    badge: 'Eco Friendly',
    inStock: true,
    description: 'Double-walled vacuum insulation keeps water cold for 24 hours or hot for 12 hours. Sweat-proof finish and leakproof spill-proof cap.'
  },
  {
    id: 8,
    name: 'Classic Oxford Cotton Student Oversized Hoodie',
    category: 'Fashion & Accessories',
    categoryId: 'fashion',
    price: 999,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 168,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    badge: 'Student Style',
    inStock: true,
    description: 'Heavyweight 320 GSM combed cotton fleece with kangaroo pocket and double-lined drawstring hood. Cozy for early morning lectures.'
  }
];
