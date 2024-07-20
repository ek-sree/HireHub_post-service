import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    UserId: string;
    imageUrl: string[];
    originalname: string[];
    description: string;
    isDelete: boolean;
    likes?: Array<{
        UserId: string;
        createdAt: Date;
    }>;
    comments?: Array<{
        _id?: mongoose.Types.ObjectId;
        UserId: string;
        content: string;
        createdAt: Date;
    }>;
    reportPost?: Array<{
        UserId: string;
        reason: string;
    }>
    created_at: Date;
}


export interface IAddPostData {
    userId: string;
    text?: string;
    images?: {
        buffer: Buffer;
        originalname: string;
    }[];
}

export interface ISavePostData {
    userId: string;
    description?: string;
    imageUrl?: string[];
    originalname?: string[];
}