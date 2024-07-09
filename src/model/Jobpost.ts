import mongoose, { Document, Schema } from "mongoose";
import { IJobpost } from "../domain/entities/IJobpost";

export interface IJobpostDocument extends IJobpost, Document {}

const jobpostSchema: Schema = new Schema({
    position: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    jobType: {
        type: [String],
        required: true
    },
    employmentType: {
        type: [String],
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    recruiterId: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        require: true
    },
    applications: {
        type: [{
            name: String,
            email: String,
            phone: String,
            resume: String
        }],
        default: [],
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export const Jobpost = mongoose.model<IJobpostDocument>('Jobpost', jobpostSchema);
