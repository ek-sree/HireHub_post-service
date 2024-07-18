import { jobpostController } from '../../interfaces/controller/jobpostController';
import { postController } from '../../interfaces/controller/postController';
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

                case 'create-post':
                    response = await postController.addPost(data);
                    break;    

                case 'get-all-posts':
                    response = await postController.fetchedAllPosts(data);
                    break; 
                    
                case 'fetch-user-posts':
                    response = await postController.fethedUserPosts(data);
                    break;    

                case 'like-post':
                    response = await postController.likePost(data);
                    break;   
                    
                case 'unlike-post':
                    response = await postController.unlikePost(data);
                    break; 
                    
                case 'add-comments':
                    response = await postController.addComments(data);
                    break;

                case 'fetch-comment':
                    response = await postController.fetchedComments(data);
                    break; 
                    
                case 'delete-comment':
                    response = await postController.deleteComment(data);
                    break;   
                    
                case 'delete-post':
                    response = await postController.deletePost(data);
                    break;    

            default:
                response = { error: "Operation not supported" };
                break;
        }
        await RabbitMQClient.produce(response, correlationId, replyTo);
    }
}
