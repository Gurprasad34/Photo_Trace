import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import fileUploader from 'models/uploader';


const genAI = new GoogleGenerativeAI("AIzaSyCG-BDxEUfYkZ7BV0DTZ1eVOmXTp7McD3g");

// Converts local file information to base64
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
console.log(genAI)
  const prompt = "Provide an estimated guess for where this photograph was taken. Explain your reasoning";

  const imageParts = [
    fileToGenerativePart("./pictures/Camden_Yards.jpg", "image/jpeg"),
  ];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);
  
  console.log(generatedContent.response.text());
}

run();