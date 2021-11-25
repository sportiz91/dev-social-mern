const express = require("express");
const router = express.Router();

//Es una test route.
//@route    GET api/profile
//@desc     Test route
//@access   Public
router.get("/", (req, res) => res.send("Profile route"));

//Exportamos el módulo.
module.exports = router;
