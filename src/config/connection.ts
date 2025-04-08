import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB database connected.");
    } catch (error) {
        console.error("MongoDB database connection error:", error);
        throw new Error("MongoDB database connection failed.");
    }
};

export default db;
