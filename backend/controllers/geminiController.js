const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

exports.getGeminiResponse = async (req, res) => {
  const { question } = req.body;
  try {
    const result = await model.generateContent(question);
    const response = result.response.text();
    res.json({ answer: response });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Gemini failed to respond" });
  }
};
