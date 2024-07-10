import { IApplication } from "../../domain/entities/IApplication";
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

    async getAllJobs({employmentType, jobType, searchValue}:{employmentType:string[], jobType:string[], searchValue:string}): Promise<{success:boolean, job?:IJobpost[]}> {
        try {
            const search = searchValue.toUpperCase()
            const response = await this.jobpostRepo.findAllJobs({employmentType, jobType, search});
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

    async applyJob(jobId:string, name:string, email:string, phone:string, resume:string): Promise<{success:boolean, message:string}>{
        try {
            const result = await this.jobpostRepo.createApplyJob({jobId,name, email,phone, resume});
            if(!result){
                return {success:false, message:"Cant apply right now"}
            }
            return {success:true, message:"Applied to job"}
        } catch (error) {
            console.error("Error in applying job:", error);
            throw error;
        }
    }

    async fetchApplication(jobId:string):Promise<{success:boolean, message:string,applications?:IApplication[]}>{
        try {
            const result = await this.jobpostRepo.findApplication(jobId)
            if(!result){
                return {success:false, message:"No application found"}
            }
            return {success:true, message:"Application found", applications:result.data}
        } catch (error) {
            console.error("Error in fetching appliactions:", error);
            throw error;
        } 
        }

    async acceptApplication(jobId:string, applicationId:string):Promise<{success:boolean, message:string}>{
        try {
            const result = await this.jobpostRepo.acceptApplication(jobId,applicationId)
            if(!result){
                return {success:false, message:"Cant accept application"}
            }
            return {success:true,message:"application status updated"}
        } catch (error) {
            console.error("Error in accpeting application:", error);
            throw error;
        } 
    }   
    
    async rejectApplication(jobId:string, applicationId:string): Promise<{success:boolean, message:string}>{
        try {
            const result = await this.jobpostRepo.rejectApplication(jobId,applicationId);
            if(!result){
                return{success:false, message:"error occured rejecting application failed"}
            }
            return {success:true, message:"Rejected application successfully"}
        } catch (error) {
            console.error("Error in rejecting application:", error);
            throw error;
        } 
    }

    async shortlistApplication(recruiterId:string): Promise<{success:boolean, message:string, candidates?:IApplication[]}>{
        try {
            const result = await this.jobpostRepo.findSelectedApplication(recruiterId);
            if(!result){
                return {success:false, message:"couldnt found accepcted applications"}
            }
            return {success:true, message:"applications found",candidates:result.datas }
        } catch (error) {
            console.error("Error fetching accepted application:", error);
            throw error;
        } 
    }
}



export const jobpostService = new JobPostService();
