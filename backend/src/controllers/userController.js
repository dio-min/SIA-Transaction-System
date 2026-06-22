const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
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
        password, // In production, make sure to hash the password before saving
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
});

module.exports = { registerUser };