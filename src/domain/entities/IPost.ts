import { Document } from 'mongoose';

export interface IPost extends Document {
    UserId: string;
    imageUrl: string[];
    originalname: string[];
    description: string;
    isDelete: boolean;
    likes: string[];
    comments: string[];
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