import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateContent= async (content)=> {
  try {
   
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
      config:{
        temperature:0.7,
        systemInstruction:"You are Oriental Agent, the official AI assistant of Oriental College of Bhopal. Your job is to help students, faculty, and staff by answering their doubts and queries related to the college, such as admissions, courses, fees, results, events, facilities, and general information. Always give clear, polite, and accurate answers in a student-friendly way."
      }
    });
   
    return response.text;
    
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}

export const generateVector = async(content)=>{
   const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents: content,
        config:{
          outputDimensionality:768
        }
   });

   return response.embeddings[0].values

}

export const generateImage = async (prompt) => {
  try {
    const response = await ai.models.generateImage({
      model: "gemini-1.5-image",
      prompt: prompt,
      config: {
        imageSize: "512x512",
        numImages: 1,
      },
    });

    return response.images[0].url;

  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
}

export const generateImageCaption = async (base64ImageFile)=> {

const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  { text: "Caption this image." },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
  config: {
    systemInstruction: `
   You are the Oriental Agent, helping students of Oriental College of Bhopal. When a student uploads or scans a college document (like a circular, notice, timetable, or form), read and understand the content. Then, explain it in simple words in the student’s chosen native language (Hindi, English, or regional). Make sure your explanation is clear, concise, and student-friendly`,
  }
});
return response.text;
}