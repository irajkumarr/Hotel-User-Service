const express = require("express");
const { AuthController } = require("../../controllers");

const router = express.Router();

router.post("/register", AuthController.createUser);

module.exports = router;
