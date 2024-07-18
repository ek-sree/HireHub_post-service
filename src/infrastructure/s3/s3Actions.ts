import { Upload } from "@aws-sdk/lib-storage";
import s3 from "./s3Config"; 
import crypto from 'crypto';
import mime from 'mime-types';
import config from "../config";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function uploadFileToS3(fileBuffer: Buffer, originalname: string): Promise<string> {
    const imageName = randomImageName();
    const extension = originalname.split('.').pop() || '';
    const contentType = mime.lookup(extension) || 'application/octet-stream';

    if (!(fileBuffer instanceof Buffer)) {
        console.error("fileBuffer is not a Buffer:", fileBuffer);
        throw new Error("File buffer is not a Buffer.");
    }

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: config.bucketName,
            Key: imageName,
            Body: fileBuffer,
            ContentType: contentType,
        }
    });

    try {
        await upload.done();
        return imageName;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
}


export async function fetchFileFromS3(key: string, expiresIn = 604800): Promise<string> {
    try {
        
        const command = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: key,
        });
        const url = await getSignedUrl(s3, command, { expiresIn }); 
        
        return url;
    } catch (error) {
        console.error("Error fetching file from S3:", error);
        throw error;
    }
}


export async function deleteFileFromS3(url: string): Promise<{ success: boolean; message: string }> {
    try {
        console.log("Deleting file from S3. URL:", url);

        if (!url || typeof url !== 'string') {
            console.error("Invalid URL format:", url);
            return { success: false, message: "Invalid URL format" };
        }

        const key = url.split('/').pop()?.split('?')[0];
        if (!key) {
            console.error("Invalid URL format - key not found:", url);
            return { success: false, message: "Invalid URL format" };
        }

        const params = {
            Bucket: config.bucketName,
            Key: key
        };

        const command = new DeleteObjectCommand(params);
        const result = await s3.send(command);

        if (!result) {
            console.error("Failed to delete file from S3:", url);
            return { success: false, message: "Error occurred, can't delete file" };
        }

        console.log("Removed file successfully from S3:", url);
        return { success: true, message: "Deleted successfully" };
    } catch (error) {
        console.error("Error deleting file from S3", error);
        throw new Error("Error occurred while removing file from S3");
    }
}

