const express = require("express");
const connectDB = require("./config/db"); //We import the db module to connect to mongo DB.
const path = require("path");

const app = express();

//Connect db:
connectDB(); //Here we execute the function defined in db.js. This returns us a promise.

//Init middleware:
app.use(express.json({ extended: false })); //This line allows us to get the req.body object that is sent in a POST Request.

//Define routes.
//app.use binds middleware function (in this case, express.Router() of every endpoint)
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Serve Static Assets in production:
if (process.env.NODE_ENV === "production") {
  //Set Static Folder -> in Express we can determine certain folder to be the Static Folder.
  //We want to be the index.html from /client/build/index.html the file we are gonna serve in production.
  app.use(express.static("client/build")); //We determine that the client/build folder to be the static

  //For every route of the app, aside the routes defined above, we want to server the index.html file
  //on the static folder.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Port needs to be process.env.PORT because that's what herokus it's gonna look for.
//Port 5000 is used if process.env.PORT doesn't exists.
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
