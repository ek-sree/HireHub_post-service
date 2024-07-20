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
}

export const adminController = new AdminController();