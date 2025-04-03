var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
            mimeType,
        },
    };
}
export const uploadPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure `req.file` is correctly inferred
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = 'Where was this photo taken? Explain your reasoning.';
        const imageParts = [fileToGenerativePart(file.path, file.mimetype)];
        const generatedContent = yield model.generateContent([prompt, ...imageParts]);
        const result = generatedContent.response.text();
        return res.json({ result });
    }
    catch (error) {
        console.error('Error analyzing image:', error);
        return res.status(500).json({ error: 'Error analyzing image' });
    }
});
