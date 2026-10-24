import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

/**
 * Sample products list for ShopEase initial seeding
 */
const sampleProducts = [
  {
    name: 'Student Spiral Study Notebooks (Pack of 4)',
    category: 'Stationery',
    price: 349,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    stock: 50,
    description: 'Premium 80 GSM paper, micro-perforated pages, 300 pages per notebook. Ideal for college lectures, note-taking, and assignment drafting.'
  },
  {
    name: 'Ergonomic Student Laptop Backpack (28L)',
    category: 'Bags & Backpacks',
    price: 1499,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 480,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
    stock: 35,
    description: 'Water-resistant fabric with dedicated padded compartment for laptops up to 15.6 inches, anti-theft back pocket, and USB charging pass-through.'
  },
  {
    name: 'Noise Cancelling Wireless Headphones',
    category: 'Electronics & Gadgets',
    price: 2499,
    originalPrice: 3999,
    rating: 4.7,
    reviewsCount: 350,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'Top Tech',
    stock: 20,
    description: 'Active Noise Cancellation (ANC) up to 25dB for library and study sessions. 40-hour ultra-long battery life with deep bass audio.'
  },
  {
    name: 'Scientific Engineering Calculator (FX-991EX)',
    category: 'Electronics & Gadgets',
    price: 1199,
    originalPrice: 1395,
    rating: 4.9,
    reviewsCount: 540,
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    badge: 'Essential',
    stock: 40,
    description: 'High-resolution natural textbook display with 552 functions. Approved for university engineering and science examinations.'
  },
  {
    name: 'Dorm Study LED Desk Lamp with USB Charger',
    category: 'Hostel Essentials',
    price: 799,
    originalPrice: 1299,
    rating: 4.6,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    badge: 'Hostel Must-have',
    stock: 30,
    description: 'Eye-caring touch control desk light with 3 color modes and 5 brightness levels. Includes 5V USB output to charge your smartphone overnight.'
  },
  {
    name: 'Pastel Aesthetic Highlighters & Gel Pens Set',
    category: 'Stationery',
    price: 299,
    originalPrice: 450,
    rating: 4.8,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    badge: 'Trending',
    stock: 60,
    description: 'Set of 6 soft pastel no-bleed chisel-tip highlighters and 4 quick-drying smudge-free black gel pens for aesthetic study notes.'
  },
  {
    name: 'Stainless Steel Insulated Water Bottle (750ml)',
    category: 'Hostel Essentials',
    price: 549,
    originalPrice: 899,
    rating: 4.7,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=600&q=80',
    badge: 'Eco Friendly',
    stock: 45,
    description: 'Double-walled vacuum insulation keeps water cold for 24 hours or hot for 12 hours. Sweat-proof finish and leakproof spill-proof cap.'
  },
  {
    name: 'Classic Oxford Cotton Student Oversized Hoodie',
    category: 'Fashion & Accessories',
    price: 999,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 168,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    badge: 'Student Style',
    stock: 25,
    description: 'Heavyweight 320 GSM combed cotton fleece with kangaroo pocket and double-lined drawstring hood. Cozy for early morning lectures.'
  }
];

/**
 * Seed sample products if MongoDB collection is empty
 */
export const seedSampleProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Adding sample products...');
      await Product.insertMany(sampleProducts);
      console.log('Sample products seeded successfully!');
    } else {
      console.log(`Database already contains ${count} product(s). Skipping seed.`);
    }
  } catch (error) {
    console.error(`Error checking/seeding products: ${error.message}`);
  }
};

/**
 * Connect to MongoDB using Mongoose and trigger seed check
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ShopEase';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Automatically seed products if the database is currently empty
    await seedSampleProducts();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Note: Ensure MongoDB is running and MONGO_URI is set correctly in backend/.env');
  }
};
