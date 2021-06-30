//This is the file where we will use mongoose to connect to our database.
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//we have got this mongoURI  config/default.json.
//this mongoURI is a link we get to connect database to mongoDB.
//After createing a cluster, whilelisting our IP and connecting our cluster, we get this link to connect out app to mongoDB.
//using that link only, we are connecting mongoDB to our application.

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

//Default.json is for global variables present to the whole project.
