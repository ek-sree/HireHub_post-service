import { Post } from "../../model/Post";
import { IAdmin } from "../entities/IAdmin";
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
}