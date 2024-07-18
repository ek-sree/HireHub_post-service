import mongoose, { Document, Schema } from "mongoose";
import { IPost } from "../domain/entities/IPost";

export interface IPostDocument extends IPost, Document {}

const postSchema: Schema = new Schema({
    UserId: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: [String],
    },
    originalname: {
        type: [String],
    },
    description: {
        type: String,
    },
    likes: [
        {
            UserId: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    comments: [
        {
            _id: { type: Schema.Types.ObjectId, auto: true },
            UserId: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    isDelete: {
        type: Boolean,
        default: false,
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

export const Post = mongoose.model<IPostDocument>("Post", postSchema);
