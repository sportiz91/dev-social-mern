//Requiring packages
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI"); //once you required the config package, then you can use the .get method and determining between brackets the value you wanna import.

//Connecting to the server. Because we want a function to hit in server.js to connect to the server, we need a function in here.
//it's an async function because the return value will be a promise. Inside the function we are running the mongoose.connect, but we wanna put it inside a try catch.
//If there's some error, we can catch it.
//When we use async await syntax, mostly we are wrapping it inside a try catch block.
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err.message); //the error object that we pass to the catch block has a message property.
    process.exit(1); //This will exit the process with failure.
  }
};

//The last thing we want to do is export the module which we want to use in another module.
module.exports = connectDB;
