import { IJobpost } from "../entities/IJobpost";

export interface IJobpostRepository {
    save(jobpost: IJobpost): Promise<IJobpost>;
}