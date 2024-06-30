import { IJobpost } from "../../domain/entities/IJobpost";
import { JobpostRepository } from "../../domain/repositories/JobpostRepository";

class JobPostService {
    private jobpostRepo: JobpostRepository;

    constructor() {
        this.jobpostRepo = new JobpostRepository();
    }

    async addJob(data: IJobpost): Promise<{ success: boolean, message: string, job?: IJobpost }> {
        try {
            const { position, place, jobType, employmentType, skills } = data;

            if (!position || !place || !jobType.length || !employmentType.length || !skills.length) {
                throw new Error("Please fill in all fields");
            }

            const jobData = {
                position,
                place,
                jobType,
                employmentType,
                skills,
                created_at: new Date(),
            };

            const result = await this.jobpostRepo.save(jobData);
            console.log("result saving newjobpost data", result);
            
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
}

export const jobpostService = new JobPostService();
