const jwt = require("jsonwebtoken");
const User = require("../models/user");


const hardcodedAdmin = {
  id: "admin123",
  password: "supersecure",
};

const login = (req, res) => {
  const { id, password } = req.body;
  if (id === hardcodedAdmin.id && password === hardcodedAdmin.password) {
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.cookie("admin_token", token, { httpOnly: true, sameSite: "Lax" });
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
};

const logout = (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email phone"); // fetch only required fields
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};


module.exports = { login, logout, getUsers};
