import { IAdmin } from "../../domain/entities/IAdmin";
import { AdminRepository } from "../../domain/repositories/AdminRepository";
import { fetchFileFromS3 } from "../../infrastructure/s3/s3Actions";

class AdminService {
    private adminRepo : AdminRepository;

    constructor(){
        this.adminRepo = new AdminRepository();
    }

    async fetchRepostPost(page:number, limit:number, sortOrder:string):Promise<{success:boolean, message:string, data?:IAdmin[]}>{
        try {
            const result  = await this.adminRepo.findAllReportedPosts(page,limit, sortOrder);
            if(!result || !result.success || !result.data){
                return {success:result.success, message:result.message}
            }
            const postsWithImages = await Promise.all(result.data.map(async(post)=>{
                if(post.imageUrl && post.imageUrl.length > 0) {
                    const imageUrls = await Promise.all(post.imageUrl.map(async(imageKey)=>{
                        const s3Url = await fetchFileFromS3(imageKey, 604800);
                        return s3Url;
                    }))
                    return { ...post, imageUrl:imageUrls};
                }
                return post;
            }))
            return {success:true, message:"Images and al data sent", data:postsWithImages as IAdmin[]}
        } catch (error) {
            console.error("Error in fetching reported posts:", error);
            throw new Error(`Error getting reported posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}

export { AdminService }