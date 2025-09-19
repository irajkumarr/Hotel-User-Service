const express = require("express");
const { AuthController } = require("../../controllers");
const { UserMiddlewares } = require("../../middlewares");

const router = express.Router();

// api/v1/auth/register  POST
router.post(
  "/register",
  UserMiddlewares.validateCreateRequest,
  AuthController.createUser
);

// api/v1/auth/login  POST
router.post(
  "/login",
  UserMiddlewares.validateLoginRequest,
  AuthController.loginUser
);

// api/v1/auth/forgot-password  POST
router.post(
  "/forgot-password",
  UserMiddlewares.validateForgotPasswordRequest,
  AuthController.forgotPassword
);

// api/v1/auth/reset-password  POST
router.post(
  "/reset-password",
  UserMiddlewares.validateResetPasswordRequest,
  AuthController.resetPassword
);

// api/v1/auth/verify-email  POST
router.post("/verify-email", AuthController.verifyEmail);

module.exports = router;
