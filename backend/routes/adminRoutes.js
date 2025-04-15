const express = require("express");
const router = express.Router();
const { login, logout, getUsers } = require("../controllers/adminController");
const User = require("../models/user");

// ✅ Get all users
router.get("/users", getUsers);

// ✅ Admin login/logout
router.post("/login", login);
router.post("/logout", logout);

// ✅ Delete user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// ✅ Update user by ID
router.put("/users/:id", async (req, res) => {
  try {
    const { name, phone } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, phone });
    res.json({ success: true, message: "User updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

module.exports = router;
