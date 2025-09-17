const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

async function checkPassword(plainPassword, encryptedPassword) {
  try {
    return await bcrypt.compare(plainPassword, encryptedPassword);
  } catch (error) {
    throw error;
  }
}

async function hashPassword(plainPassword, saltRounds) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw error;
  }
}

function generateToken(userData) {
  return jwt.sign(userData, ServerConfig.PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ServerConfig.JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, ServerConfig.PUBLIC_KEY, {
    algorithms: ["RS256"],
  });
}

module.exports = {
  verifyToken,
  hashPassword,
  checkPassword,
  generateToken,
};
