const Destination = require('../models/destination');
const asyncHandler = require('express-async-handler');


const createDestination = asyncHandler(async (req, res) => {
    const { destination, location, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    console.log('Upload request body:', req.body);
    console.log('Uploaded file metadata:', req.file);

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
        "destination location destinationImage rating"
    );

    return res.status(200).json(destinations);

})

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

// const updateDestination = asyncHandler(async (req, res)=>{
//     const { id } = req.params;

//     if (!id) {
//     return res.status(400).json({
//       message: "Destination ID is required.",
//     });
//   }
//    const destination = await Destination.findByIdAndUpdate(id);


// });


module.exports = { createDestination, getDestination, deleteDestination };