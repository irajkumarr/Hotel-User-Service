const jwt = require("jsonwebtoken");
const fs = require("fs");
const { ServerConfig } = require("../config");
const { ErrorResponse } = require("../utils/common");
const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new AppError("Token not found", StatusCodes.UNAUTHORIZED);
    // return res.status(401).json({ status: false, message: "Token not found" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw new AppError("Access Denied ❌", StatusCodes.UNAUTHORIZED);
    // return res.status(401).json({ status: false, message: "" });
  }
  try {
    const decoded = jwt.verify(token, ServerConfig.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    req.user = decoded;
    next();
  } catch (error) {
    // return res.status(401).json({ status: false, message: "Invalid token" });
    throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
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
      throw new AppError("Access Denied ❌", StatusCodes.UNAUTHORIZED);
      // return res
      //   .status(401)
      //   .json({ status: false, message: "Access Denied ❌" });
    }
  });
};

const verifyAndAuthorize = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ADMIN" || req.user.role === "USER") {
      next();
    } else {
      throw new AppError("Access Denied ❌", StatusCodes.UNAUTHORIZED);
      // return res
      //   .status(401)
      //   .json({ status: false, message: "Access Denied ❌" });
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
  verifyAdmin,
  verifyAndAuthorize,
};
