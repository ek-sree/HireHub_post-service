import { IJobpost } from "../entities/IJobpost";
import { IJobpostRepository } from "./IJobpostRepository";
import { Jobpost } from "../../model/Jobpost";

export class JobpostRepository implements IJobpostRepository {
    async save(jobpost: IJobpost): Promise<IJobpost> {
        try {
            console.log("repository", jobpost);
            
            const newJobpost = new Jobpost(jobpost);
            const savedJobpost = await newJobpost.save();
            console.log("saved add new job", savedJobpost);
            
            return savedJobpost;
        } catch (error) {
            const err = error as Error;
            console.log("error saving data", err);
            throw new Error(`Error saving job post: ${err.message}`);
        }
    }

    async findRecruiterJobs(recruiterId: string | { recruiterId: string }): Promise<IJobpost[]> {
        let actualRecruiterId: string;
        
        if (typeof recruiterId === 'string') {
            actualRecruiterId = recruiterId;
        } else if (typeof recruiterId === 'object') {
            actualRecruiterId = recruiterId.recruiterId;
        } else {
            throw new Error("Invalid recruiterId type");
        }

        console.log(actualRecruiterId, "sdsdfsdffds");

        try {
            const allJobs = await Jobpost.find({ recruiterId: actualRecruiterId });
            console.log("found recruiter add job data from db", allJobs);
            
            return allJobs;
        } catch (error) {
            const err = error as Error;
            console.log("error fetching all jobs", err);
            throw new Error(`Error fetching all jobs: ${err.message}`);
        }
    }

    async findAllJobs({employmentType, jobType, search}:{employmentType:string[],jobType:string[], search:string}): Promise<IJobpost[]> {
        try {
            console.log("ssshhooww",employmentType, jobType);
            const query: any = {};
        
     
            if (employmentType && employmentType.length > 0) {
                query.employmentType = { $in: employmentType };
            }
    
            if (jobType && jobType.length > 0) {
                query.jobType = { $in: jobType };
            }
            
            
        if (search) {
            query.place = { $regex: new RegExp(search, 'i') };
        }

            const data = await Jobpost.find(query);
            return data
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching all jobs",err);
            throw new Error(`Error fetching all jobs`);
        }
    } 

    async editJob(jobData: IJobpost): Promise<IJobpost | null> {
        try {
            const { jobId } = jobData;
            console.log("id job", jobId);
            if(!jobId) {
                throw new Error("Hob id is not found");
            }

            const updatedJobpost = await Jobpost.findByIdAndUpdate({_id:jobId}, jobData, {new:true});
            return updatedJobpost;
            
        } catch (error) {
            const err = error as Error;
            console.log("Error editing jobs",err);
            throw new Error(`Error fetching all jobs`);
        }
    }
}
