import { IAddPostData, IPost, ISavePostData } from "../../domain/entities/IPost";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { deleteFileFromS3, fetchFileFromS3, uploadFileToS3 } from "../../infrastructure/s3/s3Actions";
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

    async getAllPosts(page:number): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.findAllPost(page);
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

    async likePost(postId:string, UserId:string,postUser:string):Promise<{success:boolean, message:string,data?:{UserId:string, createdAt:Date}[]}>{
        try {
            const result = await this.postRepo.updateLikePost(postId,UserId,postUser);
            if(!result.success || !result.data){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error in liking user Posts:", error);
            throw new Error(`Error liking user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async unlikePost(postId:string, userId:string):Promise<{success:boolean, message:string, data?:{UserId:string, createdAt:Date}[]}>{
        try {
            const result = await this.postRepo.updateUnlikePost(postId, userId);
            if(!result.data || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error in unliking user Posts:", error);
            throw new Error(`Error unliking user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async addComment(postId:string,UserId:string, comments:string):Promise<{success:boolean, message:string, data?:{UserId:string, content:string,isEdited:boolean,createdAt:Date}[]}>{
        try {
            const result = await this.postRepo.createComment(postId, UserId, comments);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error in commenting user Posts:", error);
            throw new Error(`Error commenting user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async fetchComments(postId:string):Promise<{success:boolean, message:string, data?:{UserId:string, content:string,isEdited:boolean,createdAt:Date}[]}>{
        try {
            const result = await this.postRepo.findComments(postId);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error fetching comment user Posts:", error);
            throw new Error(`Error fetching comment user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async removeComment(id:string, postId:string):Promise<{success:boolean, message:string, data?:{UserId:string, content:string, createdAt:Date}[]}>{
        try {
            const result = await this.postRepo.deleteComment(id,postId);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw new Error(`Error deleting comment: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async removePost(postId: string, imageUrl: string): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.deletePost(postId);
            if (!result || !result.success) {
                return { success: result.success, message: result.message };
            }
    
            console.log("Deleting from S3:", imageUrl);
            const response = await deleteFileFromS3(imageUrl);
    
            if (!response.success) {
                return { success: false, message: "Can't delete file from S3" };
            }
    
            return { success: true, message: result.message, data: result.data };
        } catch (error) {
            console.error("Error deleting posts:", error);
            throw new Error(`Error deleting posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    
    async reportPost(postId:string, UserId:string, reason:string):Promise<{success:boolean, message:string}>{
        try {
            const result = await this.postRepo.reportPost(postId, UserId, reason);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message}
        } catch (error) {
            console.error("Error reporting posts:", error);
            throw new Error(`Error reporting posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async editPost(postId:string, description:string):Promise<{success:boolean, message:string, data?:IPost[]}>{
        try {
            const result = await this.postRepo.updatePost(postId,description);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error editing user posts:", error);
            throw new Error(`Error editing user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async editComment(id: string, postId: string, content: string): Promise<{ success: boolean, message: string, data?: { UserId: string, content: string,isEdited:boolean, createdAt: Date }[] }>{
        try {
            const result = await this.postRepo.updateComment(id,postId, content);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:result.success, message:result.message, data:result.data}
        } catch (error) {
            console.error("Error editing user comments:", error);
            throw new Error(`Error editing user comments: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    
}

export { PostService };
