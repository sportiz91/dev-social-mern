const express = require("express");
const connectDB = require("./config/db"); //We import the db module to connect to mongo DB.

const app = express();

//Connect db:
connectDB(); //Here we execute the function defined in db.js. This returns us a promise.

//Creamos un single endpoint para testear que nuestro servidor esté runneando correctamente.
//res.send simplemente envía data al browser.
app.get("/", (req, res) => {
  res.send("API Running!");
});

//Define routes. Con app.use lo que hacemos es bindear la middleware function (que en este caso sería el express.Router() de cada endpoint -> es decir, cada uno de esos módulos)
//con los endpoints localhost:5000/api/users, localhost:5000/api/auth, localhost:5000/api/profile, localhost:5000/api/posts.
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
