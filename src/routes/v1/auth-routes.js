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

module.exports = router;
