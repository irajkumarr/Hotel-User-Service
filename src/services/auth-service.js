const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { AppError } = require("../utils");
const bcrypt = require("bcryptjs");

const userRepository = new UserRepository();

async function createUser(data) {
  try {
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) {
      throw new AppError(
        "User already exists with this email",
        StatusCodes.CONFLICT
      );
    }
    const salt = await bcrypt.getSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({ data });
    const { password, ...others } = user;
    return others;
  } catch (error) {
    throw new AppError(
      "Something went wrong while creating user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createUser,
};
