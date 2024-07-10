import { IApplication } from "./IApplication";

export interface IJobpost {
    jobId: string ;
    position:string;
    place:string;
    jobType:string;
    employmentType:string;
    skills:string[];
    companyName:string;
    recruiterId:string;
    applications?: IApplication[];
    created_at:Date;
}