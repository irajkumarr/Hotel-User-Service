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

module.exports = {
  getUser,
};
