const express = require("express");
const { UserController } = require("../../controllers");
const { AuthMiddlewares } = require("../../middlewares");

const router = express.Router();

// api/v1/users/  GET
router.get("/", AuthMiddlewares.verifyAndAuthorize, UserController.getUser);

// api/v1/users/  PATCH
router.patch(
  "/",
  AuthMiddlewares.verifyAndAuthorize,
  UserController.updateUser
);

module.exports = router;
