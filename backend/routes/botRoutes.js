const express = require("express");
const router = express.Router();
const { getGeminiResponse } = require("../controllers/geminiController");

router.post("/gemini-reply", getGeminiResponse);

module.exports = router;
