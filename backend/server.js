const express = require("express"); 
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const geminiRoutes = require("./routes/botRoutes"); // or relevant path
require("dotenv").config();

const app = express();

// ✅ MIDDLEWARE
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

// ✅ Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Session middleware (optional if not using sessions for auth)
app.use(session({
    secret: "om",
    resave: false,
    saveUninitialized: true,
}));

app.use("/api/chatbot", geminiRoutes);

// ✅ DATABASE
mongoose.connect("mongodb://localhost:27017/chatbotDB")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error", err));

// ✅ ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// ✅ Serve chatbot HTML directly
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/chatbot.html"));
});

// ✅ Middleware for token check (JWT-based)
const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        req.user = user;
        next();
    });
};

// ✅ POST chatbot logic with authentication
app.post("/chatbot", authenticateUser, (req, res) => {
    const { choice } = req.body;
    const chatbotData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data.json"), "utf-8")
    );
    const response = chatbotData[choice] || {
      question: "Sorry, I don't understand that.",
      options: [],
    };
    res.json(response);
  });
  

// ✅ Logout route
app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
  
// ✅ START SERVER
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
