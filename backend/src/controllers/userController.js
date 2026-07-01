const User = require('../models/user');
const asyncHandler = require('express-async-handler');

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



module.exports = { registerUser, loginUser };