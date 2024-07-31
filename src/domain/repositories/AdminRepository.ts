import mongoose from "mongoose";
import { Jobpost } from "../../model/Jobpost";
import { Post } from "../../model/Post";
import { IAdmin } from "../entities/IAdmin";
import { IPost } from "../entities/IPost";
import { IAdminRepository } from "./IAdminRepository";

export class AdminRepository implements IAdminRepository {
   
    async findAllReportedPosts(page: number, limit: number, sortOrder: string): Promise<{ success: boolean; message: string; data?: IAdmin[]; totalPosts?: number }> {
        try {
            const skip = (page - 1) * limit;
            const sortCriteria: { [key: string]: 1 | -1 } = {
                reportPostCount: sortOrder === "most-reported" ? -1 : 1
            };
    
            const [posts, totalCount] = await Promise.all([
                Post.aggregate([
                    { $match: { reportPost: { $exists: true, $ne: [] } }},
                    { $project: {
                        _id: 1,
                        UserId: 1,
                        imageUrl: 1,
                        description: 1,
                        reportPost: 1,
                        created_at: 1,
                        reportPostCount: { $size: "$reportPost" }
                    }},
                    { $sort: sortCriteria },
                    { $skip: skip },
                    { $limit: limit }
                ]),
                Post.countDocuments({ reportPost: { $exists: true, $ne: [] } })
            ]);
    
            if (posts.length === 0) {
                return { success: false, message: "No posts found" };
            }
    
            const transformedPosts: IAdmin[] = posts.map(post => ({
                _id: post._id,
                UserId: post.UserId,
                imageUrl: post.imageUrl,
                description: post.description,
                reportPost: post.reportPost,
                created_at: post.created_at
            }));
    
            return {
                success: true,
                message: "Reported posts retrieved successfully",
                data: transformedPosts,
                totalPosts: totalCount
            };
    
        } catch (error) {
            const err = error as Error;
            console.error("Error retrieving reported posts", err);
            return {
                success: false,
                message: `Error retrieving reported posts: ${err.message}`
            };
        }
    }

    async findPostsForReports(): Promise<{success: boolean, message:string, totalPosts:number}>{
        try {
            const totalPosts = await Post.countDocuments();
            return{success:true, message:"Post count found",totalPosts}
        } catch (error) {
            const err = error as Error;
            console.error("Error retrieving  posts", err);
            throw new Error(`Error fetching posts ${err}`);
        }
    }

    async findJobPostForReports():Promise<{success:boolean, message:string, totalJobPost:number}>{
        try {
            const totalJobPost = await Jobpost.countDocuments();
            return{success:true, message:"Job post found", totalJobPost}
        } catch (error) {
            const err = error as Error;
            console.error("Error retrieving  job posts", err);
            throw new Error(`Error fetching job posts ${err}`);
        }
    }

    async updateReportPost(postId:string):Promise<{success:boolean, message:string, data?:IPost[]}>{
        try {
            const post = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)});
            if(!post){
                return {success:false, message:"No posts found"}
            }
            post.reportPost = [];
            await post.save();
            return {success:true, message:"Cleared reports", data:[post]}
        } catch (error) {
            const err = error as Error;
            console.error("Error clearing reported post", err);
            throw new Error(`Error clearing reported post ${err}`);
        }
    }
}