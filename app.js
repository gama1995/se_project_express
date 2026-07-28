const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: "6a6152065713738c1c7f3ba1",
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
