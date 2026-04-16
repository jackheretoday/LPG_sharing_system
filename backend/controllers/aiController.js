const axios = require('axios');

const aiController = {
  chat: async (req, res) => {
    try {
      const { messages } = req.body;
      const apiKey = process.env.GROQ_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'AI API Key not configured on server' });
      }

      const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: "llama3-8b-8192",
        messages: [
          { 
            role: "system", 
            content: "You are the GasSahayak Safety Expert AI. Your specialty is LPG Cylinder safety, troubleshooting leakage, and explaining the sharing marketplace. Always prioritize safety. If you detect a leak, tell the user to open windows and turn off the regulator. Keep answers concise and helpful." 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 300
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('AI Proxy Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to communicate with AI' });
    }
  }
};

module.exports = aiController;
