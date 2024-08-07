import mongoose from "mongoose";
import { Post } from "../../model/Post";
import { IPost, ISavePostData } from "../entities/IPost";
import { IPostRepository } from "./IPostRepository";

export class PostRepository implements IPostRepository {
    async save(post: ISavePostData): Promise<{ success: boolean; message: string; data?: IPost }> {
        try {

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

    async updateLikePost(postId: string, UserId: string, postUser:string) {
        try {
          const post = await Post.findOneAndUpdate(
            { _id: postId },
            { $addToSet: { likes: { UserId,postUser, createdAt: new Date() } } },
            { new: true }
          );
      
    if (!post) {
        return { success: false, message: "Post not found" };
      }
          return { success: true, message: "Post liked", data: post.likes };
        } catch (error) {
          console.error("Error updating likes:", error);
          throw new Error("Error updating likes");
        }
      }
      
      async updateUnlikePost(postId: string, UserId: string) {
        try {
          const post = await Post.findOneAndUpdate(
            { _id: postId },
            { $pull: { likes: { UserId } } },
            { new: true }
          );

    if (!post) {
        return { success: false, message: "Post not found" };
      }
      
          return { success: true, message: "Post unliked", data: post.likes };
        } catch (error) {
          console.error("Error updating unlikes:", error);
          throw new Error("Error updating unlikes");
        }
      }

    async createComment(postId:string,UserId:string, comments:string):Promise<{success:boolean, message:string, data?:{UserId:string, content:string,isEdited:boolean,createdAt:Date}[]}>{
        try {
            
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"No post found"}
            }
            post.comments?.push({UserId, content:comments, isEdited:false, createdAt: new Date()});
            await post.save();
            return {success:true, message:"Commented successfully", data:post.comments}
        } catch (error) {
            const err = error as Error;
            console.log("Error updating comments in users post", err);
            throw new Error(`Error updating comments in users post: ${err.message}`);
        }
    }

    async findComments(postId: string): Promise<{ success: boolean, message: string, data?: { UserId: string, content: string,isEdited:boolean, createdAt: Date }[] }> {
        try {            
            const post = await Post.findById(new mongoose.Types.ObjectId(postId));
            
            if (!post) {
                return { success: false, message: "No post found" };
            }
            return { success: true, message: "Comments found", data: post.comments };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching comments in users post", err);
            throw new Error(`Error fetching comments in users post: ${err.message}`);
        }
    }

    async deleteComment(id: string, postId: string): Promise<{ success: boolean, message: string, data?: { UserId: string, content: string, createdAt: Date }[] }> {
        try {            
            const post = await Post.findOne({ _id: new mongoose.Types.ObjectId(postId) });
            if (!post) {
                return { success: true, message: "Couldn't find posts" };
            }
            post.comments = post.comments?.filter(comment => comment._id && comment._id.toString() !== id);
            await post.save();
            return { success: true, message: "Comment deleted", data: post.comments };
        } catch (error) {
            const err = error as Error;
            console.log("Error deleting comment", err);
            throw new Error(`Error deleting comment: ${err.message}`);
        }
    }

    async deletePost(postId:string):Promise<{success:boolean, message:string, data?:IPost[]}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"no post found"}
            }
            const deletedPost: IPost = post.toObject(); 
            await Post.deleteOne({ _id: postId });
            return {success:true, message:"Post deleted successfully", data:[deletedPost]}
        } catch (error) {
            const err = error as Error;
            console.log("Error deleting posts", err);
            throw new Error(`Error deleting posts: ${err.message}`);
        }
    }

    async reportPost(postId:string, UserId:string, reason:string): Promise<{success:boolean, message:string}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"No post found"}
            }
            post.reportPost?.push({UserId, reason})
            await post.save();
            return {success:true, message:"Reported successfully"}
        } catch (error) {
            const err = error as Error;
            console.log("Error reporting posts", err);
            throw new Error(`Error reporting posts: ${err.message}`);
        }
    }

    async updatePost(postId:string, description:string):Promise<{success:boolean, message:string, data?:IPost[]}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"No post found"}
            }
            post.description = description;
            await post.save();
            return {success:true, message:"Description updated succesfully", data:[post]}
        } catch (error) {
            const err = error as Error;
            console.log("Error updating user posts", err);
            throw new Error(`Error updating user posts: ${err.message}`);
        }
    }

    async updateComment(id: string, postId: string, content: string): Promise<{ success: boolean, message: string, data?: { UserId: string, content: string,isEdited:boolean, createdAt: Date }[] }> {
        try {
            const post = await Post.findOne({ _id: new mongoose.Types.ObjectId(postId) });
            if (!post) {
                return { success: false, message: "No post found" };
            }
    
            if (!post.comments) {
                return { success: false, message: "No comments found on this post" };
            }
    
            const commentIndex = post.comments.findIndex(comment => comment._id?.toString() === id);
            if (commentIndex === -1) {
                return { success: false, message: "No comment found" };
            }
    
            post.comments[commentIndex].content = content;
            post.comments[commentIndex].isEdited = true;
            await post.save();
    
            return { success: true, message: "Comment updated successfully", data: post.comments };
        } catch (error) {
            const err = error as Error;
            console.log("Error updating user comment", err);
            throw new Error(`Error updating user comment: ${err.message}`);
        }
    }

    async postNotification(postId:string):Promise<{success:boolean, message:string, data?:string}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"No post found"}
            }
            const imageUrl = post.imageUrl[0];
            return {success:true, message:"Got imageUrl", data:imageUrl}
        } catch (error) {
            const err = error as Error;
            console.log("Error getting post url", err);
            throw new Error(`Error getting post url: ${err.message}`);
        }
    }

    async postNotifications(postIds: string[]): Promise<{ success: boolean, message: string, data?: string[] }> {
        try {
            const posts = await Post.find({ _id: { $in: postIds.map(id => new mongoose.Types.ObjectId(id)) } });
            if (!posts || posts.length === 0) {
                return { success: false, message: "No posts found" };
            }
            const imageUrls = posts.map(post => post.imageUrl).flat();
            return { success: true, message: "Got imageUrls", data: imageUrls };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching notifications", err);
            throw new Error(`Error fetching notifications: ${err.message}`);
        }
    }
    
    
}
