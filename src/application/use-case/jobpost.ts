import { IJobpost } from "../../domain/entities/IJobpost";
import { JobpostRepository } from "../../domain/repositories/JobpostRepository";

class JobPostService {
    private jobpostRepo: JobpostRepository;

    constructor() {
        this.jobpostRepo = new JobpostRepository();
    }

    async addJob(data: { jobData: IJobpost }): Promise<{ success: boolean, message: string, job?: IJobpost }> {
        try {
            const { jobData } = data;
            console.log("Received jobData in addJob:", jobData);

            const result = await this.jobpostRepo.save(jobData);
            console.log("Result saving new job post data", result);

            if (!result) {
                return { success: false, message: "Can't save data" };
            }
            return { success: true, message: "Saved successfully", job: result };
        } catch (error) {
            console.error("Error in addJob:", error);
            if (error instanceof Error) {
                throw new Error(`Error saving job post: ${error.message}`);
            } else {
                throw new Error('Unknown error occurred');
            }
        }
    }

    async getRecruiterJobs(recruiterId: string): Promise<{success: boolean, message:string, job?:IJobpost[]}> {
       try {
        const result = await this.jobpostRepo.findRecruiterJobs(recruiterId);
        console.log(result,'/............');
        
        if(!result){
            return { success: false, message:"No Job post found" }
        }
        return { success: true, message:"Job post found", job:result }
       } catch (error) {
        console.error("Error in fetching:", error);
            if (error instanceof Error) {
                throw new Error(`Error fetching job post: ${error.message}`);
            } else {
                throw new Error('Unknown error occurred');
            }
        }
    }

    async getAllJobs(): Promise<{success:boolean, job?:IJobpost[]}> {
        try {
            const response = await this.jobpostRepo.findAllJobs();
            if(!response){
                return {success: false}
            }
            return {success: true, job:response}
        } catch (error) {
            if(error instanceof Error) {
                throw new Error(`Error fetching all job post: ${error.message}`);
            }else{
                throw new Error("Unknown error occured");
            }
        }
    }

    async editJob(data: { jobData: IJobpost }): Promise<{success: boolean, message: string, job?:IJobpost}> {
        try {
            const { jobData } = data;
            const updatedJob = await this.jobpostRepo.editJob(jobData);
            if(!updatedJob){
                return {success: false, message: "Job post not updated, some crediential missing or error occured!"}
            }
            return { success: true, message:"Updated successfully", job: updatedJob };
        } catch (error) {
            console.error("Error in editJob:", error);
            throw error;
        }
    }
}

export const jobpostService = new JobPostService();
