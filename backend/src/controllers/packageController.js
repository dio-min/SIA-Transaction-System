const Package = require('../models/packages');
const asyncHandler = require('express-async-handler');

const createPackage = asyncHandler(async (req, res) => {
    const { name, type, description, duration_days, difficulty_level, price, max_capacity, min_booking_advance_days, destination } = req.body;

    const newPackage = new Package({
        packageName: name,
        type,
        description,
        duration_days,
        difficulty_level,
        price,
        max_capacity,
        min_booking_advance_days,
        destination,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
}
);

const getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find().populate('destination');
    res.json(packages);
});

module.exports = {
    createPackage,
    getAllPackages,
};

