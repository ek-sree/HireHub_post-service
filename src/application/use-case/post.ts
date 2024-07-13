import { IAddPostData, IPost, ISavePostData } from "../../domain/entities/IPost";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { uploadFileToS3 } from "../../infrastructure/s3/s3Actions";

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
}

export { PostService };
