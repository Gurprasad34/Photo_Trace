import { Request, Response } from 'express';
import Photo from '../models/Photo';


// Upload a new photo for a user
export const uploadPhoto = async (req: Request, res: Response) => {
    const { imageUrl, userId } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        // Create a new photo record
        const photo = new Photo({ imageUrl, user: userId });
        await photo.save();
        
        res.status(201).json(photo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to upload photo' });
    }
};

