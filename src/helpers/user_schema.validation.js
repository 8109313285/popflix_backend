const joi = require("joi");

const userSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),
  phone: joi.number(),
  name: joi.string().min(5),
  //   password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  //   repeat_password: joi.ref("password"),
});
module.exports = { userSchema };
