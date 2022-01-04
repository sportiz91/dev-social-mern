//Requiring packages:
const jwt = require("jsonwebtoken");
const config = require("config"); //We are gonna need the secret, that's why we are requiring config too.

//Exporting module:
module.exports = function (req, res, next) {
  //1. GET the token from the header:

  // console.log(req.header); //this console log [Function:header] because we have a function
  // console.log(req.header("x-auth-token")); //this console.log the actual token
  // console.log(req.get("x-auth-token")); //this console.log the actual token. As you can see, req.get() = req.header() (both functions
  //That get the field of the header to be taken as string parameter)

  //req.get but it's aliased to req.header("field")
  const token = req.header("x-auth-token"); //This is the header key which we want to send the token along to.

  //2. Check if no token is present: if no token is present on the request, then we would send a not authorized error (401).
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //3. If there is token, then verify:
  //We need to decode the token that is sent along with the request. That can be done with jwt.verify. Jwt.verify(token, secret, {options}, (err, token) => {...})
  //If we pass a callback function, verify is called asynchronously.
  //In this case, because we are not passing a callback function as an argument, we are decoding the token synchronously.
  //Once we decoded the token, we need to asign a value to the user
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); //return value of jwt.verify will be an object with the payload.
    // console.log(decoded);
    // console.log(decoded.user);

    req.user = decoded.user; //req.user will get the decoded.user object property.

    //The decoded.user property is only the user object of the payload.
    //In this case, req.user it's a new property that we are defining with the user object.

    // The structure of the payload is:
    // const payload = {
    //     user: {
    //       id: user.id,
    //     },
    //     iat: 78923789432,
    //     exp: 34020290,
    //   };
    //So, we are attaching to the req.user the user object which contains the id. We can use this user id in any protected route.
    //One example of protected routes is the auth route. So, we want to put this in middleware in the auth route.

    //How can we use the id? -> req.user.id

    next(); //We are passing the next middleware in the stack. Example: /api/auth get request will have this middleware and then the callback
    //next() calls for the callback next.
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

//Middleware functions: function that has access to request and response objects. Next is a callback that we have to run once we are done so that it
//Moves on to the next piece of middleware.
