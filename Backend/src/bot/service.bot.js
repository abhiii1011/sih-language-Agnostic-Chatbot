import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config.bot.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Base persona instruction (can be overridden by .env PERSONA)
const SYSTEM_INSTRUCTION =
  config.PERSONA ||
  `You are ${config.BOT_NAME || "Askly"},  a college agent of Oriental, India. You are friendly and helpful.
Your job is to help students, faculty, and staff by answering their doubts and queries related to the college, such as admissions, courses, fees, results, events, facilities, and general information. Always give clear, polite, and accurate answers in a student-friendly way.`;

export async function askGemini(userPrompt) {
  try {
  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${userPrompt}\nReply:`;
  const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    return "Sorry, something went wrong with AI.";
  }
}