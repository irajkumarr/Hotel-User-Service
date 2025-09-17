const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { cloudinary, ServerConfig } = require("../config");
const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: ServerConfig.CLOUDINARY_FOLDER_NAME, // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Pre-validate file type & size before upload
const fileFilter = (req, file, cb) => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        "Only JPEG, PNG, and JPG files are allowed",
        StatusCodes.BAD_REQUEST
      ),
      false
    );
  }

  // Optional: enforce max size (in bytes)
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return cb(
      new AppError("File size should not exceed 1MB", StatusCodes.BAD_REQUEST),
      false
    );
  }

  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

module.exports = { upload };
