//Requiring packages
const moongose = require("mongoose");
const Schema = moongose.Schema;

//user -> User id that created the post (User model)
//text -> Text of the post
//name -> Name of the user that created the post
//avatar -> image of the user taht created the post (we want avatar in here because if we delete the account we want to be able to see his posts nonetheless)
//likes -> array of objects. Every object contains the _id of the user that liked the post (referencing to _id of User model). Like = adding a new id object to the
//array of likes. Unlike = deleting some object from the array of id objects.
//comments -> array of objects. Every object has: the user _id (User model), text of post, name & avatar of the commenter, and date of comment.
//date of post.
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = moongose.model("post", PostSchema);
