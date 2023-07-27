const JWT = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const client = require("./init_redis");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "20s",
        issuer: "popflix.com",
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          if (err.name === "JsonWebTokenError")
            reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // if (err.name === "JsonWebTokenError") {
        //   return next(createError.Unauthorized());
        // } else {
        //   return next(createError.Unauthorized(err.message));
        // }
        if (err) {
          const message =
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          return next(createError.Unauthorized(message));
        }
      }
      req.payload = payload;
      next();
    });
  },
  signRefeshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "popflix.com",
        audience: userId,
      };
      JWT.sign(payload, secret, options, async (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        await client
          .set(userId, token, {
            EX: 365 * 24 * 60 * 60,
            NX: true,
          })
          .then(() => {
            resolve(token);
          })
          .catch((err) => {
            console.log(err);
            // reject(createError.InternalServerError());
          });
      });
    });
  },
  verifyRereshToken: (refreshToken) => {
    console.log(`this is refresh token`, refreshToken);
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err)
          return reject(createError.Unauthorized(`this token got expired`));
        const userId = payload.aud;
        client.get(userId, (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            reject(createError.InternalServerError());
            return;
          }
          if (refreshToken === result) return resolve(userId);
          reject(createError.Unauthorized());
        });
        resolve(userId);
      });
    });
  },
};
