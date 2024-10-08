import { IApplication } from "./IApplication";

export interface IJobpost {
    jobId: string ;
    position:string;
    place:string;
    jobType:string;
    employmentType:string;
    experience:string;
    skills:string[];
    companyName:string;
    recruiterId:string;
    applications?: IApplication[];
    isBlocked:boolean;
    created_at:Date;
}