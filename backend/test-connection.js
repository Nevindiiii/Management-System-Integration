import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGO_URI?.replace(/\/\/.*@/, '//***:***@'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });