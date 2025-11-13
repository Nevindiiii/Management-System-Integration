import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    phone: "+94 763862252",
    gender: "Male",
    department: "IT"
  },
  {
    name: "ABC DEF", 
    email: "abc@gmail.com",
    phone: "+94 763862252",
    gender: "Male",
    department: "HR"
  },
  {
    name: "Nevindi Sadeera Lokuliyanaage",
    email: "nevindi@gmail.com",
    phone: "+94 763862252", 
    gender: "Female",
    department: "Finance"
  }
];

async function addSampleData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Add sample data
    const users = await User.insertMany(sampleUsers);
    console.log(`Added ${users.length} sample users`);
    
    console.log('Sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSampleData();