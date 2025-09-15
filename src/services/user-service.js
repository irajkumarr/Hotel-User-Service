const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { AppError } = require("../utils");

const userRepository = new UserRepository();

/**
 * update profile
 * delete account
 * get profile
 */

async function getUser(id) {
  try {
    const user = await userRepository.get(Number(id));
    const { password, ...others } = user;
    return others;
  } catch (error) {
    if (error.statusCode===StatusCodes.NOT_FOUND) {
      throw new AppError("");
    }
    throw new AppError(
      "Something went wrong while getting user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  getUser,
};
