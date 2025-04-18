import mongoose, { Schema, Document } from 'mongoose';

interface IPhoto extends Document {
    imagePath: string;
    aiResponse?: string;  // Optional field to store the AI-generated content
}

const photoSchema = new Schema<IPhoto>({
    imagePath: { type: String, required: true },
    aiResponse: { type: String }  // Optional field for AI response
});

const Photo = mongoose.model<IPhoto>('Photo', photoSchema);

export default Photo;