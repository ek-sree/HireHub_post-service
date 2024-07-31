import mongoose, { Document, Schema } from "mongoose";
import { INotification } from "../domain/entities/INotification";

export interface INotificationDocument extends INotification, Document{}

const notificationSchema: Schema = new Schema({
    userId: {
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required: true,
    },
    likedBy:{
        type:String,
        required:true
    },
    notification:{
        type:String
    }
},{timestamps:true});

export const Notification = mongoose.model<INotificationDocument>("Notification", notificationSchema)