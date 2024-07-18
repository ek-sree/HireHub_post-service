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

    async likePost(data:{postId:string, UserId:string}){
        try {
            const postId = data.postId;
            const UserId = data.UserId;
            console.log("userID like",UserId);
            
            const result = await this.postService.likePost(postId,UserId);
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

    async addComments(data:{postId:string, UserId:string, comments:string}){
        try {
            const postId = data.postId;
            const UserId = data.UserId;
            const comments = data.comments;
            const result = await this.postService.addComment(postId,UserId,comments)
            return result;
        } catch (error) {
            console.error("Error comments user posts:", error);
            throw error;
        }
    }

    async fetchedComments(data:{postId:string}){
        try {
            const postId = data.postId;
            console.log("postId comment fetch",postId);
            const result = await this.postService.fetchComments(postId);
            return result;
        } catch (error) {
            console.error("Error fetching comments user posts:", error);
            throw error;
        }
    }

    async deleteComment(data:{id:string, postId:string}){
        try {
            console.log("delete datass",data);
            
            const id = data.id;
            const postId = data.postId;
            const result = await this.postService.removeComment(id,postId);
            return result;
        } catch (error) {
            console.error("Error delet comments :", error);
            throw error;
        }
    }

    async deletePost(data:{postId:string, imageUrl:string}){
        try {
            const postId = data.postId;
            const imageUrl = data.imageUrl;
            const result = await this.postService.removePost(postId,imageUrl);
            return result;
        } catch (error) {
            console.error("Error delet posts :", error);
            throw error;
        }
    }
}

export const postController = new PostController();
