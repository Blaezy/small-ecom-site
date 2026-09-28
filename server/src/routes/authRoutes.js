const express = require("express");
const router = express.Router();

const { register, login, refreshTokenHandler, logout, me } = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const validateRequest = require("../middlewares/validateRequest");
const { registerValidator, loginValidator } = require("../validators/authValidators");

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;
