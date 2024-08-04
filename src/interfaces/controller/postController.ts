import { IAddPostData } from "../../domain/entities/IPost";
import { PostService } from "../../application/use-case/post";

class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    async addPost(data: IAddPostData) {
        try {
            
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

    async likePost(data:{postId:string, UserId:string, postUser:string}){
        try {
            const postId = data.postId;
            const UserId = data.UserId;
            const postUser = data.postUser
            
            const result = await this.postService.likePost(postId,UserId, postUser);
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
            const result = await this.postService.fetchComments(postId);
            return result;
        } catch (error) {
            console.error("Error fetching comments user posts:", error);
            throw error;
        }
    }

    async deleteComment(data:{id:string, postId:string}){
        try {            
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

    async postReport(data:{postId:string, UserId:string, reason:string}){
        try {
            const postId = data.postId;
            const UserId = data.UserId;
            const reason = data.reason;
            const result = await this.postService.reportPost(postId,UserId, reason);
            return result;
        } catch (error) {
            console.error("Error report posts :", error);
            throw error;
        }
    }

    async updatePost(data:{postId:string, description:string}){
        try {
            const postId = data.postId;
            const description = data.description;
            const result = await this.postService.editPost(postId,description)
            return result;
        } catch (error) {
            console.error("Error updating posts :", error);
            throw error;
        }
    }

    async editComment(data:{id:string, postId:string, content:string}){
        try {
            const id = data.id;
            const postId = data.postId;
            const content = data.content;
            const result = await this.postService.editComment(id,postId,content);
            return result;
        } catch (error) {
            console.error("Error updating comment :", error);
            throw error;
        }
    }
}

export const postController = new PostController();
