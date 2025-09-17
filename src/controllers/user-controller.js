const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { UserService } = require("../services");
const { SuccessResponse } = require("../utils/common");

/**
 * POST : /
 * req-body {}
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await UserService.getUser(req.user.id);
  SuccessResponse.data = user;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * POST : /
 * req-body {firstName:"John",lastName:"Doe"}
 */
const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;
  const user = await UserService.updateUser(req.user.id, {
    firstName,
    lastName,
    phoneNumber,
  });
  SuccessResponse.data = user;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * POST : /
 * req-body {}
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await UserService.deleteUser(req.user.id);
  SuccessResponse.data = user;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

/**
 * POST : /
 * req-body {profileImage:"profile.png"}
 */
const updateProfileImage = asyncHandler(async (req, res) => {
  const profileImage = req.file.path;
  const user = await UserService.updateProfileImage(req.user.id, {
    profileImage,
  });
  SuccessResponse.data = user;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  updateProfileImage,
};
