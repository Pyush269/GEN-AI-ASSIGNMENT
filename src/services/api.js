import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const sendMessage = async (persona, message, history) => {
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
    const apiHistory = history
      .map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
      .filter((msg, index, arr) => {
        if (index === 0 && msg.role === "model") return false;
        return true;
      });

    const chat = model.startChat({
      history: apiHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to get a response from the persona. Please check your connection.");
  }
};
