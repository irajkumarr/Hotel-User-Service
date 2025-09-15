const jwt = require("jsonwebtoken");
const fs = require("fs");
const { ServerConfig } = require("../config");

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ status: false, message: "Token not found" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: false, message: "Access Denied ❌" });
  }
  try {
    const decoded = jwt.verify(token, ServerConfig.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, ServerConfig.PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ServerConfig.JWT_EXPIRES_IN,
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ADMIN") {
      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied ❌" });
    }
  });
};

const verifyAndAuthorize = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ADMIN" || req.user.role === "USER") {
      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied ❌" });
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
  verifyAdmin,
  verifyAndAuthorize,
};
