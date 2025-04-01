import { Schema, Types } from 'mongoose';
import { dateFormat } from '../utils/dateFormat.js';
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // FIX THIS BUG
        get: (timestamp) => dateFormat(timestamp),
    },
}, {
    toJSON: {
        getters: true,
    },
    timestamps: true,
    id: false,
});
export default reactionSchema;
