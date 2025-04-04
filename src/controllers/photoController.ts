import { Request, Response } from 'express';
import fs from 'fs';
import Photo from '../models/Photo.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Converts local file information to base64 so it can be processed by Gemini
function fileToGenerativePart(filePath: string, mimeType: string) {
    return {
        inlineData: {
            data: fs.readFileSync(filePath).toString("base64"),
            mimeType,
        },
    };
}

// Upload an image and process it with Google Gemini, with multiple prompts based on user input
// @ts-ignore
export const uploadPhoto = async (req: Request, res: Response) => {
    console.log(req.file);

    // Ensure an image file is provided
    if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
    }

    const promptType = req.body.promptType || "prompt1";  // Default to "prompt1" if none is provided

    let prompt;

    // Thius is switch statement to set the prompt based on promptType
    switch (promptType) {
        case "prompt2":
            prompt = "Explain this image with humour";
            break;
        case "prompt3":
            prompt = "Describe this image like its shakespeare";
            break;
        default:
            prompt = "Describe what you see in this image";  // Default prompt
            break;
    }


    try {
        const imagePath = req.file.path;  // Get uploaded file path
        const mimeType = req.file.mimetype;  // Get file MIME type

        // Store image in MongoDB
        const photo = new Photo({ imagePath });
        await photo.save();

        // Prepare image for Gemini AI
        const imageParts = [fileToGenerativePart(imagePath, mimeType)];

        // Generate AI content based on the selected prompt
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const generatedContent = await model.generateContent([prompt, ...imageParts]);

        const aiResponse = generatedContent.response.text();

        // Update the database with AI-generated content
        photo.aiResponse = aiResponse;
        await photo.save();

        // Return response with the AI content
        res.status(201).json({ photo });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process image with AI" });
    }
};