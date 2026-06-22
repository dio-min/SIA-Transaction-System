const express = require('express');
const router = express.Router();

const { createPackage, getAllPackages } = require('../controllers/packageController');

// Create a new package
router.post('/createPackage', createPackage);
// Get all packages
router.get('/getAllPackages', getAllPackages);

module.exports = router;