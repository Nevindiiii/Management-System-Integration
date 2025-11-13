import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function addNewUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const newUser = new User({
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com", 
      phone: "+94712345678",
      gender: "Female",
      department: "Finance"
    });

    const savedUser = await newUser.save();
    console.log('New user added:', savedUser);
    
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addNewUser();