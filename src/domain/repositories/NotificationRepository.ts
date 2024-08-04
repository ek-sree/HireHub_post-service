import { Notification } from "../../model/Notification";
import { INotification } from "../entities/INotification";
import { INotificationRepository } from "./INotificationRepository";

export class NotificationRepository implements INotificationRepository{
    async save(notification: { userId: string; postId: string;likedBy:string, notification?: string; }): Promise<{ success: boolean; message: string; data?: INotification; }> {
        try {            
            const newNotification = new Notification({
                userId: notification.userId,
                postId: notification.postId,
                likedBy:notification.likedBy,
                notification:notification.notification || ''
            })
            const savedNotification = await newNotification.save();
            if(!savedNotification){
                return {success:false, message:"Cant save notification data"}
            }
            
            return {success:true, message:"saved successfully", data:savedNotification}
        } catch (error) {
            const err = error as Error;
            console.log("Error saving notification", err);
            throw new Error(`Error saving notification: ${err.message}`);
        }
    }

    async findNotifications(userId:string):Promise<{success:boolean, message:string, data?:INotification[]}>{
        try {
            const notifications = await Notification.find({userId})            
            if (!notifications || notifications.length === 0) {
                return { success: false, message: "No notifications found" };
            }
            
            return {success:true, message:"Notification fetched", data:notifications}
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching notification", err);
            throw new Error(`Error fetching notification: ${err.message}`);
        }
    }
}