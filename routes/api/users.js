//Una cosa importante a destacar es que estamos quebrando nuestra App principal en diferentes recursos (users, auth, profile, posts, etc). Todo podríamos ponerlo en server.js
//Pero dado que es una App larga, no tiene mucho sentido hacerlo así porque se pierde claridad y modularidad.
//Para registrar nuevos usuarios, el usuario deberá ingresar 3 campos: nombre, email y password. Tenemos que hacer ciertas validaciones de que dichos campos ingresados
//Por el usuario sean correctos. Para eso usaremos el package express-validator.
//Lo que me permite hacer express-validator es agregar un parámetro adicional en nuestra request (parámetro del medio entre route y (req, res)) que sean las validaciones
//Que debe pasar el campo. Check me permite agregar el campo a validar, como primer parámetro, y el mensaje personalizado de error en caso que no pase la validación,
//Como segundo parámetro.
//Por su parte, validationResult(req) -> toma como parámetro el request object y nos da como resultado un objeto que contiene un array con los errores (de las validaciones)
//Que no se pasaron. Esto es útil dado que luego lo puedo enviar como json al Cliente.
//Dentro de ese array de error tendré objetos, por cada validación que no se pasó. Las propiedades del objeto serán: msg: mensaje personalizado de error definido,
//param: field que no pasó la validación (ej -> email, o name) y location (body) -> es decir, en donde le erra la validación. En este caso, en el body de la request.

//Ejemplo: el ejemplo que se muestra a continuación presenta la respuesta al Cliente de parte del Servidor con los errores provenientes de la validación de fields no pasada.
// {
//   "errors": [
//       {
//           "msg": "Please include a valid email",
//           "param": "email",
//           "location": "body"
//       },
//       {
//           "msg": "Please enter a password with 6 or more characters",
//           "param": "password",
//           "location": "body"
//       }
//   ]
// }

//Mongoose -> la forma más efectiva de actualizar data en nuestra base es loadeando los documentos (a través de algún método de model.find que nos devuelve una promesa)
//realizando los cambios pertinentes con syntaxis vanilla js y luego aplicando instance.save() para guardar los cambios en el documento.
//Esto es así, dado que el método model.save() nos da full validation + middleware. No obtendremos full validation si hacemos las actualizaciones a través de las queries:
//Model.updateOne, etc...

//Requiring modules:
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator"); //Este módulo te permite agregar más parámetros a tus GET y POST Requests, que sean validaciones
//que debe pasar la Request.
const User = require("../../models/User");

//@route    POST api/users -> (@route post es el Request Type). Luego, api/users es el endpoint.
//@desc     Register User. -> descripción de la ruta (ej -> agregar usuarios, likear posts, cualquier cosa que haga la ruta).
//@access   Public -> (Public vs Private -> si necesitás un token para acceder a determinada route, ej para agregar un perfil - obviamente para esto necesitás estar autenticado -
// Entonces a esa route necesitarás enviar un token para poder acceder. Caso contrario, obtendrás algo como "no autorizado"). En este caso tendremos una Public route, para la cual
// No necesitamos un token de acceso.
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
    // console.log(req.body); //req.body objeto de data que se enviará a esta route. Para poder usar el objeto req.body necesitamos inicializar el middleware del body-parser.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //Si hay errores en la validación, no querremos pasar un 200 status, porque eso implica que está todo bien. Querremos pasar un 400 que significa
      //bad request
    }

    //If we arrive to this stage (if statement above didn't get executed), we have to register the user. In order to do that we have to:

    console.log(req.body);
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
