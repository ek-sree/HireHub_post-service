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
            userId: {
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
            userId: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            created_at: {
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
