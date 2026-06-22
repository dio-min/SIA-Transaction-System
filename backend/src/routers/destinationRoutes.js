const express= require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createDestination } = require('../controllers/destinationController');

const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || "File upload error" });
  }
  next();
};

// Create a new destination

router.post('/createDestination', upload.single('image'), handleUploadError, createDestination);

module.exports = router;

