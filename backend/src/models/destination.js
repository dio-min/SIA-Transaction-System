const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    destinationImage: {
        type: String,
    },
    rating:{
        type:Number,
        default: 0
    }
});
const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;