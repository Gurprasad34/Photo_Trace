import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI('AIzaSyADf2BoNeTtAOYBq-q_R-dbMBAQPejpAJw');

// Define a type for the generative part
interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// Converts local file information to base64
function fileToGenerativePart(path: string, mimeType: string): GenerativePart {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function run(): Promise<void> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  console.log(genAI);
  
  const prompt: string = "Write an advertising jingle showing how the product in the first image could solve the problems shown in the second two images.";

  const imageParts: GenerativePart[] = [
    fileToGenerativePart("./pictures/Camden_Yards.jpg", "image/jpeg"),
  ];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);
  
  console.log(generatedContent.response.text());
}

run();
