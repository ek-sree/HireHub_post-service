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
}

export const notificationController = new NotificationController();