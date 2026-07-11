const express= require('express');
const router = express.Router();

const { registerUser, loginUser, getUserById, getAllUsers, deleteUser } = require('../controllers/userController');

// Register a new user
router.post('/register', registerUser);
router.post("/login", loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;