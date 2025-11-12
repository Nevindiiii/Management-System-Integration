import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data matching your MongoDB Compass screenshot
const sampleUsers = [
  {
    id: 1,
    firstName: "Nevindi",
    lastName: "Sadeera Lokullyanage",
    age: 25,
    email: "nevindi.sadeera@gmail.com",
    phone: "+94763862252",
    birthDate: new Date("1979-09-17")
  },
  {
    id: 2,
    firstName: "Dulran",
    lastName: "Hinduwaara",
    age: 28,
    email: "dulran.hinduwaara@gmail.com",
    phone: "+94763862252",
    birthDate: new Date("2007-12-12")
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