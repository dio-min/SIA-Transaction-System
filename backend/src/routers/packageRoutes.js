const express = require('express');
const router = express.Router();

const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');

// Create a new package
router.post('/createPackage', createPackage);
// Get all packages
router.get('/getAllPackages', getAllPackages);
router.get('/:id', getPackageById);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;