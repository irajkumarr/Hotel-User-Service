require("dotenv").config();
const fs = require("fs");
const path = require("path");

module.exports = {
  PORT: process.env.PORT,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  // Load private and public keys
  PRIVATE_KEY: fs.readFileSync(
    path.join(__dirname, "../../private.key"),
    "utf8"
  ),
  PUBLIC_KEY: fs.readFileSync(path.join(__dirname, "../../public.key"), "utf8"),
};
