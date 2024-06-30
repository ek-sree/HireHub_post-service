import { jobpostService } from "../../application/use-case/jobpost";
import { IJobpost } from "../../domain/entities/IJobpost";

class JobpostController {
    private readonly jobpostServiceInstance = jobpostService;

    async addNewJob(data: IJobpost) {
        try {
            const result = await this.jobpostServiceInstance.addJob(data);
            return result;
        } catch (error) {
            console.error("Error adding new job:", error);
            throw error;
        }
    }
}

export const jobpostController = new JobpostController();
