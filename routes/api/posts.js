const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Posts");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route    POST api/posts
//@desc     Create a post
//@access   Private
//The create a new post is gonna be a private route. Only registered users can create posts.
//We are gonna have the name and the avatar associated with the post, but that's gonna come from a different
//GET Request we are doing later. So, name and avatar is not gonna be something we are sending in the create new post POST Request.
//However, the text of the post is gonna be mandatory.
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newObj = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      const newPost = new Post(newObj);

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
//In the previous route, we added the functionality to add a new Post. Now, we want to fetch the posts.
//Originally we made this route Public, but we can't see the posts unless we are logged in, so let's make it private. It's up to you.
//But the way we are building the Front-End -> you must be logged in to see the posts. Profiles are public but posts not.
//The main reason behind signing up to the Dev Social Network is to communicate with other Developers.
router.get("/", auth, async (req, res) => {
  try {
    //This sort functionality sorts the posts from the most recent to the oldest.
    //Default: from the latest.
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    GET api/posts/:id
//@desc     Get post by id
//@access   Private
//In this case, we are having the same issue that we got when getting a profile.
//If they route the user passes is not a valid ObjectId, then, the catch part is gonna be executed.
//So, in the catch part, if the users enters a route which has an invalid ObjectId (err.kind === "ObjectId")
//Then we are passing the same error -> Post not found. In every other case, we have a server error.
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server error");
  }
});

//@route    DELETE api/posts/:id
//@desc     Delete a post
//@access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Handle if the post not exists:
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //In this case, we want to make sure that the user that's deleting the post is the user that owns the post.
    //if we do like -> if (post.user !== req.user.id) -> req.user.id is a string and post.user is an ObjectId. So we have
    //to use the toString() in order to convert the ObjectId object in a string.
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server error");
  }
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
//When the user hits like on the Front-End, that user is gonna be added to the likes array.
//We need to know the id for the post being liked.
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //Check if the post has been already liked by the user.
    //If the length of the new array is grater than 0, it means the post has been already liked by the user.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server error");
  }
});

//@route    PUT api/posts/unlike/:id
//@desc     Unlike a post
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //If the length of the array === 0, means we haven't liked the post yet. So, we cannot unlike.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post not liked" });
    }

    //Get remove index:
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(500).send("Server error");
  }
});

//@route    POST api/posts/comment/:id
//@desc     Comment a post
//@access   Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete a comment
//@access   Private
//In this case, we need to find the post by id, and then, we need to know the comment to delete by id too.
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //1. Get the post:
    const post = await Post.findById(req.params.id);

    //2. Pull out the comment:
    //The find method from moongose accepts an object or an ObjectId as parameters. In this case, we are passing
    //an arrow function which iterates over every comment and returns the comment whose id matches the comment_id
    //route passed by the user. In this case, the elements of the comments arrays are objects, so we are returning an object.
    //This will give us either the comment, if it exists, or false.
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //3. Make sure the comment exists:
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    //4. Checking if user trying to delete the comment is actually the user who made the comment:
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Get remove index:
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Exportamos el módulo.
module.exports = router;
