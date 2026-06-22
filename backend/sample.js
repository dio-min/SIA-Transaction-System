
const mongoose = require('mongoose');
const Destination = require('./src/models/destination');
const connectDB = require('./src/database/database');
const dotenv = require('dotenv');
const User = require('./src/models/user');
dotenv.config();

const destinations = [
  {
    destination: 'Eiffel Tower',
    location: 'Paris, France',
    description: 'An iconic symbol of France, the Eiffel Tower offers stunning views of Paris and is a must-visit landmark.',
    destinationImage: 'https://lh3.googleusercontent.com/grass-cs/ANxoTn0pqF8eCCz9zzJxkIHEvWb_YgcN1wFXYf6EfEji8cY8dHO-TpLkL46KNfzHaHjBkCK2QjJ7-MyRzGlVlsmmogYKmagW_9D8-Mf6GsUmYeYKGkt32mJDgKu9XzPIpQ3v90nCwoae0g=w270-h312-n-k-no',
  }
  
];

async function sample() {
  try {
    connectDB();
    console.log('Connected to MongoDB');

  
    await Destination.deleteMany({});
    console.log('Cleared existing data');

    // Insert destinations
    await Destination.insertMany(destinations);
    console.log(`Seeded ${destinations.length} destinations`);



    const user = new User({
      username: 'testuser',
      email: 'sample@email.com',
      password: 'password123',
    });
    await user.save();
    console.log('Seeded 1 user');
    

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

sample();
