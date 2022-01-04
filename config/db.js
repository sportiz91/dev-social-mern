//Config folder: contains the json with config files and the script to connect to mongo atlas db.
//In this case, we will see a default.json & production.json which is the same file, because production db and
//Development db is the same.
//This script connects the whole app to the db.
//Requiring packages
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI"); //once you required the config package, then you can use the .get method and determining between brackets the value you wanna import.

//Connecting to the server. Because we want a function to use in server.js to connect to the server, we need a function in here.
//it's an async function because the return value will be a promise. Inside the function we are running the mongoose.connect, but we wanna put it inside a try catch.
//If there's some error, we can catch it.
//When we use async await syntax, mostly we are wrapping it inside a try catch block.
//Mongoose.connect() method returns a promise.
//The connect() function also accepts a callback parameter and returns a promise.
//mongoose.connect(uri, options, function(error) {
// Check error in initial connection. There is no 2nd param to the callback.
//});
const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err.message); //the error object that we pass to the catch block has a message property.
    process.exit(1); //This will exit the process with failure.
  }
};

//The last thing we want to do is export the module which we want to use in another module.
module.exports = connectDB;
