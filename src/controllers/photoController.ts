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

    // This is switch statement to set the prompt based on promptType
    switch (promptType) {
        case "prompt2":
            prompt = "Use context clues from this image to guess when it was taken. Please be specific and respond with at least one specific month and year.";
            break;
        case "prompt3":
            prompt = "Give a detailed description of this image, and be a little humorous and creative.";
            break;
        default:
            prompt = "Use context clues from this image to guess where it was taken. Please be specific and respond with at least one specific location.";  // Default prompt
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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

// Serve an image by its ID
export const serveImage = async (req: Request, res: Response) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }

        if (!fs.existsSync(photo.imagePath)) {
            return res.status(404).json({ error: "Image file not found" });
        }

        return res.sendFile(photo.imagePath, { root: '.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to serve image" });
    }
};