//IMPORTANT: just by using the auth middleware created previously, we then have a protected route.
//This Route is gonna return us the users data.

//Requiring modules:
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route    GET api/auth
//@desc     Get user info
//@access   Public
router.get("/", auth, async (req, res) => {
  //The try catch is because we are going to make a call to our DB in order to get the users data.
  try {
    const user = await User.findById(req.user.id).select("-password"); //select is aka the projection (second parameter of findById). In this case, we are using string syntax.
    //In the case I want to exclude more than one field I would separate the fields with a blank space: .select("-password -email")
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/auth
//@desc     Authenticate user & get token
//@access   Public
//Validation: because we are dealing with a login, we are not gonna validate a name (or send a name). Only email and password. That's what we need to validate.
//On the password field, we don't want to check the length field. We want to check if it exists (if the user send a password, later on we would check if it matches
//the correct password).
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //If there's no user that matches the email sent along with the post request, then we have to send an error.
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //bcrypt has a method called compare, which takes a plain text password and an encrypted password. Then it compares them and tells if there's a match or not.
      //Compare returns a promise.
      //password argument is the plain text password the user entered.
      //second parameter is the encrypted password which we can get from the user in the db.
      //IMPORTANT! -> wheter there is no user, or the password is invalid, it's smarter to show the same error message. If we do like: "invalid user / invalid password"
      //Then a hacker could see if some user exists or not in the db, and that poses a security risk.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
