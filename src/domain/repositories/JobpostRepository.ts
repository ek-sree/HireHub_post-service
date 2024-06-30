import { IJobpost } from "../entities/IJobpost";
import { IJobpostRepository } from "./IJobpostRepository";
import { Jobpost } from "../../model/Jobpost";

export class JobpostRepository implements IJobpostRepository {
    async save(jobpost: IJobpost): Promise<IJobpost> {
        try {
            const newJobpost = new Jobpost(jobpost);
            const savedJobpost = await newJobpost.save();
            return savedJobpost;
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error saving job post: ${err.message}`);
        }
    }
}
