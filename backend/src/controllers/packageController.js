const mongoose = require('mongoose');
const Package = require('../models/packages');
const Destination = require('../models/destination');
const asyncHandler = require('express-async-handler');

const normalizeDestinationIds = (destination) => {
  if (Array.isArray(destination)) {
    return destination.filter(Boolean);
  }

  if (destination === undefined || destination === null || destination === '') {
    return [];
  }

  return [destination];
};

const validateDestinationIds = async (destinationIds, res) => {
  if (destinationIds.length < 1) {
    res.status(400).json({ message: 'Please select at least 1 destination.' });
    return false;
  }

  for (const destinationId of destinationIds) {
    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
      res.status(400).json({ message: 'Invalid destination ID.' });
      return false;
    }

    const destinationExists = await Destination.findById(destinationId);
    if (!destinationExists) {
      res.status(404).json({ message: 'Destination not found.' });
      return false;
    }
  }

  return true;
};

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
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  console.log("Upload request body:", req.body);
  console.log("Uploaded file metadata:", req.file);

  const finalPackageName = packageName || name;
  const destinationIds = normalizeDestinationIds(destination);

  if (
    !finalPackageName ||
    !type ||
    !description ||
    !duration_days ||
    !difficulty_level ||
    !price ||
    !max_capacity ||
    !destinationIds.length
  ) {
    return res.status(400).json({ message: 'Please provide all required package fields.' });
  }

  const destinationsAreValid = await validateDestinationIds(destinationIds, res);
  if (!destinationsAreValid) {
    return;
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
    destination: destinationIds,
    packageImage: req.file.path || req.file.secure_url || req.file.url,
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

  const destinationIds = destination !== undefined ? normalizeDestinationIds(destination) : undefined;

  if (destinationIds !== undefined) {
    if (destinationIds.length > 0) {
      const destinationsAreValid = await validateDestinationIds(destinationIds, res);
      if (!destinationsAreValid) {
        return;
      }
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
  if (destinationIds !== undefined && destinationIds.length > 0) {
    updateData.destination = destinationIds;
  } else if (destination !== undefined) {
    updateData.destination = packageItem.destination;
  }
  if (req.file) {
    updateData.packageImage = req.file.path || req.file.secure_url || req.file.url;
  }

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

