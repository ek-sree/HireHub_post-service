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
    experience:{
      type:String,
      require:true
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
          name: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true
          },
          phone: {
            type: String,
            required: true
          },
          resume: {
            type: String,
            required: true
          },
          status: {
            type: String,
            default: "pending",
            enum: ["pending", "accepted", "rejected"]
          },
          created_at: {
            type:Date, 
            default: Date.now
          }
        }],
        default: [],

      },
      isBlocked:{
        type:Boolean,
        default:false
      },
    created_at: {
        type: Date,
        required: true,
        default: () => Date.now()
    }
});

export const Jobpost = mongoose.model<IJobpostDocument>('Jobpost', jobpostSchema);
