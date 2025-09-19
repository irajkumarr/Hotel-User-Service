const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { AppError } = require("../utils");
const { FormatMessage } = require("../utils");

// Define schema
const userCreateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string().min(6).max(60).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 60 characters",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().allow("").messages({
    "string.base": "First name must be a string",
  }),
  lastName: Joi.string().allow("").messages({
    "string.base": "Last name must be a string",
  }),
  role: Joi.string()
    .valid("USER", "ADMIN", "HOTEL_MANAGER", "HOTEL_STAFF")
    .default("USER")
    .messages({
      "any.only": "Role must be one of USER, ADMIN, HOTEL_MANAGER, HOTEL_STAFF",
    }),
  profileImage: Joi.string().uri().allow("").messages({
    "string.uri": "Profile image must be a valid URL",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
});

// Middleware
function validateCreateRequest(req, res, next) {
  const { error, value } = userCreateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while creating user";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string().min(6).max(60).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 60 characters",
    "any.required": "Password is required",
  }),
});
// Middleware
function validateLoginRequest(req, res, next) {
  const { error, value } = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while logging user";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

const userUpdateSchema = Joi.object({
  firstName: Joi.string().messages({
    "string.empty": "First name cannot be empty",
    "string.base": "First name must be a string",
  }),
  lastName: Joi.string().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name cannot be empty",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
});
// Middleware
function validateUpdateRequest(req, res, next) {
  const { error, value } = userUpdateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while updating user";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
    "string.empty": "Email cannot be empty",
  }),
});

function validateForgotPasswordRequest(req, res, next) {
  const { error, value } = forgotPasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message =
      "Something went wrong while forgotting user password";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid",
    "string.empty": "Email cannot be empty",
  }),
  code: Joi.string().required().max(6).min(6).messages({
    "any.required": "Code is required",
    "string.email": "Code must be valid",
    "string.empty": "Code cannot be empty",
    "string.min": "Code must be 6 characters",
    "string.max": "Code cannot exceed 6 characters",
  }),
  newPassword: Joi.string().min(6).max(60).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 60 characters",
    "any.required": "Password is required",
  }),
});

function validateResetPasswordRequest(req, res, next) {
  const { error, value } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => FormatMessage(detail.message));
    ErrorResponse.message = "Something went wrong while reseting user password";
    ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  req.body = value;
  next();
}

function validateUpdateProfileImage(req, res, next) {
  if (!req.file) {
    ErrorResponse.message = "Profile image is required";
    ErrorResponse.error = new AppError(
      ["Please upload a valid profile image (JPEG, PNG)"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

module.exports = {
  validateCreateRequest,
  validateLoginRequest,
  validateUpdateRequest,
  validateUpdateProfileImage,
  validateForgotPasswordRequest,
  validateResetPasswordRequest,
};
