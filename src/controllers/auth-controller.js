const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { AuthService } = require("../services");
const { SuccessResponse } = require("../utils/common");
const createUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role,
    phoneNumber,
    profileImage,
  } = req.body;
  const user = await AuthService.createUser({
    email,
    password,
    firstName,
    lastName,
    role,
    phoneNumber,
    profileImage,
  });

  SuccessResponse.data = user;
  return res.status(StatusCodes.CREATED).json(SuccessResponse);
});

module.exports = {
  createUser,
};
