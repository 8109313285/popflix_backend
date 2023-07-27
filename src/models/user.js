const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const User_Schema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: Number,
    },
    deviceToken: {
      type: String,
    },
  },
  { timestamps: true }
);

User_Schema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

User_Schema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", User_Schema);
module.exports = { User };