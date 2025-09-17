const express = require("express");
const { UserController } = require("../../controllers");
const {
  AuthMiddlewares,
  UploadMiddlewares,
  UserMiddlewares,
} = require("../../middlewares");

const router = express.Router();

// api/v1/users/  GET
router.get("/", AuthMiddlewares.checkAuth, UserController.getUser);

// api/v1/users/  PATCH
router.patch(
  "/",
  AuthMiddlewares.checkAuth,
  UserMiddlewares.validateUpdateRequest,
  UserController.updateUser
);

// api/v1/users/  DELETE
router.delete("/", AuthMiddlewares.checkAuth, UserController.deleteUser);

// api/v1/users/profile-image  POST
router.post(
  "/profile-image",
  AuthMiddlewares.checkAuth,
  UploadMiddlewares.upload.single("profileImage"),
  UserMiddlewares.validateUpdateProfileImage,
  UserController.updateProfileImage
);

// api/v1/users/change-password  POST
router.post(
  "/change-password",
  AuthMiddlewares.checkAuth,
  UserController.updatePassword
);

module.exports = router;
