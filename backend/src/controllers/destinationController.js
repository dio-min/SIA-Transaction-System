const Destination = require("../models/destination");
const asyncHandler = require("express-async-handler");

const createDestination = asyncHandler(async (req, res) => {
  const { destination, location, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  console.log("Upload request body:", req.body);
  console.log("Uploaded file metadata:", req.file);

  const newDestination = new Destination({
    destination,
    location,
    description,
    destinationImage: req.file.path || req.file.secure_url || req.file.url,
  });

  const savedDestination = await newDestination.save();
  res.status(201).json(savedDestination);
});

const getDestination = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().select(
    "destination location description destinationImage rating",
  );

  return res.status(200).json(destinations);
});

const deleteDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Destination ID is required.",
    });
  }

  const destination = await Destination.findById(id);

  if (!destination) {
    return res.status(404).json({
      message: "Destination not found.",
    });
  }

  await destination.deleteOne();

  res.status(200).json({
    message: "Destination deleted successfully.",
  });
});

const updateDestination = asyncHandler(async (req, res) => {
  const { id, destination, location, description } = req.body;
  const imageUrl = req.file ? req.file.path || req.file.secure_url || null : null;

  if (!id) {
    return res.status(400).json({
      message: "Destination ID is required.",
    });
  }

  const updateFields = {};

  if (destination !== undefined) {
    updateFields.destination = destination;
  }

  if (location !== undefined) {
    updateFields.location = location;
  }

  if (description !== undefined) {
    updateFields.description = description;
  }

  if (imageUrl) {
    updateFields.destinationImage = imageUrl;
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No update fields provided." });
  }

  const updatedDestination = await Destination.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true },
  );

  if (!updatedDestination) {
    return res.status(404).json({ message: "Destination not found." });
  }

  res.status(200).json(updatedDestination);
});
  
const rateDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Destination ID is required." });
  }

  const value = Number(rating);
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const destination = await Destination.findById(id);
  if (!destination) {
    return res.status(404).json({ message: "Destination not found." });
  }

  const currentRating = Number(destination.rating || 0);
  const updatedRating = (currentRating + value) / 2;
  destination.rating = Number(updatedRating.toFixed(1));
  await destination.save();

  res.status(200).json(destination);
});

module.exports = { createDestination, getDestination, deleteDestination, updateDestination, rateDestination };
