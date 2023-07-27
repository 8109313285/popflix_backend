const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const DB_NAME = process.env.DB_NAME;

mongoose
  .connect(MONGO_DB_URL, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Pop flix Data base connected Successfuly`);
  })
  .catch((err) => {
    console.log(`Error in connecting Data Base Please Retry`, err.message);
  });

mongoose.connection.on("connected", () => {
  console.log("mongoose connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is Disconnected");
});
process.on("SIGNIT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
