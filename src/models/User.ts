import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    email: string;
    displayName: string;
    profilePicture?: string;
}

const userSchema = new Schema<IUser>({
    googleId: { 
        type: String,
        required: true,
        unique: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    displayName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;