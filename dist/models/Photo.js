import mongoose, { Schema } from 'mongoose';
const photoSchema = new Schema({
    imageUrl: { type: String, required: true },
    aiResponse: { type: String } // Optional field for AI response
});
const Photo = mongoose.model('Photo', photoSchema);
export default Photo;
