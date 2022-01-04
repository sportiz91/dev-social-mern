//Requiring mongoose:
const mongoose = require("mongoose");

//We need to define a new Schema for the collection.
//The are gonna be different properties and methods every document in the collection will have. Apart from the
//fields defined in here, every document will have an _id, which is an ObjectId (easily converted to a real id string).
//Each key in our code blogSchema defines a property in our documents which will be cast to its associated SchemaType.
//Methods needs to be defined after the initial mongoose.Schema.
//Notice above that if a property only requires a type, it can be specified using a shorthand notation
//You can also overwrite Mongoose's default _id with your own _id. Just be careful:
//Mongoose will refuse to save a document that doesn't have an _id, so you're responsible for setting _id if you define your own _id path.
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Every Schema -> Model (gets compiled into a model).
//The first parameter will be the name of the collection. It's important
//to name it with the first letter capitalized, and the singular. Mongoose it's intelligent
//It will be transformed in it's plural form: "users" (see the db in atlas to understand).
//Second parameter is the Schema defined above.
//Finally, we export our User model defined.
//Model = Class = Object Constructor.
module.exports = User = mongoose.model("User", UserSchema);
