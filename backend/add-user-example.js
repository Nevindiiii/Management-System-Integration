// Example script to add a new user via API
import fetch from 'node-fetch';

const newUser = {
  firstName: "John",
  lastName: "Doe", 
  email: "john.doe@example.com",
  phone: "+94771234567",
  gender: "Male",
  department: "Engineering"
};

async function addUser() {
  try {
    const response = await fetch('http://localhost:5000/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });
    
    const result = await response.json();
    console.log('User added:', result);
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

addUser();