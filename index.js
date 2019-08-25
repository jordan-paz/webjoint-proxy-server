const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/", require("./authRoutes"));
app.use("/", require("./orderRoutes"));

const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  });
};

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening on port", port);
});
