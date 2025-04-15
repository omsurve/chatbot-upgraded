const data = require("../data/chatbotData.json");

exports.getResponse = (req, res) => {
    const { choice } = req.body;
    const response = data[choice] || { question: "I don't understand.", options: ["Back"] };
    res.json(response);
};
