const express = require("express");
const connectDB = require("./config/db"); //We import the db module to connect to mongo DB.

const app = express();

//Connect db:
connectDB(); //Here we execute the function defined in db.js. This returns us a promise.

app.use(express.json({ extended: false })); //This line allows us to get the req.body object that is sent in a POST Request.

app.get("/", (req, res) => {
  res.send("API Running!");
});

//Define routes.
//app.use binds middleware function (in this case, express.Router() of every endpoint)
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
