import { IAddPostData } from "../../domain/entities/IPost";
import { PostService } from "../../application/use-case/post";

class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    async addPost(data: IAddPostData) {
        try {
            console.log("Data reached here:", data);
            console.log("images",data.images);
            
            const result = await this.postService.addPost(data);
            return result;
        } catch (error) {
            console.error("Error adding new post:", error);
            throw error;
        }
    }

    async fetchedAllPosts(data:{page:number}){
        try {
            const page = data.page;
            const result = await this.postService.getAllPosts(page);
            return result;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    }

    async fethedUserPosts(data:{userId:string}){
        try {
            const userId = data.userId;
            const result = await this.postService.getUserPosts(userId);
            return result;
        } catch (error) {
            console.error("Error fetching user posts:", error);
            throw error;
        }
    }

    async likePost(data:{postId:string, userId:string}){
        try {
            const postId = data.postId;
            const userId = data.userId;
            console.log("userID like",userId);
            
            const result = await this.postService.likePost(postId,userId);
            return result;
        } catch (error) {
            console.error("Error liking user posts:", error);
            throw error;
        }
    }

    async unlikePost(data:{postId:string, userId:string}){
        try {
            const postId = data.postId;
            const userId = data.userId;
            const result = await this.postService.unlikePost(postId,userId);
            return result;
        } catch (error) {
            console.error("Error unliking user posts:", error);
            throw error;
        }
    }
}

export const postController = new PostController();
