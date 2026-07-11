const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const axios = require('axios');

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists');
    }   
    // Create new user
    const newUser = new User({
        username,
        email,
        password,
        role: role || 'traveler', // In production, make sure to hash the password before saving
    });

    const savedUser = await newUser.save();
    try {
        axios.post(`${process.env.ADMIN_URL}/api/notify`, {
          system: "tourism",
        });
      } catch (err) {
        console.error("Failed to send notification:", err.message);
      }
    res.status(201).json(savedUser);
});




const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;

  const filter = {};
  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.status(200).json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.deleteOne();
  res.status(200).json({ message: 'User deleted successfully' });
});





module.exports = { registerUser, loginUser, getUserById, getAllUsers, deleteUser };