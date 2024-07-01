import { jobpostService } from "../../application/use-case/jobpost";
import { IJobpost } from "../../domain/entities/IJobpost";

class JobpostController {
    private readonly jobpostServiceInstance = jobpostService;

    async addNewJob(data: { jobData: IJobpost }) {
        try {
            console.log("Received data in addNewJob:", data);
            const result = await this.jobpostServiceInstance.addJob(data);
            return result;
        } catch (error) {
            console.error("Error adding new job:", error);
            throw error;
        }
    }

    async fetchRecruiterJobs(data: string) {
        try {
            const result = await jobpostService.getRecruiterJobs(data);
            return result;
        } catch (error) {
            console.error("Error fetching all job:", error);
            throw error;
        }
    }

    async fetchAllJob() {
        try {
            const result = await jobpostService.getAllJobs();
            return result;
        } catch (error) {
            console.log("Error fetching all job:",error);
            throw error;
        }
    }

    async editJob(data: { jobData: IJobpost}) {
        try {
            const result = await jobpostService.editJob(data);
            return result;
        } catch (error) {
            console.error("Error editing job:", error);
            throw error;
        }
    }
}

export const jobpostController = new JobpostController();
