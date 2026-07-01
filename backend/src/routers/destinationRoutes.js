const express= require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createDestination, deleteDestination, updateDestination, getDestination, rateDestination } = require('../controllers/destinationController');


const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error("Upload error details:", err); // log the FULL error object
    return res.status(400).json({ message: err.message || "File upload error" });
  }
  next();
};

// Create a new destination

router.post('/createDestination', upload.single('image'), handleUploadError, createDestination);
router.get('/getDestination', getDestination);
router.delete('/:id', deleteDestination);
router.put('/updateDestination', upload.single('image'), handleUploadError, updateDestination);
router.post('/:id/rate', rateDestination);

module.exports = router;

