const express = require("express");
const morgan = require("morgan");
require("./src/services/mongo.services");
require("dotenv").config();
const cors = require("cors");
const createError = require("http-errors");
require("./src/helpers/init_redis");

const user_authentication_route = require("./src/routes/v1");
const PORT = process.env.PORT;
const { verifyAccessToken } = require("./src/helpers/jwt_helper");
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/v1", user_authentication_route);

app.get("/", verifyAccessToken, (req, res) => {
  res.send("hello from PopFlix");
});

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  console.log(`lets check this error`, err.status);
  res.status(err.status || 500);
  res.status(200).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
