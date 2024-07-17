import mongoose from "mongoose";
import { Post } from "../../model/Post";
import { IPost, ISavePostData } from "../entities/IPost";
import { IPostRepository } from "./IPostRepository";

export class PostRepository implements IPostRepository {
    async save(post: ISavePostData): Promise<{ success: boolean; message: string; data?: IPost }> {
        try {
            console.log("Data to be saved:", post);

            const newPost = new Post({
                UserId: post.userId,
                description: post.description,
                imageUrl: post.imageUrl, 
                originalname: post.originalname,
            });

            const savedPost = await newPost.save();
            if (!savedPost) {
                return { success: false, message: "Can't save data" };
            }
            
            return { success: true, message: "Data saved successfully", data: savedPost };
        } catch (error) {
            const err = error as Error;
            console.log("Error saving posts", err);
            throw new Error(`Error saving post: ${err.message}`);
        }
    }

    async findAllPost(page:number):Promise<{success:boolean,message:string, data?:IPost[]}>{
        try {
            const limit = 2;
            const skip = (page - 1)* limit;
            const posts = await Post.find({isDelete:false}).sort({created_at: -1}).skip(skip).limit(limit);
            if(!posts){
                return {success:false, message:"No posts found"}
            }
            return {success:true, message:"Posts found", data:posts}
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching all post", err);
            throw new Error(`Error fetching post: ${err.message}`);
        }
    }

    async findUserPosts(userId: string): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const userIdStr = String(userId);
    
            const posts = await Post.find({ UserId: userIdStr }).sort({ created_at: -1 });
            if (!posts || posts.length === 0) {
                return { success: false, message: "No posts found" };
            }    
            return { success: true, message: "Posts found", data: posts };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching users post", err);
            throw new Error(`Error fetching users post: ${err.message}`);
        }
    }

    async updateLikePost(postId:string, userId:string): Promise<{success:boolean, message:string, data?:{userId:string, createdAt:Date}[]}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"No post found"}
            }
            
            console.log("Likes id",userId);
            if(!post.likes){
                post.likes = [];
            }
            const alreadyLiked = post.likes.some(like => like.userId === userId);
            if (alreadyLiked) {
                return { success: false, message: "User has already liked this post" };
            }
    
            post.likes.push({ userId, createdAt: new Date() });
            await post.save();
            return {success:true, message:"post liked",data:post.likes}
        } catch (error) {
            const err = error as Error;
            console.log("Error updating likes users post", err);
            throw new Error(`Error updating likes users post: ${err.message}`);
        }
    }

    async updateUnlikePost(postId:string, userId:string):Promise<{success:boolean, message:string, data?:{userId:string, createdAt:Date}[]}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false,  message:"No post found"}
            }
            post.likes =  post.likes?.filter((like)=>like.userId!==userId);
            await post.save();
            return {success:true, message:"Unliked post", data:post.likes}
        } catch (error) {
            const err = error as Error;
            console.log("Error updating unlikes users post", err);
            throw new Error(`Error updating unlikes users post: ${err.message}`);
        }
    }
}
