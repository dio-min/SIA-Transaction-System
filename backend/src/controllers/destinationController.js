const Destination = require('../models/destination');
const asyncHandler = require('express-async-handler');


const createDestination = asyncHandler(async (req, res) => {
    const { destination, location, description } = req.body;

    
    const newDestination = new Destination({
        destination,
        location,
        description,
        destinationImage: req.file ? (req.file.path || req.file.secure_url || req.file.url) : undefined,
    });

    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
});

module.exports = { createDestination };