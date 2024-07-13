export interface IPost {
    UserId: string;
    imageUrl?: string[];
    originalname?: string[];
    description: string;
    likes?: { userId: string; createdAt: Date }[];
    comments?: { userId: string; content: string; created_at: Date }[];
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