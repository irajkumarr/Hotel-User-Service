const crypto = require("crypto");

function generateCode(length = 6) {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, length);
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

module.exports = {
  generateCode,
  hashCode,
};
