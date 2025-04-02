import { Request, Response } from 'express';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Photo from '../models/Photo';

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to convert image from URL to base64
async function imageUrlToBase64(imageUrl: string) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const base64Image = Buffer.from(response.data).toString('base64');
  return base64Image;
}

// Upload a new photo and process with Google Gemini AI
export const uploadPhoto = async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        // Create a new photo record in your database
        const photo = new Photo({ imageUrl });
        await photo.save();

        // Fetch the image and convert it to base64
        const base64Image = await imageUrlToBase64(imageUrl);

        // Create a file part to send to the Gemini API
        const imageParts = [
            {
                inlineData: {
                    data: base64Image,
                    mimeType: 'image/jpeg',
                },
            },
        ];

        const prompt = "Create an interesting caption or description for the uploaded image.";

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const generatedContent = await model.generateContent([prompt, ...imageParts]);

        // Store the AI-generated content in the photo document
        photo.aiResponse = generatedContent.response.text();
        await photo.save();

        // Return the photo data and AI-generated content in the response
        res.status(201).json({
            photo,
            aiResponse: generatedContent.response.text(),
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload photo and process with AI' });
    }
};