import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (persona, message, history, retries = 3) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: persona.systemPrompt
    });

    // Gemini requires the history to start with a 'user' message.
    // Our first message is often a 'bot' greeting, which we should skip for the API history.
    let apiHistory = history
      .map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
      .filter((msg, index) => {
        if (index === 0 && msg.role === "model") return false;
        return true;
      });

    // Trim context to save tokens (keep last 6 messages max, ensuring first is 'user')
    if (apiHistory.length > 6) {
        apiHistory = apiHistory.slice(apiHistory.length - 6);
        if (apiHistory[0] && apiHistory[0].role === "model") {
            apiHistory = apiHistory.slice(1);
        }
    }

    const chat = model.startChat({
      history: apiHistory,
    });

    // Retry loop with exponential backoff for 429 Quota Exceeded errors
    for (let i = 0; i < retries; i++) {
        try {
            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            const isRateLimit = error.message?.includes('429') || error.message?.includes('Quota') || error.message?.includes('retry');
            if (isRateLimit && i < retries - 1) {
                const waitTime = (i + 1) * 3000; // Wait 3s, then 6s
                console.warn(`Rate limit hit, retrying in ${waitTime / 1000} seconds...`);
                await sleep(waitTime);
            } else {
                throw error; // Throw if out of retries or it's a different error
            }
        }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Provide a more user-friendly error if it's a persistent quota issue
    if (error.message?.includes('429') || error.message?.includes('Quota')) {
        throw new Error("The AI is currently receiving too many requests. Please wait a moment and try again.");
    }
    throw new Error(error.message || "Failed to get a response from the persona. Please check your connection.");
  }
};
