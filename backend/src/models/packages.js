const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration_days: {
      type: String,
      required: true,
    },
    difficulty_level: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    max_capacity: {
      type: Number,
      required: true,
    },
    min_booking_advance_days: {
      type: Number,
      required: true,
      default: 0,
    },
    destination: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Destination",
        },
      ],
      required: true,
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length >= 1;
        },
        message: "Please select at least 1 destination.",
      },
    },
    packageImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
