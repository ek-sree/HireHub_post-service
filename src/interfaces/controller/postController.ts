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

    async fetchedAllPosts(){
        try {
            const result = await this.postService.getAllPosts();
            return result;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    }
}

export const postController = new PostController();
