import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [100, 'Name must be less than 100 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false
  },
  department: {
    type: String,
    required: false,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    match: [/^(\+\d{1,3}[- ]?)?\(?\d{1,4}\)?[- ]?\d{1,4}[- ]?\d{1,9}$/, 'Please enter a valid phone number']
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');

export default User;