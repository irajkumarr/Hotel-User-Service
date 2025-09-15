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

module.exports = router;
