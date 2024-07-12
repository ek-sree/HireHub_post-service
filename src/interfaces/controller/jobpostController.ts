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

    async fetchAllJob(data:{employmentType:string[], jobType:string[], searchPlace: string}) {
        try {
            const employmentType = data.employmentType;
            const jobType = data.jobType;
            const searchValue = data.searchPlace
            console.log("emp,job data",employmentType, jobType,searchValue);
            
            const result = await jobpostService.getAllJobs({employmentType, jobType, searchValue});
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

    async applyToJob(data:{jobId:string, name:string, email:string, phone: string, resumes:string}){
        try {
            const { jobId, name, email, phone, resumes } = data; 
            
            const result = await jobpostService.applyJob(jobId,name,email,phone,resumes);
            return result;
        } catch (error) {
            console.error("Error applying job:", error);
            throw error;
        }
    }

    async fetchedApplication(data:{jobId:string, page:number, limit:number}){
        try {
            const jobId = data.jobId;
            const page = data.page;
            const limit = data.limit;
            const result = await jobpostService.fetchApplication(jobId, page, limit);
            console.log("333333",result);
            
            return result;
        } catch (error) {
            console.error("Error fetching applications:", error);
            throw error;
        }
    }

    async acceptApplication(data:{jobId:string, applicationId:string}){
        try {
            const {jobId, applicationId} = data
            const result = await jobpostService.acceptApplication(jobId, applicationId)
            return result;
        } catch (error) {
            console.error("Error accepting applications:", error);
            throw error;
        }
    }

    async rejectedApplication(data:{jobId:string, applicationId:string}){
        try {
            const {jobId, applicationId} = data;
            const result = await jobpostService.rejectApplication(jobId, applicationId);
            return result;
        } catch (error) {
            console.error("Error rejecting applications in controller:", error);
            throw error;
        }
    }

    async selectedApplications(data:{recruiterId:string}){
        try {
            
            const recruiterId = data.recruiterId;
            console.log("data controlllllerrt",recruiterId);
            const result = await jobpostService.selectApplication(recruiterId);
            return result;
        } catch (error) {
            console.error("Error fetching application in controller:", error);
            throw error;
        }
    }

    async shortlistedCadidates(data:{jobId:string}){
        try {
            const jobId = data.jobId;
            const result = await jobpostService.shorlistedApplication(jobId);
            return result;
        } catch (error) {
            console.error("Error fetching shortlisted application in controller:", error);
            throw error;
        }
    }

    async updateJobStatus(data:{jobId: string}){
        console.log("data soft delete", data);
        try {
            const jobId = data.jobId;
            const result = await jobpostService.blockUnblockJob(jobId);
            return result;
        } catch (error) {
            console.error("Error updating job status in controller:", error);
            throw error;
        }
    }
}

export const jobpostController = new JobpostController();
