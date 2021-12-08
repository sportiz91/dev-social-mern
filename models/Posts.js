//Requiring packages
const moongose = require("mongoose");
const Schema = moongose.Schema;

//name -> not the name of the post. The name of the user that created the post.
//I want to have the option to NOT delete posts if you don't want to. If the users deletes his account, I want
//To have the option to not delete the posts if I want to just keep it.
//So, it's easier if we have the avatar in here that shows his name and we don't have to dig in the users collection.
//We are gonna have a system to like and remove your like.  So, we are going to create an array of likes of certain post.
//And the array of likes it's gonna have the users that liked the post in different objects. Because the user is of type:
//Schema.Types.ObjectId, we can reference the user in the user DB to identify it. Furthermore, because we identified users with
//His ids, one user can only like the post once. He can't be clicking again and again to like more than once.
//We are doing the same with comments. In the comments we not only have the user that commented, but the text, name & avatar and date of comment too.
//As the last field of the post, we want the date of the post.
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
