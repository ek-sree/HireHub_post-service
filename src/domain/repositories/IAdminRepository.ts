import { IAdmin } from "../entities/IAdmin";

export interface IAdminRepository {
    findAllReportedPosts(page:number, limit:number, sortOrder:string):Promise<{success:boolean, message:string, data?:IAdmin[]}>
}