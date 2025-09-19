const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { AuthService } = require("../services");

async function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Missing or invalid Authorization header",
        StatusCodes.BAD_REQUEST
      );
    }

    const token = authHeader.split(" ")[1]; // get the token part after 'Bearer'
    const response = await AuthService.isAuthenticated(token);

    req.user = response; // attach user id
    next();
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
}

async function isAdmin(req, res, next) {
  try {
    const allowed = await AuthService.isAdmin(req.user.id);
    if (!allowed) {
      throw new AppError(
        "User not authorized for this action",
        StatusCodes.UNAUTHORIZED
      );
    }
    next();
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
}

function verifyRole(...roles) {
  return async (req, res, next) => {
    try {
      const allowed = await UserService.hasRole(req.user.id, roles);
      if (!allowed) {
        throw new AppError(
          "User not authorized for this action",
          StatusCodes.UNAUTHORIZED
        );
      }
      next();
    } catch (error) {
      throw new AppError(error.message, error.statusCode);
    }
  };
}

module.exports = {
  checkAuth,
  isAdmin,
  verifyRole,
};
