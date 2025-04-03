import express, { Request, Response } from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
// import connectDB from './config/connection.js';  // Import database connection
import routes from './routes/index.js';  // Import routes from index file in the routes folder

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to convert file to GenerativePart
function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}

// API endpoint to analyze image
interface MulterRequest extends Request {
  file?: Express.Request['file'];
}

app.post('/api/analyze-image', upload.single('image'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = 'Where was this photo taken? Explain your reasoning.';
    const imageParts = [fileToGenerativePart(req.file.path, req.file.mimetype)];

    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    const result = generatedContent.response.text();

    return res.json({ result });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({ error: 'Error analyzing image' });
  }
});

// Connect to the database and start the server
(async () => {
  // await connectDB();
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
})();
