const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");

mongoose.connect("mongodb://localhost:27017/demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("This is App Server!!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
