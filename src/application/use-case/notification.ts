import { INotification } from "../../domain/entities/INotification";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { fetchFileFromS3 } from "../../infrastructure/s3/s3Actions";
import { INotificationDocument } from "../../model/Notification";

class NotificationService{
    private notificationRepo: NotificationRepository;
    private postRepo: PostRepository;

    constructor(){
        this.notificationRepo = new NotificationRepository();
        this.postRepo = new PostRepository();
    }

    async addNotification(notification: INotification): Promise<{ success: boolean, message: string, data?: any }> {
        try {
            const result = await this.notificationRepo.save(notification);
            
            if (result && result.data) {
                if (result.data.postId) {
                    const postId = result.data.postId;
                    const response = await this.postRepo.postNotification(postId);
                    if (response && response.data) {
                        const postImage = await fetchFileFromS3(response.data);
                        
                        const plainNotification = 'toObject' in result.data
                            ? (result.data as INotificationDocument).toObject()
                            : result.data;
                        
                        const combinedData = { ...plainNotification, postImage };
                        
                        return { success: true, message: "Data and image retrieved", data: combinedData };
                    }
                }
            }
            return { success: false, message: "Notification saved but no post image found" };
        } catch (error) {
            console.error("Error in addNotification:", error);
            throw new Error(`Error saving notification: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async fetchNotification(userId: string): Promise<{ success: boolean, message: string, data?: any }> {
        try {
            const result = await this.notificationRepo.findNotifications(userId);
            if (result && result.data) {
                const postIds = result.data.map(notification => notification.postId);
                const response = await this.postRepo.postNotifications(postIds);
    
                if (response && response.data) {
                    const imageUrls = response.data;
                    const fetchedImagesPromises = imageUrls.map(url => fetchFileFromS3(url));
                    const fetchedImages = await Promise.all(fetchedImagesPromises);
    
                    const combinedData = result.data.map((notification, index) => {
                        const plainNotification = (notification as any).toObject ? (notification as any).toObject() : notification;
                        return {
                            ...plainNotification,
                            postImage: fetchedImages[index]
                        };
                    });    
                    return { success: true, message: "Notifications and images retrieved", data: combinedData };
                }
            }
            return { success: false, message: "Notifications fetched but no post images found" };
        } catch (error) {
            console.error("Error in fetching notifications:", error);
            throw new Error(`Error fetching notifications: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    
}

export {NotificationService}