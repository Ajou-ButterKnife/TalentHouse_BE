const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");

mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.get("/", (req, res) => {
  res.send("This is App Server!!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
