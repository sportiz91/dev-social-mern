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
//@desc     Get user info (Get Auth User)
//@access   Private
//In this case we have 2 middlewares, separated by commas. First is auth middleware, second one is callback.
router.get("/", auth, async (req, res) => {
  //The try catch is because we are going to make a call to our DB in order to get the users data.
  try {
    //We get the req.user.id that we can use from the auth middleware. If no token is provided, this will fail in the middleware (or if wrong token is provided)
    //Model.findById(id, projection, options, callback).
    //Every query returns a query object. A mongoose query object can be executed in two ways: if you pass the callback, or if you .exec() later on.
    //A query has a .then() that can be used as a promise.
    //All callbacks in mongoose use the same pattern: callback(err, result). If we define the callback we execute the query and then pass the result to the callback.
    const user = await User.findById(req.user.id).select("-password"); //select is aka the projection (second parameter of findById). In this case, we are using string syntax.
    //In the case I want to exclude more than one field I would separate the fields with a blank space: .select("-password -email")

    // console.log(user); This will return the document object with every field but the password.

    res.json(user); //the user object document that we get from the query, gets jsonfied and passed as the response from the server.
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/auth
//@desc     Authenticate user & get token (Login User)
//@access   Public
//Validation: only email and password.
//On the password field, we don't want to check the length field. We want to check if it exists (if the user send a password, later on we would check if it matches
//the correct password).
//In this case, we don't have middleware function separated by commas as in the case of router.get("/"). We have an array of middleware, which is the same.
//check method of express-validator allows us to define error messages. By default, express-validator returns the error "invalid value", but we wan't to be more
//Specific.
//check(field, "error msg")
//validationResult(req) -> takes the request object as parameter. Returns a result object.
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // console.log(errors);
    //errors will be the following result object:
    // Result {
    //     formatter: [Function: formatter],
    //     errors: [
    //       {
    //         value: undefined,
    //         msg: 'Please include a valid email',
    //         param: 'email',
    //         location: 'body'
    //       },
    //       {
    //         value: undefined,
    //         msg: 'Password is required',
    //         param: 'password',
    //         location: 'body'
    //       }
    //     ]
    //   }
    //As you can see, errors.array() gives us the error array which contain objects with value, msg, param and location properties.

    //if errors array is not empty, then server responds with the array of object errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.body); This console log returns:
    // {
    //   email: xxx,
    //   password: xxx
    // }

    //Desestructiring email and password from req.body object.
    //Important, if no express.json defined, server won't be able to read the req.body.
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //If there's no user that matches the email sent along with the post request, then we have to send an error.
      //Important -> in order to be congruent with the validationResult(req) errors array, we send an object with property errors
      //which contains an array of objects with the errors.
      //This gets executed when the email is not found on the db.
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
      //password is a plain text password. In this case, it comes from the password the user typed. If user is found on the db (because email matches),
      //then, user.password should contain the encrypted password, which gets unencrypted and compared with plain password the user entered on the ui.
      const isMatch = await bcrypt.compare(password, user.password);

      //If password typed not match with desenctypted password from db, then this gets executed.
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //At this stage, we passed errors: email not found on db, password user typed not the same as unencrypted db password.

      // console.log(user.id); this returns as the document id as a string
      // console.log(user._id); this returns as the document id as an ObjectId

      const payload = {
        user: {
          id: user.id,
        },
      };

      // console.log(payload);

      //first parameter -> payload, second parameter -> secret, third parameter -> options object, fourth parameter -> callback.
      //(Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
      //(Synchronous) Returns the JsonWebToken as string
      //payload could be an object literal, buffer or string representing valid JSON.
      //secretOrPrivateKey is a string, buffer, or object
      //The server responds with the error or with the token.
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
