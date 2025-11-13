import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data matching your MongoDB Compass screenshot
const sampleUsers = [
  {
    name: "Nevindi Sadeera Lokullyanage",
    email: "nevindi.sadeera@gmail.com",
    phone: "+94763862252",
    gender: "Female",
    department: "IT"
  },
  {
    name: "Dulran Hinduwaara",
    email: "dulran.hinduwaara@gmail.com",
    phone: "+94763862252",
    gender: "Male",
    department: "Engineering"
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+94771234567",
    gender: "Male",
    department: "Marketing"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+94779876543",
    gender: "Female",
    department: "HR"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`Inserted ${insertedUsers.length} users:`);
    insertedUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id})`);
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();