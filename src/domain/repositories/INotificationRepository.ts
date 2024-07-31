import { INotification } from "../entities/INotification";

export interface INotificationRepository{
    save(notification:{userId:string, postId:string,likedBy:string, notification?:string}):Promise<{success:boolean, message:string, data?:INotification}>
}