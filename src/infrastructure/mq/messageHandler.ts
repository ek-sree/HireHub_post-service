import { jobpostController } from '../../interfaces/controller/jobpostController';
import RabbitMQClient from './client';

export default class MessageHandler {
    static async handle(operation: string, data: any, correlationId: string, replyTo: string) {
        let response;

        switch (operation) {
            case 'add-new-job':
                response = await jobpostController.addNewJob(data)
                break;

            default:
                response = { error: "Operation not supported" };
                break;
        }
        await RabbitMQClient.produce(response, correlationId, replyTo);
    }
}
