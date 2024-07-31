import { AdminService } from "../../application/use-case/admin";

class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService()
    }

    async getReportedPosts(data:{page:number, limit:number, sortOrder:string}){
        try {
            const page = data.page;
            const limit = data.limit;
            const sortOrder = data.sortOrder;
            const result = await this.adminService.fetchRepostPost(page,limit, sortOrder);
            return result;
        } catch (error) {
            console.error("Error geting reported posts:", error);
            throw error;
        }
    }

    async getPostsReposts(){
        try {
            const result = await this.adminService.fetchPostForReport();
            return result;
        } catch (error) {
            console.error("Error geting  posts:", error);
            throw error;
        }
    }

    async getJobReports(){
        try {
            const result = await this.adminService.fetchJobPostForReport();
            return result;
        } catch (error) {
            console.error("Error geting  job posts:", error);
            throw error;
        }
    }

    async clearPostReports(data:{postId:string}){
        try {
            const postId = data.postId;
            const result = await this.adminService.clearedReposts(postId);
            return result;
        } catch (error) {
            console.error("Error clearing reported posts:", error);
            throw error;
        }
    }
}

export const adminController = new AdminController();