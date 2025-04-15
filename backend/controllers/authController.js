const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// In-memory store for OTPs (use Redis or DB in production)
let otpStore = {};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "omsurve3042003@gmail.com",
    pass: "ugri xhol xabw kvzs", // App password from Gmail
  },
});

// ✅ SEND OTP
// ✅ SEND OTP (Updated)
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    const user = await User.findOne({ email }); // ✅ Check if user exists

    await transporter.sendMail({
      from: "omsurve3042003@gmail.com",
      to: email,
      subject: "Your OTP for Chatbot Login",
      text: `Your OTP is: ${otp}`,
    });

    // ✅ Return if user is new or existing
    res.json({ 
      success: true, 
      message: "OTP sent!", 
      isNewUser: !user 
    });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


// ✅ VERIFY OTP
// ✅ VERIFY OTP (Updated)
const verifyOtp = async (req, res) => {
  const { email, otp, name, phone } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  if (otpStore[email] != otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // 🔰 If new user, name and phone are required
      if (!name || !phone) {
        return res.status(400).json({ success: false, message: "Name and Phone are required for new users" });
      }
      user = new User({ email, name, phone });
    }

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
    });

    delete otpStore[email];
    res.json({ success: true, message: "OTP verified!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ CHECK LOGIN
const checkLogin = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ loggedIn: false });
    res.json({ loggedIn: true });
  });
};

module.exports = {
  sendOtp,
  verifyOtp,
  checkLogin,
};
