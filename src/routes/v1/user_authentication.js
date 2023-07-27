const express = require("express");
const route = express.Router();
const user_authentication = require("../../controller/user_authentication");

route.post("/user_login", user_authentication.user_login);
route.post("/user_signup", user_authentication.user_signup);
route.post("/refresh-token", user_authentication.refreshToken);
route.delete("/logout", user_authentication.user_logout);

module.exports = route;
