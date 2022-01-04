//Requiring modules:
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

//@route    POST api/users
//@desc     Register User
//@access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //If we arrive to this stage (if statement above didn't get executed), we have to register the user. In order to do that we have to:

    // console.log(req.body);
    //This is an example of the req.body object (in this case, we are parsing JSON data sent as the body):
    // {
    //   name: "Santoneta Cósmica",
    //   email: "cosmicsantoneta@gmail.com",
    //   password: "123456789"
    // }

    const { name, email, password } = req.body; //we want info in the post body to be in separate variables.

    try {
      //1. See if the user exists in the DB (we don't want duplicate emails)

      //Model.findOne({email: "something..."}) But because we have that email ="something@..." from the desestructuring above,
      //We can make only email. Email key get's passed email variable in this case.
      let user = await User.findOne({ email });

      //If user exists, then we need to display an error, because we don't duplicate users.
      //Important! Only in the last res.json or res.send you can omit the return before.
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] }); //errors needs to match the same format as errors.array from validationResult.
      }

      //2. If the user is not found, we want to get his gravatar (which is gonna be part of his profile).
      //Gravatar functioning: pass user email into a method and that gonna get our profile pic.
      //s -> size (default size); r -> rating (pg -> we can't get naked ppl for example!!!!!)
      //d gives you a default image (like a user icon). You can do for example -> d: "404" (which gives us a found not error if no gravatar was detected).
      //But mm gives us something even if the user has no gravatar.
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      //We create a new instance of the User model, so called "a document".
      //This doesn't save the user in the DB. It only creates an instance. We need to user.save() in order to save the instance in the DB.
      //So... Before saving the User instance in the DB, we wanna encrypt the password using bcrypt.
      //Remember, user model have the following fields: name, email, avatar, password, date. In this case, we are not passing the
      //date, so default value (now) gonna be used to create the new instance/document.
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //3. Encrypt password using bcrypt
      //Before encrypting the password, we need to create a salt to do the hashing with.
      //Everything that returns a promise you should put it with await. If we didn't used async await syntax here, we would
      //Need to do something like: bcrypt.genSalt(10).then(bcrypt.hash(password, salt)).then() ... and goes on.
      const salt = await bcrypt.genSalt(10); //The more rounds you do, the more secure. 10 rounds are recommended by docs.

      //Takes as first parameter the plain text password written by the user.
      //As second parameter we get the salt Rounds.
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //This will gives us a promise. Then, we can use the promise to consume the data later on, when we create the payload in the request.

      //4. Return jsonwebtoken. We want to return jsonwebtoken because we want immediate login when a new user registers. In order to get immediately logged in, we
      //need the token.

      //We want to create the payload. Aclaration: in mongoDB, the field is "_id". But mongoose has an abstraction to call id = _id.
      const payload = {
        user: {
          id: user.id,
        },
      };

      //For signing the message, the first parameter is the data and the second parameter is a "secret".
      //We can load this secret from the config file.
      //The third argument of the signature is an object with options. expiresIn set the quantity of seconds before the token expires.
      //In this case are 360.000s. In production we want to be 3600s which is an hour. But in development, I don't want the token to expires so fast.
      //So, when we deploy and runs our App in production we will set the expires to 3600 (1 hour).
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //The response of the server for a new User Registering is the token.
          //This token is what we can send in the header of the login functionality to access the private routes.
        }
      );
    } catch (err) {
      //If something goes wrong, it's an error server.
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//Exporting module.
module.exports = router;
