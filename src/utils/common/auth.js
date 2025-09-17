const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function checkPassword(plainPassword, encryptedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    throw error;
  }
}

function hashPassword(plainPassword, saltRound) {
  try {
    const salt = bcrypt.genSaltSync(saltRound);
    return bcrypt.hashSync(plainPassword, salt);
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
