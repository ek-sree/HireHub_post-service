import { IPost } from "../entities/IPost";

export interface IPostRepository {
    save(post:{originalname:string[],imageUrl:string[],userId:string,description:string,}):Promise<{success:boolean, message:string,data?:IPost}>
}