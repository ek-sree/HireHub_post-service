import { PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config";
import s3 from "./s3Config";
import crypto from 'crypto';
import mime from 'mime-types';

const randomImageName = (bytes =32)=> crypto.randomBytes(bytes).toString('hex');
export async function uploadFileToS3(fileBuffer: Buffer, orginalName: string):Promise<string>{
    const imageName = randomImageName();
    const extension = orginalName.split('.').pop() || '';
    const contentType = mime.lookup(extension) || 'application/octet-stream';
    const params = {
        Bucket: config.bucketName,
        Key: imageName,
        Body: fileBuffer,
        ContentType: contentType,
    };
    
    const command = new PutObjectCommand(params);

    try {
        await s3.send(command);
        return imageName

    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
}