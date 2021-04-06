const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const mongooseAutoInc = require("mongoose-auto-increment");

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
  .then(() => console.log("DB connection success!!"))
  .catch((err) => console.log(err));
// mongooseAutoInc.initialize(mongoose.connection);

app.use(bodyParser.json());
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("This is App Server!!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
