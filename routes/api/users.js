//Una cosa importante a destacar es que estamos quebrando nuestra App principal en diferentes recursos (users, auth, profile, posts, etc). Todo podríamos ponerlo en server.js
//Pero dado que es una App larga, no tiene mucho sentido hacerlo así porque se pierde claridad y modularidad.

//Requiring modules:
const express = require("express");
const router = express.Router();

//Es una test route.
//@route    GET api/users -> (@route GET es el Request Type). Luego, api/users es el endpoint.
//@desc     Test route -> descripción de la ruta (ej -> agregar usuarios, likear posts, cualquier cosa que haga la ruta).
//@access   Public -> (Public vs Private -> si necesitás un token para acceder a determinada route, ej para agregar un perfil - obviamente para esto necesitás estar autenticado -
// Entonces a esa route necesitarás enviar un token para poder acceder. Caso contrario, obtendrás algo como "no autorizado"). En este caso tendremos una Public route, para la cual
// No necesitamos un token de acceso.
router.get("/", (req, res) => res.send("User route"));

//Exportamos el módulo.
module.exports = router;

//Ahora que tenemos las rutas definidas para todos los .js, lo que tendremos que hacer es habilitar que server.js pueda leer dichas rutas
//app.use("/api/users", require("./routes/api/users"));
//-> lo que hace la línea anterior es que el router.get("/") pertenezca a la ruta /api/users.
//Si luego queremos por ejemplo un api/users/register (por poner un ejemplo), solo tendré que hacer router.get("/register") en este file.
//Queremos mantener nuestra API Restful. Es decir, si hace un GET Request va a obtener los usuarios. Si hace un POST Request va a alterar la base de datos.
//Define routes:
// app.use("/api/users", require("./routes/api/users"));
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/profile", require("./routes/api/profile"));
// app.use("/api/posts", require("./routes/api/posts"));
//Una vez definidas las rutas como se muestra arriba, deberíamos poder hacer los GET Requests a las rutas definidas -> api/users, api/auth, api/profile, api/posts.

//En este caso, tenemos definidas las middleware functions en el routing level (no en el App level).
