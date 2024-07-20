export interface IAdmin {
    UserId?:string;
    imageUrl?:string[];
    description?:string;
    reportPost?:Array<{
        UserId: string;
        reason: string;
    }>
}