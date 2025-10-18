import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path  from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};
