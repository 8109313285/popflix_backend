const express = require("express");
const router = express.Router();
const user_authentication = require("./user_authentication");

const defaultRoutes = [
  {
    path: "/users",
    routes: user_authentication,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

module.exports = router;
