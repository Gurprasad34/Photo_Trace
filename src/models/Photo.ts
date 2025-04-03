import mongoose, { Schema, Document } from 'mongoose';

interface IPhoto extends Document {
    imageUrl?: string;
    aiResponse?: string;  // Optional field to store the AI-generated content
}

const photoSchema = new Schema<IPhoto>({
    imageUrl: { type: String, required: false },
    aiResponse: { type: String }  // Optional field for AI response
});

const Photo = mongoose.model<IPhoto>('Photo', photoSchema);

export default Photo;