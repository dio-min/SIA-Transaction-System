const express= require('express');
const router = express.Router();

const { registerUser, loginUser, getUserById, updateUserProfile } = require('../controllers/userController');

// Register a new user
router.post('/register', registerUser);
router.post("/login", loginUser);
router.get('/:id', getUserById);
router.put('/:id/profile', updateUserProfile);
module.exports = router;