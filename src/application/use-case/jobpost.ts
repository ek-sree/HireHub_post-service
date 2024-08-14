import { IApplication } from "../../domain/entities/IApplication";
import { IJobpost } from "../../domain/entities/IJobpost";
import { JobpostRepository } from "../../domain/repositories/JobpostRepository";
import { acceptJobMail, rejectJobMail } from "../../utils/jobStatusMail";


class JobPostService {
    private jobpostRepo: JobpostRepository;

    constructor() {
        this.jobpostRepo = new JobpostRepository();
    }

    async addJob(data: { jobData: IJobpost }): Promise<{ success: boolean, message: string, job?: IJobpost }> {
        try {
            const { jobData } = data;
            const result = await this.jobpostRepo.save(jobData);
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

    async getAllJobs({ employmentType, jobType, searchValue }: { employmentType: string[], jobType: string[], searchValue: string }): Promise<{ success: boolean, job?: IJobpost[] }> {
        try {
            const search = searchValue.toUpperCase();
            const response = await this.jobpostRepo.findAllJobs({ employmentType, jobType, search });
            if (!response) {
                return { success: false };
            }
            return { success: true, job: response };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching all job post: ${error.message}`);
            } else {
                throw new Error("Unknown error occurred");
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

    async applyJob(userId:string, jobId:string, name:string, email:string, phone:string, resume:string): Promise<{success:boolean, message:string}>{
        try {
            const result = await this.jobpostRepo.createApplyJob({userId, jobId,name, email,phone, resume});
            if(!result){
                return {success:false, message:"Cant apply right now"}
            }
            return {success:true, message:"Applied to job"}
        } catch (error) {
            console.error("Error in applying job:", error);
            throw error;
        }
    }

    async fetchApplication(jobId: string, page: number, limit: number): Promise<{ success: boolean, message: string, applications?: IApplication[], totalUsers?: number }> {
        try {
            const result = await this.jobpostRepo.findApplication(jobId, page, limit);
            if (!result) {
                return { success: false, message: "No application found" };
            }
    
            return { success: true, message: "Application found", applications: result.data, totalUsers: result.totalUsers };
        } catch (error) {
            console.error("Error in fetching applications:", error);
            throw error;
        }
    }

    async fetchAwaitedApplication(jobId:string, page:number, limit:number): Promise<{success:boolean, message:string, applications?:IApplication[], totalUsers?:number}>{
        try {
            const result = await this.jobpostRepo.findAwaitApplication(jobId, page, limit);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:true, message:result.message, applications:result.data, totalUsers:result.totalUsers}
        } catch (error) {
            console.error("Error in fetching awated applications:", error);
            throw error;
        }
    }
    
    async awaitApplication(jobId:string, applicationId:string):Promise<{success:boolean, message:string}>{
        try {
            const result = await this.jobpostRepo.awaitApplication(jobId, applicationId);
            if(!result || !result.success){
                return {success:result.success, message:result.message}
            }
            return {success:true, message:result.message}
        } catch (error) {
            console.error("Error in awaiting application:", error);
            throw error;
        } 
    }

    async acceptApplication(jobId:string, applicationId:string):Promise<{success:boolean, message:string}>{
        try {
            const result = await this.jobpostRepo.acceptApplication(jobId,applicationId)
            if(!result){
                return {success:false, message:"Cant accept application"}
            }
            const companyName = result.data?.companyName;
            const position = result.data?.position;
            const toMail = result.email;
            if(toMail && companyName && position){
                await acceptJobMail(toMail,companyName, position)
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
            const companyName = result.data?.companyName;
            const position = result.data?.position;
            const email = result.email;
            if(email && companyName && position){
                await rejectJobMail(email,companyName,position)
            } 
            return {success:true, message:"Rejected application successfully"}
        } catch (error) {
            console.error("Error in rejecting application:", error);
            throw error;
        } 
    }

    async selectApplication(recruiterId:string): Promise<{success:boolean, message:string, candidates?:IApplication[]}>{
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

    async shorlistedApplication(jobId:string):Promise<{success:boolean, message:string, Candidates?:IApplication[]}>{
        try {
            const result = await this.jobpostRepo.findShortListedCadidates(jobId);
            
            if(!result){
                return {success:false, message:"coundt found any data"}
            }
            return {success:true, message:"Data found", Candidates:result.data}
        } catch (error) {
            console.error("Error fetching shorlisted cadidates:", error);
            throw error;
        } 
    }

    async blockUnblockJob(jobId:string): Promise<{success:boolean, message?:string, isBlocked?:boolean}>{
        try {
            const result = await this.jobpostRepo.updateJobStatus(jobId);
            if(!result){
                return {success:false, message:"Cant change job status"}
            }
            return {success:true, message:result.message, isBlocked:result.updatedStatus}
        } catch (error) {
            console.error("Error updating job status:", error);
            throw error;
        } 
    }
}



export const jobpostService = new JobPostService();
