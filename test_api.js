import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCBKnwFV3vrX4IcaJDygQ-IDxhBD_mAIPg";
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("API Key Test Failed:", error.message);
  }
}

test();
