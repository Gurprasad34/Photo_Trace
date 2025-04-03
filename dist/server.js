var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
// import connectDB from './config/connection.js';  // Import database connection
import routes from './routes/index.js'; // Import routes from index file in the routes folder
dotenv.config();
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });
// Function to convert file to GenerativePart
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString('base64'),
            mimeType,
        },
    };
}
app.post('/api/analyze-image', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = 'Where was this photo taken? Explain your reasoning.';
        const imageParts = [fileToGenerativePart(req.file.path, req.file.mimetype)];
        const generatedContent = yield model.generateContent([prompt, ...imageParts]);
        const result = generatedContent.response.text();
        return res.json({ result });
    }
    catch (error) {
        console.error('Error analyzing image:', error);
        return res.status(500).json({ error: 'Error analyzing image' });
    }
}));
// Connect to the database and start the server
(() => __awaiter(void 0, void 0, void 0, function* () {
    // await connectDB();
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
}))();
