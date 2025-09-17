const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { AppError } = require("../utils");
const bcrypt = require("bcryptjs");
const { AuthMiddlewares } = require("../middlewares");
const { Auth } = require("../utils/common");

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

    // const salt = await bcrypt.genSalt(10);
    // data.password = await bcrypt.hash(data.password, salt);
    data.password = Auth.hashPassword(data.password, 10);

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

async function loginUser(data) {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }
    if (!user.isVerified) {
      throw new AppError(
        "Please verify your email before logging in",
        StatusCodes.FORBIDDEN
      );
    }
    // const isMatch = await bcrypt.compare(data.password, user.password);
    const isMatch = Auth.checkPassword(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    const userToken = AuthMiddlewares.generateToken(payload);
    await userRepository.update(user.id, {
      lastLogin: new Date(),
    });

    const { password, ...others } = user;
    return {
      ...others,
      userToken,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while logging user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createUser,
  loginUser,
};
