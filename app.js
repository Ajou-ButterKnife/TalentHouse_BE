const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");

const app = express();
const port = 4000;

mongoose
  .connect("mongodb://localhost/testDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("mongoDB connection Success!"))
  .catch((err) => console.log(err));

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("This is App Server!!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
