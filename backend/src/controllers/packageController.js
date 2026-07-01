const mongoose = require('mongoose');
const Package = require('../models/packages');
const Destination = require('../models/destination');
const asyncHandler = require('express-async-handler');

const createPackage = asyncHandler(async (req, res) => {
  const {
    name,
    packageName,
    type,
    description,
    duration_days,
    difficulty_level,
    price,
    max_capacity,
    min_booking_advance_days,
    destination,
  } = req.body;

  const finalPackageName = packageName || name;

  if (
    !finalPackageName ||
    !type ||
    !description ||
    !duration_days ||
    !difficulty_level ||
    !price ||
    !max_capacity ||
    !destination
  ) {
    return res.status(400).json({ message: 'Please provide all required package fields.' });
  }

  if (!mongoose.Types.ObjectId.isValid(destination)) {
    return res.status(400).json({ message: 'Invalid destination ID.' });
  }

  const destinationExists = await Destination.findById(destination);
  if (!destinationExists) {
    return res.status(404).json({ message: 'Destination not found.' });
  }

  const newPackage = new Package({
    packageName: finalPackageName,
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
});

const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find().populate('destination', 'destination location');
  res.status(200).json(packages);
});

const getPackageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Package ID is required.' });
  }

  const packageItem = await Package.findById(id).populate('destination', 'destination location');

  if (!packageItem) {
    return res.status(404).json({ message: 'Package not found.' });
  }

  res.status(200).json(packageItem);
});

const updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    packageName,
    type,
    description,
    duration_days,
    difficulty_level,
    price,
    max_capacity,
    min_booking_advance_days,
    destination,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Package ID is required.' });
  }

  const packageItem = await Package.findById(id);
  if (!packageItem) {
    return res.status(404).json({ message: 'Package not found.' });
  }

  if (destination) {
    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return res.status(400).json({ message: 'Invalid destination ID.' });
    }

    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({ message: 'Destination not found.' });
    }
  }

  const updateData = {};
  if (packageName || name) updateData.packageName = packageName || name;
  if (type !== undefined) updateData.type = type;
  if (description !== undefined) updateData.description = description;
  if (duration_days !== undefined) updateData.duration_days = duration_days;
  if (difficulty_level !== undefined) updateData.difficulty_level = difficulty_level;
  if (price !== undefined) updateData.price = price;
  if (max_capacity !== undefined) updateData.max_capacity = max_capacity;
  if (min_booking_advance_days !== undefined) updateData.min_booking_advance_days = min_booking_advance_days;
  if (destination !== undefined) updateData.destination = destination;

  const updatedPackage = await Package.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('destination', 'destination location');

  res.status(200).json(updatedPackage);
});

const deletePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Package ID is required.' });
  }

  const packageItem = await Package.findById(id);
  if (!packageItem) {
    return res.status(404).json({ message: 'Package not found.' });
  }

  await packageItem.deleteOne();

  res.status(200).json({ message: 'Package deleted successfully.' });
});

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};

