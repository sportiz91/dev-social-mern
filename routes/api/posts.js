const express = require("express");
const router = express.Router();

//Es una test route.
//@route    GET api/posts
//@desc     Test route
//@access   Public
router.get("/", (req, res) => res.send("Posts route"));

//Exportamos el módulo.
module.exports = router;
