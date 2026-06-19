const mongoose = require('mongoose');



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');

    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);

        if (error.code === 8000) {
            console.error('Wrong database credentials');
        } else if (error.code === 'ENOTFOUND') {
            console.error('Could not reach database server');
        }
        process.exit(1);
    }
};

module.exports = connectDB;