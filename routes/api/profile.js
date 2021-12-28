const express = require("express");
const axios = require("axios");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

//Models:
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Posts");

//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private
//the api/profile is inteded to get all the profiles from people who registered and created a profile.
//this route, on the other hand, only displays my current profile. We're getting the profile based on the user id which is in the token.
//It's obvious that this route is private because we are getting the user profile based on the id which is on the token.
//So we have to bring the auth middleware
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    ); //If we logged in successfully and we have the token, we have a req.user created.

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/profile
//@desc     Create or update user profile
//@access   Private
//In this case, we want to use 2 middlewares (auth + validation). So, [auth, [check, check]]
//This route is not taking education or experience. We are going to create separate routes or endpoints for that info.
//This route can be used for both adding new profiles, as well as updating profiles.
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //When it comes to skills, we need to turn that into an array.
    //The input from the POST Request is going to come in the form of a "Comma Separated List" (which can have lot of spaces between commas).
    //Example: "HTML, CSS, JavaScript,PHP,Ruby"
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Build social object:
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //Now we have all these properties inside this profileFields, we are ready to update and insert the data in mongoDB:
    //Remember, the user in the Profile model is the ObjectId class and we can match that we the user id that comes from the access token.
    //Since we are using an async function, every time we use a mongoose query, we need to put the await before because it returns a "promise"
    //(Not a real promise, read the docs to see the difference, but acts as a promise!)
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      //If the query operation returns a document, means that we have a document to update.
      //$set structure:
      //{$set: {field1: value1, field2: value2, ...}}
      //So, in this case, we have the correct syntax: profile fields is: {company: ..., website: ..., ...}
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //If the profile is not found, that means we have to create a new profile asociated with the user:
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message); //console.error() can have a string or an object as argument. What goes inside is passed as an error in Chrome Developer Tools.
      //In this case, we are pointing to the message property of the err object. So, it's an string.
      res.status(500).send("Server error");
    }
  }
);

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public
//With the react extension, we have a shortcut for try catch syntax. Try writting "trycatch" + TAB.
//Apart from the profile, I would like to add the name and the avatar, which are part of the User model. So we have to populate.
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public
//The :user_id is a placeholder. Meaning that is gonna be an object with the ID the users GET Request is doing.
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    //This scenario gets executed in the case the user inputs a valid ObjectId that don't match with any document in our DB.
    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    //This err contains the mongoose error object. The mongoose error objct has 4 properties: message, kind, path & value.
    console.error(err.message); //err.message -> prints the message. In this case: "Cast to ObjectId failed..." -> that's because the user input placeholder needs
    //to be a valid ObjectId.
    console.error(err.kind); //err.kind, in this case, is ObjectId.
    console.error(err.path); //err.path is user (the Profile model property that is getting checked). Remember -> Mongoose has several built-in and "automatic" validators.
    //All SchemaTypes, for example, have the built-in required validator. The required validator uses the SchemaType's checkRequired() function to determine if the value
    //satisfies the required validator. In this particular case, when the user does the GET Request inputting the :user_id placeholder, mongoose has to check if that id
    //is an ObjectId, in order to make the Profile.findOne later on.
    console.error(err.value); //err.value will contain info about the :user_id entered by the user.

    //This scenario gets executed when we don't have an ObjectId as the :user_id inputed by the user.
    //Example: api/profile/user/1 -> is not an ObjectId. But, for example: 61ae4732df88c4ed633f659e (is a valid ObjectId that matches with a document in the DB).
    //But, if we change the last part of the request to: 61ae4732df88c4ed633f659F -> that is an ObjectId, but does not matches with a document of the DB.
    //We want the same error message in both cases: if the user enters an invalid ObjectId, or if the user enters a valid ObjectId that don't matches with any doc in the db.
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server error");
  }
});

//@route    DELETE api/profile
//@desc     Delete profile, user & posts
//@access   Private
router.delete("/", auth, async (req, res) => {
  try {
    //Remove users posts -> this is neccesary to be done before user gets deleted.
    await Post.deleteMany({ user: req.user.id });

    //Remove profile:
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove user:
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private
//In this case we are updating some user's profile in order to add experience. Experience is like a separate resource compared to the most basic profile data
//Which is what we handled in the POST Request of "Create or Update a profile". Some can argue that this can be a POST Request too. In fact, it would work,
//but because we are updating a profile, we should use a PUT Request in order to have a cleaner API that other ppl can understand easily.
//We need some validation here. In the front-end in React, we are gonna have a form here to add experience.
//So, in this case, title, company and from date is all gonna be required to add the experience (minimum fields in order to pass the validation).
//Please note that when we make a PUT Request an add some new Experience to an existing user's profile, then, the experience object just added to the array
//of experiences, gonna have it's unique id, which is pretty cool.
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    //In this case, because we have desestructured in title = ...
    //We can make in the below object only title, instead of title: ...
    //Basically, we first desestructure, and then we save everything in a newExp object.
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    //Because this is a private route, we can find the profile by matching the user Object Id document with the req.user.id that is sent along with the header of the request.
    //In the Profile model we defined experience field as an array, so we can push elements into it. Unshift() is the same as push that push it to the beggining instead of
    //pushing to the end.
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        "user",
        ["name", "email"]
      );

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete experience from profile.
//@access   Private
//In order to DELETE an experience, we are going to need to unique id of the experience provided.
//This request could be technically a PUT Request too, since we are updating our profile (experience). But... Since
//Something is actually being removed, it's preferred to make it a DELETE Req.
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    //1. We get the profile whose experience we are going to delete.
    const profile = await Profile.findOne({ user: req.user.id });

    //2. Get remove index. This is the same as matching the :exp_id with the item id that the mapping is itering.
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    //at index removeIndex, remove 1 item. This method overwrites the original array.
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.send(500).send("Server error");
  }
});

//@route    PUT api/profile/education
//@desc     Add profile education
//@access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        "user",
        ["name", "email"]
      );

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from profile.
//@access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    //1. We get the profile whose experience we are going to delete.
    const profile = await Profile.findOne({ user: req.user.id });

    //2. Get remove index. This is the same as matching the :exp_id with the item id that the mapping is itering.
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    //at index removeIndex, remove 1 item. This method overwrites the original array.
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.send(500).send("Server error");
  }
});

//@route    GET api/profile/github/:username
//@desc     Get user repos from GitHub.
//@access   Public
//In the uri, we will sort the results by created date, in ascending order. We are gonna bring only 5 repos per page.
router.get("/github/:username", async (req, res) => {
  try {
    const uri = `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created&client_id=${config.get(
      "githubClientId"
    )}&client_secret=${config.get("githubSecret")}`;

    // console.log(uri);

    const response = await axios.get(uri);

    res.json(response.data);
  } catch (err) {
    if (err.response.status === 404) {
      res.status(404).json({ msg: "GitHub profile not found" });
    }

    res.status(500).send("Server error");
  }
});

module.exports = router;
