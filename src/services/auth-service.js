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

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({ data });
    const { password, ...others } = user;
    return others;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    //Unique Constraint Error
    if (error.name === "PrismaClientKnownRequestError") {
      throw new AppError("Phone number already exists in the database");
    }
    // Validation error
    if (error.name === "PrismaClientValidationError") {
      throw new AppError("Invalid input", StatusCodes.BAD_REQUEST);
    }
    //Fallback
    throw new AppError(
      "Something went wrong while creating user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createUser,
};
