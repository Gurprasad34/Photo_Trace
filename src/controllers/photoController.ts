import { Request, Response } from 'express';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

function fileToGenerativePart(filePath: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    // Ensure `req.file` is correctly inferred
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = 'Where was this photo taken? Explain your reasoning.';
    const imageParts = [fileToGenerativePart(file.path, file.mimetype)];

    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    const result = generatedContent.response.text();

    return res.json({ result });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({ error: 'Error analyzing image' });
  }
};