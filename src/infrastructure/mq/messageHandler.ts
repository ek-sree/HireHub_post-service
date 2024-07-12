import { jobpostController } from '../../interfaces/controller/jobpostController';
import RabbitMQClient from './client';

export default class MessageHandler {
    static async handle(operation: string, data: any, correlationId: string, replyTo: string) {
        let response;

        switch (operation) {
            case 'add-new-job':
                response = await jobpostController.addNewJob(data)
                break;

                case 'get-recruiter-jobs':
                    response = await jobpostController.fetchRecruiterJobs(data);
                    break;

                case 'get-all-jobs':
                    response = await jobpostController.fetchAllJob(data);
                    break;

                case 'edit-job':
                    response = await jobpostController.editJob(data);
                    break;  
                    
                case 'apply-job':
                    response = await jobpostController.applyToJob(data);
                    break;  
                    
                case 'view-application':
                    response = await jobpostController.fetchedApplication(data);
                    break; 
                    
                case 'accept-application':
                    response = await jobpostController.acceptApplication(data)
                    break; 
                    
                case 'reject-application':
                    response = await jobpostController.rejectedApplication(data);
                    break;
                    
                case 'all-cadidates':
                    response = await jobpostController.selectedApplications(data);
                    break;    

                case 'shortlist-application':
                    response = await jobpostController.shortlistedCadidates(data);
                    break;  
                    
                case 'update-job-status':
                    response = await jobpostController.updateJobStatus(data);
                    break;    

            default:
                response = { error: "Operation not supported" };
                break;
        }
        await RabbitMQClient.produce(response, correlationId, replyTo);
    }
}
