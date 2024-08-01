import { NotificationService } from "../../application/use-case/notification";
import { INotification } from "../../domain/entities/INotification";

class NotificationController {
    private notificationService: NotificationService;

    constructor(){
        this.notificationService = new NotificationService();
    }

    async addNotification(data:INotification){
        try {
            const result = await this.notificationService.addNotification(data);
            return result;
        } catch (error) {
            console.error("Error adding new notification:", error);
            throw error;
        }
    }

    async getNotification(data:{userId:string}){
        try {
            const userId = data.userId;
            const result = await this.notificationService.fetchNotification(userId);
            return result;
        } catch (error) {
            console.error("Error fetching notification:", error);
            throw error;
        }
    }
}

export const notificationController = new NotificationController();