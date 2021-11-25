//Auth.js será el file encargado de devolvernos un JWT Token.

//Una cosa importante a destacar es que estamos quebrando nuestra App principal en diferentes recursos (users, auth, profile, posts, etc). Todo podríamos ponerlo en server.js
//Pero dado que es una App larga, no tiene mucho sentido hacerlo así porque se pierde claridad y modularidad.

//Requiring modules:
const express = require("express");
const router = express.Router();

//Es una test route.
//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get("/", (req, res) => res.send("Auth route"));

//Exportamos el módulo.
module.exports = router;
