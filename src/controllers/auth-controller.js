const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../middlewares");
const { AuthService } = require("../services");
const { SuccessResponse } = require("../utils/common");

/**
 * POST : /
 * req-body {
 * email: "raj@gmail.com",
 * password: Raj1234,
 * firstName:"Raj",
 * lastName:"Kumar",
 * phoneNumber:"9812343234"}
 */
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

/**
 * POST : /
 * req-body {
 * email: "raj@gmail.com",
 * password: Raj1234}
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.loginUser({
    email,
    password,
  });

  SuccessResponse.data = user;
  return res.status(StatusCodes.OK).json(SuccessResponse);
});

module.exports = {
  createUser,
  loginUser,
};
