import { IJobpost } from "../entities/IJobpost";
import { IJobpostRepository } from "./IJobpostRepository";
import { Jobpost } from "../../model/Jobpost";
import { IApplication } from "../entities/IApplication";
import mongoose from "mongoose";

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


        try {
            const allJobs = await Jobpost.find({ recruiterId: actualRecruiterId }).sort({ created_at: -1 });;
            
            return allJobs;
        } catch (error) {
            const err = error as Error;
            console.log("error fetching all jobs", err);
            throw new Error(`Error fetching all jobs: ${err.message}`);
        }
    }

    async findAllJobs({employmentType, jobType, search}:{employmentType:string[],jobType:string[], search:string}): Promise<IJobpost[]> {
        try {
            console.log("search",search);
            
            const query: any = { isBlocked: false };
     
            if (employmentType && employmentType.length > 0) {
                query.employmentType = { $in: employmentType };
            }
    
            if (jobType && jobType.length > 0) {
                query.jobType = { $in: jobType };
            }
            
            
        if (search) {
            query.place = { $regex: new RegExp(search, 'i') };
        }

            const data = await Jobpost.find(query).sort({ created_at: -1 });;
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

    async createApplyJob({ jobId, name, email, phone, resume }: { jobId: string, name: string, email: string, phone: string, resume: string }): Promise<{ success: boolean, message: string }> {
        try {
            console.log("job Id", jobId);
            
            const job = await Jobpost.findById(jobId);
            if (!job) {
                return { success: false, message: "Can't find job" };
            }
            
            job.applications = job.applications || [];
            job.applications.push({
                name: name,
                email: email,
                phone: phone,
                resume: resume,
                status:"pending",
                created_at:new Date()
            });

            await job.save();
            return { success: true, message: "Application submitted successfully" };
        } catch (error) {
            const err = error as Error;
            console.log("Error apply jobs",err);
            throw new Error(`Error applying jobs`);
        }
    }

    async findApplication(jobId: string, page: number, limit: number): Promise<{ success: boolean, message: string, data?: IApplication[], totalUsers?: number }> {
        try {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                console.log(`Invalid jobId format: ${jobId}`);
                return { success: false, message: "Invalid jobId format" };
            }
    
            const skip = (page - 1) * limit;
            const job = await Jobpost.findOne({ _id: new mongoose.Types.ObjectId(jobId) });
    
            if (!job) {
                return { success: false, message: "No job found" };
            }
    
            const pendingApplications = job.applications?.filter(app => app.status === 'pending') || [];
            const totalUsers = pendingApplications.length;
    
            const paginatedApplications = pendingApplications.slice(skip, skip + limit);
    
            return { success: true, message: "Got application lists", data: paginatedApplications, totalUsers };
        } catch (error) {
            const err = error as Error;
            console.log("Error showing application", err);
            throw new Error(`Error viewing applications: ${err.message}`);
        }
    }
    

    async acceptApplication(jobId:string, applicationId:string): Promise<{success:boolean, message:string, data?:IJobpost, email?:string}>{
        try {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                console.log(`Invalid jobId format: ${jobId}`);
                return { success: false, message: "Invalid jobId format" };
            }
            const job = await Jobpost.findOne({_id: new mongoose.Types.ObjectId(jobId)});
            if(!job){
                return {success: false, message:"cant find the job"}
            }
            const application = job.applications?.find(app=>app._id.toString() === applicationId)
            if(!application){
                return {success:false, message:"Cant find the application"}
            }
            application.status = 'accepted';
            const email = application.email;
            await job.save();
            return {success:true, message:"status changed", data:job,email}
        } catch (error) {
            const err = error as Error;
            console.log("Error accepting application", err);
            throw new Error(`Error accepting applications: ${err.message}`);
        }
    }

    async rejectApplication(jobId:string, applicationId:string): Promise<{success:boolean, message:string, data?:IJobpost, email?:string}>{
        try {
            if(!mongoose.Types.ObjectId.isValid(jobId)){
                console.log(`Invalid jobId format: ${jobId}`);
                return {success:false,message:"Invalid jobId formate"}
            }
            const job = await Jobpost.findOne({_id: new mongoose.Types.ObjectId(jobId)});
            if(!job){
                return {success:false, message:"no job found"}
            }
            
            const application = job.applications?.find(app=>app._id.toString()===applicationId);
            if(!application){
                return {success:false, message:"No application found"}
            }
            
            application.status = 'rejected';
            const email = application.email;
            await job.save();
            
            return {success:true, message:"rejected application",data:job, email}
        } catch (error) {
            const err = error as Error;
            console.log("Error rejecting application", err);
            throw new Error(`Error rejecting applications: ${err.message}`);
        }
    }

    async findSelectedApplication(recruiterId: string): Promise<{ success: boolean, message: string, datas?: IApplication[] }> {
        try {
            const jobs = await Jobpost.find({ recruiterId: recruiterId });
            if (!jobs) {
                return { success: false, message: "No job found" };
            }
    
            const acceptedApplications: IApplication[] = [];
            const uniqueEmails = new Set<string>();
    
            jobs.forEach(job => {
                const accepted = job.applications?.filter(app => app.status === 'accepted');
                if (accepted && accepted.length > 0) {
                    accepted.forEach(app => {
                        if (!uniqueEmails.has(app.email)) {
                            uniqueEmails.add(app.email);
                            acceptedApplications.push(app);
                        }
                    });
                }
            });
    
            console.log("applica", acceptedApplications);
    
            return { success: true, message: "found applications", datas: acceptedApplications };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching selected applications", err);
            throw new Error(`Error fetching selected applications: ${err.message}`);
        }
    }
    
    async findShortListedCadidates(jobId:string):Promise<{success:boolean, message:string, data?:IApplication[]}>{
        try {
            if(!mongoose.Types.ObjectId.isValid(jobId)){
                console.log(`Invalid jobId format: ${jobId}`);
                return {success:false,message:"Invalid jobId formate"}
            }
            const job = await Jobpost.findOne({_id:new mongoose.Types.ObjectId(jobId)})
            if(!jobId){
                return { success: false, message: "No job found" };
            }
            const cadidates = job?.applications?.filter((app:IApplication)=>app.status === "accepted")
            console.log("cadidates",cadidates);
            return {success:true, message:"Cadidates fetched",data:cadidates}
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching selected job applications", err);
            throw new Error(`Error fetching selected job applications: ${err.message}`);
        }
    }

    async updateJobStatus(jobId:string):Promise<{success:boolean, message:string, updatedStatus?:boolean}>{
        try {
            if(!mongoose.Types.ObjectId.isValid(jobId)){
                console.log(`Invalid jobId format: ${jobId}`);
                return {success:false,message:"Invalid jobId formate"}
            }
        
            const job = await Jobpost.findOne({_id:new mongoose.Types.ObjectId(jobId)});
            if(!job){
                return {success:false, message:"No job found"}
            }
            job.isBlocked = !job.isBlocked
            await job.save();
            return {success:true, message:`${job.isBlocked?"Blocked" :"Unblocked"} now`, updatedStatus:job.isBlocked}
        } catch (error) {
            const err = error as Error;
            console.log("Error updating jobs", err);
            throw new Error(`Error updating jobs: ${err.message}`);
        }
    }
}
