const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const createError = require("http-errors");
const { userSchema } = require("../helpers/user_schema.validation");
const Joi = require("joi");
const {
  signAccessToken,
  signRefeshToken,
  verifyRereshToken,
} = require("../helpers/jwt_helper");

const hashingPassword = async (password, callback) => {
  let saltRounds = 10;
  try {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
      } else {
        console.log(hash);
        callback(hash);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

const user_signup = async (req, res, next) => {
  console.log(`user signup is called`);
  try {
    const result = await userSchema.validateAsync(req.body);
    const { email, name, phone, password } = result;
    const emailExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if (emailExist) {
      throw createError.Conflict(`${email} is already been registered`);
    }
    if (phoneExist) {
      throw createError.Conflict(`${phone} is already been registered`);
    }
    const createUser = new User(result);
    const creatingUser = await createUser.save();
    const accessToken = await signAccessToken(creatingUser.id);
    const refreshToken = await signRefeshToken(creatingUser.id);
    res.status(200).json({
      status: 200,
      message: "User crated successfuly",
      result: { accessToken, refreshToken },
    });
  } catch (error) {
    if (error.details != undefined) error.status = 422;
    next(error);
  }
};

const user_login = async (req, res, next) => {
  try {
    const result = await userSchema.validateAsync(req.body);
    const { email, password } = result;
    console.log(result);
    const user = await User.findOne({ email });
    if (!user) throw createError.NotFound("user is not registered");
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) throw createError.BadRequest("username/password not valid");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefeshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    if (error.details != undefined)
      return next(createError.BadRequest("invalid Username/Password"));
    next(error);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRereshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefeshToken(userId);
    res.status(200).send({ accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
};

const user_logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userid = await verifyRereshToken(refreshToken);
    client.DEL(userid, (err, val) => {
      if (err) {
        console.log(err);
        throw createError.InternalServerError();
      }
      console.log(val);
      res.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { user_login, user_signup, refreshToken, user_logout };
