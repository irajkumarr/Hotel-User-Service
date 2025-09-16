const express = require("express");
const { UserController } = require("../../controllers");
const { AuthMiddlewares, UploadMiddlewares } = require("../../middlewares");

const router = express.Router();

// api/v1/users/  GET
router.get("/", AuthMiddlewares.verifyAndAuthorize, UserController.getUser);

// api/v1/users/  PATCH
router.patch(
  "/",
  AuthMiddlewares.verifyAndAuthorize,
  UserController.updateUser
);

// api/v1/users/  DELETE
router.delete(
  "/",
  AuthMiddlewares.verifyAndAuthorize,
  UserController.deleteUser
);

// api/v1/users/profile-image  POST
router.post(
  "/profile-image",
  AuthMiddlewares.verifyAndAuthorize,
  UploadMiddlewares.upload.single("profileImage"),
  UserController.updateProfileImage
);

module.exports = router;
