const express= require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createDestination } = require('../controllers/destinationController');

const handleUploadError = (err, req, res, next) => {
    if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ message: err.message });
    }
    next();
};

router.post('/addDestinations', upload.single('destinationImage'), handleUploadError, createDestination);


module.exports = router;