import { Document } from 'mongoose';

export interface IPost extends Document {
    UserId: string;
    imageUrl: string[];
    originalname: string[];
    description: string;
    isDelete: boolean;
    likes?: Array<{
        userId: string;
        createdAt: Date;
    }>;
    comments?: Array<{
        userId: string;
        content: string;
        created_at: Date;
    }>;
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