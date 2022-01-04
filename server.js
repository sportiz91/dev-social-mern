const express = require("express");
const connectDB = require("./config/db"); //We import the db module to connect to mongo DB. This imports the connectDB() function we defined earlier.
const path = require("path"); //npm core module. We don't need to install it.

const app = express(); //Instantiate app.

//Connect to db:
connectDB(); //Here we execute the function defined in db.js. Remember -> mongoose.connect(uri, options, callback) returns a promise.

//Init middleware:
//app.use -> anytime we get ANY TYPE OF REQUEST to the described route, the middleware defined will execute.
//It's different from app.get/app.post/app.put/app.delete, etc, because this are specific type of requests middlewares.
//app.use(path, callback). If no path is defined, "/" (route) is used by default. So, if we define app.use with no path,
//means the middleware is executed everytime you hit the page.
app.use(express.json({ extended: false })); //This line allows us to get the req.body object that is sent in a Content-Type: application/json POST Request.

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

  //For every route of the app, aside the routes defined above (router routes), we want to server the index.html file
  //on the static folder.
  //Makes sense: for /api/users, /api/auth, /api/profile & /api/posts there are some other middleware defined.
  //So, every other request made to the server, ASIDE from the one defined above, will serve the index.html.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html")); //load every route as parameters.
  });
}

//Port needs to be process.env.PORT because that's what herokus it's gonna look for.
//Port 5000 is used if process.env.PORT doesn't exists.
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
