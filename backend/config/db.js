import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopease';
  
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log(' Note: Ensure MongoDB is running locally or provide a valid MONGO_URI in .env');
  }
};
