import { IAddPostData, IPost, ISavePostData } from "../../domain/entities/IPost";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { fetchFileFromS3, uploadFileToS3 } from "../../infrastructure/s3/s3Actions";
import { Document } from 'mongoose';

class PostService {
    private postRepo: PostRepository;

    constructor() {
        this.postRepo = new PostRepository();
    }

    async addPost(post: IAddPostData): Promise<{ success: boolean; message: string; data?: IPost }> {
        try {
            let imageUrls: string[] = [];
            let originalNames: string[] = [];

            if (post.images && post.images.length > 0) {
                imageUrls = await Promise.all(
                    post.images.map(async (image) => {
                        const buffer = Buffer.isBuffer(image.buffer) ? image.buffer : Buffer.from(image.buffer);
                        const imageUrl = await uploadFileToS3(buffer, image.originalname);
                        return imageUrl;
                    })
                );
                originalNames = post.images.map((image) => image.originalname);
            }

            const newPost: ISavePostData = {
                userId: post.userId,
                description: post.text,
                imageUrl: imageUrls,
                originalname: originalNames,
            };

            const result = await this.postRepo.save(newPost);
            if (!result.success) {
                return { success: false, message: "Data not saved, error occurred" };
            }
            return { success: true, message: "Data successfully saved", data: result.data };
        } catch (error) {
            console.error("Error in addPost:", error);
            throw new Error(`Error saving post: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async getAllPosts(): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.findAllPost();
            if (!result.success || !result.data) {
                return { success: false, message: "No data found" };
            }
    
            const postsWithImages = await Promise.all(result.data.map(async (post) => {
                if (post.imageUrl && post.imageUrl.length > 0) {
                    const imageUrls = await Promise.all(post.imageUrl.map(async (imageKey) => {
                        const s3Url = await fetchFileFromS3(imageKey, 604800);
                        return s3Url;
                    }));
    
                    const plainPost = (post as Document).toObject();
    
                    return {
                        ...plainPost,
                        imageUrl: imageUrls,
                    };
                }
                return post;
            }));
    
            return { success: true, message: "Images and all data sent", data: postsWithImages };
        } catch (error) {
            console.error("Error in getAllPosts:", error);
            throw new Error(`Error fetching posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async getUserPosts(userId:string):Promise<{success:boolean, message:string, data?:IPost[]}>{
        try {
            const result = await this.postRepo.findUserPosts(userId);
            if(!result.success || !result.data){
                return {success:false, message:"No posts found"}
            }
            const postsWithImages = await Promise.all(result.data?.map(async (post)=>{
                if(post.imageUrl && post.imageUrl.length > 0){
                    const imageUrls = await Promise.all(post.imageUrl.map(async (imageKey)=>{
                        const s3Url = await await fetchFileFromS3(imageKey, 604800);
                        return s3Url
                    }))
                    const plainPost = (post as Document).toObject();
                    return {
                        ...plainPost, imageUrl: imageUrls,
                    };
                }
                return post;
            }))
            return { success: true, message: "Images and user datas sent", data: postsWithImages };

        } catch (error) {
            console.error("Error in user Posts:", error);
            throw new Error(`Error fetching user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    
}

export { PostService };
