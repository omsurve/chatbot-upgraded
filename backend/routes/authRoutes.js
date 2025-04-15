// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // ✅ ADD THIS
const { sendOtp, verifyOtp } = require("../controllers/authController");



// Route to send OTP to user's email
router.post("/send-otp", sendOtp);

// Route to verify OTP and log the user in
router.post("/verify-otp", verifyOtp);
router.get("/check-login", authController.checkLogin);


module.exports = router;
