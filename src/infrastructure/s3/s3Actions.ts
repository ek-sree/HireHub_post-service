import { Upload } from "@aws-sdk/lib-storage";
import s3 from "./s3Config"; 
import crypto from 'crypto';
import mime from 'mime-types';
import config from "../config";

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
