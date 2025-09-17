const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { AppError } = require("../utils");

const userRepository = new UserRepository();

async function getUser(id) {
  try {
    const user = await userRepository.get(Number(id));
    const { password, ...others } = user;
    return others;
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      throw new AppError("User not found in the database");
    }
    throw new AppError(
      "Something went wrong while getting user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateUser(id, data) {
  try {
    const user = await userRepository.update(Number(id), data);
    const { password, ...others } = user;
    return others;
  } catch (error) {
    if (error.name === "PrismaClientKnownRequestError") {
      throw new AppError(
        "The user you requested to update is not present",
        StatusCodes.NOT_FOUND
      );
    }
    throw new AppError(
      "Something went wrong while updating user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function deleteUser(id) {
  try {
    const user = await userRepository.delete(Number(id));
    const { password, ...others } = user;
    return others;
  } catch (error) {
    if (error.name === "PrismaClientKnownRequestError") {
      throw new AppError(
        "The user you requested to delete is not present",
        StatusCodes.NOT_FOUND
      );
    }
    throw new AppError(
      "Something went wrong while deleting user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateProfileImage(id, data) {
  try {
    const user = await userRepository.update(Number(id), data);
    const { password, ...others } = user;
    return others;
  } catch (error) {
    if (error.name === "PrismaClientKnownRequestError") {
      throw new AppError(
        "The user you requested to update is not present",
        StatusCodes.NOT_FOUND
      );
    }
    throw new AppError(
      "Something went wrong while updating user profile",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * reset password
 * verify email
 * forgot password
 */

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  updateProfileImage,
};
