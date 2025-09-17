const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { AppError } = require("../utils");
const { Auth } = require("../utils/common");
const { ServerConfig } = require("../config");

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

async function updatePassword(id, data) {
  try {
    const user = await userRepository.get(Number(id));
    if (!user) {
      throw new AppError(
        "User not found in the database",
        StatusCodes.NOT_FOUND
      );
    }

    if (!(await Auth.checkPassword(data.oldPassword, user.password))) {
      throw new AppError("Incorrect old password", StatusCodes.UNAUTHORIZED);
    }
    data.newPassword = await Auth.hashPassword(
      data.newPassword,
      +ServerConfig.SALT_ROUNDS
    );
    await userRepository.update(user.id, {
      password: data.newPassword,
    });

    return { message: "Password changed successfully" };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while updating user password",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function clearExpiredVerificationToken() {
  try {
    const time = new Date();
    const response = await userRepository.clearExpiredVerificationToken(time);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function clearExpiredResetToken() {
  try {
    const time = new Date();
    const response = await userRepository.clearExpiredResetToken(time);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function deleteUnverifiedAccounts(expiryHours = 1) {
  try {
    const time = new Date(Date.now() - expiryHours * 60 * 60 * 1000);
    const response = await userRepository.deleteUnverifiedAccounts(time);
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  updateProfileImage,
  updatePassword,
  clearExpiredVerificationToken,
  clearExpiredResetToken,
  deleteUnverifiedAccounts,
};
