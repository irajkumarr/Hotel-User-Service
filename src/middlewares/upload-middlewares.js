const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { cloudinary, ServerConfig } = require("../config");

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: ServerConfig.CLOUDINARY_FOLDER_NAME, // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = { upload };
