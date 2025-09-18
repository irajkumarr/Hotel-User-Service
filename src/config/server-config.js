require("dotenv").config();
const fs = require("fs");
const path = require("path");

module.exports = {
  PORT: process.env.PORT,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  ACCOUNT_VERIFICATION_EXPIRY_HOURS:
    process.env.ACCOUNT_VERIFICATION_EXPIRY_HOURS,
  // Load private and public keys
  PRIVATE_KEY: fs.readFileSync(
    path.join(__dirname, "../../private.key"),
    "utf8"
  ),
  PUBLIC_KEY: fs.readFileSync(path.join(__dirname, "../../public.key"), "utf8"),
  // Cloudinary
  CLOUDINARY_FOLDER_NAME: process.env.CLOUDINARY_FOLDER_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  //Redis
  REDIS_URL: process.env.REDIS_URL,
};
