const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');



const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error("Upload error details:", err); // log the FULL error object
    return res.status(400).json({ message: err.message || "File upload error" });
  }
  next();
};
// Create a new package
router.post('/createPackage', upload.single('packageImage'), handleUploadError, createPackage);
// Get all packages
router.get('/getAllPackages', getAllPackages);
router.get('/:id', getPackageById);
router.put('/:id', upload.single('packageImage'), handleUploadError, updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;