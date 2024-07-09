export interface IJobpost {
    jobId: string ;
    position:string;
    place:string;
    jobType:string;
    employmentType:string;
    skills:string[];
    companyName:string;
    recruiterId:string;
    applications?: { name: string, email: string, phone:string, resume:string }[];
    created_at:Date;
}