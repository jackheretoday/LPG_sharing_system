const axios = require('axios');

const SYSTEM_PROMPT =
  'You are the GasSahayak Safety Expert AI. Focus on LPG safety, leakage handling, and booking help. ' +
  'Always prioritize immediate safety actions first when leak risk is mentioned. Keep answers concise and practical.';

const resolveGroqKey = () =>
  process.env.GROQ_API_KEY ||
  process.env.GROQ_KEY ||
  process.env.GROQ_TOKEN ||
  process.env.VITE_GROQ_API_KEY ||
  null;

const lastUserMessage = (messages) => {
  if (!Array.isArray(messages)) return "";
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "user" && typeof messages[i]?.content === "string") {
      return messages[i].content.trim();
    }
  }
  return "";
};

const localAssistantReply = (messages) => {
  const input = lastUserMessage(messages).toLowerCase();

  if (!input) {
    return "Share your LPG issue and location. I will guide you with immediate safety steps.";
  }

  if (
    input.includes("leak") ||
    input.includes("smell") ||
    input.includes("gas")
  ) {
    return "Immediate steps: 1) Turn off regulator. 2) Open windows/doors. 3) Do not switch lights or use flames. 4) Move people to safe area. 5) Raise emergency request now.";
  }

  if (
    input.includes("book") ||
    input.includes("cylinder") ||
    input.includes("refill")
  ) {
    return "For refill booking: open platform booking flow, select cylinder, confirm address, and track status in Tracking. If you share your city and urgency, I can suggest next action.";
  }

  return "I can help with LPG safety, refill booking, tracking, and emergency actions. Tell me your exact issue and location.";
};

const safeFallback = (content) => ({
  id: `fallback-${Date.now()}`,
  object: 'chat.completion',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content,
      },
      finish_reason: 'stop',
    },
  ],
});

const aiController = {
  chat: async (req, res) => {
    try {
      const { messages } = req.body || {};
      const apiKey = resolveGroqKey();

      if (!apiKey) {
        return res.status(200).json(safeFallback(localAssistantReply(messages)));
      }

      const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: "llama-3.1-8b-instant",
        messages: [
          { 
            role: "system", 
            content: SYSTEM_PROMPT
          },
          ...(Array.isArray(messages) ? messages : [])
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
      return res.status(200).json(safeFallback(localAssistantReply(req.body?.messages)));
    }
  }
};

module.exports = aiController;
