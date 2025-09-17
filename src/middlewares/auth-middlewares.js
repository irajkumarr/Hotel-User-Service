const jwt = require("jsonwebtoken");
const fs = require("fs");
const { ServerConfig } = require("../config");
const { ErrorResponse, Auth } = require("../utils/common");
const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new AppError("Token not found", StatusCodes.UNAUTHORIZED);
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw new AppError("Access Denied ❌", StatusCodes.UNAUTHORIZED);
  }
  try {
    const response = Auth.verifyToken(token);
    req.user = response;
    next();
  } catch (error) {
    throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ADMIN") {
      next();
    } else {
      throw new AppError("Access Denied ❌", StatusCodes.UNAUTHORIZED);
    }
  });
};

const verifyAndAuthorize = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "ADMIN" || req.user.role === "USER") {
      next();
    } else {
      throw new AppError("Access Denied ❌", StatusCodes.UNAUTHORIZED);
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
  verifyAdmin,
  verifyAndAuthorize,
};
