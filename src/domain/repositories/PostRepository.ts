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

    async findAllPost():Promise<{success:boolean,message:string, data?:IPost[]}>{
        try {
            const posts = await Post.find({isDelete:false}).sort({created_at: -1});
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
}
