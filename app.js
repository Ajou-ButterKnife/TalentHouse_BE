const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");

var admin = require("firebase-admin");

var serviceAccount = require("./butterfly-efb30-firebase-adminsdk-2x0u2-7a9f670cf8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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
