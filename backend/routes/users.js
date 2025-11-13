import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      firstName: user.name ? user.name.split(' ')[0] : '',
      lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
      age: 25, // Default age since not in MongoDB
      email: user.email,
      phone: user.phone || '',
      birthDate: null // Not available in current data
    }));
    
    res.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load users.',
      error: error.message
    });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      id: user._id,
      firstName: user.name ? user.name.split(' ')[0] : '',
      lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
      age: 25,
      email: user.email,
      phone: user.phone || '',
      birthDate: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load user details.',
      error: error.message
    });
  }
});

// POST create new user
router.post('/add', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, department } = req.body;
    
    if (!firstName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    const newUser = new User({
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      phone: phone || '',
      gender: gender || 'Male',
      department: department || 'IT'
    });
    
    const savedUser = await newUser.save();
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      id: savedUser._id,
      firstName: savedUser.name.split(' ')[0],
      lastName: savedUser.name.split(' ').slice(1).join(' '),
      age: 25,
      email: savedUser.email,
      phone: savedUser.phone,
      birthDate: null
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Unable to create user',
        error: error.message
      });
    }
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, department } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: `${firstName} ${lastName || ''}`.trim(),
        email,
        phone: phone || '',
        gender: gender || 'Male',
        department: department || 'IT'
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      id: updatedUser._id,
      firstName: updatedUser.name.split(' ')[0],
      lastName: updatedUser.name.split(' ').slice(1).join(' '),
      age: 25,
      email: updatedUser.email,
      phone: updatedUser.phone,
      birthDate: null
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Unable to update user',
        error: error.message
      });
    }
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: `User ${deletedUser.name} has been deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to delete user',
      error: error.message
    });
  }
});

export default router;