const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { AppError, FormatMessage } = require("../utils");
const { Auth, Enums, CodeGenerator } = require("../utils/common");
const { ServerConfig } = require("../config");
const { ADMIN } = Enums.ROLE;

const userRepository = new UserRepository();

async function createUser(data) {
  try {
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) {
      if (!existingUser.isVerified) {
        throw new AppError(
          "User already registered but not verified. Please verify your email.",
          StatusCodes.CONFLICT
        );
      }
      throw new AppError(
        "User already exists with this email",
        StatusCodes.CONFLICT
      );
    }

    data.password = await Auth.hashPassword(
      data.password,
      +ServerConfig.SALT_ROUNDS
    );

    const verificationToken = CodeGenerator.generateCode();
    console.log(verificationToken);
    const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await userRepository.create({
      ...data,
      verificationToken: verificationToken,
      verificationTokenExpiry: verificationTokenExpiry,
    });
    return { message: "User registered. Please verify email." };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    //Unique Constraint Error
    if (
      error.code === "P2002" ||
      error.code === "PrismaClientKnownRequestError"
    ) {
      const target = FormatMessage(error.meta?.target?.join(", ") || "field");

      throw new AppError(
        `${target} already exists in the database`,
        StatusCodes.CONFLICT
      );
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
    const isMatch = await Auth.checkPassword(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    const userToken = Auth.generateToken(payload);
    await userRepository.update(user.id, {
      lastLogin: new Date(),
    });

    const { password, ...others } = user;
    return {
      ...others,
      userToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while logging user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Missing JWT token", StatusCodes.BAD_REQUEST);
    }

    const payload = Auth.verifyToken(token); // decode token
    const user = await userRepository.get(Number(payload.id));

    if (!user) {
      throw new AppError(
        "No user found in the database",
        StatusCodes.NOT_FOUND
      );
    }

    return user; // full user object
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid JWT token", StatusCodes.BAD_REQUEST);
    }
    if (error.name === "TokenExpiredError") {
      throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Something went wrong while authenticating",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAdmin(userId) {
  try {
    const user = await userRepository.get(Number(userId));

    if (!user) {
      throw new AppError(
        "No user found for the given id",
        StatusCodes.NOT_FOUND
      );
    }

    return user.role === ADMIN;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

//  General role check
async function hasRole(userId, roles = []) {
  try {
    const user = await userRepository.get(Number(userId));

    if (!user) {
      throw new AppError(
        "No user found for the given id",
        StatusCodes.NOT_FOUND
      );
    }

    return roles.includes(user.role);
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * forgot password
 * reset password
 * verify email
 */
async function forgotPassword(email) {
  try {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new AppError(
        "User not found in the database",
        StatusCodes.NOT_FOUND
      );
    }
    const code = CodeGenerator.generateCode();
    console.log(code);
    const hashedToken = CodeGenerator.hashCode(code);
    const resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await userRepository.update(user.id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: resetPasswordExpiry,
    });
    //send email
    return { message: "Password reset code sent to email" };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Something went wrong while creating reset token",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function resetPassword(data) {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new AppError(
        "User not found in the database",
        StatusCodes.NOT_FOUND
      );
    }

    const hashedCode = CodeGenerator.hashCode(data.code);

    if (
      !user.resetPasswordToken ||
      user.resetPasswordToken !== hashedCode ||
      !user.resetPasswordExpiry ||
      user.resetPasswordExpiry < new Date()
    ) {
      throw new AppError(
        "Invalid or expired reset code",
        StatusCodes.BAD_REQUEST
      );
    }

    const hashedPassword = await Auth.hashPassword(
      data.newPassword,
      +ServerConfig.SALT_ROUNDS
    );

    await userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    });

    return { message: "Password reset successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Something went wrong while resetting password",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function verifyEmail(data) {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new AppError(
        "User not found in the database",
        StatusCodes.NOT_FOUND
      );
    }

    if (
      !user.verificationToken ||
      user.verificationToken !== data.code ||
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < new Date()
    ) {
      throw new AppError(
        "Invalid or expired verification code",
        StatusCodes.BAD_REQUEST
      );
    }

    await userRepository.update(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    });

    return { message: "Email verified successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Something went wrong while verifying email",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createUser,
  loginUser,
  isAuthenticated,
  isAdmin,
  hasRole,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
